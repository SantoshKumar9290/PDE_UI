import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap';
import styles from '../../styles/pages/Mixins.module.scss'
import TableInputText from '../../src/components/TableInputText';
import TableText from '../../src/components/TableText';
import TableDropdown from '../../src/components/TableDrpDown';
import TableDropdownSRO from '../../src/components/TableDropdownSRO';
import Table from 'react-bootstrap/Table';
import { useRouter } from 'next/router';
import { Loading } from "../../src/redux/hooks";
import { useAppSelector, useAppDispatch } from '../../src/redux/hooks';
import { useGetDistrictList, useSROOfficeList, UseGetVillageCode, UseGetHabitation, GetCDMAData, UseGetPPCheck, UseGetVgForPpAndMV, UseDutyCalculator, UselocalBodies, getLinkedSroDetails, UseMVAMVCalculator, Mvadata, mvAssitanceReport, previewPDF, UseSaveMVrequestDetails, GetPaymentStatus, UpdatePaymentMVRequest } from '../../src/axios';
import { SavePropertyDetails } from '../../src/redux/formSlice';
import { PopupAction } from '../../src/redux/commonSlice';
import Image from 'next/image';
import Head from 'next/head';
import { CallingAxios, DateFormator, DoorNOIdentifier, KeepLoggedIn, MasterCodeIdentifier, ShowMessagePopup, TotalMarketValueCalculator } from '../../src/GenericFunctions';
import MasterData from '../../src/MasterData';
import TableSelectDate from '../../src/components/TableSelectDate';
import moment from 'moment';
import Popstyles from '../../styles/components/PopupAlert.module.scss';
import { ImCross } from 'react-icons/im';
import Modal from 'react-bootstrap/Modal';
import TableInputRadio from '../../src/components/TableInputRadio';


const DropdownOptions: any = {
    DropdownOptionsList: ["A", "B"],
    UnitList: ["SQ. YARD [చదరపు గజం]"],
    StrUnitList: ["SQ. FEET [చదరపు అడుగులు]"],
    FloorList: ["Ground", "Cellar", "Foundation", "Mezzanaine floor", "Parking"],
    StructureTypeList: ["RCC [కాంక్రీటు ఫై కప్పు]", "MUD ROOF [మట్టి పైకప్పు]", "ROOF WITH PALM/GRASS ETC. WITH BRICK WALL [ఇటుక గోడతో/ గడ్డి మొదలైన వాటితో పైకప్పు]", "ROOF WITH PALM/GRASS ETC. WITHOUT BRICK WALL [ఇటుక గోడ లేకుండా/ గడ్డి మొదలైన వాటితో పైకప్పు]", "ACC/M.T/PAN TILE/ SHABAD STONE/ZN SHEET [ACC / M.T / పాన్ టైల్ / షాబాద్ స్టోన్ / జింక్ షీట్]",
        "ACC/TIN/ZN SHEET ETC WITH WALLS ABOVE 10 FT [ACC / TIN / జింక్ షీట్ మొదలైనవి 10 అడుగుల ఎత్తు కంటే ఎక్కువ గోడలతో]", "POULTRY FARMS [కోళ్ల ఫారం]", "APARTMENT WITHOUT COMMONWALLS ATLEAST 3 SIDES [కనీసం 3 వైపులా కామన్ వాల్స్ లేని అపార్ట్ మెంట్]"],
    ConsList: ["UP TO FOUNDATION LEVEL [పునాది స్థాయి వరకు]", "UPTO LINTEL LEVEL [లింటెల్ స్థాయి వరకు]", "UP TO SLAB LEVEL/ROOF [స్లాబ్ స్థాయి/పైకప్పు వరకు]", "SEMI-FINISHED [సగం పూర్తయింది]", "FINISHED [పూర్తయింది]"],
    BooknoList: ["1", "2", "3"],
    TypeofProperty: ["FLAT [ఫ్లాట్]", "HOUSE [ఇల్లు]"]
}

const DropdownList = {
    LocalBodyTypesList: [{ localBodyType: 'MUNICIPAL CORPORATION [మున్సిపల్ కార్పొరేషన్]', localBodyCode: "1" }, { localBodyType: 'SPL./SELECTION GRADE MUNICIPALITY [స్పెషల్ సెలక్షన్ గ్రేడ్ మున్సిపాలిటీ]', localBodyCode: "2" }, { localBodyType: 'OTHER MUNICIPALITY/NOTIFIED AREA [ఇతర మునిసిపాలిటీ / నోటిఫైడ్ ఏరియా]', localBodyCode: "3" },
    { localBodyType: 'MAJOR GRAM PANCHAYAT [మేజర్ గ్రామ పంచాయితీ]', localBodyCode: "5" }, { localBodyType: 'Cantonment Board [కంటోన్మెంట్ బోర్డు]', localBodyCode: "6" }, { localBodyType: 'GRADE/OTHER MUNICIPALITY UNDER UA [అర్బన్ అగ్లామరేషన్ లోని గ్రేడ్ 1 మున్సిపాలిటీ మరియు ఇతర మున్సిపాలిటీ]', localBodyCode: "7" }, { localBodyType: 'MAJOR GRAM PANCHAYATH UNDER UA [అర్బన్ అగ్లామరేషన్ లోని మేజర్ గ్రామ పంచాయతీ]', localBodyCode: "8" }],
    LandUseList: []
}

const UnitRateTypes = {
    RateList: [{ label: 'Non-Agriculture Rates' }, { label: 'Agriculture Rates' }],
}

const PropertyDetailsPage_B = () => {
    const router = useRouter();
    const dispatch = useAppDispatch()
    const [generateStructure, setGenerateStructure] = useState({ showStructure: false, allowEdit: true });
    const [DistrictList, setDistrictList] = useState([]);
    const [IsFlat, setIsFlat] = useState(false);
    const [SROOfficeList, setSROOfficeList] = useState([]);
    let initialPropertyDetails = useAppSelector(state => state.form.PropertyDetails);
    const [PropertyDetails, setPropertyDetails] = useState<any>(initialPropertyDetails);
    let [floorList, setFloorList] = useState<any>(DropdownOptions.floorList);
    const [Structure, setStructure] = useState({ floorNo: "", structureType: "", plinth: "", plinthUnit: "", stageOfCons: "", age: "" });
    const [LinkDocument, setLinkDocument] = useState({ linkDocNo: "", regYear: "", bookNo: "", scheduleNo: "", district: "", sroOffice: "", sroCode: "" })
    const [VillageList, setVillageList] = useState([]);
    const [VillageCodeList, setVillageCodeList] = useState([]);
    const [HabitationList, setHabitationList] = useState([]);
    const [HabitationCodeList, setHabitationCodeList] = useState([]);
    const [selectedcdmaDetails, setSelectedcdmaDetails] = useState({})
    const [CDMADetails, setCDMADetails] = useState<any>({});
    const [ApplicationDetails, setApplicationDetails] = useState<any>({ applicationId: "", executent: [], claimant: [] });
    const [AllowProceed, setAllowProceed] = useState(false);
    const [RequiredFields, setRequiredFields] = useState({ ptinNo: false, plotNo: false, doorNo: true })
    const [reqNo, setReqNo] = useState()
    const [marketvaluecal, setMarketvaluecal] = useState([])
    const [showdata, setshowdata] = useState(false)
    const [payData, setPayData] = useState<any>({})
    const [show, setShow] = useState(false);
    const [showInputs, setShowInputs] = useState(false);
    let LoginDetails: any = useAppSelector(state => state.login.loginDetails);
    const [Staticdoornumber, setStaticdoornumber] = useState("");

    const [IsViewMode, setIsViewMode] = useState(false);
    const [rentMonthOrYear, setRentMonthOrYear] = useState<any>(["Monthly", "Yearly"])
    const [localBodyTypeList, setLocalBodyTypeList] = useState([]);
    const [localBodyNameList, setLocalBodyNameList] = useState([]);
    const [CalculatedDutyFee, setCalculatedDutyFee] = useState({ TRAN_MAJ_CODE: "", TRAN_MIN_CODE: "", sroCode: "", amount: "", rf_p: "0", td_p: "0", sd_p: "0", marketValue: "0" })
    const [wbVgCode, setwbVegCode] = useState<any>("");
    const [maxDate, setMaxDate] = useState(Date);
    const [rentalRowData, setrentalRowData] = useState([]);
    const [ppbyPass, setPpByPass] = useState<any>({ status: false, type: "", value: "" })
    const [mLinkDocs, setmLinkDocs] = useState<any>(false);
    let [leaseData, setLeaseData] = useState<any>({ wef: "", lPeriod: "", advance: "", adjOrNonAdj: "", valueOfImp: "", muncipalTax: "", rentalDetails: [] })
    const ShowAlert = (type, message) => { dispatch(PopupAction({ enable: true, type: type, message: message })); }

    const [selection, setSelection] = useState('');
    let initialGetstartedDetails = useAppSelector(state => state.form.GetstartedDetails);
    const [GetstartedDetails, setGetstartedDetails] = useState(initialGetstartedDetails);    

    const handleSelection = (e) => {
        setSelection(e.target.value);
    };

    const redirectToPage = (location: string) => {
        router.push({
            pathname: location,
        })
    }

    const handlesetclose = () => {
        redirectToPage('/MVassistance/MvaLandingpage');
    }

    const handleShow = () => setShow(true);

    const handleClose = () => {
        setShow(false);
        const PropertyDetails = {
            amount: "",
            executionDate: "",
            stampPaperValue: "",
            stampPurchaseDate: "",
            noOfStampPapers: 0,
            localBodyType: "",
            localBodyTitle: "",
            localBodyName: "",
            district: "",
            sroOffice: "",
            propertyType: "",
            ExtentList: [],
            schedulePropertyType: "",
            landUse: "",
            village: "",
            locality: "",
            ward: "",
            block: "",
            doorNo: "",
            plotNo: "",
            survayNo: "",
            lpmNo: "",
            ptinNo: "",
            extent: "",
            khataNum: "",
            extentUnit: "",
            units: "",
            layoutNo: "",
            layoutName: "",
            appartmentName: "",
            undividedShare: "",
            undividedShareUnit: "",
            flatNo: "",
            flatNorthBoundry: "",
            flatSouthBoundry: "",
            flatEastBoundry: "",
            flatWestBoundry: "",
            structure: [],
            totalFloors: "",
            northBoundry: "",
            southBoundry: "",
            eastBoundry: "",
            westBoundry: "",
            isDocDetailsLinked: "",
            landtype: "",
            isMarketValue: "",
            LinkedDocDetails: []
        }
        dispatch(SavePropertyDetails(PropertyDetails));
        setshowdata(true);
    };

    const onGenerateStructureClick = (value: string) => {
        if (value == "edit") {
            if (PropertyDetails.totalFloors) {
                if (PropertyDetails.totalFloors >= 6 && PropertyDetails.schedulePropertyType == "HOUSE [ఇల్లు]") { return ShowMessagePopup(false, "Max Number of Floors Allowed For House is 5.", ""); }
                if (PropertyDetails.totalFloors >= 100) { return ShowMessagePopup(false, "Max Number of Floors Allowed For Flat is 99.", ""); }
                let num = [];
                let i = 1;
                for (i; i < PropertyDetails.totalFloors; i++) {
                    num.push("Floor No -" + i);
                }
                DropdownOptions.FloorList.map(x => num.push(x));
                setFloorList(num);
                setGenerateStructure({ ...generateStructure, showStructure: true, allowEdit: false });
            }
            else {
                ShowMessagePopup(false, "Please Enter Total Number of Floors", "");
            }
        }
        else {
            setPropertyDetails({ ...PropertyDetails, totalFloors: "", structure: [] });
            setGenerateStructure({ ...generateStructure, showStructure: false, allowEdit: true });
        }
    };

    const MVCalculator = async () => {
        let landExtent: any = PropertyDetails.schedulePropertyType == "FLAT [ఫ్లాట్]" ? Number(PropertyDetails.undividedShare) : Number(PropertyDetails.extent);
        let vgCode = wbVgCode != "" ? wbVgCode : PropertyDetails.villageCode;
        let [hab, rest] = PropertyDetails.habitation.split("(");
        let nature_code: any = MasterCodeIdentifier("landUse", PropertyDetails.landUse);
        nature_code = nature_code == "09" ? "01" : nature_code == "11" ? "02" : nature_code;
        let strs: any = ""
        for (let i of PropertyDetails.structure) {
            let frNo = i.floorNo.includes('-') ? i.floorNo.split('-')[1] : MasterCodeIdentifier("floorNo", i.floorNo);
            let stru_type = i.structureType ? MasterCodeIdentifier("structureType", i.structureType) : "";
            let plinth = i.plinth ? Number(i.plinth) : 0;
            let plinthUnit = "F";
            let stageOfCons: any;
            MasterData.StageOfCons.map((x) => {
                if (x.desc === i.stageOfCons)
                    stageOfCons = x.code;
            })
            let age = i.age ? Number(i.age) : 0;
            if (frNo && String(frNo).length === 1) {
                frNo = '0' + frNo;
            }
            if (strs == "") {
                strs = `${frNo},${stru_type},${plinth},${plinthUnit},${stageOfCons},${age}#`
            } else {
                strs = strs + `${frNo},${stru_type},${plinth},${plinthUnit},${stageOfCons},${age}#`
            }

        }
        let data: any = {
            floor_no: PropertyDetails.structure && PropertyDetails.structure.length ? PropertyDetails.structure[0].floorNo.includes('-') ? PropertyDetails.structure[0].floorNo.split('-')[1] : MasterCodeIdentifier("floorNo", PropertyDetails.structure[0].floorNo) : "",
            stru_type: PropertyDetails.structure && PropertyDetails.structure.length ? MasterCodeIdentifier("structureType", PropertyDetails.structure[0].structureType) : "",
            plinth: PropertyDetails.structure && PropertyDetails.structure.length ? Number(PropertyDetails.structure[0].plinth) : 0,
            plinth_unit: PropertyDetails.structure && PropertyDetails.structure.length ? "F" : "", // PropertyDetails.structure[0].plinthUnit == "SQ. FEET [చదరపు అడుగులు]" ? "F" : "Y",
            stage: PropertyDetails.structure && PropertyDetails.structure.length ? MasterCodeIdentifier("StageOfCons", Number(PropertyDetails.structure[0].stageOfCons)) : 0,
            age: PropertyDetails.structure && PropertyDetails.structure.length ? Number(PropertyDetails.structure[0].age) : 0,
            str_type: strs,
            sroCode: Number(PropertyDetails.sroCode),
            vill_cd: vgCode,
            locality: PropertyDetails.loc,
            habitation: "",
            strType: PropertyDetails.strType,
            wno: PropertyDetails?.ward && (PropertyDetails.ward + (PropertyDetails.biward && PropertyDetails.biward != 0 ? '/' + PropertyDetails.biward : '')),
            bno: PropertyDetails?.block && (PropertyDetails.block + (PropertyDetails.biblock && PropertyDetails.biblock != 0 ? '/' + PropertyDetails.biblock : '')),
            house_no: DoorNOIdentifier(PropertyDetails.doorNo),
            nearby_boundaries: "",
            surveyno: PropertyDetails.survayNo,
            nature_use: nature_code,
            land_extent: landExtent,
            land_unit: 'Y',
            total_floor: Number(PropertyDetails.totalFloors),
            property_type: (PropertyDetails.landUse == "URBAN VACANT LAND(RESIDENTIAL)(R) [పట్టణ ఖాళీ స్తలము(నివాసం (R )]" || PropertyDetails.landUse == "URBAN VACANT LAND(COMMERCIAL)(R) [పట్టణ ఖాళీ స్తలము(వ్యాపారపరమైన )(R)]") ? "VACANT" : PropertyDetails.schedulePropertyType == "FLAT [ఫ్లాట్]" ? "APARTMENT" : "OTHER",
            property_nature: "URBAN",
            localbody: PropertyDetails.localBodyCode
        }
        let result = await CallingAxios(UseMVAMVCalculator(data, "urban"));
        if (result?.status) {
            return result.data
        } else {
            return { marketValue: 0 }
        }
    }

    useEffect(() => {
        if (KeepLoggedIn()) {
            let data: any = localStorage.getItem("Property");
            if (data == "" || data == undefined) {
                ShowMessagePopup(false, "Invalid Access", "/");
            }
            else {
                data = JSON.parse(data);
                setApplicationDetails(data);
                if (DistrictList.length == 0) {
                    GetDistrictList();
                }
                if (VillageCodeList.length == 0) {
                    GetVillageCode();
                }

                let data2: any = localStorage.getItem("Property");
                if (data2 == "" || data == undefined) {
                    ShowMessagePopup(false, "Invalid Access", "/");
                }
                else {
                    data2 = JSON.parse(data2);
                    let TempDetails = { ...data2 };
                    if (data2.mode == "add") {
                        TempDetails = { ...data2, isPropProhibited: false, isPrProhibitedSurveyNO: "", isPrProhibitedDoorNO: "" }
                    }
                    dispatch(SavePropertyDetails(data2));
                    GetVgForPPandMv(data2.villageCode)

                    if (data2.VILLCD) {
                        setwbVegCode(data2.VILLCD);
                    }
                    data2.schedulePropertyType == "FLAT [ఫ్లాట్]" ? setIsFlat(true) : setIsFlat(false);
                    if (data2.doorNo != "") {
                        setAllowProceed(true);
                    }
                    if (data2.landUse == "URBAN VACANT LAND(RESIDENTIAL)(R) [పట్టణ ఖాళీ స్తలము(నివాసం (R )]" || data2.landUse == "URBAN VACANT LAND(COMMERCIAL)(R) [పట్టణ ఖాళీ స్తలము(వ్యాపారపరమైన )(R)]") {
                        setRequiredFields({ ...RequiredFields, plotNo: true, ptinNo: false })
                    }
                    else {
                        setRequiredFields({ ...RequiredFields, plotNo: false, ptinNo: true })
                    }
                    if (data2.structure && data2.structure.length) {
                        setGenerateStructure({ ...generateStructure, showStructure: true, allowEdit: false });
                    }
                    if (data2.mode == "view") {
                        setIsViewMode(true);
                    } else {
                        setIsViewMode(false);
                    }
                    if (data2.habitationCode) {
                        GetLocalBodiesData(data2.habitationCode)
                    }
                    if (data2.localBodyType) {
                        let value = DropdownList.LocalBodyTypesList.find(x => x.localBodyCode == data2.localBodyType);
                        if (value) {
                            TempDetails = { ...TempDetails, localBodyType: value.localBodyType }
                        }

                    }
                    if (data2.villageCode && HabitationCodeList.length == 0) {
                        GetHabitation(data2.villageCode, TempDetails);
                    }
                    if (data2.mode === 'add') {
                        TempDetails = { ...TempDetails, LinkedDocDetails: [] }
                    }
                    if (!TempDetails.urban_selling_extent) {
                        TempDetails.urban_selling_extent = "FULL"
                    }
                    if(!TempDetails.strType){
                        TempDetails.strType = "Industrial"
                    }
                    setPropertyDetails(TempDetails);
                    if (data2.mode === "edit") {
                        GetVgForPPandMv(data2.villageCode)
                    }
                    // if (data2.cdma_details) {
                    //     setCDMADetails(JSON.parse(data2.cdma_details));
                    //     let cdma = {
                    //         propertyAddress: data2.cdma_details.propertyAddress,
                    //         localityName: data2.cdma_details.boundaryDetails?.localityName,
                    //         aadharNumber: data2.cdma_details.ownerNames[0].aadhaarNumber,
                    //         ownerName: data2.cdma_details.ownerNames[0].ownerName,
                    //         mobileNumber: data2.cdma_details.ownerNames[0].mobileNumber,
                    //         emailId: data2.cdma_details.ownerNames[0].emailId,
                    //         siteExtentUnit: data2.cdma_details.siteExtent + ' ' + data2.cdma_details.siteExtentUnit,
                    //         taxDue: data2.cdma_details.propertyDetails?.taxDue,
                    //         houseNo: data2.cdma_details.houseNo
                    //     }
                    //     setSelectedcdmaDetails({ ...cdma })
                    // }
                }
                if ((data?.documentNature?.TRAN_MAJ_CODE == "05" && (data?.documentNature?.TRAN_MIN_CODE == "03" || data?.documentNature?.TRAN_MIN_CODE == "04" || data?.documentNature?.TRAN_MIN_CODE == "05" || data?.documentNature?.TRAN_MIN_CODE == "09")) || (data?.documentNature?.TRAN_MAJ_CODE == "08" && (data?.documentNature?.TRAN_MIN_CODE == "01" || data?.documentNature?.TRAN_MIN_CODE == "02" || data?.documentNature?.TRAN_MIN_CODE == "03" || data?.documentNature?.TRAN_MIN_CODE == "04"))
                    || (data?.documentNature?.TRAN_MAJ_CODE == "35" && data?.documentNature?.TRAN_MIN_CODE == "01") || (data?.documentNature?.TRAN_MAJ_CODE == "36" && ApplicationDetails?.documentNature?.TRAN_MIN_CODE == "01")) {
                    setmLinkDocs(true);
                } else {
                    setmLinkDocs(false);
                }
            }
        } else { ShowMessagePopup(false, "Invalid Access", "/"); }
    }, []);


    useEffect(() => {
        if (ApplicationDetails.registrationType && ApplicationDetails.documentNature && ApplicationDetails.sroCode && ApplicationDetails.amount) {
            let currentMarketValue = TotalMarketValueCalculator(ApplicationDetails)
            let data = {
                "tmaj_code": ApplicationDetails.registrationType.TRAN_MAJ_CODE,
                "tmin_code": ApplicationDetails.documentNature.TRAN_MIN_CODE,
                "sroNumber": ApplicationDetails.sroCode,
                "local_body": 3,
                "flat_nonflat": "N",
                "marketValue": currentMarketValue,
                "finalTaxbleValue": ApplicationDetails.amount > currentMarketValue ? ApplicationDetails.amount : currentMarketValue,
                "con_value": ApplicationDetails.amount,
                "adv_amount": 0
            }
        }
        if ((PropertyDetails.mode == "edit" || PropertyDetails.mode == "view") && ApplicationDetails?.documentNature?.TRAN_MAJ_CODE == "07") {
            const rentadetails = PropertyDetails?.leaseDetails?.rentalDetails;
            const leaseData = PropertyDetails?.leaseDetails;
            setrentalRowData(rentadetails);
            setLeaseData({ ...leaseData, wef: DateFormator(leaseData.wef, 'YYYY-MM-DD') })
        }
    }, [ApplicationDetails])

    useEffect(() => {
        if (PropertyDetails.mode != "edit")
            setrentalRowData(rentalRowData);
    }, [rentalRowData])

    const DutyFeeCalculator = async (data: any) => {
        let result = await CallingAxios(UseDutyCalculator(data));
        let mvddata = data;
        if (result.status) {
            let res = { ...CalculatedDutyFee, TRAN_MAJ_CODE: PropertyDetails.registrationType.TRAN_MAJ_CODE, TRAN_MIN_CODE: PropertyDetails.documentNature.TRAN_MIN_CODE, sroCode: PropertyDetails.sroCode, amount: PropertyDetails.amount, sd_p: result.data.sd_p, td_p: result.data.td_p, rf_p: result.data.rf_p };
            setCalculatedDutyFee(res);
            let nature_code: any = MasterCodeIdentifier("landUse", PropertyDetails.landUse);
            let mvdata = {
                "REQ_NO": '',
                "SR_CODE": PropertyDetails.sroCode,
                "TRAN_MAJ_CODE": PropertyDetails.documentNature.TRAN_MAJ_CODE,
                "TRAN_MIN_CODE": PropertyDetails.documentNature.TRAN_MIN_CODE,
                "LOCAL_BODY": PropertyDetails.localBodyCode,
                "WARD_NO": PropertyDetails.ward,
                "BLOCK_NO": PropertyDetails.block,
                "LOC_CODE": 789,
                "LOC_HAB_NAME": PropertyDetails.habitation,
                "ROAD_CODE": 123,
                "NEW_HOUSE_NO": PropertyDetails.doorNo,
                "OLD_HOUSE_NO": "",
                "VILLAGE_CODE": PropertyDetails.villageCode,
                "HAB_CODE": PropertyDetails.habitationCode,
                "SURVEY_NO": PropertyDetails.survayNo === "" ? PropertyDetails.lpmNo ? PropertyDetails.lpmNo :'' : PropertyDetails.survayNo,
                "FLAT_NONFLAT": PropertyDetails.schedulePropertyType == "FLAT [ఫ్లాట్]" ? "Y" : "N",
                "TOT_FLOOR": Number(PropertyDetails.totalFloors),
                "EXTENT": mvddata.ext_Rate,
                "UNIT": PropertyDetails.extentUnit == "SQ. FEET [చదరపు అడుగులు]" ? "F" : "Y",
                "NATURE_USE": nature_code,
                "MARKET_VALUE": mvddata.marketValue,
                "SD": result.data.sd_p,
                "TD": result.data.td_p,
                "RF": result.data.rf_p,
                "LEASE_DATE": "",
                "LEASE_PERIOD": '',
                "LEASE_ADV": '',
                "TYPE_OF_ADV": "",
                "LEASE_IMP": '',
                "LEASE_TAX": '',
                "TOT_RENT": '',
                "AVG_ANN_RENT": '',
                "LAND_COST": mvddata.LAND_CST,
                "STRU_COST": mvddata.STRU_CST,
                "EXTENT_RATE": mvddata.ext_Rate,
                "ENT_DATE": '',
                "EAST": PropertyDetails.eastBoundry.toUpperCase(),
                "WEST": PropertyDetails.westBoundry.toUpperCase(),
                "NORTH": PropertyDetails.northBoundry.toUpperCase(),
                "SOUTH": PropertyDetails.southBoundry.toUpperCase(),
                "CHARG_ITEM_CD": "",
                "PLOT_NO": PropertyDetails.plotNo,
                "VILLAGE_NAME": PropertyDetails.village,
                "AG_NAME": "",
                "COPY_NO": '',
                "FEE": '',
                "NEW_OLD": "",
                "MVA_YEAR": new Date().getFullYear(),
                "CONS_VALUE": data.con_value,
                "JURISDICTION": '',
                "PROPERTY_BASED": "",
                "OPERATOR": "",
                "PROPERTY_TYPE": PropertyDetails.landUseCode,
                "BI_WARD": PropertyDetails.biward || "",
                "BI_BLOCK": PropertyDetails.biblock || "",
                "PROHIBITED_PROPERTY": (PropertyDetails && PropertyDetails.isPrProhibitedDoorNO ? 'Y' : PropertyDetails.isPrProhibitedSurveyNO ? 'Y' : ""),
                "EXTENT_VALUE": PropertyDetails.schedulePropertyType == "FLAT [ఫ్లాట్]" ? Number(PropertyDetails.undividedShare) : Number(PropertyDetails.extent),
                "STRUCTURE" : JSON.stringify(PropertyDetails.structure),

            }
            let mvresult: any = await CallingAxios(Mvadata(mvdata));
            let reqdata = mvresult.data;

            if (reqdata.REQ_NO > 0) {
                let mvarepdata = {
                    SR_CODE: PropertyDetails.sroCode,
                    REQ_NO: mvresult.data.REQ_NO,
                    proptype: PropertyDetails.documentNature.TRAN_DESC,
                    consvalue: PropertyDetails.amount,
                    LPM: PropertyDetails.lpmNo,
                    PP: (PropertyDetails && PropertyDetails.isPrProhibitedDoorNO ? PropertyDetails.isPrProhibitedDoorNO : PropertyDetails.isPrProhibitedSurveyNO ? PropertyDetails.isPrProhibitedSurveyNO : ""),
                    structure: PropertyDetails.structure,
                    flatno: PropertyDetails.flatNo,
                    STRUCTURE : JSON.stringify(PropertyDetails.structure),

                }
                setReqNo(mvresult.data.REQ_NO)
                let mvAssistReport = await CallingAxios(mvAssitanceReport(mvarepdata));
                MVreqDetails(mvarepdata.REQ_NO)
                handleShow()
                if (mvAssistReport) {
                    const binaryData = atob(mvAssistReport?.data);
                    const byteArray = new Uint8Array(binaryData.length);
                    for (let i = 0; i < binaryData.length; i++) {
                        byteArray[i] = binaryData.charCodeAt(i);
                    }
                    const blob = new Blob([byteArray], { type: 'application/pdf' });
                    const blobUrl = URL.createObjectURL(blob);
                    setShow(true)
                }
                else {
                    console.error('No valid PDF data found in the response');
                }

                return res
            }
            else {
                return false
            }
        }
    }
    const GetVgForPPandMv = async (vgCode: any) => {
        if (vgCode && vgCode.length === 6) {
            vgCode = '0' + vgCode;
        }
        let result = await CallingAxios(UseGetVgForPpAndMV("Sr", vgCode));
        if (result.status) {
            let data = result.data;
            if (data && data.length > 0 && data[0].VILLCD != "")
                setwbVegCode(data[0].VILLCD);
        }
        else {
            return ShowMessagePopup(false, "Fetch vgCode list failed", "")
        }
    }

    const GetDistrictList = async () => {
        let result = await CallingAxios(useGetDistrictList());
        if (result.status) {
            setDistrictList(result.data);
        }
        else {
            ShowMessagePopup(false, result.message, "")
        }
    }
    const GetLocalBodiesData = async (id: any) => {
        let result = await CallingAxios(UselocalBodies(id));
        if (result.status) {

            setLocalBodyNameList(result.data.map(lbt => lbt.LOCAL_BODY_NAME));
            setLocalBodyTypeList(DropdownList.LocalBodyTypesList.map(lbt => { return { type: lbt.localBodyType, code: lbt.localBodyCode } }))
        }
        else {
            ShowMessagePopup(false, "fetching localBodyList Failed", "")
        }
    };

    const GetVillageCode = async () => {
        if (PropertyDetails.sroCode) {
            let result = await CallingAxios(UseGetVillageCode(PropertyDetails.sroCode));
            if (result.status) {
                let data = result.data;
                let newData = [];
                data.map(x => {
                    newData.push(x.VILLAGE_NAME);
                })
                setVillageList(newData);
                setVillageCodeList(data);
            }
            else {
            }
        }
    }
    const GetHabitation = async (VillageCode: any, data2?: any) => {

        let result = await CallingAxios(UseGetHabitation(VillageCode, "urban"));
        if (result.status) {
            let data = result.data;
            let newData = [];
            data.map(x => {
                newData.push(x.LOCALITY_STREET);
            })
            if (data && data.length > 0) {
                setHabitationList(newData);
                setHabitationCodeList(data);
                if (data2.habitation) {
                    let selected: any = data.find(e => e.LOCALITY_STREET == data2?.habitationOr);
                    setPropertyDetails({ ...data2, loc: selected?.LOC })
                }
            }
        }
        else {
        }
    }

    const GetSROOfficeList = async (id: any) => {
        let result = await CallingAxios(useSROOfficeList(id));
        if (result.status) {
            setSROOfficeList(result.data);
        }
    }

    useEffect(() => {
        if (selection === 'No') {
            const wantToExit = window.confirm('Do you want to exit?');
            if (wantToExit) {
                redirectToPage('/MVassistance/MvaLandingpage');
            } else {
                setSelection('Yes');
            }
        }
    }, [selection]);

    const MVreqDetails = async (reqNo: any) => {
        let data: any = {
            "REQ_NO": reqNo,
            "SR_CODE": PropertyDetails.sroCode,
            "REG_YEAR": new Date().getFullYear(),
            "GENERATED_BY": LoginDetails.loginId
        }
        let result: any = await CallingAxios(UseSaveMVrequestDetails(data))

        // if (result.status) {
        //     ShowMessagePopup(true, 'Payment Details Saved Successfully', "")
        //     redirectToPage('/MVassistance/MvaLandingpage');

        // } else {
        //     ShowMessagePopup(false, 'Payment Details Failed', "")
        // }
    }

    const onChange = (event: any) => {
        let TempDetails = { ...PropertyDetails };
        let addName = event.target.name;
        let addValue = event.target.value;
        addValue = addValue.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, "");
        if (addName == "flatNo") {
            let errorLabel = ""
            if (String(addValue).length < 100) {
                errorLabel = "Enter 5 Digits Number";
            }
            if (addValue.length > 100) {
                addValue = addValue.substring(0, 100);
            }
        }
        if (addName == "district") {
            setSROOfficeList([]);
            let selected = DistrictList.find(e => e.name == addValue);
            TempDetails = { ...TempDetails, districtCode: selected.id }
            GetSROOfficeList(selected.id);
        } else if (addName == "schedulePropertyType") {
            if (addValue == "FLAT [ఫ్లాట్]") {
                TempDetails = { ...TempDetails, appartmentName: "", undividedShare: "", undividedShareUnit: "", flatNo: "" }
                setIsFlat(true)
            } else {
                setIsFlat(false)
            }

        } else if (addName == "doorNo") {
            if (addValue == "") {
                setAllowProceed(false);
            }
            let errorLabel = ""
            if (String(addValue).length < 100) {
                errorLabel = "Enter 100 Digits Number";
            }
            if (addValue.length > 100) {
                addValue = addValue.substring(0, 100);
            }
        } else if (addName == "plotNo") {
            let errorLabel = ""
            if (String(addValue).length < 100) {
                errorLabel = "Enter 100 Digits Number";
            }
            if (addValue.length > 7) {
                addValue = addValue.substring(0, 100);
            }
        } else if (addName == "layoutNo") {
            let errorLabel = ""
            if (addValue.length < 100) {
                errorLabel = "Enter 100 Digits Number";
            }
            if (addValue.length > 100) {
                addValue = addValue.substring(0, 100);
            }
        } else if (addName == "layoutName") {
            if (addValue.length > 100) {
                addValue = addValue.substring(0, 100);
            }
        }
        else if (addName == "appartmentName") {
            if (addValue.length > 100) {
                addValue = addValue.substring(0, 100);
            }
        }
        else if (addName == "village") {
            setHabitationList([]);
            let selected = VillageCodeList.find(e => e.VILLAGE_NAME == addValue);
            TempDetails = { ...TempDetails, villageCode: selected.VILLAGE_CODE, habitationCode: "", habitation: "" }
            GetHabitation(selected.VILLAGE_CODE)
        } else if (addName == "habitation") {
            if (addValue == "") { return; }
            let selected = HabitationCodeList.find(e => e.LOCALITY_STREET == addValue);
            TempDetails = {
                ...PropertyDetails,
                ward: "",
                biward: "",
                block: "",
                biblock: "",
            };
            if (PropertyDetails.mode == "edit") {
                TempDetails = { ...TempDetails, habitationCode: selected.HABITATION, ward: selected.WARD_NO, biward: selected.BI_WARD ?? '', block: selected.BLOCK_NO, biblock: selected.BI_BLOCK ?? '',loc: selected.LOC, habitationOr: selected.LOCALITY_STREET }
            } else {
                TempDetails = { ...TempDetails, habitationCode: selected.HABITATION, ward: selected.WARD_NO, biward: selected.BI_WARD ?? '', block: selected.BLOCK_NO, biblock: selected.BI_BLOCK ?? '',loc: selected.LOC }
            }

            if (selected)
                GetLocalBodiesData(selected.HABITATION);
        } else if (addName == "ptinNo") {
            if (addValue.length > 10) {
                addValue = PropertyDetails.ptinNo
            }
            else {
                setCDMADetails({});
                setSelectedcdmaDetails({})
            }
        }
        else if (addName == 'localBodyTypeName') {
            let value = localBodyTypeList.find(x => x.type == addValue)
            TempDetails = { ...TempDetails, localBodyType: value.type, localBodyCode: value.code }
        }
        setPropertyDetails({ ...TempDetails, [addName]: addValue });
    }


    const onSubmit = async (e: any) => {
        e.preventDefault();
        if (PropertyDetails.totalFloors != PropertyDetails.structure.length) {
            ShowAlert(false, "Please provide complete structure details.");
        } else {
            if (Object.keys(CDMADetails).length && (CDMADetails.superStructure || CDMADetails.exempted)) {
                ShowAlert(false, "Property set under prohibition by MAUD");
            } else {
                let Details = { ...PropertyDetails };
                if (Object.keys(selectedcdmaDetails).length) {
                    Details.cdmaDetails = { ...selectedcdmaDetails };
                }
                let units = Details.propertyType.includes("RURAL") === true ? 'A' : 'Y';
                Details.conveyedExtent = [];
                Details.tExtent = "";
                let conveyedExt: any = {};
                conveyedExt.extent = Details.extent;
                conveyedExt.unit = Details.extentUnit
                conveyedExt.unit = units;
                Details.conveyedExtent = [...Details.conveyedExtent, conveyedExt];
                Details.tUnits = units;
                Details.localBodyCode = Details.localBodyCode;
                if (Details.mode === "edit" && ApplicationDetails?.documentNature?.TRAN_MAJ_CODE == "07") {
                    Details = { ...Details, leaseDetails: leaseData }
                }
                let MVResult = await MVCalculator();
                setMarketvaluecal([MVResult])
                if (MVResult) {
                    Details.marketValue = MVResult.marketValue ? MVResult.marketValue : 0;
                    let mv = MVResult.marketValue ? MVResult.marketValue : 0
                    setPropertyDetails({ ...PropertyDetails, marketValue: mv })
                    let data = {
                        "tmaj_code": PropertyDetails.registrationType.TRAN_MAJ_CODE,
                        "tmin_code": PropertyDetails.documentNature.TRAN_MIN_CODE,
                        "sroNumber": PropertyDetails.sroCode,
                        "local_body": 3,
                        "flat_nonflat": "N",
                        "marketValue": mv,
                        "finalTaxbleValue": PropertyDetails.amount > mv ? PropertyDetails.amount : mv,
                        "con_value": PropertyDetails.amount,
                        "adv_amount": 0,
                        "ext_Rate": MVResult.ext_Rate,
                        "CHRGE_RT": MVResult.CHRGE_RT,
                        "LAND_CST": MVResult.LAND_CST,
                        "STRU_CST": MVResult.STRU_CST
                    }
                    let finalRes: any = await DutyFeeCalculator(data);
                    if (finalRes) {
                        setShow(true)
                        localStorage.setItem("Property", "");
                    } else {
                        ShowMessagePopup(false, "Market Value Calculate Failed", "");
                    }

                }
            }
        }

    }

    const tableData = () => {
        let myStructure = [...PropertyDetails.structure];
        if (Structure.floorNo != "" && Structure.structureType != "" && Structure.plinth != "" && Structure.plinthUnit != "" && Structure.stageOfCons != "" && Structure.age != "") {
            myStructure.push(Structure);
            setStructure({ floorNo: "", structureType: "", plinth: "", plinthUnit: "", stageOfCons: "", age: "" });
            setPropertyDetails({ ...PropertyDetails, structure: myStructure })
        }
        else {
            ShowMessagePopup(false, "Please fill all the details of the floor structure", "");
        }
    }

    const LinkDocData = () => {
        let myLinkDocument: any = PropertyDetails.LinkedDocDetails ? [...PropertyDetails.LinkedDocDetails] : [];
        if (LinkDocument) {
            let sCode = SROOfficeList.find(e => e.name == LinkDocument.sroOffice)
            let srXode: any = sCode.id;
            myLinkDocument.push({ ...LinkDocument, sroCode: srXode });
            setLinkDocument({ linkDocNo: "", regYear: "", bookNo: "", scheduleNo: "", district: "", sroOffice: "", sroCode: "" });

            setPropertyDetails({ ...PropertyDetails, LinkedDocDetails: myLinkDocument })
        }

    }
    const GetLinkedSROOfficeList = async (id: any) => {
        let result = await CallingAxios(getLinkedSroDetails(id));
        if (result.status) {
            let sortedResult = result.data.sort((a, b) => a.name < b.name ? -1 : 1)
            setSROOfficeList(sortedResult);
        }
    }

    const DeleteItemStructure = (index: number) => {

        let myStructure = [...PropertyDetails.structure];
        myStructure.splice(index, 1);
        setPropertyDetails({ ...PropertyDetails, structure: myStructure })
    }

    const DeleteItemLinkDocument = (sindex: number) => {
        let myLinkDocument = [...PropertyDetails.LinkedDocDetails];
        myLinkDocument.splice(sindex, 1);
        setPropertyDetails({ ...PropertyDetails, LinkedDocDetails: myLinkDocument })

    }
    const onClickDocs = async (type: String) => {
        if (type == "Y") {
            if (ppbyPass.type == "survayNo")
                setPropertyDetails({ ...PropertyDetails, isPropProhibited: true, isPrProhibitedSurveyNO: ppbyPass.value });
            else
                setPropertyDetails({ ...PropertyDetails, isPropProhibited: true, isPrProhibitedDoorNO: ppbyPass.value });
            setPpByPass({ status: false, type: "", value: "" });
            setAllowProceed(true);
        } else {
            if (ppbyPass.type == "survayNo")
                setPropertyDetails({ ...PropertyDetails, isPropProhibited: false, isPrProhibitedSurveyNO: "" });
            else
                setPropertyDetails({ ...PropertyDetails, isPropProhibited: false, isPrProhibitedDoorNO: "" });
            OnCancelAction();
        }
    }
    const OnCancelAction = async () => {
        setPpByPass({ status: false, type: "", value: "" });
    }

    const onChangeStructure = (e: any) => {
        let addName = e.target.name;
        let addValue = e.target.value;
        if (addName == "plinth") {
            let errorLabel = ""
            if (String(addValue).length < 10) {
                errorLabel = "Enter 10 Digits Number";
            }
            if (addValue.length > 10) {
                addValue = addValue.substring(0, 10);
            }
        } else if (addName == "age") {
            let errorLabel = ""
            if (String(addValue).length < 3) {
                errorLabel = "Enter 3 Digits Number";
            }
            if (addValue.length > 3) {
                addValue = addValue.substring(0, 3);
            }
        }
        setStructure({ ...Structure, [addName]: addValue });
    }

    const onChangeLinkDoc = (e: any) => {
        let addName = e.target.name;
        let addValue = e.target.value;
        setLinkDocument({ ...LinkDocument, [addName]: addValue });
        if (addName == "district") {
            setSROOfficeList([]);
            let selected = DistrictList.find(e => e.name == addValue);
            GetLinkedSROOfficeList(selected.id);
        }
    }

    const handlePaymentLinkClick = () => {
        let paymentRedirectUrl = process.env.PAYMENT_URL + "/igrsPayment?paymentData=";
        let paymentLink = document.createElement("a");
        let PaymentJSON = {
            "type": "ucdecms",
            "source": "MV",
            "deptId": reqNo,
            "rmName": LoginDetails.loginName,
            "sroNumber": PropertyDetails.sroCode,
            "rf": 50
        }
        let encodedData = Buffer.from(JSON.stringify(PaymentJSON), 'utf8').toString('base64')
        paymentLink.href = paymentRedirectUrl + encodedData;
        paymentLink.target = "_blank";
        paymentLink.click();
        setTimeout(function () { paymentLink.remove(); }, 1000);
    };

    const GetTransactionStatus = async (reqNo: any) => {
        let data:any = {
            "REQ_NO":reqNo,
            "SR_CODE":PropertyDetails.sroCode
        }
        Loading(true);
        let result = await GetPaymentStatus(data);
        Loading(false);
        if (result && result.status) {
            setPayData({ ...result.data })
            UpdatePaymentMVRequestdata({ ...result.data })
            setShowInputs(true);
        } else {
            ShowAlert(false, "Your payment is not yet completed. Please complete the payment process.");
        }
    }

    const UpdatePaymentMVRequestdata = async (pdata: any) => {
        let data: any = {
            "REQ_NO": reqNo,
            "REG_YEAR": new Date().getFullYear(),
            "SR_CODE": PropertyDetails.sroCode,
            "DEPT_TRANS_ID": pdata.deptTransID,
            "PAID_AMOUNT": pdata.amount,
        }
        let result: any = await CallingAxios(UpdatePaymentMVRequest(data))

        if (result.status) {
            ShowMessagePopup(true, 'Payment Details Verified Successfully', "")
        } else {
            ShowMessagePopup(false, 'Payment Details Failed', "")
        }
    }

    const ppRestrictionBypass = async (data: any, type: any, val: any) => {
        if (data != "NO") {
            setPpByPass({ status: true, type: type, value: val })
            setAllowProceed(false);
        } else {
            setAllowProceed(true);
            ShowMessagePopup(true, `Prohibited Property Check for ${type} ${val} is clear for Registration`, "");
        }
    }

    const PPCheck = async (type: any) => {
        if (!PropertyDetails.habitation || PropertyDetails.habitation == "") {
            return ShowMessagePopup(false, "Please select habitation", "")
        }
        let data: any = {}
        let vgCode = wbVgCode != "" ? wbVgCode : PropertyDetails.villageCode;
        if (type == "doorNo") {
            if (PropertyDetails.doorNo == "") { return; }
            let DoorNoArray = PropertyDetails.doorNo.split(',');
            let ppDr: any = "", NotProhibitedDr: any = [];
            for (let i of DoorNoArray) {
                data = {
                    ward: PropertyDetails.ward,
                    block: PropertyDetails.block,
                    dNo: i,
                    sroCode: PropertyDetails.sroCode,
                    serveyNo: null,
                    villageCode: vgCode,
                    proField: "R_DNO"
                }
                const response = await UseGetPPCheck(data, "urban");
                if (response.status) {
                    let data = response.data[0]
                    for (let value of Object.values(data)) {
                        if (value != "NO") {
                            ppDr = ppDr == "" ? i : ppDr + "," + i

                            if (ApplicationDetails.registrationType.TRAN_MAJ_CODE == "02") {
                                setAllowProceed(true);
                            }
                            else {
                                await ppRestrictionBypass(value, type, ppDr);
                            }
                        }
                        else {
                            await ppRestrictionBypass(value, type, i);
                        }
                    }

                }
            }

        }
        else if (type == "survayNo") {
            if (PropertyDetails.survayNo == "") { return; }
            let SurvayNoArray = PropertyDetails.survayNo.split(',')
            let ppSrvy: any = "";
            for (let i of SurvayNoArray) {
                data = {
                    ward: null,
                    block: null,
                    dNo: null,
                    sroCode: PropertyDetails.sroCode,
                    serveyNo: i,
                    villageCode: PropertyDetails.villageCode,
                    proField: "R_SNO"
                }
                const response = await UseGetPPCheck(data, "urban");
                if (response.status) {
                    let data = response.data[0]
                    for (let value of Object.values(data)) {
                        if (value != "NO") {
                            ppSrvy = ppSrvy == "" ? i : ppSrvy + "," + i
                            if (ApplicationDetails.registrationType.TRAN_MAJ_CODE == "02") {
                                setAllowProceed(true);
                            }
                            else {
                                await ppRestrictionBypass(value, type, ppSrvy);
                            }
                        }
                        else {
                            await ppRestrictionBypass(value, type, i);
                        }
                    }
                }
            }
        }
    }

    const handlePreviewPDF = async () => {
        try {
            let data = {
                SR_CODE: PropertyDetails.sroCode,
                REQ_NO: reqNo,
                REG_YEAR: new Date().getFullYear()
            }
            const response = await CallingAxios(previewPDF(data));
            if (response) {
                const binaryData = atob(response);
                const byteArray = new Uint8Array(binaryData.length);
                for (let i = 0; i < binaryData.length; i++) {
                    byteArray[i] = binaryData.charCodeAt(i);
                }
                const blob = new Blob([byteArray], { type: 'application/pdf' });
                const blobUrl = URL.createObjectURL(blob);
                window.open(blobUrl, '_blank')
            }
            else {
                console.error('No valid PDF data found in the response');
            }
        }
        catch (error) {
            console.error("Error fetching data:", error);
        }
    }
    useEffect(() => {
        const Doornumber = [
            PropertyDetails?.ward && (PropertyDetails.ward + (PropertyDetails.biward ? '/' + PropertyDetails.biward : '')),
            PropertyDetails?.block && (PropertyDetails.block + (PropertyDetails.biblock ? '/' + PropertyDetails.biblock : ''))
        ]
            .filter(Boolean)
            .join('-');

        setStaticdoornumber(Doornumber);
    }, [
        PropertyDetails.ward,
        PropertyDetails.biward,
        PropertyDetails.block,
        PropertyDetails.biblock
    ]);

    return (
        <div className='PageSpacing'>
            <Head>
                <title>Property Details_Urban - Public Data Entry</title>
            </Head>
            <Container>
                <div className='tabContainerInfo'>
                    <Container>
                        <Row>
                            <Col lg={12} md={12} xs={12} className='p-0 navItems'>
                                <div className='tabContainer DutyfeeContainer py-2'>
                                    <div className='activeTabButton'>Stamp Duty(₹) : {CalculatedDutyFee.sd_p ? CalculatedDutyFee.sd_p : 0}<div></div></div>
                                    <div className='activeTabButton'>Transfer Duty(₹) : {CalculatedDutyFee.td_p ? CalculatedDutyFee.td_p : 0}<div></div></div>
                                    <div className='activeTabButton'>Registration fee(₹) : {CalculatedDutyFee.rf_p ? CalculatedDutyFee.rf_p : 0}<div></div></div>
                                    {GetstartedDetails?.documentNature && GetstartedDetails?.documentNature?.TRAN_MAJ_CODE === "08" && GetstartedDetails?.documentNature?.TRAN_MIN_CODE === "06" ?
                                    <div className='activeTabButton'>User Charges(₹) : 0<div></div></div>:
                                    <div className='activeTabButton'>User Charges(₹) : 500<div></div></div>
                                    }
                                    {/* <div className='activeTabButton'>User Charges(₹) : 500<div></div></div> */}
                                    <div className='activeTabButton'>Market Value(₹)  : {PropertyDetails.marketValue ? PropertyDetails.marketValue : 0}<div></div></div>
                                    <div className='activeTabButton'>Consideration Value(₹) : {ApplicationDetails.amount ? ApplicationDetails.amount : "0"}<div></div></div>
                                    {GetstartedDetails?.documentNature && GetstartedDetails?.documentNature?.TRAN_MAJ_CODE === "08" && GetstartedDetails?.documentNature?.TRAN_MIN_CODE === "06" ?
                                    <div className='activeTabButton'>Total Payable(₹) : {Number(CalculatedDutyFee.sd_p) + Number(CalculatedDutyFee.td_p) + Number(CalculatedDutyFee.rf_p) + 0}</div>:
                                    <div className='activeTabButton'>Total Payable(₹) : {Number(CalculatedDutyFee.sd_p) + Number(CalculatedDutyFee.td_p) + Number(CalculatedDutyFee.rf_p) + 500}</div>
                                    }
                                    {/* <div className='activeTabButton'>Total Payable(₹) : {Number(CalculatedDutyFee.sd_p) + Number(CalculatedDutyFee.td_p) + Number(CalculatedDutyFee.rf_p) + 500}</div> */}
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>
                <Row>
                    <Col lg={12} md={12} xs={12}>
                        <div className={`pt-2 ${styles.PropertyDetailsmain} ${styles.PropertyDetailsPage}`}>
                            <Row className='ApplicationNum mt-0'>
                                <Col lg={6} md={6} xs={12}>
                                    <div className='ContainerColumn TitleColmn' onClick={() => { router.push("/MVassistance/Property") }}>
                                        <h4 className='TitleText left-title'>{ApplicationDetails.documentNature ? ApplicationDetails.registrationType.TRAN_DESC : null}</h4>
                                    </div>
                                </Col>
                            </Row>

                            <div className="mainWrapper py-2 ">
                                <div className="wrapperInner" style={{ marginTop: "20px" }}>
                                    <div className={styles.ExecutantDetailsInfo}>
                                        <div className={styles.DetailsHeaderContainer}>
                                            <Row>
                                                <Col lg={6} md={6} xs={12}>
                                                    <div className={styles.ContainerColumn}>
                                                        <p className={styles.HeaderText}>4 . Property Details (Urban) [ఆస్తి వివరాలు (పట్టణ)]</p>
                                                    </div>
                                                </Col>
                                                <Col lg={6} md={6} xs={12}>
                                                </Col>
                                            </Row>
                                        </div>
                                        {!showdata &&
                                            <form onSubmit={onSubmit} className={styles.AddExecutantInfo}>
                                                <Row className="align-items-end">
                                                    <Col lg={4} md={6} xs={12}>
                                                        <TableText label={"Total Consideration Value(₹) [మొత్తం ప్రతిఫలం విలువ]"} required={true} LeftSpace={false} />
                                                        <TableInputText type='number' required={true} disabled={true} name={'amount'} value={ApplicationDetails.amount} onChange={onChange} placeholder={''} />
                                                    </Col>
                                                </Row>
                                                <Row className="mb-1">
                                                    <p className={` ${styles.getTitle} ${styles.HeadingText}`}>Which Jurisdiction District and SRO Office is the property Located ? [ఏ సబ్ రిజిస్ట్రార్ కార్యాలయం పరిధి జిల్లాలో ఉన్న ఆస్తి?]</p>
                                                    <Col lg={6} md={6} xs={12}>
                                                        <TableText label={"Jurisdiction Registration District [జిల్లా రిజిస్ట్రేషన్ అధికార పరిధి]"} required={true} LeftSpace={false} />
                                                        <TableInputText required={true} disabled={true} name={"district"} value={PropertyDetails.district} onChange={onChange} type={'text'} placeholder={''} />
                                                    </Col>
                                                    <Col lg={6} md={6} xs={12} className="mb-2">
                                                        <TableText label={"Jurisdiction Sub-Registrar [సబ్ రిజిస్ట్రార్ కార్యాలయం అధికార పరిధి]"} required={true} LeftSpace={false} />
                                                        <TableInputText required={true} disabled={true} name={"sroOffice"} value={PropertyDetails.sroOffice} onChange={onChange} type={'text'} placeholder={''} />
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col lg={6} md={6} xs={12}>
                                                        <TableText label={"Land Use [భూమి వినియోగం]"} required={true} LeftSpace={false} />
                                                        <TableInputText required={true} disabled={true} name={"landUse"} value={PropertyDetails.landUse} onChange={onChange} type={'text'} placeholder={''} />
                                                    </Col>
                                                    <Col lg={6} md={6} xs={12}>
                                                        <TableText label={"Type of Property [ఆస్తి రకం]"} required={true} LeftSpace={false} />
                                                        <TableInputText required={true} disabled={true} name={"propertyType"} value={PropertyDetails.propertyType} onChange={onChange} type={'text'} placeholder={''} />
                                                    </Col>
                                                    {ApplicationDetails?.registrationType?.TRAN_MAJ_CODE == "04" ?
                                                        <Col lg={4} md={6} xs={12} className='mt-2'>
                                                            <TableText label={"Party Number [పార్టీ నెంబర్]"} required={true} LeftSpace={false} />
                                                            <TableInputText required={true} disabled={true} name={"partyNumber"} value={PropertyDetails.partyNumber} onChange={onChange} type={'text'} placeholder={''} />
                                                        </Col>
                                                        : null}
                                                </Row>
                                                <div className={styles.divider}></div>
                                                <Row className="mb-1">
                                                    <p className={` ${styles.getTitle} ${styles.HeadingText}`}>Schedule of the property to be registered [నమోదు చేయవలసిన ఆస్తి యొక్క షెడ్యూల్]</p>
                                                    <Col lg={3} md={6} xs={12} className='mb-1'>
                                                        <TableText label={"Village [గ్రామం]"} required={true} LeftSpace={false} />
                                                        <TableInputText required={true} disabled={true} name={"village"} value={PropertyDetails.village} onChange={onChange} type={'text'} placeholder={''} />

                                                    </Col>
                                                    <Col lg={3} md={6} xs={12}>
                                                        <TableText label={"Habitation/ Locality [నివాసం/ ప్రాంతం]"} required={true} LeftSpace={false} />
                                                        {IsViewMode ?
                                                            <TableInputText required={false} disabled={true} name={"habitation"} value={PropertyDetails.habitationOr} onChange={onChange} type={'text'} placeholder={''} />
                                                            : PropertyDetails.mode === "edit" ?
                                                                <TableDropdown required={true} options={HabitationList} name={'habitation'} value={PropertyDetails.habitation} onChange={onChange} keyName={''} label={''} errorMessage={''} keyValue={''} />
                                                                : <TableDropdown required={true} options={HabitationList} name={'habitation'} value={PropertyDetails.habitation} onChange={onChange} keyName={''} label={''} errorMessage={''} keyValue={''} />
                                                        }
                                                    </Col>
                                                    <Col lg={3} md={6} xs={12}>
                                                        <TableText label={"Ward [వార్డు]"} required={false} LeftSpace={false} />
                                                        <TableInputText disabled={true} type='text' required={false} name={'ward'} value={PropertyDetails.ward} onChange={onChange} placeholder={''} />
                                                    </Col>
                                                    <Col lg={3} md={6} xs={12}>
                                                        <TableText label={"Bi-Ward [బై-వార్డు]"} required={false} LeftSpace={false} />
                                                        <TableInputText disabled={true} type='text' required={false} name={'biward'} value={PropertyDetails.biward} onChange={onChange} placeholder={''} />
                                                    </Col>
                                                    <Col lg={3} md={6} xs={12}>
                                                        <TableText label={"Block No. [బ్లాక్ నెం.]"} required={false} LeftSpace={false} />
                                                        <TableInputText disabled={true} type='text' required={true} name={'block'} value={PropertyDetails.block} onChange={onChange} placeholder={''} />
                                                    </Col>
                                                    <Col lg={3} md={6} xs={12}>
                                                        <TableText label={"Bi-Block No. [బై-బ్లాక్ నెం.]"} required={false} LeftSpace={false} />
                                                        <TableInputText disabled={true} type='text' required={true} name={'biblock'} value={PropertyDetails.biblock} onChange={onChange} placeholder={''} />
                                                    </Col>
                                                </Row>

                                                <Row className="mb-2">
                                                    <Col lg={3} md={6} xs={12}>
                                                        <TableText label={"Door No. [డోర్ నెం.]"} required={true} LeftSpace={false} />
                                                        <TableInputText disabled={IsViewMode} onBlurCapture={() => { PPCheck("doorNo"); }} type='text' required={RequiredFields.doorNo} name={'doorNo'} value={`${Staticdoornumber ? Staticdoornumber + '-' : ''}${PropertyDetails?.doorNo || ''}`} onChange={(e) => {
                                                            // Extract only the door number part when typing
                                                            const StaticdoornumberLength = Staticdoornumber ? Staticdoornumber.length + 1 : 0;
                                                            const newDoorNo = e.target.value.slice(StaticdoornumberLength);
                                                            onChange({ target: { name: 'doorNo', value: newDoorNo } });
                                                        }} placeholder={''} />
                                                    </Col>
                                                    <Col lg={3} md={6} xs={12}>
                                                        <TableText label={"Plot No. [ప్లాట్ నెం.]"} required={RequiredFields.plotNo} LeftSpace={false} />
                                                        <TableInputText disabled={IsViewMode} type='text' required={RequiredFields.plotNo} name={'plotNo'} value={PropertyDetails.plotNo} onChange={onChange} placeholder={''} />
                                                    </Col>
                                                    <Col lg={3} md={6} xs={12}>
                                                        <div className={styles.surveyInput}>
                                                            <TableText label={"Survey No. [సర్వే నెం.]"} required={false} LeftSpace={false} />
                                                            <TableInputText disabled={IsViewMode} onBlurCapture={() => { PPCheck("survayNo"); }} type='text' required={false} name={'survayNo'} value={PropertyDetails.survayNo} onChange={onChange} placeholder={''} />
                                                        </div>
                                                    </Col>
                                                    <Col lg={3} md={6} xs={12}>
                                                        <TableText label={"PTIN [ప్రాపర్టీ టాక్స్ నెంబర్]"} required={RequiredFields.ptinNo} LeftSpace={false} />
                                                        {IsViewMode ? <></>
                                                            : <TableInputText disabled={IsViewMode} type='number' required={RequiredFields.ptinNo} name={'ptinNo'} value={PropertyDetails.ptinNo} onChange={onChange} placeholder={''} />
                                                        }
                                                    </Col>
                                                </Row>
                                                {Object.keys(CDMADetails).length ?
                                                    <Row>
                                                        <div className={styles.divider}></div>
                                                        <Col lg={12} md={12} xs={12} className="mb-2">
                                                            <div>
                                                                <Table striped bordered hover className='TableData'>
                                                                    <thead>
                                                                        <tr>
                                                                            <th className='principalamount' rowSpan={2}>Property Address<span>[ఆస్తి చిరునామా]</span></th>
                                                                            <th rowSpan={2}>Locality Name<span>[స్థానికత పేరు]</span></th>
                                                                            <th colSpan={4} style={{ textAlign: "center" }}>Owner Details<span>[యజమాని వివరాలు]</span></th>
                                                                            <th rowSpan={2}>Site Extent<span>[పునాది ప్రాంతం]</span></th>
                                                                            <th rowSpan={2}>Total Taxdue<span>[మొత్తం పన్ను బకాయి]</span></th>
                                                                            <th rowSpan={2}>Door No.<span>[డోర్ నెం.]</span></th>
                                                                        </tr>
                                                                        <tr>
                                                                            <td>Aadhaar Number<span>[ఆధార్ నంబర్]</span></td>
                                                                            <td>Owner Name<span>[యజమాని పేరు]</span></td>
                                                                            <td>Mobile Number<span>[మొబైల్ నంబర్]</span></td>
                                                                            <td>Email ID<span>[ఇమెయిల్ ఐడి]</span></td>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        <tr>
                                                                            <td>{CDMADetails.propertyAddress}</td>
                                                                            <td>{CDMADetails.boundaryDetails?.["localityName"]}</td>
                                                                            <td>{CDMADetails.ownerNames && CDMADetails.ownerNames[0].aadhaarNumber}</td>
                                                                            <td>{CDMADetails.ownerNames && CDMADetails.ownerNames[0].ownerName}</td>
                                                                            <td>{CDMADetails.ownerNames && CDMADetails.ownerNames[0].mobileNumber}</td>
                                                                            <td>{CDMADetails.ownerNames && CDMADetails.ownerNames[0].emailId}</td>
                                                                            <td>{CDMADetails.siteExtent + ' ' + CDMADetails.siteExtentUnit}</td>
                                                                            <td>{CDMADetails.propertyDetails['taxDue']}</td>
                                                                            <td>{CDMADetails.houseNo}</td>
                                                                        </tr>
                                                                    </tbody>
                                                                </Table>
                                                            </div>
                                                        </Col>
                                                    </Row> : null}
                                                <div className={styles.divider}></div>

                                                <Row className="">
                                                    {PropertyDetails.landUse.includes("VACANT") ? <div></div> :
                                                        <Col lg={3} md={6} xs={12}>
                                                            <TableText label={"Type of Property [ఆస్తి రకం]"} required={true} LeftSpace={false} />
                                                            {IsViewMode ?
                                                                <TableInputText disabled={true} type='text' required={false} name={'schedulePropertyType'} value={PropertyDetails.schedulePropertyType} onChange={onChange} placeholder={''} />
                                                                : <TableDropdown required={true} options={DropdownOptions.TypeofProperty} name={'schedulePropertyType'} value={PropertyDetails.schedulePropertyType} onChange={onChange} keyName={''} label={''} errorMessage={''} keyValue={''} />
                                                            }
                                                        </Col>}
                                                    <Col lg={3} md={6} xs={12}>
                                                        <div>
                                                            <Row>
                                                                <Col lg={6} md={6} xs={12}>
                                                                    <TableText label={"Extent [పరిధి]"} required={true} LeftSpace={false} />
                                                                    <TableInputText disabled={IsViewMode} type='number' required={true} name={'extent'} value={PropertyDetails.extent}  onChange={onChange} placeholder={''} />
                                                                </Col>
                                                                <Col lg={6} md={6} xs={12} >
                                                                    <TableText label={"Units [యూనిట్లు]"} required={true} LeftSpace={false} />
                                                                    {IsViewMode ? <TableInputText disabled={true} type='text' required={false} name={'extentUnit'} value={PropertyDetails.extentUnit}  onChange={onChange} placeholder={''} />
                                                                        : <TableDropdown required={true} options={DropdownOptions.UnitList} name={'extentUnit'} value={PropertyDetails.extentUnit}  onChange={onChange} keyName={''} label={''} errorMessage={''} keyValue={''} />}
                                                                </Col>
                                                            </Row>
                                                        </div>

                                                    </Col>
                                                    <Col lg={6} md={6} xs={12}>
                                                        <TableText label={"VLT NO. / LP NO. / IPLP NO. [విఎల్‌టి నెం. / ఎల్పి నెం. / ఐపిఎల్పి నెం.]"} required={false} LeftSpace={false} />
                                                        <TableInputText disabled={IsViewMode} type='text' required={false} name={'layoutNo'} value={PropertyDetails.layoutNo} onChange={onChange} placeholder={''} />
                                                    </Col>
                                                    <Col lg={3} md={6} xs={12} >
                                                        {(PropertyDetails.landUse == "URBAN VACANT LAND(RESIDENTIAL)(R) [పట్టణ ఖాళీ స్తలము(నివాసం (R )]" || PropertyDetails.landUse == "URBAN VACANT LAND(COMMERCIAL)(R) [పట్టణ ఖాళీ స్తలము(వ్యాపారపరమైన )(R)]") ? "" : <div style={{ marginTop: "9px" }}></div>}
                                                        <TableText label={"Layout Name [లేఅవుట్ పేరు]"} required={false} LeftSpace={false} />
                                                        <TableInputText disabled={IsViewMode} type='text' splChar={false} required={false} name={'layoutName'} value={PropertyDetails.layoutName} onChange={onChange} placeholder={''} />
                                                    </Col>
                                                    <Col lg={3} md={6} xs={12} className='mt-2'>
                                                        <TableText label={"Local Body Name [స్థానిక సంస్థ పేరు]"} required={true} LeftSpace={false} />
                                                        {IsViewMode ? <TableInputText disabled={true} type='text' required={false} name={'localBodyName'} value={PropertyDetails.localBodyName} onChange={onChange} placeholder={''} />
                                                            : <TableDropdown required={true} options={localBodyNameList} name={'localBodyName'} value={PropertyDetails.localBodyName} onChange={onChange} keyName={''} label={''} errorMessage={''} keyValue={''} />}
                                                    </Col>

                                                    <Col lg={3} md={6} xs={12} className='mt-2'>
                                                        <TableText label={"Local Body Type [స్థానిక సంస్థ రకం]"} required={true} LeftSpace={false} />
                                                        {IsViewMode ? <TableInputText disabled={true} type='text' required={false} name={'localBodyTypeName'} value={PropertyDetails.localBodyTypeName} onChange={onChange} placeholder={''} />
                                                            :
                                                            <TableDropdown keyName={"type"} required={true} options={localBodyTypeList} name={'localBodyTypeName'} value={PropertyDetails.localBodyTypeName} onChange={onChange} label={''} errorMessage={''} keyValue={'type'} />
                                                        }
                                                    </Col>
                                                </Row>
                                                <Row>

                                                </Row>
                                                {IsFlat &&
                                                    <div className={styles.FlatDetails}>
                                                        <div className={styles.divider}></div>
                                                        <Row>
                                                            <p className={` ${styles.getTitle} ${styles.HeadingText}`}>Flat Details [ఫ్లాట్ వివరాలు]</p>
                                                            <Col lg={6} md={6} xs={12} className='pb-2'>
                                                                <TableText label={"Apartment Name [అపార్ట్‌మెంట్ పేరు]"} required={true} LeftSpace={false} />
                                                                <TableInputText disabled={IsViewMode} type='text' splChar={false} required={true} name={'appartmentName'} value={PropertyDetails.appartmentName} onChange={onChange} placeholder={''} />
                                                            </Col>
                                                            <Col lg={6} md={6} xs={12}>
                                                                <TableText label={"Flat No [ఫ్లాట్ నెం.]"} required={true} LeftSpace={false} />
                                                                <TableInputText disabled={IsViewMode} type='text' required={true} name={'flatNo'} value={PropertyDetails.flatNo} onChange={onChange} placeholder={''} />
                                                            </Col>
                                                            <Col lg={6} md={6} xs={12}>
                                                                <TableText label={"Undivided Share/ Extent [విభజించబడని వాటా/విస్తీర్ణం]"} required={true} LeftSpace={false} />
                                                                <TableInputText disabled={IsViewMode} type='number' required={true} name={'undividedShare'} value={PropertyDetails.undividedShare} onChange={onChange} placeholder={''} />
                                                            </Col>
                                                            <Col lg={6} md={6} xs={12}>
                                                                <TableText label={"Unit [యూనిట్]"} required={true} LeftSpace={false} />
                                                                {IsViewMode ? <TableInputText disabled={true} type='text' required={false} name={'undividedShareUnit'} value={PropertyDetails.undividedShareUnit} onChange={onChange} placeholder={''} />
                                                                    : <TableDropdown required={true} options={DropdownOptions.UnitList} name={'undividedShareUnit'} value={PropertyDetails.undividedShareUnit} onChange={onChange} keyName={''} label={''} errorMessage={''} keyValue={''} />}
                                                            </Col>
                                                        </Row>
                                                        <div className={styles.divider}></div>
                                                        <Row className="mb-3">
                                                            <p className={` ${styles.getTitle} ${styles.HeadingText}`}>Flat Boundary Details [ఫ్లాట్ సరిహద్దు వివరాలు]</p>
                                                            <Col lg={3} md={6} xs={12} >
                                                                <TableText label={"North Side [ఉత్తరం వైపు]"} required={true} LeftSpace={false} />
                                                                <TableInputText disabled={IsViewMode} type='text' required={true} name={'flatNorthBoundry'} value={PropertyDetails.flatNorthBoundry} onChange={onChange} placeholder={''} />
                                                            </Col>
                                                            <Col lg={3} md={6} xs={12} >
                                                                <TableText label={"South Side [దక్షిణం వైపు]"} required={true} LeftSpace={false} />
                                                                <TableInputText disabled={IsViewMode} type='text' required={true} name={'flatSouthBoundry'} value={PropertyDetails.flatSouthBoundry} onChange={onChange} placeholder={''} />
                                                            </Col>
                                                            <Col lg={3} md={6} xs={12} >
                                                                <TableText label={"East Side [తూర్పు వైపు]"} required={true} LeftSpace={false} />
                                                                <TableInputText disabled={IsViewMode} type='text' required={true} name={'flatEastBoundry'} value={PropertyDetails.flatEastBoundry} onChange={onChange} placeholder={''} />
                                                            </Col>
                                                            <Col lg={3} md={6} xs={12} >
                                                                <TableText label={"West Side [పడమర వైపు]"} required={true} LeftSpace={false} />
                                                                <TableInputText disabled={IsViewMode} type='text' required={true} name={'flatWestBoundry'} value={PropertyDetails.flatWestBoundry} onChange={onChange} placeholder={''} />
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                }

                                                {(PropertyDetails.landUse.includes("VACANT") || PropertyDetails.schedulePropertyType == "") ? <div></div> :
                                                    <div>
                                                        <div className={styles.divider}></div>
                                                        <Row>
                                                            <p className={` ${styles.getTitle} ${styles.HeadingText}`}>Structures [నిర్మాణాలు]</p>
                                                            <Col lg={3} md={6} xs={12} className="mb-2">
                                                                <TableText label={"Total Floors [మొత్తం అంతస్తులు]"} required={true} LeftSpace={false} />
                                                                <TableInputText disabled={!IsViewMode ? generateStructure.showStructure : IsViewMode} type='number' maxLength={2} dot={false} required={true} name={'totalFloors'} value={PropertyDetails.totalFloors} onChange={onChange} placeholder={''} />
                                                            </Col>
                                                            <Col lg={3} md={6} xs={12}>
                                                                {IsViewMode ? null : <div className={`${styles.ProceedContainer} ${styles.BtnContainer}`}>
                                                                    {generateStructure.allowEdit ?
                                                                        <div className='proceedButton generateBtn' onClick={() => onGenerateStructureClick('edit')}>Generate Structure</div>
                                                                        : <div className='proceedButton generateBtn' onClick={() => onGenerateStructureClick('clear')}>Clear</div>}
                                                                </div>}
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                }
                                                {generateStructure.showStructure &&
                                                    <div>
                                                        <Row>
                                                            <Col lg={6} md={6} xs={12}>
                                                                <div className='Inputgap'>
                                                                    {/* <div className={styles.DocuementGen1}> */}
                                                                    <TableInputRadio label={'Select'} required={true} options={[{ 'label': "Industrial" }, { 'label': "Non-Industrial" }]} onChange={onChange} name='strType' defaultValue={PropertyDetails.strType} />
                                                                    {/* </div> */}
                                                                </div>

                                                            </Col>
                                                        </Row>
                                                    </div>
                                                }
                                                <div className={styles.divider}></div>
                                                {generateStructure.showStructure && (
                                                    <div className={styles.StructuresInfo}>
                                                        <div className={styles.StructuresHeader}>
                                                            <Row>
                                                                <Col lg={2} md={6} xs={12} className='StrData'>
                                                                    <p className={styles.HeadText}>Floor No.<span>[అంతస్తు నెం.]</span></p>
                                                                </Col>
                                                                <Col lg={2} md={6} xs={12} className='StrData'>
                                                                    <p className={styles.HeadText}>Structure Type<span>[నిర్మాణ రకం]</span></p>
                                                                </Col>
                                                                <Col lg={2} md={6} xs={12} className='StrData'>
                                                                    <p className={styles.HeadText}>Plinth<span>[పునాది]</span></p>
                                                                </Col>
                                                                <Col lg={2} md={6} xs={12} className='StrData'>
                                                                    <p className={styles.HeadText}>Unit<span>[యూనిట్]</span></p>
                                                                </Col>
                                                                <Col lg={2} md={6} xs={12} className='StrData'>
                                                                    <p className={styles.HeadText}>Stage of Construction<span>[నిర్మాణ దశ]</span></p>
                                                                </Col>
                                                                <Col lg={2} md={6} xs={12} className='StrData'>
                                                                    <p className={styles.HeadText}>Age<span>[వయస్సు]</span></p>
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                        <div className={styles.StructuresDetails}>
                                                            {PropertyDetails.totalFloors > PropertyDetails.structure.length &&
                                                                <Row>
                                                                    <Col lg={2} md={6} xs={12}>
                                                                        {IsViewMode ? <TableInputText disabled={true} type='text' required={false} name={'floorNo'} value={Structure.floorNo} onChange={onChange} placeholder={''} />
                                                                            : <TableDropdown required={false} options={floorList} name={'floorNo'} value={Structure.floorNo} onChange={onChangeStructure} keyName={''} label={''} errorMessage={''} keyValue={''} />}
                                                                    </Col>
                                                                    <Col lg={2} md={6} xs={12}>
                                                                        {IsViewMode ? <TableInputText disabled={true} type='text' required={false} name={'structureType'} value={Structure.structureType} onChange={onChange} placeholder={''} />
                                                                            : <TableDropdown required={false} options={DropdownOptions.StructureTypeList} name={'structureType'} value={Structure.structureType} onChange={onChangeStructure} keyName={''} label={''} errorMessage={''} keyValue={''} />}
                                                                    </Col>
                                                                    <Col lg={2} md={6} xs={12}>
                                                                        <TableInputText disabled={IsViewMode} type='number' required={false} name={'plinth'} value={Structure.plinth} onChange={onChangeStructure} placeholder={''} />
                                                                    </Col>
                                                                    <Col lg={2} md={6} xs={12}>
                                                                        {IsViewMode ? <TableInputText disabled={true} type='text' required={false} name={'plinthUnit'} value={Structure.plinthUnit} onChange={onChange} placeholder={''} />
                                                                            : <TableDropdown required={false} options={DropdownOptions.StrUnitList} name={'plinthUnit'} value={Structure.plinthUnit} onChange={onChangeStructure} keyName={''} label={''} errorMessage={''} keyValue={''} />}
                                                                    </Col>
                                                                    <Col lg={2} md={6} xs={12}>
                                                                        {IsViewMode ? <TableInputText disabled={true} type='text' required={false} name={'stageOfCons'} value={Structure.stageOfCons} onChange={onChange} placeholder={''} />
                                                                            : <TableDropdown required={false} options={DropdownOptions.ConsList} name={'stageOfCons'} value={Structure.stageOfCons} onChange={onChangeStructure} keyName={''} label={''} errorMessage={''} keyValue={''} />}
                                                                    </Col>
                                                                    <Col lg={2} md={6} xs={12}>
                                                                        <TableInputText disabled={IsViewMode} type='number' required={false} name={'age'} value={Structure.age} onChange={onChangeStructure} placeholder={''} />
                                                                    </Col>

                                                                    {IsViewMode ? <div style={{ margin: '20px' }}></div> : <Col lg={12} md={12} xs={12}>
                                                                        <div
                                                                            onClick={tableData} className={`${styles.YesBtn} ${styles.AddBtn}`}>Add</div>
                                                                    </Col>}
                                                                </Row>
                                                            }
                                                            <Row>
                                                                {PropertyDetails.structure.length ?
                                                                    <div className='table-responsive'>
                                                                        <Table striped bordered hover className='TableData'>
                                                                            <thead>
                                                                                <tr>
                                                                                    <th className='sroColmn'>Floor No.<span>[అంతస్తు నెం.]</span></th>
                                                                                    <th>Structure Type<span>[నిర్మాణ రకం]</span></th>
                                                                                    <th>Plinth<span>[పునాది]</span></th>
                                                                                    <th>Unit<span>[యూనిట్]</span></th>
                                                                                    <th>Stage of Cons<span>[నిర్మాణ దశ]</span></th>
                                                                                    <th>Age<span>[వయస్సు]</span></th>
                                                                                    <th>Action<span>[చర్య]</span></th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {PropertyDetails.structure.map((x, index) => {
                                                                                    return (<tr key={index}>
                                                                                        <td>{x.floorNo}</td>
                                                                                        <td>{x.structureType}</td>
                                                                                        <td>{x.plinth}</td>
                                                                                        <td>{x.plinthUnit}</td>
                                                                                        <td>{x.stageOfCons}</td>
                                                                                        <td>{x.age}</td>
                                                                                        {IsViewMode ? <td></td> : <td><Image alt="Image" height={20} width={20} src='/PDE/images/delete-icon.svg' onClick={() => DeleteItemStructure(index)} className={styles.tableactionImg} style={{ cursor: 'pointer' }} /></td>}
                                                                                    </tr>)
                                                                                })}
                                                                            </tbody>
                                                                        </Table>
                                                                    </div> : []}
                                                            </Row>
                                                        </div>
                                                    </div>

                                                )}
                                                <Row className="mb-2 mt-3">
                                                    <p className={` ${styles.getTitle} ${styles.HeadingText}`}>Property Boundary Details [ఆస్తి హద్దుల వివరాలు]</p>
                                                    <Col lg={3} md={6} xs={12} className='mt-3'>
                                                        <TableText label={"North Side [ఉత్తరం వైపు]"} required={true} LeftSpace={false} />
                                                        <TableInputText disabled={IsViewMode} type='text' required={true} name={'northBoundry'} value={PropertyDetails.northBoundry} onChange={onChange} placeholder={''} />
                                                    </Col>
                                                    <Col lg={3} md={6} xs={12} className='mt-3'>
                                                        <TableText label={"South Side [దక్షిణం వైపు]"} required={true} LeftSpace={false} />
                                                        <TableInputText disabled={IsViewMode} type='text' required={true} name={'southBoundry'} value={PropertyDetails.southBoundry} onChange={onChange} placeholder={''} />
                                                    </Col>
                                                    <Col lg={3} md={6} xs={12} className='mt-3'>
                                                        <TableText label={"East Side [తూర్పు వైపు]"} required={true} LeftSpace={false} />
                                                        <TableInputText disabled={IsViewMode} type='text' required={true} name={'eastBoundry'} value={PropertyDetails.eastBoundry} onChange={onChange} placeholder={''} />
                                                    </Col>
                                                    <Col lg={3} md={6} xs={12} className='mt-3'>
                                                        <TableText label={"West Side [పడమర వైపు]"} required={true} LeftSpace={false} />
                                                        <TableInputText disabled={IsViewMode} type='text' required={true} name={'westBoundry'} value={PropertyDetails.westBoundry} onChange={onChange} placeholder={''} />
                                                    </Col>
                                                </Row>

                                                <div className={styles.divider}></div>
                                                {PropertyDetails.mode === "edit" || PropertyDetails.mode === "add" ?
                                                    <Row>
                                                        <p className={` ${styles.getTitle} ${styles.HeadingText}`}>Link Document Details [లింక్ దస్తావేజుల వివరాలు]</p>
                                                        <Col lg={4} md={12} xs={12} className='mb-2'>
                                                            <TableText label={"District [జిల్లా]"} required={true} LeftSpace={false} />
                                                            <TableDropdownSRO required={false} options={DistrictList} name={"district"} value={LinkDocument.district} onChange={onChangeLinkDoc} />
                                                        </Col>
                                                        <Col lg={4} md={12} xs={12}>
                                                            <TableText label={"Sub Registrar Office [సబ్ రిజిస్ట్రార్ కార్యాలయం]"} required={true} LeftSpace={false} />
                                                            <TableDropdownSRO required={false} options={SROOfficeList} name={"sroOffice"} value={LinkDocument.sroOffice} onChange={onChangeLinkDoc} />
                                                        </Col>
                                                        <Col lg={4} md={12} xs={12} className='mb-2'>
                                                            <TableText label={"Link Document No. [లింక్ డాక్యుమెంట్ నెం.]"} required={true} LeftSpace={false} />
                                                            <TableInputText disabled={false} type='number' required={false} allowNeg={true} maxLength={7} name={'linkDocNo'} value={LinkDocument.linkDocNo} onChange={onChangeLinkDoc} placeholder={''} />

                                                        </Col>
                                                        <Col lg={4} md={12} xs={12}>
                                                            <TableText label={"Registration Year [నమోదు సంవత్సరం]"} required={true} LeftSpace={false} />
                                                            <TableInputText disabled={false} type='number' required={false} maxLength={7} name={'regYear'} value={LinkDocument.regYear} onChange={onChangeLinkDoc} placeholder={''} />
                                                        </Col>
                                                        <Col lg={4} md={12} xs={12}>
                                                            <TableText label={"Book No. [షెడ్యూల్ నెం.]"} required={false} LeftSpace={false} />
                                                            <TableInputText disabled={false} type='number' required={false} name={'bookNo'} value={LinkDocument.bookNo} onChange={onChangeLinkDoc} placeholder={''} />

                                                        </Col>
                                                        {Object.keys(LinkDocument).filter(k => !['scheduleNo', 'sroCode'].includes(k)).every(li => LinkDocument[li]) &&
                                                            <Col lg={12} md={12} xs={12}>
                                                                <div className={`${styles.ProceedContainer} ${styles.Linkbtn}`}>
                                                                    <button type="button" className='proceedButton' onClick={LinkDocData} >Add</button>
                                                                </div>
                                                            </Col>}
                                                    </Row> : null
                                                }
                                                {PropertyDetails && PropertyDetails.LinkedDocDetails && PropertyDetails.LinkedDocDetails.length > 0 ?
                                                    <Row>
                                                        <div className="pt-3">
                                                            <Table striped bordered hover className='TableData'>
                                                                <thead>
                                                                    <tr>
                                                                        <th className='sroColmn'>S.No.<span>[క్రమ సంఖ్య]</span></th>
                                                                        <th className='LinkDoc'>Link Document No.<span>[లింక్ పత్రం నెం.]</span></th>
                                                                        <th>Year<span>[సంవత్సరం]</span></th>
                                                                        <th>Schedule<span>[షెడ్యూల్]</span></th>
                                                                        <th>SRO Code<span>[SRO కోడ్]</span></th>
                                                                        <th>SRO Name<span>[పేరు]</span></th>
                                                                        <th>Action<span>[చర్య]</span></th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {PropertyDetails.LinkedDocDetails && PropertyDetails.LinkedDocDetails.length > 0 && PropertyDetails.LinkedDocDetails.map((SingleFetchDocument, index) => {
                                                                        return (
                                                                            <tr key={index}>
                                                                                <td>{index + 1}</td>
                                                                                <td>{SingleFetchDocument.linkDocNo}</td>
                                                                                <td>{SingleFetchDocument.regYear}</td>
                                                                                <td>{SingleFetchDocument.bookNo}</td>
                                                                                <td>{SingleFetchDocument.sroCode}</td>
                                                                                <td>{SingleFetchDocument.sroOffice}</td>
                                                                                <td><Image alt="Image" height={20} width={20} src='/PDE/images/delete-icon.svg' onClick={() => DeleteItemLinkDocument(index)} className={styles.tableactionImg} style={{ cursor: 'pointer' }} /></td>
                                                                            </tr>
                                                                        )
                                                                    })}

                                                                </tbody>
                                                            </Table>
                                                        </div>
                                                    </Row> : null
                                                }
                                                <div className={styles.divider}></div>
                                                {AllowProceed && !IsViewMode ?
                                                    <Row className="mb-2">

                                                        <Col lg={12} md={12} xs={12}>
                                                            <div className={styles.ProceedContainer}>
                                                                <button className='proceedButton'>{PropertyDetails.mode == "edit" ? "Update" : "Proceed"} </button>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                    : null}
                                            </form>
                                        }
                                        {showdata &&
                                            <div style={{ margin: "2rem 3rem" }}>
                                                <div style={{ position: "relative", fontSize: "1.2rem", }}>
                                                    <text style={{ color: 'blue' }} >Do You Want Certified MV Report ?</text>
                                                    <div style={{ position: "absolute", left: "24rem", top: "0px" }}>
                                                        <input
                                                            type="checkbox"
                                                            id="yesCheckbox"
                                                            value="Yes"
                                                            checked={selection === 'Yes'}
                                                            onChange={handleSelection}
                                                        />
                                                        <label style={{ marginLeft: "5px" }} htmlFor="yesCheckbox">
                                                            Yes
                                                        </label>
                                                    </div>
                                                    <div style={{ position: "absolute", left: "28rem", top: "0px" }}>
                                                        <input
                                                            type="checkbox"
                                                            id="noCheckbox"
                                                            value="No"
                                                            checked={selection === 'No'}
                                                            onChange={handleSelection}
                                                        />
                                                        <label style={{ marginLeft: "5px" }} htmlFor="noCheckbox">
                                                            No
                                                        </label>
                                                    </div>
                                                </div>
                                                {selection === 'Yes' &&
                                                    <div>
                                                        <div>
                                                            <text className={styles.UploadText} style={{ color: 'red' }} >*Please make the payment by clicking on the payment link and click on verify payment status to Complete.</text>
                                                        </div>
                                                        <div>
                                                            <text className={styles.UploadText} style={{ fontWeight: 'bold' }}>Payment Guidelines: </text>
                                                            <a href='https://drive.google.com/file/d/1tUGzbUDrErXABENRBSQXlzrYgTj0v10D/view?usp=sharing' target="_blank" rel="noreferrer" className={styles.UploadText} >View Payment Instructions</a>
                                                        </div>
                                                        <text className={styles.UploadText} style={{ fontWeight: 'bold' }}>Payment Link : </text>
                                                        <a href='javascript:void(0)' onClick={() => handlePaymentLinkClick()} rel="noreferrer" className={styles.UploadText} >Click here to Pay</a>
                                                        <div>
                                                            <text className={styles.UploadText} style={{ fontWeight: 'bold' }}>Verify Payment Status: </text>
                                                            <a href='javascript:void(0)' onClick={(e) => { GetTransactionStatus(reqNo) }} rel="noreferrer" >Click Here to Verify</a>
                                                        </div>
                                                        <div>
                                                            {showInputs &&
                                                                <Modal className='text-center ' show={showInputs} onHide={handlesetclose} backdrop='static'>
                                                                    <Modal.Header closeButton className=' modalheadbg '  >
                                                                        <Modal.Title className='ms-5 ps-5 text-center text-white '></Modal.Title>
                                                                    </Modal.Header>
                                                                    <Modal.Body >
                                                                        <Container>
                                                                            <Table bordered hover className='TableData mt-4 mb-4'>
                                                                                <thead style={{ height: "2rem" }}>
                                                                                    <tr>
                                                                                        <th style={{ width: "10%" }}>REQUEST NO.</th>
                                                                                        <th>DEPARTMRNT TRANSACTION ID</th>
                                                                                        <th>PAID AMOUNT</th>
                                                                                    </tr>
                                                                                </thead>
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td style={{ width: "10%" }}>{payData.reqno ? payData.reqno : ''}</td>
                                                                                        <td>{payData.deptTransID ? payData.deptTransID : ''}</td>
                                                                                        <td>{payData.amount ? payData.amount : ''}</td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </Table>
                                                                        </Container>
                                                                    </Modal.Body>
                                                                </Modal>
                                                            }
                                                        </div>
                                                    </div>
                                                }
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
            {ppbyPass.status == true && <Container>
                <div className={Popstyles.reportPopup}>
                    <div className={Popstyles.container}>
                        <div className={Popstyles.Messagebox}>
                            <div className={Popstyles.header}>
                                <div className={Popstyles.letHeader} >
                                    <p className={Popstyles.text}>Document</p>
                                </div>
                                <div>
                                    <ImCross onClick={OnCancelAction} className={Popstyles.crossButton} />
                                </div>
                            </div>
                            <div style={{ paddingLeft: '1rem', paddingRight: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }} className={Popstyles.popupBox}>
                                <div className={Popstyles.SuccessImg}>
                                    {String(ppbyPass.value).includes(",") ? <div className={Popstyles.docText}>
                                        The Entered {ppbyPass.type} s ({ppbyPass.value}) were Prohibited
                                    </div>
                                        :
                                        <div className={Popstyles.docText}>
                                            The Entered {ppbyPass.type} ({ppbyPass.value}) is Prohibited One!
                                        </div>
                                    }
                                    <div className={Popstyles.docText}>
                                        Do you want to Proceed?
                                    </div>
                                    <div className='text-center d-flex'>
                                        <button className={Popstyles.yesBtn} onClick={() => onClickDocs('Y')}>YES</button>
                                        <button className={Popstyles.noBtn} onClick={() => onClickDocs('N')}>NO</button>
                                    </div>
                                </div>
                                <p className={Popstyles.message}></p>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>}
            {show && <Modal className='text-center ' show={show} onHide={handleClose} backdrop='static'>
                <Modal.Header closeButton className=' modalheadbg '  >
                    <Modal.Title className='ms-5 ps-5 text-center text-white '></Modal.Title>
                </Modal.Header>
                <Modal.Body className=''>
                    <Container>

                        <Row className='fw-2'>
                            <Col lg={12} md={12} xs={12} className=''>
                                <div className=' '>
                                    <div className='p-1'><p className='text-success'>Market value assistance report has been generated succesfully with below Duty Fee bearing Req-No: <span className='fw-bold text-danger'>{reqNo}</span> </p></div>

                                </div>
                            </Col>
                        </Row>

                        <Row className='fw-2'>
                            <Col lg={12} md={12} xs={12} className=''>
                                <div className=' '>

                                    <Row>
                                        <Col lg={6} md={6} xs={6} ><p className='popuptext'>Stamp Duty(₹)</p></Col>
                                        <Col lg={2} md={2} xs={2}><p>:</p></Col>
                                        <Col lg={4} md={4} xs={4}><strong className='font-weight-bold'>{CalculatedDutyFee.sd_p ? CalculatedDutyFee.sd_p : 0}</strong></Col>
                                    </Row>
                                    <Row>
                                        <Col lg={6} md={6} xs={6} ><p className='popuptext'>Transfer Duty(₹)</p></Col>
                                        <Col lg={2} md={2} xs={2}><p>:</p></Col>
                                        <Col lg={4} md={4} xs={4}><strong className='font-weight-bold'>{CalculatedDutyFee.td_p ? CalculatedDutyFee.td_p : 0}</strong></Col>
                                    </Row>
                                    <Row>
                                        <Col lg={6} md={6} xs={6} ><p className='popuptext'>Registration fee(₹)</p></Col>
                                        <Col lg={2} md={2} xs={2}><p>:</p></Col>
                                        <Col lg={4} md={4} xs={4}><strong> {CalculatedDutyFee.rf_p ? CalculatedDutyFee.rf_p : 0}</strong></Col>
                                    </Row>
                                    <Row>
                                        <Col lg={6} md={6} xs={6} ><p className='popuptext'>User Charges(₹) </p></Col>
                                        <Col lg={2} md={2} xs={2}><p>:</p></Col>
                                        <Col lg={4} md={4} xs={4}><strong>500</strong></Col>
                                    </Row>

                                    <Row>
                                        <Col lg={6} md={6} xs={6} ><p className='popuptext'>Consideration Value(₹)  </p></Col>
                                        <Col lg={2} md={2} xs={2}><p>:</p></Col>
                                        <Col lg={4} md={4} xs={4}><strong>{PropertyDetails.amount ? PropertyDetails.amount : "0"}</strong></Col>
                                    </Row>
                                    <Row>
                                        <Col lg={6} md={6} xs={6} ><p className='popuptext'>Market Value(₹)  </p></Col>
                                        <Col lg={2} md={2} xs={2}><p>:</p></Col>
                                        <Col lg={4} md={4} xs={4}><strong>{marketvaluecal.length > 0 ? marketvaluecal[0].marketValue : 0}</strong></Col>
                                    </Row>
                                    <Row>
                                        <Col lg={6} md={6} xs={6} ><p className='popuptext'>Total Payable(₹) </p></Col>
                                        <Col lg={2} md={2} xs={2}><p>:</p></Col>
                                        <Col lg={4} md={4} xs={4}><strong> <strong>{Number(CalculatedDutyFee.sd_p) + Number(CalculatedDutyFee.td_p) + Number(CalculatedDutyFee.rf_p) + 500}</strong></strong></Col>
                                    </Row>
                                </div>
                            </Col>
                        </Row>
                        <Row className="mb-2">
                            <Col lg={12} md={12} xs={12}>
                                <div className={styles.ProceedContainer}>
                                    <button className='proceedButton' onClick={handlePreviewPDF}> Download Report</button>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </Modal.Body>
            </Modal>
            }
            {/* <pre>{JSON.stringify(RequiredFields,null,2)}</pre> */}
            {/* <pre>{JSON.stringify(ApplicationDetails,null,2)}</pre> */}
            {/* <pre>{JSON.stringify(VillageCodeList.length , null, 2)}</pre> */}
            {/* <pre>{JSON.stringify(localBodyTypeList, null, 2)}</pre> */}
            {/* <pre>{JSON.stringify(PropertyDetails, null, 2)}</pre> */}
            {/* <pre>{Object.keys(PropertyDetails).length}</pre> */}
            {/* <pre>{JSON.stringify(CDMADetails,null,2)}</pre> */}
            {/* {PropertyDetails.structure.length?<pre>{MasterCodeIdentifier("StageOfCons",PropertyDetails.structure[0].StageOfCons)}</pre>:null} */}
            {/* <pre>{MasterCodeIdentifier("StageOfCons","Foundation2")}</pre> */}
            {/* <button onClick={()=>window.alert(PropertyDetails.structure[0].stageOfCons+"="+MasterCodeIdentifier("StageOfCons",PropertyDetails.structure[0].stageOfCons))}>abc</button> */}
            {/* <pre>{JSON.stringify(IsViewMode)}</pre> */}
            {/* <pre>{JSON.stringify(leaseData,null,2)}</pre>
            <pre>{JSON.stringify(ApplicationDetails,null,2)}</pre> */}
            {/* <pre>{JSON.stringify(ApplicationDetails,null,2)}</pre> */}
            {/* <pre>{JSON.stringify(PropertyDetails,null,2)}</pre>  */}
            {/* <pre>{JSON.stringify(PropertyDetails,null,2)}</pre>  */}
        </div>
    )
}

export default PropertyDetailsPage_B;



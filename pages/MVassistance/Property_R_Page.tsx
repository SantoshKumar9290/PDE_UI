import { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import styles from '../../styles/pages/Mixins.module.scss';
import TableInput from '../../src/components/TableInput';
import TableDrpDown from '../../src/components/TableDrpDown';
import TableInputRadio from '../../src/components/TableInputRadio';
import { Loading } from "../../src/redux/hooks";
import Table from 'react-bootstrap/Table';
import { useRouter } from 'next/router';
import { useAppSelector, useAppDispatch } from '../../src/redux/hooks';
import { useGetDistrictList, UseGetVillageCode, UselocalBodies, UseGetHabitation, UseMVAMVCalculator, useGetMandalList, UseGetVgForPpAndMV, useGetVillagelList, getSroDetails, UseDutyCalculator, UseGetlpmCheck, Mvadata, mvAssitanceReport, GetPaymentStatus, UseSaveMVrequestDetails, previewPDF, UpdatePaymentMVRequest, UseGetPPCheck, lpmbasenumber, lpmform4check } from '../../src/axios';
import { SavePropertyDetails } from '../../src/redux/formSlice';
import { PopupAction } from '../../src/redux/commonSlice';
import Image from 'next/image';
import Head from 'next/head';
import { CallingAxios, MasterCodeIdentifier, ShowMessagePopup, MuncipleKeyNameIdentifier, DoorNOIdentifier, TotalMarketValueCalculator } from '../../src/GenericFunctions';
import Modal from 'react-bootstrap/Modal';
import TableText from '../../src/components/TableText';
import TableInputText from '../../src/components/TableInputText';
import Popstyles from '../../styles/components/PopupAlert.module.scss';
import { ImCross } from 'react-icons/im';



const DropdownOptions = {
    DropdownOptionsList: ["A", "B"],
    UnitList: ["SQ. FEET", "SQ. YARD"],
    BooknoList: ["1", "2", "3"]
}

const UnitRateTypes = {
    RateList: [{ label: 'Non-Agriculture Rates' }, { label: 'Agriculture Rates' }],
}

const DropdownList = {
    LocalBodyTypesList: [{ localBodyType: 'MUNICIPAL CORPORATION [మున్సిపల్ కార్పొరేషన్]', localBodyCode: "1" }, { localBodyType: 'SPL./SELECTION GRADE MUNICIPALITY [స్పెషల్ సెలక్షన్ గ్రేడ్ మున్సిపాలిటీ]', localBodyCode: "2" }, { localBodyType: 'OTHER MUNICIPALITY/NOTIFIED AREA [ఇతర మునిసిపాలిటీ / నోటిఫైడ్ ఏరియా]', localBodyCode: "3" },
    { localBodyType: 'MAJOR GRAM PANCHAYAT [మేజర్ గ్రామ పంచాయితీ]', localBodyCode: "5" }, { localBodyType: 'Cantonment Board [కంటోన్మెంట్ బోర్డు]', localBodyCode: "6" }, { localBodyType: 'GRADE/OTHER MUNICIPALITY UNDER UA [అర్బన్ అగ్లామరేషన్ లోని గ్రేడ్ 1 మున్సిపాలిటీ మరియు ఇతర మున్సిపాలిటీ]', localBodyCode: "7" }, { localBodyType: 'MAJOR GRAM PANCHAYATH UNDER UA [అర్బన్ అగ్లామరేషన్ లోని మేజర్ గ్రామ పంచాయతీ]', localBodyCode: "8" }],
    LandUseList: []
}

const Property_R_Page = () => {
    const router = useRouter();
    const dispatch = useAppDispatch()
    const [activepage, setActivepage] = useState(false);
    let initialGetstartedDetails = useAppSelector(state => state.form.GetstartedDetails);
    const [GetstartedDetails, setGetstartedDetails] = useState(initialGetstartedDetails);
    let LoginDetails: any = useAppSelector(state => state.login.loginDetails);
    const [DistrictList, setDistrictList] = useState([]);
    const [SROOfficeList, setSROOfficeList] = useState([]);
    let initialPropertyDetails = useAppSelector(state => state.form.PropertyDetails);
    const [PropertyDetails, setPropertyDetails] = useState<any>(initialPropertyDetails);
    const [WeblandDetails, setWeblandDetails] = useState({ totalExtentAcers: "", totalExtentCents: "", conveyedExtentAcers: "", conveyedExtentCents: "", khataNumber: "" })
    const [WeblanList, setWeblanList] = useState({ message: "", data: [] });
    const [MandalList, setMandalList] = useState([]);
    const [VillagefrMandalList, setVillagefrMandalList] = useState([]);
    const [VillageList, setVillageList] = useState([]);
    const [VillageCodeList, setVillageCodeList] = useState([]);
    const [HabitationList, setHabitationList] = useState([]);
    const [localBodyTypeList, setLocalBodyTypeList] = useState([]);
    const [localBodyNameList, setLocalBodyNameList] = useState([]);

    const [HabitationCodeList, setHabitationCodeList] = useState([]);
    const [IsViewMode, setIsViewMode] = useState(false);
    const [CalculatedDutyFee, setCalculatedDutyFee] = useState({ TRAN_MAJ_CODE: "", TRAN_MIN_CODE: "", sroCode: "", amount: "", rf_p: "0", td_p: "0", sd_p: "0", marketValue: "0" })
    const [lpmValue, setLpmValue] = useState(0);
    const [distCode, setDistCode] = useState<any>("");
    const [wbVgCode, setwbVegCode] = useState<any>("");
    const [reqNo, setReqNo] = useState(null);
    const [payData, setPayData] = useState<any>({})
    const [show, setShow] = useState(false);
    const [showdata, setshowdata] = useState(false)
    const [showInputs, setShowInputs] = useState(false);
    const [selection, setSelection] = useState('');
    const [VILLCD, setVILLCD] = useState('');
    const [ApplicationDetails, setApplicationDetails] = useState<any>({ applicationId: "", executent: [], claimant: [] });
    const [AllowProceed, setAllowProceed] = useState(false);
    const [ppbyPass, setPpByPass] = useState<any>({ status: false, type: "", value: "" })    


    const GetVgForPPandMv = async (vgCode: any) => {
        if (vgCode && vgCode.length === 6) {
            vgCode = '0' + vgCode;
        }
        let result = await CallingAxios(UseGetVgForPpAndMV("Sr", vgCode));
        if (result.status) {
            let data = result.data;
            if (data && data.length > 0 && data[0].VILLCD != "")
                setVILLCD(data[0].VILLCD);
            GetLpmCheck(data[0].VILLCD)


        }
        else {
            return ShowMessagePopup(false, "Fetch vgCode list failed", "")
        }
    }

    const GetLpmCheck = async (VillageCode: any) => {
        let result = await CallingAxios(UseGetlpmCheck(VillageCode));
        if (result.status) {
            let data = result.data;
            setLpmValue(Number(data[0].CNT))
        }
        else {
            return ShowMessagePopup(false, "Fetch habitation list failed", "")
        }
    }

    const handleSelection = (e) => {
        setSelection(e.target.value);
    };

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
        setshowdata(true)
    };

    const handlesetclose = () => {
        redirectToPage('/MVassistance/MvaLandingpage');
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

    const onClickDocs = async (type: String) => {
        if (type == "Y") {
            // setPValue(true);
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
            // setPValue(false)
            OnCancelAction();
        }
    }
    const OnCancelAction = async () => {
        setPpByPass({ status: false, type: "", value: "" });
    }

    const ppRestrictionBypass = async (data: any, type: any, val: any) => {
        if (data != "NO") {
            setPpByPass({ status: true, type: type, value: val })
            setAllowProceed(false);
        } else {
            setAllowProceed(true);
            ShowMessagePopup(true, `Prohibited Property Check for ${type === "survayNo" ? "surveyNO" : type} ${val} is clear for Registration`, "");
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
                // window.alert(JSON.stringify(i))
                data = {
                    ward: PropertyDetails.ward,
                    block: PropertyDetails.block,
                    dNo: i,
                    sroCode: PropertyDetails.sroCode,
                    serveyNo: null,
                    villageCode: vgCode,
                    proField: "R_DNO"
                }
                const response = await UseGetPPCheck(data, "rural");
                if (response.status) {
                    let data = response.data[0]
                    for (let value of Object.values(data)) {
                        if (value != "NO") {
                            ppDr = ppDr == "" ? i : ppDr + "," + i

                            // ShowMessagePopup(false, "Selected Property is Prohibitated", "");
                            if (ApplicationDetails.registrationType.TRAN_MAJ_CODE == "02") {
                                setAllowProceed(true);
                            }
                            else {
                                await ppRestrictionBypass(value, type, ppDr);
                            }
                            // ShowMessagePopup(false, `Selected Property is Prohibitated of Door No:${i}`, "");
                        }
                        else {
                            await ppRestrictionBypass(value, type, i);
                            // ShowMessagePopup(true, "PP-Check is clear for Registration", "");
                            // setAllowProceed(true);
                            // ShowMessagePopup(true, "Prohibited Property Check is clear for Registration", "");
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
                                sroCode: PropertyDetails.sroCode,
                                serveyNo: PropertyDetails.survayNo,
                                villageCode: vgCode,
                                proField: "A_SNO"
                            }
                const response = await UseGetPPCheck(data, "rural");
                if (response.status) {
                    let data = response.data[0]
                    for (let value of Object.values(data)) {
                        if (value != "NO") {
                            ppSrvy = ppSrvy == "" ? i : ppSrvy + "," + i

                            // ShowMessagePopup(false, "Selected Property is Prohibitated", "");
                            if (ApplicationDetails.registrationType.TRAN_MAJ_CODE == "02") {
                                setAllowProceed(true);
                            }
                            else {
                                await ppRestrictionBypass(value, type, ppSrvy);
                            }
                            // ShowMessagePopup(false, `Selected Property is Prohibitated of Door No:${i}`, "");
                        }
                        else {
                            await ppRestrictionBypass(value, type, i);
                            // ShowMessagePopup(true, "PP-Check is clear for Registration", "");
                            // setAllowProceed(true);
                            // ShowMessagePopup(true, "Prohibited Property Check is clear for Registration", "");
                        }
                    }
                }
                // try {
                //     const response = await CallingPPCheck(data);
                //     if (!response) {
                //         setAllowProceed(false);
                //         ShowMessagePopup(false, "Selected Property is Prohibited of Survey No:" + SurvayNoArray[i], "");
                //         return;
                //     }
                // } catch (error) {
                //     setAllowProceed(false);
                //     ShowMessagePopup(false, "Selected Property is Prohibited of Survey No:" + SurvayNoArray[i], "");
                //     return;
                // }
            }
            //ShowMessagePopup(true, "Prohibited Property Check is clear for Registration", "");
        }
    }
    const ShowAlert = (type, message) => { dispatch(PopupAction({ enable: true, type: type, message: message })); }

    const redirectToPage = (location: string) => {
        router.push({
            pathname: location,
        })
    }

    useEffect(() => {
        GetDistrictList();
        let data2: any = localStorage.getItem("Property");
        if (data2 == "" || data2 == undefined) {
            ShowMessagePopup(false, "Invalid Access", "/MVassistance/Property");
        }
        else {
            data2 = JSON.parse(data2);
            setApplicationDetails(data2);
            dispatch(SavePropertyDetails(PropertyDetails));
            GetVgForPPandMv(data2.villageCode)
            GetLpmCheck(data2.villageCode)
            if (data2.mode === 'edit') {
                if (data2.habitationCode) {
                    GetLocalBodiesData(data2.habitationCode)
                }
            }
            if (MandalList.length == 0) {
                let selected = DistrictList.find(e => e.name == data2.district);
                if (selected) { GetMandalList(selected.id); }
            }
            if (VillageCodeList.length == 0) {
                GetVillageCode(data2.sroCode);
            }
            if (data2.villageCode && HabitationCodeList.length == 0) {
                GetHabitation(data2.villageCode);
            }
            if (data2.conveyedExtent && data2.conveyedExtent.length) {
                let ExtentList = [];
                data2.conveyedExtent.map((x, i) => {
                    ExtentList.push({ totalExtentAcers: data2.tExtent.split('.')[0], totalExtentCents: data2.tExtent.split('.')[1], conveyedExtentAcers: x.extent.split('.')[0], conveyedExtentCents: x.extent.split('.')[1], survayNo: data2.survayNo.split(',')[i] });
                })
                data2 = { ...data2, ExtentList: ExtentList }
            }

            if (data2.mode == "view") {
                setIsViewMode(true);
            } else {
                setIsViewMode(false);
            }
            setPropertyDetails(data2.mode === 'edit' ? { ...data2, localBodyType: data2.localBodyCode } : data2);
        }
    }, []);

    const [marketvaluecal, setMarketvaluecal] = useState([])
    const MVA_YEAR = new Date().getFullYear();
    useEffect(() => {
        let Details = { ...PropertyDetails };
        let ext: any;
        let servNo: any;
        Details.conveyedExtent = [];
        Details.tExtent = "";
        let units = Details.propertyType.includes("RURAL") === true ? 'A' : 'Y';
        for (let ex of Details.ExtentList) {
            ext = ex.conveyedExtentAcers + "." + ex.conveyedExtentCents;
            servNo = ex.survayNo;

            const conveyedExt: any = {};
            conveyedExt.extent = `${ex.conveyedExtentAcers}.${ex.conveyedExtentCents}`;
            if (Details.tExtent === "") {
                Details.tExtent = parseFloat(conveyedExt.extent);
            } else {
                Details.tExtent = parseFloat(Details.tExtent) + parseFloat(conveyedExt.extent);
            }
            conveyedExt.unit = units;
            conveyedExt.srvyNo = ex.survayNo;
            let MVResult = MVCalculator(ext, servNo);
        }
        TotalMarketValueCalculator(ApplicationDetails);
    }, [PropertyDetails.amount])

    const DutyFeeCalculator = async (data: any) => {
        let result = await UseDutyCalculator(data);
        let mvddata = data;
        if (result.status) {
            setCalculatedDutyFee({ ...CalculatedDutyFee, TRAN_MAJ_CODE: PropertyDetails.registrationType.TRAN_MAJ_CODE, TRAN_MIN_CODE: PropertyDetails.documentNature.TRAN_MIN_CODE, sroCode: PropertyDetails.sroCode, amount: PropertyDetails.amount, sd_p: result.data.sd_p, td_p: result.data.td_p, rf_p: result.data.rf_p });
            let mvdata = {
                "REQ_NO": '',
                "SR_CODE": PropertyDetails.sroCode,
                "TRAN_MAJ_CODE": PropertyDetails.documentNature.TRAN_MAJ_CODE,
                "TRAN_MIN_CODE": PropertyDetails.documentNature.TRAN_MIN_CODE,
                "LOCAL_BODY": 3,
                "WARD_NO": PropertyDetails.ward,
                "BLOCK_NO": PropertyDetails.block,
                "LOC_CODE": '',
                "LOC_HAB_NAME": PropertyDetails.habitation,
                "ROAD_CODE": '',
                "NEW_HOUSE_NO": DoorNOIdentifier(PropertyDetails.doorNo),
                "OLD_HOUSE_NO": "",
                "VILLAGE_CODE": PropertyDetails.villageCode,
                "HAB_CODE": PropertyDetails.habitationCode,
                "SURVEY_NO": PropertyDetails.survayNo === "" ? PropertyDetails.lpmNo : PropertyDetails.survayNo,
                "FLAT_NONFLAT": PropertyDetails.flatNo,
                "TOT_FLOOR": '',
                "EXTENT": mvddata.ext_Rate,
                "UNIT": 'A',
                "NATURE_USE": '',
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
                "BI_WARD": "",
                "BI_BLOCK": "",
                "PROHIBITED_PROPERTY": (PropertyDetails && PropertyDetails.isPrProhibitedDoorNO ? 'Y' : PropertyDetails.isPrProhibitedSurveyNO ? 'Y' : ""),
                "EXTENT_VALUE": `${(PropertyDetails.ExtentList[0].conveyedExtentAcers)}.${(PropertyDetails.ExtentList[0].conveyedExtentCents)}`
            }
            let mvresult = await CallingAxios(Mvadata(mvdata));
            if (mvresult.data.REQ_NO > 0) {
                let mvarepdata = {
                    SR_CODE: PropertyDetails.sroCode,
                    REQ_NO: mvresult.data.REQ_NO,
                    proptype: PropertyDetails.documentNature.TRAN_DESC,
                    consvalue: PropertyDetails.amount,
                    LPM: PropertyDetails.lpmNo,
                    PP: (PropertyDetails && PropertyDetails.isPrProhibitedDoorNO ? PropertyDetails.isPrProhibitedDoorNO : PropertyDetails.isPrProhibitedSurveyNO ? PropertyDetails.isPrProhibitedSurveyNO : ""),
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
                }
                else {
                    console.error('No valid PDF data found in the response');
                }
            }
        }
    }

    const MVreqDetails = async (reqNo: any) => {
        let data: any = {
            "REQ_NO": reqNo,
            "SR_CODE": PropertyDetails.sroCode,
            "REG_YEAR": MVA_YEAR,
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

    const GetDistrictList = async () => {
        let result = await CallingAxios(useGetDistrictList());
        if (result.status) {
            setDistrictList(result.data);
        }
        else {
            ShowMessagePopup(false, result.message, "")
        }
    }

    const GetVillageCode = async (sroCode: string) => {
        if (sroCode) {
            let result = await CallingAxios(UseGetVillageCode(sroCode));
            if (result.status) {
                let data = result.data;
                let newData = [];
                data.map(x => {
                    newData.push(x.VILLAGE_NAME);
                })
                let sortedResult = newData.sort((a, b) => a < b ? -1 : 1)

                setVillageList(newData ? sortedResult : []);
                setVillageCodeList(data);
            }

            else {
                return ShowMessagePopup(false, "Fetch village list failed", "");
            }
        }
    }

    const GetHabitation = async (VillageCode: any) => {
        let result = await CallingAxios(UseGetHabitation(VillageCode, "rural"));
        if (result.status) {
            let data = result.data;
            let newData = [];
            data.map(x => {
                newData.push(x.HAB_NAME);
            })
            setHabitationList(newData);
            setHabitationCodeList(data);
        }
        else {
            return ShowMessagePopup(false, "Fetch habitation list failed", "")
        }
    }

    const GetMandalList = async (id: any) => {
        let result = await CallingAxios(useGetMandalList(id));
        if (result.status) {
            let sortedResult = result.data.sort((a, b) => a.name < b.name ? -1 : 1)
            setMandalList(sortedResult);
        }
        else {
            ShowMessagePopup(false, "Unable to fetch mandal list", "")
        }
    }

    const GetLocalBodiesData = async (id: any) => {
        let result = await CallingAxios(UselocalBodies(id));
        if (result.status) {

            setLocalBodyNameList(result.data.map(lbt => lbt.LOCAL_BODY_NAME));
            setLocalBodyTypeList(DropdownList.LocalBodyTypesList.map(lbt => { return { type: lbt.localBodyType, code: lbt.localBodyCode } }))
        }
        else {
            ShowMessagePopup(false, "Unable to fetch local bodies list", "")
        }
    };

    const GetVillageList = async (id: any, distcode: any) => {
        let result = await CallingAxios(useGetVillagelList(id, distcode));
        if (result.status) {
            let sortedResult = result.data.sort((a, b) => a.name < b.name ? -1 : 1)
            setVillagefrMandalList(sortedResult);
        }
        else {
            ShowMessagePopup(false, "Unable to fetch village list", "")
        }
    }

    const GetSROOfficeList = async (id: any) => {
        let result = await CallingAxios(getSroDetails(id));
        if (result.status) {
            setSROOfficeList(result.data);
        }
    }

    const onChange = (event: any) => {
        let TempDetails = { ...PropertyDetails };
        let addName = event.target.name;
        let addValue = event.target.value;

        addValue = addValue.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, "");

        if (addName == 'northBoundry' || addName == 'southBoundry' || addName == 'eastBoundry' || addName == 'westBoundry') {
            addValue = addValue.replace(/[^\w\s/,-]/gi, "");
        }
        if (addName == "district") {
            setMandalList([]);
            let selected = DistrictList.find(e => e.name == addValue);
            TempDetails = { ...TempDetails, districtCode: selected.id }
            setDistCode(selected.id)
            if (selected)
                GetMandalList(selected.id);
        } else if (addName == "mandal") {
            setVillagefrMandalList([]);
            let selected = MandalList.find(e => e.name == addValue);
            let mandalCode = selected ? selected.id : "";
            TempDetails = { ...TempDetails, mandalCode }
            if (selected)
                GetVillageList(selected.id, distCode);
        }
        else if (addName == "survayNo") {
            let errorLabel = ""
            if (String(addValue).length < 10) {
                errorLabel = "Enter 10 Digits Number";
            }
            if (addValue.length > 10) {
                addValue = addValue.substring(0, 10);
            }
        }
        else if (addName == "villagefromMandals") {
            setSROOfficeList([]);
            let selected = VillagefrMandalList.find(e => e.name == addValue);
            let villageCode = selected ? selected.id : "";
            TempDetails = { ...TempDetails, villageCode }
            if (selected)
                GetSROOfficeList(selected.id);
        } else if (addName == "lpmNo") {
            TempDetails = { ...TempDetails, lpmNo: addValue }
        }
        else if (addName == "village") {
            setHabitationList([]);
            setWeblanList({ message: "", data: [] });
            let selected = VillageCodeList.find(e => e.VILLAGE_NAME == addValue);
            TempDetails = { ...TempDetails, villageCode: selected.VILLAGE_CODE, habitationCode: "", ExtentList: [] }
            if (selected && selected.VILLAGE_CODE)
                GetHabitation(selected.VILLAGE_CODE)
        } else if (addName == "habitation") {
            setLocalBodyNameList([]);
            setLocalBodyTypeList([]);
            TempDetails = { ...TempDetails, survayNo: "", localBodyName: "", localBodyType: "" }
            setWeblanList({ message: "", data: [] });
            let selected = HabitationCodeList.find(e => e.HAB_NAME == addValue);
            if (selected && selected?.HABITATION) {
                TempDetails = { ...TempDetails, habitationCode: selected.HABITATION, ExtentList: [] }
            }
            if (selected)
                GetLocalBodiesData(selected.HABITATION);
        } else if (addName == "survayNo") {
            setWeblanList({ message: "", data: [] });
        }
        else if (addName == 'surveyNo') {
            addValue = addValue.replace(/[0-9]/gi, "");
        }
        setGetstartedDetails({ ...GetstartedDetails, [addName]: addValue });
        setPropertyDetails({ ...TempDetails, [addName]: addValue });
    }

    const handleRadioChange = (e: any) => {
        setLpmValue(e.target.value);
        setPropertyDetails(prevDetails => ({
            ...prevDetails,
            survayNo: "",
            lpmNo: ""
        }));
    }

    const onSubmit = async (e: any) => {
        e.preventDefault();
        if (PropertyDetails?.ExtentList?.length == 0) {
            return ShowMessagePopup(false, "Please enter Conveyedextent Value", "");
        }
        else {
            let Details = { ...PropertyDetails };
            let tMvValue: Number = 0;
            let MVResult: any;
            if (Details?.ExtentList) {
                let ext: any;
                let servNo: any;
                Details.conveyedExtent = [];
                Details.tExtent = "";
                let units = Details.propertyType.includes("RURAL") === true ? 'A' : 'Y';
                for (let ex of Details.ExtentList) {
                    ext = ex.conveyedExtentAcers + "." + ex.conveyedExtentCents;
                    servNo = ex.survayNo;
                    const conveyedExt: any = {};
                    conveyedExt.extent = `${ex.conveyedExtentAcers}.${ex.conveyedExtentCents}`;
                    if (Details.tExtent === "") {
                        Details.tExtent = parseFloat(conveyedExt.extent);
                    } else {
                        Details.tExtent = parseFloat(Details.tExtent) + parseFloat(conveyedExt.extent);
                    }
                    conveyedExt.unit = units;
                    conveyedExt.srvyNo = ex.survayNo;
                    MVResult = await MVCalculator(ext, servNo);
                    conveyedExt.mvValue = MVResult.marketValue ? MVResult.marketValue : 0;
                    setMarketvaluecal([MVResult])
                    Details.conveyedExtent = [...Details.conveyedExtent, conveyedExt];
                }

                const ob1 = localBodyTypeList.filter(ob => ob.code == Details.localBodyType)[0];
                Details.localBodyType = ob1.type;
                Details.localBodyCode = ob1.code;
                Details.survayNo = AllSurvayNumberAdder(Details.conveyedExtent);
                Details.marketValue = AllMVAdder(Details.conveyedExtent);
                Details.isLinkedDocDetails = false;
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
                localStorage.setItem("Property", "");
            }
            else {
                ShowMessagePopup(false, "Extent List Missing", "");
            }
        }
    }

    const AllSurvayNumberAdder = (data: any) => {
        let total = '';
        data.map(x => { total = total + "," + x.srvyNo; })
        total = total.substring(1);
        return total;
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
            "REG_YEAR": MVA_YEAR,
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


    const AllMVAdder = (data: any) => {
        let total = 0;
        data.map(x => {
            total = total + (Number(data?.mvValue) ? Number(data?.mvValue) : 0)
        })
        return total;
    }


    const onAcresBlur = (e: any) => {
        if (parseFloat(WeblandDetails.totalExtentAcers) < parseFloat(e.target.value)) {
            e.target.value = [], null;
            ShowMessagePopup(false, "Conveyed extent value should be below the Total extent value", "");
        }
    }
    const onCentsBlur = (e: any) => {
        if (WeblandDetails.conveyedExtentCents.length === 1) {
            WeblandDetails.conveyedExtentCents = WeblandDetails.conveyedExtentCents + '0';
        }
        let totalExtAcOrCents = WeblandDetails.totalExtentAcers + "." + WeblandDetails.totalExtentCents;
        let convExtAcrOrCents = WeblandDetails.conveyedExtentAcers + "." + e.target.value;

        if (parseFloat(totalExtAcOrCents) < parseFloat(convExtAcrOrCents)) {
            ShowMessagePopup(false, "Conveyed extent value should be below the Total extent value", "");
        }
    }

    const weblandData = () => {
        let myWeblandDetails = [];
        if (PropertyDetails && PropertyDetails.ExtentList) {
            myWeblandDetails = [...PropertyDetails.ExtentList];
        }

        if (WeblandDetails.conveyedExtentCents.length === 1) {
            WeblandDetails.conveyedExtentCents = WeblandDetails.conveyedExtentCents + '0';
        }

        if (WeblandDetails.conveyedExtentAcers != "" && WeblandDetails.conveyedExtentCents != "") {

            let conExAcers: any = WeblandDetails.conveyedExtentAcers;
            let conExCents: any = WeblandDetails.conveyedExtentCents;

            let totConValue = '' + conExAcers + '.' + conExCents;
            let flag = 0;

            if (Number(totConValue)) {
                if (PropertyDetails && PropertyDetails.ExtentList) {
                    PropertyDetails.ExtentList.map((propData, index) => {
                        if (propData.khataNumber == WeblandDetails.khataNumber) {
                            conExAcers = parseInt(conExAcers) + parseInt(propData.conveyedExtentAcers);
                            conExCents = Number('.' + conExCents) + Number('.' + propData.conveyedExtentCents);
                            myWeblandDetails[index].conveyedExtentAcers = `${totConValue}`.includes('.') ? `${totConValue}`.split('.')[0] : `${totConValue}`;
                            myWeblandDetails[index].conveyedExtentCents = `${totConValue}`.includes('.') ? `${totConValue}`.split('.')[1] : `00`;
                            flag = 2;
                        }
                    });
                }

                if (flag === 0) {
                    let EditWeblandDetails = { ...WeblandDetails, survayNo: PropertyDetails.survayNo, lpmNo: PropertyDetails.lpmNo }
                    myWeblandDetails.push(EditWeblandDetails);
                }
                setWeblandDetails({ ...WeblandDetails, conveyedExtentAcers: "", conveyedExtentCents: "", khataNumber: "" });
                setPropertyDetails({ ...PropertyDetails, ExtentList: myWeblandDetails })
            }
        }
        else {
            ShowMessagePopup(false, "Please enter conveyed extent", "");
        }
    }

    const DeleteItemWebland = (sindex: number) => {
        let myWeblandDetails = [...PropertyDetails.ExtentList];
        myWeblandDetails.splice(sindex, 1);
    
        const isNowEmpty = myWeblandDetails.length === 0;
    
        setPropertyDetails({
            ...PropertyDetails,
            ExtentList: myWeblandDetails,
            ...(isNowEmpty
                ? lpmValue === 0
                    ? { survayNo: '' }
                    : { lpmNo: '' }
                : {}
            )
        });
    };

    const onChangeWebland = (e: any) => {
        let addName = e.target.name;
        let addValue = e.target.value;
        if (addName === 'conveyedExtentAcers' && addValue.length > 10) {
            addValue = addValue.slice(0, 10);
        }
        if (addName === 'conveyedExtentCents' && addValue.length > 3) {
            addValue = addValue.slice(0, 3);
        }
        setWeblandDetails({ ...WeblandDetails, [addName]: addValue });
    };


    let landExt: any;
    if (PropertyDetails && PropertyDetails.mode === "add") {
        if (PropertyDetails && PropertyDetails?.ExtentList && PropertyDetails?.ExtentList.length > 0) {
            let ext: any = 0;
            for (let i in PropertyDetails?.ExtentList) {
                let cmExt = PropertyDetails?.ExtentList[i].conveyedExtentAcers + "." + PropertyDetails.ExtentList[i].conveyedExtentCents
                if (ext === 0) {
                    ext = cmExt;
                } else {
                    ext = parseFloat(ext) + parseFloat(cmExt);
                }
            }
            landExt = ext;
        }
    } else if (PropertyDetails && PropertyDetails.mode === "edit") {
        landExt = PropertyDetails.tExtent;
    }

    const MVCalculator = async (landExt: any, srvNo: any) => {
        let srvyNum = PropertyDetails.lpmNo === "" || PropertyDetails.lpmNo === undefined ? srvNo : PropertyDetails.lpmNo;
        let vgCode = VILLCD  ? VILLCD : PropertyDetails.VILLCD;
        if(lpmValue >0){
                        let lpmdata ={
                        "villageCode": PropertyDetails.villageCode,                
                        "lpmNo":PropertyDetails.lpmNo            
                    }
                   let lpmbaseresult : any = await CallingAxios(lpmbasenumber(lpmdata)); 
               if(lpmbaseresult?.status ==false ){
                ShowAlert(false,`${lpmbaseresult.message}`)
                return false
               }
               else if(lpmbaseresult?.data?.filter(item => item.RecordType === "LpmNo").length===0){
                srvyNum=srvyNum ;
                   }
               else{
                    let lpmresponce :any = await CallingAxios(lpmform4check(lpmbaseresult));
                    if(lpmresponce?.status ==false){
                    ShowAlert(false,`${lpmresponce.message}`)
                    return false
                    }
                    srvyNum=(lpmresponce?.status && lpmresponce?.data && lpmresponce?.data.length>0 && lpmresponce?.data[0]?.SURVEY_NO )? lpmresponce?.data[0]?.SURVEY_NO :srvyNum ;            
                  } 
             }
        let data: any = {
            floor_no: "",
            stru_type: "",
            plinth: "",
            plinth_unit: "",
            stage: "",
            age: "",
            sroCode: PropertyDetails.sroCode,
            vill_cd: vgCode,
            habitation: PropertyDetails.habitation,
            habCode: PropertyDetails.habitationCode,
            wno: null,
            bno: null,
            house_no: "",
            nearby_boundaries: "",
            surveyno: srvyNum,
            nature_use: MasterCodeIdentifier("landUse", PropertyDetails.landUse),
            land_extent: landExt,
            land_unit: "A",
            total_floor: null,
            property_type: null,
            property_nature: "RURAL",
            localbody: MasterCodeIdentifier("localBody", PropertyDetails.localBodyType)
        }
        let result = await CallingAxios(UseMVAMVCalculator(data, "rural"));
        if (result.status) {
            return result.data;
        } else {
            return false;
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

    // const ValidSurvey = (value: any) => {
    //     if (value != "" && value =="0") {
    //             ShowMessagePopup(false, "Enter Valid SurveyNO", "");
    //             return false;
    //     }else{
    //         return true;
    //     }

    // }


    return (
        <div className='PageSpacing'>
            <Head>
                <title>Propert Details_Rural - Public Data Entry</title>
            </Head>
            <Container>
                <Row>
                    <Col lg={12} md={12} xs={12}>
                        <div className='tabContainerInfo'>
                            <Container>
                                <Row>
                                    <Col lg={12} md={12} xs={12} className='p-0'>
                                        <div className='tabContainer DutyfeeContainer py-2'>
                                            <div className='activeTabButton'>Stamp Duty(₹) : {CalculatedDutyFee.sd_p ? CalculatedDutyFee.sd_p : 0}<div></div></div>
                                            <div className='activeTabButton'>Transfer Duty(₹) : {CalculatedDutyFee.td_p ? CalculatedDutyFee.td_p : 0}<div></div></div>
                                            <div className='activeTabButton'>Registration fee(₹) : {CalculatedDutyFee.rf_p ? CalculatedDutyFee.rf_p : 0}<div></div></div>
                                            {GetstartedDetails?.documentNature && GetstartedDetails?.documentNature?.TRAN_MAJ_CODE === "08" && GetstartedDetails?.documentNature?.TRAN_MIN_CODE === "06" ?
                                            <div className='activeTabButton'>User Charges(₹) : 0<div></div></div>:
                                            <div className='activeTabButton'>User Charges(₹) : 500<div></div></div>
                                            }
                                            {/* <div className='activeTabButton'>User Charges(₹) : 500<div></div></div> */}
                                            <div className='activeTabButton'>Market Value(₹)  : {marketvaluecal.length > 0 ? marketvaluecal[0].marketValue : 0}<div></div></div>
                                            <div className='activeTabButton'>Consideration Value(₹) : {PropertyDetails.amount ? PropertyDetails.amount : "0"}<div></div></div>
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
                        <div className={`${styles.PropertyDetailsmain} ${styles.PropertyDetailsPage}`} style={{ marginTop: '50px' }}>
                            <Row className='ApplicationNum pt-0'>
                                <div className='ContainerColumn TitleColmn' onClick={() => { router.push("/MVassistance/Property") }}>
                                    <h4 className='TitleText left-title'>{ApplicationDetails.documentNature ? ApplicationDetails.registrationType.TRAN_DESC : null}</h4>
                                </div>
                            </Row>
                            <div className="mainWrapper py-2 ">
                                <div className="wrapperInner" style={{ marginTop: "20px" }}>
                                    <div className={styles.ExecutantDetailsInfo}>
                                        <div>
                                            <Row>
                                                <Col lg={6} md={6} xs={12}>
                                                    <div className="acknowledgement mt-2">
                                                        <button className="active btnHover partyDetails">4 . Property Details (Rural) [ఆస్తి వివరాలు (గ్రామీణ)]</button>
                                                    </div>
                                                </Col>
                                                <Col lg={6} md={6} xs={12}>
                                                </Col>
                                            </Row>
                                        </div>
                                        {!showdata &&
                                            <form onSubmit={onSubmit} className={styles.AddExecutantInfo}>
                                                <div className={` ${styles.getStartedpageCon}`}>
                                                    <Row className='mt-1'>
                                                        <h6 className={styles.getTitle}>Please Select Type of Registration and Nature of Document <span>[దయచేసి నమోదు రకం మరియు దస్తావేజు యొక్క స్వభావాన్ని ఎంచుకోండి]</span></h6>
                                                        <Col lg={6} md={6} xs={12}>
                                                            <div className='my-1'>
                                                                <TableText label={'Type of Registration [రిజిస్ట్రేషన్ రకం]'} required={true} LeftSpace={false} />
                                                                <TableInputText required={true} disabled={true} name={"registrationType"} value={PropertyDetails.registrationType ? PropertyDetails.registrationType.TRAN_DESC : null} onChange={onChange} placeholder={''} type={'text'} />
                                                            </div>
                                                        </Col>
                                                        <Col lg={6} md={6} xs={12}>
                                                            <div className='my-1'>
                                                                <TableText label={'Nature of Document [దస్తావేజు యొక్క స్వభావం]'} required={true} LeftSpace={false} />
                                                                <TableInputText disabled={true} required={true} type='text' name={"documentNature"} value={PropertyDetails.documentNature ? PropertyDetails.documentNature.TRAN_DESC : null} onChange={onChange} placeholder={''} />
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </div>
                                                <Row className="align-items-end" style={{ marginTop: '30px' }}>
                                                    <Col lg={4} md={6} xs={12} className='mb-3'>
                                                        <TableText label={'Total Consideration Value(₹) [మొత్తం ప్రతిఫలం విలువ]'} required={true} LeftSpace={false} />
                                                        <TableInputText type='number' required={true} disabled={true} name={'amount'} value={PropertyDetails.amount} onChange={onChange} placeholder={''} />
                                                    </Col>
                                                </Row>
                                                <Row>
                                                </Row>
                                                {activepage && (
                                                    <div className={styles.ExecutantDetailsInfo}>
                                                        <div className={styles.DetailsHeaderContainer} style={{ marginTop: '20px' }}>
                                                            <Row>
                                                                <Col lg={6} md={6} xs={12}>
                                                                    <div className={styles.ContainerColumn}>
                                                                        <p className={styles.HeaderText}>Unit Rates</p>
                                                                    </div>
                                                                </Col>
                                                                <Col lg={6} md={6} xs={12}>
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                        <div className={`${styles.AddExecutantInfo}, ${styles.UnitRateInto}`}>
                                                            <Row className="mb-2">
                                                                <Col>
                                                                    <TableInputRadio label='' options={UnitRateTypes.RateList} required={true} defaultValue='' name='' onChange={onChange} />
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col lg={3} md={6} xs={12}>
                                                                    <TableText label={'District'} required={true} LeftSpace={false} />
                                                                    <TableDrpDown required={true} options={DropdownOptions.DropdownOptionsList} name={''} onChange={onChange} value={''} keyName={''} label={''} errorMessage={''} keyValue={''} />
                                                                </Col>
                                                                <Col lg={3} md={6} xs={12}>
                                                                    <TableText label={'Mandal'} required={true} LeftSpace={false} />
                                                                    <TableDrpDown required={true} options={DropdownOptions.DropdownOptionsList} name={''} onChange={onChange} value={''} keyName={''} label={''} errorMessage={''} keyValue={''} />
                                                                </Col>
                                                                <Col lg={3} md={6} xs={12}>
                                                                    <TableText label={'Village'} required={true} LeftSpace={false} />
                                                                    <TableDrpDown required={true} options={DropdownOptions.DropdownOptionsList} name={''} onChange={onChange} value={''} keyName={''} label={''} errorMessage={''} keyValue={''} />
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col lg={12} md={12} xs={12}>
                                                                    <div className={styles.ProceedContainer}>
                                                                        <p className={styles.backText}>Back</p>
                                                                        <button className={styles.ProceedButton}>Submit</button>
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                    </div>
                                                )}
                                                <div className={styles.divider}></div>
                                                <Row className="mb-2">
                                                    <p className={` ${styles.getTitle} ${styles.HeadingText}`}>Which Jurisdiction district and SRO office is the property Located ? [ఏ సబ్ రిజిస్ట్రార్ కార్యాలయం పరిధి జిల్లాలో ఉన్న ఆస్తి?]</p>

                                                    <Col lg={6} md={6} xs={12} className='my-3'>
                                                        <TableText label={'Jurisdiction Registration District [అధికార పరిధి రిజిస్ట్రేషన్ జిల్లా]'} required={true} LeftSpace={false} />
                                                        <TableInputText type='text' required={true} disabled={true} name={'district'} value={PropertyDetails.district} onChange={onChange} placeholder={''} />
                                                    </Col>
                                                    <Col lg={6} md={6} xs={12} className='my-3'>
                                                        <div className='Inputgap'>
                                                            <TableText label={'Village [గ్రామం]'} required={true} LeftSpace={false} />
                                                            <TableInputText type='text' disabled={true} required={true} name={'village'} value={PropertyDetails.village} onChange={onChange} placeholder={''} />
                                                        </div>
                                                    </Col>
                                                    <Col lg={6} md={6} xs={12} className='my-3'>
                                                        <TableText label={'Jurisdiction Sub-Registrar [అధికార పరిధి సబ్ రిజిస్ట్రార్ కార్యాలయం]'} required={true} LeftSpace={false} />
                                                        <TableInputText type='text' required={true} disabled={true} name={'sroOffice'} value={PropertyDetails.sroOffice} onChange={onChange} placeholder={''} />
                                                    </Col>
                                                </Row>
                                                <div className={styles.divider}></div>
                                                <Row className="">
                                                    <p className={` ${styles.getTitle} ${styles.HeadingText}`}>Schedule of the property to be registered [రిజిస్ట్రేషన్ చేయవలసిన ఆస్తి యొక్క షెడ్యూల్]</p>
                                                    <Col lg={3} md={6} xs={12} className='my-3'>
                                                        <TableText label={'Village [గ్రామం]'} required={true} LeftSpace={false} />
                                                        <TableInputText disabled={true} type='text' required={false} name={'village'} value={PropertyDetails.village} onChange={onChange} placeholder={''} />
                                                    </Col>
                                                    <Col lg={3} md={6} xs={12} className='my-3'>
                                                        <TableText label={'Habitation [నివాసం]'} required={true} LeftSpace={false} />
                                                        {IsViewMode ? <TableInputText disabled={true} type='text' required={false} name={'habitation'} value={PropertyDetails.habitation} onChange={onChange} placeholder={''} />
                                                            : <TableDrpDown required={true} options={HabitationList} name={'habitation'} value={PropertyDetails.habitation} onChange={onChange} keyName={''} label={''} errorMessage={''} keyValue={''} />}
                                                    </Col>

                                                    <Col lg={3} md={6} xs={12} className='my-3'>
                                                        <TableText label={'Local Body Name [స్థానిక సంస్థ పేరు]'} required={true} LeftSpace={false} />
                                                        {IsViewMode ? <TableInputText disabled={true} type='text' required={false} name={'localBodyName'} value={PropertyDetails.localBodyName} onChange={onChange} placeholder={''} />
                                                            : <TableDrpDown required={true} options={localBodyNameList} name={'localBodyName'} value={PropertyDetails.localBodyName} onChange={onChange} keyName={''} label={''} errorMessage={''} keyValue={''} />}
                                                    </Col>

                                                    <Col lg={3} md={6} xs={12} className='my-3'>
                                                        <TableText label={'Local Body Type [స్థానిక సంస్థ రకం]'} required={true} LeftSpace={false} />
                                                        {IsViewMode ? <TableInputText disabled={true} type='text' required={false} name={'localBodyType'} value={PropertyDetails.localBodyType} onChange={onChange} placeholder={''}/>
                                                            : <TableDrpDown required={true} options={localBodyTypeList} name={'localBodyType'} value={PropertyDetails.localBodyType} onChange={onChange} keyName={'type'} label={''} errorMessage={''} keyValue={'code'} />
                                                        }
                                                    </Col>
                                                    {/* <div className='my-2'>
                                                        <TableInputRadio label={'Slect Village Type'} required={false} options={[{ label: "Survey No" }, { label: "LPM No" }]} defaultValue={lpmValue} name={''} onChange={handleRadioChange} />
                                                    </div> */}
                                                    {lpmValue === 0 ?
                                                        <Col lg={3} md={6} xs={12} className='my-2'>
                                                            <TableText label={'Survey No. [సర్వే నెం.]'} required={true} LeftSpace={false} />
                                                            {/* <TableInputText disabled={IsViewMode} type='text' required={true} placeholder='' name={'survayNo'} value={PropertyDetails.survayNo} onBlurCapture={e => { e.preventDefault(); if (!ValidSurvey(e.target.value)) { setPropertyDetails({ ...PropertyDetails, survayNo: '' }) } }} onChange={onChange} /> */}
                                                            <TableInputText disabled={IsViewMode || PropertyDetails.ExtentList.length > 0} onBlurCapture={() => { PPCheck("survayNo"); }} type='text' required={true} name={'survayNo'} value={PropertyDetails.survayNo} onChange={onChange} placeholder={''} />
                                                        </Col>
                                                        :
                                                        <Col lg={3} md={6} xs={12} className='my-2'>
                                                            <TableText label={'LPM No. [ఎల్ పి ఎమ్ నెం.]'} required={true} LeftSpace={false} />
                                                            <TableInputText disabled={IsViewMode  || PropertyDetails.ExtentList.length > 0} type='text' required={true} name={'lpmNo'} value={PropertyDetails.lpmNo} onChange={onChange} placeholder={''} />
                                                        </Col>
                                                    }
                                                </Row>
                                                <Row className="mb-0">
                                                    <Col lg={6} md={12} xs={12}>
                                                        <Col lg={12} md={12} xs={12}>
                                                            <h6>Conveyed Extent [బదిలీ చేసిన విస్తీర్ణం]</h6>
                                                        </Col>
                                                        <Row>
                                                            <Col lg={3} md={12} xs={12}>
                                                                <TableText label={'Acres [ఎకరాలు]'} required={true} LeftSpace={false} />
                                                                <TableInputText disabled={IsViewMode  || PropertyDetails.ExtentList.length > 0} type='number' required={false} name={'conveyedExtentAcers'} value={WeblandDetails.conveyedExtentAcers} onBlurCapture={onAcresBlur} dot={false} onChange={onChangeWebland} placeholder={''} />
                                                            </Col>
                                                            <Col lg={3} md={12} xs={12}>
                                                                <TableText label={'Cents [సెంట్లు]'} required={true} LeftSpace={false} />
                                                                <TableInputText disabled={IsViewMode  || PropertyDetails.ExtentList.length > 0} type='number' required={false} name={'conveyedExtentCents'} value={WeblandDetails.conveyedExtentCents} onBlurCapture={onCentsBlur} dot={false} onChange={onChangeWebland} placeholder={''} />
                                                            </Col>
                                                            <Col lg={4} md={12} xs={12}></Col>
                                                            {!PropertyDetails.ExtentList.length && !IsViewMode ? (
                                                                <Col lg={2} md={12} xs={12}>
                                                                    <button type='button' onClick={weblandData} className={`${styles.YesBtn} ${styles.AddyesBtn}`}>Add</button>
                                                                </Col>
                                                            ) : <div style={{ margin: '20px' }}></div>}
                                                        </Row>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    {PropertyDetails.ExtentList && PropertyDetails.ExtentList.length ?
                                                        <Table striped bordered hover className='TableData ListData mt-2'>
                                                            <thead>
                                                                <tr>
                                                                    {PropertyDetails.survayNo === "" ?
                                                                        <th className='boundaries'>LPM No.<span>[ఎల్ పి ఎమ్ నెం.]</span></th> :
                                                                        <th className='boundaries'>Survey No.<span>[సర్వే నెం.]</span></th>

                                                                    }
                                                                    <th>Conveyed Extent<span>[విస్తరించిన పరిధి]</span> </th>
                                                                    <th>Unit<span>[యూనిట్‌]</span></th>
                                                                    <th>Action<span>[చర్య]</span></th>

                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {PropertyDetails.ExtentList.map((x, index) => {
                                                                    return (<tr key={index}>
                                                                        <td>{x.lpmNo ? x.lpmNo : (x.survayNo ? x.survayNo : '0')}</td>
                                                                        <td>{x.conveyedExtentAcers}.{x.conveyedExtentCents}</td>
                                                                        <td>Acres</td>
                                                                        {IsViewMode ? <td></td> : <td><Image alt="Image" height={20} width={20} src='/PDE/images/delete-icon.svg' onClick={() => DeleteItemWebland(index)} className={styles.tableactionImg} style={{ cursor: 'pointer' }} /></td>}
                                                                    </tr>)
                                                                })}
                                                            </tbody>
                                                        </Table>
                                                        : []}
                                                </Row>
                                                <Row>
                                                    {WeblanList.data && WeblanList.data.length > 0 &&
                                                        <div>
                                                            <p className={` ${styles.note}`}>NOTE :</p>
                                                            <p className={` ${styles.note}`}>1. The clearance of the schedule of this property is subject to the verification of prohibited property by Sub-Registrar.</p>
                                                            <p className={` ${styles.note}`}>2. Market value and Duty fees is Subject to verification of the Sub Registrar</p>
                                                        </div>}
                                                </Row>
                                                <div className={styles.divider}></div>
                                                <Row className="mb-2">
                                                    <p className={` ${styles.getTitle} ${styles.HeadingText}`}>Property Boundary Details [ఆస్తి హద్దుల వివరాలు]</p>
                                                    <Col lg={3} md={6} xs={12} className='my-3'>
                                                        <TableText label={'North Side  [ఉత్తరం వైపు]'} required={true} LeftSpace={false} />
                                                        <TableInputText disabled={IsViewMode} type='text' required={true} name={'northBoundry'} value={PropertyDetails.northBoundry} onChange={onChange} placeholder={''}/>
                                                    </Col>
                                                    <Col lg={3} md={6} xs={12} className='my-3'>
                                                        <TableText label={'South Side [దక్షిణం వైపు]'} required={true} LeftSpace={false} />
                                                        <TableInputText disabled={IsViewMode} type='text' required={true} name={'southBoundry'} value={PropertyDetails.southBoundry} onChange={onChange} placeholder={''} />
                                                    </Col>
                                                    <Col lg={3} md={6} xs={12} className='my-3'>
                                                        <TableText label={'East Side [తూర్పు వైపు]'} required={true} LeftSpace={false} />
                                                        <TableInputText disabled={IsViewMode} type='text' required={true} name={'eastBoundry'} value={PropertyDetails.eastBoundry} onChange={onChange} placeholder={''} />
                                                    </Col>
                                                    <Col lg={3} md={6} xs={12} className='my-3'>
                                                        <TableText label={'West Side [పడమర వైపు]'} required={true} LeftSpace={false} />
                                                        <TableInputText disabled={IsViewMode} type='text' required={true} name={'westBoundry'} value={PropertyDetails.westBoundry} onChange={onChange} placeholder={''} />
                                                    </Col>
                                                </Row>
                                                {LoginDetails.ENTRY_TYPE == "P" ? <Row>
                                                    <Col lg={3} md={6} xs={12} className='my-3'>
                                                        <TableText label={'Market Value'} required={true} LeftSpace={false} />
                                                        <TableInputText type='number' required={true} name={'marketValue'} value={PropertyDetails.marketValue} onChange={onChange} placeholder={''}  />
                                                    </Col>
                                                </Row> : null}

                                                {AllowProceed && !IsViewMode || PropertyDetails.lpmNo? 
                                                <Row className="mb-2">
                                        <Col lg={12} md={12} xs={12}>
                                            <div className={styles.ProceedContainer}>
                                                <button className='proceedButton'>{PropertyDetails.mode == "edit" ? "Update" : "Proceed"} </button>
                                            </div>
                                        </Col>
                                    </Row> : null}
                                               
                                            </form>
                                         } 
                                        {showdata &&
                                            <div style={{ margin: "2rem 3rem" }}>
                                                <div style={{ position: "relative", fontSize: "1.2rem", margin: "1rem 0rem" }}>
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
                                                            <text style={{ color: 'red' }} >*Please make the payment by clicking on the payment link and click on verify payment status to Complete.</text>
                                                        </div>
                                                        <div>
                                                            <text style={{ fontWeight: 'bold' }}>Payment Guidelines: </text>
                                                            <a href='https://drive.google.com/file/d/1tUGzbUDrErXABENRBSQXlzrYgTj0v10D/view?usp=sharing' target="_blank" rel="noreferrer" >View Payment Instructions</a>
                                                        </div>
                                                        <div>
                                                            <text style={{ fontWeight: 'bold' }}>Payment Link : </text>
                                                            <a href='javascript:void(0)' onClick={() => handlePaymentLinkClick()} rel="noreferrer" >Click here to Pay</a>
                                                        </div>
                                                        <div>
                                                            <text style={{ fontWeight: 'bold' }}>Verify Payment Status: </text>
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
                                {/* {PopupMemory.type ? */}
                                <div className={Popstyles.SuccessImg}>
                                    {/* <Image alt='' width={60} height={60} className={Popstyles.sImage} src="/PDE/images/success-icon.png" /> */}
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
                                {/* // <MdOutlineDoneOutline style={{ width: '50px', height: '50px', marginTop: '2rem', color: 'green', marginBottom: '1rem' }} /> */}
                                {/* // <ImCross className={styles.crossIcon} />
                                } */}
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
            {/* <pre>{JSON.stringify(WeblandDetails, null, 2)}</pre> */}
              {/* <pre>{JSON.stringify(PropertyDetails, null, 2)}</pre> */}
            {/* <pre>{JSON.stringify(payData, null, 2)}</pre> */}
        </div>
    )
}

export default Property_R_Page;
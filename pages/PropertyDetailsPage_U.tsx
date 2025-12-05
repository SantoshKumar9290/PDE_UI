import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap';
import styles from '../styles/pages/Mixins.module.scss';
import TableInputText from '../src/components/TableInputText';
import TableText from '../src/components/TableText';
import TableDropdown from '../src/components/TableDropdown';
import TableInputRadio from '../src/components/TableInputRadio';
import TableDropdownSRO from '../src/components/TableDropdownSRO';
import Table from 'react-bootstrap/Table';
import { useRouter } from 'next/router';
import { useAppSelector, useAppDispatch } from '../src/redux/hooks';
import { useGetDistrictList, getSecratariatWardDetails,useSROOfficeList, UseAddProperty,UseGetDoorNumSearch, UseGetVillageCode, UseGetHabitation, GetCDMAData, UseGetPPCheck,UseGetVgForPpAndMV, UseMVCalculator, UseUpdateProperty, UseDutyCalculator, UselocalBodies,getLinkedSroDetails, UseReportTelDownload, UseReportDownload, GetCDMADetails, checkUlbCodeJurisdiction,UseGetVacantLandExtRate, UseGetlpmCheck, GetCheckLPMMV, getMutationEnabled, GetMutatbleVillageData, getReraProjectDetails } from '../src/axios';
import { SavePropertyDetails } from '../src/redux/formSlice';
import { PopupAction, AadharPopupAction, DeletePopupAction } from '../src/redux/commonSlice';
import Image from 'next/image';
import Head from 'next/head';
import { checkCaptcha, CrdaEmpCheck, encryptWithAES, floatNo } from '../src/utils';
import { CallingAxios, DateFormator, DoorNOIdentifier, KeepLoggedIn, MasterCodeIdentifier, MissingFieldIdentifier, ShowMessagePopup, MuncipleKeyNameIdentifier, ShowPreviewPopup, TotalMarketValueCalculator, Loading } from '../src/GenericFunctions';
import TableDropdownSRO2 from '../src/components/TableDropdownSRO2';
import Captcha from '../src/components/Captcha';
import MasterData from '../src/MasterData';
import TableSelectDate from '../src/components/TableSelectDate';
import moment from 'moment';
import Popstyles from '../styles/components/PopupAlert.module.scss';
import { ImCross } from 'react-icons/im';
import DoorNumberSearchDetailsDialog from '../src/components/DoorNumberSearchDetailsDialog';
import{Multiselect} from 'multiselect-react-dropdown'

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
    const [activepage, setActivepage] = useState(false);
    const [table, setTable] = useState(false)
    let GetstartedDetails = useAppSelector(state => state.form.GetstartedDetails);
    let LoginDetails = useAppSelector(state => state.login.loginDetails);
    const [DistrictList, setDistrictList] = useState([]);
    const [IsFlat, setIsFlat] = useState(false);
    const [SelectedSRO, setSelectedSRO] = useState({ id: '', name: '' });
    const [SROOfficeList, setSROOfficeList] = useState([]);
    let initialPropertyDetails = useAppSelector(state => state.form.PropertyDetails);
    const [PropertyDetails, setPropertyDetails] = useState<any>(initialPropertyDetails);
    let [floorList, setFloorList] = useState<any>(DropdownOptions.floorList);
    const [Structure, setStructure] = useState({ floorNo: "", structureType: "", plinth: "", plinthUnit: "", stageOfCons: "", age: "" });
    const [LinkDocument, setLinkDocument] = useState({ linkDocNo: "", regYear: "", bookNo: "", scheduleNo: "", district: "", sroOffice: "" ,sroCode:""})
    const [VillageList, setVillageList] = useState([]);
    const [VillageCodeList, setVillageCodeList] = useState([]);
    const [HabitationList, setHabitationList] = useState([]);
    const [HabitationCodeList, setHabitationCodeList] = useState([]);
    const [selectedcdmaDetails,setSelectedcdmaDetails]=useState<any>({})
    const [CDMADetails, setCDMADetails] = useState<any>({});
    const [ppnCodeAdd,setPtinCode]=useState<any>({});
    const [ApplicationDetails, setApplicationDetails] = useState<any>({ applicationId: "", executent: [], claimant: [] });
    const [AllowProceed, setAllowProceed] = useState(false);
    const [RequiredFields, setRequiredFields] = useState({ ptinNo: false, plotNo: false })
    const [IsViewMode, setIsViewMode] = useState(false);
    const [rentMonthOrYear, setRentMonthOrYear] = useState<any>(["Monthly","Yearly"])
    const [localBodyTypeList, setLocalBodyTypeList] = useState([]);
    const [localBodyNameList, setLocalBodyNameList] = useState([]);
    const [secratariatWards,setSecratariatWards] = useState([]);
    const [CalculatedDutyFee, setCalculatedDutyFee] = useState({ TRAN_MAJ_CODE: "", TRAN_MIN_CODE: "", sroCode: "", amount: "", rf_p: "0", td_p: "0", sd_p: "0", marketValue: "0" })
    const [conveyedExt,setConveyExtent] = useState('');
    const [conveyedUnit,setConveydUnit] = useState('');
    const [wbVgCode, setwbVegCode] = useState<any>("");
    const [inputValue, setInputValue] = useState<any>("");
    const [ptincaptcha, setPtincaptcha] = useState<any>(false);
    const [maxDate, setMaxDate] = useState(Date);
    const [ppbyPass,setPpByPass] = useState<any>({status:false,type:"",value:""})
    const [rData,setrData]= useState<any>({rentalPeriod :"",rentalAmount:"",renatmonthlyOrYearly:"Y"});
    const [mLinkDocs,setmLinkDocs] = useState<any>(false);
    let [leaseData,setLeaseData] = useState<any>({ wef:"",lPeriod:"",advance:"",adjOrNonAdj:"",valueOfImp:"",muncipalTax:"",rentalDetails:[]})
    const [statusBar, setStatusBar] = useState<any>(false);
    const [checkLUC, setCheckLUC] = useState<any>(false);
    const ShowAlert = (type, message) => { dispatch(PopupAction({ enable: true, type: type, message: message })); }
    const ShowAutoAlert = (type, message) => { dispatch(PopupAction({ enable: true, type: type, message: message, autoHide: false, hideCancelButton: false})); }
    const [gramData, setGramData] = useState<any>({});
    const [crdCheck, setCrdCheck] = useState<any>(false);
    let [leasegranTotal,SetleasegranTotal]= useState<any>(0);
    const [rentButn,SetRentButn] = useState<any>(false);
    let [userCharges,setUserCharges]= useState<any>(500);
    const [lpmValue, setLpmValue] = useState(0);
    let [rentalRowData,SetrentalRowData] = useState<any>([]);
    const [isMutationEnabled,setIsMutationEnbaled] = useState<boolean>(false);    
    const [isSectratariatWardEnabled,setIsSectratariatWardEnabled] = useState<boolean>(false);
    const [doorNumSearchData, setDoorNumSearchData] = useState<any>({});
    const [showPopup, setShowPopup] = useState<boolean>(false);
    const [selectedDoorNumData, setSelectedDoorNumData] = useState<any>({});    
    const [juridictionSRO, setJuridictionSRO] = useState('');
    const [multiDropValue,setMultiDropValue] =useState<any>([]);
    const [reraProjectDetails, setReraProjectDetails] = useState<any>([])
    const [propertyTypes,setPropertyTypes]= useState<any>(DropdownOptions.TypeofProperty)

    const getCDMADetails = async(ptinNo: string) => {
        let value;
        if (PropertyDetails.localBodyType) {
            if ((PropertyDetails.localBodyType.includes('GRAM PANCHAYAT') && ptinNo.length > 10) || (PropertyDetails.localBodyType.includes('GRAM PANCHAYAT') && ptinNo.length <= 17)) {
                value = 'Y'
                CallCDMADetails(ptinNo, value,false);
            }
            else if (ptinNo.length == 10) {
                CallCDMADetails(ptinNo, ApplicationDetails.amount,false);
            }
        }
        else if (ptinNo.length == 10) {
            CallCDMADetails(ptinNo, ApplicationDetails.amount,false);
        }
    }
 
    const getSecretariatWardDetailsFromAPI = async (sroCode:number|string,villageCode:string)=>{
        const secretariatAPIRespone = await CallingAxios(getSecratariatWardDetails(+sroCode,villageCode));
        if (secretariatAPIRespone.status) {
            setSecratariatWards(secretariatAPIRespone.data.map((obj:any) => ({...obj,
                code: obj.secretariatWardCode,
                type: obj.secretariatWardName
            })));
        } else {
            return ShowMessagePopup(false, "Failed to load the Secretariat ward", "")
        }
        
    }

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


    // const MVCalculator = async () => {
        
    // 	let landExtent:any = PropertyDetails.schedulePropertyType == "FLAT [ఫ్లాట్]" ? Number(PropertyDetails.undividedShare) :Number(PropertyDetails.extent);
    //     let vgCode = wbVgCode != "" ? wbVgCode : PropertyDetails.villageCode;
    //     let [hab, rest] = PropertyDetails.habitation.split("(");
    //     let nature_code :any= MasterCodeIdentifier("landUse", PropertyDetails.landUse);
    //     nature_code = nature_code =="09" ?"01": nature_code =="11" ?"02" :nature_code;
    //     // let strs:any=""
    //     // for(let i of PropertyDetails.structure){
    //     //     // let floor_no:any = i.floor_no ? i.floor_no.includes('-') ? i.floor_no.split('-')[1] : MasterCodeIdentifier("floorNo", i.floor_no) : "";
    //     //     // let stru_type= i.stru_type ? MasterCodeIdentifier("structureType", i.stru_type) : "",
    //     //     // let plinth= i.plinth ? Number(i.plinth) : 0,
    //     //     // letplinth_unit= i.plinth_unit ? "F" : "", // PropertyDetails.structure[0].plinthUnit == "SQ. FEET [చదరపు అడుగులు]" ? "F" : "Y",
    //     //     // i.stageOfCons= i.stageOfCons ? MasterCodeIdentifier("StageOfCons", Number(i.stageOfCons)) : 0,
    //     //     // i.age= i.age ? Number(i.age) : 0;

    //     //     let frNo =  i.floorNo.includes('-') ? i.floorNo.split('-')[1] : MasterCodeIdentifier("floorNo", i.floorNo) ;
    //     //     let stru_type = i.structureType ? MasterCodeIdentifier("structureType", i.structureType) : "";
    //     //     let plinth =i.plinth ? Number(PropertyDetails.structure[0].plinth) : 0;
    //     //     let plinthUnit = "F";
    //     //     let  stageOfCons:any;
    //     //     MasterData.StageOfCons.map((x)=>{
    //     //         if(x.desc === i.stageOfCons)
    //     //             stageOfCons =x.code;
    //     //     })
    //     //     let age = i.age ? Number(i.age) : 0;
    //     //     if(frNo && String(frNo).length ===1){
    //     //         frNo = '0'+frNo;}
    //     //     if(strs == ""){
    //     //         strs = `${frNo},${stru_type},${plinth},${plinthUnit},${stageOfCons},${age}#`
    //     //     }else{
    //     //         strs = strs +`${frNo},${stru_type},${plinth},${plinthUnit},${stageOfCons},${age}#`
    //     //     }
            
    //     // }
    //     let data: any =
    //     // {
    //     // 	"floor_no": "02",
    //     // 	"stru_type": "01",
    //     // 	"plinth": 22,
    //     // 	"plinth_unit": "A",
    //     // 	"stage": 1,
    //     // 	"age": 3,
    //     // 	"sroCode": 301,
    //     // 	"vill_cd": "0333028",
    //     // 	"locality": "ANJAYYA COLONY",
    //     // 	"habitation": "",
    //     // 	"wno": 1,
    //     // 	"bno": 6,
    //     // 	"house_no": ",120,",
    //     // 	"nearby_boundaries": "",
    //     // 	"surveyno": "",
    //     // 	"nature_use": "01",
    //     // 	"land_extent": 11,
    //     // 	"land_unit": "Y",
    //     // 	"total_floor": 5,
    //     // 	"property_type": "APARTMENT",
    //     // 	"property_nature": "URBAN",
    //     // 	"localbody": 3
    //     // }
        
    //     {
    //         floor_no: PropertyDetails.structure && PropertyDetails.structure.length ? PropertyDetails.structure[0].floorNo.includes('-') ? PropertyDetails.structure[0].floorNo.split('-')[1] : MasterCodeIdentifier("floorNo", PropertyDetails.structure[0].floorNo) : "",
    //         stru_type: PropertyDetails.structure && PropertyDetails.structure.length ? MasterCodeIdentifier("structureType", PropertyDetails.structure[0].structureType) : "",
    //         plinth: PropertyDetails.structure && PropertyDetails.structure.length ? Number(PropertyDetails.structure[0].plinth) : 0,
    //         plinth_unit: PropertyDetails.structure && PropertyDetails.structure.length ? "F" : "", // PropertyDetails.structure[0].plinthUnit == "SQ. FEET [చదరపు అడుగులు]" ? "F" : "Y",
    //         stage: PropertyDetails.structure && PropertyDetails.structure.length ? MasterCodeIdentifier("StageOfCons", Number(PropertyDetails.structure[0].stageOfCons)) : 0,
    //         age: PropertyDetails.structure && PropertyDetails.structure.length ? Number(PropertyDetails.structure[0].age) : 0,
    //         sroCode: Number(PropertyDetails.sroCode),
    //         vill_cd: vgCode,
    //         locality: PropertyDetails.loc,
    //         habitation: "",
    //         wno: Number(PropertyDetails.ward),
    //         bno: Number(PropertyDetails.block),
    //         house_no: DoorNOIdentifier(PropertyDetails.doorNo),
    //         nearby_boundaries: "",
    //         surveyno: "",//PropertyDetails.survayNo,
    //         nature_use: nature_code,
    //         land_extent: landExtent,
    //         land_unit: 'Y',//PropertyDetails.extentUnit=="SQ. FEET [చదరపు అడుగులు]"?"F":"Y",
    //         total_floor: Number(PropertyDetails.totalFloors),
    //         property_type: (PropertyDetails.landUse == "URBAN VACANT LAND(RESIDENTIAL)(R) [పట్టణ ఖాళీ స్తలము(నివాసం (R )]" || PropertyDetails.landUse == "URBAN VACANT LAND(COMMERCIAL)(R) [పట్టణ ఖాళీ స్తలము(వ్యాపారపరమైన )(R)]") ? "VACANT" : PropertyDetails.schedulePropertyType == "FLAT [ఫ్లాట్]" ? "APARTMENT" : "OTHER",
    //         property_nature: "URBAN",
    //         localbody: PropertyDetails.localBodyCode
    //         //  Number(MasterCodeIdentifier("localBody", Number(PropertyDetails.localBodyType)))
    //     }
    //     let result = await CallingAxios(UseMVCalculator(data, "urban"));
    //     if (result?.status) {
    //         return result.data
    //     } else {
    //         return { marketValue: 0 }
    //     }
    // }

    const MVCalculatorRural = async (landExt: any, srvNo: any) => {
        // let srvyNum = PropertyDetails.lpmNo === "" || PropertyDetails.lpmNo === undefined ? srvNo : PropertyDetails.lpmNo;
        // let vgCode = PropertyDetails.mode === "edit" ? VILLCD : PropertyDetails.VILLCD;
        let vgCode = wbVgCode != "" ? wbVgCode : PropertyDetails.villageCode;
        let data: any = {
            floor_no: "",
            stru_type: "",
            plinth: "",
            plinth_unit: "",
            stage: "",
            age: "",
            sroCode: PropertyDetails.sroCode,
            vill_cd: vgCode,
            // locality: PropertyDetails.habitation,
            habitation: PropertyDetails.habitation,
            habCode: PropertyDetails.habitationCode,
            wno: null,
            bno: null,
            house_no: "",
            nearby_boundaries: "",
            surveyno: srvNo,
            land_extent: landExt * 0.000206612,
            land_unit: "A",//PropertyDetails.extentUnit=="SQ. FEET [చదరపు అడుగులు]"?"F":"Y",
            total_floor: null,
            property_type: null,
            property_nature: "RURAL",
            localbody: MasterCodeIdentifier("localBody", PropertyDetails.localBodyType)
        }

        let result = await CallingAxios(UseMVCalculator(data, "rural"));
        if (result.status) {
            return result.data;
        } else {
            return false;
        }
    }
    const MVCalculator = async () => {
        
        let landExtent:any = PropertyDetails.schedulePropertyType == "FLAT [ఫ్లాట్]" ? Number(PropertyDetails.undividedShare) :Number(PropertyDetails.extent);
        let vgCode = wbVgCode != "" ? wbVgCode : PropertyDetails.villageCode;
        let [hab, rest] = PropertyDetails.habitation.split("(");
        let nature_code :any= MasterCodeIdentifier("landUse", PropertyDetails.landUse);
        nature_code = nature_code =="09" ?"01": nature_code =="11" ?"02" :nature_code;
        let strs:any=""
        for(let i of PropertyDetails.structure){
            // let floor_no:any = i.floor_no ? i.floor_no.includes('-') ? i.floor_no.split('-')[1] : MasterCodeIdentifier("floorNo", i.floor_no) : "";
            // let stru_type= i.stru_type ? MasterCodeIdentifier("structureType", i.stru_type) : "",
            // let plinth= i.plinth ? Number(i.plinth) : 0,
            // letplinth_unit= i.plinth_unit ? "F" : "", // PropertyDetails.structure[0].plinthUnit == "SQ. FEET [చదరపు అడుగులు]" ? "F" : "Y",
            // i.stageOfCons= i.stageOfCons ? MasterCodeIdentifier("StageOfCons", Number(i.stageOfCons)) : 0,
            // i.age= i.age ? Number(i.age) : 0;

    let frNo =  i.floorNo.includes('-') ? i.floorNo.split('-')[1] : (typeof i.floorNo==='number' || (i.floorNo).length ===2)? i.floorNo :MasterCodeIdentifier("floorNo", i.floorNo) ;           
     let stru_type = i.structureType ? MasterCodeIdentifier("structureType", i.structureType) : "";
            let plinth =i.plinth ? Number(i.plinth) : 0;
            let plinthUnit = "F";
            let  stageOfCons:any;
            MasterData.StageOfCons.map((x)=>{
                if(x.desc === i.stageOfCons)
                    stageOfCons =x.code;
            })
            let age = i.age ? Number(i.age) : 0;
            if(frNo && String(frNo).length ===1){
                frNo = '0'+frNo;}
            if(strs == ""){
                strs = `${frNo},${stru_type},${plinth},${plinthUnit},${stageOfCons},${age}#`
            }else{
                strs = strs +`${frNo},${stru_type},${plinth},${plinthUnit},${stageOfCons},${age}#`
            }

        }
        PropertyDetails.nearTodoorNo = PropertyDetails.doorNo !="" ? "" : PropertyDetails.nearTodoorNo;
        let nrDr :any = PropertyDetails.nearTodoorNo =="" || PropertyDetails.nearTodoorNo == undefined ? 0 : PropertyDetails.nearTodoorNo;
        let drNum = !checkLUC  && PropertyDetails.doorNo =="" && nrDr ==0 ? 0 : nrDr != 0 ? nrDr :  PropertyDetails.doorNo;
        let data: any ={
            floor_no: PropertyDetails.structure && PropertyDetails.structure.length ? PropertyDetails.structure[0].floorNo.includes('-') ? PropertyDetails.structure[0].floorNo.split('-')[1] : MasterCodeIdentifier("floorNo", PropertyDetails.structure[0].floorNo) : "",
            stru_type: PropertyDetails.structure && PropertyDetails.structure.length ? MasterCodeIdentifier("structureType", PropertyDetails.structure[0].structureType) : "",
            plinth: PropertyDetails.structure && PropertyDetails.structure.length ? Number(PropertyDetails.structure[0].plinth) : 0,
            plinth_unit: PropertyDetails.structure && PropertyDetails.structure.length ? "F" : "", // PropertyDetails.structure[0].plinthUnit == "SQ. FEET [చదరపు అడుగులు]" ? "F" : "Y",
            stage: PropertyDetails.structure && PropertyDetails.structure.length ? MasterCodeIdentifier("StageOfCons", Number(PropertyDetails.structure[0].stageOfCons)) : 0,
            age: PropertyDetails.structure && PropertyDetails.structure.length ? Number(PropertyDetails.structure[0].age) : 0,
            // floor_no: PropertyDetails.structure && PropertyDetails.structure.length ? PropertyDetails.structure[0].floorNo.includes('-') ? PropertyDetails.structure[0].floorNo.split('-')[1] : MasterCodeIdentifier("floorNo", PropertyDetails.structure[0].floorNo) : "",
            // stru_type: PropertyDetails.structure && PropertyDetails.structure.length ? MasterCodeIdentifier("structureType", PropertyDetails.structure[0].structureType) : "",
            // plinth: PropertyDetails.structure && PropertyDetails.structure.length ? Number(PropertyDetails.structure[0].plinth) : 0,
            // plinth_unit: PropertyDetails.structure && PropertyDetails.structure.length ? "F" : "", // PropertyDetails.structure[0].plinthUnit == "SQ. FEET [చదరపు అడుగులు]" ? "F" : "Y",
            // stage: PropertyDetails.structure && PropertyDetails.structure.length ? MasterCodeIdentifier("StageOfCons", Number(PropertyDetails.structure[0].stageOfCons)) : 0,
            // age: PropertyDetails.structure && PropertyDetails.structure.length ? Number(PropertyDetails.structure[0].age) : 0,
            str_type:strs,
            sroCode: Number(PropertyDetails.sroCode),
            vill_cd: vgCode,
            locality: PropertyDetails.loc,
            habitation: "",
            wno: (PropertyDetails.biWard != null && PropertyDetails.biWard != 0 && PropertyDetails.biWard != '') ? `${PropertyDetails.ward}/${PropertyDetails.biWard?.trim()}` : PropertyDetails.ward,
            bno: (PropertyDetails.biBlock != null && PropertyDetails.biBlock != 0 && PropertyDetails.biBlock != '')? `${PropertyDetails.block}/${PropertyDetails.biBlock?.trim()}` : PropertyDetails.block,
            house_no: DoorNOIdentifier(drNum),
            nearby_boundaries: "",
            surveyno: "",//PropertyDetails.survayNo,
            nature_use: nature_code,
            land_extent: landExtent,
            land_unit: 'Y',//PropertyDetails.extentUnit=="SQ. FEET [చదరపు అడుగులు]"?"F":"Y",
            total_floor: Number(PropertyDetails.totalFloors),
            property_type: (PropertyDetails.landUse == "URBAN VACANT LAND(RESIDENTIAL)(R) [పట్టణ ఖాళీ స్తలము(నివాసం (R )]" || PropertyDetails.landUse == "URBAN VACANT LAND(COMMERCIAL)(R) [పట్టణ ఖాళీ స్తలము(వ్యాపారపరమైన )(R)]") ? "VACANT" : PropertyDetails.schedulePropertyType == "FLAT [ఫ్లాట్]" ? "APARTMENT" : "OTHER",
            property_nature: "URBAN",
            localbody: PropertyDetails.localBodyCode,
            strType:PropertyDetails.strType
            //  Number(MasterCodeIdentifier("localBody", Number(PropertyDetails.localBodyType)))
        }
        let result = await CallingAxios(UseMVCalculator(data, "urban"));
        if (result?.status) {
            // window.alert(JSON.stringify(result.data, null, 2));
            return result.data
        } else {
            // ShowMessagePopup(false, result.message, "");
            return { marketValue: 0 }
        }
    }
    let doctcondtion =ApplicationDetails?.documentNature?.TRAN_MAJ_CODE ==='01'&& ApplicationDetails?.documentNature?.TRAN_MIN_CODE==='27'

    useEffect(() => {
        if (KeepLoggedIn()) {
            let data: any = localStorage.getItem("GetApplicationDetails");
            if (data == "" || data == undefined) {
                ShowMessagePopup(false, "Invalid Access", "/");
            }
            else {
                data = JSON.parse(data);
                setApplicationDetails(data);
                setLeaseData(data.leasePropertyDetails || leaseData)
                if (DistrictList.length == 0) {
                    GetDistrictList();
                }
                if (VillageCodeList.length == 0) {
                    GetVillageCode();
                }

                let data2: any = localStorage.getItem("PropertyDetails");
                if (data2 == "" || data == undefined) {
                    ShowMessagePopup(false, "Invalid Access", "/");
                }
                else {
                    data2 = JSON.parse(data2);
                    checkMutationEnabled(data2.sroCode);
                    GetMutableVillageData(data2.villageCode)
                    setJuridictionSRO(data2.sroCode)
                    // if(isMutationEnabled){
                    // getSecretariatWardDetailsFromAPI()
                    // }
                    if (data2.VILLCD) {
                        GetLpmCheck(data2.VILLCD);
                    }
                    let TempDetails = { ...data2 };
                    if(data2.mode =="add"){
                        TempDetails = { ...data2 ,isPropProhibited:false,isPrProhibitedSurveyNO:"",isPrProhibitedDoorNO:""}
                    }
                    dispatch(SavePropertyDetails(data2));

                    if (data2.VILLCD) {
                        setwbVegCode(data2.VILLCD);
                    }
                    data2.schedulePropertyType == "FLAT [ఫ్లాట్]" ? (setIsFlat(true), TempDetails.urban_selling_extent='FULL'): setIsFlat(false);
                    if (data2.doorNo != "") {
                        setAllowProceed(true);
                    }
                    if (data2.landUse == "URBAN VACANT LAND(RESIDENTIAL)(R) [పట్టణ ఖాళీ స్తలము(నివాసం (R )]" || data2.landUse == "URBAN VACANT LAND(COMMERCIAL)(R) [పట్టణ ఖాళీ స్తలము(వ్యాపారపరమైన )(R)]") {
                        setRequiredFields({ plotNo: false, ptinNo: false })
                    }
                    else {
                        setRequiredFields({ plotNo: false, ptinNo: true })
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
                        // let value = localBodyTypeList.find(x=> x.code == data2.localBodyType); 
                        let value = DropdownList.LocalBodyTypesList.find(x => x.localBodyCode == data2.localBodyType);
                        if (value) {
                            TempDetails = { ...TempDetails, localBodyType: value.localBodyType }
                        }

                    }
                    if (data2.villageCode && HabitationCodeList.length == 0) {
                        GetHabitation(data2.villageCode, TempDetails);
                    }
                    if(data2.mode === 'add'){
                        TempDetails ={...TempDetails,LinkedDocDetails:[]}
                    }
                    if(!TempDetails.urban_selling_extent){
                        TempDetails.urban_selling_extent = "FULL"
                    }
                    if(!TempDetails.strType){
                        TempDetails.strType = "Industrial"
                    }
                    setPropertyDetails(TempDetails,);
                    if(data2.mode ==="edit"){
                        if(TempDetails.urban_selling_extent != "FULL"){
                            setPropertyTypes(['HOUSE [ఇల్లు]'])
                        }
                        GetVgForPPandMv(data2.villageCode);
                        GetLpmCheck(data2.villageCode)
                    }
                    if(data2.cdma_details && data2.mode ==="edit"){
                        
                        let c = JSON?.parse(data2?.cdma_details);
                        setCDMADetails(c);
                        setSelectedcdmaDetails(c)
                    }
                    if(data.documentNature.TRAN_MAJ_CODE === "07" && data2.mode === 'edit'){
                       SetleasegranTotal(TotalMarketValueCalculator(ApplicationDetails))

                    }
                }
                if((data?.documentNature?.TRAN_MAJ_CODE == "05" &&(data?.documentNature?.TRAN_MIN_CODE =="03" || data?.documentNature?.TRAN_MIN_CODE =="04"|| data?.documentNature?.TRAN_MIN_CODE =="05" || data?.documentNature?.TRAN_MIN_CODE =="09")) || (data?.documentNature?.TRAN_MAJ_CODE == "08" &&(data?.documentNature?.TRAN_MIN_CODE =="01" || data?.documentNature?.TRAN_MIN_CODE =="02" || data?.documentNature?.TRAN_MIN_CODE =="03" || data?.documentNature?.TRAN_MIN_CODE =="04" || data?.documentNature?.TRAN_MIN_CODE =="05"))
                || (data?.documentNature?.TRAN_MAJ_CODE == "35" && data?.documentNature?.TRAN_MIN_CODE =="01") || (data?.documentNature?.TRAN_MAJ_CODE == "36" && ApplicationDetails?.documentNature?.TRAN_MIN_CODE =="01")){
                    setmLinkDocs(true);
                }else{
                    setmLinkDocs(false);
                }
                if(data.documentNature.TRAN_MAJ_CODE === "05" || data.documentNature.TRAN_MAJ_CODE === "06"){
                    setStatusBar(true)
                }else{
                    setStatusBar(false)
                }
                if(Number(data2.landUseCode) ==  9  || Number(data2.landUseCode) == 11){
                    setCheckLUC(false)
                }else{
                    setCheckLUC(true)
                }
                if(CrdaEmpCheck[parseInt(data.documentNature.TRAN_MAJ_CODE)] && CrdaEmpCheck[parseInt(data.documentNature.TRAN_MAJ_CODE)].includes(data.documentNature.TRAN_MIN_CODE)){
                    // window.alert("fffffffffffffffffffffff")
                    setCrdCheck(true);
                }else{
                    setCrdCheck(false);
                }
                if(data.documentNature.TRAN_MAJ_CODE === "04" || data.documentNature.TRAN_MAJ_CODE === "03"){
                    setUserCharges(0)
                }else{
                    setUserCharges(500)
                }
            }
        } else { ShowMessagePopup(false, "Invalid Access", "/"); }
    }, []);


    useEffect(() => {
        if(LoginDetails?.loginEmail === 'APIIC'){
            setAllowProceed(true)
        }
        if (ApplicationDetails.registrationType && ApplicationDetails.documentNature && ApplicationDetails.sroCode && ApplicationDetails.amount) {
            let currentMarketValue = TotalMarketValueCalculator(ApplicationDetails)
            let ftv:any;
            if(ApplicationDetails.docsExcutedBy == "GovtBody"){
                ftv = ApplicationDetails.amount
            }else{
                ftv =ApplicationDetails.amount > currentMarketValue ? ApplicationDetails.amount : currentMarketValue;
            }
            let data = {
                "tmaj_code": ApplicationDetails.registrationType.TRAN_MAJ_CODE,
                "tmin_code": ApplicationDetails.documentNature.TRAN_MIN_CODE,
                "sroNumber": ApplicationDetails.sroCode,
                "local_body": 3,
                "flat_nonflat": "N",
                "marketValue": currentMarketValue,
                "finalTaxbleValue": doctcondtion?ApplicationDetails.amount : ftv,
                "con_value": ApplicationDetails.amount,
                "adv_amount": 0
            }
            DutyFeeCalculator(data);

        }
        if((PropertyDetails.mode == "edit" || PropertyDetails.mode == "view") && ApplicationDetails?.documentNature?.TRAN_MAJ_CODE == "07"){
            const rentadetails= PropertyDetails?.leaseDetails?.rentalDetails;
            const leaseData = PropertyDetails?.leaseDetails;
            SetrentalRowData(rentadetails);
            setLeaseData({...leaseData,wef: DateFormator(leaseData.wef,'YYYY-MM-DD')})
        }
    }, [ApplicationDetails])

    useEffect(() => {
        if(PropertyDetails.mode != "edit")
            SetrentalRowData(rentalRowData);
    }, [rentalRowData])
    useEffect(()=>{
        if(isMutationEnabled){
            getSecretariatWardDetailsFromAPI(juridictionSRO,PropertyDetails?.villageCode||'0')
        }
    },[isMutationEnabled])

     const checkMutationEnabled = async(sroCode:string)=>{
        const result =  await CallingAxios(getMutationEnabled(sroCode));
        if(result.data){
            setIsMutationEnbaled(result.data)
        }
    }

    const DutyFeeCalculator = async (data) => {
        let result = await UseDutyCalculator(data);
        if (result.status) {
            setCalculatedDutyFee({ ...CalculatedDutyFee, TRAN_MAJ_CODE: ApplicationDetails.registrationType.TRAN_MAJ_CODE, TRAN_MIN_CODE: ApplicationDetails.documentNature.TRAN_MIN_CODE, sroCode: ApplicationDetails.sroCode, amount: ApplicationDetails.amount, sd_p: result.data.sd_p, td_p: result.data.td_p, rf_p: result.data.rf_p });
        }
    }
    const GetVgForPPandMv = async (vgCode:any)=>{
        if(vgCode && vgCode.length === 6){
            vgCode = '0'+vgCode;
        }
        let result = await CallingAxios(UseGetVgForPpAndMV("Sr",vgCode));
        if (result.status) {
            let data = result.data;
            if(data  && data.length >0 && data[0].VILLCD != "")
                setwbVegCode(data[0].VILLCD);
        }
        else {
            return ShowMessagePopup(false, "Fetch vgCode list failed", "")
        }
    }

    
    const onChangeLease = (e: any) => {
        let addName = e.target.name;
        let addValue = e.target.value;
        if(addValue == 0){
            addValue ="";
        }
        if(addName ==="lPeriod"){
            setLeaseData({ ...leaseData, rentalDetails:[] });
        }
        setLeaseData({ ...leaseData, [addName]: addValue });
        setPropertyDetails({ ...PropertyDetails,leaseDetails:leaseData});
    }
    const onchangeEditLease =(e:any)=>{
        let addName = e.target.name;
        let addValue = e.target.value;
        setLeaseData({...leaseData,[addName]:addValue});
        setPropertyDetails({ ...PropertyDetails,leaseDetails:leaseData});
    }
    const onRentalLease =(i:any,e:any)=>{
        e.preventDefault();
        let { name, value } = e.target;
        // window.alert(JSON.stringify(i))
        // let trp:any= 0;let grAmount:any=0;
        if(name === "rentalPeriod" || name =="rentalAmount"){
            value = Number(value)
        }
        let rowsInput :any = [...rentalRowData];
        if(String(value).startsWith("0")){
            value =""
        }
        let trp:any= 0;let grAmount:any=0;
        if(PropertyDetails.mode == "edit"){
            if(name === "rentalPeriod"){
                rowsInput[i] ={...rowsInput[i],[name]:value};
                if(value == leaseData.lPeriod && rentalRowData && rentalRowData.length === 1){
                    SetRentButn(true);
                    // SetTrpVal(value);
                }else{
                    rowsInput.map((rp:any)=>{
                       trp = Number(trp) + Number(rp.rentalPeriod);
                    //    SetTrpVal({...});
                    });
                    if(trp > Number(leaseData.lPeriod)){
                        rowsInput[i][name] = "";
                        ShowAlert(false,"Rent Period Should be Equal to Lease Period");
                    }
                    if(trp >= Number(leaseData.lPeriod)){
                        SetRentButn(true);
                       
                    }else{
                        SetRentButn(false);
                    }
                }
                if(rowsInput[i]["rentalAmount"] != ""){
                    let tAmt:any =  Number(rowsInput[i]["rentalAmount"]) * value;
                    rowsInput[i] ={...rowsInput[i],"totalAmount":tAmt};
                }
                
    
            }else if(name === "rentalAmount"){
                // rowsInput[i]["totalAmount"] =  Number(rowsInput[i]["rentalPeriod"]) * value;
                // rowsInput[i][name] = value; 
               

                let tAmt:any =  Number(rowsInput[i]["rentalPeriod"]) * value;
                rowsInput[i] ={...rowsInput[i],"totalAmount":tAmt,[name]:value};
            }else{
                rowsInput[i] ={...rowsInput[i],[name]:value};
            }
            if(rowsInput[i]["rentalPeriod"] != "" && rowsInput[i]["rentalAmount"] !=""){
                rowsInput.map((rp:any)=>{
                    grAmount = (Number(grAmount) + rp["totalAmount"])
                });
            }
        }else{
           
            if(name === "rentalPeriod" ){
                if(String(value).startsWith("0")){
                    value =""
                }
                // leaseData.lPeriod
                rowsInput[i][name] = value;
                // window.alert(JSON.stringify(rentalRowData))
                if(value == leaseData.lPeriod && rentalRowData && rentalRowData.length === 1){
                    SetRentButn(true);
                    // SetTrpVal(value);
                }else{
                    rentalRowData.map((rp:any)=>{
                        //  window.alert(JSON.stringify(rp.rentalPeriod))
                       trp = Number(trp) + Number(rp.rentalPeriod);
                    //    SetTrpVal({...});
                    });
                    if(trp > Number(leaseData.lPeriod)){
                        rowsInput[i][name] = "";
                        ShowAlert(false,"Rent Period Should be Equal to Lease Period");
                    }
                    if(trp >= Number(leaseData.lPeriod)){
                        SetRentButn(true);
                       
                    }else{
                        SetRentButn(false);
                    }
                }
    
                if(rowsInput[i]["rentalAmount"] != ""){
                    rowsInput[i]["totalAmount"] =  Number(rowsInput[i]["rentalAmount"]) * value;
                }
                
            }else if(name === "rentalAmount"){
                rowsInput[i]["totalAmount"] =  Number(rowsInput[i]["rentalPeriod"]) * value;
                rowsInput[i][name] = value; 
            }
            else{
                rowsInput[i][name] = value; 
            }
            if(rowsInput[i]["rentalPeriod"] != "" && rowsInput[i]["rentalAmount"] !=""){
                rentalRowData.map((rp:any)=>{
                    grAmount = (Number(grAmount) + rp["totalAmount"])
                });
            }
            
        }
        SetrentalRowData(rowsInput);
        SetleasegranTotal(grAmount);
        setLeaseData({ ...leaseData, rentalDetails:rentalRowData });
        setPropertyDetails({ ...PropertyDetails,leaseDetails:leaseData});
        
    }

    const addTableRows = ()=>{
        let rowsInput={
            sNo :rentalRowData.length + 1,
            rentalPeriod:'',
            rentalAmount:'',
            renatmonthlyOrYearly:'Y'  
        } 
        SetrentalRowData([...rentalRowData, rowsInput])
    }
    const DeleteItemRentalData = (i:any)=>{
        // window.alert("666666666666666666666666666")
        // let rents =[...rentalRowData]
        // rents.splice(s,1);
        // rents.map((r)=>{
        //     if(r.sNo > s.sNo)
        //         r.sNo = r.sNo -1;
        // })
        // setrentalRowData(rents);
        const rows = [...rentalRowData];
        rows.splice(i, 1);
        SetrentalRowData(rows);
        SetleasegranTotal(0);
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
            const localBodyNames = result.data.map(lbt => lbt.LOCAL_BODY_NAME);
            setLocalBodyNameList(localBodyNames);
            setLocalBodyTypeList(DropdownList.LocalBodyTypesList.map(lbt => { return { type: lbt.localBodyType, code: lbt.localBodyCode } }))
        }
        else {
            ShowMessagePopup(false, "fetching localBodyList Failed", "")
        }
    };

     const GetMutableVillageData = async (villageCode: any) => {
        let result = await CallingAxios(GetMutatbleVillageData(villageCode));
        if ( result && result.status) {
            setIsSectratariatWardEnabled(result && result.data && result.data.length > 0 ? true : false);
        }else{
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
                // ShowMessagePopup(false, result.message, "")
            }
        }
    }
    const GetHabitation = async (VillageCode: any, data2?: any) => {

        let result = await CallingAxios(UseGetHabitation(VillageCode, "urban"));
        if (result.status) {
            let data = result.data;
            let newData = [];
            newData = data.map((x: any) => ({
                type: x.LOCALITY_STREET,
                code: x.LOCALITY_STREET_KEY,
            }));
            if (data && data.length > 0) {
                setHabitationList(newData);
                setHabitationCodeList(data);
                if (data2.habitation) {
                    let selected:any = data.find(e => e.LOCALITY_STREET_KEY == data2?.habitationKey|| e.LOCALITY_STREET_KEY == data2?.habitationOr);
                    setPropertyDetails({ ...data2, loc: selected?.LOC })
                }
            }
        }
        else {
            // ShowMessagePopup(false, result.message, "")
        }
    }

    const GetSROOfficeList = async (id: any) => {
        let result = await CallingAxios(useSROOfficeList(id));
        if (result.status) {
            setSROOfficeList(result.data);
        }
    }

    const validationsForDoorNo = (addValue, addName) => {
        let isdoorNumValid = false;
        if (PropertyDetails?.propertyType?.toUpperCase()?.startsWith("URBAN")) {
        if (addValue.trim().length > 0) {
            let splitDoorValue = addValue.toUpperCase().split("-");
            if ((PropertyDetails.ward!=0 || PropertyDetails.ward!="0" )  && 
                (PropertyDetails.block!=0 || PropertyDetails.block!="0" ))
            {
                if (splitDoorValue.length > 2) {
                    let wardDoorVal = !isNaN(splitDoorValue[0]) ? parseInt(splitDoorValue[0]) : splitDoorValue[0];
                    let blockDoorVal = !isNaN(splitDoorValue[1]) ? parseInt(splitDoorValue[1]) : splitDoorValue[1];
                    let wardDoorPrefix = PropertyDetails.ward+"";
                    let byWardDoorPrefix = PropertyDetails.biWard?.trim();
                    if(byWardDoorPrefix)
                        wardDoorPrefix = wardDoorPrefix+"/"+byWardDoorPrefix;
                    let blockDoorPrefix = PropertyDetails.block+"";
                    let byBlockDoorPrefix = PropertyDetails.biBlock?.trim();
                    if(byBlockDoorPrefix)
                        blockDoorPrefix = blockDoorPrefix+"/"+byBlockDoorPrefix;
                    if(wardDoorVal == wardDoorPrefix && blockDoorVal == blockDoorPrefix )
                        isdoorNumValid = true;
                }
            }
            else if (PropertyDetails.block!=0 || PropertyDetails.block!="0" )
            {
                if (splitDoorValue.length > 1) {
                let blockDoorVal = !isNaN(splitDoorValue[0]) ? parseInt(splitDoorValue[0]) : splitDoorValue[0];
                let blockDoorPrefix = PropertyDetails.block+"";
                let byBlockDoorPrefix = PropertyDetails.biBlock?.trim();
                if(byBlockDoorPrefix)
                    blockDoorPrefix = blockDoorPrefix+"/"+byBlockDoorPrefix;
                if(blockDoorVal == blockDoorPrefix)
                    isdoorNumValid = true;
                }
            }
            else if (PropertyDetails.ward!=0 || PropertyDetails.ward!="0" )
            {
                if (splitDoorValue.length > 1) {
                let wardDoorVal = !isNaN(splitDoorValue[0]) ? parseInt(splitDoorValue[0]) : splitDoorValue[0];
                let wardDoorPrefix = PropertyDetails.ward+"";
                let byWardDoorPrefix = PropertyDetails.biWard?.trim();
                if(byWardDoorPrefix)
                    wardDoorPrefix = wardDoorPrefix+"/"+byWardDoorPrefix;
                if(wardDoorVal == wardDoorPrefix)
                    isdoorNumValid = true;
                }
            }else{
                isdoorNumValid = true;
            }
        }            
        }else{
            isdoorNumValid = true;
        }
        if (!isdoorNumValid) {
            ShowAlert(false,"Door Number is not matched with Habitation/Locality selected");
            return false;
        }else{
            if(addName){
                if(LoginDetails?.loginEmail !== 'APIIC'){
                    ValidSurvey(addValue,addName);
                }
            }
        }
        return true;
    }

    const onChange = async(event: any) => {
        let TempDetails = { ...PropertyDetails };
        let addName = event.target.name;
        let addValue = event.target.value;
        var alpha  = /^[a-zA-Z]+$/;
        if (
            // addName == 'layoutName' || 
            addName == 'appartmentName') {
            // addValue = addValue.replace(/[^\w\s]/gi, "");
            // addValue = addValue.replace(/[0-9]/gi, "");
        }
        if (addName == 'urban_selling_extent') {
            if (addValue == 'FULL') {
                setPropertyTypes(["FLAT [ఫ్లాట్]","HOUSE [ఇల్లు]"])
                if (CDMADetails) {
                    TempDetails = { ...TempDetails, extent: CDMADetails.siteExtent }
                }
            }
            else {
                setPropertyTypes(["HOUSE [ఇల్లు]"]);
                setIsFlat(false);
                TempDetails = { ...TempDetails, extent: '',schedulePropertyType:"HOUSE [ఇల్లు]" }
            }
        };
        if(addName === 'extent' && PropertyDetails.urban_selling_extent==='PARTIAL' && parseFloat(PropertyDetails.totalExtent) <= parseFloat(addValue)){
            ShowMessagePopup(false,"Extent should not be greater than or equal to total extent","")
        }
        // if(addName === 'extent' && PropertyDetails.urban_selling_extent === 'PARTIAL'){
        //     if(CDMADetails?.siteExtent){
        //         if(Number(addValue)>Number(CDMADetails.siteExtent)){  
        //             ShowMessagePopup(false,"Extent should not be greater than total extent"," ")
        //         }
        //     }
        // }
        
        if(addName=='WeblandSelection'){
            if(CDMADetails?.siteExtent){
            if(CDMADetails.propertyAddress.split(",")[0] != PropertyDetails.doorNo){
                ShowMessagePopup(false,'Entered door no not matching with the property door no','')
            }
                TempDetails = { ...TempDetails, propertySelected:true}
            }
        }
        if (addName == 'appartmentName') {
            // addValue = addValue.replace(/[^\w\s/,-]/gi, "");

            if (String(addValue).length < 100) {
            }
            if (addValue.length > 100) {
                addValue = addValue.substring(0, 100);
            }
        } else if (addName == "flatNo") {
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
            TempDetails = { ...TempDetails, appartmentName: ""}
            if (addValue == "FLAT [ఫ్లాట్]") {
                ShowAutoAlert(
                  "info",
                  "Further, it is informed that, if multiple schedules are added for the same flat property, it will adversely affect the Auto-Mutation process in the CARD 2.0 system.",
                );
                TempDetails = { ...TempDetails, appartmentName: "", undividedShare: "", undividedShareUnit: "", flatNo: "" }
                setIsFlat(true)
            } else {
                setIsFlat(false)
            }

        } else if (addName == "doorNo") {
            if (addValue == "") {
                setAllowProceed(false);
            }
            addValue = addValue.replace(/[^A-Za-z0-9/-]/g, '');
            if(!checkLUC){
                setPropertyDetails({ ...PropertyDetails, nearTodoorNo: ''});
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
            // let errorLabel = ""
            // if (addValue.length < 50) {
            //     errorLabel = "Enter 10 Digits Number";
            // }
            if (addValue.length > 100) {
                addValue = addValue.substring(0, 100);
            }
        } else if(addName == "reraApprovalNo" || addName == 'buildingApprovalNo'){
            const alphanumeric = /^[a-zA-Z0-9]*$/
            if(!alphanumeric.test(addValue[0])){
                setPropertyDetails({ ...TempDetails, [addName]: "" });
                return
            }
            else if(!alphanumeric.test(addValue))
                return
            else{ 
                addValue = addValue.toUpperCase();
                if(addName == 'reraApprovalNo' && addValue.length == 12){
                    setPropertyDetails({ ...TempDetails, [addName]: addValue });
                    let result = await CallingAxios(getReraProjectDetails(addValue));
                    if(result.status){
                        setReraProjectDetails(result.data['Result'] || [])
                    }else{
                        setReraProjectDetails([])
                        addValue = ''
                        ShowMessagePopup(false, result.message, '');
                    }
                }
                if(addName == 'buildingApprovalNo' && addValue.length == 12){

                }
            }
        }else if (addName == "village") {
            setHabitationList([]);  
            let selected = VillageCodeList.find(e => e.VILLAGE_NAME == addValue);
            TempDetails = { ...TempDetails, villageCode: selected.VILLAGE_CODE, habitationCode: "", habitation: "" }
            GetHabitation(selected.VILLAGE_CODE);
            GetLpmCheck(selected.VILLAGE_CODE);
        } else if (addName == "lpmNo") {
            TempDetails = { ...TempDetails, lpmNo: addValue }
        } else if (addName == "habitation") {
            setSelectedDoorNumData({})
            setCDMADetails({});
            TempDetails = { ...TempDetails, doorNo: '', ptinNo: '', secratariatWard: '', localBodyName: '', localBodyType: ''}
            if (addValue == "") { return; }
            let selected = HabitationCodeList.find(e => e.LOCALITY_STREET_KEY == addValue);
            addValue = selected.LOCALITY_STREET_KEY
            if (checkLUC) {
                let doorNo = "";
                if(selected.WARD_NO!="0" && selected.WARD_NO!=0){
                    let biWardVal = selected.BI_WARD ? selected?.BI_WARD : '';
                    doorNo = doorNo+selected.WARD_NO;
                    if(biWardVal.length>0){
                        doorNo = doorNo+"/"+biWardVal;
                    }
                    doorNo = doorNo+"-";
                }
                if(selected.BLOCK_NO!="0" && selected.BLOCK_NO!=0){
                    let biBlockVal = selected.BI_BLOCK ? selected?.BI_BLOCK : '';
                    doorNo = doorNo+selected.BLOCK_NO;
                    if(biBlockVal.length>0){
                        doorNo = doorNo+"/"+biBlockVal;
                    }
                    doorNo = doorNo+"-";
                }
                TempDetails['doorNo'] = doorNo;
            }
            if(PropertyDetails.mode =="edit"){
                TempDetails = { ...TempDetails, habitationCode: selected.HABITATION, ward: selected.WARD_NO, block: selected.BLOCK_NO, biWard: selected.BI_WARD ? selected?.BI_WARD : '', biBlock: selected.BI_BLOCK ? selected?.BI_BLOCK : '', loc: selected.LOC,habitationOr:selected.LOCALITY_STREET_KEY, habitationKey: selected.LOCALITY_STREET_KEY}
            }else{
                TempDetails = { ...TempDetails, habitationCode: selected.HABITATION, ward: selected.WARD_NO, block: selected.BLOCK_NO, biWard: selected.BI_WARD ? selected?.BI_WARD : '', biBlock: selected.BI_BLOCK ? selected?.BI_BLOCK : '', loc: selected.LOC, habitationKey: selected.LOCALITY_STREET_KEY}
            }
            
            if (selected)
                GetLocalBodiesData(selected.HABITATION);
        } else if(addName ==="survayNo" && alpha.test(addValue[0])){
            // window.alert(JSON.stringify(alpha.test(addValue[0])))
            addValue =""
            TempDetails = { ...TempDetails, survayNo: "" }
        } else if (addName == "ptinNo") {
            setSelectedDoorNumData({})
            setCDMADetails({});
            if (addValue.length > 10) {
                setGramData({});
                setCDMADetails({});
                if (PropertyDetails.localBodyType) {
                    if ((!PropertyDetails.localBodyType.includes('GRAM PANCHAYAT') && addValue.length > 10) || (PropertyDetails.localBodyType.includes('GRAM PANCHAYAT') && addValue.length > 17)) {
                        addValue = PropertyDetails.ptinNo
                    }
                    else {
                        setSelectedcdmaDetails({})
                    }
                }
            }
        } else if (addName == 'localBodyTypeName') {
            let value = localBodyTypeList.find(x => x.type == addValue)
            TempDetails = { ...TempDetails, localBodyType: value.type, localBodyCode: value.code, ptinNo: '', doorNo: TempDetails.doorNo.replace(/^((?:[^-]*-){2}).*$/, "$1") };
            setGramData({});
            setCDMADetails({});
        } else if(addName === 'secratariatWard'){
            const filteredSecratariatWard = secratariatWards.filter(obj=>obj.code===addValue);
            TempDetails['secratariatWardName'] = filteredSecratariatWard[0].type;
            TempDetails['electionWard'] = filteredSecratariatWard[0].electionWardCode
            TempDetails['electionWardName'] = filteredSecratariatWard[0].electionWardName
        }
        else if (addName == "partyNumber") {
            const selectedClaimant = partiesFormattedOptions.find(
                (item) => item.label === addValue
            );
            addValue = selectedClaimant ? String(selectedClaimant.seqNumber) : "";
        }
        setPropertyDetails({ ...TempDetails, [addName]: addValue });
    }
    let value;
    const captchaCheck = async () => {
        if (inputValue == "") {
            ShowAlert(false, "Please Enter The Capctha");
        } else {
            let captchaCheckdata: any = await checkCaptcha(inputValue);
            if (captchaCheckdata === false) {
                ShowAlert(false, "Please Enter Valid Capctha");
                //   Captcha();
            } else {
                if (PropertyDetails.localBodyType) {
                    if ((PropertyDetails.localBodyType.includes('GRAM PANCHAYAT') && PropertyDetails.ptinNo.length > 10) || (PropertyDetails.localBodyType.includes('GRAM PANCHAYAT') && PropertyDetails.ptinNo.length <= 17)) {
                        value = 'Y'
                        CallCDMADetails(PropertyDetails.ptinNo, value,true);
                    }
                    else if (PropertyDetails.ptinNo.length == 10) {
                        CallCDMADetails(PropertyDetails.ptinNo, ApplicationDetails.amount,true);

                    }
                }
                else if (PropertyDetails.ptinNo.length == 10) {
                    // let r = await checkUlbCodeJurisdiction(ApplicationDetails.sroCode, PropertyDetails.ptinNo.substring(0,4));
                    // if(r.status){
                    CallCDMADetails(PropertyDetails.ptinNo, ApplicationDetails.amount,true);
                    // } else {
                    //     setCDMADetails({})
                    //     setSelectedcdmaDetails({})
                    //     ShowAlert(false, r.message);
                    // }
                } else {
                    if (PropertyDetails.ptinNo.length === 17 && false) {
                        // let r = await CallingAxios(getGrampanchayatDetails(PropertyDetails.ptinNo));
                        // if (r.status) {
                        //     setGramData(get(r, 'data.DATA.0', {}));
                        // } else {
                        //     setGramData({});
                        // }
                    }
                }
            }
        }
    }
    const CallCDMADetails = async (PtinCode, value,isShowPendingBillsPopUp) => {
    let data = {
        ulbCode: value == 'Y' ? PtinCode : PtinCode.substring(0, 4),
        assessmentNo: PtinCode,
        registrationValue: (value == 'Y') ? 1 : value < 1 ? 1 : value,
        marketValue: (value == 'Y') ? 1 : value < 1 ? 1 : value,
        sroCode: PropertyDetails.sroCode,
        villageCode: PropertyDetails.villageCode


    }
    // let result = await CallingAxios(GetCDMAData(data));
    setPtinCode({...ppnCodeAdd,ptinCode:`${PtinCode?PtinCode:0}`})
    let result = await CallingAxios(GetCDMADetails(data));

    if (result?.status && result?.data) {
        result.data.nature_of_property_desc ? result.data.nature_of_property_desc == 'GOVERNMENT' ? ShowAlert(false, 'This property is belongs to Government') : "" : ''
        if(PropertyDetails.urban_selling_extent=='FULL'){
            setPropertyDetails({...PropertyDetails,extent:result.data.siteExtent})
        }
        setPropertyDetails({...PropertyDetails,ptinNo:result.data.propertyID,extent:result.data.siteExtent})
        setCDMADetails(result.data);
        let cdma = {
            propertyAddress: result.data.propertyAddress,
            // localityName:result.data.boundaryDetails?.localityName,
            // aadharNumber:result.data.ownerNames[0].aadhaarNumber,
            ownerNames: result.data.ownerNames,
            // mobileNumber:result.data.ownerNames.map(o => o.ownerName ? o.ownerName: '').join(','),
            emailId: result.data.ownerNames[0].emailId,
            siteExtent: (result.data.siteExtent ? result.data.siteExtent : ''),
            taxDue: result.data?.propertyDetails?.taxDue,
            houseNo: result.data.houseNo,
            propertyID:result.data.propertyID?result.data.propertyID:`${result.data.ppnuniqueno?result.data.ppnuniqueno:'0'}`,
            propertyDetails:{
                propertyType:result.data?.propertyDetails?.propertyType.toUpperCase()?.includes("VACANT") ? "VAC_LAND":result.data?.propertyDetails?.propertyType,
                taxDue:result.data?.propertyDetails?.taxDue
            },
            exempted:false,
            waterTaxDue: result.data?.waterTaxDue,
            siteExtentUnit:"sqyds",
            sewerageDue: result.data?.sewerageDue,
            superStructure:false,
            underCourtCase:false,
            underWorkFlow:false,
            mutationFee:result.data?.mutationFee,
            documentvalue:result.data?.documentvalue ,
            mutationDues:result.data?.mutationDues,
            errorDetails:{"errorCode":"PTIS-REST-0","errorMessage":"SUCCESS"},
        }
        setSelectedcdmaDetails({ ...cdma })
}      
    
    else {
        ShowAlert(false, result.message);
        setCDMADetails({})
        setSelectedcdmaDetails({});
        setPropertyDetails({ ...JSON.parse(JSON.stringify(PropertyDetails))});
    }
}
const rentalValidation = async ()=>{
    let trp:any =0, fData:any={}
    await leaseData.rentalDetails.map((rp:any)=>{
        trp = Number(trp) + Number(rp.rentalPeriod);
        //  window.alert(JSON.stringify(trp))
        if(rp.rentalAmount == ""){
            fData.rnamt = false
            // SetRnamt(false);
        }else if(!fData.rnamt){
            fData.rnamt = true;
        }
        fData.trpVal = trp;
    }); 
    // window.alert(JSON.stringify(fData))
    return fData; 
}

    const onSubmit = async (e: any) => {
        e.preventDefault();
        let rnData:any;
        if(PropertyDetails.schedulePropertyType == "FLAT [ఫ్లాట్]"){
            const exists = ApplicationDetails?.property?.some((prop) => (prop?.habitationCode == PropertyDetails?.habitationCode && prop?.flatNo == PropertyDetails?.flatNo && prop?.doorNo == PropertyDetails?.doorNo && prop?._id !== PropertyDetails?._id))
            if(exists){
                ShowAlert(false , `Door No.: ${PropertyDetails?.doorNo} and Flat No.: ${PropertyDetails?.flatNo} already exist in the previous schedules.`)
                return
            }
        }
        if(ApplicationDetails?.documentNature?.TRAN_MAJ_CODE == "07" && leaseData.rentalDetails && leaseData.rentalDetails.length >0){
            rnData = await rentalValidation();
        }
        if(Object.keys(CDMADetails).length && (CDMADetails.superStructure || CDMADetails.exempted)){
            ShowAlert(false, "Property set under prohibition by MAUD");
        }else if( checkLUC && PropertyDetails && PropertyDetails?.structure && PropertyDetails?.structure?.length ===0){
            ShowAlert(false, "Please Add Atleast One StructureDetails");
        }else if(ApplicationDetails?.documentNature?.TRAN_MAJ_CODE === "07" && (leaseData.wef == "" || leaseData.lPeriod  == null || leaseData.advance == null || leaseData.muncipalTax == null || leaseData.advance == "" || leaseData.muncipalTax == "" || (leaseData.rentalDetails && leaseData.rentalDetails.length ===0) )){
            ShowMessagePopup(false, "Please Add the Lease Details", "");
        }else if(ApplicationDetails?.documentNature?.TRAN_MAJ_CODE === "07" &&  leaseData.rentalDetails && leaseData.rentalDetails.length > 0  && rnData.trpVal != leaseData.lPeriod){
        //    if(trp != leaseData.lPeriod ){
                // window.alert(JSON.stringify(rnData.trpVal))
                ShowMessagePopup(false, "Lease Period And Rental perod Should be Equal", "");
        //    }
        }else if(ApplicationDetails?.documentNature?.TRAN_MAJ_CODE === "07" && !rnData.rnamt){
            ShowMessagePopup(false, "Please Add the renatal Details", "");
        } else if(PropertyDetails.doorNo && !validationsForDoorNo(PropertyDetails.doorNo, null)){
            //Message will be displayed in above validationsForDoorNo method. So need to add here.
        } else if(PropertyDetails.nearTodoorNo && !validationsForDoorNo(PropertyDetails.nearTodoorNo, null)){
            //Message will be displayed in above validationsForDoorNo method. So need to add here.
        }else if(ApplicationDetails.documentNature.TRAN_MAJ_CODE ==='08' && (ApplicationDetails.documentNature.TRAN_MIN_CODE === '06') && PropertyDetails.LinkedDocDetails && PropertyDetails.LinkedDocDetails.length === 0){
            ShowMessagePopup(false, "Atleast One Link Document Entry is Required", "");
        }else  if([1,2,6,7,'01','02','06','07'].includes(PropertyDetails.landUseCode) && (PropertyDetails.ptinNo=='0'||PropertyDetails.ptinNo.length!=10)){
                 ShowMessagePopup(false, "Invalid PTIN Number","");
        }   
         else {
        let Details = { ...PropertyDetails };
        Details.reraApprovalNo = PropertyDetails.reraApprovalNo != '' && PropertyDetails.reraApprovalNo?.length != 12 && reraProjectDetails.length == 0 ? '' : Details.reraApprovalNo;
        if(Object.keys(selectedcdmaDetails).length){
            Details.cdma_details=JSON.stringify(selectedcdmaDetails);
        }
        if(Details.urban_selling_extent==='PARTIAL' && parseFloat(Details.totalExtent) <= parseFloat(Details.extent)){
           return ShowMessagePopup(false, "Total extent cannot be less than or equal to the Selling extent. Please verify and enter a valid total extent value.", ""); 
        };
        if(isMutationEnabled && PropertyDetails?.ptinNo?.length === 10 && Object.keys(selectedcdmaDetails)?.length === 0 ){
            ShowMessagePopup(false, "Respective PTIN number is not having CDMA details", "");
            return false;
        }
        if(PropertyDetails?.ptinNo != selectedcdmaDetails?.propertyID && PropertyDetails.landUseCode !== 9 && PropertyDetails.landUseCode !== 11 && PropertyDetails.landUseCode !== '09' && PropertyDetails.landUseCode !== '11'){
            return ShowMessagePopup(false, "Please Validate your PTIN", "");
        }
        if (Details.extent == '' || Details.extent == 0 || Details.extent == '0' || parseFloat(Details.extent) < 1) {
           return ShowMessagePopup(false, "Site extent must be greater than 0", "");
        }
        let units = Details.propertyType.includes("RURAL") === true ? 'A' : 'Y';
        Details.conveyedExtent = [];
        Details.tExtent = "";
        let conveyedExt: any = {};
        conveyedExt.extent = Details.extent;
        conveyedExt.unit = Details.extentUnit
        setConveyExtent(conveyedExt.extent)
        setConveydUnit(conveyedExt.unit)
        conveyedExt.unit = units;
        Details.conveyedExtent = [...Details.conveyedExtent, conveyedExt];
        Details.tUnits = units;
        // const ob1 = localBodyTypeList.filter(ob => ob.type == Details.localBodyType)[0];
        // Details.localBodyType = ob1.type;
        Details.localBodyCode = Details.localBodyCode;///////////////////////////////////////////////////////////////
        //  Details.localBodyType = Details.localBodyTypeName;
        // Details.localBodyType 
        if(ApplicationDetails?.documentNature?.TRAN_MAJ_CODE =="07"){
            Details ={...Details,leaseDetails:ApplicationDetails.leasePropertyDetails}
            // window.alert(JSON.stringify(Details))
        }
        let mvResultOfRural:any=null;
        // let MVResult = await MVCalculator();
        let MVResult:any;

        if(ApplicationDetails?.documentNature?.TRAN_MAJ_CODE === "07" && leaseData.lPeriod <= 30){
            MVResult ={
                marketValue : Number(leasegranTotal) / Number(leaseData.lPeriod)  + Number(leaseData.advance) + Number(leaseData.muncipalTax)
            }
        }else{
            MVResult = await MVCalculator();
        }
        let extRate:any;
        if(!checkLUC){
            let vgCode = wbVgCode != "" ? wbVgCode : PropertyDetails.villageCode;
            let Obj:any={
                "vgCode": vgCode,
                "surveyNo": Details.survayNo
            }
            let vacantMvForm4Check:any = await UseGetVacantLandExtRate(Obj);
            // window.alert(JSON.stringify(vacantMvForm4Check));
            if(vacantMvForm4Check && vacantMvForm4Check.data && vacantMvForm4Check.data.length >0  && vacantMvForm4Check.data[0].UNIT_RATE > 0){
                mvResultOfRural = await MVCalculatorRural(Details.extent,Details.survayNo);
                MVResult =  mvResultOfRural.marketValue >= MVResult.marketValue ? mvResultOfRural : MVResult;
                extRate =mvResultOfRural.marketValue >= MVResult.marketValue ? mvResultOfRural.ext_Rate : MVResult.ext_Rate;
            }
            // Math.max(Number(mvResultOfRural.marketValue),Number(MVResult.marketValue));
        }
        // window.alert(JSON.stringify(Math.max(Number(mvResultOfRural.marketValue),Number(MVResult.marketValue))))
        if(PropertyDetails.mode== 'proceed' || PropertyDetails.mode=='edit' || PropertyDetails.mode=='Update'){
            //alert(`${PropertyDetails.mode} ${PropertyDetails.propertySelected}`)
            if(PropertyDetails?.propertySelected==false){
                return ShowMessagePopup(false,"Please select the CDMA property details",'')
            }
        }
        
        if (MVResult) {
            Details.structure?.map((structObj:any)=>{
             if (!(typeof structObj.floorNo==='number' || (structObj.floorNo).length ===2)){
             const res=MasterData['floorNo'].filter((obj:any)=>{
            const val=structObj.floorNo.split('-')[1];
            const cond= val?val<10?`0${val}`:val:structObj.floorNo
            return val?obj.code == cond : obj.desc === cond
            });
            structObj.floorNo=res[0]?.code;
                }
           
            });
            const tranMaj = ApplicationDetails.registrationType?.TRAN_MAJ_CODE;
                const tranMin = ApplicationDetails.documentNature?.TRAN_MIN_CODE;
                if (tranMaj === '01' && (tranMin === '28' || tranMin === '29')) {
                    switch (true) {
                        case Details.extent <= 150:
                            Details.marketValue = Math.round(MVResult.marketValue * 0 / 100);
                            break;
                        case Details.extent > 150 && Details.extent <= 300:
                            Details.marketValue = Math.round(MVResult.marketValue * 15 / 100);
                            break;
                        case tranMin === '28' && Details.extent > 300 && Details.extent <= 450:
                            Details.marketValue = Math.round(MVResult.marketValue * 200 / 100);
                            break;
                        case tranMin === '29' && Details.extent > 300 && Details.extent <= 450:
                            Details.marketValue = Math.round(MVResult.marketValue * 100 / 100);
                            break;
                        case Details.extent > 450:
                            Details.marketValue = Math.round(MVResult.marketValue * 500 / 100);
                            break;
                        default:
                            Details.marketValue = MVResult.marketValue || 0;
                    }
                }
                else if(ApplicationDetails?.documentNature?.TRAN_MAJ_CODE =="07" && ApplicationDetails?.leasePropertyDetails?.lPeriod <= 30){
                    Details.marketValue = ApplicationDetails?.documentNature?.TRAN_MIN_CODE == "06" ? 0 : TotalMarketValueCalculator(ApplicationDetails)
                }
                else if(ApplicationDetails?.documentNature?.TRAN_MAJ_CODE =="01" && ApplicationDetails?.documentNature?.TRAN_MIN_CODE =="26" && PropertyDetails.conveyanceType.split("(")[0] ==="Both"){
                    Details.marketValue = MVResult.marketValue ? Number(MVResult.marketValue) + Number(PropertyDetails?.conveyanceValue) : 0;
        }else{
           Details.marketValue = (ApplicationDetails?.documentNature?.TRAN_MAJ_CODE =="07" && ApplicationDetails?.documentNature?.TRAN_MIN_CODE == "06") 
                        ? 
                            0 
                        : 
                            MVResult.marketValue ? MVResult.marketValue : 0;
        }
        Details.ext_Rate =extRate == undefined ? MVResult.ext_Rate : extRate;
            Details.applicationId = ApplicationDetails.applicationId;
            if (Details && Details.villageCode && Details.villageCode.length === 6) {
                Details.villageCode = "0" + Details.villageCode;
            }
            if (Details && String(Details.localBodyCode) && String(Details.localBodyCode).length === 1) {
                Details.localBodyCode = "0" + String(Details.localBodyCode);
            }
            if (Details && String(Details.landUseCode) && String(Details.landUseCode).length === 1) {
                Details.landUseCode = "0" + String(Details.landUseCode);
            }
            Details.isLinkedDocDetails = false;
            let [habs,rest] = Details?.habitation.split("*");
            Details.habitationOr= Details.mode =="edit" ? Details.habitationOr : Details.habitation;
            Details.habitation = habs;
            if(!mLinkDocs || mLinkDocs && PropertyDetails.LinkedDocDetails && PropertyDetails.LinkedDocDetails.length > 0){
                let data3 = {
                    // ulbCode: PropertyDetails.ptinNo.substring(0, 4),
                    // assessmentNo: PropertyDetails.ptinNo,
                    // registrationValue: MVResult.marketValue,
                    // marketValue: MVResult.marketValue
                    sroCode:Details.sroCode,
                    villageCode:Details.villageCode,
                    ulbCode: value == 'Y' ? PropertyDetails.ptinNo : PropertyDetails.ptinNo.substring(0, 4),
                    assessmentNo: PropertyDetails.ptinNo,
                    registrationValue: Details.marketValue,
                    marketValue: (value == 'Y') ? 'Y' : Details.marketValue,
                }
                let r:any;
                // if(`${PropertyDetails.ptinNo}` && `${PropertyDetails.ptinNo}`.length == 10){,
                if(Object.keys(CDMADetails).length >0 && CDMADetails.propertyID!==0){
                    r = await CallingAxios(GetCDMADetails(data3));
                }else{
                    Details.cdma_details ="";
                    Details.cdma_details =JSON.stringify({
                        propertyAddress:`${Details.doorNo},Ward No - ${Details.ward},Block No - ${Details.block},${(Details.habitation).split('(')[0]},${Details.village}`,
                        ownerNames: [{
                                ownerName: "",
                                gender: "",
                                guardian: "",
                                guardianRelation: ""
                        }],
                        siteExtent:Details.extent,
                        taxDue:0,
                        houseNo: Details.doorNo,
                        propertyID:0,
                        propertyDetails:{
                            propertyType: PropertyDetails?.landUse?.toUpperCase()?.includes("VACANT") ? "VAC_LAND" : "PRIVATE",
                            taxDue: 0
                        },
                        exempted:false,
                        waterTaxDue: 0,
                        siteExtentUnit:"sqyds",
                        sewerageDue: 0,
                        superStructure:false,
                        underCourtCase:false,
                        underWorkFlow:false,
                        mutationFee:0,
                        documentvalue:MVResult.marketValue?MVResult.marketValue:0 ,
                        mutationDues:0,
                        errorDetails:{"errorCode":"null","errorMessage":"SUCCESS"}
                    }) 
                }
                if (PropertyDetails.mode == "edit") {
                    let cdma = "";
                    if(PropertyDetails.urban_selling_extent === 'FULL'){
                        if(`${initialPropertyDetails.ptinNo}` == `${PropertyDetails.ptinNo}`){
                            const updatedCdmaDetails = JSON.parse(PropertyDetails.cdma_details);
                            if(updatedCdmaDetails.ptinNo!=='0'){
                                cdma = MVResult.marketValue ? initialPropertyDetails.cdma_details : '';
                            }else{
                                const updatedCDMAParams =JSON.stringify({
                                    propertyAddress:`${PropertyDetails.doorNo},Ward No - ${PropertyDetails.ward},Block No - ${PropertyDetails.block},${(PropertyDetails.habitation).split('(')[0]},${PropertyDetails.village}`,
                                    ownerNames: [{
                                            ownerName: "",
                                            gender: "",
                                            guardian: "",
                                            guardianRelation: ""
                                    }],
                                    siteExtent:PropertyDetails.extent,
                                    taxDue:0,
                                    houseNo: PropertyDetails.doorNo,
                                    propertyID:0,
                                    propertyDetails:{
                                        propertyType: PropertyDetails?.landUse?.toUpperCase()?.startsWith("VACANT") ? "VAC_LAND" : "PRIVATE",
                                        taxDue: 0
                                    },
                                    exempted:false,
                                    waterTaxDue: 0,
                                    siteExtentUnit:"sqyds",
                                    sewerageDue: 0,
                                    superStructure:false,
                                    underCourtCase:false,
                                    underWorkFlow:false,
                                    mutationFee:0,
                                    documentvalue:MVResult.marketValue?MVResult.marketValue:0 ,
                                    mutationDues:0,
                                    errorDetails:{"errorCode":"null","errorMessage":"SUCCESS"}
                                }) 
                                cdma = MVResult.marketValue ? updatedCDMAParams : '';
                            }

                        } else if(r && r.data && Object.keys(r.data).length){
                            cdma = JSON.stringify(r.data);
                        }
                    }
                    //Details["cdma_details"] = cdma;
                    if (ApplicationDetails.registrationType.TRAN_MAJ_CODE ==='01' && (ApplicationDetails.documentNature.TRAN_MIN_CODE === '28' || ApplicationDetails.documentNature.TRAN_MIN_CODE === '29')) {
                        let  currentMarketValue = Details.marketValue 
                    let ftv:any;
                    if(ApplicationDetails.docsExcutedBy == "GovtBody"){
                        ftv = ApplicationDetails.amount
                    }else{
                        ftv =ApplicationDetails.amount > currentMarketValue ? ApplicationDetails.amount : currentMarketValue;
                    }

                    let data1 = {
                        "tmaj_code": ApplicationDetails.registrationType.TRAN_MAJ_CODE,
                        "tmin_code": ApplicationDetails.documentNature.TRAN_MIN_CODE,
                        "sroNumber": ApplicationDetails.sroCode,
                        "local_body": 3,
                        "flat_nonflat": "N",
                        "marketValue": currentMarketValue,
                        "finalTaxbleValue": doctcondtion?ApplicationDetails.amount : ftv,
                        "con_value": ApplicationDetails.amount,
                        "adv_amount": 0
                    }
                    let result = await UseDutyCalculator(data1);
                    let tempDutyfee:any ;
                    if(ApplicationDetails.documentNature.TRAN_MAJ_CODE ==='01' && (ApplicationDetails.documentNature.TRAN_MIN_CODE === '28' || ApplicationDetails.documentNature.TRAN_MIN_CODE === '29') && conveyedExt.extent <='150' && conveyedExt.unit === 'Y'){
                        tempDutyfee ={sd_p:'0',td_p:'0',rf_p:'0'}
                        setCalculatedDutyFee({...CalculatedDutyFee,TRAN_MAJ_CODE:ApplicationDetails.registrationType.TRAN_MAJ_CODE,TRAN_MIN_CODE:ApplicationDetails.registrationType.TRAN_MIN_CODE,sroCode:ApplicationDetails.sroCode,amount:ApplicationDetails.amount,sd_p:'0',td_p:'0',rf_p:'0',})
                    }
                    else if(ApplicationDetails.documentNature.TRAN_MAJ_CODE ==='01' && ApplicationDetails.documentNature.TRAN_MIN_CODE === '29' && conveyedExt.extent > '150' && conveyedExt.extent <= '450' && conveyedExt.unit === 'Y'){
                    tempDutyfee ={sd_p: (parseFloat(result.data.sd_p) / 2).toString(),td_p: (parseFloat(result.data.td_p) / 2).toString(), rf_p: (parseFloat(result.data.rf_p) / 2).toString()}
                        setCalculatedDutyFee({...CalculatedDutyFee,TRAN_MAJ_CODE:ApplicationDetails.registrationType.TRAN_MAJ_CODE,TRAN_MIN_CODE:ApplicationDetails.registrationType.TRAN_MIN_CODE,sroCode:ApplicationDetails.sroCode,amount:ApplicationDetails.amount,sd_p: (parseFloat(result.data.sd_p) / 2).toString(),td_p: (parseFloat(result.data.td_p) / 2).toString(), rf_p: (parseFloat(result.data.rf_p) / 2).toString(),})
                    }
                    else{
                        tempDutyfee ={ sd_p: result.data.sd_p, td_p: result.data.td_p, rf_p: result.data.rf_p}
                        setCalculatedDutyFee({ ...CalculatedDutyFee, TRAN_MAJ_CODE: ApplicationDetails.registrationType.TRAN_MAJ_CODE, TRAN_MIN_CODE: ApplicationDetails.documentNature.TRAN_MIN_CODE, sroCode: ApplicationDetails.sroCode, amount: ApplicationDetails.amount, sd_p: result.data.sd_p, td_p: result.data.td_p, rf_p: result.data.rf_p });
                       } 

                    let data = {
                        stampDutyFeePayable:tempDutyfee.sd_p,
                        registrationFeePayable:tempDutyfee.rf_p,
                        transferDutyFeePayable:tempDutyfee.td_p,
                        userCharges:'500',
                        marketValue: Details.marketValue,
                        }
                        Details.Go134=data;
                    }
                    let result = await CallingAxios(UseUpdateProperty(Details));
                    if (result.status) {
                        ShowMessagePopup(true, "Property Updated Successfully with MarketValue:" + Details.marketValue + ".", "/PartiesDetailsPage")
                    }
                    else {
                        ShowMessagePopup(false, "Property Update Failed", "");
                    }
                }
                else {
                    // window.alert(JSON.stringify(Details))
                    //Details["cdma_details"] = PropertyDetails.urban_selling_extent === 'FULL' && r && r.data && Object.keys(r.data).length ? JSON.stringify(r.data) : '';
                    if (ApplicationDetails.registrationType.TRAN_MAJ_CODE ==='01' && (ApplicationDetails.documentNature.TRAN_MIN_CODE === '28' || ApplicationDetails.documentNature.TRAN_MIN_CODE === '29')) {
                        let  currentMarketValue = Details.marketValue 
                    let ftv:any;
                    if(ApplicationDetails.docsExcutedBy == "GovtBody"){
                        ftv = ApplicationDetails.amount
                    }else{
                        ftv =ApplicationDetails.amount > currentMarketValue ? ApplicationDetails.amount : currentMarketValue;
                    }

                    let data1 = {
                        "tmaj_code": ApplicationDetails.registrationType.TRAN_MAJ_CODE,
                        "tmin_code": ApplicationDetails.documentNature.TRAN_MIN_CODE,
                        "sroNumber": ApplicationDetails.sroCode,
                        "local_body": 3,
                        "flat_nonflat": "N",
                        "marketValue": currentMarketValue,
                        "finalTaxbleValue": doctcondtion?ApplicationDetails.amount : ftv,
                        "con_value": ApplicationDetails.amount,
                        "adv_amount": 0
                    }
                    let result = await UseDutyCalculator(data1);
                    let tempDutyfee:any ;
                    if(ApplicationDetails.documentNature.TRAN_MAJ_CODE ==='01' && (ApplicationDetails.documentNature.TRAN_MIN_CODE === '28' || ApplicationDetails.documentNature.TRAN_MIN_CODE === '29') && conveyedExt.extent <='150' && conveyedExt.unit === 'Y'){
                        tempDutyfee ={sd_p:'0',td_p:'0',rf_p:'0'}
                        setCalculatedDutyFee({...CalculatedDutyFee,TRAN_MAJ_CODE:ApplicationDetails.registrationType.TRAN_MAJ_CODE,TRAN_MIN_CODE:ApplicationDetails.registrationType.TRAN_MIN_CODE,sroCode:ApplicationDetails.sroCode,amount:ApplicationDetails.amount,sd_p:'0',td_p:'0',rf_p:'0',})
                    }
                    else if(ApplicationDetails.documentNature.TRAN_MAJ_CODE ==='01' && ApplicationDetails.documentNature.TRAN_MIN_CODE === '29' && conveyedExt.extent > '150' && conveyedExt.extent <= '450' && conveyedExt.unit === 'Y'){
                    tempDutyfee ={sd_p: (parseFloat(result.data.sd_p) / 2).toString(),td_p: (parseFloat(result.data.td_p) / 2).toString(), rf_p: (parseFloat(result.data.rf_p) / 2).toString()}
                        setCalculatedDutyFee({...CalculatedDutyFee,TRAN_MAJ_CODE:ApplicationDetails.registrationType.TRAN_MAJ_CODE,TRAN_MIN_CODE:ApplicationDetails.registrationType.TRAN_MIN_CODE,sroCode:ApplicationDetails.sroCode,amount:ApplicationDetails.amount,sd_p: (parseFloat(result.data.sd_p) / 2).toString(),td_p: (parseFloat(result.data.td_p) / 2).toString(), rf_p: (parseFloat(result.data.rf_p) / 2).toString(),})
                    }
                    else{
                        tempDutyfee ={ sd_p: result.data.sd_p, td_p: result.data.td_p, rf_p: result.data.rf_p}
                        setCalculatedDutyFee({ ...CalculatedDutyFee, TRAN_MAJ_CODE: ApplicationDetails.registrationType.TRAN_MAJ_CODE, TRAN_MIN_CODE: ApplicationDetails.documentNature.TRAN_MIN_CODE, sroCode: ApplicationDetails.sroCode, amount: ApplicationDetails.amount, sd_p: result.data.sd_p, td_p: result.data.td_p, rf_p: result.data.rf_p });
                       } 

                    let data = {
                        stampDutyFeePayable:tempDutyfee.sd_p,
                        registrationFeePayable:tempDutyfee.rf_p,
                        transferDutyFeePayable:tempDutyfee.td_p,
                        userCharges:'500',
                        marketValue: Details.marketValue,
                        }
                        Details.Go134=data;
                    }
                    let result = await CallingAxios(UseAddProperty(Details));
                    if (result.status) {
                        ShowMessagePopup(true, "Property Added Successfully with MarketValue:" + Details.marketValue + ".", "/PartiesDetailsPage", 5000)
                    }
                    else {
                        ShowMessagePopup(result?.status, result?.message, "");
                    }
                }

                dispatch(SavePropertyDetails(Details));
            }else if(mLinkDocs && PropertyDetails.LinkedDocDetails && PropertyDetails.LinkedDocDetails.length === 0){
                ShowMessagePopup(false, "Atleast One Link Document Entry is Required", "");
            }

        }}

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
        // let myLinkDocument = [...PropertyDetails.isDocDetailsLinked];
        // if (LinkDocument.linkDocNo != "" && LinkDocument.regYear != "" && LinkDocument.bookNo != "" && LinkDocument.scheduleNo != "" && LinkDocument.district != "" && LinkDocument.sroOffice != "") {
        //     myLinkDocument.push(LinkDocument);
        //     setLinkDocument({ linkDocNo: "", regYear: "", bookNo: "", scheduleNo: "", district: "", sroOffice: "" });
        //     setPropertyDetails({ ...PropertyDetails, isDocDetailsLinked: myLinkDocument })
        // }
        // else {
        //     ShowMessagePopup(false, "Please fill all the details of the link document", "");
        // }
        let myLinkDocument:any= PropertyDetails.LinkedDocDetails ? [...PropertyDetails.LinkedDocDetails] :[];
        if (LinkDocument && PropertyDetails.registeredState ==="Registered In AP") {
            let sCode = SROOfficeList.find(e => e.name == LinkDocument.sroOffice)
            let srXode:any=sCode.id;
            myLinkDocument.push({...LinkDocument, sroCode:srXode});
            setLinkDocument({ linkDocNo: "", regYear: "", bookNo: "", scheduleNo: "", district: "", sroOffice: "",sroCode:"" });
            
            setPropertyDetails({ ...PropertyDetails, LinkedDocDetails: myLinkDocument })
        }else if(LinkDocument && PropertyDetails.registeredState ==="Registered In TS"){
            myLinkDocument.push({...LinkDocument});
            setLinkDocument({ linkDocNo: "", regYear: "", bookNo: "", scheduleNo: "", district: "", sroOffice: "",sroCode:"" });
            setPropertyDetails({ ...PropertyDetails, LinkedDocDetails: myLinkDocument })
        }
    }
    const GetLinkedSROOfficeList = async (id: any) => {
        let result = await CallingAxios(getLinkedSroDetails(id));
        if (result.status) {
            // if (part === 1) {
            //     let sortedResult = result.data.sort((a, b) => a.name < b.name ? -1 : 1)
            //     setSROOfficeList(sortedResult);
            // }
            // else {
            let sortedResult = result.data.sort((a, b) => a.name < b.name ? -1 : 1)
            setSROOfficeList(sortedResult);
            //}

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
    const  onClickDocs = async (type: String) =>{
        if(type =="Y"){
            // setPValue(true);
            if(ppbyPass.type =="survayNo")
                setPropertyDetails({...PropertyDetails,isPropProhibited:true,isPrProhibitedSurveyNO:ppbyPass.value});
            else
                setPropertyDetails({...PropertyDetails,isPropProhibited:true,isPrProhibitedDoorNO:ppbyPass.value});
            setPpByPass({status:false,type:"",value:""});
                setAllowProceed(true);
        }else{
            if(ppbyPass.type =="survayNo")
                setPropertyDetails({...PropertyDetails,isPropProhibited:false,isPrProhibitedSurveyNO:"", survayNo: ''});
            else
                setPropertyDetails({...PropertyDetails,isPropProhibited:false,isPrProhibitedDoorNO:"", doorNo: ''});
            // setPValue(false)
            OnCancelAction();
        }
    }
    const OnCancelAction= async ()=>{
        setPpByPass({status:false,type:"",value:""});
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
    const validSroCode = (value: any) => {
        if ((value < 1399) || value > 4444) {
                ShowMessagePopup(false, "Enter Valid SroCode", "");
                return false;
        }else{
            return true;
        }
        
    }
    const ppRestrictionBypass = async (data:any,type:any,val:any)=>{
        if (data != "NO") {
            setPpByPass({status:true,type:type,value:val})
            setAllowProceed(false);
        }else{
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
            const exists = ApplicationDetails?.property?.some((prop) => (prop?.habitationCode == PropertyDetails?.habitationCode && prop?.doorNo == PropertyDetails?.doorNo && prop?._id !== PropertyDetails?._id))
            if(exists){
                ShowAlert(false , `Door No.: ${PropertyDetails?.doorNo} already exist in the previous schedules.`)
            }
            let DoorNoArray = PropertyDetails.doorNo.split(',');
            let ppDr:any ="",NotProhibitedDr:any=[];
            for (let i of DoorNoArray) {
                // window.alert(JSON.stringify(i))
                data = {
                    ward: PropertyDetails.ward,
                    block: PropertyDetails.block,
                    dNo:  i,
                    sroCode: PropertyDetails.sroCode,
                    serveyNo: null,
                    villageCode: vgCode,
                    proField: "R_DNO"
                }
                const response = await UseGetPPCheck(data, "urban");
                if(checkLUC && isMutationEnabled){
                    const doorNumSearchData = await CallingAxios(UseGetDoorNumSearch(PropertyDetails.sroCode, PropertyDetails.doorNo));
                    if(doorNumSearchData.status){
                        setDoorNumSearchData(doorNumSearchData.data);
                        if(doorNumSearchData.data.length > 0) {
                            setShowPopup(true);
                        }
                        else {
                            setPropertyDetails({...PropertyDetails, ptinNo : "0"});
                            setCDMADetails({})
                            setTimeout(() => {
                                ShowMessagePopup(false, "No PTIN's Available for the given Door Number", " ", 5000);
                            }, 3100);
                        }   
                    }
                }
                if (response.status) {
                    let data = response.data[0]
                    for (let value of Object.values(data)) {
                        if (value != "NO") {
                            ppDr = ppDr == "" ? i : ppDr+","+i
                            ShowMessagePopup(false, "The entered Door number is in prohibited property list", "");
                            // ShowMessagePopup(false, "Selected Property is Prohibitated", "");
                            if (ApplicationDetails.registrationType.TRAN_MAJ_CODE == "02" && LoginDetails?.loginEmail !== 'APIIC') {
                                setAllowProceed(true);
                            }
                            else {
                                if(LoginDetails?.loginEmail !== 'APIIC'){
                                await ppRestrictionBypass(value,type,ppDr);
                                }
                            }
                            // ShowMessagePopup(false, `Selected Property is Prohibitated of Door No:${i}`, "");
                        }
                        else {
                            if(LoginDetails?.loginEmail !== 'APIIC'){
                                await ppRestrictionBypass(value,type,i);
                            }
                            
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
            let ppSrvy:any ="";
            const ppVillageCode = PropertyDetails.habitationCode.slice(0, -2);
            for (let  i of SurvayNoArray) {
                data = {
                    ward: null,
                    block: null,
                    sroCode: PropertyDetails.sroCode,
                    serveyNo: i,
                    villageCode: ppVillageCode,
                    proField: "A_SNO"
                }
                const response = await UseGetPPCheck(data, "rural");
                if (response.status) {
                    let data = response.data[0]
                    for (let value of Object.values(data)) {
                        if (value != "NO") {
                            ppSrvy = ppSrvy == "" ? i : ppSrvy+","+i
                            ShowMessagePopup(false, "The entered survey number is in prohibited property list", "");
                            // ShowMessagePopup(false, "Selected Property is Prohibitated", "");
                            if (ApplicationDetails.registrationType.TRAN_MAJ_CODE == "02") {
                                setAllowProceed(true);
                            }
                            else {
                                if(LoginDetails?.loginEmail !== 'APIIC'){
                                await ppRestrictionBypass(value,type,ppSrvy);
                                }
                            }
                            // ShowMessagePopup(false, `Selected Property is Prohibitated of Door No:${i}`, "");
                        }
                        else {
                            if(LoginDetails?.loginEmail !== 'APIIC'){
                            await ppRestrictionBypass(value,type,i);
                            }
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
    const ValidSurvey = (value: any,type:any) => {
        // if (value != "" ) {
        //     if(!isNaN(value) ){

        //     }else{
                // window.alert(JSON.stringify(value))
        //     }
            
        //         // ShowMessagePopup(false, `Enter Valid ${type}`, "");
        //         // return false;
        // }else{
        //     PPCheck(type)
        //     return true;
        
        // }
        
         if(type ==="eleSrvcNo" && String(value).length != 13){
            if(LoginDetails?.loginEmail !== 'APIIC'){
            ShowMessagePopup(false, `Enter Valid Electricity Service Number`, "");
            return false;
            }
           
        }
        var alpha  = /^[a-zA-Z]+$/; let numeric=/^[0-9]+$/;
        if(value.startsWith("0") || value.startsWith("-") || value.startsWith(",") || value.startsWith("/")){
            ShowMessagePopup(false, `Enter Valid ${type}`, "");
        }else if( value.endsWith("-") || value.endsWith(",") || value.endsWith("/")){
            ShowMessagePopup(false, `Enter Valid ${type}`, "");
        }else if(value.includes("--")|| value.includes(",,") || value.includes("//")){
            ShowMessagePopup(false, `Enter Valid ${type}`, "");
        }
        else if(value !="" && !isNaN(value)){
            if(parseInt(value) ===0){
                ShowMessagePopup(false, `Enter Valid ${type}`, "");
            }else{
             
                PPCheck(type)
                return true;
                
            }
        }else if(alpha.test(value) && type != "survayNo"){
            ShowMessagePopup(false, `Enter Valid ${type}`, "");
        }else{
           
            PPCheck(type)
            return true;
            
        }
        
    }

    const CallingPPCheck = async (data) => {
        let result = await CallingAxios(UseGetPPCheck(data, "urban"));
        if (result.status) {
            let data = result.data[0]
            for (let value of Object.values(data)) {
                if (value != "NO") {
                    // ShowMessagePopup(false, "Selected Property is Prohibitated", "");
                    if (ApplicationDetails.registrationType.TRAN_MAJ_CODE == "02") {
                        setAllowProceed(true);
                    }
                    else {
                        
                        setAllowProceed(false);
                    }
                    return false;
                }
                else {
                    // ShowMessagePopup(true, "PP-Check is clear for Registration", "");
                    setAllowProceed(true);
                    return true;
                }
            }
        }
    }
    const GetLpmCheck = async (VillageCode: any) => {
        let result = await CallingAxios(UseGetlpmCheck(VillageCode));
        if (result.status) {
            let data = result.data;
            // if(data[0].CNT >= 1){
            //     CallingAxios(GetLpmMvCheck(VillageCode))
            // }
            setLpmValue(Number(data[0].CNT))
        }
        else {
            return ShowMessagePopup(false, "Fetch habitation list failed", "")
        }
    }

    const GetLpmMvCheck = async (VillageCode: any) => {
        let result = await CallingAxios(GetCheckLPMMV(VillageCode));
        if (result.status) {
            if(result.data[0].STATUS === "N"){
                ShowMessagePopup(false,"Market Value is not effected, you can’t Proceed for registration.Please contact to respective Sub Registrar","");
                router.push('/PropertyDetailsPage')
            }
        }
        else {
            return ShowMessagePopup(false, "Something went wrong", "")
        }
    }

    const checkTaxesStatus = async (PtinCode, value) => {
        let data = {
            ulbCode: value == 'Y' ? PtinCode : PtinCode.substring(0, 4),
            assessmentNo: PtinCode,
            registrationValue: value,
            marketValue: (value == 'Y') ? 'Y' : value,
            sroCode: PropertyDetails.sroCode,
            villageCode: PropertyDetails.villageCode
        }
        // let result = await CallingAxios(GetCDMAData(data));
        setPtinCode({ ...ppnCodeAdd, ptinCode: `${PtinCode ? PtinCode : 0}` })
    }

    const multiOnSelect =(data:any)=>{
        let opshare:any="",opArr:any=[];
        data.map((s:any)=>{
            opArr.push(s.seqNumber);
            opshare= opshare ==="" ? s.seqNumber : opshare +","+s.seqNumber;
        })
        setMultiDropValue(opArr)
        setPropertyDetails({...PropertyDetails,partyNumber:String(opshare)})
    }
    const multiOnRemove =(data:any,val:any)=>{
        let opshare:any="",opArr:any=[];
        val.map((s:any)=>{
            opArr.push(s.seqNumber);
            opshare= opshare ==="" ? s.seqNumber : opshare +","+s.seqNumber;
        });
        setMultiDropValue(opArr)
        setPropertyDetails({...PropertyDetails,partyNumber:String(opshare)})
    }

    const partiesFormattedOptions = ApplicationDetails.claimant.map((item) => ({
        label: `${item.name} (${item.seqNumber})`,
        ...item
      }));

      const multiSelectOptions = () => {  
        if (ApplicationDetails?.documentNature?.TRAN_MAJ_CODE === "04" && PropertyDetails?.partyNumber) {
          const selectedSeqNumbers = PropertyDetails.partyNumber.split(',').map(code => Number(code.trim()));
          const selectedOptions = partiesFormattedOptions.filter(opt =>
            selectedSeqNumbers.includes(opt.seqNumber)
          );
          return selectedOptions
        }
      }

 
    const calculateTotalMutationFee = (applicationDetails: any) => {
        let totalMutationFee = 0;
        if (!applicationDetails?.property || !Array.isArray(applicationDetails.property)) {
            return totalMutationFee;
        }
        applicationDetails.property.forEach((prop: any) => {
            const cdmaData = prop?.cdma_details;
            if (cdmaData && cdmaData.trim() !== "") {
                const cdmaDetails = JSON.parse(cdmaData);
                const mutationFee = parseFloat(prop?.payableMutationFee) || 0;
                totalMutationFee += mutationFee;
            }
        });
        return totalMutationFee;
    };     

    return (
        <>
        <div className='PageSpacing'>
            <Head>
                <title>Property Details_Urban - Public Data Entry</title>
            </Head>
            <Container>
                <div className='tabContainerInfo'>
                    <Container>
                        <Row>
                            <Col lg={10} md={12} xs={12} className='navItems'>
                                <div className='tabContainer'>
                                    <div className='activeTabButton'>Get Started<div></div></div>
                                    <div className='activeTabButton'>Parties Details<div></div></div>
                                    <div className='activeTabButton'>Property Details<div></div></div>
                                    <div className='inactiveTabButton slotButton' >Slot Booking<div></div></div>
                                </div>
                            </Col>

                            <Col lg={2} md={12} xs={12}>
                                <div className='text-end previewCon'><button className='PreBtn proceedButton' onClick={() => ShowPreviewPopup()} >Preview Document</button></div>
                            </Col>
                        </Row>

                        {!statusBar && <Row>
                            <Col lg={12} md={12} xs={12} className='p-0 navItems'>
                                <div className='tabContainer DutyfeeContainer'>
                                    {/* <div className='activeTabButton'>Duty Fees :<div></div></div> */}
                                    <div className='activeTabButton'>Stamp Duty(₹) : {CalculatedDutyFee.sd_p ? CalculatedDutyFee.sd_p : 0}<div></div></div>
                                    <div className='activeTabButton'>Transfer Duty(₹) : {CalculatedDutyFee.td_p ? CalculatedDutyFee.td_p : 0}<div></div></div>
                                    <div className='activeTabButton'>Registration fee(₹) : {CalculatedDutyFee.rf_p ? CalculatedDutyFee.rf_p : 0}<div></div></div>
                                    {GetstartedDetails?.documentNature && GetstartedDetails?.documentNature?.TRAN_MAJ_CODE === "08" && GetstartedDetails?.documentNature?.TRAN_MIN_CODE === "06" ?
                                    <div className='activeTabButton'>User Charges(₹) : {0}<div></div></div>:
                                    <div className='activeTabButton'>User Charges(₹) : {userCharges}<div></div></div>
                                    }
                                    {/* <div className='activeTabButton'>User Charges(₹) : {userCharges}<div></div></div> */}
                                    <div className='activeTabButton'>Market Value(₹)  : {TotalMarketValueCalculator(ApplicationDetails)}<div></div></div>
                                    <div className='activeTabButton'>{doctcondtion?'Auction Value(₹) ':'Consideration Value(₹)'}: {ApplicationDetails.amount ? ApplicationDetails.amount : "0"}<div></div></div>
                                    {GetstartedDetails?.documentNature && GetstartedDetails?.documentNature?.TRAN_MAJ_CODE === "08" && GetstartedDetails?.documentNature?.TRAN_MIN_CODE === "06" ?
                                    <div className='activeTabButton'>Total Payable(₹): {Number(CalculatedDutyFee.sd_p) + Number(CalculatedDutyFee.td_p) + Number(CalculatedDutyFee.rf_p) + 0}</div>:
                                    <div className='activeTabButton'>Total Payable(₹): {Number(CalculatedDutyFee.sd_p) + Number(CalculatedDutyFee.td_p) + Number(CalculatedDutyFee.rf_p) + userCharges}</div>
                                    }
                                    {<div className='activeTabButton'>Mutation Fee: ₹{calculateTotalMutationFee(ApplicationDetails)}</div>}
                                </div>
                            </Col>
                        </Row>}
                    </Container>
                </div>
                <Row>
                    <Col lg={12} md={12} xs={12}>
                        <div className={`pt-2 ${styles.PropertyDetailsmain} ${styles.PropertyDetailsPage}`}>
                            <Row className='ApplicationNum mt-5'>
                                <Col lg={6} md={6} xs={12}>
                                    <div className='ContainerColumn TitleColmn' onClick={() => { router.push("/PartiesDetailsPage") }}>
                                        <h4 className='TitleText left-title'>{ApplicationDetails.documentNature ? ApplicationDetails.registrationType.TRAN_DESC : null}</h4>
                                    </div>
                                </Col>
                                <Col lg={6} md={6} xs={12}>
                                    <div className='ContainerColumn'>
                                        <h4 className='TitleText' style={{ textAlign: 'right' }}>Application ID: {ApplicationDetails.applicationId}</h4>
                                    </div>
                                </Col>
                            </Row>

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
                                <form onSubmit={onSubmit} className={styles.AddExecutantInfo}>
                                    <Row className="align-items-end">
                                        <Col lg={4} md={6} xs={12}>
                                            <TableText label={doctcondtion?'Total Auction Value(₹) [మొత్తం వేలం విలువ]  ':'Total Consideration Value(₹) [మొత్తం ప్రతిఫలం విలువ]'} required={true} LeftSpace={false} />
                                            <TableInputText type='number' placeholder='₹' required={true} disabled={true} name={'amount'} value={ApplicationDetails.amount} onChange={onChange} />
                                        </Col>
                                    </Row>
                                    <div className={styles.divider}></div>
                                    <Row>
                                        <p className={` ${styles.getTitle} ${styles.HeadingText}`}>Date of Execution Details [అమలు తేదీ వివరాలు]</p>
                                        <Col lg={4} md={6} xs={12}>
                                            <TableText label={"Date of Execution [అమలు తేదీ]"} required={true} LeftSpace={false} />
                                            <TableInputText type='text' placeholder='' disabled={true} required={true} name={'executionDate'} value={DateFormator(ApplicationDetails.executionDate, "dd/mm/yyyy")} onChange={onChange} />
                                        </Col>
                                        <Col lg={4} md={6} xs={12}>
                                            <TableText label={"Total Stamp Paper Value(₹) [స్టాంప్ పేపర్ మొత్తం విలువ]"} required={true} LeftSpace={false} />
                                            <TableInputText type='number' placeholder='Enter Value' disabled={true} required={true} name={'stampPaperValue'} value={ApplicationDetails.stampPaperValue} onChange={onChange} />
                                        </Col>
                                        <Col lg={4} md={6} xs={12}>
                                            <TableText label={"Date of Stamp Purchase [స్టాంప్ కొనుగోలు తేదీ]"} required={true} LeftSpace={false} />
                                            <TableInputText type='text' placeholder='' disabled={true} required={true} name={'stampPurchaseDate'} value={DateFormator(ApplicationDetails.stampPurchaseDate, "dd/mm/yyyy")} onChange={onChange} />
                                        </Col>
                                    </Row>
                                    {ApplicationDetails?.documentNature?.TRAN_MAJ_CODE =="01" && ApplicationDetails?.documentNature?.TRAN_MIN_CODE =="26" && PropertyDetails.conveyanceType.split("(")[0] === "Both" &&
                                        <>
                                        <div className={styles.divider}></div>
                                        <Row className='mt-0 mb-0'>
                                            <Col lg={4} md={6} xs={12} className='pt-0 pb-2'>
                                                <TableText label={"Item"} required={true} LeftSpace={false} />
                                                <TableDropdownSRO required={true} options={[{name:"Share"}]} name={'companyShare'} value={PropertyDetails.companyShare} onChange={onChange} />
                                                
                                            </Col>
                                            <Col lg={4} md={6} xs={12} className='pt-0 pb-2'>
                                                <TableText label={"Value"} required={true} LeftSpace={false} />
                                                <TableInputText disabled={false} required={true} name={'conveyanceValue'} value={PropertyDetails.conveyanceValue} onChange={onChange} type={'number'} placeholder={'conveyanceValue'} />
                                            </Col>
                                     </Row></>}
                                    <div className={styles.divider}></div>
                                    <Row className="mb-1">
                                        <p className={` ${styles.getTitle} ${styles.HeadingText}`}>Which Jurisdiction District and SRO Office is the property Located ? [ఏ సబ్ రిజిస్ట్రార్ కార్యాలయం పరిధి జిల్లాలో ఉన్న ఆస్తి?]</p>
                                        {/* <Col lg={6} md={6} xs={12} className='mb-1'>
                                            <TableText label={"Local Body Type [స్థానిక సంస్థ రకం]"} required={true} LeftSpace={false} />
                                            <TableInputText type='text' placeholder='' disabled={true} required={true} name={'localBodyType'} value={PropertyDetails.localBodyType} onChange={onChange} />
                                        </Col> */}
                                        <Col lg={6} md={6} xs={12}>
                                            <TableText label={"Jurisdiction Registration District [జిల్లా రిజిస్ట్రేషన్ అధికార పరిధి]"} required={true} LeftSpace={false} />
                                            <TableInputText type='text' required={true} placeholder='' disabled={true} name={'district'} value={PropertyDetails.district} onChange={onChange} />
                                        </Col>
                                        <Col lg={6} md={6} xs={12} className="mb-2">
                                            <TableText label={"Jurisdiction Sub-Registrar [సబ్ రిజిస్ట్రార్ కార్యాలయం అధికార పరిధి]"} required={true} LeftSpace={false} />
                                            <TableInputText type='text' required={true} placeholder='' disabled={true} name={'sroOffice'} value={PropertyDetails.sroOffice} onChange={onChange} />
                                        </Col>
                                    </Row>
                                    

                                    <Row>

                                        {/* <Col lg={6} md={6} xs={12}>
                                            <TableText label={MuncipleKeyNameIdentifier(PropertyDetails.localBodyType)} required={true} LeftSpace={false} />
                                            <TableInputText disabled={true} type='text' placeholder='Enter Name' required={true} name={'localBodyName'} value={PropertyDetails.localBodyName} onChange={onChange} />
                                        </Col> */}
                                        {/* <Col lg={6} md={6} xs={12}>
                                            <TableText label={"Municipality Name"} required={true} LeftSpace={false} />
                                            <TableInputText type='text' placeholder='Enter Name' disabled={true} required={true} name={'localBodyName'} value={PropertyDetails.localBodyName} onChange={onChange} />
                                        </Col> */}
                                    </Row>
                                    <Row>
                                        <Col lg={6} md={6} xs={12}>
                                            <TableText label={"Land Use [భూమి వినియోగం]"} required={true} LeftSpace={false} />
                                            <TableInputText type='text' required={true} placeholder='' disabled={true} name={'landUse'} value={PropertyDetails.landUse} onChange={onChange} />
                                        </Col>
                                        <Col lg={6} md={6} xs={12}>
                                            <TableText label={"Type of Property [ఆస్తి రకం]"} required={true} LeftSpace={false} />
                                            <TableInputText type='text' required={true} placeholder='' disabled={true} name={'propertyType'} value={PropertyDetails.propertyType} onChange={onChange} />
                                        </Col>
                                        {ApplicationDetails?.registrationType?.TRAN_MAJ_CODE == "04" ?
                                            <Col lg={4} md={6} xs={12} className='mt-2'>
                                               {PropertyDetails.jointOrNot ==="NO" ?
                                                <><TableText label={"Party Name [పార్టీ పేరు]"} required={true} LeftSpace={false} /><TableDropdownSRO2 keyName={'label'} required={true} options={partiesFormattedOptions} name={'partyNumber'} value={partiesFormattedOptions.find((item) => item.seqNumber == PropertyDetails.partyNumber)?.label??""} onChange={onChange} /></>
                                                : PropertyDetails.jointOrNot ==="YES" && ApplicationDetails.claimant && ApplicationDetails.claimant.length >1 &&
                                                <><TableText label={"Party Name [పార్టీ పేరు]"} required={true} LeftSpace={false} />
                                                <Multiselect
                                                    options={partiesFormattedOptions} 
                                                    selectedValues={multiSelectOptions()} 
                                                    onSelect={(val: any) => { multiOnSelect(val); } } 
                                                    onRemove={(val:any)=>multiOnRemove(multiDropValue,val)} 
                                                    displayValue="label"
                                                    showCheckbox={true}/>
                                                </>
                                                }          
                                            </Col>
                                            : null}
                                    </Row>
                                    <div className={styles.divider}></div>
                                    <Row className="mb-1">
                                        <p className={` ${styles.getTitle} ${styles.HeadingText}`}>Schedule of the property to be registered [నమోదు చేయవలసిన ఆస్తి యొక్క షెడ్యూల్]</p>
                                        <Col lg={3} md={6} xs={12} className='mb-1'>
                                            <TableText label={"Village [గ్రామం]"} required={true} LeftSpace={false} />
                                            {/* {IsViewMode ? <TableInputText disabled={true} type='text' placeholder='0' required={false} name={'village'} value={PropertyDetails.village} onChange={onChange} />
                                                : <TableDropdown required={true} options={VillageList} name={'village'} value={PropertyDetails.village} onChange={onChange} />} */}
                                            <TableInputText disabled={true} type='text' placeholder='0' required={false} name={'village'} value={PropertyDetails.village} onChange={onChange} />
                                        </Col>
                                        <Col lg={3} md={6} xs={12}>
                                            <TableText label={"Habitation/ Locality [నివాసం/ ప్రాంతం]"} required={true} LeftSpace={false} />
                                            {IsViewMode ? <TableInputText disabled={true} type='text' placeholder='0' required={false} name={'habitation'} value={PropertyDetails.habitationOr} onChange={onChange} />
                                                : PropertyDetails.mode ==="edit" ?<TableDropdown required={true} options={HabitationList} name={'habitation'} value={PropertyDetails.habitationOr} onChange={onChange} multi/>
                                                :<TableDropdown required={true} options={HabitationList} name={'habitation'} value={PropertyDetails.habitation} onChange={onChange} multi/>
                                            }
                                        </Col>
                                        <Col className="col-lg-1-5" md={6} xs={12}>
                                            <TableText label={"Ward [వార్డు]"} required={false} LeftSpace={false} />
                                            <TableInputText disabled={true} type='text' placeholder='0' required={false} name={'ward'} value={PropertyDetails.ward} onChange={onChange} />
                                        </Col>
                                        <Col className="col-lg-1-5" md={6} xs={12}>
                                            <TableText label={"Bi Ward [బై వార్డు]"} required={false} LeftSpace={false} />
                                            <TableInputText disabled={true} type='text' placeholder=' ' required={false} name={'biWard'} value={PropertyDetails.biWard} onChange={onChange} />
                                        </Col>
                                        <Col className="col-lg-1-5" md={6} xs={12}>
                                            <TableText label={"Block [బ్లాక్]"} required={false} LeftSpace={false} />
                                            <TableInputText disabled={true} type='text' placeholder='0' required={false} name={'ward'} value={PropertyDetails.block} onChange={onChange} />
                                        </Col>
                                        <Col className="col-lg-1-5" md={6} xs={12}>
                                            <TableText label={"Bi Block [బై బ్లాక్]"} required={false} LeftSpace={false} />
                                            <TableInputText disabled={true} type='text' placeholder=' ' required={false} name={'biBlock'} value={PropertyDetails.biBlock} onChange={onChange} />
                                        </Col>
                                    </Row>
                                    <Row className='mb-2'>
                                        {isMutationEnabled && isSectratariatWardEnabled && <> <Col lg={3} md={6} xs={12} className='mt-2'>
                                            <TableText label={"Ward Secretariat [వార్డు కార్యాలయం నెం]"} required={!isSectratariatWardEnabled?false:true} LeftSpace={false} />
                                            {IsViewMode ? <TableInputText disabled={true} type='text' placeholder='0' required={false} name={'secratariatWard'} value={PropertyDetails.secratariatWardName} onChange={onChange} />
                                                : <TableDropdown required={!isSectratariatWardEnabled?false:true} options={secratariatWards} name={'secratariatWard'} value={PropertyDetails.secratariatWard} onChange={onChange} multi={true} />}
                                        </Col>
                                        <Col lg={3} md={6} xs={12} className='mt-2'>
                                            <TableText label={"Election Ward [ఎలక్షన్ వార్డ్ నెం]"} required={!isSectratariatWardEnabled?false:true} LeftSpace={false} />
                                                {IsViewMode ? <TableInputText disabled={true} type='text' placeholder='0' required={false} name={'electionWard'} value={PropertyDetails.electionWardName} onChange={onChange} />
                                                : <TableInputText disabled={true} type='text' placeholder='Election Ward' required={false} name={'electionWard'} value={PropertyDetails.electionWardName}/>
                                                //  <TableDropdown required={true} options={electionWards} name={'electionWard'} value={PropertyDetails.electionWard} onChange={onChange} multi={true} />
                                                }
                                        </Col> </>
                                        }
                                        <Col lg={3} md={6} xs={12} className='mt-2'>
                                            <TableText label={"Local Body Name [స్థానిక సంస్థ పేరు]"} required={true} LeftSpace={false} />
                                            {IsViewMode ? <TableInputText disabled={true} type='text' placeholder='0' required={false} name={'localBodyName'} value={PropertyDetails.localBodyName} onChange={onChange} />
                                                : <TableDropdown required={true} options={localBodyNameList} name={'localBodyName'} value={PropertyDetails.localBodyName} onChange={onChange} />}
                                        </Col>

                                        <Col lg={3} md={6} xs={12} className='mt-2'>
                                            <TableText label={"Local Body Type [స్థానిక సంస్థ రకం]"} required={true} LeftSpace={false} />
                                            {IsViewMode ? <TableInputText disabled={true} type='text' placeholder='0' required={false} name={'localBodyTypeName'} value={PropertyDetails.localBodyType} onChange={onChange} />
                                                :
                                                <TableDropdownSRO2 keyName={"type"} required={true} options={localBodyTypeList} name={'localBodyTypeName'} value={PropertyDetails.localBodyType} onChange={onChange} />
                                            }
                                        </Col>
                                    </Row>
                                    <Row className="mb-2">
                                        <Col lg={3} md={6} xs={12}>
                                            <TableText label={"Door No. [డోర్ నెం.]"} required={!checkLUC ? false : true} LeftSpace={false} />
                                            <TableInputText disabled={IsViewMode}  type='text' placeholder='Enter Door No' required={!checkLUC ? false : true} name={'doorNo'} value={PropertyDetails.doorNo} onBlurCapture={e=>{e.preventDefault();validationsForDoorNo(e.target.value,"doorNo");}} onChange={onChange} />
                                            {/* onBlurCapture={() => { PPCheck("doorNo") }} */}
                                        </Col>
                                        <Col lg={3} md={6} xs={12}>
                                            <TableText label={"Plot No. [ప్లాట్ నెం.]"} required={crdCheck ? true :false} LeftSpace={false} />
                                            <TableInputText disabled={IsViewMode} type='text' placeholder='Enter Plot No' required={crdCheck ? true : false} name={'plotNo'} value={PropertyDetails.plotNo} onBlurCapture={e => { e.preventDefault(); if (!ValidSurvey(e.target.value,"plotNo")) { setPropertyDetails({ ...PropertyDetails, plotNo: '' }) } }} onChange={onChange} />
                                        </Col>
                                        <Col lg={6} md={6} xs={12}>
                                            <Row>
                                            <Col lg={12} md={6} xs={12}>
                                            {lpmValue === 0 ?
                                            <Col lg={6} md={6} xs={12}>
                                                <div className={styles.surveyInput}>     
                                                <TableText label={"Survey No. [సర్వే నెం.]"} required={!checkLUC ? false : true} LeftSpace={false} />                
                                                <TableInputText disabled={IsViewMode} type='text' required={!checkLUC ? true : false && crdCheck ? false : !checkLUC ? false  : true} placeholder='' name={'survayNo'} value={PropertyDetails.survayNo} onBlurCapture={e => { e.preventDefault(); if (!ValidSurvey(e.target.value,"survayNo")) { setPropertyDetails({ ...PropertyDetails, survayNo: '' }) } }} onChange={onChange} />
                                                {/* <TableInputText disabled={IsViewMode}  type='text' placeholder='Enter Survey No' required={!checkLUC && crdCheck ? false : !checkLUC ? true  : false} name={'survayNo'} value={PropertyDetails.survayNo} onBlurCapture={e => { e.preventDefault(); if (!ValidSurvey(e.target.value,"survayNo")) { setPropertyDetails({ ...PropertyDetails, survayNo: '' }) } }} onChange={onChange} /> */}
                                                </div>
                                            </Col>
                                            :
                                           <div className=''>
                                            <Row>
                                            <Col lg={6} md={6} xs={12}>
                                            <Col lg={12} md={6} xs={12}>
                                                <div className={styles.surveyInput}>   
                                                <TableText label={"Survey No. [సర్వే నెం.]"} required={PropertyDetails.lpmNo?true:false} LeftSpace={false} />                  
                                                {/* <TableText label={"Survey No. [సర్వే నెం.]"} required={PropertyDetails.lpmNo?false:true} LeftSpace={false} />                 */}
                                                <TableInputText disabled={IsViewMode} type='text' required={!checkLUC ? false : true  && crdCheck ? false : !checkLUC ? true  : false} placeholder='' name={'survayNo'} value={PropertyDetails.survayNo} onBlurCapture={e => { e.preventDefault(); if (!ValidSurvey(e.target.value,"survayNo")) { setPropertyDetails({ ...PropertyDetails, survayNo: '' }) } }} onChange={onChange} />
                                                {/* <TableInputText disabled={IsViewMode}  type='text' placeholder='Enter Survey No' required={!checkLUC && crdCheck ? false : !checkLUC ? true  : false} name={'survayNo'} value={PropertyDetails.survayNo} onBlurCapture={e => { e.preventDefault(); if (!ValidSurvey(e.target.value,"survayNo")) { setPropertyDetails({ ...PropertyDetails, survayNo: '' }) } }} onChange={onChange} /> */}
                                                </div>
                                            </Col>
                                            </Col>
                                            <Col lg={6} md={6} xs={12}>
                                            <Col lg={12} md={6} xs={12}>
                                                <TableText label={"LPM No. [ఎల్ పి ఎం నెం.]"} required={PropertyDetails.survayNo?false:true} LeftSpace={false} />
                                                <TableInputText disabled={IsViewMode} type='text' required={PropertyDetails.survayNo?false:true} placeholder='' name={'lpmNo'} value={PropertyDetails.lpmNo} onChange={onChange} />
                                            </Col>
                                            </Col>
                                            </Row>
                                            </div>             
                                        }
                                            </Col>
                                        {/* <div className={styles.surveyInput}>
                                        <TableText label={"Survey No/LPM No. [సర్వే నెం/ఎల్ పి ఎం నెం.]"} required={!checkLUC && crdCheck ? false : !checkLUC ? true  : false} LeftSpace={false} />
                                            <TableInputText disabled={IsViewMode}  type='text' placeholder='Enter Survey No' required={!checkLUC && crdCheck ? false : !checkLUC ? true  : false} name={'survayNo'} value={PropertyDetails.survayNo} onBlurCapture={e => { e.preventDefault(); if (!ValidSurvey(e.target.value,"survayNo")) { setPropertyDetails({ ...PropertyDetails, survayNo: '' }) } }} onChange={onChange} />
                                        </div> */}
                                        {/* onBlurCapture={() => { PPCheck("survayNo") }} */}
                                        </Row>
                                    </Col>
                                    <Col lg={3} md={6} xs={12} className='mt-2'>
                                        <TableText label={"PTIN/PPN [ప్రాపర్టీ టాక్స్ నెంబర్]"} required={RequiredFields.ptinNo} LeftSpace={false} />
                                            {/* <TableInputText disabled={IsViewMode} type='number' placeholder='Enter PTIN' required={RequiredFields.ptinNo} name={'ptinNo'} value={PropertyDetails.ptinNo} onChange={onChange} /> */}
                                            {IsViewMode ? <></>
                                                : <TableInputText disabled={IsViewMode} type='number' placeholder='Enter PTIN' required={RequiredFields.ptinNo} name={'ptinNo'} value={PropertyDetails.ptinNo} onChange={onChange} />}
                                        </Col>

                                      { PropertyDetails.landUseCode == 1 && <Col lg={3} md={6} xs={12} className='mt-2'>
                                            <TableText label={"Electricity Service Number"} required={false} LeftSpace={false} />
                                            {/* <TableInputText disabled={IsViewMode} type='number' placeholder='Enter PTIN' required={RequiredFields.ptinNo} name={'ptinNo'} value={PropertyDetails.ptinNo} onChange={onChange} /> */}
                                             <TableInputText disabled={IsViewMode} type='number' placeholder='Enter Service Number' required={false} name={'eleSrvcNo'} value={PropertyDetails.eleSrvcNo} onChange={onChange} onBlurCapture={e => { e.preventDefault(); if (!ValidSurvey(e.target.value,"eleSrvcNo")) { setPropertyDetails({ ...PropertyDetails, eleSrvcNo: '' }) } }}/>
                                        </Col>}

                                        {!checkLUC && PropertyDetails.doorNo =="" &&<Col lg={3} md={6} xs={12} className='mt-2'>
                                            <TableText label={"Nearest Door No"} required={PropertyDetails.doorNo =="" ? true :false} LeftSpace={false} />
                                            <TableInputText disabled={IsViewMode}  type='text' placeholder='Enter Door No' required={PropertyDetails.doorNo =="" && PropertyDetails.plotNo =="" ? true :false} name={'nearTodoorNo'} value={PropertyDetails.nearTodoorNo} onBlurCapture={e => { e.preventDefault();  validationsForDoorNo(e.target.value,"nearTodoorNo");}} onChange={onChange} />
                                        </Col>} 

                                    </Row>
                                    {/* {Object.keys(CDMADetails).length ? <Row>
                                        <div className={styles.divider}></div>
                                        <Col lg={12} md={12} xs={12} className="mb-2">
                                            <div className="p-3">
                                                <Table striped bordered hover className='TableData'>
                                                    <thead>
                                                        <tr>
                                                            <th className='principalamount' rowSpan={2}>Property Address<span>[ఆస్తి చిరునామా]</span></th>
                                                            <th rowSpan={2}>Locality Name<span>[స్థానికత పేరు]</span></th>
                                                            <th colSpan={4} style={{ textAlign: "center" }}>Owner Details<span>[యజమాని వివరాలు]</span></th>
                                                            <th rowSpan={2}>site Extent<span>[పునాది ప్రాంతం]</span></th>
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
                                                            <td>{CDMADetails.boundaryDetails["localityName"]}</td>
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
                                    </Row> : null} */}
                                    {(((!PropertyDetails.localBodyType.includes('GRAM PANCHAYAT') && PropertyDetails.ptinNo.length == 10) || (PropertyDetails.localBodyType.includes('GRAM PANCHAYAT') && PropertyDetails.ptinNo.length == 17)) && !IsViewMode  && !selectedDoorNumData?.assessmentNo) ?
                                       LoginDetails?.loginEmail == 'APIIC' ? <></>:  <>
                                            {
                                                <Row className={`mt-3 ${styles.captchaCon}`}>
                                                    <Col lg={3} md={6} xs={6}><Captcha /></Col>
                                                    <Col lg={3} md={6} xs={6}>
                                                        <div className='d-flex'>
                                                            <input value={inputValue} className={styles.captchaInput} onPaste={(e)=> e.preventDefault()} onChange={(e) => { setInputValue(e.target.value); }} />
                                                        </div>
                                                    </Col>
                                                    
                                                    
                                                    <Col lg={6} md={6} xs={6}><button type='button' className={` mt-0 ${styles.YesBtn} ${styles.serchBtn}`} onClick={captchaCheck}>Search</button></Col>
                                                
                                                </Row>
                                            }
                                        </> : null}
                                    {Object.keys(CDMADetails).length ?
                                        <Row>
                                            <div className={styles.divider}></div>
                                            <Col lg={12} md={12} xs={12} className="mb-2">
                                                <div>
                                                    <Table striped bordered hover className='TableData'>
                                                        <thead>
                                                            <tr>
                                                                <th className='principalamount' rowSpan={2}>Property Address<span>[ఆస్తి చిరునామా]</span></th>
                                                                {/* <th rowSpan={2}>Locality Name<span>[స్థానికత పేరు]</span></th> */}
                                                                {/* <th colSpan={4} style={{ textAlign: "center" }}>Owner Details<span>[యజమాని వివరాలు]</span></th> */}
                                                                <th>Owner Names<span>[యజమాని పేరు]</span></th>
                                                                <th rowSpan={2}>Site Extent<span>[విస్తీర్ణం]</span></th>
                                                                <th rowSpan={2}>Door No.<span>[డోర్ నెం.]</span></th>
                                                                <th rowSpan={2}>Total Taxdue<span>[మొత్తం పన్ను బకాయి]</span></th>
                                                                <th rowSpan={2}>Property Type<span>[ఆస్థి రకం]</span></th>
                                                                {/* <th>Select Extent<span>[పరిధిని ఎంచుకోండి]</span></th> */}
                                                                {/* <th>Action</th> */}
                                                            </tr>
                                                            {/* <tr>
                                                                <td>Aadhaar Number<span>[ఆధార్ నంబర్]</span></td>
                                                                <td>Owner Name<span>[యజమాని పేరు]</span></td>
                                                                <td>Mobile Number<span>[మొబైల్ నంబర్]</span></td>
                                                                <td>Email ID<span>[ఇమెయిల్ ఐడి]</span></td>
                                                            </tr> */}
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td>{CDMADetails.propertyAddress}</td>
                                                                {/* <td>{CDMADetails.boundaryDetails?.["localityName"]}</td> */}
                                                                {/* <td>{CDMADetails.ownerNames && CDMADetails.ownerNames[0].aadhaarNumber}</td> */}
                                                                <td>{CDMADetails.ownerNames && CDMADetails.ownerNames.map(o => o.ownerName).join(', ')}</td>
                                                                {/* <td>{CDMADetails.ownerNames && CDMADetails.ownerNames[0].mobileNumber}</td> */}
                                                                {/* <td>{CDMADetails.ownerNames && CDMADetails.ownerNames[0].emailId}</td> */}
                                                                <td>{(CDMADetails.siteExtent ? CDMADetails.siteExtent : '') + ' ' + (CDMADetails.siteExtentUnit ? CDMADetails.siteExtentUnit : '')}</td>
                                                                <td>{CDMADetails.houseNo ? CDMADetails.houseNo : ''}</td>
                                                                <td>{CDMADetails?.propertyDetails?.['taxDue']}</td>
                                                                <td>{CDMADetails?.propertyDetails?.propertyType}</td>
                                                                {/* <td><input name='WeblandSelection' type='radio' onChange={onChange}
                                                                   // setCDMADetails({ ...CDMADetails, totalExtentAcers: CDMADetails.siteExtent })
                                                                ></input></td> */}
                                                            </tr>
                                                        </tbody>
                                                    </Table>
                                                </div>
                                            </Col>
                                        </Row> : <></>
                                        }
        

                                    
                                    <div className={styles.divider}></div>
                                 
                                    <Col lg={6} md={6} xs={12} className='mt-2'>
                                        <TableText label={"Extent Of Property Being Sold In The Provided PTIN No"} required={true} LeftSpace={false} />
                                        <TableInputRadio style={{marginBottom:'10px'}} label={"Extent of property being sold in the provided PTIN No"} required={true} options={[{ 'label': "FULL" }, { 'label': "PARTIAL" }]} onChange={onChange} name='urban_selling_extent' defaultValue={PropertyDetails.urban_selling_extent} />
                                    </Col>
                                    <Row>
                                    
                                    {PropertyDetails.landUse.includes("VACANT") ? <div></div> :
                                            <Col lg={3} md={6} xs={12}>
                                                <TableText label={"Type of Property [ఆస్తి రకం]"} required={true} LeftSpace={false} />
                                                {IsViewMode ? <TableInputText disabled={true} type='text' placeholder='0' required={false} name={'schedulePropertyType'} value={PropertyDetails.schedulePropertyType} onChange={onChange} />
                                                    : <TableDropdown required={true} options={propertyTypes} name={'schedulePropertyType'} value={PropertyDetails.schedulePropertyType} onChange={onChange} />}
                                            </Col>
                                        }  
                                    
                                    <Col lg={9} md={9} xs={12}>
                                    <div>
                                                <Row>
                                                    {(isMutationEnabled && PropertyDetails.urban_selling_extent === 'PARTIAL') && 
                                                        <Col lg={4} md={6} xs={12}>
                                                            <TableText label={"Total Extent [ మొత్తం విస్తీర్ణం ]"} required={true} LeftSpace={false} />
                                                            <TableInputText disabled={IsViewMode} type='number' placeholder='0.0' required={true} name={'totalExtent'} value={PropertyDetails.totalExtent}  onChange={onChange}  useDot={true}  />
                                                        </Col>
                                                    }
                                                    {IsFlat && <Col lg={4} md={6} xs={12} className='pb-2'>
                                                        <TableText label={"Apartment Name [అపార్ట్‌మెంట్ పేరు]"} required={true} LeftSpace={false} />
                                                        <TableInputText disabled={IsViewMode} type='text' placeholder='Enter Apartment Name' splChar={false} required={true} maxLength={100} name={'appartmentName'} value={PropertyDetails.appartmentName} onChange={onChange} />
                                                    </Col>}
                                                    <Col lg={4} md={6} xs={12}>
                                                        <TableText label={IsFlat ? "Flat Extent [ఫ్లాట్ విస్తీర్ణం]" : "Extent [విస్తీర్ణం]"} required={true} LeftSpace={false} />
                                                        {/* <TableInputText disabled={IsViewMode || (PropertyDetails.urban_selling_extent=='FULL'&&CDMADetails.siteExtent)} type='number' placeholder='0.0' required={true} name={'extent'} value={PropertyDetails.extent} onChange={onChange} useDot={true} onBlurCapture={e => { e.preventDefault(); if (!ValidSurvey(e.target.value,"extent")) { setPropertyDetails({ ...PropertyDetails, extent: '' }) } }}/> */}
                                                        <TableInputText disabled={IsViewMode} type='number' placeholder='0.0' required={true} name={'extent'} value={PropertyDetails.extent} onChange={onChange} useDot={true} />
                                                        </Col>
                                                    <Col lg={4} md={6} xs={12}>
                                                        <TableText label={"Units [యూనిట్లు]"} required={true} LeftSpace={false} />
                                                        {IsViewMode ? <TableInputText disabled={true} type='text' placeholder='' required={false} name={'extentUnit'} value={PropertyDetails.extentUnit} onChange={onChange} />
                                                            : <TableDropdown required={true} options={DropdownOptions.UnitList} name={'extentUnit'} value={PropertyDetails.extentUnit} onChange={onChange} />}
                                                    </Col>
                                                </Row>
                                            </div>
                                    </Col>
                                    <Row className="mb-2 mt-3">
                                        <p className={` ${styles.getTitle} ${styles.HeadingText}`}>{`${PropertyDetails.appartmentName} Property Boundary Details [ఆస్తి హద్దుల వివరాలు]`}</p>
                                        <Col lg={3} md={6} xs={12}>
                                            <TableText label={"North Side [ఉత్తరం వైపు]"} required={true} LeftSpace={false} />
                                            <TableInputText disabled={IsViewMode} type='text' placeholder=''dot={true} splChar={true} required={true} name={'northBoundry'} value={PropertyDetails.northBoundry} onChange={onChange} />
                                        </Col>
                                        <Col lg={3} md={6} xs={12}>
                                            <TableText label={"South Side [దక్షిణం వైపు]"} required={true} LeftSpace={false} />
                                            <TableInputText disabled={IsViewMode} type='text' placeholder=''dot={true} splChar={true} required={true} name={'southBoundry'} value={PropertyDetails.southBoundry} onChange={onChange} />
                                        </Col>
                                        <Col lg={3} md={6} xs={12}>
                                            <TableText label={"East Side [తూర్పు వైపు]"} required={true} LeftSpace={false} />
                                            <TableInputText disabled={IsViewMode} type='text' placeholder=''dot={true} splChar={true} required={true} name={'eastBoundry'} value={PropertyDetails.eastBoundry} onChange={onChange} />
                                        </Col>
                                        <Col lg={3} md={6} xs={12}>
                                            <TableText label={"West Side [పడమర వైపు]"} required={true} LeftSpace={false} />
                                            <TableInputText disabled={IsViewMode} type='text' placeholder=''dot={true} splChar={true} required={true} name={'westBoundry'} value={PropertyDetails.westBoundry} onChange={onChange} />
                                        </Col>
                                    </Row>
                                    <div className={styles.divider}></div>
                                    <Col lg={5} md={6} xs={12}>
                                    <TableText label={"VLT NO. / LP NO. / IPLP NO. [విఎల్‌టి నెం. / ఎల్పి నెం. / ఐపిఎల్పి నెం.]"} required={false} LeftSpace={false} />
                                            <TableInputText disabled={IsViewMode} type='text' placeholder='Enter Layout No' required={false} name={'layoutNo'} value={PropertyDetails.layoutNo} onChange={onChange} />
                                    </Col>
                                    </Row>
                                    <Row>
                                        <Col lg={4} md={6} xs={12} className='mt-2'>
                                            <TableText label={"Layout Name [లేఅవుట్ పేరు]"} required={false} LeftSpace={false} />
                                            <TableInputText disabled={IsViewMode} type='text' placeholder='Enter Layout Name' required={false} name={'layoutName'} value={PropertyDetails.layoutName} onChange={onChange} />
                                        </Col>
                                        <Col lg={4} md={6} xs={12} className='mt-2'>
                                            <TableText label={"RERA Approval Number"} required={false} LeftSpace={false} />
                                            <TableInputText disabled={IsViewMode || reraProjectDetails.length > 0 } type='text' maxLength={12} placeholder='Enter RERA Approval Number' required={false} name={'reraApprovalNo'} value={PropertyDetails.reraApprovalNo} onChange={onChange} />
                                            {
                                                reraProjectDetails.length > 0 
                                                && 
                                                <div style={{fontSize: '13px', color: '#3668A1'}}>
                                                    <small><b>Project Name:</b> {reraProjectDetails[0].ProjectName}</small><br/>
                                                    <small><b>Promoter Name:</b> {reraProjectDetails[0].PromoterName}</small><br/>
                                                    <small><b>Status:</b> {reraProjectDetails[0].Status}</small><br/>
                                                    <small><b>Survey No & Address:</b> {reraProjectDetails[0].SurveyNos} & {reraProjectDetails[0].Village}, {reraProjectDetails[0].District}, {reraProjectDetails[0].Mandal}.</small>
                                                </div>
                                            }
                                        </Col>
                                        <Col lg={4} md={6} xs={12} className='mt-2'>
                                            <TableText label={"Building Approval Number"} required={false} LeftSpace={false} />
                                            <TableInputText disabled={IsViewMode} type='text' placeholder='Enter Building Approval Number' required={false} name={'buildingApprovalNo'} value={PropertyDetails.buildingApprovalNo} onChange={onChange} />
                                        </Col>
                                    </Row>
                                        <Col lg={3} md={6} xs={12}>
                                        </Col>
                                        
                                    <Row>
                                        <div>
                                            <p className={` ${styles.note}`}>NOTE :</p>
                                            <p className={` ${styles.note}`}>1. The clearance of the schedule of this property is subject to the verification of prohibited property by Sub-Registrar.</p>
                                            <p className={` ${styles.note}`}>2. Market value and Duty fees is Subject to verification of the Sub Registrar</p>
                                            <p className={` ${styles.note}`}>3. Please select the ward secretariat if the property falls in Muncipal Corporation.</p>
                                        </div>
                                    </Row>
                                    <Row>

                                    </Row>
                                    {IsFlat &&
                                        <div className={styles.FlatDetails}>
                                            <div className={styles.divider}></div>
                                            <Row>
                                                <p className={` ${styles.getTitle} ${styles.HeadingText}`}>Flat Details [ఫ్లాట్ వివరాలు]</p>
                                                <Col lg={6} md={6} xs={12}>
                                                    <TableText label={"Flat No [ఫ్లాట్ నెం.]"} required={true} LeftSpace={false} />
                                                    <TableInputText disabled={IsViewMode} type='text' placeholder='Enter Flat no' required={true} maxLength={100} name={'flatNo'} value={PropertyDetails.flatNo} onChange={onChange} />
                                                </Col>
                                                <Col lg={6} md={6} xs={12}>
                                                    <TableText label={"Undivided Share/ Extent [విభజించబడని వాటా/విస్తీర్ణం]"} required={true} LeftSpace={false} />
                                                    <TableInputText disabled={IsViewMode} type='number' placeholder='Enter Extent Value' required={true} name={'undividedShare'} dot={true} splChar={true} value={PropertyDetails.undividedShare} onChange={onChange} onBlurCapture={e => { e.preventDefault(); if (!ValidSurvey(e.target.value,"undividedShare")) { setPropertyDetails({ ...PropertyDetails, undividedShare: '' }) } }}/>
                                                </Col>
                                                <Col lg={6} md={6} xs={12}>
                                                    <TableText label={"Unit [యూనిట్]"} required={true} LeftSpace={false} />
                                                    {IsViewMode ? <TableInputText disabled={true} type='text' placeholder='' required={false} name={'undividedShareUnit'} value={PropertyDetails.undividedShareUnit} onChange={onChange} />
                                                        : <TableDropdown required={true} options={DropdownOptions.UnitList} name={'undividedShareUnit'} value={PropertyDetails.undividedShareUnit} onChange={onChange} />}
                                                </Col>
                                            </Row>
                                            <div className={styles.divider}></div>
                                            <Row className="mb-2">
                                                <p className={` ${styles.getTitle} ${styles.HeadingText}`}>Flat Boundary Details [ఫ్లాట్ సరిహద్దు వివరాలు]</p>
                                                <Col lg={3} md={6} xs={12}>
                                                    <TableText label={"North Side [ఉత్తరం వైపు]"} required={true}  LeftSpace={false} />
                                                    <TableInputText disabled={IsViewMode} type='text' placeholder=''dot={true} splChar={true} required={true} name={'flatNorthBoundry'} value={PropertyDetails.flatNorthBoundry} onChange={onChange} />
                                                </Col>
                                                <Col lg={3} md={6} xs={12}>
                                                    <TableText label={"South Side [దక్షిణం వైపు]"} required={true} LeftSpace={false} />
                                                    <TableInputText disabled={IsViewMode} type='text' placeholder=''dot={true} splChar={true} required={true} name={'flatSouthBoundry'} value={PropertyDetails.flatSouthBoundry} onChange={onChange} />
                                                </Col>
                                                <Col lg={3} md={6} xs={12}>
                                                    <TableText label={"East Side [తూర్పు వైపు]"} required={true} LeftSpace={false} />
                                                    <TableInputText disabled={IsViewMode} type='text' placeholder=''dot={true} splChar={true} required={true} name={'flatEastBoundry'} value={PropertyDetails.flatEastBoundry} onChange={onChange} />
                                                </Col>
                                                <Col lg={3} md={6} xs={12}>
                                                    <TableText label={"West Side [పడమర వైపు]"} required={true} LeftSpace={false} />
                                                    <TableInputText disabled={IsViewMode} type='text' placeholder=''dot={true} splChar={true} required={true} name={'flatWestBoundry'} value={PropertyDetails.flatWestBoundry} onChange={onChange} />
                                                </Col>
                                            </Row>
                                        </div>
                                    }

                                    {(PropertyDetails.landUse.includes("VACANT") || PropertyDetails.schedulePropertyType == "") ? <div></div> :
                                        <div>
                                            <div className={styles.divider}></div>
                                            <Row>
                                                <p className={` ${styles.getTitle} ${styles.HeadingText}`}>Structures Type[నిర్మాణాలు]</p>
                                                <Col lg={3} md={6} xs={12} className="mb-2">
                                                    <TableText label={"Total Floors [మొత్తం అంతస్తులు]"} required={true} LeftSpace={false} />
                                                    <TableInputText disabled={!IsViewMode ? generateStructure.showStructure : IsViewMode} type='number' maxLength={2} placeholder='Enter Total Floors' dot={false} required={true} name={'totalFloors'} value={PropertyDetails.totalFloors} onChange={onChange} />
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
                                                <Row>
                                                    <Col lg={2} md={6} xs={12}>
                                                        {IsViewMode ? <TableInputText disabled={true} type='text' placeholder='' required={false} name={'floorNo'} value={Structure.floorNo} onChange={onChange} />
                                                            : <TableDropdown required={false} options={floorList} name={'floorNo'} value={Structure.floorNo} onChange={onChangeStructure} />}
                                                    </Col>
                                                    <Col lg={2} md={6} xs={12}>
                                                        {IsViewMode ? <TableInputText disabled={true} type='text' placeholder='' required={false} name={'structureType'} value={Structure.structureType} onChange={onChange} />
                                                            : <TableDropdown required={false} options={DropdownOptions.StructureTypeList} name={'structureType'} value={Structure.structureType} onChange={onChangeStructure} />}
                                                    </Col>
                                                    <Col lg={2} md={6} xs={12}>
                                                        <TableInputText disabled={IsViewMode} type='number' placeholder='' required={false} name={'plinth'} value={Structure.plinth} onChange={onChangeStructure} onBlurCapture={e => { e.preventDefault(); if (!ValidSurvey(e.target.value,"plinth")) { setStructure({ ...Structure, plinth: '' }) } }}/>
                                                    </Col>
                                                    <Col lg={2} md={6} xs={12}>
                                                        {IsViewMode ? <TableInputText disabled={true} type='text' placeholder='' required={false} name={'plinthUnit'} value={Structure.plinthUnit} onChange={onChange} />
                                                            : <TableDropdown required={false} options={DropdownOptions.StrUnitList} name={'plinthUnit'} value={Structure.plinthUnit} onChange={onChangeStructure} />}
                                                    </Col>
                                                    <Col lg={2} md={6} xs={12}>
                                                        {IsViewMode ? <TableInputText disabled={true} type='text' placeholder='' required={false} name={'stageOfCons'} value={Structure.stageOfCons} onChange={onChange} />
                                                            : <TableDropdown required={false} options={DropdownOptions.ConsList} name={'stageOfCons'} value={Structure.stageOfCons} onChange={onChangeStructure} />}
                                                    </Col>
                                                    <Col lg={2} md={6} xs={12}>
                                                        <TableInputText disabled={IsViewMode} type='number' placeholder='' required={false} name={'age'} value={Structure.age} onChange={onChangeStructure} />
                                                    </Col>

                                                    {IsViewMode ? <div style={{ margin: '20px' }}></div> : <Col lg={12} md={12} xs={12}>
                                                        <div
                                                            onClick={tableData} className={`${styles.YesBtn} ${styles.AddBtn}`}>Add</div>
                                                    </Col>}
                                                </Row>
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
                                    {PropertyDetails.mode === "edit" || PropertyDetails.mode === "add" ?
                                            <>
                                            <Row>
                                                 <p className={` ${styles.getTitle} ${styles.HeadingText}`}>Link Document Details [లింక్ దస్తావేజుల వివరాలు]</p>
                                                 <Col lg={6} md={6} xs={12}>
                                                <div className='Inputgap'>
                                                    {/* <TableText label={"Document Executed by [దస్తావేజు అమలు చేసే విదానం]"} required={true} LeftSpace={true} /> */}
                                                    {/* <div className={styles.DocuementGen1}> */}
                                                    <TableInputRadio label={'Select'} required={false} options={[{ 'label': "Registered In AP" }, { 'label': "Registered In TS" }]} onChange={onChange} name='registeredState' defaultValue={PropertyDetails.registeredState} />
                                                    {/* </div> */}
                                                </div>

                                                </Col>
                                            </Row>
                                            {PropertyDetails.registeredState ==="Registered In AP" ?<>
                                            <Row>
                                                
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
                                                    <TableInputText type='number' placeholder='Enter Link Document No' allowNeg={true} maxLength={7} required={false} name={'linkDocNo'} value={LinkDocument.linkDocNo} onChange={onChangeLinkDoc} />
                                                </Col>
                                                <Col lg={4} md={12} xs={12}>
                                                    <TableText label={"Registration Year [నమోదు సంవత్సరం]"} required={true} LeftSpace={false} />
                                                    <TableInputText type='number' placeholder='Enter Registartion Year' required={false} name={'regYear'} value={LinkDocument.regYear} onChange={onChangeLinkDoc} />
                                                </Col>
                                                <Col lg={4} md={12} xs={12}>
                                                    <TableText label={"Book No. [షెడ్యూల్ నెం.]"} required={false} LeftSpace={false} />
                                                    <TableInputText type='number' placeholder='Enter Schedule No' required={false} name={'bookNo'} value={LinkDocument.bookNo} onChange={onChangeLinkDoc} />
                                                </Col>
                                            {	Object.keys(LinkDocument).filter(k => !['scheduleNo', 'sroCode'].includes(k) ).every(li => LinkDocument[li]) &&
                                            <Col lg={12} md={12} xs={12}>
                                                    <div className={`${styles.ProceedContainer} ${styles.Linkbtn}`}>
                                                        <button type="button" className='proceedButton' onClick={LinkDocData} >Add</button>
                                                    </div>
                                                </Col>}
                                            </Row>
                                            </>:  PropertyDetails.registeredState === "Registered In TS" ?<>
                                            <Row>
                                            <Col lg={4} md={12} xs={12} className='mb-2'>
                                                <TableText label={"Enter SroCode"} required={false} LeftSpace={false} />
                                                <TableInputText type='number' placeholder='Enter SroCode' allowNeg={true} maxLength={7} required={false} name={'sroCode'} value={LinkDocument.sroCode} onChange={onChangeLinkDoc} onBlurCapture={e => { e.preventDefault(); if (!validSroCode(e.target.value)) { setLinkDocument({ ...LinkDocument, sroCode: "" }) } }}/>
                                            </Col>
                                            <Col lg={4} md={12} xs={12} className='mb-2'>
                                                <TableText label={"Link Document No. [లింక్ డాక్యుమెంట్ నెం.]"} required={false} LeftSpace={false} />
                                                <TableInputText type='number' placeholder='Enter Link Document No' allowNeg={true} maxLength={7} required={false} name={'linkDocNo'} value={LinkDocument.linkDocNo} onChange={onChangeLinkDoc} />
                                            </Col>
                                            <Col lg={4} md={12} xs={12}>
                                                <TableText label={"Registration Year [నమోదు సంవత్సరం]"} required={false} LeftSpace={false} />
                                                <TableInputText type='number' placeholder='Enter Registartion Year' required={false} name={'regYear'} value={LinkDocument.regYear} onChange={onChangeLinkDoc} />
                                            </Col>
                                            <Col lg={4} md={12} xs={12}>
                                                <TableText label={"Book No. [షెడ్యూల్ నెం.]"} required={false} LeftSpace={false} />
                                                <TableInputText type='number' placeholder='Enter Book No' required={false} name={'bookNo'} value={LinkDocument.bookNo} onChange={onChangeLinkDoc} />
                                            </Col>
                                            {
                                                Object.keys(LinkDocument).filter(k => !['scheduleNo', 'sroCode'].includes(k) ).some(li => LinkDocument[li]) &&
                                            <Col lg={12} md={12} xs={12}>
                                                <div className={`${styles.ProceedContainer} ${styles.Linkbtn}`}>
                                                    <button type="button" className='proceedButton' onClick={LinkDocData} >Add</button>
                                                </div>
                                            </Col>
                                            }
                                        </Row>
                                        </> :null
                                        }</>:null
                                    }
                                    {PropertyDetails && PropertyDetails.LinkedDocDetails && PropertyDetails.LinkedDocDetails.length >0 ?
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
                                                        {PropertyDetails.LinkedDocDetails && PropertyDetails.LinkedDocDetails.length>0 &&PropertyDetails.LinkedDocDetails.map((SingleFetchDocument, index) => {
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
                                        </Row>:null
                                    }
                                    <div className={styles.divider}></div>
                                    {AllowProceed && !IsViewMode ? <Row className="mb-2">
                                        <Col lg={12} md={12} xs={12}>
                                            <div className={styles.ProceedContainer}>
                                                <button className='proceedButton'>{PropertyDetails.mode == "edit" ? "Update" : "Proceed"} </button>
                                            </div>
                                        </Col>
                                    </Row> : null}
                                </form>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
            {ppbyPass.status ==true && <Container>
                <div className={Popstyles.reportPopup}>
                    <div className={Popstyles.container}>
                        <div className={Popstyles.Messagebox}>
                            <div className={Popstyles.header}>
                                <div className={Popstyles.letHeader} >
                                    <p className={Popstyles.text}>Document</p>
                                </div>
                                {/* <div>
                                    <ImCross onClick={OnCancelAction} className={Popstyles.crossButton} />
                                </div> */}
                            </div>
                            <div style={{ paddingLeft: '1rem', paddingRight: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }} className={Popstyles.popupBox}>
                                {/* {PopupMemory.type ? */}
                                    <div className={Popstyles.SuccessImg}>
                                        {/* <Image alt='' width={60} height={60} className={Popstyles.sImage} src="/PDE/images/success-icon.png" /> */}
                                        {String(ppbyPass.value).includes(",") ?<div className={Popstyles.docText}>
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
                                            <button className={Popstyles.yesBtn} onClick={()=>onClickDocs('Y')}>YES</button>
                                            <button className={Popstyles.noBtn} onClick={()=>onClickDocs('N')}>NO</button>
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
                </Container>
            }
            {showPopup && (
          <DoorNumberSearchDetailsDialog
            show={showPopup}
            data={doorNumSearchData}
            onClose={() => {setShowPopup(false); setPropertyDetails({...PropertyDetails, ptinNo : "0"}); setCDMADetails({});}}
            onSubmit={(row) => {
              setSelectedDoorNumData(row)
              setShowPopup(false);
              if (row?.assessmentNo && isMutationEnabled){
                getCDMADetails(row?.assessmentNo);
              }
            }}
            autoCloseEmpty={false}
          />
        )}
 
            {/* <pre>{JSON.stringify(RequiredFields,null,2)}</pre> */}
            {/* <pre>{JSON.stringify(ApplicationDetails,null,2)}</pre> */}
            {/* <pre>{JSON.stringify(VillageCodeList.length , null, 2)}</pre> */}
            {/* <pre>{JSON.stringify(localBodyTypeList, null, 2)}</pre> */}
            {/* <pre>{JSON.stringify(PropertyDetails, null, 2)}</pre> */}
            {/* <pre>{Object.keys(PropertyDetails).length}</pre> */}
            {/* <pre>{JSON.stringify(CDMADetails,null,2)}</pre>  */}
            {/* <pre>{JSON.stringify(selectedcdmaDetails,null,2)}</pre> */}
            {/* {PropertyDetails.structure.length?<pre>{MasterCodeIdentifier("StageOfCons",PropertyDetails.structure[0].StageOfCons)}</pre>:null} */}
            {/* <pre>{MasterCodeIdentifier("StageOfCons","Foundation2")}</pre> */}
            {/* <button onClick={()=>window.alert(PropertyDetails.structure[0].stageOfCons+"="+MasterCodeIdentifier("StageOfCons",PropertyDetails.structure[0].stageOfCons))}>abc</button> */}
            {/* <pre>{JSON.stringify(IsViewMode)}</pre> */}
            {/* <pre>{JSON.stringify(leaseData,null,2)}</pre>*/}
            {/*<pre>{JSON.stringify(ApplicationDetails,null,2)}</pre> */}
            { /*<pre>{JSON.stringify(ApplicationDetails,null,2)}</pre>*/ }
            {/* <pre>{JSON.stringify(PropertyDetails,null,2)}</pre> */}
            { /*<pre>{JSON.stringify(PropertyDetails,null,2)}</pre>*/  }
        </div>
        </>
    )
}

export default PropertyDetailsPage_B;

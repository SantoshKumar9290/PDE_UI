import { useState, useEffect, useCallback } from 'react';
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
import { allowSameSurvey, checkCaptcha,CheckCrdaVg,CrdaEmpCheck,encryptWithAES,FreeHoldLands,WeblandException } from '../src/utils';
// import { useGetDistrictList, useSROOfficeList, UseAddProperty, UseUpdateProperty, UseGetWenlandSearch, UseGetVillageCode, UselocalBodies, UseGetHabitation, UseGetPPCheck, UseMVCalculator, useGetMandalList, UseGetVgForPpAndMV, useGetVillagelList, getSroDetails, UseDutyCalculator, UseGetlpmCheck,getLinkedSroDetails, UseReportTelDownload, UseReportDownload,UseGetECDetails,UseGetLinkDocDetails,GetCheckLPMMV } from '../src/axios';
// import { checkCaptcha,CheckCrdaVg,FreeHoldLands,WeblandException } from '../src/utils';
import { useGetDistrictList, useSROOfficeList, UseAddProperty, UseUpdateProperty, UseGetWenlandSearch, UseGetVillageCode, UselocalBodies, UseGetHabitation, UseGetPPCheck, UseMVCalculator, useGetMandalList, UseGetVgForPpAndMV, useGetVillagelList, getSroDetails, UseDutyCalculator, UseGetlpmCheck,getLinkedSroDetails, UseReportTelDownload, UseReportDownload,UseGetECDetails,UseGetLinkDocDetails,GetCheckLPMMV,UseVgforWebland, lpmbasenumber, lpmform4check, UseGetSurveyNoList } from '../src/axios';
import lodash from "lodash";
import { SavePropertyDetails } from '../src/redux/formSlice';
import { PopupAction, AadharPopupAction, DeletePopupAction } from '../src/redux/commonSlice';
import Image from 'next/image';
import Head from 'next/head';
import { CallingAxios, DateFormator, DoorNOIdentifier, KeepLoggedIn, MasterCodeIdentifier, ShowMessagePopup, MuncipleKeyNameIdentifier, ShowPreviewPopup, TotalMarketValueCalculator } from '../src/GenericFunctions';
import Captcha from '../src/components/Captcha';
import TableSelectDate from '../src/components/TableSelectDate';
import moment from 'moment';
import Popstyles from '../styles/components/PopupAlert.module.scss';
import { ImCross } from 'react-icons/im';
import{Multiselect} from 'multiselect-react-dropdown'
import TableDropdownSRO2 from '../src/components/TableDropdownSRO2';
import SearchableDropdown from '../src/components/SearchDropdown';


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

const CRDAdocuments = [
  { T_MAJ: "01", T_MIN: "25", DOCT_TYPE: "Development Agreement/GPA/Supplemental Deed by CRDA", type: "Sale" },
  { T_MAJ: "01", T_MIN: "19", DOCT_TYPE: "Court Decree" },
  { T_MAJ: "01", T_MIN: "20", DOCT_TYPE: "Court Sale Certificate" },
  { T_MAJ: "05", T_MIN: "05", DOCT_TYPE: "Receipt (RDTM)", type: "Release" },
  { T_MAJ: "05", T_MIN: "09", DOCT_TYPE: "Release Mortgage Right", type: "Release" },
  { T_MAJ: "06", T_MIN: "02", DOCT_TYPE: "Exchange by CRDA", type: "Exchange" },
  { T_MAJ: "07", T_MIN: "06", DOCT_TYPE: "Surrender of Lease" },
  { T_MAJ: "08", T_MIN: "01", DOCT_TYPE: "Rectification Deed" },
  { T_MAJ: "08", T_MIN: "02", DOCT_TYPE: "Supplemental Deed, Ratification Deed u/s 4 of I.S.Act" },
  { T_MAJ: "08", T_MIN: "03", DOCT_TYPE: "Cancellation Deed" },
  { T_MAJ: "08", T_MIN: "04", DOCT_TYPE: "Revocation of Settlement" }, 
  { T_MAJ: "08", T_MIN: "05", DOCT_TYPE: "Rectification Deed By CRDA" },
  { T_MAJ: "01", T_MIN: "21", DOCT_TYPE: "Court Decree [కోర్టు డిక్రీ]" },
  { T_MAJ: "01", T_MIN: "20", DOCT_TYPE: "Court Sale Certificate [కోర్టు క్రయ దృవీకరణ దస్తావేజు" },
  { T_MAJ: "04", T_MIN: "03", DOCT_TYPE: "Partition executed by Court" },
  { T_MAJ: "08", T_MIN: "07", DOCT_TYPE: "Unilateral Cancellation Deed by APIIC" }
];

const PropertyDetailsPage_B = () => {
    const router = useRouter();
    const dispatch = useAppDispatch()
    const [generateStructure, setGenerateStructure] = useState({ showStructure: false, allowEdit: true });
    const [activepage, setActivepage] = useState(false);
    const [getlinkDocument, setGetlinkDocument] = useState(false);
    let initialGetstartedDetails = useAppSelector(state => state.form.GetstartedDetails);
    const [GetstartedDetails, setGetstartedDetails] = useState(initialGetstartedDetails);
    let LoginDetails = useAppSelector(state => state.login.loginDetails);
    const [DistrictList, setDistrictList] = useState([]);
    const [SROOfficeList, setSROOfficeList] = useState([]);
    let initialPropertyDetails = useAppSelector(state => state.form.PropertyDetails);
    let [PropertyDetails, setPropertyDetails] = useState<any>(initialPropertyDetails);
    let [LinkDocument, setLinkDocument] = useState<any>({ linkDocNo: "", regYear: "", bookNo: "", scheduleNo: "", district: "", sroOffice: "",sroCode:"" });
    const [WeblandDetails, setWeblandDetails] = useState({ totalExtentAcers: "", totalExtentCents: "", conveyedExtentAcers: "", conveyedExtentCents: "", khataNumber: "", sryNo: "",isProhibited:"" })
    const [selectedWebLand,setSelectedWebLand]=useState({})
    const [WeblanList, setWeblanList] = useState({ message: "", data: [] });
    const [JointData,setJointData] = useState<boolean>(false)
    const [findJointData,setfindJointData] =  useState<boolean>(false)
    const [jointadangalData,setJointAdangalData]=useState({ message: "", data: [] })
    const [MandalList, setMandalList] = useState([]);
    const [VillagefrMandalList, setVillagefrMandalList] = useState([]);
    const [VillageList, setVillageList] = useState([]);
    const [VillageCodeList, setVillageCodeList] = useState([]);
    const [HabitationList, setHabitationList] = useState([]);
    const [localBodyTypeList, setLocalBodyTypeList] = useState([]);
    const [localBodyNameList, setLocalBodyNameList] = useState([]);

    const [HabitationCodeList, setHabitationCodeList] = useState([]);
    const [ApplicationDetails, setApplicationDetails] = useState<any>({ applicationId: "", executent: [], claimant: [] });
    const [AllowProceed, setAllowProceed] = useState(false);
    const [IsViewMode, setIsViewMode] = useState(false);
    const [CalculatedDutyFee, setCalculatedDutyFee] = useState({ TRAN_MAJ_CODE: "", TRAN_MIN_CODE: "", sroCode: "", amount: "", rf_p: "0", td_p: "0", sd_p: "0", marketValue: "0" })
    const [lpmValue, setLpmValue] = useState(0);
    const [distCode, setDistCode] = useState<any>("");
    const [wbVgCode, setwbVegCode] = useState<any>("");
    const [VILLCD, setVILLCD] = useState('');
	const [ecDetails,setEcDetails] = useState<any>([]);
    const [mLinkDocs,setmLinkDocs] = useState<any>(false);
    const [rentMonthOrYear, setRentMonthOrYear] = useState<any>(["Monthly","Yearly"])
	const [isYesCheck, setIsYesCheck] = useState<any>(false);
	const [isNoCheck, setIsNoCheck] = useState<any>(false);
	const [isYesPresentCheck, setIsYesPresentCheck] = useState<any>(false);
	const [isNoPresentCheck, setIsNoPresentCheck] = useState<any>(false);
	const [flag, setFlag] = useState(false);
    const [inputValue, setInputValue] = useState<any>("");
    const [maxDate, setMaxDate] = useState(Date);
    const [rentalRowData, setrentalRowData] = useState([]);
    const [rData,setrData]= useState<any>({rentalPeriod :"",rentalAmount:"",renatmonthlyOrYearly:"Y",totalAmount:""})
    let [leaseData,setLeaseData] = useState<any>({ wef:"",lPeriod:"",advance:"",adjOrNonAdj:"",valueOfImp:"",muncipalTax:"",rentalDetails:[]})
    const [ppbyPass,setPpByPass] = useState<boolean>(false)
    const [pValue,setPValue]=useState<any>(false);
    let [ShareRls,setShareRls]=useState<any>(false);
    const [statusBar, setStatusBar] = useState<any>(false);
    const [rentButn,SetRentButn] = useState<any>(false);
    let [userCharges,setUserCharges]= useState<any>(500);
    let [leasegranTotal,SetleasegranTotal]= useState<any>(0);
    let [CRDAnature,setCRDAnature]=useState(false)
    const [multiDropValue,setMultiDropValue] =useState<any>([]);
     const[validLpmNumbervalue,setValidLpmnumberValue]=useState(false);
    const[validsurveyNumberValue,setvalidsurveyNumberValue]=useState(false);
    const ShowAlert = (type, message) => { dispatch(PopupAction({ enable: true, type: type, message: message })); }    
    const onGenerateStructureClick = (value: string) => {
        if (value == "edit") {
            if (PropertyDetails.totalFloors) {
                setGenerateStructure({ ...generateStructure, showStructure: true, allowEdit: false });
            }
            else {
                ShowMessagePopup(false, "Please enter total number of floors.", "");
            }
        }
        else {
            setPropertyDetails({ ...PropertyDetails, totalFloors: "", structure: [] });
            setGenerateStructure({ ...generateStructure, showStructure: false, allowEdit: true });
        }
    };
    const ongenlinkdocClick = () => {
        setGetlinkDocument(!getlinkDocument)

    }
    useEffect(() => {},[PropertyDetails])
    useEffect(() => {
        if (KeepLoggedIn()) {
            let data: any = localStorage.getItem("GetApplicationDetails");
            if (data == "" || data == undefined) {
                ShowMessagePopup(false, "Invalid Access", "/");
            }
            else {
                data = JSON.parse(data);
                setApplicationDetails(data)
                setLeaseData(data.leasePropertyDetails || leaseData)
                if (DistrictList.length == 0) {
                    GetDistrictList();
                }

                let data2: any = localStorage.getItem("PropertyDetails");
                if (data2 == "" || data == undefined) {
                    ShowMessagePopup(false, "Invalid Access", "/");
                }
                else {
                    data2 = JSON.parse(data2);
                    if (data2.VILLCD) {
                        GetLpmCheck(data2.VILLCD);
                        const tmaj_code = data?.documentNature?.TRAN_MAJ_CODE;
                        const tmin_code = data?.documentNature?.TRAN_MIN_CODE;
                         setCRDAnature( CRDAdocuments.some(
                         document => document.T_MAJ === tmaj_code && document.T_MIN === tmin_code));
                    }
					if(data2.isExAsPattadhar === "NO"){
						setIsNoCheck(true);
						setIsYesCheck(false);
					}
					if(data2.isExAsPattadhar === "YES"){
						setIsNoCheck(false);
						setIsYesCheck(true);
					}
					if(data2.ispresentExcutent === "NO"){
						setIsNoPresentCheck(true);
						setIsYesPresentCheck(false);
					}
					if(data2.ispresentExcutent === "YES"){
						setIsNoPresentCheck(false);
						setIsYesPresentCheck(true);
					}
                    dispatch(SavePropertyDetails(PropertyDetails));
                    if (data2.mode === 'edit') {
                        if (data2.habitationCode) {
                            GetLocalBodiesData(data2.habitationCode);
                            GetVgForPPandMv(data2.villageCode)
                            GetLpmCheck(data2.villageCode)
                        }
                    }else{
                        GetVgForPPandMv(data2.villageCode);
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
                        // GetLpmCheck(data2.villageCode)
                    }
                    if(data.documentNature.TRAN_MAJ_CODE === "07" && data2.mode === 'edit'){
                        let grAmount:any =0;
                        data.leasePropertyDetails.rentalDetails.map((rp:any)=>{
                            grAmount = (Number(grAmount) + rp["totalAmount"]);
                        });
                        SetleasegranTotal(grAmount);
                    }
                    // if (data2.conveyedExtent && data2.conveyedExtent.length) {
                    //     let ExtentList = [];
                    //     data2.conveyedExtent.map((x, i) => {
                    //         ExtentList.push({ totalExtentAcers: data2.tExtent.split('.')[0], totalExtentCents: data2.tExtent.split('.')[1], conveyedExtentAcers: x.extent.split('.')[0], conveyedExtentCents: x.extent.split('.')[1], survayNo: data2.survayNo.split(',')[i] });
                    //     })
                    //     data2 = { ...data2, ExtentList: ExtentList }
                    // }
                    if (data2.mode == "edit") {
                         setAllowProceed(true);
                          const tmaj_code = data?.documentNature?.TRAN_MAJ_CODE;
                          const tmin_code = data?.documentNature?.TRAN_MIN_CODE;
                         setCRDAnature( CRDAdocuments.some(
                         document => document.T_MAJ === tmaj_code && document.T_MIN === tmin_code));
                            if(data2.survayNo && data2.lpmNo){
                                setValidLpmnumberValue(true);
                                setvalidsurveyNumberValue(true);
                            }
                            if(data2.survayNo){
                                setvalidsurveyNumberValue(true);
                            }
                        
                    }
                    
                    if (data2.mode == "view") {
                        setIsViewMode(true);
                    } else {
                        setIsViewMode(false);
                    }
                    setPropertyDetails(data2.mode === 'edit' ? { ...data2, localBodyType: data2.localBodyCode } : data2.mode === 'add'? {...data2,LinkedDocDetails:[]}:data2);
                }
                if((data?.documentNature?.TRAN_MAJ_CODE == "05" &&(data?.documentNature?.TRAN_MIN_CODE =="03" || data?.documentNature?.TRAN_MIN_CODE =="04"|| data?.documentNature?.TRAN_MIN_CODE =="05" || data?.documentNature?.TRAN_MIN_CODE =="09")) || (data?.documentNature?.TRAN_MAJ_CODE == "08" &&(data?.documentNature?.TRAN_MIN_CODE =="01" || data?.documentNature?.TRAN_MIN_CODE =="02" || data?.documentNature?.TRAN_MIN_CODE =="03" || data?.documentNature?.TRAN_MIN_CODE =="04" || data?.documentNature?.TRAN_MIN_CODE =="05"))
                || (data?.documentNature?.TRAN_MAJ_CODE == "35" && data?.documentNature?.TRAN_MIN_CODE =="01") || (data?.documentNature?.TRAN_MAJ_CODE == "36" && ApplicationDetails?.documentNature?.TRAN_MIN_CODE =="01")){
                    setmLinkDocs(true);
                }else{
                    setmLinkDocs(false);
                }
                // CrdaEmpCheck[parseInt(ApplicationDetails.documentNature.TRAN_MAJ_CODE)]
                if(WeblandException[parseInt(data.documentNature.TRAN_MAJ_CODE)] && WeblandException[parseInt(data.documentNature.TRAN_MAJ_CODE)].includes(WeblandException[data.documentNature.TRAN_MIN_CODE])){
                    setShareRls(true);
                }else{
                    setShareRls(false);
                };
                // CRDA Changes
                if(data.documentNature.TRAN_MAJ_CODE =="01" && data.documentNature.TRAN_MIN_CODE =="25"&& CheckCrdaVg(data2.villageCode)){
                    // window.alert("lllllllllllllllllllllllllll")
                    setShareRls(true);
                }else{
                    setShareRls(false);
                    // ShowMessagePopup(false,"This Village is Not in CRDA","");
                }

                //webland Exemption
                if(data.documentNature.TRAN_MAJ_CODE === "05"){
                    if(data.documentNature.TRAN_MIN_CODE === "05" ){
                        setShareRls(true);
                    }else if( data.documentNature.TRAN_MIN_CODE === "09"){
                        setShareRls(true);
                    }else{
                        setShareRls(false);
                    }
                }else if(data.documentNature.TRAN_MAJ_CODE === "08"){
                    if(data.documentNature.TRAN_MIN_CODE === "01" ){
                        setShareRls(true);
                    }else if( data.documentNature.TRAN_MIN_CODE === "02"){
                        setShareRls(true);
                    }else if( data.documentNature.TRAN_MIN_CODE === "03"){
                        setShareRls(true);
                    }else if( data.documentNature.TRAN_MIN_CODE === "04"){
                        setShareRls(true);
                    }else if(data.documentNature.TRAN_MIN_CODE === "05"){
                        setShareRls(true);
                    }else if(data.documentNature.TRAN_MIN_CODE === "07"){
                        setShareRls(true);
                    }
                    else{
                        setShareRls(false);
                    }
                }else if(data.documentNature.TRAN_MAJ_CODE === "01"){
                    if(data.documentNature.TRAN_MIN_CODE === "25"){
                        setShareRls(true);
                    }else if(data.documentNature.TRAN_MIN_CODE === "19"){
                        setShareRls(true);
                    }else if(data.documentNature.TRAN_MIN_CODE === "20"){
                        setShareRls(true);
                    }else if(data.documentNature.TRAN_MIN_CODE === "21"){
                        setShareRls(true);
                    }
                    else{
                        setShareRls(false)
                    }
                }else if(data.documentNature.TRAN_MAJ_CODE === "06"){
                    if(data.documentNature.TRAN_MIN_CODE === "02"){
                        setShareRls(true);
                    }else{
                        setShareRls(false)
                    }
                }else if(data.documentNature.TRAN_MAJ_CODE === "04"){
                    if(data.documentNature.TRAN_MIN_CODE === "03"){
                        setShareRls(true);
                    }else{
                        setShareRls(false)
                    }
                }
                else if(data.documentNature.TRAN_MAJ_CODE === "07"){
                    if(data.documentNature.TRAN_MIN_CODE === "06"){
                        setShareRls(true);
                    }else{
                        setShareRls(false)
                    }
                }
                else{
                    setShareRls(false);
                }
                if(data.documentNature.TRAN_MAJ_CODE === "05" || data.documentNature.TRAN_MAJ_CODE === "06"){
                    setStatusBar(true)
                }else{
                    setStatusBar(false)
                }
                if(data.documentNature.TRAN_MAJ_CODE === "04" || data.documentNature.TRAN_MAJ_CODE === "03"){
                    setUserCharges(0)
                }else{
                    setUserCharges(500)
                }

            }
        } else { ShowMessagePopup(false, "Invalid Access", "/"); }
    }, []);
    let doctcondtion =ApplicationDetails?.documentNature?.TRAN_MAJ_CODE ==='01'&& ApplicationDetails?.documentNature?.TRAN_MIN_CODE==='27'

    useEffect(() => {
        if(CRDAnature){
            setPropertyDetails({...PropertyDetails,lpmNo:""})
        }
        
        if (ApplicationDetails.registrationType && ApplicationDetails.documentNature && ApplicationDetails.sroCode && ApplicationDetails.amount) {
            let currentMarketValue = TotalMarketValueCalculator(ApplicationDetails);
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
                "con_value":  ApplicationDetails?.amount || ApplicationDetails?.property[0]?.considarartionValue,
                "adv_amount": 0
            }
            DutyFeeCalculator(data);
        }
        if((PropertyDetails.mode == "edit" || PropertyDetails.mode == "view") && ApplicationDetails?.documentNature?.TRAN_MAJ_CODE == "07"){
            const rentadetails= PropertyDetails?.leaseDetails?.rentalDetails;
            const leaseData = PropertyDetails?.leaseDetails;
            setrentalRowData(rentadetails);
        }
    }, [ApplicationDetails])

    useEffect(() => {
        if(PropertyDetails.mode != "edit")
            setrentalRowData(rentalRowData);
    }, [rentalRowData])

    const OnCancelAction= async ()=>{
		setPpByPass(false);
	}

    const DutyFeeCalculator = async (data) => {
        if (ApplicationDetails.registrationType.TRAN_MAJ_CODE === '04' && ApplicationDetails.documentNature.TRAN_MIN_CODE === '04') {
            let sd_p = ApplicationDetails?.amount && data.finalTaxbleValue <= 1000000 ?  100 :  1000;
            let rf_p =  1000
            let td_p = 0;
            setCalculatedDutyFee({ ...CalculatedDutyFee, TRAN_MAJ_CODE: ApplicationDetails.registrationType.TRAN_MAJ_CODE, TRAN_MIN_CODE: ApplicationDetails.documentNature.TRAN_MIN_CODE, sroCode: ApplicationDetails.sroCode, amount: ApplicationDetails.amount, sd_p: Math.round(sd_p).toString(), td_p: Math.round(td_p).toString(), rf_p: Math.round(rf_p).toString() });
        } else {
            let result = await UseDutyCalculator(data);
            if (result.status) {
                setCalculatedDutyFee({ ...CalculatedDutyFee, TRAN_MAJ_CODE: ApplicationDetails.registrationType.TRAN_MAJ_CODE, TRAN_MIN_CODE: ApplicationDetails.documentNature.TRAN_MIN_CODE, sroCode: ApplicationDetails.sroCode, amount: ApplicationDetails.amount, sd_p: result.data.sd_p, td_p: result.data.td_p, rf_p: result.data.rf_p });
            }
        }
    }
    const GetDistrictList = async () => {
        let result = await useGetDistrictList();
        if (result.status) {
            setDistrictList(result.data);
            // let sortedResult = result.data.sort((a, b) => a.name < b.name ? -1 : 1)
            // setDistrictList(result.data ? sortedResult : []);
        }
        else {
            // ShowMessagePopup(false, result.message, "")
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
    const GetVgForPPandMv = async (vgCode: any) => {
        if (vgCode && vgCode.length === 6) {
            vgCode = '0' + vgCode;
        }
        let result = await CallingAxios(UseGetVgForPpAndMV("Sr", vgCode));
        if (result.status) {
            let data = result.data;
            if (data && data.length > 0 && data[0].VILLCD != "")
                setVILLCD(data[0].VILLCD);
        }
        else {
            return ShowMessagePopup(false, "Fetch vgCode list failed", "")
        }
    }

    const GetLpmCheck = async (VillageCode: any) => {
        let result = await CallingAxios(UseGetlpmCheck(VillageCode));
        if (result.status) {
            let data = result.data;
            if(data[0].CNT >= 1){
                CallingAxios(GetLpmMvCheck(VillageCode))
            }
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

    const GetMandalList = async (id: any) => {
        let result = await CallingAxios(useGetMandalList(id));
        if (result.status) {
            // setDistrictList(result.data ? result.data : []);
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
            // setDistrictList(result.data ? result.data : []);
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

    const onChange = (event: any) => {
        let TempDetails = { ...PropertyDetails };
        let addName = event.target.name;
        let addValue = event.target.value;      
        // if (addName == 'northBoundry' || addName == 'southBoundry' || addName == 'eastBoundry' || addName == 'westBoundry') {
        //     addValue = addValue.replace(/[^\w\s/,-]/gi, "");
        // }
        if (addName == "district") {
            // setSROOfficeList([]);
            setMandalList([]);
            let selected = DistrictList.find(e => e.name == addValue);
            TempDetails = { ...TempDetails, districtCode: selected.id }
            setDistCode(selected.id)
            if (selected)
                GetMandalList(selected.id);
            // GetSROOfficeList(selected.id);
        } else if (addName == "mandal") {
            setVillagefrMandalList([]);
            let selected = MandalList.find(e => e.name == addValue);
            let mandalCode = selected ? selected.id : "";
            TempDetails = { ...TempDetails, mandalCode }
            // TempGetstartedDetails = { ...TempGetstartedDetails, mandalCode }
            if (selected)
                GetVillageList(selected.id, distCode);
        }
        // else if (addName == "survayNo") {
        //     let errorLabel = ""
        //     if (String(addValue).length < 10) {
        //         errorLabel = "Enter 10 Digits Number";
        //     } 
        // }
        else if (addName == "villagefromMandals") {
            setSROOfficeList([]);
            let selected = VillagefrMandalList.find(e => e.name == addValue);
            let villageCode = selected ? selected.id : "";
            TempDetails = { ...TempDetails, villageCode }
            // TempGetstartedDetails = { ...TempGetstartedDetails, villageCode }
            if (selected)
                GetSROOfficeList(selected.id);
        } else if (addName == "lpmNo") {
            if(addValue){
                setValidLpmnumberValue(true)
            }
            TempDetails = { ...TempDetails, lpmNo: addValue }
        }
        else if (addName == "village") {
            setHabitationList([]);
            setWeblanList({ message: "", data: [] });
            let selected = VillageCodeList.find(e => e.VILLAGE_NAME == addValue);
            TempDetails = { ...TempDetails, villageCode: selected.VILLAGE_CODE, habitationCode: "", ExtentList: [] }
            if (selected && selected.VILLAGE_CODE)
                GetHabitation(selected.VILLAGE_CODE)
            GetLpmCheck(selected.VILLAGE_CODE)

        } else if (addName == "habitation") {
            setLocalBodyNameList([]);
            setLocalBodyTypeList([]);
            TempDetails = { ...TempDetails, survayNo: "",  localBodyName: "", localBodyType: "" }
            setWeblanList({ message: "", data: [] });
            let selected = HabitationCodeList.find(e => e.HAB_NAME == addValue);
            if (selected && selected?.HABITATION) {
                TempDetails = { ...TempDetails, habitationCode: selected.HABITATION, ExtentList: [] }
            }
            if (selected)
                GetLocalBodiesData(selected.HABITATION);
        } else if (addName == "survayNo") {
             if(addValue){
                setvalidsurveyNumberValue(true);
            }
            setWeblanList({ message: "", data: [] });
        }
        // else if (addName == 'surveyNo') {
        //     // addValue = addValue.replace(/[^\w\s]/gi, "");
        //     addValue = addValue.replace(/[0-9]/gi, "");
        // }
        else if(addName =="checkyes"){
			setIsYesCheck(true);
			setIsNoCheck(false);
			TempDetails = { ...TempDetails, isExAsPattadhar:"YES" }
		}else if(addName =="checkNo"){
			setIsYesCheck(false);
			setIsNoCheck(true);
			TempDetails = { ...TempDetails, isExAsPattadhar:"NO" }
		}else if(addName =="yesExPresent"){
			setIsYesPresentCheck(true);
			setIsNoPresentCheck(false);
			TempDetails = { ...TempDetails, ispresentExcutent:"YES" }
		}else if(addName =="noExPresent"){
			setIsYesPresentCheck(false);
			setIsNoPresentCheck(true);
			TempDetails = { ...TempDetails, ispresentExcutent:"NO" }
		}
        else if (addName == "partyNumber") {
            const selectedClaimant = partiesFormattedOptions.find(
                (item) => item.label === addValue
            );
            addValue = selectedClaimant ? String(selectedClaimant.seqNumber) : "";
        }
        //wef,lPeriod,advance,adjOrNonAdj,valueOfImp,muncipalTax

        setGetstartedDetails({ ...GetstartedDetails, [addName]: addValue });
        setPropertyDetails({ ...TempDetails, [addName]: addValue });
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
        // PropertyDetails ={...PropertyDetails,LinkedDocDetails:LinkDocument}
        e.preventDefault();
        let rnData:any;
        if(ApplicationDetails?.documentNature?.TRAN_MAJ_CODE == "07" && leaseData.rentalDetails && leaseData.rentalDetails.length >0){
            rnData = await rentalValidation();
        }
        // window.alert(JSON.stringify(rnData))
        // localStorage.setItem("PropertyDetails",JSON.stringify(PropertyDetails));
		if (ecDetails && ecDetails.length >0 && (PropertyDetails?.isExAsPattadhar === undefined || PropertyDetails?.ispresentExcutent === undefined)) {
            return ShowMessagePopup(false, "Please Select the CheckBox", "");
        }
        if(ApplicationDetails && ApplicationDetails.documentNature.TRAN_MAJ_CODE =="04" && PropertyDetails.partyNumber === undefined ){
            return ShowAlert(false, "Please Select the partyNumber",);
        }
        if(PropertyDetails.jointOrNot ==="YES"  && ApplicationDetails.documentNature.TRAN_MAJ_CODE === "04"  && PropertyDetails.partyNumber.split(",").length === 1){
            return ShowAlert(false, "Party Names should be more than One",);
        }
        if (PropertyDetails?.ExtentList?.length == 0) {
            return ShowMessagePopup(false, "Please enter Conveyedextent Value", "");
        }else if(mLinkDocs && PropertyDetails.LinkedDocDetails && PropertyDetails.LinkedDocDetails.length === 0){
            ShowMessagePopup(false, "Atleast One Link Document Entry is Required", "");
        }else if(lpmValue > 0  && PropertyDetails.LinkedDocDetails && PropertyDetails.LinkedDocDetails.length === 0){
            ShowMessagePopup(false, "Atleast One Link Document Entry is Required", "");
        }else if((ApplicationDetails?.documentNature?.TRAN_MAJ_CODE != "04"&&ApplicationDetails?.documentNature?.TRAN_MAJ_CODE != "05") && jointadangalData && jointadangalData.data && jointadangalData.data.length && jointadangalData.data[0].SingleJoint === 'Joint' &&  ApplicationDetails.executent.length != jointadangalData.data.length){
            ShowMessagePopup(false, " No of JointPattadhars is not Equal to No of Executents ", "");
        }else if(ApplicationDetails?.documentNature?.TRAN_MAJ_CODE == "04" && jointadangalData && jointadangalData.data && jointadangalData.data.length && jointadangalData.data[0].SingleJoint === 'Joint' &&  ApplicationDetails.claimant.length < jointadangalData.data.length){
            ShowMessagePopup(false, " No of JointPattadhars is not Equal to No of Executents ", "");
        }else if(ApplicationDetails?.documentNature?.TRAN_MAJ_CODE === "07" && (leaseData.wef == "" || leaseData.lPeriod  == null || leaseData.advance == null || leaseData.muncipalTax == null || leaseData.advance == "" || leaseData.muncipalTax == "" || (leaseData.rentalDetails && leaseData.rentalDetails.length ===0) )){
            ShowMessagePopup(false, "Please Add the Lease Details", "");
        }else if(ApplicationDetails?.documentNature?.TRAN_MAJ_CODE === "07" &&  leaseData.rentalDetails && leaseData.rentalDetails.length > 0  && rnData.trpVal != leaseData.lPeriod){
        //    if(trp != leaseData.lPeriod ){
                // window.alert(JSON.stringify(rnData.trpVal))
                ShowMessagePopup(false, "Lease Period And Rental perod Should be Equal", "");
        //    }
        }else if(ApplicationDetails?.documentNature?.TRAN_MAJ_CODE === "07" && !rnData.rnamt){
            ShowMessagePopup(false, "Please Add the renatal Details", "");
        }else if(ApplicationDetails.documentNature.TRAN_MAJ_CODE ==='08' && (ApplicationDetails.documentNature.TRAN_MIN_CODE === '06') && PropertyDetails.LinkedDocDetails && PropertyDetails.LinkedDocDetails.length === 0){
            ShowMessagePopup(false, "Atleast One Link Document Entry is Required", "");
        }
        else {
            // window.alert(JSON.stringify(leaseData))
            let Details:any = { ...PropertyDetails };
            if(Object.keys(selectedWebLand).length){
            Details.webLandDetails={...selectedWebLand};
            }
            if(Details && Details.webLandDetails && Object.keys(Details.webLandDetails).length >0 && FreeHoldLands.includes(Details.webLandDetails.landNature)){
                Details.freeHoldLands ="Y";
            }else{
                Details.freeHoldLands ="N";
            }
            // if(Details?.webLandDetails && !Details?.webLandDetails?.cultivated && !Details?.webLandDetails?.nonCultivated){
            //     Details.webLandDetails={...Details.webLandDetails,cultivated:0,nonCultivated:0};
            // }
            let tMvValue: Number = 0;
            let MVResult: any;
            if (Details?.ExtentList) {
                let ext: any;
                let servNo: any;
                Details.conveyedExtent = [];
                Details.tExtent = "";
                let units = Details.propertyType.includes("RURAL") === true ? 'A' : 'Y';
                let prohibited:any=false,prohibitedSurveyNo:any=""
                for (let ex of Details.ExtentList) {
                    if (Details.mode === "add") {
                        ext = ex.conveyedExtentAcers + "." + ex.conveyedExtentCents;
                        servNo = ex.survayNo;
                        Details.lpmNo=ex.lpmNo;
                         
                    } else if (Details.mode === "edit") {
                        ext = ex.conveyedExtentAcers + "." + ex.conveyedExtentCents;
                        servNo = ex.survayNo;
                        Details.lpmNo=ex.lpmNo;
                       
                    }
                    const conveyedExt: any = {};
                    conveyedExt.extent = `${ex.conveyedExtentAcers}.${ex.conveyedExtentCents}`;
                    if (Details.tExtent === "") {
                        Details.tExtent = parseFloat(conveyedExt.extent);
                    } else {
                        Details.tExtent = parseFloat(Details.tExtent) + parseFloat(conveyedExt.extent);
                    }
                    Details.tExtent = parseFloat(Details.tExtent);
                    if(ex.isProhibited == true){
                        prohibited = true;
                        prohibitedSurveyNo=ex.survayNo;
                    }
                    conveyedExt.unit = units;
                    conveyedExt.srvyNo = ex.survayNo;
                    if(ApplicationDetails?.documentNature?.TRAN_MAJ_CODE === "07" && leaseData.lPeriod <= 30 ){
                        MVResult ={
                            marketValue : Number(leasegranTotal) / Number(leaseData.lPeriod) + Number(leaseData.advance) + Number(leaseData.muncipalTax)
                        }
                    }else{
                        MVResult = await MVCalculator(ext, servNo);
                        if(MVResult==false){
                            return false;
                        }
                    }
                    
                    // if(tMvValue == 0){
                    // 	tMvValue = MVResult.marketValue;
                    // }else{
                    // 	tMvValue = Number(tMvValue) + Number(MVResult.marketValue);
                    // }
                    if(ApplicationDetails?.documentNature?.TRAN_MAJ_CODE =="01" && ApplicationDetails?.documentNature?.TRAN_MIN_CODE =="26" && PropertyDetails.conveyanceType.split("(")[0] ==="Both"){
                        conveyedExt.mvValue = MVResult.marketValue ? Number(MVResult.marketValue) + Number(PropertyDetails?.conveyanceValue): 0;
                    }else{
                        conveyedExt.mvValue = MVResult.marketValue ? MVResult.marketValue : 0;
                    }
                    
                    Details.conveyedExtent = [...Details.conveyedExtent, conveyedExt];
                }
                // Details.ExtentList.map(async(ex:any)=>{
                // 	if(Details.mode ==="add"){
                // 		ext = ex.conveyedExtentAcers + "." + ex.conveyedExtentCents;
                // 		servNo=ex.survayNo;
                // 	}
                // 	const conveyedExt: any = {};
                // 	conveyedExt.extent = `${ex.conveyedExtentAcers}.${ex.conveyedExtentCents}`;
                // 	if (Details.tExtent === "") {
                // 		Details.tExtent = parseFloat(conveyedExt.extent);
                // 	} else {
                // 		Details.tExtent = parseFloat(Details.tExtent) + parseFloat(conveyedExt.extent);
                // 	}
                // 	conveyedExt.unit = units;
                // 	conveyedExt.srvyNo = ex.survayNo;
                // 	MVResult = await MVCalculator(ext,servNo);
                // 	// if(tMvValue == 0){
                // 	// 	tMvValue = MVResult.marketValue;
                // 	// }else{
                // 	// 	tMvValue = Number(tMvValue) + Number(MVResult.marketValue);
                // 	// }

                // 	conveyedExt.mvValue = MVResult.marketValue ? MVResult.marketValue : 0;
                // 	Details.conveyedExtent = [...Details.conveyedExtent, conveyedExt];

                // })
                // Details.isPropProhibited = prohibited === true ? true : false;
                if(ApplicationDetails?.documentNature?.TRAN_MAJ_CODE =="07"){
                    Details ={...Details,leaseDetails:ApplicationDetails.leasePropertyDetails}
                }
                let ob1: any;
                if (Details && Details.localBodyType && String(Details.localBodyType).length === 1) {
                    ob1 = localBodyTypeList.filter(ob => ob.code == Details.localBodyType)[0];
                } else {
                    ob1 = localBodyTypeList.filter(ob => "0" + '' + ob.code == Details.localBodyType)[0];
                }

                Details.localBodyType = ob1?.type;
                Details.localBodyCode = ob1?.code;
                Details.isPropProhibited =prohibited ;
                Details.ext_Rate =MVResult.ext_Rate;
                Details.isPrProhibitedSurveyNO = prohibitedSurveyNo ;
                Details.survayNo = AllSurvayNumberAdder(Details.conveyedExtent);
                Details.marketValue = AllMVAdder(Details.conveyedExtent);
                Details.isLinkedDocDetails = false;
                ApiCall(Details);
                // if(Details.conveyedExtent && Details.conveyedExtent.length >0){
                // 	let amount =0;
                // 	for(let i in Details.conveyedExtent){
                // 		if(amount ===0){
                // 			amount =Details.conveyedExtent[i].mvValue
                // 		}else{
                // 			amount = amount +Details.conveyedExtent[i].mvValue
                // 		}
                // 	}
                // 	Details.marketValue = amount;
                // 	Details.applicationId = ApplicationDetails.applicationId;
                // 	dispatch(SavePropertyDetails(Details));

                // 	let result:any; 
                // 	if(Details.mode ==="edit"){
                // 		result=await CallingAxios(UseUpdateProperty(Details));
                // 	}else{
                // 		result=await CallingAxios(UseAddProperty(Details));
                // 	}
                // 	if (result.status) {
                // 		ShowMessagePopup(true, "Property Added Successfully with MarketValue:" + Details.marketValue + ".", "/PartiesDetailsPage")
                // 	}
                // 	else {
                // 		ShowMessagePopup(false, result.message, "");
                // 	}
                // }

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

    const AllMVAdder = (data: any) => {
        let total = 0;
        data.map(x => {
            total = total + (Number(data?.mvValue) ? Number(data?.mvValue) : 0)
        })
        return total;
    }
    const ApiCall = async (data: any) => {
        data.applicationId = ApplicationDetails.applicationId;
        if (data && data.villageCode && data.villageCode.length === 6) {
            data.villageCode = "0" + data.villageCode;
        }
        if (data && String(data.localBodyCode) && String(data.localBodyCode).length === 1) {
            data.localBodyCode = "0" + String(data.localBodyCode);
        }
        if (data && String(data.landUseCode) && String(data.landUseCode).length === 1) {
            data.landUseCode = "0" + String(data.landUseCode);
        }
        if(ApplicationDetails?.documentNature?.TRAN_MAJ_CODE === "07" && ApplicationDetails?.leasePropertyDetails?.lPeriod <= 30){
            data.marketValue = ApplicationDetails?.documentNature?.TRAN_MIN_CODE === "06" ? 0 : TotalMarketValueCalculator(ApplicationDetails);
        }else{
            let tempMVValue = 0
            if(!(ApplicationDetails?.documentNature?.TRAN_MAJ_CODE === "07" && ApplicationDetails?.documentNature?.TRAN_MIN_CODE === "06")){
                for (let i of data.conveyedExtent) {
                    tempMVValue = tempMVValue + i.mvValue;
                }
            }
            data.marketValue = tempMVValue;
        }
        dispatch(SavePropertyDetails(data));

        let result: any;
        if (data.mode === "edit") {
            result = await CallingAxios(UseUpdateProperty(data));
        } else {
            result = await CallingAxios(UseAddProperty(data));
        }
        if (result.status) {
            ShowMessagePopup(true, `Property ${data.mode === "edit" ? "updated" : "added"} successfully with MarketValue: ${data.marketValue}` + ".", "/PartiesDetailsPage", 5000)
        }
        else {
            ShowMessagePopup(false, result.message, "")
        }
    }

    const LinkDocData = () => {
		
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
        if(CRDAnature)
    {
        if(PropertyDetails.survayNo == '' && (lpmValue == 0 || CRDAnature)){
            ShowAlert(false, "Please enter surveyNumber");
            return;
          }
         if(PropertyDetails.lpmNo == '' && lpmValue != 0){
            ShowAlert(false, "Please enter LPM Number");
            return; 
        }
    }
    if(LoginDetails?.loginEmail === 'APIIC' && PropertyDetails.lpmNo == undefined){
        ShowAlert(false, "Please enter LPM Number");
         return; 
    }
        if((WeblandDetails.conveyedExtentAcers == '' || WeblandDetails.conveyedExtentCents == '') || (PropertyDetails.survayNo == '' && !PropertyDetails?.lpmNo)){
            ShowAlert(false, "Please enter conveyed extent");
            return;
        }
        let multiSurveyNotExempt:any =ApplicationDetails.documentNature.TRAN_MAJ_CODE === '01' && ApplicationDetails.documentNature.TRAN_MIN_CODE === '25'|| ApplicationDetails.documentNature.TRAN_MAJ_CODE === '06' && ApplicationDetails.documentNature.TRAN_MIN_CODE === '02' || ApplicationDetails.documentNature.TRAN_MAJ_CODE == '08' || ApplicationDetails.documentNature.TRAN_MAJ_CODE == '04' || ApplicationDetails.documentNature.TRAN_MAJ_CODE == '05' && ApplicationDetails.documentNature.TRAN_MIN_CODE == '05' || ApplicationDetails.documentNature.TRAN_MAJ_CODE == '05' && ApplicationDetails.documentNature.TRAN_MIN_CODE == '09' ? false :true;
        if( LoginDetails?.loginEmail === 'APIIC' && PropertyDetails.ExtentList.length){
            ShowAlert(false, "Only one property can be added per schedule"); 
            return; 
        }
        if(PropertyDetails.ExtentList.length &&  multiSurveyNotExempt == true){
            ShowAlert(false, "Only one property can be added per schedule");
        } else if(PropertyDetails.survayNo != WeblandDetails.sryNo && !ShareRls){
            ShowAlert(false, "Selected webland Survey Number and given survey Number should be Same");
        }
        else {
        let myWeblandDetails = [];
        if (PropertyDetails && PropertyDetails.ExtentList && !ShareRls) {
            myWeblandDetails = [...PropertyDetails.ExtentList];
        }

        if (WeblandDetails.conveyedExtentCents.length === 1) {
            WeblandDetails.conveyedExtentCents = WeblandDetails.conveyedExtentCents + '0';
        }
       
        
        if (WeblandDetails.totalExtentAcers != "" && WeblandDetails.totalExtentCents != ""
            && WeblandDetails.conveyedExtentAcers != "" && WeblandDetails.conveyedExtentCents != "") {

            let ttlExAcers: any = WeblandDetails.totalExtentAcers;
            let ttlExCents: any = WeblandDetails.totalExtentCents;
            let conExAcers: any = WeblandDetails.conveyedExtentAcers;
            let conExCents: any = WeblandDetails.conveyedExtentCents;

            let totValue = '' + ttlExAcers + '.' + ttlExCents;
            let totConValue = '' + conExAcers + '.' + conExCents;
            let flag = 0;

            if (Number(totValue) >= Number(totConValue)) {
                if (PropertyDetails && PropertyDetails.ExtentList) {
                    PropertyDetails.ExtentList.map((propData, index) => {
                        if (propData.khataNumber == WeblandDetails.khataNumber && `${propData.survayNo}` == `${WeblandDetails.sryNo}`) {

                            conExAcers = parseInt(conExAcers) + parseInt(propData.conveyedExtentAcers);
                            conExCents = Number('.' + conExCents) + Number('.' + propData.conveyedExtentCents);
                            const newTotal = conExAcers + conExCents;
                            if (newTotal > Number(totValue)) {
                                ShowMessagePopup(false, "Conveyed extent value should be less than or equal to the Total extent value", "");
                                flag = 1;
                            } else {
                                myWeblandDetails[index].conveyedExtentAcers = `${newTotal}`.includes('.') ? `${newTotal}`.split('.')[0] : `${newTotal}`;
                                myWeblandDetails[index].conveyedExtentCents = `${newTotal}`.includes('.') ? `${newTotal}`.split('.')[1] : `00`;
                                flag = 2;
                            }
                        }
                    });
                }

                if (flag === 0) {
                    let EditWeblandDetails = { ...WeblandDetails, survayNo: PropertyDetails.survayNo }
                    if(PropertyDetails.lpmNo && PropertyDetails.lpmNo.length > 0 && PropertyDetails.lpmNo !="0" )
                        EditWeblandDetails["lpmNo"]=PropertyDetails.lpmNo;
                    myWeblandDetails.push(EditWeblandDetails);
                }
                setWeblandDetails({ totalExtentAcers: "", totalExtentCents: "", conveyedExtentAcers: "", conveyedExtentCents: "", khataNumber: "", sryNo: "" ,isProhibited:""});
                setPropertyDetails({ ...PropertyDetails, ExtentList: myWeblandDetails })
            } else {
                ShowMessagePopup(false, "Conveyed extent value should be less than or equal to the Total extent value [పరిధి విలువ మొత్తం పరిధి విలువ కంటే తక్కువగా లేదా సమానంగా ఉండాలి అని తెలియజేయబడినది]", "");
            }

        }else if(ShareRls ==true){
            let exList:any=[]
            let Obj :any={
                totalExtentAcers : WeblandDetails.conveyedExtentAcers,
                totalExtentCents: WeblandDetails.conveyedExtentCents,
                conveyedExtentAcers:WeblandDetails.conveyedExtentAcers,
                conveyedExtentCents:WeblandDetails.conveyedExtentCents,
                survayNo:PropertyDetails.survayNo,
                lpmNo:PropertyDetails.lpmNo,
            }
            PropertyDetails.ExtentList =[...PropertyDetails.ExtentList,Obj]
            setPropertyDetails({ ...PropertyDetails});
            setAllowProceed(true);
        }
        else {
            ShowMessagePopup(false, "Please enter conveyed extent", "");
        }
        }
    }
    const DeleteItemLinkDocument = (sindex: number) => {
        let myLinkDocument = [...PropertyDetails.LinkedDocDetails];
        myLinkDocument.splice(sindex, 1);
        setPropertyDetails({ ...PropertyDetails, LinkedDocDetails: myLinkDocument })

    }

    const DeleteItemWebland = (sindex: number) => {
        let myWeblandDetails = [...PropertyDetails.ExtentList];
        myWeblandDetails.splice(sindex, 1);
        setPropertyDetails({ ...PropertyDetails, ExtentList: myWeblandDetails })

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
		// else if(addName == "sroOffice"){
		// 	setLinkDocument({ ...LinkDocument, [addName]: addValue });
		// 	// let sCode = SROOfficeList.find(e => e.name == addValue)
		// 	// LinkDocument ={...LinkDocument,sroCode: sCode.id,sroOffice:sCode.sroOffice}
		// 	// setLinkDocument({ ...LinkDocument, sroCode: sCode.id,sroOffice:sCode.sroOffice});
		// // }
		// setLinkDocument(LinkDocument)
    }

    const onChangeWebland = (e: any) => {
        let addName = e.target.name;
        let addValue = e.target.value;
        if(addName === "conveyedExtentAcers" || addName === "conveyedExtentCents"){
            const numericRegex = /^[0-9]*$/;    
            if (!numericRegex.test(addValue)) {
               ShowAlert(false, "Please enter only numeric values (no decimals).");
               return;
           }
             
        }
       
        setWeblandDetails({ ...WeblandDetails, [addName]: addValue });
    }
    const  onClickDocs = async (type: String) =>{
		if(type =="Y"){
            setPValue(true);
            setPpByPass(false);
            if(lpmValue === 0){
                CallingAxios(WeblandSearch());
            }else{
                let value:any = true;
                setWeblandDetails({...WeblandDetails,isProhibited:value});
                setPValue(false);
                setAllowProceed(true);
            }
        }else{
            setPValue(false)
			OnCancelAction();
            if(lpmValue >0){
                let value:any = false;
                setWeblandDetails({...WeblandDetails,isProhibited:value});
                setWeblanList({ message: '', data: [] })
            }
        }
	}
    const lpmPpcheck = async (data:any)=>{
        let inSurveyNos = data?.serveyNo?.split(",");
        let fRs:any=[];
        for(let i of inSurveyNos){
            data ={...data,serveyNo:i};
            let lpmPPCheck:any =await CallingAxios( UseGetPPCheck(data, "rural"));
            let ObValue:any =Object.values(lpmPPCheck.data[0]);
            fRs.push(ObValue[0])
        }
        return fRs;
    }
    const PPCheck = async (rowData?: any) => {
        let data: any;
        let vgCode = VILLCD != "" ? VILLCD : PropertyDetails.villageCode;
        let result:any;
        if (lpmValue === 0) {
            const ppVillageCode = PropertyDetails.habitationCode.slice(0, -2);
            data = {
                ward: null,
                block: null,
                sroCode: PropertyDetails.sroCode,
                serveyNo: PropertyDetails.survayNo,
                villageCode:ppVillageCode,
                proField: "A_SNO"
            }
            result = await CallingAxios(UseGetPPCheck(data, "rural"));
        } else {
            
            // setWeblandDetails({ totalExtentAcers: "", totalExtentCents: "", conveyedExtentAcers: "", conveyedExtentCents: "", khataNumber: "" })
            setPropertyDetails({ ...PropertyDetails, survayNo: rowData.survayNo})
            data = {
                ward: null,
                block: null,
                sroCode: PropertyDetails.sroCode,
                serveyNo: rowData.survayNo,
                villageCode: vgCode,
                proField: "A_SNO"
            }
            result = await lpmPpcheck(data);
        }
        
        if (result?.status && lpmValue === 0) {
            let data = result.data[0]
            for (let value of Object.values(data)) {
                // if(`${value}`.length < 4){
                    if (value != "NO") {
                         ShowMessagePopup(false, "The entered survey number is in prohibited property list", "");
                        // if (ApplicationDetails.registrationType.TRAN_MAJ_CODE == "02") {
                        //     setAllowProceed(true);
                        // }
                        // else {
                            setPpByPass(true)
                            setAllowProceed(false);
                        //}
                        if(lpmValue ===0)
                            setWeblanList({ message: '', data: [] })
                    }
                    else {
                        ShowMessagePopup(true, "Prohibited Property Check is clear for Registration", "");
                        // setAllowProceed(true);
                        if (lpmValue === 0) {
                            WeblandSearch();
                        }
                    }
                    if (lpmValue === 0) {
                        setWeblandDetails({ totalExtentAcers: "", totalExtentCents: "", conveyedExtentAcers: "", conveyedExtentCents: "", khataNumber: "", sryNo: "" ,isProhibited:""})
                    }
                    if(lpmValue >0 && PropertyDetails.operation=="edit"){
                        weblandData();
                    }
                    // setPropertyDetails({ ...PropertyDetails, ExtentList: [] })
               // }
            }
        }else if(lpmValue > 0){
            if(result.some(e =>e != "NO") == false){
                ShowMessagePopup(true, "Prohibited Property Check is clear for Registration", "");
                setAllowProceed(true);
            }else{
                ShowMessagePopup(false, "The entered survey number is in prohibited property list", "");
                        // if (ApplicationDetails.registrationType.TRAN_MAJ_CODE == "02") {
                        //     setAllowProceed(true);
                        // }
                        // else {
                setPpByPass(true)
                setAllowProceed(false);
            }
            if(lpmValue >0 && PropertyDetails.operation=="edit"){
                weblandData();
            }
        }
        else {
            ShowMessagePopup(false, result.message, "");
            setAllowProceed(false);
            // setPropertyDetails({ ...PropertyDetails, ExtentList: [] })

            setWeblandDetails({ totalExtentAcers: "", totalExtentCents: "", conveyedExtentAcers: "", conveyedExtentCents: "", khataNumber: "", sryNo: "" ,isProhibited:""})
            setWeblanList({ message: '', data: [] })
        }
    }


    const WeblandSearch = async () => {
        if (inputValue == "") {
            ShowAlert(false, "Please Enter The Capctha");
        } else {
            let captchaCheck: any = await checkCaptcha(inputValue);
            // window.alert(captchaCheck);

            if (captchaCheck === false) {
                ShowAlert(false, "Please Enter Valid Capctha");
                //   Captcha();
            } else {
                let data = lpmValue === 0 ? { vgcode: PropertyDetails.villageCode, sryno: PropertyDetails.survayNo } : { vgcode: PropertyDetails.villageCode, lpmNo: PropertyDetails.lpmNo }
                if (PropertyDetails.survayNo) {
                    CallingAxios(GetEcDeatials(PropertyDetails));
                }
                    let obj :any ={
                        habCode: PropertyDetails.habitationCode,
                        surveyNo:lpmValue === 0 ? PropertyDetails.survayNo : PropertyDetails.lpmNo
                    }
                    let resp:any =await UseVgforWebland(obj);
                    if(resp && resp.data && resp.data.length > 0){
                        data.vgcode = resp.data[0].WB;
                    }
                let result = await CallingAxios(UseGetWenlandSearch(data));
                const jointData={code:result.code,message:result.message,data:[]}
                const singleData={code:result.code,message:result.message,data:[]};
                PropertyDetails.ExtentList=[];
                if(typeof result === 'object' && !Array.isArray(result) && result.data && result.data.length){
                    result.data.map(w=>{
                        if(w.SingleJoint==='Joint'){
                            jointData.data.push(w)
                        }
                        else{
                            singleData.data.push(w)
                        }
                    })
                    if(jointData && jointData.data.length && jointData.data[0].SingleJoint === 'Joint'){
                        setJointAdangalData(jointData)
                        setJointData(true)
                    }
                }
                if (result.status) {
                    setAllowProceed(true);
                    result.data.map((details: any) => {
                        details.occupantExtent = parseFloat(details.occupantExtent) + "";
                        details.survayNo = lpmValue === 0 ? PropertyDetails.survayNo : details.survayNo;
                        if (lpmValue !== 0) {
                            let data: any = { habitationCode: PropertyDetails.habitationCode, survayNo: details.survayNo };
                            GetEcDeatials(data)
                        }
                    });
                    setWeblanList(singleData);

                }
                else {
					setTimeout(() => {
 					    ShowAlert(false, result.message?.message ? result.message.message : `The ${lpmValue === 0 ? 'Survey' : 'LPM'} number details are not available in the Web land` );
					}, 500);
					
                    setAllowProceed(false);
                    setWeblanList({ message: '', data: [] })
                }
                setWeblandDetails({ totalExtentAcers: "", totalExtentCents: "", conveyedExtentAcers: "", conveyedExtentCents: "", khataNumber: "", sryNo: "" ,isProhibited:""})

            }
            if(lpmValue ===0)
                setInputValue("");
        }
    }
	const GetEcDeatials =async (propertyData:any)=>{
		let data:any={habCode:propertyData.habitationCode,surveyNum:String(propertyData.survayNo).split(",")};
		let result:any;
		let fDetails:any=[];
		if(data && data.surveyNum && data.surveyNum.length >0){
			let linkDetails:any=[];
			data.surveyNum.map(async(sv)=>{
				if(sv && sv.includes("-")){
					sv=String(sv).replace(/-/g, "/");
				}
				let sData :any={habCode:propertyData.habitationCode,surveyNum:sv}
				result = await CallingAxios(UseGetECDetails(sData));
				if (result.status) {

					result.data.map(async(d:any)=>{
						let PropDetails :any = await CallingAxios(UseGetLinkDocDetails(d.SR_CODE,d.DOCT_NO,d.REG_YEAR));
						PropDetails.data.property.map((prop:any)=>{
						linkDetails = [...linkDetails,prop];
						})
						setEcDetails(linkDetails);
					})
				}
			})
		}
		
		// if (result.status) {
		// 	let linkDetails:any=[];
		// 	result.data.map(async(d:any)=>{
		// 		let PropDetails :any = await CallingAxios(UseGetLinkDocDetails(d.SR_CODE,d.DOCT_NO,d.REG_YEAR));
		// 		PropDetails.data.property.map((prop:any)=>{
		// 			linkDetails = [...linkDetails,prop];
		// 		})
		// 		setEcDetails(linkDetails);
		// 	})
			
        //     // setPropertyDetails({ ...PropertyDetails, survayNo: "" });
        // }

	}

    // let landExtent:any ;
    // if(PropertyDetails && PropertyDetails?.ExtentList[0]?.totalExtentAcers && PropertyDetails?.ExtentList[0]?.totalExtentCents){
    // 	landExtent = PropertyDetails?.ExtentList[0].totalExtentAcers + "." + PropertyDetails.ExtentList[0].totalExtentCents;
    // }else{
    // 	landExtent =""
    // }
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
        // landExt = PropertyDetails?.ExtentList[0].totalExtentAcers + "." + PropertyDetails.ExtentList[0].totalExtentCents,
    } else if (PropertyDetails && PropertyDetails.mode === "edit") {
        landExt = PropertyDetails.tExtent;
    }
    let lpmNos=null;
    let lpmnoList=PropertyDetails.ExtentList;
      if (lpmnoList && lpmnoList.length > 0) {
         lpmNos = lpmnoList[0].lpmNo;
       }
    const MVCalculator = async (landExt: any, srvNo: any) => {
        let srvyNum = PropertyDetails.lpmNo === "" || PropertyDetails.lpmNo === undefined ? srvNo : PropertyDetails.lpmNo;
        let vgCode = PropertyDetails.mode === "edit" ? VILLCD : PropertyDetails.VILLCD;
         let lpmdata=null;
         if(PropertyDetails.lpmNo){
            if(CRDAnature){
             lpmdata ={
               "villageCode": PropertyDetails.villageCode,                
               "lpmNo":lpmNos,     
            }
        }
        else{
             lpmdata ={
                "villageCode": PropertyDetails.villageCode,                
                 "lpmNo":PropertyDetails.lpmNo,  
            }
        }   
       let lpmbaseresult : any = await CallingAxios(lpmbasenumber(lpmdata)); 
       // if lpmbaseresult is empty then are we need to display error message or proceed further
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
            // locality: PropertyDetails.habitation,
            habitation: PropertyDetails.habitation,
            habCode: PropertyDetails.habitationCode,
            wno: null,
            bno: null,
            house_no: "",
            nearby_boundaries: "",
            surveyno: srvyNum,
            nature_use: MasterCodeIdentifier("landUse", PropertyDetails.landUse),
            land_extent: landExt,
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

    const TotalConveyedExtentCalculator = (type) => {
        let total = 0;
        if (type == "acers") {
            PropertyDetails.ExtentList && PropertyDetails.ExtentList.map(x => {
                total = total + Number(x.conveyedExtentAcers);
            })
        }
        else if (type == "cents") {
            PropertyDetails.ExtentList && PropertyDetails.ExtentList.map(x => {
                total = total + Number(x.conveyedExtentCents);
            })
        }
        return total;
    }
   
    const onClickJoint = async (type: String)=>{

        if(type == 'Y'){

            setJointData(false)
            
            setfindJointData(true)

            if(jointadangalData.data.length){
            if (lpmValue > 0) {
                PPCheck(jointadangalData)
            }
            setWeblanList({...WeblanList,data:[]})


            const webdata=jointadangalData.data[0]
            setSelectedWebLand(webdata)
            setWeblandDetails({
                ...WeblandDetails, totalExtentAcers: (parseInt(webdata.occupantExtent ? webdata.occupantExtent : 0)).toString(), totalExtentCents: `${webdata.occupantExtent}`.includes('.') ? webdata.occupantExtent.split('.')[1] : '0',
                khataNumber: webdata.occupantKhataNo, conveyedExtentCents: lpmValue ? (`${webdata.occupantExtent}`.includes('.') ? webdata.occupantExtent.split('.')[1] : '0') : '', conveyedExtentAcers: lpmValue ? (parseInt(webdata.occupantExtent ? webdata.occupantExtent : 0)).toString() : '', sryNo: webdata.survayNo,isProhibited:pValue
            })
        }
            

        }
        if(type =='N'){
            setJointData(false)
            setfindJointData(false)
            setWeblanList({...jointadangalData,data:[]})
            ShowAlert(false,`Without all pattadars present, can't move further`)
            
        }

    }

    const ValidSurvey = (value: any) => {
        if (value != "" && value =="0") {
                ShowMessagePopup(false, "Enter Valid SurveyNO", "");
                return false;
        }else{
            return true;
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
        setrentalRowData(rows);
        SetleasegranTotal(0)
    }
    const handleWebLandOptionSelection=(SingleData:any)=>{
            if (SingleData?.occupantKhataNo == 0) {
                setAllowProceed(false);
                setWeblandDetails({ totalExtentAcers: "", totalExtentCents: "", conveyedExtentAcers: "", conveyedExtentCents: "", khataNumber: "", sryNo: "",isProhibited:"" })
                return ShowMessagePopup(false, "Invalid Khata Number. Document cannot be processed.", "");        
            }
            setAllowProceed(true)
            if (lpmValue > 0) {
                PPCheck(SingleData)
            }
            if(SingleData.isAnyDispute && SingleData.isAnyDispute?.trim().toLowerCase() !== "no"){
                ShowAlert(false, `${SingleData.isAnyDispute}`) ;
                setAllowProceed(false)
            }
            setSelectedWebLand(SingleData);
            setWeblandDetails({
                ...WeblandDetails, totalExtentAcers: (parseInt(SingleData.occupantExtent ? SingleData.occupantExtent : 0)).toString(), totalExtentCents: `${SingleData.occupantExtent}`.includes('.') ? SingleData.occupantExtent.split('.')[1] : '0',
                khataNumber: SingleData.occupantKhataNo, conveyedExtentCents: lpmValue ? (`${SingleData.occupantExtent}`.includes('.') ? SingleData.occupantExtent.split('.')[1] : '0') : '', conveyedExtentAcers: lpmValue ? (parseInt(SingleData.occupantExtent ? SingleData.occupantExtent : 0)).toString() : '', sryNo: SingleData.survayNo,isProhibited:pValue
            })
        // if(SingleData.isAnyDispute != "No "){
        //     ShowAlert(false, `${SingleData.isAnyDispute}`) ;
        //     setWeblandDetails({ totalExtentAcers: "", totalExtentCents: "", conveyedExtentAcers: "", conveyedExtentCents: "", khataNumber: "", sryNo: "",isProhibited:"" })
        // }else{
            
        // }
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

    const searchSurvey = async (query: string) => {
        const res = await CallingAxios(
            UseGetSurveyNoList({ villageCode: PropertyDetails.villageCode, searchValue: query })
        );
        if (res.status && Array.isArray(res.data)) {
            return res.data.map((surveyNo: string) => ({
            label: surveyNo.trim(),
            value: surveyNo.trim(),
            }));
        } else {
            ShowMessagePopup(false, res.message, "");
            return [];
        }
    };

    const handleSurveySelect = (selected: any) => {
        setPropertyDetails({...PropertyDetails, survayNo: String(selected.value).trim()});
    };

    const showDisputeColumn = WeblanList.data.some(item => item.isAnyDispute && item.isAnyDispute !== "No" && item.isAnyDispute !== "0");

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
                                    <Col lg={10} md={12} xs={12} className='navItems'>
                                        <div className='tabContainer'>
                                            <div className='activeTabButton'>Get Started<div></div></div>
                                            <div className='activeTabButton'>Parties Details<div></div></div>
                                            <div className='activeTabButton'>Property Details<div></div></div>
                                            <div className='inactiveTabButton slotButton'>Slot Booking<div></div></div>
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
                                            <div className='activeTabButton'>{doctcondtion?'Auction Value(₹) ':'Consideration Value(₹)'} : {ApplicationDetails.amount ? ApplicationDetails.amount : "0"}<div></div></div>
                                            {GetstartedDetails?.documentNature && GetstartedDetails?.documentNature?.TRAN_MAJ_CODE === "08" && GetstartedDetails?.documentNature?.TRAN_MIN_CODE === "06" ?
                                            <div className='activeTabButton'>Total Payable(₹) : {Number(CalculatedDutyFee.sd_p) + Number(CalculatedDutyFee.td_p) + Number(CalculatedDutyFee.rf_p) + 0}</div> :
                                            <div className='activeTabButton'>Total Payable(₹) : {Number(CalculatedDutyFee.sd_p) + Number(CalculatedDutyFee.td_p) + Number(CalculatedDutyFee.rf_p) + userCharges}</div>
                                            }
                                            {/* <div className='activeTabButton'>Total Payable(₹) : {Number(CalculatedDutyFee.sd_p) + Number(CalculatedDutyFee.td_p) + Number(CalculatedDutyFee.rf_p) + userCharges}</div> */}
                                        </div>
                                    </Col>
                                </Row>}
                            </Container>
                        </div>

                        <div className={`mt-1 ${styles.PropertyDetailsmain} ${styles.PropertyDetailsPage}`}>
                            <Row className='ApplicationNum pt-5'>
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
                                                <p className={styles.HeaderText}>4 . Property Details (Rural) [ఆస్తి వివరాలు (గ్రామీణ)]</p>
                                            </div>
                                        </Col>
                                        <Col lg={6} md={6} xs={12}>
                                        </Col>
                                    </Row>
                                </div>
                                <form onSubmit={onSubmit} className={styles.AddExecutantInfo}>
                                   { ApplicationDetails?.documentNature?.TRAN_MAJ_CODE !="06" && <Row className="align-items-end">
                                        <Col lg={4} md={6} xs={12} className='mb-3'>
                                            <TableText label={doctcondtion?'Total Auction Value(₹) [మొత్తం వేలం విలువ] ':"Total Consideration Value(₹) [మొత్తం ప్రతిఫలం విలువ]"} required={true} LeftSpace={false} />
                                            <TableInputText type='number' placeholder='₹' required={true} disabled={true} name={'amount'} value={ApplicationDetails.amount} onChange={onChange} />
                                        </Col>
                                    </Row>}
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
                                                        <TableText label={"District"} required={true} LeftSpace={false} />
                                                        <TableDropdown required={true} options={DropdownOptions.DropdownOptionsList} name={''} onChange={onChange} />
                                                    </Col>
                                                    <Col lg={3} md={6} xs={12}>
                                                        <TableText label={"Mandal"} required={true} LeftSpace={false} />
                                                        <TableDropdown required={true} options={DropdownOptions.DropdownOptionsList} name={''} onChange={onChange} />
                                                    </Col>
                                                    <Col lg={3} md={6} xs={12}>
                                                        <TableText label={"Village"} required={true} LeftSpace={false} />
                                                        <TableDropdown required={true} options={DropdownOptions.DropdownOptionsList} name={''} onChange={onChange} />
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
                                        {/* <Col lg={6} md={6} xs={12} className='pb-2'>
                                            <TableText label={"Local Body Type [స్థానిక సంస్థ రకం]"} required={true} LeftSpace={false} />
                                            <TableInputText type='text' placeholder='' disabled={true} required={true} name={'localBodyType'} value={PropertyDetails.localBodyType} onChange={onChange} />
                                        </Col> */}
                                        <Col lg={6} md={6} xs={12}>
                                            <TableText label={"Jurisdiction Registration District [అధికార పరిధి రిజిస్ట్రేషన్ జిల్లా]"} required={true} LeftSpace={false} />
                                            <TableInputText type='text' required={true} placeholder='' disabled={true} name={'district'} value={PropertyDetails.district} onChange={onChange} />
                                            {/* <TableDropdownSRO required={true} options={DistrictList} name={"district"} value={PropertyDetails.district} onChange={onChange} /> */}
                                        </Col>
                                        <Col lg={6} md={6} xs={12}>
                                            <div className='Inputgap'>
                                                <TableText label='Mandal [మండలం]' required={true} LeftSpace={false} />
                                                <TableInputText type='text' required={true} placeholder='' disabled={true} name={'mandal'} value={PropertyDetails.mandal} onChange={onChange} />
                                                {/* <TableDropdownSRO required={true} options={MandalList} name={"mandal"} value={PropertyDetails.mandal} onChange={onChange} /> */}
                                            </div>
                                        </Col>
                                        <Col lg={6} md={6} xs={12} className='mt-2'>
                                            <div className='Inputgap'>
                                                <TableText label='Village [గ్రామం]' required={true} LeftSpace={false} />
                                                <TableInputText type='text' disabled={true} required={true} placeholder='' name={'village'} value={PropertyDetails.village} onChange={onChange} />
                                                {/* <TableDropdownSRO required={true} options={VillagefrMandalList} name={"villagefromMandals"} value={PropertyDetails.village} onChange={onChange} /> */}
                                            </div>
                                        </Col>
                                        <Col lg={6} md={6} xs={12} className='mt-2'>
                                            <TableText label={"Jurisdiction Sub-Registrar [అధికార పరిధి సబ్ రిజిస్ట్రార్ కార్యాలయం]"} required={true} LeftSpace={false} />
                                            <TableInputText type='text' required={true} placeholder='' disabled={true} name={'sroOffice'} value={PropertyDetails.sroOffice} onChange={onChange} />
                                            {/* <TableDropdownSRO required={true} options={SROOfficeList} name={"sroOffice"} value={PropertyDetails.sroOffice} onChange={onChange} /> */}
                                        </Col>
                                    </Row>
                                    {/* <Row>
                                        <Col lg={6} md={6} xs={12}>
                                            <TableText label={"Jurisdiction Sub-Registrar [అధికార పరిధి సబ్ రిజిస్ట్రార్ కార్యాలయం]"} required={true} LeftSpace={false} />
                                            <TableInputText type='text' required={true} placeholder='' disabled={true} name={'sroOffice'} value={PropertyDetails.sroOffice} onChange={onChange} /> */}
                                    {/* <TableDropdownSRO required={true} options={SROOfficeList} name={"sroOffice"} value={PropertyDetails.sroOffice} onChange={onChange} /> */}
                                    {/* </Col> */}
                                    {/* <Col lg={6} md={6} xs={12}>
                                            <TableText label={MuncipleKeyNameIdentifier(PropertyDetails.localBodyType)} required={true} LeftSpace={false} />
                                            <TableInputText disabled={true} type='text' placeholder='Enter Name' required={true} name={'localBodyName'} value={PropertyDetails.localBodyName} onChange={onChange} />
                                        </Col> */}
                                    {/* <Col lg={6} md={6} xs={12}>
                                            <TableText label={"Municipality Name"} required={true} LeftSpace={false} />
                                            <TableInputText type='text' placeholder='Enter Name' disabled={true} required={true} name={'localBodyName'} value={PropertyDetails.localBodyName} onChange={onChange} />
                                        </Col> */}
                                    {/* </Row> */}
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
                                    <Row className="">
                                        <p className={` ${styles.getTitle} ${styles.HeadingText}`}>Schedule of the property to be registered [రిజిస్ట్రేషన్ చేయవలసిన ఆస్తి యొక్క షెడ్యూల్]</p>
                                        <Col lg={3} md={6} xs={12}>
                                            <TableText label={"Village [గ్రామం]"} required={true} LeftSpace={false} />
                                            {/* {IsViewMode ? <TableInputText disabled={true} type='text' placeholder='0' required={false} name={'village'} value={PropertyDetails.village} onChange={onChange} />
                                                : <TableDropdown options={VillageList} required={true} name={'village'} value={PropertyDetails.village} onChange={onChange} />} */}
                                            <TableInputText disabled={true} type='text' placeholder='0' required={false} name={'village'} value={PropertyDetails.village} onChange={onChange} />
                                        </Col>
                                        <Col lg={3} md={6} xs={12}>
                                            <TableText label={"Habitation [నివాసం]"} required={true} LeftSpace={false} />
                                            {IsViewMode ? <TableInputText disabled={true} type='text' placeholder='0' required={false} name={'habitation'} value={PropertyDetails.habitation} onChange={onChange} />
                                                : <TableDropdown required={true} options={HabitationList} name={'habitation'} value={PropertyDetails.habitation} onChange={onChange} />}
                                        </Col>

                                        <Col lg={3} md={6} xs={12}>
                                            <TableText label={"Local Body Name [స్థానిక సంస్థ పేరు]"} required={true} LeftSpace={false} />
                                            {IsViewMode ? <TableInputText disabled={true} type='text' placeholder='0' required={false} name={'localBodyName'} value={PropertyDetails.localBodyName} onChange={onChange} />
                                                : <TableDropdown required={true} options={localBodyNameList} name={'localBodyName'} value={PropertyDetails.localBodyName} onChange={onChange} />}
                                        </Col>

                                        <Col lg={3} md={6} xs={12}>
                                            <TableText label={"Local Body Type [స్థానిక సంస్థ రకం]"} required={true} LeftSpace={false} />
                                            {IsViewMode ? <TableInputText disabled={true} type='text' placeholder='0' required={false} name={'localBodyType'} value={PropertyDetails.localBodyType} onChange={onChange} />
                                                : <TableDropdown required={true} options={localBodyTypeList} name={'localBodyType'} multi={true} value={PropertyDetails.localBodyType} onChange={onChange} />}
                                        </Col>

                                        {lpmValue === 0 ?  !CRDAnature ? 
                                        (
                                           <Col lg={3} md={6} xs={12} className='mt-2'>
                                                <TableText label={"Survey No. [సర్వే నెం.]"} required={true} LeftSpace={false} />
                                                 <SearchableDropdown
                                                    required={true}
                                                    name="survayNo"
                                                    value={PropertyDetails.survayNo}
                                                    fetchOptions={searchSurvey}
                                                    onChange={handleSurveySelect}
                                                />
                                            </Col>
                                            ):(
                                            <Col lg={3} md={6} xs={12} className='mt-2'>
                                                 <div className={styles.surveyInput}>                                                
                                                    <TableText label={"Survey No. [సర్వే నెం.]"} required={true} LeftSpace={false} />
                                                    <TableInputText disabled={IsViewMode} type='text' required={true} placeholder='' name={'survayNo'} value={PropertyDetails.survayNo} onBlurCapture={e => { e.preventDefault(); if (!ValidSurvey(e.target.value)) { setPropertyDetails({ ...PropertyDetails, survayNo: '' }) } }} onChange={onChange} />
                                            </div>
                                        </Col>
                                        ):(
                                           <> 
                                            <Col lg={3} md={6} xs={12} className='mt-2'>
                                                <TableText label={"LPM No. [నెం.]"} required={true} LeftSpace={false} />
                                                <TableInputText disabled={IsViewMode} type='text' required={true} placeholder='' name={'lpmNo'} value={PropertyDetails.lpmNo} onChange={onChange} />
                                            </Col>
                                          {(CRDAnature) && ( <Col lg={3} md={6} xs={12} className='mt-2'>
                                            <div className={styles.surveyInput}>                                                
                                                <TableText label={"Survey No. [సర్వే నెం.]"} required={true} LeftSpace={false} />
                                                <TableInputText disabled={IsViewMode} type='text' required={true} placeholder='' name={'survayNo'} value={PropertyDetails.survayNo} onBlurCapture={e => { e.preventDefault(); if (!ValidSurvey(e.target.value)) { setPropertyDetails({ ...PropertyDetails, survayNo: '' }) } }} onChange={onChange} />
                                            </div>
                                        </Col>
                                        )}
                                        </>
                                        )}
										<Col lg={4} md={6} xs={12} className='mt-2'>

										{(PropertyDetails.habitationCode && !IsViewMode && !ShareRls) ?
											<>
												{
													<Row className={`mt-4 ${styles.captchaCon}`}>
														<Col lg={4} md={6} xs={6}><Captcha /></Col>
														<Col lg={8} md={6} xs={6}>
															<div className='d-flex'>
																<input value={inputValue} className={styles.captchaInput} onPaste={(e)=> e.preventDefault()} onChange={(e) => { setInputValue(e.target.value); }} />
															</div>
														</Col>
													</Row>
												}
											</> : null}
										</Col>
										<Col lg={2} md={12} xs={12} className='text-end'></Col>
										{lpmValue === 0 ?
										<Col lg={3} md={12} xs={12} className='text-end'>
											{(PropertyDetails.habitationCode && !IsViewMode && !ShareRls) ? <Row>
												<Col lg={10} md={10} xs={6}>
												</Col>
												<Col lg={2} md={2} xs={6}>
													<button type='button' className={`${styles.YesBtn} ${styles.serchBtn}`} onClick={PPCheck}>Search</button>
												</Col>
											</Row> : null}
										</Col>
										:
										<Col lg={3} md={12} xs={12} className='text-end'>
											{(PropertyDetails.habitationCode && !IsViewMode  && !ShareRls) ? <Row>
												<Col lg={10} md={10} xs={6}>
												</Col>
												<Col lg={2} md={2} xs={6}>
													<button type='button' className={`${styles.YesBtn} ${styles.serchBtn}`} onClick={WeblandSearch}>Search</button>
												</Col>
											</Row> : null}
										</Col>
										}
                                           {JointData ?
                <div className={Popstyles.reportPopup}>
                    <div className={Popstyles.container}>
                        <div className={Popstyles.Messagebox}>
                            <div className={Popstyles.header}>
                                <div className={Popstyles.letHeader} >
                                    <p className={Popstyles.text}>Document</p>
                                </div>
                
                            </div>
                            <div style={{ paddingLeft: '1rem', paddingRight: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }} className={Popstyles.popupBox}>
                                {/* {PopupMemory.type ? */}
                                    <div className={Popstyles.SuccessImg}>
                                        {/* <Image alt='' width={60} height={60} className={Popstyles.sImage} src="/PDE/images/success-icon.png" /> */}
                                        <div className={Popstyles.docText}>
                                            The Entered Survey No is Belongs to Joint Patta!
                                        </div>
                                        <div className={Popstyles.docText}>
                                            If Joint patta All pattadars are mandatory, Are there all executants?
                                        </div>
                                        <div className='text-center d-flex'>
                                            <button className={Popstyles.yesBtn} onClick={()=>onClickJoint('Y')}>YES</button>
                                            <button className={Popstyles.noBtn} onClick={()=>onClickJoint('N')}>NO</button>
                                        </div>
                                    </div>
                                    {/* // <MdOutlineDoneOutline style={{ width: '50px', height: '50px', marginTop: '2rem', color: 'green', marginBottom: '1rem' }} /> */}
                                    {/* // <ImCross className={styles.crossIcon} />
                                } */}
                                <p className={Popstyles.message}></p>
                            </div>
                        </div>
                    </div>
                
                </div>:null
			    
            }
            
           
            
			    
        
                                        {jointadangalData.data.length && jointadangalData.data[0].SingleJoint === 'Joint' && findJointData ?
                                            <div>
                                                <div className={styles.divider}></div>
                                                <Row>
                                                    <p className={` ${styles.getTitle} ${styles.HeadingText}`}>{WeblanList.message} [గ్రామీణ పహాణీల జాబితా విజయవంతంగా పొందబడింది]</p>
                                                    <Col lg={12} md={12} xs={12}>
                                                        <Table striped bordered hover className='TableData ListData lpmTable PahaniDetails mt-0 mb-4'>
                                                            <thead>
                                                                <tr>
                                                                    <th className='principalamount'>Land Nature<span>[భూమి యొక్క స్వభావం]</span></th>
                                                                    <th>Total Extent<span>[మొత్తం విస్తీర్ణం]</span></th>
                                                                    <th>Cultivated<span>[సాగుచేసింది]</span></th>
                                                                    <th>Non Cultivated<span>[సాగుచేయనిది]</span></th>
                                                                    <th>Occupant Extent<span>[ఆక్రమిత పరిధి]</span></th>
                                                                    <th>Classification<span>[వర్గీకరణ]</span></th>
                                                                    <th>Water Resource<span>[జలవనరులు]</span></th>
                                                                    <th>Occupant Name<span>[నివాసి పేరు]</span></th>
                                                                    <th>Father Name<span>[తండ్రి పేరు]</span></th>
                                                                    <th>Survey No.<span>[సర్వే నెం.]</span></th>
                                                                    <th>Occupant Khata No.<span>[వారు ఖాటా నెం.]</span></th>
                                                                    {showDisputeColumn && (<th>Is Any Dispute</th>)}
                                                                    <th>Select Extent<span>[పరిధిని ఎంచుకోండి]</span></th>
                                                                </tr>
                                                            </thead>
                                                            {jointadangalData.data.filter(w => w.SingleJoint === 'Joint').map((SingleData, index) => {
                                                                

    
                                                                return (
                                                                    <tbody key={SingleData.occupantKhataNo}>
                                                                        <td>{SingleData.landNature}</td>
                                                                        <td>{SingleData.totalExtent}</td>
                                                                        <td>{SingleData.cultivated ? SingleData.cultivated :0}</td>
                                                                        <td>{SingleData.nonCultivated ? SingleData.nonCultivated :0}</td>
                                                                        <td>{SingleData.occupantExtent}</td>
                                                                        <td>{SingleData.classification}</td>
                                                                        <td>{SingleData.waterResource}</td>
                                                                        <td>{SingleData.occupantName}</td>
                                                                        <td>{SingleData.fatherName}</td>
                                                                        <td>{SingleData.survayNo}</td>
                                                                        <td>{SingleData.occupantKhataNo}</td>
                                                                        {showDisputeColumn && <td>{SingleData.isAnyDispute}</td>}
                                                                        <td><input style={{fontWeight:"bold"}} type="radio" defaultChecked disabled /></td>
                                                                        
                                                                    </tbody>
                                                                )
                                                            })}
                                                        </Table>
                                                    </Col>
                                                </Row>
                                            </div> : 
                                            WeblanList.data.length ?
                                            <div>
                                                <div className={styles.divider}></div>
                                                <Row>
                                                    <p className={` ${styles.getTitle} ${styles.HeadingText}`}>{WeblanList.message} [గ్రామీణ పహాణీల జాబితా విజయవంతంగా పొందబడింది]</p>
                                                    <Col lg={12} md={12} xs={12}>
                                                        <Table striped bordered hover className='TableData ListData PahaniDetails lpmTable mt-0 mb-4'>
                                                            <thead>
                                                                <tr>
                                                                    <th className='principalamount'>Land Nature<span>[భూమి యొక్క స్వభావం]</span></th>
                                                                    <th>Total Extent<span>[మొత్తం విస్తీర్ణం]</span></th>
                                                                    <th>Cultivated<span>[సాగుచేసింది]</span></th>
                                                                    <th>Non Cultivated<span>[సాగుచేయనిది]</span></th>
                                                                    <th>Occupant Extent<span>[ఆక్రమిత పరిధి]</span></th>
                                                                    <th>Classification<span>[వర్గీకరణ]</span></th>
                                                                    <th>Water Resource<span>[జలవనరులు]</span></th>
                                                                    <th>Occupant Name<span>[నివాసి పేరు]</span></th>
                                                                    <th>Father Name<span>[తండ్రి పేరు]</span></th>
                                                                    <th>Survey No.<span>[సర్వే నెం.]</span></th>
                                                                    <th>Occupant Khata No.<span>[వారు ఖాటా నెం.]</span></th>
                                                                     {showDisputeColumn && (<th>Is Any Dispute</th>)}
                                                                    <th>Select Extent<span>[పరిధిని ఎంచుకోండి]</span></th>
                                                                </tr>
                                                            </thead>
                                                            {WeblanList.data.map((SingleData, index) => {
                                                                return (
                                                                    <tbody key={SingleData.occupantKhataNo}>
                                                                        <td>{SingleData.landNature}</td>
                                                                        <td>{SingleData.totalExtent}</td>
                                                                        <td>{SingleData.cultivated ? SingleData.cultivated :0}</td>
                                                                        <td>{SingleData.nonCultivated  ? SingleData.nonCultivated: 0}</td>
                                                                        <td>{SingleData.occupantExtent}</td>
                                                                        <td>{SingleData.classification}</td>
                                                                        <td>{SingleData.waterResource}</td>
                                                                        <td>{SingleData.occupantName}</td>
                                                                        <td>{SingleData.fatherName}</td>
                                                                        <td className='survayInfo'>{SingleData.survayNo}</td>
                                                                        <td>{SingleData.occupantKhataNo}</td>
                                                                         {showDisputeColumn && <td>{SingleData.isAnyDispute}</td>}
                                                                        <td><input name='WeblandSelection' type='radio' onChange={() =>handleWebLandOptionSelection(SingleData)} /></td>
                                                                    </tbody>
                                                                )
                                                            })}
                                                        </Table>
                                                    </Col>
                                                </Row>
                                            </div>:null}
										{/* //new Functionality */}
										{ecDetails.length ?
                                            <div>
                                                <div className={styles.divider}></div>
                                                <Row>
                                                    <p className={` ${styles.getTitle} ${styles.HeadingText}`}>{"List Of Transactions"}</p>
                                                    <Col lg={12} md={12} xs={12}>
                                                        <Table striped bordered hover className='TableData ListData lpmTable PahaniDetails mt-0 mb-4'>
                                                            <thead>
                                                                <tr>
																	<th>S.No.<span>[క్రమ సంఖ్య]</span></th>
																	<th >Link Document No. / Year<span>[లింక్ పత్రం నెం. / సంవత్సరం]</span></th>
																	<th >Schedule No.<span>[షెడ్యూల్ నెం.]</span></th>
																	<th>Door No.<span>[డోర్ నెం.]</span></th>
																	<th>Village<span>[గ్రామం]</span></th>
																	<th>Habitation / Locality<span>[నివాసం / స్థానికత]</span></th>
																	<th>Plot / Flat No.<span>[ప్లాట్/ఫ్లాట్ నెం]</span></th>
																	<th>Survey No.<span>[సర్వే నెం]</span></th>
																	<th>Boundaries(N / S / E / W)<span>[సరిహద్దులు (ఉత్తరం/దక్షిణం/తూర్పు/పశ్చిమ)]</span></th>
                                                                </tr>
                                                            </thead>
                                                            {ecDetails.map((SingleData, index) => {
                                                                return (
																	<tr key={index}>
																		<td>{index+1}</td>
																		<td>{SingleData.DOCT_NO} / {SingleData.REG_YEAR}</td>
																		<td>{SingleData.SCHEDULE_NO}</td>
																		<td>{SingleData.HNO}</td>
																		<td>{SingleData.VILLAGE}</td>
																		<td>{SingleData.COLONY}</td>
																		<td>{SingleData.FLAT_NO}</td>
																		<td>{SingleData.SY1}</td>
																		<td>{SingleData.NORTH}/{SingleData.SOUTH}/{SingleData.EAST}/{SingleData.WEST}</td>
																	</tr>
                                                                )
                                                            })}
                                                        </Table>
                                                    </Col>
                                                </Row>
                                            </div> : null}
                                    </Row>
									{ecDetails.length ?<div>
										<Row className='mt-2'>
											<Col lg={5} md={5} xs={12}><p className={` ${styles.getTitle} ${styles.HeadingText} ${styles.exText}`}>Is Executants is same as Pattadhar ?</p></Col>
											<Col lg={3} md={3} xs={12}>
												<div className={`d-flex ${styles.yesNoContainer}`}>
													<div className='mx-4'>
														<label>
															<input type="checkbox" name='checkyes' checked={isYesCheck} onChange={onChange}/><span className={` ${styles.getTitle} ${styles.HeadingText} ${styles.chYesText}`}>YES</span>
														</label>
													</div>

													<label><input id="noCbCheck" type="checkbox" name='checkNo' checked={isNoCheck} onChange={onChange}/><span className={` ${styles.getTitle} ${styles.HeadingText} ${styles.chNoText}`}>NO</span>
													</label>
												</div>
											</Col>
										</Row>
										<Row className='mt-2'>
											<Col lg={5} md={5} xs={12}><p className={` ${styles.getTitle} ${styles.HeadingText} ${styles.exText}`}>Is the last claimant in the EC is the present Executant ?</p></Col>
											<Col lg={3} md={3} xs={12}>
												<div className={`d-flex ${styles.yesNoContainer}`}>
													<div className='mx-4'>
														<label>
															<input type="checkbox" name='yesExPresent' checked={isYesPresentCheck} onChange={onChange}/><span className={` ${styles.getTitle} ${styles.HeadingText} ${styles.chYesText}`}>YES</span>
														</label>
													</div>

													<label><input id="noCbCheck" type="checkbox" name='noExPresent' checked={isNoPresentCheck} onChange={onChange}/><span className={` ${styles.getTitle} ${styles.HeadingText} ${styles.chNoText}`}>NO</span>
													</label>
												</div>
											</Col>
											<div className={styles.divider}></div>
										</Row></div>:null}
										
										{PropertyDetails.mode === "view" ?<div>
											<Row className='mt-2'>
											<Col lg={5} md={5} xs={12}><p className={` ${styles.getTitle} ${styles.HeadingText} ${styles.exText}`}>Is Executants is same as Pattadhar ?</p></Col>
											<Col lg={3} md={3} xs={12}>
												<div className={`d-flex ${styles.yesNoContainer}`}>
													<p className={` ${styles.getTitle} ${styles.HeadingText}  ${PropertyDetails.isExAsPattadhar === "YES"?styles.chYesText: styles.chNoText}`}>{PropertyDetails.isExAsPattadhar}</p>
													{/* <div className='mx-4'>
														<label>
															<input type="checkbox" disabled={IsViewMode} name='checkyes' checked={isYesCheck} onChange={onChange}/><span className={` ${styles.getTitle} ${styles.HeadingText} ${styles.chYesText}`}>YES</span>
														</label>
													</div>

													<label><input id="noCbCheck" disabled={IsViewMode} type="checkbox" name='checkNo' checked={isNoCheck} onChange={onChange}/><span className={` ${styles.getTitle} ${styles.HeadingText} ${styles.chNoText}`}>NO</span>
													</label> */}
												</div>
											</Col>
											</Row>
											<Row className='mt-2'>
												<Col lg={5} md={5} xs={12}><p className={` ${styles.getTitle} ${styles.HeadingText} ${styles.exText}`}>Is the last claimant in the EC is the present Executant ?</p></Col>
												<Col lg={3} md={3} xs={12}>
													<div className={`d-flex ${styles.yesNoContainer}`}>
													<p className={` ${styles.getTitle} ${styles.HeadingText}  ${PropertyDetails.ispresentExcutent === "YES"?styles.chYesText: styles.chNoText}`}>{PropertyDetails.ispresentExcutent}</p>
														{/* <div className='mx-4'>
															<label>
																<input type="checkbox" name='yesExPresent' checked={isYesPresentCheck} onChange={onChange}/><span className={` ${styles.getTitle} ${styles.HeadingText} ${styles.chYesText}`}>YES</span>
															</label>
														</div>

														<label><input id="noCbCheck" type="checkbox" name='noExPresent' checked={isNoPresentCheck} onChange={onChange}/><span className={` ${styles.getTitle} ${styles.HeadingText} ${styles.chNoText}`}>NO</span>
														</label> */}
													</div>
												</Col>
											</Row></div>:null}
                                    {(WeblanList.data.filter(w => w.SingleJoint === 'Single').length) || (jointadangalData.data.filter(w => w.SingleJoint === 'Joint').length) ?
                                        <Row className="mb-0">
                                            <Col lg={6} md={12} xs={12}>
                                                <Col lg={12} md={12} xs={12}>
                                                    <h6>Total Extent [మొత్తం విస్తీర్ణం]</h6>
                                                </Col>
                                                <Row>
                                                    <Col lg={3} md={12} xs={12}>
                                                        <TableText label={"Acres [ఎకరాలు]"} required={true} LeftSpace={false} />
                                                        <TableInputText type='number' disabled={true} required={true} placeholder='' name={'totalExtentAcers'} value={WeblandDetails.totalExtentAcers} />
                                                    </Col>

                                                    <Col lg={3} md={12} xs={12}>
                                                        <TableText label={"Cents [సెంట్లు]"} required={true} LeftSpace={false} />
                                                        <TableInputText type='number' disabled={true} required={true} placeholder='' name={'totalExtentCents'} value={WeblandDetails.totalExtentCents} />
                                                    </Col>
                                                    <Col lg={8} md={12} xs={12}></Col>
                                                </Row>
                                            </Col>
                                            <Col lg={6} md={12} xs={12}>
                                                <Col lg={12} md={12} xs={12}>
                                                    <h6>Conveyed Extent [బదిలీ చేసిన విస్తీర్ణం]</h6>
                                                </Col>
                                                <Row>
                                                    <Col lg={3} md={12} xs={12}>
                                                        <TableText label={"Acres [ఎకరాలు]"} required={false} LeftSpace={false} />
                                                        <TableInputText disabled={IsViewMode || !!lpmValue} type='number' required={false} placeholder='' name={'conveyedExtentAcers'} value={WeblandDetails.conveyedExtentAcers} onBlurCapture={onAcresBlur} onChange={onChangeWebland} />
                                                    </Col>
                                                    <Col lg={3} md={12} xs={12}>
                                                        <TableText label={"Cents [సెంట్లు]"} required={false} LeftSpace={false} />
                                                        <TableInputText disabled={IsViewMode || !!lpmValue} type='number' required={false} placeholder='' name={'conveyedExtentCents'} value={WeblandDetails.conveyedExtentCents} onBlurCapture={onCentsBlur} onChange={onChangeWebland} />
                                                    </Col>
                                                    <Col lg={4} md={12} xs={12}></Col>
                                                    {IsViewMode ? <div style={{ margin: '20px' }}></div> : <Col lg={2} md={12} xs={12}>
                                                        <button type='button' onClick={weblandData} className={`${styles.YesBtn} ${styles.AddyesBtn}`}>Add</button>
                                                    </Col>}
                                                </Row>
                                            </Col>
                                        </Row> : null}
                                    {
                                        ShareRls &&
                                        <Row className="mb-0">
                                            <div className={styles.divider}></div>
                                            
                                            <Col>
                                                <Col lg={12} md={12} xs={12}>
                                                    <h6>Conveyed Extent [బదిలీ చేసిన విస్తీర్ణం]</h6>
                                                </Col>
                                                <Row>
                                                    <Col lg={3} md={12} xs={12}>
                                                        <TableText label={"Acres [ఎకరాలు]"} required={false} LeftSpace={false} />
                                                        <TableInputText disabled={IsViewMode } type='number' required={false} placeholder='' name={'conveyedExtentAcers'} value={WeblandDetails.conveyedExtentAcers} onBlurCapture={onAcresBlur} onChange={onChangeWebland} />
                                                    </Col>
                                                    <Col lg={3} md={12} xs={12}>
                                                        <TableText label={"Cents [సెంట్లు]"} required={false} LeftSpace={false} />
                                                        <TableInputText disabled={IsViewMode } type='number' required={false} placeholder='' name={'conveyedExtentCents'} value={WeblandDetails.conveyedExtentCents} onBlurCapture={onCentsBlur} onChange={onChangeWebland} />
                                                    </Col>
                                                    <Col lg={4} md={12} xs={12}></Col>
                                                    {IsViewMode ? <div style={{ margin: '20px' }}></div> : <Col lg={2} md={12} xs={12}>
                                                        <button type='button' onClick={weblandData} className={`${styles.YesBtn} ${styles.AddyesBtn}`}>Add</button>
                                                    </Col>}
                                                </Row>
                                            </Col>
                                        </Row>
                                    }
                                    
                                    <Row>
                                        {PropertyDetails.ExtentList && PropertyDetails.ExtentList.length ?
                                            <Table striped bordered hover className='TableData lpmTable ListData mt-2'>
                                                <thead>
                                                    <tr>
                                                        {!CRDAnature && (
                                                         <th className="boundaries">Survey No.<span>[సర్వే నెం.]</span></th>
                                                        )}
                                                        {CRDAnature && (
                                                        <>{validLpmNumbervalue && (<th className='boundaries'>LPM NO<span>[lPM NO.]</span></th> )}
                                                          {validsurveyNumberValue && (<th className='boundaries'>Survey No.<span>[సర్వే నెం.]</span></th> )}
                                                        </>
                                                        )}
                                                        {/* <th>Total Extent<span>[మొత్తం విస్తీర్ణం]</span></th> */}
                                                        <th>Conveyed Extent<span>[విస్తరించిన పరిధి]</span> </th>
                                                        <th>Unit<span>[యూనిట్‌]</span></th>
                                                        {/* <th>Khata No<span>[చర్య]</span></th> */}
                                                        <th>Action<span>[చర్య]</span></th>

                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {PropertyDetails.ExtentList.map((x, index) => {
                                                        return (<tr key={index}>
                                                            {!CRDAnature && ( <td>{ShareRls ? x.survayNo : x.sryNo}</td>  )}
                                                             {CRDAnature && (<>{validLpmNumbervalue && <td>{x.lpmNo}</td>}
                                                            {validsurveyNumberValue &&<td>{ShareRls ? x.survayNo : x.sryNo }</td>}
                                                            </>
                                                             )}
                                                            <td>{x.conveyedExtentAcers}.{x.conveyedExtentCents}</td>
                                                            <td>Acres</td>
                                                            {/* <td>{x.khataNumber}</td> */}
                                                            {IsViewMode ? <td></td> : <td><Image alt="Image" height={20} width={20} src='/PDE/images/delete-icon.svg' onClick={() => DeleteItemWebland(index)} className={styles.tableactionImg} style={{ cursor: 'pointer' }} /></td>}
                                                        </tr>)
                                                    })}
                                                </tbody>
                                            </Table>
                                            : []}
                                    </Row>
                                    <Row>
                                        {(WeblanList.data && WeblanList.data.length > 0) || (jointadangalData.data && jointadangalData.data.length >0) &&
                                            <div>
                                                <p className={` ${styles.note}`}>NOTE :</p>
                                                <p className={` ${styles.note}`}>1. The clearance of the schedule of this property is subject to the verification of prohibited property by Sub-Registrar.</p>
                                                <p className={` ${styles.note}`}>2. Market value and Duty fees is Subject to verification of the Sub Registrar</p>
                                            </div>}
                                    </Row>
                                    <div className={styles.divider}></div>


                                    <Row className="mb-2">
                                        <p className={` ${styles.getTitle} ${styles.HeadingText}`}>Property Boundary Details [ఆస్తి హద్దుల వివరాలు]</p>
                                        <Col lg={3} md={6} xs={12}>
                                            <TableText label={"North Side  [ఉత్తరం వైపు]"}  required={true} LeftSpace={false} />
                                            <TableInputText disabled={IsViewMode} type='text' placeholder=''dot={true} splChar={true}  required={true} name={'northBoundry'} value={PropertyDetails.northBoundry} onChange={onChange} />
                                        </Col>
                                        <Col lg={3} md={6} xs={12}>
                                            <TableText label={"South Side [దక్షిణం వైపు]"} required={true} LeftSpace={false} />
                                            <TableInputText disabled={IsViewMode} type='text' placeholder=''dot={true} splChar={true}  required={true} name={'southBoundry'} value={PropertyDetails.southBoundry} onChange={onChange} />
                                        </Col>
                                        <Col lg={3} md={6} xs={12}>
                                            <TableText label={"East Side [తూర్పు వైపు]"} required={true} LeftSpace={false} />
                                            <TableInputText disabled={IsViewMode} type='text' placeholder=''dot={true} splChar={true}  required={true} name={'eastBoundry'} value={PropertyDetails.eastBoundry} onChange={onChange} />
                                        </Col>
                                        <Col lg={3} md={6} xs={12}>
                                            <TableText label={"West Side [పడమర వైపు]"} required={true} LeftSpace={false} />
                                            <TableInputText disabled={IsViewMode} type='text' placeholder=''dot={true} splChar={true}  required={true} name={'westBoundry'} value={PropertyDetails.westBoundry} onChange={onChange} />
                                        </Col>
                                    </Row>
									<div className={styles.divider}></div>
									{PropertyDetails.mode === "edit" || PropertyDetails.mode === "add"?
									<div>
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
												<TableText label={"District [జిల్లా]"} required={false} LeftSpace={false} />
												<TableDropdownSRO required={false} options={DistrictList} name={"district"} value={LinkDocument.district} onChange={onChangeLinkDoc} />
											</Col>
											<Col lg={4} md={12} xs={12}>
												<TableText label={"Sub Registrar Office [సబ్ రిజిస్ట్రార్ కార్యాలయం]"} required={false} LeftSpace={false} />
												<TableDropdownSRO required={false} options={SROOfficeList} name={"sroOffice"} value={LinkDocument.sroOffice} onChange={onChangeLinkDoc} />
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
                                                Object.keys(LinkDocument).filter(k => !['scheduleNo', 'sroCode'].includes(k) ).every(li => LinkDocument[li]) &&
											<Col lg={12} md={12} xs={12}>
												<div className={`${styles.ProceedContainer} ${styles.Linkbtn}`}>
													<button type="button" className='proceedButton' onClick={LinkDocData} >Add</button>
												</div>
											</Col>
                                            }
										</Row></>:  PropertyDetails.registeredState === "Registered In TS" ?<>
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
                                        </> :null}
									</div>:null}
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
                                    	</Row>
										: null
									}
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
            {ppbyPass && <Container>
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
                                        <div className={Popstyles.docText}>
                                            The Entered Survey No is Prohibited One!
                                        </div>
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
             {/* <pre>{JSON.stringify(PropertyDetails, null, 2)}</pre> */}
            {/*<pre>{JSON.stringify(WeblanList,null,2)}</pre> */}
            {/* <pre>{JSON.stringify(leaseData,null,2)}</pre>
            <pre>{JSON.stringify(PropertyDetails,null,2)}</pre> */}
            {/* <pre>{JSON.stringify(PropertyDetails, null, 2)}</pre> */}
            {/* <pre>{JSON.stringify(jointadangalData, null, 2)}</pre>
            { <pre>{JSON.stringify(ApplicationDetails,null,2)}</pre>  } */}
            
        </div>
    )
}

export default PropertyDetailsPage_B;


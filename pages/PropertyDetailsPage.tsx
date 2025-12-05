import React, { useState, useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap';
import styles from '../styles/pages/Mixins.module.scss';
import TableInputText from '../src/components/TableInputText';
import TableText from '../src/components/TableText';
import TableInputRadio from '../src/components/TableInputRadio';
import TableDropdown from '../src/components/TableDropdown';
// import TableSelectDate from '../src/components/TableSelectDate';
import { useRouter } from 'next/router';
import { useAppSelector, useAppDispatch } from '../src/redux/hooks';
import { getSroDetails, useGetDistrictList, useSROOfficeList, useGetMandalList, getApplicationDetails, useGetVillagelList, UseGetVgForPpAndMV, UseReportTelDownload, UseReportDownload, UseCrdaGetVillages ,UseGetProperty, getMutationEnabled, getSezJuriSRO} from '../src/axios';
import { SavePropertyDetails } from '../src/redux/formSlice';
import Image from 'next/image';
import TableDropdownSRO from '../src/components/TableDropdownSRO';
import moment from 'moment';
import{Multiselect} from 'multiselect-react-dropdown'
import { CallingAxios, DateFormator, KeepLoggedIn, MasterCodeIdentifier, MuncipleKeyNameIdentifier, ShowMessagePopup, ShowPreviewPopup } from '../src/GenericFunctions';
import Head from 'next/head';
import TableDropdownSRO2 from '../src/components/TableDropdownSRO2';
import { PopupAction } from '../src/redux/commonSlice';


const DropdownList = {
    LocalBodyTypesList: ['MUNICIPAL CORPORATION [మున్సిపల్ కార్పొరేషన్]', 'SPL./SELECTION GRADE MUNICIPALITY [స్పెషల్ సెలక్షన్ గ్రేడ్ మున్సిపాలిటీ]', 'OTHER MUNICIPALITY/NOTIFIED AREA [ఇతర మునిసిపాలిటీ / నోటిఫైడ్ ఏరియా]', 'MINOR GRAM PANCHAYAT [మైనర్ గ్రామ పంచాయతీ]',
        'MAJOR GRAM PANCHAYAT [మేజర్ గ్రామ పంచాయితీ]', 'Cantonment Board [కంటోన్మెంట్ బోర్డు]', 'GRADE/OTHER MUNICIPALITY UNDER UA [అర్బన్ అగ్లామరేషన్ లోని గ్రేడ్ 1 మున్సిపాలిటీ మరియు ఇతర మున్సిపాలిటీ]', 'MAJOR GRAM PANCHAYATH UNDER UA [అర్బన్ అగ్లామరేషన్ లోని మేజర్ గ్రామ పంచాయతీ]'],
    Typeofproperty: ['RURAL(AGRICULTURE) [గ్రామీణ (వ్యవసాయ భూమి)]', 'URBAN(PLOTS/HOUSE/FLATS..ETC) [పట్టణ (స్థలము/అపార్ట్ మెంట్/ఇల్లు)]'],
    LandUseList: [],
    Joints:["YES","NO"],
    ConveyanceProp:["Share"]
}


const PropertyDetailsPage = () => {
    const router = useRouter();
    const dispatch = useAppDispatch()
    const [checked, setChecked] = useState(false);
    let initialPropertyDetails = useAppSelector(state => state.form.PropertyDetails);
    let GetstartedDetails = useAppSelector(state => state.form.GetstartedDetails);

    const [PropertyDetails, setPropertyDetails] = useState<any>(initialPropertyDetails);
    const [DistrictList, setDistrictList] = useState([]);
    const [VillageList, setVillageList] = useState([]);
    const [MandalList, setMandalList] = useState([]);
    const [SROOfficeList, setSROOfficeList] = useState([]);
    const [distCode, setDistCode] = useState<any>("");
    const [ApplicationDetails, setApplicationDetails] = useState<any>({ regWith: "", applicationId: GetstartedDetails.applicationId, registrationType: { TRAN_MAJ_CODE: "", TRAN_MIN_CODE: "", TRAN_DESC: "", PARTY1: "", PARTY1_CODE: "", PARTY2: "", PARTY2_CODE: "" }, status: "ACTIVE", sroDetails: null, executent: [], claimant: [], property: [], payment: [], documentNature: { TRAN_DESC: "" }, MortagageDetails: [], giftRelation: [], presenter: [], amount: "", executionDate: "", stampPaperValue: "", stampPurchaseDate: "", docDownLoadedBy: "" });
 
    const [vswData, setVswData] = useState<any>({});
    const [VILLCD, setVILLCD] = useState('');
    const [AllowProceed, setAllowProceed] = useState(false)
    const [ExchangeParties, setExchangeParties] = useState<any>(["First Party","Second Party"]);
    const [crdaDocs,setCrdaDocs]=useState<any>(false);
    const [propData,setPropData] = useState<any>(false);
    const [multiDropValue,setMultiDropValue] =useState<any>([]);
    const [isMutationEnabled,setIsMutationEnbaled] = useState<boolean>(false);
    const ShowAlert = (type, message) => { dispatch(PopupAction({ enable: true, type: type, message: message, autoHide: false, hideCancelButton: false})); }
    const [loginDetails, setLoginDetails] = useState<any>({});

    useEffect(() => {
        if (KeepLoggedIn()) {
            let loginDeatils: any = localStorage.getItem("LoginDetails");
            if(loginDeatils!=null && loginDeatils!=undefined )
                {
                  let jsonData = JSON.parse(loginDeatils);
                  setLoginDetails(jsonData);
                }
               
            
            let data: any = localStorage.getItem("GetApplicationDetails");
            if (data == "" || data == undefined) {
                ShowMessagePopup(false, "Invalid Access", "/");
            }
            else {
                ShowAlert(
                  "info",
                  "It is submitted that, at present, both Flat and Apartment boundaries are being displayed in the Encumbrance Certificate (EC) for the same property schedule. Hence, there is no requirement to add multiple schedules for flat and apartment boundaries unless they pertain to a separate and distinct property.Further, it is informed that, if multiple schedules are added for the same flat property, it will adversely affect the Auto-Mutation process in the CARD 2.0 system."
                );
                setPropertyDetails({...PropertyDetails,district: "", village: "", villageCode: "", sroCode: "", sroOffice: "", mandal: "", mandalCode: "" ,propertyType:"",landUse:""})
                GetApplicationDetails();
                data = JSON.parse(data);
                setApplicationDetails(data)
                // if (data.regWith == "Vsws") {
                //     setPropertyDetails({ ...PropertyDetails, district: data.district, village: data.village, villageCode: data.villageCode, sroCode: data.sroCode, sroOffice: data.sroOffice, mandal: data.mandal, mandalCode: data.mandalCode });
                //     GetVgForPPandMv(data.villageCode);
                // }
                LandUseDesider(PropertyDetails.propertyType);
                
            }
            if(data.documentNature.TRAN_MAJ_CODE ==="04" && data.documentNature.TRAN_MIN_CODE ==="04"){
                DropdownList.Typeofproperty= ['RURAL(AGRICULTURE) [గ్రామీణ (వ్యవసాయ భూమి)]'];
            }else{
                    DropdownList.Typeofproperty= ['RURAL(AGRICULTURE) [గ్రామీణ (వ్యవసాయ భూమి)]', 'URBAN(PLOTS/HOUSE/FLATS..ETC) [పట్టణ (స్థలము/అపార్ట్ మెంట్/ఇల్లు)]'];
            }
            if(data.documentNature.TRAN_MAJ_CODE ==="01" && data.documentNature.TRAN_MIN_CODE ==="26"){
                setPropertyDetails({...PropertyDetails,conveyanceType:"Immovable(Properties)"})
            }
            if(data.documentNature.TRAN_MAJ_CODE ==="01" && data.documentNature.TRAN_MIN_CODE ==="25"){
                setCrdaDocs(true);
                GetPropData(data);
            }else if(data.documentNature.TRAN_MAJ_CODE ==="08" && data.documentNature.TRAN_MIN_CODE ==="05"){
                setCrdaDocs(true);
                GetPropData(data);
            }else if(data.documentNature.TRAN_MAJ_CODE ==="06" && data.documentNature.TRAN_MIN_CODE ==="02"){
                setCrdaDocs(true);
                GetPropData(data);
            }
            else{
                setCrdaDocs(false);
                if (DistrictList.length == 0) {
                    GetDistrictList()
                }
            }
        } else { ShowMessagePopup(false, "Invalid Access", "/"); }
    }, []);
    
    const GetPropData = async (data:any)=>{
        let getData:any = await UseGetProperty(data);
        if(getData.data && getData.data.length === 0){
            setPropData(true);
            GetCrdaVillageList();
        }else if(getData.data && getData.data.length > 0){
            setPropData(false);
            if (DistrictList.length == 0) {
                GetDistrictList()
            }
        }
    }
    const GetApplicationDetails = async () => {
        let data: any = localStorage.getItem("GetApplicationDetails");
        if (data == "" || data == undefined) {
            ShowMessagePopup(false, "Invalid Access", "/");
        }
        else {
            await CallGetApp(data);
        }
    }
    const CallGetApp = async (myData) => {
        let data = JSON.parse(myData);
        let result = await CallingAxios(getApplicationDetails(data.applicationId));
        if (result.status) {
            let receivedData = result.data;
            let vsData = { ...vswData, receivedData }
            setVswData(vsData)

        } else {
            // window.alert(result.message);
            ShowMessagePopup(false, "Featch Application Details Failed", "")
        }
    }
    const GetCrdaVillageList = async (id?:any) =>{
        let res :any = await  UseCrdaGetVillages(id);
        if(res.status == true){
            if(!id){
                let vglist:any=[];
                res.data.map((x:any)=>{vglist.push({id:x.villageCode,name:x.villageName})})
                setVillageList(vglist)
            }else{
                return res.data;
            }
        }else{
            ShowMessagePopup(false,res.data.message,"")
        }

    }

    const GetVgForPPandMv = async (vgCode: any) => {
        if (vgCode && vgCode.length === 6) {
            vgCode = '0' + vgCode;
        }
        let result = await CallingAxios(UseGetVgForPpAndMV("Sr", vgCode));
        setAllowProceed(true);
        if (result.status) {
            let data = result.data;

            if (data && data.length > 0 && data[0].VILLCD != "")
                // GetLpmCheck(data[0].VILLCD)}
                setVILLCD(data[0].VILLCD);
            // window.alert(data[0].VILLCD);
            // setPropertyDetails({...PropertyDetails,VILLCD:data[0].VILLCD})
        }
        else {
            return ShowMessagePopup(false, "Fetch vgCode list failed", "")
        }
    }

    const GetDistrictList = async () => {
        const districtListHook = useGetDistrictList();
        let result = await CallingAxios(isSez() ? getSezJuriSRO({}) : districtListHook);        
        //let result = await CallingAxios(isSez() ? getSezJuriSRO({}) : useGetDistrictList());
        if (result.status) {
            let sortedResult = result.data.sort((a, b) => a.name < b.name ? -1 : 1)
            setDistrictList(result.data ? sortedResult : []);
            if (PropertyDetails.district != "" && PropertyDetails.sroOffice != "") {
                let selected = result.data.find(e => e.name == PropertyDetails.district);
                if (selected && selected.id) {
                    GetSROOfficeList(selected.id);
                }
            }
        }
        else {
            ShowMessagePopup(false, result.message, "")
        }
    }
    const GetMandalList = async (id: any) => {
        const mandalListHook = useGetMandalList(id);
        let result = await CallingAxios(isSez() ? getSezJuriSRO({district:id}) : mandalListHook);
         //let result = await CallingAxios(isSez() ? getSezJuriSRO({district:id}) : useGetMandalList(id));
        if (result.status) {
            // console.log(result.data);
            // setDistrictList(result.data ? result.data : []);
            let sortedResult = result.data.sort((a, b) => a.name < b.name ? -1 : 1)
            setMandalList(sortedResult);
        }
        else {
            ShowMessagePopup(false, result.message, "")
        }
    }
    const GetVillageList = async (id: any, distcode: any) => {
        const villageListHook = useGetVillagelList(id, distcode);
        let result = await CallingAxios(isSez() ? getSezJuriSRO({district: distCode, mandal: id}) : villageListHook);         
        //let result = await CallingAxios(isSez() ? getSezJuriSRO({district: distCode, mandal: id}) : useGetVillagelList(id, distcode));
        if (result.status) {
            // setDistrictList(result.data ? result.data : []);
            let sortedResult = result.data.sort((a, b) => a.name < b.name ? -1 : 1)
            setVillageList(sortedResult);
        }
        else {
            ShowMessagePopup(false, result.message, "")
        }
    }
    const GetSROOfficeList = async (id: any) => {
        let result = await CallingAxios(isSez() ? getSezJuriSRO({village: id }) :getSroDetails(id));
        if (result.status) {
            let sortedResult = result.data.sort((a, b) => a.name < b.name ? -1 : 1)
            // setSROOfficeList(result.data);
            setSROOfficeList(sortedResult);
        }
    }

    const isSez = () =>{
        let data: any = JSON.parse(localStorage.getItem("GetApplicationDetails"));
        const allParties = [...data?.claimant || [], ...data?.executent || []]
        return allParties.some(party => party.partyType === "SEZ Representative")
    }

    const blockInvalidChar = e => {
        ['_', '+', '-', '.'].includes(e.key) && e.preventDefault();
    }
    //crda Change
    const onCrdaChange =async (event:any)=>{
        let TempDetails = { ...PropertyDetails };
        let TempGetstartedDetails: any = {};
        let addName = event.target.name;
        let addValue = event.target.value;
        if(addName =="village"){
            let selected:any =VillageList.filter((x:any)=>{return x.name === addValue});
            let otherData:any =await  GetCrdaVillageList(selected[0].id);
            GetVgForPPandMv(selected[0].id);
            TempDetails = {...TempDetails,villageCode:selected[0].id,distCode:otherData[0].registrationDistCode,district:otherData[0].registrationDistName,mandalCode:otherData[0].mandalCode,mandal:otherData[0].mandalName,sroCode: otherData[0].srCode, sroOffice:otherData[0].srName};
        }
        // window.alert(JSON.stringify(TempDetails))
        setPropertyDetails({ ...TempDetails, [addName]: addValue });
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


    const onChange = (event: any) => {
        let TempDetails = { ...PropertyDetails };
        let TempGetstartedDetails: any = {};
        let addName = event.target.name;
        let addValue = event.target.value;
        if (addName == "district") {
            // setSROOfficeList([]);
            setMandalList([]);
            setVillageList([]);
            setSROOfficeList([]);
            let selected = DistrictList.find(e => e.name == addValue);
            // console.log(selected);
            setDistCode(selected.id);
            if (selected)
                GetMandalList(selected.id);
            //GetSROOfficeList(selected.id);
        } else if (addName == "mandal") {
            setVillageList([]);
            let selected = MandalList.find(e => e.name == addValue);
            let mandalCode = selected ? selected.id : "";
            TempDetails = { ...TempDetails, mandalCode }
            // TempGetstartedDetails = { ...TempGetstartedDetails, mandalCode }
            if (selected)
                GetVillageList(selected.id, distCode);
        } else if (addName == "village") {
            setSROOfficeList([]);
            let selected = VillageList.find(e => e.name == addValue);
            let villageCode = selected ? selected.id : "";
            GetVgForPPandMv(villageCode);
            TempDetails = { ...TempDetails, villageCode }
            if (ApplicationDetails.documentNature.TRAN_MAJ_CODE === '04' && ApplicationDetails.documentNature.TRAN_MIN_CODE === '04' && String(ApplicationDetails.villageCode) !== selected.id) {                                     
                ShowMessagePopup(false, "You are not allowed to apply for anywhere registration.", "");
                addValue = ""; 
                TempDetails = { ...TempDetails, villageCode: "",}            
            }
            // TempGetstartedDetails = { ...TempGetstartedDetails, villageCode }
            if (selected)
                GetSROOfficeList(selected.id);
        }
        else if (addName == "stampPaperValue") {
            if (addValue.length > 4) {
                addValue = PropertyDetails.stampPaperValue;
            }
        } else if (addName == "localBodyName") {
            let errorLabel = ""
            if (String(addValue).length < 50) {
                errorLabel = "Enter 50 Digits Number";
            }
            if (addValue.length > 50) {
                addValue = addValue.substring(0, 50);
            }
        }else if(addName ==="jointOrNot"){
            TempDetails = { ...TempDetails, partyNumber: ""}
            if(addValue ==="YES" && ApplicationDetails.claimant && ApplicationDetails.claimant.length <=1){
                addValue="";
                 ShowAlert(false, "party Names should be more than one",);
            }
        }else if(addName ==="conveyanceType"){
            TempDetails = { ...TempDetails, landUse: "",propertyType:""}
        }
        else if (addName == 'propertyType') { 
            TempDetails = { ...TempDetails, landUse: ""}
            if(addValue=='URBAN(PLOTS/HOUSE/FLATS..ETC) [పట్టణ (స్థలము/అపార్ట్ మెంట్/ఇల్లు)]'){
                if(isMutationEnabled){
                    ShowAlert('info', 'Urban Auto Mutation facility enabled, Please quote your Property Tax Identification Number(PTIN) ')
                }
            }
            LandUseDesider(addValue); 
        }
        else if (addName == "sroOffice") {
            let sroCode = (SROOfficeList.find(x => x.name == addValue))?.id;
            checkMutationEnabled(sroCode)
            TempDetails = { ...TempDetails, sroCode }
            setTimeout(() => {
              if (isMutationEnabled) {
                if (
                  PropertyDetails.propertyType ===
                  "URBAN(PLOTS/HOUSE/FLATS..ETC) [పట్టణ (స్థలము/అపార్ట్ మెంట్/ఇల్లు)]"
                ) {
                    ShowAlert(
                    'info',
                    "Urban Auto Mutation facility enabled, Please quote your Property Tax Identification Number(PTIN) ",
                  );
                }
              }
            }, 3000);
        }
        else if (addName == "partyNumber") {
            const selectedClaimant = partiesFormattedOptions.find(
                (item) => item.label === addValue
            );
            addValue = selectedClaimant ? String(selectedClaimant.seqNumber) : "";
        }
        if (addName == 'localBodyName') {
            addValue = addValue.replace(/[^\w\s]/gi, "");
            addValue = addValue.replace(/[0-9]/gi, "");
        }
        if (addName == "landUse") {
            let landCode = MasterCodeIdentifier("landUse", addValue);
            TempDetails = { ...TempDetails, landUseCode: Number(landCode) }
        }
        setPropertyDetails({ ...TempDetails, [addName]: addValue });
    }

    const onSubmit = (e: any) => {
        e.preventDefault();
        let NewData = { ...PropertyDetails, VILLCD: VILLCD }
        dispatch(SavePropertyDetails(NewData));
        // window.alert(JSON.stringify(PropertyDetails.partyNumber))
        localStorage.setItem("PropertyDetails", JSON.stringify(NewData));
         
        if (loginDetails?.loginEmail === "APIIC") {

            if(String(ApplicationDetails.sroCode)!== PropertyDetails.sroCode ){
                return ShowAlert(false, "Registration SRO and jurisdiction SRO should be same",);
            }
        }
        if(PropertyDetails.jointOrNot ==="YES"  && ApplicationDetails.documentNature.TRAN_MAJ_CODE === "04"  && PropertyDetails.partyNumber.split(",").length === 1){
            return ShowAlert(false, "Party Names should be more than One",);
        }
        if(ApplicationDetails && ApplicationDetails.documentNature.TRAN_MAJ_CODE =="04" && PropertyDetails.partyNumber === undefined ){
            return ShowAlert(false, "Please Select the partyNumber",);
        }
        if (PropertyDetails?.propertyType?.toUpperCase()?.includes("RURAL") && PropertyDetails.landUseCode != "99") {
            redirectToPage('/PropertyDetailsPage_R');
        } else if(PropertyDetails?.propertyType?.toUpperCase()?.includes("URBAN") && PropertyDetails.landUseCode != "99"){
            if(isMutationEnabled && ApplicationDetails?.claimant?.length === 0 && ApplicationDetails?.executent?.length === 0){
                return ShowAlert(false, "Please Add At Least One Climant and Executent",);
            }
            redirectToPage('/PropertyDetailsPage_U');
        }
        else{
           redirectToPage('/PropertyDetails_Cash')
        }
    }

    const LandUseDesider = (key: any) => {
		if(ApplicationDetails.documentNature.TRAN_MAJ_CODE =="04"){
			switch (key) {
				case 'RURAL(AGRICULTURE) [గ్రామీణ (వ్యవసాయ భూమి)]': DropdownList.LandUseList = ["DRY LAND(A) [మెట్ట భూమి(A)]", "WET LAND DOUBLE CROP(A)[తడి భూమి రెట్టింపు క్రాప్ (ఎ)]", "GARDEN(A) [తోటలు(A)]", "AGRICULTURAL LAND FIT FOR H.S.(A) [నివేశ స్తలములకు తగినటువంటి వ్యవసాయ భూమి(A)]", "LAND ABUTTING NH/SH/ZPP/MPP(A) [NH / SH / ZPP / MPP ని కలిగి ఉన్న భూమి(A)","Cash (Partition Only)"]; break;
				case 'URBAN(PLOTS/HOUSE/FLATS..ETC) [పట్టణ (స్థలము/అపార్ట్ మెంట్/ఇల్లు)]': DropdownList.LandUseList = ["RESIDENTIAL (R) [నివాసయోగ్యము(R)]", "COMMERCIAL(R) [వాణిజ్యము(R)]", "NOTIFIED SLUM(R) [ప్రకటిత మురికివాడ(R)]", "INDUSTRIAL (URBAN)(R) [పారిశ్రామిక సంబంధము(R)]", "URBAN VACANT LAND(RESIDENTIAL)(R) [పట్టణ ఖాళీ స్తలము(నివాసం (R )]", "URBAN VACANT LAND(COMMERCIAL)(R) [పట్టణ ఖాళీ స్తలము(వ్యాపారపరమైన )(R)]","Cash (Partition Only)"]; break;
				default:
					break;
			}
		}else if(ApplicationDetails.documentNature.TRAN_MAJ_CODE =="01" && ApplicationDetails.documentNature.TRAN_MIN_CODE =="26" && PropertyDetails.conveyanceType ==="Movable"){
            switch (key) {
				case 'RURAL(AGRICULTURE) [గ్రామీణ (వ్యవసాయ భూమి)]': DropdownList.LandUseList = ["MOVABLE"]; break;
				case 'URBAN(PLOTS/HOUSE/FLATS..ETC) [పట్టణ (స్థలము/అపార్ట్ మెంట్/ఇల్లు)]': DropdownList.LandUseList = ["MOVABLE"]; break;
				default:
					break;
			}
        }
        else{
			switch (key) {
				case 'RURAL(AGRICULTURE) [గ్రామీణ (వ్యవసాయ భూమి)]': DropdownList.LandUseList = ["DRY LAND(A) [మెట్ట భూమి(A)]", "WET LAND DOUBLE CROP(A)[తడి భూమి రెట్టింపు క్రాప్ (ఎ)]", "GARDEN(A) [తోటలు(A)]", "AGRICULTURAL LAND FIT FOR H.S.(A) [నివేశ స్తలములకు తగినటువంటి వ్యవసాయ భూమి(A)]", "LAND ABUTTING NH/SH/ZPP/MPP(A) [NH / SH / ZPP / MPP ని కలిగి ఉన్న భూమి(A)"]; break;
				case 'URBAN(PLOTS/HOUSE/FLATS..ETC) [పట్టణ (స్థలము/అపార్ట్ మెంట్/ఇల్లు)]': DropdownList.LandUseList = ["RESIDENTIAL (R) [నివాసయోగ్యము(R)]", "COMMERCIAL(R) [వాణిజ్యము(R)]", "NOTIFIED SLUM(R) [ప్రకటిత మురికివాడ(R)]", "INDUSTRIAL (URBAN)(R) [పారిశ్రామిక సంబంధము(R)]", "URBAN VACANT LAND(RESIDENTIAL)(R) [పట్టణ ఖాళీ స్తలము(నివాసం (R )]", "URBAN VACANT LAND(COMMERCIAL)(R) [పట్టణ ఖాళీ స్తలము(వ్యాపారపరమైన )(R)]"]; break;
				default:
					break;
			}
		}

    }
    const redirectToPage = (location: string) => {
        router.push({
            pathname: location,
            // query: query,
        })
    }

    const handleChange = () => {
        setChecked(!checked);
    };

    const checkMutationEnabled = async(sroCode:string)=>{
            const result =  await CallingAxios(getMutationEnabled(sroCode));
            if(result.data){
                setIsMutationEnbaled(result.data)
            }
        }

    const partiesFormattedOptions = ApplicationDetails.claimant.map((item) => ({
        label: `${item.name} (${item.seqNumber})`,
        ...item
      }));

    return (
        <div className='PageSpacing'>
            <Head>
                <title>Property Details - Public Data Entry</title>
            </Head>
            <Container>
                <Row>
                    <Col lg={12} md={12} xs={12}>
                        <div className='tabContainerInfo'>
                            <Container>
                                <Row>
                                    <Col lg={10} md={12} xs={12}>
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
                            </Container>
                        </div>
                        <div className={`mt-4 ${styles.PropertyDetailsmain}`}>
                            <Row className='ApplicationNum mt-1'>
                                <Col lg={6} md={6} xs={12}>
                                    <div className='ContainerColumn TitleColmn' onClick={() => { redirectToPage("/PartiesDetailsPage") }}>
                                        <h4 className='TitleText left-title'>{ApplicationDetails.documentNature ? ApplicationDetails.registrationType.TRAN_DESC : null}</h4>
                                    </div>
                                </Col>
                                <Col lg={6} md={6} xs={12}>
                                    <div className='ContainerColumn'>
                                        <h4 className='TitleText' style={{ textAlign: 'right' }}>Application ID: {ApplicationDetails.applicationId}</h4>
                                    </div>

                                </Col>
                            </Row>
                            <form onSubmit={onSubmit} className={styles.ExecutantDetailsInfo}>
                                <div className={styles.DetailsHeaderContainer}>
                                    <Row>
                                        <Col lg={6} md={6} xs={12}>
                                            <div className={styles.ContainerColumn}>
                                                <p className={styles.HeaderText}> Property Details [ఆస్తి వివరాలు]</p>
                                            </div>
                                        </Col>
                                        <Col lg={6} md={6} xs={12}>
                                        </Col>
                                    </Row>
                                </div>
                                <div className={styles.AddExecutantInfo}>
                                    <Row className="align-items-end">
                                      { ApplicationDetails?.documentNature?.TRAN_MAJ_CODE !="06" && <Col lg={4} md={6} xs={12}>
                                            <TableText label={"Total Consideration Value [మొత్తం ప్రతిఫలం విలువ]"} required={true} LeftSpace={false} />
                                            <TableInputText disabled={true} type='number' placeholder='₹' required={true} name={'amount'} value={ApplicationDetails.amount} onChange={onChange} />
                                        </Col>}
                                        <Col lg={2} md={6} xs={12}></Col>
                                        <Col lg={3} md={6} xs={12}></Col>
                                        <Col lg={3} md={6} xs={12} className='text-end'>
                                            <button
                                                onClick={() => { dispatch(SavePropertyDetails(PropertyDetails)); window.open("/PDE/KnowmarketValuePage") }}
                                                className='proceedButton MarketButton PropertyButton' type='button'>Know Market Value</button>
                                        </Col>
                                    </Row>
                                    <div className={styles.divider}></div>
                                    <Row>
                                        <p className={` ${styles.getTitle} ${styles.HeadingText}`}>Date of Execution Details [అమలు తేదీ వివరాలు]</p>
                                        <Col lg={4} md={6} xs={12}>
                                            <TableText label={"Date of Execution [అమలు తేదీ]"} required={true} LeftSpace={false} />
                                            <TableInputText type='text' disabled={true} placeholder='Select Date' required={true} name={'executionDate'} value={DateFormator(ApplicationDetails.executionDate, "dd/mm/yyyy")} onChange={onChange} />
                                        </Col>
                                        <Col lg={4} md={6} xs={12}>
                                            <TableText label={"Total Stamp Paper Value(₹) [స్టాంప్ పేపర్ మొత్తం విలువ]"} required={true} LeftSpace={false} />
                                            <TableInputText disabled={true} type='number' placeholder='Enter Value' required={true} name={'stampPaperValue'} value={ApplicationDetails.stampPaperValue} onChange={onChange} />
                                        </Col>
                                        <Col lg={4} md={6} xs={12}>
                                            <TableText label={"Date of Stamp Purchase [స్టాంప్ కొనుగోలు తేదీ]"} required={true} LeftSpace={false} />
                                            <TableInputText type='text' disabled={true} placeholder='Select Date' required={true} name={'stampPurchaseDate'} value={DateFormator(ApplicationDetails.stampPurchaseDate, "dd/mm/yyyy")} onChange={onChange} />
                                        </Col>
                                    </Row>
                                    <div className={styles.divider}></div>

                                    {!crdaDocs && 
                                    <Row>
                                        <p className={` ${styles.getTitle} ${styles.HeadingText}`}>Which Jurisdiction district and SRO office is the property Located ? [ఏ సబ్ రిజిస్ట్రార్ కార్యాలయం పరిధి జిల్లాలో ఉన్న ఆస్తి?]</p>

                                        <Col lg={6} md={6} xs={12}>
                                            <TableText label={"Jurisdiction Registration District [అధికార పరిధి రిజిస్ట్రేషన్ జిల్లా]"} required={true} LeftSpace={false} />
                                            {/* {ApplicationDetails.regWith == "Vsws" ?
                                                <TableInputText disabled={true} required={true} name={'district'} value={PropertyDetails.district} onChange={onChange} type={'text'} placeholder={'district'} /> */}
                                                {/* :  */}
                                                <TableDropdownSRO required={true} options={DistrictList} name={'district'} value={PropertyDetails.district} onChange={onChange} />
                                            {/* } */}
                                        </Col>
                                        <Col lg={6} md={6} xs={12} className='mb-2'>
                                            <TableText label='Mandal [మండలం]' required={true} LeftSpace={false} />
                                            {/* {ApplicationDetails.regWith == "Vsws" ? */}
                                                {/* <TableInputText disabled={true} required={true} name={"mandal"} value={PropertyDetails.mandal} onChange={onChange} type={'text'} placeholder={'mandal'} /> :  */}
                                                <TableDropdownSRO required={true} options={MandalList} name={"mandal"} value={PropertyDetails.mandal} onChange={onChange} />
                                                {/* } */}
                                        </Col>

                                        <Col lg={6} md={6} xs={12}>
                                            <TableText label='Village [గ్రామం]' required={true} LeftSpace={false} />
                                            {/* {ApplicationDetails.regWith == "Vsws" ?
                                                <TableInputText disabled={true} required={true} name={'village'} value={PropertyDetails.village} onChange={onChange} type={'text'} placeholder={'village'} /> */}
                                                 <TableDropdownSRO required={true} options={VillageList} name={"village"} value={PropertyDetails.village} onChange={onChange} />
                                                {/* } */}
                                        </Col>
                                        <Col lg={6} md={6} xs={12}>
                                            <TableText label={"Jurisdiction Sub-Registrar [అధికార పరిధి సబ్ రిజిస్ట్రార్ కార్యాలయం]"} required={true} LeftSpace={false} />
                                            {/* {ApplicationDetails.regWith == "Vsws" ?
                                                <TableInputText disabled={true} required={true} name={'sroOffice'} value={PropertyDetails.village} onChange={onChange} type={'text'} placeholder={'sroOffice'} /> */}
                                                {/* :  */}
                                                <TableDropdownSRO required={true} options={SROOfficeList} name={'sroOffice'} value={PropertyDetails.sroOffice} onChange={onChange} />
                                                {/* } */}
                                        </Col>
                                        {/* <Col lg={6} md={6} xs={12} className='pt-1'>
                                            <TableText label={MuncipleKeyNameIdentifier(PropertyDetails.localBodyType)} required={true} LeftSpace={false} />
                                            <TableInputText type='text' splChar={false} placeholder='Enter Name' required={true} name={'localBodyName'} value={PropertyDetails.localBodyName} onChange={onChange} />
                                        </Col>
                                        <Col lg={6} md={6} xs={12} className='pt-1'>
                                            <TableText label={"Local Body Type [స్థానిక సంస్థ రకం]"} required={true} LeftSpace={false} />
                                            <TableDropdown required={true} options={DropdownList.LocalBodyTypesList} name={'localBodyType'} value={PropertyDetails.localBodyType} onChange={onChange} />
                                        </Col> */}
                                    </Row> 
                                    }
                                    
                                    {crdaDocs && propData  ? <Row>
                                        <p className={` ${styles.getTitle} ${styles.HeadingText}`}>Which Jurisdiction district and SRO office is the property Located ? [ఏ సబ్ రిజిస్ట్రార్ కార్యాలయం పరిధి జిల్లాలో ఉన్న ఆస్తి?]</p>

                                       {PropertyDetails.village && <Col lg={6} md={6} xs={12}>
                                            <TableText label={"Jurisdiction Registration District [అధికార పరిధి రిజిస్ట్రేషన్ జిల్లా]"} required={true} LeftSpace={false} />
                                           <TableInputText disabled={true} required={true} name={'district'} value={PropertyDetails.district} onChange={onChange} type={'text'} placeholder={'district'} />
                                        </Col>}
                                        {PropertyDetails.village &&<Col lg={6} md={6} xs={12} className='mb-2'>
                                            <TableText label='Mandal [మండలం]' required={true} LeftSpace={false} />
                                                <TableInputText disabled={true} required={true} name={"mandal"} value={PropertyDetails.mandal} onChange={onChange} type={'text'} placeholder={'mandal'} />
                                        </Col>}

                                        <Col lg={6} md={6} xs={12}>
                                            <TableText label='Village [గ్రామం]' required={true} LeftSpace={false} />
                                            {/* {ApplicationDetails.regWith == "Vsws" ?
                                                <TableInputText disabled={true} required={true} name={'village'} value={PropertyDetails.village} onChange={onCrdaChange} type={'text'} placeholder={'village'} /> */}
                                                {/* :  */}
                                                <TableDropdownSRO required={true} options={VillageList} name={"village"} value={PropertyDetails.village} onChange={onCrdaChange} />
                                                {/* } */}
                                        </Col>
                                        {PropertyDetails.village &&<Col lg={6} md={6} xs={12}>
                                            <TableText label={"Jurisdiction Sub-Registrar [అధికార పరిధి సబ్ రిజిస్ట్రార్ కార్యాలయం]"} required={true} LeftSpace={false} />
                                            <TableInputText disabled={true} required={true} name={'sroOffice'} value={PropertyDetails.sroOffice} onChange={onChange} type={'text'} placeholder={'sroOffice'} />
                                        </Col>}
                                        {/* <Col lg={6} md={6} xs={12} className='pt-1'>
                                            <TableText label={MuncipleKeyNameIdentifier(PropertyDetails.localBodyType)} required={true} LeftSpace={false} />
                                            <TableInputText type='text' splChar={false} placeholder='Enter Name' required={true} name={'localBodyName'} value={PropertyDetails.localBodyName} onChange={onChange} />
                                        </Col>
                                        <Col lg={6} md={6} xs={12} className='pt-1'>
                                            <TableText label={"Local Body Type [స్థానిక సంస్థ రకం]"} required={true} LeftSpace={false} />
                                            <TableDropdown required={true} options={DropdownList.LocalBodyTypesList} name={'localBodyType'} value={PropertyDetails.localBodyType} onChange={onChange} />
                                        </Col> */}
                                    </Row>
                                    :
                                    crdaDocs && !propData  && <Row>
                                    <p className={` ${styles.getTitle} ${styles.HeadingText}`}>Which{propData.length} what Jurisdiction district and SRO office is the property Located ? [ఏ సబ్ రిజిస్ట్రార్ కార్యాలయం పరిధి జిల్లాలో ఉన్న ఆస్తి?]</p>

                                    <Col lg={6} md={6} xs={12}>
                                        <TableText label={"Jurisdiction Registration District [అధికార పరిధి రిజిస్ట్రేషన్ జిల్లా]"} required={true} LeftSpace={false} />
                                        {/* {ApplicationDetails.regWith == "Vsws" ?
                                            <TableInputText disabled={true} required={true} name={'district'} value={PropertyDetails.district} onChange={onChange} type={'text'} placeholder={'district'} /> */}
                                            {/* :  */}
                                            <TableDropdownSRO required={true} options={DistrictList} name={'district'} value={PropertyDetails.district} onChange={onChange} />
                                        {/* } */}
                                    </Col>
                                    <Col lg={6} md={6} xs={12} className='mb-2'>
                                        <TableText label='Mandal [మండలం]' required={true} LeftSpace={false} />
                                        {/* {ApplicationDetails.regWith == "Vsws" ? */}
                                            {/* <TableInputText disabled={true} required={true} name={"mandal"} value={PropertyDetails.mandal} onChange={onChange} type={'text'} placeholder={'mandal'} /> :  */}
                                            <TableDropdownSRO required={true} options={MandalList} name={"mandal"} value={PropertyDetails.mandal} onChange={onChange} />
                                            {/* } */}
                                    </Col>

                                    <Col lg={6} md={6} xs={12}>
                                        <TableText label='Village [గ్రామం]' required={true} LeftSpace={false} />
                                        {/* {ApplicationDetails.regWith == "Vsws" ?
                                            <TableInputText disabled={true} required={true} name={'village'} value={PropertyDetails.village} onChange={onChange} type={'text'} placeholder={'village'} /> */}
                                            {/* :  */}
                                            <TableDropdownSRO required={true} options={VillageList} name={"village"} value={PropertyDetails.village} onChange={onChange} />
                                            {/* } */}
                                    </Col>
                                    <Col lg={6} md={6} xs={12}>
                                        <TableText label={"Jurisdiction Sub-Registrar [అధికార పరిధి సబ్ రిజిస్ట్రార్ కార్యాలయం]"} required={true} LeftSpace={false} />
                                        {/* {ApplicationDetails.regWith == "Vsws" ?
                                            <TableInputText disabled={true} required={true} name={'sroOffice'} value={PropertyDetails.village} onChange={onChange} type={'text'} placeholder={'sroOffice'} /> */}
                                            {/* :  */}
                                            <TableDropdownSRO required={true} options={SROOfficeList} name={'sroOffice'} value={PropertyDetails.sroOffice} onChange={onChange} />
                                            {/* } */}
                                    </Col>
                                    {/* <Col lg={6} md={6} xs={12} className='pt-1'>
                                        <TableText label={MuncipleKeyNameIdentifier(PropertyDetails.localBodyType)} required={true} LeftSpace={false} />
                                        <TableInputText type='text' splChar={false} placeholder='Enter Name' required={true} name={'localBodyName'} value={PropertyDetails.localBodyName} onChange={onChange} />
                                    </Col>
                                    <Col lg={6} md={6} xs={12} className='pt-1'>
                                        <TableText label={"Local Body Type [స్థానిక సంస్థ రకం]"} required={true} LeftSpace={false} />
                                        <TableDropdown required={true} options={DropdownList.LocalBodyTypesList} name={'localBodyType'} value={PropertyDetails.localBodyType} onChange={onChange} />
                                    </Col> */}
                                    </Row>
                                    }
                                   {ApplicationDetails?.documentNature?.TRAN_MAJ_CODE == "01" && ApplicationDetails?.documentNature?.TRAN_MIN_CODE == "26" && 
                                   <>
                                        <div className={styles.divider}></div>
                                        <Row className='mt-0 mb-0'>
                                            <Col lg={12} md={12} xs={12} className='pt-0 pb-2'>
                                                <div className={styles.DocuementGen2}>
                                                <TableText label={"Is Company?"} required={true} LeftSpace={false} />
                                                    <TableInputRadio label={'Select'} required={true} options={[{ 'label': "Immovable(Properties)" },{ 'label': "Movable" },{ 'label': "Both(Movable & Immovable)" }]} onChange={onChange} name='conveyanceType' defaultValue={PropertyDetails.conveyanceType} />
                                                </div>
                                            </Col>
                                        </Row>
                                    </>
                                   }

                                    <div className={styles.divider}></div>
                                    <Row >
                                        {ApplicationDetails.documentNature.TRAN_MAJ_CODE=="01" && ApplicationDetails.documentNature.TRAN_MIN_CODE =="26" && PropertyDetails.conveyanceType ==="Movable" ? 
                                        <>
                                        <Col lg={4} md={6} xs={12}>
                                            <TableText label={"Type of Property [ఆస్తి రకం]"} required={true} LeftSpace={false} />
                                            <TableDropdown required={true} options={DropdownList.Typeofproperty} name={'propertyType'} value={PropertyDetails.propertyType} onChange={onChange} />
                                        </Col>
                                        <Col lg={4} md={6} xs={12}>
                                            <TableText label={"Land Use [భూమి వినియోగం]"} required={true} LeftSpace={false} />
                                            <TableDropdown required={true} options={DropdownList.LandUseList} name={'landUse'} value={PropertyDetails.landUse} onChange={onChange} />
                                        </Col>
                                        </> :
                                        <>
                                            <Col lg={4} md={6} xs={12}>
                                                <TableText label={"Type of Property [ఆస్తి రకం]"} required={true} LeftSpace={false} />
                                                <TableDropdown required={true} options={DropdownList.Typeofproperty} name={'propertyType'} value={PropertyDetails.propertyType} onChange={onChange} />
                                            </Col>
                                            <Col lg={4} md={6} xs={12}>
                                                <TableText label={"Land Use [భూమి వినియోగం]"} required={true} LeftSpace={false} />
                                                <TableDropdown required={true} options={DropdownList.LandUseList} name={'landUse'} value={PropertyDetails.landUse} onChange={onChange} />
                                            </Col>
                                        </>
                                        }
                                        { ApplicationDetails?.registrationType?.TRAN_MAJ_CODE == "04"  && <Col lg={4} md={6} xs={12}>
                                                <TableText label={"Is this jointly shared property ?"} required={true} LeftSpace={false} />
                                                <TableDropdown required={true} options={DropdownList.Joints} name={"jointOrNot"} value={PropertyDetails.jointOrNot} onChange={onChange} />
                                                {/* <TableInputText disabled={PartyDetails.operation == "View" ? true : false} type='number' onBlurCapture={e => { e.preventDefault(); if (!ValidMobile(e.target.value)) { setPartyDetails({ ...PartyDetails, phone: '' }) } }} splChar={false} dot={false} placeholder='10 Digit Mobile Number' required={true} name={'phone'} value={PartyDetails.phone} onChange={onChange} min={10} /> */}
                                                {/* <p className={styles.warningText} style={{ color: 'red' }}>{FormErrors.phone}</p> */}
                                            </Col>
                                        }

                                        {ApplicationDetails?.registrationType?.TRAN_MAJ_CODE == "04" ?
                                            <Col lg={4} md={6} xs={12}>
                                                {PropertyDetails.jointOrNot ==="NO" ?
                                                    <><TableText label={"Party Name [పార్టీ పేరు]"} required={true} LeftSpace={false} /><TableDropdownSRO2 keyName={'label'} required={true} options={partiesFormattedOptions} name={'partyNumber'} value={partiesFormattedOptions.find((item) => item.seqNumber == PropertyDetails.partyNumber)?.label??""} onChange={onChange} /></>
                                                    : PropertyDetails.jointOrNot ==="YES" && ApplicationDetails.claimant && ApplicationDetails.claimant.length >1 &&
                                                    <><TableText label={"Party Name [పార్టీ పేరు]"} required={true} LeftSpace={false} />
                                                    <Multiselect
                                                        className='multiSelectInputContainer'
                                                        options={partiesFormattedOptions} 
                                                        selectedValues={multiDropValue.partyNumber} 
                                                        onSelect={(val: any) => { multiOnSelect(val); } } 
                                                        onRemove={(val:any)=>multiOnRemove(multiDropValue,val)} 
                                                        displayValue="label"
                                                        showCheckbox={true}/>
                                                    </>
                                                }
                                                
                                            </Col>
                                            : ApplicationDetails?.registrationType?.TRAN_MAJ_CODE == "06" ? 
                                            <Col lg={4} md={6} xs={12}>
                                                <TableText label={"Exchange To"} required={true} LeftSpace={false} />
                                                <TableDropdown required={true} options={ExchangeParties} name={"exchangeTo"} value={PropertyDetails.exchangeTo} onChange={onChange} />
                                                {/* <TableDropdownSRO2 keyName={'share'} required={true} options={ExchangeParties} name={'partyNumber'} value={PropertyDetails.partyNumber} onChange={onChange} /> */}
                                            </Col>
                                            :null}
                                        {ApplicationDetails?.registrationType?.TRAN_MAJ_CODE == "06" ?
                                        <Col lg={3} md={6} xs={12}>
                                                <TableText label={"Consideration value"} required={true} LeftSpace={false} />
                                                {/* <TableDropdown required={true} options={ExchangeParties} name={"considarartionValue"} value={PropertyDetails.considarartionValue} onChange={onChange} /> */}
                                                <TableInputText type='number' placeholder='₹' required={true} name={'considarartionValue'} value={PropertyDetails.considarartionValue} onChange={onChange} />
                                        </Col>:null}
                                        <Col lg={3} md={6} xs={12}></Col>
                                        <Col lg={12} md={12} xs={12}>
                                            {AllowProceed ? <div className={styles.ProceedContainer}>
                                                <button className='proceedButton'>Proceed</button>
                                            </div> : null}
                                        </Col>
                                    </Row>
                                </div>
                            </form>
                        </div>
                    </Col>
                </Row>
            </Container>
            {/* <pre>{VILLCD}</pre> */}
            {/* {/* <pre>{JSON.stringify(ApplicationDetails, null, 2)}</pre> */}
            {/* <pre>{JSON.stringify(PropertyDetails, null, 2)}</pre>  */}
            {/* <pre>{JSON.stringify(ApplicationDetails,null,2)}</pre> */}
        </div>









    )
}

export default PropertyDetailsPage
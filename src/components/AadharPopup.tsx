import react, { useState, useEffect, useRef } from 'react';
import Modal from 'react-bootstrap/Modal';
import styles from '../../styles/Home.module.scss';
import { Col, Container, Row, Button } from 'react-bootstrap';
import Image from 'next/image';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { AadharPopupAction } from '../redux/commonSlice';
import { useRouter } from 'next/router';
import { CallingAxios, ShowMessagePopup, useVoiceSequenceAadhaarConsent2 } from '../GenericFunctions';
import { getSezJuriSRO, getSEZRepresentativeList, UseGetAadharDetails, UseGetAadharOTP, SaveAadharConsentDetails } from '../axios';
import TableText from '../../src/components/TableText';
import TableDropdownSRO from '../../src/components/TableDropdownSRO';
import Popstyles from '../../styles/components/PopupAlert.module.scss';
import TableInputRadio from './TableInputRadio';
import { ImCross } from 'react-icons/im';
import { Consent1, Consent2_Eng, Consent2_Tel } from '../../src/utils'
import { Volume2, PauseCircle, PlayCircle } from "lucide-react";


const AadharPopup = () => {
  const [TempMemory, setTempMemory] = useState({ AadharPresent: false })
  const [PeopleList, setPeopleList] = useState([]);
  let CurrentPartyDetails = useAppSelector(state => state.form.CurrentPartyDetails);
  let CurrentRepresentDetails = useAppSelector(state => state.form.CurrentRepresentDetails);
  let LoginDetails = useAppSelector(state => state.login.loginDetails);
  let [PartyDetails, setPartyDetails] = useState<any>([]);
  let [AadharNumberDetails, setAadharNumberDetails] = useState({ type: "", aadharNumber: "", otp: "",wa:"", OTPResponse: { transactionNumber: "" }, KYCResponse: {} });
  const [flag,setflag] = useState(false);
  const [seconds, setSeconds] = useState(10);
  const [existingAdhar,setExistingAdhar] = useState<any>([]);
  let [popUp,setPopup]=useState<any>(false);
  let [pwitness, setPwitness] = useState<any>(false);
  const AadharPopupMemory = useAppSelector((state) => state.common.AadharPopupMemory);
  const [currentPartyAadhar, setCurrentPartyAadhar] = useState<any>('');
  const [sezData, setSezData] = useState([])
  const [selectedSez, setSelectedSez] = useState("");
  const [sezHabcodes, setSezHabcodes] = useState([])

  const [aadharConsentCheckboxChecked, setAadharConsentCheckboxChecked] = useState(false);
  const [showAadharConsentConfirmPopup, setShowAadharConsentConfirmPopup] = useState(true);
  const { audioRef, voiceStatus, isTeluguMode, toggleVoice, resetVoiceState } = useVoiceSequenceAadhaarConsent2();
  

  const dispatch = useAppDispatch();
  const router = useRouter();
 let pList = [{ id: 1, name: "Public" }, { id: 2, name: "Firms/Company" }, { id: 3, name: "Bank" }, { id: 4, name: "Trust" },{id:5,name:"Govt Institutions"},{id:6,name:"Courts"},{id:6,name:"Societies"},{ id: 7, name: "NRI" }, { id: 8, name: "OCI" },{ id: 9, name: "Deceased" },{ id:10, name: "SEZ Representative" }];
 let DocumentNature = useAppSelector(state => state.form.GetstartedDetails);
//   const CRDAdocuments = [
//   { T_MAJ: "01", T_MIN: "25", DOCT_TYPE: "Development Agreement/GPA/Supplemental Deed by CRDA", type: "Sale" },
//   { T_MAJ: "06", T_MIN: "02", DOCT_TYPE: "Exchange by CRDA", type: "Exchange" },
//   { T_MAJ: "08", T_MIN: "05", DOCT_TYPE: "Recification Deed By CRDA" }
// ];


// const CRDAcheck = ( )=>{
//   let data: any = localStorage.getItem("GetApplicationDetails");
//   if (data) {
//   data = JSON.parse(data);
//   const tmaj_code = data?.documentNature?.TRAN_MAJ_CODE;
//   const tmin_code = data?.documentNature?.TRAN_MIN_CODE;
//   const InitialCRDAnature: any = CRDAdocuments.filter( document => document.T_MAJ === tmaj_code && document.T_MIN === tmin_code);
//     pList = [{ id: 1, name: "Public" }, { id: 2, name: "Firms/Company" }, { id: 3, name: "Bank" }, { id: 4, name: "Trust" },{id:5,name:"Govt Institutions"},{id:6,name:"Courts"},{id:6,name:"Societies"}];
//    if(InitialCRDAnature.length>0){
//     pList.push({ id: 8, name: "NRI/OCI" });
//    } 
//   }
// }
  useEffect(() => {
    // CRDAcheck();
    setPeopleList(pList);
    let CurrentParty: any = localStorage.getItem("CurrentPartyDetails");
    CurrentParty = JSON.parse(CurrentParty);
    setCurrentPartyAadhar(CurrentParty?.aadhaar);
    setExistingAdhar(JSON.parse(localStorage.getItem("ExistingAadhar")));
    setPartyDetails(CurrentParty);
    if(CurrentParty?.PartyType == "EXECUTANT" && DocumentNature?.documentNature?.TRAN_MAJ_CODE == '08' && DocumentNature?.documentNature?.TRAN_MIN_CODE == '06'){
      setPeopleList(pList.filter((x:any)=>x.name == "Govt Institutions"));
    }
    if (CurrentParty?.representType === "Deceased") {
      setPeopleList(pList.filter((x: any) => x.name === "Deceased"));
    } else {
      setPeopleList(pList.filter((x: any) => x.name !== "Deceased"));
    }
    if(LoginDetails?.loginName === 'APIIC' && CurrentParty?.PartyType == "EXECUTANT" ){
     setPeopleList(pList.filter((x:any)=>x.name == "Govt Institutions"));
    }
    if((LoginDetails?.loginMode === 'VSWS' && (CurrentParty?.PartyType === "WITNESS" || CurrentParty?.partyCode === "WT"))){
     setPeopleList(pList.filter((x:any)=>x.name == "Public"));
    }
    if(LoginDetails?.loginEmail === 'CRDA' && CurrentParty?.PartyType == "EXECUTANT" &&
       (DocumentNature?.documentNature?.TRAN_MAJ_CODE == '01' && DocumentNature?.documentNature?.TRAN_MIN_CODE == '25' ||
       DocumentNature?.documentNature?.TRAN_MAJ_CODE == '06' && DocumentNature?.documentNature?.TRAN_MIN_CODE == '02' ||
       DocumentNature?.documentNature?.TRAN_MAJ_CODE == '08' && DocumentNature?.documentNature?.TRAN_MIN_CODE == '05')){
      setPeopleList(pList.filter((x:any)=>x.name == "Govt Institutions"));
    }
    if (AadharPopupMemory.op == "AddRep") {
      setAadharNumberDetails({ ...AadharNumberDetails, type: "Public" });
	  setPartyDetails({...PartyDetails,operation:AadharPopupMemory.op,partyType:PartyDetails?.PartyType=='Deceaved'? PartyDetails?.PartyType:"Public"})
    }
	if(LoginDetails.loginName =="Titdco" && AadharPopupMemory.op == "AddRep"){
	}
    const gethabcodes = async () =>{
      const result = await CallingAxios(getSezJuriSRO({hab:"hab"}))
      if(result.status)
        setSezHabcodes(result.data)
    }
    gethabcodes()
  }, [AadharPopupMemory.enable]);

  useEffect(() =>{
    if(localStorage.getItem("GetApplicationDetails")){
    let data: any = JSON.parse(localStorage.getItem("GetApplicationDetails"));
    const allParties = [...data?.claimant || [], ...data?.executent || []]
    const properties = data?.property || [];
    if(allParties.some(party => party.partyType === "SEZ Representative") || properties.some((prop) => !sezHabcodes.some((hab) => hab.hab_code === prop.habitationCode))){
      setPeopleList(pList.filter((x:any)=>x.name !== "SEZ Representative"));
    }
  }
  },[sezHabcodes])

  useEffect(() => {
    if (!seconds) return;
    if(seconds===0){
       setSeconds(null)
    }
    const intervalId = setInterval(() => {
    	setSeconds(seconds - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [seconds]);

  useEffect(() => {
    if (!showAadharConsentConfirmPopup || AadharNumberDetails.wa !== "Aadhar With OTP") {
      // if (AadharNumberDetails.wa !== "Aadhar With OTP") {
        resetVoiceState();
      // };
    }
  }, [showAadharConsentConfirmPopup, AadharNumberDetails.wa]);

  const OnCancelAction= async ()=>{
	}
  const onClickDocs = async(type:any)=>{
    if(type =="Y"){
        setPopup(false)
    }else{
        let temmParty={...AadharNumberDetails,aadharNumber:""}
        setAadharNumberDetails(temmParty);
        // setPartyDetails(temmParty);
        setPopup(false)
        setAadharConsentCheckboxChecked(false);
    }
}

  const ReqOTP = () => {

    if (!aadharConsentCheckboxChecked) {
      ShowMessagePopup(false, "Please Select the Check box", "");
      return;
    }
	// window.alert(JSON.stringify(AadharNumberDetails.wa))
	// if(AadharNumberDetails.type ==="Public" && PartyDetails.operation !="AddRep"){
		
	// 	let details = { ...PartyDetails,wa:AadharNumberDetails.wa}
	// 	setPartyDetails(details);
	// }
	// window.alert(JSON.stringify(PartyDetails.wa))
		
	if(PartyDetails.type == "Public" || PartyDetails.operation != "AddRep"){
		setPartyDetails({...PartyDetails,wa:AadharNumberDetails.wa});
	}
    if (AadharNumberDetails.aadharNumber.length == 12) {
      let ExistingAadhar = JSON.parse(localStorage.getItem("ExistingAadhar"));
      // let count = ExistingAadhar.find(x => x == AadharNumberDetails.aadharNumber);
      // if (!count) {
        CallGetOTP();
        setShowAadharConsentConfirmPopup(false);
      // }
      // else {
      //   ShowMessagePopup(false, "Duplicate Aadhar card entry is not allowed", "");
      // }
    }
    else {
      // dispatch(AadharPopupAction({ ...AadharPopupMemory, enable: false }));
      ShowMessagePopup(false, "Kindly enter valid Aadhar number", "");
      setAadharConsentCheckboxChecked(false);
    }
  }
  const ReqDetails = async () => {
    let result = await CallingAxios(UseGetAadharDetails({
      aadharNumber: btoa(AadharNumberDetails.aadharNumber),
      transactionNumber: AadharNumberDetails.OTPResponse.transactionNumber,
      otp: AadharNumberDetails.otp
    }));
    if (result.status && result.status === 'Success') {
      let details = { ...AadharNumberDetails, KYCResponse: result.userInfo, type: "Public" }
      setAadharNumberDetails(details);
      setTempMemory({ AadharPresent: false });
      setAadharNumberDetails({ type: "", aadharNumber: "", otp: "", OTPResponse: { transactionNumber: "" },wa:"", KYCResponse: {} });
      // console.log(details);
      //window.alert(JSON.stringify(details,null,2));
      dispatch(AadharPopupAction({ enable: false, status: true, response: true, data: details }));

        let data = {
        APP_ID: PartyDetails.applicationId,
        PARTY_NAME: result.userInfo.name, 
        CONSENT_ACCEPT: aadharConsentCheckboxChecked ? "Y" : "N",
        PARTY_TYPE: PartyDetails.representType,
        TYPE: `Aadhar Popup - (${PartyDetails?.wa})`,
        SOURCE_NAME: "PDE",
        AADHAR_CONSENT: 2
      }
      // if (aadharOtpSent){
        const response = await CallingAxios(SaveAadharConsentDetails(data));
        setShowAadharConsentConfirmPopup(true);
      // }
    }
    else {
      ShowMessagePopup(false, "Please Enter Valid OTP", "");
      // dispatch(AadharPopupAction({ ...AadharPopupMemory, enable: false, response: false, status: false, data: {} }));
    }
  }

  function tick(timeSconds:any) {
    if (timeSconds > 0) {
      setSeconds(timeSconds - 1)
    } else {
      clearInterval(timeSconds);
    }
  }
  const CallGetOTP = async () => {
    let myAadhar = btoa(AadharNumberDetails.aadharNumber);
    let result = await CallingAxios(UseGetAadharOTP(myAadhar));
    if (result && result.status != "Failure") {
      setTempMemory({ AadharPresent: true });
      setAadharNumberDetails({ ...AadharNumberDetails, OTPResponse: result })
      ShowMessagePopup(true, "Aadhar OTP has been sent successfully on registered mobile", "")
	  tick(20);
    }
    else {
      setTempMemory({ AadharPresent: false })
      // dispatch(AadharPopupAction({ enable: false, status: false, response: false, data: {} }));
      setAadharNumberDetails({ ...AadharNumberDetails, aadharNumber: "", otp: "", OTPResponse: { transactionNumber: "" }, KYCResponse: {} });
      ShowMessagePopup(false, "Aadhar OTP Request failed", "");
      setAadharConsentCheckboxChecked(false);
      setShowAadharConsentConfirmPopup(true);
    }
  }

  const handleKeypress = (event, type) => {
    ['e', 'E', '+', '-', '.'].includes(event.key) && event.preventDefault();
    if (type == "submitAadhar" && event.key === 'Enter') {
      document.getElementById(type).click();
    } else if (type == "submitOtp" && event.key === 'Enter') {
      document.getElementById(type).click();
    }
  }

  const onchange = async(e: any) => {
    let addName = e.target.name;
    let addValue = e.target.value;
	  let temp = JSON.parse(localStorage.getItem("docDetailsofPopUp"));

    if(addName == "type" && addValue == "SEZ Representative"){
      const result = await CallingAxios(getSEZRepresentativeList());
      if(result.status){
        setSezData(result.response || [])
      }else{
        ShowMessagePopup(false, result.message, "");
      }
    }else if (addName == "aadharNumber") {
      if (addValue.length > 12) {
        addValue = AadharNumberDetails.aadharNumber;
      }
      if (addValue == currentPartyAadhar) {
        setAadharNumberDetails({...AadharNumberDetails, aadharNumber:""});
        ShowMessagePopup(false, "Same Aadhaar not allowed for party and their representative", "");
        setAadharConsentCheckboxChecked(false);
        return false;
      }
      if(String(addValue).length == 12){
        let count:any;
        if(existingAdhar && existingAdhar.length >0){
          count = existingAdhar.find(x => x == addValue);
        }
        if(count != undefined){
            setPopup(true)
        }else{
            setPopup(false)
        }
      }
    } else if (addName == "people") {

      AadharNumberDetails.type = addValue;
    } else if(addName == "type" && addValue =="Public"){
		if((temp.TRAN_MAJ_CODE == '02' && temp.TRAN_MIN_CODE == '06') || LoginDetails.loginName == "Titdco"){
			setflag(true);
		}else if(temp.TRAN_MAJ_CODE == '04' && temp.TRAN_MIN_CODE == '03'){
      setflag(true);
    }
    else if(temp.TRAN_MAJ_CODE == '01' && temp.TRAN_MIN_CODE == '20'){
			setflag(true);
		}else if(temp.TRAN_MAJ_CODE == '04' && temp.TRAN_MIN_CODE == '03'){
			setflag(true);
		}
    else{
			setflag(false);
		}
		// if(LoginDetails.loginName == "Titdco"){
		// 	setflag(false);
		// }
	}else if(addName ==="wa" && AadharNumberDetails.type ==="Public"){
		AadharNumberDetails.wa = addValue;
    setAadharConsentCheckboxChecked(false);
	}
	else if (addName == "otp") {
      let errorLabel = ""
      if (addValue.length < 6) {
        errorLabel = "Enter 6 Digit Valid Number";
      }
      if (addValue.length > 6) {
        addValue = addValue.substring(0, 6);
      }
    }

    setAadharNumberDetails({ ...AadharNumberDetails, [addName]: addValue });
  }
  const redirectToPage = async (location: string) => {
    let details ;
	if(AadharNumberDetails.wa == "Aadhar Without OTP" ||  AadharNumberDetails.type == 'NRI' || AadharNumberDetails.type == 'OCI'){
		details = { ...AadharPopupMemory, type: AadharNumberDetails.type, wa: AadharNumberDetails.wa}
	}else{
		details = { ...AadharPopupMemory, type: AadharNumberDetails.type}
	}
	
    dispatch(AadharPopupAction({ enable: false, status: true, response: true, data: details }));
    setAadharNumberDetails({ type: "", aadharNumber: "", otp: "", OTPResponse: { transactionNumber: "" },wa:"", KYCResponse: {} });
    router.push({
      pathname: location,
      // query: query,
    })
  }

  const blockInvalidChar = e => {
    ['e', 'E', '+', '-', '.'].includes(e.key) && e.preventDefault();
  }

  const handleSelectChange = (e) => {
    const selectedAadhar = e.target.value;
    setSelectedSez(selectedAadhar);
  };

  const addToLocalStorage = () =>{
    const user = sezData.find((person) => person.AADHAR === selectedSez)
    localStorage.setItem("SEZRepresentative", JSON.stringify(user));
    setSezData([]);
    setSelectedSez("");
    redirectToPage("/AddPartyPage")
  }

  return (
    <div className="home-main-sec">
      {AadharPopupMemory.enable && 
        <div className={styles.container}>
          <Modal.Dialog className={styles.modaldialog}>
            <div className={styles.modalHeaderInfo}>
              <Row className={`${styles.Modalheader} align-items-center`}>
                <Col lg={10}>
                  <Modal.Title className={styles.ModalTitle}>Party Details</Modal.Title>
                </Col>
                <Col lg={2} className="d-flex justify-content-end align-items-center">
                  { showAadharConsentConfirmPopup ? (
                    AadharNumberDetails.wa === "Aadhar With OTP" && (
                      <div className="d-flex align-items-center ms-2">
                        <audio ref={audioRef} src="/PDE/AadharConsentTeluguAudio.mp3" preload="auto" />
                        {voiceStatus === "idle" ? (
                          <span title="Play Voice">
                            <Volume2 size={22} style={{ color: "white", cursor: "pointer" }} onClick={() => toggleVoice(Consent2_Eng)} />
                          </span>
                        ) : voiceStatus === "paused" ? (
                          <span title="Resume Voice">
                            <PlayCircle size={24} style={{ color: "white", cursor: "pointer" }} onClick={() => toggleVoice(Consent2_Eng)} />
                          </span>
                        ) : (
                          <span title="Pause Voice">
                            <PauseCircle size={24} style={{ color: "white", cursor: "pointer" }} onClick={() => toggleVoice(Consent2_Eng)} />
                          </span>
                        )}   
                      </div>
                    )) : ("")
                  }
                  <Modal.Header closeButton className={styles.Modalclose} onClick={() => { router.push("/PartiesDetailsPage"); setAadharNumberDetails({ type: "", aadharNumber: "", otp: "", OTPResponse: { transactionNumber: "" },wa:"", KYCResponse: {} }); setTempMemory({ AadharPresent: false }); dispatch(AadharPopupAction({ ...AadharPopupMemory, enable: false, response: false, status: false, data: {} })); setAadharConsentCheckboxChecked(false); setShowAadharConsentConfirmPopup(true);}}>
                  </Modal.Header>
                </Col>
              </Row>
            </div>
            <Modal.Body className={`${styles.succesxsodalbody}`}>
              { showAadharConsentConfirmPopup ? (
                AadharNumberDetails.wa === "Aadhar With OTP" && (
                  <div className= "p-2 rounded" style={{  textAlign: "justify" }}>
                    <div style={{ display: "flex",  }} className= {`${styles.aadharConsentBox}`}>
                      <input
                        type="checkbox"
                        id="confirmCheckbox"
                        checked={aadharConsentCheckboxChecked}
                        onChange={() => setAadharConsentCheckboxChecked(!aadharConsentCheckboxChecked)}
                        required
                        style={{ margin: "0px 10px 60px 0px", width: "220px" }}
                      />
                      <div>
                        <p style={{ marginBottom: "0px", fontSize: "14px", lineHeight: "1.5" }}>
                          {Consent2_Eng}
                        </p>
                        <p style={{ marginBottom: "0px", fontSize: "14px", lineHeight: "1.5" }}>
                          {Consent2_Tel}
                        </p>
                      </div>
                    </div>
                  </div>
                )) : ("")
              }
              {AadharPopupMemory.op != "AddRep" && <div className='partyType'>
                <TableText label={`${PartyDetails ? PartyDetails.representType : ""} Type`} required={true} LeftSpace={false} />
                {(AadharNumberDetails.type != "" && TempMemory.AadharPresent == true) ?
                // <TableInputText disabled={true} placeholder='' name={"people"} value={AadharNumberDetails.type} onChange={onchange} type={'text'} required={false} Style={{with:"100%"}} />
                <div >
                <input className={styles.columnInputBox}          
                style={{width:"100%"}}
                  name={'people'}
                  type={'text'}
                  disabled={true}
                  value={AadharNumberDetails.type}
                />
              </div>
                 : <TableDropdownSRO required={true} options={PeopleList} name={"type"} value={AadharNumberDetails.type} onChange={onchange} />
                  
                }
              </div>}
			  	{ AadharNumberDetails.type === "Public"  && !flag ? <>
					<Row className='mt-0 mb-0'>
                    	<Col lg={12} md={12} xs={12} className='pt-0 pb-2'>
                    		<div className={styles.adharRadio}>
                       { LoginDetails?.loginEmail == 'APIIC'  && PartyDetails?.operation !== "AddRep"  || (LoginDetails?.loginEmail == 'APIIC' && PartyDetails?.PartyType === "CLAIMANT") &&
							          <TableInputRadio label={'Select'} required={true} options={[{ 'label': "Aadhar With OTP" }, { 'label': "Aadhar Without OTP" }]} onChange={onchange} name='wa' defaultValue={AadharNumberDetails.wa} />
                         } 
                         { LoginDetails?.loginEmail !== 'APIIC'  && 
							          <TableInputRadio label={'Select'} required={true} options={!(LoginDetails?.loginMode === 'VSWS' && PartyDetails.PartyType === 'WITNESS') && !( PartyDetails.operation === "View" && PartyDetails.partyCode === "WT" && LoginDetails?.loginMode === "VSWS") ? [{ 'label': "Aadhar With OTP" }, { 'label': "Aadhar Without OTP" }] : [{ 'label': "Aadhar With OTP" }]} onChange={onchange} name='wa' defaultValue={AadharNumberDetails.wa} />
                         } 
                    		</div>
                    	</Col>
                  	</Row></>:null
				}
			

              {AadharNumberDetails.type === "Public" && !flag && AadharNumberDetails.wa ==="Aadhar With OTP"   ? <><div>
                <Image alt="Image" height={90} width={90} className='adhaarImage' src="/PDE/images/adhar-img.png" />
              </div><div>
                  <p className={styles.AdharText}>{!TempMemory.AadharPresent ? 'Enter ' : null}Aadhaar Card Number</p>
                  {TempMemory.AadharPresent ?<div className='d-flex aadharReset'>
					<input disabled={true} type="text" placeholder={'xxxx xxxx x'} value={"xxx xxxx x" + AadharNumberDetails.aadharNumber.substring(9, 12)} /> 
					{seconds === 0 ? <Image alt='' onClick={CallGetOTP} width={40} height={40} className={`aadharRestImg ${Popstyles.sImage}`} src="/PDE/images/reset.png" />:
					<div className="circle">{seconds}</div>
					// <button className='btn btn-sm btn-secondary btnTimer'>0 : {seconds}</button>
					}
					
				  </div>

                    :
                    <input onKeyDown={(e) => { handleKeypress(e, "submitAadhar"); blockInvalidChar(e); }} disabled={false} type="number" onFocus={(e) => e.target.addEventListener("wheel", function (e) { e.preventDefault() }, { passive: false })} name="aadharNumber" placeholder='xxxx xxxx xxxx' value={AadharNumberDetails.aadharNumber} onChange={onchange} />}
                </div>
              </> : null}
              {AadharNumberDetails.wa === "Aadhar With OTP" && TempMemory.AadharPresent && !flag && (
                <div>
                  <p className={`${styles.AdharText} ${styles.OtpText}`}>Enter OTP</p>
                  <input type="number" onKeyDown={(e) => { handleKeypress(e, "submitOtp"); blockInvalidChar(e); }} placeholder='xxxxxx' name={"otp"} value={AadharNumberDetails.otp} onChange={onchange} />
                </div> )}

              {(!TempMemory.AadharPresent && AadharNumberDetails.type === "Public" && !flag && AadharNumberDetails.wa === "Aadhar With OTP") ?
                <button className='proceedButton' type='submit' id="submitAadhar" onClick={ReqOTP} >Submit</button>
                // : (!TempMemory.AadharPresent && AadharNumberDetails.type === "Public" && !flag && PartyDetails.operation==="AddRep") ? <button className='proceedButton' type='submit' id="submitAadhar" onClick={ReqOTP} >Submit2</button>
				:
				AadharNumberDetails.type === "Public" && !flag   && AadharNumberDetails.wa === "Aadhar With OTP"?
                  <button className='proceedButton' id="submitOtp" onClick={ReqDetails}>Verify</button> 
				//   :
				//   AadharNumberDetails.type === "Public" && !flag   && PartyDetails.operation ==="AddRep" 
				//   ?<button className='proceedButton' id="submitOtp" onClick={ReqDetails}>Verify</button>
				  : AadharNumberDetails.type === "Bank" || AadharNumberDetails.type === "Trust" || AadharNumberDetails.type === "Firms/Company" || AadharNumberDetails.type === "Govt Institutions" || AadharNumberDetails.type === "Courts" || AadharNumberDetails.type === "Societies" || AadharNumberDetails.wa === "Aadhar Without OTP"  || AadharNumberDetails.type === "NRI" || AadharNumberDetails.type === "OCI" || ( LoginDetails?.loginEmail === 'APIIC' && AadharNumberDetails.type === "Public" && PartyDetails?.PartyType == "EXECUTANT" ) || ( LoginDetails?.loginEmail === 'APIIC' && PartyDetails?.operation == 'AddRep') || (LoginDetails?.loginEmail == 'APIIC' && PartyDetails?.PartyType === "CLAIMANT") || AadharNumberDetails.type === "Deceased" || flag ===true?
				   <button className='proceedButton' onClick={() => {if(AadharNumberDetails.type ==""){ShowMessagePopup(false,"Kindly Select "+PartyDetails.representType+" Type","");}else{ redirectToPage("/AddPartyPage") }}}>Submit</button>:null
              }
              {
                AadharNumberDetails.type === "SEZ Representative" &&
                <div style={{textAlign:'left', margin:'5% 10%'}}>
                  <TableText label="Select SEZ Representative" required={true} LeftSpace={false} />
                  <select
                    required
                    className='shadow bg-white'
                    name="sezRepresentative"
                    value={selectedSez}
                    onChange={handleSelectChange}
                    style={{
                      width: "100%",
                      padding: "5px",
                      borderRadius: "4px",
                      border: "1px solid #b4b7d3ff",
                    }}
                  >
                    <option value="">Select Representative</option>
                    {sezData.map((item) => (
                      <option key={item.AADHAR} value={item.AADHAR}>
                        {item.SEZ_NAME}
                      </option>
                    ))}
                  </select>

                   <Button type="button" className='mt-4' style={{marginLeft:'35%'}} disabled={selectedSez == ""} onClick={() => addToLocalStorage()}>Submit</Button>
                </div> 
              }
            </Modal.Body>
          </Modal.Dialog>
        </div>
      }
                  {popUp && <Container>
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
                                            <div className={Popstyles.docText}>
                                            Same Aadhaar number already Entered!
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
            </Container>}

      {/* <pre>{JSON.stringify(AadharNumberDetails, null, 2)}</pre> */}
      {/* <pre>{JSON.stringify(AadharPopupMemory,null,2)}</pre> */}
      {/* <pre>{JSON.stringify(ExistingAadharList,null,2)}</pre> */}
      {/* <pre>{JSON.stringify(PartyDetails, null, 2)}</pre> */}
    </div>
  );
}

export default AadharPopup;
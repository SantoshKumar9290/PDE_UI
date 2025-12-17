import { Fragment, useEffect, useState, useRef } from 'react';
import TableInputText from '../src/components/TableInputText';
import TableText from '../src/components/TableText';
import { useRouter } from 'next/router';
import { get } from 'lodash';
import styles from '../styles/pages/Forms.module.scss';
// import ReCAPTCHA from 'react-google-recaptcha';
import { UseGetAadharDetails, UseGetAadharOTP, titdcoLogin, useUserLoginData, UseReportDownload, APIICLogin, getsroListData, UseGetVSWSList, UseGetVSWSEmpList, UseVSWSSendingMobileOTP, VSWSLogin, SaveAadharConsentDetails } from '../src/axios';
import { useAppSelector, useAppDispatch } from '../src/redux/hooks';
import { PopupAction } from '../src/redux/commonSlice';
import { resetLoginDetails, saveLoginDetails, userLogin, verifyUser } from '../src/redux/loginSlice';
import Image from 'next/image';
import { Col, Container, Row, Modal } from 'react-bootstrap';
import { CallingAxios, encodeBase64, ShowMessagePopup, useVoiceSequenceAadhaarConsent2 } from '../src/GenericFunctions';
import TableInputRadio from '../src/components/TableInputRadio3';
import { encryptWithAES, Consent1, Consent2_Eng, Consent2_Tel } from '../src/utils';
import Button from '../src/components/Button';
import Head from 'next/head';
import TableDropdown from '../src/components/TableDrpDown';
import Accordion from 'react-bootstrap/Accordion';
import { Volume2, PauseCircle, PlayCircle } from "lucide-react";



const initialLoginDetails = {
  email: '',
  mobile: '',
  aadhaar: '',
  aadhaarHash: '',
  loginMode: 'Email ID',
  titdco: '',
  crda:'',
  sro: "",
  vswsvillage: "",
  vswsemployee: "",
  APIIC:'',
  loginId:''
}


const LoginPage = () => {
  const dispatch = useAppDispatch()
  const router = useRouter();

  const [LoginDetails, setLoginDetails] = useState(initialLoginDetails);
  const [FormError, setFormError] = useState<any>('');
  const [sentOTP, setSentOTP] = useState(false);
  const [otp, setOTP] = useState('');
  const [aadhaarOTPResponse, setAadhaarOTPResponse] = useState({});
  const [loading, setLoading] = useState(false);
  const [sroDetails, setSroDetails] = useState([]);  
  const [vswsVillageDetails, setVswsVillageDetails] = useState([]);
  const [vswsVillageEmpList, setVswsVillageEmpList] = useState([]);  
  // const [isChecked, setisChecked] = useState(false)

  const [showGetOtpButton, setShowGetOtpButton] = useState(true);  
  const [showAadharConsentConfirmPopup, setShowAadharConsentConfirmPopup] = useState(false);
  const { audioRef, voiceStatus, isTeluguMode, toggleVoice, resetVoiceState } = useVoiceSequenceAadhaarConsent2();
  const [aadharConsentCheckboxChecked, setAadharConsentCheckboxChecked] = useState(false);

  const verifyUserData = useAppSelector(state => state.login.verifyUserData);
  const verifyUserLoading = useAppSelector(state => state.login.verifyUserLoading);
  const verifyUserMsg = useAppSelector(state => state.login.verifyUserMsg);

  const loginData = useAppSelector(state => state.login.loginData);
  const loginLoading = useAppSelector(state => state.login.loginLoading);
  const loginMsg = useAppSelector(state => state.login.loginMsg);


  const ValidMobile = (value: any) => {
    if (value != "") {
      var regex = /^[6789]\d{9}$/;
      if (!regex.test(value)) {
        ShowMessagePopup(false, "Enter Valid Mobile Number", "");
        return false;
      }
      else {
        return true;
      }
    }
    return false;
  }

  const getSroList = async () => {
    try {
      const response = await CallingAxios(getsroListData());
      if (response.status) {
        const mappedData = response.data.map((item: any) => ({
          SR_CD: item.SR_CD,
          SR_NAME: item.SR_NAME,
        }));
        setSroDetails(mappedData);
      } else {
        ShowAlert(false, "SRO Details Fetched Failed");
      }
    } catch (error) {
      console.error('Failed to fetch SRO list', error);
    }
  }

  const CallGetVSWSVillageList = async (SR_CD: any) => {
    let result = await CallingAxios(UseGetVSWSList(SR_CD));
    if (result.status) {
      const mappedData = result.data.map((item: any) => ({
        VSWS_VILL_ID: item.VILLAGE_CODE,      
        VSWS_VILL_NAME: item.VILLAGE_NAME
      }));
      setVswsVillageDetails(mappedData);
    } else {
      setVswsVillageDetails([]);
      ShowAlert(false, "VSWS Village Details Fetched Failed");
    }
  };

  const CallGetVSWSEmpList = async (VILLAGE_CODE: any) => {
    let result = await CallingAxios(UseGetVSWSEmpList(VILLAGE_CODE));    
    if (result.status) {
      const mappedData = result.data.map((item: any) => ({
      VSWS_VILL_EMP_ID: item.EMPL_ID,       
      VSWS_VILL_EMP_NAME: item.EMPL_NAME,
      VSWS_VILL_EMP_MOBILE_NO: item.MOBILE_NO,
      WEBLAND_CODE: item.WEBLAND_CODE 
      }));
      setVswsVillageEmpList(mappedData);
    } else {
      setVswsVillageEmpList([]);
      ShowAlert(false, "VSWS EMPLOYEE Details Fetched Failed");
    }
  };

  const onChange = async  (e: any) => {
    let addName = e.target.name;
    let addValue = e.target.value;
    let TempDetails = { ...LoginDetails }
    if (e.target.name === 'loginMode') {
      TempDetails = { ...initialLoginDetails, loginMode: e.target.value, email: "", mobile: "", aadhaar: "", aadhaarHash: "", titdco: '',crda:'', APIIC:'', sro: "", vswsvillage: "", vswsemployee: "", };
      setShowGetOtpButton(true);
      if (e.target.value === 'VSWS') {
        getSroList();
      }
    } else if (addName === 'sro') {
      if (addValue) {      
        await CallGetVSWSVillageList(addValue);
        setVswsVillageEmpList([]);
      } else {
        setVswsVillageDetails([]);
        setVswsVillageEmpList([]);
      }  
      TempDetails = { ...TempDetails, sro: addValue, vswsvillage: "", vswsemployee: "", mobile: "" };
    } else if (addName === 'vsws') {
      if (addValue) {     
        await CallGetVSWSEmpList(addValue);
      } else {
        setVswsVillageEmpList([]);
      }
      TempDetails = { ...TempDetails, vswsvillage: addValue, vswsemployee: "", mobile: "" };
    } 
    else if (addName === 'vswsemployee') {      
      const selectedEmp = vswsVillageEmpList.find((emp: any) => String(emp.VSWS_VILL_EMP_ID) === String(addValue));
      TempDetails = { ...TempDetails, vswsemployee: addValue, mobile: selectedEmp ? selectedEmp.VSWS_VILL_EMP_MOBILE_NO : "" };
    }
    else if (addName === 'aadhaarHash') {
      addValue = addValue.replace(/[^0-9 x]/g, "");
      let value;
      if (TempDetails?.aadhaar?.length > addValue?.length) {
        value = "";
        addValue = "";
        setShowGetOtpButton(true);
      } else if (addValue != "") {
        value = (TempDetails.aadhaar ? TempDetails.aadhaar : '') + addValue[addValue.length - 1];
      }
      addValue = addValue.replace(/\d(?=\d{3})/g, "x");
      TempDetails = { ...TempDetails, aadhaar: value }
      if (value?.length === 12) {
        setShowAadharConsentConfirmPopup(true);
      } else if (value?.length > 0 ) {
        setShowGetOtpButton(false);
        setAadharConsentCheckboxChecked(false);
      }
    }
    else if (addName === 'email') {
      if (addValue.length > 50) {
        addValue = TempDetails.email;
      }
    }
    else if (addName === 'mobile') {
      if ((addValue && (isNaN(addValue) || (['.', '-'].some(i => addValue.includes(i))))) || addValue.length > 10) {
        addValue = TempDetails.mobile
      }
    }
    else if (addName === 'crda') { 
    if ((addValue && (isNaN(addValue) || (['.', '-'].some(i => addValue.includes(i))))) || addValue.length > 10) {
      addValue = TempDetails.crda;
      }
    }
    setLoginDetails({ ...TempDetails, [addName]: addValue });
    if (FormError) {
      setFormError('');
    }
  }

  const backToLogin = () => {
    setLoginDetails({ ...initialLoginDetails });
    setOTP('');
    setSentOTP(false)
  }

  const redirectToPage = (location: string) => {
    router.push({
      pathname: location,
      // query: query,
    })
  }

  useEffect(() => {
    localStorage.clear();
    const resetLoginDetails = {
      loginId: '',
      loginEmail: '',
      loginName: '',
      token: '',
      appNo: '',
      status: '',
      loginType: '',
      sroOffice: '',
      sroNumber: '',
      loginMode: '',
    }
    dispatch(saveLoginDetails(resetLoginDetails))
    // let loginEmail = FindCookie("loginEmail");
    // let loginPassword = FindCookie("loginPassword");
    // console.log(loginEmail, loginPassword);
    // setLoginDetails({...LoginDetails,loginEmail,loginPassword})
  }, [])

  // const FindCookie = (Key: string) => {
  //   let data: any = decodeURIComponent(document.cookie);
  //   data = data.split(';');
  //   for (let i in data) {
  //     let SingleData: any = data[i]
  //     SingleData = SingleData.split('=');
  //     if (SingleData[0] == Key) {
  //       return SingleData[1]
  //     }
  //   }
  //   return "";
  // }

  const callTitdcologin = async () => {
    let result = await titdcoLogin(LoginDetails.titdco);
    if (result.status) {
      let query = {
        loginEmail: result.data.loginEmail,
        loginName: result.data.loginName,
        token: result.data.token.token,
        loginType: result.data.loginType,
        status: result.data.status,
        lastLogin: result.data.lastLogin,
        loginId:result.data.userId
      }
      localStorage.setItem("LoginDetails", JSON.stringify(query));
      dispatch(saveLoginDetails(query));
      router.push('/ServicesPage')
    } else {
      ShowAlert(false, result.message);
    }
  }
  const callAPIICLogin = async()=>{
    let result = await APIICLogin(LoginDetails.titdco);
    if (result.status) {
      let query = {
        loginEmail: result.data.loginEmail,
        loginName: result.data.loginName,
        token: result.data.token.token,
        loginType: result.data.loginType,
        status: result.data.status,
        lastLogin: result.data.lastLogin,
        loginId:result.data.userId
      }
      localStorage.setItem("LoginDetails", JSON.stringify(query));
      dispatch(saveLoginDetails(query));
      router.push('/ServicesPage')
    } else {
      ShowAlert(false, result.message);
    }
  }
  const onSubmit = async(e: any) => {
    e.preventDefault();
    if(LoginDetails.loginMode === 'APIIC'){
      callAPIICLogin()
    }else{
    if (LoginDetails.loginMode === 'Tidco') {
      callTitdcologin()
    } else if (LoginDetails.loginMode === 'VSWS') {
      let resp = await UseVSWSSendingMobileOTP({ mobile: LoginDetails.mobile});
      if (resp.status) {
        setSentOTP(true);
        ShowAlert(true, "OTP sent successfully");
      } else {
        ShowAlert(false, resp.message || "Failed to send OTP");
      }
    } else {
      let myError: any = validate(LoginDetails);
      if (!myError) {
        let obj: any = {};
        if (LoginDetails.loginMode === 'Email ID') {
          obj.type = 'email';
          obj.loginEmail = LoginDetails.email;
        } else if (LoginDetails.loginMode === 'Mobile Number') {
          obj.type = 'mobile';
          obj.loginMobile = LoginDetails.mobile;
        } else if (LoginDetails.loginMode === 'CRDA') {
          obj.type = 'mobile';
          obj.loginCRDA = LoginDetails.crda; 
        } 
        else {
          obj.type = 'aadhar';
          obj.aadhar = encryptWithAES(`${LoginDetails.aadhaar}`);
        }
        // window.alert(JSON.stringify(myError));
        dispatch(verifyUser(obj))
      }
    }
    // if (Object.keys(myError).length === 0) {
    //   UserLoginAction();
    // }
   }
  }

  useEffect(() => {
    if (Object.keys(verifyUserData).length) {
      if (LoginDetails.loginMode !== 'Aadhaar Number') {
        ShowAlert(true, 'OTP Sent Successfully');
        setSentOTP(true);
      } else {
        (async () => {
          setLoading(true);
          let result = await UseGetAadharOTP(encodeBase64(LoginDetails.aadhaar));
          if (result && result.status === 'Success') {
            setSentOTP(true)
            ShowAlert(true, 'OTP Sent Successfully');
            // setLoading(false)
            setAadhaarOTPResponse(result)
          } else {
            ShowAlert(false, get(result, 'message', "Aadhaar API failed"))
            setAadhaarOTPResponse({});
          }
          setLoading(false)
        })()
      }
    }
  }, [verifyUserData])

  useEffect(() => {
    if (verifyUserMsg) {
      ShowAlert(false, verifyUserMsg);
    }
  }, [verifyUserMsg])

  const validate = (values: any) => {
    // window.alert(values.loginMode)
    let error = '';
    if ((values.loginMode === 'Mobile Number' || values.loginMode === 'VSWS') && values.mobile.length == 10 && (values.mobile[0] == "0")) {
      // window.alert("error detected")
      error = "Please enter a valid mobile number."
    }else if (values.loginMode === 'CRDA' && values.crda.length == 10 && (values.crda[0] == "0")) {
      error = "Please enter a valid mobile number."
    }else if (values.loginMode === 'Aadhaar Number' && values.aadhaar.length < 12) {
      error = "Please enter a valid aadhaar number."
    }
    setFormError(error)
    return error;
  }

  const UserLoginAction = async () => {

    try {
      let data = {
        // loginEmail: LoginDetails.loginEmail,
        // loginPassword: LoginDetails.loginPassword
      }

      // need to remove below 2 lines
      // dispatch(saveLoginDetails(LoginDetails));

      await CallLogin2(data);
    } catch (error) {
      ShowAlert(false, "Error:" + error);
    }
  }

  const CallLogin2 = async (value: any) => {
    let result: any = await CallingAxios(useUserLoginData(value));
    if (result && result.status) {
      let query = {
        loginEmail: result.data.loginEmail,
        loginName: result.data.loginName,
        token: result.data.token,
        loginType: result.data.loginType,
        status: result.data.status,
        loginId:result.data.userId,
      }
      localStorage.setItem("LoginDetails", JSON.stringify(query))
      dispatch(saveLoginDetails(query));
      router.push('/ServiceLandingPage')
    } else {
      ShowAlert(false, "Login Failed");
    }
  }

  const VSWSLoginCall = async (obj) => {
    let result: any = await CallingAxios(VSWSLogin(obj));    
    if (result && result.status) {
      let query = {
        loginName: result.data.loginName,
        loginEmail: result.data.loginEmail,
        token: result.data.token.token,
        loginType: result.data.loginType,
        status: result.data.status,
        loginId:result.data.loginId,
        loginSro:result.data.loginSro,
        loginMode:result.data.loginMode,
        userId:String(result.data.loginId),
        villCode:result.data.villCode,
        webCode:result.data.webCode
      }
      localStorage.setItem("LoginDetails", JSON.stringify(query))
      dispatch(saveLoginDetails(query));
      router.push('/ServiceLandingPage')
    } else {
      ShowAlert(false, "Login Failed");
    }
  }

  const ShowAlert = (type, message, time?: number) => { dispatch(PopupAction({ enable: true, type: type, message: message, time: time ? time : null })); }

  const callLoginAPI = () => {
    let obj: any = {
      loginOtp: otp
    };
    if (LoginDetails.loginMode === 'Email ID') {
      obj.type = 'email';
      obj.loginEmail = LoginDetails.email;
    } else if (LoginDetails.loginMode === 'Mobile Number') {
      obj.type = 'mobile';
      obj.loginMobile = LoginDetails.mobile;
    } 
    else if (LoginDetails.loginMode === 'CRDA') {
      obj.type = 'mobile';
      obj.loginCRDA = LoginDetails.crda;
    }
     else if (LoginDetails.loginMode === 'VSWS') {
      const selectedEmp = vswsVillageEmpList.find(
        (emp: any) => String(emp.VSWS_VILL_EMP_ID) === String(LoginDetails.vswsemployee)
      );
      const selectedVswsVillage = vswsVillageDetails.find(
        (vill: any) => String(vill.VSWS_VILL_ID) === String(LoginDetails.vswsvillage)
      );      
      obj.type = 'mobile';
      obj.loginMobile = LoginDetails.mobile;
      obj.loginName = selectedEmp.VSWS_VILL_EMP_NAME;
      obj.loginId = selectedEmp.VSWS_VILL_EMP_ID;
      obj.loginMode = LoginDetails.loginMode;
      obj.loginSro = LoginDetails.sro;
      obj.userId = String(selectedEmp.VSWS_VILL_EMP_ID);
      obj.villCode = selectedVswsVillage.VSWS_VILL_ID
      obj.webCode = selectedEmp.WEBLAND_CODE
    }
     else {
      obj.type = 'aadhar';
      obj.aadhar = encryptWithAES(LoginDetails.aadhaar);
    }
    if( LoginDetails.loginMode === 'VSWS'){
      VSWSLoginCall({...obj})
    }
    else{
    dispatch(userLogin({ ...obj }))
    }
  }

  const onLogin = async (e) => {
    e.preventDefault();
    if (LoginDetails.loginMode === 'Aadhaar Number') {
      setLoading(true);
      let result: any = await UseGetAadharDetails({
        aadharNumber: encodeBase64(LoginDetails.aadhaar),
        transactionNumber: get(aadhaarOTPResponse, 'transactionNumber', ''),
        otp: otp
      });
      if (result.status && result.status === 'Success') {
        callLoginAPI()
        let data = {
          APP_ID: "",
          PARTY_NAME: result.userInfo.name, 
          CONSENT_ACCEPT: aadharConsentCheckboxChecked ? "Y" : "N",
          PARTY_TYPE: `USER - ${LoginDetails.loginMode}`,
          TYPE: "PDE Login",
          SOURCE_NAME: "PDE",
          AADHAR_CONSENT: 2
        }
        if (sentOTP){
          const response = await CallingAxios(SaveAadharConsentDetails(data));
        }
      } else {
        ShowAlert(false, get(result, 'message', 'Aadhaar API Failed'));
      }
      setLoading(false)
    } else {
      callLoginAPI()
    }
  }

  useEffect(() => {
    if (Object.keys(loginData).length) {
      let query = {
        loginEmail: loginData.data.loginEmail,
        loginName: loginData.data.loginName,
        token: loginData.data.token.token,
        loginType: loginData.data.loginType,
        status: loginData.data.status,
        lastLogin: loginData.data.lastLogin,
        loginId:loginData.data.userId,
        loginMode: LoginDetails.loginMode
      }
      localStorage.setItem("LoginDetails", JSON.stringify(query));
      dispatch(saveLoginDetails(query));
      router.push('/ServiceLandingPage')
    }
  }, [loginData])

  useEffect(() => {
    if (loginMsg) {
      ShowAlert(false, loginMsg);
    }
  }, [loginMsg])
  //   const downloadReport = async () => {

  //     setTimeout(() => {
  //       fetchFile("http://" + process.env.BACKEND_URL + "/pdfs/userManual.pdf");
  //     }, 1000);

  //   }

  const downloadReport = async (type: any) => {
    let info: any = {
      type: type,
      applicationId: "1",
      stamp: "N"
    }
    let result: any = await CallingAxios(UseReportDownload(info));

    if (result.status) {
      setTimeout(() => {
        fetchFile(result.data);
      }, 1000);
    }
  }
  const fetchFile = (url: any) => {
    fetch(url).then(res => res.blob()).then(file => {

      const href = window.URL.createObjectURL(new Blob([file]));
      const link = document.createElement('a');
      link.href = href;
      link.setAttribute('download', 'userManual.pdf'); //or any other extension
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);

    }).catch((err) => {
      console.log(err)
      ShowMessagePopup(false, "Failed to download file!", "");

    });

  }
  // const OnsetRemember = (e: any) => {
  //   setisChecked(!isChecked);
  //   let loginEmail = "";
  //   let loginPassword = "";
  //   if (!isChecked) {
  //     loginEmail = LoginDetails.loginEmail;
  //     loginPassword = LoginDetails.loginPassword;
  //   }
  //   document.cookie = "loginEmail=" + loginEmail + ";path=http://localhost:3000;"
  //   document.cookie = "loginPassword=" + loginPassword + ";path=http://localhost:3000;"
  // }

  useEffect(() => {
    return () => {
      dispatch(resetLoginDetails())
    }
  }, [])

  useEffect(() => {
    if (!showAadharConsentConfirmPopup) {
      resetVoiceState();
    };
  }, [showAadharConsentConfirmPopup]);

  const handleAadharConsentConfirmYes = () => {
    if (!aadharConsentCheckboxChecked) {
      ShowAlert(false, "Please Select the Check box");
      return;
    }
    setShowAadharConsentConfirmPopup(false);
    setShowGetOtpButton(true); // show Send OTP after confirmation
  };

  const handleAadharConsentConfirmNo = () => {
    setShowAadharConsentConfirmPopup(false);
    setAadharConsentCheckboxChecked(false);
    setShowGetOtpButton(true);
    setLoginDetails((prev) => ({
      ...prev,
      aadhaar: "",
      aadhaarHash: ""
    }));
  };
  return (
    <div className='PageSpacing loginpageSpace'>
      {/*
      <div onClick={() => downloadReport("userManual")}>
        <div className='userManual'>
          <p className="proceedButton userBtn">USER MANUAL</p>
        </div>
      </div>
  */}
      

      <Head>
        <title>Login - Public Data Entry</title>
      </Head>
      <div className={styles.RegistrationMain}>
        <Container>
          <Row className='d-flex loginRow align-items-center'>
            {/* <Col lg={12} className='text-center'>
				<div className={styles.RegistrationInput}>
				<h2 className={styles.mainHeading}>Public Data Entry</h2>
				</div>
				</Col> */}
            <Col lg={6} md={12} xs={12} className='loginTextCon'>
              <div className={styles.regImageInfo}>
                {/* <Image alt="" width={340} height={400} src="/PDE/images/loginimg.svg" className={styles.image} /> */}
                {/* <Image alt='' width={922} height={610} className={styles.image} src="/PDE/images/login-img.png" />
						*/}


                <Container >
                  <Row>
                    <Col className="loginHome">
                      <div>
                        <div>
                        </div>
                        <div id="scroll-container">

                          <h2 className="userText mainTitle">
                            <u className='textFlow'>CARD PRIMME Process Flow</u>
                            <p className="textSubTitle">(Property Registration Integration Mutation Made-Easy)</p>
                          </h2>
                          {/* <hr/> */}
                          <div id="scroll-text1">
                            <ol>
                              <li>
                                {/* In the shortest information ie e-mail or mobile no. Or the user can get the Aadhaar information and register in the PDE. */}
                                <span>Enter the URL <a href='http://registration.ap.gov.in'> http://registration.ap.gov.in</a> and Click on PRIMME.
                                </span></li>
                              <li>
                                {/* One can login to PDE through only one OTP. */}
                                <span>Existing Users log in through email or mobile or aadhaar through OTP.</span></li>
                              <li>
                                {/* User has to select type of deed like Purchase / Donation or Deed / Mortgage. */}
                                <span>New Users should register for the first to create the document.</span></li>
                              <li>
                                {/* The user has to select the sub-registrar office in which he wants to register his deed. */}
                                <span>Fill in the Mandatory fields and follow the Instructions to register
                                  4(a) Click on the document to start data entry.</span></li>
                              <li>
                                {/* The user has to enter the date of purchase of the stamp paper and the date on which the deed is to be signed (date to be executed) and the value of the deed i.e. the value at which the seller and buyer bought the property. */}
                                <span>User can create New Document by clicking on the button..</span></li>
                              <li>
                                {/* As soon as the user submits the deed details to his link, the details of sold / bought / property for that deed taluk will be displayed for selection. This convenience saves time in entering all the property details. */}
                                <span>User can select public data entry or public data entry with document generation.</span></li>
                              <li>
                                {/* The user can select only the details required for the current deed from the Property Details and Purchaser Details link Deed list and proceed further. */}
                                <span>User can select the type of Registration and nature of the document (Sale(01-01)/Mortgage(02-02)/Gift(03-02)).</span></li>
                              <li>
                                {/* Is the property blacklisted as soon as the user selects the details he wants? or ! The current market values are shown along with the details. */}
                                <span>User can select the Sub register office (District/Mandel/Village/ SRO), enter consideration value and enter the Date of execution details. (Date of execution/Total stamp paper value/No. of stamp papers/Stamp paper purchase date).</span></li>
                              <li>
                                {/* The user can now submit the details by simply authenticating the details of their purchases with the Aadhaar related OTP. */}
                                <span>User can enter link document (District/ SRO / Link Document Number/Registration Year) to add the executant and property details to the document.</span></li>
                              <li>
                                {/* The user can also add some other property details, if the property is agricultural land through revenue (Webland) service, if non-agricultural land especially houses are connected to municipal (CDMA) services. */}
                                <span>User to add or edit executants/Mortgager/Donor and the claimant/mortgagee/Donee and also add “Representative”.</span></li>
                              <li>
                                {/* The above-mentioned points are useful for conveying the deed details to the respective Sub-Registrar Offices. */}
                                <span>If user wants to enter Input parameters for the Schedule of the property, User should select Jurisdiction Registration District and SRO where the property is located. Select Rural for agricultural land and Select Urban for a plot, a House, or a Flat.</span></li>
                              <li>
                                {/* A few more items need to be added to prepare the deed. */}
                                <span>User can also add covenants and attach enclosures.</span></li>
                              <li>
                                {/* The payment details for the exchange of property between the seller and the buyer should be included. */}
                                <span>User can Book a Slot on the available time, make a Payment, and generate Check slip(Entered document details), acknowledgment for the time slot booked, generate an English document or generate a Telugu document and download Form 60/61(if PAN is not available) from reports.</span></li>
                              <li>
                                {/* The important aspects of the document and the agreement conditions (agreement conditions) were authenticated and incorporated in the PDE. */}
                                <span>Fill all the required information correctly.</span></li>
                              <li>
                                {/* Apart from that, the user is given an option in the PDE to include some other items or additional covenants. It may include covenants between the parties. */}
                                <span>Sixteen digit <text className='applicationId'>Application ID Number</text> is generated. <b>Please Note down the number </b> and carry this to SRO office.</span></li>
                              <li>
                                {/* The user can also attach the necessary relevant copies to his deed. */}
                                <span>Entered Information will be available at SRO office for Registration.</span></li>
                              <li>
                                {/* After obtaining and submitting all the details, the value of the payment made between the parties is compared with the market values and stamp duty, fee and user charges are included in the PDE. */}
                                <span>This data entry does not mean that document is accepted for registration. SRO officer has authority to Accept/reject the document or he may ask the parties to change the document details as per the rule.</span></li>
                            </ol>
                          </div>
                          <div>
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Container>

              </div>
            </Col>
            <Col lg={6} md={12} xs={12} className='rightLoginCol'>
              <div className={`${styles.RegistrationInput} ${styles.LoginPageInput} loginFormMain`}>
                {
                  sentOTP ?
                    <form autoComplete="off" onSubmit={onLogin} className={(loading || loginLoading) ? styles.disableForm : ''}>

                      <h2 className="p-0"><button className={styles.rightButton} onClick={backToLogin} type='button'><Image src="/PDE/images/leftArrow.svg" height={16} width={16} /></button> Enter OTP</h2>
                      <div className="mb-3 OtpInput">
                        <TableInputText type='text' placeholder='Enter OTP' maxLength={6} required={true} otpChar={false} splChar={false} name='otp' value={otp} onChange={(e) => {
                          setOTP(e.target.value)
                        }} />
                      </div>
                      <Row className="p">
                        <Col lg={4} md={6} xs={6}>
                          <div className={styles.pdesingleColumn}>
                            {/* <Button status={loading || loginLoading} type='submit' btnName='Login' disabled={verifyUserLoading || loading}></Button> */}
                            <button className='proceedButton'>Login</button>
                          </div>
                        </Col>
                        <Col lg={8} md={6} xs={6} className={styles.flexColumn}>
                          <div className={styles.flexColumn}>
                            <span className={`${styles.checkText} ${styles.scheckText}`}>Did not receive OTP?</span>
                            <div onClick={onSubmit}
                              // className={`${styles.checkText} ${styles.RegText}`}
                              className={styles.rightButton}
                            // disabled={verifyUserLoading || loading}
                            >Resend OTP</div>
                          </div>
                        </Col>
                      </Row>

                    </form>

                    :
                    <form autoComplete="off" className={(verifyUserLoading || loading) ? styles.disableForm : ''} onSubmit={onSubmit}>
                      <div className='text-start'>
                        <h2 className={styles.mainHeading}>CARD PRIMME</h2>
                      </div>
                      <h2 className="p-0 userText">User Login</h2>
                      <div className='p'>
                        <TableInputRadio required={true} options={[{ 'label': "Email ID" }, { 'label': "Mobile Number" }, { 'label': 'Aadhaar Number' }, { 'label': 'Tidco' },{ 'label': 'CRDA' },{ 'label': 'APIIC' },{ 'label': 'VSWS' }]} onChange={onChange} name='loginMode' defaultValue={LoginDetails.loginMode} />
                      </div>
                      <div className="mb-3">
                        {
                          LoginDetails.loginMode === 'Email ID' 
                          ? 
                            <>
                              <TableInputText type='email' emailChar={false} placeholder='Enter Email ID' required={true} name='email' value={LoginDetails.email} onChange={onChange} />
                            </>
                          : 
                          LoginDetails.loginMode === "Mobile Number" 
                          ? 
                            <>
                              <TableInputText type='text' placeholder='Enter Mobile Number' required={true} name='mobile'
                                // onBlurCapture={e => { e.preventDefault(); if (!ValidMobile(e.target.value)) { setLoginDetails({ ...LoginDetails, mobile: '' }) } }} 
                              value={LoginDetails.mobile} onChange={onChange} />
                            </>
                          : 
                          LoginDetails.loginMode === "CRDA" 
                          ? 
                            <>
                              <TableInputText type='text' placeholder='Enter Mobile Number' required={true} name='crda' value={LoginDetails.crda} onChange={onChange} />
                            </>
                          :
                          LoginDetails.loginMode === 'Tidco' || LoginDetails.loginMode === 'APIIC'
                          ?
                            <>
                              <TableInputText type='password' placeholder='Enter password' name='titdco' required={true} value={LoginDetails.titdco} onChange={onChange} />
                            </>
                          :
                          LoginDetails.loginMode === 'VSWS' ?
                            <>
                              <Row>
                                <Col lg={6} md={12} xs={12} className='mb-2'>
                                  <TableText label={"SRO Office"} required={true} LeftSpace={false} />
                                  <TableDropdown required={true} options={sroDetails} name={'sro'} value={LoginDetails.sro}  onChange={onChange} keyName={'SR_NAME'} label={''} errorMessage={''} keyValue={'SR_CD'} />
                                </Col>                              
                                <Col lg={6} md={12} xs={12} className='mb-2'>
                                  <TableText label={"VSWS [గ్రామ/వార్డ్ సచివాలయం]"} required={true} LeftSpace={false} />
                                  <TableDropdown required={true} options={vswsVillageDetails} name={'vsws'} value={LoginDetails.vswsvillage}  onChange={onChange} keyName={'VSWS_VILL_NAME'} label={''} errorMessage={''} keyValue={'VSWS_VILL_ID'} />
                                </Col>
                              </Row>
                              <Row>
                                <Col lg={12} md={12} xs={12} className='mb-2'>
                                  <TableText label={"Employee Name"} required={true} LeftSpace={false} />
                                  <TableDropdown required={true} options={vswsVillageEmpList} name={'vswsemployee'} value={LoginDetails.vswsemployee}  onChange={onChange} keyName={'VSWS_VILL_EMP_NAME'} label={''} errorMessage={''} keyValue={'VSWS_VILL_EMP_ID'} />
                                </Col>
                              </Row>
                              <Row>
                                <Col lg={12} md={12} xs={12} className='mt-2'>
                                  <TableInputText type='text' placeholder='Enter Mobile Number' name='mobile' required={true} value={LoginDetails.mobile} onChange={onChange} disabled/>
                                </Col>
                              </Row>
                            </>
                          :
                            <>
                              <TableInputText type='text' placeholder='Enter Aadhar Number' splChar={false} allowNeg={false} maxLength={12} required={false} name="aadhaarHash" value={LoginDetails.aadhaarHash} onChange={onChange} />
                            </>
                        }
                        {FormError && <span className={styles.warningText}>{FormError}</span>}
                      </div>
                      {/* <div className="p">
								<TableText label={"Password"} required={true} LeftSpace={false} />
								<TableInputText type='password' placeholder='Enter Password' required={true} name='loginPassword' value={LoginDetails.loginPassword} onChange={onChange} />
								<p className={styles.warningText} style={{ color: 'red' }}>{FormErrors.loginPassword}</p>
							</div> */}
                      {/* <div className="p" style={{ width: '100%', transformOrigin: "0 0", marginTop: '1rem' }}> */}
                      {/* <ReCAPTCHA sitekey="<YOUR SITE KEY>" theme="dark" /> */}
                      {/* </div> */}
                      {/* <Row className="p">
								<Col lg={6} md={6} xs={6}>
								<div className='CheckboxInfo'>
									<label className=''><input type="checkbox" /><small className={styles.checkText}> Remember me</small></label>
								</div>

								</Col>
								<Col lg={6} md={6} xs={6} style={{ textAlign: "right" }}><p className={styles.checkText}>Forgot Password?</p></Col>
							</Row> */}
                      {
                        LoginDetails.loginMode === 'Tidco' || LoginDetails.loginMode === 'CRDA' ||LoginDetails.loginMode === 'APIIC'  ?
                          <Row className='p'>
                            <Col lg={2} md={3}>
                              <Button type='submit' btnName='Login'></Button>
                            </Col>
                          </Row>
                          :
                          <Row className="p">
                            <Col lg={3} md={6} xs={6}>
                              {/* <button type='button' onClick={() => { redirectToPage("/LoginSroPage") }} className={`${styles.rightButton} ${styles.sroBtn}`}>SRO Login</button> */}
                            </Col>
                            <Col lg={9} md={6} xs={6}></Col>
                            <Col lg={4} md={6} xs={6}>
                              {showGetOtpButton && (
                                <div className={styles.pdesingleColumn} style={{ cursor: 'pointer' }}>
                                  <Button type='submit' status={verifyUserLoading || loading} btnName="Get OTP"></Button>
                                </div>
                              )}
                            </Col>
                            <Col lg={8} md={6} xs={6} className={styles.flexColumn}>
                              <div className={styles.flexColumn}>
                                <span className={`${styles.checkText} ${styles.scheckText}`}>Don’t have an account?</span>
                                <button type='button' onClick={() => { redirectToPage("/RegistrationPage") }}
                                  // className={`${styles.checkText} ${styles.RegText}`}
                                  className={styles.rightButton}
                                >New Registration!</button>
                              </div>
                            </Col>
                          </Row>
                      }
                    </form>
                }
              </div>
            </Col>
          </Row>
            <div>
              <Modal show={showAadharConsentConfirmPopup} aria-labelledby="contained-modal-title-vcenter" centered className='mutablemodalCon' >
                <Modal.Header className='mutablemodalHeader'>
                  <Row className='w-100'>
                    <Col lg={10} md={10} xs={12}><Modal.Title>Aadhaar Consent Confirmation</Modal.Title></Col>
                    <Col lg={2} md={2} xs={2} className='text-end'>
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
                        <span className="wrong-symbol ms-2 " onClick={handleAadharConsentConfirmNo} style={{color: 'white',fontSize: '18px',cursor: 'pointer',}} title="Go to Back"><b>✖</b></span>
                      </div>
                    </Col>
                  </Row>
                </Modal.Header>
                <Modal.Body className='aadhaarconaccptInfo'>
                  <div>
                    <Accordion defaultActiveKey="0">
                      <Accordion.Item eventKey="0">
                        <Accordion.Body>
                          <div className="form-check mt-3">
                            <input type="checkbox" className="form-check-input" id="confirmCheckbox" checked={aadharConsentCheckboxChecked} onChange={() => setAadharConsentCheckboxChecked(!aadharConsentCheckboxChecked)} />
                            <p>{Consent2_Eng}</p>
                            <p>{Consent2_Tel}</p>
                          </div>
                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <div className={styles.pdesingleColumn}>
                    <Button type='submit' btnName='Yes' onClick={handleAadharConsentConfirmYes}></Button>
                  </div>
                </Modal.Footer>
              </Modal>
            </div>
        </Container>
      </div>
      {/* <pre>{JSON.stringify(LoginDetails, null, 2)}</pre> */}
    </div>

  )
}

export default LoginPage;
import { Fragment, useEffect, useState } from 'react';
import TableInputText from '../src/components/TableInputText';
import TableText from '../src/components/TableText';
import { useRouter } from 'next/router';
import { get } from 'lodash';
import styles from '../styles/pages/Forms.module.scss';
// import ReCAPTCHA from 'react-google-recaptcha';
import { UseGetAadharDetails, UseGetAadharOTP, titdcoLogin, useUserLoginData, UseReportDownload } from '../src/axios';
import { useAppSelector, useAppDispatch } from '../src/redux/hooks';
import { PopupAction } from '../src/redux/commonSlice';
import { resetLoginDetails, saveLoginDetails, userLogin, verifyUser } from '../src/redux/loginSlice';
import Image from 'next/image';
import { Col, Container, Row } from 'react-bootstrap';
import { CallingAxios, ShowMessagePopup } from '../src/GenericFunctions';
import TableInputRadio from '../src/components/TableInputRadio3';
import { encryptWithAES } from '../src/utils';
import Button from '../src/components/Button';
import Head from 'next/head';



const initialLoginDetails :{[key:string]:any,aadhaar:string}= {
  email: '',
  mobile: '',
  aadhaar: '',
  aadhaarHash: '',
  loginMode: 'Email ID',
  titdco: ''
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
  // const [isChecked, setisChecked] = useState(false)

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

  const onChange = (e: any) => {
    let addName = e.target.name;
    let addValue = e.target.value;
    let TempDetails = { ...LoginDetails }
    if (e.target.name === 'loginMode') {
      TempDetails = { ...initialLoginDetails, loginMode: e.target.value, email: "", mobile: "", aadhaar: "", aadhaarHash: "", titdco: '' };
    }
    else if (addName === 'aadhaarHash') {
      addValue = addValue.replace(/[^0-9 x]/g, "");
      let value;
      if (TempDetails?.aadhaar?.length > addValue?.length) {
        value = "";
        addValue = "";
      } else if (addValue != "") {
        value = (TempDetails.aadhaar ? TempDetails.aadhaar : '') + addValue[addValue.length - 1];
      }
      addValue = addValue.replace(/\d(?=\d{3})/g, "x");
      TempDetails = { ...TempDetails, aadhaar: value }
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
      sroNumber: ''
    }
    dispatch(saveLoginDetails(resetLoginDetails))
    let page:any = window.location.pathname.includes("ECLoginPage")? "EC" : "";
    localStorage.setItem("ECPDE",page);

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
  const onSubmit = (e: any) => {
    e.preventDefault();
    if (LoginDetails.loginMode === 'Tidco') {
      callTitdcologin()
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
        } else {
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

  useEffect(() => {
    if (Object.keys(verifyUserData).length) {
      if (LoginDetails.loginMode !== 'Aadhaar Number') {
        ShowAlert(true, 'OTP Sent Successfully');
        setSentOTP(true);
      } else {
        (async () => {
          setLoading(true);
          let result = await UseGetAadharOTP(btoa(LoginDetails.aadhaar));
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
    if (values.loginMode === 'Mobile Number' && values.mobile.length == 10 && (values.mobile[0] == "0")) {
      // window.alert("error detected")
      error = "Please enter a valid mobile number."
    } else if (values.loginMode === 'Aadhaar Number' && values.aadhaar.length < 12) {
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
        loginId:result.data.userId
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
    } else {
      obj.type = 'aadhar';
      obj.aadhar = encryptWithAES(LoginDetails.aadhaar);
    }
    dispatch(userLogin({ ...obj }))
  }

  const onLogin = async (e) => {
    e.preventDefault();
    if (LoginDetails.loginMode === 'Aadhaar Number') {
      setLoading(true);
      let result: any = await UseGetAadharDetails({
        aadharNumber: btoa(LoginDetails.aadhaar),
        transactionNumber: get(aadhaarOTPResponse, 'transactionNumber', ''),
        otp: otp
      });
      if (result.status && result.status === 'Success') {
        callLoginAPI()
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
        loginId:loginData.data.userId
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
                            <u className='textFlow'>Statement</u>
                          </h2>
                          {/* <hr/> */}
                          <div id="scroll-text1">
                          <ol>
                            <li>The long awaited dream, enabling the Citizens to search on their own the Encumbrance on any property registered in Sub Registrar Offices has been made a practical reality with the advent of Information Technology. Now citizens can search for Encumbrance on 24X7 basis from anywhere through the medium of Internet.</li>
                            <li>The Source for generating encumbrance details for self-search and encumbrance certificate obtained in Sub Registrar Office is same. Hence for all practical purposes both are same. However, citizens who need ink signed Encumbrance certificate should approach SRO concern.</li>
                            <li>Online eEC is available for transaction post 01-01-1983 only. Hence if citizens require Encumbrance certificate prior to 01-01-1983, they should approach SRO office concern.</li>
                            <li><span>Search for eEC can be made on : </span>
                              <ol>
                                <li>Document Number and Year of Document OR</li>
                                <li>House Number or Old House Number or Apartment name situated in a City/ Town/Village with optional Flat Number and Colony/Locality/Habitation OR</li>
                                <li>Survey number in a Revenue Village and optionally described by a Plot number.</li>
                                <li>District and SRO office selection is mandatory under all options.</li>
                              </ol>
                            </li>
                            <li>Period of search is controlled as per the availability of data.</li>
                            <li>Users are advised to enter the house number following the standard format as Ward - Block - Door NO / Bi no. for better results.</li>
                            <li>As the data describing the property is not well structured and standardized due to legacy data and variation in description of the same property with respect to time because of changes in the classification of property, a probabilistic search is made and that may result in display of multiple results some of which may not be of any interest to the user. User should select the relevant entry for generating the statement on Encumbrances.</li>
                            <h2 className="userText mainTitle">
                            <u className='textFlow'>Disclaimer</u>
                          </h2>
                            <li>The encumbrances shown in the eEC are those discovered with reference to the description of properties furnished by the applicants at the time of Registration.</li>
                            <li>All efforts are made for accuracy of data. However in case of any conflict, original data shall prevail.</li>
                            <li>In case system responds by “Data Not Found”, for confirmation approach SRO concern.</li>
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
                        <h2 className={styles.mainHeading}>e-Encumbrance Service</h2>
                      </div>
                      <h2 className="p-0 userText">User Login</h2>
                      <div className='p'>
                        <TableInputRadio required={true} options={[{ 'label': "Email ID" }, { 'label': "Mobile Number" }, { 'label': 'Aadhaar Number' }, { 'label': 'Tidco' }]} onChange={onChange} name='loginMode' defaultValue={LoginDetails.loginMode} />
                      </div>
                      <div className="mb-3">
                        {
                          LoginDetails.loginMode === 'Email ID' ? <>
                            <TableInputText type='email' emailChar={false} placeholder='Enter Email ID' required={true} name='email' value={LoginDetails.email} onChange={onChange} />
                          </>
                            : LoginDetails.loginMode === "Mobile Number" ? <>
                              <TableInputText type='text' placeholder='Enter Mobile Number' required={true} name='mobile'
                                // onBlurCapture={e => { e.preventDefault(); if (!ValidMobile(e.target.value)) { setLoginDetails({ ...LoginDetails, mobile: '' }) } }} 
                                value={LoginDetails.mobile} onChange={onChange} />
                            </>
                              :
                              LoginDetails.loginMode === 'Tidco' ?
                                <>
                                  <TableInputText type='password' placeholder='Enter password' name='titdco' required={true} value={LoginDetails.titdco} onChange={onChange} />
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
                        LoginDetails.loginMode === 'Tidco' ?
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
                              <div className={styles.pdesingleColumn} style={{ cursor: 'pointer' }}>
                                <Button type='submit' status={verifyUserLoading || loading} btnName="Get OTP"></Button>
                              </div>
                            </Col>
                            <Col lg={8} md={6} xs={6} className={styles.flexColumn}>
                              <div className={styles.flexColumn}>
                                <span className={`${styles.checkText} ${styles.scheckText}`}>Don’t have an account?</span>
                                <button type='button' onClick={() => { redirectToPage("/ECRegistrationPage") }}
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
        </Container>
      </div>
      {/* <pre>{JSON.stringify(LoginDetails, null, 2)}</pre> */}
    </div>

  )
}

export default LoginPage;
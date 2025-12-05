import { Fragment, useState, useEffect } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import styles from '../styles/pages/Forms.module.scss';
import Image from 'next/image';
import { get } from 'lodash';
import TableInputText from '../src/components/TableInputText';
import TableText from '../src/components/TableText';
import { useRouter } from 'next/router';
import { useAppSelector, useAppDispatch } from '../src/redux/hooks';
import { resetLoginDetails, saveLoginDetails, signUp, verifyUserReg } from '../src/redux/loginSlice';
import { PopupAction } from '../src/redux/commonSlice';
import { useEmailVerify, UseGetAadharDetails, UseGetAadharOTP ,UseReportDownload} from '../src/axios';
import { CallingAxios, ShowMessagePopup } from '../src/GenericFunctions';
import { encryptWithAES, NameValidation } from '../src/utils';
import Button from '../src/components/Button';
import Head from 'next/head';

const initialLoginDetails = {
    loginType: 'USER',
    loginName: '',
    loginEmail: '',
    loginMobile: '',
    aadhar: '',
    aadharHash: '',
}


const RegistrationPage = () => {

    const dispatch = useAppDispatch()
    const router = useRouter();
    const [LoginDetails, setLoginDetails] = useState(initialLoginDetails);
    const [FormErrors, setFormErrors] = useState<any>({});
    const [sentOTP, setSentOTP] = useState(false);
    const [otp, setOTP] = useState('');
    const [loading, setLoading] = useState(false);

    const verifyUserRegData = useAppSelector((state) => state.login.verifyUserRegData);
    const verifyUserRegLoading = useAppSelector((state) => state.login.verifyUserRegLoading);
    const verifyUserRegMsg = useAppSelector((state) => state.login.verifyUserRegMsg);

    const signUpData = useAppSelector((state) => state.login.signUpData);
    const signUpLoading = useAppSelector((state) => state.login.signUpLoading);
    const signUpMsg = useAppSelector((state) => state.login.signUpMsg);
    const [aadhaarOTPResponse, setAadhaarOTPResponse] = useState({});
    const [DisabledFields, setDisabledFields] = useState({ email: false, mobile: false, aadhar: false })

    const redirectToPage = (location: string) => {
        router.push({
            pathname: location,
        })
    }

    const ShowAlert = (type, message, redirectOnSuccess) => { dispatch(PopupAction({ enable: true, type, message, redirectOnSuccess })); }

    const onChange = async (e: any) => {
        let addName = e.target.name;
        let addValue = e.target.value;
        let TempDetails = { ...LoginDetails };

        if (addName == "loginName") {
            addValue = NameValidation(addValue);
        }
        else if (addName === 'aadharHash') {
            addValue = addValue.replace(/[^0-9 x]/g, "");
            let value;
            if (addValue) {
                setDisabledFields({ email: true, mobile: true, aadhar: false });
            } else {
                setDisabledFields({ email: false, mobile: false, aadhar: false })
            }
            if (TempDetails?.aadhar?.length > addValue?.length) {
                value = "";
                addValue = "";
            } else if (addValue != "") {
                value = (TempDetails.aadhar ? TempDetails.aadhar : '') + addValue[addValue.length - 1];
            }
            addValue = addValue.replace(/\d(?=\d{3})/g, "x");
            TempDetails = { ...TempDetails, aadhar: value }
        }
        else if (addName == "loginMobile") {
            // addValue = addValue.replace(/[\e]/gi, "");
            if ((addValue && (isNaN(addValue) || (['.', '-'].some(i => addValue.includes(i))))) || addValue.length > 10) {
                addValue = TempDetails.loginMobile
            }
            if (addValue != "") {
                setDisabledFields({ email: true, mobile: false, aadhar: true });
            }
            else {
                setDisabledFields({ email: false, mobile: false, aadhar: false })
            }
            // if (addValue.length > 10) {
            //     addValue = addValue.substring(0, 10);
            // }
        }
        else if (addName == "loginEmail") {
            if (addValue != "") {
                if (addValue.length > 50) {
                    addValue = TempDetails.loginEmail
                }
                setDisabledFields({ email: false, mobile: true, aadhar: true })
            }
            else {
                setDisabledFields({ email: false, mobile: false, aadhar: false })
            }
        }
        setLoginDetails({ ...TempDetails, [addName]: addValue })

    }

    const validate = () => {
        const errors = {};
        const logDetails: any = { ...LoginDetails };
        if (!logDetails.loginName || logDetails.loginName.length < 4 || logDetails.loginName.length > 40) {
            errors['loginName'] = "*Full Name should contain 4 - 40 characters.";
        }
        if (LoginDetails.loginMobile && LoginDetails.loginMobile.length < 10) {
            errors['loginMobile'] = '*Please enter a valid mobile number'
        }
        else if(LoginDetails.loginMobile && LoginDetails.loginMobile.length == 10){
            var regex = /^[6789]\d{9}$/;
            if (!regex.test(LoginDetails.loginMobile)) {
                errors['loginMobile'] = '*Please enter a valid mobile number'
            }
        }
        if (LoginDetails.aadhar && LoginDetails.aadhar.length < 12) {
            errors['aadhar'] = "*Please enter a valid 12 digit aadhaar number"
        }
        setFormErrors({ ...errors });
        return errors
    }

    const checkFields = () => {
        if (!LoginDetails.loginEmail && !LoginDetails.loginMobile && !LoginDetails.aadhar) {
            ShowAlert(false, "Please provide details for atleast on these fields (Email ID, Mobile No, Aadhaar No)", "");
            return false;
        }
        return true;
    }


    const onSubmit = (e: any) => {
        e.preventDefault();
        if (checkFields() && !Object.keys(validate()).length) {
            let ob: any = {
                loginName: LoginDetails.loginName
            };
            if (LoginDetails.loginEmail) {
                ob['loginEmail'] = LoginDetails.loginEmail;
            }
            if (LoginDetails.loginMobile) {
                ob['loginMobile'] = LoginDetails.loginMobile;
            }
            if (LoginDetails.aadhar) {
                ob['aadhar'] = encryptWithAES(`${LoginDetails.aadhar}`);
            }
            dispatch(verifyUserReg({
                ...ob
            }))
        }
    }

    // const EmailVerifyAction = async () => {

    //     dispatch(saveLoginDetails(LoginDetails));
    //     let result: any = await CallingAxios(useEmailVerify(LoginDetails));
    //     if (result && result.status) {
    //         ShowAlert(true, result.message, "/OTPPage");
    //     } else {
    //         ShowAlert(false, result.message, "");
    //     }
    // }

    useEffect(() => {
        if (Object.keys(verifyUserRegData).length) {
            (async () => {
                if (!LoginDetails.loginEmail && LoginDetails.aadhar) {
                    setLoading(true)
                    let result = await UseGetAadharOTP(btoa(LoginDetails.aadhar));
                    if (result && result.status === 'Success') {
                        ShowAlert(true, "OTP Sent to Mobile Number Linked with Aadhaar", "");
                        setSentOTP(true)
                        setAadhaarOTPResponse(result)
                    } else {
                        ShowAlert(false, get(result, 'message', "Aadhaar API Failed"), '')
                        setAadhaarOTPResponse({});
                    }
                    setLoading(false)
                } else {
                    ShowAlert(true, LoginDetails.loginEmail ? "OTP Sent to Email Address" : "OTP Sent to Mobile Number", "")
                    setSentOTP(true)
                }
            })()
        }
    }, [verifyUserRegData])

    useEffect(() => {
        if (verifyUserRegMsg) {
            ShowAlert(false, verifyUserRegMsg, '');
        }
    }, [verifyUserRegMsg])

    useEffect(() => {
        return () => {
            dispatch(resetLoginDetails())
        }
    }, [])

    const onRegister = async (e) => {
        e.preventDefault();
        if (!LoginDetails.loginEmail && LoginDetails.aadhar) {
            setLoading(true);
            let result: any = await UseGetAadharDetails({
                aadharNumber: btoa(LoginDetails.aadhar),
                transactionNumber: get(aadhaarOTPResponse, 'transactionNumber', ''),
                otp: otp
            });
            if (result.status && result.status === 'Success') {
                callSignUp(false)
            } else {
                ShowAlert(false, result.message, '');
            }
            setLoading(false);
        } else {
            callSignUp(true);
        }
    }

    const callSignUp = (flag) => {
        let ob: any = {
            loginName: LoginDetails.loginName
        };
        if (LoginDetails.loginEmail) {
            ob['loginEmail'] = LoginDetails.loginEmail;
        }
        if (LoginDetails.loginMobile) {
            ob['loginMobile'] = LoginDetails.loginMobile;
        }
        if (LoginDetails.aadhar) {
            ob['aadhar'] = encryptWithAES(`${LoginDetails.aadhar}`);
        }
        dispatch(signUp({
            ...ob,
            loginOtp: flag ? otp : ''
        }))
    }

    useEffect(() => {
        if (Object.keys(signUpData).length) {
            ShowAlert(true, 'User Registered Successfully', '/ECLoginPage');
        }
    }, [signUpData]);

    useEffect(() => {
        if (signUpMsg) {
            ShowAlert(false, signUpMsg, '');
        }
    }, [signUpMsg])

    // const downloadReport = async () => {	
    //     setTimeout(() => {
    //         fetchFile("http://"+ process.env.BACKEND_URL + "/pdfs/userManual.pdf");
    //     }, 1000);     
    // }
	const downloadReport = async (type: any) => {
		let info: any = {
			type: type,
			applicationId:"1",
			stamp:"N"
		}
		let result: any = await CallingAxios(UseReportDownload(info));
		
		if (result.status) {
			setTimeout(() => {
				fetchFile(result.data);
			}, 1000);
		}
	}
    const fetchFile = (url:any) => {
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
            ShowMessagePopup(false,"Failed to download file!","");
    
        });
    
    }
    return (

        <div className='PageSpacing loginpageSpace'>

        {/* <div onClick={() => downloadReport("userManual")}>
          <div className='userManual'>
            <p className="proceedButton userBtn">USER MANUAL</p>
          </div>
        </div> */}

            <Head>
                <title>Registration - Public Data Entry</title>
            </Head>
            <div className={styles.RegistrationMain}>
                <Container>
                    <Row className='d-flex loginRow align-items-center'>
                    <Col lg={6} md={12} xs={12} className='loginTextCon'>
                            <div className={styles.regImageInfo}>
                                {/* <Image alt="" width={340} height={426} src="/PDE/images/loginimg.svg" className={styles.image} /> */}
                                {/* <Image alt='' width={500} height={550} className={styles.image} src="/PDE/images/registration-img.png" /> */}
                                <Container >
                                    <Row>
                                        <Col className="loginHome">
                                            <div>
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
                            {sentOTP ?
                                <form autoComplete="off" className={`${styles.RegistrationInput} ${loading || signUpLoading ? styles.disableForm : ''}`} onSubmit={onRegister}>
                                    <h2 className="p-0"><button className={styles.rightButton} onClick={() => setSentOTP(false)} type='button'><Image src="/PDE/images/leftArrow.svg" height={16} width={16} /></button> Enter OTP</h2>
                                    <div className="mb-3 regInput">
                                        <TableInputText type='text' otpChar={false} placeholder='Enter OTP' maxLength={6} required={true} name='otp' value={otp} onChange={(e) => {
                                            setOTP(e.target.value)
                                        }} />
                                    </div>
                                    <Row className="p">
                                        <Col lg={5} md={6} xs={6}>
                                            <div className={styles.pdesingleColumn}>
                                                <Button type='submit' btnName='Register' status={loading || signUpLoading} disabled={verifyUserRegLoading || loading}></Button>
                                            </div>
                                        </Col>
                                        <Col lg={7} md={6} xs={6} className={styles.flexColumn}>
                                            <div className={styles.flexColumn}>
                                                <span className={`${styles.checkText} ${styles.scheckText}`}>Did not receive OTP?</span>
                                                <button type='button'
                                                    // className={`${styles.checkText} ${styles.RegText}`}
                                                    className={styles.rightButton}
                                                    onClick={onSubmit}
                                                >Resend OTP</button>
                                            </div>
                                        </Col>
                                    </Row>
                                </form>
                                :
                                <form autoComplete="off" onSubmit={onSubmit} className={`${styles.RegistrationInput} ${loading || verifyUserRegLoading ? styles.disableForm : ''}`}>
                                    <h2>New Registration!</h2>
                                    <div className="mb-2 p">
                                        <TableText label={"Full Name"} required={true} LeftSpace={false} />
                                        <TableInputText type='text' placeholder='ENTER FULL NAME' maxLength={80} required={true} name="loginName" value={LoginDetails.loginName} onChange={onChange} onMouseOut={() => {
                                            setLoginDetails({ ...LoginDetails, loginName: LoginDetails.loginName.trim() ? LoginDetails.loginName.trim().toUpperCase() : "" })
                                        }} />
                                        <p className={styles.warningText} style={{ color: 'red', marginBottom: "0px" }}>{FormErrors.loginName}</p>
                                    </div>
                                    <div className="mb-2 mt-0 p">
                                        <TableText label={"Email ID"} required={false} LeftSpace={false} />
                                        <TableInputText type='email' disabled={DisabledFields.email} emailChar={false} placeholder='Enter Email ID' maxLength={80} required={false} name="loginEmail" value={LoginDetails.loginEmail} onChange={onChange} />
                                    </div>
                                    <div className="mb-2 p">
                                        <TableText label={"Mobile Number"} required={false} LeftSpace={false} />
                                        <TableInputText type='text' disabled={DisabledFields.mobile} placeholder='Enter Mobile Number' required={false} name="loginMobile" value={LoginDetails.loginMobile} onChange={onChange} />
                                        <p className={styles.warningText} style={{ color: 'red', marginBottom: "0px" }}>{FormErrors.loginMobile}</p>
                                    </div>
                                    <div className="mb-2 p">
                                        <TableText label={"Aadhaar Number"} required={false} LeftSpace={false} />
                                        <TableInputText type='text' placeholder='Enter Aadhar Number' splChar={false} allowNeg={false} disabled={DisabledFields.aadhar} maxLength={12} required={false} name="aadharHash" value={LoginDetails.aadharHash} onChange={onChange} />
                                    </div>
                                    <div>
                                        <p className={styles.hint}>Note: Either Aadhaar No. / Email ID / Mobile No. is Mandatory. </p>
                                    </div>
                                    {/* <div className="mb-4 p">
                                    <TableText label={"Password"} required={true} LeftSpace={false} />
                                    <TableInputText type='number' placeholder='Enter minimum 6 Digit Password' required={true} name="loginPassword" value={LoginDetails.loginPassword} onChange={onChange} />
                                    <p className={styles.warningText} style={{ color: 'red' }}>{FormErrors.loginPassword}</p>
                                </div>
                                <div className="p">
                                    <TableText label={"Re-Enter Password"} required={true} LeftSpace={false} />
                                    <TableInputText type='number' placeholder='Please Re-Enter Password' required={true} name="loginRPassword" value={LoginDetails.loginRPassword} onChange={onChange} />
                                    <p className={styles.warningText} style={{ color: 'red' }}>{FormErrors.loginRPassword}</p>
                                </div> */}
                                    <Row className="p">
                                        <Col lg={5} md={6} xs={6}>
                                            <div className={styles.pdesingleColumn}>
                                                <Button type='submit' btnName='Send OTP' status={loading || verifyUserRegLoading}></Button>
                                            </div>
                                        </Col>
                                        <Col lg={7} md={6} xs={6} className={styles.flexColumn}>
                                            <div className={styles.flexColumn}>
                                                <span className={`${styles.checkText} ${styles.scheckText}`}>Already have an account?</span>
                                                <button className={styles.rightButton} onClick={() => { redirectToPage("/ECLoginPage") }} type='button'>Login</button>
                                            </div>
                                        </Col>
                                    </Row>
                                </form>
                            }
                        </Col>
                    </Row>
                </Container>
            </div>
            {/* <pre>{JSON.stringify(LoginDetails, null, 2)}</pre> */}
        </div>
    )
}

export default RegistrationPage
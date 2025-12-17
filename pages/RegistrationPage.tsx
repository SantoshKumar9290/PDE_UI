import { Fragment, useState, useEffect, useRef } from 'react';
import { Col, Container, Row, Modal, } from 'react-bootstrap';
import styles from '../styles/pages/Forms.module.scss';
import Image from 'next/image';
import { get } from 'lodash';
import TableInputText from '../src/components/TableInputText';
import TableText from '../src/components/TableText';
import { useRouter } from 'next/router';
import { useAppSelector, useAppDispatch } from '../src/redux/hooks';
import { resetLoginDetails, saveLoginDetails, signUp, verifyUserReg } from '../src/redux/loginSlice';
import { PopupAction } from '../src/redux/commonSlice';
import { useEmailVerify, UseGetAadharDetails, UseGetAadharOTP ,UseReportDownload, SaveAadharConsentDetails} from '../src/axios';
import { CallingAxios, encodeBase64, ShowMessagePopup, useVoiceSequenceAadhaarConsent2 } from '../src/GenericFunctions';
import { encryptWithAES, NameValidation, Consent1, Consent2_Eng, Consent2_Tel } from '../src/utils';
import Button from '../src/components/Button';
import Head from 'next/head';
import Accordion from 'react-bootstrap/Accordion';
import { Volume2, PauseCircle, PlayCircle } from "lucide-react";

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
    
    const [showSendOtpButton, setShowSendOtpButton] = useState(true);    
    const [showAadharConsentConfirmPopup, setShowAadharConsentConfirmPopup] = useState(false);
    const { audioRef, voiceStatus, isTeluguMode, toggleVoice, resetVoiceState } = useVoiceSequenceAadhaarConsent2();
    const [aadharConsentCheckboxChecked, setAadharConsentCheckboxChecked] = useState(false);

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
                setDisabledFields((prev) => ({
                    ...prev,
                    email: false, mobile: false, aadhar: false 
                }));
                setShowSendOtpButton(true);
            } else if (addValue != "") {
                value = (TempDetails.aadhar ? TempDetails.aadhar : '') + addValue[addValue.length - 1];
            }
            addValue = addValue.replace(/\d(?=\d{3})/g, "x");
            TempDetails = { ...TempDetails, aadhar: value }

            if (value?.length === 12) {
                setShowAadharConsentConfirmPopup(true);
            } else if (value?.length > 0) {
                setShowSendOtpButton(false);
                setAadharConsentCheckboxChecked(false);
            }
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
                    let result = await UseGetAadharOTP(encodeBase64(LoginDetails.aadhar));
                    if (result && result.status === 'Success') {
                        let data = {
                            APP_ID: "",
                            PARTY_NAME: LoginDetails.loginName,
                            CONSENT_ACCEPT: aadharConsentCheckboxChecked ? "Y" : "N",
                            PARTY_TYPE: LoginDetails.loginType,
                            TYPE: "New Registration!",
                            SOURCE_NAME: "PDE",
                            AADHAR_CONSENT: 2
                        }
                        if (!sentOTP){
                            const response = await CallingAxios(SaveAadharConsentDetails(data));
                        }

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
                aadharNumber: encodeBase64(LoginDetails.aadhar),
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
            ShowAlert(true, 'User Registered Successfully', '/LoginPage');
        }
    }, [signUpData]);

    useEffect(() => {
        if (signUpMsg) {
            ShowAlert(false, signUpMsg, '');
        }
    }, [signUpMsg])

    useEffect(() => {
        if (!showAadharConsentConfirmPopup) {
            resetVoiceState();
        };
    }, [showAadharConsentConfirmPopup]);

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

    const handleAadharConsentConfirmYes = () => {
        if (!aadharConsentCheckboxChecked) {
            ShowAlert(false, "Please Select the Check box", "");
            return;
        }
        setShowAadharConsentConfirmPopup(false);
        setShowSendOtpButton(true); // show Send OTP after confirmation
    };

    const handleAadharConsentConfirmNo = () => {
        setShowAadharConsentConfirmPopup(false);
        setAadharConsentCheckboxChecked(false);
        setShowSendOtpButton(true);
        setLoginDetails((prev) => ({
            ...prev,
            aadhar: "",
            aadharHash: ""
        }));
        setDisabledFields((prev) => ({
            ...prev,
           email: false, mobile: false, aadhar: false 
        }));
    };

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
                                                                <span>This data entry does not mean that document is accepted for registration. SRO officer has authority to Accept/reject the document or he may ask the parties to change the document details as per the rule.</span>
                                                            </li>
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
                                        <TableInputText type='text' placeholder='Enter Aadhar Number' splChar={false} allowNeg={false} disabled={DisabledFields.aadhar} maxLength={12} required={false} name="aadharHash" value={LoginDetails.aadharHash} onChange={onChange} onPaste={(e) => e.preventDefault()}/>
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
                                        {showSendOtpButton && (
                                            <div className={styles.pdesingleColumn}>
                                                <Button type='submit' btnName='Send OTP' status={loading || verifyUserRegLoading}></Button>
                                            </div>
                                        )}
                                        </Col>
                                        <Col lg={7} md={6} xs={6} className={styles.flexColumn}>
                                            <div className={styles.flexColumn}>
                                                <span className={`${styles.checkText} ${styles.scheckText}`}>Already have an account?</span>
                                                <button className={styles.rightButton} onClick={() => { redirectToPage("/LoginPage") }} type='button'>Login</button>
                                            </div>
                                        </Col>
                                    </Row>
                                </form>
                            }
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
                                                <div className="form-check">
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

export default RegistrationPage
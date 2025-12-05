import React, { Fragment, useEffect, useState } from 'react';
import styles from '../styles/pages/Forms.module.scss';
import Image from "next/image";
import TableInputText from '../src/components/TableInputText';
import { useRouter } from 'next/router';
// import { useSingup, useUserLogin, useOfficerLogin, useRequestOTPForForgetPswd, useVerifyOTPForForgetPswd, useResetPasswordByMail, useRequestOTPForEmail, useVerifyOTPForEmail } from '../src/axios';
import { useAppSelector, useAppDispatch } from '../src/redux/hooks';
import { LoadingAction, PopupAction } from '../src/redux/commonSlice';
import { saveLoginDetails } from '../src/redux/loginSlice';
import { Col, Container, Row } from 'react-bootstrap';

const ForgetPasswordPage = () => {
    const dispatch = useAppDispatch()
    const router = useRouter()
    const LoginTypes = [
        { key: 0, label: 'User Login', sublabel: '', name: false, email: true, mobile: false, pswd: true, rpswd: false, emailLabel: false, otp: false, buttonName: 'Login' },
        { key: 1, label: 'SRO Login', sublabel: '', name: false, email: true, mobile: false, pswd: true, rpswd: false, emailLabel: false, otp: false, buttonName: 'Login' },
        { key: 2, label: 'New Registration!', sublabel: 'Sign up', name: false, email: true, mobile: false, pswd: false, rpswd: false, otp: false, emailLabel: false, buttonName: 'Send OTP' },
        { key: 3, label: 'Forgot Password', sublabel: 'Email Verify', name: false, email: true, mobile: false, pswd: false, rpswd: false, emailLabel: false, buttonName: 'Send OTP', otp: false, },
        { key: 4, label: 'New Registration!', sublabel: 'OTP Verification', name: false, email: false, mobile: false, pswd: false, rpswd: false, emailLabel: true, otp: true, buttonName: 'Verify OTP' },
        { key: 5, label: 'New Registration!', sublabel: 'Create User', name: true, email: false, mobile: true, pswd: true, rpswd: true, otp: false, emailLabel: true, buttonName: 'Register' },
        { key: 6, label: 'Forgot Password', sublabel: 'Verify OTP', name: false, email: false, mobile: false, pswd: false, rpswd: false, emailLabel: true, otp: true, buttonName: 'Verify OTP' },
        { key: 7, label: 'Forgot Password', sublabel: 'Change Password', name: false, email: false, mobile: false, pswd: true, rpswd: true, otp: false, emailLabel: true, buttonName: 'SUBMIT' },
    ];

    const Loading = (value: boolean) => { dispatch(LoadingAction({ enable: value })); }

    const initialLoginDetails = {
        loginKey: 0,
        loginLabel: '',
        loginName: '',
        loginEmail: '',
        loginMobile: '',
        loginPassword: '',
        loginRPassword: '',
        sroNumber: '',
        otp: ''
    }
    const passcodeRules = ['* Password should contain atleast 8 characters', '* Atleast one uppercase character', '* Atleast one lowercase character', '* Atleast one digit', 'Example: tEst1234'];

    const [SelectedLoginType, setSelectedLoginType] = useState<number>(0);
    const [LoginDetails, setLoginDetails] = useState(initialLoginDetails);
    const [FormErrors, setFormErrors] = useState<any>({});

    const onChange = (e: any) => {
        let addName = e.target.name;
        let addValue = e.target.value;

        if (addName == "loginPassword" || addName == "loginRPassword") {
            addValue = addValue.replace(' ', '');
        }
        if (addName == "loginName" && addValue.length < 2) {
            addValue = addValue.replace(' ', '');
        }

        if (addName == "loginName") {
            addValue = addValue.replace(/[^\w\s]/gi, "");
            addValue = addValue.replace(/[0-9]/gi, "");
        }

        else if (addName == "loginMobile") {
            if (addValue.length > 10) {
                addValue = addValue.substring(0, 10);
            }
        }
        setLoginDetails({ ...LoginDetails, [addName]: addValue });
    }

    useEffect(() => {
        localStorage.clear();
        dispatch(saveLoginDetails(initialLoginDetails));
    }, [])


    const onSubmit = (e: any) => {
        e.preventDefault();

        let myError: any = validate(LoginDetails)
        setFormErrors(myError)

        if (Object.keys(myError).length === 0) {
            // window.alert("type"+SelectedLoginType);
            //   switch (SelectedLoginType) {
            //     case 0: UserLoginAction(); break;
            //     case 1: OfficerLoginAction(); break;
            //     case 2: RegEmailVerification(); break;
            //     case 3: ForgetEmailVerification(); break;
            //     case 4: RegOTPVerification(); break;
            //     case 5: RegisterAction(); break;
            //     case 6: ForgetOTPVerification(); break;
            //     case 7: ResetPasswordAction(); break;
            //     default: break;
            //   }
        } else {
            // window.alert(JSON.stringify(myError));
        }
    }

    const validate = (values: any) => {
        type errors = {
            loginEmail?: string;
            loginMobile?: string;
            loginRPassword?: string;
            loginPassword?: string;
            loginName?: string;
        };

        const obj: errors = {}
        if (SelectedLoginType == 5 && values.loginMobile.length != 10) {
            obj.loginMobile = "Enter 10 digit valid mobile number";
        }

        if ((SelectedLoginType == 5 || SelectedLoginType == 7) && !validateForm(values.loginPassword)) {
            obj.loginPassword = "Please enter a valid and strong password";
        }

        if ((SelectedLoginType == 5 || SelectedLoginType == 7) && values.loginRPassword != values.loginPassword) {
            obj.loginRPassword = "Password does not match";
        }

        return obj;
    }

    //   const UserLoginAction = async () => {

    //     try {
    //       let data = {
    //         loginEmail: LoginDetails.loginEmail,
    //         loginPassword: LoginDetails.loginPassword
    //       }

    //       await CallLogin(data);
    //     } catch (error) {
    //       ShowAlert(false, "Error:" + error, "");
    //     }
    //   }

    //   const CallLogin = async (value: any) => {
    //     Loading(true);
    //     let result: any = await useUserLogin(value);
    //     Loading(false);
    //     if (result.status) {
    //       let query = {
    //         loginId: result.data.loginId,
    //         loginEmail: result.data.loginEmail,
    //         loginName: result.data.loginName,
    //         token: result.data.token,
    //         appNo: result.data.appNo,
    //         loginType: result.data.loginType,
    //         status: result.data.status,
    //         registrationDetails: result.data.registrationDetails
    //       }
    //       localStorage.setItem("loginDetails", JSON.stringify(query));
    //       dispatch(saveLoginDetails(query));
    //     }

    //     if (result && result.status) {
    //       router.push({
    //         pathname: '/UserDashboard',
    //       })
    //     } else {
    //       ShowAlert(false, result.message, "");
    //     }
    //   }

    const ShowAlert = (type, message, redirect) => { dispatch(PopupAction({ enable: true, type: type, message: message, redirect: redirect })); }

    //   const OfficerLoginAction = async () => {

    //     try {
    //       let data = {
    //         loginEmail: LoginDetails.loginEmail,
    //         loginPassword: LoginDetails.loginPassword
    //       }

    //       await CallOfficeLogin(data);
    //     } catch (error) {
    //       ShowAlert(false, "Error:" + error, "");
    //     }
    //   }

    //   const CallOfficeLogin = async (value: any) => {
    //     Loading(true);
    //     let result: any = await useOfficerLogin(value);
    //     Loading(false);
    //     let query;
    //     if(result && result.status){
    //       query = {
    //         loginId: result.data.loginId,
    //         loginEmail: result.data.loginEmail,
    //         loginName: result.data.loginName,
    //         token: result.data.token,
    //         loginType: result.data.loginType,
    //         sroDistrict: result.data.sroDistrict,
    //         sroMandal: result.data.sroMandal,
    //         sroOffice: result.data.sroOffice,
    //         sroNumber: result.data.sroNumber
    //       }
    //     } 
    //     localStorage.setItem("loginDetails", JSON.stringify(query));
    //     dispatch(saveLoginDetails(query));
    //     if (result && result.status) {
    //       router.push({
    //         pathname: '/OfficeDashboard',
    //       })
    //       // localStorage.setItem('LoginUser', JSON.stringify(result.data));
    //     } else {
    //       ShowAlert(false, result.message, "");
    //     }
    //   }

    //   const ForgetEmailVerification = async () => {
    //     try {
    //       let data = { loginEmail: LoginDetails.loginEmail, }
    //       await CallForgetEmailVerification(data);

    //     } catch (error) {
    //       ShowAlert(false, "Error:" + error, "");

    //     }
    //   }

    //   const CallForgetEmailVerification = async (data) => {
    //     Loading(true);
    //     let result: any = await useRequestOTPForForgetPswd(data);
    //     Loading(false);
    //     if (result && result.status) {
    //       if (result.status) {
    //         ShowAlert(true, result.data, "");
    //         setSelectedLoginType(6);
    //       }
    //       else {
    //         ShowAlert(false, result.message, "");
    //       }

    //     } else {
    //       ShowAlert(false, "Error:" + "Register User Failed", "");
    //     }
    //   }

    //   const ForgetOTPVerification = async () => {
    //       Loading(true);
    //       let result: any = await useVerifyOTPForForgetPswd(LoginDetails.loginEmail, LoginDetails.otp);
    //       Loading(false);
    //       if (result && result.status) {
    //         ShowAlert(true, result.data, "");
    //         setSelectedLoginType(7);
    //       } else {
    //         ShowAlert(false, result.message, "");
    //       }
    //   }

    //   const ResetPasswordAction = async () => {
    //     try {
    //       let data = {
    //         loginEmail: LoginDetails.loginEmail,
    //         loginPassword: LoginDetails.loginPassword
    //       }
    //       await CallResetPasswordAction(data);
    //     } catch (error) { ShowAlert(false, "Error:" + error, ""); }
    //   }
    //   const CallResetPasswordAction = async (data) => {
    //     Loading(true);
    //     let result: any = await useResetPasswordByMail(data);
    //     Loading(false);
    //     if (result && result.status) { ShowAlert(true, result.data, ""); }
    //     else {
    //       ShowAlert(false, "Error:" + "Password Reset Failed", "");
    //     }
    //     setSelectedLoginType(0);
    //   }

    //   const RegEmailVerification = async () => {
    //     try {
    //       let data = { loginEmail: LoginDetails.loginEmail, }
    //       await CallRegEmailVerification(data);
    //     } catch (error) {
    //       ShowAlert(false, "Error:" + error, "");

    //     }
    //   }

    //   const CallRegEmailVerification = async (data) => {
    //     Loading(true);
    //     let result: any = await useRequestOTPForEmail(data);
    //     Loading(false);
    //     if (result && result.status) {
    //       if (result.status) {
    //         ShowAlert(true, result.data, "");
    //         setSelectedLoginType(4);
    //       }
    //       else {
    //         ShowAlert(false, result.message, "");
    //       }

    //     } else {
    //       ShowAlert(false, "Error:" + "Register User Failed", "");
    //     }
    //   }

    //   const RegOTPVerification = async () => {

    //       Loading(true);
    //       let result: any = await useVerifyOTPForEmail(LoginDetails.loginEmail, LoginDetails.otp);
    //       Loading(false);
    //       if (result && result.status) {
    //         ShowAlert(true, result.data, "");
    //         setSelectedLoginType(5);
    //       } else {
    //         ShowAlert(false, result.message, "");
    //       }
    //   }

    //   const RegisterAction = async () => {
    //     try {
    //       let data = {
    //         loginEmail: LoginDetails.loginEmail,
    //         loginKey: 0,
    //         loginType: "USER",
    //         loginName: LoginDetails.loginName,
    //         loginMobile: LoginDetails.loginMobile,
    //         loginPassword: LoginDetails.loginPassword,
    //         otp: LoginDetails.otp
    //       }

    //       await CallSignUp(data);
    //     } catch (error) {
    //       ShowAlert(false, "Error:" + error, "");

    //     }
    //   }

    //   const CallSignUp = async (value: any) => {
    //     Loading(true);
    //     let result: any = await useSingup(value);
    //     Loading(false);
    //     if (result && result.status) {
    //       ShowAlert(true, "User Created Successfully", "");
    //       setSelectedLoginType(0);
    //     } else {
    //       ShowAlert(false, "Error:" + "Register User Failed", "");
    //     }
    //   }

    const renderHints = () => {
        return <div className={styles.ruleBox}>{passcodeRules.map(rule => {
            return <div key={rule}>{rule}</div>
        })}</div>
    }

    const validateForm = (loginPasscode) => {
        if (!(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(loginPasscode))) {
            // ShowAlert(false, 'Please enter a strong password')
            return false;
        }
        return true;
    }
    return (
        <div className=''>
            <div className={styles.RegistrationMain}>
                <Container>
                    <Row>
                        <Col lg={6} md={12} xs={12} className='p-0'>
                            <div className={styles.regImageInfo}>
                                <Image alt='' width={700} height={460} className={styles.image} src="/PDE/images/otp-img.png" />
                            </div>
                        </Col>

                        <Col lg={6} md={6} xs={12} className='pt-5'>
                            <div className={` ${styles.RegistrationInput} ${styles.LoginPageInput}`}>
                                <form onSubmit={onSubmit} className={styles.rightContainer} autoComplete="off">
                                    <div className={styles.TitleText}>{LoginTypes[SelectedLoginType].label}</div>
                                    <div className={styles.subTitleText} style={{ fontWeight: "bold" }} >{LoginTypes[SelectedLoginType].sublabel}</div>
                                    {
                                        LoginTypes[SelectedLoginType].name && <div style={{ paddingTop: '10px', margin: 'auto' }}>
                                            <p className={styles.keyText}>Full Name :</p>
                                            <TableInputText name={'loginName'} type='text' placeholder='Firstname Lastname' splChar={false} required={true} value={LoginDetails.loginName} onChange={onChange} />
                                            <p className={styles.warningText}>{FormErrors.loginName}</p>
                                        </div>

                                    }
                                    {
                                        LoginTypes[SelectedLoginType].name && <div style={{ paddingTop: '10px', margin: 'auto' }}>
                                            <p className={styles.keyText}>Veriy OTP :</p>
                                            <TableInputText name={'Veriy OTP'} type='text' placeholder='Enter OTP' required={true} splChar={false} value={LoginDetails.loginName} onChange={onChange} />
                                            <p className={styles.warningText}>{FormErrors.loginName}</p>
                                        </div>

                                    }
                                    {
                                        LoginTypes[SelectedLoginType].name && <div style={{ paddingTop: '10px', margin: 'auto' }}>
                                            <p className={styles.keyText}>Old Password :</p>
                                            <TableInputText name={'Old Password'} type='text' placeholder='Enter Old Password' required={true} splChar={false} value={LoginDetails.loginName} onChange={onChange} />
                                            <p className={styles.warningText}>{FormErrors.loginName}</p>
                                        </div>

                                    }
                                    {
                                        LoginTypes[SelectedLoginType].name && <div style={{ paddingTop: '10px', margin: 'auto' }}>
                                            <p className={styles.keyText}>New Password :</p>
                                            <TableInputText name={'New Password'} type='text' placeholder='Enter New Password' required={true} splChar={false} value={LoginDetails.loginName} onChange={onChange} />
                                            <p className={styles.warningText}>{FormErrors.loginName}</p>
                                        </div>

                                    }
                                    {
                                        LoginTypes[SelectedLoginType].name && <div style={{ paddingTop: '10px', margin: 'auto' }}>
                                            <p className={styles.keyText}>Re-Enter Passwordrd :</p>
                                            <TableInputText name={'re-enter passwordrd'} type='text' placeholder='Enter New Password' required={true} splChar={false} value={LoginDetails.loginName} onChange={onChange} />
                                            <p className={styles.warningText}>{FormErrors.loginName}</p>
                                        </div>

                                    }
                                    {
                                        LoginTypes[SelectedLoginType].emailLabel && LoginTypes[SelectedLoginType].sublabel !== 'Create User' && <div style={{ paddingTop: '10px', margin: 'auto' }}>
                                            <p className={styles.keyText}>Email Address : {LoginDetails.loginEmail}</p>
                                        </div>

                                    }
                                    {
                                        LoginTypes[SelectedLoginType].email && <div style={{ paddingTop: '10px', margin: 'auto' }}>
                                            <p className={styles.keyText}>Email Address :</p>
                                            <TableInputText name={'loginEmail'} type='email' placeholder='Enter Email Address' required={true} splChar={false} value={LoginDetails.loginEmail} onChange={onChange} />
                                        </div>
                                    }
                                    {
                                        LoginTypes[SelectedLoginType].mobile && <div style={{ paddingTop: '5px', margin: 'auto' }}>
                                            <p className={styles.keyText}>Mobile Number :</p>
                                            <TableInputText name={'loginMobile'} type='number' placeholder='Enter Mobile Number' required={true} value={LoginDetails.loginMobile} onChange={onChange} />
                                            <p className={styles.warningText}>{FormErrors.loginMobile}</p>
                                        </div>
                                    }
                                    {
                                        LoginTypes[SelectedLoginType].pswd && <div style={{ paddingTop: '5px', margin: 'auto' }}>
                                            <p className={styles.keyText}>Password :</p>
                                            <TableInputText name={'loginPassword'} type='password' placeholder='Enter Password' required={true} value={LoginDetails.loginPassword} onChange={onChange} />
                                            <p className={styles.warningText}>{FormErrors.loginPassword}</p>
                                            {
                                                LoginTypes[SelectedLoginType].rpswd && FormErrors.loginPassword && renderHints()
                                            }
                                        </div>
                                    }
                                    {
                                        LoginTypes[SelectedLoginType].rpswd && <div style={{ paddingTop: '5px', margin: 'auto' }}>
                                            <p className={styles.keyText}>Confirm Password :</p>
                                            <TableInputText name={'loginRPassword'} type='password' placeholder='Enter Password Again' required={true} value={LoginDetails.loginRPassword} onChange={onChange} />
                                            <p className={styles.warningText}>{FormErrors.loginRPassword}</p>
                                        </div>
                                    }
                                    {
                                        LoginTypes[SelectedLoginType].otp && <div style={{ paddingTop: '5px', margin: 'auto' }}>
                                            <p className={styles.keyText}>Verification Code :</p>
                                            <TableInputText name={'otp'} type='number' placeholder='Enter Verification Code' required={true} value={LoginDetails.otp} onChange={onChange} />
                                            <p className={styles.warningText}>{FormErrors.otp}</p>
                                        </div>
                                    }


                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px' }}>
                                        {SelectedLoginType == 1 && <p onClick={() => { setSelectedLoginType(0); setLoginDetails(initialLoginDetails) }} className={styles.checkText}>User Login</p>}
                                        {SelectedLoginType == 0 && <p onClick={() => { setSelectedLoginType(1); setLoginDetails(initialLoginDetails) }} className={styles.checkText}>SRO Login</p>}
                                        {SelectedLoginType == 0 && <p onClick={() => { setSelectedLoginType(3); setLoginDetails(initialLoginDetails) }} className={styles.checkText}>Forgot Password ?</p>}
                                        {(SelectedLoginType != 1 && SelectedLoginType != 0) ? <p onClick={() => { setSelectedLoginType(0); setLoginDetails(initialLoginDetails) }} className={styles.checkText}>Back to User Login</p> : []}
                                    </div>

                                    <div className={styles.pdesingleColumn}>
                                        <button className={` ${styles.btnText} ${styles.LoginBtn}`}> <p className={styles.buttonText}>{LoginTypes[SelectedLoginType].buttonName}</p></button>
                                    </div>
                                    <div style={{ marginTop: '15px' }}>
                                        {SelectedLoginType == 0 && <div style={{ marginTop: '10px' }}>
                                            <p className={styles.checkText} >Don’t have an account? </p>
                                            <p onClick={() => { setSelectedLoginType(2); setLoginDetails(initialLoginDetails) }} className={`${styles.checkText} ${styles.RegText}`}>New Registration!</p>
                                        </div>
                                        }
                                    </div>
                                </form>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    )
}

export default ForgetPasswordPage;
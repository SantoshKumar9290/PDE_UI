import { Fragment, useEffect, useState } from 'react';
import TableInputText from '../src/components/TableInputText';
import TableText from '../src/components/TableText';
import TableInputPassword from '../src/components/TableInputPassword';
import { useRouter } from 'next/router';
import styles from '../styles/pages/Forms.module.scss';
import { UseGetAadharDetails, UseGetAadharOTP, UseSROLogin, useUserLoginData } from '../src/axios';
import { useAppSelector, useAppDispatch } from '../src/redux/hooks';
import { PopupAction } from '../src/redux/commonSlice';
import Image from 'next/image';
import { Col, Container, Row } from 'react-bootstrap';
import Head from 'next/head';
import { CallingAxios, ShowMessagePopup } from '../src/GenericFunctions';
import { saveLoginDetails } from '../src/redux/loginSlice';



const LoginSroPage = () => {
  const dispatch = useAppDispatch()
  const router = useRouter();

  const [LoginDetails, setLoginDetails] = useState({ loginEmail: "", loginPassword: "" });
  const verifyUserLoading = useAppSelector(state => state.login.verifyUserLoading);
  const [eye, setEye] = useState<boolean>(false);


  const onChange = (e: any) => {
    let TempDetails = { ...LoginDetails };
    let addName = e.target.name;
    let addValue = e.target.value;
    setLoginDetails({ ...TempDetails, [addName]: addValue });
  }

  const redirectToPage = (location: string) => {
    if (location == "/") {
      localStorage.clear();
    }
    router.push({
      pathname: location,
    })
  }

  const onSubmit = async (e: any) => {
    e.preventDefault();
    let result: any = await CallingAxios(UseSROLogin(LoginDetails));
    if (result.status) {
      let myData = {
        loginEmail: result.data.loginEmail,
        token: result.data.token.token,
        loginType: (result.data.loginType).toUpperCase(),
        loginName: result.data.loginName,
        sroCode: result.data.sroNumber,
        sroOffice: result.data.sroName
      }
      dispatch(saveLoginDetails(myData));
      localStorage.setItem("LoginDetails", JSON.stringify(myData));
      dispatch(saveLoginDetails(LoginDetails));
      ShowMessagePopup(true, "SRO Logedin Successfully", "/ServicesPage");
    }
    else {
      ShowMessagePopup(false, "SRO Login Failed", "");
    }
  }


  const ShowAlert = (type, message) => { dispatch(PopupAction({ enable: true, type: type, message: message })); }

  return (
    // <div className='PageSpacing'>
    //   <Head>
    //     <title>SROLogin - Public Data Entry</title>
    //   </Head>
    //   <div className={styles.RegistrationMain}>
    //     <Container>
    //       <Row className='d-flex align-items-center'>
    //         <Col lg={6} md={12} xs={12} className='p-0'>
    //           <div className={styles.regImageInfo}>
    //             <Image alt="" width={340} height={400} src="/PDE/images/loginimg.svg" className={styles.image} />
    //             {/* <Image alt='' width={922} height={610} className={styles.image} src="/PDE/images/login-img.png" />
    //           */}
    //           </div>
    //         </Col>
    //         <Col lg={6} md={12} xs={12}>
    //           <div className={` ${styles.RegistrationInput} ${styles.LoginPageInput}`}>
    //             <form onSubmit={onSubmit}>
    //               <h2 className="p-0">SRO Login</h2>
    //               <div className="mb-2">
    //                 <TableText label={"Email ID"} required={true} LeftSpace={false} />
    //                 <TableInputText type='email' placeholder='Enter Email ID' maxLength={100} required={true} name='loginEmail' value={LoginDetails.loginEmail} onChange={onChange} />
    //               </div>
    //               <div className="mb-2 input-data">
    //                 <TableText label={"Password"} required={true} LeftSpace={false} />
    //                 {/* <TableInputText type='password' placeholder='Enter Password' required={true} name='loginPassword' value={LoginDetails.loginPassword} onChange={onChange} />                 */}
    //                 <TableInputPassword type={!eye ? "password" : "text"} placeholder='Enter Password' required={true} name='loginPassword' value={LoginDetails.loginPassword} maxLength={100} onChange={onChange} top={'0'} right={'0'} />    
    //                 <div className={styles.icon} onClick={() => { setEye(!eye) }}>
    //                   <Image height={14} width={20} src={eye ? "/PDE/images/showIcon.svg" : "/PDE/images/hideIcon.svg"} />
    //                 </div>
    //               </div>
    //               <Row>
    //                 <Col lg={3}>
    //                   <button className='proceedButton'>Login</button>
    //                 </Col>
    //                 <Col lg={3}></Col>
    //                 <Col lg={3}></Col>
    //                 <Col lg={3} className='pt-4'>
    //                   <button type='button' onClick={() => { redirectToPage("/") }}
    //                     // className={`${styles.checkText} ${styles.RegText}`}
    //                     className={styles.rightButton}
    //                   >User Login</button>
    //                 </Col>

    //               </Row>

    //             </form>
    //           </div>
    //         </Col>
    //       </Row>
    //     </Container>
    //   </div >

    // </div >
    <></>
  )
}

export default LoginSroPage;
import React, { useState, useEffect } from 'react';
import styles from '../../styles/components/header.module.scss';
import Image from "next/image";
import { useRouter } from 'next/router';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { FiLogOut } from 'react-icons/fi';
import { saveLoginDetails } from '../redux/loginSlice';
import { Col, Container, Row } from 'react-bootstrap';
import { BrowserAction } from '../redux/commonSlice';
import { UseLogOut } from '../axios';
import { CallingAxios, ShowMessagePopup } from '../GenericFunctions';

export const Header = () => {
  const dispatch = useAppDispatch();
  const router = useRouter()
  const [SelectedformTypekey, setSelectedformTypekey] = useState<number>(1);
  let initialLoginDetails = useAppSelector((state) => state.login.loginDetails);

  const [LoginDetails, setLoginDetails] = useState(initialLoginDetails)

  useEffect(() => {
    setLoginDetails(initialLoginDetails);
    dispatch(BrowserAction({ IsEdge: navigator.userAgent.indexOf("Edg") !== -1 }));
  }, [initialLoginDetails])


  // useEffect(() => {
  //   let data:any = localStorage.getItem("LoginDetails");
  //   data = JSON.parse(data)
  //     setLoginDetails(data)
  // },[LoginDetails])


  const onNavbarClick = (key: any) => {
    setSelectedformTypekey(key);
    switch (key) {
      case 1: router.push('/LoginPage'); break;
      case 2: router.push('/AboutUs'); break;
      default:
        break;
    }

  }

  const OnLogout = async () => {
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
    let result = await CallingAxios(UseLogOut());
    if (result.success) {
      dispatch(saveLoginDetails(resetLoginDetails))
      setLoginDetails(resetLoginDetails);
      // localStorage.clear();
      let page: any = localStorage.getItem("ECPDE");
      page == "EC" ? router.push("/ECLoginPage") : router.push("/");


    }
    else {
      ShowMessagePopup(false, "Logout Failed", "");
    }


  }

  return (
    <header>
      {/* Head container */}
      <div className={styles.HeadingContainer}>
        <Container fluid>
          <Row className='mb-0'>
            <Col lg={3} md={4} xs={4} className="text-start">
              <div className={styles.leftHeadingContainer}>
                <Image alt='' width={55} height={55} src="/PDE/images/cm-img.svg" className={styles.leftImg} />
                <div className={styles.textContainer} style={{ textAlign: 'left'}}>
                  <p className={styles.titleText}>Sri. Nara Chandrababu Naidu</p>
                  <p className={styles.infoText}>{"Hon'ble Chief Minister"}</p>
                  <p className={styles.infoText}>Andhra Pradesh</p>
                </div>
              </div>
            </Col>
            <Col lg={6} md={4} xs={4} className="text-center">
              <div className={`${styles.leftHeadingContainer} ${styles.MiddleContainer}`}>
                <Image alt='' width={50} height={57} src="/PDE/images/APlogo.png" className={styles.middleImg} />
                <div className={`${styles.textContainer} ${styles.RegtextCon}`}>
                  <p className={`${styles.titleText} ${styles.govtitleText}`}>REGISTRATION & STAMPS DEPARTMENT</p>
                  <p className={`${styles.infoText} ${styles.govText}`}>GOVERNMENT OF ANDHRA PRADESH</p>
                </div>
              </div>
            </Col>
            <Col lg={3} md={4} xs={4} className="text-end">
              <div className={styles.leftHeadingContainer}>
                <div className={styles.textContainer}>
                  <p className={styles.titleText}>Sri.Anagani Satya Prasad</p>
                  <p className={styles.infoText}>{"Hon'ble Minister for Revenue,"}</p>
                  <p className={styles.infoText}>Registration & Stamps</p>
                </div>
                <Image alt='' width={55} height={55} src="/PDE/images/minister_img.svg" className={styles.leftImg} />
              </div>
            </Col>
          </Row>
          {/* InfoBar container */}
          <div className={`${styles.InfoBarContainer} ${styles.informationText}`}>
            <Row className={styles.informationText}>
              <Col lg={6} md={12} xs={12}>
                <div className={styles.InfoTextContainer}>
                  <div className={styles.phoneText}>
                    <Image alt='phone' width={16} height={20} src="/PDE/images/icon-phone.svg" />
                    <p className={styles.InfoBarText}>+91 9121106359</p>
                  </div>
                  <div className={styles.mailText}>
                    <Image alt='emial' width={16} height={20} src="/PDE/images/icon-email.svg" />
                    <p className={styles.InfoBarText}>helpdesk-it[at]igrs[dot]ap[dot]gov[dot]in</p>
                  </div>
                </div>
              </Col>

              <Col lg={6} md={12} xs={12} className={styles.mailTextInfo}>
                <div className={styles.SearchContainer}>
                  {/* <Image alt='' width={20} height={20} src="/PDE/images/user.png" className={styles.userImg} /> */}
                  <p className={` ${styles.InfoBarText} ${styles.UserText}`}>{LoginDetails.lastLogin ? "Last Login :" : null} {LoginDetails.lastLogin}</p>
                  <p className={` ${styles.InfoBarText} ${styles.UserText}`}>{LoginDetails.loginName}</p>
                  {LoginDetails.loginName && <FiLogOut className='LogoutIcon' height={50} width={50} onClick={() => OnLogout()} />}
                  {/* <input
            className={styles.searchBox}
            type="text"
            placeholder="Search"
            aria-label="Search" /> */}
                  {/* <div className={`input-group-prepend ${styles.header_topbar_right_mdform_groupicon}`}>
            <button className={styles.searchButton} type="submit"><Image alt='' width={24} height={24} src="/PDE/images/icon-search.svg" /></button>
          </div> */}
                </div>

              </Col>
            </Row>
          </div>
          <div className={styles.StartLine}></div>
        </Container>
      </div>
    </header>
  )
}

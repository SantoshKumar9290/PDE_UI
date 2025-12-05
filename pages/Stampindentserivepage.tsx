import React, { useEffect, useState } from 'react';
import styles from '../styles/pages/Services.module.scss';
import { Container, Row, Col } from 'react-bootstrap';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { KeepLoggedIn, ShowMessagePopup } from '../src/GenericFunctions';
import { useAppDispatch, useAppSelector } from '../src/redux/hooks';
import { setPaymentOP } from '../src/redux/paymentSlice';
import Head from 'next/head';


const ServicesPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  let LoginDetails = useAppSelector((state) => state.login.loginDetails);
  useEffect(() => {
    if (KeepLoggedIn()) {
      localStorage.setItem("GetApplicationDetails", "");
    }
    else { ShowMessagePopup(false, "Invalid Access", "/") }
  }, []);

  const redirectToPage = (location: string) => {
    router.push({
      pathname: location,
      // query: query,
    })
  }

  return (
    <div className='PageSpacing'>
      <Head>
        <title>Services - Public Data Entry</title>
      </Head>
      <div className={styles.ServicepageMsain}>
        <Container>
          <Row>
            <Col>
            <div className={`${styles.BacBtnContainer} ${styles.actionbtn}`} onClick={() => { redirectToPage("/ServiceLandingPage") }}><Image alt="Image" height={30} width={28} src='/PDE/images/backarrow.svg' /><span>Back</span></div>
            </Col>
          </Row>
          <Row>
            <Col lg={12} md={12} xs={12} >
              <Row style={{ display: 'flex', justifyContent: 'center' }}>
                <Col lg={3} md={6} xs={12} className={styles.serviceMainCon}>
                  <div onClick={() => redirectToPage(LoginDetails.loginType == "USER" || LoginDetails.loginType =="CSC" ? "/StampIndent" : "/SroApplicationListPage")} className={`${styles.serviceColumn} ${styles.docServicebg}`}>
                    <div className={styles.ServieImginfo}>
                      <div className={styles.imageColumn}>
                        <Image alt="Image" height={60} width={60} src='/PDE/images/New-img.svg' />
                      </div>
                      <div className={styles.himageColumn}>
                        <Image alt="Image" height={60} width={60} src='/PDE/images/new-white-img.svg' />
                      </div>
                    </div>
                    <h6 className={styles.serviceTitle}>Create Stamp Indent Form<span>Data Entry for New Stamp Indent form</span><span>[కొత్త స్టాంప్ ఇండెంట్ ఫారమ్ కోసం డేటా ఎంట్రీ]</span></h6>
                  </div>
                </Col>
                {LoginDetails.loginType == "USER" || LoginDetails.loginType =="CSC" ?
                  <Col lg={3} md={6} xs={12} className={styles.serviceMainCon}>
                    <div onClick={() => redirectToPage("/Stampindentpaymentpage")} className={`${styles.serviceColumn} ${styles.paymentbg}`}>
                      <div className={styles.ServieImginfo}>
                        <div className={styles.imageColumn}>
                          <Image alt="Image" height={62} width={62} src='/PDE/images/payment.svg' />
                        </div>
                        <div className={styles.himageColumn}>
                          <Image alt="Image" height={62} width={62} src='/PDE/images/payment-white.svg' />
                        </div>
                      </div>
                      <h6 className={styles.serviceTitle}>Make a Payment and Verify<span>[చెల్లింపులు మరియు ధృవీకరణ]</span></h6>
                      <p className={styles.serviceText}>You can make payment after the Request generated and verify your payment<span>[మీరు అభ్యర్థనను రూపొందించిన తర్వాత చెల్లింపు చేయవచ్చు మరియు మీ చెల్లింపును ధృవీకరించవచ్చు.]</span></p>
                    </div>
                  </Col> : null}
                {/* {LoginDetails.loginType == "USER" || LoginDetails.loginType =="CSC" ?
                  <Col lg={3} md={6} xs={12} className={styles.serviceMainCon}>
                    <div onClick={() => redirectToPage("/SlotBookingPage")} className={`${styles.serviceColumn} ${styles.slotServicebg}`}>
                      <div className={styles.ServieImginfo}>
                        <div className={styles.imageColumn}>
                          <Image alt="Image" height={60} width={60} src='/PDE/images/slot-img.svg' />
                        </div>
                        <div className={styles.himageColumn}>
                          <Image alt="Image" height={60} width={60} src='/PDE/images/slot-white-img.svg' />
                        </div>
                      </div>
                      <h6 className={styles.serviceTitle}>Book a Slot<span>[స్లాట్ బుకింగ్]</span></h6>
                      <p className={styles.serviceText}>You can Book Slot to visit the Registration Office after the Document has Finished.<span>[దస్తావేజు పూర్తయిన తర్వాత మీరు రిజిస్ట్రేషన్ కార్యాలయాన్ని సందర్శించడానికి స్లాట్‌ను బుక్ చేసుకోవచ్చు.]</span></p>
                    </div>
                  </Col> : null} */}
                <Col lg={3} md={6} xs={12} className={styles.serviceMainCon}>
                  <div onClick={() => redirectToPage(LoginDetails.loginType == "USER" || LoginDetails.loginType =="CSC" ? "/Stampindentreport" : "/SroReportListPage")} className={`${styles.serviceColumn} ${styles.reportServicebg}`}>
                    <div className={styles.ServieImginfo}>
                      <div className={styles.imageColumn}>
                        <Image alt="Image" height={60} width={60} src='/PDE/images/report-img.svg' />
                      </div>
                      <div className={styles.himageColumn}>
                        <Image alt="Image" height={60} width={60} src='/PDE/images/report-white-img.svg' />
                      </div>
                    </div>
                    <h6 className={styles.serviceTitle}>Reports<span>[నివేదికలు]</span></h6>
                    <p className={styles.serviceText}>You can download the requested Stamp indent form.<span>[మీరు అభ్యర్థించిన స్టాంప్ ఇండెంట్ ఫారమ్‌ను డౌన్‌లోడ్ చేసుకోవచ్చు.]</span></p>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
          {/* <Row className='mt-3'>
          <Col lg={3} md={6} xs={12} className={styles.serviceMainCon}>
                  <div onClick={() => redirectToPage("/ExecutionList")} className={`${styles.serviceColumn} ${styles.reportServicebg}`}>
                    <div className={styles.ServieImginfo}>
                      <div className={styles.imageColumn}>
                        <Image alt="Image" height={60} width={60} src='/PDE/images/report-img.svg' />
                      </div>
                      <div className={styles.himageColumn}>
                        <Image alt="Image" height={60} width={60} src='/PDE/images/report-white-img.svg' />
                      </div>
                    </div>
                    <h6 className={styles.serviceTitle}>Execution<span>[ ]</span></h6>
                    <p className={styles.serviceText}></p>
                  </div>
                </Col>
          </Row> */}
          {/* <button onClick={() => {
            dispatch(setPaymentOP({showModal: true, reqBody: {
              "tmaj_code":"01",
              "tmin_code":"01",
              "local_body":1,
              "flat_nonflat":"N",
              "con_value":200000,
              "adv_amount":0
              }, applicationDetails: {
                applicationId: "1234",
                sroNumber: 725
              }, callBack: null}))
          }}>OPEN MODAL </button> */}
        </Container>
      </div >
      {/* <pre>{JSON.stringify(LoginDetails,null,2)}</pre> */}
    </div >
  )
}

export default ServicesPage
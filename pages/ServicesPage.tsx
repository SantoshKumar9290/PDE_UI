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
            {/* <Col lg={12} md={12} xs={12} > */}
              {/* <Row style={{ display: 'flex', justifyContent: 'center' }}> */}
                <Col lg={3} md={6} xs={12} className={styles.serviceMainCon}>
                  <div onClick={() => redirectToPage(LoginDetails.loginType == "USER" || LoginDetails.loginMode =='VSWS' ? "/ApplicationListPage" : "/SroApplicationListPage")} className={`${styles.serviceColumn} ${styles.docServicebg}`}>
                    <div className={styles.ServieImginfo}>
                      <div className={styles.imageColumn}>
                        <Image alt="Image" height={60} width={60} src='/PDE/images/New-img.svg' />
                      </div>
                      <div className={styles.himageColumn}>
                        <Image alt="Image" height={60} width={60} src='/PDE/images/new-white-img.svg' />
                      </div>
                    </div>
                    <h6 className={styles.serviceTitle}>Create Document<span>[Data Entry & Document Generation]</span><span>[దస్తావేజులు]</span></h6>
                    <p className={styles.serviceText}>You can create a new registration document of SALE / MORTGAGE / GIFT  Deed by entering Buyer, Seller, Property Schedule and witness particulars.<span>[సులభ పద్దతిలో అతి తక్కువ వివరాలను పొందుపరచి (అనగా అమ్మకం దారు , కొనుగోలుదారు మరియు ఆస్తి వివరాలను పొందు పరచి), విక్రయం / తనఖా / దాన సెటిల్మెంట్ ముసాయిదా దస్తావేజులను మీరే తయారు చేసుకోవచ్చును. ]</span></p>
                  </div>
                </Col>
                {LoginDetails.loginType == "USER" ?
                  <Col lg={3} md={6} xs={12} className={styles.serviceMainCon}>
                    <div onClick={() => redirectToPage("/PaymentListPage")} className={`${styles.serviceColumn} ${styles.paymentbg}`}>
                      <div className={styles.ServieImginfo}>
                        <div className={styles.imageColumn}>
                          <Image alt="Image" height={62} width={62} src='/PDE/images/payment.svg' />
                        </div>
                        <div className={styles.himageColumn}>
                          <Image alt="Image" height={62} width={62} src='/PDE/images/payment-white.svg' />
                        </div>
                      </div>
                      <h6 className={styles.serviceTitle}>Make a Payment<span>[చెల్లింపులు]</span></h6>
                      <p className={styles.serviceText}>You can make payment after the document is finished.<span>[దస్తావేజు పూర్తయిన తర్వాత మీరు చెల్లింపు చేయవచ్చు.]</span></p>
                    </div>
                  </Col> : null}
                  {LoginDetails.loginType == "USER" && LoginDetails.loginMode !== "VSWS"  && (
                    <Col lg={3} md={6} xs={12} className={styles.serviceMainCon}>
                      <div
                        onClick={() => redirectToPage("/UrbanPropertyDues")}
                        className={`${styles.serviceColumn} ${styles.paymentbg}`}
                      >
                        <div className={styles.ServieImginfo}>
                          <div className={styles.imageColumn}>
                            <Image alt="Image" height={62} width={62} src="/PDE/images/payment.svg"/>
                          </div>
                          <div className={styles.himageColumn}>
                            <Image alt="Image" height={62} width={62} src="/PDE/images/payment-white.svg"/>
                          </div>
                        </div>
                        <h6 className={styles.serviceTitle}>
                          Urban Property Dues <span>[నగర ఆస్తి బకాయిలు]</span>
                        </h6>
                        <p className={styles.serviceText}>
                          Please clear any pending property dues before proceeding with Slot Booking.
                          <span>
                            [స్లాట్ బుకింగ్‌కు ముందుగా నగర ఆస్తి బకాయిలు చెల్లించండి.]
                          </span>
                        </p>
                      </div>
                    </Col>
                  )}
                {LoginDetails.loginType == "USER" && LoginDetails.loginMode !== "VSWS" ?
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
                  </Col> : null}
              {/* </Row> */}
            {/* </Col> */}
          {/* </Row>
          <Row className="mt-3"> */}
            {LoginDetails.loginMode !== "VSWS" ?
              <Col lg={3} md={6} xs={12} className={`${styles.serviceMainCon} ${LoginDetails.loginMode !== "VSWS" ? "mt-3" : ""}`}>
                <div onClick={() => redirectToPage("/KnowUrbanMutationFee" )} className={`${styles.serviceColumn} ${styles.reportServicebg}`}>
                  <div className={styles.ServieImginfo}>
                    <div className={styles.imageColumn}>
                      <Image alt="Image" height={60} width={60} src='/PDE/images/report-img.svg' />
                    </div>
                    <div className={styles.himageColumn}>
                      <Image alt="Image" height={60} width={60} src='/PDE/images/report-white-img.svg' />
                    </div>
                  </div>
                  <h6 className={styles.serviceTitle}>Know Urban Mutation Fee<span>[నగర ఆస్తి బదిలీ రుసుము]</span></h6>
                  <p className={styles.serviceText}>Know the mutation fee by entering the PTIN and Market Value<span>[PTIN నంబర్ మరియు మార్కెట్ విలువ ద్వార బదిలీ రుసుము తెలుసుకొండి]</span></p>
                </div>
              </Col>
            : null}
          <Col lg={3} md={6} xs={12} className={`${styles.serviceMainCon} ${LoginDetails.loginMode !== "VSWS" ? "mt-3" : ""}`}>
              <div onClick={() => redirectToPage(LoginDetails.loginType == "USER" ? "/ReportsPage" : "/SroReportListPage")} className={`${styles.serviceColumn} ${styles.reportServicebg}`}>
                <div className={styles.ServieImginfo}>
                  <div className={styles.imageColumn}>
                    <Image alt="Image" height={60} width={60} src='/PDE/images/report-img.svg' />
                  </div>
                  <div className={styles.himageColumn}>
                    <Image alt="Image" height={60} width={60} src='/PDE/images/report-white-img.svg' />
                  </div>
                </div>
                <h6 className={styles.serviceTitle}>Reports<span>[నివేదికలు]</span></h6>
                <p className={styles.serviceText}>You can take the reports like CHECK SLIP, ACKNOWLEDGMENT, SLOT BOOKING SLIP and FORM 60/61.<span>[మీరు చెక్ స్లిప్, అక్నాలెడ్జ్‌మెంట్, స్లాట్ బుకింగ్ స్లిప్ మరియు ఫారమ్ 60/61 వంటి నివేదికలను తీసుకోవచ్చు.]</span></p>
              </div>
            </Col>
            <Col lg={3} md={6} xs={12} className={`${styles.serviceMainCon} ${LoginDetails.loginMode !== "VSWS" ? "mt-3" : ""}`}>
              <div
                onClick={() => redirectToPage("/ExecutionList")}
                className={`${styles.serviceColumn} ${styles.reportServicebg}`}
              >
                <div className={styles.ServieImginfo}>
                  <div className={styles.imageColumn}>
                    <Image
                      alt="Image"
                      height={60}
                      width={60}
                      src="/PDE/images/report-img.svg"
                    />
                  </div>
                  <div className={styles.himageColumn}>
                    <Image
                      alt="Image"
                      height={60}
                      width={60}
                      src="/PDE/images/report-white-img.svg"
                    />
                  </div>
                </div>
                <h6 className={styles.serviceTitle}>
                  Execution<span>[ ]</span>
                </h6>
                <p className={styles.serviceText}></p>
              </div>
            </Col>
          </Row>
        </Container>
      </div >
    </div >
  )
}

export default ServicesPage
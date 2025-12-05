import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import styles from '../styles/pages/Services.module.scss';
import { Col, Container, Row } from 'react-bootstrap';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '../src/redux/hooks';
import { setPaymentOP } from '../src/redux/paymentSlice';

const ServiceLandingPage = () => {
    const router = useRouter();
    const paymentOp = useAppSelector(state => state.payment.paymentOp);
    const getPaymentData = useAppSelector(state => state.payment.getPaymentData);
    const getPaymentLoading = useAppSelector(state => state.payment.getPaymentLoading);
    const getPaymentMsg = useAppSelector(state => state.payment.getPaymentMsg);
    const LoginDetails = useAppSelector((state) => state.login.loginDetails);
    const dispatch = useAppDispatch();
    
    const redirectToPage = (location: string) => {
        router.push({
          pathname: location,
          // query: query,
        })
      } 

const paymentAction = () => {
    let paymentRedirectUrl = "http://" + process.env.EC_URL;
    let paymentLink = document.createElement("a");

    let PaymentJSON = {
        "source": "PDE",
        "type": "ffrd",
        "deptId": paymentOp.applicationDetails.applicationId,
        "rmName": LoginDetails.loginName,
        "sroNumber": paymentOp.applicationDetails.sroNumber,
        "rf": getPaymentData.rf_p ? getPaymentData.rf_p : 0,
        "uc": 500,
        // "sd": (getPaymentData.sd_p ? parseInt(getPaymentData.sd_p) - parseInt(paymentOp.applicationDetails.stampPaperValue) : 0) + (getPaymentData.td_p ? getPaymentData.td_p : 0)
        "sd": (getPaymentData.sd_p ? Number(getPaymentData.sd_p) : 0) + (getPaymentData.td_p ? Number(getPaymentData.td_p) + (getPaymentData.rf_p ? Number(getPaymentData.rf_p) : 0) + 500 - parseInt(paymentOp.applicationDetails.stampPaperValue) : 0)
    }

    let encodedData = Buffer.from(JSON.stringify(PaymentJSON), 'utf8').toString('base64')
    paymentLink.href = paymentRedirectUrl + encodedData;

}


    return (
        <div className='PageSpacing ServicePage'>
            <Head>
                <title>Services - Public Data Entry</title>
            </Head>
            <div className={`${styles.ServicepageMsain} ${styles.ServiceLandigInfo}`}>
                <Container>
                    <Row>
                        <Col lg={12} md={12} xs={12} >
                            <Row style={{ display: 'flex', justifyContent: 'center' }}>
                            <Col lg={3} md={6} xs={12} className={styles.serviceMainCon}>
                                    <div onClick={() => redirectToPage("/ServicesPage")} className={`${styles.serviceColumn} ${styles.docServicebg}`}>
                                        <div className={styles.ServieImginfo}>
                                            <div className={styles.imageColumn}>
                                                <Image alt="Image" height={60} width={60} src='/PDE/images/Widget-PDE-b.png' />
                                            </div>
                                            <div className={styles.himageColumn}>
                                                <Image alt="Image" height={60} width={60} src='/PDE/images/Widget-PDE.png' />
                                            </div>
                                        </div>
                                        <h6 className={styles.serviceTitle}>Public Data Entry</h6>
                                    </div>
                                </Col>
                              {LoginDetails.loginMode != 'VSWS' ? <>
                                <Col lg={3} md={6} xs={12} className={styles.serviceMainCon}>
                                    <div onClick={() => redirectToPage("/EDashboard")} className={`${styles.serviceColumn} ${styles.reportServicebg}`}>
                                        <div className={styles.ServieImginfo}>
                                            <div className={styles.imageColumn}>
                                                <Image alt="Image" height={60} width={60} src='/PDE/images/tools-ec-b.png' />
                                            </div>
                                            <div className={styles.himageColumn}>
                                                <Image alt="Image" height={60} width={60} src='/PDE/images/tools-ec.png' />
                                            </div>
                                        </div>
                                        <h6 className={styles.serviceTitle}>EC Search</h6>
                                    </div>
                                </Col>
                                <Col lg={3} md={6} xs={12} className={styles.serviceMainCon}>
                                    <div onClick={() => redirectToPage("/CCdashboardPage")} className={`${styles.serviceColumn} ${styles.slotServicebg}`}>
                                        <div className={styles.ServieImginfo}>
                                            <div className={styles.imageColumn}>
                                                <Image alt="Image" height={60} width={60} src='/PDE/images/tools-certified-copy-b.png' />
                                            </div>
                                            <div className={styles.himageColumn}>
                                                <Image alt="Image" height={60} width={60} src='/PDE/images/tools-certified-copy.png' />
                                            </div>
                                        </div>
                                        <h6 className={styles.serviceTitle}>Certified Copy</h6>
                                    </div>
                                </Col>
                                <Col lg={3} md={6} xs={12} className={styles.serviceMainCon}>
                            <div onClick={() => redirectToPage("/Stampindentserivepage")} className={`${styles.serviceColumn} ${styles.stampservicebg}`}>
                                <div className={styles.ServieImginfo}>
                                    <div className={styles.imageColumn}>
                                        <Image alt="Image" height={60} width={60} src='/PDE/images/stamp-icon-black.svg' />
                                    </div>
                                    <div className={styles.himageColumn}>
                                        <Image alt="Image" height={60} width={60} src='/PDE/images/stamp-icon-white.svg' />
                                    </div>
                                </div>
                                <h6 className={styles.serviceTitle}>Stamp Indent</h6>
                            </div>
                        </Col>
                        <Col lg={3} md={6} xs={12} className={styles.serviceMainCon}>
                            <div onClick={() => redirectToPage("/MVassistance/MvaLandingpage")} className={`${styles.serviceColumn} ${styles.mvServicebg}`}>
                                <div className={styles.ServieImginfo}>
                                    <div className={styles.imageColumn}>
                                        <Image alt="Image" height={60} width={60} src='/PDE/images/service-duty-feee.png' />
                                    </div>
                                    <div className={styles.himageColumn}>
                                        <Image alt="Image" height={60} width={60} src='/PDE/images/service-duty-fee-white.png' />
                                    </div>
                                </div>
                                <h6 className={styles.serviceTitle}>MV Assistance</h6>
                            </div>
                        </Col>
                        </>
                        :
                        <></>}
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    )
}

export default ServiceLandingPage



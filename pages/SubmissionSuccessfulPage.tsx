import React, { Fragment, useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import styles from '../styles/pages/Mixins.module.scss';
import { useRouter } from 'next/router';
import { useAppSelector, useAppDispatch } from '../src/redux/hooks';
import { getApplicationDetails, UseCheckSlotEnabledForSro } from '../src/axios';
import Image from 'next/image';
import Table from 'react-bootstrap/Table';
import { SaveCurrentPartyDetails } from '../src/redux/formSlice';
import { DeletePopupAction, PopupAction } from '../src/redux/commonSlice';
import TableDropdownPresenter from '../src/components/TableDropdownPresenter';
import { SavePropertyDetails } from '../src/redux/formSlice';
import TableInputRadio from '../src/components/TableInputRadio';
import TableInputRadio2 from '../src/components/TableInputRadio2';
import covenantType from '../src/covenantType';
import { CallingAxios, DateFormator, KeepLoggedIn, MasterCodeIdentifier, ShowMessagePopup, ShowPreviewPopup, TotalMarketValueCalculator } from '../src/GenericFunctions';
import { getPaymentStatus, resetPaymentStatus, setPaymentOP } from '../src/redux/paymentSlice';
import Button from '../src/components/Button';
import Head from 'next/head';
import { encryptWithAESPassPhrase } from '../src/utils'

const SubmissionSuccessfulPage = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    let GetstartedDetails = useAppSelector(state => state.form.GetstartedDetails);
    const [ApplicationDetails, setApplicationDetails] = useState<any>({ applicationId: GetstartedDetails.applicationId, registrationType: { TRAN_MAJ_CODE: "", TRAN_MIN_CODE: "", TRAN_DESC: "", PARTY1: "", PARTY1_CODE: "", PARTY2: "", PARTY2_CODE: "" }, status: "ACTIVE", sroDetails: null, executent: [], claimant: [], property: [], payment: [], documentNature: { TRAN_DESC: "" }, MortagageDetails: [], giftRelation: [], presenter: [] });
    const [isPaymentDone, setIsPaymentDone] = useState<boolean>(false);

    const payStatusData = useAppSelector(state => state.payment.payStatusData);
    const payStatusLoading = useAppSelector(state => state.payment.payStatusLoading);
    const payStatusMsg = useAppSelector(state => state.payment.payStatusMsg);

    useEffect(() => {

        return () => {
            dispatch(resetPaymentStatus());
        }
    }, [])

    useEffect(() => {
        if (KeepLoggedIn()) {
            GetApplicationDetails();
            window.onpopstate = () => {
                router.push("/ServicesPage");
            }
        } else { ShowMessagePopup(false, "Invalid Access", "/") }
    }, []);

    const GetApplicationDetails = async () => {
        let data: any = localStorage.getItem("GetApplicationDetails");
        if (data == "" || data == undefined) {
            ShowMessagePopup(false, "Invalid Access", "/");
        }
        else {
            await CallGetApp(data);
        }
    }

    const CallGetApp = async (myData) => {
        let data = JSON.parse(myData);
        if(data.applicationId){        
        let result = await CallingAxios(getApplicationDetails(data.applicationId));
        if (result.status) {
            if (result.data.status != "SYNCED") {
                ShowMessagePopup(false, "Invalid Access", "/");
            } else {
                setApplicationDetails(result.data);
                localStorage.setItem("GetApplicationDetails", JSON.stringify(result.data));
            }

        } else {
            ShowMessagePopup(false, result.message, "")
        }
    }
    else{
        ShowMessagePopup(false, 'Data Not Found', "")

    }
    }

    const FlatIdentifier = (data) => {
        data.map(x => {
            if (x.FLAT_NO != "" && x.FLAT_NO != "-99") {
                return "Y";
            }
        })
        return "N"
    }

    const local_bodyCodeIdentifier = (data) => {
        switch (data) {
            case 'MUNICIPAL CORPORATION [మున్సిపల్ కార్పొరేషన్]': return 1
            case 'SPL./SELECTION GRADE MUNICIPALITY [స్పెషల్ /సెలెక్షన్ గ్రేడ్మున్సిపాలిటీ]': return 2
            case 'OTHER MUNICIPALITY/NOTIFIED AREA [ఇతర మునిసిపాలిటీ / నోటిఫైడ్ ఏరియా]': return 3
            case 'MINOR GRAM PANCHAYAT [ చిన్న గ్రామ పంచాయతీ]': return 4
            case 'MAJOR GRAM PANCHAYAT [మేజర్ గ్రామ పంచాయితీ]': return 5
            case 'GRADEI/OTHER MUNCIPALITY UNDER UA [అర్బన్ అగ్లామరేషన్ లోని గ్రేడ్ 1 మున్సిపాలిటీ మరియు ఇతర మున్సిపాలిటీ]': return 6
            case 'MAJOR GRAM PANCHAYATH UNDER UA [అర్బన్ అగ్లామరేషన్ లోని మేజర్ గ్రామ పంచాయతీ]': return 7
            default: return 0
        }
    }

    const openPaymentModal = () => {
        let currentMarketValue = TotalMarketValueCalculator(ApplicationDetails);
        let taxableValue;
        if (currentMarketValue >= ApplicationDetails?.amount) {
            taxableValue = currentMarketValue;
        } else {
            taxableValue = ApplicationDetails?.amount;
        }

        let data = {
            "tmaj_code": ApplicationDetails.registrationType.TRAN_MAJ_CODE,
            "tmin_code": ApplicationDetails.documentNature.TRAN_MIN_CODE,
            "sroNumber": ApplicationDetails.sroCode,
            "local_body": 3,
            //MasterCodeIdentifier("localBody", ApplicationDetails.property[0].localBodyType),
            "flat_nonflat": FlatIdentifier(ApplicationDetails.property),
            "marketValue": TotalMarketValueCalculator(ApplicationDetails), //ApplicationDetails.property[0].marketValue? ApplicationDetails.property[0].marketValue: 0,
            "finalTaxbleValue": taxableValue,
            "con_value": ApplicationDetails.amount,//property.reduce((total, num) => {return total + (num.amount ? parseInt(num.amount) : 0)}, 0),
            "adv_amount": 0
            // { "tmaj_code":"01", "tmin_code":"01", "local_body":1, "flat_nonflat":"N", "con_value":1000, "adv_amount":0}
        }
        dispatch(setPaymentOP({
            showModal: true, reqBody: data
            , applicationDetails: {
                applicationId: ApplicationDetails.applicationId,
                sroNumber: ApplicationDetails.sroCode,
                stampPaperValue: ApplicationDetails.stampPaperValue
            }, callBack: () => { setIsPaymentDone(true); dispatch(resetPaymentStatus()) }
        }))
    }
    const SlotBookingRedirect = async () => {
        let appID = ApplicationDetails.applicationId;
        let sroCode = ApplicationDetails.sroCode;
        let result: any = await CallingAxios(UseCheckSlotEnabledForSro(sroCode));
        if (result.status && result.data > 0) {
            let slotCode = sroCode + "_" + appID;
            let encryptedData = encryptWithAESPassPhrase(slotCode, '123456');
            encryptedData = encodeURIComponent(encryptedData);
            let redirectionUrl = process.env.SLOT_BOOKING_URL + encryptedData;
            console.log("redirectionUrl ::::  ", redirectionUrl);
            window.open(redirectionUrl, '_blank');
        }
        else {
            ShowMessagePopup(false, 'Slot Booking is not enabled for ' + ApplicationDetails.sroOffice, "");
        }
    }

    const UrbanPropertyDuesRedirect = async () => {
        let appID = ApplicationDetails.applicationId;
        let encryptedData = encryptWithAESPassPhrase(appID, '123456');
        encryptedData = encodeURIComponent(encryptedData);
        router.push({
          pathname: '/UrbanPropertyDues',
          query: { data: encryptedData },
        });
      };

    let vswscondition = ApplicationDetails.registrationType.TRAN_MAJ_CODE === "04" && ApplicationDetails.documentNature.TRAN_MIN_CODE === '04'

    return (
        <div className='PageSpacing pt-0'>
            <Head>
                <title>Submission Sucessfull - Public Data Entry</title>
            </Head>
            <Container>
                {/* <div className='tabContainerInfo'>
                    <Container>
                        <Row>
                            <Col lg={12} md={12} xs={12}>
                                <div className='tabContainer'>
                                    <div className='inactiveTabButton'>Get Started<div></div></div>
                                    <div className='activeTabButton'>Parties Details<div></div></div>
                                    <div className='inactiveTabButton'>Property Details<div></div></div>
                                    <div className='inactiveTabButton'>Slot Booking<div></div></div>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div> */}

                <Row>
                    <Col lg={10} md={12} xs={12}></Col>
                    <Col lg={2} md={12} xs={12}>
                        <div className='text-end previewCon'><button className='PreBtn proceedButton' onClick={() => ShowPreviewPopup()} >Preview Document</button></div>
                    </Col>
                </Row>
                <div className={`pt-4 ${styles.mainContainer} ${styles.ListviewMain}`}>
                    <Row className='ApplicationNum mb-5'>
                        <Col lg={6} md={6} xs={12}>
                            <div className='ContainerColumn TitleColmn' style={{ cursor: 'pointer' }} onClick={() => { router.push("/ServicesPage") }}>
                                <h4 className='TitleText left-title' style={{ cursor: 'pointer' }}>{ApplicationDetails.documentNature ? ApplicationDetails.documentNature.TRAN_DESC : null}</h4>
                            </div>
                        </Col>
                        <Col lg={6} md={6} xs={12} className='text-end'>
                            <div className='ContainerColumn TitleColmn'>
                                {/* <h4 className='TitleText' style={{ textAlign: 'right' }}></h4> */}
                                <h4 className='TitleText' style={{ textAlign: 'right' }}>Application ID: {ApplicationDetails.applicationId}</h4>
                            </div>
                        </Col>
                    </Row>
                </div>
                {/* <div style={{ padding: '3rem', display: 'flex', justifyContent: 'center', marginTop: '2rem', gap: '20px' }}> */}
                <div className={styles.DocSubmitPage}>
                    <Row>
                        <Col lg={12} md={12} sm={12}>
                            <div className='text-center mt-1'>
                                <div className={` ${styles.RegistrationInput} ${styles.LoginPageInput}`}>
                                    <div className="p">
                                        <Image alt='' width={60} height={60} className={styles.image} src={payStatusMsg ? "/PDE/images/error_filled.svg" : "/PDE/images/success-icon.png"} />
                                    </div>
                                    <div className="p">
                                        {
                                            payStatusMsg ? <span className={styles.errTxt}>{payStatusMsg}</span> :
                                                Object.keys(payStatusData).length ? <span className={styles.errTxt}>{payStatusData.totalAmount} Paid Successfully</span> :
                                                    <h4>Congratulations <br /><span>Your Document Submitted Successfully</span></h4>
                                        }
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        {
                            isPaymentDone ?
                                <Col className='text-center p-0'>
                                    {
                                        payStatusMsg ?
                                            <>
                                                <div className={styles['flex-btn-box']}>
                                                    <button className='proceedButton' onClick={() => { router.push("/ServicesPage") }}>Back</button>
                                                    <Button type='button' btnName='Retry Payment' onClick={openPaymentModal} />
                                                    <button className='proceedButton' onClick={() => { router.push("/SlotBookingViewPage") }}>Slot Booking</button>
                                                </div>
                                            </>
                                            :
                                            Object.keys(payStatusData).length
                                                ?
                                                <>
                                                    <div className={styles['flex-btn-box']}>
                                                        <button className='proceedButton' onClick={() => { router.push("/ServicesPage") }}>Back</button>
                                                        <button className='proceedButton' onClick={() => { router.push("/SlotBookingViewPage") }}>Slot Booking</button>
                                                    </div>
                                                </>
                                                :
                                                <div className={styles['flex-btn-box']}>
                                                    <Button type='button' btnName='View Payment Status' onClick={() => {
                                                        dispatch(getPaymentStatus(ApplicationDetails.applicationId))
                                                    }} status={payStatusLoading} />
                                                </div>
                                    }
                                </Col>
                                :
                                <>
                                    <Col lg={vswscondition ? 12 : 4} md={12} sm={12} className='text-center p-0'>
                                        <button className='proceedButton' onClick={openPaymentModal}>Proceed to Payment</button>
                                    </Col>
                                    {!vswscondition && 
                                        <>
                                            <Col lg={4} md={12} sm={12} className='text-center p-0'>
                                                <button className='proceedButton' onClick={UrbanPropertyDuesRedirect}>Proceed to Urban Property Payment</button>
                                            </Col>
                                            <Col lg={4} md={12} sm={12} className='text-center p-0'>
                                            <button className='proceedButton' onClick={ SlotBookingRedirect }>Proceed to Slot Booking</button> 
                                            </Col>
                                        </>
                                    }
                                </>
                        }
                    </Row>
                </div>
                {/* <Image alt='' width={60} height={60} className={styles.sImage} src="/PDE/images/success-icon.png" />
                    <p style={{ fontSize: '40px', color: 'green' }}>Document Submitted Successfully</p> */}
                {/* </div> */}
                {/* <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '5rem' }}> */}
                {/* <Col lg={12} md={12} xs={12} style={{ display: 'flex', justifyContent: 'center' }}> */}

                {/* </Col> */}
                {/* <Col lg={12} md={12} xs={12} style={{ display: 'flex', justifyContent: 'center' }}> */}

                {/* </Col> */}
                {/* <Col lg={12} md={12} xs={12} style={{ display: 'flex', justifyContent: 'center' }}> */}

                {/* </Col> */}
                {/* </div> */}
            </Container>
            {/* <pre>{JSON.stringify(ApplicationDetails, null, 2)}</pre> */}
        </div>
    )
}

export default SubmissionSuccessfulPage;
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import { useAppSelector, useAppDispatch } from '../src/redux/hooks';
import styles from '../styles/pages/Mixins.module.scss';
import { Container, Row, Col } from 'react-bootstrap';
import Image from 'next/image';
import Table from 'react-bootstrap/Table';
import { SaveGetstartedDetails } from '../src/redux/formSlice';
import { freezstamp, getApplicationDetails, getstampindentdetails, getstampindentreqdetails, GetstampPaymentStatus, Stamppaymentupdate } from '../src/axios';
import { CallingAxios, KeepLoggedIn, ShowMessagePopup } from '../src/GenericFunctions';
import Head from 'next/head';
import { returnDate } from '../src/utils';
import { PopupAction } from '../src/redux/commonSlice';


const Stampindentpayment = () => {
    const dispatch = useAppDispatch()
    const router = useRouter();
    let [ApplicationList, setApplicationList] = useState<any>([]);
    let Loader = useAppSelector((state) => state.common.Loading);
    const ShowAlert = (type, message) => { dispatch(PopupAction({ enable: true, type: type, message: message })); }

    const redirectToPage = (location: string) => {
        router.push({
            pathname: location,
        })
    }
    const [publicdetals, setpublicdetails] = useState<any>([]);

    useEffect(() => {
        let templogindetails: any = JSON.parse(localStorage.getItem("LoginDetails"));
        setpublicdetails(templogindetails)
        if (KeepLoggedIn()) { GetApplicationDetails(templogindetails?.loginId); localStorage.setItem("GetApplicationDetails", ""); }
        else { ShowMessagePopup(false, "Invalid Access", "/") }
    }, []);

    const GetApplicationDetails = async (loginId: any) => {
        let data = {
            LoginId: loginId
        }
        let result: any = await CallingAxios(getstampindentreqdetails(data));
        if (result.status == true) {
            let x: any = [...result.data];
            setApplicationList(x);
        } else {
            alert(result.message)
        }
    }

    const OnClickOperation = (action: string, singleData: any) => {
        if (action == "edit") {
            let data = { ...singleData }
            localStorage.setItem("GetApplicationDetails", JSON.stringify(data));
            dispatch(SaveGetstartedDetails(data));
            setTimeout(() => {
                router.push("/PaymentsPage");
            }, 0);
        }
    }
    const handlePaymentLinkClick = async (getdata) => {
        let stampdetail = await CallingAxios(getstampindentdetails(getdata))
        let paymentRedirectUrl = process.env.PAYMENT_URL + "/igrsPayment?paymentData=";
        let paymentLink = document.createElement("a");
        let PaymentJSON = {
            source: "STAMPS",
            deptId: getdata.REQUEST_ID,
            rmName: getdata.RM_NAME,
            sroNumber: getdata.SR_CODE,
            rf: stampdetail.data.reduce((total, item) => total + parseFloat(item.AMOUNT), 0),
            // multiPay: 
            // stampdetail.data?.map(item => (
                // {
                amount:  stampdetail.data.reduce((total, item) => total + parseFloat(item.AMOUNT), 0),
                type: stampdetail.data[0].STAMP_TYPE === 'A.P.Adv Welfare Fund Stamps' ? 'awfss' : ((stampdetail.data[0].STAMP_TYPE === 'Copy Stamps' || stampdetail.data[0].STAMP_TYPE === 'Judicial Stamp Papers') ? 'jss' : (stampdetail.data[0].STAMP_TYPE === 'Court Fee Labels' ? 'cfss' : 'njss')),
            // }
        // ))
        };
        let encodedData = Buffer.from(JSON.stringify(PaymentJSON), 'utf8').toString('base64')
        paymentLink.href = paymentRedirectUrl + encodedData;
        paymentLink.target = "_blank";
        paymentLink.click();
        setTimeout(function () { paymentLink.remove(); }, 1000);
    };

    const GetTransactionStatus = async (getdata: any) => {
        let dat = {
            reqid: getdata.REQUEST_ID
        }
        let result = await CallingAxios(GetstampPaymentStatus(getdata.REQUEST_ID));
        if (result && result.status) {
            let result: any = await CallingAxios(Stamppaymentupdate(dat))

            if (result.status) {
                ShowMessagePopup(true, 'Payment Details Saved Successfully', "");
            } else {
                ShowMessagePopup(false, 'Payment Details Failed', "")
            }
            // ShowAlert(true, "Payment successfull.");
            const freezstamps: any = await CallingAxios(freezstamp(dat));
            if (freezstamps.status) {
                ShowAlert(true, "selected stamps are freezed.");
                GetApplicationDetails(publicdetals?.loginId);
            }
        }
        else {
            ShowAlert(false, "Your payment is not yet completed. Please complete the payment process.");
        }
    }
    return (
        <div className='PageSpacing'>
            <Head>
                <title>Payment List - Public Data Entry</title>
            </Head>
            <Container className='ListContainer'>
                <div className={styles.ListviewMain}>
                    <Row className='ApplicationNum'>
                        <Col lg={4} md={6} sm={12}>
                            <div className='ContainerColumn TitleColmn' style={{ cursor: "pointer" }} onClick={() => { redirectToPage("/Stampindentserivepage") }}>
                                <h4 className='TitleText left-title'>Payment List<span>[చెల్లింపు జాబితా]</span></h4>
                            </div>
                        </Col>
                        <Col lg={8} md={8} sm={12}>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={12} md={12} sm={12}>
                            <div className='tableFixHead'>
                                <Table striped bordered hover className='TableData ListData'>
                                    <thead>
                                        <tr>
                                            <th>S.No.<span>[క్రమ సంఖ్య]</span></th>
                                            <th>Request ID<span>[అభ్యర్థన ID]</span></th>
                                            <th>S.R.O<span>[ఎస్.ఆర్.ఓ]</span></th>
                                            <th>Stamp Category<span>[స్టాంప్ వర్గం]</span></th>
                                            <th>Stamp Type<span>[స్టాంప్ రకం]</span></th>
                                            <th>Purchase for<span>[కొనుగోలు కోసం]</span></th>
                                            <th>Total Stamps<span>[మొత్తం స్టాంపులు]</span></th>
                                            <th>Amount<span>[మొత్తం]</span></th>
                                            <th>Requested Date<span>[అభ్యర్థించిన తేదీ]</span></th>
                                            <th>Status<span>[స్థితి]</span></th>
                                            <th>Action<span>[చర్య]</span></th>
                                        </tr>
                                    </thead>
                                    {ApplicationList.length ?
                                        <tbody>
                                            {
                                                ApplicationList.map((SingleApplication: any, index: any) => {
                                                    // if (SingleApplication.status == "COMPLETED") {
                                                    return (
                                                        //    SingleApplication?.TOTAL_AMOUNT >50 && 
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>{SingleApplication.REQUEST_ID}</td>
                                                            <td>{SingleApplication.SR_CODE}</td>
                                                            <td>{SingleApplication.STAMP_CATEGORY}</td>
                                                            <td>{SingleApplication.STAMP_TYPE}</td>
                                                            <td>{SingleApplication.RM_NAME}</td>
                                                            <td>{SingleApplication.TOTAL_STAMPS}</td>
                                                            <td>{SingleApplication.TOTAL_AMOUNT}</td>
                                                            <td>{new Date(SingleApplication.TIME_STAMP).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</td>
                                                            <td>{SingleApplication.PAYMENT_STATUS === 'N' ? "Pending" : "Paid"}</td>
                                                            <td>
                                                                {SingleApplication?.TOTAL_AMOUNT > 50 ? <>
                                                                    {/* {SingleApplication.slots != "" && SingleApplication.slots || SingleApplication.slots == null ? */}
                                                                    <div className={`${styles.actionTitle} ${styles.actionbtn}`}
                                                                        onClick={() => handlePaymentLinkClick(SingleApplication)}>
                                                                        <span style={{ cursor: "pointer" }}>
                                                                            <Image alt="Image" height={20} width={15} src='/PDE/images/paymentlist.svg' className={styles.tableactionImg} />
                                                                            <span className={`${styles.tooltiptext} ${styles.slotTooltip}`}>Payment</span>
                                                                        </span>
                                                                    </div>

                                                                    <div className={`${styles.actionTitle} ${styles.actionbtn}`}
                                                                        onClick={() => GetTransactionStatus(SingleApplication)}>
                                                                        <span style={{ cursor: "pointer" }}>
                                                                            <Image alt="Image" height={20} width={15} src='/PDE/images/verify_payment.svg' className={styles.tableactionImg} />
                                                                            <span className={`${styles.tooltiptext} ${styles.slotTooltip}`}>Verify</span>
                                                                        </span>
                                                                    </div>
                                                                </> :
                                                                    <span className='text-danger'>Pay at sro</span>
                                                                }
                                                            </td>
                                                        </tr>
                                                    )
                                                    // }
                                                })
                                            }

                                        </tbody> : null
                                    }
                                </Table>
                                {!ApplicationList.length && Loader.enable == false ?
                                    <Table striped bordered hover className='text-center'>
                                        <thead>
                                            <tr>
                                                <th>Not Found Payment List</th>
                                            </tr>
                                        </thead>
                                    </Table> : null
                                }
                                <Row className='my-5'>
                                    <Col className='d-flex  flex-column'>
                                        <div className='mb-2'>
                                            <span className='fw-bold' style={{ color: '#ff0000' }}>Payment Instructions:</span>
                                        </div>
                                        <div className='mb-2'>
                                            <span style={{ color: '#ff0000' }}>* For amounts less than ₹50, please make the payment at the Sub-Registrar Office (SRO).</span>
                                        </div>
                                        <div>
                                            <span style={{ color: '#ff0000' }}> * For stamp payments over ₹1000, online payment is required.</span>
                                        </div>
                                    </Col>
                                </Row>
                            </div>

                        </Col>

                    </Row>

                </div>
            </Container>
            {/* {<pre>{JSON.stringify(ApplicationList, null, 2)}</pre>} */}
        </div>
    )
}
export default Stampindentpayment;

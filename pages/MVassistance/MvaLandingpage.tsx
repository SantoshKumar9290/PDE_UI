import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Row, Col, Table, Modal, Container } from "react-bootstrap";
import TableInput from '../../src/components/TableInput';
import { CallingAxios, decodeBase64, KeepLoggedIn, ShowMessagePopup } from "../../src/GenericFunctions";
import { previewPDF, getMVRequestsData, GetPaymentStatus, UpdatePaymentMVRequest } from "../../src/axios";
import { Loading } from "../../src/redux/hooks";
import { useAppSelector, useAppDispatch } from '../../src/redux/hooks';
import { PopupAction } from '../../src/redux/commonSlice';
import Image from "next/image";
import styles from '../../styles/pages/Services.module.scss';


const MvaLandingpage = () => {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const [MVData, setMVData] = useState<any>({})
    let LoginDetails: any = useAppSelector(state => state.login.loginDetails);
    const [payData, setPayData] = useState<any>({})
    const [show, setShow] = useState(false);


    const handleShow = () => setShow(true);
    const handleClose = () => {
        window.location.reload();
    };

    const redirectToPage = (location: string) => {
        router.push({
            pathname: location,
        })
    }

    const ShowAlert = (type, message) => { dispatch(PopupAction({ enable: true, type: type, message: message })); }

    const handlePaymentLinkClick = (item: any) => {
        let paymentRedirectUrl = process.env.PAYMENT_URL + "/igrsPayment?paymentData=";
        let paymentLink = document.createElement("a");
        let PaymentJSON = {
            "type": "ucdecms",
            "source": "MV",
            "deptId": item.REQ_NO,
            "rmName": LoginDetails.loginName,
            "sroNumber": item.SR_CODE,
            "rf": 50
        }
        let encodedData = Buffer.from(JSON.stringify(PaymentJSON), 'utf8').toString('base64')
        paymentLink.href = paymentRedirectUrl + encodedData;
        paymentLink.target = "_blank";
        paymentLink.click();
        setTimeout(function () { paymentLink.remove(); }, 1000);
    };


    const GetTransactionStatus = async (data: any) => {
        Loading(true);
        let result = await GetPaymentStatus(data);
        Loading(false);
        if (result && result.status) {
            setPayData({ ...result.data })
            UpdatePaymentMVRequestdata(data, { ...result.data })
            handleShow()
        } else {
            ShowAlert(false, "Your payment is not yet completed. Please complete the payment process.");
        }
    }

    const UpdatePaymentMVRequestdata = async (Data: any, pdata: any) => {
        let data: any = {
            "REQ_NO": Data.REQ_NO,
            "REG_YEAR": Data.MVA_YEAR,
            "SR_CODE": Data.SR_CODE,
            "DEPT_TRANS_ID": pdata.deptTransID,
            "PAID_AMOUNT": pdata.amount,
        }
        console.log(Data)
        let result: any = await CallingAxios(UpdatePaymentMVRequest(data))

        if (result.status) {
            ShowMessagePopup(true, 'Payment Details Verified Successfully', "")
        } else {
            ShowMessagePopup(false, 'Payment Details Failed', "")
        }
    }

    const onclick = () => {
        Loading(true);
        redirectToPage('/MVassistance/Property');
        Loading(false);
    }

    useEffect(() => {
        if (KeepLoggedIn()) {
            GetReportsdata();
        } else { ShowMessagePopup(false, "Invalid Access", "/") }
    }, []);

    const GetReportsdata = async () => {
        let data: any = JSON.parse(localStorage.getItem("LoginDetails"));
        if (data == "" || data == undefined) {
            ShowMessagePopup(false, "Invalid Access", "/");
        }
        else {
            GetMVReportsdata(data.loginId);
        }
    }


    const GetMVReportsdata = async (data: any) => {
        Loading(true);
        let result = await getMVRequestsData(data);
        Loading(false);
        if (result && result.status) {
            setMVData({ ...result.data })
        }
    }

    const handlePreviewPDF = async (item: any) => {
        try {
            let data = {
                SR_CODE: item.SR_CODE,
                REQ_NO: item.REQ_NO,
                REG_YEAR: item.REG_YEAR
            }
            console.log(data);
            const response = await CallingAxios(previewPDF(data));
            if (response) {
                const binaryData = decodeBase64(response);
                const byteArray = new Uint8Array(binaryData.length);
                for (let i = 0; i < binaryData.length; i++) {
                    byteArray[i] = binaryData.charCodeAt(i);
                }
                const blob = new Blob([byteArray], { type: 'application/pdf' });
                const blobUrl = URL.createObjectURL(blob);
                window.open(blobUrl, '_blank')
            }
            else {
                console.error('No valid PDF data found in the response');
            }
        }
        catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    const dataAvailable = Object.keys(MVData).length > 0

    return (
        <>
            <div className="pageMainWrap innerpage">
                <Head>
                    <title>Mv Assitance - PDE</title>
                    <meta name="description" content="login" />
                    <link rel="icon" href="/card/images/APGovtLogo.png" />
                </Head>
                <div className="mainWrapper">
                    <Row className='ApplicationNum'>
                        <Col lg={4} md={6} xs={12}>
                            <div className='ContainerColumn TitleColmn' onClick={() => { redirectToPage("/ServiceLandingPage") }}>
                                <h4 className='TitleText left-title'>MV Assistance Report</h4>
                            </div>
                        </Col>
                        <Col lg={4} md={6} xs={12}></Col>
                        <Col lg={4} md={6} xs={12}><div className="text-end" ><button className="proceedButton  mb-2" onClick={onclick}>APPLY MV ASSISTANCE</button></div></Col>
                    </Row>
                    <Row>
                        <Col lg={12} md={12} xs={12}>
                            <div className="tableFixHead">
                                <Table striped bordered hover className='TableData ListData table-responsive'>
                                    <thead style={{ height: "2rem" }}>
                                        <tr>
                                            <th style={{ width: "10%" }}>REQUEST NO.</th>
                                            <th>SRO NUMBER</th>
                                            <th>REG. YEAR</th>
                                            <th>PAID AMOUNT</th>
                                            <th>STATUS</th>
                                            <th>MV DOCUMENT</th>
                                            <th>ACTION</th>
                                        </tr>
                                    </thead>
                                    {dataAvailable ?
                                        <tbody>
                                            {
                                                Object.values<any>(MVData).map((item: any, index: number) => (
                                                    <tr key={index}>
                                                        <td style={{ width: "10%" }}>{item.REQ_NO}</td>
                                                        <td>{item.SR_CODE}</td>
                                                        <td>{item.MVA_YEAR}</td>
                                                        <td>{item.PAID_AMOUNT ? item.PAID_AMOUNT : '-'}</td>
                                                        <td>{item.STATUS === 'P' ? 'Pending' : 'Completed'}</td>
                                                        <td>{item.STATUS === 'P' ? (<button onClick={() => { handlePreviewPDF(item) }} className="proceedButton2">Preview</button>) : (<button onClick={() => { handlePreviewPDF(item) }} className="proceedButton2">Download</button>)}</td>
                                                        <td>
                                                            {item.PAID_AMOUNT === null ? (
                                                                <Row style={{ display: 'flex', justifyContent: 'center' }}>
                                                                    <Col lg={3} md={6} xs={12} className={styles.serviceMainCon}>
                                                                        <div
                                                                            className={`${styles.imageColumn} tooltip-container`}
                                                                            onClick={() => { handlePaymentLinkClick(item) }}
                                                                        >
                                                                            <Image alt="Image" height={35} width={35} src='/PDE/images/MVpayment.png' />
                                                                            <span className="tooltip-text">Click Here To Pay</span>
                                                                        </div>
                                                                    </Col>
                                                                    <Col lg={3} md={6} xs={12} className={styles.serviceMainCon}>
                                                                        <div
                                                                            className={`${styles.imageColumn} tooltip-container`}
                                                                            onClick={() => { GetTransactionStatus(item) }}
                                                                        >
                                                                            <Image alt="Image" height={30} width={30} src='/PDE/images/MVverify.png' />
                                                                            <span className="tooltip-text">Click Here To Verify</span>
                                                                        </div>
                                                                    </Col>
                                                                </Row>
                                                            ) : (
                                                                <div className={`${styles.imageColumn} tooltip-container`} >
                                                                    <Image alt="Image" height={30} width={30} src='/PDE/images/MVdone.png' />
                                                                    <span className="tooltip-text">Payment Done</span>
                                                                </div>
                                                            )}
                                                        </td>


                                                    </tr>
                                                ))
                                            }
                                        </tbody> :
                                        <tbody>
                                            <tr>
                                                <td colSpan={6}>No data found</td>
                                            </tr>
                                        </tbody>
                                    }
                                </Table>
                            </div>
                        </Col>
                    </Row>

                    {show &&
                        <Modal className='text-center ' show={show} onHide={handleClose} backdrop='static'>
                            <Modal.Header closeButton className=' modalheadbg '  >
                                <Modal.Title className='ms-5 ps-5 text-center text-white '></Modal.Title>
                            </Modal.Header>
                            <Modal.Body >
                                <Container>
                                    <Table bordered hover className='TableData mt-4 mb-4'>
                                        <thead style={{ height: "2rem" }}>
                                            <tr>
                                                <th style={{ width: "10%" }}>REQUEST NO.</th>
                                                <th>DEPARTMRNT TRANSACTION ID</th>
                                                <th>PAID AMOUNT</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td style={{ width: "10%" }}>{payData.reqno ? payData.reqno : ''}</td>
                                                <td>{payData.deptTransID ? payData.deptTransID : ''}</td>
                                                <td>{payData.amount ? payData.amount : ''}</td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </Container>
                            </Modal.Body>
                        </Modal>
                    }

                </div>
            </div>
            {/* <pre>{JSON.stringify(LoginDetails, null, 2)}</pre> */}
            {/* <pre>{JSON.stringify(payData, null, 2)}</pre> */}

        </>
    );
};
export default MvaLandingpage;
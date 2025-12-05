import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import { Col, Container, Row, Table } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '../src/redux/hooks';
import {getAllUserCCRequests,UseGetPaymentStatus,UseUpdateCCrequestDetails,UseCCDownload, getApplicationDetails, UseUpdateCCPaymentStatus, UseGetCCPaymentStatus, VerifyCSCPaymentStatus} from '../src/axios'
import styles from '../styles/pages/Mixins.module.scss';
import Image from 'next/image'
import { CallingAxios, KeepLoggedIn, Loading, ShowMessagePopup } from '../src/GenericFunctions';
import ApplicationList from './ApplicationListPage';



const CCdashboardPage = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const LoginDetails = useAppSelector((state) => state.login.loginDetails);
    const [ccData,setCcData]= useState<any>([]);
    const [btnStatus,setbtnStatus]= useState<any>(false);
    const [loginDetails, setLoginDetails] = useState<any>({});

    const redirectToPage = (location: string) => {
        router.push({
            pathname: location,
        })
    }
    useEffect(() => {
        if (KeepLoggedIn()) {
            const data = localStorage.getItem("LoginDetails");
            if(data!=null && data!=undefined )
            {
                let jsonData = JSON.parse(data);
                setLoginDetails(jsonData);
            }
            CCDataByUserId()
        } else { ShowMessagePopup(false, "Invalid Access", "/") }
    }, []);

    const CCDataByUserId =async ()=>{
        let resp :any =await CallingAxios(getAllUserCCRequests());
        if(resp.status){
            setCcData(resp.data);
        }else{
            ShowMessagePopup(false, "No Data", "")
        }
    }
    
    const UpdateStatus = async(data:any) => {
        let updateData:any ={
            "REQUESTED_ON"  : new Date().toISOString().split("T")[0],
            "STATUS"        :"SD",
            "APP_ID"        :data.appid,
            "SR_CODE"       :data.srcode
        }
        await CallingAxios(UseUpdateCCrequestDetails(updateData));
        CCDataByUserId();
        doVerifyCSCPaymentAndDoIGRSPayment(data);
    } 

    const doVerifyCSCPaymentAndDoIGRSPayment = (data:any) => {
        if(loginDetails?.loginType && loginDetails?.loginType=='CSC') {
            Loading(true);
            let requestno = data.appid;
            let serviceName = 'IGRSCARDPRIMME'
            let cscId = loginDetails.userId;
            VerifyCSCPaymentStatus(requestno,cscId, serviceName).then((response) => {
                if (response?.status) {
                    let cscResponse = response.data;
                    if(cscResponse.status.toLowerCase()=='success'){
                        ShowMessagePopup(true,"CSC payment details found and moving to department payment","");
                        paymentonClick(data);
                        Loading(false);
                    }else{
                        ShowMessagePopup(false,"CSC payment details not found. Please do complete the CSC payment in next tab and back to dasboard, click on payment link for department payment","");
                        Loading(false);
                        setTimeout(() => {
                            let paymentRedirectUrl = cscResponse.payurl;
                            let paymentLink = document.createElement("a");
                            paymentLink.href = paymentRedirectUrl;
                            paymentLink.target = "_blank";
                            document.body.appendChild(paymentLink);
                            paymentLink.click();
                            document.body.removeChild(paymentLink);
                        }, 2000)
                    }
                }
                else{
                    Loading(false);
                    ShowMessagePopup(false, response?.message ?? "Something went wrong, please try again","");
                }
            }).catch((error) => {
                console.error(error);
                Loading(false);
            });
        }else{
            paymentonClick(data);
        }
    }

    const PaymentCheck = async (data:any)=>{
        let result:any = await CallingAxios(UseGetCCPaymentStatus(data.appid,data.srcode));
        if(result.status ==false){
            setbtnStatus(true);
            doVerifyCSCPaymentAndDoIGRSPayment(data);
            //paymentonClick(data);
        }else{
            let updateData:any ={
                "DEPT_TRANS_ID" : result.data.departmentTransID,
                "REQUESTED_ON"  : result.data.createdAt.split("T")[0],
                "PAID_ON"       : result.data.createdAt.split("T")[0],
                "STATUS"        :"RD",
                "APP_ID"        :result.data.applicationNumber,
                "SR_CODE"       :result.data.paidTo
            }
            let resp:any= await CallingAxios(UseUpdateCCrequestDetails(updateData));
            setbtnStatus(false);
            if(resp.status == true){
                ShowMessagePopup(true, "Status Updated", "");
                CCDataByUserId();
            }else{
                ShowMessagePopup(false, "Payment Failed, Try Again", "")
            }
        }
        
    }


    const paymentonClick = async(data:any) => {
        let updateData:any ={
            "REQUESTED_ON"  : new Date().toISOString().split("T")[0],
            "STATUS"        :"SD",
            "APP_ID"        :data.appid,
            "SR_CODE"       :data.srcode
        }
        await CallingAxios(UseUpdateCCrequestDetails(updateData));
        let paymentRedirectUrl = process.env.PAYMENT_URL + "/igrsPayment" + "?paymentData=";
        // let paymentRedirectUrl = "http://117.250.201.41:8091/igrs-utility-ms/igrsPayment?paymentData="
        let paymentLink = document.createElement("a");
        // const cF = concessionFee.GO.length ? { ...concessionFee } : { ...CalculatedDutyFee, uc_p: 500 };
        let PaymentJSON = {
            "deptId": data.appid,
            "source": "CC",
            "type": "orecomf",
            "rmName": LoginDetails.loginName,
            "rmId": "",
            "mobile":LoginDetails.loginMobile?LoginDetails.loginMobile:"",
            "email":LoginDetails.loginEmail?LoginDetails.loginEmail:"",
            "rf": "200",
            "uc": 100,
            "sd": 20,
            "sroNumber": data.srcode
        }
        // let stprs = parseInt(ApplicationDetails.stampPaperValue ? ApplicationDetails.stampPaperValue : 0);
        // PaymentJSON.sd = (PaymentJSON.sd - stprs) > 0 ? (PaymentJSON.sd - stprs) : 0;
        //PaymentJSON.sd =0
        let encodedData = Buffer.from(JSON.stringify(PaymentJSON), 'utf8').toString('base64')
        paymentLink.href = paymentRedirectUrl + encodedData;
        paymentLink.target = "_blank";
        document.body.appendChild(paymentLink);
        paymentLink.click();
        document.body.removeChild(paymentLink);
    }

    
    const downloadReport = async (data: any) => {
        let result: any = await CallingAxios(UseCCDownload(data));
        if(result.status == true){
                ShowMessagePopup(true, "Status Updated", "");
                let updatepayment = await CallingAxios(UseUpdateCCPaymentStatus(data.appid));
                CCDataByUserId();
        }
        else{
            ShowMessagePopup(false, "Try Again", "")
        }
       
    }

    
    return (
        <div className="PageSpacing">
            <Head>
                <title>CC Request</title>
            </Head>
            {/* <Container className='ListContainer'> */}
            <Container>
                <div className={styles.ListviewMain}>
                    <Row>
                        <Col lg={12} md={12} xs={12}>
                            <div className='ContainerColumn TitleColmn' onClick={() => { redirectToPage("/ccLandingpage") }}>
                                <button className='proceedButton newDoc'><span>New Certified Copy</span></button>
                            </div>
                        </Col>
                    </Row>
                    <Row className='ApplicationNum'>
                        <Col lg={4} md={6} xs={12}>
                            <div className='ContainerColumn TitleColmn' onClick={() => { redirectToPage("/ServiceLandingPage") }}>
                                <h4 className='TitleText left-title'>Certified Copy List</h4>
                            </div>
                        </Col>
                        <Col lg={6} md={6} xs={0}></Col>
                    </Row>
                    <Table striped bordered hover className='TableData CCtable table-responsive'>
                        <thead>
                            <tr>
                                <th className='AppidColmn'>S.No</th>
                                <th className='AppidColmn'>APPLICATION ID</th>
                                <th className='SCol'>SRO NAME</th>
                                <th className='AppidColmn'>REG YEAR</th>
                                <th className='AppidColmn'>DOCUMENT NO</th>
                                <th className='SCol'>BOOK NO</th>
                                {/* <th className='AppidColmn'>REQUEST NO</th> */}
                                <th className='AppidColmn'>REQUEST BY</th>
                                {/* <th className='AppidColmn'>DEPT TRANS ID</th> */}
                                {/* <th className='AppidColmn'>REQUEST NO</th> */}
                                {/* <th className='AppidColmn'>STATUS</th> */}
                                <th className='AppidColmn'>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                ccData.map((s:any,index:any)=>{
                                    return(
                                        <tr key={index}>
                                            <td>{index +1}</td>
                                            <td>{s.appid}</td>
                                            <td>{s.srcode}</td>
                                            <td>{s.regyear}</td>
                                            <td>{s.doctno}</td>
                                            <td>{s.bookno}</td>
                                            {/* <td>{s.requestedon}</td> */}
                                            <td>{s.requestedby}</td>
                                            {/* <td>{s.depttransid}</td> */}
                                            {/* <td>{s.appid}</td> */}
                                            {/* <td>{s.status}</td> */}
                                            <td>
                                            {s?.status=='S' ?
                                                <div className={`${styles.actionTitle} ${styles.actionbtn}`}
                                                    onClick={() => UpdateStatus(s)}>
                                                    <Image alt="Image" height={20} width={20} src='/PDE/images/payment.svg' className={styles.tableactionImg} data-toggle="tooltip" data-placement="bottom" />
                                                    <span className={styles.tooltiptext}>Pay Online</span>
                                                </div>
                                                : s?.status=='SD'
                                                ?
                                                <div className={`${styles.actionTitle} ${styles.actionbtn}`}
                                                onClick={() => PaymentCheck(s)}>
                                                    <Image alt="Image" height={20} width={20} src='/PDE/images/verify_payment.svg'  className={styles.tableactionImg} data-toggle="tooltip" data-placement="bottom" />
                                                    <span className={styles.tooltiptext} >Verify Payment</span>
                                                </div>
                                                : s?.status =='RD'?
                                                <div className={`${styles.actionTitle} ${styles.actionbtn}`}
                                                onClick={() => downloadReport(s)}>
                                                    <Image alt="Image" height={20} width={18} src='/PDE/images/download-square.png' className={styles.tableactionImg} data-toggle="tooltip" data-placement="bottom" />
                                                    <span className={styles.tooltiptext}>Download CC</span>
                                                </div>
                                                // :
                                                //  s?.status =='DD'?
                                                // <div className={`${styles.actionTitle} ${styles.actionbtn}`}
                                                // onClick={() => UpdateStatus(s)}>
                                                //     <Image alt="Image" height={22} width={20} src='/PDE/images/re-payment.png' className={styles.tableactionImg} data-toggle="tooltip" data-placement="bottom" />
                                                //     <span className={styles.tooltiptext}>Re-Payment</span>
                                                // </div>
                                                :<div></div>
                                            }
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </Table>
                    {!ccData.length &&  
                        <Table striped bordered hover className='text-center noDataMessage table-responsive'>
                            <thead className='noDataMessage'>
                                <tr className='table-responsive noDataMessage'>
                                    <th className='noDataMessage'>No Data Available</th>
                                    </tr>
                            </thead>
                        </Table> 
                    }
                </div>
                <Row className='noteInfo mt-4'>
                                    <Col lg={12} md={12} xs={12}>
                                        <h6>Note:</h6>
                                        <ul>
                                            <li>A Certified Copy can be downloaded once the payment is completed.</li>
                                            <li>After completing the payment, Please click on the <strong><u>Verify Payment</u></strong> icon to update the status.</li>
                                            <li>A Certified Copy can only be downloaded once. If you wish to download it CC again, Please raise new CC request again.</li>
                                        </ul>
                                    </Col>
                                </Row>
            </Container>
            {/* <pre>{JSON.stringify(ccData, null, 2)}</pre> */}
        </div>
    )
}

export default CCdashboardPage
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Col, Container, Row, Table } from "react-bootstrap";
import { getAllUserECRequests, GetECPaymentStatus, downloadFileFromBase64 } from "../src/axios";
import { checkECValidityLinkById } from "../src/axios-ec";
import Image from 'next/image';
import { Loading, ShowMessagePopup} from "../src/redux/hooks";
import styles from '../styles/pages/Mixins.module.scss';
import { KeepLoggedIn } from '../src/GenericFunctions';
import CustomModal from "../src/components/ec/CustomModal";

interface EDashboardProps {}

const EDashboard: React.FC<EDashboardProps> = () => {
  const router = useRouter();
  
  const [ViewDetailsToggle, setViewDetailsToggle] = useState<boolean>(false);
  const [ECRequestedList, setECRequestedList] = useState<any>();
  const [PaymentRefresh, setPaymentRefresh] = useState<any>({});
  const [loginDetails, setLoginDetails] = useState<any>({});
  const [showRejectModal, setShowRejectModal] = useState<boolean>(false);
  const [rejectComments, setRejectComments] = useState<string>();

  const redirectToPage = (location: string, query?: {}) => {
    router.push({
      pathname: location,
      query: query,
    });
  };

  useEffect(() => {
    if (KeepLoggedIn()) {
      const data = localStorage.getItem("LoginDetails");
      if(data!=null && data!=undefined )
      {
        let jsonData = JSON.parse(data);
        setLoginDetails(jsonData);
      }
      if( ECRequestedList == undefined || ECRequestedList == null ){
        Loading(true);
        getAllUserECRequests().then((response) => {
          if (response?.status) {
            console.log("data  ::::: ", response?.data);
            setECRequestedList(response?.data);
          } else {
            ShowMessagePopup(
              false,
              response?.message ??
                "Something went wrong, please try again",
              ""
            );
          }
          Loading(false);
        })
        .catch((error) => {
          console.error(error);
          Loading(false);
        });
      }
    }
    else{
      ShowMessagePopup(false, "Invalid Access", "/") 
      //redirectToPage("/EncumbranceSearch");
    }
  }, [ECRequestedList, PaymentRefresh]);

  const verfiyPayment = (ecRequestedData, index) => {   
    let requestno = ecRequestedData.requestno;
    let srCode = ecRequestedData.srcode;
    let paymentData = {srcode : srCode, reqno : requestno};
    Loading(true);
    GetECPaymentStatus(paymentData).then((response) => {
      if (response?.status) {
        let paymentRefr = {...PaymentRefresh};
        setPaymentRefresh({...paymentRefr,
          [ecRequestedData.requestno]: false
        });
        if(response.data!=undefined && response.data.requestno === requestno) {
          let ecRequestedArray = [...ECRequestedList];
          ecRequestedArray[index] = response.data;
          setECRequestedList(ecRequestedArray);
          ShowMessagePopup( true, "Payment data found with success status.","");
        }else {
          ShowMessagePopup( false, "Payment data not found. Please re-intiate the payment again.","");
        }
      } else {
        ShowMessagePopup(
          false,
          response?.message ??
            "Something went wrong, please try again",
          ""
        );
      }
      Loading(false);
    }).catch((error) => {
      console.error(error);
      Loading(false);
    });
    
  }

  const isPaid = (requestno) => {
    console.log("PaymentRefresh 111 ::::: ", PaymentRefresh);
    let flag = PaymentRefresh[requestno];
    if(flag == undefined || flag == null)
      flag = false;
    return flag;
  }

  const doPaymentProcess = (ecRequestedData, index) => {

    let requestno = ecRequestedData.requestno;
    let srCode = ecRequestedData.srcode;
    let paymentData = {srcode : srCode, reqno : requestno};
    Loading(true);
    GetECPaymentStatus(paymentData).then((response) => {
      if (response?.status) {
        if(response.data!=undefined && response.data.requestno === requestno) {
          let ecRequestedArray = [...ECRequestedList];
          ecRequestedArray[index] = response.data;
          setECRequestedList(ecRequestedArray);
          ShowMessagePopup( true, "Payment not required as we found success payment details.","");
        }else {
          let paymentRefr = {...PaymentRefresh};
          //paymentRefr[ecRequestedData.certificateno] = true;
          setPaymentRefresh({...paymentRefr,
            [ecRequestedData.requestno]: true
          });
          let paymentRedirectUrl = process.env.PAYMENT_URL + "/igrsPayment?paymentData=";
          let paymentLink = document.createElement("a");
          let duration = parseInt(ecRequestedData.duration);
          let rfamount = 200;
          if(duration>30)
            rfamount = 500;
          let PaymentJSON = {
              "deptId":ecRequestedData.requestno,
              "source":"EC",
              "type":"orecomf",
              "rmName":ecRequestedData.requestedby,
              "rmId":"", 
              "mobile":loginDetails.loginMobile?loginDetails.loginMobile:"",
              "email":loginDetails.loginEmail?loginDetails.loginEmail:"",
              "rf":rfamount,
              "uc":100,
              "sroNumber":ecRequestedData.srcode
          }
          let encodedData = Buffer.from(JSON.stringify(PaymentJSON), 'utf8').toString('base64')
          paymentLink.href = paymentRedirectUrl + encodedData;
          paymentLink.target = "_blank";
          document.body.appendChild(paymentLink);
          paymentLink.click();
          document.body.removeChild(paymentLink);
        }
      } else {
        ShowMessagePopup(
          false,
          response?.message ??
            "Something went wrong, please try again",
          ""
        );
      }
      Loading(false);
    }).catch((error) => {
      console.error(error);
      Loading(false);
    });
}

const viewRejectComments = (ecRequestedData) => {
  setRejectComments(ecRequestedData.rejectreason);
  handleRejectToggle();
}

const downloadSignedECFile = (ecRequestedData) => {
  Loading(true);
  checkECValidityLinkById(ecRequestedData.esigntransid) .then((response) => {
    if (response?.status) {
      let responseData = response.data;
      if (responseData?.status && responseData.status=="Success") {
        downloadFileFromBase64(responseData.data, ecRequestedData.esigntransid+".pdf", "application/pdf");
        Loading(false);
      } else {
        ShowMessagePopup(false, responseData?.message, "Something went wrong. Please try again later.");
        Loading(false);
      }
    } else {
      ShowMessagePopup(false, "EC is not available to downlaod after 30days from the generation date.", "");
      Loading(false);
    }
   
  })
  .catch((error) => console.error(error));
}

const handleRejectToggle = () => {
  setShowRejectModal(!showRejectModal);
};


  return (
    <div>
      <Head>
        <title>e-Encumbrance Request</title>
        <link rel="icon" href="/PDE/images/aplogo.png" />
      </Head>
      
      <div className="PageSpacing" style={{marginLeft:"1%", marginRight:"1%"}}>
        <div>
          <Container className='ListContainer'>
            <div className={styles.ListviewMain}>
              <Row style={{paddingTop:"1%"}}>
                <Col lg={4} md={6} xs={12}>
                  <div className='ContainerColumn TitleColmn' onClick={() => { redirectToPage("/EDetails") }}>
                      <button className='proceedButton newDoc'><span>New Encumbrance Request</span></button>
                  </div>
                </Col>
                <Col lg={8} md={6} xs={2} className={`${styles.ListviewMain}`}></Col>
              </Row>
              <Row className='ApplicationNum'>
                <Col lg={4} md={6} xs={12}>
                  <div className='ContainerColumn TitleColmn' onClick={() => { redirectToPage("/ServiceLandingPage") }}>
                      <h4 className='TitleText left-title' style={{marginTop:"0"}}>Encumbrance Requested List</h4>
                  </div>
                </Col>
                <Col lg={6} md={6} xs={0}></Col>
              </Row>
              <Row>
                <Col md={12}>
                  <div className='tableFixHeadEC'>
                    <Table striped bordered hover className='TableData ListData table-responsive'>
                      <thead>
                        <tr>
                          <th style={{padding:"0.4% 0%", fontWeight:"600", width:"17%"}}>SRO NAME</th>
                          <th style={{padding:"0.4% 0%", fontWeight:"600", width:"10%"}}>REQUEST NO</th>
                          <th style={{padding:"0.4% 0%", fontWeight:"600", width:"17%"}}>REQUESTED BY</th>
                          <th style={{padding:"0.4% 0%", fontWeight:"600", width:"14%"}}>REQUESTED ON</th>
                          <th style={{padding:"0.4% 0%", fontWeight:"600", width:"17%"}}>STATUS</th>
                          <th style={{padding:"0.4% 0%", fontWeight:"600", width:"17%"}}>VERIFIED BY</th>
                          <th  style={{padding:"0.4% 0%", width:"8%"}}>ACTION</th>
                        </tr>
                      </thead>

                      <tbody>

                        { ECRequestedList?.length > 0 ? (
                          ECRequestedList?.map(
                            (ecRequestedData: any, index: number) => {
                              return (
                                <tr key={index}>
                                  <td style={{width:"17%"}}>{ecRequestedData?.sroname}</td>
                                  <td style={{width:"10%"}}>{ecRequestedData?.requestno}</td>
                                  <td style={{width:"17%"}}>{ecRequestedData?.requestedby ?? "--"}</td>
                                  <td style={{width:"14%"}}>{ecRequestedData?.timestamp ? ecRequestedData?.timestamp?.split('T')[0]:"--"}</td>
                                  <td style={{width:"17%"}}>
                                    {ecRequestedData?.status=='S'?"Payment required" :
                                    (ecRequestedData?.status=='A'?"Request Accepted" :
                                    (ecRequestedData?.status=='P'?"Request Pending" :
                                    (ecRequestedData?.status=='R'?"Request Rejected" : 
                                    (ecRequestedData?.status=='E'?"Request Processed" : "--" ) ) ) ) }
                                  </td>
                                  <td style={{width:"17%"}}>{ecRequestedData?.verifiedby ?? "--"}</td>
                                  <td style={{width:"8%"}}>
                                    { /*
                                      <div className={`${styles.actionTitle} ${styles.actionbtn}`} 
                                        onClick={() => {  setECRequestedData( ecRequestedData ); setViewDetailsToggle(true); }}>
                                          <Image alt="Image" height={20} width={20} src='/PDE/images/eye-icon.svg' className={styles.tableactionImg} data-toggle="tooltip" data-placement="bottom" />
                                          <span className={styles.tooltiptext}>View</span>
                                      </div>
                                    */}
                                    {ecRequestedData?.status=='S' && isPaid(ecRequestedData?.requestno) && 
                                      <div className={`${styles.actionTitle} ${styles.actionbtn}`}
                                        onClick={() => verfiyPayment( ecRequestedData, index )}>
                                        <Image alt="Image" height={20} width={20} src='/PDE/images/verify_payment.svg' className={styles.tableactionImg} data-toggle="tooltip" data-placement="bottom" />
                                        <span className={styles.tooltiptext}>Verify Payment</span>
                                      </div>
                                    }
                                    {ecRequestedData?.status=='S' && !isPaid(ecRequestedData?.requestno) && 
                                      <div className={`${styles.actionTitle} ${styles.actionbtn}`}
                                        onClick={() => doPaymentProcess( ecRequestedData, index )}>
                                        <Image alt="Image" height={20} width={20} src='/PDE/images/payment.svg' className={styles.tableactionImg} data-toggle="tooltip" data-placement="bottom" />
                                        <span className={styles.tooltiptext}>Pay Online</span>
                                      </div>
                                    } 
                                    {ecRequestedData?.status=='R' && 
                                      <div className={`${styles.actionTitle} ${styles.actionbtn}`}
                                        onClick={() => viewRejectComments( ecRequestedData )}>
                                        <Image alt="Image" height={20} width={20} src='/PDE/images/eye-icon.svg' className={styles.tableactionImg} data-toggle="tooltip" data-placement="bottom" />
                                        <span className={styles.tooltiptext}>View Reason</span>
                                      </div>
                                    }
                                    {ecRequestedData?.status=='E' && 
                                      <div className={`${styles.actionTitle} ${styles.actionbtn}`}
                                        onClick={() => downloadSignedECFile( ecRequestedData )}>
                                        <Image alt="Image" height={20} width={18} src='/PDE/images/download-square.png' className={styles.tableactionImg} data-toggle="tooltip" data-placement="bottom" />
                                        <span className={styles.tooltiptext}>Download EC</span>
                                      </div>
                                    }
                                  </td>
                                </tr>
                              );
                            }
                          )
                        ) : (
                          <tr>
                            <td colSpan={13} style={{ textAlign: "center" }}>
                              No records found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col lg={12} md={12} xs={12}>
                  <h5>Important Notes:</h5>
                  <ol>
                    <li>EC is not auto-generated report.</li>
                    <li>Payment should be required after EC request submit and click on Verify Payment after payment completion.</li>
                    <li>EC request will be sent to concerned SubRegistrar after Verify Payment only.</li>
                    <li>Concerned SubRegistrar will accept the request and generate the EC.</li>
                    <li>The EC Report will be displayed in your Dashboard as a PDF file once concerned SRO completed e-sign.</li>
                    <li>Download PDF file to get EC.</li>
                    <li style={{color:"red", fontWeight:"bold"}}>EC requests will not be processed if you are not done the payment on same day.</li>
                  </ol>
                </Col>
              </Row>
            </div>
          </Container>
          <CustomModal
              showModal={showRejectModal}
              handleModal={handleRejectToggle}
              modalTitle="Rejected Reason"
            >
              <Row>
                <Col lg={12} md={12} xs={12} >
                  <textarea className={styles.columnInputBox}
                    style={{ height: '75px', width:"100%"}}
                    value={rejectComments}
                    name='rejectComments'
                    disabled={true}
                    required={false}
                    maxLength={200}
                  />
                </Col>
              </Row>
            </CustomModal>
        </div>
      </div>
    </div>
  );
};

export default EDashboard;

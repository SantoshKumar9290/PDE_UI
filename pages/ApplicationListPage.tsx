import React, { Fragment, useEffect, useLayoutEffect, useState } from 'react'
import { useRouter } from 'next/router';
import { useAppSelector, useAppDispatch } from '../src/redux/hooks';
import styles from '../styles/pages/Mixins.module.scss';
import { Container, Row, Col } from 'react-bootstrap';
import Image from 'next/image';
import { get } from 'lodash';
import Table from 'react-bootstrap/Table';
import { getApplicationDetails, useDeleteParty, UseDeleteApplication,syncservice, UseStatusHistoryUpdate } from '../src/axios';
import { SaveGetstartedDetails } from '../src/redux/formSlice';
import { TiDocumentAdd } from 'react-icons/ti';
import { DeletePopupAction, PopupAction } from '../src/redux/commonSlice';
import Head from 'next/head';
import { CallingAxios, KeepLoggedIn, ShowMessagePopup, ShowPreviewPopup } from '../src/GenericFunctions';
import PartiesDetailsPage from './PartiesDetailsPage';

const ApplicationList = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    let LoginDetails = useAppSelector((state) => state.login.loginDetails);
    let Loader = useAppSelector((state) => state.common.Loading);
    let [ApplicationList, setApplicationList] = useState<any>([]);
    let DeleteOption = useAppSelector(state => state.common.DeletePopupMemory);
    const [GetstartedDetails, setGetstartedDetails] = useState({ applicationId: "", registrationType: null, documentNature: null, district: "", distCode: "", mandal: "", mandalCode: "", village: "", villageCode: "", sroOffice: "", sroCode: "", amount: "" });
    const [ApplicationDetails, setApplicationDetails] = useState<any>({ applicationId: GetstartedDetails.applicationId, registrationType: { TRAN_MAJ_CODE: "", TRAN_MIN_CODE: "", TRAN_DESC: "", PARTY1: "", PARTY1_CODE: "", PARTY2: "", PARTY2_CODE: "" }, documentNature: { TRAN_MIN_CODE: "" }, status: "ACTIVE", sroDetails: null, executent: [], claimant: [], property: [], payment: [], MortagageDetails: [], giftRelation: [], presenter: [], covanants: {}, sroCode: "", amount: "" });
    let CommonData = useAppSelector(state => state.common.Loading);

    useEffect(() => { if (KeepLoggedIn()) { GetApplicationDetails(); localStorage.setItem("GetApplicationDetails", ""); } else { ShowMessagePopup(false, "Invalid Access", "/") } }, []);

    useEffect(() => {
        if (DeleteOption.response) {
            CallDeleteAction(DeleteOption.deleteId);
            dispatch(DeletePopupAction(
                {
                    enable: false,
                    response: false,
                    message: "",
                    redirectOnSuccess: "",
                    deleteId: "",
                    applicationId: ""
                }))
        }
    }, [DeleteOption]);

    const CallDeleteAction = async (applicationId: string) => {
        let result = await CallingAxios(UseDeleteApplication(applicationId, LoginDetails.token));
        if (result.status) {

            GetApplicationDetails();
            ShowMessagePopup(true, "Application ID: " + applicationId + " has been deleted successfully", "");
        }
        else {
            ShowMessagePopup(false, result.message.message, "");
        }
    }


    const GetApplicationDetails = async () => {
        let query = { status: ["DRAFT", "SUBMITTED", "SLOT BOOKING","FAILED"] }
        // let query = { status: ["DRAFT", "SUBMITTED", "COMPLETED"] }
        let result = await CallingAxios(getApplicationDetails(query));
        if (result.status) {
            let data = result.data;
            setApplicationList(result.data);
        } else {
            ShowMessagePopup(false, get(result, 'message', 'something went wrong'), '')
        }
    }

    const redirectToPage = (location: string) => {
        router.push({
            pathname: location,
        })
    }


    const OnClickOperation = (action: string, singleData) => {
        localStorage.setItem("GetApplicationDetails", JSON.stringify(singleData));
        dispatch(SaveGetstartedDetails(singleData));
        if (action == "edit") {
            router.push("/PartiesDetailsPage");
        } else if (action == "payment") {
            router.push("/PaymentsPage");

        }
        if (action == "slotbooking") {
            router.push("/SlotBookingViewPage");

        }
    }

    const ShowDeletePopup = (message, redirectOnSuccess, deleteId) => {
        dispatch(DeletePopupAction({ enable: true, inProcess: false, message, redirectOnSuccess, deleteId }));
    }

    const OnReSubmit = (appData:any)=>{CallTransfer(appData.applicationId)}

    const CallTransfer = async (DocNo) => {
        // let result = await CallingAxios(UseTransferdocument(DocNo));
        let result = await CallingAxios(syncservice(DocNo));
        if (result.status) {
            let hstRUpdate:any={applicatIonId:DocNo,sd:"BS"};
            await CallingAxios(UseStatusHistoryUpdate(hstRUpdate));
            ShowMessagePopup(true, "Application Updated successfully", "");            
			if (LoginDetails.loginType == "USER") {
                let getAppData = { applicationId: DocNo, registrationType: { TRAN_MAJ_CODE: "", TRAN_MIN_CODE: "", TRAN_DESC: "", PARTY1: "", PARTY1_CODE: "", PARTY2: "", PARTY2_CODE: "" }, status: "ACTIVE", sroDetails: null, executent: [], claimant: [], property: [], payment: [], documentNature: { TRAN_DESC: "" }, MortagageDetails: [], giftRelation: [], presenter: [] }
                localStorage.setItem("GetApplicationDetails", JSON.stringify(getAppData));
			    router.push("/SubmissionSuccessfulPage")
			}
			else {
				ShowMessagePopup(true, "Application submitted successfully", "/ServicesPage");
			}
            // setTimeout(() => {
            //     LoginDetails.RETURN_PATH ? router.push(process.env.MASTER_LOGIN_URL + LoginDetails.RETURN_PATH) 
            // }, 5000);
        }
        else {
            router.push("/ApplicationListPage")
        }
    }



    return (
        <div className='PageSpacing'>
                <Head>
                    <title>Application List - Public Data Entry</title>
                </Head>
            <Container className='ListContainer'>
                    <Row>

                    <Col lg={4} md={6} xs={12}>
                            <div className='ContainerColumn TitleColmn' onClick={() => { redirectToPage("/Getstartedpage") }}>
                                <button className='proceedButton newDoc'><span>New Document <small>[కొత్త దస్తావేజు]</small></span></button>
                            </div>
                        </Col>

                        <Col lg={8} md={2} xs={2} className={`${styles.ListviewMain} ${styles.HomeIconCon}`}>
                        </Col>
                    </Row>
                </Container>
                <Container className='ListContainer'>
                    <Row>
                        <Col lg={12} md={12} xs={12}>
                            <div className={styles.ListviewMain}>
                                <Row className='ApplicationNum'>
                                    <Col lg={4} md={6} xs={12}>
                                        <div className='ContainerColumn TitleColmn' onClick={() => { redirectToPage("/ServicesPage") }}>
                                            <h4 className='TitleText left-title'>Applications List<span>[అప్లికేషన్ల జాబితా]</span></h4>
                                        </div>
                                    </Col>
                                    <Col lg={6} md={6} xs={0}></Col>
                                </Row>

                                <Row>
                                    <Col lg={12} md={12} xs={12}>
                                        <div className='tableFixHead'>
                                            <Table striped bordered hover className='TableData ListData table-responsive'>
                                                <thead>
                                                    <tr>
                                                        <th className='SCol'>S.No.<span>[క్రమ సంఖ్య]</span></th>
                                                        <th className='AppidColmn'>Application ID<span>[అప్లికేషన్ ID]</span></th>
                                                        <th className='DocColmn'>Document Type<span>[దస్తావేజు రకం]</span></th>
                                                        <th className='sroColmn'>S.R.O<span>[ఎస్.ఆర్.ఓ]</span></th>
                                                        <th className='AppidColmn'>Execution Date<span>[ఎగ్జిక్యూషన్ తేదీ]</span></th>
                                                        <th className='statusCol'>Status<span>[స్థితి]</span></th>
                                                        <th className='SCol'>Action<span>[చర్య]</span></th>
                                                    </tr>
                                                </thead>
                                                {ApplicationList.length ?
                                                    <tbody>
                                                        {
                                                            ApplicationList.map((SingleApplication, index) => {
                                                                return (
                                                                    <tr key={index}>
                                                                        <td>{index + 1}</td>
                                                                        <td>{SingleApplication.applicationId}</td>
                                                                        {/* <td>{SingleApplication.name}</td> */}
                                                                        <td>{SingleApplication.documentNature.TRAN_DESC}</td>
                                                                        <td>{SingleApplication.sroOffice}</td>
                                                                        <td>{SingleApplication.date}</td>
                                                                        <td>{SingleApplication.status}</td>
                                                                        <td className={styles.actionsCol}>
                                                                            {SingleApplication.status != "SUBMITTED" &&
                                                                                <div className={`${styles.actionTitle} ${styles.actionbtn} ${styles.singleEditIcon}`} onClick={() => OnClickOperation("edit", SingleApplication)}>
                                                                                    <Image alt="Image" height={16} width={16} src='/PDE/images/edit-icon.svg' className={styles.tableactionImg} data-toggle="tooltip" data-placement="bottom" />
                                                                                    <span className={styles.tooltiptext}>Edit</span>
                                                                                </div>}
                                                                            {/* {SingleApplication.status == "SUBMITTED" &&
                                                                            <div className={`${styles.actionTitle} ${styles.actionbtn}`}
                                                                                onClick={() => OnClickOperation("payment", SingleApplication)}>
                                                                                <span style={{ cursor: "pointer" }}>
                                                                                    <Image alt="Image" height={20} width={15} src='/PDE/images/paymentlist.svg' className={styles.tableactionImg} />
                                                                                    <span className={`${styles.tooltiptext} ${styles.slotTooltip}`}>Payment</span>
                                                                                </span>
                                                                            </div>} */}
                                                                            {SingleApplication.status == "SUBMITTED" &&
                                                                                        // <button onClick={() => OnReSubmit(SingleApplication)} type='button'>Send to SRO</button>
                                                                                <div className={`${styles.actionTitle} ${styles.actionbtn} ${styles.singleEditIcon}`} onClick={() => OnReSubmit(SingleApplication)}>
                                                                                    <Image alt="Image" height={24} width={24} src='/PDE/images/reSubmit.png' className={styles.tableactionImg} data-toggle="tooltip" data-placement="bottom" />
                                                                                    <span className={styles.tooltiptext}>Send to SRO</span>
                                                                                </div>                                                                            }
                                                                                        {/* <Image alt="Image" height={16} width={16} src='/PDE/images/slot-icon.svg' className={styles.tableactionImg} />
                                                                                        <span className={`${styles.tooltiptext} ${styles.slotTooltip}`}>Re-Submit</span> */}
                                                                            
                                                                            {/* {SingleApplication.status == "SUBMITTED" &&
                                                                                <div className={`${styles.actionTitle} ${styles.actionbtn}`}
                                                                                    onClick={() => OnClickOperation("slotbooking", SingleApplication)}>
                                                                                    <span style={{ cursor: "pointer" }}>
                                                                                        <Image alt="Image" height={16} width={16} src='/PDE/images/slot-icon.svg' className={styles.tableactionImg} />
                                                                                        <span className={`${styles.tooltiptext} ${styles.slotTooltip}`}>Slot Booking</span>
                                                                                    </span>
                                                                                </div>} */}
                                                                            { SingleApplication.status == "DRAFT" && < div className={`${styles.actionTitle} ${styles.actionbtn} ${styles.singleIcon}`} onClick={() => { ShowDeletePopup("Are you sure you want to permanently remove this item?", "", SingleApplication.applicationId) }}>
                                                                                <Image alt="Image" height={18} width={18} src='/PDE/images/delete-icon.svg' className={styles.tableactionImg} />
                                                                                <span className={styles.tooltiptext}>Delete</span>
                                                                            </div >}
                                                                            {/* {(SingleApplication.status != "COMPLETED" && SingleApplication.status != "DRAFT") &&
                                                                        < div className={`${styles.actionTitle} ${styles.actionbtn}`} onClick={() => { OnClickOperation("complete", SingleApplication.applicationId) }}>
                                                                            <Image alt="Image" height={18} width={13} src='/PDE/images/done-icon.svg' className={styles.tableactionImg} />
                                                                            <span className={styles.tooltiptext}>Complete</span>
                                                                        </div >
                                                                    } */}
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            })
                                                        }
                                                        
                                                    </tbody> : null
                                                }
                                            </Table>
                                            {!ApplicationList.length && Loader.enable == false ?
                                                <Table striped bordered hover className='text-center noDataMessage table-responsive'>
                                                    <thead className='noDataMessage'>
                                                        <tr className='table-responsive noDataMessage'>
                                                            <th className='noDataMessage'>No Applications added</th>
                                                        </tr>
                                                    </thead>
                                                </Table> : null
                                            }
                                        </div>

                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                </Container>
                {/* <pre>{JSON.stringify(ApplicationList, null, 2)}</pre> */}
        </div>
    )
}
export default ApplicationList;
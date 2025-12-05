import React, { Fragment, useEffect, useLayoutEffect, useState } from 'react'
import { useRouter } from 'next/router';
import { useAppSelector, useAppDispatch } from '../src/redux/hooks';
import styles from '../styles/pages/Mixins.module.scss';
import { Container, Row, Col } from 'react-bootstrap';
import Image from 'next/image';
import { get } from 'lodash';
import Table from 'react-bootstrap/Table';
import { getApplicationDetails, useDeleteParty, UseDeleteApplication, useGetSroApplicationDetails } from '../src/axios';
import { SaveGetstartedDetails } from '../src/redux/formSlice';
import { TiDocumentAdd } from 'react-icons/ti';
import { DeletePopupAction, PopupAction } from '../src/redux/commonSlice';
import Head from 'next/head';
import { CallingAxios, DateFormator, KeepLoggedIn, ShowMessagePopup } from '../src/GenericFunctions';

const SroReportListPage = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    let LoginDetails = useAppSelector((state) => state.login.loginDetails);
    let [ApplicationList, setApplicationList] = useState<any>([]);
    let DeleteOption = useAppSelector(state => state.common.DeletePopupMemory);
    const [GetstartedDetails, setGetstartedDetails] = useState({ applicationId: "", registrationType: null, documentNature: null, district: "", distCode: "", mandal: "", mandalCode: "", village: "", villageCode: "", sroOffice: "", sroCode: "", amount: "" });
    const [ApplicationDetails, setApplicationDetails] = useState<any>({ applicationId: GetstartedDetails.applicationId, registrationType: { TRAN_MAJ_CODE: "", TRAN_MIN_CODE: "", TRAN_DESC: "", PARTY1: "", PARTY1_CODE: "", PARTY2: "", PARTY2_CODE: "" }, documentNature: { TRAN_MIN_CODE: "" }, status: "ACTIVE", sroDetails: null, executent: [], claimant: [], property: [], payment: [], MortagageDetails: [], giftRelation: [], presenter: [], covanants: {}, sroCode: "", amount: "" });

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
            ShowMessagePopup(false, result.message, "");
        }
    }


    const GetApplicationDetails = async () => {
        let query = { status: ["DRAFT", "SUBMITTED", "SLOT BOOKING"] }
        // let query = { status: ["DRAFT", "SUBMITTED", "COMPLETED"] }
        let result = await CallingAxios(useGetSroApplicationDetails(query));
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


    const OnClickOperation = (action: string, applicationId: string) => {
        let data = { ...GetApplicationDetails, applicationId }
        localStorage.setItem("GetApplicationDetails", JSON.stringify(data));
        dispatch(SaveGetstartedDetails(data));
        if (action == "edit") {
            router.push("/PartiesDetailsPage");
        } else if (action == "complete") {
            router.push("/SubmissionSuccessfulPage");
            // router.push("/FinishDocumentViewPage");
        }else if (action == "report") {
            let data = { ...GetApplicationDetails, applicationId }
            localStorage.setItem("GetApplicationDetails", JSON.stringify(data));
            dispatch(SaveGetstartedDetails(data));
            router.push("/ReportsViewPage");
        }
    }

    const ShowDeletePopup = (message, redirectOnSuccess, deleteId) => {
        dispatch(DeletePopupAction({ enable: true, inProcess: false, message, redirectOnSuccess, deleteId }));
    }



    return (
        <div className='PageSpacing'>
            <Head>
                <title>Application List - Public Data Entry</title>
            </Head>
            <Container>
                <Row>
                    <Col lg={12} md={12} xs={12}>
                        <div className={styles.ListviewMain}>
                            <Row className='ApplicationNum'>
                                <Col lg={5} md={6} xs={6}>
                                    <div className='ContainerColumn' onClick={() => { redirectToPage("/ServicesPage") }}>
                                        <h4 className='TitleText left-title'>{LoginDetails.sroOffice} Reports <span>[నివేదికలు]</span></h4>
                                    </div>
                                    {/* <h4 className='TitleText left-title'> {LoginDetails.sroOffice} Reports List<span>[అప్లికేషన్ల జాబితా]</span></h4> */}
                                </Col>
                                <Col lg={6} md={6} xs={6}>

                                </Col>
                            </Row>

                            <Row>
                                <Col lg={12} md={12} xs={12}>
                                    <div className='tableFixHead'>
                                        <Table striped bordered hover className='TableData ListData'>
                                            <thead>
                                                <tr>
                                                    <th>S.No.<span>[క్రమ సంఖ్య]</span></th>
                                                    <th>Application ID<span>[అప్లికేషన్ ID]</span></th>
                                                    <th>Document Type<span>[దస్తావేజు రకం]</span></th>
                                                    <th>S.R.O<span>[ఎస్.ఆర్.ఓ]</span></th>
                                                    <th>Execution Date<span>[ఎగ్జిక్యూషన్ తేదీ]</span></th>
                                                    <th>Status<span>[స్థితి]</span></th>
                                                    {/* <th>Paymemt Status</th>
                                                    <th>Slot Booking Status</th> */}
                                                    <th>Action<span>[చర్య]</span></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {/* {
                                                    ApplicationList.length == 0 &&
                                                    <tr><td colSpan={7} style={{ textAlign: 'center' }}>Data not found.</td></tr>
                                                } */}
                                                {
                                                    ApplicationList.map((SingleApplication, index) => {
                                                        return (
                                                            <tr key={index}>
                                                                <td>{index + 1}</td>
                                                                <td>{SingleApplication.documentId}</td>
                                                                <td>{SingleApplication.documentType.TRAN_DESC}</td>
                                                                <td>{SingleApplication.sroOffice}</td>
                                                                <td>{DateFormator(SingleApplication.executionDate,"dd-mm-yyyy")}</td>
                                                                <td>
                                                                    {SingleApplication.status}
                                                                    </td>
                                                                <td>
                                                                    {/* <div className={`${styles.actionTitle} ${styles.actionbtn}`} onClick={() => OnClickOperation("edit", SingleApplication.documentId)}>
                                                                        <Image alt="Image" height={16} width={16} src='/PDE/images/edit-icon.svg' className={styles.tableactionImg} data-toggle="tooltip" data-placement="bottom" />
                                                                        <span className={styles.tooltiptext}>Edit</span>
                                                                    </div> */}

                                                                    <div className={`${styles.actionTitle} ${styles.actionbtn}`} onClick={() => OnClickOperation("report", SingleApplication.documentId)}>
                                                                        <Image alt="Image" height={20} width={20} src='/PDE/images/report-icon.svg' className={` ${styles.tableactionImg} ${styles.reportIcon}`} />
                                                                        <span className={styles.tooltiptext}>Report</span>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                            </tbody>
                                        </Table>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
            </Container>
            {/* <pre>{JSON.stringify(ApplicationList,null,2)}</pre> */}
        </div>
    )
}
export default SroReportListPage;
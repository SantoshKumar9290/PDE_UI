import React, { useState, useEffect } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import styles from '../styles/pages/Mixins.module.scss';
import { useRouter } from 'next/router';
import { useAppSelector, useAppDispatch } from '../src/redux/hooks';
import TableText from '../src/components/TableText';
import TableInputText from '../src/components/TableInputText';
import UploadContainer from '../src/components/UploadContainer';
import Image from 'next/image';
import Table from 'react-bootstrap/Table';
import { getApplicationDetails, useDeleteParty, useDeleterepresentative, useDeleteProperty, UseChangeStatus, UseDeletePaymentDetails, UseDutyCalculator, UseUploadDoc, UseGetUploadDoc, UseDeleteUploadDoc } from '../src/axios';
import { CallingAxios, KeepLoggedIn, ShowMessagePopup, ShowPreviewPopup } from '../src/GenericFunctions';

import Head from 'next/head';
import { DeletePopupAction } from '../src/redux/commonSlice';


const FileuploadPage = () => {

    const router = useRouter();
    const dispatch = useAppDispatch();
    let GetstartedDetails = useAppSelector(state => state.form.GetstartedDetails);
    let DeleteOption = useAppSelector(state => state.common.DeletePopupMemory);
    const [ApplicationDetails, setApplicationDetails] = useState<any>({ applicationId: GetstartedDetails.applicationId, registrationType: { TRAN_MAJ_CODE: "", TRAN_MIN_CODE: "", TRAN_DESC: "", PARTY1: "", PARTY1_CODE: "", PARTY2: "", PARTY2_CODE: "" }, status: "ACTIVE", sroDetails: null, executent: [], claimant: [], property: [], payment: [], documentNature: { TRAN_DESC: "" }, MortagageDetails: [], giftRelation: [], presenter: [], amount: "", executionDate: "", stampPaperValue: "", stampPurchaseDate: "" });
    const [UploadDocument, setUploadDocument] = useState({ docName: "", status: "" });

    const redirectToPage = (location: string) => {
        router.push({
            pathname: location,
            // query: query,
        })
    }

    useEffect(() => {
        if (KeepLoggedIn()) {
            GetApplicationDetails();
        } else ShowMessagePopup(false, "Invalid Access", "/")
    }, []);

    useEffect(() => {
        if (DeleteOption?.response) {
            CallDeleteAction(DeleteOption?.deleteId, DeleteOption?.applicationId, DeleteOption?.type);
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

    const CallDeleteAction = async (DeleteId, applicationId, type) => {
        let Data = {}
        let result: any;
        if (type == "Uploads") {
            await CallDeleteUploads(DeleteId);
        }
    }
    const CallDeleteUploads = async (id: any) => {
        let result = await CallingAxios(UseDeleteUploadDoc(id, ApplicationDetails?.applicationId));
        if (result?.status) {
            ShowMessagePopup(true, "File deleted successfully", "");
            GetApplicationDetails();
        }
        else {
            ShowMessagePopup(false, "Delete action failed", "");
        }
    }

    const onSubmit = () => {

    }

    const onCancelUpload = (uploadKey) => {
        // setUserDetails({ ...UserDetails, [uploadKey]: "" });
    }

    const OnFileSelect = async (event: any) => {
        if (ApplicationDetails?.Uploads?.documents?.find(x => x.fileName == UploadDocument?.docName)) {
            ShowMessagePopup(false, "File name should be unique", "");
            event.target.value = "";
            setUploadDocument({ ...UploadDocument, status: "", docName: "" });
            return;
        }
        if (event?.target?.files?.length) {
            if (event.target.files[0].size > 1024000) {
                ShowMessagePopup(false, "File size 1MB size. Please upload small size file", "");
                event.target.value = "";
            }
            else {
                const file = event?.target?.files[0];
                // var pattern = /image-*/;

                // if (!file.type.match(pattern)) {
                //     ShowMessagePopup(false, "Irrelevant file type. Only image can be uploaded.", "");
                //     event.target.value = "";
                // }
                // else {
                    const formData = new FormData();
                    formData.append('image', event?.target?.files[0]);
                    await ForUploadDoc(formData, UploadDocument?.docName);
                    setUploadDocument({ ...UploadDocument, status: "", docName: "" });
                    event.target.value = "";
                // }
            }
        }
    }
    const ShowDeletePopup = (message, redirectOnSuccess, deleteId, applicationId, type) => {
        dispatch(DeletePopupAction({ enable: true, inProcess: false, message, redirectOnSuccess, deleteId, applicationId, type }));
    }

    const GetApplicationDetails = async () => {
        let data: any = localStorage.getItem("GetApplicationDetails");
        if (data == "" || data == undefined) {
            return ShowMessagePopup(false, "Invalid Access", "/");
        }
        else {
            await CallGetApp(data);
        }
    }

    const CallGetApp = async (myData) => {
        let data = JSON.parse(myData);
        let result = await CallingAxios(getApplicationDetails(data?.applicationId));
        if (result?.status) {
            let receivedData = result?.data

            localStorage.setItem("GetApplicationDetails", JSON.stringify(result.data));
            let covenantList = "";
            if (result?.data?.covanants && result?.data?.covanants?.covanants?.length) {
                result?.data?.covanants?.covanants?.map((data, index) => {
                    covenantList = covenantList + (index + 1) + ". " + data.value + "\n \n";
                })
            }
            let Uploads = await UseGetUploadDoc(receivedData.applicationId);
            if (Uploads.status) {
                receivedData = { ...receivedData, Uploads: Uploads.data }
            }
            else {
                receivedData = { ...receivedData, Uploads: { documents: [] } }
            }
            setApplicationDetails(receivedData);
        } else {
            ShowMessagePopup(false,"Get Application Details Failed","");
        }
    }

    const ForUploadDoc = async (formData: any, docName: string) => {
        let result = await CallingAxios(UseUploadDoc(formData, { docName, applicationId: ApplicationDetails.applicationId }));
        if (result?.status) {
            ShowMessagePopup(true, "File Uploaded Successfully", "");
            setUploadDocument({ ...UploadDocument, status: "", docName: "" });
            GetApplicationDetails();
        }
        else {
            setUploadDocument({ ...UploadDocument, status: "false" });
            ShowMessagePopup(false, "File Upload Failed", "");
        }
    }

    return (
        <div className='PageSpacing'>
            <Head>
                <title>File Upload - Public Data Entry</title>
            </Head>
            <Container>
                <div className='tabContainerInfo'>
                    <Container>
                        <Row>
                            <Col lg={10} md={12} xs={12}>
                                <div className='tabContainer'>
                                    <div className='activeTabButton'>Get Started<div></div></div>
                                    <div className='activeTabButton'>Parties Details<div></div></div>
                                    <div className='inactiveTabButton'>Property Details<div></div></div>
                                    <div className='inactiveTabButton slotButton' >Slot Booking<div></div></div>
                                </div>
                            </Col>
                            <Col lg={2} md={12} xs={12}>
                               <div className='text-end previewCon'><button className='PreBtn proceedButton' onClick={() => ShowPreviewPopup()} >Preview Document</button></div>
                            </Col>
                        </Row>
                    </Container>
                </div>
                <div className={`mt-4 ${styles.PropertyDetailsmain}`}>
                    <Row className='ApplicationNum'>
                        <Col lg={6} md={6} xs={12}>
                            <div className='ContainerColumn TitleColmn' onClick={() => { redirectToPage("/PartiesDetailsPage") }}>
                                <h4 className='TitleText left-title'>{ApplicationDetails.documentNature ? ApplicationDetails.registrationType.TRAN_DESC : null}</h4>
                            </div>
                        </Col>
                        <Col lg={6} md={6} xs={12} className='text-end'>
                            <div className='ContainerColumn TitleColmn'>
                                <h4 className='TitleText' style={{ textAlign: 'right' }}>Application ID: {ApplicationDetails.applicationId}</h4>
                            </div>
                        </Col>
                    </Row>
                </div>
                <Row>
                    <Col lg={12} md={12} xs={12}>
                        <div className={styles.ExecutantDetailsInfo}>
                            <div className={styles.DetailsHeaderContainer}>
                                <Row>
                                    <Col lg={6} md={6} xs={12}>
                                        <div className={styles.ContainerColumn}>
                                            <p className={styles.HeaderText}>File Upload Details</p>
                                        </div>
                                    </Col>
                                    <Col lg={6} md={6} xs={12}>
                                    </Col>
                                </Row>
                            </div>
                            <form onSubmit={onSubmit}>
                                <div className={`${styles.AddExecutantInfo} ${styles.RelationInfo} ${styles.fileContainer}`}>
                                    <Row>
                                        <Col>
                                            <UploadContainer onCancelUpload={onCancelUpload} isUploadDone={UploadDocument.status} textName="docName" textValue={UploadDocument.docName} required={false} uploadKey={''} onChangeText={(e) => { setUploadDocument({ ...UploadDocument, [e.target.name]: e.target.value }) }} onChangeFile={(e: any) => { OnFileSelect(e) }} showOnlyImage={false} />
                                        </Col>
                                    </Row>
                                    <div className={`${styles.mainContainer} ${styles.ListviewMain}`}>
                                        <div className={styles.InnertabHeadContainer}>
                                            <div className={`${styles.innerTabContainer}`}>
                                                <div className='table-responsive'>
                                                    <Table striped bordered hover className='TableData'>
                                                        <thead>
                                                            <tr>
                                                                <th className='principalamount'>S.No.<span>[క్రమ సంఖ్య]</span></th>
                                                                <th>File Name<span>[ఫైల్ పేరు]</span></th>
                                                                <th>Action<span>[చర్య]</span></th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {ApplicationDetails?.Uploads?.documents?.map((singleFile, index) => {
                                                                return (
                                                                    <tr key={index}>
                                                                        <td>{index + 1}</td>
                                                                        <td>{singleFile.fileName}</td>
                                                                        <td>
                                                                            <div id="text" className={`${styles.actionTitle} ${styles.actionbtn}`} style={{ cursor: 'pointer' }} onClick={() => { window.open(process.env.BACKEND_URL+"/pdeapi/files/" + singleFile.downloadLink) }}>
                                                                                <Image alt="Image" height={18} width={14} src='/PDE/images/view-icon.svg' className={styles.tableactionImg} />
                                                                                <span className={styles.tooltiptext}>View</span>
                                                                            </div>
                                                                            <div className={`${styles.actionTitle} ${styles.actionbtn}`} style={{ cursor: 'pointer' }} onClick={() => { ShowDeletePopup("Are you sure you want to permanently remove this  File?", "", singleFile.fileName, ApplicationDetails.applicationId, "Uploads") }}>
                                                                                <Image alt="Image" height={18} width={17} src='/PDE/images/delete-icon.svg' className={styles.tableactionImg} />
                                                                                <span className={styles.tooltiptext}>Delete</span>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            })}
                                                        </tbody>
                                                    </Table>
                                                    <div className='text-center'>
                                                        <div onClick={() => router.push("/PartiesDetailsPage")} style={{ cursor: "pointer" }} className='proceedButton'>Back</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default FileuploadPage;



function CallDeleteAction(deleteId: any, applicationId: any, type: any) {
    throw new Error('Function not implemented.');
}

function CallDeleteUploads(DeleteId: any) {
    throw new Error('Function not implemented.');
}
// function CallDeleteAction(deleteId: any, applicationId: any, type: any) {
//     throw new Error('Function not implemented.');
// }
// function CallDeleteAction(deleteId: any, applicationId: any, type: any) {
//     throw new Error('Function not implemented.');
// }

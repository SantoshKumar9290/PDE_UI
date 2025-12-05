import React, { useState, useEffect } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import styles from '../styles/pages/Mixins.module.scss';
import TableText from '../src/components/TableText';
import TableDropdown from '../src/components/TableDropdown';
import { SaveAddRelationDetails } from '../src/redux/formSlice';
import { useRouter } from 'next/router';
import { useAppSelector, useAppDispatch } from '../src/redux/hooks';
import Table from 'react-bootstrap/Table';
import Image from 'next/image';
import TableDropdownSRO from '../src/components/TableDropdownSRO';
import { UseSaveRelationDetails, UseUpdatePaymentDetails } from '../src/axios';
import { CallingAxios, ShowMessagePopup } from '../src/GenericFunctions';
import Head from 'next/head';

const DonorDetails = {
    DonorList: ["A", "B"]
}

const AddRelationDetailsPage = () => {
    const router = useRouter();
    const dispatch = useAppDispatch()
    const [RelationDetails, setRelationDetails] = useState({ donarName: "", relationType: "", doneeName: "", operation: "", id: "" })
    let GetstartedDetails = useAppSelector(state => state.form.GetstartedDetails);
    const [ApplicationDetails, setApplicationDetails] = useState({ applicationId: GetstartedDetails.applicationId, registrationType: { TRAN_MAJ_CODE: "", TRAN_MIN_CODE: "", TRAN_DESC: "", PARTY1: "", PARTY1_CODE: "", PARTY2: "", PARTY2_CODE: "" }, status: "ACTIVE", sroDetails: null, executent: [], claimant: [], property: [], payment: [], documentNature: { TRAN_DESC: "" }, MortagageDetails: [], giftRelation: [], presenter: [], amount: "", executionDate: "", stampPaperValue: "", stampPurchaseDate: "" });
    //const [ApplicationDetails, setApplicationDetails] = useState({ applicationId: "", executent: [], claimant: [] });


    useEffect(() => {
        let data: any = localStorage.getItem("GetApplicationDetails");
        if (data == "" || data == undefined) {
            ShowMessagePopup(false, "Invalid Access", "/");
        }
        else {
            data = JSON.parse(data);
            setApplicationDetails(data);
            let data2 = JSON.parse(localStorage.getItem("PaymentDetails"));
            if (data2) {
                setRelationDetails({ ...RelationDetails, donarName: data2.donarName, relationType: data2.relationType, doneeName: data2.doneeName, operation: data2.operation, id: data2._id })
            }
        }
    }, [])

    const redirectToPage = (location: string) => {
        router.push({
            pathname: location,
            // query: query,
        })
    }

    const onChangeRelationData = (e: any, find: any) => {
        let addName = e.target.name;
        let addValue = e.target.value;

      
        setRelationDetails({ ...RelationDetails, [addName]: addValue });
    }

    const onSubmit = async (e: any) => {
        e.preventDefault();
        let searchResult = ApplicationDetails?.payment?.find(x => x.donarName == RelationDetails.donarName && x.relationType == RelationDetails.relationType && x.doneeName == RelationDetails.doneeName)             
        if(searchResult){
         return ShowMessagePopup(false, "Duplicate Relation entry", "");
        }
        if (RelationDetails.operation == "edit") {
            UpdateRelationDetails();
        } else if (RelationDetails.operation == "add") {
            SaveRelationDetails()
        }

    }

    const SaveRelationDetails = async () => {
        let data: any = { ...RelationDetails, documentId: ApplicationDetails.applicationId }
        let result: any = await CallingAxios(UseSaveRelationDetails(data));
        // console.log("R=>" + result);
        if (result.status) {
            ShowMessagePopup(true, "Relation Details Added Successfully", "/PartiesDetailsPage");
        }
        else {
            ShowMessagePopup(true, "Relation Details Save Failed", "");
        }
    }
    const UpdateRelationDetails = async () => {
        let data: any = { ...RelationDetails, documentId: ApplicationDetails.applicationId }
        let result: any = await CallingAxios(UseUpdatePaymentDetails(data));
        if (result.status) {
            ShowMessagePopup(true, "Relation Details Edited Successfully", "/PartiesDetailsPage");
        }
        else {
            ShowMessagePopup(false, "Relation Details Edit Failed", "");
        }
    }

    return (
        <div className='PageSpacing'>
            <Head>
        <title>Add Relation Details - Public Data Entry</title>
      </Head>
            <Container>
                <div className='tabContainerInfo'>
                    <Container>
                        <Row>
                            <Col lg={12} md={12} xs={12}>
                                <div className='tabContainer'>
                                    <div className='activeTabButton'>Get Started<div></div></div>
                                    <div className='activeTabButton'>Parties Details<div></div></div>
                                    <div className='inactiveTabButton'>Property Details<div></div></div>
                                    <div className='inactiveTabButton slotButton' >Slot Booking<div></div></div>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>
                <Row className='ApplicationNum mt-3'>
                    <Col lg={6} md={6} xs={12}>
                        <div className='ContainerColumn' onClick={() => { redirectToPage("/PartiesDetailsPage") }}>
                            <h4 className='TitleText left-title'>{ApplicationDetails.documentNature ? ApplicationDetails.registrationType.TRAN_DESC : null}</h4>
                        </div>
                    </Col>
                    <Col lg={6} md={6} xs={12}>
                        <div className='ContainerColumn'>
                            <h4 className='TitleText' style={{ textAlign: 'right' }}>Application ID: {ApplicationDetails.applicationId}</h4>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col lg={12} md={12} xs={12}>
                        <form onSubmit={onSubmit}>
                            <div className={styles.ExecutantDetailsInfo}>
                                <div className={styles.DetailsHeaderContainer}>
                                    <Row>
                                        <Col lg={6} md={6} xs={12}>
                                            <div className={styles.ContainerColumn}>
                                                <p className={styles.HeaderText}>{RelationDetails.operation != "" && RelationDetails.operation[0].toUpperCase() + RelationDetails.operation.substring(1)} Relation Details [సంబంధ వివరాలను జోడించండి]</p>
                                            </div>
                                        </Col>
                                        <Col lg={6} md={6} xs={12}>
                                        </Col>
                                    </Row>
                                </div>
                                <div className={`${styles.AddExecutantInfo}, ${styles.RelationInfo}`}>
                                    <Row>
                                        <Col lg={3} md={6} xs={12}>
                                            <TableText label={"Donor Name [డోనార్ పేరు]"} required={true} LeftSpace={false} />
                                            <TableDropdownSRO required={true} options={ApplicationDetails.executent} name={"donarName"} value={RelationDetails.donarName} onChange={onChangeRelationData} />
                                        </Col>
                                        <Col lg={3} md={6} xs={12}>
                                            <TableText label={"Relation Type [సంబంధం రకం]"} required={true} LeftSpace={false} />
                                            <TableDropdown required={true} options={["S/O", "D/O", "W/O","C/O"]} name={"relationType"} value={RelationDetails.relationType} onChange={onChangeRelationData} />
                                        </Col>
                                        <Col lg={3} md={6} xs={12}>
                                            <TableText label={"Donee Name [డోనీ పేరు]"} required={true} LeftSpace={false} />
                                            <TableDropdownSRO required={true} options={ApplicationDetails.claimant} name={"doneeName"} value={RelationDetails.doneeName} onChange={onChangeRelationData} />
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                            <div className='mt-2'>                               
                                <Row>
                                    <Col lg={12} md={12} xs={12}>
                                        <div className='d-flex justify-content-end'>
                                            <div className={styles.ProceedContainer}>
                                                <button className='proceedButton'>Proceed</button>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </form>
                    </Col>
                </Row>
            </Container>
            {/* <pre>{JSON.stringify(RelationDetails, null, 2)}</pre> */}
            {/* <pre>{JSON.stringify(ApplicationDetails, null, 2)}</pre> */}
        </div>
    )
}

export default AddRelationDetailsPage
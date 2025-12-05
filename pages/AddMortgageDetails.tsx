import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import styles from '../styles/pages/Mixins.module.scss';
import Image from 'next/image';
import { useAppSelector, useAppDispatch } from '../src/redux/hooks';
import { useRouter } from 'next/router';
import TableInputText from '../src/components/TableInputText';
import TableText from '../src/components/TableText';
import TableInputLongText from '../src/components/TableInputLongText';
import { CallingAxios, ShowMessagePopup } from '../src/GenericFunctions';
import { UseSaveMortagageDetails, UseUpdatePaymentDetails } from '../src/axios';
import Head from 'next/head';
import axios from 'axios';

const AddMortgageDetails = () => {
    const router = useRouter();
    const dispatch = useAppDispatch()
    let GetstartedDetails = useAppSelector(state => state.form.GetstartedDetails);
    let Loader = useAppSelector((state) => state.common.Loading);
    const [MortgageDetails, setMortgageDetails] = useState<any>({ payAmount: null, rateOfInterest: null, duration: null, interestOfPenalty: null, operation: "", id: "" });
    const [ApplicationDetails, setApplicationDetails] = useState({ applicationId: GetstartedDetails.applicationId, registrationType: { TRAN_MAJ_CODE: "", TRAN_MIN_CODE: "", TRAN_DESC: "", PARTY1: "", PARTY1_CODE: "", PARTY2: "", PARTY2_CODE: "" }, status: "ACTIVE", sroDetails: null, executent: [], claimant: [], property: [], payment: [], documentNature: { TRAN_DESC: "" }, MortagageDetails: [], giftRelation: [], presenter: [], amount: "", executionDate: "", stampPaperValue: "", stampPurchaseDate: "" });

    const onChange = (e: any) => {
        let TempDetails = MortgageDetails;
        let addName = e.target.name;
        let addValue = e.target.value;
        if (addName == 'duration') { 
            addValue = addValue.replace(/[^\w\s]/gi, "");
        }
        if (addName == "payAmount" || addName == "rateOfInterest" || addName == "duration" || addName == "interestOfPenalty") {
            let errorLabel = ""
            if (addValue.length < 20) {
                errorLabel = "Enter 20 Digit Valid Number";
            }
            if (addValue.length > 20) {
                addValue = addValue.substring(0, 20);
            }
        }
        setMortgageDetails({ ...TempDetails, [addName]: addValue });
    }
    const redirectToPage = (location: string) => {
        router.push({
            pathname: location,
        })
    }

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
                setMortgageDetails({ ...MortgageDetails, payAmount: data2.payAmount, rateOfInterest: data2.rateOfInterest, duration: data2.duration, interestOfPenalty: data2.interestOfPenalty, operation: data2.operation, id: data2._id })
            }
        }
    }, [])

    const onSubmit = (e) => {
        e.preventDefault();
        if (MortgageDetails.payAmount == "0" || MortgageDetails.rateOfInterest == "0" || MortgageDetails.duration == "0" || MortgageDetails.interestOfPenalty == "0") {
            return ShowMessagePopup(false, "Any Value Can Not be Zero", "");
        }
        if (MortgageDetails.operation == "edit") {
            UpdateMortagageDetails();
        } else if (MortgageDetails.operation == "add") {
            SaveMortagageDetails()
        }
        // if (MortgageDetails.find(x => x.payAmount == MortgageDetails.payAmount && x.rateOfInterest == MortgageDetails.rateOfInterest && x.duration == MortgageDetails.duration && x.interestOfPenalty == MortgageDetails.interestOfPenalty).length) {
        //     ShowMessagePopup(false, "Mortgage details already added", "");
        // }

    }

    const SaveMortagageDetails = async () => {
        let data: any = { ...MortgageDetails, documentId: ApplicationDetails.applicationId }
        let result: any = await CallingAxios(UseSaveMortagageDetails(data));
        // console.log("R=>" + result);
        if (result.status) {
            ShowMessagePopup(true, "Mortgage Payment Details Added Successfully", "/PartiesDetailsPage");
        }
        else {
            ShowMessagePopup(true, "Mortgage Details Save Failed", "");
        }
    }
    const UpdateMortagageDetails = async () => {
        let data: any = { ...MortgageDetails, documentId: ApplicationDetails.applicationId, _id: MortgageDetails.id };
        let result: any = await CallingAxios(UseUpdatePaymentDetails(data));
        if (result.status) {
            ShowMessagePopup(true, "Mortgage Details Edited Successfully", "/PartiesDetailsPage");
        }
        else {
            ShowMessagePopup(false, "Mortgage Edited Save Failed", "");
        }
    }
    return (
        <div className='PageSpacing'>
            <Head>
                <title>Add Mortgage Details - Public Data Entry</title>
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
                                    <div className='inactiveTabButton slotButton'>Slot Booking<div></div></div>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>

                <Row className='ApplicationNum mt-4'>
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
                                                <p className={styles.HeaderText}>{MortgageDetails.operation != "" && MortgageDetails.operation[0].toUpperCase() + MortgageDetails.operation.substring(1)} Mortgage Details [తనఖా వివరాలను జోడించండి]</p>
                                            </div>
                                        </Col>
                                        <Col lg={6} md={6} xs={12}>
                                            {/* <div className='d-flex justify-content-end' onClick={() => { router.push("/PropertyDetailsPage") }}>
                                                <Image alt="Image" height={25} width={25} src='/PDE/images/add-cust-icon.svg' style={{ cursor: 'pointer' }} className={styles.addCusContainerImage} />
                                                <div className={styles.tabText} style={{ textAlign: "right" }}>Add Mortgage</div>
                                            </div> */}
                                        </Col>
                                    </Row>
                                </div>
                              
                                <div className='p-3'>
                                    <Row>
                                        <Col lg={4} md={6} xs={12} className='mb-2'>
                                            <TableText label={"Principal Amount(₹) [అసలు మెుత్తం(రూ)]"} required={false} LeftSpace={false} />
                                            <TableInputText disabled={MortgageDetails.operation == "View" ? true : false} type='number' placeholder='Enter Principal Amount' required={true} name={'payAmount'} value={MortgageDetails.payAmount} onChange={onChange} />
                                        </Col>
                                        <Col lg={4} md={6} xs={12}>
                                            <TableText label={"Interest Rate(%) [వడ్డీ రేటు(శాతం)]"} required={false} LeftSpace={false} />
                                            <TableInputText disabled={MortgageDetails.operation == "View" ? true : false} type='text' placeholder='Interest Rate' splChar={false} required={true} name={'rateOfInterest'} value={MortgageDetails.rateOfInterest} onChange={onChange} />
                                        </Col>
                                        <Col lg={4} md={6} xs={12}>
                                            <TableText label={"Duration(In Months) [వ్యవధి(నెలల్లో)]"} required={false} LeftSpace={false} />
                                            <TableInputText disabled={MortgageDetails.operation == "View" ? true : false} type='number' maxLength={3} placeholder='Duration' required={true} name={'duration'} value={MortgageDetails.duration} onChange={onChange} />
                                        </Col>
                                        <Col lg={4} md={6} xs={12}>
                                            <TableText label={"Interest on Penalty(%) [జరిమానాపై వడ్డీ(శాతం)]"} required={false} LeftSpace={false} />
                                            <TableInputText disabled={MortgageDetails.operation == "View" ? true : false} type='text' placeholder='Interest on Penalty' splChar={false} required={true} name={'interestOfPenalty'} value={MortgageDetails.interestOfPenalty} onChange={onChange} />
                                        </Col>
                                    </Row>
                                    
                                    <div className='mt-2'>
                                        <Row>
                                            <Col lg={12} md={12} xs={12}>
                                                <div className='d-flex justify-content-center'>
                                                    <div className={styles.ProceedContainer}>
                                                    <div onClick={() => router.push("/PartiesDetailsPage")} style={{ cursor: "pointer" }} className='proceedButton mx-2'>Back</div>
                                                        <button className='proceedButton'>Proceed</button>
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                            </div>
                        </form>                     
                    </Col>
                </Row>
            </Container>
            {/* <pre>{JSON.stringify(MortgageDetails, null, 2)}</pre> */}
        </div>
    )
}

export default AddMortgageDetails
import React, { useState, useEffect } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import styles from '../styles/pages/Mixins.module.scss';
import TableText from '../src/components/TableText';
import TableDropdown from '../src/components/TableDropdown';
import TableInputText from '../src/components/TableInputText';
import { useRouter } from 'next/router';
import { useAppSelector, useAppDispatch } from '../src/redux/hooks';
import TableSelectDate from '../src/components/TableSelectDate';
import Table from 'react-bootstrap/Table';
import { CallingAxios, DateFormator, KeepLoggedIn, ShowMessagePopup, ShowPreviewPopup } from '../src/GenericFunctions';
import { UseDeletePaymentDetails, getApplicationDetails, UseSaveSaleDetails, UseUpdatePaymentDetails } from '../src/axios';
import Image from 'next/image';
import { DeletePopupAction } from '../src/redux/commonSlice';
import Head from 'next/head';
import moment from 'moment';

const PaymentDetailsData = {
    PaymentTypes: ["CASH", "UPI", "CHEQUE", "NEFT/RTGS"]
}

const PaymentDetailsPage = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    let GetstartedDetails = useAppSelector(state => state.form.GetstartedDetails);
    const [PaymentDetails, setPaymentDetails] = useState({ paymentMode: "", documentId: "", payAmount: "", dateOfPayment: "", bankName: "", branchName: "", checkNo: "", utrNumber: "", transactionNo: "", operation: "", id: "" });
    const [SelectedFeature, setSelectedFeature] = useState({ dateOfPayment: true, bankName: false, branchName: false, checkNo: false, utrNumber: false, transactionNo: false });
    //const [ApplicationDetails, setApplicationDetails] = useState({ applicationId: "", executent: [], claimant: [], amount: "", payment: [] });
    const [OperationMode, setOperationMode] = useState({ mode: "Add", index: null });
    const [maxDate, setMaxDate] = useState(Date);
    let DeleteOption = useAppSelector(state => state.common.DeletePopupMemory);
    const [ApplicationDetails, setApplicationDetails] = useState({ applicationId: GetstartedDetails.applicationId, registrationType: { TRAN_MAJ_CODE: "", TRAN_MIN_CODE: "", TRAN_DESC: "", PARTY1: "", PARTY1_CODE: "", PARTY2: "", PARTY2_CODE: "" }, status: "ACTIVE", sroDetails: null, executent: [], claimant: [], property: [], payment: [], documentNature: { TRAN_DESC: "" }, MortagageDetails: [], giftRelation: [], presenter: [], amount: "", executionDate: "", stampPaperValue: "", stampPurchaseDate: "" });


    const redirectToPage = (location: string) => {
        router.push({
            pathname: location,
            // query: query,
        })
    }

    useEffect(() => {
        if (KeepLoggedIn()) {
            GetApplicationDetails();
        } else { ShowMessagePopup(false, "Invalid Access", "/") }
    }, []);

    const GetApplicationDetails = async () => {
        let data: any = localStorage.getItem("GetApplicationDetails");
        if (data == "" || data == undefined) {
            ShowMessagePopup(false, "Invalid Access", "/");
        }
        else {
            await CallingAxios(CallGetApp(data));
        }
    }

    const CallGetApp = async (myData) => {
        let data = JSON.parse(myData);
        let result = await CallingAxios(getApplicationDetails(data.applicationId));
        if (result.status) {
            setApplicationDetails(result.data);
            localStorage.setItem("GetApplicationDetails", JSON.stringify(result.data));
        } else {
            ShowMessagePopup(false, result.message, "");
            //window.alert(result.message);
        }
    }

    const onChange = (e) => {
        let TempDetails = { ...PaymentDetails };
        let addName = e.target.name;
        let addValue = e.target.value;
        if (addName == 'bankName' || addName == 'branchName') {
            addValue = addValue.replace(/[^\w\s]/gi, "");
            addValue = addValue.replace(/[0-9]/gi, "");
        }
        if (addName == "paymentMode") {
            PageSetup(addValue, TempDetails)
            TempDetails = { ...TempDetails, documentId: "", payAmount: "", dateOfPayment: "", bankName: "", branchName: "", checkNo: "", utrNumber: "", transactionNo: "", operation: "", id: "" }
        } else if (addName == "utrNumber") {
            if (addValue.length < 20) {
            }
            if (addValue.length > 20) {
                addValue = addValue.substring(0, 20);
            }
        } else if (addName == "transactionNo") {
            if (addValue.length < 20) {
            }
            if (addValue.length > 20) {
                addValue = addValue.substring(0, 20);
            }
        } else if (addName == "checkNo") {
            if (addValue.length < 6) {
            }
            if (addValue.length > 6) {
                addValue = addValue.substring(0, 6);
            }
        } else if (addName == "payAmount") {
            let errorLabel = ""
            if (String(addValue).length < 15) {
                errorLabel = "Enter 15 Digits Number";
            }
            if (addValue.length > 15) {
                addValue = addValue.substring(0, 15);
            }
        } else if (addName == "bankName" || addName == 'branchName') {
            let errorLabel = ""
            if (String(addValue).length < 50) {
                errorLabel = "Enter 15 Digits Number";
            }
            if (addValue.length > 50) {
                addValue = addValue.substring(0, 50);
            }
        }


        setPaymentDetails({ ...TempDetails, [addName]: addValue });

    }

    const PageSetup = (addValue, TempDetails = PaymentDetails) => {
        switch (addValue) {
            case "CASH": setSelectedFeature({ dateOfPayment: true, bankName: false, branchName: false, checkNo: false, utrNumber: false, transactionNo: false }); return { ...TempDetails, bankName: "", branchName: "", checkNo: "", utrNumber: "", transactionNo: "", };
            case "CHEQUE": setSelectedFeature({ dateOfPayment: true, bankName: true, branchName: true, checkNo: true, utrNumber: false, transactionNo: false }); return { ...TempDetails, utrNumber: "", transactionNo: "" };
            case "NEFT/RTGS": setSelectedFeature({ dateOfPayment: true, bankName: true, branchName: false, checkNo: false, utrNumber: true, transactionNo: false }); return { ...TempDetails, dateOfPayment: "", branchName: "", checkNo: "", transactionNo: "" };
            case "UPI": setSelectedFeature({ dateOfPayment: true, bankName: false, branchName: false, checkNo: false, utrNumber: false, transactionNo: true }); return { ...TempDetails, bankName: "", branchName: "", checkNo: "", utrNumber: "" };
            default: setSelectedFeature({ dateOfPayment: true, bankName: false, branchName: false, checkNo: false, utrNumber: false, transactionNo: false }); return { ...TempDetails, bankName: "", branchName: "", checkNo: "", utrNumber: "", transactionNo: "" };
        }
    }


    const onSubmit = async (e: any) => {
        e.preventDefault();
        let total = 0;
        if (PaymentDetails.payAmount == "0") {
            ShowMessagePopup(false, "Amount Can Not be Zero", "");
        }
        else if (PaymentDetails.paymentMode == "CASH" && parseInt(PaymentDetails.payAmount) > 200000) {
            return ShowMessagePopup(false, "Cash amount can not exceed Rs:2,00,000/- per day.", "");
        }
        else {
            if (OperationMode.mode == "Add") {
                let CashTotal = 0;
                if (PaymentDetails.paymentMode == "CASH" && parseInt(PaymentDetails.payAmount) > 200000) {
                    return ShowMessagePopup(false, "Cash amount can not exceed Rs:2,00,000/- per day", "");
                }
                let filterData = ApplicationDetails.payment.filter(obj => DateFormator(obj.dateOfPayment, "yyyy-mm-dd") == PaymentDetails.dateOfPayment && obj.paymentMode == PaymentDetails.paymentMode)
                filterData.map(x => { CashTotal = CashTotal + parseInt(x.payAmount); })
                if (PaymentDetails.paymentMode == "CASH" && CashTotal + parseInt(PaymentDetails.payAmount) > 200000) {
                    return ShowMessagePopup(false, "Cash amount can not exceed Rs:2,00,000/- per day", "");
                }
                ApplicationDetails.payment.map(x => { total = total + parseInt(x.payAmount); })

            }
            else if (OperationMode.mode == "Edit") {
                let CashTotal = 0;
                let filterData = ApplicationDetails.payment.filter((obj, i) => DateFormator(obj.dateOfPayment, "yyyy-mm-dd") == PaymentDetails.dateOfPayment && obj.paymentMode == PaymentDetails.paymentMode && (i != OperationMode.index))
                filterData.map(x => { CashTotal = CashTotal + parseInt(x.payAmount); })
                if (PaymentDetails.paymentMode == "CASH" && CashTotal + parseInt(PaymentDetails.payAmount) > 200000) {
                    return ShowMessagePopup(false, "Cash amount can not exceed Rs:2,00,000/- per day.", "");
                }
                ApplicationDetails.payment.map((x, i) => { if (i != OperationMode.index) { total = total + parseInt(x.payAmount); } })

            }
            total = total + parseInt(PaymentDetails.payAmount);


            if (parseInt(ApplicationDetails.amount) >= total) {
                if (OperationMode.mode == "Edit") {
                    UpdatePaymentDetails();
                } else if (OperationMode.mode == "Add") {
                    SavePaymentDetails()
                }
                if (parseInt(ApplicationDetails.amount) == total) {
                    redirectToPage("/PartiesDetailsPage")
                }
            }
            else { ShowMessagePopup(false, `Total Payment Amount Should be Equal to Consideration Value i.e.(${ApplicationDetails.amount})`, "") }

        }
    }

    const SavePaymentDetails = async () => {
        let data: any = { ...PaymentDetails, documentId: ApplicationDetails.applicationId }
        let result: any = await CallingAxios(UseSaveSaleDetails(data));
        if (result.status) {
            ShowMessagePopup(true, "Payment Details Added Successfully", "");
            setSelectedFeature({ dateOfPayment: true, bankName: false, branchName: false, checkNo: false, utrNumber: false, transactionNo: false });
            setPaymentDetails({ paymentMode: "", documentId: "", payAmount: "", dateOfPayment: "", bankName: "", branchName: "", checkNo: "", utrNumber: "", transactionNo: "", operation: "", id: "" });
            setOperationMode({ mode: "Add", index: null });
            GetApplicationDetails();
        }
        else {
            ShowMessagePopup(false, "Payment Details Save Failed", "");
        }
    }
    const UpdatePaymentDetails = async () => {
        let data: any = { ...PaymentDetails, documentId: ApplicationDetails.applicationId }
        let result: any = await CallingAxios(UseUpdatePaymentDetails(data));
        if (result.status) {
            ShowMessagePopup(true, "Payment Details Edited Successfully", "");
            setSelectedFeature({ dateOfPayment: true, bankName: false, branchName: false, checkNo: false, utrNumber: false, transactionNo: false });
            setPaymentDetails({ paymentMode: "", documentId: "", payAmount: "", dateOfPayment: "", bankName: "", branchName: "", checkNo: "", utrNumber: "", transactionNo: "", operation: "", id: "" });
            setOperationMode({ mode: "Add", index: null });
            GetApplicationDetails();
        }
        else {
            ShowMessagePopup(false, "Payment Details Edit Failed", "");
        }
    }

    const ShowDeletePopup = (message, redirectOnSuccess, deleteId, applicationId, type) => {
        dispatch(DeletePopupAction({ enable: true, inProcess: false, message, redirectOnSuccess, deleteId, applicationId, type }));
    }

    useEffect(() => {
        if (DeleteOption.response) {
            CallDeletePayment(DeleteOption.deleteId)
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

    const CallDeletePayment = async (id: any) => {
        let data = { id, applicationId: ApplicationDetails.applicationId }
        let result = await CallingAxios(UseDeletePaymentDetails(data));
        if (result.status) {
            ShowMessagePopup(true, "Payment Deleted Successfully", "");
            setSelectedFeature({ dateOfPayment: true, bankName: false, branchName: false, checkNo: false, utrNumber: false, transactionNo: false });
            setPaymentDetails({ paymentMode: "", documentId: "", payAmount: "", dateOfPayment: "", bankName: "", branchName: "", checkNo: "", utrNumber: "", transactionNo: "", operation: "", id: "" });
            GetApplicationDetails();
        }
        else {
            ShowMessagePopup(false, "Delete Action Failed", "");
        }
    }


    const OpenPaymentAction = (index) => {
        setOperationMode({ mode: "Edit", index: index });
        PageSetup(ApplicationDetails.payment[index].paymentMode);
        let data = { ...ApplicationDetails.payment[index], dateOfPayment: DateFormator(ApplicationDetails.payment[index].dateOfPayment, "yyyy-mm-dd") };
        setPaymentDetails(data);
    }

    return (
        <div className='PageSpacing'>
            <Head>
                <title>Payment Details - Public Data Entry</title>
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
                <div className={`pt-4 ${styles.PropertyDetailsmain}`}>
                    <Row className='ApplicationNum'>
                        <Col lg={6} md={6} xs={12}>
                            <div className='ContainerColumn TitleColmn' onClick={() => { redirectToPage("/PartiesDetailsPage") }}>
                                <h4 className='TitleText left-title'>{ApplicationDetails.documentNature ? ApplicationDetails.registrationType.TRAN_DESC : null}</h4>
                            </div>
                        </Col>
                        <Col lg={6} md={6} xs={12}>
                            <div className='ContainerColumn'>
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
                                            <p className={styles.HeaderText}>7 . Payment Details [పేమెంట్ వివరాలు]</p>
                                        </div>
                                    </Col>
                                    <Col lg={6} md={6} xs={12} className='text-end'>
                                        <div className={styles.ContainerColumn}>
                                            <p className={styles.HeaderText}>Consideration Value: {ApplicationDetails.amount}</p>
                                        </div>

                                    </Col>
                                </Row>
                            </div>
                            <form onSubmit={onSubmit}>
                                <div className={`${styles.AddExecutantInfo}, ${styles.RelationInfo}`}>
                                    <Row>
                                        <Col lg={3} md={6} xs={12} className='mb-2'>
                                            <TableText label={"Mode of Payment [చెల్లింపు విధానం]"} required={false} LeftSpace={false} />
                                            <TableDropdown required={true} options={PaymentDetailsData.PaymentTypes} name={'paymentMode'} value={PaymentDetails.paymentMode} onChange={onChange} />

                                        </Col>
                                        <Col lg={3} md={6} xs={12}>
                                            <TableText label={"Amount [మొత్తం]"} required={true} LeftSpace={false} />
                                            <TableInputText type='number' placeholder='Enter Amount' required={true} name={'payAmount'} value={PaymentDetails.payAmount} onChange={onChange} />
                                        </Col>
                                        {SelectedFeature.dateOfPayment ?
                                            <Col lg={3} md={6} xs={12}>
                                                <TableText label={"Date of Payment [చెల్లించిన తేదీ]"} required={true} LeftSpace={false} />
                                                <TableSelectDate max={(moment((maxDate)).format("YYYY-MM-DD"))} placeholder='Select Date' required={true} name={"dateOfPayment"} value={PaymentDetails.dateOfPayment} onChange={onChange} />
                                                {/* <TableSelectDate placeholder='Select Date' required={true} name={'dateOfPayment'} value={PaymentDetails.dateOfPayment} onChange={onChange} /> */}
                                            </Col> : null}
                                        {SelectedFeature.checkNo ?
                                            <Col lg={3} md={6} xs={12}>
                                                <TableText label={"Cheque No. [చెక్ నెం.]"} required={true} LeftSpace={false} />
                                                <TableInputText type='number' placeholder='Enter Cheque No' required={true} name={'checkNo'} value={PaymentDetails.checkNo} onChange={onChange} />
                                            </Col> : null}
                                        {SelectedFeature.bankName ?
                                            <Col lg={3} md={6} xs={12}>
                                                <TableText label={"Bank Name [బ్యాంకు పేరు]"} required={true} LeftSpace={false} />
                                                <TableInputText type='text' placeholder='Enter Bank Name' required={true} name={'bankName'} value={PaymentDetails.bankName} splChar={false} onChange={onChange} />
                                            </Col> : null}
                                        {SelectedFeature.branchName ?
                                            <Col lg={3} md={6} xs={12}>
                                                <TableText label={"Branch [బ్రాంచ్]"} required={true} LeftSpace={false} />
                                                <TableInputText type='text' placeholder='Enter Branch' required={true} name={'branchName'} value={PaymentDetails.branchName} splChar={false} onChange={onChange} />
                                            </Col> : null}
                                        {SelectedFeature.utrNumber ?
                                            <Col lg={3} md={6} xs={12}>
                                                <TableText label={"UTR No. [యుటిఆర్ నెం.]"} required={true} LeftSpace={false} />
                                                <TableInputText type='text' placeholder='Enter UTR No' required={true} name={'utrNumber'} splChar={false} value={PaymentDetails.utrNumber} onChange={onChange} />
                                            </Col> : null}
                                        {SelectedFeature.transactionNo ?
                                            <Col lg={3} md={6} xs={12}>
                                                <TableText label={"Transaction No. [లావాదేవీ నెం.]"} required={true} LeftSpace={false} />
                                                <TableInputText type='number' placeholder='Enter UTR No' required={true} name={'transactionNo'} value={PaymentDetails.transactionNo} onChange={onChange} />
                                            </Col> : null}
                                    </Row>

                                    <div className='mt-2'>
                                        <Row>
                                            <Col lg={12} md={12} xs={12}>
                                                <div className='d-flex justify-content-center'>
                                                    <div className={styles.ProceedContainer} style={{ display: "flex", gap: "2rem" }}>
                                                        <button className='proceedButton'>{OperationMode.mode}</button>
                                                        {OperationMode.mode == "Edit" ? <div className='proceedButton' onClick={() => { setOperationMode({ mode: "Add", index: null }); setSelectedFeature({ dateOfPayment: true, bankName: false, branchName: false, checkNo: false, utrNumber: false, transactionNo: false }); setPaymentDetails({ paymentMode: "", documentId: "", payAmount: "", dateOfPayment: "", bankName: "", branchName: "", checkNo: "", utrNumber: "", transactionNo: "", operation: "", id: "" }); }}>Clear</div> : null}
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>

                                    {ApplicationDetails?.payment?.length ?
                                    <div>
                                        <Row>
                                            <div className='table-responsive mt-3'>
                                                <Table striped bordered hover className='TableData'>
                                                    <thead>
                                                        <tr>
                                                            <th>S. No.<span>[క్రమ సంఖ్య]</span></th>
                                                            <th>Mode of Payment<span>[చెల్లింపు విధానం]</span></th>
                                                            <th>Amount<span>[మొత్తం]</span></th>
                                                            <th>Payment Date<span>[చెల్లింపు తేదీ]</span></th>
                                                            <th>Action<span>[చర్య]</span></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {ApplicationDetails.payment.map((singlePayment, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td>{index + 1}</td>
                                                                    <td>{singlePayment.paymentMode}</td>
                                                                    <td>{singlePayment.payAmount}</td>
                                                                    <td>{DateFormator(singlePayment.dateOfPayment, "dd/mm/yyyy")}</td>
                                                                    <td>
                                                                        <div style={{ cursor: 'pointer' }} className={`${styles.actionTitle} ${styles.actionbtn}`} onClick={() => OpenPaymentAction(index)}>
                                                                            <Image alt="Image" height={18} width={17} src='/PDE/images/edit-icon.svg' className={styles.tableactionImg} />
                                                                        </div>
                                                                        <div className={`${styles.actionTitle} ${styles.actionbtn}`} style={{ cursor: 'pointer' }} onClick={() => { ShowDeletePopup("Are you sure you want to premanently remove this Payment?", "", singlePayment._id, ApplicationDetails.applicationId, "Payment") }}>
                                                                            <Image alt="Image" height={18} width={17} src='/PDE/images/delete-icon.svg' className={styles.tableactionImg} />
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}

                                                    </tbody>
                                                </Table>
                                            </div>

                                        </Row>
                                        {/* <div className='mt-4'>
                            <Row>
                                <Col lg={12} md={12} xs={12}>
                                    <div className='d-flex justify-content-center'>
                                        <div className={styles.ProceedContainer}>
                                            <button onClick={onFinalSubmit} className='proceedButton'>Proceed</button>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </div> */}
                                    </div> : null}
                                </div>
                              

                            </form>
                        </div>
                    </Col>
                </Row>


                <div className='text-center'>
                    <div onClick={() => router.push("/PartiesDetailsPage")} style={{ cursor: "pointer" }} className='proceedButton'>Back</div>
                </div>
            </Container>
            {/* <pre>{JSON.stringify(ApplicationDetails, null, 2)}</pre> */}
            {/* <pre>{JSON.stringify(PaymentDetails, null, 2)}</pre> */}
        </div>
    )
}

export default PaymentDetailsPage
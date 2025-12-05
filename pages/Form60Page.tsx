import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import styles from '../styles/pages/Mixins.module.scss';
import TableText from '../src/components/TableText';
import TableInputText from '../src/components/TableInputText';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '../src/redux/hooks';
import { encryptWithAES, encryptId, decryptId } from '../src/utils';
import { CallingAxios, KeepLoggedIn, ShowMessagePopup } from '../src/GenericFunctions';
import { useSaveForm60Details } from '../src/axios';
import ApplicationList from './ApplicationListPage';
import moment from 'moment';
import { LoadingAction } from '../src/redux/commonSlice';
import { BiWindowAlt } from 'react-icons/bi';
import TableSelectDate from '../src/components/TableSelectDate';
import TableDropdown from '../src/components/TableDropdown';
import form60docType from '../src/form60docType';

const Form60Page = () => {
    const dispatch = useAppDispatch()
    const router = useRouter();
    const [form60details, setForm60details] = useState<any>({
        fName: "", mName: "", sName: "", fDate: "", ffName: "", fmName: "", fsName: "", flatNo: "", floorNo: "", namePremises: "", signerName:"",
        blackName: "", roadStreet: "", townCity: "", district: "", state: "", pinCode: "", telNo: "", mobileNo: "", transAmount: "", agrIncome: "", nonagrIncome: "", modeOfTransaction:"", 
        transDate: "", aadhaarNo: "", jointName: "", ackdate: "", ackNo: "",identityDocType:"", identityDocID:"",identityDocAuthority:"",addressDocType:"", addressDocID:"",addressDocAuthority:""});
    const Loading = (value: boolean) => { dispatch(LoadingAction({ enable: value })); }
    const [esignPartyData, setEsignPartyData] = useState<any>({});
    const [esignUrl, setEsignUrl] = useState<string>("");
    const [esignRequest, setEsignRequest] = useState<string>("");
    const [esignFieldName, setEsignFieldName] = useState<string>("");
    const [identityData, setIdentityData] = useState();

    useEffect(() => {
        if (KeepLoggedIn()) {
            let data = localStorage.getItem("esignPartyData");

            if (data == "" || data == undefined) {
                ShowMessagePopup(false, "Invalid Access", "/");
            }
            else {
                let esignPartyData = JSON.parse(decryptId(data));
                // console.log("esignPartyData :::: ", esignPartyData);
                setEsignPartyData(esignPartyData);
                let formDetails = { ...form60details }
                const partyData = esignPartyData;
                if (esignPartyData.represent && esignPartyData.represent.length > 0) {
                    let representData = esignPartyData.represent[0];
                    localStorage.setItem("partyType", encryptId("Represent"));
                    setForm60details({ ...form60details, aadhaarNo: representData.aadhaar?.toString() || "", mobileNo: representData.phone, signerName: representData.name });
                }else{
                    localStorage.setItem("partyType", encryptId("Party"));
                    setForm60details({ ...form60details, aadhaarNo: partyData.aadhaar?.toString() || "", mobileNo: partyData.phone, signerName: partyData.name});
                }
            }
        } else {
            ShowMessagePopup(false, "Invalid Access", "/")
        }
    }, []);



    const CallSaveFrom60Details = async (data: any) => {
        let updatedData: any = {
            "appId": esignPartyData.applicationId,
            "formData": form60details
        }

        const result = await CallingAxios(useSaveForm60Details(updatedData));
        if (result?.status === true) {
            // console.log(":::::::result::::", result);
            //window.alert(JSON.stringify(result.status));
            let eSignData = result?.data?.eSignData;
            let transId = result?.data?.transId;
            localStorage.setItem("transId", encryptId(transId));
            ShowMessagePopup(true, "Data Saved Successfully", "");
            setEsignUrl(eSignData?.esignPostUrl);
            setEsignFieldName(eSignData?.fieldName);
            setEsignRequest(eSignData?.eSignRequest);
        } else {
            ShowMessagePopup(false, "Data Not Found", "");
        }
    };


    const submitEsignForm = () => {
        let buttonDom: any = document.getElementById('esignButtonId');
        buttonDom.click();
    }

    useEffect(() => {
        if (esignRequest) {
            submitEsignForm();
        }
    }, [esignRequest])

    const onChange = (e: any) => {
        e.preventDefault();
        let tempParty = { ...form60details }
        let addName = e.target.name;
        let addValue = e.target.value;
        if (addName == "pinCode") {
            if (addValue.length > 6) {
                addValue = addValue.substring(0, 6);
            }
        }
        if (addName == "fName" || addName == "mName" || addName == "sName" || addName == "ffName" || addName == "fmName" || addName == "fsName" ||
            addName == "areaLocality" || addName == "townCity" || addName == "district" || addName == "state") {
            addValue = addValue.replace(/[^\w\s]/gi, "");
            addValue = addValue.replace(/[0-9]/gi, "");
        }
        if (addName == "flatNo" || addName == "floorNo" || addName == "blackName" || addName == "roadStreet" || addName == "ackNo" || addName =="docnameaddress" || addName == "doctypeaddress") {
            addValue = addValue.replace(/[^a-zA-Z0-9,.\-\/ ]/g, "");
        }
        if (addName == "namePremises") {
            addValue = addValue.replace(/[^a-zA-Z0-9,&.\-\/ ]/g, "");
        }
        setForm60details({ ...tempParty, [addName]: addValue })
    }


    const onSubmit = (e: any) => {
        e.preventDefault();
        CallSaveFrom60Details(form60details);
        setForm60details({ ...form60details })
    }

    const transactionTypes = ["Cash", "Cheque", "Card", "Draft/Banker’s Cheque", "Online transfer", "Other"]
    const modeOfTransactionOptions = transactionTypes.map(item => ({
        type: item,
        code: item
    }));;

    const identityOptions = form60docType.IdentityTypeList.map(item => ({
        type: item.IDENTITY_TYPE,
        code: item.IDENTITY_CODE
    }));



    const addressOptions = form60docType.AddressTypeList.map(item => ({
        type: item.ADDRESS_TYPE,
        code: item.ADDRESS_CODE
    }));
    return (
        <div className='PageSpacing pt-0'>
            <Head>
                <title>Form60/61 - Public Data Entry</title>
            </Head>
            <Container>
                <Row className='mb-2'>
                    <Col lg={10} md={12} xs={12}></Col>
                    <Col lg={2} md={12} xs={12}>
                    </Col>
                </Row>
                <Row>
                    <Col lg={12} md={12} xs={12}>
                        <form onSubmit={onSubmit} className={styles.AddPartyMain}>
                            <Row className='ApplicationNum'>
                                <Col lg={6} md={6} xs={12}>
                                    <div className='ContainerColumn'>
                                        <p className='TitleText'> Form60/61 Details</p>
                                    </div>
                                </Col>
                                <Col lg={6} md={6} xs={12}>
                                    <div className='ContainerColumn RightColumnText text-end'>
                                    </div>
                                </Col>
                            </Row>
                            <div className={`p-3 ${styles.AddPartyInfo}`}>
                                <div>
                                    <div>
                                        <Row>
                                            <Col lg={3} md={6} xs={12}>
                                                <TableText label={"First Name"} required={true} LeftSpace={false} />
                                                <TableInputText disabled={false} type='text' maxLength={50} placeholder='Enter First Name' splChar={false} required={true} name={'fName'} value={form60details.fName} onChange={onChange} capital={true} />
                                            </Col>

                                            <Col lg={3} md={6} xs={12}>
                                                <TableText label={"Middle Name"} required={false} LeftSpace={false} />
                                                <TableInputText disabled={false} type='text' maxLength={50} placeholder='Enter Middle Name' splChar={false} required={false} name={'mName'} value={form60details.mName} onChange={onChange} capital={true} />
                                            </Col>

                                            <Col lg={3} md={6} xs={12}>
                                                <TableText label={"Surname"} required={true} LeftSpace={false} />
                                                <TableInputText disabled={false} type='text' maxLength={50} placeholder='Enter Sur Name' splChar={false} required={true} name={'sName'} value={form60details.sName} onChange={onChange} capital={true} />
                                            </Col>

                                            <Col lg={3} md={6} xs={12}>
                                                <TableText label={"Date of Birth/ Incorporation of declarant"} required={true} LeftSpace={false} />
                                                <TableSelectDate max={(moment(moment().toDate())).format("YYYY-MM-DD")} placeholder='Select Date' required={true} name={'fDate'} onChange={onChange} value={form60details.fDate} />
                                                {/* <TableInputText disabled={false} type='date' placeholder='Enter DOB' max={(moment(moment().toDate())).format("YYYY-MM-DD")} splChar={false} required={true} name={'fDate'} value={form60details.fDate} onChange={onChange} capital={true} /> */}
                                            </Col>
                                        </Row>

                                        <Row className='pt-2'>
                                            <Col lg={3} md={6} xs={12}>
                                                <TableText label={"Father First Name"} required={true} LeftSpace={false} />
                                                <TableInputText disabled={false} type='text' maxLength={50} placeholder='Enter First Name' splChar={false} required={true} name={'ffName'} value={form60details.ffName} onChange={onChange} capital={true} />
                                            </Col>

                                            <Col lg={3} md={6} xs={12}>
                                                <TableText label={"Father Middle Name"} required={false} LeftSpace={false} />
                                                <TableInputText disabled={false} type='text' maxLength={50} placeholder='Enter Middle Name' splChar={false} required={false} name={'fmName'} value={form60details.fmName} onChange={onChange} capital={true} />
                                            </Col>

                                            <Col lg={3} md={6} xs={12}>
                                                <TableText label={"Father Surname"} required={true} LeftSpace={false} />
                                                <TableInputText disabled={false} type='text' maxLength={50} placeholder='Enter Sur Name' splChar={false} required={true} name={'fsName'} value={form60details.fsName} onChange={onChange} capital={true} />
                                            </Col>

                                            <Col lg={3} md={6} xs={12}>
                                                <TableText label={"Flat/ Room No."} required={true} LeftSpace={false} />
                                                <TableInputText disabled={false} type='text' maxLength={50} placeholder='Enter Flat/ Room No.' required={true} name={'flatNo'} value={form60details.flatNo} onChange={onChange} capital={true} />
                                            </Col>
                                        </Row>

                                        <Row className='pt-2'>
                                            <Col lg={3} md={6} xs={12}>
                                                <TableText label={"Floor No"} required={true} LeftSpace={false} />
                                                <TableInputText disabled={false} type='number' maxLength={50} placeholder='Enter Floor No.' splChar={false} required={true} name={'floorNo'} value={form60details.floorNo} onChange={onChange} capital={true} />
                                            </Col>

                                            <Col lg={3} md={6} xs={12}>
                                                <TableText label={"Name of premises"} required={true} LeftSpace={false} />
                                                <TableInputText disabled={false} type='text' maxLength={30} placeholder='Enter Name of premises' splChar={false} required={true} name={'namePremises'} value={form60details.namePremises} onChange={onChange} capital={true} />
                                            </Col>

                                            <Col lg={3} md={6} xs={12}>
                                                <TableText label={"Block Name/No"} required={true} LeftSpace={false} />
                                                <TableInputText disabled={false} type='text' maxLength={50} placeholder='Enter Block Name/No' splChar={false} required={true} name={'blackName'} value={form60details.blackName} onChange={onChange} capital={true} />
                                            </Col>

                                            <Col lg={3} md={6} xs={12}>
                                                <TableText label={"Road/ Street/ Lane"} required={true} LeftSpace={false} />
                                                <TableInputText disabled={false} type='text' maxLength={50} placeholder='Enter Road/ Street/ Lanee' splChar={false} required={true} name={'roadStreet'} value={form60details.roadStreet} onChange={onChange} capital={true} />
                                            </Col>
                                        </Row>

                                        <Row className='pt-2'>
                                            <Col lg={3} md={6} xs={12}>
                                                <TableText label={"Areal Locality"} required={true} LeftSpace={false} />
                                                <TableInputText disabled={false} type='text' maxLength={50} placeholder='Enter Areal Locality' splChar={false} required={true} name={'areaLocality'} value={form60details.areaLocality} onChange={onChange} capital={true} />
                                            </Col>

                                            <Col lg={3} md={6} xs={12}>
                                                <TableText label={"Town/ City"} required={true} LeftSpace={false} />
                                                <TableInputText disabled={false} type='text' maxLength={50} placeholder='Enter Town/ City' splChar={false} required={true} name={'townCity'} value={form60details.townCity} onChange={onChange} capital={true} />
                                            </Col>

                                            <Col lg={3} md={6} xs={12}>
                                                <TableText label={"District"} required={true} LeftSpace={false} />
                                                <TableInputText disabled={false} type='text' maxLength={50} placeholder='Enter District' splChar={false} required={true} name={'district'} value={form60details.district} onChange={onChange} capital={true} />
                                            </Col>

                                            <Col lg={3} md={6} xs={12}>
                                                <TableText label={"State"} required={true} LeftSpace={false} />
                                                <TableInputText disabled={false} type='text' maxLength={50} placeholder='Enter State' splChar={false} required={true} name={'state'} value={form60details.state} onChange={onChange} capital={true} />
                                            </Col>
                                        </Row>

                                        <Row className='pt-2'>
                                            <Col lg={3} md={6} xs={12}>
                                                <TableText label={"Pin code"} required={true} LeftSpace={false} />
                                                <TableInputText disabled={false} type='number' maxLength={6} min={6} placeholder='Enter Pin code' splChar={false} required={true} name={'pinCode'} value={form60details.pinCode} onChange={onChange} capital={true} />
                                            </Col>

                                            <Col lg={3} md={6} xs={12}>
                                                <TableText label={"Telephone No.(with STD code)"} required={false} LeftSpace={false} />
                                                <TableInputText disabled={false} type='number' maxLength={13} placeholder='Enter Telephone No.' splChar={false} required={false} name={'telNo'} value={form60details.telNo} onChange={onChange} capital={true} />
                                            </Col>

                                            <Col lg={3} md={6} xs={12}>
                                                <TableText label={"Mobile No. with Aadhaar Linked"} required={true} LeftSpace={false} />
                                                <TableInputText disabled={true} type='number' maxLength={10} placeholder='Enter Mobile No.' splChar={false} required={true} name={'mobileNo'} value={form60details.mobileNo} onChange={onChange} capital={true} />
                                            </Col>

                                            <Col lg={3} md={6} xs={12}>
                                                <TableText label={"Amount of transaction (Rs.)"} required={true} LeftSpace={false} />
                                                <TableInputText disabled={false} type='number' maxLength={15} placeholder='Enter Amount' splChar={false} required={true} name={'transAmount'} value={form60details.transAmount} onChange={onChange} capital={true} />
                                            </Col>
                                        </Row>

                                        <Row className='pt-2'>
                                            <Col lg={3} md={6} xs={12}>
                                                <TableText label={"Agricultural income (Rs.)"} required={true} LeftSpace={false} />
                                                <TableInputText disabled={false} type='number' maxLength={15} placeholder='Enter Agricultural income' splChar={false} required={true} name={'agrIncome'} value={form60details.agrIncome} onChange={onChange} capital={true} />
                                            </Col>

                                            <Col lg={3} md={6} xs={12}>
                                                <TableText label={"Other than agricultural income (Rs.)"} required={true} LeftSpace={false} />
                                                <TableInputText disabled={false} type='number' maxLength={15} placeholder='Enter Agri Income' splChar={false} required={true} name={'nonagrIncome'} value={form60details.nonagrIncome} onChange={onChange} capital={true} />
                                            </Col>

                                            <Col lg={3} md={6} xs={12}>
                                                <TableText label={"Date of transaction"} required={true} LeftSpace={false} />
                                                <TableSelectDate max={(moment(moment().toDate())).format("YYYY-MM-DD")} placeholder='Select Date' required={true} name={'transDate'} onChange={onChange} value={form60details.transDate} />
                                                {/* <TableInputText disabled={false} type='date' placeholder=' ' splChar={false} max={(moment(moment().toDate())).format("YYYY-MM-DD")} required={true} name={'transDate'} value={form60details.transDate} onChange={onChange} capital={true} /> */}
                                            </Col>



                                            <Col lg={3} md={6} xs={12}>
                                                <TableText label={"Aadhaar Number (if available)"} required={true} LeftSpace={false} />
                                                <TableInputText disabled={true} type='text' required={true} placeholder="" value={form60details.aadhaarNo?.toString().length === 12 ? "XXX XXX XX" + form60details.aadhaarNo.toString().slice(-4): ""} name="" splChar={false} onChange={onChange} />
                                            </Col>
                                        </Row>
                                        <Row className='pt-2'>
                                            <Col lg={3} md={6} xs={12}>
                                                <TableText label={"Mode of transaction"} required={false} LeftSpace={false} />
                                                <TableDropdown required={true} multi={true} options={modeOfTransactionOptions} name={"modeOfTransaction"} value={form60details.modeOfTransaction} onChange={onChange} />
                                            </Col>
                                            <Col lg={3} md={6} xs={12}>
                                                <TableText label={"Number of persons involved in the transaction"} required={false} LeftSpace={false} />
                                                <TableInputText disabled={false} type='number' maxLength={4} placeholder='' splChar={false} required={false} name={'jointName'} value={form60details.jointName} onChange={onChange} capital={true} />
                                            </Col>
                                            <Col lg={3} md={6} xs={12}>
                                                <TableText label={"Application Acknowledgement Date(PAN)"} required={true} LeftSpace={false} />
                                                <TableSelectDate max={(moment(moment().toDate())).format("YYYY-MM-DD")} placeholder='Select Date' required={true} name={'ackdate'} onChange={onChange} value={form60details.ackdate} />
                                            </Col>
                                            <Col lg={3} md={6} xs={12}>
                                                <TableText label={"Acknowledgement No.(PAN)"} required={true} LeftSpace={false} />
                                                <TableInputText disabled={false} type='text' maxLength={15} placeholder='Enter Acknowledgement No.' splChar={false} required={true} name={'ackNo'} value={form60details.ackNo} onChange={onChange} capital={true} />
                                            </Col>
                                        </Row>
                                        <Row className='pt-2'>
                                            <Col lg={4} md={6} xs={12}>
                                                <TableText label={"Identity Document Type"} required={true} LeftSpace={false} />
                                                <TableDropdown required={true} multi={true} options={identityOptions} name={"identityDocType"} value={form60details.identityDocType} onChange={onChange} />
                                            </Col>
                                            <Col lg={4} md={6} xs={12}>
                                                <TableText label={"Document Identification Number"} required={true} LeftSpace={false} />
                                                <TableInputText disabled={false} type='text' maxLength={30} placeholder='Enter Document No.' splChar={false} required={true} name={'identityDocID'} value={form60details.identityDocID} onChange={onChange} capital={true} />
                                            </Col>
                                            <Col lg={4} md={6} xs={12}>
                                                <TableText label={"Name and address of the authority issuing the document"} required={true} LeftSpace={false} />
                                                <TableInputText disabled={false} type='text' maxLength={200} placeholder='Enter Name & Address' required={true} name={'identityDocAuthority'} value={form60details.identityDocAuthority} onChange={onChange} capital={true} />
                                            </Col>
                                        </Row>

                                        <Row className='pt-2'>
                                            <Col lg={4} md={6} xs={12}>
                                                <TableText label={"Address Document Type"} required={true} LeftSpace={false} />
                                                <TableDropdown required={true} multi={true} options={addressOptions} name={"addressDocType"} value={form60details.addressDocType} onChange={onChange} />
                                            </Col>
                                            <Col lg={4} md={6} xs={12}>
                                                <TableText label={"Address Document Number"} required={true} LeftSpace={false} />
                                                <TableInputText disabled={false} type='text' maxLength={30} placeholder='Enter Document No.' splChar={false} required={true} name={'addressDocID'} value={form60details.addressDocID} onChange={onChange} capital={true} />
                                            </Col>
                                            <Col lg={4} md={6} xs={12}>
                                                <TableText label={"Name and address of the authority issuing the document"} required={true} LeftSpace={false} />
                                                <TableInputText disabled={false} type='text' maxLength={200} placeholder='Enter Name & Address' required={true} name={'addressDocAuthority'} value={form60details.addressDocAuthority} onChange={onChange} capital={true} />
                                            </Col>
                                        </Row>

                                        <Row className='pt-3'>
                                            <Col lg={12} md={12} xs={12} style={{ textAlign: "center", display: "inline-flex", justifyContent: "center" }}>
                                                <div className='proceedButton cancelBtn mx-2' style={{ cursor: 'pointer' }} onClick={() => router.push("/PartiesDetailsPage")}>Cancel</div>
                                                <div className={styles.GetsingleColumn}>
                                                    <button className='proceedButton'>Save</button>

                                                </div>
                                            </Col>
                                        </Row>
                                    </div>

                                    <div>
                                        <form action={esignUrl} method="POST">
                                            <input type="hidden" id={esignFieldName} name={esignFieldName} value={esignRequest} />
                                            <input type="submit" value="Submit" style={{ visibility: 'hidden' }} id='esignButtonId' />
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </Col>
                </Row>
            </Container>

            {/* <pre>{JSON.stringify(esignPartyData, null, 2)}</pre> */}

        </div>
    )
}

export default Form60Page
import React, { Fragment, useEffect, useLayoutEffect, useState } from 'react'
import { useRouter } from 'next/router';
import { FaRegEdit } from 'react-icons/fa';
import { useAppSelector, useAppDispatch } from '../src/redux/hooks';
import { saveLoginDetails } from '../src/redux/loginSlice';
import styles from '../styles/pages/Mixins.module.scss';
import { Container, Row, Col } from 'react-bootstrap';
import Image from 'next/image';
import Table from 'react-bootstrap/Table';
import { TbCalendarTime } from 'react-icons/tb';
import { SaveGetstartedDetails } from '../src/redux/formSlice';
import { decryptWithAESPassPhrase, getApplicationDetails, UseAuthenticateUpdate, UseCheckSlotEnabledForSro, UseDeleteSlot, UseGetAadharDetails, UseGetAadharOTP, UseGetSlotsbyId, UseSendingMobileOTP, UseslotQrParties, UseSlotVerify } from '../src/axios';
import { CallingAxios, KeepLoggedIn, ShowMessagePopup, ShowPreviewPopup } from '../src/GenericFunctions';
import Head from 'next/head';
import CheckBox from '../src/components/CheckBox';
import { setPresenterData } from '../src/utils';
import Popstyles from '../styles/components/PopupAlert.module.scss';
import { ImCross } from 'react-icons/im';
import TableText from '../src/components/TableText';
import TableDropdown from '../src/components/TableDropdown';
import TableInputText from '../src/components/TableInputText';
import { get } from 'lodash';
import { encryptWithAESPassPhrase } from '../src/utils';



const SlotBooking = () => {
    const dispatch = useAppDispatch()
    let LoginDetails = useAppSelector((state: any) => state.login.loginDetails);
    let Loader = useAppSelector((state) => state.common.Loading);
    const router = useRouter();
    let [ApplicationList, setApplicationList] = useState<any>([]);
    let [mBox, SetMBox] = useState<any>(false);
    const [otpList, SetOtpList] = useState<any>({});
    const [presenrData, SetPresenrData] = useState<any>();
    const [otpVerify, SetOtpVerify] = useState<any>(false)
    const [aadhaarOTPResponse, setAadhaarOTPResponse] = useState({});
    const [tempDetails, SetTempDetails] = useState<any>({});
    let GetstartedDetails = useAppSelector(state => state.form.GetstartedDetails);

    const redirectToPage = (location: string) => {
        let data = { ...GetApplicationDetails }
        dispatch(SaveGetstartedDetails(data));
        router.push({
            pathname: location,
        })
    }
    const DropdownList = {
        list: ["Mobile", "Aadhar"],
    }

    useEffect(() => { if (KeepLoggedIn()) { GetApplicationDetails(); localStorage.setItem("GetApplicationDetails", ""); } else { ShowMessagePopup(false, "Invalid Access", "/") } }, []);

    const GetApplicationDetails = async () => {
        let query = { status: ["SLOT BOOKED","SYNCED"] }
        // let query = { status: ["SLOT BOOKED", "SUBMITTED", "SYNCED", "DRAFT"] }
        // let query = { status: ["SLOT BOOKED", "COMPLETED"] }
        let result: any = await CallingAxios(getApplicationDetails(query));
        if (result.status == true) {
            let x: any = [...result.data];
            for (let i in result.data) {
                // window.alert(JSON.stringify(result.data[i]?.slots))
                x[i].isAuthenticateThroughQr = result.data[i]?.slots?.isAuthenticateThroughQr
                x[i].slots = result.data[i]?.slots?.slotDate ? result.data[i].slots.slotDate + ',' + result.data[i].slots.slotTime : null;

            }
            setApplicationList(x);
        } else {
            alert(result.message)
        }
    }

    const OnClickOperation =async (action: string, singleData: any) => {
        let appID = singleData.applicationId;
        let sroCode = singleData.sroCode;
        let result: any = await CallingAxios(UseCheckSlotEnabledForSro(sroCode));
        if(result.status && result.data>0){    
        
            let slotCode = sroCode+"_"+appID;
            let encryptedData = encryptWithAESPassPhrase(slotCode, '123456');
            encryptedData = encodeURIComponent(encryptedData);
            let redirectionUrl = process.env.SLOT_BOOKING_URL+encryptedData;    
            console.log("redirectionUrl ::::  ", redirectionUrl);
            window.open(redirectionUrl, '_blank');
        }
        else{
            ShowMessagePopup(false,'Slot Booking is not enabled for ' + singleData.sroOffice, "");
        }
        }

    const otpOnchange = async (e: any) => {
        let Temp: any = { ...otpList }
        let fieldName = e.target.name;
        let value = e.target.value;
        if (value == "Mobile") {
            Temp = { ...Temp, mobile: presenrData.phone, aadhaar: "" }
        } else if (value == "Aadhar") {
            Temp = { ...Temp, aadhaar: presenrData.aadhaar, mobile: "" }
        }
        SetOtpList({ ...Temp, [fieldName]: value });
    }


    const onCheckedBox = async (appId: any) => {
        SetPresenrData({ ...presenrData, phone: "", aadhaar: "", name: "" });
        SetOtpList({ ...otpList, otpType: "" })
        const data: any = { applicationId: appId };
        let resp: any = await CallingAxios(UseslotQrParties(data));
        if (resp.status) {
            let PresnterData: any = await setPresenterData(JSON.parse(decryptWithAESPassPhrase(resp.hash)));
            SetPresenrData(PresnterData);
            SetMBox(true);
        } else {
            ShowMessagePopup(false, "No Parties(presenters) for this ApplicationID"
                , "");
            SetMBox(false);
        }
    }


    const SendOTP = async () => {
        if (otpList && otpList.otpType === "Aadhar") {
            let result = await CallingAxios(UseGetAadharOTP(btoa(otpList.aadhaar)));
            if (result && result.status === 'Success') {
                ShowMessagePopup(true, "OTP Sent to Mobile Number Linked with Aadhaar"
                    , "");
                setAadhaarOTPResponse(result)
                SetOtpVerify(true)
            } else {
                ShowMessagePopup(false, get(result, 'message', "Aadhaar API Failed")
                    , "");
                setAadhaarOTPResponse({})
                SetOtpVerify(false)
                SetMBox(false)
            }

        } else if (otpList.otpType === "Mobile") {
            let result: any = await CallingAxios(UseSendingMobileOTP({ mobile: otpList.mobile }))
            if (result.status) {
                await CallingAxios(UseAuthenticateUpdate({ applicationId: presenrData.applicationId, otpfrom: "mobile", otp: result.otp }));
                ShowMessagePopup(true, "OTP Sent to Mobile Number", "");
                SetOtpVerify(true)
            } else {
                ShowMessagePopup(false, get(result, 'message', "Mobile API Failed"), '')
                SetOtpVerify(false)
                SetMBox(false)
            }
        }
    }

    const verifyOTP = async () => {
        // e.preventDefault();
        if (otpList.otpType === 'Aadhar') {
            let result: any = await CallingAxios(UseGetAadharDetails({
                aadharNumber: btoa(otpList.aadhaar),
                transactionNumber: get(aadhaarOTPResponse, 'transactionNumber', ''),
                otp: otpList.otp
            }))
            if (result.status && result.status === 'Success') {
                await CallingAxios(UseAuthenticateUpdate({ applicationId: presenrData.applicationId }));
                // window.alert("))))))))))))))))))))))))")
                ShowMessagePopup(true, "Your Slot is Authenticated Successfully", "");
                // SetSubmitBx(false)
                SetMBox(false);
                let slotDEtails: any = await CallingAxios(UseGetSlotsbyId({ applicationId: presenrData.applicationId }));
                if (slotDEtails.status) {
                    SetTempDetails({ ...tempDetails, dateForSlot: String(slotDEtails.data.slotDate).split("T")[0], slotTime: slotDEtails.data.slotTime });
                    // SetMssage(true);
                }
                // callLoginAPI()
            } else {
                ShowMessagePopup(false, get(result, 'message', "Aadhaar API Failed"), '');
                SetMBox(false);
                // SetSubmitBx(false)
            }
        } else if (otpList.otpType === 'Mobile') {
            let result: any = await CallingAxios(UseSlotVerify({ documentId: presenrData.applicationId, slotOtp: Number(otpList.otp) }));
            if (result.status) {
                await CallingAxios(UseAuthenticateUpdate({ applicationId: presenrData.applicationId }));
                ShowMessagePopup(true, "Your Slot is Authenticated Successfully", "");
                GetApplicationDetails();
                // SetSubmitBx(false)
                SetMBox(false);
                let slotDEtails: any = await CallingAxios(UseGetSlotsbyId({ applicationId: presenrData.applicationId }));
                if (slotDEtails.status) {
                    // await CallingAxios(UseSendingMobileOTP({ mobile: otpList.mobile,type:"link",applicationId:presenrData.applicationId,slotDate: String(slotDEtails.data.slotDate).split("T")[0], slotTime: slotDEtails.data.slotTime }))
                    SetTempDetails({ ...tempDetails, dateForSlot: String(slotDEtails.data.slotDate).split("T")[0], slotTime: slotDEtails.data.slotTime });
                    // SetMssage(true);
                }
                // callLoginAPI()
            } else {
                ShowMessagePopup(false, get(result, 'message', "Mobile API Failed"), '');
                SetMBox(false);
                // SetSubmitBx(false)
            }
        }
        // let Obj: any = { "sroOfcNum": SlotBookingDetails.sroOfcNum, "dateForSlot": SlotBookingDetails.dateForSlot, slots: [] };
        // SlotBookingDetails.sroOfcNum = SlotBookingDetails.sroOfcNum;
        // SlotBookingDetails.slots = [];
        // await CreateAppointment(Obj);
        // SetSlotpage(!slotpage);
    }

    return (
        <div className='PageSpacing'>
            <Head>
                <title>Slot Booking List - Public Data Entry</title>
            </Head>
            <Container className='ListContainer'>
                <div className={styles.ListviewMain}>
                    <Row className='ApplicationNum'>
                        <Col lg={4} md={6} sm={12}>
                            <div className='ContainerColumn TitleColmn' style={{ cursor: "pointer" }} onClick={() => { redirectToPage("/ServicesPage") }}>
                                <h4 className='TitleText left-title '>Slot Booking List<span>[స్లాట్ బుకింగ్ జాబితా]</span></h4>
                            </div>
                        </Col>
                        <Col lg={8} md={8} sm={12} className='d-flex text-end justify-content-end'>
                        <div className={styles.colorCon}></div> 
                            <div className={styles.noteInfo}>                       
                                <h6 className={styles.notetextInfo}>Note: This color indicates that you need to authenticate your slot.</h6>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={12} md={12} sm={12}>
                            <div className='tableFixHead'>
                                <Table bordered hover className='TableData ListData'>
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
                                                ApplicationList.map((SingleApplication: any, index: any) => {
                                                    // if (SingleApplication.status == "COMPLETED") {                                                    
                                                    return (
                                                        <tr key={index} style={{ backgroundColor: SingleApplication.slots != null && !SingleApplication.isAuthenticateThroughQr ? "#f5a99a" : "" }}>
                                                            <td>{index + 1}</td>
                                                            <td>{SingleApplication.applicationId}</td>
                                                            <td>{SingleApplication.documentNature.TRAN_DESC}</td>
                                                            <td>{SingleApplication.sroOffice}</td>
                                                            <td>{SingleApplication.date}</td>
                                                            <td>{SingleApplication.status}</td>
                                                            { 
                                                                !(SingleApplication?.documentNature?.TRAN_MAJ_CODE == '08' && SingleApplication?.documentNature?.TRAN_MIN_CODE == '06') &&
                                                                !(SingleApplication?.documentNature?.TRAN_MAJ_CODE == '01' && SingleApplication?.documentNature?.TRAN_MIN_CODE == '28') &&
                                                                !(SingleApplication?.documentNature?.TRAN_MAJ_CODE == '01' && SingleApplication?.documentNature?.TRAN_MIN_CODE == '29')
                                                                && (
                                                            <td >{SingleApplication.slots == null ?
                                                                <div className={`${styles.actionTitle} ${styles.actionbtn}`}
                                                                    onClick={() => OnClickOperation("edit", SingleApplication)}>
                                                                    <span style={{ cursor: "pointer" }}>
                                                                        <Image alt="Image" height={16} width={16} src='/PDE/images/slot-icon.svg' className={styles.tableactionImg} />
                                                                        <span className={`${styles.tooltiptext} ${styles.slotTooltip}`}>Slot Booking</span>
                                                                    </span>
                                                                </div>
                                                                : SingleApplication.slots != null  ?
                                                                    <div style={{ textAlign: "center" }}>
                                                                        <div className={`${styles.actionTitle} ${styles.actionbtn}`}
                                                                            onClick={() => OnClickOperation("reschedule", SingleApplication)}>
                                                                            <span style={{ cursor: "pointer" }}>
                                                                                <Image alt="Image" height={18} width={15} src='/PDE/images/reschedule.png' className={styles.tableactionImg} />
                                                                                <span className={`${styles.tooltiptext} ${styles.slotTooltip}`}>Reschedule</span>
                                                                            </span>
                                                                        </div>                                                                                                                                    
                                                                        {/* <div className={`${styles.actionTitle} ${styles.actionbtn}`}
                                                                            onClick={() => OnClickOperation("delete", SingleApplication)}>

                                                                            <span style={{ cursor: "pointer" }}>
                                                                                <Image alt="Image" height={22} width={18} src='/PDE/images/slotCancel.png' className={styles.tableactionImg} />
                                                                                <span className={`${styles.tooltiptext} ${styles.slotTooltip}`}>cancel the slot</span>
                                                                            </span>
                                                                        </div> */}
                                                                    </div>
                                                                    : null
                                                                    // <div style={{ textAlign: "center" }}>
                                                                    //     <div className={`${styles.actionTitle} ${styles.actionbtn}`}>
                                                                    //         {/* // onClick={() => OnClickOperation("edit", SingleApplication)}> */}
                                                                    //         <span style={{ cursor: "pointer" }}>
                                                                    //             <CheckBox onChange={() => onCheckedBox(SingleApplication.applicationId)} checked={SingleApplication.isAuthenticated ? true : false} name={"acceptTerms"} disabled={SingleApplication.isAuthenticated ? true : false} />
                                                                    //             <span className={`${styles.tooltiptext} ${styles.slotTooltip}`}>Please Authenticate Your Slot</span>
                                                                    //         </span>
                                                                    //     </div>
                                                                    // </div>
                                                            }

                                                            </td>
                                                                )
                                                            }
                                                        </tr>
                                                    )
                                                    // }
                                                })
                                            }
                                        </tbody> : null
                                    }
                                </Table>
                                {!ApplicationList.length && Loader.enable == false ?
                                    <Table striped bordered hover className='text-center'>
                                        <thead>
                                            <tr>
                                                <th>Not Found Slot Booking List</th>
                                            </tr>
                                        </thead>
                                    </Table> : null
                                }
                            </div>
                        </Col>
                    </Row>

                </div>
            </Container>
            {mBox && <Container>
                <div className={Popstyles.reportPopup}>
                    <div className={Popstyles.container}>
                        <div className={`${Popstyles.Messagebox} ${Popstyles.MessageboxCon} ${Popstyles.presenterCon}`}>
                            <div className={Popstyles.header}>

                                <div className={Popstyles.letHeader} >
                                    <p className={Popstyles.text}>Presenter</p>
                                </div>
                                <div>
                                    <ImCross onClick={() => { SetMBox(false), SetPresenrData({ ...presenrData, phone: "", aadhaar: "", name: "" }); }} className={Popstyles.crossButton} />
                                </div>
                            </div>

                            <div>
                                {/* <ImCross onClick={OnCancelAction} className={Popstyles.crossButton} /> */}
                            </div>

                            <div className={`${Popstyles.popupBox} ${Popstyles.popupCon} ${Popstyles.popupContainer}`}>
                                <div className={` ${Popstyles.popupBox} ${Popstyles.slotContainer} `}>                        
                                    <Row>
                                        <Col lg={12} md={12} xs={12}>
                                            {/* {PopupMemory.type ? */}
                                            <div className={`${Popstyles.SuccessImg} m-0`}>
                                                {/* <Image alt='' width={60} height={60} className={Popstyles.sImage} src="/PDE/images/success-icon.png" /> */}

                                                <div className={Popstyles.docText}>

                                                </div>
                                                {!otpVerify ? <div >
                                                    <div className={Popstyles.docText}>
                                                        Please Verify the Slot
                                                    </div>
                                                    <Row>
                                                        <Col lg={12} md={12} xs={12}>
                                                            <TableText label={"Select"} required={true} LeftSpace={false} />
                                                            {/* <TableDropdownSRO required={true} options={DistrictList} name={"sroDistrict"} value={SlotBookingDetails.sroDistrict} onChange={onChange} /> */}
                                                            <TableDropdown required={true} options={DropdownList.list} name={"otpType"} value={otpList.otpType} onChange={otpOnchange} />
                                                        </Col>
                                                    </Row>
                                                    {otpList.otpType && <><Row>
                                                        <Col lg={12} md={12} xs={12}>
                                                            <div className={Popstyles.presenterDetails}>
                                                                <TableText label={"Presenter Name"} required={false} LeftSpace={false} /><span>: {presenrData.name}</span>
                                                            </div>
                                                            {/* <TableDropdownSRO required={true} options={DistrictList} name={"sroDistrict"} value={SlotBookingDetails.sroDistrict} onChange={onChange} /> */}
                                                            {/* <TableInputText disabled={GetstartedDetails.sroDistrict != "" ? true : false} type='email' placeholder='' required={true} name={'sroDistrict'} value={SlotBookingDetails.sroDistrict} onChange={onChange} /> */}
                                                        </Col>
                                                    </Row>
                                                        <Row>
                                                            <Col lg={12} md={12} xs={12}>
                                                                <TableText label={otpList.otpType == "Mobile" ? 'Mobile Number' : "Aadhar Number"} required={true} LeftSpace={false} />
                                                                {/* <TableDropdownSRO required={true} options={DistrictList} name={"sroDistrict"} value={SlotBookingDetails.sroDistrict} onChange={onChange} /> */}
                                                                <TableInputText disabled={true} type='email' placeholder='' required={true} name={'Numer'} value={otpList.otpType == "Mobile" ? "XXX XXX " + String(presenrData.phone).substring(6, 10) : "XXXX XXXX " + String(presenrData.aadhaar).substring(8, 12)} onChange={otpOnchange} />
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col lg={12} md={12} xs={12} className='text-center mt-4'>
                                                                <button className={`m-0 ${Popstyles.yesBtn} ${Popstyles.subBtn}`} onClick={() => SendOTP()}>Send OTP</button>
                                                            </Col>
                                                        </Row>
                                                    </>}
                                                    {/* <button className={Popstyles.yesBtn} onClick={()=>onClickDocs('Y')}>YES</button>
                                                        <button className={Popstyles.noBtn} onClick={()=>onClickDocs('N')}>NO</button> */}
                                                </div>
                                                    : <>
                                                        <div className={Popstyles.docText}>
                                                            Verify the Slot
                                                        </div>
                                                        <Row>
                                                            <Col lg={12} md={12} xs={12}>
                                                                <TableText label={"OTP"} required={true} LeftSpace={false} />
                                                                {/* <TableDropdownSRO required={true} options={DistrictList} name={"sroDistrict"} value={SlotBookingDetails.sroDistrict} onChange={onChange} /> */}
                                                                <TableInputText disabled={false} type='number' maxLength={6} placeholder='' required={true} name={'otp'} value={otpList.otp} onChange={otpOnchange} />
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col lg={12} md={12} xs={12} className='text-center mt-4'>
                                                                <button className={`m-0 ${Popstyles.yesBtn} ${Popstyles.subBtn}`} onClick={() => verifyOTP()}>Verify</button>
                                                            </Col>
                                                        </Row>
                                                    </>
                                                }
                                            </div>
                                            {/* // <MdOutlineDoneOutline style={{ width: '50px', height: '50px', marginTop: '2rem', color: 'green', marginBottom: '1rem' }} /> */}
                                            {/* // <ImCross className={styles.crossIcon} />
                                            } */}
                                            <p className={Popstyles.message}></p>
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>}
            {/* {<pre>{JSON.stringify(ApplicationList, null, 2)}</pre>} */}
        </div>
    )
}
export default SlotBooking;

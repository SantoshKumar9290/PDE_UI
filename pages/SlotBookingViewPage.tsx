import React, { useState, useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap';
import styles from '../styles/pages/Mixins.module.scss';
import styles2 from '../styles/components/Table.module.scss';
import TableText from '../src/components/TableText';
import TableDropdownSRO from '../src/components/TableDropdownSRO';
import TableSelectDate from '../src/components/TableSelectDate';
import { SaveSlotBookingDetails } from '../src/redux/formSlice';
import Image from 'next/image';
import { useAppSelector, useAppDispatch } from '../src/redux/hooks';
import { useGetDistrictList, getSroDetails, UseCreateApplication, UseSlotBookingDetails, UseSlotBooking, getApplicationDetails, UseChangeStatus  } from '../src/axios';
import { CallingAxios, KeepLoggedIn, ShowMessagePopup, ShowPreviewPopup } from '../src/GenericFunctions'
import router, { useRouter } from 'next/router';
import { cursorTo } from 'readline';
import { PopupAction } from '../src/redux/commonSlice';
import TableInputText from '../src/components/TableInputText';
import Head from 'next/head';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import { addDays } from '../src/utils';

const SlotBookingViewPage = () => {
    const router = useRouter();
    const dispatch = useAppDispatch()
    const [active, setActive] = useState(false);
    const [slotpage, SetSlotpage] = useState(false);
    let intialDist: any = []
    let initialSlotBookingDetails: any = useAppSelector(state => state.form.SlotBookingDetails)
    let [SlotBookingDetails, setSlotBookigDetails] = useState<any>(initialSlotBookingDetails);
    let [DistrictList, setDistrictList] = useState(intialDist);
    let LoginDetails = useAppSelector(state => state.login.loginDetails);
    const [SelectedDistrict, setSelectedDistrict] = useState({ id: '', name: '' });
    const [SelectedSRO, setSelectedSRO] = useState({ id: '', name: '' });
    const [SROOfficeList, setSROOfficeList] = useState([]);
    const [slots, setSlots]: any = useState({});
    const [showslots, setShowslots] = useState(false)
    let initialGetstartedDetails = useAppSelector(state => state.form.GetstartedDetails);
    const [GetstartedDetails, setGetstartedDetails] = useState(initialGetstartedDetails);
    let slotObj: any = {};

    const [startDate, setStartDate] = useState();
    const today = moment();
    const maxDate = moment(today).add(15, 'days').toDate();

    const isWeekday = (date) => {
        const day = date.getDay();
        return day !== 0 && !(day === 6 && date.getDate() > 7 && date.getDate() < 15);
    };

    const renderDayContents = (day, date) => {
        if (!isWeekday(date)) {
            return <span className="text-muted">{day}</span>;
        }
        return day;
    };


    let Morningslots: any = [
        { key: 1, value: "10:30-10:40" }, { key: 2, value: "10:40-10:50" }, { key: 3, value: "10:50-11:00" },
        { key: 4, value: "11:00-11:10" }, { key: 5, value: "11:10-11:20" }, { key: 6, value: "11:20-11:30" }, { key: 7, value: "11:30-11:40" }, { key: 8, value: "11:40-11:50" }, { key: 9, value: "11:50-12:00" }
    ];
    let Afternoonslots: any = [
        { key: 1, value: "12:00-12:10", checked: true }, { key: 2, value: "12:10-12:20", checked: true }, { key: 3, value: "12:20-12:30", checked: true }, { key: 4, value: "12:30-12:40", checked: true }, { key: 5, value: "12:40-12:50", checked: true }, { key: 6, value: "12:50-13:00", checked: false },
        { key: 7, value: "13:00-13:10", checked: true }, { key: 8, value: "13:10-13:20", checked: true }, { key: 9, value: "13:20-13:30", checked: true }, { key: 10, value: "13:30-13:40", checked: true }, { key: 11, value: "13:40-13:50", checked: true }, { key: 12, value: "13:50-14:00", checked: false },
        { key: 13, value: "14:00-14:10", checked: true }, { key: 14, value: "14:10-14:20", checked: true }, { key: 15, value: "14:20-14:30", checked: true }, { key: 16, value: "14:30-14:40", checked: true }, { key: 17, value: "14:40-14:50", checked: true }, { key: 18, value: "14:50-15:00", checked: false }
    ]

    useEffect(() => {
        if (KeepLoggedIn()) {
            let data: any = localStorage.getItem("GetApplicationDetails");
            if (data == "" || data == undefined) {
                ShowMessagePopup(false, "Invalid Access", "/");
            }
            else {
                data = JSON.parse(data);
                if (data.district) {
                    data.sroDistrict = data.district;
                    setGetstartedDetails(data);
                } else {
                    setGetstartedDetails(data);
                }

                if (!DistrictList.length) {
                    if (data.district) {
                        GetDistrictListCall(data.district)
                    } else {
                        GetDistrictListCall(data.sroDistrict);
                    }
                }
            }
        } else { ShowMessagePopup(false, "Invalid Access", "/") }

    }, []);

    const GetDistrictListCall = async (data) => {
        let result: any = await CallingAxios(useGetDistrictList());
        if (result.status) {
            setDistrictList(result.data);
            let selected: any = result.data.find((e: any) => e.name == data);
            if (selected && selected.id) {
                GetSROOfficeList(selected.id);
            }
        }
        else {
            ShowMessagePopup(false, "District List fetch Faild", "")
        }
    }

    const [mrngList, setMorningList] = useState(Morningslots);
    const [aftList, setNoonList] = useState(Afternoonslots);
    const showSlots = async () => {

        if (SlotBookingDetails.dateForSlot == "" || String(SlotBookingDetails.dateForSlot) == "Invalid Date") {
            // alert("Please give the slotDate");
            return ShowMessagePopup(false, "Please select the date for Slot Booking", "")
        } else {
            setShowslots(true);
            SlotBookingDetails.sroDistrict = GetstartedDetails.sroDistrict;
            SlotBookingDetails.sroOffice = GetstartedDetails.sroOffice;
            SlotBookingDetails.sroOfcNum = GetstartedDetails.sroCode;
            // let sroNum: any = SROOfficeList.find(s => s.name == SlotBookingDetails.sroOffice);
            let Obj: any = { "sroOfcNum": GetstartedDetails.sroCode, "dateForSlot": SlotBookingDetails.dateForSlot, slots: [] };
            SlotBookingDetails.sroOfcNum = GetstartedDetails.sroCode;
            SlotBookingDetails.slots = [];
            await CreateAppointment(Obj);
            SetSlotpage(!slotpage);
        }
        // SetSlotpage(!slotpage)
    }

    // const handleClick = (event: any) => {
    //     setActive(!active);
    // };
    const CreateAppointment = async (Obj: any) => {
        let setSlotDetails: any = await CallingAxios(UseSlotBookingDetails(Obj));
        if (setSlotDetails.status) {
            for (let i in mrngList) {
                mrngList[i].backgroundColor = "#65a765"; //green
                mrngList[i].rdBtnValue = false;
                mrngList[i].disabled = false;
                mrngList[i].cursor = "pointer";
                for (let j in setSlotDetails.data) {
                    for (let k in setSlotDetails.data[j].slots) {
                        if (mrngList[i].value === setSlotDetails.data[j].slots[k].slotTime) {
                            mrngList[i].backgroundColor = "#FF0000";
                            mrngList[i].rdBtnValue = true;
                            mrngList[i].disabled = true;
                            mrngList[i].selected = false;
                            mrngList[i].cursor = "not-allowed";
                        }
                    }
                }
            }
            for (let i in aftList) {
                aftList[i].backgroundColor = "#65a765"; //green
                aftList[i].rdBtnValue = false;
                aftList[i].disabled = false;
                aftList[i].cursor = "pointer";
                for (let j in setSlotDetails.data) {
                    for (let k in setSlotDetails.data[j].slots) {
                        if (aftList[i].value === setSlotDetails.data[j].slots[k].slotTime) {
                            aftList[i].backgroundColor = "#FF0000";
                            aftList[i].rdBtnValue = true;
                            aftList[i].disabled = true;
                            aftList[i].selected = false;
                            aftList[i].cursor = "not-allowed";
                        }
                    }
                }
            }
            setMorningList(mrngList);
            setNoonList(aftList);
        }
    }
    const GetSROOfficeList = async (id: any) => {
        let result = await CallingAxios(getSroDetails(id));
        if (result.status) { setSROOfficeList(result.data); }
    }

    const onChange = async (e: any) => {
        let fieldName = e.target.name;
        let value = e.target.value;
        // if (fieldName == "sroDistrict") {
        //     setSROOfficeList([]);
        //     let selected = DistrictList.find((e:any) => e.name == value);
        //     await GetSROOfficeList(selected.id);
        // }
        if (fieldName == "dateForSlot") {
            if (SlotBookingDetails?.slotTime != "") {
                SlotBookingDetails.slotTime = "";
            }
            // window.alert(SlotBookingDetails.dateForSlot);
            setMorningList(Morningslots);
            setNoonList(Afternoonslots)
            setShowslots(false);
            value = new Date(value);
        }
        setSlotBookigDetails({ ...SlotBookingDetails, [fieldName]: value });
    }

    // const changeFormator =(date:any) => {
    //     let DateArray = date.split('T')[1];
    //     DateArray = DateArray.split(':')[0];
    //     if(DateArray == "18"){

    //     }
    //     return date;
    // }

    const onChangeDate = async (date: any) => {
        const d = new Date(date);
        let dateStr =
            date.getFullYear() + "-" +
            ("00" + (date.getMonth() + 1)).slice(-2) + "-" +
            ("00" + date.getDate()).slice(-2) + "T00:00:00.000Z"
        // let Date = changeFormator(date);
        setStartDate(date);
        if (SlotBookingDetails?.slotTime != "") {
            SlotBookingDetails.slotTime = "";
        }
        setMorningList(Morningslots);
        setNoonList(Afternoonslots)
        setShowslots(false);
        setSlotBookigDetails({ ...SlotBookingDetails, dateForSlot: dateStr });
    }

    const onSubmit = async (e: any) => {
        if (SlotBookingDetails.slotTime == null || SlotBookingDetails.slotTime == undefined || SlotBookingDetails.slotTime == "") {
            ShowMessagePopup(false, "Please select the time for Slot", "")
        } else {
            e.preventDefault();
            let result: any = await CallingAxios(UseSlotBooking(SlotBookingDetails));
            dispatch(SaveSlotBookingDetails(result?.data));
            OnSlotBooked();
            // ShowMessagePopup(true, "Slot Booked Successfully", "/ServicesPage");
        }

    }

    const OnSlotBooked = async () => {
        let data = {
            "applicationId": GetstartedDetails.applicationId,
            status: "SLOT BOOKED",
        }

        let result = await CallingAxios(UseChangeStatus(data));
        let slotDate = new Date(SlotBookingDetails.dateForSlot)
        let dd = slotDate.getDate();
        let month = slotDate.getMonth() + 1
        let display = month.toString().padStart(2, '0')
        let year = slotDate.getFullYear();
        let slDate = dd + '/' + display + '/' + year;
        if (result.status) {
            ShowMessagePopup(true, "Slot booked successfully on " + slDate + ',' + SlotBookingDetails.slotTime
                , "/ServicesPage");
        }

        else {
            dispatch(PopupAction({ enable: true, type: false, message: result.message.error, redirectOnSuccess: "" }));
        }

    }
    const handleChange = async (e: any) => {
        if (e.target.children.length) {


            e.target.children[0].checked = true;
            if (e.target.children[0].value != null) {
                SlotBookingDetails.slotTime = e.target.children[0].value
            } else {
                SlotBookingDetails.slotTime = e.target.value;
            }
        }
        else {
            SlotBookingDetails.slotTime = e.target.value;
        }
        SlotBookingDetails.applicationId = GetstartedDetails.applicationId;

        // SlotBookingDetails.slots.push(Obj);
    }

    const redirectToPage = (location: string) => {
        router.push({
            pathname: location,
        })
    }



    return (
        <div className='PageSpacing'>
            <Head>
                <title>Slot Booking - Public Data Entry</title>
            </Head>
            <Container>
                <Row>
                    <Col lg={12} md={12} xs={12}>
                        <div className='tabContainerInfo'>
                            <Container>
                                <Row>
                                    <Col lg={10} md={12} xs={12}>
                                        <div className='tabContainer'>
                                            <div className='activeTabButton'>Get Started<div></div></div>
                                            <div className='activeTabButton'>Parties Details<div></div></div>
                                            <div className='activeTabButton'>Property Details<div></div></div>
                                            <div className='activeTabButton' >Slot Booking<div></div></div>
                                        </div>
                                    </Col>
                                    <Col lg={2} md={2} sm={12}>
                                       <div className='text-end previewCon'><button className='PreBtn proceedButton mb-1' onClick={() => ShowPreviewPopup()} >Preview Document</button></div>
                                    </Col>
                                </Row>
                            </Container>
                        </div>

                        <div className={styles.representativeDetailxsain} style={{ marginTop: "10px" }}>
                            <Row className="mb-0 mt-3">
                                <Col lg={6} md={6} xs={12}>
                                    <div className='ContainerColumn TitleColmn' style={{ cursor: "pointer" }} onClick={() => { redirectToPage("/SlotBookingPage") }}>
                                        <h4 className='TitleText'><Image alt="Image" height={15} width={12} src='/PDE/images/arrow-img.png' className={styles.tableImg} /> Slot Booking<small>[స్లాట్ బుకింగ్]</small></h4>
                                    </div>
                                </Col>
                                <Col lg={6} md={6} xs={12} className='text-end'>
                                    <div className='ContainerColumn TitleColmn'>
                                        <h4 className='TitleText' style={{ textAlign: 'right' }}>Application ID: {GetstartedDetails.applicationId} </h4>
                                    </div>

                                </Col>
                            </Row>

                            <div className={styles.ExecutantDetailsInfo}>
                                <div className={styles.DetailsHeaderContainer}>
                                    <Row>
                                        <Col lg={6} md={6} xs={12}>
                                            <div className={styles.ContainerColumn}>
                                                <p className={styles.HeaderText}>Slots Booking Details [స్లాట్ బుకింగ్ వివరాలు]</p>
                                            </div>
                                        </Col>
                                        <Col lg={6} md={6} xs={12}>
                                        </Col>
                                    </Row>
                                </div>

                                {/* <form onSubmit={onSubmit} className={styles.AddExecutantInfo}> */}
                                <div className={styles.AddExecutantInfo}>
                                    <Row className="mb-3">
                                        <Col lg={4} md={6} xs={12}>
                                            <TableText label={"District Registrar Office [జిల్లా రిజిస్ట్రార్ కార్యాలయం]"} required={true} LeftSpace={false} />
                                            {/* <TableDropdownSRO required={true} options={DistrictList} name={"sroDistrict"} value={SlotBookingDetails.sroDistrict} onChange={onChange} /> */}
                                            <TableInputText disabled={GetstartedDetails.sroDistrict != "" ? true : false} type='email' placeholder='' required={true} name={'sroDistrict'} value={GetstartedDetails.sroDistrict} onChange={onChange} />
                                        </Col>
                                        <Col lg={4} md={6} xs={12}>
                                            <TableText label={"Sub Registrar Office [సబ్ రిజిస్ట్రార్ కార్యాలయం]"} required={true} LeftSpace={false} />
                                            {/* <TableDropdownSRO required={true} options={SROOfficeList} name={"sroOffice"} value={SlotBookingDetails.sroOffice} onChange={onChange} /> */}
                                            <TableInputText disabled={GetstartedDetails.sroOffice != "" ? true : false} type='email' placeholder='' required={true} name={'sroOffice'} value={GetstartedDetails.sroOffice} onChange={onChange} />
                                        </Col>
                                        {SlotBookingDetails?.dateForSlot !== undefined ?
                                            <Col lg={4} md={6} xs={12}>
                                                <TableText label={"Date [తేదీ]"} required={true} LeftSpace={false} />
                                                {/* <TableSelectDate min={(moment(moment().toDate()).add(1, 'd')).format("YYYY-MM-DD")} placeholder='Select Date' required={true} name={"dateForSlot"} onChange={onChange} /> */}
                                                <div className={`${styles2.InputDate} ${styles2.InputDate2}`}>
                                                    <DatePicker
                                                        className={`${styles2.columnDateInputBox} ${styles2.columnDatepicker}`}
                                                        selected={startDate}
                                                        onChange={(date) => { onChangeDate(date) }}
                                                        minDate={addDays(1)}
                                                        maxDate={maxDate}
                                                        filterDate={isWeekday}
                                                        renderDayContents={renderDayContents}
                                                        dateFormat="dd-MM-yyyy"
                                                        onKeyDown={(e) => { e.preventDefault(); }}
                                                        customInput={<input style={{}} />}
                                                        placeholderText="DD-MM-YYYY"
                                                    />
                                                </div>
                                            </Col> : null}
                                    </Row>

                                    <Row>
                                        <Col lg={12} md={12} xs={12}>
                                            <div className={styles.SlotContainer}>
                                                <div className='mb-3'>
                                                    {SlotBookingDetails?.dateForSlot !== "" &&
                                                        <button
                                                            onClick={showSlots}
                                                            className='proceedButton'>Show Slots</button>}
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>

                                    {SlotBookingDetails?.sroOffice != "" && showslots === true && (
                                        <div className={styles.SlotInfo}>
                                            <Row>
                                                <Col lg={2} md={12} xs={12}></Col>
                                                <Col lg={8} md={12} xs={12} className=''>
                                                    <div className="mb-5">
                                                        <p className={styles.SlotText}>Morning Slots</p>
                                                        <Row className="mb-3">
                                                            {mrngList.map((subItems: any, i: any) => {
                                                                return (
                                                                    <Col lg={2} md={2} xs={2} key={subItems.key} className='p-0'>
                                                                        <div className={styles.SlotRadiobtn} style={{ backgroundColor: subItems.backgroundColor, cursor: subItems.cursor }} onClick={(e) => subItems.cursor !== 'not-allowed' && handleChange(e)}><input type="radio" disabled={subItems.disabled} value={subItems.value} defaultChecked={subItems.rdBtnValue} name={"slotTime"} onChange={handleChange} /> {subItems.value} </div>
                                                                    </Col>
                                                                )
                                                            })}
                                                        </Row>
                                                    </div>
                                                    <div className="">
                                                        <p className={styles.SlotText}>Afternoon Slots</p>
                                                        {/* {Afternoonslots.map((items:any) => {
                                                    return ( */}
                                                        <Row className="mb-3">
                                                            {aftList.map((subItems: any, i: any) => {
                                                                return (
                                                                    <Col lg={2} md={2} xs={2} key={subItems.key} className='p-0'>
                                                                        <div className={styles.SlotRadiobtn} style={{ backgroundColor: subItems.backgroundColor, cursor: subItems.cursor }} onClick={(e) => subItems.cursor !== 'not-allowed' && handleChange(e)} ><input type="radio" disabled={subItems.disabled} value={subItems.value} defaultChecked={subItems.rdBtnValue} name={"slotTime"} /> {subItems.value} </div>
                                                                    </Col>
                                                                )
                                                            })}
                                                        </Row>
                                                        {/* );
                                                })} */}

                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col lg={12} md={12} xs={12}>
                                                    <div className={styles.SlotContainer}>
                                                        <div>
                                                            <p className={styles.SlotTextColor} style={{ color: "red" }}>1. Red Color Indicates Slots Not Available <span className={styles.Line}>|</span>
                                                                <span> 2. Green Color Indicates Slots are Available</span></p>
                                                        </div>
                                                        <button className='proceedButton' onClick={onSubmit}>Submit</button>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>
                                    )}
                                </div>
                                {/* </form> */}
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
            {/* <pre>{JSON.stringify(GetstartedDetails, null, 2)}</pre> */}
            {/* <pre>{JSON.stringify(SlotBookingDetails, null, 2)}</pre> */}
        </div>
    )
}

export default SlotBookingViewPage;
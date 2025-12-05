import React, { useState, useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import styles from '../../styles/pages/Mixins.module.scss';
import TableDrpDown from '../../src/components/TableDrpDown';
import { useRouter } from 'next/router';
import { useAppSelector, useAppDispatch } from '../../src/redux/hooks';
import { getSroDetails, useGetDistrictList, useGetMandalList, useGetVillagelList, UseGetLocationDetails, UseDutyCalculator, Mvadata, mvAssitanceReport } from '../../src/axios';
import { SavePropertyDetails } from '../../src/redux/formSlice';
import { CallingAxios, KeepLoggedIn, MasterCodeIdentifier, ShowMessagePopup } from '../../src/GenericFunctions';
import Head from 'next/head';
import regType from '../../src/regTypes';
import TableText from '../../src/components/TableText';
import TableInputText from '../../src/components/TableInputText';


const DropdownList = {
    LocalBodyTypesList: ['MUNICIPAL CORPORATION [మున్సిపల్ కార్పొరేషన్]', 'SPL./SELECTION GRADE MUNICIPALITY [స్పెషల్ సెలక్షన్ గ్రేడ్ మున్సిపాలిటీ]', 'OTHER MUNICIPALITY/NOTIFIED AREA [ఇతర మునిసిపాలిటీ / నోటిఫైడ్ ఏరియా]', 'MINOR GRAM PANCHAYAT [మైనర్ గ్రామ పంచాయతీ]',
        'MAJOR GRAM PANCHAYAT [మేజర్ గ్రామ పంచాయితీ]', 'Cantonment Board [కంటోన్మెంట్ బోర్డు]', 'GRADE/OTHER MUNICIPALITY UNDER UA [అర్బన్ అగ్లామరేషన్ లోని గ్రేడ్ 1 మున్సిపాలిటీ మరియు ఇతర మున్సిపాలిటీ]', 'MAJOR GRAM PANCHAYATH UNDER UA [అర్బన్ అగ్లామరేషన్ లోని మేజర్ గ్రామ పంచాయతీ]'],
    Typeofproperty: ['RURAL(AGRICULTURE) [గ్రామీణ (వ్యవసాయ భూమి)]', 'URBAN(PLOTS/HOUSE/FLATS..ETC) [పట్టణ (స్థలము/అపార్ట్ మెంట్/ఇల్లు)]'],
    LandUseList: []
}


const PropertyDetailsPage = () => {
    const router = useRouter();
    const dispatch = useAppDispatch()
    const [checked, setChecked] = useState(false);
    let initialPropertyDetails = useAppSelector(state => state.form.PropertyDetails);
    let GetstartedDetails = useAppSelector(state => state.form.GetstartedDetails);
    const [PropertyDetails, setPropertyDetails] = useState<any>(initialPropertyDetails);
    const [DistrictList, setDistrictList] = useState([]);
    const [VillageList, setVillageList] = useState([]);
    const [MandalList, setMandalList] = useState([]);
    const [SROOfficeList, setSROOfficeList] = useState([]);
    const [distCode, setDistCode] = useState<any>("");
    const [registrationTypeList, setregistrationTypeList] = useState<any>([])
    const [DocumentNatureList, setDocumentNatureList] = useState([]);
    const [maxDate, setMaxDate] = useState(Date);
    let LoginDetails: any = useAppSelector(state => state.login.loginDetails);


    useEffect(() => {
        if (KeepLoggedIn()) {
            GetReportsdata();
        } else { ShowMessagePopup(false, "Invalid Access", "/") }
    }, []);

    const GetReportsdata = async () => {
        let data: any = JSON.parse(localStorage.getItem("LoginDetails"));
        if (data == "" || data == undefined) {
            ShowMessagePopup(false, "Invalid Access", "/");
        }
        else {
            localStorage.setItem("Property", "");
            GetDistrictList()
        }
    }


    useEffect(() => {
        let NewData = [];
        let data: any = regType.WithoutDoc.filter(x => x.TRAN_MIN_CODE == "00")
        data.map(x => NewData.push(x.TRAN_DESC))
        setregistrationTypeList(NewData);
    }, [])

    const CallGetDistrictDetails = async (data: any) => {
        let result = await UseGetLocationDetails(String(data.sroCode));

        if (result.data) {
            setMandalList(result.data);
            setPropertyDetails({ ...PropertyDetails, sroOffice: data.SR_NAME, sroCode: String(data.sroCode), distCode: result.data[0].distCode, district: result.data[0].distName, village: data?.VILLAGE_NAME, villageCode: data?.VILLAGE_CODE })
        }
    }

    const GetDistrictList = async () => {
        let result = await CallingAxios(useGetDistrictList());
        if (result.status) {
            let sortedResult = result.data.sort((a, b) => a.name < b.name ? -1 : 1)
            setDistrictList(result.data ? sortedResult : []);
            if (PropertyDetails.district != "" && PropertyDetails.sroOffice != "") {
                let selected = result.data.find(e => e.name == PropertyDetails.district);
                if (selected && selected.id) {
                    GetSROOfficeList(selected.id);
                }
            }
        }
        else {
            ShowMessagePopup(false, result.message, "")
        }
    }


    const GetMandalList = async (id: any) => {
        let result = await CallingAxios(useGetMandalList(id));
        if (result.status) {
            let sortedResult = result.data.sort((a, b) => a.name < b.name ? -1 : 1)

            setMandalList(sortedResult);
        }
        else {
            ShowMessagePopup(false, result.message, "")
        }
    }
    const GetVillageList = async (id: any, distcode: any) => {
        let result = await CallingAxios(useGetVillagelList(id, distcode));
        if (result.status) {
            let sortedResult = result.data.sort((a, b) => a.name < b.name ? -1 : 1)
            setVillageList(sortedResult);
        }
        else {
            ShowMessagePopup(false, result.message, "")
        }
    }

    const GetSROOfficeList = async (id: any) => {
        let result = await CallingAxios(getSroDetails(id));
        if (result.status) {
            let sortedResult = result.data.sort((a, b) => a.name < b.name ? -1 : 1)
            // setSROOfficeList(result.data);
            setSROOfficeList(sortedResult);
        }
    }

    const blockInvalidChar = e => {
        ['_', '+', '-', '.'].includes(e.key) && e.preventDefault();
    }

    const onChange = (event: any) => {
        let TempDetails = { ...PropertyDetails };
        let addName = event.target.name;
        let addValue = event.target.value;
        if (addName == "registrationType") {
            TempDetails = { ...TempDetails, documentNature: {} }
            if (addValue == '') { return; }
            addValue = regType.WithoutDoc.find(x => x.TRAN_DESC == addValue);
            let NewData = [];
            let data = addValue != null ? regType.WithoutDoc.filter(x => x.TRAN_MAJ_CODE === addValue.TRAN_MAJ_CODE && !["00", "28", "29"].includes(x.TRAN_MIN_CODE)) : [];

            data.map(x => NewData.push(x.TRAN_DESC))
            setDocumentNatureList(NewData);
        }
        else if (addName == "documentNature") {
            if (addValue == '') { return; }
            if (addValue !== "") {
                addValue = regType.WithoutDoc.find(x => x.TRAN_DESC == addValue);
            }
        }
        else if (addName == "district") {
            // setSROOfficeList([]);
            setMandalList([]);
            setVillageList([]);
            setSROOfficeList([]);
            let selected = DistrictList.find(e => e.name == addValue);
            // console.log(selected);
            setDistCode(selected.id);
            if (selected)
                GetMandalList(selected.id);
            //GetSROOfficeList(selected.id);
        } else if (addName == "mandal") {
            setVillageList([]);
            let selected = MandalList.find(e => e.name == addValue);
            let mandalCode = selected ? selected.id : "";
            TempDetails = { ...TempDetails, mandalCode }
            if (selected)
                GetVillageList(selected.id, distCode);
        } else if (addName == "village") {
            setSROOfficeList([]);
            let selected = VillageList.find(e => e.name == addValue);
            let villageCode = selected ? selected.id : "";
            TempDetails = { ...TempDetails, villageCode }
            if (selected)
                GetSROOfficeList(selected.id);
        }
        else if (addName == "stampPaperValue") {
            if (addValue.length > 4) {
                addValue = PropertyDetails.stampPaperValue;
            }
        }
        else if (addName == "localBodyName") {
            let errorLabel = ""
            if (String(addValue).length < 50) {
                errorLabel = "Enter 50 Digits Number";
            }
            if (addValue.length > 50) {
                addValue = addValue.substring(0, 50);
            }
        }
        else if (addName == 'propertyType') { LandUseDesider(addValue); }
        else if (addName == "sroOffice") {
            let sroCode = (SROOfficeList.find(x => x.name == addValue)).id;
            TempDetails = { ...TempDetails, sroCode }
        }
        else if (addName == 'localBodyName') {
            addValue = addValue.replace(/[^\w\s]/gi, "");
            addValue = addValue.replace(/[0-9]/gi, "");
        }
        else if (addName == "landUse") {
            let landCode = MasterCodeIdentifier("landUse", addValue);
            TempDetails = { ...TempDetails, landUseCode: Number(landCode) }
        }
        else if (addName == "stampPurchaseDate") {
            if (PropertyDetails.executionDate == null || PropertyDetails.executionDate == '' || PropertyDetails.executionDate == undefined) {
                ShowMessagePopup(false, "Kindly Select Execution Date Before Selecting Stamp Purchase Date ", "");
                addValue = ''
                return false;
            }
        }
        else if (addName == "executionDate") {
            var date = new Date(addValue);
            var dd = String(date.getDate()).padStart(2, '0');
            var mm = String(date.getMonth() + 1).padStart(2, '0');
            var yyyy = date.getFullYear();
            var hours = String(new Date().getUTCHours() + 1).padStart(2, '0');
            var minutes = String(new Date().getUTCMinutes() + 1).padStart(2, '0');
            var sec = String(new Date().getUTCSeconds() + 1).padStart(2, '0');

            setMaxDate(mm + '/' + dd + '/' + yyyy);
            if (addName == "executionDate" && PropertyDetails.stampPurchaseDate !== "") {
                TempDetails.stampPurchaseDate = ''
                var date = new Date(addValue);
                var dd = String(date.getDate()).padStart(2, '0');
                var mm = String(date.getMonth() + 1).padStart(2, '0');
                var yyyy = date.getFullYear();
                setMaxDate(mm + '/' + dd + '/' + yyyy)
            }
        }
        else if (addName == "amount") {
            if (addValue <= 0) {
                addValue = "";
            }
        }
        setPropertyDetails({ ...TempDetails, [addName]: addValue });
    }

    const onSubmit = (e: any) => {
        e.preventDefault();
        dispatch(SavePropertyDetails(PropertyDetails));
        localStorage.setItem("Property", JSON.stringify(PropertyDetails));

        if (!isAvailable) {
            let data = {
                "tmaj_code": PropertyDetails.registrationType.TRAN_MAJ_CODE,
                "tmin_code": PropertyDetails.documentNature.TRAN_MIN_CODE,
                "sroNumber": PropertyDetails.sroCode,
                "local_body": 3,
                "flat_nonflat": "N",
                "marketValue": PropertyDetails.marketValue,
                "finalTaxbleValue": PropertyDetails.amount,
                "con_value": PropertyDetails.amount,
                "adv_amount": 0
            }
            console.log(data, 'ppppppp');

            DutyFeeCalculator(data);
        }
        else {
            if (PropertyDetails.propertyType == "RURAL(AGRICULTURE) [గ్రామీణ (వ్యవసాయ భూమి)]" || PropertyDetails.propertyType == "Rural(Agriculture) [గ్రామీణ (వ్యవసాయ భూమి)]") {
                redirectToPage('/MVassistance/Property_R_Page');
            } else {
                redirectToPage('/MVassistance/Property_U_Page');
            }
        }
    }

    const [marketvaluecal, setMarketvaluecal] = useState([])
    const [CalculatedDutyFee, setCalculatedDutyFee] = useState({ TRAN_MAJ_CODE: "", TRAN_MIN_CODE: "", sroCode: "", amount: "", rf_p: "0", td_p: "0", sd_p: "0", marketValue: "0" })

    const DutyFeeCalculator = async (data) => {
        let result = await UseDutyCalculator(data);
        if (result.status) {
            setCalculatedDutyFee({ ...CalculatedDutyFee, TRAN_MAJ_CODE: PropertyDetails.registrationType.TRAN_MAJ_CODE, TRAN_MIN_CODE: PropertyDetails.documentNature.TRAN_MIN_CODE, sroCode: PropertyDetails.sroCode, amount: PropertyDetails.amount, sd_p: result.data.sd_p, td_p: result.data.td_p, rf_p: result.data.rf_p });
            handleShow()
        }
    }

    const LandUseDesider = (key: any) => {
        switch (key) {
            case 'RURAL(AGRICULTURE) [గ్రామీణ (వ్యవసాయ భూమి)]': DropdownList.LandUseList = ["DRY LAND(A) [మెట్ట భూమి(A)]", "WET LAND DOUBLE CROP(A)[తడి భూమి రెట్టింపు క్రాప్ (ఎ)]", "GARDEN(A) [తోటలు(A)]", "AGRICULTURAL LAND FIT FOR H.S.(A) [నివేశ స్తలములకు తగినటువంటి వ్యవసాయ భూమి(A)]", "LAND ABUTTING NH/SH/ZPP/MPP(A) [NH / SH / ZPP / MPP ని కలిగి ఉన్న భూమి(A)"]; break;
            case 'URBAN(PLOTS/HOUSE/FLATS..ETC) [పట్టణ (స్థలము/అపార్ట్ మెంట్/ఇల్లు)]': DropdownList.LandUseList = ["RESIDENTIAL (R) [నివాసయోగ్యము(R)]", "COMMERCIAL(R) [వాణిజ్యము(R)]", "NOTIFIED SLUM(R) [ప్రకటిత మురికివాడ(R)]", "INDUSTRIAL (URBAN)(R) [పారిశ్రామిక సంబంధము(R)]", "URBAN VACANT LAND(RESIDENTIAL)(R) [పట్టణ ఖాళీ స్తలము(నివాసం (R )]", "URBAN VACANT LAND(COMMERCIAL)(R) [పట్టణ ఖాళీ స్తలము(వ్యాపారపరమైన )(R)]"]; break;
            default:
                break;
        }
    }
    const redirectToPage = (location: string) => {
        router.push({
            pathname: location,
        })
    }

    const [isAvailable, setIsAvailable] = useState(false);

    const handleAvailabilityChange = (e) => {
        setIsAvailable(!isAvailable);
    };
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    console.log(isAvailable, 'isavailabel');

    return (
        <div className='PageSpacing'>
            <Head>
                <title>Property Details - Public Data Entry</title>
            </Head>
            <Container>
                <div className='tabContainerInfo'>
                    <Container>
                        <Row>
                            <Col lg={12} md={12} xs={12} className='p-0'>
                                <div className='tabContainer DutyfeeContainer py-2'>
                                    <div className='activeTabButton'>Stamp Duty(₹) : {CalculatedDutyFee.sd_p ? CalculatedDutyFee.sd_p : 0}<div></div></div>
                                    <div className='activeTabButton'>Transfer Duty(₹) : {CalculatedDutyFee.td_p ? CalculatedDutyFee.td_p : 0}<div></div></div>
                                    <div className='activeTabButton'>Registration fee(₹) : {CalculatedDutyFee.rf_p ? CalculatedDutyFee.rf_p : 0}<div></div></div>
                                    {GetstartedDetails?.documentNature && GetstartedDetails?.documentNature?.TRAN_MAJ_CODE === "08" && GetstartedDetails?.documentNature?.TRAN_MIN_CODE === "06" ?
                                    <div className='activeTabButton'>User Charges(₹) : 0<div></div></div>:
                                    <div className='activeTabButton'>User Charges(₹) : 500<div></div></div>
                                    }
                                    {/* <div className='activeTabButton'>User Charges(₹) : 500<div></div></div> */}
                                    <div className='activeTabButton'>Market Value(₹)  : {marketvaluecal.length > 0 ? marketvaluecal[0].marketValue : 0}<div></div></div>
                                    <div className='activeTabButton'>Consideration Value(₹) : {PropertyDetails.amount ? PropertyDetails.amount : "0"}<div></div></div>
                                    {GetstartedDetails?.documentNature && GetstartedDetails?.documentNature?.TRAN_MAJ_CODE === "08" && GetstartedDetails?.documentNature?.TRAN_MIN_CODE === "06" ?
                                    <div className='activeTabButton'>Total Payable(₹) : {Number(CalculatedDutyFee.sd_p) + Number(CalculatedDutyFee.td_p) + Number(CalculatedDutyFee.rf_p) + 0}</div>:
                                    <div className='activeTabButton'>Total Payable(₹) : {Number(CalculatedDutyFee.sd_p) + Number(CalculatedDutyFee.td_p) + Number(CalculatedDutyFee.rf_p) + 500}</div>
                                    }
                                    {/* <div className='activeTabButton'>Total Payable(₹) : {Number(CalculatedDutyFee.sd_p) + Number(CalculatedDutyFee.td_p) + Number(CalculatedDutyFee.rf_p) + 500}</div> */}
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>

                {show && <Modal className='text-center ' show={show} onHide={handleClose}>
                    <Modal.Header closeButton className=' modalheadbg '  >
                        <Modal.Title className='ms-5 ps-5 text-center text-white '>Duty Fees Information</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className=''>
                        <Container>
                            <Row className='fw-2'>
                                <Col lg={12} md={12} xs={12} className=''>
                                    <div className=' '>

                                        <Row>
                                            <Col lg={6} md={6} xs={6} ><p className='popuptext'>Stamp Duty(₹)</p></Col>
                                            <Col lg={2} md={2} xs={2}><p>:</p></Col>
                                            <Col lg={4} md={4} xs={4}><strong className='font-weight-bold'>{CalculatedDutyFee.sd_p ? CalculatedDutyFee.sd_p : 0}</strong></Col>
                                        </Row>
                                        <Row>
                                            <Col lg={6} md={6} xs={6} ><p className='popuptext'>Transfer Duty(₹)</p></Col>
                                            <Col lg={2} md={2} xs={2}><p>:</p></Col>
                                            <Col lg={4} md={4} xs={4}><strong className='font-weight-bold'>{CalculatedDutyFee.td_p ? CalculatedDutyFee.td_p : 0}</strong></Col>
                                        </Row>
                                        <Row>
                                            <Col lg={6} md={6} xs={6} ><p className='popuptext'>Registration fee(₹)</p></Col>
                                            <Col lg={2} md={2} xs={2}><p>:</p></Col>
                                            <Col lg={4} md={4} xs={4}><strong> {CalculatedDutyFee.rf_p ? CalculatedDutyFee.rf_p : 0}</strong></Col>
                                        </Row>
                                        <Row>
                                            <Col lg={6} md={6} xs={6} ><p className='popuptext'>User Charges(₹) </p></Col>
                                            <Col lg={2} md={2} xs={2}><p>:</p></Col>
                                            <Col lg={4} md={4} xs={4}><strong>500</strong></Col>
                                        </Row>
                                        <Row>
                                            <Col lg={6} md={6} xs={6} ><p className='popuptext'>Market Value(₹)  </p></Col>
                                            <Col lg={2} md={2} xs={2}><p>:</p></Col>
                                            <Col lg={4} md={4} xs={4}><strong>{marketvaluecal.length > 0 ? marketvaluecal[0].marketValue : 0}</strong></Col>
                                        </Row>
                                        <Row>
                                            <Col lg={6} md={6} xs={6} ><p className='popuptext'>Consideration Value(₹)  </p></Col>
                                            <Col lg={2} md={2} xs={2}><p>:</p></Col>
                                            <Col lg={4} md={4} xs={4}><strong>{PropertyDetails.amount ? PropertyDetails.amount : "0"}</strong></Col>
                                        </Row>
                                        <Row>
                                            <Col lg={6} md={6} xs={6} ><p className='popuptext'>Total Payable(₹) </p></Col>
                                            <Col lg={2} md={2} xs={2}><p>:</p></Col>
                                            <Col lg={4} md={4} xs={4}><strong> <strong>{Number(CalculatedDutyFee.sd_p) + Number(CalculatedDutyFee.td_p) + Number(CalculatedDutyFee.rf_p) + 500}</strong></strong></Col>
                                        </Row>
                                    </div>
                                </Col>
                            </Row>
                        </Container>
                    </Modal.Body>
                </Modal>
                }
                <Row>
                    <Col lg={12} md={12} xs={12}>

                        <div className={styles.PropertyDetailsmain} style={{ marginTop: "20px" }}>
                        <div className='ContainerColumn TitleColmn' onClick={() => { redirectToPage("/MVassistance/MvaLandingpage") }}>
                                <h4 className='TitleText left-title'>Back</h4>
                            </div>
                            <div className="mainWrapper p-4">
                                <div className="wrapperInner">
                                    <form onSubmit={onSubmit} className={styles.ExecutantDetailsInfo}>
                                        <Row>
                                            <Col lg={6} md={6} xs={12}>
                                                <div className="acknowledgement mt-2">
                                                    <button className="active partyDetails  btnHover">Calculate Duty Fees</button>
                                                </div>
                                            </Col>

                                            <Col lg={6} md={6} xs={12}>
                                            </Col>
                                        </Row>
                                        <div className={`${styles.gettableContainer} ${styles.getStartedpageCon}`}>
                                            <Row className='mt-1'>
                                                <h6 className={styles.getTitle}>Please Select Type of Registration and Nature of Document <span>[దయచేసి నమోదు రకం మరియు దస్తావేజు యొక్క స్వభావాన్ని ఎంచుకోండి]</span></h6>
                                                <Col lg={6} md={6} xs={12}>
                                                    {registrationTypeList.length &&
                                                        <div className='my-1'>
                                                            <TableText label={'Type of Registration [రిజిస్ట్రేషన్ రకం]'} required={true} LeftSpace={false} />
                                                            <TableDrpDown required={true} options={registrationTypeList} name={"registrationType"} value={GetstartedDetails.registrationType ? GetstartedDetails.registrationType.TRAN_DESC : null} onChange={onChange} keyName={''} label={''} errorMessage={''} keyValue={''} />
                                                        </div>
                                                    }
                                                </Col>
                                                <Col lg={6} md={6} xs={12}>
                                                    <div className='my-1'>
                                                        <TableText label={'Nature of Document [దస్తావేజు యొక్క స్వభావం]'} required={true} LeftSpace={false} />
                                                        <TableDrpDown required={true} options={DocumentNatureList} name={"documentNature"} value={GetstartedDetails.documentNature ? GetstartedDetails.documentNature.TRAN_DESC : null} onChange={onChange} keyName={''} label={''} errorMessage={''} keyValue={''} />
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>
                                        <div className={styles.AddExecutantInfo} >
                                            <Row className="align-items-end pt-4 ">
                                                <Col lg={4} md={6} xs={12}>
                                                    <TableText label={'Total Consideration Value [మొత్తం ప్రతిఫలం విలువ]'} required={true} LeftSpace={false} />
                                                    <TableInputText type='number' dot={false} required={true} name={'amount'} value={PropertyDetails.amount} onChange={onChange} placeholder={''} />
                                                </Col>
                                                <Col lg={5} md={6} xs={12}>
                                                    <label className='fs-5 fw-2 mb-2'>
                                                        Is Property Available ?
                                                        <input
                                                            className='mx-2'
                                                            type="checkbox"
                                                            value="true"
                                                            checked={isAvailable}
                                                            onClick={handleAvailabilityChange}
                                                        />
                                                    </label>
                                                </Col>
                                                <Col lg={3} md={6} xs={12}></Col>
                                            </Row>
                                            <div className={styles.divider}></div>
                                            {isAvailable && <div>
                                                <Row>
                                                    <p className={` ${styles.getTitle} ${styles.HeadingText}`}>Which Jurisdiction district and SRO office is the property Located ? [ఏ సబ్ రిజిస్ట్రార్ కార్యాలయం పరిధి జిల్లాలో ఉన్న ఆస్తి?]</p>
                                                    <Col lg={6} md={6} xs={12} className='my-2 mb-3'>
                                                        <TableText label={'Jurisdiction Registration District [అధికార పరిధి రిజిస్ట్రేషన్ జిల్లా]'} required={true} LeftSpace={false} />
                                                        <TableDrpDown required={true} options={DistrictList} name={'district'} value={PropertyDetails.district} onChange={onChange} keyName={'name'} label={''} errorMessage={''} keyValue={'name'} />
                                                    </Col>
                                                    <Col lg={6} md={6} xs={12} className='my-2'>
                                                        <TableText label={'Mandal [మండలం]'} required={true} LeftSpace={false} />
                                                        <TableDrpDown required={true} options={MandalList} name={"mandal"} value={PropertyDetails.mandal} onChange={onChange} keyName={'name'} label={''} errorMessage={''} keyValue={'name'} />
                                                    </Col>
                                                    <Col lg={6} md={6} xs={12} className='my-2 mb-3'>
                                                        <TableText label={'Village [గ్రామం]'} required={true} LeftSpace={false} />
                                                        <TableDrpDown required={true} options={VillageList} name={"village"} value={PropertyDetails.village} onChange={onChange} keyName={'name'} label={''} errorMessage={''} keyValue={'name'} />
                                                    </Col>
                                                    <Col lg={6} md={6} xs={12} className='my-2'>
                                                        <TableText label={'Jurisdiction Sub-Registrar [అధికార పరిధి సబ్ రిజిస్ట్రార్ కార్యాలయం]'} required={true} LeftSpace={false} />
                                                        <TableDrpDown required={true} options={SROOfficeList} name={'sroOffice'} value={PropertyDetails.sroOffice} onChange={onChange} keyName={'name'} label={''} errorMessage={''} keyValue={'name'} />
                                                    </Col>

                                                </Row>
                                                <div className={styles.divider}></div>
                                                <Row >
                                                    <Col lg={4} md={6} xs={12}>
                                                        <TableText label={'Type of Property [ఆస్తి రకం]'} required={true} LeftSpace={false} />
                                                        <TableDrpDown required={true} options={DropdownList.Typeofproperty} name={'propertyType'} value={PropertyDetails.propertyType} onChange={onChange} keyName={''} label={''} errorMessage={''} keyValue={''} />
                                                    </Col>
                                                    <Col lg={4} md={6} xs={12}>
                                                        <TableText label={'Land Use [భూమి వినియోగం]'} required={true} LeftSpace={false} />
                                                        <TableDrpDown required={true} options={DropdownList.LandUseList} name={'landUse'} value={PropertyDetails.landUse} onChange={onChange} keyName={''} label={''} errorMessage={''} keyValue={''} />
                                                    </Col>
                                                    <Col lg={3} md={6} xs={12}></Col>
                                                    <Col lg={3} md={6} xs={12}></Col>
                                                </Row>
                                            </div>
                                            }
                                            <Row>
                                                <Col lg={12} md={12} xs={12}>
                                                    <div className={styles.ProceedContainer}>
                                                        <button className='proceedButton'>Proceed</button>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container >
            {/* <pre>{JSON.stringify(PropertyDetails, null, 2)}</pre> */}
        </div >
    )
}

export default PropertyDetailsPage
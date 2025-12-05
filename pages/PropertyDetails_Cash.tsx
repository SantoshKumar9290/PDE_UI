import { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import styles from '../styles/pages/Mixins.module.scss';
import TableInputText from '../src/components/TableInputText';
import TableText from '../src/components/TableText';
import TableDropdown from '../src/components/TableDropdown';
import TableInputRadio from '../src/components/TableInputRadio';
import TableDropdownSRO from '../src/components/TableDropdownSRO';
import Table from 'react-bootstrap/Table';
import { useRouter } from 'next/router';
import { useAppSelector, useAppDispatch } from '../src/redux/hooks';
import { checkCaptcha } from '../src/utils';
import { useGetDistrictList, useSROOfficeList, UseAddProperty, UseUpdateProperty, UseGetWenlandSearch, UseGetVillageCode, UselocalBodies, UseGetHabitation, UseGetPPCheck, UseMVCalculator, useGetMandalList, UseGetVgForPpAndMV, useGetVillagelList, getSroDetails, UseDutyCalculator, UseGetlpmCheck,getLinkedSroDetails, UseReportTelDownload, UseReportDownload,UseGetECDetails,UseGetLinkDocDetails } from '../src/axios';
import { SavePropertyDetails } from '../src/redux/formSlice';
import { PopupAction, AadharPopupAction, DeletePopupAction } from '../src/redux/commonSlice';
import Image from 'next/image';
import Head from 'next/head';
import { CallingAxios, DateFormator, DoorNOIdentifier, KeepLoggedIn, MasterCodeIdentifier, ShowMessagePopup, MuncipleKeyNameIdentifier, ShowPreviewPopup, TotalMarketValueCalculator } from '../src/GenericFunctions';
import Captcha from '../src/components/Captcha';


const DropdownOptions = {
    DropdownOptionsList: ["A", "B"],
    UnitList: ["SQ. FEET", "SQ. YARD"],
    BooknoList: ["1", "2", "3"]
}

const UnitRateTypes = {
    RateList: [{ label: 'Non-Agriculture Rates' }, { label: 'Agriculture Rates' }],
}

const DropdownList = {
    LocalBodyTypesList: [{ localBodyType: 'MUNICIPAL CORPORATION [మున్సిపల్ కార్పొరేషన్]', localBodyCode: "1" }, { localBodyType: 'SPL./SELECTION GRADE MUNICIPALITY [స్పెషల్ సెలక్షన్ గ్రేడ్ మున్సిపాలిటీ]', localBodyCode: "2" }, { localBodyType: 'OTHER MUNICIPALITY/NOTIFIED AREA [ఇతర మునిసిపాలిటీ / నోటిఫైడ్ ఏరియా]', localBodyCode: "3" },
    { localBodyType: 'MAJOR GRAM PANCHAYAT [మేజర్ గ్రామ పంచాయితీ]', localBodyCode: "5" }, { localBodyType: 'Cantonment Board [కంటోన్మెంట్ బోర్డు]', localBodyCode: "6" }, { localBodyType: 'GRADE/OTHER MUNICIPALITY UNDER UA [అర్బన్ అగ్లామరేషన్ లోని గ్రేడ్ 1 మున్సిపాలిటీ మరియు ఇతర మున్సిపాలిటీ]', localBodyCode: "7" }, { localBodyType: 'MAJOR GRAM PANCHAYATH UNDER UA [అర్బన్ అగ్లామరేషన్ లోని మేజర్ గ్రామ పంచాయతీ]', localBodyCode: "8" }],
    LandUseList: []
}

const PropertyDetailsPage_B = () => {
    const router = useRouter();
    const dispatch = useAppDispatch()
    const [generateStructure, setGenerateStructure] = useState({ showStructure: false, allowEdit: true });
    const [activepage, setActivepage] = useState(false);
    const [getlinkDocument, setGetlinkDocument] = useState(false);
    let initialGetstartedDetails = useAppSelector(state => state.form.GetstartedDetails);
    const [GetstartedDetails, setGetstartedDetails] = useState(initialGetstartedDetails);
    let LoginDetails = useAppSelector(state => state.login.loginDetails);
    const [DistrictList, setDistrictList] = useState([]);
    const [SROOfficeList, setSROOfficeList] = useState([]);
    let initialPropertyDetails = useAppSelector(state => state.form.PropertyDetails);
    let [PropertyDetails, setPropertyDetails] = useState<any>(initialPropertyDetails);
    let [LinkDocument, setLinkDocument] = useState<any>({ linkDocNo: "", regYear: "", bookNo: "", scheduleNo: "", district: "", sroOffice: "",sroCode:"" });
    const [WeblandDetails, setWeblandDetails] = useState({ totalExtentAcers: "", totalExtentCents: "", conveyedExtentAcers: "", conveyedExtentCents: "", khataNumber: "", sryNo: "" })
    const [WeblanList, setWeblanList] = useState({ message: "", data: [] });
    const [MandalList, setMandalList] = useState([]);
    const [VillagefrMandalList, setVillagefrMandalList] = useState([]);
    const [VillageList, setVillageList] = useState([]);
    const [VillageCodeList, setVillageCodeList] = useState([]);
    const [HabitationList, setHabitationList] = useState([]);
    const [localBodyTypeList, setLocalBodyTypeList] = useState([]);
    const [localBodyNameList, setLocalBodyNameList] = useState([]);

    const [HabitationCodeList, setHabitationCodeList] = useState([]);
    const [ApplicationDetails, setApplicationDetails] = useState<any>({ applicationId: "", executent: [], claimant: [] });
    const [AllowProceed, setAllowProceed] = useState(false);
    const [IsViewMode, setIsViewMode] = useState(false);
    const [CalculatedDutyFee, setCalculatedDutyFee] = useState({ TRAN_MAJ_CODE: "", TRAN_MIN_CODE: "", sroCode: "", amount: "", rf_p: "0", td_p: "0", sd_p: "0", marketValue: "0" })
    const [lpmValue, setLpmValue] = useState(0);
    const [distCode, setDistCode] = useState<any>("");
    const [wbVgCode, setwbVegCode] = useState<any>("");
    const [VILLCD, setVILLCD] = useState('');
	const [ecDetails,setEcDetails] = useState<any>([]);

	const [isYesCheck, setIsYesCheck] = useState<any>(false);
	const [isNoCheck, setIsNoCheck] = useState<any>(false);
	const [isYesPresentCheck, setIsYesPresentCheck] = useState<any>(false);
	const [isNoPresentCheck, setIsNoPresentCheck] = useState<any>(false);
	const [flag, setFlag] = useState(false);
    const [inputValue, setInputValue] = useState<any>("");
    const ShowAlert = (type, message) => { dispatch(PopupAction({ enable: true, type: type, message: message })); }

    const onGenerateStructureClick = (value: string) => {
        if (value == "edit") {
            if (PropertyDetails.totalFloors) {
                setGenerateStructure({ ...generateStructure, showStructure: true, allowEdit: false });
            }
            else {
                ShowMessagePopup(false, "Please enter total number of floors.", "");
            }
        }
        else {
            setPropertyDetails({ ...PropertyDetails, totalFloors: "", structure: [] });
            setGenerateStructure({ ...generateStructure, showStructure: false, allowEdit: true });
        }
    };

    const ongenlinkdocClick = () => {
        setGetlinkDocument(!getlinkDocument)

    }

    useEffect(() => {
        if (KeepLoggedIn()) {
            let data: any = localStorage.getItem("GetApplicationDetails");
            if (data == "" || data == undefined) {
                ShowMessagePopup(false, "Invalid Access", "/");
            }
            else {
                data = JSON.parse(data);
                setApplicationDetails(data)
                if (DistrictList.length == 0) {
                    GetDistrictList();
                }

                let data2: any = localStorage.getItem("PropertyDetails");
                if (data2 == "" || data == undefined) {
                    ShowMessagePopup(false, "Invalid Access", "/");
                }
                else {
                    data2 = JSON.parse(data2);
 
					if(data2.isExAsPattadhar === "NO"){
						setIsNoCheck(true);
						setIsYesCheck(false);
					}
					if(data2.isExAsPattadhar === "YES"){
						setIsNoCheck(false);
						setIsYesCheck(true);
					}
					if(data2.ispresentExcutent === "NO"){
						setIsNoPresentCheck(true);
						setIsYesPresentCheck(false);
					}
					if(data2.ispresentExcutent === "YES"){
						setIsNoPresentCheck(false);
						setIsYesPresentCheck(true);
					}
                    dispatch(SavePropertyDetails(PropertyDetails));


                    if (MandalList.length == 0) {
                        let selected = DistrictList.find(e => e.name == data2.district);
                        if (selected) { GetMandalList(selected.id); }
                    }
                    if (data2.conveyedExtent && data2.conveyedExtent.length) {
                        let ExtentList = [];
                        data2.conveyedExtent.map((x, i) => {
                            ExtentList.push({ totalExtentAcers: data2.tExtent.split('.')[0], totalExtentCents: data2.tExtent.split('.')[1], conveyedExtentAcers: x.extent.split('.')[0], conveyedExtentCents: x.extent.split('.')[1], survayNo: data2.survayNo.split(',')[i] });
                        })
                        data2 = { ...data2, ExtentList: ExtentList }
                    }
                    if (data2.mode == "edit") {
                        setAllowProceed(true);
                    }
                    if (data2.mode == "view") {
                        setIsViewMode(true);
                    } else {
                        setIsViewMode(false);
                    }
                    setPropertyDetails(data2.mode === 'edit' ? { ...data2, localBodyType: data2.localBodyCode } : data2);
                }
            }
        } else { ShowMessagePopup(false, "Invalid Access", "/"); }
    }, []);

    useEffect(() => {
        if (ApplicationDetails.registrationType && ApplicationDetails.documentNature && ApplicationDetails.sroCode && ApplicationDetails.amount) {
            let ftv:any;
            let currentMarketValue = TotalMarketValueCalculator(ApplicationDetails)
            if(ApplicationDetails.docsExcutedBy == "GovtBody"){
                ftv = ApplicationDetails.amount
            }else{
                ftv =ApplicationDetails.amount > currentMarketValue ? ApplicationDetails.amount : currentMarketValue;
            }
            
            let data = {
                "tmaj_code": ApplicationDetails.registrationType.TRAN_MAJ_CODE,
                "tmin_code": ApplicationDetails.documentNature.TRAN_MIN_CODE,
                "sroNumber": ApplicationDetails.sroCode,
                "local_body": 3,
                "flat_nonflat": "N",
                "marketValue": currentMarketValue,
                "finalTaxbleValue": ftv,
                "con_value": ApplicationDetails.amount,
                "adv_amount": 0
            }
            DutyFeeCalculator(data);
        }
    }, [ApplicationDetails])

    const DutyFeeCalculator = async (data) => {
        let result = await UseDutyCalculator(data);
        if (result.status) {
            setCalculatedDutyFee({ ...CalculatedDutyFee, TRAN_MAJ_CODE: ApplicationDetails.registrationType.TRAN_MAJ_CODE, TRAN_MIN_CODE: ApplicationDetails.documentNature.TRAN_MIN_CODE, sroCode: ApplicationDetails.sroCode, amount: ApplicationDetails.amount, sd_p: result.data.sd_p, td_p: result.data.td_p, rf_p: result.data.rf_p });
        }
    }
    const GetDistrictList = async () => {
        let result = await useGetDistrictList();
        if (result.status) {
            setDistrictList(result.data);
            // let sortedResult = result.data.sort((a, b) => a.name < b.name ? -1 : 1)
            // setDistrictList(result.data ? sortedResult : []);
        }
        else {
            // ShowMessagePopup(false, result.message, "")
        }
    }



    const GetMandalList = async (id: any) => {
        let result = await CallingAxios(useGetMandalList(id));
        if (result.status) {
            // console.log(result.data);
            // setDistrictList(result.data ? result.data : []);
            let sortedResult = result.data.sort((a, b) => a.name < b.name ? -1 : 1)

            setMandalList(sortedResult);
        }
        else {
            ShowMessagePopup(false, "Unable to fetch mandal list", "")
        }
    }

    const GetVillageList = async (id: any, distcode: any) => {
        let result = await CallingAxios(useGetVillagelList(id, distcode));
        if (result.status) {
            // console.log(result.data);
            // setDistrictList(result.data ? result.data : []);
            let sortedResult = result.data.sort((a, b) => a.name < b.name ? -1 : 1)
            setVillagefrMandalList(sortedResult);
        }
        else {
            ShowMessagePopup(false, "Unable to fetch village list", "")
        }
    }

    const GetSROOfficeList = async (id: any) => {
        let result = await CallingAxios(getSroDetails(id));
        if (result.status) {
            setSROOfficeList(result.data);
        }
    }


    const onChange = (event: any) => {
        let TempDetails = { ...PropertyDetails };
        let addName = event.target.name;
        let addValue = event.target.value;
        // if (addName == 'northBoundry' || addName == 'southBoundry' || addName == 'eastBoundry' || addName == 'westBoundry') {
        //     addValue = addValue.replace(/[^\w\s/,-]/gi, "");
        // }
        if (addName == "district") {
            // setSROOfficeList([]);
            setMandalList([]);
            let selected = DistrictList.find(e => e.name == addValue);
            TempDetails = { ...TempDetails, districtCode: selected.id }
            setDistCode(selected.id)
            if (selected)
                GetMandalList(selected.id);
            // GetSROOfficeList(selected.id);
        } else if (addName == "mandal") {
            setVillagefrMandalList([]);
            let selected = MandalList.find(e => e.name == addValue);
            let mandalCode = selected ? selected.id : "";
            TempDetails = { ...TempDetails, mandalCode }
            // TempGetstartedDetails = { ...TempGetstartedDetails, mandalCode }
            if (selected)
                GetVillageList(selected.id, distCode);
        }
        
        else if (addName == "villagefromMandals") {
            setSROOfficeList([]);
            let selected = VillagefrMandalList.find(e => e.name == addValue);
            let villageCode = selected ? selected.id : "";
            TempDetails = { ...TempDetails, villageCode }
            // TempGetstartedDetails = { ...TempGetstartedDetails, villageCode }
            if (selected)
                GetSROOfficeList(selected.id);
        } 
        else if (addName == "village") {
            setHabitationList([]);
            let selected = VillageCodeList.find(e => e.VILLAGE_NAME == addValue);
            TempDetails = { ...TempDetails, villageCode: selected.VILLAGE_CODE, habitationCode: "", ExtentList: [] }
        }  
        setGetstartedDetails({ ...GetstartedDetails, [addName]: addValue });
        setPropertyDetails({ ...TempDetails, [addName]: addValue });
    }

    const onCashSubmit =async (e:any)=>{
        e.preventDefault();
        ApiCall(PropertyDetails);
    }

    const ApiCall = async (data: any) => {
        data.applicationId = ApplicationDetails.applicationId;
        if (data && data.villageCode && data.villageCode.length === 6) {
            data.villageCode = "0" + data.villageCode;
        }
        if (data && String(data.localBodyCode) && String(data.localBodyCode).length === 1) {
            data.localBodyCode = "0" + String(data.localBodyCode);
        }
        if (data && String(data.landUseCode) && String(data.landUseCode).length === 1) {
            data.landUseCode = "0" + String(data.landUseCode);
        }
        let am = 0
        let servNo = "";
        
        data.marketValue = data?.conveyanceType ? data.conveyanceValue : data.cashvalue;

        dispatch(SavePropertyDetails(data));

        let result: any;
        if (data.mode === "edit") {
            result = await CallingAxios(UseUpdateProperty(data));
        } else {
            result = await CallingAxios(UseAddProperty(data));

        }
        if (result.status) {
            ShowMessagePopup(true, "Property added successfully with MarketValue", "/PartiesDetailsPage", 5000)
        }
        else {
            ShowMessagePopup(false, result.message, "")
        }
    }


    return (
        <div className='PageSpacing'>
            <Head>
                <title>Propert Details_Rural - Public Data Entry</title>
            </Head>
            <Container>
                <Row>
                    <Col lg={12} md={12} xs={12}>
                        <div className='tabContainerInfo'>
                            <Container>
                                <Row>
                                    <Col lg={10} md={12} xs={12} className='navItems'>
                                        <div className='tabContainer'>
                                            <div className='activeTabButton'>Get Started<div></div></div>
                                            <div className='activeTabButton'>Parties Details<div></div></div>
                                            <div className='activeTabButton'>Property Details<div></div></div>
                                            <div className='inactiveTabButton slotButton'>Slot Booking<div></div></div>
                                        </div>
                                    </Col>
                                    <Col lg={2} md={12} xs={12}>
                                        <div className='text-end previewCon'><button className='PreBtn proceedButton' onClick={() => ShowPreviewPopup()} >Preview Document</button></div>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col lg={12} md={12} xs={12} className='p-0 navItems'>
                                        <div className='tabContainer DutyfeeContainer'>
                                            {/* <div className='activeTabButton'>Duty Fees :<div></div></div> */}
                                            <div className='activeTabButton'>Stamp Duty(₹) : {CalculatedDutyFee.sd_p ? CalculatedDutyFee.sd_p : 0}<div></div></div>
                                            <div className='activeTabButton'>Transfer Duty(₹) : {CalculatedDutyFee.td_p ? CalculatedDutyFee.td_p : 0}<div></div></div>
                                            <div className='activeTabButton'>Registration fee(₹) : {CalculatedDutyFee.rf_p ? CalculatedDutyFee.rf_p : 0}<div></div></div>
                                            <div className='activeTabButton'>User Charges(₹) : 500<div></div></div>
                                            <div className='activeTabButton'>Market Value(₹)  : {TotalMarketValueCalculator(ApplicationDetails)}<div></div></div>
                                            <div className='activeTabButton'>Consideration Value(₹) : {ApplicationDetails.amount ? ApplicationDetails.amount : "0"}<div></div></div>
                                            <div className='activeTabButton'>Total Payable(₹) : {Number(CalculatedDutyFee.sd_p) + Number(CalculatedDutyFee.td_p) + Number(CalculatedDutyFee.rf_p) + 500}</div>
                                        </div>
                                    </Col>
                                </Row>
                            </Container>
                        </div>

                        <div className={`mt-1 ${styles.PropertyDetailsmain} ${styles.PropertyDetailsPage}`}>
                            <Row className='ApplicationNum pt-5'>
                                <Col lg={6} md={6} xs={12}>
                                    <div className='ContainerColumn TitleColmn' onClick={() => { router.push("/PartiesDetailsPage") }}>
                                        <h4 className='TitleText left-title'>{ApplicationDetails.documentNature ? ApplicationDetails.registrationType.TRAN_DESC : null}</h4>
                                    </div>
                                </Col>
                                <Col lg={6} md={6} xs={12}>
                                    <div className='ContainerColumn'>
                                        <h4 className='TitleText' style={{ textAlign: 'right' }}>Application ID: {ApplicationDetails.applicationId}</h4>
                                    </div>
                                </Col>
                            </Row>

                            <div className={styles.ExecutantDetailsInfo}>
                                <div className={styles.DetailsHeaderContainer}>
                                    <Row>
                                        <Col lg={6} md={6} xs={12}>
                                            <div className={styles.ContainerColumn}>
                                                <p className={styles.HeaderText}>4 . Property Details (Rural) [ఆస్తి వివరాలు (గ్రామీణ)]</p>
                                            </div>
                                        </Col>
                                        <Col lg={6} md={6} xs={12}>
                                        </Col>
                                    </Row>
                                </div>
                                <form onSubmit={onCashSubmit} className={styles.AddExecutantInfo}>
                                    <Row className="align-items-end">
                                        <Col lg={4} md={6} xs={12} className='mb-3'>
                                            <TableText label={"Total Consideration Value(₹) [మొత్తం ప్రతిఫలం విలువ]"} required={true} LeftSpace={false} />
                                            <TableInputText type='number' placeholder='₹' required={true} disabled={true} name={'amount'} value={ApplicationDetails.amount} onChange={onChange} />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <p className={` ${styles.getTitle} ${styles.HeadingText}`}>Date of Execution Details [అమలు తేదీ వివరాలు]</p>
                                        <Col lg={4} md={6} xs={12}>
                                            <TableText label={"Date of Execution [అమలు తేదీ]"} required={true} LeftSpace={false} />
                                            <TableInputText type='text' placeholder='' disabled={true} required={true} name={'executionDate'} value={DateFormator(ApplicationDetails.executionDate, "dd/mm/yyyy")} onChange={onChange} />
                                        </Col>
                                        <Col lg={4} md={6} xs={12}>
                                            <TableText label={"Total Stamp Paper Value(₹) [స్టాంప్ పేపర్ మొత్తం విలువ]"} required={true} LeftSpace={false} />
                                            <TableInputText type='number' placeholder='Enter Value' disabled={true} required={true} name={'stampPaperValue'} value={ApplicationDetails.stampPaperValue} onChange={onChange} />
                                        </Col>
                                        <Col lg={4} md={6} xs={12}>
                                            <TableText label={"Date of Stamp Purchase [స్టాంప్ కొనుగోలు తేదీ]"} required={true} LeftSpace={false} />
                                            <TableInputText type='text' placeholder='' disabled={true} required={true} name={'stampPurchaseDate'} value={DateFormator(ApplicationDetails.stampPurchaseDate, "dd/mm/yyyy")} onChange={onChange} />
                                        </Col>
                                        {ApplicationDetails?.registrationType?.TRAN_MAJ_CODE == "04" ?
                                            <Col lg={4} md={6} xs={12} className='mt-2'>
                                                <TableText label={"Party Number [పార్టీ నెంబర్]"} required={true} LeftSpace={false} />
                                                <TableInputText type='text' placeholder='' disabled={true} required={true} name={'partyNumber'} value={PropertyDetails.partyNumber} onChange={onChange} />
                                            </Col>
                                            : null}
                                    </Row>

                                    {activepage && (
                                        <div className={styles.ExecutantDetailsInfo}>
                                            <div className={styles.DetailsHeaderContainer} style={{ marginTop: '20px' }}>
                                                <Row>
                                                    <Col lg={6} md={6} xs={12}>
                                                        <div className={styles.ContainerColumn}>
                                                            <p className={styles.HeaderText}>Unit Rates</p>
                                                        </div>
                                                    </Col>
                                                    <Col lg={6} md={6} xs={12}>
                                                    </Col>
                                                </Row>
                                            </div>
                                            <div className={`${styles.AddExecutantInfo}, ${styles.UnitRateInto}`}>
                                                <Row className="mb-2">
                                                    <Col>
                                                        <TableInputRadio label='' options={UnitRateTypes.RateList} required={true} defaultValue='' name='' onChange={onChange} />
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col lg={3} md={6} xs={12}>
                                                        <TableText label={"District"} required={true} LeftSpace={false} />
                                                        <TableDropdown required={true} options={DropdownOptions.DropdownOptionsList} name={''} onChange={onChange} />
                                                    </Col>
                                                    <Col lg={3} md={6} xs={12}>
                                                        <TableText label={"Mandal"} required={true} LeftSpace={false} />
                                                        <TableDropdown required={true} options={DropdownOptions.DropdownOptionsList} name={''} onChange={onChange} />
                                                    </Col>
                                                    <Col lg={3} md={6} xs={12}>
                                                        <TableText label={"Village"} required={true} LeftSpace={false} />
                                                        <TableDropdown required={true} options={DropdownOptions.DropdownOptionsList} name={''} onChange={onChange} />
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col lg={12} md={12} xs={12}>
                                                        <div className={styles.ProceedContainer}>
                                                            <p className={styles.backText}>Back</p>
                                                            <button className={styles.ProceedButton}>Submit</button>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </div>
                                    )}
                                    <div className={styles.divider}></div>
                                    <Row className="mb-2">
                                        <p className={` ${styles.getTitle} ${styles.HeadingText}`}>Which Jurisdiction district and SRO office is the property Located ? [ఏ సబ్ రిజిస్ట్రార్ కార్యాలయం పరిధి జిల్లాలో ఉన్న ఆస్తి?]</p>
                                        {/* <Col lg={6} md={6} xs={12} className='pb-2'>
                                            <TableText label={"Local Body Type [స్థానిక సంస్థ రకం]"} required={true} LeftSpace={false} />
                                            <TableInputText type='text' placeholder='' disabled={true} required={true} name={'localBodyType'} value={PropertyDetails.localBodyType} onChange={onChange} />
                                        </Col> */}
                                        <Col lg={6} md={6} xs={12}>
                                            <TableText label={"Jurisdiction Registration District [అధికార పరిధి రిజిస్ట్రేషన్ జిల్లా]"} required={true} LeftSpace={false} />
                                            <TableInputText type='text' required={true} placeholder='' disabled={true} name={'district'} value={PropertyDetails.district} onChange={onChange} />
                                            {/* <TableDropdownSRO required={true} options={DistrictList} name={"district"} value={PropertyDetails.district} onChange={onChange} /> */}
                                        </Col>
                                        <Col lg={6} md={6} xs={12}>
                                            <div className='Inputgap'>
                                                <TableText label='Mandal [మండలం]' required={true} LeftSpace={false} />
                                                <TableInputText type='text' required={true} placeholder='' disabled={true} name={'mandal'} value={PropertyDetails.mandal} onChange={onChange} />
                                                {/* <TableDropdownSRO required={true} options={MandalList} name={"mandal"} value={PropertyDetails.mandal} onChange={onChange} /> */}
                                            </div>
                                        </Col>
                                        <Col lg={6} md={6} xs={12} className='mt-2'>
                                            <div className='Inputgap'>
                                                <TableText label='Village [గ్రామం]' required={true} LeftSpace={false} />
                                                <TableInputText type='text' disabled={true} required={true} placeholder='' name={'village'} value={PropertyDetails.village} onChange={onChange} />
                                                {/* <TableDropdownSRO required={true} options={VillagefrMandalList} name={"villagefromMandals"} value={PropertyDetails.village} onChange={onChange} /> */}
                                            </div>
                                        </Col>
                                        <Col lg={6} md={6} xs={12} className='mt-2'>
                                            <TableText label={"Jurisdiction Sub-Registrar [అధికార పరిధి సబ్ రిజిస్ట్రార్ కార్యాలయం]"} required={true} LeftSpace={false} />
                                            <TableInputText type='text' required={true} placeholder='' disabled={true} name={'sroOffice'} value={PropertyDetails.sroOffice} onChange={onChange} />
                                            {/* <TableDropdownSRO required={true} options={SROOfficeList} name={"sroOffice"} value={PropertyDetails.sroOffice} onChange={onChange} /> */}
                                        </Col>
                                    </Row>
                                    {/* <Row>
                                        <Col lg={6} md={6} xs={12}>
                                            <TableText label={"Jurisdiction Sub-Registrar [అధికార పరిధి సబ్ రిజిస్ట్రార్ కార్యాలయం]"} required={true} LeftSpace={false} />
                                            <TableInputText type='text' required={true} placeholder='' disabled={true} name={'sroOffice'} value={PropertyDetails.sroOffice} onChange={onChange} /> */}
                                    {/* <TableDropdownSRO required={true} options={SROOfficeList} name={"sroOffice"} value={PropertyDetails.sroOffice} onChange={onChange} /> */}
                                    {/* </Col> */}
                                    {/* <Col lg={6} md={6} xs={12}>
                                            <TableText label={MuncipleKeyNameIdentifier(PropertyDetails.localBodyType)} required={true} LeftSpace={false} />
                                            <TableInputText disabled={true} type='text' placeholder='Enter Name' required={true} name={'localBodyName'} value={PropertyDetails.localBodyName} onChange={onChange} />
                                        </Col> */}
                                    {/* <Col lg={6} md={6} xs={12}>
                                            <TableText label={"Municipality Name"} required={true} LeftSpace={false} />
                                            <TableInputText type='text' placeholder='Enter Name' disabled={true} required={true} name={'localBodyName'} value={PropertyDetails.localBodyName} onChange={onChange} />
                                        </Col> */}
                                    {/* </Row> */}
                                    <div className={styles.divider}></div>
                                    {
                                        ApplicationDetails?.documentNature?.TRAN_MAJ_CODE =="01" && ApplicationDetails?.documentNature?.TRAN_MIN_CODE =="26" && PropertyDetails.conveyanceType === "Movable" ?
                                        <Row className='mt-0 mb-0'>
                                            <Col lg={4} md={6} xs={12} className='pt-0 pb-2'>
                                                <TableText label={"MovableType"} required={true} LeftSpace={false} />
                                                <TableDropdownSRO required={true} options={[{name:"Share"}]} name={'movableType'} value={PropertyDetails.movableType} onChange={onChange} />
                                            </Col>
                                            <Col lg={4} md={6} xs={12} className='pt-0 pb-2'>
                                                <TableText label={"Value"} required={true} LeftSpace={false} />
                                                <TableInputText disabled={false} required={true} name={'conveyanceValue'} value={PropertyDetails.conveyanceValue} onChange={onChange} type={'number'} placeholder={'conveyanceValue'} />
                                            </Col>
                                     </Row>
                                     :
                                      <Row className="">
                                            <p className={` ${styles.getTitle} ${styles.HeadingText}`}>Cash Value (Partition Only)</p>
                                            <Col lg={3} md={6} xs={12}>
                                                <TableText label={"Cash Value"} required={true} LeftSpace={false} />
                                                {/* {IsViewMode ? <TableInputText disabled={true} type='text' placeholder='0' required={false} name={'village'} value={PropertyDetails.village} onChange={onChange} />
                                                    : <TableDropdown options={VillageList} required={true} name={'village'} value={PropertyDetails.village} onChange={onChange} />} */}
                                                {IsViewMode ? <TableInputText disabled={true} type='number' placeholder='cash value' required={false} name={'cashvalue'} value={PropertyDetails.cashvalue} onChange={onChange} /> :
                                                <TableInputText  type='number' placeholder='cash value' required={false} name={'cashvalue'} value={PropertyDetails.cashvalue} onChange={onChange} />}
                                            </Col>
                                        </Row>
                                    }
                                   
                                    {PropertyDetails.cashvalue && !IsViewMode ? <Row className="mb-2">
                                        <Col lg={12} md={12} xs={12}>
                                            <div className={styles.ProceedContainer}>
                                                <button className='proceedButton'>{PropertyDetails.mode == "edit" ? "Update" : "Proceed"} </button>
                                            </div>
                                        </Col>
                                    </Row> : PropertyDetails.conveyanceValue ? <Col lg={12} md={12} xs={12}>
                                            <div className={styles.ProceedContainer}>
                                                <button className='proceedButton'>{PropertyDetails.mode == "edit" ? "Update" : "Proceed"} </button>
                                            </div>
                                        </Col>:null}
                                </form>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
            {/* <pre>{JSON.stringify(PropertyDetails, null, 2)}</pre>
            <pre>{JSON.stringify(WeblanList,null,2)}</pre> */}
        </div>
    )
}

export default PropertyDetailsPage_B;
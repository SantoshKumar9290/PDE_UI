import React, { useEffect, useLayoutEffect, useState } from 'react'
import styles from '../styles/pages/Mixins.module.scss';
import { useRouter } from 'next/router';
import { useAppSelector, useAppDispatch } from '../src/redux/hooks';
import { SaveGetstartedDetails } from '../src/redux/formSlice';
import { useGetDistrictList, useSROOfficeList, UseCreateApplication,validateNonJudicialStamps, getSroDetails, UseGetLinkDocDetails, UseAddProperty, getLinkedSroDetails, useSavePartyDetails, UseSaveCovinant, UseGetPPCheck, UseMVCalculator, UseGetVgForPpAndMV, UseGetStructureDetails, useGetMandalList, useGetVillagelList, UseDutyCalculator, UseGetWenlandSearch, UseGetLocationDetails, UseFrankApi, VerifyStockHoldingId } from '../src/axios';
import TableDropdown from '../src/components/TableDropdown';
import TableText from '../src/components/TableText';
import TableDropdownSRO from '../src/components/TableDropdownSRO';
import { Col, Container, Modal, Row } from 'react-bootstrap';
import TableInputText from '../src/components/TableInputText';
import Table from 'react-bootstrap/Table';
import Image from 'next/image';
import { PopupAction } from '../src/redux/commonSlice';
import regType from '../src/regTypes';
import { CallingAxios, DateFormator, DocumentClaimantMapper, DocumentPropertyMapper, DoorNOIdentifier, isFutureDate, KeepLoggedIn, Loading, MasterCodeIdentifier, ShowMessagePopup } from '../src/GenericFunctions';
import TableSelectDate from '../src/components/TableSelectDate';
import moment, { unix } from 'moment';
import covenantType from '../src/covenantType';
import Head from 'next/head';
import { get } from 'lodash';
import TableInputRadio from '../src/components/TableInputRadio';
import { encryptWithAES,decryptWithAES, EXECUTANT_CODES } from '../src/utils';
import Accordion from 'react-bootstrap/Accordion';


const DropdownList = {
    registrationTypeList: ['SALE', 'MORTGAGE', 'GIFT'],
    DocumentNatureList: {
        sale: ['SALE DEED', 'SALE AGREEMENT WITH POSSESSION', 'SALE AGREEMENT WITHOUT POSSESSION', 'SALE DEED EXECUTED BY A.P.HOUSING BOARD', 'SALE DEED EXECUTED BY OR INFAVOUR OF CONSTITUTED BY GOVT.', 'SALE DEED EXECUTED BY  SOCIETY IN F/O MEMBER', 'INSTRUMENTS BETWEEN CO-OPS', 'SALE DEED IN FAVOUR OF STATE OR CENTRAL GOVET.', 'DEVELOPMENT AGREEMENT OR CONSTRUCTION AGREEMENT', 'DEVELOPMENT AGREEMENT CUM GPA ', 'AGREEMENT OF SALE CUM GPA', 'CONVEYANCE DEED(WITHOUT CONSIDERATION)', 'CONVEYANCE FOR CONSIDERATION', 'SALE DEED IN FAVOUR OF MORGAGEE', 'SALE WITH INDEMNITY', 'SALE DEEDS IN F/O AGRL LABRS (SC/ST) FUNDED BY SC FIN. CORPN', 'SALE OF LIFE INTEREST', 'SALE OF TERRACE RIGHTS', 'SALE DEEDS EXECUTED BY COURTS', 'COURT SALE CERTIFICATE','COURT DECREE', 'SALE(OTHERS)','ABOVE POVERTY LINE[పేదరిక రేఖకు పైన జీవించేవారు]', 'BELOW POVERTY LINE[పేదరిక రేఖకు దిగువన జీవించే వారు]'],
        mortgage: ['MORTGAGE WITH POSSESSION', 'MORTGAGE WITHOUT POSSESSION', 'MORT. DEED IN F/O GOVERNER/PRESIDENT OF INDIA BY GT.SERVANTS', 'ASSIGNMENT DEED', 'MORTGAGE DEED BY CO-OPERATIVE SOCIETY IN F/O GOVT.', ' MORTGAGE DEED BY xsALL FARMER FOR AGRL.LOANS IN F/O PAC/BANK', ' MORTGAGE DEED BETWEEN SOCIETY TO SOCIETY OR BANKS', 'DEPOSIT OF TITLE DEEDS', 'SECURITY BOND', 'MORTGAGES IN F/O GRAMEENA OR SCHEDULED BANK FOR AGRICULTURAL CREDIT', 'MORTGAGES IN F/O COOP CREDIT SOCIETIES OF WEAKER SECTION OF NON-AGRICULTURAL CLASS LOAN <=10000', 'INSTRUMENTS BETWEEN CO-OP AND OTHER CO-OP', 'INSTRUMENTS IN F/O HOUSE BLDG CO-OP SOCIETIES FOR LOAN UPTO RS.30000  UNDER L.I.G.H SCHEME', 'MORTGAGES EXECUTED BY MEMBERS OF CO-OP URBAN AND TOWN BANKS IN F/O SUCH BANKS FOR LOAN UPTO RS.15000', 'INSTRUMENTS IN F/O SBI AND NATIONALISED BANKS FOR LOAN UPTO RS.6500 UNDER DIFF RATES OF INT. ADV.', 'FURTHER CHARGE - WHEN THE ORIGINAL MORTGAGE IS WITH POSSESSION', 'FURTHER CHARGE-ORIG. MORTG IS WITHOUT POSSESSION AND POSSESSION IS AGREED TO BE GIVEN AT EXECUTION', 'FURTHER CHARGE - WITHOUT POSSESSION ON A SIMPLE MORTGAGE', 'MORTGAGE BY CONDITIONAL SALE', 'AGREEMENT VARYING THE TERMS OF PERVIOUSLY REGISTERED MORTGAGE DEED', 'ADDITIONAL SECURITY', 'SUBSITUTED SECURITY', 'MORTGAGE(OTHERS)'],
        gift: ['GIFT SETTLEMENT IN F/O FAMILY MEMBER', 'GIFT SETTLEMENT IN F/O OTHERS', 'GIFT SETTLEMENT FOR CHARITABLE/RELIGIOUS PURPOSES', 'GIFT SETTLEMENT IN F/O LOCAL BODIES', 'GIFT IN F/O LOCAL BODIES (G.O 137)', 'GIFT FOR CHARITABLE RELIGIOUS PURPOSES/GOD', 'GIFT IN FAVOUR OF GOVERNMENT', 'GIFT SETTLEMENT DEEDS IN FAVOUR OF GOVERNMENT', 'GIFT OF TERRACE RIGHTS', 'GIFT SETTLEMENT OF TERRACE RIGHTS', 'GIFT RESERVING LIFE INTEREST', 'GIFT SETTLEMENT RESERVING LIFE INTEREST'],
    },
    TypeOfStampe: ["Non-Judicial Stamp Papers", "Franking", "StockHolding"],
    // TypeOfStampe: ["Non-Judicial Stamp Papers", "StockHolding"],
    BooknoList: ["1", "2", "3"],
    stamppaperList: ["1", "2", "3", "4", "5", '6', '7', '8', '9', '10']
}
// const regWith :any = [{ label: 'Sro',value:"SRO" }, { label: 'Vsws',value:"VSWS" }]
const regWith = {
    RateList: ['Sro', 'Vsws'],
}

const GetstartedPage = () => {
    const dispatch = useAppDispatch()
    const router = useRouter();
    let [GetstartedDetails, setGetstartedDetails] = useState({ applicationId: "", registrationType: null, documentNature: null, district: "", distCode: "", mandal: "", mandalCode: "", village: "", villageCode: "", sroOffice: "", sroCode: "", amount: "", docProcessType: "Public Data Entry With Upload Document", noOfStampPapers: "0",regWith: "Sro", regWithCode: "", regWithValue: "", docProcessCode: "", docsExcutedBy: "Individual" , typeOfStamps:"",frankingId:"",stockHoldingId:"",stampPaperValue:"0",nonJudicialStamps:[]});
    const [DistrictList, setDistrictList] = useState([]);
    const [DistrictList2, setDistrictList2] = useState([]);
    const [MandalList, setMandalList] = useState([]);
    const [MandalList2, setMandalList2] = useState([]);
    const [VillageList, setVillageList] = useState([]);
    const [VillageList2, setVillageList2] = useState([]);
    const [SROOfficeList, setSROOfficeList] = useState([]);
    const [SROOfficeList2, setSROOfficeList2] = useState([]);
    const [getlinkDocument, setGetlinkDocument] = useState(false);
    let initialPropertyDetails = useAppSelector(state => state.form.PropertyDetails);
    const [loading, setLoading] = useState(false); 
    const [selectedPropertyIndexes, setSelectedPropertyIndexes] = useState<Set<number>>(new Set()); 
    const [totalMarketValue, setTotalMarketValue] = useState(0); 
    const [PropertyDetails, setPropertyDetails] = useState<any>({...initialPropertyDetails,stampPaperValue:"0",noOfStampPapers:"0"});
    const [LinkDocument, setLinkDocument] = useState({ linkDocNo: "", regYear: "", scheduleNo: "", district: "", mandal: "", village: "", sroOffice: "", sroCode: "" })
    // const [LinkDocument, setLinkDocument] = useState({ linkDocNo: "13", regYear: "2022", scheduleNo: "1", district: "KRISHNA", sroOffice: "KANKIPADU",sroCode:"617" })
    const [ReceivedLinkDocument, setReceivedLinkDocument] = useState({ party: [], property: [], FetchedDetails: [] })
    let [leaseData,setLeaseData] = useState<any>({ wef:"",lPeriod:"",advance:"",adjOrNonAdj:"",valueOfImp:"",muncipalTax:"",rentalDetails:[]})
    const [rentButn,SetRentButn] = useState<any>(false);
    let [rentalRowData,SetrentalRowData] = useState<any>([]);
    let [leasegranTotal,SetleasegranTotal]= useState<any>(0);
    const ShowAlert = (type, message) => { dispatch(PopupAction({ enable: true, type: type, message: message })); }
    const redirectToPage = (location: string) => { router.push({ pathname: location, }) }
    const [TypeList, setTypeList] = useState<any>([])
    const [registrationTypeList, setregistrationTypeList] = useState<any>([])
    const [DocumentNatureList, setDocumentNatureList] = useState([]);
    const [maxDate, setMaxDate] = useState(Date);
    const [SelectionFromLinkDoc, setSelectionFromLinkDoc] = useState({ property: [], party: [], FetchedDetails: [] });
    const [vswRefVilList, setVswRefVilList] = useState<any>([]);
    const [CalculatedDutyFee, setCalculatedDutyFee] = useState({ TRAN_MAJ_CODE: "", TRAN_MIN_CODE: "", sroCode: "", amount: "", rf_p: "0", td_p: "0", sd_p: "0" })
    const [linkDocsDisplay, setLInkDocsDisplay] = useState<any>(false);
    const [book3Nd4Prop, setBook3Nd4Prop] = useState<any>(false);
    const [statusBar, setStatusBar] = useState<any>(false);
    const [stockid, setStockid] = useState<any>({})
    const [goExmp,setGOExmp] = useState (false);
    const [nonJudicialStamps,setNonJudicialStamps]=useState({
        mainSerialNumber:'',
        serialNumber:'',
        value:"0"
    });
    const [nonJudicialList,setNonJudicialList]=useState([])
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [LoginDetails, setLogindetails] = useState<any>({})
    const [showModal, setShowModal] = useState(false);
    const [docTypeInputs,setDocTypeInputs]=useState<any>([{ 'label': "Public Data Entry With Upload Document" }, { 'label': "Public Data Entry With Document Generation" }])
    const [isStackHoldingIdValidated, setIsStackHoldingIdValidated] = useState<boolean>(false);
    useEffect(() => {
        if (KeepLoggedIn()) {
            window.onpopstate = () => {
                router.push("/ServicesPage");
            }
        } else { ShowMessagePopup(false, "Invalid Access", "/") }
    }, []);

    useEffect(() => {
    let NewData = [];
    const loginDetails = JSON.parse(localStorage.getItem('LoginDetails') || '{}');
    setLogindetails(loginDetails);
    const sourceData = GetstartedDetails.docProcessType === "Public Data Entry With Upload Document"
        ? regType.WithoutDoc
        : regType.WithDoc;

    let data = sourceData.filter(x => {
        if (x.TRAN_MIN_CODE !== "00") return false;

        if (loginDetails?.loginEmail === 'CRDA') {
            return ["01", "06", "08"].includes(x.TRAN_MAJ_CODE);
        }
        if (loginDetails?.loginEmail === 'APIIC') {
            return ["08"].includes(x.TRAN_MAJ_CODE);
        }

        return true; // for others, show all where TRAN_MIN_CODE == "00"
    });

    setTypeList(data);
    data.forEach(x => NewData.push(x.TRAN_DESC))
        let filteredList = NewData;
        if (loginDetails.loginMode === 'VSWS') {
            filteredList = NewData.filter(
                (item, index) => index === 3
            );
            setregistrationTypeList(filteredList)
        }
        else {
            setregistrationTypeList(NewData);
        }
        handleShow();
}, [GetstartedDetails.docProcessType])


    useEffect(() => {
        if (GetstartedDetails.registrationType && GetstartedDetails.documentNature && GetstartedDetails.sroCode && GetstartedDetails.amount) {
            if (GetstartedDetails.registrationType.TRAN_MAJ_CODE != CalculatedDutyFee.TRAN_MAJ_CODE || GetstartedDetails.documentNature.TRAN_MIN_CODE != CalculatedDutyFee.TRAN_MIN_CODE || GetstartedDetails.sroCode != CalculatedDutyFee.sroCode || GetstartedDetails.amount != CalculatedDutyFee.amount) {
                if(GetstartedDetails.documentNature.TRAN_MAJ_CODE=='04' && GetstartedDetails.documentNature.TRAN_MIN_CODE=='04'){
        let sd_p = Number(GetstartedDetails.amount) <=1000000 ? 100 :1000;
        let rf_p = 1000;
        let td_p = 0;
          setCalculatedDutyFee({ ...CalculatedDutyFee, TRAN_MAJ_CODE: GetstartedDetails.registrationType.TRAN_MAJ_CODE, TRAN_MIN_CODE: GetstartedDetails.documentNature.TRAN_MIN_CODE, sroCode: GetstartedDetails.sroCode,  amount: GetstartedDetails.amount, sd_p: Math.round(sd_p).toString(), td_p: Math.round(td_p).toString(), rf_p: Math.round(rf_p).toString()});
            }else{ 

                setCalculatedDutyFee({ ...CalculatedDutyFee, TRAN_MAJ_CODE: GetstartedDetails.registrationType.TRAN_MAJ_CODE, TRAN_MIN_CODE: GetstartedDetails.documentNature.TRAN_MIN_CODE, sroCode: GetstartedDetails.sroCode, amount: GetstartedDetails.amount });
                let data = {
                    "tmaj_code": GetstartedDetails.registrationType.TRAN_MAJ_CODE,
                    "tmin_code": GetstartedDetails.documentNature.TRAN_MIN_CODE,
                    "sroNumber": GetstartedDetails.sroCode,
                    "local_body": 3,
                    "flat_nonflat": "N",
                    "marketValue": 0,
                    "finalTaxbleValue": GetstartedDetails.amount,
                    "con_value": GetstartedDetails.amount,
                    "adv_amount": 0
                }
                DutyFeeCalculator(data);
            }
        }
        }
    }, [GetstartedDetails])

    const DutyFeeCalculator = async (data) => {
        let result = await UseDutyCalculator(data);
        if (result.status) {
            setCalculatedDutyFee({ ...CalculatedDutyFee, TRAN_MAJ_CODE: GetstartedDetails.registrationType.TRAN_MAJ_CODE, TRAN_MIN_CODE: GetstartedDetails.documentNature.TRAN_MIN_CODE, sroCode: GetstartedDetails.sroCode, amount: GetstartedDetails.amount, sd_p: result.data.sd_p, td_p: result.data.td_p, rf_p: result.data.rf_p });
        }
    }

    const FilterTypes = (value: string) => {
        let data: any = [];
        if (GetstartedDetails.docProcessType == "Public Data Entry With Upload Document") {
            data = regType.WithoutDoc.find(x => x.TRAN_DESC == value);
        } else {
            data = regType.WithDoc.find(x => x.TRAN_DESC == value);
        }
        return data;
    }

    useEffect(() => {
        if (DistrictList.length == 0) {
            GetDistrictList()
        }
        if(typeof window !== 'undefined' && !!localStorage.getItem('LoginDetails') ){
            if(JSON.parse(localStorage.getItem('LoginDetails')).loginEmail === 'Titdco'||JSON.parse(localStorage.getItem('LoginDetails')).loginEmail === 'CRDA'){
                setDocTypeInputs([{label:'Public Data Entry With Upload Document'}])
            }else if(LoginDetails.loginMode == 'VSWS'){
                setDocTypeInputs([{ label: 'Public Data Entry With Document Generation'}])
            }else{
                setDocTypeInputs([{ 'label': "Public Data Entry With Upload Document" }, { 'label': "Public Data Entry With Document Generation" }]) 
            }
        }      
    }, []);

    const GetDistrictList = async () => {
        let result = await CallingAxios(useGetDistrictList());
        if (result.status) {
            // console.log(result.data);
            // setDistrictList(result.data ? result.data : []);
            let sortedResult = result.data.sort((a, b) => a.name < b.name ? -1 : 1)
            setDistrictList(result.data ? sortedResult : []);
        }
        else {
            ShowMessagePopup(false, "District Fetch Failed", "")
        }
    }
    const GetMandalList = async (id: any, part: any) => {
        let result = await CallingAxios(useGetMandalList(id));
        if (result.status) {
            // console.log(result.data);
            // setDistrictList(result.data ? result.data : []);
            let sortedResult = result.data.sort((a, b) => a.name < b.name ? -1 : 1)
            if (part === 1) {
                setMandalList(sortedResult);
            } else {
                setMandalList2(sortedResult);
            }

        }
        else {
            ShowMessagePopup(false, "Mandals list fetch Failed", "")
        }
    }
    const GetVillageList = async (id: any, distCode: any, part: any) => {

        let result = await CallingAxios(useGetVillagelList(id, distCode));
        if (result.status) {
            // console.log(result.data);
            // setDistrictList(result.data ? result.data : []);
            let sortedResult = result.data.sort((a, b) => a.name < b.name ? -1 : 1);

            if (part === 1) {
                if (GetstartedDetails.regWith === "Sro") {
                    setVillageList(sortedResult);
                } else {
                    let vswArry: any;
                    sortedResult.map((m: any) => {
                        vswArry = vswArry === undefined ? m.id : vswArry + ',' + m.id
                    })
                    let vswresult = await CallingAxios(UseGetVgForPpAndMV('vsw', vswArry));
                    let fList: any = [];

                    vswresult && vswresult.data && vswresult.data.length > 0 && vswresult.data.map((x: any) => {
                        let Obj = {
                            id: x.VILLAGE_CODE,
                            name: x.VILLAGE_NAME,
                            WEBLAND_CODE: x.WEBLAND_CODE,
                            sroCode: x.BIFURCATED_SRCD,
                            sroOffice: x.BIFURCATED_SRNAME
                        };
                        fList = [...fList, Obj]
                    })
                    setVillageList(fList);
                    setVswRefVilList(sortedResult)
                }
            } else {
                setVillageList2(sortedResult);
            }

        }
        else {
            ShowMessagePopup(false, "Village List Fetch Failed", "")
        }
    }


    const GetSROOfficeList = async (id: any, part) => {
        let result = await CallingAxios(getSroDetails(id));
        if (result.status) {
            if (part === 1) {
                let sortedResult = result.data.sort((a, b) => a.name < b.name ? -1 : 1)
                setSROOfficeList(sortedResult);
            }
            else {
                let sortedResult = result.data.sort((a, b) => a.name < b.name ? -1 : 1)
                setSROOfficeList2(sortedResult);
            }

        }
    }
    const GetLinkedSROOfficeList = async (id: any) => {
        let result = await CallingAxios(getLinkedSroDetails(id));
        if (result.status) {
            // if (part === 1) {
            //     let sortedResult = result.data.sort((a, b) => a.name < b.name ? -1 : 1)
            //     setSROOfficeList(sortedResult);
            // }
            // else {
            let sortedResult = result.data.sort((a, b) => a.name < b.name ? -1 : 1)
            setSROOfficeList2(sortedResult);
            //}

        }
    }

    const ongenlinkdocClick = () => {
        setGetlinkDocument(!getlinkDocument)
        setLinkDocument({ linkDocNo: "", regYear: "", scheduleNo: "", district: "", mandal: "", village: "", sroOffice: "", sroCode: "" });
        setReceivedLinkDocument({ party: [], property: [], FetchedDetails: [] });
        setSelectionFromLinkDoc({ property: [], party: [], FetchedDetails: [] });
        setMandalList2([]);
        setVillageList2([]);
        setSROOfficeList2([]);
    }

    const LinkDocData = () => {
        if (LinkDocument.linkDocNo != "" && LinkDocument.regYear != "" && LinkDocument.sroOffice != "") {
            if (ReceivedLinkDocument && ReceivedLinkDocument.party && ReceivedLinkDocument.party.length) {
                let party = [...ReceivedLinkDocument.party];
                // console.log(party);
                // console.log(LinkDocument);
                if (party.filter(o => o.SR_CODE == LinkDocument.sroCode && o.REG_YEAR == LinkDocument.regYear && o.DOCT_NO == LinkDocument.linkDocNo).length) {
                    ShowMessagePopup(false, "This link document is already added", "");
                } else {
                    GetLinkDocDetails();
                }
            } else {
                GetLinkDocDetails();
            }
        }
        else {
            ShowMessagePopup(false, "Please fill all the details of the link document", "");
        }
    }


    const GetStructureDetails = async () => {
        let result = await UseGetStructureDetails({ sroCode: LinkDocument.sroCode, linkDoc_No: LinkDocument.linkDocNo, regYear: LinkDocument.regYear });
        if (result.status) {
            return result.data;
        } else {
            return [];
        }
    }


    const GetLinkDocDetails = async () => {
        Loading(true);
        let result = await UseGetLinkDocDetails(LinkDocument.sroCode, LinkDocument.linkDocNo, LinkDocument.regYear);
        if (result.status) {
            let data: any = { ...ReceivedLinkDocument };
            if (result.data.party.length > 0) {
                data.FetchedDetails.push(LinkDocument);

                for (let singleParty of result.data.party) {
                    data.party.push({ ...singleParty, docWithYear: singleParty.DOCT_NO + ' / ' + singleParty.REG_YEAR });
                }
                let structure = await GetStructureDetails();

                for (let singleProperty of result.data.property) {
                    let PPResult = await PPCheck(singleProperty);
                    data.property.push({ ...singleProperty, structure: structure, PPCheck: PPResult, docWithYear: singleProperty.DOCT_NO + ' / ' + singleProperty.REG_YEAR });
                }
                Loading(false);
                setReceivedLinkDocument(data);
            }
            else {
                Loading(false);
                data.FetchedDetails = [];
                ShowMessagePopup(false, "Link document details not found", "");
            }
        }
        else {
            Loading(false);
            ShowMessagePopup(false, "Link document details fetch failed", "");
        }
    }
    const DeleteItemLinkDocument = (sindex: number) => {
        let myLinkDocument = [...PropertyDetails.isDocDetailsLinked];
        myLinkDocument.splice(sindex, 1);
        setPropertyDetails({ ...PropertyDetails, isDocDetailsLinked: myLinkDocument })
    }

    const onChangeLinkDoc = (e: any) => {
        let TempDetails: any = { ...LinkDocument };
        let addName = e.target.name;
        let addValue = e.target.value;
        if (addName == "district") {
            if (addValue == '') { return; }
            setMandalList2([]);
            setVillageList2([]);
            setSROOfficeList2([]);
            let selected = DistrictList.find(e => e.name == addValue);
            // console.log(selected);
            if (selected)
                //GetMandalList(selected.id, 2);
                GetLinkedSROOfficeList(selected.id);
        }
        // else if (addName == "mandal") {
        //     if (addValue == '') { return; }
        //     setVillageList2([]);
        //     setSROOfficeList2([]);
        //     let selected = MandalList2.find(e => e.name == addValue);
        //     let mandalCode = selected ? selected.id : "";
        //     TempDetails = { ...TempDetails, mandalCode }
        //     if (selected)
        //         GetVillageList(selected.id, 2);
        // } 
        // else if (addName == "village") {
        //     if (addValue == '') { return; }
        //     setSROOfficeList2([]);
        //     let selected = VillageList2.find(e => e.name == addValue);
        //     let villageCode = selected ? selected.id : "";
        //     TempDetails = { ...TempDetails, villageCode }
        //     if (selected)
        //         GetSROOfficeList(selected.id, 2);
        // }
        else if (addName == "linkDocNo") {
            //addValue = addValue.replace(/[^\w\s/-]/gi, "");
            //addValue = addValue.replace(/[0-9]/gi, "");
            //let errorLabel = ""
            // if (String(addValue).length < 6) {
            //     errorLabel = "Enter 10 Digits Number";
            // }
            // if (addValue.length > 6) {
            //     addValue = addValue.substring(0, 6);
            // }
        }
        else if (addName == "sroOffice") {
            if (addValue == '') { return; }
            if (SROOfficeList && addValue != "") {
                let sroCode = (SROOfficeList2.find(x => x.name == addValue)).id;
                TempDetails = { ...TempDetails, sroCode }
            }
        } else if (addName == "regYear") {
            if (addValue.length > 4) {
                addValue = LinkDocument.regYear;
            }
        } else if (addName == "scheduleNo") {
            if (addValue.length > 2) {
                addValue = LinkDocument.scheduleNo;
            }
        }
        setLinkDocument({ ...TempDetails, [addName]: addValue });
    }

    const getFrankAmount = async (serialno) => {
        console.log("Fetching frank amount for", serialno);        
        try {
            let data = { serialno: serialno };                        
            let res = await CallingAxios(UseFrankApi(data));            
            if (res.status === true) {                
                setPropertyDetails(prevState => {
                    const updatedState = {...prevState,stampPaperValue: res.data.amount_frank.toString()};                    
                    console.log("Updated PropertyDetails", updatedState);
                    return updatedState;
                });
                setGetstartedDetails(prevState => {
                    const updatedState = {...prevState,stampPaperValue: res.data.amount_frank.toString()};                    
                    console.log("Getstarted Details", updatedState);
                    return updatedState;
                });                
                ShowMessagePopup(true, "Franking Amount Fetched Succesfully","");
                return res.data.amount_frank;
            } else {
                ShowMessagePopup(false, `Given Franking ID is Invalid`,"");
                setPropertyDetails(prevState => ({...prevState,frankingId: "",stampPaperValue: ""}));
                setGetstartedDetails(prevState => ({...prevState,frankingId: "",stampPaperValue: ""}));               
                return null;
            }
        } catch (error) {
            console.error("Error fetching franking amount:", error);
            ShowMessagePopup(false, "Error", "Failed to fetch franking amount", "");
            setPropertyDetails(prevState => ({...prevState,stampPaperValue: ""}));
            setGetstartedDetails(prevState => ({...prevState,stampPaperValue: ""}));               
            return null;
        }
    }

    const onChange = (event: any) => {
        const loginDetails = JSON.parse(localStorage.getItem('LoginDetails') || '{}');
        const FilterMapforCRDA = [{
                "major": "01",
                "minor": "25"
            }  ,{
                "major": "06",
                "minor": "02"
            } ,{
                "major": "08",
                "minor": "05"
            } ];
            const FilterMapforAPIIC = [
              {
                "major": "08",
                "minor": "07"
            } ];
        let TempDetails: any = { ...PropertyDetails };
        let TempGetstartedDetails = { ...GetstartedDetails }
        let addName = event.target.name;
        let addValue = event.target.value;

        if(GetstartedDetails.registrationType && GetstartedDetails.registrationType.TRAN_DESC != "Lease [కౌలు]")
            SetRentButn(true) 

        // if (addName == "typeOfStamps") {

        // } else if (addName == "typeOfStamps") {
        //     const prefix = 'AP';
        //     let includePattern = prefix + addValue.substr(prefix.length);
        //     setPropertyDetails({ ...TempDetails, ['frankingId']: includePattern });
        // }

        // window.alert(JSON.stringify(addName))

        if (addName == "docProcessType") {
            TempGetstartedDetails = { ...TempGetstartedDetails, registrationType: "", documentNature: "" }
            setDocumentNatureList([]);
            setregistrationTypeList([]);
        } else if (addName == "regWith") {
            TempGetstartedDetails = { ...TempGetstartedDetails, regWith: addValue };
            setMandalList([]);
            setVillageList([]);
            setSROOfficeList([]);
        }
        else if (addName == "district") {
            if (addValue == '') { return; }
            setMandalList([]);
            setVillageList([]);
            setSROOfficeList([]);
            let selected = DistrictList.find(e => e.name == addValue);
            let distCode = selected ? selected.id : "";
            TempDetails = { ...TempDetails, distCode }
            TempGetstartedDetails = { ...TempGetstartedDetails, distCode }
            if (selected)
                GetMandalList(selected.id, 1);
            // GetSROOfficeList(selected.id, 1);
        } else if (addName == "mandal") {
            if (addValue == '') { return; }
            setVillageList([]);
            setSROOfficeList([]);
            let selected = MandalList.find(e => e.name == addValue);
            let mandalCode = selected ? selected.id : "";
            TempDetails = { ...TempDetails, mandalCode }
            TempGetstartedDetails = { ...TempGetstartedDetails, mandalCode }
            if (selected)
                GetVillageList(selected.id, TempGetstartedDetails.distCode, 1);
        } else if (addName == "village") {
            if (addValue == '') { return; }
            setSROOfficeList([]);
            let selected: any;
            let villCard: any
            if (GetstartedDetails.regWith == "Vsws") {
                villCard = VillageList.find(e => e.name.toUpperCase() == addValue.toUpperCase());
                selected = vswRefVilList.find(e => e.name.toUpperCase() == addValue.toUpperCase());
                TempGetstartedDetails = { ...TempGetstartedDetails, regWithCode: "V", regWithValue: villCard.id }
            } else {
                selected = VillageList.find(e => e.name == addValue);
                TempGetstartedDetails = { ...TempGetstartedDetails, regWithCode: "S" }
            }
            let villageCode = selected ? selected.id : "";

            // let villageCode =GetstartedDetails.regWith =="Vsws" ? selMVillId : selected.id;
            let sroOffice = selected && GetstartedDetails.regWith == "Vsws" ? selected.sroName : selected.sroOffice;
            // let sroCode =selected ? String(selected.sroCode):"";
            if (GetstartedDetails.regWith == "Vsws") {
                TempDetails = { ...TempDetails, villageCode, sroOffice, sroCode: villCard.sroCode }
                TempGetstartedDetails = { ...TempGetstartedDetails, villageCode, sroOffice, sroCode: villCard.sroCode, docProcessCode: "P" };
            } else if (loginDetails.loginMode === "VSWS" && villageCode !== loginDetails.webCode.substring(0, 7)) {                                       
                ShowMessagePopup(false, "You are not allowed to apply for anywhere registration.", "");
                addValue = ""; 
                TempDetails = { ...TempDetails, villageCode: "", sroOffice: "" }
                TempGetstartedDetails = { ...TempGetstartedDetails, villageCode: "", sroOffice: "" };                
            } else {
                TempDetails = { ...TempDetails, villageCode, sroOffice }
                TempGetstartedDetails = { ...TempGetstartedDetails, villageCode, sroOffice, docProcessCode: "P" };
            }

            // if (selected && GetstartedDetails.regWith == "Sro")
                GetSROOfficeList(selected.id, 1);
        }
        else if (addName == "registrationType") {
            TempDetails = { ...TempDetails, documentNature: {} }
            TempGetstartedDetails = { ...TempGetstartedDetails, documentNature: {} }
            if (addValue == '') { return; }
            addValue = FilterTypes(addValue);

            let NewData = [];
            let data;
            if (GetstartedDetails.docProcessType == "Public Data Entry With Upload Document") {
                data = addValue != null ? regType.WithoutDoc.filter(x => x.TRAN_MAJ_CODE == addValue.TRAN_MAJ_CODE && x.TRAN_MIN_CODE != "00") : [];
            }
            else {
                data = addValue != null ? regType.WithDoc.filter(x => x.TRAN_MAJ_CODE == addValue.TRAN_MAJ_CODE && x.TRAN_MIN_CODE != "00") : [];
            }
            if (loginDetails?.loginEmail === 'CRDA' && ["01", "06", "08"].includes(addValue.TRAN_MAJ_CODE)) {   
                let filterredMap:any = FilterMapforCRDA.filter(x => x.major==addValue.TRAN_MAJ_CODE);
                const requiredMinCode = filterredMap[0].minor;
                data = data.filter(x => x.TRAN_MIN_CODE === requiredMinCode);
            }
            if (loginDetails?.loginEmail === 'APIIC' && ["08"].includes(addValue.TRAN_MAJ_CODE)) {   
                let filterredMap:any = FilterMapforAPIIC.filter(x => x.major==addValue.TRAN_MAJ_CODE);
                const requiredMinCode = filterredMap[0].minor;
                data = data.filter(x => x.TRAN_MIN_CODE === requiredMinCode);
            }
            if (addValue.TRAN_MAJ_CODE == "04") {
                setGetlinkDocument(false);
                setLinkDocument({ linkDocNo: "", regYear: "", scheduleNo: "", district: "", mandal: "", village: "", sroOffice: "", sroCode: "" });
                setReceivedLinkDocument({ party: [], property: [], FetchedDetails: [] });
                setSelectionFromLinkDoc({ property: [], party: [], FetchedDetails: [] });
                setMandalList2([]);
                setVillageList2([]);
                setSROOfficeList2([]);
            }
            if (addValue.TRAN_MAJ_CODE === "20" || Number(addValue.TRAN_MAJ_CODE) >= 30 && Number(addValue.TRAN_MAJ_CODE) <= 44) {
                setBook3Nd4Prop(true);
            } else if (addValue.TRAN_MAJ_CODE === "06") {
                setBook3Nd4Prop(true);
            } else {
                setBook3Nd4Prop(false);
            }
            if (addValue.TRAN_MAJ_CODE === "05" || addValue.TRAN_MAJ_CODE === "06") {
                setStatusBar(true)
            } else {
                setStatusBar(false)
            }
            // console.log(data);
            data.map(x => NewData.push(x.TRAN_DESC))
            let filteredList = NewData;
            if (LoginDetails.loginMode === 'VSWS') {
                filteredList = NewData.filter(
                    (item, index) => index === 3
                );
                setDocumentNatureList(filteredList)
            }
            else {
                if(addValue.TRAN_MAJ_CODE == "04"){
                filteredList = NewData.filter((_, index) => index !== 3);
                setDocumentNatureList(filteredList)
                }else{
                    setDocumentNatureList(filteredList)
                }
            }
            if ((loginDetails.loginEmail !== 'APIIC'&& addValue.TRAN_MAJ_CODE == "08") && LoginDetails.loginMode !== 'VSWS' ) {
                filteredList = NewData.filter(
                    (item, index) => index !== NewData.indexOf('Unilateral Cancellation Deed by APIIC')
                );
                 NewData =filteredList
                setDocumentNatureList(NewData);
            }            
        } else if (addName == "documentNature") {
            if (addValue == '') { return; }
            if (addValue !== "") {
                addValue = FilterTypes(addValue);
            }
            if (addValue.TRAN_MAJ_CODE =='01' && (addValue.TRAN_MIN_CODE=='28'|| addValue.TRAN_MIN_CODE=='29')){
                TempGetstartedDetails.amount = '0';
                TempDetails.amount = '0';
                setGOExmp(true)
            }
            else {
                TempGetstartedDetails.amount = '';
                TempDetails.amount = '';
                setGOExmp(false)
            }
            if (addValue.TRAN_MAJ_CODE == "08" && addValue.TRAN_MIN_CODE == "06") {
                TempDetails = { ...TempDetails, docsExcutedBy: "Government Body" };
                TempGetstartedDetails = { ...TempGetstartedDetails, docsExcutedBy: "Government Body" };
            }
            if (addValue.TRAN_MAJ_CODE == "20" && addValue.TRAN_MIN_CODE == "01" || Number(addValue.TRAN_MAJ_CODE) >= 30 && Number(addValue.TRAN_MAJ_CODE) <= 34 || Number(addValue.TRAN_MAJ_CODE) >= 37 && Number(addValue.TRAN_MAJ_CODE) <= 39 || addValue.TRAN_MAJ_CODE == "41" || addValue.TRAN_MAJ_CODE == "42" || addValue.TRAN_MAJ_CODE == "43" && addValue.TRAN_MIN_CODE == "01" || addValue.TRAN_MAJ_CODE == "44") {
                setLInkDocsDisplay(true);
            } else {
                setLInkDocsDisplay(false);
            }
        }
        else if(addName === 'typeOfStamps'){
            setIsStackHoldingIdValidated(false);
            TempDetails = {...TempDetails, stampPaperValue:"0",frankingId:"",stockHoldingId:""};
            TempGetstartedDetails = { ...TempGetstartedDetails,frankingId:"",stockHoldingId:"",stampPaperValue:"0"};

        }
        else if (addName == "stampPaperValue") {
            if (Number(addValue) == 0 && addValue.length > 1) {
                // addValue ="";
                addValue = addValue.substring(0, 1);
                // TempDetails = { ...TempDetails, noOfStampPapers: "0" }
                // TempGetstartedDetails = { ...TempGetstartedDetails, noOfStampPapers: "0" }
            }
            if (PropertyDetails.typeOfStamps === "Non-Judicial Stamp Papers" && addValue > 1000) {
                addValue = "";
                TempDetails = { ...TempDetails, noOfStampPapers: "1" }
                TempGetstartedDetails = { ...TempGetstartedDetails, noOfStampPapers: "1" }
            }
            if (PropertyDetails.typeOfStamps === "StockHolding" && addValue > 1000) {
                addValue = "";
                TempDetails = { ...TempDetails, noOfStampPapers: "1" }
                TempGetstartedDetails = { ...TempGetstartedDetails, noOfStampPapers: "1" }
            }
            let errorLabel = ""
            if(addValue > 1){
                TempDetails = { ...TempDetails, noOfStampPapers: "1" }
                TempGetstartedDetails = { ...TempGetstartedDetails, noOfStampPapers: "1" }
            }
            if (String(addValue).length < 10) {
                errorLabel = "Enter 10 Digits Number";
            }
            if (addValue.length > 10) {
                addValue = addValue.substring(0, 10);
            }
            // if (addValue[0] == "0") {
            //     addValue = "";
            // }
        }
        else if (addName == "frankingId") {
            if (addValue.length == 28) {
                addValue = addValue.substring(0, 28);
                let value = getFrankAmount(addValue);                
            }
            TempDetails = {...TempDetails, serialno: addValue};
            TempGetstartedDetails = {...TempGetstartedDetails, stockHoldingId:""};
            // PropertyDetails.stockHoldingId = "";
        }
        else if (addName == "stockHoldingId") {
            setIsStackHoldingIdValidated(false);
            addValue = addValue.replace(/[^A-Za-z0-9]/gi, '');
            if (addValue.length > 15) {
                addValue = addValue.substring(0, 15);
            }
            // PropertyDetails.frankingId = "";
            TempGetstartedDetails = {...TempGetstartedDetails, frankingId:""};
        }
        else if (addName == "sroOffice") {
            if (addValue !== "") {
                let sroCode = (SROOfficeList.find(x => x.name == addValue));
                sroCode = sroCode ? sroCode.id : "";

                TempDetails = { ...TempDetails, sroCode, regWithValue: sroCode }
                TempGetstartedDetails = { ...TempGetstartedDetails, sroCode, regWithValue: sroCode }
            }
        }
        else if (addName == "amount") {
            if (addValue < 0) {
                TempDetails.amount = 0
            }
            let errorLabel = "";
            if (addValue.length < 15) {
                errorLabel = "Enter 15 Digit Valid Number";
            }
            if (addValue.length > 15) {
                addValue = addValue.substring(0, 15);
            }
        }
        else if (addName == "stampPurchaseDate") {
            setIsStackHoldingIdValidated(false);
            if (PropertyDetails.executionDate == null || PropertyDetails.executionDate == '' || PropertyDetails.executionDate == undefined) {
                ShowMessagePopup(false, "Kindly Select Execution Date Before Selecting Stamp Purchase Date ", "");
                addValue = ''
                return false;
            }
            if (PropertyDetails.typeOfStamps == "StockHolding" && (PropertyDetails.stockHoldingId == null || PropertyDetails.stockHoldingId == '' || PropertyDetails.stockHoldingId == undefined)) {
                ShowMessagePopup(false, "Kindly Select StockHolding Id Before Selecting Stamp Purchase Date ", "");
                addValue = ''
                return false;
            }
        }
        else if (addName == "executionDate") {
            var date = new Date(addValue);
            var dd = String(date.getDate()).padStart(2, '0');
            var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = date.getFullYear();
            var hours = String(new Date().getUTCHours() + 1).padStart(2, '0');
            var minutes = String(new Date().getUTCMinutes() + 1).padStart(2, '0');
            var sec = String(new Date().getUTCSeconds() + 1).padStart(2, '0');
            // var date1 = mm + '/' + dd + '/' + yyyy;
            // addValue = date1;

            setMaxDate(mm + '/' + dd + '/' + yyyy);
            if (addName == "executionDate" && PropertyDetails.stampPurchaseDate !== "") {
                TempDetails.stampPurchaseDate = ''
                var date = new Date(addValue);
                var dd = String(date.getDate()).padStart(2, '0');
                var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
                var yyyy = date.getFullYear();
                setMaxDate(mm + '/' + dd + '/' + yyyy)
                //setPropertyDetails({...PropertyDetails, stampPurchaseDate :PropertyDetails.stampPurchaseDate});
            }
        }
        setGetstartedDetails({ ...TempGetstartedDetails, [addName]: addValue });
        setPropertyDetails({ ...TempDetails, [addName]: addValue });
    }

    const onSubmit = async (e: any) => {
        e.preventDefault();
        if(GetstartedDetails.typeOfStamps == "Franking"){
            GetstartedDetails ={...GetstartedDetails, frankingId: GetstartedDetails.frankingId}
        }
        if(GetstartedDetails.typeOfStamps == "StockHolding"){
            GetstartedDetails ={...GetstartedDetails, stockHoldingId:"IN-AP"+""+GetstartedDetails.stockHoldingId}
        }
        if(GetstartedDetails.typeOfStamps == "Non-Judicial Stamp Papers"){
            // if(PropertyDetails.stampPaperValue < 1){
            //     return ShowMessagePopup(false, "Stamp Paper value must be greater than 0", "");
            // }
            GetstartedDetails={...GetstartedDetails,nonJudicialStamps:nonJudicialList,stampPaperValue:PropertyDetails.stampPaperValue,noOfStampPapers:String(PropertyDetails.noOfStampPapers)}
        }
        // if (PropertyDetails.stampPaperValue == "0") {
        //     ShowMessagePopup(false, "stampPaperValue Can Not be Zero", "");
        // }
        // window.alert(JSON.stringify(GetstartedDetails?.frankingId?.length));
        if (GetstartedDetails.docsExcutedBy == "Government Body") { GetstartedDetails.docsExcutedBy = "GovtBody" }
        if(!rentButn && GetstartedDetails.registrationType && GetstartedDetails.registrationType.TRAN_DESC == "Lease [కౌలు]"){
            ShowMessagePopup(false, "Lease Period And Rental perod Should be Equal", "");
        }
        // else if(GetstartedDetails.registrationType && GetstartedDetails.registrationType.TRAN_DESC == "Lease [కౌలు]" && !isFutureDate(leaseData.wef, leaseData.lPeriod)){
        //     ShowMessagePopup(false, "Invalid Effective Date. Please enter a date such that the lease does not expire on or before today's date.", "")
        // }
        else if(GetstartedDetails?.frankingId && GetstartedDetails?.frankingId?.length != 28){
            ShowMessagePopup(false,"Plese Enter Valid FrankingID","")
        }
        else if(GetstartedDetails?.stockHoldingId && GetstartedDetails?.stockHoldingId?.length != 20){
            ShowMessagePopup(false,"Plese Enter Valid StockHoldingID","")
        }
        else if (GetstartedDetails.registrationType && GetstartedDetails.documentNature && GetstartedDetails.district && GetstartedDetails.sroOffice) {
            if (getlinkDocument && ReceivedLinkDocument.party.length) {
                await SaveSelectedLinkDoc();
            }
            else {
                await CallGetstartedAPI();
            }
        }
        else {
            ShowMessagePopup(false, "Kindly Fill Mendatory Fields to Proceed", "");
        }

    }

    const CallGetstartedAPI = async () => {
        let result, marketValue
        if(GetstartedDetails.registrationType && GetstartedDetails.registrationType.TRAN_DESC == "Lease [కౌలు]"){
            marketValue = (leaseData.lPeriod > 30 || GetstartedDetails?.documentNature?.TRAN_MIN_CODE === "06") ? 0 : Math.round(Number(leasegranTotal) / Number(leaseData.lPeriod) + Number(leaseData.advance) + Number(leaseData.muncipalTax))
            const encryptedMarketValue = encryptWithAES(`${marketValue}`)
            const details = {...GetstartedDetails, leasePropertyDetails: { ...leaseData ,marketValue: encryptedMarketValue} }
            result = await CallingAxios(UseCreateApplication(details));
        }else{
            if (LoginDetails.loginMode === 'VSWS') {
            GetstartedDetails.docProcessType = 'Public Data Entry With Document Generation'; 
            GetstartedDetails.regWith  = 'Vsws'
            GetstartedDetails.regWithCode  = 'V'
            }
            if (!(GetstartedDetails?.documentNature?.TRAN_MAJ_CODE === "04" && GetstartedDetails?.documentNature?.TRAN_MIN_CODE === "04") && GetstartedDetails?.documentNature?.TRAN_MAJ_CODE !== "02") {                
                if (GetstartedDetails.registrationType) {
                    delete GetstartedDetails.registrationType.PARTY3;
                    delete GetstartedDetails.registrationType.PARTY3_CODE;
                }
            }
            
            result = await CallingAxios(UseCreateApplication(GetstartedDetails))
        }
        if (result.status) {
            let covData = {
                documentId: result.data.applicationId,
                natureType: GetstartedDetails.registrationType.TRAN_DESC,
                covanants: covenatsTypeFinder(GetstartedDetails.registrationType)
            }
            // await UseSaveCovinant(covData);
            dispatch(SaveGetstartedDetails(result.data));
            
            localStorage.setItem("GetApplicationDetails", JSON.stringify(result.data));
            if(GetstartedDetails.registrationType && GetstartedDetails.registrationType.TRAN_DESC == "Lease [కౌలు]")
                ShowMessagePopup(true, "Lease rental details added succesfully with MarketValue:" + marketValue + ".", "")
            redirectToPage('/PartiesDetailsPage');
        }
        else {
            ShowMessagePopup(false, result.message.message || "Get Application Details Failed", "");
        }
    }

    const covenatsTypeFinder = (key) => {
        switch (key.TRAN_MAJ_CODE) {
            case "01": return covenantType.saleMessage;
            case "02": return covenantType.mortgageMessage;
            case "03": return covenantType.giftMessage;
            default: return [];
        }
    }

    const SaveSelectedLinkDoc = async () => {
        let MyWaitingTime = 0;
        let DocCreateResult = await CallingAxios(UseCreateApplication(GetstartedDetails));
        if (DocCreateResult.status) {
            dispatch(SaveGetstartedDetails(DocCreateResult.data));
            localStorage.setItem("GetApplicationDetails", JSON.stringify(DocCreateResult.data));
            DocCreateResult = DocCreateResult.data;
            SelectionFromLinkDoc.property.map(async x => {
                let SelectedProperty = ReceivedLinkDocument.property[parseInt(x)];
                let MappedProperty: any = await DocumentPropertyMapper(SelectedProperty);
                let linkDetails: any = [];
                if (MappedProperty.sroCode != MappedProperty.jurisdiction) {
                    let data: any = await CallingAxios(UseGetLocationDetails(MappedProperty.jurisdiction));
                    if (data.status == true) {
                        let jurisdictionDetails: any = data.data.filter((x: any) => Number(x.id) === Number(MappedProperty.villageCode));
                        if (jurisdictionDetails && jurisdictionDetails.length > 0) {
                            MappedProperty.district = jurisdictionDetails[0].distName;
                            MappedProperty.sroOffice = jurisdictionDetails[0].sroName;
                            MappedProperty.sroCode = MappedProperty.jurisdiction;
                            MappedProperty.districtCode = jurisdictionDetails[0].distCode;
                        } else {
                            MappedProperty.district = data.data[0].distName;
                            MappedProperty.sroOffice = data.data[0].sroName;
                            MappedProperty.sroCode = MappedProperty.jurisdiction;
                            MappedProperty.districtCode = data.data[0].distCode;
                        }
                    }

                }
                // SelectedProperty.structure.map(x => { linkDetails.push({ ...LinkDocument, scheduleNo: Number(x.SCHEDULE_NO), bookNo: Number(x.BOOK_NO) }) })
                linkDetails = { ...LinkDocument, scheduleNo: SelectedProperty?.SCHEDULE_NO, bookNo: Number(SelectedProperty.BOOK_NO ? SelectedProperty.BOOK_NO : "1") }
                let myProperty = { ...MappedProperty, applicationId: DocCreateResult.applicationId, isLinkedDocDetails: true, LinkedDocDetails: linkDetails }
                if (!await SaveProperty(myProperty)) { return; }
            });

            SelectionFromLinkDoc.party.map(async (x, i) => {
                let SelectedParty = ReceivedLinkDocument.party[parseInt(x)];
                SelectedParty = { ...SelectedParty, myRepresentSubType: GetstartedDetails?.registrationType?.PARTY1_CODE }
                if (SelectedParty.REG_YEAR != new Date().getFullYear()) {
                    let agDiff = new Date().getFullYear() - SelectedParty.REG_YEAR;
                    SelectedParty.AGE = Number(SelectedParty.AGE) + Number(agDiff);
                }
                let MappedParty: any = DocumentClaimantMapper(SelectedParty);
                if(!MappedParty.aadhaar || MappedParty.aadhaar?.length <12){
                    return ShowMessagePopup(false, 'Aadhar Number is Mandatory to add the Party Details', "")
                }
                if(+MappedParty.aadhaar && MappedParty.aadhaar.length==12){
                    MappedParty['aadhar']=MappedParty.aadhaar;
                    MappedParty['aadhaar']=encryptWithAES(MappedParty.aadhaar)
                }else{
                    const decryptedAadhar= decryptWithAES(MappedParty.aadhaar);
                    if(decryptedAadhar && decryptedAadhar.length == 12){
                        MappedParty['aadhar']=decryptedAadhar;
                    }else{
                    return ShowMessagePopup(false, 'Aadhar Number is Mandatory to add the Party Details', "")
                    }
                }
                let myParty = { ...MappedParty, applicationId: DocCreateResult.applicationId, isLinkedDocDetails: true, partyCode: MappedParty.representSubType }
                MyWaitingTime = (MyWaitingTime + (1000 * i) + 1500)
                setTimeout(() => { SaveParty(myParty) }, 1000 * i)
            })
            let covData = {
                documentId: DocCreateResult.applicationId,
                natureType: DocCreateResult.registrationType.TRAN_DESC,
                covanants: covenatsTypeFinder(DocCreateResult.registrationType)
            }
            // await UseSaveCovinant(covData);
            setTimeout(() => { redirectToPage('/PartiesDetailsPage'); }, MyWaitingTime);

        }
        else {
            ShowMessagePopup(false, "Error:" + DocCreateResult.message, "")
        }
    }

    const SaveProperty = async (property: any) => {
        let result = await CallingAxios(UseAddProperty(property));
        if (result.status) {
            return true;
        }
        else {
            ShowMessagePopup(false, "Property Save Failed", "");
            return false;
        }
    }

    const MVCalculator = async (Property) => {
        let data = {}
        let natureUseCode = parseInt(Property.nature_use)
        if (natureUseCode == 21 || natureUseCode == 26 || natureUseCode == 45 || natureUseCode == 46 || natureUseCode == 30) {
            data = {
                floor_no: 0,
                stru_type: "",
                plinth: 0,
                plinth_unit: "",
                stage: 0,
                age: 0,
                sroCode: Number(Property.SR_CODE),
                vill_cd: Property.VILLAGE_CODE,
                locality: "",
                habitation: Property.LOC_HAB_NAME,
                habCode: Property.hab_code,
                wno: 0,
                bno: 0,
                house_no: "",
                nearby_boundaries: "",
                surveyno: Property.SY1,
                nature_use: Property.nature_use,
                land_extent: Number(Property.EXTENT1.substring(0, Property.EXTENT1.length - 1)),
                land_unit: "A",//Property.extentUnit=="SQ. FEET [చదరపు అడుగులు]"?"F":"Y",
                total_floor: null,
                property_type: null,
                property_nature: "RURAL",
                localbody: Number(Property.local_body)
            }
        } else {
            // window.alert(DoorNOIdentifier(Property.HNO));
            data = {
                floor_no: Property.FLOOR_NO == null ? 0 : Property.FLOOR_NO,
                stru_type: Property.structure && Property.structure.length ? Property.structure[0].STRU_TYPE : "0",
                plinth: Number(Property.structure && Property.structure.length ? Property.structure[0].PLINTH : 0),
                plinth_unit: Property.structure && Property.structure.length ? Property.structure[0].UNIT : "",
                stage: Number(Property.structure && Property.structure.length ? Property.structure[0].STAGE_CODE : ""),
                age: Number(Property.structure && Property.structure.length ? Property.structure[0].AGE : 0),
                sroCode: Number(Property.SR_CODE),
                vill_cd: Property.VILLAGE_CODE,
                locality: Property.LOC_HAB_NAME,
                habitation: "",
                wno: Number(Property.WARD_NO),
                bno: Number(Property.BLOCK_NO),
                house_no: DoorNOIdentifier(Property.HNO),
                nearby_boundaries: "",
                surveyno: Property.SY1,
                nature_use: Property.nature_use,
                land_extent: Property.EXTENT1.substring(0, Property.EXTENT1.length - 1),
                land_unit: "A",//Property.extentUnit=="SQ. FEET [చదరపు అడుగులు]"?"F":"Y",
                total_floor: Number(Property.FLOOR_NO ? Property.FLOOR_NO : 0),
                property_type: "APARTMENT",
                property_nature: "URBAN",
                localbody: Number(Property.local_body)
            }
        }
        let result = await CallingAxios(UseMVCalculator(data, "urban"));
        if (result.status) {
            // window.alert(JSON.stringify(result.data, null, 2));
            return result.data
        } else {
            // ShowMessagePopup(false, result.data.message, "");
            return false
        }
    }


    const SaveParty = async (party: any) => {
        if (party?.isLinkedDocDetails == true && party?.relationName == null) {
            party.relationName = "";
        }
        let result = await CallingAxios(useSavePartyDetails(party));
        if (result.status) {
            return true;
        }
        // else {
        //     ShowMessagePopup(false,"Party save failed", "");
        //     return false;
        // }
    }

    const RemoveLinkDoc = (SingleFetchDocument) => {
        let FetchedDetails = [...ReceivedLinkDocument.FetchedDetails];
        for (let i = FetchedDetails.length - 1; i >= 0; i--) {
            if (FetchedDetails[i]["sroCode"] == SingleFetchDocument.sroCode && FetchedDetails[i]["regYear"] == SingleFetchDocument.regYear && FetchedDetails[i]["linkDocNo"] == SingleFetchDocument.linkDocNo) {
                FetchedDetails.splice(i, 1);
            }
        }
        let party = [...ReceivedLinkDocument.party];
        for (let i = party.length - 1; i >= 0; i--) {
            if (party[i]["SR_CODE"] == SingleFetchDocument.sroCode && party[i]["REG_YEAR"] == SingleFetchDocument.regYear && party[i]["DOCT_NO"] == SingleFetchDocument.linkDocNo) {
                party.splice(i, 1);
            }
        }

        let property = [...ReceivedLinkDocument.property];
        for (let i = property.length - 1; i >= 0; i--) {
            if (property[i]["SR_CODE"] == SingleFetchDocument.sroCode && property[i]["REG_YEAR"] == SingleFetchDocument.regYear && property[i]["DOCT_NO"] == SingleFetchDocument.linkDocNo) {
                property.splice(i, 1);
            }
        }
        // setLinkDocument({ linkDocNo: "", regYear: "", scheduleNo: "", district: "", sroOffice: "", sroCode: "" });
        setReceivedLinkDocument({ party, property, FetchedDetails });
        setTotalMarketValue(0)
        setSelectedPropertyIndexes(new Set())
    }

    let doctcondtion =PropertyDetails?.documentNature?.TRAN_MAJ_CODE ==='01'&& PropertyDetails?.documentNature?.TRAN_MIN_CODE==='27'


    const PPCheck = async (Property: any) => {
        let data: any = {}
        let natureUseCode = parseInt(Property.nature_use);
        let areaType: any;
        if (natureUseCode == 21 || natureUseCode == 26 || natureUseCode == 45 || natureUseCode == 46 || natureUseCode == 30) {
            areaType = "rural";
            data = {
                ward: null,
                block: null,
                dNo: null,
                sroCode: Property.SR_CODE,
                serveyNo: Property.SY1,
                villageCode: Property.VILLAGE_CODE,
                proField: "A_SNO"
            }
        } else {
            areaType = "urban";
            if (Property.HNO != "") {
                data = {
                    ward: Property.WARD_NO,
                    block: Property.BLOCK_NO,
                    dNo: Property.HNO,//Property.WARD_NO + "-" + Property.BLOCK_NO + "-" + Property.doorNo,
                    sroCode: Property.SR_CODE,
                    serveyNo: null,
                    villageCode: Property.VILLAGE_CODE,
                    proField: "R_DNO"
                }
            }
            else if (Property.SY1 != "") {
                data = {
                    ward: null,
                    block: null,
                    dNo: null,
                    sroCode: Property.SR_CODE,
                    serveyNo: Property.SY1,
                    villageCode: Property.VILLAGE_CODE,
                    proField: "R_SNO"
                }
            }
        }
        let result = await UseGetPPCheck(data, areaType);
        if (result.status) {
            let data = result.data[0]
            for (let value of Object.values(data)) {
                if (value != "NO") {
                    // ShowMessagePopup(false, "Selected Property is Prohibitated", "");
                    return false;
                }
                else {
                    // ShowMessagePopup(true, "PP-Check is clear for Registration", "");
                    return true;
                }
            }
        }
    }

    const KeepInCount = async (e: any, index: any, type: any, data: any) => {
        if (loading) return;
    
        setLoading(true);

        const calculteMarketValue = (tempMarketValue : number) =>{
            if (e.target.checked) {
                setTotalMarketValue(prevValue => prevValue + tempMarketValue);
            } else {
                setTotalMarketValue(prevValue => prevValue - tempMarketValue);
            }
        }
        let party = SelectionFromLinkDoc.party;
        let property = SelectionFromLinkDoc.property;
        let myPropertyArray = [...ReceivedLinkDocument.property];
        let currentProperty = myPropertyArray[index];
        let currentMarketValue = currentProperty?.marketValue || 0;
    
        if (type === "party") {
            if (party.find(x => x === index) === index) {
                party = party.filter(e => e !== index);
            } else {
                party.push(index);
            }
        } else if (type === "property") {
            if (selectedPropertyIndexes.has(index)) {
                if (!property.find(x => x === index)) {
                    property = property.filter(e => e !== index);
                }

                calculteMarketValue(currentMarketValue)
            } else {
                try {
                    let result = await MVCalculator(data);
                    let myProperty = { ...data, marketValue: result.marketValue ? result.marketValue : 0 };

                    currentMarketValue = myProperty.marketValue;
    
                    myPropertyArray.splice(index, 1, myProperty);
    
                    calculteMarketValue(currentMarketValue)
                    
                    setReceivedLinkDocument({ ...ReceivedLinkDocument, property: myPropertyArray });
                    property.push(index);
    
                    setSelectedPropertyIndexes(prev => new Set(prev.add(index)));
                } catch (error) {
                    console.error("Error updating property:", error);

                    calculteMarketValue(currentMarketValue)
                }
            }
        }
    
        setSelectionFromLinkDoc({ ...SelectionFromLinkDoc, party, property });
    
        setLoading(false);
    };

    const showTableData = (arr) => {
        let i = 0;
        return arr.map((party, index) => {
            if (!EXECUTANT_CODES.includes(party.INDGP_CODE)) { return ''; }
            else {
                i = i + 1;
                return (
                    <tr key={index}>
                        <td>{i}</td>
                        <td>{party.docWithYear}</td>
                        <td>{party.INDGP_NAME}</td>
                        <td>{party.INDGP_CODE}</td>
                        <td>{party.R_CODE}</td>
                        <td>{party.R_NAME}</td>
                        <td>{party.ADDRESS}</td>
                    </tr>
                )
            }
        })
    }

    const onChangeLease = (e: any) => {
        let addName = e.target.name;
        let addValue = e.target.value;
        if(addValue == 0){
            addValue ="";
        }
        if(addName ==="lPeriod"){
            setLeaseData({ ...leaseData, rentalDetails:[] });
        }
        setLeaseData({ ...leaseData, [addName]: addValue });
        setPropertyDetails({ ...PropertyDetails,leaseDetails:leaseData});
    }

    const addTableRows = ()=>{
        let rowsInput={
            sNo :rentalRowData.length + 1,
            rentalPeriod:'',
            rentalAmount:'',
            renatmonthlyOrYearly:'Y'  
        } 
        SetrentalRowData([...rentalRowData, rowsInput])
    }

    const onRentalLease =(i:any,e:any)=>{
        e.preventDefault();
        let { name, value } = e.target;
        // window.alert(JSON.stringify(i))
        // let trp:any= 0;let grAmount:any=0;
        if(name === "rentalPeriod" || name =="rentalAmount"){
            value = Number(value)
        }
        let rowsInput :any = [...rentalRowData];
        if(String(value).startsWith("0")){
            value =""
        }
        let trp:any= 0;let grAmount:any=0;
        if(PropertyDetails.mode == "edit"){
            if(name === "rentalPeriod"){
                rowsInput[i] ={...rowsInput[i],[name]:value};
                if(value == leaseData.lPeriod && rentalRowData && rentalRowData.length === 1){
                    SetRentButn(true);
                    // SetTrpVal(value);
                }else{
                    rowsInput.map((rp:any)=>{
                       trp = Number(trp) + Number(rp.rentalPeriod);
                    //    SetTrpVal({...});
                    });
                    if(trp > Number(leaseData.lPeriod)){
                        rowsInput[i][name] = "";
                        ShowAlert(false,"Rent Period Should be Equal to Lease Period");
                    }
                    if(trp >= Number(leaseData.lPeriod)){
                        SetRentButn(true);

                    }else{
                        SetRentButn(false);
                    }
                }
                if(rowsInput[i]["rentalAmount"] != ""){
                    let tAmt:any =  Number(rowsInput[i]["rentalAmount"]) * value;
                    rowsInput[i] ={...rowsInput[i],"totalAmount":tAmt};
                }
            }else if(name === "rentalAmount"){
                let tAmt:any =  Number(rowsInput[i]["rentalPeriod"]) * value;
                rowsInput[i] ={...rowsInput[i],"totalAmount":tAmt,[name]:value};
            }else{
                rowsInput[i] ={...rowsInput[i],[name]:value};
            }
            if(rowsInput[i]["rentalPeriod"] != "" && rowsInput[i]["rentalAmount"] !=""){
                rowsInput.map((rp:any)=>{
                    grAmount = (Number(grAmount) + rp["totalAmount"])
                });
            }
        }else{

            if(name === "rentalPeriod" ){
                if(String(value).startsWith("0")){
                    value =""
                }
                // leaseData.lPeriod
                rowsInput[i][name] = value;
                // window.alert(JSON.stringify(rentalRowData))
                if(value == leaseData.lPeriod && rentalRowData && rentalRowData.length === 1){
                    SetRentButn(true);
                    // SetTrpVal(value);
                }else{
                    rentalRowData.map((rp:any)=>{
                        //  window.alert(JSON.stringify(rp.rentalPeriod))
                       trp = Number(trp) + Number(rp.rentalPeriod);
                    //    SetTrpVal({...});
                    });
                    if(trp > Number(leaseData.lPeriod)){
                        rowsInput[i][name] = "";
                        ShowAlert(false,"Rent Period Should be Equal to Lease Period");
                    }
                    if(trp >= Number(leaseData.lPeriod)){
                        SetRentButn(true);

                    }else{
                        SetRentButn(false);
                    }
                }

                if(rowsInput[i]["rentalAmount"] != ""){
                    rowsInput[i]["totalAmount"] =  Number(rowsInput[i]["rentalAmount"]) * value;
                }

            }else if(name === "rentalAmount"){
                rowsInput[i]["totalAmount"] =  Number(rowsInput[i]["rentalPeriod"]) * value;
                rowsInput[i][name] = value; 
            }
            else{
                rowsInput[i][name] = value; 
            }
            if(rowsInput[i]["rentalPeriod"] != "" && rowsInput[i]["rentalAmount"] !=""){
                rentalRowData.map((rp:any)=>{
                    grAmount = (Number(grAmount) + rp["totalAmount"])
                });
            }

        }
        SetrentalRowData(rowsInput);
        SetleasegranTotal(grAmount);
        setLeaseData({ ...leaseData, rentalDetails:rentalRowData });
        setPropertyDetails({ ...PropertyDetails,leaseDetails:leaseData});

    }
    const handleAddStamp = async (e: any) => {
        let result = await CallingAxios(validateNonJudicialStamps({ ...nonJudicialStamps }));
        if (result.status && result.data.length > 0) {
            if (parseInt(PropertyDetails.stampPaperValue) + result.data[0]?.DENOMINATION > 1000) {
                return ShowMessagePopup(false, "You can't add Rs.1000 more than for stamps", "")
            }
            setNonJudicialList([...nonJudicialList, { ...nonJudicialStamps, value: result.data[0]?.DENOMINATION || 0 }]);
            setPropertyDetails({ ...PropertyDetails, noOfStampPapers: parseInt(PropertyDetails.noOfStampPapers) + 1, stampPaperValue: String(parseInt(PropertyDetails.stampPaperValue || 0) + parseInt(result.data[0]?.DENOMINATION)) })
            setNonJudicialStamps({ mainSerialNumber: "", serialNumber: "", value: "" })
            setShowModal(false)
        } else {
            ShowMessagePopup(false, result.message ?? `Failed to Fetch Stamp Details`, "")
        }
    }

    const handleStampPaperSubmit = async (e: any) => {
        e.preventDefault();
        if (nonJudicialList.length >= 10) {
            return ShowMessagePopup(false, "You can't add more than 10 non judicial stamps", "")
        }
        if (PropertyDetails.stampPaperValue > 1000) {
            return ShowMessagePopup(false, "You can't add Rs.1000 more than for stamps", "")
        }
        const isStampExistInList = nonJudicialList.some(obj=>obj.mainSerialNumber==nonJudicialStamps.mainSerialNumber && obj.serialNumber==nonJudicialStamps.serialNumber)
        if(isStampExistInList){
            return ShowMessagePopup(false, `Stamp Serial No ${nonJudicialStamps.mainSerialNumber} ${nonJudicialStamps.serialNumber} already added.` , "")
        }
        try {
            let result = await CallingAxios(validateNonJudicialStamps({...nonJudicialStamps}));
            if (result.status && result.res?.utilizedStampDataArr && result.res.utilizedStampDataArr.length > 0 && result.res.utilizedStampDataArr[0]?.documentId?.length > 0) {
                setShowModal(true);
            }
            else if (result.status && result.data.length > 0) {
                handleAddStamp(result)
            }
            else {
                ShowMessagePopup(false,result.message??`Failed to Fetch Stamp Details`, "")
            }
        } catch (error) {
            ShowMessagePopup(false, error.message?error.message:`Failed to Fetch Stamp Details`, "")
        }
    }
    const handleDeleteNonJudicialStamps=(values:{mainSerialNumber:string,serialNumber:string,value:number})=>{
        const filteredArr = nonJudicialList.filter((obj:any)=>{return obj.value !==values.value || obj.mainSerialNumber !==values.mainSerialNumber || obj.serialNumber !== values.serialNumber})
        setNonJudicialList(filteredArr);
        const stampsValue= filteredArr.reduce((acc,currentValue)=>acc+parseInt(currentValue.value),0)
        setPropertyDetails({...PropertyDetails,noOfStampPapers:filteredArr.length,stampPaperValue:String(stampsValue)})
    }

    const validateStockHoldingId = async (id: any, date: any) => {
        setIsStackHoldingIdValidated(false);
        let dateString = moment(new Date(date).toISOString()).format("DD-MM-YYYY");
        let result = await CallingAxios(VerifyStockHoldingId({stockid:`IN-AP${id}`, date: dateString}));
        if (result.status) {
            setPropertyDetails((prevState) => ({...prevState, stampPaperValue: result?.data?.CertificatesDetails?.DeficitStampDutyRs?.replace(/,/g, "")}));
            setIsStackHoldingIdValidated(true);
            ShowMessagePopup(true, "Stock Holiding Id is Valid.", "");
        }
        else {
            setIsStackHoldingIdValidated(false);
            ShowMessagePopup(false, result?.message ?? "Something went wrong", "");
            return false;
        }
    }

    const handleStampPurchaseDateBlur = () => {
        if (PropertyDetails.typeOfStamps === "StockHolding" && PropertyDetails.stockHoldingId) {
            validateStockHoldingId(PropertyDetails.stockHoldingId, PropertyDetails.stampPurchaseDate);
        }
    };

    return (

        <div className="PageSpacing">
            <Head>
                <title>Get started - Public Data Entry</title>
            </Head>
            <Container>
                <div className='tabContainerInfo'>
                    <Container>
                        <Row>
                            <Col lg={12} md={12} xs={12} className='p-0 navItems'>
                                <div className='tabContainer'>
                                    <div className={`${styles.BacBtnContainer} ${styles.actionbtn}`} onClick={() => { redirectToPage("/ApplicationListPage") }}><Image alt="Image" height={32} width={28} src='/PDE/images/backarrow.svg' /></div>
                                    <div className='activeTabButton'>Get Started<div></div></div>
                                    <div className='inactiveTabButton'>Parties Details<div></div></div>
                                    <div className='inactiveTabButton'>Property Details<div></div></div>
                                    <div className='inactiveTabButton slotButton' >Slot Booking<div></div></div>
                                </div>
                            </Col>



                            {!statusBar && <Col lg={12} md={12} xs={12} className='p-0 navItems'>
                                <div className='tabContainer DutyfeeContainer table-responsive'>
                                    {/* <div className='activeTabButton'>Duty Fees :<div></div></div> */}
                                    <div className='activeTabButton'>Stamp Duty(₹) : {CalculatedDutyFee.sd_p ? CalculatedDutyFee.sd_p : 0}<div></div></div>
                                    <div className='activeTabButton'>Transfer Duty(₹) : {CalculatedDutyFee.td_p ? CalculatedDutyFee.td_p : 0}<div></div></div>
                                    <div className='activeTabButton'>Registration fee(₹) : {CalculatedDutyFee.rf_p ? CalculatedDutyFee.rf_p : 0}<div></div></div>
                                    {GetstartedDetails?.documentNature && GetstartedDetails?.documentNature?.TRAN_MAJ_CODE === "08" && GetstartedDetails?.documentNature?.TRAN_MIN_CODE === "06" ?
                                    <div className='activeTabButton'>User Charges(₹) : 0<div></div></div>:
                                    <div className='activeTabButton'>User Charges(₹) : 500<div></div></div>
                                    }
                                    {/* <div className='activeTabButton'>User Charges(₹) : 500<div></div></div> */}
                                    <div className='activeTabButton'>Market Value(₹)  : {totalMarketValue}<div></div></div>
                                    <div className='activeTabButton'>{doctcondtion ? 'Auction Value(₹) ':'Consideration Value(₹) ' }: {PropertyDetails.amount ? PropertyDetails.amount : "0"}<div></div></div>
                                    {GetstartedDetails?.documentNature && GetstartedDetails?.documentNature?.TRAN_MAJ_CODE === "08" && GetstartedDetails?.documentNature?.TRAN_MIN_CODE === "06" ?
                                    <div className='activeTabButton'>Total Payable(₹):{Number(CalculatedDutyFee.sd_p) + Number(CalculatedDutyFee.td_p) + Number(CalculatedDutyFee.rf_p) + 0}</div>:
                                    <div className='activeTabButton'>Total Payable(₹):{Number(CalculatedDutyFee.sd_p) + Number(CalculatedDutyFee.td_p) + Number(CalculatedDutyFee.rf_p) + 500}</div>
                                    }                                    
                                </div>
                            </Col>}
                        </Row>
                    </Container>
                </div>
                <Row>

                    <Col lg={12} md={12} xs={12}>
                        <form onSubmit={onSubmit} className={`${styles.mainContainer} ${styles.GetstartedInfo}`}>
                            <Row className='mt-0 mb-0'>
                                <Col lg={12} md={12} xs={12} className='pt-4'>
                                    <div className={styles.DocuementGen}>
                                        <TableInputRadio label={'Select Process'} required={true} options={docTypeInputs} onChange={onChange} name='docProcessType' defaultValue={GetstartedDetails.docProcessType} />
                                    </div>
                                </Col>
                            </Row>

                            <div className={`${styles.gettableContainer} ${styles.getStartedpageCon}`}>
                                <Row className='mt-1'>
                                    <h6 className={styles.getTitle}>Please Select Type of Registration and Nature of Document <span>[దయచేసి నమోదు రకం మరియు దస్తావేజు యొక్క స్వభావాన్ని ఎంచుకోండి]</span></h6>
                                    <Col lg={6} md={6} xs={12}>
                                        <div className='Inputgap'>
                                            <TableText label='Type of Registration [రిజిస్ట్రేషన్ రకం]' required={true} LeftSpace={false} />
                                            {registrationTypeList.length && <TableDropdown required={true} options={registrationTypeList} name={"registrationType"} value={GetstartedDetails.registrationType ? GetstartedDetails.registrationType.TRAN_DESC : null} onChange={onChange} />}
                                        </div>
                                    </Col>
                                    <Col lg={6} md={6} xs={12}>
                                        <div className='Inputgap'>
                                            <TableText label='Nature of Document [దస్తావేజు యొక్క స్వభావం]' required={true} LeftSpace={false} />
                                            <TableDropdown required={true} options={DocumentNatureList} name={"documentNature"} value={GetstartedDetails.documentNature ? GetstartedDetails.documentNature.TRAN_DESC : null} onChange={onChange} />
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                            { GetstartedDetails  && GetstartedDetails.documentNature && GetstartedDetails.documentNature.TRAN_MAJ_CODE === "01" && GetstartedDetails.documentNature.TRAN_MIN_CODE === "04" && 
                            <div className={styles.gettableContainer}>
                                <Row className={styles.getInFavour}>
                                {/* <TableText label='In favour of 1st Party' required={true} LeftSpace={false} /> */}
                                <h4 className={`pb-0 mb-0 ${styles.getInFavour}`}>In favour of 1st Party<span style={{color:'red', marginLeft:'5px'}}>*</span></h4>
                                </Row>
                            </div>}
                            <div className={styles.gettableContainer}>
                                <Row>
                                    <h6 className={`pb-0 mb-0 ${styles.getTitle}`}>Please Select the Sub-Registrar Office Where you want to Register? <span>[దయచేసి సబ్-రిజిస్ట్రార్ కార్యాలయాన్ని ఎంచుకోండి]</span></h6>
                                    {/* <Row className='mt-0 mb-0'>
                                        <Col lg={12} md={12} xs={12} className='pt-0 pb-2'>
                                            <div className={styles.DocuementGen1}>
                                                <TableInputRadio label={'Select'} required={true} options={[{ 'label': "Sro" }, { 'label': "Vsws" }]} onChange={onChange} name='regWith' defaultValue={GetstartedDetails.regWith} />
                                            </div>
                                        </Col>
                                    </Row> */}
                                    {/* <Col lg={6} md={6} xs={12} className='mb-2'>
                                        <div className='Inputgap'>
											<TableText label='' required={true} LeftSpace={false} />
											<TableDropdown required={true} options={regWith.RateList} value={GetstartedDetails.regWith} name={'regWith'} onChange={onChange} />
                                        </div>
                                    </Col> */}
                                    {/* {GetstartedDetails.regWith === "Sro" && <> */}

                                        <Col lg={6} md={6} xs={12} className='mb-2'>
                                            <div className='Inputgap'>
                                                <TableText label='District [జిల్లా]' required={true} LeftSpace={false} />
                                                <TableDropdownSRO required={true} options={DistrictList} name={"district"} value={GetstartedDetails.district} onChange={onChange} />
                                            </div>
                                        </Col>
                                        <Col lg={6} md={6} xs={12}>
                                            <div className='Inputgap'>
                                                <TableText label='Mandal [మండలం]' required={true} LeftSpace={false} />
                                                <TableDropdownSRO required={true} options={MandalList} name={"mandal"} value={GetstartedDetails.mandal} onChange={onChange} />
                                            </div>
                                        </Col>
                                    {/* </>} */}
                                    {/* {GetstartedDetails.regWith === "Sro" ?
                                        <> */}
                                            <Col lg={6} md={6} xs={12}>
                                                <div className='Inputgap'>
                                                    <TableText label='Village [గ్రామం]' required={true} LeftSpace={false} />
                                                    <TableDropdownSRO required={true} options={VillageList} name={"village"} value={GetstartedDetails.village} onChange={onChange} />
                                                </div>
                                            </Col>
                                            <Col lg={6} md={6} xs={12}>
                                                <div className='Inputgap'>
                                                    <TableText label='Sub Registrar Office [సబ్ రిజిస్ట్రార్ కార్యాలయం]' required={true} LeftSpace={false} />
                                                    <TableDropdownSRO required={true} options={SROOfficeList} name={"sroOffice"} value={GetstartedDetails.sroOffice} onChange={onChange} />
                                                </div>
                                            </Col>
                                        {/* </>  */}
                                        {/* // <>
                                        // </>} */}

                                    {/* {GetstartedDetails.regWith === "Vsws" && <Col lg={6} md={6} xs={12}>
                                        <div className='Inputgap'>
                                            <TableText label='Vsws [గ్రామం]' required={true} LeftSpace={false} />
                                            <TableDropdownSRO required={true} options={VillageList} name={"village"} value={GetstartedDetails.village} onChange={onChange} />
                                        </div>
                                    </Col>} */}
                                </Row>
                            </div>
                            <div className={styles.gettableContainer}>
                                {!book3Nd4Prop &&
                                    <div>
                                        <Row className="align-items-end">
                                            <Col lg={4} md={6} xs={12}>
                                                 <div className='Inputgap'>
                                                     <TableText label={doctcondtion?"Auction Value(₹) [మొత్తం వేలం విలువ ]":"Total Consideration Value(₹) [మొత్తం ప్రతిఫలం విలువ]"} required={true} LeftSpace={false} />
                                                     <TableInputText type='number' placeholder='₹' required={true} name={'amount'} value={PropertyDetails.amount} onChange={onChange} min={0} disabled={goExmp}/>
                                                 </div>
                                             </Col>
                                            <Col lg={6} md={6} xs={12}>
                                                <div className='Inputgap'>
                                                    <TableText label={"Document Executed by [దస్తావేజు అమలు చేసే విదానం]"} required={true} LeftSpace={true} />
                                                    {/* <div className={styles.DocuementGen1}> */}
                                                    {GetstartedDetails.documentNature && GetstartedDetails.documentNature.TRAN_MAJ_CODE === "08" && GetstartedDetails.documentNature.TRAN_MIN_CODE === "06" ?
                                                    <TableInputRadio label={'Select'} required={true} options={[{'label': "Government Body" }]} onChange={onChange} name='docsExcutedBy' defaultValue={GetstartedDetails.docsExcutedBy} />:
                                                    <TableInputRadio label={'Select'} required={true} options={[{ 'label': "Individual" }, { 'label': "Government Body" }]} onChange={onChange} name='docsExcutedBy' defaultValue={GetstartedDetails.docsExcutedBy} />
                                                    }{/* </div> */}
                                                </div>

                                            </Col>
                                        </Row>
                                        <div className={styles.divider}></div>
                                    </div>}
                                <Row>
                                    <p className={` ${styles.getTitle} ${styles.HeadingText}`}>Date of Execution Details <span>[అమలు తేదీ వివరాలు]</span></p>
                                    <Col lg={4} md={6} xs={12} className='pb-2'>
                                        <TableText label={"Date of Execution [అమలు తేదీ]"} required={true} LeftSpace={false} />
                                        <TableSelectDate max={(moment(moment().toDate())).format("YYYY-MM-DD")} placeholder='Select Date' required={true} name={'executionDate'} onChange={onChange} value={PropertyDetails.executionDate} />
                                    </Col>
                                    <Col lg={4} md={6} xs={12} className='pb-2'>
                                        <TableText label={"Type Of Stamps"} required={true} LeftSpace={false} />
                                        <TableDropdown required={true} options={DropdownList.TypeOfStampe} name={"typeOfStamps"} value={PropertyDetails.typeOfStamps} onChange={onChange} />
                                    </Col>
                                    {PropertyDetails.typeOfStamps == "Franking" ? <Col lg={4} md={6} xs={12} className='pb-2 stampaperMain'>
                                        <TableText label={PropertyDetails.typeOfStamps + " Id"} required={true} LeftSpace={false} />
                                        <Row>
                                            {/* <Col lg={2} md={2} xs={2} className='stampCol1'><input type="text" className='stockinputInfo' value="" /></Col> */}
                                            <Col lg={10} md={10} xs={10} className='stampCol2'>  <div className='valueinput'>
                                                <TableInputText type='number' dot={false} placeholder='Enter Franking Id' required={true} name={'frankingId'} value={PropertyDetails.frankingId} onChange={onChange} maxLength={28} />
                                                </div></Col>  
                                        </Row>
                                    </Col>
                                        :
                                        PropertyDetails.typeOfStamps == "StockHolding" ? <Col lg={4} md={6} xs={12} className='pb-2 stampaperMain'>
                                            <TableText label={PropertyDetails.typeOfStamps + " Id"} required={true} LeftSpace={false} />
                                            <Row className='stockinputInfomain p-0'>
                                            <Col lg={3} md={3} xs={3} className='stampCol1'><input type="text" className='stockinputInfo' defaultValue="IN-AP" /></Col>
                                            <Col lg={9} md={9} xs={9} className='stampCol2'>  <div className='valueinput'>
                                            <TableInputText type='text' dot={false} placeholder='Enter Value' required={true} name={'stockHoldingId'} value={PropertyDetails.stockHoldingId} onChange={onChange}  />
                                                </div></Col>  
                                        </Row>
                                            
                                            
                                            {/* <div className='stockinputInfomain'>
                                                <input type="text" className='stockinputInfo' value="IN-AP" />
                                                <div className='valueinput'>
                                                    <TableInputText type='text' dot={false} placeholder='Enter Value' required={true} name={'stockHoldingId'} value={PropertyDetails.stockHoldingId} onChange={onChange}  />
                                                </div>
                                            </div> */}
                                        </Col> : null
                                    }
                                    <Col lg={4} md={6} xs={12}>
                                        <TableText label={"Date of Stamp Purchase [స్టాంప్ కొనుగోలు తేదీ]"} required={true} LeftSpace={false} />
                                        <TableSelectDate placeholder='Select Date' required={true} name={'stampPurchaseDate'} onChange={onChange}
                                            max={(moment((maxDate)).format("YYYY-MM-DD"))} value={PropertyDetails.stampPurchaseDate} onBlur={handleStampPurchaseDateBlur}/>
                                    </Col>
                                    {PropertyDetails.typeOfStamps == "Non-Judicial Stamp Papers" && <>
                                    <Row>
                                            <Col lg={3} md={4} xs={6} className='pb-2'>
                                                <TableText label={"Main Serial Number"} required={false} LeftSpace={false} />
                                                <TableInputText type='text' dot={false} placeholder='Enter Value' required={false} name={'mainSerialNumber'} value={nonJudicialStamps.mainSerialNumber} onChange={(e) => {
                                                    const input = e.target.value.toUpperCase();
                                                    const alphanumericOnly = input.replace(/[^A-Z0-9]/gi, '');
                                                    const trimmedValue = alphanumericOnly.slice(0, 5);
                                                    setNonJudicialStamps({
                                                        ...nonJudicialStamps,
                                                        mainSerialNumber: trimmedValue
                                                    });
                                                }} />
                                            </Col>
                                            <Col lg={3} md={4} xs={6} className='pb-2'>
                                                <TableText label={"SerialNumber"} required={false} LeftSpace={false} />
                                                <TableInputText type='number' dot={false} placeholder='Enter Value' required={false} max={7} name={'serialNumber'} value={nonJudicialStamps.serialNumber} onChange={(e) => {
                                                    const input = e.target.value;
                                                    const numericValue = input.replace(/\D/g, '');
                                                    const limitedValue = numericValue.slice(0, 7);
                                                    setNonJudicialStamps({
                                                        ...nonJudicialStamps,
                                                        serialNumber: limitedValue
                                                    });
                                                }} />
                                            </Col>
                                            <Col lg={3} md={4} xs={6} className='pb-2'>
                                                <TableText label={"Value"} required={false} LeftSpace={false} />
                                                <TableInputText type='string' dot={false} placeholder='Enter Value' required={false} max={101} name={'value'} value={nonJudicialStamps.value}
                                                    onChange={(e) => {
                                                        const val = parseInt(e.target.value, 10);
                                                        if (!isNaN(val) && val <= 100) {
                                                            setNonJudicialStamps({ ...nonJudicialStamps, value: String(val) });
                                                        } else if (e.target.value === '') {
                                                            setNonJudicialStamps({ ...nonJudicialStamps, value: '' });
                                                        }
                                                    }} />
                                            </Col>
                                           <Col lg={3} md={4} xs={6} className='pb-2'>
                                                <button  className='proceedButton' onClick={handleStampPaperSubmit}>Add</button>
                                            </Col>
                                        </Row>
                                        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
                                            <Modal.Header >
                                                <Modal.Title className="fw-bold text-danger">Alert</Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body className="text-center">
                                                <p style={{ fontWeight: 'bold' }}>The Given Stamp ID is already used in another application. Do you want to continue?</p>
                                                <div className="d-flex justify-content-center mt-3">
                                                    <button className="proceedButton ms-2" onClick={handleAddStamp}>Yes</button>
                                                    <button className="proceedButton ms-2" onClick={() => {setShowModal(false);setNonJudicialStamps({ mainSerialNumber: "", serialNumber: "", value: "" });}}>No</button>
                                                </div>
                                            </Modal.Body>
                                        </Modal>
                                        </>}



                                    {PropertyDetails.typeOfStamps  &&  <Col lg={4} md={6} xs={12}>
                                        <TableText label={"Total Stamp Paper Value(₹) [స్టాంప్ పేపర్ మొత్తం విలువ]"} required={true} LeftSpace={false} />
                                        <TableInputText type='number' key={`stampInput-${PropertyDetails.typeOfStamps}`} dot={false} placeholder='Enter Value' required={true} name={'stampPaperValue'} value={PropertyDetails.stampPaperValue} onChange={onChange} min={0} disabled={PropertyDetails.typeOfStamps === "Franking" || PropertyDetails.typeOfStamps === "Non-Judicial Stamp Papers" || isStackHoldingIdValidated} />
                                    </Col>}
                                    <Col lg={4} md={6} xs={12}>
                                        <TableText label={"No. of Stamp Papers [స్టాంప్ పేపర్ల సంఖ్య]"} required={true} LeftSpace={false} />
                                        {(PropertyDetails.stampPaperValue == 0 || PropertyDetails.typeOfStamps === "Non-Judicial Stamp Papers")?
                                            <TableInputText type='text' disabled={true} placeholder='' required={true} name={"noOfStampPapers"} value={PropertyDetails.noOfStampPapers} onChange={onChange} />
                                            : <TableDropdown required={true} options={DropdownList.stamppaperList} name={"noOfStampPapers"} value={PropertyDetails.noOfStampPapers} onChange={onChange} />
                                        }
                                    </Col>
                                    {/* <Col lg={4} md={6} xs={12}>
                                        <TableText label={"Date of Stamp Purchase [స్టాంప్ కొనుగోలు తేదీ]"} required={true} LeftSpace={false} />
                                        <TableSelectDate placeholder='Select Date' required={true} name={'stampPurchaseDate'} onChange={onChange}
                                            max={(moment((maxDate)).format("YYYY-MM-DD"))} value={PropertyDetails.stampPurchaseDate} />
                                    </Col> */}
                                </Row>
                                {PropertyDetails.typeOfStamps == "Non-Judicial Stamp Papers" && <>
                                    <Row className='pt-3'>
                                        {/* <Row>
                                            <Col lg={3} md={4} xs={6} className='pb-2'>
                                                <TableText label={"Main Serial Number"} required={false} LeftSpace={false} />
                                                <TableInputText type='text' dot={false} placeholder='Enter Value' required={false} name={'mainSerialNumber'} value={nonJudicialStamps.mainSerialNumber} onChange={(e) => {
                                                    const input = e.target.value.toUpperCase();
                                                    const alphanumericOnly = input.replace(/[^A-Z0-9]/gi, '');
                                                    const trimmedValue = alphanumericOnly.slice(0, 5);
                                                    setNonJudicialStamps({
                                                        ...nonJudicialStamps,
                                                        mainSerialNumber: trimmedValue
                                                    });
                                                }} />
                                            </Col>
                                            <Col lg={3} md={4} xs={6} className='pb-2'>
                                                <TableText label={"SerialNumber"} required={false} LeftSpace={false} />
                                                <TableInputText type='number' dot={false} placeholder='Enter Value' required={false} max={7} name={'serialNumber'} value={nonJudicialStamps.serialNumber} onChange={(e) => {
                                                    const input = e.target.value;
                                                    const numericValue = input.replace(/\D/g, '');
                                                    const limitedValue = numericValue.slice(0, 7);
                                                    setNonJudicialStamps({
                                                        ...nonJudicialStamps,
                                                        serialNumber: limitedValue
                                                    });
                                                }} />
                                            </Col>
                                            <Col lg={3} md={4} xs={6} className='pb-2'>
                                                <TableText label={"Value"} required={false} LeftSpace={false} />
                                                <TableInputText type='string' dot={false} placeholder='Enter Value' required={false} max={101} name={'value'} value={nonJudicialStamps.value}
                                                    onChange={(e) => {
                                                        const val = parseInt(e.target.value, 10);
                                                        if (!isNaN(val) && val <= 100) {
                                                            setNonJudicialStamps({ ...nonJudicialStamps, value: String(val) });
                                                        } else if (e.target.value === '') {
                                                            setNonJudicialStamps({ ...nonJudicialStamps, value: '' });
                                                        }
                                                    }} />
                                            </Col>
                                            <Col lg={3} md={4} xs={6} className='pb-2'>
                                                <button type="submit" className='proceedButton' onClick={handleStampPaperSubmit}>Add</button>
                                            </Col>
                                        </Row> */}
                                        {nonJudicialList.length > 0 && (
                                            <Table striped bordered hover className='TableData lpmTable ListData mt-2'>
                                                <thead>
                                                    <tr>
                                                        <th className='boundaries'>S No.<span>[క్రమ సంఖ్య]</span></th>
                                                        <th>Stamp Paper No.<span>[స్టాంప్ పేపర్ నెం]</span> </th>
                                                        <th>Value<span>[విలువ]</span></th>
                                                        <th>Action<span>[చర్య]</span></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {nonJudicialList.map((nonJudicialObj, index) => (
                                                        <tr key={index} style={{ textAlign: 'center' }}>
                                                            <td>{index + 1}</td>
                                                            <td>{nonJudicialObj.mainSerialNumber} {nonJudicialObj.serialNumber}</td>
                                                            <td>{nonJudicialObj.value}</td>
                                                            <td>
                                                                <Image
                                                                    alt="Image"
                                                                    height={20}
                                                                    width={20}
                                                                    src='/PDE/images/delete-icon.svg'
                                                                    onClick={() => handleDeleteNonJudicialStamps(nonJudicialObj)}
                                                                    className={styles.tableactionImg}
                                                                    style={{ cursor: 'pointer' }}
                                                                />
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                        )}
                                    </Row>
                                </>
                                }
                            </div>
                            {
                                (GetstartedDetails.registrationType && GetstartedDetails.registrationType.TRAN_DESC == "Lease [కౌలు]") 
                                &&
                                <div className={styles.gettableContainer}>
                                    <div>
                                        <Row>
                                            <p className={` ${styles.getTitle} ${styles.HeadingText}`}>Lease Details</p>
                                            <Col lg={4} md={12} xs={12} className='mb-2'>
                                                    <TableText label={"With effective from"} required={false} LeftSpace={false} />
                                                    <TableSelectDate  placeholder='Select Date' required={true} name={'wef'} onChange={onChangeLease} />
                                                </Col>
                                                <Col lg={4} md={12} xs={12}>
                                                    <TableText label={"Lease Period"} required={true} LeftSpace={false} />
                                                    <TableInputText type='number' placeholder='Enter Lease Period'  maxLength={4} required={false} name={'lPeriod'} value={leaseData.lPeriod} onChange={onChangeLease} />
                                                </Col>
                                                <Col lg={4} md={12} xs={12} className='mb-2'>
                                                    <TableText label={"Advance In Rs"} required={true} LeftSpace={false} />
                                                    <TableInputText type='number' placeholder='Advance In Rupees'  allowNeg={true} maxLength={13} required={false} name={'advance'} value={leaseData?.advance} onChange={onChangeLease} />
                                                </Col>
                                                <Col lg={4} md={12} xs={12}>
                                                    <TableText label={"Adj / Non Adj"} required={true} LeftSpace={false} />
                                                    <TableInputText type='number' placeholder='Enter Adj /Non Adj'  required={false} name={'adjOrNonAdj'} value={leaseData?.adjOrNonAdj} onChange={onChangeLease} />
                                                </Col>
                                                <Col lg={4} md={12} xs={12}>
                                                    <TableText label={"Value of Improvement in Rs"} required={true} LeftSpace={false} />
                                                    <TableInputText type='number' placeholder='Enter Book No'  required={false} maxLength={13} name={'valueOfImp'} value={leaseData.valueOfImp} onChange={onChangeLease} />
                                                </Col>
                                                <Col lg={4} md={12} xs={12}>
                                                    <TableText label={"Muncipal Tax Value ,If Paid by Lesse"} required={true} LeftSpace={false} />
                                                    <TableInputText type='number' placeholder='Enter Book No'  required={false} maxLength={13} name={'muncipalTax'} value={leaseData.muncipalTax} onChange={onChangeLease} />
                                                </Col>
                                            </Row>
                                        </div>
                                        <div>
                                            <div className={styles.divider}></div>
                                            <Row>
                                                {leaseData.lPeriod != "" && <><Col lg={4} md={6} xs={12}>
                                                    <p className={`pt-4 ${styles.getTitle} ${styles.HeadingText}`}>Lease Rental Details*</p>
                                                </Col>
                                                <Col lg={6} md={6} xs={12}></Col>
                                                <Col lg={2} md={6} xs={12} className='text-end'>
                                                   {!rentButn &&  <p className="proceedButton mb-0 renBtn"  onClick={addTableRows}>Add Rent +</p>}
                                                </Col></>}
                                                {rentalRowData && rentalRowData.length >0 &&<div className="pt-1">
                                                    <Table striped bordered hover className='TableData rentTable'>
                                                        <thead>
                                                            <tr>
                                                                <th className='LinkDoc'>Rent Period (Yearly)</th>
                                                                <th>Rent Amount In Rs (Yearly)</th>
                                                                <th>Total Amount</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {PropertyDetails.mode ==="add" ? rentalRowData.length >0 &&rentalRowData.map((rentData,index) => {
                                                                return (
                                                                    <tr key={rentData.sNo}>
                                                                        <td><TableInputText type='number'  placeholder='Enter rentalPeriod' required={true} name={'rentalPeriod'}maxLength={4} value={rentData?.rentalPeriod} onChange={(evnt:any)=>(onRentalLease(index, evnt))} /></td>
                                                                        <td><TableInputText type='number' placeholder='Enter rentalAmount' required={true} name={'rentalAmount'}maxLength={10} value={rentData?.rentalAmount} onChange={(evnt:any)=>(onRentalLease(index, evnt))} /></td>
                                                                        <td>
                                                                            <TableInputText type='number' placeholder='Total Amount(rental Period * rental Amount)' required={false} disabled={true} name={'totalAmount'}maxLength={10} value={rentData?.totalAmount} onChange={(evnt:any)=>(onRentalLease(index, evnt))} />
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            }) :
                                                            rentalRowData.length >0 && rentalRowData.map((rentData,index) => {
                                                                return (
                                                                    <tr key={rentData.sNo}>
                                                                        <td><TableInputText type='number' placeholder='Enter rentalPeriod' required={false} maxLength={4} name={'rentalPeriod'} value={rentData?.rentalPeriod} onChange={(evnt:any)=>(onRentalLease(index, evnt))} /></td>
                                                                        <td><TableInputText type='number' placeholder='Enter rentalAmount'maxLength={10} required={false} name={'rentalAmount'} value={rentData?.rentalAmount} onChange={(evnt:any)=>(onRentalLease(index, evnt))} /></td>
                                                                        <td>
                                                                            <TableInputText type='number' placeholder='Total Amount(rental Period * rental Amount)' required={false} disabled={true} name={'totalAmount'}maxLength={10} value={rentData?.totalAmount} onChange={(evnt:any)=>(onRentalLease(index, evnt))} />
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            })
                                                            }
                                                             {rentalRowData && rentalRowData.length > 0 &&  <tr className="gapLines">
                                                            <td className={`text-end pt-3 justify-content-end ${styles.getTitle} ${styles.HeadingText}`} colSpan={2}>Grand Rental Amount</td>
                                                            <td><TableInputText type='number' placeholder='Grand Total' required={false} disabled={true} name={'grandTotal'}maxLength={10} value={leasegranTotal}  /></td>
                                                            </tr>}
                                                        </tbody>
                                                    </Table>
                                                </div>}
                                            </Row>
                                        </div>
                                    </div>
                            }
                            {linkDocsDisplay == false ?
                                <div>
                                    <Row>
                                        <div>
                                            <p className={` ${styles.getTitle} ${styles.HeadingText}`}>Link Document Details <span>[లింక్ దస్తావేజుల వివరాలు]</span></p>
                                        </div>
                                        <Col lg={12} md={12} xs={12}>
                                            <div className='CheckboxInfo'>
                                                <label><input name="acceptTerms" type="checkbox" value={"on"} checked={getlinkDocument} onChange={ongenlinkdocClick} /><small className={styles.SlotText}> Do you want add link document details? <span style={{ color: "#333" }}>[మీరు లింక్ దస్తావేజుల వివరాలను జోడించాలనుకుంటున్నారా?]</span></small></label>
                                            </div>
                                        </Col>
                                    </Row>
                                </div> : null}
                            {/* </div> */}
                            {getlinkDocument ?
                                <div className={styles.LinkDocInfo}>
                                    <Row>
                                        <Col lg={4} md={12} xs={12} className='mb-2'>
                                            <TableText label={"District [జిల్లా]"} required={true} LeftSpace={false} />
                                            <TableDropdownSRO required={true} options={DistrictList} name={"district"} value={LinkDocument.district} onChange={onChangeLinkDoc} />
                                        </Col>
                                        {/* <Col lg={4} md={12} xs={12}>
                                            <TableText label={"Mandal [మండలం]"} required={true} LeftSpace={false} />
                                            <TableDropdownSRO required={true} options={MandalList2} name={"mandal"} value={LinkDocument.mandal} onChange={onChangeLinkDoc} />
                                        </Col>
                                        <Col lg={4} md={12} xs={12}>
                                            <TableText label='Village [గ్రామం]' required={true} LeftSpace={false} />
                                            <TableDropdownSRO required={true} options={VillageList2} name={"village"} value={LinkDocument.village} onChange={onChangeLinkDoc} />
                                        </Col> */}
                                        <Col lg={4} md={12} xs={12}>
                                            <TableText label={"Sub Registrar Office [సబ్ రిజిస్ట్రార్ కార్యాలయం]"} required={true} LeftSpace={false} />
                                            <TableDropdownSRO required={true} options={SROOfficeList2} name={"sroOffice"} value={LinkDocument.sroOffice} onChange={onChangeLinkDoc} />
                                        </Col>
                                        <Col lg={4} md={12} xs={12} className='mb-2'>
                                            <TableText label={"Link Document No. [లింక్ డాక్యుమెంట్ నెం.]"} required={true} LeftSpace={false} />
                                            <TableInputText type='number' placeholder='Enter Link Document No' allowNeg={true} maxLength={7} required={true} name={'linkDocNo'} value={LinkDocument.linkDocNo} onChange={onChangeLinkDoc} />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col lg={4} md={12} xs={12}>
                                            <TableText label={"Registration Year [నమోదు సంవత్సరం]"} required={true} LeftSpace={false} />
                                            <TableInputText type='number' placeholder='Enter Registartion Year' required={true} name={'regYear'} value={LinkDocument.regYear} onChange={onChangeLinkDoc} />
                                        </Col>
                                    </Row>
                                    {/* <Row>
                                        <Col lg={4} md={12} xs={12}>
                                            <TableText label={"Schedule No. [షెడ్యూల్ నెం.]"} required={false} LeftSpace={false} />
                                            <TableInputText type='number' placeholder='Enter Schedule No' required={false} name={'scheduleNo'} value={LinkDocument.scheduleNo} onChange={onChangeLinkDoc} />
                                        </Col>
                                    </Row> */}
                                    <Row className="mb-2">
                                        <Col lg={12} md={12} xs={12}>
                                            <div className={`${styles.ProceedContainer} ${styles.Linkbtn}`}>
                                                <button type="button" className='proceedButton' onClick={LinkDocData} >Get Details</button>
                                            </div>
                                        </Col>
                                    </Row>

                                </div>
                                : null}

                            {getlinkDocument && ReceivedLinkDocument.party.length ? <div>
                                <Container className='ListContainer'>
                                    <Row>
                                        <div className="pt-3">
                                            <Table striped bordered hover className='TableData'>
                                                <thead>
                                                    <tr>
                                                        <th className='sroColmn'>S.No.<span>[క్రమ సంఖ్య]</span></th>
                                                        <th className='LinkDoc'>Link Document No.<span>[లింక్ పత్రం నెం.]</span></th>
                                                        <th>Year<span>[సంవత్సరం]</span></th>
                                                        {/* <th>Schedule<span>[షెడ్యూల్]</span></th> */}
                                                        <th>SRO Code<span>[SRO కోడ్]</span></th>
                                                        <th>SRO Name<span>[పేరు]</span></th>
                                                        <th>Action<span>[చర్య]</span></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {ReceivedLinkDocument.FetchedDetails.map((SingleFetchDocument, index) => {
                                                        return (
                                                            <tr key={index}>
                                                                <td>{index + 1}</td>
                                                                <td>{SingleFetchDocument.linkDocNo}</td>
                                                                <td>{SingleFetchDocument.regYear}</td>
                                                                {/* <td>{SingleFetchDocument.scheduleNo}</td> */}
                                                                <td>{SingleFetchDocument.sroCode}</td>
                                                                <td>{SingleFetchDocument.sroOffice}</td>
                                                                <td><Image alt="Image" height={20} width={20} src='/PDE/images/delete-icon.svg' onClick={() => RemoveLinkDoc(SingleFetchDocument)} className={styles.tableactionImg} style={{ cursor: 'pointer' }} /></td>
                                                            </tr>
                                                        )
                                                    })}

                                                </tbody>
                                            </Table>
                                        </div>
                                    </Row>
                                </Container>
                                <Container className='ListContainer'>
                                    <div className='mb-2 pt-3'>
                                        <p className={` ${styles.getTitle} ${styles.HeadingText}`}>Executant Details</p>
                                    </div>

                                    <Table striped bordered hover className='TableData'>
                                        <thead>
                                            <tr>
                                                <th className='sroColmn'>S.No.<span>[క్రమ సంఖ్య]</span></th>
                                                <th className='LinkDoc'>Link Document No. / Year<span>[లింక్ పత్రం నెం. / సంవత్సరం]</span></th>
                                                <th className='DocColmn'>Name<span>[పేరు]</span></th>
                                                <th className='rCode'>Code<span>[కోడ్]</span></th>
                                                <th className='rCode'>R Code<span>[R కోడ్]</span></th>
                                                <th className='sroColmn'>R Name<span>[R పేరు]</span></th>
                                                <th className='boundaries'>Address<span>[చిరునామా]</span></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {showTableData(ReceivedLinkDocument.party)
                                            }
                                        </tbody>
                                    </Table>
                                </Container>

                                <Container className='ListContainer'>
                                    <div className='mb-2 pt-3'>
                                        <p className={` ${styles.getTitle} ${styles.HeadingText}`}>Claimant Details</p>
                                    </div>
                                    <Table striped bordered hover className='TableData'>
                                        <thead>
                                            <tr>
                                                <th className='sroColmn'>S.No.<span>[క్రమ సంఖ్య]</span></th>
                                                <th className='LinkDoc'>Link Document No. / Year<span>[లింక్ పత్రం నెం. / సంవత్సరం]</span></th>
                                                <th className='DocColmn'>Name<span>[పేరు]</span></th>
                                                <th className='rCode'>Code<span>[కోడ్]</span></th>
                                                <th className='rCode'>R Code<span>[R కోడ్]</span></th>
                                                <th className='sroColmn'>R Name<span>[R పేరు]</span></th>
                                                <th className='boundaries'>Address<span>[చిరునామా]</span></th>
                                            </tr>
                                        </thead>

                                        {ReceivedLinkDocument.party.filter(party =>!EXECUTANT_CODES.includes(party.INDGP_CODE)).map((party, index) => {
                                            // if (EXECUTANT_CODES.includes(party.INDGP_CODE)) { return; }
                                            return (
                                                <tr key={index}>
                                                    {/* <td className='checkBoxData'><input name="acceptTerms" type="checkbox" width={18} height={18} onChange={(e) => KeepInCount(e, index, "party", null)} disabled={["EX", "MR", "DR"].includes(party.INDGP_CODE)} /></td> */}
                                                    <td>{index+1}</td>
                                                    <td>{party.docWithYear}</td> 
                                                    <td>{party.INDGP_NAME}</td>
                                                    <td>{party.INDGP_CODE}</td>
                                                    <td>{party.R_CODE}</td>
                                                    <td>{party.R_NAME}</td>
                                                    <td>{party.ADDRESS}</td>
                                                </tr>
                                            )
                                        })
                                        }
                                    </Table>
                                </Container>

                                <Container className='ListContainer'>
                                    <div className='mb-2 pt-3'>
                                        <p className={` ${styles.getTitle} ${styles.HeadingText}`}>Property Details</p>
                                    </div>
                                    <Table striped bordered hover className='TableData'>
                                        <thead>
                                            <tr>
                                                <th className='sroColmn'>S.No.<span>[క్రమ సంఖ్య]</span></th>
                                                <th className='LinkDoc'>Link Document No. / Year<span>[లింక్ పత్రం నెం. / సంవత్సరం]</span></th>
                                                <th className='rCode'>Schedule No.<span>[షెడ్యూల్ నెం.]</span></th>
                                                <th className='sroColmn'>Market Value<span>[మార్కెట్ విలువ]</span></th>
                                                <th className='sroColmn'>Prohibited Property Status<span>[నిషేధించబడిన ఆస్తి స్థితి]</span></th>
                                                <th className='rCode'>Door No.<span>[డోర్ నెం.]</span></th>
                                                <th className='sroColmn'>Village<span>[గ్రామం]</span></th>
                                                <th className='sroColmn'>Habitation / Locality<span>[నివాసం / స్థానికత]</span></th>
                                                <th className='rCode'>Plot / Flat No.<span>[ప్లాట్/ఫ్లాట్ నెం]</span></th>
                                                <th className='rCode'>Survey No.<span>[సర్వే నెం]</span></th>
                                                <th className='boundaries'>Boundaries(N / S / E / W)<span>[సరిహద్దులు (ఉత్తరం/దక్షిణం/తూర్పు/పశ్చిమ)]</span></th>

                                            </tr>
                                        </thead>
                                        <tbody>
                                            {ReceivedLinkDocument.property.map((property, index) => {
                                                return (
                                                    <tr key={index}>
                                                        {/* <td className='checkBoxData'>
                                                            <input name="acceptTerms" disabled={!property.PPCheck || loading} type="checkbox" width={18} height={18} onChange={(e) => KeepInCount(e, index, "property", property)}/>
                                                        </td> */}
                                                        <td>{index+1}</td>
                                                        <td>{property.docWithYear}</td>
                                                        <td>{property.SCHEDULE_NO}</td>
                                                        <td>{property.marketValue}</td>
                                                        <td style={{ color: property.PPCheck ? "green" : "red" }}>{property.PPCheck ? "Not Prohibited" : "Prohibited"}</td>
                                                        <td>{property.HNO}</td>
                                                        <td>{property.VILLAGE}</td>
                                                        <td>{property.COLONY}</td>
                                                        <td>{property.FLAT_NO}</td>
                                                        <td>{property.SY1}</td>
                                                        <td>{property.NORTH}/{property.SOUTH}/{property.EAST}/{property.WEST}</td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </Table>
                                </Container>
                            </div> : null}
                            {!(PropertyDetails.typeOfStamps == "StockHolding" && !isStackHoldingIdValidated) && <Container>
                                <Row>
                                    <Col lg={12} md={12} xs={12}>
                                        <div className="d-flex justify-content-end">
                                            <button className='proceedButton'>Proceed</button>
                                        </div>
                                    </Col>
                                </Row>
                            </Container>}
                        </form>
                    </Col>
                </Row>

                <div>
                    <Modal show={show} size="lg" aria-labelledby="contained-modal-title-vcenter" centered className='mutablemodalCon' >
                        <Modal.Header className='mutablemodalHeader'>
                            <Row className='w-100'>
                                <Col lg={10} md={10} xs={12}><Modal.Title>Mutatable Documents Information</Modal.Title></Col>
                                <Col lg={2} md={2} xs={2} className='text-end'><div onClick={handleClose} className='closeIcon'>X</div></Col>
                            </Row>

                        </Modal.Header>
                        <Modal.Body className='mutablemodalInfo'>
                            <div>
                                <Accordion defaultActiveKey="0">
                                    <Accordion.Item eventKey="0">
                                        <Accordion.Header>Sale [విక్రయం]</Accordion.Header>
                                        <Accordion.Body>
                                            <ul>
                                                <li>Sale [విక్రయం] - Sale Deed [విక్రయ దస్తావేజు]</li>
                                                <li>Sale [విక్రయం] - Sale Deed Executed By A.P.Housing Board [ఎ.పి హౌసింగ్ బోర్డు క్రయ దస్తావేజు]</li>
                                                <li>Sale [విక్రయం] - Sale Deed Executed By Or Infavour Of Constituted By Govt. [ప్రభుత్వముచే / ప్రభుత్వము పేరిట కాబడిన విక్రయ దస్తావేజు]</li>
                                                <li>Sale [విక్రయం] - Sale Deed Executed By Society In f/o Member [సొసైటిలు వారి సభ్యులకు చేసే క్రయ దస్తావేజు]</li>
                                                <li>Sale [విక్రయం] - Sale Deed In Favour Of State Or Central Govt. [కేంద్ర, రాష్ట్ర ప్రభుత్వములకు క్రయం]</li>
                                                <li>Sale [విక్రయం] - Sale Deed in Favour of Mortgagee [తనఖా గ్రహీత కు చేసే విక్రయ దస్తావేజు]</li>
                                                <li>Sale [విక్రయం] - Sale with Indemnity [పూచీతో కూడిన క్రయ దస్తావేజు]</li>
                                                <li>Sale [విక్రయం] - Sale Deeds in f/o agrl Labrs (SC/ST) Funded by SC Fin. Corpn [SC/ST ఫైనాన్స్ కార్పొరేషన్ వారు దాఖలు చేసే క్రయ పత్రాలు]</li>
                                                <li>Sale [విక్రయం] - Sale of life interest [జీవిత కాలపు హక్కులు కలిగిన క్రయ దస్తావేజు]</li>
                                                <li>Sale [విక్రయం] - Sale Deeds executed by Courts [కోర్టుల ద్వారా అమలు కాబడిన క్రయ దస్తావేజు]</li>
                                                <li>Sale [విక్రయం] - Court sale certificate SARFAESI ACT</li>
                                                <li>Sale [విక్రయం] - ABOVE POVERTY LINE [పేదరిక రేఖకు పైన జీవించేవారు]</li>
                                                <li>Sale [విక్రయం] - BELOW POVERTY LINE  [పేదరిక రేఖకు దిగువన జీవించే వారు]</li>
                                            </ul>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                    <Accordion.Item eventKey="1">
                                        <Accordion.Header>Gift [దాన పత్రము]</Accordion.Header>
                                        <Accordion.Body>
                                            <ul>
                                                <li>Gift [దాన పత్రము] - Gift  [దాన పత్రము]</li>
                                                <li>Gift [దాన పత్రము] - Gift Settlement In f/o Family Member [కుటుంబ సభ్యులకు దఖలు]</li>
                                                <li>Gift [దాన పత్రము] - Gift Settlement In f/o Others [ఇతరులకు దఖలు]</li>
                                                <li>Gift [దాన పత్రము] - Gift Settlement For Charitable/Religious Purposes [మతధార్మిక సంస్థకు దఖలు]</li>
                                                <li>Gift [దాన పత్రము] - Gift Settlement In f/o Local Bodies [స్థానిక సంస్థలకు దఖలు]</li>
                                                <li>Gift [దాన పత్రము] - Gift In f/o Local Bodies (G.O 137) [స్థానిక సంస్థలకు దఖలు]</li>
                                                <li>Gift [దాన పత్రము] - Gift For Charitable Religious Purposes/God [మత, ధార్మిక సంస్థలకు దఖలు]</li>
                                                <li>Gift [దాన పత్రము] - Gift In Favour Of Government [ప్రభుత్వమునకు దాన పత్రము]</li>
                                                <li>Gift [దాన పత్రము] - Gift Settlement Deeds In Favour Of Government [ప్రభుత్వమునకు దఖలు దస్తావేజు]</li>
                                            </ul>
                                        </Accordion.Body>
                                    </Accordion.Item>

                                    <Accordion.Item eventKey="2">
                                        <Accordion.Header>Partition [భాగపంపిణి] </Accordion.Header>
                                        <Accordion.Body>
                                            <ul>
                                                <li>Partition [భాగపంపిణి] - Partition  [భాగపంపిణి]</li>
                                                <li>Partition [భాగపంపిణి] - Partition Among Family Members [కుటుంబ సభ్యుల మధ్య జరుగు భాగ పంపిణీ దస్తావేజు]</li>
                                            </ul>
                                        </Accordion.Body>
                                    </Accordion.Item>

                                    <Accordion.Item eventKey="3">
                                        <Accordion.Header>Release [హక్కు విడుదల]</Accordion.Header>
                                        <Accordion.Body>
                                            <ul>
                                                <li>Release [హక్కు విడుదల] - Release (Co-Parceners) [హక్కు విడుదల]</li>
                                                <li>Release [హక్కు విడుదల] - Release (Others) [హక్కు విడుదల(ఇతరులకు)]</li>
                                            </ul>
                                        </Accordion.Body>
                                    </Accordion.Item>

                                    <Accordion.Item eventKey="4">
                                        <Accordion.Header>Exchange [మార్పిడి దస్తావేజు] </Accordion.Header>
                                        <Accordion.Body>
                                            <ul>
                                                <li>Exchange [మార్పిడి దస్తావేజు] - Exchange  [మార్పిడి దస్తావేజు]</li>
                                            </ul>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                </Accordion>
                            </div>
                        </Modal.Body>

                    </Modal>
                </div>

             
            </Container>
            {/* <pre>{JSON.stringify(PropertyDetails, null, 2)}</pre> */}
            {/* <pre>{JSON.stringify(GetstartedDetails, null, 2)}</pre> */}
            {/* <pre>{JSON.stringify(LinkDocument, null, 2)}</pre> */}
            {/* <pre>{JSON.stringify(ReceivedLinkDocument, null, 2)}</pre> */}
            {/* <pre>{JSON.stringify(DocumentPropertyMapper(ReceivedLinkDocument.property[0]), null, 2)}</pre> */}
            {/* <pre>{JSON.stringify(DocumentClaimantMapper(ReceivedLinkDocument.party[0]), null, 2)}</pre> */}
            {/* <pre>{JSON.stringify(SelectionFromLinkDoc, null, 2)}</pre> */}
        </div>
    )
}

export default GetstartedPage;

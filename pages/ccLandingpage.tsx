import React, { useEffect, useLayoutEffect, useState } from 'react'
import styles from '../styles/pages/Mixins.module.scss';
import { useRouter } from 'next/router';
import { useAppSelector, useAppDispatch } from '../src/redux/hooks';
import { SaveGetstartedDetails } from '../src/redux/formSlice';
import { useGetDistrictList, useSROOfficeList, UseCreateApplication, getSroDetails, UseGetLinkDocDetails, UseAddProperty, getLinkedSroDetails, useSavePartyDetails, UseSaveCovinant, UseGetPPCheck, UseMVCalculator, UseGetVgForPpAndMV, UseGetStructureDetails, useGetMandalList, useGetVillagelList, UseDutyCalculator, UseGetWenlandSearch, UseGetLocationDetails, UseSaveCCrequestDetails } from '../src/axios';
import TableDropdown from '../src/components/TableDropdown';
import TableText from '../src/components/TableText';
import TableDropdownSRO from '../src/components/TableDropdownSRO';
import { Button, Col, Container, Row } from 'react-bootstrap';
import TableInputText from '../src/components/TableInputText';
import Table from 'react-bootstrap/Table';
import Image from 'next/image';
import { PopupAction } from '../src/redux/commonSlice';
import regType from '../src/regTypes';
import { CallingAxios, DateFormator, DocumentClaimantMapper, DocumentPropertyMapper, DoorNOIdentifier, KeepLoggedIn, Loading, MasterCodeIdentifier, ShowMessagePopup } from '../src/GenericFunctions';
import TableSelectDate from '../src/components/TableSelectDate';
import moment, { unix } from 'moment';
import covenantType from '../src/covenantType';
import Head from 'next/head';
import { get } from 'lodash';
import TableInputRadio from '../src/components/TableInputRadio';
import { EXECUTANT_CODES } from '../src/utils';

const DropdownList = {
    registrationTypeList: ['SALE', 'MORTGAGE', 'GIFT'],
    DocumentNatureList: {
        sale: ['SALE DEED', 'SALE AGREEMENT WITH POSSESSION', 'SALE AGREEMENT WITHOUT POSSESSION', 'SALE DEED EXECUTED BY A.P.HOUSING BOARD', 'SALE DEED EXECUTED BY OR INFAVOUR OF CONSTITUTED BY GOVT.', 'SALE DEED EXECUTED BY  SOCIETY IN F/O MEMBER', 'INSTRUMENTS BETWEEN CO-OPS', 'SALE DEED IN FAVOUR OF STATE OR CENTRAL GOVET.', 'DEVELOPMENT AGREEMENT OR CONSTRUCTION AGREEMENT', 'DEVELOPMENT AGREEMENT CUM GPA ', 'AGREEMENT OF SALE CUM GPA', 'CONVEYANCE DEED(WITHOUT CONSIDERATION)', 'CONVEYANCE FOR CONSIDERATION', 'SALE DEED IN FAVOUR OF MORGAGEE', 'SALE WITH INDEMNITY', 'SALE DEEDS IN F/O AGRL LABRS (SC/ST) FUNDED BY SC FIN. CORPN', 'SALE OF LIFE INTEREST', 'SALE OF TERRACE RIGHTS', 'SALE DEEDS EXECUTED BY COURTS', 'COURT SALE CERTIFICATE', 'COURT DECREE', 'SALE(OTHERS)'],
        mortgage: ['MORTGAGE WITH POSSESSION', 'MORTGAGE WITHOUT POSSESSION', 'MORT. DEED IN F/O GOVERNER/PRESIDENT OF INDIA BY GT.SERVANTS', 'ASSIGNMENT DEED', 'MORTGAGE DEED BY CO-OPERATIVE SOCIETY IN F/O GOVT.', ' MORTGAGE DEED BY xsALL FARMER FOR AGRL.LOANS IN F/O PAC/BANK', ' MORTGAGE DEED BETWEEN SOCIETY TO SOCIETY OR BANKS', 'DEPOSIT OF TITLE DEEDS', 'SECURITY BOND', 'MORTGAGES IN F/O GRAMEENA OR SCHEDULED BANK FOR AGRICULTURAL CREDIT', 'MORTGAGES IN F/O COOP CREDIT SOCIETIES OF WEAKER SECTION OF NON-AGRICULTURAL CLASS LOAN <=10000', 'INSTRUMENTS BETWEEN CO-OP AND OTHER CO-OP', 'INSTRUMENTS IN F/O HOUSE BLDG CO-OP SOCIETIES FOR LOAN UPTO RS.30000  UNDER L.I.G.H SCHEME', 'MORTGAGES EXECUTED BY MEMBERS OF CO-OP URBAN AND TOWN BANKS IN F/O SUCH BANKS FOR LOAN UPTO RS.15000', 'INSTRUMENTS IN F/O SBI AND NATIONALISED BANKS FOR LOAN UPTO RS.6500 UNDER DIFF RATES OF INT. ADV.', 'FURTHER CHARGE - WHEN THE ORIGINAL MORTGAGE IS WITH POSSESSION', 'FURTHER CHARGE-ORIG. MORTG IS WITHOUT POSSESSION AND POSSESSION IS AGREED TO BE GIVEN AT EXECUTION', 'FURTHER CHARGE - WITHOUT POSSESSION ON A SIMPLE MORTGAGE', 'MORTGAGE BY CONDITIONAL SALE', 'AGREEMENT VARYING THE TERMS OF PERVIOUSLY REGISTERED MORTGAGE DEED', 'ADDITIONAL SECURITY', 'SUBSITUTED SECURITY', 'MORTGAGE(OTHERS)'],
        gift: ['GIFT SETTLEMENT IN F/O FAMILY MEMBER', 'GIFT SETTLEMENT IN F/O OTHERS', 'GIFT SETTLEMENT FOR CHARITABLE/RELIGIOUS PURPOSES', 'GIFT SETTLEMENT IN F/O LOCAL BODIES', 'GIFT IN F/O LOCAL BODIES (G.O 137)', 'GIFT FOR CHARITABLE RELIGIOUS PURPOSES/GOD', 'GIFT IN FAVOUR OF GOVERNMENT', 'GIFT SETTLEMENT DEEDS IN FAVOUR OF GOVERNMENT', 'GIFT OF TERRACE RIGHTS', 'GIFT SETTLEMENT OF TERRACE RIGHTS', 'GIFT RESERVING LIFE INTEREST', 'GIFT SETTLEMENT RESERVING LIFE INTEREST'],
    },
    BooknoList: ["1", "2", "3"],
    stamppaperList: ["1", "2", "3", "4", "5", '6', '7', '8', '9', '10']
}
// const regWith :any = [{ label: 'Sro',value:"SRO" }, { label: 'Vsws',value:"VSWS" }]
const regWith = {
    RateList: ['Sro', 'Vsws'],
}

const CcLandingpage = () => {
    const dispatch = useAppDispatch()
    const router = useRouter();
    const [GetstartedDetails, setGetstartedDetails] = useState({ applicationId: "", registrationType: null, documentNature: null, district: "", distCode: "", mandal: "", mandalCode: "", village: "", villageCode: "", sroOffice: "", sroCode: "", amount: "", docProcessType: "Public Data Entry With Upload Document", noOfStampPapers: "0", regWith: "Sro", regWithCode: "", regWithValue: "", docProcessCode: "" });
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
    const [PropertyDetails, setPropertyDetails] = useState<any>(initialPropertyDetails);
    const [LinkDocument, setLinkDocument] = useState({ linkDocNo: "", regYear: "", scheduleNo: "", district: "", mandal: "", village: "", sroOffice: "", sroCode: "", })
    // const [LinkDocument, setLinkDocument] = useState({ linkDocNo: "13", regYear: "2022", scheduleNo: "1", district: "KRISHNA", sroOffice: "KANKIPADU",sroCode:"617" })
    const [ReceivedLinkDocument, setReceivedLinkDocument] = useState<any>({ party: [], property: [], FetchedDetails: [] })

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
    const LoginDetails = useAppSelector((state) => state.login.loginDetails);
    const [ccbutton, setCCButton] = useState<any>(false)
    const [appId, setAppID] = useState<String>("")
    const [concessionFee, setConcessionFee] = useState({
        rf_p: 0,
        sd_p: 0,
        td_p: 0,
        uc_p: 0,
        'GO': []
    });
    const [ApplicationDetails, setApplicationDetails] = useState<any>({ registrationType: { TRAN_MAJ_CODE: "", TRAN_MIN_CODE: "", TRAN_DESC: "", PARTY1: "", PARTY1_CODE: "", PARTY2: "", PARTY2_CODE: "" }, status: "ACTIVE", sroDetails: null, executent: [], claimant: [], property: [], payment: [], documentNature: { TRAN_DESC: "" }, MortagageDetails: [], giftRelation: [], presenter: [] });

    useEffect(() => {
        if (KeepLoggedIn()) {
            window.onpopstate = () => {
                router.push("/CCdashboardPage");
            }
        } else { ShowMessagePopup(false, "Invalid Access", "/") }
    }, []);



    useEffect(() => {
        if (DistrictList.length == 0) {
            GetDistrictList()
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


    // const GetSROOfficeList = async (id: any, part) => {
    //     let result = await CallingAxios(getSroDetails(id));
    //     if (result.status) {
    //         if (part === 1) {
    //             let sortedResult = result.data.sort((a, b) => a.name < b.name ? -1 : 1)
    //             setSROOfficeList(sortedResult);
    //         }
    //         else {
    //             let sortedResult = result.data.sort((a, b) => a.name < b.name ? -1 : 1)
    //             setSROOfficeList2(sortedResult);
    //         }

    //     }
    // }
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
                data.FetchedDetails = [];
                data.party = [];
                data.property = [];
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
                setReceivedLinkDocument([]);
            }
        }
        else {
            Loading(false);
            ShowMessagePopup(false, "Link document details fetch failed", "");
        }
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

    const onSubmit = async (e: any) => {
        e.preventDefault();
        // if (PropertyDetails.stampPaperValue == "0") {
        //     ShowMessagePopup(false, "stampPaperValue Can Not be Zero", "");
        // }

        if (GetstartedDetails.registrationType && GetstartedDetails.documentNature && GetstartedDetails.district && GetstartedDetails.sroOffice) {
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

        let result = await CallingAxios(UseCreateApplication(GetstartedDetails));
        if (result.status) {
            let covData = {
                documentId: result.data.applicationId,
                natureType: GetstartedDetails.registrationType.TRAN_DESC,
                covanants: covenatsTypeFinder(GetstartedDetails.registrationType)
            }
            // await UseSaveCovinant(covData);
            dispatch(SaveGetstartedDetails(result.data));
            localStorage.setItem("GetApplicationDetails", JSON.stringify(result.data));
            redirectToPage('/PartiesDetailsPage');
        }
        else {
            ShowMessagePopup(false, "Get Application Details Failed", "");
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
                // console.log("property data = ")
                // console.log(myProperty);
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
                let myParty = { ...MappedParty, applicationId: DocCreateResult.applicationId, isLinkedDocDetails: true, partyCode: MappedParty.representSubType }
                MyWaitingTime = (MyWaitingTime + (1000 * i) + 1500)
                // console.log("party data = ");
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

    // const RemoveLinkDoc = (SingleFetchDocument) => {
    //     let FetchedDetails = [...ReceivedLinkDocument.FetchedDetails];
    //     for (let i = FetchedDetails.length - 1; i >= 0; i--) {
    //         if (FetchedDetails[i]["sroCode"] == SingleFetchDocument.sroCode && FetchedDetails[i]["regYear"] == SingleFetchDocument.regYear && FetchedDetails[i]["linkDocNo"] == SingleFetchDocument.linkDocNo) {
    //             FetchedDetails.splice(i, 1);
    //         }
    //     }
    //     let party = [...ReceivedLinkDocument.party];
    //     for (let i = party.length - 1; i >= 0; i--) {
    //         if (party[i]["SR_CODE"] == SingleFetchDocument.sroCode && party[i]["REG_YEAR"] == SingleFetchDocument.regYear && party[i]["DOCT_NO"] == SingleFetchDocument.linkDocNo) {
    //             party.splice(i, 1);
    //         }
    //     }

    //     let property = [...ReceivedLinkDocument.property];
    //     for (let i = property.length - 1; i >= 0; i--) {
    //         if (property[i]["SR_CODE"] == SingleFetchDocument.sroCode && property[i]["REG_YEAR"] == SingleFetchDocument.regYear && property[i]["DOCT_NO"] == SingleFetchDocument.linkDocNo) {
    //             property.splice(i, 1);
    //         }
    //     }
    //     // setLinkDocument({ linkDocNo: "", regYear: "", scheduleNo: "", district: "", sroOffice: "", sroCode: "" });
    //     setReceivedLinkDocument({ party, property, FetchedDetails });
    // }
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

    const paymentonClick = () => {
        let paymentRedirectUrl = process.env.PAYMENT_URL + "/igrsPayment" + "?paymentData=";
        // let paymentRedirectUrl = "http://117.250.201.41:8091/igrs-utility-ms" + "/igrsPayment?paymentData="
        let paymentLink = document.createElement("a");
        const cF = concessionFee.GO.length ? { ...concessionFee } : { ...CalculatedDutyFee, uc_p: 500 };
        let PaymentJSON = {
            "deptId": appId,
            "source": "CC",
            "type": "orecomf",
            "rmName": "SRIRAM",
            "rmId": "KKCD2343R",
            "mobile": "9494494595",
            "email": "test.test@test.com",
            "rf": "200",
            "uc": 100,
            "sd": 20,
            "sroNumber": "617"
        }
        let stprs = parseInt(ApplicationDetails.stampPaperValue ? ApplicationDetails.stampPaperValue : 0);
        PaymentJSON.sd = (PaymentJSON.sd - stprs) > 0 ? (PaymentJSON.sd - stprs) : 0;
        let encodedData = Buffer.from(JSON.stringify(PaymentJSON), 'utf8').toString('base64')
        paymentLink.href = paymentRedirectUrl + encodedData;
        paymentLink.target = "_blank";
        document.body.appendChild(paymentLink);
        paymentLink.click();
        document.body.removeChild(paymentLink);
    }

    const ccreqDetails = async () => {
        // let AppId:any = LinkDocument.linkDocNo +""+new Date().getTime();
        let yr: any = new Date().getFullYear();
        yr = String(yr).substring(2, 4)
        let AppId: any
        if (String(LinkDocument.sroCode).length === 3) {
            let srCode = "0" + String(LinkDocument.sroCode);
            AppId = yr + "" + LinkDocument.sroCode + "" + Math.round(+new Date() / 1000)
        } else {
            AppId = yr + "" + LinkDocument.sroCode + "" + Math.round(+new Date() / 1000)
        }
        setAppID(AppId)
        let data: any = {
            "SR_CODE": LinkDocument.sroCode,
            "DOCT_NO": LinkDocument.linkDocNo,
            "REG_YEAR": LinkDocument.regYear,
            "BOOK_NO": 1,
            "USER_ID": LoginDetails.loginId,
            "STATUS": "S",
            "TIME_STAMP": new Date().toISOString().slice(0, 10),
            "REQUESTED_ON": new Date().toISOString().slice(0, 10),
            "REQUESTED_BY": LoginDetails.loginName,
            "APP_ID": AppId
        }
        let result: any = await CallingAxios(UseSaveCCrequestDetails(data))
 
        if (result.status) {
            ShowMessagePopup(true, 'CC Request saved successfully', "")
            router.push('/CCdashboardPage');
        } else {
            ShowMessagePopup(false, 'The Certified Copy request failed because the documents were not digitized prior to 1999. Please contact the concerned SRO.', "")
        }
    }
 
    return (

        <div className="PageSpacing">
            <Head>
                <title>CC Request</title>
            </Head>
            <Container>
                <Row>
                    <Col lg={12} md={12} xs={12}>
                        <form onSubmit={onSubmit} className={`${styles.mainContainer} ${styles.GetstartedInfo}`}>
                            <div>
                                <h2 className={` ${styles.getTitle} ${styles.HeadingText} ${styles.CertifiedText} text-center mt-3`}><u>CERTIFIED COPY</u></h2>
                            </div>

                            {/* {linkDocsDisplay == false ?
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
                                </div> : null} */}
                            {/* </div> */}
                            {/* {getlinkDocument ? */}
                            <div className={`${styles.LinkDocInfo} ${styles.ccLinkdocInfo}`}>
                                <Row>
                                    <Col lg={6} md={6} xs={12} className='mb-2'>
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
                                    <Col lg={6} md={6} xs={12}>
                                        <TableText label={"Sub Registrar Office [సబ్ రిజిస్ట్రార్ కార్యాలయం]"} required={true} LeftSpace={false} />
                                        <TableDropdownSRO required={true} options={SROOfficeList2} name={"sroOffice"} value={LinkDocument.sroOffice} onChange={onChangeLinkDoc} />
                                    </Col>
                                    <Col lg={6} md={6} xs={12} className='mb-2'>
                                        <TableText label={"Link Document No. [లింక్ డాక్యుమెంట్ నెం.]"} required={true} LeftSpace={false} />
                                        <TableInputText type='number' placeholder='Enter Link Document No' allowNeg={true} maxLength={7} required={true} name={'linkDocNo'} value={LinkDocument.linkDocNo} onChange={onChangeLinkDoc} />
                                    </Col>

                                    <Col lg={6} md={6} xs={12}>
                                        <TableText label={"Registration Year [నమోదు సంవత్సరం]"} required={true} LeftSpace={false} />
                                        <TableInputText type='number' placeholder='Enter Registartion Year' required={true} name={'regYear'} value={LinkDocument.regYear} onChange={onChangeLinkDoc} />
                                    </Col>
                                </Row>
                                <Row className='noteInfo'>
                                    <Col lg={12} md={12} xs={12}>
                                        <h6>Note: Only Book 1 documents can be downloaded. For Book 3 and Book 4, Please contact the SRO.</h6>
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

                                            <button type="button" className='proceedButton mx-2' onClick={() => redirectToPage("/CCdashboardPage")}>Back</button>
                                            <button type="button" className='proceedButton mb-0' onClick={LinkDocData} >Get Details</button>
                                        </div>
                                    </Col>
                                </Row>

                            </div>
                            {/*  : null} */}

                            {ReceivedLinkDocument?.party?.length ? <div>
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
                                                        {/* <th>Action<span>[చర్య]</span></th> */}
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
                                                                {/* <td><Image alt="Image" height={20} width={20} src='/PDE/images/delete-icon.svg' onClick={() => RemoveLinkDoc(SingleFetchDocument)} className={styles.tableactionImg} style={{ cursor: 'pointer' }} /></td> */}
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

                                        {ReceivedLinkDocument.party.map((party, index) => {
                                            if (EXECUTANT_CODES.includes(party.INDGP_CODE)) { return; }
                                            return (
                                                <tr key={index}>
                                                    {/* <td className='checkBoxData'><input name="acceptTerms" type="checkbox" width={18} height={18} onChange={(e) => KeepInCount(e, index, "party", null)} disabled={["EX", "MR", "DR"].includes(party.INDGP_CODE)} /></td> */}
                                                    <td>{index + 1}</td>
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
                                                        {/* <td className='checkBoxData'><input name="acceptTerms" disabled={!property.PPCheck} type="checkbox" width={18} height={18} onChange={(e) => KeepInCount(e, index, "property", property)} /></td> */}
                                                        <td>{index + 1}</td>
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
                                    {/* <div className="d-flex justify-content-end">
                                            <Button className='proceedButton'>Proceed</Button>
                                        </div> */}
                                    <Container>

                                        <Row className='mt-3'>
                                            <Col lg={8} md={12} xs={12}></Col>
                                            <Col lg={4} md={12} xs={12}>
                                                {ReceivedLinkDocument.property &&
                                                    //     <div className="justify-content-end paymentInfo">
                                                    //         <Button className='proceedButton paymentBtn' onClick={paymentonClick}>Proceed to Payment</Button>
                                                    //     </div>
                                                    // :

                                                    <div className="justify-content-end paymentInfo text-end">
                                                        <Button className='proceedButton paymentBtn' onClick={ccreqDetails}>CC Request</Button>
                                                    </div>
                                                }
                                            </Col>
                                        </Row>
                                    </Container>
                                </Container>
                            </div> : null}
                            {/* <Container>

                                <Row className='mt-3'>
                                    <Col lg={10} md={12} xs={12}></Col>
                                    <Col lg={2} md={12} xs={12}>
                                        {ReceivedLinkDocument.property &&
                                            <div className="d-flex justify-content-end">
                                                <Button className='proceedButton'>Proceed</Button>
                                            </div>
                                        }
                                    </Col>
                                </Row>
                            </Container> */}

                        </form>
                    </Col>
                </Row>
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

export default CcLandingpage;
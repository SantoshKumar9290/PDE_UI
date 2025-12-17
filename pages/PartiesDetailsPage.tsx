import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Modal, Button } from 'react-bootstrap';
import styles from '../styles/pages/Mixins.module.scss';
import { useRouter } from 'next/router';
import TableInputLongText from '../src/components/TableInputLongText';
import { useAppSelector, useAppDispatch } from '../src/redux/hooks';
import { getApplicationDetails, useDeleteParty,validateUtilizedNonJudicialStamps, useDeleterepresentative, UseSetPresenter, useDeleteProperty, UseChangeStatus, UseDeletePaymentDetails, UseDutyCalculator, UseUploadDoc, UseGetUploadDoc, UseDeleteUploadDoc, UseReportTelDownload, UseReportDownload, UseTransferdocument, syncservice, UseupdateTdvalue, UseCrdaEmpCheck, UseStatusHistoryUpdate, UseGetLeaseDutyFee, SaveSection_47Details, documentPreview, UseGetdownloadeSignedFile,getMutationEnabled, UseUpdateProperty, UseUpdateDocument, GetCDMADetails } from '../src/axios';
import uploadStyles from '../styles/components/UploadDoc.module.scss'
import Image from 'next/image';
import Table from 'react-bootstrap/Table';
import { SaveCurrentPartyDetails } from '../src/redux/formSlice';
import { SaveCurrentRepresntDetails } from '../src/redux/formSlice';
import { commonSlice, DeletePopupAction, GooglemapAction, PopupAction } from '../src/redux/commonSlice';
import { SavePropertyDetails } from '../src/redux/formSlice';
import TableInputRadio2 from '../src/components/TableInputRadio2';
import covenantType from '../src/covenantType';
import { CallingAxios, DateFormator, decodeBase64, KeepLoggedIn, MasterCodeIdentifier, ShowMessagePopup, ShowPreviewPopup, TotalMarketValueCalculator } from '../src/GenericFunctions';
import Popstyles from '../styles/components/PopupAlert.module.scss';
import Head from 'next/head';
import { get } from 'lodash';
import { ImCross } from 'react-icons/im';
import { allowSameSurvey ,CheckCrdaVg,CrdaEmpCheck, recursiveIForAdhar, encryptId, allowMutationPayments, isMutationPaymentDuesCleared} from '../src/utils';
import TaxDuesDialog from '../src/components/TaxDuesDialog';
import { ifError } from 'assert';
// import { TbFlagSearch } from 'react-icons/tb';

const panForm60ValidationRules = [
  {
    sno: 1,
    validation: "PAN/Form 60 is mandatory",
    documentType: "Mutatable Documents",
    partyType: "Public",
    propertyType: "Rural",
    documentValue: "Greater than 0",
},
  {
    sno: 2,
    validation: "PAN is mandatory",
    documentType: "Mutatable Documents",
    partyType: "Other than Public",
    propertyType: "Rural",
    documentValue: "Greater than 0"
  },
  {
    sno: 3,
    validation: "PAN/Form 60 is Optional",
    documentType: "Non Mutable Documents",
    partyType: "All",
    propertyType: "Rural",
    documentValue: "Less than or Equal 1000000"
  },
  {
    sno: 4,
    validation: "PAN/Form 60 is Mandatory",
    documentType: "Non Mutable Documents",
    partyType: "All",
    propertyType: "Rural",
    documentValue: "Greater than 1000000"
  },
  {
    sno: 5,
    validation: "PAN/Form 60 is Optional",
    documentType: "All",
    partyType: "All",
    propertyType: "Urban",
    documentValue: "Less than or Equal 1000000"
  },
  {
    sno: 6,
    validation: "PAN/Form 60 is Mandatory",
    documentType: "All",
    partyType: "All",
    propertyType: "Urban",
    documentValue: "Greater than 1000000"
  }
];


const PartiesDetailsPage = () => {
    const dispatch = useAppDispatch()
    let GetstartedDetails = useAppSelector(state => state.form.GetstartedDetails);
    let LoginDetails = useAppSelector(state => state.login.loginDetails);
    let DeleteOption = useAppSelector(state => state.common.DeletePopupMemory);
    let AadharPopupMemory = useAppSelector((state) => state.common.AadharPopupMemory);
    const router = useRouter();
    const [ApplicationDetails, setApplicationDetails] = useState<any>({ applicationId: GetstartedDetails.applicationId, registrationType: { TRAN_MAJ_CODE: "", TRAN_MIN_CODE: "", TRAN_DESC: "", PARTY1: "", PARTY1_CODE: "", PARTY2: "", PARTY2_CODE: "" }, documentNature: { TRAN_MIN_CODE: "" }, status: "ACTIVE", sroDetails: null, executent: [], claimant: [], property: [], payment: [], MortagageDetails: [], giftRelation: [], presenter: [], covanants: {}, sroCode: "", amount: "",AttendanceDetails:{},witness:[] });
    const [Allfilled, setAllfilled] = useState({ isPresenterSelected: false, isDataPresent: false })
    const [CovenantsMessage, setCovenantsMessage] = useState("");
    const [CalculatedDutyFee, setCalculatedDutyFee] = useState({ TRAN_MAJ_CODE: "", TRAN_MIN_CODE: "", sroCode: "", amount: "", rf_p: "0", td_p: "0", sd_p: "0", marketValue: "0" , sd_p2: "0"})
    const [UploadDocument, setUploadDocument] = useState({ docName: "", status: "" });
    const [IsWithDoc, setIsWithDoc] = useState(true);
    const [flag1, setFlag1] = useState(true);
    let initialPropertyDetails = useAppSelector(state => state.form.PropertyDetails);
    const [PropertyDetails, setPropertyDetails] = useState<any>(initialPropertyDetails);
    const [withPDEUpload, setWithPDEUpload] = useState<any>(false);
    const [anywhereUpload, setAnywhereUpload] = useState<any>(false);
    // const [uploadData,setUploadData]=useState<any>({textValue:"", required:"", textName:"", onChangeText:"", onChangeFile:"", uploadKey:"", isUploadDone : '', accept : "", showOnlyImage : false})
    const [checkFileOrNot, setCheckFileOrNot] = useState<any>(false);
    const [checkAnywherFileOrNot, setCheckAnywhereFileOrNot] = useState<any>(false);
    const [book3Nd4Prop, setBook3Nd4Prop] = useState<any>(false);
    const [clamintNtDisplay, setClamintNtDisplay] = useState<any>(false);
    const [AcquisitionCovenants, setAcquisitionCovenants] = useState("");
    const [AttendanceDetails, setAttendanceDetails] = useState<any>({ id: "", lat: 0, lon: 0, reason: "" });
    const GooglemapMemory = useAppSelector((state) => state.common.GooglemapMemory);
    const [statusBar, setStatusBar] = useState<any>(false);
    const [tdAllow,setTdAllow] = useState<any>(false);
    let [gPropData,setGPropData]=useState<any>([]);
    let [oPropData,setOPropData]=useState<any>([]);
    let [userCharges,setUserCharges]= useState<any>(500);
    let [Section47, setSection47] =useState<any>(false);
    let [ShowSection47,SetShowSection47] = useState<any>(false);
    let [Section47A6, setSection47A6] =useState<any>(false);
    //const [isTaxesView, setIsTaxView] = useState<boolean>(false);
    //const [selectedProperty, setSelectedProperty] = useState<any>({});
    const [isMutationPaymentCleared, setIsMutationPaymentCleared] = useState<boolean>(false);
    const [allESignsCompleted, setAllESignsCompleted] = useState(true);
    const [doEsign, setDoEsign] = useState<boolean>(false)
    const [allowMutationPayment, setAllowMutationPayment] = useState<boolean>(false);   
    const [showModal, setShowModal] = useState(false);
    // useEffect(() => {
    //     let NewData = [];
    //     let data: any = covenantType.filter(x => x.TRAN_MIN_CODE == "00")
    //     setCovenantDetails(data);
    //     data.map(x => NewData.push(x.TRAN_DESC))
    //     setCovenantDetails(NewData);
    // }, [])

    // const FilterTypes = (value: string) => {
    //     let data: any = covenantType.find(x => x.TRAN_DESC == value);
    //     return data;
    // }
useEffect(() => {
  const storedValue = localStorage.getItem("Section47A6");  
  if (storedValue !== null) {
    setSection47A6(storedValue === "true");
  }
}, []);

// useEffect(() => {
//   localStorage.setItem("Section47A6", Section47A6.toString());
// }, [Section47A6]);


useEffect(() => {
  if (ApplicationDetails.executent?.some(item => item.partyType === "Govt Institutions")) {
    localStorage.setItem("Section47A6", Section47A6.toString());
  } else {
    localStorage.removeItem("Section47A6");
    setSection47A6(false); // Optional: reset state when checkbox is hidden
  }
}, [Section47A6, ApplicationDetails.executent]);


    useEffect(() => {
        const checkAllESignsCompleted = () => {
            const executants = ApplicationDetails?.executent || [];
            const claimants = ApplicationDetails?.claimant || [];
            const allParties = [...executants, ...claimants];
            const form60Parties = allParties.filter(party => {
                if(party?.isSelectedPanOrForm60 === "form60")
                    return true; 
                let repForm60 = party.represent.filter(repr => repr?.isSelectedPanOrForm60 === "form60");
                if(repForm60.length>0)
                    return true;
            });
                
            if (form60Parties.length === 0) {
                return true;
            }
            const allSigned = form60Parties.every(party => party.form60EsignStatus === 'Y');
            return allSigned;
        };
        // if(doEsign)
        //     setAllESignsCompleted(checkAllESignsCompleted());
    // }, [ApplicationDetails, doEsign])
    }, [ApplicationDetails])


    // const allParties = ApplicationDetails?.executent?.concat(ApplicationDetails?.claimant || []) || [];
    // const eSignForm60Parties = allParties.some(party => party?.isSelectedPanOrForm60 === "form60");

    const Section47documents = [
        { T_MAJ: "01", T_MIN: "25", DOCT_TYPE: "Development Agreement/GPA/Supplemental Deed by CRDA", type: "Sale" },
        { T_MAJ: "02", T_MIN: "02", DOCT_TYPE: "Exchange by CRDA", type: "Exchange" },
        { T_MAJ: "03", T_MIN: "05", DOCT_TYPE: "Recification Deed By CRDA" },
        { T_MAJ: "04", T_MIN: "05", DOCT_TYPE: "Recification Deed By CRDA" },
        { T_MAJ: "06", T_MIN: "05", DOCT_TYPE: "Recification Deed By CRDA" }

    ];
    const Section47Acheck = () => {
        let data: any = localStorage.getItem("GetApplicationDetails");
        if (data) {
            data = JSON.parse(data);
            const tmaj_code = data?.documentNature?.TRAN_MAJ_CODE;
            const InitialCRDAnature: any = Section47documents.filter(document => document.T_MAJ === tmaj_code);
            if (InitialCRDAnature.length > 0) {
                SetShowSection47(true);
            }
        }
    }
  const [apiicCondition,SetApiicCondition] = useState(true);
    useEffect(() => {
        Section47Acheck();
        console.log(LoginDetails?.loginEmail === "APIIC",":::CCCCCCCCCCC");
        
       if( LoginDetails?.loginEmail === "APIIC"){
         SetApiicCondition(false)
       }
        if (KeepLoggedIn()) {
            GetApplicationDetails();
            localStorage.removeItem("PropertyDetails");
            window.onpopstate = () => {
                router.push("/PartiesDetailsPage");
            }
        } else ShowMessagePopup(false, "Invalid Access", "/")
    }, []);

    useEffect(() => {
        if (GooglemapMemory.enable == false && GooglemapMemory.result) {
            setAttendanceDetails({ id: GooglemapMemory.id, lat: GooglemapMemory.Location.lat, lng: GooglemapMemory.Location.lng, Reason: GooglemapMemory.Reason });
            dispatch(GooglemapAction({ enable: false, id: "", Location: { lat: 0, lng: 0 }, result: false, Reason: "" }));
        }
    }, [GooglemapMemory])
    let doctcondtion = ApplicationDetails?.documentNature?.TRAN_MAJ_CODE === '01' && ApplicationDetails?.documentNature?.TRAN_MIN_CODE === '27'

    useEffect(() => {
        if (ApplicationDetails.registrationType && ApplicationDetails.documentNature && ApplicationDetails.sroCode && ApplicationDetails.amount && !Section47) {
            let currentMarketValue = TotalMarketValueCalculator(ApplicationDetails)
            let ftv: any;
            if (ApplicationDetails.docsExcutedBy == "GovtBody") {
                ftv = ApplicationDetails.amount;
            } else if (ApplicationDetails.documentNature.TRAN_MAJ_CODE === "01" && ApplicationDetails.documentNature.TRAN_MIN_CODE === "04") {
                ftv = ApplicationDetails.amount;
            } else if (Section47A6) {
                ftv = ApplicationDetails.amount
            }
            else {
                ftv = ApplicationDetails.amount > currentMarketValue ? ApplicationDetails.amount : currentMarketValue;
            }
            let data: any;
            if (ApplicationDetails.documentNature.TRAN_MAJ_CODE === "07" && ApplicationDetails.property && ApplicationDetails.property.length > 0) {
                leasecalforDutyfee(ApplicationDetails.property);
            } else {
                data = {
                    "tmaj_code": ApplicationDetails.documentNature.TRAN_MAJ_CODE,
                    "tmin_code": ApplicationDetails.documentNature.TRAN_MIN_CODE,
                    "sroNumber": ApplicationDetails.sroCode,
                    "local_body": 3,
                    "flat_nonflat": "N",
                    "marketValue": currentMarketValue,
                    "finalTaxbleValue": doctcondtion ? ApplicationDetails.amount : ftv,
                    "con_value": ApplicationDetails.amount,
                    "adv_amount": 0
                }
            }

            if (ApplicationDetails.documentNature.TRAN_MAJ_CODE == "04" && ApplicationDetails.documentNature.TRAN_MIN_CODE == "03") {
                setUserCharges(0);
            } else if (ApplicationDetails.documentNature.TRAN_MAJ_CODE == "01" && ApplicationDetails.documentNature.TRAN_MIN_CODE == "25") {
                setUserCharges(500);
            }
            else {
                setUserCharges(500);
                if(ApplicationDetails.documentNature.TRAN_MAJ_CODE != '07')
                    DutyFeeCalculator(data);
            }
            // if(ApplicationDetails.documentNature.TRAN_MAJ_CODE !="01" && ApplicationDetails.documentNature.TRAN_MIN_CODE !="25"){
            // DutyFeeCalculator(data);
            // }

        }
        //let data;
    }, [ApplicationDetails])
    let Anywherestat: any = ApplicationDetails.property.some(property => property.sroCode !== ApplicationDetails.sroCode)
    useEffect(() => {
        if (Section47) {
            let currentMarketValue = ApplicationDetails.amount
            let ftv: any;
            if (ApplicationDetails.docsExcutedBy == "GovtBody") {
                ftv = ApplicationDetails.amount;
            } else if (ApplicationDetails.documentNature.TRAN_MAJ_CODE === "01" && ApplicationDetails.documentNature.TRAN_MIN_CODE === "04") {
                ftv = ApplicationDetails.amount;
            } else if (Section47A6) {
                ftv = ApplicationDetails.amount
            }
            else {
                ftv = ApplicationDetails.amount > currentMarketValue ? ApplicationDetails.amount : currentMarketValue;
            }
            let data: any;
            if (ApplicationDetails.documentNature.TRAN_MAJ_CODE === "07" && ApplicationDetails.property && ApplicationDetails.property.length > 0) {
                leasecalforDutyfee(ApplicationDetails.property);
            } else {
                data = {
                    "tmaj_code": ApplicationDetails.documentNature.TRAN_MAJ_CODE,
                    "tmin_code": ApplicationDetails.documentNature.TRAN_MIN_CODE,
                    "sroNumber": ApplicationDetails.sroCode,
                    "local_body": 3,
                    "flat_nonflat": "N",
                    "marketValue": currentMarketValue,
                    "finalTaxbleValue": ftv,
                    "con_value": ApplicationDetails.amount,
                    "adv_amount": 0
                }
            }

            if (ApplicationDetails.documentNature.TRAN_MAJ_CODE == "04" && ApplicationDetails.documentNature.TRAN_MIN_CODE == "03") {
                setUserCharges(0);
            } else if (ApplicationDetails.documentNature.TRAN_MAJ_CODE == "01" && ApplicationDetails.documentNature.TRAN_MIN_CODE == "25") {
                setUserCharges(500);
            }
            else {
                setUserCharges(500);
                if (ApplicationDetails.documentNature.TRAN_MAJ_CODE != "07")
                    DutyFeeCalculator(data);
            }
            // if(ApplicationDetails.documentNature.TRAN_MAJ_CODE !="01" && ApplicationDetails.documentNature.TRAN_MIN_CODE !="25"){
            // DutyFeeCalculator(data);
            // }

        } else {
            if (ApplicationDetails.registrationType && ApplicationDetails.documentNature && ApplicationDetails.sroCode && ApplicationDetails.amount) {
                let currentMarketValue = TotalMarketValueCalculator(ApplicationDetails)
                let ftv: any;
                if (ApplicationDetails.docsExcutedBy == "GovtBody") {
                    ftv = ApplicationDetails.amount;
                } else if (ApplicationDetails.documentNature.TRAN_MAJ_CODE === "01" && ApplicationDetails.documentNature.TRAN_MIN_CODE === "04") {
                    ftv = ApplicationDetails.amount;
                } else if (Section47A6) {
                    ftv = ApplicationDetails.amount;
                }
                else {
                    ftv = ApplicationDetails.amount > currentMarketValue ? ApplicationDetails.amount : currentMarketValue;
                }
                let data: any;
                if (ApplicationDetails.documentNature.TRAN_MAJ_CODE === "07" && ApplicationDetails.property && ApplicationDetails.property.length > 0) {
                    leasecalforDutyfee(ApplicationDetails.property);
                } else {
                    data = {
                        "tmaj_code": ApplicationDetails.documentNature.TRAN_MAJ_CODE,
                        "tmin_code": ApplicationDetails.documentNature.TRAN_MIN_CODE,
                        "sroNumber": ApplicationDetails.sroCode,
                        "local_body": 3,
                        "flat_nonflat": "N",
                        "marketValue": currentMarketValue,
                        "finalTaxbleValue": ftv,
                        "con_value": ApplicationDetails.amount,
                        "adv_amount": 0
                    }
                }

                if (ApplicationDetails.documentNature.TRAN_MAJ_CODE == "04" && ApplicationDetails.documentNature.TRAN_MIN_CODE == "03") {
                    setUserCharges(0);
                } else if (ApplicationDetails.documentNature.TRAN_MAJ_CODE == "01" && ApplicationDetails.documentNature.TRAN_MIN_CODE == "25") {
                    setUserCharges(500);
                }
                else {
                    setUserCharges(500);
                    if (ApplicationDetails.documentNature.TRAN_MAJ_CODE != "07")
                        DutyFeeCalculator(data);
                }
                // if(ApplicationDetails.documentNature.TRAN_MAJ_CODE !="01" && ApplicationDetails.documentNature.TRAN_MIN_CODE !="25"){
                // DutyFeeCalculator(data);
                // }

            }
        }
    }, [Section47, Section47A6])

    useEffect(() => {

    }, [CalculatedDutyFee])

    const DutyFeeCalculator = async (data) => {
         if(ApplicationDetails.registrationType.TRAN_MAJ_CODE ==='04' && ApplicationDetails.documentNature.TRAN_MIN_CODE =='04'){            
        let sd_p = ApplicationDetails?.amount && data.finalTaxbleValue <=1000000 ? gPropData.length * 100 : gPropData.length * 1000;
        let rf_p = gPropData.length * 1000 
        let td_p = 0;
          setCalculatedDutyFee({ ...CalculatedDutyFee, TRAN_MAJ_CODE: ApplicationDetails.registrationType.TRAN_MAJ_CODE, TRAN_MIN_CODE: ApplicationDetails.documentNature.TRAN_MIN_CODE, sroCode: ApplicationDetails.sroCode, amount: ApplicationDetails.amount, sd_p: Math.round(sd_p).toString(), td_p: Math.round(td_p).toString(), rf_p: Math.round(rf_p).toString()});
            }else{                 
        let result = await UseDutyCalculator(data);
        if (ApplicationDetails.registrationType.TRAN_MAJ_CODE ==='01' && (ApplicationDetails.documentNature.TRAN_MIN_CODE==='28' || ApplicationDetails.documentNature.TRAN_MIN_CODE==='29')){
            let tempsd =0;
            let temprf =0;
            let temptd =0;
             ApplicationDetails.property.map(function(resulObj){
             tempsd=tempsd + resulObj.Go134.stampDutyFeePayable;
             temprf=temprf + resulObj.Go134.registrationFeePayable;
             temptd=temptd + resulObj.Go134.transferDutyFeePayable
            })
          setCalculatedDutyFee({ ...CalculatedDutyFee, TRAN_MAJ_CODE: ApplicationDetails.registrationType.TRAN_MAJ_CODE, TRAN_MIN_CODE: ApplicationDetails.documentNature.TRAN_MIN_CODE, sroCode: ApplicationDetails.sroCode, amount: ApplicationDetails.amount, sd_p: Math.round(tempsd).toString(), td_p: Math.round(temptd).toString(), rf_p: Math.round(temprf).toString()});
         } 
       
        else {
        if (result.status) {
            setCalculatedDutyFee({ ...CalculatedDutyFee, TRAN_MAJ_CODE: ApplicationDetails.registrationType.TRAN_MAJ_CODE, TRAN_MIN_CODE: ApplicationDetails.documentNature.TRAN_MIN_CODE, sroCode: ApplicationDetails.sroCode, amount: ApplicationDetails.amount, sd_p: result.data.sd_p, td_p: result.data.td_p, rf_p: result.data.rf_p });
        }
        if (Section47) {
            let calvalue = (TotalMarketValueCalculator(ApplicationDetails) - ApplicationDetails.amount) / 2
            data.marketValue = calvalue
            data.con_value = calvalue
            data.finalTaxbleValue = calvalue
            let result2 = await UseDutyCalculator(data);
            setCalculatedDutyFee({ ...CalculatedDutyFee, TRAN_MAJ_CODE: ApplicationDetails.registrationType.TRAN_MAJ_CODE, TRAN_MIN_CODE: ApplicationDetails.documentNature.TRAN_MIN_CODE, sroCode: ApplicationDetails.sroCode, amount: ApplicationDetails.amount, sd_p: result.data.sd_p, sd_p2: result2.data.sd_p, td_p: result.data.td_p, rf_p: result.data.rf_p });
            // setCalculatedDutyFee({ ...CalculatedDutyFee,  sd_p: result2.data.sd_p});
        }
    }
    }
    }
    const DutyFeeForPartition = async (data) => {        
        if(data.tmaj_code =='04' && data.TRAN_MIN_CODE =='04'){            
        let sd_p = ApplicationDetails.amount && data.finalTaxbleValue <=1000000 ? gPropData.length * 100 : gPropData.length * 1000;
        let rf_p = gPropData.length * 1000;
        let td_p = 0;
          setCalculatedDutyFee({ ...CalculatedDutyFee, TRAN_MAJ_CODE: ApplicationDetails.registrationType.TRAN_MAJ_CODE, TRAN_MIN_CODE: ApplicationDetails.documentNature.TRAN_MIN_CODE, sroCode: ApplicationDetails.sroCode, amount: ApplicationDetails.amount, sd_p: Math.round(sd_p).toString(), td_p: Math.round(td_p).toString(), rf_p: Math.round(rf_p).toString()});
            
            }else{ 
        let result = await CallingAxios(UseDutyCalculator(data));
        if (result.status) {
            return result.data;
        }
    }
    }

    const leasecalforDutyfee = async (props: any) => {
        let data: any = {
            "tmaj_code": ApplicationDetails.documentNature.TRAN_MAJ_CODE,
            "tmin_code": ApplicationDetails.documentNature.TRAN_MIN_CODE,
            "tot_rent": TotalMarketValueCalculator(ApplicationDetails),
            "avg_ann_rent": TotalMarketValueCalculator(ApplicationDetails),
            "rentperiod": ApplicationDetails.leasePropertyDetails.lPeriod,
            "nature": props[0].landUseCode
        };
        let dutyCalForLease: any = await CallingAxios(UseGetLeaseDutyFee(data))
        dutyCalForLease = dutyCalForLease.data
        setCalculatedDutyFee({ ...CalculatedDutyFee, 
            TRAN_MAJ_CODE: ApplicationDetails.registrationType.TRAN_MAJ_CODE, 
            TRAN_MIN_CODE: ApplicationDetails.documentNature.TRAN_MIN_CODE, 
            sroCode: ApplicationDetails.sroCode, 
            amount: ApplicationDetails.amount, 
            marketValue: dutyCalForLease?.rent || 0,
            sd_p: dutyCalForLease?.sd_p || 0, 
            td_p: dutyCalForLease?.td_p || 0, 
            rf_p: dutyCalForLease?.rf_p || 0
        });
        
    }
    const GetApplicationDetails = async () => {
        let data: any = localStorage.getItem("GetApplicationDetails");
        if (data == "" || data == undefined) {
            ShowMessagePopup(false, "Invalid Access", "/");
        }
        else {
            await CallGetApp(data);
        }
    }

    const CallGetApp = async (myData) => {
        let data = JSON.parse(myData);
        let result = await CallingAxios(getApplicationDetails(data.applicationId));
        if (result.status) {
            let receivedData = result.data
            localStorage.setItem("GetApplicationDetails", JSON.stringify(result.data));

            if (receivedData.documentNature.TRAN_MAJ_CODE == "02" && receivedData.documentNature.TRAN_MIN_CODE == "06") {
                setFlag1(false);
            }
            if (receivedData.documentNature.TRAN_MAJ_CODE == "04" && receivedData.documentNature.TRAN_MIN_CODE == "03") {
                setFlag1(false);
            }
            if (receivedData.documentNature.TRAN_MAJ_CODE == "01" && receivedData.documentNature.TRAN_MIN_CODE == "20") {
                setFlag1(false);
            }
            if (LoginDetails.loginName == "Titdco") {
                setFlag1(false);
            }
            if (receivedData.documentNature.TRAN_MAJ_CODE === "20" || Number(receivedData.documentNature.TRAN_MAJ_CODE) >= 30 && Number(receivedData.documentNature.TRAN_MAJ_CODE) < 35 || Number(receivedData.documentNature.TRAN_MAJ_CODE) > 36 && Number(receivedData.documentNature.TRAN_MAJ_CODE) <= 44) {
                setBook3Nd4Prop(true);
            } else {
                setBook3Nd4Prop(false);
            }
            if (receivedData.documentNature.TRAN_MAJ_CODE == "20" || receivedData.documentNature.TRAN_MAJ_CODE == "31" || receivedData.documentNature.TRAN_MAJ_CODE == "39" || receivedData.documentNature.TRAN_MAJ_CODE == "40") {
                setClamintNtDisplay(true)
            } else {
                setClamintNtDisplay(false)
            }
            if (receivedData.documentNature.TRAN_MAJ_CODE === "05" || receivedData.documentNature.TRAN_MAJ_CODE === "06") {
                setStatusBar(true)
            } else {
                setStatusBar(false)
            }
            if ((receivedData.documentNature.TRAN_MAJ_CODE == "01" || receivedData.documentNature.TRAN_MAJ_CODE == "02" || receivedData.documentNature.TRAN_MAJ_CODE == "03" || receivedData.documentNature.TRAN_MAJ_CODE == "06") && receivedData.documentNature.TRAN_MIN_CODE == "01") {
                setTdAllow(true)
            } else if (receivedData.documentNature.TRAN_MAJ_CODE == "07") {
                receivedData.property.forEach((x: any) => {
                    if (x?.leaseDetails?.lPeriod > 30) {
                        setTdAllow(true)
                    }
                })
            } else {
                setTdAllow(false)
            }

            let covenantList = "", acquireCovList = "", A: any = [], B: any = [];
            let PreList = covenatsTypeFinder(result.data.registrationType);
            let j = 1;
            PreList.map((x: any, i: number) => {
                covenantList = covenantList + (i + 1) + ". " + x.value + "\n \n";
                j = j + 1;
            })
            if (result.data.covanants && result.data.covanants.covanants.length) {
                result.data.covanants.covanants.map((data, index) => {
                    covenantList = covenantList + (index + j) + ". " + data.value + "\n \n";
                })
            }
            if (result.data.covanants && result.data.covanants.acquireCovenents.length > 0) {
                result.data.covanants.acquireCovenents.map((data, index) => {
                    acquireCovList = acquireCovList + (index + 1) + ". " + data.value + "\n \n";
                })
            }
            let Uploads = await UseGetUploadDoc(receivedData.applicationId);
            if (Uploads.status) {
                receivedData = { ...receivedData, Uploads: Uploads.data }
                if (receivedData && receivedData.Uploads && receivedData.Uploads && receivedData.Uploads.documents && receivedData.Uploads.documents.length > 0) {
                    receivedData.Uploads.documents.map((data: any) => {
                        if (data.fileName == "document") {
                            setCheckFileOrNot(true);
                        }
                        if (data.fileName === 'anywheredocument') {
                            setCheckAnywhereFileOrNot(true)
                        }
                    })
                }
            }
            else {
                receivedData = { ...receivedData, Uploads: { documents: [] } }
            }
            if (receivedData.docProcessType == "PDE") {
                setIsWithDoc(false);
            }
            else {
                setIsWithDoc(true);
            }
            if (receivedData && receivedData.property && receivedData.property.length > 0) {
                receivedData.property.forEach((propData: any) => {
                    // console.log(":::::propData::::",propData)
                    if (propData.typeOfProperty == "Others") {
                        A.push(propData);
                    } else {
                        B.push(propData);
                    }
                })
            }
            setGPropData(B); setOPropData(A);
            setCovenantsMessage(covenantList);
            setAcquisitionCovenants(acquireCovList);
            setApplicationDetails(receivedData);
            if (receivedData?.documentNature) {
                const checkIsMutableDocument = (documentNature: any): boolean => {
                    const majorCode = documentNature?.TRAN_MAJ_CODE;
                    const minorCode = documentNature?.TRAN_MIN_CODE;
                    const URBAN_MUTATION_ACCEPT_MAJOR_CODES = ['01', '03', '04', '05', '06'];
                    const URBAN_MUTATION_ACCEPT_MINOR_CODES = {
                        '01': ['01', '04', '05', '06', '08', '14', '15', '16', '17', '19', '27'],
                        '03': ['01', '02', '03', '04', '05', '06', '07', '08', '09'],
                        '04': ['01', '02'],
                        '05': ['01', '02'],
                        '06': ['01'],
                    };
                    const isMutationNeededMajor = URBAN_MUTATION_ACCEPT_MAJOR_CODES?.includes(majorCode);
                    if (isMutationNeededMajor) {
                        return URBAN_MUTATION_ACCEPT_MINOR_CODES[+majorCode]?.includes(minorCode) || URBAN_MUTATION_ACCEPT_MINOR_CODES[majorCode]?.includes(minorCode);
                    }
                    return false;
                };                
                const allowPayments = checkIsMutableDocument(receivedData?.documentNature)
                setAllowMutationPayment(allowPayments)
                if (allowPayments && B?.length) {
                    setIsMutationPaymentCleared(isMutationPaymentDuesCleared(B));
                } else {
                    setIsMutationPaymentCleared(true);
                }
            }

            let marketVal = 0;
            if(ApplicationDetails.documentNature.TRAN_MAJ_CODE == "07")
                marketVal = TotalMarketValueCalculator(ApplicationDetails)
            else{
                receivedData?.property?.map(x => {
                    if (x.marketValue) {
                        marketVal = marketVal + x.marketValue;
                    }
                })
            }
            const considerationVal = receivedData.amount;
            let mainVal = considerationVal > marketVal ? considerationVal : marketVal;
            // console.log("::::::mainVal::",mainVal)
            // if (mainVal > 1000000) {
            //     // setDoEsign(true);
            // }
            // setAllESignsCompleted(true);
        }
    
        //     let covenantList = "";
        //     let PreList = covenatsTypeFinder(result.data.registrationType);
        //     let j = 1;
        //     PreList.map((x: any, i: number) => {
        //         covenantList = covenantList + (i + 1) + ". " + x.value + "\n \n";
        //         j = j + 1;
        //     })
        //     if (result.data.covanants && result.data.covanants.covanants.length) {
        //         result.data.covanants.covanants.map((data, index) => {
        //             covenantList = covenantList + (index + j) + ". " + data.value + "\n \n";
        //         })
        //     }
        //     let Uploads = await UseGetUploadDoc(receivedData.applicationId);
        //     if (Uploads.status) {
        //         receivedData = { ...receivedData, Uploads: Uploads.data }
        // 		if(receivedData && receivedData.Uploads && receivedData.Uploads && receivedData.Uploads.documents && receivedData.Uploads.documents.length >0){
        // 			receivedData.Uploads.documents.map((data:any)=>{
        // 				if(data.fileName == "document"){
        // 					setCheckFileOrNot(true);
        // 				}
        // 			})
        // 		}
        //     }
        //     else {
        //         receivedData = { ...receivedData, Uploads: { documents: [] } }
        //     }
        //     if (receivedData.docProcessType == "PDE") {
        //         setIsWithDoc(false);
        //     }
        //     else {
        //         setIsWithDoc(true);
        //     }
        //     setCovenantsMessage(covenantList);
        //     setApplicationDetails(receivedData);
        // } 
        else {
            // window.alert(result.message);
            ShowMessagePopup(false, "Featch Application Details Failed", "")
        }
    }

  

    useEffect(() => {
        if (!ApplicationDetails.registrationType) { return; }
        if (ApplicationDetails.docProcessType == "PDEWD") {
            if (ApplicationDetails.claimant.length && ApplicationDetails.property.length && ApplicationDetails.registrationType.TRAN_MAJ_CODE == "04") {
                if (ApplicationDetails.presenter && ApplicationDetails.presenter.length) {
                    setAllfilled({ ...Allfilled, isDataPresent: true, isPresenterSelected: true });
                }
                else {
                    setAllfilled({ ...Allfilled, isDataPresent: true });
                }
            } else if (ApplicationDetails.executent.length && ApplicationDetails.property.length) {
                if (ApplicationDetails.registrationType.PARTY2 && ApplicationDetails.claimant.length) {
                    if (ApplicationDetails.presenter && ApplicationDetails.presenter.length) {
                        setAllfilled({ ...Allfilled, isDataPresent: true, isPresenterSelected: true });
                    }
                    else {
                        setAllfilled({ ...Allfilled, isDataPresent: true });
                    }
                }
                else if (!ApplicationDetails.registrationType.PARTY2) {
                    if (ApplicationDetails.presenter && ApplicationDetails.presenter[0].id) {
                        setAllfilled({ ...Allfilled, isDataPresent: true, isPresenterSelected: true });
                    }
                    else {
                        setAllfilled({ ...Allfilled, isDataPresent: true });
                    }
                }

            } else if (ApplicationDetails.executent && ApplicationDetails.executent.length && book3Nd4Prop && !clamintNtDisplay) {
                if (ApplicationDetails.presenter && ApplicationDetails.presenter.length) {
                    setAllfilled({ ...Allfilled, isDataPresent: true, isPresenterSelected: true });
                }
                else {
                    setAllfilled({ ...Allfilled, isDataPresent: true });
                }
            }
        } else {
            if (ApplicationDetails.claimant.length && ApplicationDetails.property.length && ApplicationDetails.registrationType.TRAN_MAJ_CODE == "04") {
                if (ApplicationDetails.presenter && ApplicationDetails.presenter.length) {
                    setAllfilled({ ...Allfilled, isDataPresent: true, isPresenterSelected: true });
                }
                else {
                    setAllfilled({ ...Allfilled, isDataPresent: true });
                }
            }
            if (ApplicationDetails.executent.length && ApplicationDetails.property.length) {
                if (ApplicationDetails.registrationType.PARTY2 && ApplicationDetails.claimant.length) {
                    if (ApplicationDetails.presenter && ApplicationDetails.presenter.length) {
                        setAllfilled({ ...Allfilled, isDataPresent: true, isPresenterSelected: true });
                    }
                    else {
                        setAllfilled({ ...Allfilled, isDataPresent: true });
                    }
                }
                else if (!ApplicationDetails.registrationType.PARTY2) {
                    if (ApplicationDetails.presenter && ApplicationDetails.presenter[0].id) {
                        setAllfilled({ ...Allfilled, isDataPresent: true, isPresenterSelected: true });
                    }
                    else {
                        setAllfilled({ ...Allfilled, isDataPresent: true });
                    }
                }

            }
            if (clamintNtDisplay === true) {
                if (ApplicationDetails.executent && ApplicationDetails.executent.length && book3Nd4Prop) {
                    if (ApplicationDetails.presenter && ApplicationDetails.presenter.length) {
                        setAllfilled({ ...Allfilled, isDataPresent: true, isPresenterSelected: true });
                    }
                    else {
                        setAllfilled({ ...Allfilled, isDataPresent: true });
                    }
                }
            } else {
                if (ApplicationDetails.executent && ApplicationDetails.executent.length && ApplicationDetails.claimant && ApplicationDetails.claimant.length && book3Nd4Prop) {
                    if (ApplicationDetails.presenter && ApplicationDetails.presenter.length) {
                        setAllfilled({ ...Allfilled, isDataPresent: true, isPresenterSelected: true });
                    }
                    else {
                        setAllfilled({ ...Allfilled, isDataPresent: true });
                    }
                }
            }

        }
       
    }, [ApplicationDetails, ApplicationDetails.executent, ApplicationDetails.claimant, ApplicationDetails.property, ApplicationDetails.payment])

    const covenatsTypeFinder = (key) => {
        switch (key.TRAN_MAJ_CODE) {
            case "01": return covenantType.saleMessage;
            case "02": return covenantType.mortgageMessage;
            case "03": return covenantType.giftMessage;
            default: return [];
        }
    }

    useEffect(() => {
        if (DeleteOption.response) {
            CallDeleteAction(DeleteOption.deleteId, DeleteOption.applicationId, DeleteOption.type, DeleteOption.singleUser);
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


    const CallDeleteAction = async (DeleteId, applicationId, type, appData?) => {
        let Data = {}
        let result: any;
        if (type == "party") {
            Data = {
                id: DeleteId,
                applicationId: applicationId
            }

            if (appData && appData.represent && appData.represent.length > 0) {
                appData.represent.forEach(async (e: any) => {
                    let repData = {
                        partyId: e._id,
                        parentPartyId: e.parentPartyId
                    }
                    await CallDeleterepresentative(repData);
                })
            }
            await CallDeleteParty(Data);
            if(appData && appData?.propertyNumbers) {
                const propertyNumberArray = appData.propertyNumbers.split(',').map(code => code.trim());
                let propertyArray = [];
                propertyNumberArray.forEach((propertyId: any) => {
                    if (propertyId) {
                        propertyArray.push(ApplicationDetails.property.find((property: any) => String(property.seqNumber) === propertyId));
                    }
                });
               for (const property of propertyArray) {
                await CallingAxios(UseUpdateProperty({...property, partyNumber : ""}))
               }
            }
        }
        else if (type == "representative") {
            Data = {
                partyId: DeleteId,
                parentPartyId: applicationId
            }
            await CallDeleterepresentative(Data);
        }
        else if (type == "property") {
            Data = {
                propertyId: DeleteId,
                applicationId: applicationId
            }
            await CallDeleteProperty(Data);
        }
        else if (type == "Payment") {
            await CallDeletePayment(DeleteId);
        }
        else if (type == "Uploads") {
            await CallDeleteUploads(DeleteId);
        }
        GetApplicationDetails()
    }

    const CallDeleteParty = async (Data: any) => {
        let result = await CallingAxios(useDeleteParty(Data));
        if (result.status) {
            dispatch(PopupAction({ enable: true, type: true, message: "Party deleted successfully", redirectOnSuccess: "" }));
            GetApplicationDetails()
        } else {
            dispatch(PopupAction({ enable: true, type: false, message: result.message, redirectOnSuccess: "" }));
        }
    }

    const CallDeleteProperty = async (Data: any) => {
        let result = await CallingAxios(useDeleteProperty(Data, LoginDetails.token));
        if (result.status) {
            dispatch(PopupAction({ enable: true, type: true, message: "Property deleted successfully", redirectOnSuccess: "" }));
            GetApplicationDetails();
            router.reload();
        } else {
            dispatch(PopupAction({ enable: true, type: false, message: result.message, redirectOnSuccess: "" }));
        }
    }

    const CallDeletePayment = async (id: any) => {
        let data = { id, applicationId: ApplicationDetails.applicationId }
        let result = await CallingAxios(UseDeletePaymentDetails(data));
        if (result.status) {
            switch (ApplicationDetails.registrationType.TRAN_MAJ_CODE) {
                case "01": ShowMessagePopup(true, "Payment deleted successfully", ""); break;
                case "02": ShowMessagePopup(true, "Mortgage payment details deleted successfully", ""); break;
                case "03": ShowMessagePopup(true, "Relation details deleted successfully", ""); break;
                default:
                    break;
            }
            GetApplicationDetails();
        }
        else {
            ShowMessagePopup(false, "Delete action failed", "");
        }
    }

    const CallDeleteUploads = async (id: any) => {
        let result = await CallingAxios(UseDeleteUploadDoc(id, ApplicationDetails.applicationId));
        if (result.status) {
            ShowMessagePopup(true, "File deleted successfully", "");
            setCheckFileOrNot(false);
            setCheckAnywhereFileOrNot(false);
            GetApplicationDetails();
        }
        else {
            ShowMessagePopup(false, "Delete action failed", "");
        }
    }


    const CallDeleterepresentative = async (Data: any) => {
        let data = { ...Data, applicationId: ApplicationDetails.applicationId }
        let result = await CallingAxios(useDeleterepresentative(data, LoginDetails.token));
        if (result.status) {
            dispatch(PopupAction({ enable: true, type: true, message: "Representative deleted successfully", redirectOnSuccess: "" }));
        } else {
            dispatch(PopupAction({ enable: true, type: false, message: result.message, redirectOnSuccess: "" }));
            ShowMessagePopup(false, "Representative Delete Action Failed", "");
        }
    }


    const redirectToPage = (location: string) => {
        router.push({
            pathname: location,
        })
    }


    const ShowDeletePopup = (message, redirectOnSuccess, deleteId, applicationId, type, singleUser?) => {
        dispatch(DeletePopupAction({ enable: true, inProcess: false, message, redirectOnSuccess, deleteId, applicationId, type, singleUser }));
    }

    const OpenForm60Action = (esignPartyData: string) => {
        localStorage.setItem("esignPartyData", encryptId(JSON.stringify(esignPartyData)))
        redirectToPage("/Form60Page");
    }

    const AadharNumberIdentifier = () => {
        let AadharArray = [];
        ApplicationDetails.executent.map(x => {
            if (x.aadhaar) { AadharArray.push(x.aadhaar); }
            if (Object.keys(x.represent).length && x.represent[0].aadhaar) { AadharArray.push(x.represent[0].aadhaar); }
        })
        ApplicationDetails.claimant.map(x => {
            if (x.aadhaar) { AadharArray.push(x.aadhaar); }
            if (Object.keys(x.represent).length && x.represent[0].aadhaar) { AadharArray.push(x.represent[0].aadhaar); }
        })
        ApplicationDetails.witness.map(x => {
            if (x.aadhaar) { AadharArray.push(x.aadhaar); }
        })
        return AadharArray;
    }
    const PanNumberIdentifier = () => {
        let PanArray = [];
        ApplicationDetails.executent.map(executent => {
            if (executent.panNoOrForm60or61) 
                PanArray.push(executent.panNoOrForm60or61);
            if (Object.keys(executent.represent).length && executent.represent[0].panNoOrForm60or61) 
                PanArray.push(executent.represent[0].panNoOrForm60or61);
        })
        ApplicationDetails.claimant.map(claimant => {
            if (claimant.panNoOrForm60or61) 
                PanArray.push(claimant.panNoOrForm60or61);
            if (Object.keys(claimant.represent).length && claimant.represent[0].panNoOrForm60or61) 
                PanArray.push(claimant.represent[0].panNoOrForm60or61);
        })
        ApplicationDetails.witness.map(witness => {
            if (witness.panNoOrForm60or61) { PanArray.push(witness.panNoOrForm60or61); }
        })
        return PanArray;
    }

    const OpenPartyAction = (operation: string, PartyType: string, type: string, data: any, docDetails?: any) => {
        if (docDetails && (operation == "Add" || operation == "AddRep")) {
            localStorage.setItem("docDetailsofPopUp", JSON.stringify(docDetails.documentNature))
        }
        if (operation == 'Add' && type == 'Witness' && ApplicationDetails.witness && ApplicationDetails.witness.length === 2) {
            return ShowMessagePopup(false, "2 witness are enough", "");
        }
        let ExistingAadhar = AadharNumberIdentifier();
        let ExistingPAN = PanNumberIdentifier();
        localStorage.setItem("ExistingAadhar", JSON.stringify(ExistingAadhar, null, 2));
        localStorage.setItem("ExistingPAN", JSON.stringify(ExistingPAN, null, 2));
        let query = {
            name: "",
            relationType: "",
            relationName: "",
            age: "",
            panNoOrForm60or61: "",
            tan: "",
            aadhaar: "",
            representType: type,
            email: "",
            phone: "",
            address: "",
            representSubType: "",
            operation: operation,
            partyId: "",
            PartyType: PartyType,
            applicationId: ApplicationDetails.applicationId,
            partyCode: PartyType == "EXECUTANT" ? ApplicationDetails.registrationType.PARTY1_CODE : PartyType === "WITNESS" ? ApplicationDetails.registrationType.PARTY3_CODE : ApplicationDetails.registrationType.PARTY2_CODE
        }

        if (operation == "View" || operation == "Edit") {
            query = { ...data };
            query.representType = type;
            query.operation = operation;
            query.partyId = data._id;
            query.applicationId = ApplicationDetails.applicationId;

        }
        if (operation == "AddRep") {
            query = { ...data };
            query.representType = "Representative";
            query.representSubType = type;
            query.operation = operation;
            query.partyId = data._id;
            query.applicationId = ApplicationDetails.applicationId,
                query.PartyType = "Public"
        }
        localStorage.setItem("CurrentRepresentDetails", JSON.stringify(query));
        localStorage.setItem("CurrentPartyDetails", JSON.stringify(query));
        dispatch(SaveCurrentRepresntDetails(query));
        dispatch(SaveCurrentPartyDetails(query));
        redirectToPage("/AddPartyPage");
    }

    const checkDocType = (maj_code, min_code) => {
        // console.log(maj_code, min_code);
        maj_code = parseInt(maj_code);
        if (allowSameSurvey[`${maj_code}`] && (allowSameSurvey[`${maj_code}`].length === 0 || allowSameSurvey[`${maj_code}`].includes(min_code))) {
            return true
        } else {
            return false
        }
    }
    let MvExemptionScenario = async (data: any, exemptionMV: any, exConValue?: any) => {
        let amountValue = exConValue != undefined ? exConValue : data.amount;
        // window.alert(JSON.stringify(amountValue))
        let ftv: any;
        if (data.docsExcutedBy == "GovtBody") {
            ftv = data.amount;
        } else {
            ftv = amountValue > exemptionMV ? amountValue : exemptionMV;
        }
        const dfDatafromPartitionExemption: any = {
            "tmaj_code": data.documentNature.TRAN_MAJ_CODE,
            "tmin_code": data.documentNature.TRAN_MIN_CODE,
            "sroNumber": data.sroCode,
            "local_body": 3,
            "flat_nonflat": "N",
            "marketValue": amountValue > exemptionMV ? amountValue : exemptionMV,
            "finalTaxbleValue": amountValue > exemptionMV ? amountValue : exemptionMV,
            "con_value": amountValue,
            "adv_amount": 0
        }
        let dfData = await DutyFeeForPartition(dfDatafromPartitionExemption);
        return dfData;
    }
    const handleSection47 = async () => {
        if (Section47 || Section47A6) {
            const data2: any = {
                sd_p: CalculatedDutyFee.sd_p,
                rf_p: CalculatedDutyFee.rf_p,
                td_p: CalculatedDutyFee.td_p,
                marketvalue: TotalMarketValueCalculator(ApplicationDetails),
                ConsiderationValue: ApplicationDetails.amount,
                applicationId: ApplicationDetails.applicationId,
                DifferentialStampDuty: CalculatedDutyFee.sd_p2,
                sroCode: ApplicationDetails.sroCode,
                totalPayable: Number(CalculatedDutyFee.sd_p) + Number(CalculatedDutyFee.td_p) + Number(CalculatedDutyFee.rf_p) + userCharges,
                userCharges: userCharges,
            }
            if(Section47) {
                data2.Section_47 = "Y"
            } else {
                data2.SectionType = "Section 47A(6)"
            }
            await SaveSection_47Details(data2)
        }
    }
    let submitcond = ApplicationDetails?.Uploads?.documents?.filter((singleFile) => singleFile.fileName === 'anywheredocument').length > 0;

    const hasEmptyPAN = (data: any): boolean => {
    const parties = [...(data.executent || []),...(data.claimant || []),...(data.represent || []),];

        return parties.some((party) =>
        party.isSelectedPanOrForm60 === "pan" &&
        (!party.panNoOrForm60or61 || party.panNoOrForm60or61.trim() === ""));
    };


    const reexecuteSubmitFlow = async () => {
        setShowModal(false);
        await OnFinalSubmit(true);
    }


    const representMandatoryData = (data: any) => {
        const executants = data?.executent || [];
        const claimants = data?.claimant || [];
        const allParties = [...executants, ...claimants];
        const invalidExParty = executants.some((party) => party?.isRepChecked === true && (!party?.represent || party?.represent.length === 0));
        const invalidClParty = claimants.some((party) => party?.isRepChecked === true && (!party?.represent || party?.represent.length === 0));

        if (invalidExParty && invalidClParty) {
            ShowMessagePopup(false, "Representative is mandatory for EXECUTANT & CLAIMANT", "")
            return false;
        }
        else if (invalidExParty) {
            ShowMessagePopup(false, "Representative is mandatory for EXECUTANT", "")
            return false;
        }
        else if (invalidClParty) {
            ShowMessagePopup(false, "Representative is mandatory for CLAIMANT", "")
            return false;
        }
    
        return true;
    };


    const OnFinalSubmit = async (confirmation:boolean) => {
        if (Anywherestat) {
            if (!submitcond) {
                return ShowMessagePopup(false, "Kindly Upload the anywhere document", "");
            }
        }

        const executants : any = ApplicationDetails?.executent || []
        for(let i=0; i<executants.length; i++){
            if(executants[i].exExecutant && executants[i].represent.length == 0){
                return ShowMessagePopup(false, "Please add Representative Details.", "");
            }
        }

        let ob = [];
        let ps = ApplicationDetails.property ? ApplicationDetails.property : [];
        if( ApplicationDetails.documentNature.TRAN_MAJ_CODE !== "07" ){
            ps.forEach(p => {
                let exList = p.ExtentList ? p.ExtentList : [];
                exList.forEach(e => {
                    if (p.propertyType && p.propertyType.includes('RURAL')) {
                        if (ob.filter(o => o.villageCode === p.villageCode && o.sryNo === (p.lpmNo ? p.lpmNo : e.survayNo)).length) {
                            let ind = ob.findIndex(o => o.villageCode === p.villageCode && o.sryNo === (p.lpmNo ? p.lpmNo : e.survayNo));
                            ob[ind].count = ob[ind].count + 1;
                        } else {
                            ob[ob.length] = { 'villageCode': p.villageCode, 'sryNo': (p.lpmNo ? p.lpmNo : e.survayNo), 'count': 1 };
                        }
                    }
                })
            })
        }

        if( ApplicationDetails.documentNature.TRAN_MAJ_CODE === "07" ){
             const data = {
                applicationId : ApplicationDetails.applicationId,
                leasePropertyDetails: {}
              }
            CallingAxios(UseUpdateDocument(data))
        }

        if (!confirmation) {
            if (ApplicationDetails.typeOfStamps === 'Non-Judicial Stamp Papers' && ApplicationDetails.nonJudicialStamps && ApplicationDetails.nonJudicialStamps.length > 0) {
                try {
                    let result = await CallingAxios(validateUtilizedNonJudicialStamps(ApplicationDetails.nonJudicialStamps));
                    if (!result.status) {
                        return ShowMessagePopup(false, "Non Judicial stamps are already Utilized.", "")
                    }
                    else if (result.status && result.data?.utilizedStampDataArr && result.data.utilizedStampDataArr.length > 0 && result.data.utilizedStampDataArr[0]?.documentId?.length > 0) {
                        setShowModal(true);
                        return false;
                    }
                } catch (err) {
                    return ShowMessagePopup(false, err.message ?? "Fetching the utilized stamps failed.", "")
                }
            }
        }

        if(ApplicationDetails.documentNature.TRAN_MAJ_CODE === '04') {
            const propertyCodes = ApplicationDetails.property.filter(p => !p.partyNumber || p.partyNumber.trim() === '').map(p => p.seqNumber);
            if(propertyCodes.length > 0) {
                return ShowMessagePopup(false, `Please add party names for the following property(ies): ${propertyCodes.join(', ')}`, "");
            }
            for (const prop of ApplicationDetails.property) {
                const partyCodes = (prop.partyNumber || "").split(',').map(code => code.trim());
                const claimantCodes = new Set(ApplicationDetails.claimant.map(c => String(c.seqNumber)));
                const invalidCode = partyCodes.find(code => !claimantCodes.has(code));
                if (invalidCode) {
                    return ShowMessagePopup(false, `Property Number ${prop.seqNumber} has a Claimant (${invalidCode}) that does not match any claimant in the application.`, "");
                }
            }
        }

        if (ApplicationDetails.documentNature.TRAN_MAJ_CODE === '04'  && ApplicationDetails.documentNature.TRAN_MIN_CODE != '03') {
            if(ApplicationDetails.claimant.length<2){
                return ShowMessagePopup(false, "Minimum of two Claimants must be added to proceed with the Partition document.", "");
            }
            const partitionPropertyDetails = [];
            const  ruralProperties = ApplicationDetails.property.filter(obj=>obj.propertyType==='RURAL(AGRICULTURE) [గ్రామీణ (వ్యవసాయ భూమి)]'&& !obj.lpmNo);
            ruralProperties.forEach((item:any)=> {
                const tExtent = parseFloat(item.tExtent || 0);
                item.ExtentList.forEach((ext:any) => {
                    const keyKhata = ext.khataNumber;
                    const keySurvey = ext.survayNo;
                    const existing = partitionPropertyDetails.find(entry =>entry.khataNumber === keyKhata && entry.surveyNo === keySurvey);
                    if (existing) {
                        existing.tExtent = parseFloat((parseFloat(existing.tExtent) + tExtent).toFixed(4));
                    } else {
                        partitionPropertyDetails.push({
                            weblandOccupantExtent: item.webLandDetails?.occupantExtent || 0,
                            khataNumber: keyKhata,
                            surveyNo: keySurvey,
                            tExtent: tExtent
                        });
                    }
                });
            });
            const partialProperties = partitionPropertyDetails.filter(obj=>obj.tExtent!=obj.weblandOccupantExtent);
            if(partialProperties.length > 0){
                return ShowMessagePopup(false, `Occupied Extent does not match with the Selling Extent in survey No ${partialProperties[0].surveyNo} and Khata Number ${partialProperties[0].khataNumber}.`, "");
            }
        }

        if ( ApplicationDetails.documentNature.TRAN_MAJ_CODE != '07' && ob.length && !checkDocType(ApplicationDetails.documentNature.TRAN_MAJ_CODE, ApplicationDetails.documentNature.TRAN_MIN_CODE) && ob.some(o => o.count > 1)) {
            ShowMessagePopup(false, "Cannot include multiple rural properties from same survey number", "");
        }
        else {
            if (ApplicationDetails.docProcessType == "PDEWD") {
                if (ApplicationDetails?.payment.length == 0 && (ApplicationDetails.documentNature.TRAN_MAJ_CODE == "01" || ApplicationDetails.documentNature.TRAN_MAJ_CODE == "02" || ApplicationDetails.documentNature.TRAN_MAJ_CODE == "03")) {
                    return ShowMessagePopup(false, "Kindly Enter Payment Details", "");
                }
                if (ApplicationDetails.witness.length === 1 || ApplicationDetails.witness.length === 0 && (ApplicationDetails.documentNature.TRAN_MAJ_CODE == "02")) {
                    return ShowMessagePopup(false, "2 witnesses are mandatory", "");
                }
                if (ApplicationDetails.registrationType.TRAN_MAJ_CODE == "01") {
                    let total = 0;
                    ApplicationDetails.payment.map(x => { total = total + parseInt(x.payAmount); })
                    if (total != parseInt(ApplicationDetails.amount)) {
                        return ShowMessagePopup(false, "Total of payment should be equal to considaration value :" + ApplicationDetails.amount, "")
                    }
                }

            }
            if (ApplicationDetails.registrationType?.TRAN_MAJ_CODE != "04") {
                let error = false
                ApplicationDetails.executent.map((x: any, i: number) => { if (MissingFieldinParty(x, "boolean")) { error = true } })
                if (error) { return ShowMessagePopup(false, "Kindly Fill Missing Fields in Executants", ""); }
            }
            if (ApplicationDetails.registrationType?.PARTY2) {
                let error = false
                ApplicationDetails?.claimant?.map((x: any, i: number) => { if (MissingFieldinParty(x, "boolean")) { error = true } })
                if (error) { return ShowMessagePopup(false, "Kindly Fill Missing Fields in Claimants", ""); }
            }
            let PropertyError = false
            ApplicationDetails.property.map((x: any, i: number) => { if (MissigFieldinProperty(x, "boolean")) { PropertyError = true } });
            if (PropertyError) { return ShowMessagePopup(false, "Kindly Fill Missing Fields in Property", ""); }
            //CRDA Changes Party validation
            if (CrdaEmpCheck[parseInt(ApplicationDetails.documentNature.TRAN_MAJ_CODE)] && CrdaEmpCheck[parseInt(ApplicationDetails.documentNature.TRAN_MAJ_CODE)].includes(ApplicationDetails.documentNature.TRAN_MIN_CODE)) {
                let empAdharList: any = [], reExcutent: any = [], reClment: any = [];
                if (ApplicationDetails.executent && ApplicationDetails.executent.length > 0) {
                    reExcutent = await recursiveIForAdhar(ApplicationDetails.executent, "aadhaar", "represent", "EX")
                }
                if (ApplicationDetails.claimant && ApplicationDetails.claimant.length > 0) {
                    reClment = await recursiveIForAdhar(ApplicationDetails.claimant, "aadhaar", "represent", "CL");
                }
                empAdharList = [...reExcutent, ...reClment];
                let check: any = await UseCrdaEmpCheck({ "aadhar": empAdharList });
                if (!check.status) {
                    return ShowMessagePopup(false, "parties Aadharnumber Should not match with CRDA", "")
                }
            }

            let isValidSubmitForm = mandatoryDetails(ApplicationDetails);
            // isValidSubmitForm = false;
            if (isValidSubmitForm == false) {
                //  ShowMessagePopup(false, "Kindly Fill Missing Fields PAN or Form60/61 in Parties", "");
                return false;
            }

            let isRepMandForm = representMandatoryData(ApplicationDetails);
            
            if (!isRepMandForm) {
                return false;
            }
              
            // if(doEsign && hasEmptyPAN(ApplicationDetails)){
            //     return ShowMessagePopup(false, "Consideration or MarketValue is more than 1000000, So PAN or Form60/61 is mandatory","")
            // }

            // if (!allESignsCompleted) {
            //     return ShowMessagePopup(false, "All parties eSign mandotory for final submit", "")
            // }
            if (!window.confirm("Are you sure to submit document ?")) { return; }
            else {
                // let mValue = ApplicationDetails?.property[0]?.marketValue;
                // let eqValue:boolean= false,count=0
                // ApplicationDetails?.property.forEach((mv:any)=>{
                //     if(mValue === mv.marketValue) count++;
                // })
                // if(count === ApplicationDetails?.property.length){eqValue=true}
                let Obj: any = {}, totalMval = 0, partitonMV: any = 0, dfData: any = "", highestMValue: any, exchnge_CNValue: any = 0;
                if (ApplicationDetails?.documentNature.TRAN_MAJ_CODE == "04" && ApplicationDetails?.property && ApplicationDetails?.property.length >= 1) {

                    ApplicationDetails?.property.reduce((prev: any, curr: any) => {
                        Obj[curr.partyNumber] = Obj[curr.partyNumber] == undefined ? curr.marketValue : Obj[curr.partyNumber] + curr.marketValue;
                        totalMval = totalMval == 0 ? curr.marketValue : totalMval + curr.marketValue;
                        return;
                    }, Obj)
                    let ExemMv: any = Math.max.apply(null, Object.values(Obj));
                    partitonMV = totalMval - ExemMv;
                    const dfDatafromPartitionExemption: any = {
                        "tmaj_code": ApplicationDetails.documentNature.TRAN_MAJ_CODE,
                        "tmin_code": ApplicationDetails.documentNature.TRAN_MIN_CODE,
                        "sroNumber": ApplicationDetails.sroCode,
                        "local_body": 3,
                        "flat_nonflat": "N",
                        "marketValue": partitonMV,
                        "finalTaxbleValue": partitonMV,
                        "con_value": ApplicationDetails.amount,
                        "adv_amount": 0
                    }
                    if(ApplicationDetails?.documentNature.TRAN_MAJ_CODE == "04" && ApplicationDetails?.documentNature.TRAN_MIN_CODE !== "04" ){
                     dfData = await DutyFeeForPartition(dfDatafromPartitionExemption);
                    }
                } else if (ApplicationDetails?.documentNature.TRAN_MAJ_CODE == "06" && ApplicationDetails?.property && ApplicationDetails?.property.length >= 1) {
                    let fCv: any = 0, fMv: any = 0, sCv: any = 0, sMv: any = 0;
                    ApplicationDetails?.property.map((d: any) => {
                        exchnge_CNValue = exchnge_CNValue == 0 ? d.considarartionValue : exchnge_CNValue + d.considarartionValue;
                        if (d.exchangeTo == "First Party") {
                            fCv = fCv == 0 ? d.considarartionValue : fCv + d.considarartionValue;
                            fMv = fMv == 0 ? d.marketValue : fMv + d.marketValue;
                        } else {
                            sCv = sCv == 0 ? d.considarartionValue : sCv + d.considarartionValue;
                            sMv = sMv == 0 ? d.marketValue : sMv + d.marketValue;
                        }
                    })
                    let HighValFrmFirstParty: any = Math.max(fCv, fMv);
                    let HighValFrmScndParty: any = Math.max(sCv, sMv);
                    // ApplicationDetails?.property.reduce((prev:any,curr:any)=>{
                    //     let partyMValue = Math.max(curr.marketValue,curr.considarartionValue);
                    //     // window.alert(JSON.stringify(partyMValue));
                    //     Obj[curr.exchangeTo] =Obj[curr.exchangeTo] == undefined ?  partyMValue : Obj[curr.exchangeTo] + partyMValue;
                    //     totalMval = totalMval == 0 ? partyMValue : totalMval + partyMValue;
                    //     exchnge_CNValue = exchnge_CNValue == 0 ? curr.considarartionValue : exchnge_CNValue + curr.considarartionValue;
                    //     return;
                    // },Obj);
                    // window.alert(JSON.stringify(Obj));
                    highestMValue = Math.max(HighValFrmFirstParty, HighValFrmScndParty);
                    let updateStatus: any = {
                        applicationId: ApplicationDetails.applicationId,
                        amount: exchnge_CNValue
                    }
                    await CallingAxios(UseChangeStatus(updateStatus));
                    ///////
                    // window.alert(JSON.stringify(highestMValue));
                    // if(highestMValue > exchnge_CNValue){
                    //     partitonMV =highestMValue
                    // }
                    dfData = await MvExemptionScenario(ApplicationDetails, "", highestMValue);
                }

                let totalMV: number = 0; let totalRRShare: any = 0, totalReleaseMv: any = 0
                if (ApplicationDetails?.documentNature.TRAN_MAJ_CODE == "06") {
                    totalMV = highestMValue
                } else if (ApplicationDetails?.documentNature.TRAN_MAJ_CODE == "05") {
                    ApplicationDetails?.property?.map((x: any) => { totalReleaseMv = totalReleaseMv + Number(x.marketValue); })
                    ApplicationDetails?.executent.map((rr: any) => {
                        let [uV, dV] = rr.share.split("/");
                        totalRRShare = totalRRShare == 0 ? Number(uV) / Number(dV) : totalRRShare + Number(uV) / Number(dV);
                    })
                    totalMV = Math.floor(totalRRShare * totalReleaseMv);

                    const dfDatafromPartitionExemption: any = {
                        "tmaj_code": ApplicationDetails.documentNature.TRAN_MAJ_CODE,
                        "tmin_code": ApplicationDetails.documentNature.TRAN_MIN_CODE,
                        "sroNumber": ApplicationDetails.sroCode,
                        "local_body": 3,
                        "flat_nonflat": "N",
                        "marketValue": totalMV,
                        "finalTaxbleValue": totalMV,
                        "con_value": ApplicationDetails.amount,
                        "adv_amount": 0
                    }
                    dfData = await DutyFeeForPartition(dfDatafromPartitionExemption);
                }
                else {
                    ApplicationDetails?.property?.map((x: any) => { totalMV = totalMV + Number(x.marketValue); })
                }


                if (ApplicationDetails?.documentNature.TRAN_MAJ_CODE == "06") {
                    totalMV = highestMValue
                } else if (ApplicationDetails?.documentNature.TRAN_MAJ_CODE == "05") {
                    totalMV = partitonMV != 0 ? partitonMV : totalMV
                }
                else {
                    totalMV = partitonMV != 0 ? partitonMV : (totalMV > Number(ApplicationDetails.amount)) ? totalMV : Number(ApplicationDetails.amount)
                }
                // totalMV = partitonMV != 0 ? partitonMV : (totalMV > Number(ApplicationDetails.amount)) ? totalMV : Number(ApplicationDetails.amount)
                // let data:any = {
                //     "applicationId": ApplicationDetails.applicationId,
                //     status: "SUBMITTED",
                //     rf_p: dfData != "" ? dfData?.rf_p : CalculatedDutyFee.rf_p,
                //     sd_p: dfData != "" ? dfData?.sd_p : CalculatedDutyFee.sd_p,
                //     td_p: dfData != "" ? dfData?.td_p : CalculatedDutyFee.td_p,
                //     uc_p: userCharges,
                //     tmarketValue: totalMV,

                // }
                let data: any = {
                    "applicationId": ApplicationDetails.applicationId,
                    status: "SUBMITTED",
                    rf_p: Section47 ? CalculatedDutyFee.rf_p : dfData != "" ? dfData?.rf_p : CalculatedDutyFee.rf_p,
                    sd_p: Section47 ? CalculatedDutyFee.sd_p : dfData != "" ? dfData?.sd_p : CalculatedDutyFee.sd_p,
                    td_p: Section47 ? CalculatedDutyFee.td_p : dfData != "" ? dfData?.td_p : CalculatedDutyFee.td_p,
                    uc_p: userCharges,
                    tmarketValue: Section47A6 ? ApplicationDetails?.amount : totalMV,

                }
                //08-06 dutyFee amount
                if(ApplicationDetails.documentNature.TRAN_MAJ_CODE ==='08' && ApplicationDetails.documentNature.TRAN_MIN_CODE ==='06'){
                    data.rf_p = 0,
                    data.sd_p = 0,
                    data.td_p = 0,
                    data.uc_p = 0,
                    data.tranMajCode = ApplicationDetails.documentNature.TRAN_MAJ_CODE,
                    data.tranMinCode = ApplicationDetails.documentNature.TRAN_MIN_CODE;
                }

                if (AttendanceDetails?.id && AttendanceDetails.id != "") {
                    data.AttendanceDetails = AttendanceDetails;
                    // data.rf_p = data.rf_p + 1000;
                }

                if (ApplicationDetails?.documentNature.TRAN_MAJ_CODE == "06") {
                    data.amount = exchnge_CNValue;
                }
                // TD Allocation And calculations
                let tdObj: any = {}, tdUpdateData: any = { updateData: [] }, propIds: any = [];
                if (ApplicationDetails && ApplicationDetails?.property && ApplicationDetails?.property.length > 0 && tdAllow) {
                    ApplicationDetails?.property.reduce((prev: any, curr: any) => {
                        tdObj[curr.localBodyName] = tdObj[curr.localBodyName] == undefined ? curr.marketValue : tdObj[curr.localBodyName] + curr.marketValue;
                        return;
                    }, tdObj);
                    tdUpdateData.applicationId = ApplicationDetails.applicationId;
                    if (Object.keys(tdObj).length == 1) {
                        ApplicationDetails?.property.map((prop: any) => {
                            propIds = [...propIds, prop.propertyId]
                        })
                        // let propTdValue = data.td_p / ApplicationDetails?.property?.length;
                        let lBCode = Object.keys(tdObj)
                        let nObj: any = {
                            localBodyName: lBCode[0],
                            propertyIds: propIds,
                            tdValue: data.td_p
                        }
                        tdUpdateData.updateData.push(nObj)
                        await CallingAxios(UseupdateTdvalue(tdUpdateData));
                    } else {
                        let mvArry: any = Object.keys(tdObj).map(val => tdObj[val]);
                        let min: any = Math.min.apply(Math, mvArry);
                        let tdarry: any = [], tRatio: any = 0
                        Object.keys(tdObj).forEach((k: any) => {
                            const sObj: any = {};
                            sObj.localBodyName = k;
                            sObj.mv = tdObj[k],
                                sObj.ratio = tdObj[k] / min;
                            // window.alert(JSON.stringify(Math.floor(sObj.ratio * 100) / 100))
                            tRatio = tRatio == 0 ? Math.floor(sObj.ratio * 100) / 100 : tRatio + Math.floor(sObj.ratio * 100) / 100;
                            tdarry = [...tdarry, sObj]
                        })
                        tdarry.map((d: any) => {
                            propIds = [];
                            ApplicationDetails?.property.map((prop: any) => {
                                if (d.localBodyName === prop.localBodyName)
                                    propIds = [...propIds, prop.propertyId]
                            })
                            const nObj: any = {
                                localBodyName: d.localBodyName,
                                propertyIds: propIds,
                                tdValue: Math.round(data.td_p * d.ratio / tRatio)
                            }
                            tdUpdateData.updateData = [...tdUpdateData.updateData, nObj];
                        })
                        // window.alert(JSON.stringify(tdarry))
                        // window.alert(JSON.stringify(tRatio))
                        // window.alert(JSON.stringify(tdUpdateData))
                        // let arrOfRatio = mvArry.map((element:any)=>{return element/min;});
                        await CallingAxios(UseupdateTdvalue(tdUpdateData));

                    }

                }
                let result = await CallingAxios(UseChangeStatus(data));
                if (result.status) {

                    await CallTransfer(ApplicationDetails.applicationId)
                    await handleSection47()
                    // ShowMessagePopup(true, "Application Submitted Successfully.", "/ServicesPage");
                    //router.push("/ServicesPage");
                }
                else {
                    ShowMessagePopup(false, "Application submit failed", "");
                }
            }
        }

    }

    const OpenPropertyinEdit = (property: any, mode) => {
        // let property = ApplicationDetails.property[index];
        // property.mandal = ApplicationDetails.mandal;
        // property.mandalCode = ApplicationDetails.mandalCode;
        property['mode'] = mode;
        dispatch(SavePropertyDetails(property));
        localStorage.setItem("PropertyDetails", JSON.stringify({ ...property }));
        if (property.propertyType != "") {
            if (property.propertyType == "URBAN(PLOTS/HOUSE/FLATS..ETC) [పట్టణ (స్థలము/అపార్ట్ మెంట్/ఇల్లు)]" && property.landUseCode != "99") {
                redirectToPage('/PropertyDetailsPage_U');
            } else if ((property.propertyType == "RURAL(AGRICULTURE) [గ్రామీణ (వ్యవసాయ భూమి)]" || property.propertyType == "Rural(Agriculture) [గ్రామీణ (వ్యవసాయ భూమి)]") && property.landUseCode != "99") {
                redirectToPage('/PropertyDetailsPage_R');
            } else {
                redirectToPage('/PropertyDetails_Cash')
            }
        }
        else {
            let code = MasterCodeIdentifier("landUse", property.landUse)
            if (code == 21 || code == 26 || code == 45 || code == 46 || code == 30) {
                redirectToPage('/PropertyDetailsPage_R');
            }
            else {
                redirectToPage('/PropertyDetailsPage_U');
            }
        }
    }

    const OpenOtherPropertyinEdit = (property: any, mode: any) => {
        // window.alert(JSON.stringify(index))
        // window.alert(JSON.stringify(mode))
        // let property = ApplicationDetails.property[index];

        localStorage.setItem("PropertyDetails", JSON.stringify({ ...property, mode }));
        // dispatch(SavePropertyDetails(property));
        redirectToPage('/PropertyDetails_O');
    }


    const OpenPaymentEdit = (data: any, type) => {
        localStorage.setItem("PaymentDetails", JSON.stringify({ ...data, operation: "edit" }));
        switch (type) {
            case "relation": redirectToPage('/AddRelationDetailsPage'); break;
            case "mortagage": redirectToPage('/AddMortgageDetails'); break;
            case "sale": redirectToPage('/PaymentDetailsPage'); break;
        }

    }
    const onCancelUpload = (uploadKey) => {
        // setUserDetails({ ...UserDetails, [uploadKey]: "" });
    }
    const OnFileSelect = async (event: any, type: any) => {
        if (event.target.files.length) {
            if (event.target.files[0].size > (Anywherestat ? 209715200 : 1024000)) {
                ShowMessagePopup(false, `File size ${Anywherestat ? '200MB' : '1MB'} size. please upload small size file.`, "");
                event.target.value = "";
            }
            else {
                const file = event.target.files[0];
                var pattern = /image-*/;

                if (file.type.match(pattern)) {
                    ShowMessagePopup(false, "Irrelevant file type. Only pdf/docs can be uploaded.", "");
                    event.target.value = "";
                }
                else {
                    setUploadDocument({ ...UploadDocument, status: "process" });
                    const formData = new FormData();
                    formData.append('image', event.target.files[0]);
                    await ForUploadDoc(formData, type);
                }
            }
        }
    }
    const ForUploadDoc = async (formData: any, docName: string) => {
        let result = await CallingAxios(UseUploadDoc(formData, { docName, applicationId: ApplicationDetails.applicationId }));
        if (result.status) {
            ShowMessagePopup(true, "File Uploaded Successfully", "");
            setWithPDEUpload(false)
            setAnywhereUpload(false)
            await UseChangeStatus({ docDownLoadedBy: "D", applicationId: ApplicationDetails.applicationId });
            CallGetApp(JSON.stringify(ApplicationDetails));
            setUploadDocument({ ...UploadDocument, status: "", docName: "" });
            GetApplicationDetails();
        }
        else {
            setUploadDocument({ ...UploadDocument, status: "false" });
        }
    }

    const PartyRepValidityFinder = (partyType: string, age: number, MAJCode: string, length: number) => {
        if ((partyType == "Public" || partyType == "NRI" || partyType == "OCI" ) && length === 0 && MAJCode != "02") { return age < 18 ? true : false; }
        // else if(MAJCode == "02"){
        //     return true
        // }
        else if(partyType == "Deceased" ){
             return false }
        else {
            if (length != 0) {
                return false;
            }
            else {
                if (MAJCode == "02") { return false; }
                else if (MAJCode == "01" && ApplicationDetails?.documentNature?.TRAN_MIN_CODE == "20") { return false; }
                else { return true; }
            }
        }

    }
    const MissingFieldinParty = (data: any, type: any) => {
        if (type == "boolean") {
        const isAadhaarRequired = !(GetstartedDetails?.documentNature?.TRAN_MAJ_CODE === "05" && GetstartedDetails?.documentNature?.TRAN_MIN_CODE === "05" && data?.type === "CLAIMANT");
        if (data.name == "" ||(data.partyType == "Public" && data.relationType == "") ||(data.partyType == "Public" && data.relationName == "") ||(data.partyType == "Public" && data.age == "") ||((data.tan == "" || !data.tan) && data.objectType == "tan") ||data.phone == "" || data.phone == null ||
            data.address == "" ||(data.partyType == "Public" && !isAadhaarRequired && data.aadhaar == null) ||(LoginDetails.loginName != "Titdco" &&PartyRepValidityFinder( data.partyType, data.age, ApplicationDetails.registrationType.TRAN_MAJ_CODE, data?.represent?.length))) {
            return true;
        }
            // if (data.name == "" || (data.partyType == "Public" && data.relationType == "") || (data.partyType == "Public" && data.relationName == "") || (data.partyType == "Public" && data.age == "") || ((data.tan == "" || !data.tan) && data.objectType == "tan") || data.phone == "" || data.phone == null || data.address == "" || (data.partyType == "Public" && data.aadhaar == null) || LoginDetails.loginName != "Titdco" && PartyRepValidityFinder(data.partyType, data.age, ApplicationDetails.registrationType.TRAN_MAJ_CODE, data?.represent?.length)) { return true }
        else {
                // console.log("false for" + data.name);
            return false;
        }
        } else if (type == "string") {
             let value = "";
            const isAadhaarRequired = !(GetstartedDetails?.documentNature?.TRAN_MAJ_CODE === "05" && GetstartedDetails?.documentNature?.TRAN_MIN_CODE === "05" && data?.type === "CLAIMANT");
            if (data.name == "" || !data.name) { value = value + "Name" }
            if (data.partyType == "Public" && (data.relationType == "" || !data.relationType)) { value = value + ", Relation" }
            if (data.partyType == "Public" && (data.relationName == "" || !data.relationName)) { value = value + ", Relative Name" }
            if (data.partyType == "Public" && (data.age == "" || !data.age)) { value = value + ", Age" }
            // if (data.panNoOrForm60or61 == "" || ! && data.objectType != "form60") { value = value + ", PAN/Form 60-61" }
            if ((data.tan == "" || !data.tan) && data.objectType == "tan") { value = value + ", TAN" }
              if (data.partyType == "Public" && !isAadhaarRequired && (!data.aadhaar || data.aadhaar === "")) {value += ", Aadhar";}
            // if (data.partyType == "Public" && (data.aadhaar == "" || !data.aadhaar)) { value = value + ", Aadhar" }
            if ((data.phone == "" || !data.phone) && (!vswscondtion && data?.type !== "CLAIMANT")) { value = value + ", Phone" }
            // if (data.email == "" || !data.email) { value = value + ", Email" }
            if (data.address == "" || !data.address) { value = value + ", Address" }
            if (LoginDetails.loginName != "Titdco" && (!vswscondtion && data?.type !== "CLAIMANT") && PartyRepValidityFinder(data.partyType, data.age, ApplicationDetails.registrationType.TRAN_MAJ_CODE, data?.represent?.length)) { value = value + ", Representative is mandatory" }
            if (value[0] == ",") {
                value = value.substring(1);
            }
            return value;
        }
    }

    const MissigFieldinProperty = (data: any, type: string) => {
        let RuralRequiredArray = ["district", "mandal", "village", "villageCode", "habitationCode", "localBodyType", "localBodyName", "sroCode", "landUse", "northBoundry", "southBoundry", "eastBoundry", "westBoundry", "tExtent", "survayNo"];
        let UrbanRequiredArray = ["district", "mandal", "village", "villageCode", "habitationCode", "localBodyType", "localBodyName", "sroCode", "landUse", "northBoundry", "southBoundry", "eastBoundry", "westBoundry"];
        if (type == "boolean") {
            // if(data.propertyType=="propertyType"&&(data.villageCode==""||data.habitationCode==""||data.localBodyType=="" || data.localBodyName==""||data.sroCode==""||data.landUse==""||data.northBoundry==""|| data.southBoundry=="")){}
            if (data.isLinkedDocDetails) {
                return true;
            }
            else if (data.propertyType == "RURAL(AGRICULTURE) [గ్రామీణ (వ్యవసాయ భూమి)]") {
                RuralRequiredArray.map(x => {
                    if (data[x] == "") {
                        return true;
                    }
                })
                return false;
            }
            else if (data.propertyType == "URBAN(PLOTS/HOUSE/FLATS..ETC) [పట్టణ (స్థలము/అపార్ట్ మెంట్/ఇల్లు)]") {
                UrbanRequiredArray.map(x => {
                    // console.log(x + "=" + data[x]);
                    if (!data[x] || data[x] == "") {
                        return true;
                    }
                })
                return false;
            }
        } else if (type == "string") {
            let value = "";
            if (data.isLinkedDocDetails) {
                return "Edit is must for linked Documents";
            }
            if (data.propertyType == "RURAL(AGRICULTURE) [గ్రామీణ (వ్యవసాయ భూమి)]") {
                RuralRequiredArray.map(x => {
                    if (data[x] == "") {
                        value = value + "," + x;
                    }
                })
            } else if (data.propertyType == "URBAN(PLOTS/HOUSE/FLATS..ETC) [పట్టణ (స్థలము/అపార్ట్ మెంట్/ఇల్లు)]") {
                UrbanRequiredArray.map(x => {
                    if (data[x] == "") {
                        value = value + "," + x;
                    }
                })
            }
            if (value[0] == ",") {
                value = value.substring(1);
            }
            return value;
        }
    }
    const DocumentPreview = async (data: any) => {
        try {
            const response = await CallingAxios(documentPreview(data));
            if (response) {
                const binaryData = decodeBase64(response);
                const byteArray = new Uint8Array(binaryData.length);
                for (let i = 0; i < binaryData.length; i++) {
                    byteArray[i] = binaryData.charCodeAt(i);
                }
                const blob = new Blob([byteArray], { type: 'application/pdf' });
                const blobUrl = URL.createObjectURL(blob);
                window.open(blobUrl, '_blank')
            }
            else {
                console.error('No valid PDF data found in the response');
            }
        }
        catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    const timeout = (delay: number) => {
        return new Promise(res => setTimeout(res, delay));
    }


    //PAN or Form60/61

    const mandatoryDetails = (data: any) => {
        let marketVal = 0;
        for(let propData of data.property){
            marketVal = marketVal+propData.marketValue;
        }
        const considerationVal = data.amount;
        let totalVal = (considerationVal > marketVal) ? considerationVal : marketVal;
      
        const executants = data?.executent || [];
        const claimants = data?.claimant || [];
        const allParties = [...executants, ...claimants];
        let isValidSubmitData = true;
        if (allowMutationPayment) {
            for(let property of data?.property){
                if (property?.propertyType?.toUpperCase()?.includes("RURAL(AGRICULTURE) [గ్రామీణ (వ్యవసాయ భూమి)]")) {
                    let ivalidData = false;
                    for(let party of allParties){
                        if (party?.partyType === "Public") {
                            if (totalVal > 0) {
                                ivalidData = checkPartyPanOrForm60Validation(party);
                                if(ivalidData==false)
                                    ShowMessagePopup(false, "PAN or Form60/61 details are required for party", "");
                            }
                        } else {
                            if (totalVal > 0) {
                                if (party?.partyType != "OCI") {
                                    ivalidData = checkPartyPanValidation(party);
                                    if(ivalidData==false)
                                        ShowMessagePopup(false, "PAN/TAN/TIN details are required party", "");
                                } else {
                                   ivalidData = true; 
                                }
                            }
                        }
                        isValidSubmitData = ivalidData;
                        if (!ivalidData) {
                            break;
                        }
                    }
                    if (ivalidData && totalVal > 0) {
                        let representList = allParties.map(party => (party?.represent?.length > 0)?party?.represent[0]:null);
                        representList = representList.filter(repr => repr!=null)
                        ivalidData = checkValidationForPanOrForm60(representList, "represent");
                    }
                    isValidSubmitData = ivalidData;
                    if (!ivalidData) {
                        break;
                    }
                }
                else if (property?.propertyType?.toUpperCase()?.includes("URBAN(PLOTS/HOUSE/FLATS..ETC) [పట్టణ (స్థలము/అపార్ట్ మెంట్/ఇల్లు)]")) {
                    if (totalVal > 1000000) {
                        let isValid = checkValidationForPanOrForm60(allParties, "party");
                        
                        if (isValid) {
                            let representList = allParties.map(party => (party?.represent?.length > 0)?party?.represent[0]:null);
                            representList = representList.filter(repr => repr!=null)
                            isValid = checkValidationForPanOrForm60(representList, "represent");
                        }
                        isValidSubmitData = isValid;
                        break;
                    }
                }
            }
        }
        else {
            if (totalVal > 1000000) {
                let isValid = checkValidationForPanOrForm60(allParties, "party");
                if (isValid) {
                    let representList = allParties.map(party => (party?.represent?.length > 0)?party?.represent[0]:null);
                    representList = representList.filter(repr => repr!=null)
                    isValid = checkValidationForPanOrForm60(representList, "represent");
                }
                isValidSubmitData = isValid;
                return isValid;
            }
        }
        return isValidSubmitData;
    };

    const checkPartyPanOrForm60Validation = (partyData) => {
        if (partyData?.isSelectedPanOrForm60 == 'pan' && (partyData.panNoOrForm60or61 == null || 
            partyData.panNoOrForm60or61 == undefined || partyData.panNoOrForm60or61 === "" || 
            partyData.panNoOrForm60or61.trim().length == 0)) {
            return false;   
        }   
        return true;
    }

    const checkValidationForPanOrForm60 = (allParties, partyCodeVal) => {
        const filterredPartyData = allParties;
        if (filterredPartyData.length > 0) {
            let isValidParty = true;
             
            for(let partyData of filterredPartyData){
                if(partyCodeVal=="represent"){
                    isValidParty = checkPartyPanOrForm60Validation(partyData);
                    if (!isValidParty) {
                        ShowMessagePopup(false, "PAN or Form60/61 details are required for " + partyCodeVal, "");
                    }
                }else{
                    if (partyData?.partyType === "Public") {
                        isValidParty = checkPartyPanOrForm60Validation(partyData);
                        if (!isValidParty) {
                            ShowMessagePopup(false, "PAN or Form60/61 details are required for " + partyCodeVal, "");
                        }
                    }else{ 
                        if (partyData?.partyType != "OCI" && partyData?.partyType !== 'Deceased') {
                           
                            isValidParty = checkPartyPanValidation(partyData);
                            if (!isValidParty) {
                                ShowMessagePopup(false, "PAN/TAN/TIN details are required for " + partyCodeVal, "");
                            }
                        }
                    }
                }
                if(isValidParty==false)
                    break;
            }
            if (!isValidParty) {
                return false;
            }
        }
        return true;
    }

     const checkPartyPanValidation = (partyData) => {
       if ((partyData.panNoOrForm60or61 == undefined || partyData.panNoOrForm60or61 == null || partyData.panNoOrForm60or61 == ""
         || partyData.panNoOrForm60or61.length == 0) && (partyData.tan==undefined || partyData.tan==null || partyData.tan == "" 
         || partyData.tan.trim().length == 0) && (partyData.tin==undefined || partyData.tin==null || partyData.tin == "" 
         || partyData.tin.trim().length == 0)) {
                return false;
        }
        return true;
    }


    const checkValidationForPan = (allParties) => {
        const filterredPartyData = allParties.filter(party => party?.isSelectedPanOrForm60 === 'pan')
        if (filterredPartyData && filterredPartyData.length > 0) {
            let isValidParty = true;
            for(let partyData of filterredPartyData){
                isValidParty = checkPartyPanValidation(partyData);
                if (isValidParty==false) 
                    break;
            }
           if (isValidParty==false) {
                ShowMessagePopup(false, "PAN/TAN/TIN details are required for Party", "");
                return false;
            }
        }
        return true;
    }

     

const downloadeSignFile = async (txnId: string) => {
    try {
        const data = { txnId };
        const response = await CallingAxios(UseGetdownloadeSignedFile(data));
        const pdfBase64 = response?.data?.data;
        const innerStatus = response?.data?.status;
        if (innerStatus === "Success" && pdfBase64) {
            processAndOpenPdf(pdfBase64);
        } else {
            const errorMessage = response?.data?.message || "Failed to download file";
            ShowMessagePopup(false, errorMessage, "");
        }
    } catch (error) {
        console.error("Error downloading signed file:", error);
        ShowMessagePopup(false, "An error occurred while downloading the file", "");
    }
};


const processAndOpenPdf = (base64Data: string) => {
    try {
        const binaryData = decodeBase64(base64Data);
        const byteArray = new Uint8Array(binaryData.length);
        for (let i = 0; i < binaryData.length; i++) {
            byteArray[i] = binaryData.charCodeAt(i);
        }
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl, '_blank');
        setTimeout(() => {
            URL.revokeObjectURL(blobUrl);
        }, 60000);
    } catch (error) {
        console.error("Error processing PDF:", error);
        ShowMessagePopup(false, "Error processing the downloaded file", "");
    }
}

const partyDelete = async (id, applicationID, singleUser) => {
    let propertyNumberArray = [];
    if(ApplicationDetails.documentNature.TRAN_MAJ_CODE == "04" && ApplicationDetails.property && ApplicationDetails.property.length > 0) {
        for (const prop of ApplicationDetails.property) {
            const partyCodes = (prop.partyNumber || "").split(',').map(code => code.trim());
            if (partyCodes.includes(String(singleUser.seqNumber))) {
                propertyNumberArray.push(prop.seqNumber);
            }
        }
    }
    if(propertyNumberArray.length > 0) {
        const propertyNumbers = propertyNumberArray.join(', ');
        ShowDeletePopup(`Property (${propertyNumbers}) has been added for this claimant. To proceed, the associated property party names must be updated. Are you sure you want to permanently remove this item?`, "", id, applicationID, "party", {...singleUser, propertyNumbers: propertyNumbers});
    }
    else {
        ShowDeletePopup("Are you sure you want to permanently remove this item?", "", id, applicationID, "party", singleUser);
    }
}

    const DisplayPartiesComponent = (no: any, PartyType: string, title: any, Lists: any) => {
        AadharPopupMemory = { ...AadharPopupMemory, title: title }
        return (
            <div className={styles.mainTabs}>
                <Head>
                    <title>Parties Details - Public Data Entry</title>
                </Head>
                <Row className={styles.tabHeadContainer}>
                    <Col lg={6} md={6} xs={6}>
                        <div className={styles.addCusText}>
                            <p className={styles.tabText}>{no} {title}</p>
                        </div>
                    </Col>
                    <Col lg={6} md={6} xs={6} className='text-end'>
                        <div className={`${styles.addCusContainer} ${styles.PartiesColumnRight}`} onClick={() => { OpenPartyAction("Add", PartyType, title, {}, ApplicationDetails) }}>
                            <Image alt="Image" height={15} width={18} src='/PDE/images/add-cust-icon.svg' style={{ cursor: 'pointer' }} className={styles.addCusContainerImage} />
                            <p className={styles.innertabText}>Add {title}</p>
                        </div>
                    </Col>
                </Row>
                <div className={styles.InnertabHeadContainer}>
                    <div className={styles.innerTabContainer}>
                        <div className='table-responsive'>
                            <Table striped bordered hover className='TableData lpmTable'>
                                <thead>
                                    <tr>
                                        <th className=''>S.No.<span>[క్రమ సంఖ్య]</span></th>
                                        <th className=''>Name<span>[పేరు]</span></th>
                                        <th>Type<span>[రకం]</span></th>
                                        <th className=''>Relation<span>[సంబంధం]</span></th>
                                        {title !=='Deceased' && <th className=''>Age<span>[వయస్సు]</span></th>}
                                        <th className=''>Address<span>[చిరునామా]</span></th>
                                        {PartyType != "WITNESS" && title !=='Deceased' && <th className=''>Representative<span>[ప్రతినిధి]</span></th>}
                                        <th className='PartAction'>Action<span>[చర్య]</span></th>
                                    </tr>


                                </thead>
                                <tbody>
                                    {Lists ? Lists.map((singleUser, index) => {
                                        return (
                                            <tr key={index} style={{ backgroundColor: !vswscondtion? MissingFieldinParty(singleUser, "boolean") ? '#F4D3B0' : null : null}} className='tableRow'>
                                                <td className=''>{index + 1}</td>
                                                <td className=''>{singleUser.name.toUpperCase()}</td>
                                                <td>{singleUser.partyType}</td>
                                                <td className=''>{singleUser?.relationType} {singleUser?.relationName?.toUpperCase()}</td>
                                                {title !=='Deceased'&& <td className=''>{singleUser.age}</td> }
                                                <td className=''>{singleUser?.address?.length > 40 ? singleUser?.address.substring(0, 40) + "..." : singleUser.address}</td>
                                                {singleUser.represent.length > 0 && PartyType != "WITNESS" ?
                                                    <td className=''>
                                                        <div className={`${styles.actionTitle} ${styles.actionbtn}`} >

                                                            {/* <span>{singleUser.represent[0].length}</span> */}
                                                            {/* {singleUser.represent.map((rep: any, i: number) => {
                                                                return (
                                                                    <div key={i}>
                                                                        <span>
                                                                            {rep.name}
                                                                            <Image alt="Image" height={18} width={17} src='/PDE/images/delete-icon.svg' className={styles.tableactionImg} style={{ cursor: 'pointer', marginLeft: '3px' }} onClick={() => { ShowDeletePopup("Are you sure you want to permanently remove this item?", "", singleUser.represent[0]._id, singleUser._id, "representative") }} />
                                                                        </span>
                                                                    </div>
                                                                )
                                                            })} */}

                                                            {singleUser.represent.map((rep: any, i: number) => {
                                                                return (
                                                                    <div key={i}>
                                                                        {(length == i)}
                                                                        <span>
                                                                            {rep.name}
                                                                            <Image alt="Image" height={15} width={14} src='/PDE/images/delete-icon.svg' className={styles.tableactionImg} style={{ cursor: 'pointer', marginLeft: '3px' }} onClick={() => { ShowDeletePopup("Are you sure you want to permanently remove this item?", "", rep._id, rep.parentPartyId, "representative") }} />
                                                                        </span>
                                                                    </div>
                                                                )

                                                            })}

                                                            <div id="text" className={`${styles.actionTitle} ${styles.actionbtn}`} style={{ cursor: 'pointer' }} onClick={() => { OpenPartyAction("AddRep", PartyType, title, singleUser, ApplicationDetails) }}>
                                                                <Image alt="Image" height={15} width={14} src='/PDE/images/add-cust-icon.svg' style={{ cursor: 'pointer' }} className={styles.addCusContainerImage} />
                                                            </div>
                                                        </div>
                                                    </td>
                                                    :
                                                    PartyType != "WITNESS" && title !=='Deceased'&& <td className=''>
                                                        <div id="text" className={`${styles.actionTitle} ${styles.actionbtn}`} style={{ cursor: 'pointer' }} onClick={() => { OpenPartyAction("AddRep", PartyType, title, singleUser, ApplicationDetails) }}>
                                                            <Image alt="Image" height={15} width={14} src='/PDE/images/add-cust-icon.svg' style={{ cursor: 'pointer' }} className={styles.addCusContainerImage} />
                                                            {/* <p className={styles.columnText}>Add Representative{parseInt(singleUser.age)<18 && <span style={{color:'red', marginLeft:'5px'}}>*</span>}</p> */}
                                                            Add
                                                            {(PartyRepValidityFinder(singleUser.partyType, parseInt(singleUser.age), ApplicationDetails.registrationType.TRAN_MAJ_CODE, singleUser.represent.length) || (title == "Executant" && singleUser.exExecutant))? <text style={{ color: 'red' }}>*</text> : null}
                                                        </div>
                                                    </td>}

                                                <td className='PartAction'>
                                                    <div className='d-flex'>
                                                        <div id="text" className={`${styles.actionTitle} ${styles.actionbtn}`} style={{ cursor: 'pointer' }} onClick={() => { OpenPartyAction("View", null, title, singleUser) }}>
                                                            <Image alt="Image" height={20} width={18} src='/PDE/images/view-icon.svg' className={styles.tableactionImg} />
                                                            <span className={styles.tooltiptext}>View</span>
                                                        </div>
                                                        <div style={{ cursor: 'pointer' }} className={`${styles.actionTitle} ${styles.actionbtn}`} onClick={() => { OpenPartyAction("Edit", PartyType, title, singleUser) }}>
                                                            <Image alt="Image" height={18} width={17} src='/PDE/images/edit-icon.svg' className={styles.tableactionImg} />
                                                            <span className={styles.tooltiptext}>Edit</span>
                                                        </div>
                                                        {singleUser.isPresenter ? null :
                                                            <div className={`${styles.actionTitle} ${styles.actionbtn}`} style={{ cursor: 'pointer' }} 
                                                            // onClick={() => { ShowDeletePopup("Are you sure you want to permanently remove this item?", "", singleUser._id, ApplicationDetails.applicationId, "party", singleUser) }}
                                                            onClick={() => { partyDelete(singleUser._id, ApplicationDetails.applicationId, singleUser) }}
                                                            >
                                                                <Image alt="Image" height={18} width={17} src='/PDE/images/delete-icon.svg' className={styles.tableactionImg} />
                                                                <span className={styles.tooltiptext}>Delete</span>
                                                            </div>}
                                                       
                                                        {/* { doEsign ? <>
                                                            {singleUser.represent && singleUser.represent[0]?.isSelectedPanOrForm60 === "form60"  || singleUser?.isSelectedPanOrForm60 === "form60" ? <div className="text-center refuseBtn ">
                                                                {singleUser.form60EsignStatus === 'Y' ?
                                                                    <div id="text" className={`${styles.actionTitle} ${styles.actionbtn}`} style={{ cursor: 'pointer' }} onClick={() => downloadeSignFile(singleUser?.form60EsignTxnId)} >
                                                                        <Image alt="Image" height={21} width={18} src="/PDE/images/aadhar_esign.svg" className={styles.tableactionImg} />
                                                                        <span className={styles.tooltiptext}>eSign Done</span>
                                                                    </div>
                                                                    :
                                                                    <div id="text" className={`${styles.actionTitle} ${styles.actionbtn}`} style={{ cursor: 'pointer' }} onClick={() => { OpenForm60Action(singleUser) }}>
                                                                        <Image alt="Image" height={20} width={18} src="/PDE/images/e-sign.png" className={styles.tableactionImg} />
                                                                        <span className={styles.tooltiptext}>Do eSign</span>
                                                                    </div>
                                                                }
                                                            </div> : null}
                                                            </> : null}    */}
                                                    </div>
                                                </td>
                                                {/* <td className='PartAction'>
                                                    <div id="text" className={`${styles.actionTitle} ${styles.actionbtn}`} style={{ cursor: 'pointer' }} onClick={() => { OpenPartyAction("View", null, title, singleUser) }}>
                                                        <Image alt="Image" height={20} width={18} src='/PDE/images/view-icon.svg' className={styles.tableactionImg} />
                                                        <span className={styles.tooltiptext}>View</span>
                                                    </div>
                                                    <div style={{ cursor: 'pointer' }} className={`${styles.actionTitle} ${styles.actionbtn}`} onClick={() => { OpenPartyAction("Edit", PartyType, title, singleUser) }}>
                                                        <Image alt="Image" height={18} width={17} src='/PDE/images/edit-icon.svg' className={styles.tableactionImg} />
                                                        <span className={styles.tooltiptext}>Edit</span>
                                                    </div>
                                                    {singleUser.isPresenter ? null :
                                                        <div className={`${styles.actionTitle} ${styles.actionbtn}`} style={{ cursor: 'pointer' }} onClick={() => { ShowDeletePopup("Are you sure you want to permanently remove this item?", "", singleUser._id, ApplicationDetails.applicationId, "party", singleUser) }}>
                                                            <Image alt="Image" height={18} width={17} src='/PDE/images/delete-icon.svg' className={styles.tableactionImg} />
                                                            <span className={styles.tooltiptext}>Delete</span>
                                                        </div>}
                                                </td> */}
                                                {MissingFieldinParty(singleUser, "boolean") && !vswscondtion ? <div className='tooldata'>
                                                    <span className='tooltiptext'>Missing Fields : {MissingFieldinParty(singleUser, "string")}</span>
                                                </div> : null}
                                            </tr>

                                        );

                                    }) : null}

                                </tbody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const onSubmit = async (e: any) => {
        e.preventDefault();
    }

    const onSelectPresenter = async (e: any) => {
        let query = {
            partyId: e.target.value,
            applicationId: ApplicationDetails.applicationId
        }
        let result = await CallingAxios(UseSetPresenter(query));

        if (result.status) {
            setAllfilled({ ...Allfilled, isPresenterSelected: true });
            let hstRUpdate: any = { applicatIonId: ApplicationDetails.applicationId, sd: "BS" };
            await CallingAxios(UseStatusHistoryUpdate(hstRUpdate));
            await GetApplicationDetails();
        }
        else {
            ShowMessagePopup(false, result.message, "");
        }
    }

    const downloadReport = async (type: any) => {
        let info: any = {
            type: type,
            applicationId: ApplicationDetails.applicationId
        }
        let result: any
        if (type === "telugu") {
            result = await CallingAxios(UseReportTelDownload(info));
        } else {
            result = await CallingAxios(UseReportDownload(info));
        }
        if (result.status) {
            setTimeout(() => {
                window.open(result.data);
            }, 700);
        }
    }

    const CallTransfer = async (DocNo) => {
        // let result = await CallingAxios(UseTransferdocument(DocNo));
        let result = await CallingAxios(syncservice(DocNo));
        if (result.status) {
            let Obj: any = { applicatIonId: DocNo, sd: "AS" }
            await CallingAxios(UseStatusHistoryUpdate(Obj));
            ShowMessagePopup(true, "Application Updated successfully", "");
            if (LoginDetails.loginType == "USER") {
                router.push("/SubmissionSuccessfulPage")
            }
            else {
                ShowMessagePopup(true, "Application submitted successfully", "/ServicesPage");
            }
            // setTimeout(() => {
            //     LoginDetails.RETURN_PATH ? router.push(process.env.MASTER_LOGIN_URL + LoginDetails.RETURN_PATH) 
            // }, 5000);
        }
        else {
            router.push("/ApplicationListPage")
        }
    }

    const representativeList = () => {
        let list = [];
        [...get(ApplicationDetails, 'executent', []), ...get(ApplicationDetails, 'claimant', [])].map(y => {
            const ar: any = get(y, 'represent', []).map(o => { return { ...o, relatedPartyName: y.name } });
            list = [...list, ...ar];
        });
        return list;
    }
    const upLoadDocClick = () => { }

    const addAttandanceAction = async (id: any) => {
        await getCurrentLocation()
            .then((location) => {
                let data = { id, lat: location.lat, lng: location.lng };
                // window.alert(JSON.stringify(data,null,2));
                dispatch(GooglemapAction({ enable: true, id, Location: data, result: false, Reason: "" }));
            })
            .catch((error) => {
                ShowMessagePopup(false, "Kindly allow browser location trace", "");
            });


    }

    const OnOthersProperty = (data: any) => {
        let NewData = { ...data, typeOfProperty: "", marketValue: null }
        dispatch(SavePropertyDetails(NewData));
        localStorage.setItem("PropertyDetails", JSON.stringify(NewData));
        redirectToPage('/PropertyDetails_O')
    }


    const deletAttandanceAction = async (id: any) => {
        setAttendanceDetails({ id: "", lat: 0, lng: 0 })
    }


    function getCurrentLocation(): Promise<{ lat: number, lng: number }> {
        return new Promise((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position: GeolocationPosition) => { const latitude = position.coords.latitude; const longitude = position.coords.longitude; resolve({ lat: latitude, lng: longitude }); }, (error: GeolocationPositionError) => { reject(error); });
            } else { reject(new Error('Geolocation is not supported by this browser.')); }
        });
    }

    // const onPayment = (index: number) => {
    //     setIsTaxView(true);
    //     setSelectedProperty(gPropData[index])
    // }
let vswscondtion = ApplicationDetails.registrationType.TRAN_MAJ_CODE === "04" && ApplicationDetails.documentNature.TRAN_MIN_CODE =='04';

    const calculateTotalMutationFee = (applicationDetails: any) => {
        let totalMutationFee = 0;
        if (!applicationDetails?.property || !Array.isArray(applicationDetails.property)) {
            return totalMutationFee;
        }
        applicationDetails.property.forEach((prop: any) => {
            const cdmaData = prop?.cdma_details;
            if (cdmaData && cdmaData.trim() !== "") {
                const cdmaDetails = JSON.parse(cdmaData);
                const mutationFee = parseFloat(prop?.payableMutationFee) || 0;
                totalMutationFee += mutationFee;
            }
        });
        return totalMutationFee;
    };

    return (
        <div className='PageSpacing' >
            <Container>
                <div className='tabContainerInfo'>
                    <Container>
                        <Row>
                            <Col lg={10} md={12} xs={12} className='p-0 navItems'>
                                <div className='main-content'>
                                    <div className='tabContainer partiesContainer'>
                                        <div className={`${styles.BacBtnContainer} ${styles.actionbtn}`} onClick={() => { redirectToPage("/ServicesPage") }}><Image alt="Image" height={32} width={28} src='/PDE/images/backarrow.svg' /></div>
                                        <div className='activeTabButton'>Get Started<div></div></div>
                                        <div className='activeTabButton'>Parties Details<div></div></div>
                                        <div className='inactiveTabButton'>Property Details<div></div></div>
                                        <div className='inactiveTabButton slotButton'>Slot Booking<div></div></div>
                                    </div>

                                </div>
                            </Col>
                            {ApplicationDetails.docProcessType == "PDEWD" ?
                                <Col lg={2} md={12} xs={12}>
                                    <div className='text-end previewCon'><button className='PreBtn' onClick={() => ShowPreviewPopup()}>Preview Document</button></div>
                                </Col> : null}


                            {!statusBar && <Col lg={12} md={12} xs={12} className='p-0 navItems'>
                                <div className='tabContainer DutyfeeContainer'>
                                    {/* <div className='activeTabButton'>Duty Fees :<div></div></div> */}
                                    {Section47 && <div className='activeTabButton'>Differential Stamp Duty(₹) : {CalculatedDutyFee.sd_p2 ? CalculatedDutyFee.sd_p2 : 0}<div></div></div>}
                                    <div className='activeTabButton'>Stamp Duty(₹) : {CalculatedDutyFee.sd_p ? CalculatedDutyFee.sd_p : 0}<div></div></div>
                                    <div className='activeTabButton'>Transfer Duty(₹) : {CalculatedDutyFee.td_p ? CalculatedDutyFee.td_p : 0}<div></div></div>
                                    <div className='activeTabButton'>Registration fee(₹) : {CalculatedDutyFee.rf_p ? CalculatedDutyFee.rf_p : 0}<div></div></div>
                                    {GetstartedDetails?.documentNature && GetstartedDetails?.documentNature?.TRAN_MAJ_CODE === "08" && GetstartedDetails.documentNature?.TRAN_MIN_CODE === "06" ?
                                    <div className='activeTabButton'>User Charges(₹) : {0}<div></div></div>:
                                    <div className='activeTabButton'>User Charges(₹) : {userCharges}<div></div></div>
                                    }
                                    {/* <div className='activeTabButton'>User Charges(₹) : {userCharges}<div></div></div> */}
                                    <div className='activeTabButton'>Market Value(₹)  : {TotalMarketValueCalculator(ApplicationDetails)}<div></div></div>
                                    <div className='activeTabButton'> {doctcondtion ? 'Auction Value(₹) ' : 'Consideration Value(₹) '}: {ApplicationDetails.amount ? ApplicationDetails.amount : "0"}<div></div></div>
                                    {GetstartedDetails?.documentNature && GetstartedDetails?.documentNature?.TRAN_MAJ_CODE === "08" && GetstartedDetails?.documentNature?.TRAN_MIN_CODE === "06" ?
                                    <div className='activeTabButton'>Total Payable(₹): {Number(CalculatedDutyFee.sd_p) + Number(CalculatedDutyFee.td_p) + Number(CalculatedDutyFee.rf_p) + 0}</div>:
                                    <div className='activeTabButton'>Total Payable(₹): {Number(CalculatedDutyFee.sd_p) + Number(CalculatedDutyFee.td_p) + Number(CalculatedDutyFee.rf_p) + userCharges}</div>
                                    }
                                      
                                    {<div className='activeTabButton'>Mutation Fee: ₹{calculateTotalMutationFee(ApplicationDetails)}</div>}
                                </div>
                            </Col>}
                        </Row>
                    </Container>
                </div>

                {/* <div >
                        <div className='tabContainerInfo'>
                            <Container>
                                <Row>
                                    <Col lg={12} md={12} xs={12} className='p-0'>
                                        <div className='tabContainer'>
                                            <div className='activeTabButton'>Get Started<div></div></div>
                                            <div className='activeTabButton'>Parties Details<div></div></div>
                                            <div className='inactiveTabButton' onClick={() => redirectToPage('/PropertyDetailsPage')}>Property Details<div></div></div>
                                            <div className='inactiveTabButton slotButton' onClick={() => redirectToPage('/SlotBookingViewPage')}>Slot Booking<div></div></div>
                                        </div>
                                        <div className="sticky-note yellow">
                                            <input
                                                type="text"
                                                placeholder="Title"
                                                value={"Duty Fees:"}
                                                disabled={true}
                                            />
                                            <parea
                                                placeholder="Write something..."
                                                value={` 1. Stamp Duty : ${CalculatedDutyFee.sd_p}\n 2. Transfer Duty :${CalculatedDutyFee.td_p}\n 3. Registration fee: ${CalculatedDutyFee.rf_p}`}
                                                disabled={true}
                                            />
                                        </div>
                                    </Col>
                                </Row>
                            </Container>
                        </div>
                    </div> */}

                <Row className='applicationData mt-0'>
                    <Col lg={6} md={12} xs={12} >
                        <div className='ContainerColumn TitleColmn' style={{ cursor: 'pointer' }} onClick={() => { router.push("/ApplicationListPage") }}>
                            <h4 className='TitleText left-title' style={{ cursor: 'pointer' }}>{ApplicationDetails.documentNature ? ApplicationDetails.documentNature.TRAN_DESC : null}</h4>
                        </div>

                    </Col>
                    <Col lg={6} md={12} xs={12} className='mb-0 text-end'>
                        <div className='ContainerColumn TitleColmn'>
                            <h4 className='TitleText PartiesText'>Application ID: {ApplicationDetails.applicationId}</h4>
                        </div>
                        {/* <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <div className="sticky-note yellow">
                        <input
                            type="text"
                            placeholder="Title"
                            value={"Duty Fees:"}
                            disabled={true}
                        />
                        <parea
                            placeholder="Write something..."
                            value={` 1. Stamp Duty : ${CalculatedDutyFee.sd_p}\n 2. Transfer Duty :${CalculatedDutyFee.td_p}\n 3. Registration fee: ${CalculatedDutyFee.rf_p}`}
                            disabled={true}
                        />
                    </div>
                </div> */}
                    </Col>
                </Row>




                <div className='mt-0'>
                    <div className={`${styles.mainContainer} ${styles.ListviewMain}`}>
                        {ApplicationDetails?.registrationType?.TRAN_MAJ_CODE != "04"  || (ApplicationDetails.registrationType.TRAN_MAJ_CODE === "04" && ApplicationDetails.documentNature.TRAN_MIN_CODE =='04')? DisplayPartiesComponent("1.",  "EXECUTANT", ApplicationDetails.registrationType ? vswscondtion ? 'Deceased':ApplicationDetails.registrationType.PARTY1 : [], ApplicationDetails.executent) : null}
                        {ApplicationDetails.registrationType && ApplicationDetails.registrationType.PARTY2 && DisplayPartiesComponent((ApplicationDetails?.registrationType?.TRAN_MAJ_CODE == "04" && ApplicationDetails?.documentNature?.TRAN_MIN_CODE !== '04' ) ? "1." : "2.","CLAIMANT", ApplicationDetails.registrationType.PARTY2, ApplicationDetails.claimant)}
                        {ApplicationDetails.registrationType && ApplicationDetails.registrationType.PARTY3 && IsWithDoc && DisplayPartiesComponent("3.", "WITNESS", ApplicationDetails.registrationType.PARTY3, ApplicationDetails.witness)}

                        {book3Nd4Prop === false ? <div className={styles.mainTabs}>
                            <Row className={styles.tabHeadContainer}>
                                <Col lg={6} md={6} xs={6}>
                                    <div className={styles.addCusText}>
                                        {ApplicationDetails?.registrationType?.TRAN_MAJ_CODE === "02" && IsWithDoc ? <p className={styles.tabText}>4. Property Details</p> :
                                            <p className={styles.tabText}>{(ApplicationDetails?.registrationType?.TRAN_MAJ_CODE != "04" || ApplicationDetails?.registrationType?.TRAN_MAJ_CODE === "04") && ApplicationDetails?.registrationType?.PARTY3 ? 4 : 3}. Property Details </p>}
                                    </div>
                                </Col>
                                <Col lg={6} md={6} xs={6} className='text-end'>
                                    <div className={styles.addCusContainer} onClick={async () => { dispatch(SavePropertyDetails({ amount: "", executionDate: "", stampPaperValue: "", stampPurchaseDate: "", localBodyType: "", localBodyTitle: "", localBodyName: "", district: "", sroOffice: "", propertyType: "", ExtentList: [], schedulePropertyType: "", landUse: "", village: "", locality: "", ward: "", block: "", biWard: "", biBlock: "", doorNo: "", plotNo: "", survayNo: "", ptinNo: "", extent: "", extentUnit: "", units: "", layoutNo: "", layoutName: "", appartmentName: "", undividedShare: "", undividedShareUnit: "", flatNo: "", flatNorthBoundry: "", flatSouthBoundry: "", flatEastBoundry: "", flatWestBoundry: "", structure: [], totalFloors: "", northBoundry: "", southBoundry: "", eastBoundry: "", westBoundry: "", isDocDetailsLinked: "", landtype: "", isMarketValue: "", mode: "add",totalExtent:"",electionWard:"",secratariatWard:"",electionWardName:"",secratariatWardName:""})); await timeout(500); router.push("/PropertyDetailsPage") }}>
                                        <Image alt="Image" height={15} width={19} src='/PDE/images/add-cust-icon.svg' style={{ cursor: 'pointer' }} className={styles.addCusContainerImage} />
                                        <p className={styles.innertabText}>Add Property</p>
                                    </div>
                                </Col>
                            </Row>
                            <div className={styles.InnertabHeadContainer}>
                                <div className={styles.innerTabContainer}>
                                    <div className='table-responsive'>
                                        <Table striped bordered hover className='TableData lpmTable'>
                                            <thead>
                                                <tr>
                                                    <th className='' >S.No.<span>[క్రమ సంఖ్య]</span></th>
                                                    <th className='' >Type<span>[రకం]</span></th>
                                                    <th className='' >Details<span>[వివరాలు]</span></th>
                                                    <th className='' >Boundaries<span>[సరిహద్దులు]</span></th>
                                                    <th className='PartAction' >Action<span>[చర్య]</span></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {gPropData.map((singleProperty, index) => {
                                                    //const showPaymentButton = allowMutationPayment && singleProperty?.isUrbanMutationEnabled && singleProperty?.urban_selling_extent?.toUpperCase() === "FULL" && singleProperty?.ptinNo !== "0" && singleProperty?.propertyType?.toUpperCase()?.includes("URBAN") && singleProperty?.mutationPaymentDue != 0                                                    
                                                    return (
                                                        <tr key={index} style={{ backgroundColor: MissigFieldinProperty(singleProperty, "boolean") ? '#F4D3B0' : null }} className='tableRow'>
                                                            {/* {singleProperty.typeOfProperty !="Others" && <> */}
                                                            <td >{index + 1}</td>
                                                            <td >{singleProperty.propertyType}</td>
                                                            <td >
                                                                <div>SRO-{singleProperty.sroOffice},survey-{singleProperty.survayNo}</div>
                                                                <div>Extent-{singleProperty?.conveyedExtent[0]?.extent} {singleProperty?.conveyedExtent[0]?.unit}</div>
                                                            </td>
                                                            <td >
                                                                <div>N-{singleProperty.northBoundry}, S-{singleProperty.southBoundry}</div>
                                                                <div>E-{singleProperty.eastBoundry}, W-{singleProperty.westBoundry}</div>
                                                            </td>

                                                            <td >
                                                                <div id="text" className={`${styles.actionTitle} ${styles.actionbtn}`} style={{ cursor: 'pointer' }} onClick={() => OpenPropertyinEdit(singleProperty, "view")}>
                                                                    <Image alt="Image" height={20} width={18} src='/PDE/images/view-icon.svg' className={styles.tableactionImg} />
                                                                    <span className={styles.tooltiptext}>View</span>
                                                                </div>
                                                                <div style={{ cursor: 'pointer' }} className={`${styles.actionTitle} ${styles.actionbtn}`} onClick={() => OpenPropertyinEdit(singleProperty, "edit")}>
                                                                    <Image alt="Image" height={18} width={17} src='/PDE/images/edit-icon.svg' className={styles.tableactionImg} />
                                                                    <span className={styles.tooltiptext}>Edit</span>
                                                                </div>
                                                                <div className={`${styles.actionTitle} ${styles.actionbtn}`} style={{ cursor: 'pointer' }} onClick={() => { ShowDeletePopup("Are you sure you want to permanently remove this Property?", "", singleProperty.propertyId, ApplicationDetails.applicationId, "property") }}>
                                                                    <Image alt="Image" height={18} width={17} src='/PDE/images/delete-icon.svg' className={styles.tableactionImg} />
                                                                    <span className={styles.tooltiptext}>Delete</span>
                                                                </div>
                                                                {/* {showPaymentButton && (
                                                                    <div className={`${styles.actionTitle} ${styles.actionbtn}`}onClick={() => onPayment(index)}>
                                                                        <Image alt="Image" height={20} width={20} src='/PDE/images/verify_payment_blue.svg'  className={styles.tableactionImg} />
                                                                        <span className={styles.tooltiptext} >Payment</span>
                                                                    </div>
                                                                )} */}
                                                            </td>
                                                            {/* </>} */}
                                                            {MissigFieldinProperty(singleProperty, "boolean") ? <div className='tooldata'>
                                                                <span className='tooltiptext'>Missing Fields : {MissigFieldinProperty(singleProperty, "string")}</span>
                                                            </div> : null}
                                                        </tr>
                                                    );
                                                })}

                                            </tbody>
                                        </Table>
                                    </div>
                                </div>
                            </div>
                        </div> : null}
                        {gPropData && Object.keys(gPropData).length > 0 && LoginDetails?.loginEmail?.includes("@igrs.ap.gov.in") && ShowSection47 ? <div className={styles.mainTabs}>
                            <Row className={styles.tabHeadContainer}>
                                <Col lg={6} md={6} xs={6}>
                                    <div className={`${styles.addCusText} ${styles.addSectext}`}>
                                        <input id="noCbCheck" type="checkbox" name="checkNo" checked={Section47} onChange={() => setSection47(!Section47)} />
                                        <p className={styles.innertabText}> Click Here To Raise <span className={styles.addSectext1}>Section 47A</span></p>
                                    </div>
                                </Col>
                            </Row>
                        </div> : null}
                        {LoginDetails?.loginEmail === 'APIIC' ? <></>:<>
                        
                        {ApplicationDetails.executent.some(item => item.partyType === "Govt Institutions") && 
                        // ( TotalMarketValueCalculator(ApplicationDetails) > ApplicationDetails.amount) && 
                        (
                            <Row className={styles.tabHeadContainer}>
                                <Col lg={6} md={6} xs={6} style={{ marginBottom: 10 }}>
                                    <div className={`${styles.addCusText} ${styles.addSectext}`} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <input id="noCbCheck" type="checkbox" name="checkNo" checked={Section47A6} onChange={() => setSection47A6(!Section47A6)} />
                                        <p style={{ marginTop: 0 }} className={styles.innertabText}> Click here for Provision of<span className={styles.addSectext1}>&nbsp;Section 47 (A) (6)</span></p>
                                    </div>
                                </Col>
                            </Row>
                        )}   
                        </>} 
                        {book3Nd4Prop === false && !vswscondtion ? <div className={styles.mainTabs}>
                            <Row className={styles.tabHeadContainer}>
                                <Col lg={6} md={6} xs={6}>
                                    <div className={styles.addCusText}>
                                        {ApplicationDetails?.registrationType?.TRAN_MAJ_CODE === "02" && IsWithDoc ? <p className={styles.tabText}>5. Other Property Details</p> :
                                            <p className={styles.tabText}>{ApplicationDetails?.registrationType?.TRAN_MAJ_CODE != "04" && ApplicationDetails?.registrationType?.PARTY2 ? 4 : 3}.Other Property Details </p>}
                                    </div>
                                </Col>
                                <Col lg={6} md={6} xs={6} className='text-end'>
                                    <div className={styles.addCusContainer} onClick={() => { OnOthersProperty({ ...PropertyDetails }) }}>
                                        <Image alt="Image" height={15} width={19} src='/PDE/images/add-cust-icon.svg' style={{ cursor: 'pointer' }} className={styles.addCusContainerImage} />
                                        <p className={styles.innertabText}>Add Other Property</p>
                                    </div>
                                </Col>
                            </Row>
                            <div className={styles.InnertabHeadContainer}>
                                <div className={styles.innerTabContainer}>
                                    <div className='table-responsive'>
                                        <Table striped bordered hover className='TableData lpmTable'>
                                            <thead>
                                                <tr>
                                                    <th className='' >S.No.<span>[క్రమ సంఖ్య]</span></th>
                                                    <th className='' >Other Property<span>[వివరాలు]</span></th>
                                                    <th className='' >Value<span></span></th>
                                                    <th className='PartAction' >Action<span>[చర్య]</span></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {oPropData.map((singleProperty, index) => {
                                                    return (
                                                        <tr key={index} className='tableRow'>
                                                            {/* {singleProperty.typeOfProperty =="Others" && <> */}
                                                            <td >{index + 1}</td>
                                                            <td >
                                                                <div>{singleProperty.otherPropName}</div>
                                                            </td>
                                                            <td >
                                                                <div>{singleProperty.marketValue}</div>
                                                            </td>

                                                            <td >
                                                                <div id="text" className={`${styles.actionTitle} ${styles.actionbtn}`} style={{ cursor: 'pointer' }} onClick={() => OpenOtherPropertyinEdit(singleProperty, "view")}>
                                                                    <Image alt="Image" height={20} width={18} src='/PDE/images/view-icon.svg' className={styles.tableactionImg} />
                                                                    <span className={styles.tooltiptext}>View</span>
                                                                </div>
                                                                <div style={{ cursor: 'pointer' }} className={`${styles.actionTitle} ${styles.actionbtn}`} onClick={() => OpenOtherPropertyinEdit(singleProperty, "edit")}>
                                                                    <Image alt="Image" height={18} width={17} src='/PDE/images/edit-icon.svg' className={styles.tableactionImg} />
                                                                    <span className={styles.tooltiptext}>Edit</span>
                                                                </div>
                                                                <div className={`${styles.actionTitle} ${styles.actionbtn}`} style={{ cursor: 'pointer' }} onClick={() => { ShowDeletePopup("Are you sure you want to permanently remove this Property?", "", singleProperty.propertyId, ApplicationDetails.applicationId, "property") }}>
                                                                    <Image alt="Image" height={18} width={17} src='/PDE/images/delete-icon.svg' className={styles.tableactionImg} />
                                                                    <span className={styles.tooltiptext}>Delete</span>
                                                                </div>
                                                            </td>
                                                            {/* </>} */}
                                                        </tr>
                                                    );
                                                })}

                                            </tbody>
                                        </Table>
                                    </div>
                                </div>
                            </div>
                        </div> : null}

                        {/* //Add Relation */}
                        {IsWithDoc && ApplicationDetails.registrationType && ApplicationDetails.registrationType.TRAN_MAJ_CODE == "03" ?
                            <div className={styles.mainTabs}>
                                <Row className={styles.tabHeadContainer}>
                                    <Col lg={6} md={6} xs={6}>
                                        <div className={styles.addCusText}>
                                            <p className={styles.tabText}>{ApplicationDetails.registrationType && ApplicationDetails.registrationType.PARTY2 ? 5 : 4}. Relation Between Parties </p>
                                        </div>
                                    </Col>
                                    <Col lg={6} md={6} xs={6} className='text-end'>
                                        <div className={styles.addCusContainer} onClick={() => { localStorage.setItem("PaymentDetails", JSON.stringify({ donarName: "", relationType: "", doneeName: "", operation: "add" })); router.push("/AddRelationDetailsPage") }}>
                                            <Image alt="Image" height={16} width={18} src='/PDE/images/add-cust-icon.svg' style={{ cursor: 'pointer' }} className={styles.addCusContainerImage} />
                                            <p className={styles.innertabText}>Add Relation</p>
                                        </div>
                                    </Col>
                                </Row>
                                <div className={styles.InnertabHeadContainer}>
                                    <div className={styles.innerTabContainer}>
                                        <div className='table-responsive'>
                                            <Table striped bordered hover className='TableData lpmTable'>
                                                <thead>
                                                    <tr>
                                                        <th>S.No.<span>[క్రమ సంఖ్య]</span></th>
                                                        <th>Donor Name<span>[దాత పేరు]</span></th>
                                                        <th>Relation<span>[సంబంధం]</span></th>
                                                        <th>Donee Name<span>[దాత పేరు]</span></th>
                                                        <th className='PartAction'>Action<span>[చర్య]</span></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {ApplicationDetails.payment && ApplicationDetails.payment.map((singlePayment, index) => {
                                                        return (
                                                            <tr key={index}>
                                                                <td>{index + 1}</td>
                                                                <td>{singlePayment.donarName}</td>
                                                                <td>{singlePayment.relationType}</td>
                                                                <td>{singlePayment.doneeName}</td>
                                                                <td>
                                                                    <div style={{ cursor: 'pointer' }} className={`${styles.actionTitle} ${styles.actionbtn}`} onClick={() => OpenPaymentEdit(singlePayment, "relation")}>
                                                                        <Image alt="Image" height={18} width={17} src='/PDE/images/edit-icon.svg' className={styles.tableactionImg} />

                                                                    </div>
                                                                    <div className={`${styles.actionTitle} ${styles.actionbtn}`} style={{ cursor: 'pointer' }} onClick={() => { ShowDeletePopup("Are you sure you want to permanently remove this Relation?", "", singlePayment._id, ApplicationDetails.applicationId, "Payment") }}>
                                                                        <Image alt="Image" height={18} width={17} src='/PDE/images/delete-icon.svg' className={styles.tableactionImg} />

                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </Table>
                                        </div>
                                    </div>
                                </div>
                            </div> : null
                        }

                        {/* //5. Mortgage Details */}
                        {IsWithDoc && ApplicationDetails.registrationType && ApplicationDetails.registrationType.TRAN_MAJ_CODE == "02" ?
                            <div className={styles.mainTabs}>
                                <Row className={styles.tabHeadContainer}>
                                    <Col lg={6} md={6} xs={6}>
                                        <div className={styles.addCusText}>
                                            {ApplicationDetails?.registrationType?.TRAN_MAJ_CODE === "02" && IsWithDoc ? <p className={styles.tabText}>6. Mortgage Payment Details</p> :
                                                <p className={styles.tabText}>{ApplicationDetails.registrationType && ApplicationDetails.registrationType.PARTY2 ? 5 : 4}. Mortgage Payment Details </p>}
                                        </div>
                                    </Col>
                                    {!ApplicationDetails.payment.length ?
                                        <Col lg={6} md={6} xs={6} className='text-end'>
                                            <div className={styles.addCusContainer} onClick={() => { localStorage.setItem("PaymentDetails", JSON.stringify({ payAmount: null, rateOfInterest: null, duration: null, interestOfPenalty: null, operation: "add", id: "" })); router.push("/AddMortgageDetails") }}>
                                                <Image alt="Image" height={14} width={18} src='/PDE/images/add-cust-icon.svg' style={{ cursor: 'pointer' }} className={styles.addCusContainerImage} />
                                                <p className={styles.innertabText}>Add Mortgage Payment Details</p>
                                            </div>
                                        </Col> : null}
                                </Row>
                                <div className={styles.InnertabHeadContainer}>
                                    <div className={styles.innerTabContainer}>
                                        <div className='table-responsive'>
                                            <Table striped bordered hover className='TableData lpmTable'>
                                                <thead>
                                                    <tr>
                                                        <th className='principalamount'>Principal Amount<span>[అసలు మెుత్తం]</span></th>
                                                        <th>Interest Rate<span>[వడ్డీ రేటు]</span></th>
                                                        <th>Duration<span>[కాల వ్యవధి]</span></th>
                                                        <th>Interest on Penalty<span>[జరిమానాపై వడ్డీ]</span></th>
                                                        <th className='PartAction'>Action<span>[చర్య]</span></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {ApplicationDetails.payment && ApplicationDetails.payment.map((singlePayment, index) => {
                                                        return (
                                                            <tr key={index}>
                                                                <td>{singlePayment.payAmount}</td>
                                                                <td>{singlePayment.rateOfInterest}</td>
                                                                <td>{singlePayment.duration}</td>
                                                                <td>{singlePayment.interestOfPenalty}</td>
                                                                <td>
                                                                    <div style={{ cursor: 'pointer' }} className={`${styles.actionTitle} ${styles.actionbtn}`} onClick={() => OpenPaymentEdit(singlePayment, "mortagage")}>
                                                                        <Image alt="Image" height={18} width={17} src='/PDE/images/edit-icon.svg' className={styles.tableactionImg} />
                                                                    </div>
                                                                    <div className={`${styles.actionTitle} ${styles.actionbtn}`} style={{ cursor: 'pointer' }} onClick={() => { ShowDeletePopup("Are you sure you want to permanently remove this Mortgage Payment Details?", "", singlePayment._id, ApplicationDetails.applicationId, "Payment") }}>
                                                                        <Image alt="Image" height={18} width={17} src='/PDE/images/delete-icon.svg' className={styles.tableactionImg} />
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}

                                                </tbody>
                                            </Table>
                                        </div>
                                    </div>
                                </div>
                            </div> : null
                        }

                        {/* //Payments for sale */}
                        {IsWithDoc && ApplicationDetails.registrationType && ApplicationDetails.registrationType.TRAN_MAJ_CODE == "01" ?
                            <div className={styles.mainTabs}>
                                <Row className={styles.tabHeadContainer}>
                                    <Col lg={6} md={6} xs={6}>
                                        <div className={styles.addCusText}>
                                            <p className={styles.tabText}>{ApplicationDetails.registrationType && ApplicationDetails.registrationType.PARTY2 ? 5 : 4}. Mode of Payment Between Parties </p>
                                        </div>
                                    </Col>
                                    <Col lg={6} md={6} xs={6} className='text-end'>
                                        <div className={styles.addCusContainer} onClick={() => { router.push("/PaymentDetailsPage") }}>
                                            <Image alt="Image" height={15} width={18} src='/PDE/images/add-cust-icon.svg' style={{ cursor: 'pointer' }} className={styles.addCusContainerImage} />
                                            <p className={styles.innertabText}>{ApplicationDetails.payment.length ? "Edit" : "Add"} Payments Between Parties</p>
                                        </div>
                                    </Col>
                                </Row>
                                <div className={styles.InnertabHeadContainer}>
                                    <div className={styles.innerTabContainer}>
                                        <div className='table-responsive'>
                                            <Table striped bordered hover className='TableData lpmTable'>
                                                <thead>
                                                    <tr>
                                                        <th>S.No.<span>[క్రమ సంఖ్య]</span></th>
                                                        <th>Mode of Payment<span>[చెల్లింపు విధానం]</span></th>
                                                        <th>Amount<span>[మొత్తం]</span></th>
                                                        <th>Payment Date<span>[చెల్లింపు తేదీ]</span></th>
                                                        {/* <th>Action<span>[చర్య]</span></th> */}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {ApplicationDetails.payment && ApplicationDetails.payment.map((singlePayment, index) => {
                                                        return (
                                                            <tr key={index}>
                                                                <td>{index + 1}</td>
                                                                <td>{singlePayment.paymentMode}</td>
                                                                <td>{singlePayment.payAmount}</td>
                                                                <td>{DateFormator(singlePayment.dateOfPayment, "dd/mm/yyyy")}</td>
                                                                {/* <td>
                                                                <div style={{ cursor: 'pointer' }} className={`${styles.actionTitle} ${styles.actionbtn}`} onClick={() => OpenPaymentEdit(singlePayment, "sale")}>
                                                                    <Image alt="Image" height={18} width={17} src='/PDE/images/edit-icon.svg' className={styles.tableactionImg} />

                                                                </div>
                                                                <div className={`${styles.actionTitle} ${styles.actionbtn}`} style={{ cursor: 'pointer' }} onClick={() => { ShowDeletePopup("Are you sure you want to permanently remove this Payment Details?", "", singlePayment._id, GetstartedDetails.applicationId, "Payment") }}>
                                                                    <Image alt="Image" height={18} width={17} src='/PDE/images/delete-icon.svg' className={styles.tableactionImg} />

                                                                </div>
                                                            </td> */}
                                                            </tr>
                                                        );
                                                    })}

                                                </tbody>
                                            </Table>
                                        </div>
                                    </div>
                                </div>
                            </div> : null
                        }

                        {/* Add Covenants */}
                        {IsWithDoc ? <form onSubmit={onSubmit}>
                            <div className={styles.mainTabs}>
                                <Row className={styles.tabHeadContainer}>
                                    <Col lg={6} md={6} xs={6}>
                                        <div className={styles.addCusText}>
                                            {ApplicationDetails?.registrationType?.TRAN_MAJ_CODE === "02" && IsWithDoc ? <p className={styles.tabText}>7. Covenants</p> :
                                                <p className={styles.tabText}>{ApplicationDetails.registrationType && ApplicationDetails.registrationType.PARTY2 && !ApplicationDetails?.registrationType?.PARTY3 ? 6 : 5}. Covenants</p>}
                                        </div>
                                    </Col>
                                    <Col lg={6} md={6} xs={6} className='text-end'>
                                        <div className={styles.addCusContainer} onClick={() => redirectToPage("/AddCovenantPage")}>
                                            {ApplicationDetails.covanants && Object.keys(ApplicationDetails.covanants).length ?
                                                <div className={styles.innertabText}><Image alt="Image" height={14} width={16} src='/PDE/images/add-cust-icon.svg' style={{ cursor: 'pointer' }} className={styles.addCusContainerImage} />  <p className={styles.innertabText}>Add Covenant</p></div>
                                                : <div className={styles.innertabText}><Image alt="Image" height={14} width={18} src='/PDE/images/add-cust-icon.svg' style={{ cursor: 'pointer' }} className={styles.addCusContainerImage} />
                                                    <p className={styles.innertabText}>Add / Update Covenant</p></div>}
                                        </div>
                                    </Col>
                                </Row>
                                <div className={styles.InnertabHeadContainer}>
                                    <div className={`${styles.innerTabContainer}, ${styles.covenantContainer}`}>
                                        <div className=''>
                                            <TableInputLongText required={true} placeholder='Add Covenant' name='' value={CovenantsMessage} onChange={() => { }} disabled={true} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form> : null}
                        {IsWithDoc ? <form onSubmit={onSubmit}>
                            <div className={styles.mainTabs}>
                                <Row className={styles.tabHeadContainer}>
                                    <Col lg={6} md={6} xs={6}>
                                        <div className={styles.addCusText}>
                                            {ApplicationDetails?.registrationType?.TRAN_MAJ_CODE == "01" || ApplicationDetails?.registrationType?.TRAN_MAJ_CODE == "03" ?
                                                <p className={styles.tabText}>{ApplicationDetails.registrationType && ApplicationDetails.registrationType.PARTY2 ? 7 : 6}. Details of Acquisition Property</p> : null
                                            }
                                            {ApplicationDetails?.registrationType?.TRAN_MAJ_CODE == "02" && IsWithDoc ? <p className={styles.tabText}>8. Details of Property Acquisition & Loan Terms and Conditions</p> :
                                                ApplicationDetails?.registrationType?.TRAN_MAJ_CODE == "02" && !IsWithDoc ?
                                                    <p className={styles.tabText}>{ApplicationDetails.registrationType && ApplicationDetails.registrationType.PARTY2 ? 7 : 6}. Details of Property Acquisition & Loan Terms and Conditions</p> : null
                                            }
                                        </div>
                                    </Col>
                                    <Col lg={6} md={6} xs={6} className='text-end'>
                                        <div className={styles.addCusContainer} onClick={() => redirectToPage("/AddacquisitionCovenantPage")}>
                                            {ApplicationDetails.covanants && Object.keys(ApplicationDetails.covanants).length ?
                                                <div className={styles.innertabText}><Image alt="Image" height={14} width={16} src='/PDE/images/add-cust-icon.svg' style={{ cursor: 'pointer' }} className={styles.addCusContainerImage} />  <p className={styles.innertabText}>Add / Update</p></div>
                                                : <div className={styles.innertabText}><Image alt="Image" height={14} width={18} src='/PDE/images/add-cust-icon.svg' style={{ cursor: 'pointer' }} className={styles.addCusContainerImage} />
                                                    <p className={styles.innertabText}>Add / Update</p></div>}
                                        </div>
                                    </Col>
                                </Row>
                                <div className={styles.InnertabHeadContainer}>
                                    <div className={`${styles.innerTabContainer}, ${styles.covenantContainer}`}>
                                        <div className=''>
                                            <TableInputLongText required={true} placeholder='Add Acquisition Covenants' name='' value={AcquisitionCovenants} onChange={() => { }} disabled={false} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form> : null}
                    </div>
                </div>

                {IsWithDoc ? <div className={styles.mainTabs}>
                    <div className={`${styles.mainContainer} ${styles.ListviewMain}`}>
                        <Row className={styles.tabHeadContainer}>
                            <Col lg={6} md={6} xs={6}>
                                <div className={styles.addCusText}>
                                    {ApplicationDetails?.registrationType?.TRAN_MAJ_CODE == "02" && IsWithDoc ? <p className={styles.tabText}>9. Attach Enclosures [ఎన్‌క్లోజర్‌లను అటాచ్ చేయండి]</p> :
                                        <p className={styles.tabText}>{ApplicationDetails.registrationType && ApplicationDetails.registrationType.PARTY2 && !ApplicationDetails?.registrationType?.PARTY3 ? 8 : 6}. Attach Enclosures [ఎన్‌క్లోజర్‌లను అటాచ్ చేయండి] </p>}
                                </div>
                            </Col>

                            <Col lg={6} md={6} xs={6} className='text-end'>
                                <div className={styles.addCusContainer} onClick={() => { localStorage.setItem("PaymentDetails", JSON.stringify({ payAmount: null, rateOfInterest: null, duration: null, interestOfPenalty: null, operation: "add", id: "" })); router.push("/FileuploadPage") }}>
                                    <Image alt="Image" height={15} width={18} src='/PDE/images/add-cust-icon.svg' style={{ cursor: 'pointer' }} className={styles.addCusContainerImage} />
                                    <p className={styles.innertabText}>Upload New Document</p>
                                </div>
                            </Col>
                        </Row>
                        <div className={styles.InnertabHeadContainer}>
                            <div className={styles.innerTabContainer}>
                                <div className='table-responsive'>
                                    <Table striped bordered hover className='TableData lpmTable'>
                                        <thead>
                                            <tr>
                                                <th className='principalamount'>S.No.<span>[క్రమ సంఖ్య]</span></th>
                                                <th>File Name<span>[ఫైల్ పేరు]</span></th>
                                                <th className='PartAction'>Action<span>[చర్య]</span></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {ApplicationDetails?.Uploads?.documents?.map((singleFile, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{singleFile.fileName}</td>
                                                        <td>
                                                            <div id="text" className={`${styles.actionTitle} ${styles.actionbtn}`} style={{ cursor: 'pointer' }} onClick={() => { window.open(process.env.BACKEND_URL + "/pdeapi/files/" + singleFile.downloadLink) }}>
                                                                <Image alt="Image" height={18} width={14} src='/PDE/images/view-icon.svg' className={styles.tableactionImg} />
                                                                <span className={styles.tooltiptext}>View</span>
                                                            </div>
                                                            <div className={`${styles.actionTitle} ${styles.actionbtn}`} style={{ cursor: 'pointer' }} onClick={() => { ShowDeletePopup("Are you sure you want to permanently remove this File?", "", singleFile.fileName, ApplicationDetails.applicationId, "Uploads") }}>
                                                                <Image alt="Image" height={18} width={17} src='/PDE/images/delete-icon.svg' className={styles.tableactionImg} />
                                                                <span className={styles.tooltiptext}>Delete</span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </Table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> : null}


                {!IsWithDoc ? <div className={styles.mainTabs}>
                    <div className={`${styles.mainContainer} ${styles.ListviewMain}`}>
                        <Row className={styles.tabHeadContainer}>
                            <Col lg={6} md={6} xs={6}>
                                <div className={styles.addCusText}>
                                    <p className={styles.tabText}>{ApplicationDetails.registrationType && ApplicationDetails.registrationType.PARTY2 ? 5 : 6}. Upload Document  </p>
                                </div>
                            </Col>
                            {checkFileOrNot == false &&
                                <Col lg={6} md={6} xs={6} className='text-end'>
                                    <div className={styles.addCusContainer} onClick={() => { setWithPDEUpload(true) }}>
                                        <Image alt="Image" height={15} width={18} src='/PDE/images/add-cust-icon.svg' style={{ cursor: 'pointer' }} className={styles.addCusContainerImage} />
                                        <p className={styles.innertabText}>Upload New Document</p>
                                    </div>
                                </Col>
                            }
                        </Row>
                        <div className={styles.InnertabHeadContainer}>
                            <div className={styles.innerTabContainer}>
                                <div className='table-responsive'>
                                    <Table striped bordered hover className='TableData lpmTable'>
                                        <thead>
                                            <tr>
                                                <th className='principalamount'>S.No.<span>[క్రమ సంఖ్య]</span></th>
                                                <th>File Name<span>[ఫైల్ పేరు]</span></th>
                                                <th className='PartAction'>Action<span>[చర్య]</span></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {ApplicationDetails?.Uploads?.documents?.filter((singleFile) => singleFile.fileName === 'document').map((singleFile, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{singleFile.fileName}</td>
                                                        <td>
                                                            {/* <div id="text" className={`${styles.actionTitle} ${styles.actionbtn}`} style={{ cursor: 'pointer' }} onClick={() => { window.open(process.env.BACKEND_URL + "/pdeapi/pdfs/" + singleFile.downloadLink) }}> */}
                                                            <div id="text" className={`${styles.actionTitle} ${styles.actionbtn}`} style={{ cursor: 'pointer' }} onClick={() => { DocumentPreview(singleFile.downloadLink) }}>
                                                                <Image alt="Image" height={18} width={14} src='/PDE/images/view-icon.svg' className={styles.tableactionImg} />
                                                                <span className={styles.tooltiptext}>View</span>
                                                            </div>
                                                            <div className={`${styles.actionTitle} ${styles.actionbtn}`} style={{ cursor: 'pointer' }} onClick={() => { ShowDeletePopup("Are you sure you want to permanently remove this File?", "", singleFile.fileName, ApplicationDetails.applicationId, "Uploads") }}>
                                                                <Image alt="Image" height={18} width={17} src='/PDE/images/delete-icon.svg' className={styles.tableactionImg} />
                                                                <span className={styles.tooltiptext}>Delete</span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </Table>
                                </div>
                            </div>
                        </div>
                        <div className={styles.notestyle}>
                            <span>Note:</span>
                            <ul>
                                {
                                    ["Upload document only in PDF with A4 size", "Scanned Documents are not allowed", "Check the clarity & quality of the document before uploading"].map((l, ind) => {
                                        return <li key={ind}>{l}</li>
                                    })
                                }
                            </ul>
                        </div>
                    </div>
                </div> : null}


                {/* Presenter */}
                {Allfilled.isDataPresent && <div className={styles.mainTabs}>
                    <Row className={styles.tabHeadContainer}>
                        <Col lg={6} md={6} xs={12}>
                            <div className={styles.addCusText}>
                                {/* {ApplicationDetails?.registrationType?.TRAN_MAJ_CODE == "02" && IsWithDoc ? <p className={styles.tabText}>9. Attach Enclosures [ఎన్‌క్లోజర్‌లను అటాచ్ చేయండి]</p> :  */}
                                <p className={styles.tabText}>{ApplicationDetails.registrationType.TRAN_MAJ_CODE == "04" && !ApplicationDetails?.registrationType?.PARTY3 ? 3 : ApplicationDetails.docProcessType == "PDE" ? Anywherestat ? 6 : 5 : ApplicationDetails.registrationType.PARTY2 ? 7 : 6}. Presenter</p>
                            </div>
                        </Col>
                        {LoginDetails?.loginEmail === 'APIIC'? <></>:<>
                    
                        <Col lg={6} md={6} xs={12} className='text-end'>
                            <div className={` justify-content-end ${styles.addCusContainer}`}>
                                <Image alt="Image" height={20} width={20} src='/PDE/images/location.png' style={{ cursor: 'pointer' }} className={styles.addCusContainerImage} />
                                <p className={styles.innertabText}>Private Attendance</p>
                            </div>
                        </Col>
                        </>
                         }
                    </Row>
                    <div className={styles.ExecutantDetailsInfo}>
                        {(ApplicationDetails.registrationType.TRAN_MAJ_CODE !== "04" )
                        ? <div>
                            <div className={`${styles.DetailsHeaderContainer} ${styles.presenterHeader}`}>
                                <Row>
                                    <Col lg={6} md={6} xs={12}>
                                        <div className={styles.ContainerColumn}>
                                            <p className={styles.HeaderText}>Executant List</p>
                                        </div>
                                    </Col>
                                    <Col lg={6} md={6} xs={12}>
                                    </Col>
                                </Row>
                            </div>
                            <div className={styles.InnertabHeadContainer}>
                                <div className={`${styles.innerTabContainer} ${styles.TableCon}`}>
                                    <div className='table-responsive'>
                                        <Table striped bordered hover className='TableData ExecutantTable lpmTable'>
                                            <thead>
                                                <tr>
                                                    <th className=''>S.No.<span>[క్రమ సంఖ్య]</span></th>
                                                    <th className=''>Name<span>[పేరు]</span></th>
                                                    <th className=''>Relation<span>[సంబంధం]</span></th>
                                                   {!vswscondtion && <th className=''>Age<span>[వయస్సు]</span></th> }
                                                    <th className='boundaries'>Presenter<span>[దస్తావేజు సమర్పించువారు]</span></th>
                                                   {LoginDetails?.loginEmail === 'APIIC'? <></>:  <th className='boundaries'>Private Attendance</th>}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    ApplicationDetails.executent.map((singleUser, index) => {
                                                        return (
                                                            <tr key={index}>
                                                                <td>{index + 1}</td>
                                                                <td>{singleUser.name}</td>
                                                                <td>{singleUser.relationType} {singleUser?.relationName?.toUpperCase()}</td>
                                                                {!vswscondtion && <td>{singleUser.age}</td> }
                                                                <td><TableInputRadio2 disabled={singleUser.partyType == "Public" && singleUser.age < 18 ? true : false} required={true} name='Presenter' defaultValue={ApplicationDetails.presenter && ApplicationDetails.presenter.length ? ApplicationDetails.presenter[0]._id : ''} onChange={onSelectPresenter} options={[{ label: singleUser._id }]} /></td>
                                                               
                                                                {LoginDetails?.loginEmail === 'APIIC'? <></>: 
                                                                <>
                                                                 {AttendanceDetails.id == singleUser._id ?
                                                                    <td> {AttendanceDetails.Reason} <Image alt="Image" height={15} width={18} src='/PDE/images/delete-icon.svg' style={{ cursor: 'pointer' }} className={styles.addCusContainerImage} onClick={() => deletAttandanceAction(singleUser._id)} /></td>
                                                                    :
                                                                    AttendanceDetails.id == "" ?
                                                                        <td><div className='addattendanceInfo' onClick={() => addAttandanceAction(singleUser._id)}><Image alt="Image" height={15} width={18} src='/PDE/images/location.png' style={{ cursor: 'pointer' }} className={styles.addCusContainerImage} /><span>Add Attendance</span></div></td>
                                                                        : null
                                                                }
                                                                </>
                                                                 }
                                                            </tr>
                                                        );
                                                    }
                                                    )}
                                            </tbody>
                                        </Table>
                                    </div>
                                </div>
                            </div>
                        </div> : null}
                        {!clamintNtDisplay ? <div>
                            <div className={`${styles.DetailsHeaderContainer} ${styles.presenterHeader}`}>
                                <Row>
                                    <Col lg={6} md={6} xs={12}>
                                        <div className={styles.ContainerColumn}>
                                            <p className={styles.HeaderText}>Claimant List</p>
                                        </div>
                                    </Col>
                                    <Col lg={6} md={6} xs={12}>
                                    </Col>
                                </Row>
                            </div>
                            <div className={styles.InnertabHeadContainer}>
                                <div className={`${styles.innerTabContainer} ${styles.TableCon}`}>
                                    <div className='table-responsive'>
                                        <Table striped bordered hover className='TableData ExecutantTable lpmTable'>
                                            <thead>
                                                <tr>
                                                    <th className=''>S.No.<span>[క్రమ సంఖ్య]</span></th>
                                                    <th className=''>Name<span>[పేరు]</span></th>
                                                    <th className=''>Relation11<span>[సంబంధం]</span></th>
                                                    {!vswscondtion && <th className=''>Age<span>[వయస్సు]</span></th>}
                                                    <th className='boundaries'>Presenter<span>[దస్తావేజు సమర్పించువారు]</span></th>
                                                    {LoginDetails?.loginEmail === 'APIIC'? <></>: <th className='boundaries'>Private Attendance</th>}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    ApplicationDetails.claimant.map((singleUser, index) => {
                                                        return (
                                                            <tr key={index}>
                                                                <td>{index + 1}</td>
                                                                <td>{singleUser.name}</td>
                                                                <td>{singleUser.relationType} {singleUser?.relationName?.toUpperCase()}</td>
                                                                {!vswscondtion && <td>{singleUser.age}</td> }
                                                                <td><TableInputRadio2 disabled={singleUser.partyType == "Public" && singleUser.age < 18 ? true : false} required={true} name='Presenter' defaultValue={ApplicationDetails.presenter && ApplicationDetails.presenter.length ? ApplicationDetails.presenter[0]._id : ''} onChange={onSelectPresenter} options={[{ label: singleUser._id }]} /></td>
                                                                {LoginDetails?.loginEmail === 'APIIC'? <></>:
                                                                <>
                                                                
                                                                {AttendanceDetails.id == singleUser._id ?
                                                                    <td> {AttendanceDetails.Reason} <Image alt="Image" height={15} width={18} src='/PDE/images/delete-icon.svg' style={{ cursor: 'pointer' }} className={styles.addCusContainerImage} onClick={() => deletAttandanceAction(singleUser._id)} /></td>
                                                                    :
                                                                    AttendanceDetails.id == "" ?
                                                                        <td><div className='addattendanceInfo' onClick={() => addAttandanceAction(singleUser._id)}><Image alt="Image" height={15} width={18} src='/PDE/images/location.png' style={{ cursor: 'pointer' }} className={styles.addCusContainerImage} /><span>Add Attendance</span></div></td>
                                                                        : null
                                                                }
                                                                </>
                                                                }
                                                            </tr>
                                                        );
                                                    }
                                                    )}
                                            </tbody>
                                        </Table>
                                    </div>
                                </div>
                            </div>
                        </div> : null}
                        {
                            !!representativeList().length &&
                            <>
                                <div className={`${styles.DetailsHeaderContainer} ${styles.presenterHeader}`}>
                                    <Row>
                                        <Col lg={6} md={6} xs={12}>
                                            <div className={styles.ContainerColumn}>
                                                <p className={styles.HeaderText}>Representative List</p>
                                            </div>
                                        </Col>
                                        <Col lg={6} md={6} xs={12}>
                                        </Col>
                                    </Row>
                                </div>
                                <div className={styles.InnertabHeadContainer}>
                                    <div className={`${styles.innerTabContainer} ${styles.TableCon}`}>
                                        <div className='table-responsive'>
                                            <Table striped bordered hover className='TableData ExecutantTable lpmTable'>
                                                <thead>
                                                    <tr>
                                                        <th className=''>S.No.<span>[క్రమ సంఖ్య]</span></th>
                                                        <th className=''>Name<span>[పేరు]</span></th>
                                                        <th className=''>Relation222<span>[సంబంధం]</span></th>
                                                        {!vswscondtion && <th className=''>Age<span>[వయస్సు]</span></th>}
                                                        <th className=''>Related Party</th>
                                                        <th className='boundaries'>Presenter<span>[దస్తావేజు సమర్పించువారు]</span></th>
                                                        {LoginDetails?.loginEmail === 'APIIC'? <></>:<> <th className='boundaries'>Private Attendance</th></>}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        representativeList().map((singleUser: any, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td>{index + 1}</td>
                                                                    <td>{singleUser.name}</td>
                                                                    <td>{singleUser.relationType} {singleUser?.relationName?.toUpperCase()}</td>
                                                                    {!vswscondtion && <td>{singleUser.age}</td> }
                                                                    <td>{singleUser.relatedPartyName}</td>
                                                                    <td><TableInputRadio2 disabled={singleUser.partyType == "Public" && singleUser.age < 18 ? true : false} required={true} name='Presenter' defaultValue={ApplicationDetails.presenter && ApplicationDetails.presenter.length ? ApplicationDetails.presenter[0]._id : ''} onChange={onSelectPresenter} options={[{ label: singleUser._id }]} /></td>
                                                                    {LoginDetails?.loginEmail === 'APIIC'? <></>:<>
                                                                    {AttendanceDetails.id == singleUser._id ?
                                                                        <td> {AttendanceDetails.Reason} <Image alt="Image" height={15} width={18} src='/PDE/images/delete-icon.svg' style={{ cursor: 'pointer' }} className={styles.addCusContainerImage} onClick={() => deletAttandanceAction(singleUser._id)} /></td>
                                                                        :
                                                                        AttendanceDetails.id == "" ?
                                                                            <td><div className='addattendanceInfo' onClick={() => addAttandanceAction(singleUser._id)}><Image alt="Image" height={15} width={18} src='/PDE/images/location.png' style={{ cursor: 'pointer' }} className={styles.addCusContainerImage} /><span>Add Attendance</span></div></td>
                                                                            : null
                                                                    }
                                                                    </>}
                                                                </tr>
                                                            );
                                                        }
                                                        )}
                                                </tbody>
                                            </Table>
                                        </div>
                                    </div>
                                </div>
                            </>}
                    </div>
                </div>}

                {Anywherestat ? <div className={styles.mainTabs}>
                    <div className={`${styles.mainContainer} ${styles.ListviewMain}`}>
                        <Row className={styles.tabHeadContainer}>
                            <Col lg={6} md={6} xs={6}>
                                <div className={styles.addCusText}>
                                    <p className={styles.tabText}>{ApplicationDetails.registrationType && ApplicationDetails.registrationType.PARTY2 ? 7 : 6}. Upload Anywhere Document  </p>
                                </div>
                            </Col>
                            {checkAnywherFileOrNot == false &&
                                <Col lg={6} md={6} xs={6} className='text-end'>
                                    <div className={styles.addCusContainer} onClick={() => { setAnywhereUpload(true) }}>
                                        <Image alt="Image" height={15} width={18} src='/PDE/images/add-cust-icon.svg' style={{ cursor: 'pointer' }} className={styles.addCusContainerImage} />
                                        <p className={styles.innertabText}>Upload New Document</p><text style={{ color: 'red' }}>*</text>
                                    </div>
                                </Col>
                            }
                        </Row>
                        <div className={styles.InnertabHeadContainer}>
                            <div className={styles.innerTabContainer}>
                                <div className='table-responsive'>
                                    <Table striped bordered hover className='TableData lpmTable'>
                                        <thead>
                                            <tr>
                                                <th className='principalamount'>S.No.<span>[క్రమ సంఖ్య]</span></th>
                                                <th>File Name<span>[ఫైల్ పేరు]</span></th>
                                                <th className='PartAction'>Action<span>[చర్య]</span></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {ApplicationDetails?.Uploads?.documents?.filter((singleFile) => singleFile.fileName === 'anywheredocument').map((singleFile, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{singleFile.fileName}</td>
                                                        <td>
                                                            {/* <div id="text" className={`${styles.actionTitle} ${styles.actionbtn}`} style={{ cursor: 'pointer' }} onClick={() => { window.open(process.env.BACKEND_URL + "/pdeapi/pdfs/" + singleFile.downloadLink) }}> */}
                                                            <div id="text" className={`${styles.actionTitle} ${styles.actionbtn}`} style={{ cursor: 'pointer' }} onClick={() => { DocumentPreview(singleFile.downloadLink) }}>
                                                                <Image alt="Image" height={18} width={14} src='/PDE/images/view-icon.svg' className={styles.tableactionImg} />
                                                                <span className={styles.tooltiptext}>View</span>
                                                            </div>
                                                            <div className={`${styles.actionTitle} ${styles.actionbtn}`} style={{ cursor: 'pointer' }} onClick={() => { ShowDeletePopup("Are you sure you want to permanently remove this File?", "", singleFile.fileName, ApplicationDetails.applicationId, "Uploads") }}>
                                                                <Image alt="Image" height={18} width={17} src='/PDE/images/delete-icon.svg' className={styles.tableactionImg} />
                                                                <span className={styles.tooltiptext}>Delete</span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </Table>
                                </div>
                            </div>
                        </div>
                        <div className={styles.notestyle}>
                            <span>Note:</span>
                            <ul>
                                {
                                    ["The presented document should be tallied with the uploaded document. If any discrepancy is there SR has the right to reject it", "Upload document only in PDF with A4 size", "The document size must be less than 200MB for upload", "Scanned Documents are not allowed", "Check the clarity & quality of the document before uploading"].map((l, ind) => {
                                        return <li key={ind}>{l}</li>
                                    })
                                }
                            </ul>
                        </div>
                    </div>
                </div> : null}

                <Row className='noteInfo'>
                    <h6>Note:-</h6>
                    <Col lg={12} md={12} xs={12}>  
                        <ul>
                            <li>Please complete all required eSign processes for selected form60/61 option to enable submit button.</li>
                            <li>Please clear the CDMA Pending Dues to Submit the Application.</li>
                            <li>If the chargeable value is above ₹10 lakhs, PAN/Form 60/61 is mandatory.</li>
                        </ul>
                    </Col>

                    <Row>
                        <Col lg={8} md={12} xs={12}>
                            <h6 className='noteText'>Note:- PAN / Form60/61 Mandatory Details</h6>
                        </Col>
                        <Col lg={4} md={12} xs={12} className='text-end justify-content-end'> </Col>
                    </Row>
                   
                    <div className={styles.InnertabHeadContainer}>
                    <div className={styles.innerTabContainer}>
                        <div className='table-responsive pb-3'>
                            <Table striped bordered hover className='TableData lpmTable'>
                            <thead>
                                <tr>
                                    <th className='p-1'>S.No</th>
                                    <th className='p-1'>Mandatory or Optional Feilds</th>
                                    <th className='p-1'>Document Type</th>
                                    <th className='p-1'>Party Type</th>
                                    <th className='p-1'>Property Type</th>
                                    <th className='p-1'>Document Value (Considaration / Market Value)</th>
                                </tr>
                            </thead>
                            {panForm60ValidationRules.length ? (
                                <tbody>
                                    {panForm60ValidationRules.map((rule, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{rule.validation}</td>
                                            <td>{rule.documentType}</td>
                                            <td>{rule.partyType}</td>
                                            <td>{rule.propertyType}</td>
                                            <td>{rule.documentValue}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            ):null}
                        </Table>
                        </div>
                        </div>
                    </div>
                </Row>
                {Allfilled.isDataPresent && Allfilled.isPresenterSelected && ApplicationDetails?.presenter && ApplicationDetails?.presenter?.length > 0 &&

                    <Col lg={12} md={12} xs={12}>
                        <div className='d-flex justify-content-center'>
                            <button className='proceedButton' onClick={() => OnFinalSubmit(false)}>{ApplicationDetails.status == "SUBMITTED" ? "Re-Submit" : "Submit"}</button>
                            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
                                <Modal.Header >
                                    <Modal.Title className="fw-bold text-danger">Alert</Modal.Title>
                                </Modal.Header>
                                <Modal.Body className="text-center">
                                    <p style={{ fontWeight: 'bold' }}>The Given Stamp ID is already used in another application. Do you want to continue?</p>
                                    <div className="d-flex justify-content-center mt-3">
                                        <button className="proceedButton ms-2" onClick={() => reexecuteSubmitFlow()}>Yes</button>
                                        <button className="proceedButton ms-2" onClick={() => setShowModal(false)}>No</button>
                                    </div>
                                </Modal.Body>
                            </Modal>
                        </div>
                    </Col>
                }
                {/* {ApplicationDetails.executent.length + "," + ApplicationDetails.claimant.length + "," + ApplicationDetails.property.length} */}
                {/* <pre>{JSON.stringify(ApplicationDetails, null, 2)}</pre> */}
                {/* <pre>{JSON.stringify(Allfilled, null, 2)}</pre> */}
            </Container>
            {withPDEUpload && <Container>
                <div className={Popstyles.reportPopup}>
                    <div className={Popstyles.container}>
                        <div className={Popstyles.Messagebox}>
                            <div className={Popstyles.header}>
                                <div className={Popstyles.letHeader} >
                                    <p className={Popstyles.text}>Upload Document</p>
                                </div>
                                <div>
                                    <ImCross onClick={() => { setWithPDEUpload(false) }} className={Popstyles.crossButton} />
                                </div>
                            </div>
                            <div style={{ paddingLeft: '1rem', paddingRight: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }} className={Popstyles.popupBox}>


                                <div className={styles.rightBox}>

                                    {/* isUploadDone == "process" || isUploadDone == "PROCESS" || isUploadDone == "false" || isUploadDone == "FALSE" || isUploadDone == "" ? */}

                                    <div style={{ width: '400px' }}>
                                        <input className={uploadStyles.upBox}
                                            type='file'
                                            name='document'
                                            onChange={(e: any) => { OnFileSelect(e, 'document') }}
                                            accept={'application/pdf, .doc, .docx'}
                                            required
                                        />
                                        {/* <div className={uploadStyles.confirmUpload} style={{ backgroundColor: (uploadData.isUploadDone == 'false' || uploadData.isUploadDone == "FALSE") ? 'red' : (uploadData.isUploadDone == 'process' || uploadData.isUploadDone == "PROCESS") ? 'yellow' : 'transperent', width: '100%' }}></div> */}
                                    </div>
                                    {/* // :
											// (isUploadDone == 'true' || isUploadDone == 'TRUE') &&
											// <div style={{ display: 'flex', alignItems: 'center', borderColor: 'black', borderWidth: '1px', borderRadius: '20px', backgroundColor: '#dddddd', width: '350px', justifyContent: 'space-between' }}>
											// 	<div style={{ display: 'flex', alignItems: 'center', marginLeft: '1rem' }}>
											// 		<MdDownloadDone style={{ height: '40px', width: '40px', color: 'green', marginLeft: '2px' }} />
											// 		<div className={styles.checkBoxText} style={{ fontWeight: 600, fontSize: '14px', marginRight: '5px' }}>Document Uploaded</div>
											// 	</div>
											// 	<div onClick={() => onCancelUpload(uploadKey)} style={{ cursor: 'pointer', marginRight: '1rem' }}>X</div>
											// </div>
										// } */}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </Container>
            }

            {anywhereUpload && Anywherestat && <Container>
                <div className={Popstyles.reportPopup}>
                    <div className={Popstyles.container}>
                        <div className={Popstyles.Messagebox}>
                            <div className={Popstyles.header}>
                                <div className={Popstyles.letHeader} >
                                    <p className={Popstyles.text}>Upload Document</p>
                                </div>
                                <div>
                                    <ImCross onClick={() => { setAnywhereUpload(false) }} className={Popstyles.crossButton} />
                                </div>
                            </div>
                            <div style={{ paddingLeft: '1rem', paddingRight: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }} className={Popstyles.popupBox}>


                                <div className={styles.rightBox}>

                                    {/* isUploadDone == "process" || isUploadDone == "PROCESS" || isUploadDone == "false" || isUploadDone == "FALSE" || isUploadDone == "" ? */}

                                    <div style={{ width: '400px' }}>
                                        <input className={uploadStyles.upBox}
                                            type='file'
                                            name='Anywheredocument'
                                            onChange={(e: any) => { OnFileSelect(e, 'anywheredocument') }}
                                            accept={'application/pdf, .doc, .docx'}
                                        />
                                        {/* <div className={uploadStyles.confirmUpload} style={{ backgroundColor: (uploadData.isUploadDone == 'false' || uploadData.isUploadDone == "FALSE") ? 'red' : (uploadData.isUploadDone == 'process' || uploadData.isUploadDone == "PROCESS") ? 'yellow' : 'transperent', width: '100%' }}></div> */}
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </Container>
            }

            {/* {isTaxesView && (
                <TaxDuesDialog
                    gPropData={gPropData}
                    selectedProperty={selectedProperty}
                    setIsTaxView={setIsTaxView}
                    setGPropData={setGPropData}
                    setSelectedProperty={setSelectedProperty}
                    setIsMutationPaymentCleared={setIsMutationPaymentCleared}
                />
            )} */}
            {/* <pre>{JSON.stringify(ApplicationDetails, null, 2)}</pre> */}
            {/* <pre>{JSON.stringify(PropertyDetails, null, 2)}</pre> */}
            {/* <pre>{JSON.stringify(ApplicationDetails, null, 2)}</pre> */}
            {/* <pre>{JSON.stringify(ApplicationDetails, null, 2)}</pre> */}
            {/* <pre>{JSON.stringify(ApplicationDetails, null, 2)}</pre> */}
        </div >
    )
}

export default PartiesDetailsPage;

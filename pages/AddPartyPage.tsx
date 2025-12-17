import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Container, Row, Col, Modal, Button } from 'react-bootstrap';
import styles from '../styles/pages/Mixins.module.scss';
import { useAppSelector, useAppDispatch } from '../src/redux/hooks';
import { useRouter } from 'next/router';
import TableInputText from '../src/components/TableInputText';
import TableText from '../src/components/TableText';
import TableInputLongText from '../src/components/TableInputLongText';
import Image from 'next/image';
import Table from 'react-bootstrap/Table';
import uploadStyles from '../styles/components/UploadDoc.module.scss'

import { useSavePartyDetails, useUpdatePartyDetails, useSaveRepresentDetails, UseAdharValidate, useNriPanValidation, usegetPassportVerfication, UseSendMobileOTP, UseAuthenticateUpdate, UseMobileVerify, UseGetAadharDetails, UseGetAadharOTP, useGetDistrictList, getLinkedSroDetails, getSaleCumGPADetails, UsegetapiicGovtInstitutions, UseGetAppicEmplData, UseGetAppicEmplPersonData, SaveAadharConsentDetails } from '../src/axios'; import { AadharPopupAction, PopupAction } from '../src/redux/commonSlice';
import { CallingAxios, KeepLoggedIn, ShowAadharPopup, ShowMessagePopup, ShowPreviewPopup, useVoiceSequenceAadhaarConsent2, useVoicePlayerAadhaarConsent1, encodeBase64 } from '../src/GenericFunctions';
import {   allowMutationPayments, encryptId, EncryptAdrwithPkcs, ValidateShareOnPartition, Consent1, Consent2_Eng, Consent2_Tel  } from '../src/utils'
import Popstyles from '../styles/components/PopupAlert.module.scss';
import Head from 'next/head';
import { ImCross } from 'react-icons/im';
import TableSelectDate from '../src/components/TableSelectDate';
import moment from 'moment';
import PanValidationDialog from '../src/components/PanValidationDialog';
import PanDuplicationDialog from './PanDuplicationDialog';
import { get } from 'lodash';
import TableDropdownSRO from '../src/components/TableDropdownSRO';
import Accordion from 'react-bootstrap/Accordion';
import { Volume2, PauseCircle, PlayCircle } from "lucide-react";


interface LoginDetails {
    loginEmail: string;
    loginName: string;
    loginType: string;
    loginId: string;
    token: string;
    loginMode: string;
}
const AddPartyPage = () => {
    const dispatch = useAppDispatch()
    const router = useRouter();
    let initialGetstartedDetails = useAppSelector(state => state.form.GetstartedDetails);
    const [GetstartedDetails, setGetstartedDetails] = useState(initialGetstartedDetails)
    let CurrentPartyDetails = useAppSelector(state => state.form.CurrentPartyDetails);
    const [ApplicationDetails, setApplicationDetails] = useState<any>({ applicationId: GetstartedDetails.applicationId, registrationType: { TRAN_MAJ_CODE: "", TRAN_MIN_CODE: "", TRAN_DESC: "", PARTY1: "", PARTY1_CODE: "", PARTY2: "", PARTY2_CODE: "" }, documentNature: { TRAN_MIN_CODE: "" }, status: "ACTIVE", sroDetails: null, executent: [], claimant: [], property: [], payment: [], MortagageDetails: [], giftRelation: [], presenter: [], covanants: {}, sroCode: "", amount: "",AttendanceDetails:{},witness:[] });
    let CurrentRepresentDetails = useAppSelector(state => state.form.CurrentRepresentDetails);
    const [PartyDetails, setPartyDetails] = useState<{[key:string]:any,aadhaar:string}>({phone: '',mobileOTP: '',operation: 'Add', PartyType: 'CLAIMANT',representSubType:'Claimant',representType:'Claimant', isRepresentativeAdded:true});

    const [aadharStatus,setaadharStatus] = useState(false)
    const [isPanOrFormReq,setIsPanOrFormReq] = useState(false)
    const [passportstatus,setPassportstatus] = useState(true)
    const [ParentPartyDetails, setParentPartyDetails] = useState<any>({});
    const [CheckedCurrentAddress, setCheckedCurrentAddress] = useState<boolean>(true);
    const [errors, setErrors] = useState<any>({});
    const [DropdownFLag, setDropdownFLag] = useState(true);
    const [flag, setflag] = useState(true);
    const [tidco, setTidco] = useState(false)
    const [existingAdhar,setExistingAdhar] = useState<any>([]);
    let [ShareRls,setShareRls]=useState<any>(false);
    let [popUp,setPopup]=useState<any>(false);
    let AadharOption: any = useAppSelector(state => state.common.AadharPopupMemory);
    const [passportcheck,setPassportcheck] = useState<any>([]);
    const [passportname,setpassportname] = useState<any>(false);
    const [showPanValidationDialog, setShowPanValidationDialog] = useState<any>(false);
    const [disablePAN, setDisablePAN] = useState<any>(false);
    const [existingPAN,setExistingPAN] = useState<any>([]);
    const [showPanDuplicationDialog,setShowPanDuplicationDialog] = useState<boolean>(false);
    const [allowMutationPayment, setAllowMutationPayment] = useState<boolean>(false);  
    const [isAadharValidated,setIsAadharValidated] = useState <boolean>(false);  
    const [showModal,setShowModal]  = useState(false)
    const [mobileOtpSent, setMobileOtpSent] = useState(false);
    const [isMobileOtpVerified, setIsMobileOtpVerified] = useState(false);
    const [sentOtpForMobile, setSentOtpForMobile] = useState('');
    const [DeathCertificate, setDeathCertificate] = useState<any>(false);
    const [UploadDocument, setUploadDocument] = useState({ docName: "", status: "" });
    const [PartyFileDetails,setPartyFileDetails] =useState<any>()

    const [ociInfo,setOciInfo] =useState(false);
    const handleClose = () => setOciInfo(false);
    const handleShow = () => setOciInfo(true);
    const [saleExecute, setSaleExecute] = useState(false)
    const [oldSaleCumGPA, setOldSaleCumGPA] = useState<any>({ district: '', sro:'', book_no:'', doct_no:'', reg_year:''})
    const [DistrictList, setDistrictList] = useState([]);
    const [SROOfficeList, setSROOfficeList] = useState([]);
    const [enableDetails, setEnableDetails] = useState(false)
    const [multiNames, setMultiNames] = useState([])
    const [apiicEmplData, setApiicEmplData] = useState();
    const [aadharValidation, setAadharValidation] = useState<any>({
        otpDetails: {},
        OTP: "",
        aadharDetails: {}
    })
    const [aadharOtpSent, setAadharOtpSent] = useState<boolean>(false)
    const [loginDeatils, setLoginDetails] = useState<LoginDetails | null>(null);
    const [isApiicaadharvalidated,setApiicAadharvalidated] = useState(false)

    const [showSendOtpButton, setShowSendOtpButton] = useState(false);
    const [showAadharConsentConfirmPopup, setShowAadharConsentConfirmPopup] = useState(false);    
    const [aadharConsentCheckboxChecked, setAadharConsentCheckboxChecked] = useState(false);    
    const { audioRef, voiceStatus, isTeluguMode, toggleVoice, resetVoiceState } = useVoiceSequenceAadhaarConsent2();
    const { voicePlayerStatus, togglePlayerVoice, stopAllVoiceOvers } = useVoicePlayerAadhaarConsent1();
    const [showAadharConsentPlayerVoicePopup, setShowAadharConsentPlayerVoicePopup] = useState(false);
    
    

    useLayoutEffect(() => {
        if (KeepLoggedIn()) {
            let CurrentApplicationDetails: any = localStorage.getItem("GetApplicationDetails");
            const loginDetails: any = JSON.parse(localStorage.getItem("LoginDetails"));
            setLoginDetails(loginDetails);
            let temp = JSON.parse(localStorage.getItem("docDetailsofPopUp"));
            CurrentApplicationDetails = JSON.parse(CurrentApplicationDetails);
            setGetstartedDetails({ ...GetstartedDetails, applicationId: CurrentApplicationDetails.applicationId });
            let CurrentParty: any = localStorage.getItem("CurrentPartyDetails");
            setExistingAdhar(JSON.parse(localStorage.getItem("ExistingAadhar")));
            setExistingPAN(JSON.parse(localStorage.getItem("ExistingPAN")));

            CurrentParty = JSON.parse(CurrentParty);
            if ( CurrentApplicationDetails?.documentNature.TRAN_MAJ_CODE == '02' && CurrentApplicationDetails?.documentNature.TRAN_MIN_CODE == '06') {
                setflag(false);
            }
            if(CurrentApplicationDetails?.documentNature.TRAN_MAJ_CODE == '04' && CurrentApplicationDetails?.documentNature.TRAN_MIN_CODE == '03'){
                setflag(false);
            }
            if ( CurrentApplicationDetails?.documentNature.TRAN_MAJ_CODE == '01' && CurrentApplicationDetails?.documentNature.TRAN_MIN_CODE == '20') {
                setflag(false);
            }
            if (loginDetails.loginName == "Titdco") {
                setflag(false);
                setTidco(true);
            }

            if((CurrentParty.operation == "View" || CurrentParty.operation == "Edit") && CurrentApplicationDetails?.documentNature.TRAN_MAJ_CODE == '05' && CurrentParty?.representSubType =="RR"){
                 [CurrentParty.shareRelesor,CurrentParty.totalShare]= CurrentParty.share.split("/")
            }
            if (CurrentParty.operation != "View" && CurrentParty.operation == "Edit" || loginDetails?.loginEmail === "APIIC" && CurrentParty?.representSubType ==="Executant" || loginDetails?.loginEmail === "APIIC" && CurrentParty?.representSubType === "Claimant" || (loginDetails?.loginEmail === "APIIC" && CurrentParty.operation == "View")) {
                console.log("skip")
            }
            else{
                ShowAadharPopup();
            }
            if (CurrentParty.operation == "AddRep") {
                setParentPartyDetails(CurrentParty);
                setPartyDetails({
                    name: "",
                    relationType: "",
                    relationName: "",
                    age: "",
                    panNoOrForm60or61: "",
                    tan: "",
                    aadhaar: "",
                    representType: "Representative",
                    representSubType: CurrentParty.representSubType,
                    email: "",
                    phone: "",
                    address: "",
                    applicationId: CurrentApplicationDetails.applicationId,
                    operation: "AddRep",
                    partyId: "",
                    partyType: "Public",
                    dateOfBrith: "",
                    passportNumber: "",
                    fileNo: '',
                    doi: '',
                    passportExpireDate:'',
                    placeOfIssue:'',
                    partyFile:CurrentParty.partyFile || ''
                },)
                let det = JSON.parse(localStorage.getItem('GetApplicationDetails')).documentNature;
              
                if( loginDetails?.loginEmail === "APIIC" && CurrentParty?.representSubType ==="Executant" || loginDetails?.loginEmail === "APIIC" && CurrentParty?.representSubType === "Claimant"){

                }
                else{
                if (!(det.TRAN_MAJ_CODE == "02" && det.TRAN_MIN_CODE == "06")) {
                    ShowAadharPopup(CurrentParty.operation);
                }
                if (!(det.TRAN_MAJ_CODE == "01" && det.TRAN_MIN_CODE == "20")) {
                    ShowAadharPopup(CurrentParty.operation);
                }
            }
            } else {
                // let objectType: String;
                // if (CurrentParty?.tan !== "") {
                //     objectType = "tan"
                //     setDropdownFLag(false);
                // }else if(CurrentParty?.tin !== ""){
                //     objectType = "tin"
                //     setDropdownFLag(false);
                // }
                // else if (CurrentParty?.panNoOrForm60or61 !== "") {
                //     objectType = "pan"
                //     setDropdownFLag(false);
                // }
                // else if (CurrentParty?.panNoOrForm60or61 == "" && CurrentParty.operation !== "Add") {
                //     objectType = "form60"
                //     setDropdownFLag(true);
                // }
                // else {
                //     objectType = ""
                //     setDropdownFLag(false);
                // }

                if (CurrentParty.currentAddress == CurrentParty.address) {
                    setCheckedCurrentAddress(true);
                }
                else {
                    setCheckedCurrentAddress(false);
                }
                setPartyDetails({ ...CurrentParty, objectType: CurrentParty?.isSelectedPanOrForm60});
            }

        } else { ShowMessagePopup(false, "Invalid Access", "/") }
    }, []);

    const CalculateAge = (birthDate: any) => {
        let dataArray = birthDate.split('-');
        const date1: any = new Date(`${dataArray[2]}-${dataArray[1]}-${dataArray[0]}`);
        const current: any = new Date();
        const date = `${current.getFullYear()}-${current.getMonth() + 1}-${current.getDate()}`;
        const date2: any = new Date(date);
        const diffTime = Math.abs(date2 - date1);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        let finalValue = (diffDays / 365).toFixed();
        return finalValue;
}
    useEffect(() => {
        if(isPanOrFormReq == false){
            setIsPanOrFormReq(isPanOrForm60Mandatory())
        } 
    },[PartyDetails,isPanOrFormReq]);

    useEffect(() => {
        let CurrentApplicationDetails: any = localStorage.getItem("GetApplicationDetails");
        CurrentApplicationDetails = JSON.parse(CurrentApplicationDetails);
        setGetstartedDetails(CurrentApplicationDetails);
        const sezRepresentative = JSON.parse(localStorage.getItem("SEZRepresentative"))
        if(sezRepresentative){
            setPartyDetails(
                {
                    ...PartyDetails, 
                    name: sezRepresentative?.SEZ_NAME,
                    relationType: sezRepresentative?.RELATION_TYPE,
                    relationName: sezRepresentative?.RELATION_NAME,
                    age: sezRepresentative?.AGE,
                    objectType: "pan",
                    applicationId: CurrentApplicationDetails.applicationId,
                    panNoOrForm60or61: sezRepresentative?.PAN,
                    email: sezRepresentative?.EMAIL,
                    phone: sezRepresentative?.PHONE,
                    aadhaar: sezRepresentative?.AADHAR,
                    address: sezRepresentative?.ADDRESS,
                    currentAddress: sezRepresentative?.CURRENT_ADDRESS,
                    sezParty: true,
                    representType: PartyDetails.PartyType
                }
            )
        }
        if (AadharOption.response && AadharOption.enable == false) {
            // if()
            if (AadharOption.data && AadharOption.data.KYCResponse && (AadharOption.data.wa =="Aadhar With OTP" || PartyDetails.operation == "AddRep")) {
                let latestData = {
                    ...PartyDetails,
                    name: AadharOption.data.KYCResponse.name ? AadharOption.data.KYCResponse.name : "",
                    relationType: AadharOption.data.KYCResponse.co ? AadharOption.data.KYCResponse.co.substring(0, 3) : "",
                    relationName: AadharOption.data.KYCResponse.co ? AadharOption.data.KYCResponse.co.substring(4) : "",
                    age: AadharOption.data.KYCResponse.dob ? CalculateAge(AadharOption.data.KYCResponse.dob) : "",
                    aadhaar:  AadharOption.data.aadharNumber,
                    address: (AadharOption.data.KYCResponse.house ? AadharOption.data.KYCResponse.house + ', \n' : '') +(AadharOption.data.KYCResponse.lm ? AadharOption.data.KYCResponse.lm + ', \n' : '') + (AadharOption.data.KYCResponse.loc ? AadharOption.data.KYCResponse.loc + ', \n' : '') + (AadharOption.data.KYCResponse.dist ? AadharOption.data.KYCResponse.dist + ', \n' : '') + (AadharOption.data.KYCResponse.vtc ? AadharOption.data.KYCResponse.vtc : '') + (AadharOption.data.KYCResponse.pc ? '-' + AadharOption.data.KYCResponse.pc : ''),
                    currentAddress: (AadharOption.data.KYCResponse.house ? AadharOption.data.KYCResponse.house + ', \n' : '') +(AadharOption.data.KYCResponse.lm ? AadharOption.data.KYCResponse.lm + ', \n' : '') + (AadharOption.data.KYCResponse.loc ? AadharOption.data.KYCResponse.loc + ', \n' : '') + (AadharOption.data.KYCResponse.dist ? AadharOption.data.KYCResponse.dist + ', \n' : '') + (AadharOption.data.KYCResponse.vtc ? AadharOption.data.KYCResponse.vtc : '') + (AadharOption.data.KYCResponse.pc ? '-' + AadharOption.data.KYCResponse.pc : ''),
                    partyType: AadharOption.data.type,
                    wa:AadharOption.data.wa,
                    objectType: AadharOption.data.type === 'Public' ? 'pan' : (AadharOption.data.type == "NRI" || AadharOption.data.type == "OCI") ? "pan" : '',
                    aadharDetails:AadharOption.data?.KYCResponse?AadharOption.data.KYCResponse:{},

                };
                if(Object.keys(latestData.aadharDetails).length>0){
                    setIsAadharValidated(true)
                }
                setAadharValidation({...aadharValidation,aadharDetails:latestData.aadharDetails});
                localStorage.setItem("CurrentPartyDetails", JSON.stringify(latestData));
                setShowModal(true)
                setPartyDetails(latestData);
            }
            else {
                let latestData:any;
				if(AadharOption.data.wa ==="Aadhar Without OTP"){
					latestData = { ...PartyDetails, partyType: AadharOption.data.type,wa:AadharOption.data.wa, objectType: AadharOption.data.type === 'Public'  ? 'pan' : (AadharOption.data.type == "NRI" || AadharOption.data.type == "OCI") ? "pan" : '' }
				}else{
                    latestData = { ...PartyDetails, partyType: AadharOption.data.type, objectType: AadharOption.data.type != "Public" ? (AadharOption.data.type == "NRI" || AadharOption.data.type == "OCI") ? "pan" : "tan" : "" }
                }
                localStorage.setItem("CurrentPartyDetails", JSON.stringify(latestData));
                setPartyDetails(latestData);
            }
            if(GetstartedDetails.documentNature.TRAN_MAJ_CODE == "05"){
                if(GetstartedDetails.documentNature.TRAN_MIN_CODE == "05" ){
                    setShareRls(false);
                }else if( GetstartedDetails.documentNature.TRAN_MIN_CODE == "09"){
                    setShareRls(false);
                }else{
                    setShareRls(true);
                }
            }
            else{
                setShareRls(false);
            }
            dispatch(AadharPopupAction({ enable: false, response: false, status: false, data: {}, op: '' }));
        }
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
        const allowPayments = checkIsMutableDocument(GetstartedDetails?.documentNature);
        setAllowMutationPayment(allowPayments)
        getApiicEmplData()
        if (loginDeatils?.loginName === "APIIC" && PartyDetails?.PartyType == 'EXECUTANT' && AadharOption.enable == false) {
            getApiicGovtdata()
           setCheckedCurrentAddress(CheckedCurrentAddress);
        }

    }, [AadharOption]);

    const getApiicGovtdata = async () => {
        let result = await UsegetapiicGovtInstitutions() 
        let updatedDetails = {
            ...PartyDetails,
            name: result.data[0].name,
            relationType: "",
            email: result.data[0].email || "",
            phone: result.data[0].mobile || "",
            address: result.data[0].address || "",
            currentAddress: result.data[0].address || "",
            partyType:"Govt Institutions"
        };


        if (result.data[0].pan) {
            updatedDetails.panNoOrForm60or61 = result.data[0].pan;
            updatedDetails.objectType = "pan";
            updatedDetails.disablePan = true;
            updatedDetails.tan = ""
        }
        if (result.data[0].tan) {
            updatedDetails.tan = result.data[0].tan;
            updatedDetails.objectType = "tan";
            updatedDetails.disableTan = true;
        }
        if (result.data[0].tin) {
            updatedDetails.tin = result.data[0].tin;
            updatedDetails.objectType = "tin";
            updatedDetails.disableTin = true;
        }
        setPartyDetails(updatedDetails);
    }

    const getApiicEmplData = async () => {
        let result = await UseGetAppicEmplData();
        setApiicEmplData(result.data);
    }
    useEffect(() => {
        if (KeepLoggedIn()) {
            let data: any = localStorage.getItem("GetApplicationDetails");
            if (data == "" || data == undefined) {
                ShowMessagePopup(false, "Invalid Access", "/");
            }
            else {
                setMultiNames([])
                setSaleExecute(false)
                setEnableDetails(false)
                setOldSaleCumGPA({ district: '', sro:'', book_no:'', doct_no:'', reg_year:''})
                if (DistrictList.length == 0) {
                    GetDistrictList();
                }
            }
        }
        if(apiicPersondata){
            setPartyDetails({...PartyDetails,panNoOrForm60or61 :apiicPersondata})
          }
        // setPartyDetails({...PartyDetails, isRepChecked: false})
    }, [])

    useEffect(() => {
        if (!showAadharConsentConfirmPopup && !showAadharConsentPlayerVoicePopup) {
            resetVoiceState();
            stopAllVoiceOvers();
        };
    }, [showAadharConsentConfirmPopup, showAadharConsentPlayerVoicePopup]);

    const validatePAN = (pan) => {
        var regex = /^([a-zA-Z]{5})([0-9]{4})([a-zA-Z]{1})$/;
        if (!regex.test(pan)) {
            return false;
        }
        else {
            return true;
        }
    }
    const validatePassPort = (input) => {
        var regex = /^[a-zA-Z][0-9]{7}$/;
        return regex.test(input);
    };
    const validateTAN = (tan) => {
         var regex = /^([a-zA-Z]{4})([0-9]{5})([a-zA-Z]{1})$/;    // Expected TAN
        return regex.test(tan);
    }
    const validateTIN = (tin) => {
         const regex = /^[0-9]{11}$/
        return regex.test(tin);
    };


    const ValidateEmail = (value: any) => {
        if (value != "") {
            var regex = /\S+@\S+\.\S+/;
            if (!regex.test(value)) {
                ShowMessagePopup(false, "Enter Valid Email", "")
                return false;
            }
            else {
                return true;
            }
        }
        return false;
    }

    const ValidMobile = (value: any) => {
        if (value != "") {
            const allSameNum = /^(\d)\1*$/; 
            var mobilePattern = /^[6789]\d{9}$/;
            if (!mobilePattern.test(value)) {
                ShowMessagePopup(false, "Enter Valid Mobile Number", "");
                return false;
            }else if(allSameNum.test(value)){
                ShowMessagePopup(false, "Enter Valid Mobile Number", "");
                return false;
            }
            else {
                return true;
            }
        }
        return false;
    }
  const ValidationPancheck = async(data)=>{
    setaadharStatus(false);

    
    const result =  await CallingAxios(useNriPanValidation(data));
       setPassportcheck(result)
        
    if(result.data && result.data !== ''&& result.data.isAadhaarLinked === 'Y' && result.data.name === "Y" && result.data.dob === "Y"){
            setaadharStatus(true);
        ShowMessagePopup(true,"Aadhaar Number is linked with PAN, please Enter Aadhar Details","");
        }
    else if(result.data.pan_status==='E'&& result.data.name === "Y" && result.data.dob === "Y"){
        ShowMessagePopup(true,result.message +  ',Aadhaar Number is not linked with PAN',"");
        }
    else if(result.data.pan_status==='E'&& (result.data.name === "N" ||  result.data.dob === "N") ){
            ShowMessagePopup(true,result.message + (result.data.name === "N"?'  Name Not Matched With PAN ' : ' DOB is Not Macthed with PAN'),"");
            }
    else{
        ShowMessagePopup(false,result.message,"");
        }
    }
  const validatePassportCheck = async(data)=>{
    const result =  await CallingAxios(usegetPassportVerfication(data)); 
   if(result.data && result.data !== ''&& result.data.passportNoMatch === true && result.data.nameMatch === true){
            setPassportstatus(false);
            setpassportname(true);
        ShowMessagePopup(true,"Passport Validation is Successfully","");
    }else if(!result ){
        ShowMessagePopup(false,"Error: No response from the server.","");
    }else{
        ShowMessagePopup(false,result.message,"");
        }
    }
    const [selectedName, setSelectedName] = useState("");
    const [apiicPersondata ,setApiicPersondata] = useState('')
    const getAppicaPersonData = async(value)=>{
        let data = {
            emplname : value

        }
        let result = await UseGetAppicEmplPersonData(data);
         if(result && result.status == true){ 
        // setPartyDetails()
        setApiicPersondata(result.data.Repregent_Deatils.PAN_Number)
        setPartyDetails({...PartyDetails,
            name: result.data.Repregent_Deatils.Emple_Name,
            relationType: "",
            relationName: result.data.Repregent_Deatils.Father_Name,
            age: result.data.Repregent_Deatils.Age,
            panNoOrForm60or61: result.data.Repregent_Deatils.PAN_Number,
            // tan: "",
            aadhaar: String(result.data.Repregent_Deatils.Aadhar_Number),
            aadhar: String(result.data.Repregent_Deatils.Aadhar_Number),
            // representType: "Representative",
            // representSubType: CurrentParty.representSubType,
            email: result.data.Repregent_Deatils.Email,
            phone: result.data.Repregent_Deatils.Empl_MobileNumber,
            address: result.data.Repregent_Deatils.Address,
            objectType: "pan",
            // applicationId: CurrentApplicationDetails.applicationId,
            // operation: "AddRep",
            // partyId: "",
            // partyType: "Public",
            // dateOfBrith: "",
            // passportNumber: "",
            // fileNo: '',
            // doi: '',
            // passportExpireDate:'',
            // placeOfIssue:'',
            // partyFile:CurrentParty.partyFile || ''
        },)
        setApiicAadharvalidated(true)
        // setApiic(true)
         }
        
    }
    const MAX_ADDRESS_LENGTH = 150;
    const onChange = (e: any) => {
        const { name, value } = e.target;
        if (name === "EmpleName") {
            setSelectedName(value);
            getAppicaPersonData(value);
            setAadharOtpSent(false);
            setCheckedCurrentAddress(false);
            setIsAadharValidated(false);
            setPartyDetails({...PartyDetails,aadharOTP:''})
            setAadharValidation({...aadharValidation,OTP:''})
          }

        if (name === 'phone' && value.length > 10) {
            return;
        }
        if (name === 'mobileOTP' && value.length > 6) {
            return;
        }
        const newDetails = { ...PartyDetails, [name]: value };
        setPartyDetails(newDetails);
        if (name === 'phone') {
            if (mobileOtpSent && value !== sentOtpForMobile) {
                setMobileOtpSent(false);
                setSentOtpForMobile('');  
                setPartyDetails({ ...newDetails, mobileOTP: '' });
            }
        }
        e.preventDefault();
        let tempParty = { ...PartyDetails }
        let addName = e.target.name;
        let addValue = e.target.value == (e.target.value == "SELECT") ? "" : e.target.value;
        if (addName == "name" || addName == "relationName" ) {
            addValue = addValue.replace(/[^\w\s]/gi, "");
            addValue = addValue.replace(/[0-9]/gi, "");
        }
        else if(addName === 'dateOfBrith'){
            const birthDate = new Date(addValue);
            const today = new Date();
            let agecalc =today.getFullYear() - birthDate.getFullYear()
            agecalc = PartyDetails.partyType == 'Deceased' ? 0 : agecalc
            tempParty = { ...tempParty, age:agecalc , }
        }
        else if (addName == "objectType") {
            addValue = addValue.replace(/[^\w\s]/gi, "");
            if (addValue == "form60") {
                tempParty = { ...tempParty, panNoOrForm60or61: "", tan: "" }
                //  ShowMessagePopup(false,"Aadhaar No. is Mandatory for eSign","")
            } else if (addValue == "pan") {
                tempParty = { ...tempParty, tan: "" }
                setDisablePAN(false)
                setDropdownFLag(false);
            } else if (addValue == "tan") {
                tempParty = { ...tempParty, panNoOrForm60or61: "", tan:"" }
                setDropdownFLag(false);
            }else if(addValue == "tin"){
                tempParty = { ...tempParty, panNoOrForm60or61: "", tin:"" }
                setDropdownFLag(false);
            }
            else {
                setDropdownFLag(true);
            }
        }
        else if (addName == "phone") {
            let errorLabel = "";
            if(loginDeatils?.loginName !== "APIIC" && PartyDetails?.PartyType !== 'EXECUTANT'){
            if (addValue.length < 10) {
                errorLabel = "Enter 10 Digit Valid Mobile Number";
            }
            }
            if (addValue.length > 10) {
                addValue = addValue.substring(0, 10);
            }
        }
        else if (addName == "tan" || addName == "panNoOrForm60or61") {
            let errorLabel = "";
            if (addValue.length < 10) {
                errorLabel = "Enter 10 Digit Valid TAN Number";
            }
            if (addValue.length > 10) {
                addValue = addValue.substring(0, 10);
            }
        }
        else if (addName == "age") {
            if (addValue.length > 2) {
                addValue = addValue.substring(0, 2);
            }

        }
        else if (addName == "checked") {
            if (!CheckedCurrentAddress) {
                setPartyDetails({ ...PartyDetails, currentAddress: PartyDetails.address })
            }
            setCheckedCurrentAddress(CheckedCurrentAddress);
        }
        else if (addName == "panNoOrForm60or61") {
            addValue = addValue.replace(/[^\w\s]/gi, "");
            setPartyDetails({ ...tempParty, [addName]: addValue.toUpperCase() })
        }
        else if (addName == "address") {
	    addValue = addValue.replace(/[^a-zA-Z0-9,.\-\/ ]/g, "");
            if (CheckedCurrentAddress) {
                tempParty = { ...tempParty, currentAddress: addValue }
            }
	   
        }  else if (addName == "currentAddress") {
	    addValue = addValue.replace(/[^a-zA-Z0-9,.\-\/ ]/g, "");
        }
		else if(addName =="aadhaar"){
            if (addValue == ParentPartyDetails?.aadhaar) {
                setPartyDetails({ ...tempParty, aadhaar: "" });
                ShowMessagePopup(false, "Same Aadhaar not allowed for party and their representative", "");
                return false;
            }
            if(multiNames.length == 0){
                if((tempParty.wa ==="Aadhar Without OTP" || PartyDetails?.partyType == "NRI") && String(addValue).length == 12){
                    const loginDetails: any = JSON.parse(localStorage.getItem("LoginDetails"));
                    if(loginDetails.loginName == "Titdco"){
                        let value = adharValidate(addValue);
                    }
                    let count :any ;
                    if(existingAdhar && existingAdhar.length >0){
                        count = existingAdhar.find(x => x == addValue);
                    }
                    if(count != undefined){
                        setPopup(true)
                    }else{
                        setPopup(false)
                    }
                }
            }
            tempParty = { ...tempParty, aadhar: addValue }
            
            if (value?.length === 12) {                
                setShowAadharConsentConfirmPopup(true);
                setShowSendOtpButton(false);
                setAadharConsentCheckboxChecked(false);
            }
        }
        if(PartyDetails?.partyType == "NRI" && addName == "panNoOrForm60or61"){
          if( PartyDetails.dateOfBrith !=='' && PartyDetails.name !== ''){
              if(PartyDetails?.partyType == "NRI" && addValue.length >= 10 ){
                    const date = PartyDetails.dateOfBrith;
                    if (date && date.includes("-")) {
                        const [year, month, day] = date.split("-");
                        const formattedDate = `${day}/${month}/${year}`;
                        let data = {
                    "pan":encryptId(addValue),
                            "name": PartyDetails.name.toUpperCase(),
                            "fathername": PartyDetails.relationType + " " + PartyDetails.relationName,
                            "dob": formattedDate
                        }
                        ValidationPancheck(data)
                    }
                }

            }
            else{
                ShowMessagePopup(false, "Please fill mandatory fields first", "");
            }

        }
        if (addName =="fileNo") {
            if(addValue.length > 15){
                return
            }
        }
        if ((PartyDetails?.partyType == "NRI") && addName == 'passportNumber') {
            if (PartyDetails.dateOfBrith !== '' && PartyDetails.name !== '' && PartyDetails.fileNo !== '' && PartyDetails.passportNumber !== '') {
                if (addValue.length > 8) {
                    return
                }
                if ((PartyDetails?.partyType == "NRI") && addValue.length === 8) {
                    const date = PartyDetails.dateOfBrith;
                    const date2 = PartyDetails.doi;
            let formattedDate :any;
            let formattedDate2 :any;
                    if (date && date.includes("-")) {
                        const [year, month, day] = date.split("-");
                        formattedDate = `${day}/${month}/${year}`;
                    }
                    if (date2 && date2.includes("-")) {

                        const [year, month, day] = date2.split("-");
                        formattedDate2 = `${day}/${month}/${year}`;
                    }

           let  data ={
                        "name": PartyDetails.name.toUpperCase(),
            "passportNo":encryptId(addValue) ,
            "fileNo":encryptId(PartyDetails.fileNo),
            "dob":formattedDate,
            "doi":formattedDate2
                    }
                    validatePassportCheck(data)
                }
        }else{
                ShowMessagePopup(false, "Please fill mandatory fields first", "");
            }
        }
        if(addName =='aadharOTP'){ 
            if (addValue.length >= 6) {
                addValue = addValue.substring(0,6);
            }
            setAadharValidation({...aadharValidation,OTP:addValue})
        }
        else if (addName == 'partyFile') {
            const file = e.target.files?.[0];

            if (file) {

                const allowedTypes = ['image/jpeg'];
                if (!allowedTypes.includes(file.type)) {
                    ShowMessagePopup(false, "Only JPEG files are allowed. Please try again with JPEG file.", "");
                    e.target.value = "";
                    return;
                }
                if (file.size > 512000) {
                    ShowMessagePopup(false, "File size exceeds 500KB. Please upload a smaller file.", "");
                    e.target.value = "";
                    return;
                }
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64String = reader.result as string;
                    let baseInfo = base64String.replace("data:image/jpeg;base64,", "");;
                    setPartyDetails({ ...tempParty, [addName]: baseInfo })

                };
                reader.readAsDataURL(file);
            }
        }
        else if (addName === 'deceasedPartyFile') {
            const file = e.target.files?.[0];
            if (file) {
                if (file.size > 1024000) {
                    ShowMessagePopup(false, "File size exceeds 1MB. Please upload a smaller file.", "");
                    e.target.value = "";
                    return;
                }
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64String = reader.result as string;
                    let baseInfo = base64String;
                    if (file.type === "application/pdf") {
                        baseInfo = base64String.replace("data:application/pdf;base64,", "");
                    } else if (file.type === "image/jpeg") {
                        baseInfo = base64String.replace("data:image/jpeg;base64,", "");
                    } else if (file.type === "image/png") {
                        baseInfo = base64String.replace("data:image/png;base64,", "");
                    }
                    setPartyDetails({
                        ...tempParty,
                        [addName]: {
                            name: file.name,
                            type: file.type,
                            base64: baseInfo
                        }
                    });
                };

                reader.readAsDataURL(file);
            }
        }

        if (name === "doi") {
            if (!value) {
                setPartyDetails({ ...tempParty, doi: "", passportExpireDate: "" })
            } else {
                setPartyDetails({ ...tempParty, doi: value, passportExpireDate: "" })
            }
        }
        else if (name === "passportExpireDate") {
            const doi = PartyDetails.doi;
            if (doi && moment(value).isSameOrBefore(moment(doi))) {
                ShowMessagePopup(false,"Passport Expiry Date should be after Date of Issue","");
                return;
            }
            setPartyDetails({ ...tempParty, [addName]: addValue })
        }
        else {
            setPartyDetails({ ...tempParty, [addName]: addValue })
        }
        setPartyDetails({ ...tempParty, [addName]: addValue })

    }
    const adharValidate = async(partyAdhar:any)=>{
        // partyAdhar = await encryptWithAES(partyAdhar);
        let encryptedData = EncryptAdrwithPkcs(partyAdhar);
        encryptedData = Buffer.from(encryptedData).toString('base64');
        partyAdhar = encryptedData;
        let data:any ={aadhar:partyAdhar}
        let result :any = await CallingAxios(UseAdharValidate(data));
        if(result.status){
            let data = result.data[0]
            for (let value of Object.values(data)) {
                if(value == 0) {
                    ShowMessagePopup(false, "Aadhar Number Is Invalid", "");
                    let temmParty={...PartyDetails,aadhaar:""}
                    setPartyDetails(temmParty);
                }

            }
        }
    }

    const redirectToPage = (location: string) => { router.push({ pathname: location, }) }
    const onSubmit = async (e: any) => {
        e.preventDefault();
        if (PartyDetails?.partyType === "Deceased") {
            if (!PartyDetails.deceasedPartyFile || !PartyDetails.deceasedPartyFile.base64) {
                ShowMessagePopup(false, 'Please Upload Death Certificate', '');
                return;
            }
        }
        const rawAddress = PartyDetails?.address && PartyDetails?.currentAddress || "";
        const addressToCount = rawAddress.trim();
        if (addressToCount.length > MAX_ADDRESS_LENGTH) {
            ShowMessagePopup(false, `Address field can’t be more than ${MAX_ADDRESS_LENGTH} characters. characters. Current length: ${addressToCount.length}.`, "");
            return;
        }
        const loginDetails: any = JSON.parse(localStorage.getItem("LoginDetails"));
        if(loginDetails.loginName === "APIIC" && PartyDetails?.PartyType === "CLAIMANT" && PartyDetails.objectType !== 'form60' && PartyDetails.panNoOrForm60or61 === "" && PartyDetails.partyType === "Public"){
            return ShowMessagePopup(false, "Please Enter PAN Number filed.", ""); 
        }
        if(loginDetails.loginName === "APIIC" && PartyDetails?.representSubType == "Claimant" && PartyDetails?.representType == "Representative"&& PartyDetails.objectType !== 'form60' && PartyDetails.panNoOrForm60or61 === ""){
            return ShowMessagePopup(false, "Please Enter PAN Number filed.", ""); 
        }
        if(loginDetails.loginName === "APIIC"  && PartyDetails.objectType !== 'form60' && PartyDetails.panNoOrForm60or61 === "" && PartyDetails?.operation == 'Edit'  && PartyDetails?.representType == "Claimant"  ){
            return ShowMessagePopup(false, "Please Enter PAN Number filed.", ""); 
        }
        if(loginDetails.loginName === "APIIC" && PartyDetails?.representSubType == "Executant" && PartyDetails?.representType == "Representative"&& !isAadharValidated){
            return ShowMessagePopup(false, "Please Validate your aadhaar with OTP.", ""); 
        }

        if (!PartyDetails?.isRepChecked) {
            if (multiNames.length <= 0 && !(PartyDetails?.PartyType == "CLAIMANT" && GetstartedDetails?.documentNature?.TRAN_MAJ_CODE == '05' && GetstartedDetails?.documentNature?.TRAN_MIN_CODE == '05') && loginDetails.loginName != "Titdco" && (loginDetails.loginName !== "APIIC" && PartyDetails?.PartyType !== "CLAIMANT") && !isAadharValidated && PartyDetails.operation !== "Edit" && PartyDetails?.partyType === "Public") {
                return ShowMessagePopup(false, "Please Validate your aadhaar with OTP.", "");
            }
            else if (multiNames.length <= 0 && loginDetails.loginName != "Titdco" && !(PartyDetails?.PartyType == "CLAIMANT" && GetstartedDetails?.documentNature?.TRAN_MAJ_CODE == '05' && GetstartedDetails?.documentNature?.TRAN_MIN_CODE == '05') && !isAadharValidated && PartyDetails.operation !== "Edit" && ((PartyDetails?.partyType == "NRI" || PartyDetails?.partyType == "OCI") && aadharStatus)) {
                return ShowMessagePopup(false, "Please Validate your aadhaar with OTP.", "");
            }
        }
        if (!PartyDetails.sezParty && (PartyDetails?.PartyType === "CLAIMANT" || PartyDetails?.representSubType === "Claimant")  && !(PartyDetails?.PartyType == "CLAIMANT" && GetstartedDetails?.documentNature?.TRAN_MAJ_CODE == '05' && GetstartedDetails?.documentNature?.TRAN_MIN_CODE == '05') &&!isMobileOtpVerified &&PartyDetails.operation !== "Edit" && loginDeatils.loginEmail !== 'APIIC') {
            return ShowMessagePopup(false, "Please verify your mobile number with OTP before proceeding.", "");
        }

        if (PartyDetails?.partyType === "Govt Institutions") {
            if (PartyDetails.panNoOrForm60or61 !== "" && !validatePAN(PartyDetails.panNoOrForm60or61)) {
                ShowMessagePopup(false, "Enter Valid PAN Number", "");
                setPartyDetails({ ...PartyDetails, panNoOrForm60or61: "" });
                return false;
            }
        } else if(!(PartyDetails?.partyType === "NRI" || PartyDetails?.partyType === "OCI" || PartyDetails.sezParty)){
            if (PartyDetails.panNoOrForm60or61 != "" && PartyDetails?.partyType !== "Govt Institutions") {
                if (validatePAN(PartyDetails.panNoOrForm60or61)) {
                    if (!disablePAN) {
                        checkPanValidation();
                        return false;
                    }
                } else {
                    ShowMessagePopup(false, "Enter Valid PAN Number", "");
                    setPartyDetails({ ...PartyDetails, panNoOrForm60or61: "" });
                    return false;
                }
            }
        }
    
         if(PartyDetails.tan && PartyDetails.tan!="" && PartyDetails.tan.trim().length>0){
            if(!validateTAN(PartyDetails.tan)){
                ShowMessagePopup(false, "Please Enter valid TAN number.", "");
                return;
            }
        }
        if(PartyDetails.tin && PartyDetails.tin!="" && PartyDetails.tin.trim().length>0){
             if(!validateTIN(PartyDetails.tin)){
                ShowMessagePopup(false, "Please Enter valid TIN number.", "");
                return;
            }
        }    

        var regex = /^\d+$/;
        // if ((PartyDetails.objectType == "pan" || PartyDetails.objectType == "form60") && GetstartedDetails?.amount > 1000000 &&(!PartyDetails.panNoOrForm60or61 || PartyDetails.panNoOrForm60or61.trim() === "")) {
        //     ShowMessagePopup(false, "PAN Number is mandatory for transactions above ₹10,00,000", "");
        //     return;
        // }
        if(PartyDetails.objectType == " "){
            ShowMessagePopup(false, "Please Enter PAN or Form60/61", "");
            return;
        }

        if (parseInt(PartyDetails.age) < 18 && PartyDetails.representType == "Representative") {
            return ShowMessagePopup(false, "Age Shuold Be Allowed For 18 Years for representatives", "")
        }

        let isValidData = isPanOrForm60Mandatory();
        if (isValidData) {

            if (PartyDetails.partyType === "Public") {
                if (PartyDetails?.objectType == 'pan' && (PartyDetails.panNoOrForm60or61 == null ||
                    PartyDetails.panNoOrForm60or61 == undefined || PartyDetails.panNoOrForm60or61 === "" ||
                    PartyDetails.panNoOrForm60or61.trim().length == 0)) {
                    return ShowMessagePopup(false, "Enter valid PAN or Form60/61 number..", "");
                }
            } else {
                if (PartyDetails?.partyType !== "OCI" && PartyDetails.partyType !== "Deceased" && (PartyDetails.panNoOrForm60or61 == undefined || PartyDetails.panNoOrForm60or61 == null || PartyDetails.panNoOrForm60or61 == ""
                    || PartyDetails.panNoOrForm60or61.length == 0) && (PartyDetails.tan == undefined || PartyDetails.tan == null || PartyDetails.tan == ""
                        || PartyDetails.tan.trim().length == 0) && (PartyDetails.tin == undefined || PartyDetails.tin == null || PartyDetails.tin == ""
                            || PartyDetails.tin.trim().length == 0)) {
                    return ShowMessagePopup(false, "Enter valid PAN/TIN/TAN number..", "")
                }
            }
        }
            
        if (PartyDetails.aadhaar && String(PartyDetails.aadhaar).length < 12){
            return ShowMessagePopup(false, "Enter valid Aadhar number", "")
        }
        if(GetstartedDetails?.documentNature?.TRAN_MAJ_CODE =="05" && +PartyDetails?.totalShare && (PartyDetails?.shareRelesor >= PartyDetails.totalShare) ){
            return ShowMessagePopup(false, "Share value is not greater than or equal to totalShare", "")
        }
        if(+PartyDetails.share && !regex.test(PartyDetails.share) ){
            return ShowMessagePopup(false,"Party number field should be number"," ")
        }
        if(+PartyDetails?.share && GetstartedDetails.claimant && GetstartedDetails.claimant.length > 0  ){
            let validShareData = await ValidateShareOnPartition(GetstartedDetails.claimant,PartyDetails.share);
               if(validShareData != ""){
                    return ShowMessagePopup(false,validShareData,"")  
            }
        }
        PartyDetails.phone = PartyDetails.partyType === 'Deceased' || PartyDetails.partyCode === 'WT' && loginDeatils.loginMode === 'VSWS' ?'':PartyDetails.phone
        let party = { ...PartyDetails, applicationId: GetstartedDetails.applicationId };

        party.applicationId = GetstartedDetails.applicationId;
        if (party.representType == "Representative") {
            party = { ...party, representType: "REPRESENTATIVE", parentPartyId: ParentPartyDetails._id, representSubType: PartyDetails.PartyType, documentId: GetstartedDetails.applicationId }
        } else {
            party.representType = PartyDetails.PartyType;
        }

        let validate: any = await validationCheck(party);
        if (validate && validate.includes(true)) {
            if (party.representType == "REPRESENTATIVE") {
                if (PartyDetails.partyType === "Public" && PartyDetails.representSubType == "Executant" && !party.name.includes("(GOVT OF AP)") && initialGetstartedDetails?.documentNature.TRAN_MAJ_CODE == '08' && initialGetstartedDetails?.documentNature.TRAN_MIN_CODE == '06') {
                    party.name = `${party.name} (GOVT OF AP)`;
                }
               
                if(loginDeatils?.loginEmail === 'APIIC'){
                    setIsMobileOtpVerified(false);
                }
                if(loginDeatils?.loginEmail === 'APIIC' && PartyDetails?.representSubType === 'Executant' && (PartyDetails?.panNoOrForm60or61 === '' || PartyDetails?.panNoOrForm60or61 === undefined)){
                    ShowMessagePopup(false, "Enter all required fields ", '')
                    return
                }
                await CallSaveRepresntativeDetails(party);
            } else {
                if(party.objectType == "pan" && (PartyDetails.operation == "Edit" || PartyDetails.operation == "View" || PartyDetails.operation == "Add" )){
                    party={...party,tin:"",tan:""}
                }else if(party.objectType == "tin" && (PartyDetails.operation == "Edit"|| PartyDetails.operation == "Add" ) && PartyDetails.partyType != "Public"){
                    party={...party,panNoOrForm60or61:"",tan:""}
                }else if(party.objectType == "panNoOrForm60or61" && (PartyDetails.operation == "Edit"||PartyDetails.operation == "Add") && PartyDetails.partyType != "Public"){
                    party={...party,tin:"",tan:""}
                }
                party.representSubType = PartyDetails.partyCode;
                party.applicationId = PartyDetails.applicationId;
                if(GetstartedDetails?.documentNature?.TRAN_MAJ_CODE =="05"){
                    party.share = PartyDetails.shareRelesor + '/' + PartyDetails.totalShare;
                }
                if(multiNames.length > 0){
                    const sro = SROOfficeList.find(sr => sr.name === oldSaleCumGPA.sro);
                    party = {
                        ...party, 
                        exExecutant : true, 
                        exExecutantData: {
                            srCode: sro.id,
                            doctNo: oldSaleCumGPA.doct_no,
                            bookNo: oldSaleCumGPA.book_no,
                            regYear: oldSaleCumGPA.reg_year
                        }
                    }
                }
                (PartyDetails.operation == "Add") ? await CallSavePartyDetails(party) : await CallUpdatePartyDetails(party);
            }
        } else {
            let Num = 1, text: any;
            validate.map((val: any) => {
                if (val !== false) {
                    if (Num === 1) {
                        text = `${val}`;
                        Num = Num + 1
                    } else {
                        text = `\n` + text + `\n${val}`;
                    }
                    Num = Num + 1;
                }
            })
            return ShowMessagePopup(false, text, "");
        }
    }
    const onClickDocs = async(type:any)=>{
        if(type =="Y"){
            setPopup(false)
            setShowAadharConsentConfirmPopup(true)
        }else{
            let temmParty={...PartyDetails,aadhaar:""}
            setPartyDetails(temmParty);
            setPopup(false)
            setShowAadharConsentConfirmPopup(false)
        }
    }
    const OnCancelAction= async ()=>{
    }

    const GetDistrictList = async () => {
        let result = await useGetDistrictList();    
        if (result.status) {
            setDistrictList(result.data);
        }
    }
    const GetLinkedSROOfficeList = async (id: any) => {
        let result = await CallingAxios(getLinkedSroDetails(id));
        if (result.status) {
            let sortedResult = result.data.sort((a, b) => a.name < b.name ? -1 : 1)
            setSROOfficeList(sortedResult);    
        }
    }

    const onOldDocumentDetailsChange = async (e : any) =>{
        let addName = e.target.name;
        let addValue = e.target.value;
        setOldSaleCumGPA({ ...oldSaleCumGPA, [addName]: addValue });
        if (addName == "district") {
            setSROOfficeList([]);
            let selected = DistrictList.find(e => e.name == addValue);
            GetLinkedSROOfficeList(selected.id);
        }
    }

    const verifyOldSaleCumGift = async() =>{
        if (oldSaleCumGPA.district && oldSaleCumGPA.sro && oldSaleCumGPA.book_no && oldSaleCumGPA.doct_no && oldSaleCumGPA.reg_year) {
            const sro = SROOfficeList.find(sr => sr.name === oldSaleCumGPA.sro);
            const response = await CallingAxios(getSaleCumGPADetails({...oldSaleCumGPA, sr_code: sro.id}))
            const exShouldBe = [['01','11'],['01','23'],['09','04'],['41','01']]
            const exData = ['AGREEMENT OF SALE CUM GPA', 'GPA', 'Power to sell Immovable Property (no value mentioned)', 'Special Power']
            if(response.status){
                const data = response.response || []
                if(data.length > 0){
                    if(exShouldBe.some(([maj, min]) => maj == data[0].TRAN_MAJ_CODE && min == data[0].TRAN_MIN_CODE)){
                        setEnableDetails(false)
                        const names = data.map(item => item.NAME);
                        setMultiNames([...names]);
                        if(names.length == 1){
                            setPartyDetails({...PartyDetails, name: names[0]})
                        }
                    }else{
                        ShowMessagePopup(false, `The old document Should be ${exData.join(' / ')}.`, '', 3000)
                    }
                }else{
                    ShowMessagePopup(false, "No data Found", '', 3000);
                }
            }else{
                ShowMessagePopup(false, response.message, '', 3000);
            }
        }else{
            ShowMessagePopup(false, "Enter all required fields to verify the document.", '', 3000)
        }
    }

    const validationCheck = async (data: any) => {
        let errors: any = [];
        let party = { ...data };
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        let txt = data.panNoOrForm60or61.toUpperCase();
        var panRegex = /[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}/;
        var pan: any = { C: "Company", P: "Personal", H: "Hindu Undivided Family (HUF)", F: "Firm", A: "Association of Persons (AOP)", T: "AOP (Trust)", B: "Body of Individuals (BOI)", L: "Local Authority", J: "Artificial Juridical Person", G: "Govt" };
        pan = pan[txt[3]];
        if (party && party.email && !emailRegex.test(party.email)) {
            errors = [...errors, "Enter Valid Email"];
        }
       if(loginDeatils?.loginName !== "APIIC" && PartyDetails?.PartyType !== 'EXECUTANT' && !PartyDetails.sezParty){
        if (party && party.phone && String(party.phone).length !== 10 && PartyDetails.partyType !== 'Deceased') {
            errors = [...errors, "Enter 10 Digit Valid Mobile Number"];
        }
      }
        // if (party.objectType == "pan" && !panRegex.test(txt)) {
        //     errors = [...errors, "Invalid PAN card"];
        //     setPartyDetails({ ...PartyDetails, objectType: party.objectType });
        // }
        if (!party.address) {
            errors = [...errors, "CurrentAddress can't be empty"];
        }
        if (!party.currentAddress) {
            errors = [...errors, "CurrentAddress can't be empty"];
        }
        errors.length > 0 ? errors = [...errors, false] : errors = [...errors, true];;
        setErrors(errors);
        return errors;
    }

    const CallSaveRepresntativeDetails = async (party: any) => {
        // if (party && party.aadhaar) {
        //     party.aadhaar = await encryptWithAES(party.aadhaar);
        // }
        let result = await CallingAxios(useSaveRepresentDetails(party));
        if (result.status) {
            ShowMessagePopup(true, CurrentPartyDetails.representType + " Added Successfully", "/PartiesDetailsPage")
        }
        else {
            ShowMessagePopup(false, "Save Party Failed", "");
        }
    }
    const CallSavePartyDetails = async (party: any) => {
        // if (party && party.aadhaar) {
        //     party.aadhaar = await encryptWithAES(party.aadhaar);
        // }


        let result = await CallingAxios(useSavePartyDetails(party));
        if (result.status) {
            let data = {
                APP_ID: PartyDetails.applicationId,
                PARTY_NAME: PartyDetails.name,
                CONSENT_ACCEPT: aadharConsentCheckboxChecked ? "Y" : "N",
                PARTY_TYPE: PartyDetails.representType,
                TYPE: `Add Party${PartyDetails?.wa ? ` - (${PartyDetails?.wa})` : ""}`,
                SOURCE_NAME: "PDE",
                AADHAR_CONSENT: 2
            }
            if (!aadharOtpSent && (PartyDetails?.wa === "Aadhar Without OTP" || (loginDeatils?.loginEmail === 'APIIC' && PartyDetails.PartyType === "CLAIMANT"))){
                const response = await CallingAxios(SaveAadharConsentDetails(data));
            }
            ShowMessagePopup(true, CurrentPartyDetails.representType + " Added Successfully", "/PartiesDetailsPage")
            setMultiNames([])
            setSaleExecute(false)
            setOldSaleCumGPA({ district: '', sro:'', book_no:'', doct_no:'', reg_year:''})
            setSROOfficeList([])
            setDistrictList([])
            localStorage.removeItem("SEZRepresentative");
        }
        else {
            ShowMessagePopup(false, "Save Party Failed", "");
        }
    }

    const CallUpdatePartyDetails = async (party: any) => {
        // if (party && party.aadhaar) {
        //     party.aadhaar = await encryptWithAES(String(party.aadhaar));
        // }
        let result = await CallingAxios(useUpdatePartyDetails(party));
        if (result.status) {
            ShowMessagePopup(true, CurrentPartyDetails.representType + " Updated Successfully", '/PartiesDetailsPage')
        }
        else {
            ShowMessagePopup(false, "Update Party Failed", "")
        }
    }

    const checkPanValidation = () => {
        if (PartyDetails.panNoOrForm60or61 != "" && PartyDetails?.partyType !== "Govt Institutions" && PartyDetails?.partyType !== "OCI") {
          if (validatePAN(PartyDetails.panNoOrForm60or61)) {
            let count: any;
            if (existingPAN && existingPAN.length > 0) {
                count = existingPAN.find(
                    (val) =>
                    val.toUpperCase() ===
                    PartyDetails.panNoOrForm60or61.toUpperCase()
                );
            }
            if (count === undefined) {
                setShowPanDuplicationDialog(false);
                setShowPanValidationDialog(true)
            } else {
                setShowPanDuplicationDialog(true);
            }
          } 
          else {
            ShowMessagePopup(false, "Enter Valid PAN Number", "");
            setPartyDetails({ ...PartyDetails, panNoOrForm60or61: "" });
          }
        }
    };

    const isAadhaarMandatory = (
        GetstartedDetails?.documentNature?.TRAN_MAJ_CODE === "05" &&
        GetstartedDetails?.documentNature?.TRAN_MIN_CODE === "05" &&
        PartyDetails?.partyType === "Public" && PartyDetails?.wa === "Aadhar Without OTP" && PartyDetails.partyType === "OCI" &&
        (PartyDetails?.PartyType === "CLAIMANT" || (PartyDetails?.representType === "Representative" && PartyDetails?.representSubType === "Releasee")));

    const isPanOrForm60Mandatory = () => {    
        let isValid = false;
        const partyType = PartyDetails?.partyType;
        const amount = GetstartedDetails?.amount;
        const property = GetstartedDetails?.property;
        const filterredPropertyData = property;
        if (!partyType || !filterredPropertyData) {
            return false;
        }
         let marketVal = 0;
          for(let propData of property){
            marketVal = marketVal+propData.marketValue;
        }
        let totalVal = (amount > marketVal) ? amount : marketVal;
        for( let property of filterredPropertyData) {
            if (partyType === "Public") {
                if (allowMutationPayment) {
                    if (property.propertyType === "RURAL(AGRICULTURE) [గ్రామీణ (వ్యవసాయ భూమి)]") {
                        isValid = totalVal > 0;
                    } else if (property.propertyType === "URBAN(PLOTS/HOUSE/FLATS..ETC) [పట్టణ (స్థలము/అపార్ట్ మెంట్/ఇల్లు)]") {
                        isValid = totalVal > 1000000;
                    }
                } else {
                    isValid = totalVal > 1000000;
                }
            } else {
                if (allowMutationPayment) {
                    if (property.propertyType === "RURAL(AGRICULTURE) [గ్రామీణ (వ్యవసాయ భూమి)]") {
                        isValid = totalVal > 0;
                    } else if (property.propertyType === "URBAN(PLOTS/HOUSE/FLATS..ETC) [పట్టణ (స్థలము/అపార్ట్ మెంట్/ఇల్లు)]") {
                        isValid = totalVal > 1000000;
                    }
                } else {
                    isValid = totalVal > 1000000;
                }
            }
            if(isValid == true){
                break;
            }
        }
        return isValid;
    };
const DocumentPreview = async (data: any) => {
    try {
        const fileData = PartyDetails?.deceasedPartyFile;
        if (!fileData) return;
        let fileSrc = "";
        if (fileData.type === "application/pdf") {
            fileSrc = `data:application/pdf;base64,${fileData.base64}`;
            const newWindow = window.open();
            newWindow?.document.write(
                `<iframe src="${fileSrc}" width="100%" height="100%" style="border:none;"></iframe>`
            );
        } else if (
            fileData.type === "image/jpeg" ||
            fileData.type === "image/png"
        ) {
            fileSrc = `data:${fileData.type};base64,${fileData.base64}`;
            const newWindow = window.open();
            newWindow?.document.write(
                `<img src="${fileSrc}" style="max-width:100%; height:auto;" />`
            );
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};
    const handleSentAadharOTP = async () => {
        const byteAadhar = encodeBase64(PartyDetails.aadhar? PartyDetails.aadhar:PartyDetails.aadhaar);
        let result = await CallingAxios(UseGetAadharOTP(byteAadhar));
        if (result && result.status != "Failure") {
            setAadharOtpSent(true)
            setAadharValidation({ ...aadharValidation, otpDetails: result })
            ShowMessagePopup(true, "Aadhar OTP has been sent successfully on registered mobile", "")
        }
        else {
            ShowMessagePopup(false, "Aadhar OTP Request failed", "");
        }
    }
    const handleOTPEnter =async(e:any)=>{
        const requiredParams = {
            aadharNumber: encodeBase64(PartyDetails.aadhar?PartyDetails.aadhar:PartyDetails.aadhaar),
            transactionNumber: aadharValidation.otpDetails.transactionNumber,
            otp:aadharValidation.OTP
        }
        if(requiredParams.otp.length==6){
            console.log(requiredParams,"Params")
            let result = await CallingAxios(UseGetAadharDetails({...requiredParams}));
            if (result.status && result.status === 'Success') {
                let data = {
                APP_ID: PartyDetails.applicationId,
                PARTY_NAME: result.userInfo.name, 
                CONSENT_ACCEPT: aadharConsentCheckboxChecked ? "Y" : "N",
                PARTY_TYPE: PartyDetails.representType,
                TYPE: `Add Party${PartyDetails?.wa ? ` - (${PartyDetails?.wa})` : ""}`,
                SOURCE_NAME: "PDE",
                AADHAR_CONSENT: ApiicAadhaarAddRepExCondition ? 1 : 2
            }
            if (aadharOtpSent){                
                const response = await CallingAxios(SaveAadharConsentDetails(data));
            }
            ShowMessagePopup(true, "Aadhar Validated Successfully", "");
            setPartyDetails({...PartyDetails,aadharDetails: result.userInfo })
            setShowModal(true)
            setIsAadharValidated(true);
              } else {
                ShowMessagePopup(false, get(result, 'message', 'Aadhaar API Failed'),'');
              }            
        }
    //    
    }
    const MobileOtp = async () => {
        if (!PartyDetails.phone || !ValidMobile(PartyDetails.phone)) {
            ShowMessagePopup(false, "Please enter a valid 10-digit mobile number.", "");
            return;
        }
        let result: any = await CallingAxios(UseSendMobileOTP({ mobile: PartyDetails.phone,App_id:GetstartedDetails.applicationId }));
        if (result.status) {
            await CallingAxios(UseAuthenticateUpdate({ otpfrom: "mobile", otp: result.otp }));
            ShowMessagePopup(true, "OTP Sent to Mobile Number", "");
            setMobileOtpSent(true);
            setIsMobileOtpVerified(false);
            setSentOtpForMobile(PartyDetails.phone);
        } else {
            ShowMessagePopup(false, get(result, 'message', "Failed to send OTP to mobile number."), '');
            setMobileOtpSent(false);
            setIsMobileOtpVerified(false);
        }
    };
    const handleMobileOTPVerification = async () => {
        if (!PartyDetails.mobileOTP) {
            ShowMessagePopup(false, "Please enter the OTP.", "");
            return;
        }
        let verificationResult: any = await CallingAxios(UseMobileVerify({ mobile: PartyDetails.phone, otp: PartyDetails.mobileOTP,App_id:GetstartedDetails.applicationId}));
        if (verificationResult.status) {
            ShowMessagePopup(true, "Mobile OTP Verified Successfully!", "");
            setIsMobileOtpVerified(true);
        } else {
            ShowMessagePopup(false, get(verificationResult, 'message', "Invalid OTP. Please try again."), '');
            setIsMobileOtpVerified(false);
        }
    };

    let ApiicAadhaarAddRepExCondition = loginDeatils?.loginEmail === 'APIIC' && PartyDetails?.operation === "AddRep" && PartyDetails?.representSubType === "Executant";

    const handleAadharConsentConfirmPopup = () => {
        setShowAadharConsentPlayerVoicePopup(true);
    };

    const handleAadharConsentConfirmYes = () => {
        if (!aadharConsentCheckboxChecked) {
            ShowMessagePopup(false, "Please Select the Check box", "");
            return;
        }
        if (!ApiicAadhaarAddRepExCondition) {
            setShowAadharConsentConfirmPopup(false);
            setShowSendOtpButton(true)
        } else {
            setShowAadharConsentPlayerVoicePopup(false);
            handleSentAadharOTP();
        }
    };

    const handleAadharConsentConfirmNo = () => {
        setAadharConsentCheckboxChecked(false);
        // setShowSendOtpButton(true);
        if (!ApiicAadhaarAddRepExCondition) {
            setShowAadharConsentConfirmPopup(false);
            setPartyDetails((prev) => ({
                ...prev,
                aadhaar: "",
                aadhar: ""
            }));
        } else {
           setShowAadharConsentPlayerVoicePopup(false); 
        }
    };

    return (
        <div className='PageSpacing pt-0'>
            <Head>
                <title>Add Party - Public Data Entry</title>
            </Head>
            <Container>
                <Row className='mb-2'>
                    <Col lg={10} md={12} xs={12}></Col>
                    <Col lg={2} md={12} xs={12}>
                        <div className='text-end previewCon'><button className='PreBtn proceedButton' onClick={() => ShowPreviewPopup()} >Preview Document</button></div>
                    </Col>
                </Row>
                <Row>
                    <Col lg={12} md={12} xs={12}>
                        <form onSubmit={onSubmit} className={styles.AddPartyMain}>
                            <Row className='ApplicationNum'>
                                <Col lg={6} md={6} xs={12}>
                                    <div className='ContainerColumn'>
                                        <p className='TitleText'> {PartyDetails.representType} Details</p>
                                    </div>
                                </Col>
                                <Col lg={6} md={6} xs={12}>
                                    <div className='ContainerColumn RightColumnText text-end'>
                                        <h4 className='TitleText' style={{ textAlign: "right" }}>Application ID: {PartyDetails.applicationId}</h4>
                                    </div>
                                </Col>
                            </Row>

                            {PartyDetails.operation != "AddRep" && (PartyDetails.partyType == "Public" || PartyDetails.partyType == "NRI") ? <div>
                            <Row>
                                <Col lg={4} md={6} xs={12} className='mb-2'>
                                    <input
                                        type="checkbox"
                                        className={styles.selectbox}
                                        name="isRepCheck"
                                        disabled={PartyDetails.operation == "Edit" || PartyDetails.operation == "View"}
                                        checked={PartyDetails?.isRepChecked || false}
                                        onChange={(e) => {
                                            setPartyDetails({ ...PartyDetails, isRepChecked: e.target.checked});
                                        }}
                                    />
                                    <label style={{ marginLeft: '10px' }}>
                                        <span className='fw-bold'>Do you have the Representative to the Party?</span>
                                    </label>
                                </Col>
                            </Row>
                            </div>:null}
                            <div className={styles.AddPartyInfo}>
                                <div className={styles.AddPartyInfoDetails}>
                                    {(PartyDetails.representType == "Representative" || PartyDetails.representType == "Presenter") &&
                                        <div className={styles.AddPartyDetails}>
                                            <Row>
                                                <Col lg={6} md={6} xs={12}>
                                                    <p className={styles.tabText}>{"Represent Type : " + PartyDetails.representSubType}</p>
                                                </Col>
                                                <Col lg={6} md={6} xs={12}>
                                                    <div className={styles.tabText} style={{ textAlign: "right" }}>{"Represent Of : " + ParentPartyDetails.name}</div>
                                                </Col>
                                            </Row>
                                        </div>
                                    }
                                    <div className={styles.AddPartyInfoData}>
                                        {
                                            GetstartedDetails?.documentNature.TRAN_MAJ_CODE == '01' 
                                            && PartyDetails.representType == 'Executant' 
                                            && PartyDetails.partyType == 'Public'
                                            && PartyDetails?.wa ==="Aadhar Without OTP"
                                            && PartyDetails.operation == "Add"
                                            && <div className='mb-4'>
                                                <label>
                                                    <input type="checkbox" disabled={multiNames.length > 0} name='SaleExecute' checked={saleExecute} onChange={ () =>{ setSaleExecute(!saleExecute); setEnableDetails(!enableDetails)}}/>
                                                    <span className='mx-2 fw-bold'>Is it GPA linked sale document?</span>
                                                </label>
                                            </div>
                                        }
                                        {
                                            saleExecute && 
                                            <div>
                                                <Row className='my-4 border-bottom' style={{paddingBottom: "30px"}}>
                                                    <Col lg={4} md={12} xs={12} className='mb-2'>
                                                        <TableText label={"District [జిల్లా]"} required={true} LeftSpace={false} />
                                                        <TableDropdownSRO disabled={!enableDetails} required={true} options={DistrictList} name={"district"} value={oldSaleCumGPA.district} onChange={onOldDocumentDetailsChange} />
                                                    </Col>
                                                    <Col lg={4} md={12} xs={12}>
                                                        <TableText label={"Sub Registrar Office [సబ్ రిజిస్ట్రార్ కార్యాలయం]"} required={true} LeftSpace={false} />
                                                        <TableDropdownSRO disabled={!enableDetails} required={true} options={SROOfficeList} name={"sro"} value={oldSaleCumGPA.sro} onChange={onOldDocumentDetailsChange} />
                                                    </Col>
                                                    <Col lg={4} md={12} xs={12} className='mb-2'>
                                                        <TableText label={"GPA Document No. [డాక్యుమెంట్ నెం.]"} required={true} LeftSpace={false} />
                                                        <TableInputText disabled={!enableDetails} type='number' placeholder='Enter Document No' allowNeg={true} maxLength={7} required={true} name={'doct_no'} value={oldSaleCumGPA.doct_no} onChange={onOldDocumentDetailsChange} />
                                                    </Col>
                                                    <Col lg={4} md={12} xs={12}>
                                                        <TableText label={"Registration Year [నమోదు సంవత్సరం]"} required={true} LeftSpace={false} />
                                                        <TableInputText disabled={!enableDetails} type='number' placeholder='Enter Registartion Year' maxLength={4} required={true} name={'reg_year'} value={oldSaleCumGPA.reg_year} onChange={onOldDocumentDetailsChange} />
                                                    </Col>
                                                    <Col lg={4} md={12} xs={12}>
                                                        <TableText label={"Book No. [షెడ్యూల్ నెం.]"} required={true} LeftSpace={false} />
                                                        <TableInputText disabled={!enableDetails} type='number' placeholder='Enter Book No' maxLength={1} required={true} name={'book_no'} value={oldSaleCumGPA.book_no} onChange={onOldDocumentDetailsChange} />
                                                    </Col>
                                                    <Col lg={4} md={12} xs={12}>
                                                        <button type="button" disabled={!enableDetails} className='proceedButton' onClick={verifyOldSaleCumGift} >Verify</button>
                                                    </Col>
                                                </Row>
                                            </div>
                                        }
                                        <Row className="mb-0">
                                            <Col lg={4} md={6} xs={12} className="mb-2">
                                                <TableText label={loginDeatils?.loginName === "APIIC" && !PartyDetails?.partyType ? "Full Name [పూర్తి పేరు]" :PartyDetails?.partyType != "Public"? (PartyDetails?.partyType === "NRI" || PartyDetails?.partyType === "OCI") ?`${PartyDetails?.partyType} Name [పూర్తి పేరు](Name should be as per Passport)`:`${PartyDetails.sezParty ? "SEZ Representative" : PartyDetails?.partyType} Name [పూర్తి పేరు]` :"Full Name [పూర్తి పేరు]"} required={true} LeftSpace={false} />
                                                { loginDeatils?.loginName === "APIIC" && PartyDetails?.representSubType === "Executant" && PartyDetails?.representType === "Representative" ? ( 
                                                    <TableDropdownSRO required={true} options={apiicEmplData} name={"EmpleName"} value={selectedName} onChange={onChange} />) :  
                                                    enableDetails || (PartyDetails?.exExecutant && PartyDetails.operation == "Edit") ? (
                                                        <TableInputText disabled={true} type='text' maxLength={200} placeholder='Enter Full Name' splChar={false} required={true} name={'name'} value={PartyDetails.name} onChange={onChange} capital={true} />
                                                    ):
                                                        multiNames?.length == 1? (
                                                            <TableInputText disabled={true} type='text' maxLength={200} placeholder='Enter Full Name' splChar={false} required={true} name={'name'} value={PartyDetails.name} onChange={onChange} capital={true} />
                                                        )
                                                    :
                                                    multiNames?.length > 0 ? 
                                                        <select onChange={e => setPartyDetails({...PartyDetails, name: e.target.value})} style={{padding: '8px 270px 8px 2px'}}>
                                                            {
                                                                multiNames.map((item, index) => (  
                                                                    <option key={index} value={item}> 
                                                                        {item}          
                                                                    </option>        
                                                                ))
                                                            }   
                                                        </select>
                                                    :
                                                    flag ?
                                                    <TableInputText disabled={ PartyDetails?.sezParty ? true : ((loginDeatils?.loginEmail === "APIIC" &&  ( (PartyDetails?.representType  === 'Claimant'  || PartyDetails?.PartyType === "CLAIMANT") && (PartyDetails?.operation == 'Add' || PartyDetails?.operation == 'Edit') || PartyDetails?.representSubType == "Claimant" ))) ? false : ((loginDeatils?.loginEmail === "APIIC" &&  PartyDetails?.representType === "Executant" &&  PartyDetails?.operation === "Edit")) ? true :((PartyDetails?.partyType != "Public"  && PartyDetails.operation != "View") || (PartyDetails?.partyType === "Public" && PartyDetails?.wa === "Aadhar Without OTP" && PartyDetails.operation != "View") ) ? ( (PartyDetails.operation === "Edit" && (PartyDetails?.partyType === "NRI" || PartyDetails?.partyType === "OCI")) || 
                                                          passportname ||  
                                                          PartyDetails?.disablePan || 
                                                          PartyDetails?.disableTan || 
                                                          PartyDetails?.disableTin
                                                        )
                                                        ? true 
                                                        : false 
                                                      : true} type='text' maxLength={200} placeholder='Enter Full Name' splChar={false} required={true} name={'name'} value={PartyDetails.name} onChange={onChange} capital={true} />
                                                    :
                                                    <TableInputText disabled={PartyDetails.operation != "View"   ?  false : true} type='text' maxLength={40} placeholder='Enter Full Name' splChar={false} required={true} name={'name'} value={PartyDetails.name} onChange={onChange} capital={true} />
                                                }
                                            </Col>
                                            {
                                                PartyDetails.operation == "View" && (PartyDetails?.sezParty || PartyDetails?.partyType == "Public") ?
                                                    <Col lg={4} md={6} xs={12}>
                                                        <TableText label={"Relation Name [సంబంధం పేరు]"} required={true} LeftSpace={false} />
                                                        {flag ?
                                                            <TableInputText disabled={(PartyDetails?.partyType != "Public" && PartyDetails.operation != "View") || (PartyDetails?.partyType === "Public" && PartyDetails?.wa === "Aadhar Without OTP" && PartyDetails.operation != "View") ? false : true} type='text' maxLength={40} placeholder='Enter Relation Name' required={true} capital={true} name={'relationName'} splChar={false} value={PartyDetails.relationType + " " + PartyDetails.relationName} onChange={onChange} />
                                                            :
                                                            <TableInputText disabled={PartyDetails.operation != "View" ? false : true} type='text' maxLength={40} placeholder='Enter Relation Name ' required={true} capital={true} name={'relationName'} splChar={false} value={PartyDetails.relationType + " " + PartyDetails.relationName} onChange={onChange} />
                                                        }
                                                    </Col> : (["Public", "NRI", "OCI", "Deceased"].includes(PartyDetails?.partyType) || PartyDetails?.sezParty) &&
                                                    <Col lg={4} md={6} xs={12}>
                                                        <TableText label={"Relation Name [సంబంధం పేరు]"} required={true} LeftSpace={false} />
                                                        <div className={styles.relationData}>
                                                            {
                                                            enableDetails ?
                                                                <select className={styles.selectData} disabled={true} required={true} name={"relationType"} value={PartyDetails.relationType} onChange={onChange}>
                                                                    <option value={''}>Select</option>
                                                                    {PartyDetails?.partyType !== "Public"  && <option value={'C/O'}>C/O</option>}
                                                                    <option value={'S/O'}>S/O</option>
                                                                    <option value={'W/O'}>W/O</option>
                                                                    <option value={'D/O'}>D/O</option>
                                                                </select>
                                                            :
                                                            flag ?
                                                                <select className={styles.selectData} disabled={PartyDetails?.sezParty ? true : (PartyDetails?.partyType != "Public" || (PartyDetails?.partyType != "NRI" || PartyDetails?.partyType != "OCI") && PartyDetails.operation != "View") || ((PartyDetails?.partyType === "Public" || PartyDetails?.partyType == "NRI" || PartyDetails?.partyType == "OCI") && PartyDetails?.wa ==="Aadhar Without OTP" && PartyDetails.operation != "View") ? false : true} required={true} name={"relationType"} value={PartyDetails.relationType} onChange={onChange}>
                                                                    <option value={''}>Select</option>
                                                                    {PartyDetails?.partyType !== "Public"  && <option value={'C/O'}>C/O</option>}
                                                                    <option value={'S/O'}>S/O</option>
                                                                    <option value={'W/O'}>W/O</option>
                                                                    <option value={'D/O'}>D/O</option>
                                                                    <option value={'F/O'}>F/O</option>
                                                                </select>
                                                                :
                                                                <select className={styles.selectData} disabled={PartyDetails.operation != "View" ? false : true} required={true} name={"relationType"} value={PartyDetails.relationType} onChange={onChange}>
                                                                    <option value={''}>Select</option>
                                                                    {PartyDetails?.partyType !== "Public" && <option value={'C/O'}>C/O</option>}
                                                                    <option value={'S/O'}>S/O</option>
                                                                    <option value={'W/O'}>W/O</option>
                                                                    <option value={'D/O'}>D/O</option>
                                                                    <option value={'F/O'}>F/O</option>
                                                                </select>

                                                            }
                                                            {
                                                            enableDetails ? 
                                                                <TableInputText disabled={true} maxLength={40} capital={true} type='text' placeholder='Enter Relation Name' splChar={false} required={true} name={'relationName'} value={PartyDetails.relationName} onChange={onChange} />
                                                            :
                                                            flag ?
                                                                <TableInputText disabled={PartyDetails?.sezParty ? true :(loginDeatils?.loginEmail === "APIIC" && (PartyDetails?.PartyType === "CLAIMANT" ||  PartyDetails?.representSubType === "Claimant" ||  PartyDetails?.PartyType === "CLAIMANT" || PartyDetails?.operation == 'Edit'))? false: (PartyDetails?.partyType != "Public" && PartyDetails.operation != "View") || (PartyDetails?.partyType === "Public"  && PartyDetails?.wa ==="Aadhar Without OTP" && PartyDetails.operation != "View") ? (PartyDetails.operation === "Edit" && (PartyDetails?.partyType === "NRI" || PartyDetails?.partyType === "OCI"))? true : false : true} maxLength={40} capital={true} type='text' placeholder='Enter Relation Name' splChar={false} required={true} name={'relationName'} value={PartyDetails.relationName} onChange={onChange} />
                                                                :
                                                                <TableInputText disabled={PartyDetails.operation != "View" ? false : true} maxLength={40} capital={true} type='text' placeholder='Enter Relation Name' splChar={false} required={true} name={'relationName'} value={PartyDetails.relationName} onChange={onChange} />}

                                                        </div>
                                                    </Col>
                                                // :null
                                            }
                                            {/* {PartyDetails.partyType == "Public"? */}
                                            { (PartyDetails?.partyType == "NRI" || PartyDetails?.partyType == "OCI" || PartyDetails?.partyType == "Deceased")  && <Col lg={4} md={6} xs={12}>
                                                <TableText label={ PartyDetails?.partyType == "Deceased" ? "Date of Death [ తేదీ]":"Date of birth [ తేదీ]"} required={true} LeftSpace={false} />
                                                {PartyDetails.operation === "Add" ?
                                                    <TableSelectDate max={(moment(moment().toDate())).format("YYYY-MM-DD")} placeholder='Select Date' required={true} name={'dateOfBrith'} onChange={onChange} value={PartyDetails.dateOfBrith}  disabled={false}/>
                                                    :
                                                    <TableSelectDate max={(moment(moment().toDate())).format("YYYY-MM-DD")} placeholder='Select Date' required={true} name={'dateOfBrith'} onChange={onChange} value={PartyDetails.dateOfBrith} disabled={true}/>
                                                }

                                            </Col>}
                                            {(["Public", "NRI", "OCI"].includes(PartyDetails?.partyType) || PartyDetails?.sezParty)  && <Col lg={4} md={6} xs={12}>
                                                <TableText label={"Age [వయస్సు]"} required={true} LeftSpace={false} />
                                                {
                                                enableDetails ? 
                                                    <TableInputText disabled={true} type='number' placeholder='Age' required={true} name={'age'} value={PartyDetails.age} splChar={false} onChange={onChange} />
                                                :
                                                    flag ?
                                                    <TableInputText disabled={PartyDetails?.sezParty ? true :(loginDeatils.loginEmail === "APIIC" && PartyDetails?.PartyType === "CLAIMANT" || loginDeatils?.loginEmail === "APIIC" && PartyDetails?.representSubType === 'Claimant'|| loginDeatils?.loginEmail === "APIIC" && PartyDetails?.PartyType === "CLAIMANT" || PartyDetails?.operation == 'Edit') ? false :(PartyDetails?.partyType != "Public" && PartyDetails.operation != "View") || (PartyDetails?.partyType === "Public"  && PartyDetails?.wa ==="Aadhar Without OTP" && PartyDetails.operation != "View") ?  PartyDetails.dateOfBrith || isApiicaadharvalidated? true:false : true } type='number' placeholder='Age ' required={true} name={'age'} value={PartyDetails.age} splChar={false} onChange={onChange} />
                                                    :
                                                    <TableInputText disabled={ (PartyDetails.dateOfBrith ||PartyDetails.operation != "View" ) ? false :true} type='number' placeholder='Age' required={true} name={'age'} value={PartyDetails.age} splChar={false} onChange={onChange} />}
                                            </Col>}
                                            {(PartyDetails?.partyType == "NRI" || PartyDetails?.partyType == "OCI") && <Col lg={4} md={6} xs={12} className='mb-1'>
                                                {/* <TableText label={"Refer to the Last page in the Passport for Passport file no"} required={true} LeftSpace={false} /> */}
                                                <TableText label={" Passport File No.(Refer to the Last page in the Passport for)"} required={true} LeftSpace={false} />
                                                { PartyDetails.operation === "Add"?
                                                    <TableInputText disabled={false}  type='text' splChar={false} dot={false} placeholder='Enter Passport File No' required={true} name={'fileNo'} value={PartyDetails.fileNo} onChange={onChange} max={15} capital={true} />
                                                    :
                                                    <TableInputText disabled={PartyDetails.operation === "Edit" || PartyDetails.operation === "View"} type='text' splChar={false} dot={false} placeholder='Enter Passport File No' required={true} name={'fileNo'} value={PartyDetails.fileNo} onChange={onChange} max={15} capital={true} />
                                                }
                                            </Col>}
                                            {(PartyDetails?.partyType == "NRI" || PartyDetails?.partyType == "OCI") && <Col lg={4} md={6} xs={12}>
                                                <TableText label={"Date of issued"} required={true} LeftSpace={false} />
                                                {/* <TableInputText disabled={PartyDetails.operation == "View" ? true : false} type='number'   splChar={false} dot={false} placeholder='Enter Pass Port' required={true} name={'doi'} value={PartyDetails.doi} onChange={onChange} min={10} /> */}
                                                {PartyDetails.operation === "Add" ?
                                                    <TableSelectDate max={moment().format("YYYY-MM-DD")} placeholder='Select Date' required={true} name={'doi'} onChange={onChange} value={PartyDetails.doi}  disabled={false}/> :
                                                    <TableSelectDate max={moment().format("YYYY-MM-DD")} placeholder='Select Date' required={true} name={'doi'} onChange={onChange} value={PartyDetails.doi} disabled={PartyDetails.operation === "Edit" || PartyDetails.operation === "View"} />
                                                }
                                            </Col>}

                                            {PartyDetails?.partyType == "OCI" && <Col lg={4} md={6} xs={12} className='mt-1 mb-2'>
                                                <TableText label={"Passport Expire Date"} required={true} LeftSpace={false} />
                                                {/* <TableInputText disabled={PartyDetails.operation == "View" ? true : false} type='number'   splChar={false} dot={false} placeholder='Enter Pass Port' required={true} name={'doi'} value={PartyDetails.doi} onChange={onChange} min={10} /> */}
                                                {PartyDetails.operation === "Add" ?
                                                    <TableSelectDate max={moment().add(10, 'years').format("YYYY-MM-DD")} placeholder='Select Date' required={true} name={'passportExpireDate'} onChange={onChange} value={PartyDetails.passportExpireDate}  disabled={false}/> :
                                                    <TableSelectDate max={moment().add(10, 'years').format("YYYY-MM-DD")} placeholder='Select Date' required={true} name={'passportExpireDate'} onChange={onChange} value={PartyDetails.passportExpireDate} disabled={true} />
                                                }
                                            </Col>}

                                            {PartyDetails?.partyType == "OCI" && <Col lg={4} md={6} xs={12} className='mt-1'>
                                                <TableText label={"Place Of Issue"} required={true} LeftSpace={false} />
                                               
                                                {
                                                    PartyDetails.operation === "Add" ? (
                                                        <TableInputText  disabled={false}  splChar={false} type="text" dot={false} placeholder="Enter Place of issue"  required={true}   name="placeOfIssue" value={PartyDetails.placeOfIssue} onChange={onChange} capital={true}/>
                                                    ) : (
                                                        <TableInputText
                                                            disabled={PartyDetails.operation === "Edit" || PartyDetails.operation === "View"}
                                                            type="text"
                                                            splChar={false}
                                                            dot={false}
                                                            placeholder="Enter Place of issue"
                                                            required={true}
                                                            name="placeOfIssue"
                                                            value={PartyDetails.placeOfIssue}
                                                            onChange={onChange}
                                                            capital={true}
                                                        />
                                                    )
                                                }
                                                </Col>}

                                            {PartyDetails?.partyType == "OCI" &&
                                                <Col lg={4} md={6} xs={12} className='mt-1'>
                                                    <Row>
                                                        <Col lg={10} md={10} xs={12}>
                                                            <TableText label={"Upload Passport File"} required={true} LeftSpace={false} />
                                                            {
                                                                PartyDetails.operation === "Add" ? (
                                                                    <div className='uploadInputCon'>
                                                                        <input
                                                                            className="uploadInput"
                                                                            type="file"
                                                                            name="partyFile"
                                                                            accept=".jpg"
                                                                            onChange={onChange}
                                                                            required
                                                                        />
                                                                    </div>)
                                                                    :
                                                                    (<div className='uploadInputCon'>
                                                                        <input className='uploadInput'
                                                                            disabled={PartyDetails.operation != "Add"}
                                                                            type='file'
                                                                            name='partyFile'
                                                                            onChange={onChange}
                                                                            accept={'.jpg'}
                                                                            required
                                                                        />
                                                                    </div>
                                                                    )
                                                            }
                                                        </Col>
                                                        <Col lg={2} md={2} xs={12} className='tooltipMain'>
                                                        <div onClick={handleShow} className='tooltip-container'>
                                                            <img src='/PDE/images/Info.svg' />
                                                             <span className="tooltip-text">Sample File</span>
                                                            </div>                                                         
                                                        </Col>
                                                    </Row>
                                                </Col>}
                                            
                                            {(PartyDetails?.partyType == "NRI" || PartyDetails?.partyType == "OCI") && <Col lg={4} md={6} xs={12}>
                                                <TableText label={"Passport No[పాస్ పోర్ట్ నెం.]"} required={true} LeftSpace={false} />
                                               
                                                {
                                                    PartyDetails.operation === "Add" ? (
                                                        <TableInputText  disabled={false}  splChar={false} type="text" dot={false} placeholder="Enter Passport"  required={true}   name="passportNumber" value={PartyDetails.passportNumber} onChange={onChange} capital={true}
                                                            onBlurCapture={() => {if (PartyDetails?.partyType == "NRI" && !validatePassPort(PartyDetails.passportNumber) && PartyDetails.passportNumber !== "") {ShowMessagePopup(false, "Enter Valid Passport Number", ""); }
                                                            }}
                                                        />
                                                    ) : (
                                                        <TableInputText
                                                            disabled={PartyDetails.operation === "Edit" || PartyDetails.operation === "View"}
                                                            type="text"
                                                            splChar={false}
                                                            dot={false}
                                                            placeholder="Enter Passport"
                                                            required={true}
                                                            name="passportNumber"
                                                            value={PartyDetails.passportNumber}
                                                            onChange={onChange}
                                                            capital={true}
                                                            onBlurCapture={() => {
                                                                if (PartyDetails?.partyType == "NRI" && !validatePassPort(PartyDetails.passportNumber) && PartyDetails.passportNumber !== "") {
                                                                    ShowMessagePopup(false, "Enter Valid Passport Number", "");
                                                                }
                                                            }}
                                                        />
                                                    )
                                                }
                                                </Col>}
                                            {PartyDetails.operation == "View" && !((PartyDetails.partyCode === "WT" || PartyDetails?.partyType === "Deceased") && loginDeatils?.loginMode === "VSWS") ?
                                                <Col lg={4} md={6} xs={12} className='mb-2'>
                                                    <TableText label={PartyDetails?.partyType != "Public" ? (PartyDetails?.partyType === "NRI" || PartyDetails?.partyType == "OCI") ? "PAN No.":"TAN [టాన్]/ TIN/ PAN" : "PAN or Form 60 / 61 [పాన్ నంబర్ లేదా ఫారం 60 / 61]"} required={true} LeftSpace={false} />
                                                    {PartyDetails.objectType == 'tan'?
                                                        <TableInputText disabled={true} type='text' placeholder='ENTER TAN' required={true} name={'tan'} splChar={false} capital={true} value={PartyDetails.objectType + " - " + PartyDetails.tan} onChange={onChange} />
                                                        :
                                                        PartyDetails.objectType == 'tin'?
                                                            <TableInputText disabled={true} type='text' placeholder='ENTER TIN' required={true} name={'tin'} splChar={false} capital={true} value={PartyDetails.objectType + " - " + PartyDetails.tin} onChange={onChange} />
                                                            :
                                                            PartyDetails.objectType == 'pan' ?
                                                                <TableInputText disabled={true} type='text' placeholder='Enter PAN' required={true} splChar={false} name={'panNoOrForm60or61'} capital={true} value={PartyDetails.objectType + " - " + PartyDetails.panNoOrForm60or61} onChange={onChange} />
                                                                :
                                                                <TableInputText disabled={true} type='text' placeholder='' required={true} splChar={false} name={'panNoOrForm60or61'} capital={true} value={PartyDetails.objectType} onChange={onChange} />
                                                    }
                                                </Col>
                                                :
                                                PartyDetails?.partyType !== "Deceased" && !(PartyDetails.PartyType === "WITNESS" && loginDeatils?.loginMode === "VSWS") && !((PartyDetails.operation == "Edit" || PartyDetails.operation == "View") && PartyDetails.partyCode === "WT" && loginDeatils?.loginMode === "VSWS") &&
                                                <Col lg={4} md={6} xs={12} className="mb-2">
                                                    <TableText label=
                                                    {
                                                        (PartyDetails?.partyType != "Public") 
                                                        ? 
                                                            (PartyDetails?.partyType == "NRI" || PartyDetails?.partyType == "OCI" ||  PartyDetails?.sezParty) 
                                                            ? 
                                                                "PAN No." 
                                                            :
                                                                "TAN / TIN / PAN" 
                                                        :  
                                                            "PAN or Form 60 / 61 [పాన్ నంబర్ లేదా ఫారం 60 / 61]"
                                                    } required={false}  LeftSpace={false} />
                                                    <div className={`${styles.relationData} ${styles.panrelationData}`}>
                                                        <select className={`${styles.selectData} ${styles.panData}`} required={true} name={'objectType'} value={PartyDetails.objectType} onChange={onChange} disabled={PartyDetails?.sezParty ? true : enableDetails || disablePAN ||  PartyDetails?.disablePan || PartyDetails?.disableTan || PartyDetails?.disableTin || loginDeatils?.loginEmail == 'APIIC'&&PartyDetails?.operation == 'Edit' && PartyDetails?.partyType == "Govt Institutions" && PartyDetails.representType === "Executant"
                                                        }>
                                                            {
                                                                (PartyDetails?.partyType != "Public")
                                                                ?
                                                                    (PartyDetails?.partyType == "NRI" || PartyDetails?.partyType == "OCI" || PartyDetails?.sezParty)
                                                                    ?
                                                                        <option value={'pan'}>PAN</option>
                                                                    :
                                                                    <>
                                                                        <option value={'tan'}>TAN</option>
                                                                        <option value={'tin'}>TIN</option>
                                                                        <option value={'pan'}>PAN</option>
                                                                    </>
                                                                :
                                                                <>
                                                                    <option value={'pan'}>PAN</option>
                                                                    {(loginDeatils.loginName === "APIIC" && PartyDetails?.representType == 'Representative' && PartyDetails?.representSubType === "Executant") ? <></> : <option value={'form60'} >Form 60/61</option> }

                                                                </>
                                                            }
                                                        </select>                                               
                                                        {PartyDetails?.partyType === "Public" ?
                                                            <TableInputText
                                                                type='text'
                                                                disabled={ enableDetails || (PartyDetails?.objectType == "form60" || PartyDetails?.objectType == "" || disablePAN  || loginDeatils?.loginEmail === 'APIIC' && PartyDetails?.objectType == "form60") || isApiicaadharvalidated || loginDeatils?.loginEmail == 'APIIC' && (PartyDetails?.objectType == "form60" && PartyDetails?.operation == "Edit")? loginDeatils?.loginEmail == 'APIIC'&& !disablePAN && PartyDetails?.objectType == ''? false : true : false}
                                                                placeholder='Enter PAN / Form 60 / 61'
                                                                onBlurCapture={checkPanValidation}
                                                                required={isPanOrFormReq}
                                                                // required ={() =>{if(GetstartedDetails.amount >1000000){isPanMadetory}else{isPanMadetory}}}
                                                                name={'panNoOrForm60or61'}
                                                                value={PartyDetails.panNoOrForm60or61}
                                                                onChange={onChange}
                                                                capital={true}
                                                                splChar={false}
                                                            />
                                                            : (PartyDetails?.partyType == "NRI" || PartyDetails?.partyType == "OCI" || PartyDetails?.sezParty)?
                                                                <TableInputText
                                                                    type='text'
                                                                    disabled={
                                                                        PartyDetails?.sezParty ? true : 
                                                                        (PartyDetails?.objectType == "form60" || PartyDetails?.objectType == ""  || (PartyDetails?.partyType === "NRI" ? passportstatus:false) || disablePAN ||((PartyDetails?.partyType == "NRI" || PartyDetails?.partyType == "OCI") && PartyDetails.operation != "Add") )  ? true : false}
                                                                    // disabled={(PartyDetails?.objectType == "form60" || PartyDetails?.objectType == ""  || passportstatus || disablePAN) ? true : false}
                                                                    placeholder='Enter PAN'
                                                                    onBlurCapture={checkPanValidation}
                                                                    required={(PartyDetails?.partyType === "NRI" || PartyDetails?.partyType == "OCI") ? false : true}
                                                                    name={'panNoOrForm60or61'}
                                                                    value={PartyDetails.panNoOrForm60or61}
                                                                    onChange={onChange}
                                                                    capital={true}
                                                                    splChar={false}
                                                                /> :
                                                            PartyDetails.objectType ==="tin"
                                                                    ?
                                                                    <TableInputText
                                                                        type='text'
                                                                        disabled={(PartyDetails?.objectType == "form60" || PartyDetails?.objectType == "" || PartyDetails?.disableTin) ? true : false}
                                                                        placeholder='Enter TIN'
                                                                        required={isPanOrFormReq}
                                                                        name={'tin'}
                                                                        onBlurCapture={() => { if (!validateTIN(PartyDetails.tin) && PartyDetails.tin != "") { ShowMessagePopup(false, "Enter Valid TIN Number", ""); setPartyDetails({ ...PartyDetails, tin: "" }); } }}
                                                                        value={PartyDetails.tin}
                                                                        onChange={onChange}
                                                                        capital={true}
                                                                        splChar={false}
                                                                        maxLength={11}
                                                                        onPaste={(e) => e.preventDefault()}
                                                                    />
                                                            : PartyDetails.objectType ==="tan"
                                                                        ?
                                                                        <TableInputText
                                                                            type='text'
                                                                            disabled={(PartyDetails?.objectType == "form60" || PartyDetails?.objectType == ""  || PartyDetails?.disableTan || loginDeatils?.loginEmail == 'APIIC'&&PartyDetails?.operation == 'Edit' && PartyDetails?.partyType == "Govt Institutions" && PartyDetails.representType === "Executant") ? true : false}
                                                                            placeholder='Enter TAN'
                                                                            required={isPanOrFormReq}                                                           
                                                                            name={'tan'}
                                                                            onBlurCapture={() => { if (!validateTAN(PartyDetails.tan) && PartyDetails.tan != "") { ShowMessagePopup(false, "Enter Valid TAN Number", ""); setPartyDetails({ ...PartyDetails, tan: "" }); } }}
                                                                            value={PartyDetails.tan}
                                                                            onChange={onChange}
                                                                            capital={true}
                                                                            splChar={false}
                                                                            onPaste={(e) => e.preventDefault()}
                                                                        />
                                                            : PartyDetails.objectType ==="pan" || PartyDetails.objectType ==="form60" ?
                                                                            <TableInputText
                                                                                type='text'
                                                                                disabled={(PartyDetails?.objectType == "form60" || PartyDetails?.objectType == "" || (passportname && passportstatus) || disablePAN || PartyDetails?.disablePan ||  (loginDeatils?.loginEmail === 'APIIC' && PartyDetails.operation == 'Edit' && PartyDetails.representType  === "Executant"))||  isApiicaadharvalidated? true : false}
                                                                                placeholder='Enter PAN'
                                                                               required={isPanOrFormReq} 
                                                                                // required={true}
                                                                                name={'panNoOrForm60or61'}
                                                                                onBlurCapture={checkPanValidation}
                                                                                value={PartyDetails.panNoOrForm60or61}
                                                                                onChange={onChange}
                                                                                capital={true}
                                                                                splChar={false}
                                                                                onPaste={(e) => e.preventDefault()}

                                                        />:""
                                                        }
                                                    </div>
                                                </Col>
                                            }
                                            {(PartyDetails?.partyType === "Public" || PartyDetails?.sezParty || ((PartyDetails?.partyType == "NRI") && ((PartyDetails?.partyType === "NRI"?aadharStatus:true) || PartyDetails.operation === "Edit" || PartyDetails.operation === "View") )) && (PartyDetails?.isLinkedDocDetails ==false || PartyDetails?.isLinkedDocDetails ==undefined) && 
                                                <>
                                                <Col lg={4} md={6} xs={12}>
                                                     <TableText label={"Aadhaar Number [ఆధార్ సంఖ్య]"} required={((PartyDetails?.partyType == "NRI" || PartyDetails?.partyType == "OCI" || (multiNames.length > 0)) ? false : !isAadhaarMandatory)} LeftSpace={false} />
													{   
                                                    enableDetails ? 
                                                        <TableInputText disabled={true} type='text' required={!isAadhaarMandatory} placeholder="" value={PartyDetails.wa ==="Aadhar With OTP" ? "XXXX XXXX " + String(PartyDetails.aadhaar).substring(8, 12) : ''} name="" splChar={false} onChange={onChange} />
                                                    :
                                                    multiNames.length > 0 ?
                                                            <TableInputText disabled={PartyDetails.operation === "Edit" || PartyDetails.operation === "View" ? true : false} type='text' maxLength={12} required={false} placeholder="Enter Aadhar number" value={PartyDetails.aadhaar} name="aadhaar" splChar={false} onChange={onChange} />
                                                        :
                                                    flag && PartyDetails.operation != "Add" && PartyDetails.wa ==="Aadhar Without OTP" && PartyDetails?.aadhaar != null && String(PartyDetails?.aadhaar).length === 12
                                                        ?
                                                        <TableInputText disabled={PartyDetails.operation === "Edit" || PartyDetails.operation === "View" ||isAadharValidated || isApiicaadharvalidated ? true : false} type='text' required={!isAadhaarMandatory} placeholder="" value={"XXXX XXXX " + String(PartyDetails.aadhaar).substring(8, 12)} name="" splChar={false} onChange={onChange} />
                                                        :
													    flag  && (PartyDetails.wa ==="Aadhar With OTP" || PartyDetails?.partyType == "NRI" || PartyDetails?.partyType == "OCI") && PartyDetails?.aadhaar !== null && String(PartyDetails?.aadhaar).length === 12
                                                            ?
                                                            <TableInputText disabled={true} type='text' required={true} placeholder="" value={"XXXX XXXX " + String(PartyDetails.aadhaar).substring(8, 12)} name="" splChar={false} onChange={onChange} />
													: PartyDetails.operation === "View" || PartyDetails.operation === "Edit"?
                                                                <TableInputText type='number' disabled={true} required={true} placeholder="Enter Aadhaar number" value={PartyDetails.aadhaar} name="" maxLength={12} onChange={onChange} /> :
                                                                <TableInputText type='number' disabled={PartyDetails?.sezParty ? true : isAadharValidated || isApiicaadharvalidated } required={(PartyDetails?.partyType == "NRI" || PartyDetails?.partyType == "OCI") ? false : !isAadhaarMandatory} placeholder="Enter Aadhaar number" value={PartyDetails.aadhaar} name="aadhaar" maxLength={12} onChange={onChange} />

                                                    }
                                                    {
                                                        tidco && PartyDetails.aadhaar.length == 12  && <span style={{color: "red", fontSize:"11px"}}><b>Note:</b> Aadhaar OTP verification is optional for the <b>TIDCO</b> document.</span> 
                                                    }
                                                    {
                                                        (PartyDetails?.wa === "Aadhar Without OTP" && PartyDetails?.PartyType === "CLAIMANT" && GetstartedDetails?.documentNature?.TRAN_MAJ_CODE == '05' && GetstartedDetails?.documentNature?.TRAN_MIN_CODE == '05') && PartyDetails.aadhaar.length == 12  && <span style={{color: "red", fontSize:"11px"}}><b>Note:</b> Aadhaar OTP verification is optional for the <b>RTDM</b> document.</span> 
                                                    }
                                                </Col>
                                                {
                                                 PartyDetails?.sezParty ?
                                                    <></>
                                                    :
                                                    !PartyDetails?.isRepChecked && (((PartyDetails?.partyType == "NRI" || PartyDetails?.partyType == "OCI" || PartyDetails.operation !== "Edit" )&& !isAadharValidated ) && String(PartyDetails.aadhaar).length == 12) && 
                                                <>
                                                {aadharOtpSent && <>
                                                    <Col lg={2} md={3} xs={6}>
                                                    <TableText label={"OTP"} required={true} LeftSpace={false} />
                                                    <TableInputText  type='number' splChar={false} dot={false} placeholder='XXXXXX' required={false} name={'aadharOTP'} value={PartyDetails.aadharOTP} onChange={onChange} />
                                                    </Col>
                                                    <Col lg={1} md={3} xs={6}>
                                                    <button type="button" className="otpButton" onClick={handleOTPEnter}>Verify</button>
                                                    </Col>
                                                </>
                                                }
                                              {loginDeatils?.loginName === "APIIC" && (PartyDetails?.PartyType === "CLAIMANT" ||   PartyDetails?.operation === 'View'  ||  PartyDetails?.representSubType == 'Claimant' )   ? (<></>) : (
                                                <>
                                                {multiNames.length === 0 && (loginDeatils?.loginEmail === 'APIIC' && PartyDetails?.operation === "AddRep" && PartyDetails?.representSubType === "Executant" ? !showSendOtpButton : showSendOtpButton) && (
                                                     <Col lg={1} md={3} xs={6}>
                                                     <button type="button" onClick={(loginDeatils?.loginEmail === 'APIIC' && PartyDetails?.operation === "AddRep" && PartyDetails?.representSubType === "Executant" && !aadharOtpSent) ? handleAadharConsentConfirmPopup : handleSentAadharOTP}  className={"otpButton"}> {aadharOtpSent ? "Resend OTP" : "Send OTP"} </button> </Col> 
                                                    )}
                                                 </>
                                                 )}

                                               
                                                </>
                                                }                                                
                                              </>
                                            }
                                            {PartyDetails?.partyType === "Public" && PartyDetails?.isLinkedDocDetails == true &&
                                                <Col lg={4} md={6} xs={12}>
                                                    <TableText label={"Aadhaar Number [ఆధార్ సంఖ్య]"} required={true} LeftSpace={false} />
													{	flag && PartyDetails?.aadhaar !== null && String(PartyDetails?.aadhaar).length === 12 ? 
                                                        <TableInputText disabled={true} type='text' required={true} placeholder="" value={"XXXX XXXX " + String(PartyDetails.aadhaar).substring(8, 12)} name="" splChar={false} onChange={onChange} />
                                                        :
                                                        <TableInputText disabled={isAadharValidated} type='number' required={true} placeholder="Enter Aadhaar number" value={PartyDetails.aadhaar} name="aadhaar" splChar={false} maxLength={12} onChange={onChange} />
                                                    }
                                                </Col>
                                            }
                                            { PartyDetails?.partyType !== "Deceased" && !(PartyDetails.PartyType === "WITNESS" && loginDeatils?.loginMode === "VSWS") && !((PartyDetails.operation === "Edit" || PartyDetails.operation === "View") && PartyDetails.partyCode === "WT" && loginDeatils?.loginMode === "VSWS")  &&
                                                <>
                                                    <Col lg={4} md={6} xs={12}>
                                                        <TableText label={"Email ID [ఇమెయిల్ ఐడి]"} required={false} LeftSpace={false} />
                                                        <TableInputText disabled={PartyDetails?.sezParty ? true : enableDetails || PartyDetails.operation == "View" ? true : false} onBlurCapture={e => { e.preventDefault(); if (!ValidateEmail(e.target.value)) { setPartyDetails({ ...PartyDetails, email: '' }) } }} type='email' placeholder='Enter Email ID' required={false} name={'email'} value={PartyDetails.email} onChange={onChange} />
                                                    </Col>
                                                    <Col lg={4} md={6} xs={12} className='mb-2'>
                                                        <TableText label={"Mobile No. [మొబైల్ నెం.]"} required={true} LeftSpace={false} />
                                                        <TableInputText
                                                            disabled={PartyDetails?.sezParty ? true : 
                                                                enableDetails || PartyDetails.operation === "View" || isMobileOtpVerified  || PartyDetails?.disablePan || PartyDetails?.disableTan || PartyDetails?.disableTin || isApiicaadharvalidated || loginDeatils?.loginEmail == 'APIIC'&& (PartyDetails?.operation == 'Edit' && PartyDetails?.partyType == "Govt Institutions" && PartyDetails.representType === "Executant") }
                                                            type='number'
                                                            onBlurCapture={e => { e.preventDefault();if (loginDeatils?.loginEmail === "APIIC" && PartyDetails?.PartyType === 'EXECUTANT') {} else {{if (!ValidMobile(e.target.value)) { setPartyDetails({ ...PartyDetails, phone: '' }); } }}}}
                                                            splChar={false}
                                                            dot={false}
                                                            placeholder='10 Digit Mobile Number'
                                                            required={true}
                                                            name={'phone'}
                                                            value={ (loginDeatils?.loginEmail === "APIIC" && PartyDetails?.representType === 'Executant' && (PartyDetails.operation === "View" || PartyDetails.operation === "Edit")) ?`0${PartyDetails?.phone}`: PartyDetails.phone}
                                                            onChange={onChange}
                                                            min={10}
                                                        />
                                                        {
                                                            (PartyDetails?.PartyType == "CLAIMANT" && GetstartedDetails?.documentNature?.TRAN_MAJ_CODE == '05' && GetstartedDetails?.documentNature?.TRAN_MIN_CODE == '05') && PartyDetails.phone.length == 10  && <span style={{color: "red", fontSize:"11px"}}><b>Note:</b> Mobile OTP verification is optional for the <b>RTDM</b> document.</span> 
                                                        }
                                                    </Col>
                                                </>
                                            }
                                            { loginDeatils?.loginEmail === 'APIIC' && (PartyDetails.PartyType === "CLAIMANT" || PartyDetails?.representSubType == 'Claimant' || PartyDetails?.operation == 'Edit') ?<></>:<>
                                                {(PartyDetails.PartyType === "CLAIMANT" || PartyDetails.representSubType === "Claimant" || PartyDetails.representType === "Claimant") && (
                                                <>
                                                    {!mobileOtpSent && !isMobileOtpVerified  && PartyDetails.phone.length === 10 ?(
                                                        <Col lg={4} md={6} xs={12} className='mt-4'>
                                                            <Button onClick={MobileOtp}>Send OTP</Button>
                                                        </Col>
                                                    ) : (
                                                        mobileOtpSent && !isMobileOtpVerified && (
                                                            <>
                                                                <Col lg={2} md={3} xs={6} className=''>
                                                                    <TableText label={"OTP"} required={true} LeftSpace={false} />
                                                                    <TableInputText
                                                                        type='number'
                                                                        splChar={false}
                                                                        dot={false}
                                                                        placeholder='XXXXXX'
                                                                        required={false}
                                                                        name={'mobileOTP'}
                                                                        value={PartyDetails.mobileOTP}
                                                                        onChange={onChange}
                                                                        maxLength={6}
                                                                        disabled={isMobileOtpVerified}
                                                                    />
                                                                </Col>
                                                                <Col lg={1} md={3} xs={6} className=''>
                                                                    <Button
                                                                        type="button"
                                                                        className="otpButton"
                                                                        onClick={handleMobileOTPVerification}
                                                                        style={{ display: isMobileOtpVerified ? 'none' : 'block' }}
                                                                    >
                                                                        Verify
                                                                    </Button>
                                                                </Col>
                                                                <Col lg={3} md={3} xs={6} className=''>
                                                                    <Button
                                                                        type="button"
                                                                        className="otpButton"
                                                                        onClick={MobileOtp}
                                                                         disabled={PartyDetails.phone.length !== 10}
                                                                        style={{ display: isMobileOtpVerified ? 'none' : 'block' }}
                                                                    >
                                                                        Resend OTP
                                                                    </Button>
                                                                </Col>
                                                            </>
                                                        )
                                                    )}
                                                </>
                                            )}
                                            </>}
                                         
                                            { /*{GetstartedDetails?.registrationType?.TRAN_MAJ_CODE == "04" && PartyDetails.operation !="AddRep"  ?
                                                <Col lg={4} md={6} xs={12} className='mb-2'>
                                                    <TableText label={"Party Number [పార్టీ నెంబర్]*"} required={true} LeftSpace={false} />
                                                    <TableInputText disabled={PartyDetails.operation == "View"  ? true : false} type='number' placeholder='Enter Number' required={true} name={'share'} value={PartyDetails.share} splChar={false} otpChar={false} onChange={onChange} maxLength={10} />
                                                </Col> : null
                                            } */}
                                            <Col>
                                            {(ShareRls == true && PartyDetails?.representType == "Releasor" )   ? 
                                                    <div>
                                                        <Row>
                                                            <TableText label={"Share [వాటా]"} required={true} LeftSpace={false} />
                                                            <div className='d-flex shareInfo'>
                                                                <TableInputText disabled={PartyDetails.operation == "View" ? true : false} type='text' placeholder='Enter Share' required={true} name={'shareRelesor'} value={PartyDetails.shareRelesor} onChange={onChange} maxLength={10} /><span>/</span>
                                                                <TableInputText disabled={PartyDetails.operation == "View" ? true : false} type='text' placeholder='Total Share' required={true} name={'totalShare'} value={PartyDetails.totalShare} onChange={onChange} maxLength={10} />
                                                            </div>
                                                        </Row>
                                            </div>:null}
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col lg={6} md={6} xs={12}>
                                                <div>
                                                    <TableText label={"Permanent Address [శాశ్వత చిరునామా]"} required={true} LeftSpace={false} />
                                                    <TableInputLongText disabled={ PartyDetails?.sezParty ? true :enableDetails || PartyDetails.operation == "View" || loginDeatils?.loginEmail== 'APIIC' && (PartyDetails?.operation == 'Edit' && PartyDetails.representType === "Executant" || PartyDetails?.operation == 'Add' && PartyDetails?.PartyType == "EXECUTANT") && PartyDetails?.partyType == "Govt Institutions" ? true : false} required={true} maxLength={150} placeholder='Complete Address' name={'address'} value={PartyDetails.address} onChange={onChange} />
                                                </div>
                                            </Col>
                                            <Col lg={6} md={6} xs={12}>
                                                {PartyDetails.operation == "View" ?
                                                    <div>
                                                        <div className={styles.currentcheckbox}>
                                                            <TableText label={"Current Address [ప్రస్తుత చిరునామా]"} required={true} LeftSpace={false} />
                                                        </div>
                                                        <TableInputLongText disabled={PartyDetails.operation == "View" ? true : CheckedCurrentAddress} maxLength={300} required={true} placeholder='Complete Address' name={'currentAddress'} value={PartyDetails.currentAddress} onChange={onChange} />
                                                    </div>
                                                    :
                                                    <div>
                                                        <div className={styles.currentcheckbox}>
                                                            <input type="checkbox" className={styles.selectbox} defaultChecked={CheckedCurrentAddress} onChange=
                                                                {() => {
                                                                    if (!CheckedCurrentAddress) {
                                                                        setPartyDetails({ ...PartyDetails, currentAddress: PartyDetails.address, checkbox: !PartyDetails?.checkbox })
                                                                    }
                                                                    setCheckedCurrentAddress(!CheckedCurrentAddress);
                                                                }}
                                                                checked={CheckedCurrentAddress} />
                                                            <TableText label={"Same as Permanent Address, Current Address [ప్రస్తుత చిరునామా]"} required={true} LeftSpace={false} />
                                                        </div>
                                                        <TableInputLongText disabled={PartyDetails?.sezParty ? true : enableDetails || PartyDetails.operation == "View" || loginDeatils?.loginEmail== 'APIIC' &&  PartyDetails?.operation == 'Add' && PartyDetails?.partyType == "Govt Institutions" && PartyDetails?.PartyType == "EXECUTANT" ? true : CheckedCurrentAddress} required={true} maxLength={150} placeholder='Complete Address' name={'currentAddress'} value={PartyDetails.currentAddress} onChange={onChange} />
                                                    </div>
                                                }
                                            </Col>
                                        </Row>
                  {PartyDetails.partyType ==='Deceased' && <><div className={styles.mainTabs}>
                    <div className={`${styles.mainContainer} ${styles.ListviewMain}`}>
                        <Row className={styles.tabHeadContainer}>
                            <Col lg={6} md={6} xs={6}>
                                <div className={styles.addCusText}>
                                    {GetstartedDetails?.documentNature?.TRAN_MAJ_CODE == "04" && 
                                        <p className={styles.tabText}> Attach Enclosures [ఎన్‌క్లోజర్‌లను అటాచ్ చేయండి] </p>}
                                </div>
                            </Col>
                            <Col lg={6} md={6} xs={6} className='text-end'>
                            <div className='uploadInputCon'>
                            <input className="uploadInput" type="file" name="deceasedPartyFile" accept=".jpg,.jpeg,.png,.pdf" onChange={onChange} />
                            </div>
                            </Col>
                      </Row>
                             {/* {PartyDetails.partyType !=='Deceased' &&  */}
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
                                                    <tr>
                                                        <td>1</td>
                                                        <td>{PartyDetails?.deceasedPartyFile?.name}</td>
                                                        <td>
                                                            {/* <div id="text" className={`${styles.actionTitle} ${styles.actionbtn}`} style={{ cursor: 'pointer' }} onClick={() => { window.open(process.env.BACKEND_URL + "/pdeapi/pdfs/" + singleFile.downloadLink) }}> */}
                                                            <div id="text" className={`${styles.actionTitle} ${styles.actionbtn}`} style={{ cursor: 'pointer' }} onClick={() => { DocumentPreview(PartyDetails) }}>
                                                                <Image alt="Image" height={18} width={14} src='/PDE/images/view-icon.svg' className={styles.tableactionImg} />
                                                                <span className={styles.tooltiptext}>View</span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                        </tbody>
                                    </Table>
                                </div>
                            </div>
                        </div>
                        <div className={styles.notestyle}>
                            <span>Note:</span>
                            <ul>
                                {
                                    ["The presented document should be tallied with the uploaded document. If any discrepancy is there SR has the right to reject it", "Upload document only in PDF with A4 size", "The document size must be less than 1MB for upload", "Scanned Documents are not allowed", "Check the clarity & quality of the document before uploading"].map((l, ind) => {
                                        return <li key={ind}>{l}</li>
                                    })
                                }
                            </ul>
                        </div>
                    </div>
                </div> </>}
                                        <Row>
                                            {PartyDetails.operation == "View" ?
                                                <Col lg={12} md={12} xs={12} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <div onClick={() => router.push("/PartiesDetailsPage")} style={{ cursor: "pointer" }} className='proceedButton'>Back</div>

                                                </Col>
                                                : <Col lg={12} md={12} xs={12} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <div onClick={() => {localStorage.removeItem("SEZRepresentative"); router.push("/PartiesDetailsPage")}} className='proceedButton cancelBtn' style={{ cursor: 'pointer' }}>Cancel</div>
                                                    {(PartyDetails?.partyType !== "NRI") ?(
                                                        <div className={styles.GetsingleColumn}>
                                                            {PartyDetails.operation == "Edit" ? (
                                                                <button className="proceedButton">Update</button>
                                                            ) : (
                                                                <button className="proceedButton">Save</button>
                                                            )}
                                                        </div>
                                                    ) : passportcheck.data &&
                                                        passportcheck.data !== "" &&
                                                        passportcheck.data.pan_status === "E" && passportcheck.data.name === "Y" && passportcheck.data.dob ==="Y"? (
                                                        <div className={styles.GetsingleColumn}>
                                                            {PartyDetails.operation == "Edit" ? (
                                                                <button className="proceedButton">Update</button>
                                                            ) : (
                                                                <button className="proceedButton">Save</button>
                                                            )}
                                                        </div>
                                                    ) : (PartyDetails?.partyType == "NRI") && PartyDetails.operation == "Edit" ? (
                                                        <div className={styles.GetsingleColumn}>
                                                            <button className="proceedButton">Update</button>
                                                        </div>
                                                    ) : null}

                                                </Col>
                                            }
                                        </Row>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </Col>
                </Row>
            </Container>
            <Modal className=" d-flex justify-content-between align-items-center" show={showModal} onHide={() => setShowModal(false)} size='lg' centered>
                <Modal.Header className="modal-header-block d-flex justify-content-between align-items-center">
                    <div className="flex-grow-1 text-center" style={{ position: 'relative' }}>
                        <span className="fw-bold text-decoration-underline text-white">Aadhaar Details</span>
                    </div>
                    <ImCross
                        onClick={() => setShowModal(false)}
                        className={`${Popstyles.crossButton} text-white`}
                        style={{ cursor: 'pointer' }}
                    />
                </Modal.Header>
                <Modal.Body>
                    {PartyDetails.aadharDetails ? (
                        <div className="p-3" style={{ fontSize: '13px', border: '1px solid #ccc', borderRadius: '8px' }}>
                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <strong>Name:</strong> {PartyDetails.aadharDetails.name ?? '-'}
                                </div>
                                <div className="col-md-6">
                                    <strong>C/O:</strong> {PartyDetails.aadharDetails.co ?? '-'}
                                </div>
                            </div>
                            <div className="row mb-3 align-items-center">
                                <div className="col-md-6">
                                    <strong>Photo:</strong><br />
                                    <img
                                        src={`data:image/jpeg;base64,${PartyDetails.aadharDetails.encodedPhoto || ''}`}
                                        alt="Photo"
                                        style={{ height: '80px', width: '80px', objectFit: 'cover', border: '1px solid #ccc' }}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <strong>Address:</strong><br />
                                    <span style={{ whiteSpace: 'pre-line' }}>
                                        {[
                                            PartyDetails.aadharDetails.house,
                                            PartyDetails.aadharDetails.lm,
                                            PartyDetails.aadharDetails.loc,
                                            PartyDetails.aadharDetails.dist,
                                            PartyDetails.aadharDetails.vtc,
                                            PartyDetails.aadharDetails.pc ? '-' + PartyDetails.aadharDetails.pc : ''
                                        ]
                                            .filter(Boolean)
                                            .join(',\n') || '-'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center">
                            <strong>No Aadhaar details available</strong>
                        </div>
                    )}
                </Modal.Body>

                <Modal.Footer>
                </Modal.Footer>
            </Modal>
            {popUp && <Container>
                <div className={Popstyles.reportPopup}>
                    <div className={Popstyles.container}>
                        <div className={Popstyles.Messagebox}>
                            <div className={Popstyles.header}>
                                <div className={Popstyles.letHeader} >
                                    <p className={Popstyles.text}>Document</p>
                                </div>
                                <div>
                                    <ImCross onClick={OnCancelAction} className={Popstyles.crossButton} />
                                </div>
                            </div>
                            <div style={{ paddingLeft: '1rem', paddingRight: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }} className={Popstyles.popupBox}>
                                {/* {PopupMemory.type ? */}
                                <div className={Popstyles.SuccessImg}>
                                    {/* <Image alt='' width={60} height={60} className={Popstyles.sImage} src="/PDE/images/success-icon.png" /> */}
                                    <div className={Popstyles.docText}>
                                        Same Aadhaar number already Entered!
                                    </div>
                                    <div className={Popstyles.docText}>
                                        Do you want to Proceed?
                                    </div>
                                    <div className='text-center d-flex'>
                                                <button className={Popstyles.yesBtn} onClick={()=>onClickDocs('Y')}>YES</button>
                                                <button className={Popstyles.noBtn} onClick={()=>onClickDocs('N')}>NO</button>
                                    </div>
                                </div>
                                <p className={Popstyles.message}></p>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>}

             <div>
                <Modal show={ociInfo} onHide={handleClose} animation={false} size="lg" aria-labelledby="contained-modal-title-vcenter" centered className='ociModalInfo'>
                    <Modal.Header closeButton>
                        <Modal.Title>OCI Passport Sample File</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                            <div className='ociModalCon'>
                                <Row>
                                    <Col lg={6} md={6} xs={12}><img src="/PDE/images/oci_card.jpg" /></Col>
                                    <Col lg={6} md={6} xs={12}><img src="/PDE/images/oci_card_1.jpg" /></Col>
                                </Row>
                             </div>
                    </Modal.Body>
                </Modal>
            </div>

            {showPanValidationDialog && (
                <PanValidationDialog
                    PartyDetails={PartyDetails}
                    setDisablePAN={setDisablePAN}
                    setPartyDetails={setPartyDetails}
                    setShowPanValidationDialog={setShowPanValidationDialog}
                />
            )}
            {showPanDuplicationDialog && (
                <PanDuplicationDialog
                    PartyDetails={PartyDetails}
                    setPartyDetails={setPartyDetails}
                    setShowPanValidationDialog={setShowPanValidationDialog}
                    setShowPanDuplicationDialog={setShowPanDuplicationDialog}
                />
            )}

            <div>
                <Modal show={!ApiicAadhaarAddRepExCondition ? showAadharConsentConfirmPopup : showAadharConsentPlayerVoicePopup} aria-labelledby="contained-modal-title-vcenter" centered className='mutablemodalCon' >
                    <Modal.Header className='mutablemodalHeader'>
                        <Row className='w-100'>
                            <Col lg={10} md={10} xs={12}><Modal.Title>Aadhaar Consent Confirmation</Modal.Title></Col>
                            <Col lg={2} md={2} xs={2} className='text-end'>
                                <div className="d-flex align-items-center ms-2">
                                    {!ApiicAadhaarAddRepExCondition ? (
                                        <audio ref={audioRef} src="/PDE/AadharConsentTeluguAudio.mp3" preload="auto" />
                                    ) : ("")}
                                    {(ApiicAadhaarAddRepExCondition ? voicePlayerStatus === "idle" : voiceStatus === "idle") ? (
                                        <span title="Play Voice">
                                            <Volume2 size={22} style={{ color: "white", cursor: "pointer" }} onClick={() => ApiicAadhaarAddRepExCondition ? togglePlayerVoice(Consent1) : toggleVoice(Consent2_Eng)} />
                                        </span>
                                    ) : (ApiicAadhaarAddRepExCondition ? voicePlayerStatus === "paused" : voiceStatus === "paused") ? (
                                        <span title="Resume Voice">
                                            <PlayCircle size={24} style={{ color: "white", cursor: "pointer" }} onClick={() => ApiicAadhaarAddRepExCondition ? togglePlayerVoice(Consent1) : toggleVoice(Consent2_Eng)} />
                                        </span>
                                    ) : (
                                        <span title="Pause Voice">
                                            <PauseCircle size={24} style={{ color: "white", cursor: "pointer" }} onClick={() => ApiicAadhaarAddRepExCondition ? togglePlayerVoice(Consent1) : toggleVoice(Consent2_Eng)} />
                                        </span>
                                    )}     
                                    <span className="wrong-symbol ms-2 " onClick={handleAadharConsentConfirmNo} style={{color: 'white',fontSize: '18px',cursor: 'pointer',}} title="Go to Back"><b>✖</b></span>
                                </div>
                            </Col>
                        </Row>
                    </Modal.Header>
                    <Modal.Body className='aadhaarconaccptInfo'>
                        <div>
                            <Accordion defaultActiveKey="0">
                                <Accordion.Item eventKey="0">
                                    <Accordion.Body>
                                        <div className="form-check">
                                            <input type="checkbox" className="form-check-input" id="confirmCheckbox" checked={aadharConsentCheckboxChecked} onChange={() => setAadharConsentCheckboxChecked(!aadharConsentCheckboxChecked)} />
                                            {ApiicAadhaarAddRepExCondition ? (
                                               <p>{Consent1}</p> 
                                            ) : (
                                                <>
                                                    <p>{Consent2_Eng}</p>
                                                    <p>{Consent2_Tel}</p>
                                                </>
                                            )}
                                        </div>
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <div className={styles.pdesingleColumn}>
                            <Button type='submit' onClick={handleAadharConsentConfirmYes}>Yes</Button>
                        </div>
                    </Modal.Footer>
                </Modal>
            </div>

        </div>
    )
}

export default AddPartyPage;

import React, { useEffect, useRef, useState } from 'react'
import { useAppSelector, useAppDispatch } from './redux/hooks';
import { PopupAction, AadharPopupAction, DeletePopupAction, LoadingAction, PreviewDocAction,GooglemapAction } from './redux/commonSlice';
import { store } from "./redux/store";
import { saveLoginDetails } from '../src/redux/loginSlice';
import { useRouter } from 'next/router';
import MasterData from './MasterData'
import { UseGetLocationDetails, UseUpdateDocument } from './axios';
import { decryptWithAES, encryptWithAES } from './utils';
import CryptoJS from "crypto-js";

export const encodeBase64 = (value: string): string => {
  const bytes = new TextEncoder().encode(value);
  let binary = '';
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return window.btoa(binary);
};



export const ShowMessagePopup = (type, message, redirectOnSuccess, time?) => {
  store.dispatch(PopupAction({ enable: true, type: type, message: message, redirectOnSuccess, time: time ? time : null }));
}

export const ShowPreviewPopup = () => {
	let data = localStorage.getItem("GetApplicationDetails");
	let appData = JSON.parse(data);
  	store.dispatch(PreviewDocAction({ enable: true,docProcessType:appData.docProcessType}));
}

export const AadharencryptData = (data) => {
  const parsedkey = CryptoJS.enc.Utf8.parse(process.env.ENC_SECRET_KEY);
  const iv = CryptoJS.enc.Utf8.parse(process.env.ENC_SECRET_IV);
  const encrypted = CryptoJS.AES.encrypt(data, parsedkey, { iv: iv, mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
  let encryptedData = Buffer.from(encrypted.toString()).toString('base64');
  return encryptedData;
}

// export const ShowConfirmPopup = (message, redirectOnSuccess) => { 
//     dispatch(PopupAction({ enable: true, message: message, redirectOnSuccess })); 
// }


export const ShowAadharPopup = (op = '') => {
  store.dispatch(AadharPopupAction({ enable: true, status: false, response: false, data: {}, op }));
}

export const Loading = (value: boolean) => { store.dispatch(LoadingAction({ enable: value })); }

export const CallingAxios = async (myFunction) => {
  Loading(true);
  let result = await myFunction;
  Loading(false);
  return result;
}


// const validateForm = () => {
//     let isInvalid = false;
//     Object.keys(error).forEach((x) => {
//       const errObj = error[x];
//       if (errObj.errorMsg) {
//         isInvalid = true;
//       } else if (errObj.isReq && !form[x]) {
//         isInvalid = true;
//         onInputValidate(true, x);
//       }
//     });
//     return !isInvalid;
//   };

export const KeepLoggedIn = () => {
  let data: any = localStorage.getItem("LoginDetails");
  // console.log(data);
  data = JSON.parse(data)
  if (data && data.token) {
    store.dispatch(saveLoginDetails(data));
    return true;
  } else {
    localStorage.clear();
    return false;
  }
}


export const DocumentClaimantMapper = (singleParty: any) => {
  if (!singleParty) { return {} }
  let partyMapData = {
    name: singleParty.INDGP_NAME ? singleParty.INDGP_NAME : "",
    relationType: singleParty.R_CODE ? singleParty.R_CODE + "/O" : "",
    relationName: singleParty.R_NAME && singleParty.R_NAME.includes('/O') === true? singleParty.R_NAME.substring(4) : singleParty.R_NAME,
    representType: "Executant",
    representSubType: singleParty.myRepresentSubType,
    represent: [],
    age: singleParty.AGE ? singleParty.AGE : "",
    panNoOrForm60or61: singleParty.PAN_NAME ? singleParty.PAN_NAME : "",
    tan: "",
    aadhaar: singleParty.AADHAR ? singleParty.AADHAR : "",
    email: singleParty.EMAIL_ID ? singleParty.EMAIL_ID : "",
    phone: singleParty.PHONE_NO ? singleParty.PHONE_NO : "",
    address: singleParty.ADDRESS ? singleParty.ADDRESS : "",
    currentAddress: singleParty.ADDRESS ? singleParty.ADDRESS : "",
    isPresenter: false,
    partyType: "Public"
  }
  return partyMapData;
}

export const DocumentPropertyMapper = async (SingleProperty: any) => {
  // window.alert("in");
  let structure = (SingleProperty && SingleProperty.structure) ? SingleProperty.structure : [];
  let NewStructure = [];
  structure && structure.map(singleStructure => {
    NewStructure.push({
      floorNo: Number(singleStructure.FLOOR_NO) ? "Floor No -" + singleStructure.FLOOR_NO : singleStructure.FLOOR_NO == null ? 0 : singleStructure.FLOOR_NO,
      structureType: MasterValuedentifier("structureType", singleStructure.STRU_TYPE),
      plinth: singleStructure.PLINTH ? singleStructure.PLINTH : 100,
      plinthUnit: singleStructure.UNIT == "F" ? "SQ. FEET [చదరపు అడుగులు]" : "SQ. YARD [చదరపు గజం]",
      stageOfCons: MasterValuedentifier("StageOfCons", singleStructure.STAGE_CODE),
      age: singleStructure.AGE ? singleStructure.AGE : 0
    })
  })
  let LocationData: any = {};
  if (SingleProperty?.SR_CODE) {
    LocationData = await UseGetLocationDetails(SingleProperty.SR_CODE)
    if (LocationData.status) {
      LocationData = LocationData.data[0]
    }
  }
  if (!SingleProperty) { return {}; }
  let PropertyData = {
    amount: SingleProperty.CON_VALUE1 ? SingleProperty.CON_VALUE1 : "",
    executionDate: SingleProperty.E_DATE ? SingleProperty.E_DATE.split("T")[0] : "",
    stampPaperValue: "",
    stampPurchaseDate: SingleProperty.REGN_DT ? SingleProperty.REGN_DT.split("T")[0] : "",
    localBodyType: MasterValuedentifier("localBody", SingleProperty.local_body),
    localBodyCode: LandandLocalBodyCodeIdentifier("localBody", SingleProperty.local_body),
    localBodyTitle: "",
    localBodyName: SingleProperty.COLONY ? SingleProperty.COLONY : "",
    mandal: LocationData?.mandalName ? LocationData.mandalName : "",
    mandalCode: LocationData?.mandalCode ? LocationData.mandalCode : "",
    district: LocationData?.distName ? LocationData.distName : "",  // districr abv
    districtCode: LocationData?.distCode ? LocationData.distCode : "",
    sroOffice: LocationData?.sroName ? LocationData.sroName : "",  // sro from abv
    propertyType: (SingleProperty.nature_use == 21 || SingleProperty.nature_use == 26 || SingleProperty.nature_use == 45 || SingleProperty.nature_use == 46 || SingleProperty.nature_use == 30) ? 'RURAL(AGRICULTURE) [గ్రామీణ (వ్యవసాయ భూమి)]' : 'URBAN(PLOTS/HOUSE/FLATS..ETC) [పట్టణ (స్థలము/అపార్ట్ మెంట్/ఇల్లు)]',
    ExtentList: [],
    schedulePropertyType: (SingleProperty.nature_use == 21 || SingleProperty.nature_use == 26 || SingleProperty.nature_use == 45 || SingleProperty.nature_use == 46 || SingleProperty.nature_use == 30) ? "" : SingleProperty.FLAT_NO ? "FLAT [ఫ్లాట్]" : "HOUSE [ఇల్లు]",
    landUse: MasterValuedentifier("landUse", SingleProperty.nature_use),
    landUseCode: LandandLocalBodyCodeIdentifier("landUse", SingleProperty.nature_use),
    village: SingleProperty.VILLAGE ? SingleProperty.VILLAGE : "",
    locality: "",
    ward: SingleProperty.WARD_NO ? SingleProperty.WARD_NO : 0,
    block: SingleProperty.BLOCK_NO ? SingleProperty.BLOCK_NO : 0,
    doorNo: SingleProperty.HNO ? SingleProperty.HNO : "",
    plotNo: SingleProperty.PNO1 ? SingleProperty.PNO1 : "",
    survayNo: SingleProperty.SY1 ? SingleProperty.SY1 : "",
    ptinNo: "",
    extent: SingleProperty.EXTENT1 ? SingleProperty.EXTENT1.split(" ")[0] : "",
    extentUnit: SingleProperty.EXTENT1 ? SingleProperty.EXTENT1.split(" ")[1] : "",
    units: "",
    layoutNo: SingleProperty.FLAT_NO ? SingleProperty.FLAT_NO : "",
    layoutName: "",
    appartmentName: SingleProperty.AP_NAME ? SingleProperty.AP_NAME : "",
    undividedShare: SingleProperty.BUILT1 ? SingleProperty.BUILT1.split(" ")[0] : "",
    undividedShareUnit: SingleProperty.BUILT1 ? SingleProperty.BUILT1.split(" ")[1] : "",
    flatNo: SingleProperty.FLOOR_NO ? SingleProperty.FLOOR_NO : "",
    flatNorthBoundry: SingleProperty.NORTH ? SingleProperty.NORTH : "",
    flatSouthBoundry: SingleProperty.SOUTH ? SingleProperty.SOUTH : "",
    flatEastBoundry: SingleProperty.EAST ? SingleProperty.EAST : "",
    flatWestBoundry: SingleProperty.WEST ? SingleProperty.WEST : "",
    structure: NewStructure,
    totalFloors: "",
    northBoundry: SingleProperty.NORTH ? SingleProperty.NORTH : "",
    southBoundry: SingleProperty.SOUTH ? SingleProperty.SOUTH : "",
    eastBoundry: SingleProperty.EAST ? SingleProperty.EAST : "",
    westBoundry: SingleProperty.WEST ? SingleProperty.WEST : "",
    isDocDetailsLinked: "",
    landtype: "",
    isMarketValue: "",
    marketValue: SingleProperty.marketValue ? SingleProperty.marketValue : "",
    sroCode: SingleProperty.SR_CODE ? SingleProperty.SR_CODE : "",
    villageCode: SingleProperty.VILLAGE_CODE ? SingleProperty.VILLAGE_CODE : "",
    habitationCode: SingleProperty.hab_code ? SingleProperty.hab_code : "",
    habitation: SingleProperty.HABITATION ? SingleProperty.HABITATION : "",
    jurisdiction:SingleProperty.JURISDICTION ? SingleProperty.JURISDICTION : ""
  }
  // console.log(PropertyData);
  // window.alert(PropertyData);

  return PropertyData;

}


export const DateFormator = (InputDate, format) => {
  if (!InputDate || InputDate == "") { return InputDate }
  // window.alert(InputDate);
  let DateArray = InputDate.split('T')[0].split('-');
  if (DateArray.length == 3) {
    switch (format) {
      case "dd/mm/yyyy": return DateArray[2] + "/" + DateArray[1] + "/" + DateArray[0];
      case "yyyy/mm/dd": return DateArray[0] + "/" + DateArray[1] + "/" + DateArray[2];
      case "yyyy-mm-dd": return DateArray[0] + "-" + DateArray[1] + "-" + DateArray[2];
      case "YYYY-MM-DD": return DateArray[0] + "-" + DateArray[1] + "-" + DateArray[2];
      case "dd-mm-yyyy": return DateArray[2] + "-" + DateArray[1] + "-" + DateArray[0];
      default: return InputDate;
    }
  } else {
    return InputDate;
  }
}

export const MasterCodeIdentifier = (MasterKey, value) => {
  let result = MasterData[MasterKey].find(x => x.desc == value);
  return result ? result.code : null;
}

export const MasterValuedentifier = (MasterKey, code) => {
  let result = MasterData[MasterKey].find(x => x.code == code);
  return result ? result.desc : "";
}
export const LandandLocalBodyCodeIdentifier = (MasterKey, value) => {
  let result = MasterData[MasterKey].find(x => x.code == value);
  return result ? result.code : null;
}

export const DoorNOIdentifier = (data) => {
  let ModifiedData = data;
  if (ModifiedData) {
    if (data.includes(',')) {
      let result = data.split(',');
      if (result[0]) {
        ModifiedData = result[0]
      } else {
        ModifiedData = result[1]
      }
    }
    if (ModifiedData.includes('-')) {
      let result = ModifiedData.split('-');
      return result[result.length - 1];
    }
  }

  return ModifiedData;

}

export const MissingFieldIdentifier = (type: string, subtype: string, data: any) => {
  let errorList = [];
  if (type == "property" && subtype == "urban") {
    data.amount == "" ? errorList.push("amount") : null;
    data.executionDate == "" ? errorList.push("executionDate") : null;
    data.stampPaperValue == "" ? errorList.push("stampPaperValue") : null;
    data.stampPurchaseDate == "" ? errorList.push("stampPurchaseDate") : null;
    data.localBodyType == "" ? errorList.push("localBodyType") : null;
    data.localBodyTitle == "" ? errorList.push("localBodyTitle") : null;
    data.localBodyName == "" ? errorList.push("localBodyName") : null;
    data.district == "" ? errorList.push("district") : null;
    data.sroOffice == "" ? errorList.push("sroOffice") : null;
    data.ExtentList == "" ? errorList.push("ExtentList") : null;
    data.schedulePropertyType == "" ? errorList.push("schedulePropertyType") : null;
    data.landUse == "" ? errorList.push("landUse") : null;
    data.village == "" ? errorList.push("village") : null;
    data.locality == "" ? errorList.push("locality") : null;
    data.ward == "" ? errorList.push("ward") : null;
    data.block == "" ? errorList.push("block") : null;
    data.doorNo == "" ? errorList.push("doorNo") : null;
    data.plotNo == "" ? errorList.push("plotNo") : null;
    data.survayNo == "" ? errorList.push("survayNo") : null;
    data.khataNum == "" ? errorList.push("khataNum") : null;
    data.extentUnit == "" ? errorList.push("ptinNo") : null;
    data.units == "" ? errorList.push("units") : null;
    data.layoutNo == "" ? errorList.push("layoutNo") : null;
    data.layoutName == "" ? errorList.push("layoutName") : null;
    data.appartmentName == "" ? errorList.push("appartmentName") : null;
    data.undividedShare == "" ? errorList.push("undividedShare") : null;
    data.undividedShareUnit == "" ? errorList.push("undividedShareUnit") : null;
    data.flatNorthBoundry == "" ? errorList.push("flatNorthBoundry") : null;
    data.flatSouthBoundry == "" ? errorList.push("flatSouthBoundry") : null;
    data.flatEastBoundry == "" ? errorList.push("flatEastBoundry") : null;
    data.flatWestBoundry == "" ? errorList.push("flatWestBoundry") : null;
    data.structure == "" ? errorList.push("structure") : null;
    data.northBoundry == "" ? errorList.push("northBoundry") : null;
    data.southBoundry == "" ? errorList.push("southBoundry") : null;
    data.eastBoundry == "" ? errorList.push("eastBoundry") : null;
    data.westBoundry == "" ? errorList.push("westBoundry") : null;
    data.isDocDetailsLinked == "" ? errorList.push("isDocDetailsLinked") : null;
    data.landtype == "" ? errorList.push("landtype") : null;
    data.isMarketValue == "" ? errorList.push("isMarketValue") : null;
    data.totalFloors == "" ? errorList.push("totalFloors") : null;
    data.totalFloors == "" ? errorList.push("totalFloors") : null;
    data.totalFloors == "" ? errorList.push("totalFloors") : null;

  }
  if (type == "property" && subtype == "rural") {
    data.village == "" ? errorList.push("village") : null;
    data.locality == "" ? errorList.push("locality") : null;
    data.survayNo == "" ? errorList.push("survayNo") : null;
    data.northBoundry == "" ? errorList.push("northBoundry") : null;
    data.southBoundry == "" ? errorList.push("southBoundry") : null;
    data.eastBoundry == "" ? errorList.push("eastBoundry") : null;
    data.westBoundry == "" ? errorList.push("westBoundry") : null;
  }
  if (type == "getstarted") {
    data.registrationType == "" ? errorList.push("registrationType") : null;
    data.documentNature == "" ? errorList.push("documentNature") : null;
    data.district == "" ? errorList.push("district") : null;
    data.sroOffice == "" ? errorList.push("sroOffice") : null;
    data.linkDocNo == "" ? errorList.push("linkDocNo") : null;
    data.regYear == "" ? errorList.push("regYear") : null;
    data.scheduleNo == "" ? errorList.push("scheduleNo") : null;
    data.district == "" ? errorList.push("district") : null;
    data.sroOffice == "" ? errorList.push("sroOffice") : null;
  }
  // else if (type == "party") { }
  // return errorList;
}
export const MuncipleKeyNameIdentifier = (key) => {
  switch (key) {
    case 'MUNICIPAL CORPORATION [మున్సిపల్ కార్పొరేషన్]': return "Localbody Name [స్థానిక సంస్థ పేరు]"
    case 'MUNICIPAL CORPORATION [మున్సిపల్ కార్పొరేషన్]': return "Localbody Name [స్థానిక సంస్థ పేరు]"
    case 'SPL./SELECTION GRADE MUNICIPALITY [స్పెషల్ /సెలెక్షన్ గ్రేడ్మున్సిపాలిటీ]': return "Localbody Name [స్థానిక సంస్థ పేరు]"
    case 'OTHER MUNICIPALITY/NOTIFIED AREA [ఇతర మునిసిపాలిటీ / నోటిఫైడ్ ఏరియా]': return "Localbody Name [స్థానిక సంస్థ పేరు]"
    case 'MINOR GRAM PANCHAYAT [ చిన్న గ్రామ పంచాయతీ]': return "Localbody Name [స్థానిక సంస్థ పేరు]"
    case 'MAJOR GRAM PANCHAYAT [మేజర్ గ్రామ పంచాయితీ]': return "Localbody Name [స్థానిక సంస్థ పేరు]"
    case 'Cantonment Board [కంటోన్మెంట్ బోర్డు]': return "Localbody Name [స్థానిక సంస్థ పేరు]"
    case 'GRADE/OTHER MUNICIPALITY UNDER UA [అర్బన్ అగ్లామరేషన్ లోని గ్రేడ్ 1 మున్సిపాలిటీ మరియు ఇతర మున్సిపాలిటీ]': return "Localbody Name [స్థానిక సంస్థ పేరు]"
    case 'MAJOR GRAM PANCHAYATH UNDER UA [అర్బన్ అగ్లామరేషన్ లోని మేజర్ గ్రామ పంచాయతీ]': return "Localbody Name [స్థానిక సంస్థ పేరు]"
    default: return "Localbody Name [స్థానిక సంస్థ పేరు]"
  }
}

export const TotalMarketValueCalculator = (ApplicationDetails) => {    
  if(ApplicationDetails.registrationType && ApplicationDetails.registrationType.TRAN_DESC === "Lease [కౌలు]" && ApplicationDetails?.leasePropertyDetails?.lPeriod <= 30 ) {
    let data: any = JSON.parse(localStorage.getItem("GetApplicationDetails"));
    const decryptedMarketValue = decryptWithAES(data?.leasePropertyDetails?.marketValue)
    return Number(decryptedMarketValue) || 0
  }

  let total = 0;
  ApplicationDetails?.property?.map(x => {
    if (x.marketValue) {
      total = total + x.marketValue;
    }
  })
  if(ApplicationDetails?.documentNature?.TRAN_MAJ_CODE === "07" && ApplicationDetails?.leasePropertyDetails?.lPeriod > 30)
    saveMVIfLeaseOver30(ApplicationDetails, total)

  return total ? total : 0;
}

export function isFutureDate(effective: string, lPeriod: string): boolean {
    const effectiveDate = new Date(effective);
    const currentDate = new Date();

    const yearsToAdd = parseInt(lPeriod, 10);

    const resultDate = new Date(effectiveDate);
    resultDate.setFullYear(resultDate.getFullYear() + yearsToAdd);

    return resultDate > currentDate;
}

export const saveMVIfLeaseOver30 = async (ApplicationDetails, marketVal) =>{
  const documentUpdatedData = {
    applicationId : ApplicationDetails.applicationId,
    leasePropertyDetails: {
      ...ApplicationDetails.leasePropertyDetails,
      marketValue : encryptWithAES(`${marketVal}`)
    }
  }
  await UseUpdateDocument(documentUpdatedData);
}


// AadharConsent2 (Eng & Tel)
export const useVoiceSequenceAadhaarConsent2 = () => {
  const [voiceStatus, setVoiceStatus] = useState<"idle" | "playing" | "paused">("idle");
  const [isTeluguMode, setIsTeluguMode] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const resetVoiceState = () => {  // RESET FUNCTION
    window.speechSynthesis.cancel();

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    setVoiceStatus("idle");
    setIsTeluguMode(false);
  };

  const playEnglishVoice = (text: string) => {  // PLAY ENGLISH
    resetVoiceState();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-IN";
    utterance.rate = 0.95;
    utterance.pitch = 1;

    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find((v) =>
      v.lang.toLowerCase().includes("en-in")
    );
    if (englishVoice) utterance.voice = englishVoice;

    utterance.onend = () => {
      playTeluguAudio();
    };

    window.speechSynthesis.speak(utterance);

    setVoiceStatus("playing");
    setIsTeluguMode(false);
  };

  const playTeluguAudio = async () => {   // PLAY TELUGU AUDIO
    const audio = audioRef.current;
    if (!audio) return;

    try {
      audio.currentTime = 0;
      await audio.play();
      setVoiceStatus("playing");
      setIsTeluguMode(true);
    } catch (err) {
      console.error("Telugu audio play error:", err);
    }
  };

  const toggleVoice = (englishText: string) => {  // TOGGLE (PLAY / PAUSE / RESUME)
    const audio = audioRef.current;

    if (voiceStatus === "idle") {
      playEnglishVoice(englishText);
    } else if (voiceStatus === "playing") {
      if (isTeluguMode && audio) audio.pause();
      else window.speechSynthesis.pause();

      setVoiceStatus("paused");
    } else if (voiceStatus === "paused") {
      if (isTeluguMode && audio) audio.play();
      else window.speechSynthesis.resume();

      setVoiceStatus("playing");
    }
  };

  useEffect(() => {  // CLEANUP & ENDED HANDLERS
    const audio = audioRef.current;
    if (!audio) return;

    const teluguEnded = () => {
      resetVoiceState();  // Show Play icon
    };

    audio.addEventListener("ended", teluguEnded);

    return () => {
      audio.removeEventListener("ended", teluguEnded);
    };
  }, [audioRef.current]);

  return {
    audioRef,
    voiceStatus,
    isTeluguMode,
    toggleVoice,
    resetVoiceState,
  };
};



// AadhaarConsent1 (Eng)
export const useVoicePlayerAadhaarConsent1 = () => {
  const [voicePlayerStatus, setVoicePlayerStatus] = useState<"idle" | "playing" | "paused">("idle");

  const speakText = (text: string) => {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-IN";
    utterance.rate = 0.95;
    utterance.pitch = 1;

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find((v) =>
      v.lang.toLowerCase().includes("en-in")
    );
    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.onend = () => {
      setVoicePlayerStatus("idle");
    };

    window.speechSynthesis.speak(utterance);
    setVoicePlayerStatus("playing");
  };

  const togglePlayerVoice = (text: string) => {
    console.log(text, 'text');
    
    if (voicePlayerStatus === "idle") {
      speakText(text);
    } else if (voicePlayerStatus === "playing") {
      window.speechSynthesis.pause();
      setVoicePlayerStatus("paused");
    } else if (voicePlayerStatus === "paused") {
      window.speechSynthesis.resume();
      setVoicePlayerStatus("playing");
    }
  };

  const stopAllVoiceOvers = () => {
    window.speechSynthesis.cancel();
    setVoicePlayerStatus("idle");
  };

  // Load voices (browser requirement)
  useEffect(() => {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => {};
  }, []);

  return {
    voicePlayerStatus,
    togglePlayerVoice,
    stopAllVoiceOvers,
  };
};
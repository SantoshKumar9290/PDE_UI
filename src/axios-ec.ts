import ecinstance from "./redux/api-ec";
import { encodeString, decodeString} from "../src/axis-util";

const mess = (e: any) =>
  e && e.response && e.response.data && e.response.data.message
    ? e.response.data.message
    : "Something went wrong";

export const getAPIUrl = (url) => {
  let apiUrl;
  try {
    let localData = localStorage.getItem("LoginDetails");
    let loginDetails;
    if(localData!=null && localData!=undefined)
      loginDetails = JSON.parse(localData);

    if(loginDetails?.loginName != undefined && loginDetails?.loginName != null)
      apiUrl = "/auth"+url;
    else
      apiUrl = "/public"+url;
  } catch (error) {
    console.error("error ::::: ", error);
  }
  return apiUrl;
};

export const getDRList = async (drCode) => {
  let reqBody = {}
  if(drCode!=undefined )
    reqBody = {params: {"drCode":encodeString(drCode.toString())}}
 
  let url = getAPIUrl("/getDRList");
  return await ecinstance
    .get(url, reqBody)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return { status: false, message: mess(e) };
    });
};

export const getCaptcha = async (key) => {
  let pathVar = encodeString(key);
  return await ecinstance
    .get('/public/getCaptcha/'+encodeURIComponent(pathVar))
    .then((res) => {
      if(res.data.status==true)
      {
        let deryptCaptcha = decodeString(res.data.data);
        res.data.data = deryptCaptcha;
      }
      return res.data;
    })
    .catch((e) => {
      return { status: false, message: mess(e) };
    });
};

export const getSROList = async (sroCode) => {
  let reqBody = {}
  if(sroCode!=undefined )
    reqBody = {params: {"sroCode":encodeString(sroCode.toString())}}
 
  let url = getAPIUrl("/getSroList");
  return await ecinstance
    .post(url, reqBody)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return { status: false, message: mess(e) };
    });
};

export const getServerDates = async (sroCode) => {
  return await ecinstance
  .get("/public/getServerDates/"+sroCode)
  .then((res) => {
    return res.data;
  })
  .catch((e) => {
    return { status: false, message: mess(e) };
  });
};

export const getDRSROList = async (drCode:string, sroCode:string) => {
  let reqBody = {}
  if(drCode!=undefined && drCode!=null ) {
    if(sroCode!=undefined && sroCode!=null){
      reqBody = {params: {"drCode":encodeString(drCode.toString()), "sroCode":encodeString(sroCode.toString())}};
    }else
    {
      reqBody = {params: {"drCode":encodeString(drCode.toString())}}
    }
  }
  
  let url = getAPIUrl("/getSroList");
  return await ecinstance
    .post(url, reqBody)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return { status: false, message: mess(e) };
    });
};

export const getPropertyDetails = async (filters: any) => {
  try {  
    const params = {};
    if (filters?.registeredAtSRO != undefined && filters?.registeredAtSRO != null) {
      params["sroCode"] = encodeString((filters?.registeredAtSRO).toString());
    }
    if (filters?.docMemoNo != undefined && filters?.docMemoNo != null) {
      params["docNumber"] = encodeString(filters?.docMemoNo.toString());
    }
    if (filters?.yearOfRegistration != undefined && filters?.yearOfRegistration != null) {
      params["regYear"] = encodeString(filters?.yearOfRegistration.toString());
    }
    if (filters?.captchaVal != undefined && filters?.captchaVal != null) {
      params["captcha"] = encodeString(filters?.captchaVal.toString());
    }
    if (filters?.captchaKey != undefined && filters?.captchaKey != null) {
      params["userKey"] = encodeString(filters?.captchaKey.toString());
    }

    let url = getAPIUrl("/getPropertiesByDocNumAndSroCodeAndRegYear");
    return await ecinstance
    .post(url, params)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return { status: false, message: mess(e) };
    });
  } catch (error) {
    console.error(" error ::::: ", error);
  }
};

export const getLinkDocumentPropertiesDetails = async (details: any) => {
  let reqBody = {linkData : encodeString(unescape(encodeURIComponent(JSON.stringify(details))))};
  let url = getAPIUrl("/getLinkDocumentsByPropertyDetails");
  return await ecinstance
    .post(url, reqBody)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return { status: false, message: mess(e) };
    });
};

export const getDocumentDataByDocIdAndSro = async (data: any) => {
  let reqBody = {docReq : encodeString(JSON.stringify(data))};
  let url = getAPIUrl("/getDocumentDataByDocIdAndSro");
  return await ecinstance
    .post(url, reqBody)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return { status: false, message: mess(e) };
    });
};

export const getPartyDetails = async (data: any) => {
  let reqBody = {partyReq : encodeString(JSON.stringify(data))};
  let url = getAPIUrl("/getPartyDetailsByInputData");
  return await ecinstance
    .post(url, { params: reqBody })
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return { status: false, message: mess(e) };
    });
};

export const createECRequestBySearchData = async (data: any) => {
  let reqBody = {ecReportReq : encodeString(JSON.stringify(data))};
  let url = getAPIUrl("/createECRequestBySearchData");
  return await ecinstance
    .post(url, reqBody)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return { status: false, message: mess(e) };
    });
};


export const checkECValidityLinkById = async (esignId) => {
  let url = "/public/checkECValidityLinkById";
  return await ecinstance
    .post(url, {transId : encodeString(esignId)})
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return { status: false, message: mess(e) };
    });
};



import moment from "moment";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import TableInputText from "../src/components/ec/TableInputText";
import TableText from "../src/components/TableText";
import styles from "../styles/Home.module.scss";
import Image from "next/image";
import Select from "react-select";
import { getDRList, getDRSROList, getServerDates, getCaptcha, createECRequestBySearchData } from "../src/axios-ec";
import {
  Loading,
  useAppSelector,
} from "../src/redux/hooks";
import { KeepLoggedIn, ShowMessagePopup } from '../src/GenericFunctions';

interface SearchEncumbranceProps {}

interface EncumbranceSearchFormData {
  propertyType?:string;
  registeredAtSRO?:any;
  district?: any;
  searchSRO?: any[];
  lpmNo: string,
  applicantName?: string;
  flatNo?: string;
  houseNo?: string;
  apartmentName?: string;
  wardNo?: string;
  blockNo?: string;
  villageOrCity?: string;
  alias?: string;
  plotOrBiNo?: string;
  inSurveyNo?: string;
  revenueVillage?: string;
  revenueAlias?: string;
  boundedEast?: string;
  boundedWest?: string;
  boundedNorth?: string;
  boundedSouth?: string;
  boundedExtent?: string;
  boundedType?: string;
  builtUpSqFt?: string;
  periodOfSearchFrom?: any;
  periodOfSearchTo?: any;
  captchaVal?:string,
  userKey?: string,
}

const SearchEncumbrance: React.FC<SearchEncumbranceProps> = () => {
  const router = useRouter();
  const [validated, setValidated] = useState<boolean>(false);  
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [propertyCheckFlag, setPropertyCheckFlag] = useState<boolean>(true);
  const [isBuilding, setIsBuilding] = useState<boolean>(true);
  const [isProperty, setIsProperty] = useState<boolean>(false);
  
  const [DRList, setDRList] = useState<any[]>([]);
  const [DRSROList, setDRSROList] = useState<any[]>([]);
  const [SROList, setSROList] = useState<any[]>([]);
  const [toggleValidationView, setToggleValidationView] =
    useState<boolean>(false);
  const [captcha, setCaptcha] = useState<string>("");
  const [maxDate, setMaxDate] = useState<string>("");
  const [captchaKey, setCaptchaKey] = useState<string>("");
  const [loginDetails, setLoginDetails] = useState<any>({});
  const minDate = '1983-01-01';

  const [encumbranceSearchFormData, setEncumbranceSearchFormData] =
    useState<EncumbranceSearchFormData>();

  const redirectToPage = (location: string, query?: {}) => {
    router.push({
      pathname: location,
      query: query,
    });
  };

  const handleMenuOpen = (isOpen: boolean) => {
    setIsMenuOpen(isOpen);
  };

  const getCaptchaCode = () => {
    Loading(true);
    let key = "EC"+new Date().getTime();
    getCaptcha(key)
      .then((response) => {
        if (response?.status) {
          let captchaDataArray = (response.data).split("--");
          if(captchaDataArray.length == 2 && captchaDataArray[1]==key){
            setCaptchaKey(response.data);
            setCaptcha(captchaDataArray[0]);
          }else
          {
            ShowMessagePopup(false, "Unauthorized Access.", "");
          }
        } else {
          console.error(response?.message);
        }
        Loading(false);
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    if(encumbranceSearchFormData===undefined){
      if (KeepLoggedIn()) {
        const data = localStorage.getItem("LoginDetails");
        console.log("data :::: ", data);
        let applicantName = "";
        if(data!=null && data!=undefined )
        {
          let jsonData = JSON.parse(data);
          console.log("jsonData :::: ", jsonData);
          setLoginDetails(jsonData);
          applicantName = jsonData.loginName;
          console.log("applicantName :::: ", applicantName);
        }
        setEncumbranceSearchFormData({
          ...encumbranceSearchFormData,
          ["captchaVal"]:"",
          ["applicantName"]:applicantName,
        });
        getCaptchaCode();
        getDistrictList(undefined);
      }
      else{
        ShowMessagePopup(false, "Invalid Access", "/") 
      }
    }

  }, [encumbranceSearchFormData]);

  const getDatesFromServer = (sroCode, field, e) => {
    Loading(true);
    getServerDates(sroCode).then((response) => {
      if (response?.status) {
        let serverDates = response.data;
        setEncumbranceSearchFormData({
          ...encumbranceSearchFormData,
          periodOfSearchFrom: serverDates.fromDate,
          periodOfSearchTo: serverDates.toDate,
          applicantName:loginDetails.loginName,
          propertyType:"BS",
          [field]: e,
          ['searchSRO']:[],
        });
        setMaxDate(serverDates.toDate);
      } else {
        console.error(response?.message);
      }
      Loading(false);
    });
  }

  const getDistrictList = (drCode:any) => {
    Loading(true);
    getDRList(drCode).then((response) => {
      if (response?.status) {
        setDRList(response.data);
        setDRSROList([]);
      } else {
        console.error(response?.message);
      }
      Loading(false);
    }).catch((error) => console.error(error));
  };

  const encumbranceSearchOnChange = (e: any, field?: string) => {
    let ecFormData = { ...encumbranceSearchFormData };
    if (field !== "district" && field !== "searchSRO"
         && field !== "registeredAtSRO") {
      let { name, value } = e.target;
      if(name === "captchaVal"){
        setEncumbranceSearchFormData({
          ...ecFormData,
          [name]: value,
          ["userKey"]: captchaKey,
        });
      }
      else if(name === "propertyType")
      {
        let presentProp = false;
        setIsBuilding(false);
        setIsProperty(true);
        if(value=="BS"){
          presentProp = true;
          setIsBuilding(true);
          setIsProperty(false);
        }
        if(presentProp!=propertyCheckFlag){
          setEncumbranceSearchFormData({
            [name]: value,
            ["district"]: ecFormData.district,
            ["searchSRO"]: ecFormData.searchSRO,
            ["applicantName"]: ecFormData.applicantName,
            ["periodOfSearchFrom"]: ecFormData.periodOfSearchFrom,
            ["periodOfSearchTo"]: ecFormData.periodOfSearchTo,
            ["captchaVal"]: ecFormData.captchaVal,
            ["userKey"]: ecFormData.userKey,
            ["registeredAtSRO"]: ecFormData.registeredAtSRO,
            ["lpmNo"]:"",
            ["plotOrBiNo"]:"",
            ["inSurveyNo"]:"",
            ["revenueVillage"]:"",
            ["revenueAlias"]:"",
            ["boundedEast"]:ecFormData.boundedEast,
            ["boundedWest"]:ecFormData.boundedWest,
            ["boundedNorth"]:ecFormData.boundedNorth,
            ["boundedSouth"]:ecFormData.boundedSouth,
            ["boundedExtent"]:ecFormData.boundedExtent,
            ["boundedType"]:ecFormData.boundedType,
            ["builtUpSqFt"]:ecFormData.builtUpSqFt,
            ["flatNo"]:"",
            ["houseNo"]:"",
            ["apartmentName"]:"",
            ["wardNo"]:"",
            ["blockNo"]:"",
            ["villageOrCity"]:"",
            ["alias"]:"",
          });
        }
        setPropertyCheckFlag(presentProp);
      }
      else{
        if (name === "lpmNo") {
          value = value.slice(0, 12);
          value = value.replace(/[a-z]/gi, "");
          value = value.replace(/[^\w\s]/i, "");
        }
        
        setEncumbranceSearchFormData({
          ...ecFormData,
          [name]: value,
        });
      }
    } else {
      if(field == "district"){
        //setDRSROList(undef); 
        setDRSROList([]); 
        if(e?.drcode!=undefined && e?.drcode!=null){
          getSROListByDRCode(e?.drcode);
        }     
        setEncumbranceSearchFormData({
          ...ecFormData,
          [field]: e,
          ['registeredAtSRO']:[],
        });  
      }else if(field == "registeredAtSRO"){
        let sroArray = [];
        DRSROList.map((item) => {
          if(item.srcd!=e.srcd)
            sroArray.push(item);
        });
        getDatesFromServer(e.srcd, field, e);
        setSROList(sroArray); 
      }
      else if (e && e?.length > 2)
        return ShowMessagePopup(false, "Maximum SRO's selected", "");
      else{
        setEncumbranceSearchFormData({
          ...ecFormData,
          [field]: e,
        }); 
      }   
    }
  };

  const getSROListByDRCode = (drCode) => {
    Loading(true);
    getDRSROList(drCode, undefined).then((response) => {
      if (response?.status) {
        setDRSROList(response.data);
      } else {
        ShowMessagePopup(false, response?.message, "");
      }
      Loading(false);
    }).catch((error) => {
      console.error(error);
      Loading(false);
    });
  }

  const submitEncumbranceSearchForm =  (e: any) => {
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      ShowMessagePopup(false, "Mandatory field values are required.", "");
    } else {
      Loading(true);
      e.preventDefault();
      let validFlag = validateFormDetails();
      if(validFlag){
        let sroDetails = encumbranceSearchFormData?.registeredAtSRO;
        const data = {
          sroname: sroDetails?.srname,
          juris: sroDetails?.srcd?.toString(),
          srcode: sroDetails?.srcd?.toString(),
          datefrom: moment(encumbranceSearchFormData?.periodOfSearchFrom)?.format(
            "DD/MM/YYYY"
          ),
          applicantname: encumbranceSearchFormData?.applicantName,
          dateto: moment(encumbranceSearchFormData?.periodOfSearchTo)?.format(
            "DD/MM/YYYY"
          ),
          selectedsrocode: encumbranceSearchFormData?.searchSRO
            ?.map((item) => item.srcd)
            ?.join(","),
          hno: encumbranceSearchFormData?.houseNo,
          flatno: encumbranceSearchFormData?.flatNo,
          apname: encumbranceSearchFormData?.apartmentName,
          village: encumbranceSearchFormData?.villageOrCity,
          colony: null,
          vill1: encumbranceSearchFormData?.villageOrCity,
          vill1a: encumbranceSearchFormData?.alias,
          vill2: encumbranceSearchFormData?.revenueVillage,
          vill2a: encumbranceSearchFormData?.revenueAlias,
          pno1: encumbranceSearchFormData?.plotOrBiNo,
          sy1: encumbranceSearchFormData?.inSurveyNo,
          north: encumbranceSearchFormData?.boundedNorth,
          south: encumbranceSearchFormData?.boundedSouth,
          east: encumbranceSearchFormData?.boundedEast,
          west: encumbranceSearchFormData?.boundedWest,
          wardno: encumbranceSearchFormData?.wardNo,
          blockno: encumbranceSearchFormData?.blockNo,
          extent1: encumbranceSearchFormData?.boundedExtent,
          built1: encumbranceSearchFormData?.builtUpSqFt,
          syd: encumbranceSearchFormData?.boundedType,
          hlpdocyear:null,
          distId:encumbranceSearchFormData?.district?.drcode,
          aponlinereqno: "Public",
          userKey: encumbranceSearchFormData?.userKey,
          captcha: encumbranceSearchFormData?.captchaVal,
          lpmNo: encumbranceSearchFormData.lpmNo
        };
        submitCreateECRequestBySearchData(data);
      }
      else
        Loading(false);
    }
    setValidated(true);
  };

  const submitCreateECRequestBySearchData = (data) => {
    createECRequestBySearchData(data)
      .then((response) => {
        if (response?.status) {
          console.log("response?.data :::: ", response?.data);
          ShowMessagePopup(
            true,
            response?.message ??
              "EC request has been created successfully.",
            ""
          );
          redirectToPage("/EDashboard");
        } else {
          ShowMessagePopup(
            false,
            response?.message ??
              "Failed to generate details, please try again",
            ""
          );
        }
        Loading(false);
      })
      .catch((error) => console.error(error));
  };


  const validateFormDetails = () => {
    let isValidSubmit = true;
    try{
    let ecFormData = {...encumbranceSearchFormData};
    if(ecFormData?.registeredAtSRO && ecFormData?.registeredAtSRO.length==0)
    {
      ShowMessagePopup(false, "Mandatory field values are required.", "");
      return false;
    }
    let hnoFlag = false, aptFlag = false, villFlag = false, aliasFlag = false, 
    plotFlag = false, survFlag = false, lpmFlag = false, revVillFlag = false, revAliasFlag = false;
    if(ecFormData?.houseNo == undefined || ecFormData?.houseNo.length==0)
      hnoFlag = true;

    if(ecFormData?.apartmentName == undefined || ecFormData?.apartmentName.length==0)
      aptFlag = true;

    if(ecFormData?.villageOrCity == undefined || ecFormData?.villageOrCity.length==0)
      villFlag = true;

    if(ecFormData?.plotOrBiNo == undefined || ecFormData?.plotOrBiNo.length==0)
      plotFlag = true;

    if(ecFormData?.inSurveyNo == undefined || ecFormData?.inSurveyNo.length==0)
      survFlag = true;

    if(ecFormData?.lpmNo == undefined || ecFormData?.lpmNo.length==0)
      lpmFlag = true;

    if(ecFormData?.revenueVillage == undefined || ecFormData?.revenueVillage.length==0)
      revVillFlag = true;

    if(hnoFlag && aptFlag && villFlag && plotFlag && survFlag && revVillFlag && lpmFlag ) {
      ShowMessagePopup(false, "Buildings/Structures or Sites/Agricultural Lands values are required.", "");
      isValidSubmit = false;
    }
    else if(( !hnoFlag || !aptFlag || !villFlag || !survFlag) && ecFormData?.propertyType=="BS") {
      if((!hnoFlag || !aptFlag) && villFlag ) {
        ShowMessagePopup(false, "Village/City value is required.", "");
        isValidSubmit = false;
      }
      else if(!villFlag && hnoFlag && aptFlag) {
        ShowMessagePopup(false, "House No. or Apartment value is required.", "");
        isValidSubmit = false;
      }
    }else if( !plotFlag || !survFlag || !revVillFlag || !lpmFlag ) {
      if((!plotFlag || !survFlag || !lpmFlag) && revVillFlag ) {
        ShowMessagePopup(false, "Revenue Village value is required.", "");
        isValidSubmit = false;
      }
      else if(!revVillFlag && plotFlag && survFlag && lpmFlag) {
        ShowMessagePopup(false, "Plot No. or Survey No(s) or Latest LPM No value is required.", "");
        isValidSubmit = false;
      }
    }
    if(ecFormData?.captchaVal == undefined || ecFormData?.captchaVal?.trim().length == 0){
      ShowMessagePopup(false, "Captcha Required", "");
      isValidSubmit = false;
    }
    if(ecFormData?.captchaVal != undefined && ecFormData?.captchaVal?.trim().length > 0 
      && ecFormData?.captchaVal != captcha){
      ShowMessagePopup(false, "Invalid Captcha", "");
      getCaptchaCode();
      isValidSubmit = false;
    }
  }catch(error){
    ShowMessagePopup(false, error.message, "");
    return false;
  }
    return isValidSubmit;
  }

  return (
    <div>
      <Head>
        <title>e-Encumbrance Service | Search</title>
        <link rel="icon" href="/PDE/images/aplogo.png" />
      </Head>
      <div>
        <div
          className={styles.Forms_RegistrationMain}
          style={{ margin: "1%" }}
        >
          <Container>
            <Form
              noValidate
              autoComplete="off"
              validated={validated}
              onSubmit={submitEncumbranceSearchForm}
            >
              <div className="text-start" style={{paddingTop:"3%", paddingBottom:"1.5%"}}>
                <h5 className={styles.Forms_mainHeading} style={{fontSize:"160%", textDecoration:"underline"}}>
                  e-Encumbrance Request By Property :
                </h5>
              </div>
              <Row className="p">
                <Col md={3}>
                  <TableText label={"Select District"} required={true} LeftSpace={false} />
                  <Select
                    className={
                      !encumbranceSearchFormData?.district &&
                      isMenuOpen
                        ? "SelectWidget red-outline"
                        : "SelectWidget"
                    }
                    required={true}
                    name={"district"}
                    value={encumbranceSearchFormData?.district}
                    onChange={(e: any) =>
                      encumbranceSearchOnChange(
                        e,
                        "district"
                    )}
                    onMenuOpen={() => handleMenuOpen(true)}
                    onMenuClose={() => handleMenuOpen(false)}
                    classNamePrefix="react-select"
                    options={DRList}
                    getOptionLabel={(option: any) => option.drname}
                    getOptionValue={(option: any) => option.drcode}
                    placeholder={"Registered at District"}
                    isClearable
                  />
                  <Form.Control.Feedback type="invalid">
                    Select District
                  </Form.Control.Feedback>
                </Col>
                <Col md={3}>
                  <TableText
                    label={"Select SRO" }
                    required={true}
                    LeftSpace={false}
                  />
                  <Select
                    className={
                      !encumbranceSearchFormData?.registeredAtSRO &&
                      isMenuOpen
                        ? "SelectWidget red-outline"
                        : "SelectWidget"
                    }
                    onMenuOpen={() => handleMenuOpen(true)}
                    onMenuClose={() => handleMenuOpen(false)}
                    classNamePrefix="react-select"
                    options={DRSROList}
                    getOptionLabel={(option: any) => option.srname}
                    getOptionValue={(option: any) => option.srcd}
                    name="registeredAtSRO"
                    onChange={(e: any) =>
                      encumbranceSearchOnChange(
                        e,
                        "registeredAtSRO"
                      )
                    }
                    placeholder={"Select SRO to create request"}
                    value={encumbranceSearchFormData?.registeredAtSRO}
                  />
                  <Form.Control.Feedback type="invalid">
                    Enter Applicant Name
                  </Form.Control.Feedback>
                </Col>

                <Col md={3}>
                  <TableText label={"Select 2 More SRO's"} required={false} LeftSpace={false} />
                  <Select
                    className="SelectWidget"
                    classNamePrefix="react-select"
                    options={SROList}
                    getOptionLabel={(option: any) => option.srname}
                    getOptionValue={(option: any) => option.srcd}
                    name={"searchSRO"}
                    onChange={(e: any) =>
                      encumbranceSearchOnChange(
                        e,
                        "searchSRO"
                    )}
                    placeholder="Select 2 More SRO's"
                    value={encumbranceSearchFormData?.searchSRO}
                    menuPlacement="bottom"
                    isMulti
                    isClearable
                  />
                </Col>

                <Col md={3}>
                  <TableText label="Applicant Name" required={true} LeftSpace={false} />
                  <TableInputText
                    type="text"
                    placeholder="Applicant Name"
                    required={true}
                    disabled={false}
                    name={"applicantName"}
                    value={encumbranceSearchFormData?.applicantName}
                    defaultValue={encumbranceSearchFormData?.applicantName}
                    onChange={encumbranceSearchOnChange}
                    maxLength={60}
                  />
                  <Form.Control.Feedback type="invalid">
                    Enter Applicant Name
                  </Form.Control.Feedback>
                </Col>
              </Row>
              <Row className="p">
                <Col md={12}>
                  <h2 className="p-0">Search By :</h2>
                  <Form.Check
                    inline
                    label="Building (OR) Structure Details"
                    value="BS"
                    name="propertyType"
                    type="radio"
                    className="mx-0"
                    onChange={encumbranceSearchOnChange}
                    checked={isBuilding}
                  />
                  <Form.Check
                    inline
                    label="Sites (OR) Agricultural Lands"
                    value="SAL"
                    name="propertyType"
                    type="radio"
                    onChange={encumbranceSearchOnChange}
                    style={{marginLeft:"2%"}}
                    checked={isProperty}
                  />
                </Col>
              </Row>
              {propertyCheckFlag ? (
                 <>
              <Row className="p">
                <Col md={12}>
                  <h2 className="p-0">Building (OR) Structure Details : </h2>
                </Col>

                <Col md={3}>
                  <TableText label="Flat No" required={false} LeftSpace={false} />
                  <TableInputText
                    type="text"
                    placeholder="Flat No"
                    required={false}
                    disabled={false}
                    name={"flatNo"}
                    value={encumbranceSearchFormData?.flatNo}
                    onChange={encumbranceSearchOnChange}
                    maxLength={50}
                  />
                </Col>

                <Col md={3}>
                  <TableText label="Apartment" required={false} LeftSpace={false} />
                  <TableInputText
                    type="text"
                    placeholder="Apartment"
                    required={false}
                    disabled={false}
                    name={"apartmentName"}
                    value={encumbranceSearchFormData?.apartmentName}
                    onChange={encumbranceSearchOnChange}
                    maxLength={150}
                  />
                </Col>
                <Col md={3}>
                  <TableText label="Plot No/Bi No" required={false} LeftSpace={false} />
                  <TableInputText
                    type="text"
                    placeholder="Plot No/Bi No"
                    required={false}
                    disabled={false}
                    name={"plotOrBiNo"}
                    value={encumbranceSearchFormData?.plotOrBiNo}
                    onChange={encumbranceSearchOnChange}
                    maxLength={125}
                  />
                </Col>

                <Col md={3}>
                  <TableText label="in Survey No(s)" required={false} LeftSpace={false} />
                  <TableInputText
                    type="text"
                    placeholder="in Survey No(s)"
                    required={false}
                    disabled={false}
                    name={"inSurveyNo"}
                    value={encumbranceSearchFormData?.inSurveyNo}
                    onChange={encumbranceSearchOnChange}
                    maxLength={1500}
                  />
                </Col>

                <Col md={3}>
                  <TableText label="House No." required={false} LeftSpace={false} />
                  <TableInputText
                    type="text"
                    placeholder="House No"
                    required={false}
                    disabled={false}
                    name={"houseNo"}
                    value={encumbranceSearchFormData?.houseNo}
                    onChange={encumbranceSearchOnChange}
                    maxLength={125}
                  />
                </Col>

                <Col md={1}>
                  <TableText label="Ward" required={false} LeftSpace={false}  />
                  <TableInputText
                    type="text"
                    placeholder="Ward"
                    required={false}
                    disabled={false}
                    name={"wardNo"}
                    value={encumbranceSearchFormData?.wardNo}
                    onChange={encumbranceSearchOnChange}
                    maxLength={4}
                  />
                </Col>

                <Col md={2}>
                  <TableText label="Block" required={false} LeftSpace={false} />
                  <TableInputText
                    type="text"
                    placeholder="Block"
                    required={false}
                    disabled={false}
                    name={"blockNo"}
                    value={encumbranceSearchFormData?.blockNo}
                    onChange={encumbranceSearchOnChange}
                    maxLength={4}
                  />
                </Col>

                <Col md={3}>
                  <TableText label="Village/City" required={false} LeftSpace={false} />
                  <TableInputText
                    type="text"
                    placeholder="Village/City"
                    required={false}
                    disabled={false}
                    name={"villageOrCity"}
                    value={encumbranceSearchFormData?.villageOrCity}
                    onChange={encumbranceSearchOnChange}
                  />
                </Col>

                <Col md={3}>
                  <TableText label="Alias" required={false} LeftSpace={false} />
                  <TableInputText
                    type="text"
                    placeholder="Alias"
                    required={false}
                    disabled={false}
                    name={"alias"}
                    value={encumbranceSearchFormData?.alias}
                    onChange={encumbranceSearchOnChange}
                  />
                </Col>
              </Row>
              </>):(<>
              <Row className="p">
                <Col md={12}>
                <h2 className="p-0">Sites (OR) Agricultural Lands : </h2>
                </Col>

                <Col md={3}>
                  <TableText label="Plot No/Bi No" required={false} LeftSpace={false} />
                  <TableInputText
                    type="text"
                    placeholder="Plot No/Bi No"
                    required={false}
                    disabled={false}
                    name={"plotOrBiNo"}
                    value={encumbranceSearchFormData?.plotOrBiNo}
                    onChange={encumbranceSearchOnChange}
                    maxLength={125}
                  />
                </Col>

                <Col md={3}>
                  <TableText label="in Survey No(s)" required={false} LeftSpace={false} />
                  <TableInputText
                    type="text"
                    placeholder="in Survey No(s)"
                    required={false}
                    disabled={false}
                    name={"inSurveyNo"}
                    value={encumbranceSearchFormData?.inSurveyNo}
                    onChange={encumbranceSearchOnChange}
                    maxLength={1500}
                  />
                </Col>
                <Col md={3}>
                  <TableText label="Latest LPM No" required={false} LeftSpace={false} />
                  <TableInputText
                    type="text"
                    placeholder="Latest LPM No"
                    required={false}
                    disabled={false}
                    name={"lpmNo"}
                    value={encumbranceSearchFormData?.lpmNo}
                    onChange={encumbranceSearchOnChange}
                    maxLength={250}
                  />
                </Col>
                <Col md={3}>
                  <TableText label="Revenue Village" required={false} LeftSpace={false} />
                  <TableInputText
                    type="text"
                    placeholder="Revenue Village"
                    required={false}
                    disabled={false}
                    name={"revenueVillage"}
                    value={encumbranceSearchFormData?.revenueVillage}
                    onChange={encumbranceSearchOnChange}
                  />
                </Col>
                <Col md={3}>
                  <TableText label="Alias" required={false} LeftSpace={false} />
                  <TableInputText
                    type="text"
                    placeholder="Alias"
                    required={false}
                    disabled={false}
                    name={"revenueAlias"}
                    value={encumbranceSearchFormData?.revenueAlias}
                    onChange={encumbranceSearchOnChange}
                  />
                </Col>
              </Row>
              </>)}
              <Row className="p">
                <Col md={12}>
                  <h2 className="p-0">Bounded By</h2>
                </Col>

                <Col md={3}>
                  <TableText label="East" required={false} LeftSpace={false} />
                  <TableInputText
                    type="text"
                    placeholder="East"
                    required={false}
                    disabled={false}
                    name={"boundedEast"}
                    value={encumbranceSearchFormData?.boundedEast}
                    onChange={encumbranceSearchOnChange}
                    maxLength={75}
                  />
                </Col>

                <Col md={3}>
                  <TableText label="West" required={false} LeftSpace={false} />
                  <TableInputText
                    type="text"
                    placeholder="West"
                    required={false}
                    disabled={false}
                    name={"boundedWest"}
                    value={encumbranceSearchFormData?.boundedWest}
                    onChange={encumbranceSearchOnChange}
                    maxLength={75}
                  />
                </Col>

                <Col md={3}>
                  <TableText label="North" required={false} LeftSpace={false} />
                  <TableInputText
                    type="text"
                    placeholder="North"
                    required={false}
                    disabled={false}
                    name={"boundedNorth"}
                    value={encumbranceSearchFormData?.boundedNorth}
                    onChange={encumbranceSearchOnChange}
                    maxLength={75}
                  />
                </Col>

                <Col md={3}>
                  <TableText label="South" required={false} LeftSpace={false} />
                  <TableInputText
                    type="text"
                    placeholder="South"
                    required={false}
                    disabled={false}
                    name={"boundedSouth"}
                    value={encumbranceSearchFormData?.boundedSouth}
                    onChange={encumbranceSearchOnChange}
                    maxLength={75}
                  />
                </Col>

                <Col md={4}>
                  <TableText label="Extent" required={false} LeftSpace={false} />
                  <TableInputText
                    type="text"
                    placeholder="Extent"
                    required={false}
                    disabled={false}
                    name={"boundedExtent"}
                    value={encumbranceSearchFormData?.boundedExtent}
                    onChange={encumbranceSearchOnChange}
                    maxLength={16}
                  />
                </Col>

                <Col md={4} style={{ display: "flex", alignItems: "center" }}>
                  <Form.Check
                    inline
                    label="SYd"
                    value="SYd"
                    name="boundedType"
                    type="radio"
                    className="mx-2"
                    onChange={encumbranceSearchOnChange}
                    defaultChecked={true}
                  />
                  <Form.Check
                    inline
                    label="Acres"
                    value="Acres"
                    name="boundedType"
                    type="radio"
                    onChange={encumbranceSearchOnChange}
                  />
                </Col>

                <Col md={4}>
                  <TableText label="Built up" required={false} LeftSpace={false} />
                  <TableInputText
                    type="text"
                    placeholder="Sq. Ft"
                    required={false}
                    disabled={false}
                    name={"builtUpSqFt"}
                    value={encumbranceSearchFormData?.builtUpSqFt}
                    onChange={encumbranceSearchOnChange}
                    maxLength={16}
                  />
                </Col>
              </Row>
              <Row className="p">
                <Col md={12}>
                  <h2 className="p-0">Search Period :</h2>
                </Col>

                <Col md={3}>
                  <TableText label="From (DD-MM-YYYY)" required={true} LeftSpace={false} />
                  <TableInputText
                    type="date"
                    placeholder="DD-MM-YYYY"
                    required={true}
                    disabled={false}
                    name={"periodOfSearchFrom"}
                    value={encumbranceSearchFormData?.periodOfSearchFrom}
                    onChange={encumbranceSearchOnChange}
                    min={minDate}
                    max={maxDate}
                  />
                  <Form.Control.Feedback type="invalid">
                    Enter From Date
                  </Form.Control.Feedback>
                </Col>

                <Col md={3}>
                  <TableText label="To (DD-MM-YYYY)" required={true} LeftSpace={false} />
                  <TableInputText
                    type="date"
                    placeholder="DD-MM-YYYY"
                    required={true}
                    disabled={false}
                    name={"periodOfSearchTo"}
                    value={encumbranceSearchFormData?.periodOfSearchTo}
                    onChange={encumbranceSearchOnChange}
                    min={minDate}
                    max={maxDate}
                  />
                  <Form.Control.Feedback type="invalid">
                    Enter To Date
                  </Form.Control.Feedback>
                </Col>
                <Col lg={1} md={1} xs={1} style={{ marginTop:"2.7%", paddingRight:"0px"}}>
                  <TableText label="CAPTCHA :" required={false} LeftSpace={false} />
                </Col>
                <Col lg={1} md={1} xs={1} style={{textAlign:"center", marginTop:"2.3%", padding:"0px"}}>
                  <span className="captchaText">{captcha}</span>
                </Col>
                <Col lg={1} md={1} xs={1} style={{  marginTop:"2.4%"}}>
                  <Image alt='Refresh Captcha' style={{cursor:"pointer"}} width={25} height={25} src="/PDE/images/reload.png" onClick={getCaptchaCode} />
                </Col>
                <Col lg={3} md={3} xs={3} style={{marginTop:"1.8%"}}>
                  <TableInputText
                    type="text"
                    maxLength={6}
                    placeholder="Enter CAPTCHA Here"
                    required={true}
                    disabled={false}
                    name={"captchaVal"}
                    value={
                      encumbranceSearchFormData?.captchaVal
                    }
                    onChange={encumbranceSearchOnChange}
                  />
                  <Form.Control.Feedback type="invalid">
                    Enter CAPTCHA
                  </Form.Control.Feedback>
                </Col>
              </Row>
              <Row>
                <Col lg={12} md={12} xs={12} style={{marginTop:"2%"}}>
                  <span style={{color:"red"}}><b>Note:</b> EC data has been digitalized since 1983. For ECs prior to 1983, please contact concerned SRO.</span>
                </Col>
              </Row>

              <div style={{ margin: "20px 0", textAlign: "center" }}>
                <Button variant="primary" type="submit">
                  Submit
                </Button>
                <Button
                  variant="secondary"
                  style={{ marginLeft: "10px" }}
                  onClick={() => {
                      redirectToPage("/EDetails");
                  }}
                >
                  Back
                </Button>
              </div>
            </Form>
          </Container>
        </div>
      </div>
    </div>
  );
};

export default SearchEncumbrance;

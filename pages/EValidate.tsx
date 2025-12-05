import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row, Table } from "react-bootstrap";
import Select from "react-select";
import {
  getDocumentDataByDocIdAndSro,
  getPartyDetails,
  createECRequestBySearchData,
  getCaptcha,
  getServerDates,
} from "../src/axios-ec";
import TableInputText from "../src/components/ec/TableInputText";
import TableText from "../src/components/TableText";
import {
  Loading,
  ShowMessagePopup,
} from "../src/redux/hooks";
import styles from "../styles/Home.module.scss";
import Image from "next/image";

interface EValidateProps {
  propertyDetails: any;
  fieldValues: any;
  SROList: any;
  validationViewItemDetails: any;
  setToggleValidationView: (value: boolean) => void;
}

interface EncumbranceSearchFormData {
  registeredDistrict?: string;
  registeredAtSRO?: string;
  documentNo?: string;
  yearOfRegistration?: string;
  villageName?: string;
  jurisdictionSRO?: string;
  aliasForVillage?: string;
  applicantName?: string;
  searchSRO?: any[];
  periodOfSearchFrom?: any;
  periodOfSearchTo?: any;
  captchaVal?:any;
}

interface EncumbranceSearchFormDetails {
  district?: any;
  searchSRO?: any[];
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
}

const EValidate: React.FC<EValidateProps> = (props) => {
  const {
    propertyDetails,
    fieldValues,
    SROList,
    validationViewItemDetails,
    setToggleValidationView,
  } = props;
  const router = useRouter();

  const [validated, setValidated] = useState<boolean>(false);
  const [encumbranceSearchFormData, setEncumbranceSearchFormData] =
    useState<EncumbranceSearchFormData>();
  const [encumbranceSearchFormDetails, setEncumbranceSearchFormDetails] =
    useState<EncumbranceSearchFormDetails>();
  const [documentSerachComplete, setDocumentSerachComplete] = useState<boolean>(false);
  const [showSubmissionForm, setShowSubmissionForm] = useState<boolean>(false);
  const [isFromECSearch, setIsFromECSearch] = useState<boolean>(false);
  const [linkDocumentsData, setLinkDocumentsData] = useState<any>();
  const [clickedDocumentsData, setClickedDocumentsData] = useState<any>();
  const [selectedDocumentIdsList, setSelectedDocumentIdsList] = useState<any>();
  const [partyDetails, setPartyDetails] = useState<any>();
  const [showPartyDetailsModal, setShowPartyDetailsModal] =
    useState<boolean>(false);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [captcha, setCaptcha] = useState<string>("");
  const [captchaKey, setCaptchaKey] = useState<string>("");
  const [maxDate, setMaxDate] = useState<string>("");
  const minDate = '1983-01-01';

  const redirectToPage = (location: string, query?: {}) => {
    router.push({
      pathname: location,
      query: query,
    });
  };

  useEffect(() => {
    if (!fieldValues) 
      redirectToPage("/");
    else if (fieldValues && validationViewItemDetails) 
      getCaptchaCode();
  }, [fieldValues]);

  const getCaptchaCode = () => {
    Loading(true);
    setEncumbranceSearchFormData({
      ...encumbranceSearchFormData,
      ["captchaVal"]:"",
    });
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

  const getDatesFromServer = (sroCode) => {
    Loading(true);
    getServerDates(sroCode).then((response) => {
      if (response?.status) {
        let serverDates = response.data;
        if(validationViewItemDetails){
          const sroName = SROList?.filter(
            (item: any) => item.srcd === fieldValues?.registeredAtSRO
          )[0]?.srname;
          setMaxDate(serverDates.toDate);
          setEncumbranceSearchFormData({
            ...encumbranceSearchFormData,
            registeredDistrict: propertyDetails?.drname,
            registeredAtSRO: sroName,
            documentNo: fieldValues?.docMemoNo,
            yearOfRegistration: fieldValues?.yearOfRegistration,
            villageName: validationViewItemDetails?.village,
            jurisdictionSRO: validationViewItemDetails.jurisName,
            aliasForVillage: validationViewItemDetails?.village,
            periodOfSearchFrom: serverDates.fromDate,
            periodOfSearchTo: serverDates.toDate,
          });
        }
        
      } else {
        console.error(response?.message);
      }
      Loading(false);
    });
  }


  useEffect(() => {
    if (validationViewItemDetails && (maxDate == undefined || maxDate.trim().length===0)) {
      getDatesFromServer(fieldValues?.registeredAtSRO);
    }
  }, [
    validationViewItemDetails,
    encumbranceSearchFormData,
    propertyDetails?.drname,
    fieldValues,
    SROList,
  ]);

  const encumbranceSearchOnChange = (e: any, field?: string) => {
    let formData = { ...encumbranceSearchFormData };
    if (field !== "searchSRO" && field !== "srOfficer") {
      let { name, value } = e.target;
      setEncumbranceSearchFormData({
        ...formData,
        [name]: value,
      });
    } else if (e && e?.length > 2) {
      return ShowMessagePopup(false, "Maximum SRO's selected", "");
    } else {
      setEncumbranceSearchFormData({
        ...formData,
        [field]: e,
      });
    }
  };

  const submitEncumbranceSearchForm = (e: any) => {
    const form = e.currentTarget;
    console.log("encumbranceSearchFormData :::: ", encumbranceSearchFormData);
    if (form.checkValidity() === false || encumbranceSearchFormData.captchaVal != captcha) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      Loading(true);
      e.preventDefault();

      const sroDetails = SROList?.filter(
        (item: any) => item.srcd === fieldValues?.registeredAtSRO
      );
      const data = {
        sroname: sroDetails[0]?.srname,
        regyear: encumbranceSearchFormData?.yearOfRegistration,
        doctno: fieldValues?.docMemoNo,
        juris: validationViewItemDetails?.jurisdiction,
        srcode: sroDetails[0]?.srcd?.toString(),
        datefrom: moment(encumbranceSearchFormData?.periodOfSearchFrom)?.format(
          "DD/MM/YYYY"
        ),
        applicantname: encumbranceSearchFormData?.applicantName,
        dateto: moment(encumbranceSearchFormData?.periodOfSearchTo)?.format(
          "DD/MM/YYYY"
        ),
        scheduleno: validationViewItemDetails?.scheduleno,
        selectedsrocode: encumbranceSearchFormData?.searchSRO
          ?.map((item) => item.srcd)
          ?.join(","),
        hno: validationViewItemDetails?.hno,
        flatno: validationViewItemDetails?.flatno,
        apname: validationViewItemDetails?.apname,
        village: encumbranceSearchFormData?.villageName,
        colony: validationViewItemDetails?.colony,
        pno1: validationViewItemDetails?.pno1,
        sy1: validationViewItemDetails?.sy1,
        north: validationViewItemDetails?.north,
        south: validationViewItemDetails?.south,
        east: validationViewItemDetails?.east,
        west: validationViewItemDetails?.west,
        wardno: validationViewItemDetails?.wardno?.toString(),
        blockno: validationViewItemDetails?.blockno?.toString(),
        extent1: validationViewItemDetails?.extent1,
        built1: validationViewItemDetails?.built1,
        syd: validationViewItemDetails?.syd,
        aponlinereqno: "Public",
        userKey: captchaKey,
        captcha: encumbranceSearchFormData?.captchaVal,
      };
      submitCreateECRequestBySearchData(data);
    }
    if(encumbranceSearchFormData?.captchaVal == undefined || (encumbranceSearchFormData?.captchaVal?.trim().length>0 
      && encumbranceSearchFormData?.captchaVal != captcha)) {
        ShowMessagePopup(false, "Invalid Captcha", "");
        getCaptchaCode();
      }
    setValidated(true);
  };

  const submitCreateECRequestBySearchData = (data) => {
    createECRequestBySearchData(data)
      .then((response) => {
        if (response?.status) {
          ShowMessagePopup( true, response?.message ?? "EC request has been created successfully.", "/EDashboard" );
        } else {
          ShowMessagePopup( false, response?.message ?? "Failed to generate details, please try again", "" );
        }
        Loading(false);
      })
      .catch((error) => console.error(error));
  };

  const handleSelectAllCheckboxChange = () => (e: any) => {
    const isChecked = e.target.checked;
    setSelectAll(isChecked);
    if (selectedDocumentIdsList) {
      let selectedDocIdsList = {};
      for (let parent in selectedDocumentIdsList) {
        let parentObj = {};
        let chilldrenObj = {};
        if (selectedDocumentIdsList[parent].children) {
          chilldrenObj = Object.keys(
            selectedDocumentIdsList[parent].children
          ).reduce((acc, child) => {
            acc[child] = isChecked;
            return acc;
          }, {});
        }
        parentObj["isChecked"] = isChecked;
        parentObj["children"] = chilldrenObj;
        selectedDocIdsList[parent] = parentObj;
      }
      setSelectedDocumentIdsList(selectedDocIdsList);
    }
  };

  const handleParentCheckboxChange = (parent: any) => (e: any) => {
    const isChecked = e.target.checked;
    if (selectedDocumentIdsList && selectedDocumentIdsList[parent]) {
      setSelectedDocumentIdsList({
        ...selectedDocumentIdsList,
        [parent]: {
          isChecked: isChecked,
          children: Object.keys(
            selectedDocumentIdsList[parent].children
          ).reduce((acc, child) => {
            acc[child] = isChecked;
            return acc;
          }, {}),
        },
      });
    }
  };

  const handleChildCheckboxChange = (parent: any, child: any) => (e: any) => {
    const isChecked = e.target.checked;
    const updatedCheckboxes = { ...selectedDocumentIdsList };
    if (updatedCheckboxes && updatedCheckboxes[parent]) {
      updatedCheckboxes[parent].children[child] = isChecked;
      const allChildrenChecked = Object.values(
        updatedCheckboxes[parent].children
      ).some((val) => val === true);
      updatedCheckboxes[parent].isChecked = allChildrenChecked;
      setSelectedDocumentIdsList(updatedCheckboxes);
    }
  };

  const onClickLinkDocument = (docId: string) => {
    let sroDetails;
    if(SROList!=undefined){
      sroDetails = SROList?.filter(
                    (item: any) => item.srcd === fieldValues?.registeredAtSRO
                  )[0]?.srcd;
      }else
      {
        sroDetails = fieldValues?.searchSRO[0]?.srcd;
      }
    Loading(true);
    let origDocId = docId?.replace("-LNK", "")
                    .replace("-RCS", "")
                    .replace("-RES", "")
                    .replace("-RAS", "")
                    .replace("-CNS", "")
                    .replace("-RAB", "")
                    .replace("-RCB", "")
                    .replace("-REB", "")
                    .replace("-CNB", "")
                    .replace("-STA", "")
                    .replace(",", "-");
    const data = {
      docId: origDocId,
      srocode: sroDetails,
    };
    getDocumentDataByDocIdAndSro(data)
      .then((response) => {
        if (response?.status) {
          setClickedDocumentsData(response?.data[0]);
        } else {
          setClickedDocumentsData(undefined);
          console.error(response?.message);
        }
        Loading(false);
      })
      .catch((error) => {
        console.error(error);
        Loading(false);
      });
  };

  const handlePartyDetailsToggle = () => {
    setShowPartyDetailsModal(!showPartyDetailsModal);
  };

  const onClickPartyDetails = () => {
    //const sroDetails = clickedDocumentsData.srcode;
    Loading(true);
    const data = {
      srcode: clickedDocumentsData.srcode,
      regyear: clickedDocumentsData.regyear,
      doctno: clickedDocumentsData.doctno,
      scheduleno: clickedDocumentsData?.scheduleno,
    };
    getPartyDetails(data)
      .then((response) => {
        if (response?.status) {
          handlePartyDetailsToggle();
          setPartyDetails(response?.data);
        } else {
          ShowMessagePopup(
            false,
            response?.message ?? "Failed to generate details, please try again",
            ""
          );
        }
        Loading(false);
      })
      .catch((error) => console.error(error));
  };

  function getCheckedParentsWithTrueChildren(data: any) {
    let selectedKeys = [];
    for (const key in data) {
      if (data[key].isChecked === true) selectedKeys.push(key);
      if (
        data[key].isChecked === true &&
        data.hasOwnProperty(key) &&
        data[key].children
      ) {
        const childKeys = Object.entries(data[key].children)
          .filter(([_childKey, value]) => value === true)
          .map(([childKey]) => childKey);
        if (childKeys.length > 0) {
          selectedKeys.push(...childKeys);
        }
      }
    }
    return selectedKeys;
  }

  const submitSearchDataByDocIdsAndSro = () => {
    const checkedKeys = getCheckedParentsWithTrueChildren(
      selectedDocumentIdsList
    );
    if (checkedKeys?.length > 0) {
      Loading(true);
      const data = {
        selectedDocIds: checkedKeys
          ?.filter(Boolean)
          ?.map((item: any) =>
            item
              ?.replace("-LNK", "")
              .replace("-RCS", "")
              .replace("-RES", "")
              .replace("-RAS", "")
              .replace("-CNS", "")
              .replace("-RAB", "")
              .replace("-RCB", "")
              .replace("-REB", "")
              .replace("-CNB", "")
              .replace("-STA", "")
              .replace(",", "-")
          )
          ?.join(","),
        requestNumber: linkDocumentsData?.requestNumber,
        sroCode:linkDocumentsData.sroCodes,
        sroName:linkDocumentsData.sroName,
      };
      
      createECRequestBySearchData(data)
        .then((response) => {
          if (response?.status) {
            console.log("response?.data :::: ", response?.data);
            ShowMessagePopup(
              false,
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
    } else {
      ShowMessagePopup(
        false,
        "Please select the Survey Number(s) you want to generate",
        ""
      );
    }
  };

  return (
    <Container>
      <Row>
        <Col lg={12} md={12} xs={12}>
          <div className={styles.Forms_RegistrationInput}>
            <Form
              noValidate
              autoComplete="off"
              validated={validated}
              onSubmit={submitEncumbranceSearchForm}
            >
                <div className="text-start" style={{paddingTop:"1%", paddingBottom:"1%"}}>
                <h5 className={styles.Forms_mainHeading} style={{fontSize:"140%", textDecoration:"underline"}}>
                  e-Encumbrance Request By Document Number :
                </h5>
              </div>
              
              <Row className="p">
                <Col md={3}>
                  <TableText label="Registered District" required={false} LeftSpace={false} />
                  <TableInputText
                    type="text"
                    placeholder="Registered District"
                    required={false}
                    disabled={true}
                    name={"registeredDistrict"}
                    onChange={() => {}}
                    value={encumbranceSearchFormData?.registeredDistrict}
                  />
                </Col>

                <Col md={3}>
                  <TableText label="Registered at SRO" required={false} LeftSpace={false} />
                  <TableInputText
                    type="text"
                    placeholder="Registered at SRO"
                    required={false}
                    disabled={true}
                    name={"registeredAtSRO"}
                    onChange={() => {}}
                    value={encumbranceSearchFormData?.registeredAtSRO}
                  />
                </Col>

                <Col md={3}>
                  <TableText label="Document No" required={false} LeftSpace={false} />
                  <TableInputText
                    type="text"
                    placeholder="Document No"
                    required={false}
                    disabled={true}
                    name={"documentNo"}
                    onChange={() => {}}
                    value={encumbranceSearchFormData?.documentNo}
                  />
                </Col>

                <Col md={3}>
                  <TableText
                    label="Year of Registration"
                    required={false}
                    LeftSpace={false} 
                  />
                  <TableInputText
                    type="text"
                    maxLength={4}
                    placeholder="Year of Registration"
                    required={false}
                    disabled={true}
                    name={"yearOfRegistration"}
                    onChange={() => {}}
                    value={encumbranceSearchFormData?.yearOfRegistration}
                  />
                </Col>

                <Col md={3}>
                  <TableText label="Village Name" required={false} LeftSpace={false} />
                  <TableInputText
                    type="text"
                    placeholder="Village Name"
                    required={false}
                    disabled={true}
                    name={"villageName"}
                    onChange={() => {}}
                    value={encumbranceSearchFormData?.villageName}
                  />
                </Col>

                <Col md={3}>
                  <TableText label="Jurisdiction SRO" required={false} LeftSpace={false} />
                  <TableInputText
                    type="text"
                    placeholder="Jurisdiction SRO"
                    required={false}
                    disabled={true}
                    name={"jurisdictionSRO"}
                    onChange={() => {}}
                    value={encumbranceSearchFormData?.jurisdictionSRO}
                  />
                </Col>

                <Col md={3}>
                  <TableText
                    label="Alias For Village(If Any)"
                    required={false}
                    LeftSpace={false} 
                  />
                  <TableInputText
                    type="text"
                    placeholder="Alias For Village(If Any)"
                    required={false}
                    disabled={false}
                    name={"aliasForVillage"}
                    onChange={encumbranceSearchOnChange}
                    value={encumbranceSearchFormData?.aliasForVillage}
                  />
                </Col>

                <Col md={3}>
                  <TableText label="Applicant Name" required={true} LeftSpace={false}/>
                  <TableInputText
                    type="text"
                    placeholder="Applicant Name"
                    required={true}
                    disabled={false}
                    name={"applicantName"}
                    onChange={encumbranceSearchOnChange}
                    value={encumbranceSearchFormData?.applicantName}
                    maxLength={60}
                  />
                  <Form.Control.Feedback type="invalid">
                    Enter Applicant Name
                  </Form.Control.Feedback>
                </Col>

                <Col md={6}>
                  <TableText
                    label="Also Search 2 More SRO's"
                    required={false}
                    LeftSpace={false} 
                  />
                  <Select
                    className="SelectWidget"
                    classNamePrefix="react-select"
                    options={propertyDetails?.drSroList}
                    getOptionLabel={(option: any) => option.srname}
                    getOptionValue={(option: any) => option.srcd}
                    name="searchSRO"
                    onChange={(e: any) =>
                      encumbranceSearchOnChange(e, "searchSRO")
                    }
                    placeholder="Search 2 More SRO's"
                    value={encumbranceSearchFormData?.searchSRO}
                    menuPlacement="top"
                    isMulti
                    isClearable
                  />
                </Col>

                <Col md={3}>
                  <TableText
                    label="Period of Search From"
                    required={false}
                    LeftSpace={false} 
                  />
                  <TableInputText
                    type="date"
                    placeholder="dd/mm/yyyy"
                    required={false}
                    disabled={false}
                    name={"periodOfSearchFrom"}
                    onChange={encumbranceSearchOnChange}
                    value={encumbranceSearchFormData?.periodOfSearchFrom}
                    min={minDate}
                    max={maxDate}
                  />
                </Col>

                <Col md={3}>
                  <TableText label="Period of Search To" required={false} LeftSpace={false} />
                  <TableInputText
                    type="date"
                    placeholder="dd-mm-yyyy"
                    required={false}
                    disabled={false}
                    name={"periodOfSearchTo"}
                    onChange={encumbranceSearchOnChange}
                    value={encumbranceSearchFormData?.periodOfSearchTo}
                    min={minDate}
                    max={maxDate}
                  />
                </Col>
                <Col lg={1} md={1} xs={3} style={{marginTop:"2.6%", paddingRight:"0px"}}>
                  <TableText label="CAPTCHA :" required={false} LeftSpace={false} />
                </Col>
                <Col lg={1} md={1} xs={3} style={{textAlign:"center", marginTop:"2.6%", padding:"0px"}}>
                  <span className="captchaText">{captcha}</span>
                </Col>
                <Col lg={1} md={1} xs={2} style={{marginTop:"2.6%", paddingRight:"0px"}}>
                  <Image alt='Refresh Captcha' style={{marginTop:"8%", cursor:"pointer"}} width={25} height={25} src="/PDE/images/reload.png" onClick={getCaptchaCode} />
                </Col>
                <Col lg={3} md={3} xs={4} style={{marginTop:"2%"}}>
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

              <div
                className="mb-5"
                style={{ marginTop: "20px", textAlign: "center" }}
              >
                <Button variant="primary" type="submit">
                  Submit
                </Button>
                <Button
                  variant="secondary"
                  className="mx-3"
                  onClick={() => setToggleValidationView(false)}
                >
                  Back
                </Button>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default EValidate;

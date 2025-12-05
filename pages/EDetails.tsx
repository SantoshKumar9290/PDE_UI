import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row, Table } from "react-bootstrap";
import { FiInfo } from "react-icons/fi";
import Select from "react-select";
import Image from "next/image";
import { getPropertyDetails, getSROList , getCaptcha} from "../src/axios-ec";
import CustomModal from "../src/components/ec/CustomModal";
import TableInputText from "../src/components/ec/TableInputText";
import TableText from '../src/components/TableText';
import TipModalContent from "../src/components/ec/TipModalContent";
import TableDropdown from '../src/components/TableDropdown';
import {
  Loading,
  SaveEncumbranceData,
  useAppSelector,
  ShowMessagePopup,
} from "../src/redux/hooks";
import styles from "../styles/Home.module.scss";
import EValidate from "./EValidate";
import { KeepLoggedIn } from '../src/GenericFunctions';


interface EncumbranceDetailsProps {}

interface EncumbranceSearchFormData {
  type?: string;
  docMemoNo?: string;
  yearOfRegistration?: string;
  registeredAtSRO?: string;
  captchaVal?:string;
}

const EncumbranceDetails: React.FC<EncumbranceDetailsProps> = () => {
  const router = useRouter();

  const EncumbranceDetails = useAppSelector(
    (state: any) => state.common.EncumbranceData
  ); 

  const [validated, setValidated] = useState<boolean>(false);
  const [showTipModal, setShowTipModal] = useState<boolean>();
  const [SROList, setSROList] = useState<any[]>([]);
  const [showAddMoreModal, setShowAddMoreModal] = useState<boolean>();
  const [addMoreType, setAddMoreType] = useState<string>("");
  const [addMorePropertyData, setAddMorePropertyData] = useState<any>({});
  const [addMoreIndex, setAddMoreIndex] = useState<number>(undefined);
  const [addMoreValue, setAddMoreValue] = useState<string>("");
  const [encumbranceSearchFormData, setEncumbranceSearchFormData] =
    useState<EncumbranceSearchFormData>();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [propertyDetails, setPropertyDetails] = useState<any>([]);
  const [basePropertyDetails, setBasePropertyDetails] = useState<any>([]);
  const [toggleValidationView, setToggleValidationView] =
    useState<boolean>(false);
  const [validationViewItemDetails, setValidationViewItemDetails] =
    useState<any>();
  const [captcha, setCaptcha] = useState<string>("");
  const [captchaKey, setCaptchaKey] = useState<string>("");

  const redirectToPage = (location: string, query?: {}) => {
    router.push({
      pathname: location,
      query: query,
    });
  };

  useEffect(() => {
    getCaptchaCode();
  }, []);

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

  useEffect(() => {
    if (KeepLoggedIn()) {
      if(SROList == undefined || SROList == null || SROList.length == 0)
        getSROListItems(undefined);
    }
    else{
      ShowMessagePopup(false, "Invalid Access", "/") 
    }
  }, [EncumbranceDetails, encumbranceSearchFormData]);

  const getSROListItems = (sroCode) => {
    Loading(true);
    getSROList(sroCode)
      .then((response) => {
        if (response?.status) {
          setSROList(response.data);
        } else {
          console.error(response?.message);
        }
        Loading(false);
      })
      .catch((error) => console.error(error));
  };

  const handleMenuOpen = (isOpen: boolean) => {
    setIsMenuOpen(isOpen);
  };

  const encumbranceSearchOnChange = (e: any, field?: string) => {
    let formData = { ...encumbranceSearchFormData };
    if (field !== "registeredAtSRO") {
      let { name, value } = e.target;
      if (name === "type" && value === "None") {
        redirectToPage("/EncumbranceSearch");
      }
      if (name === "type") {
        formData.docMemoNo = "";
        formData.yearOfRegistration = "";
        setPropertyDetails([]);
        setBasePropertyDetails([]);
        let isFromSRO = localStorage.getItem("isFromSRO")
        if(isFromSRO != "Yes")
          formData.registeredAtSRO = "";
      }
      if (name === "docMemoNo") {
        value = value.slice(0, 6);
        value = value.replace(/[a-z]/gi, "");
        //value = value.replace(/[^\w\s]/i, "");
      }
      if (name === "yearOfRegistration") {
        value = value.slice(0, 4);
        value = value.replace(/[a-z]/gi, "");
        value = value.replace(/[^\w\s]/i, "");
      }
      setEncumbranceSearchFormData({
        ...formData,
        [name]: value,
      });
    } else {
      setEncumbranceSearchFormData({
        ...formData,
        [field]: e,
      });
    }
  };

  const submitEncumbranceSearchForm = (e: any) => {
    const form = e.currentTarget;
    let sroCode = encumbranceSearchFormData?.registeredAtSRO;
    if (encumbranceSearchFormData?.captchaVal != captcha 
      || (sroCode+"").length == 0
      || form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      Loading(true);
      e.preventDefault();
      let reqData = { ...encumbranceSearchFormData };
      reqData["captchaKey"] = captchaKey;
      getPropertyDetailsData(reqData);
      SaveEncumbranceData(encumbranceSearchFormData);
    }
    if(encumbranceSearchFormData?.captchaVal == undefined || (encumbranceSearchFormData?.captchaVal?.trim().length>0 
      && encumbranceSearchFormData?.captchaVal != captcha)) {
        ShowMessagePopup(false, "Invalid Captcha", "");
        getCaptchaCode();
      }
    else if((sroCode+"").length == 0)
      ShowMessagePopup(false, "Registered at SRO is required", "");
    setValidated(true);
  };

  const getPropertyDetailsData = (values?: EncumbranceSearchFormData) => {
    Loading(true);
    getPropertyDetails({ ...values })
      .then((response) => {
        if (response?.status) {
          setPropertyDetails(response?.data);
          setBasePropertyDetails(response?.data);
          Loading(false);
        } else {
          getCaptchaCode();
          ShowMessagePopup(false, response?.message, "");
        }
      })
      .catch((error) => console.error(error));
  };

  const handleTipToggle = () => {
    setShowTipModal(!showTipModal);
  };

  const addMoreOnClick = (type, propertyData, index) => {
    Loading(true);
    setAddMoreType(type);
    setAddMoreIndex(index);
    setAddMorePropertyData(propertyData);
    let addMoreVal = "";
    if(type=="hno")
    {
      addMoreVal = propertyData.hno;
    }
    else
    {
      addMoreVal = propertyData.sy1;
    }
    setAddMoreValue(addMoreVal);
    
    setTimeout(() => {
      handleAddMore();
      Loading(false);
    }, 150);
  };

  const handleAddMore = () => {
    setShowAddMoreModal(!showAddMoreModal);
  };

  const AddMoreValueOnChange = (e:any) => {
    let { name, value } = e.target;
    setAddMoreValue(value);
  }; 

  const updateAddMoreDetails = () => {
    Loading(true);
    let addMorePropData = { ...addMorePropertyData };
    let oldPropDataList = basePropertyDetails?.propertyList;
    let oldPropData = oldPropDataList[addMoreIndex];
    if(addMoreType=="hno")
    {
      let oldValue = oldPropData.hno;
      if(addMoreValue.trim().length>0){
        if(oldValue== null || oldValue.length==0 || addMoreValue.indexOf(oldValue)>-1)
          addMorePropData.hno = addMoreValue;
        else
          addMorePropData.hno = oldValue+","+addMoreValue;
          //ShowMessagePopup(false, "Schedule related house number should be there.", "");
      }else if(addMoreValue.trim().length==0 && (oldValue== null || oldValue.length==0))
        addMorePropData.hno = null;
    }
    else
    {
      let oldValue = oldPropData.sy1;
      if(addMoreValue.trim().length>0){
        if(oldValue== null || oldValue.length==0 || addMoreValue.indexOf(oldValue)>-1)
          addMorePropData.sy1 = addMoreValue;
        else
          addMorePropData.sy1 = oldValue+","+addMoreValue;
          //ShowMessagePopup(false, "Schedule related survey number should be there.", "");
      }else if(addMoreValue.trim().length==0 && (oldValue== null || oldValue.length==0))
        addMorePropData.sy1 = null;
    }
    
    let propDetails = { ...propertyDetails };
    let propList = [ ...propDetails?.propertyList];
    if(propList?.length > 0)
    {
      propList[addMoreIndex] = addMorePropData;
      propDetails.propertyList = propList;
    }
    setPropertyDetails(propDetails);  
        
    setTimeout(() => {
      handleAddMore();
      Loading(false);
      setAddMoreValue("");
      setAddMoreIndex(undefined);
      setAddMorePropertyData({});
      setAddMoreType("");
    }, 150);
    
  };
  

  return (
    <div>
      <Head>
        <title>e-Encumbrance Request</title>
        <link rel="icon" href="/PDE/images/aplogo.png" />
      </Head>
      
      <div className="PageSpacing" style={{marginLeft:"1%", marginRight:"1%"}}>
        <div className={` ${styles.Forms_RegistrationMainDetails} ${styles.mainCon}`}>
          {!toggleValidationView ? (
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
                      <Row className='ApplicationNum'>
                        <Col lg={8} md={12} xs={12}>
                          <div className='ContainerColumn TitleColmn' onClick={() => { redirectToPage("/EDashboard") }}>
                              <h4 className='TitleText left-title' style={{fontSize:"130%", marginBottom:"3%" }}>e-Encumbrance Request By Document Number</h4>
                          </div>
                        </Col>
                        <Col lg={4} md={0} xs={0}></Col>
                      </Row>
                      <Row className="p">
                      <Col lg={3} md={6} xs={12}>
                          <TableText
                            label={"Select Encumbrance Type"}
                            required={true} LeftSpace={false} 
                          />
                          <TableDropdown 
                            required={true} 
                            options={["Document No", "None"]} 
                            name={"type"} 
                            value={encumbranceSearchFormData?.type}
                            onChange={encumbranceSearchOnChange} 
                          />
                          <Form.Control.Feedback type="invalid">
                            Select Encumbrance Type
                          </Form.Control.Feedback>
                        </Col>
                        <Col lg={3} md={6} xs={12}>
                          <TableText
                            label={`Enter the Doc No`}
                            required={true}
                            LeftSpace={false}
                          />
                          <TableInputText
                            type="number"
                            placeholder={`Enter the Doc No`}
                            required={true}
                            disabled={false}
                            isNagative={true}
                            name={"docMemoNo"}
                            value={encumbranceSearchFormData?.docMemoNo}
                            onChange={encumbranceSearchOnChange}
                          />
                          <Form.Control.Feedback type="invalid">
                            {`Enter the Doc No`}
                          </Form.Control.Feedback>
                        </Col>

                        <Col lg={3} md={6} xs={12}>
                          <TableText
                            label="Year of Registration"
                            required={true}
                            LeftSpace={false}
                          />
                          <TableInputText
                            type="number"
                            maxLength={4}
                            placeholder="Year of Registration"
                            required={true}
                            disabled={false}
                            name={"yearOfRegistration"}
                            value={
                              encumbranceSearchFormData?.yearOfRegistration
                            }
                            onChange={encumbranceSearchOnChange}
                          />
                          <Form.Control.Feedback type="invalid">
                            Enter Year of Registration
                          </Form.Control.Feedback>
                        </Col>

                        <Col lg={3} md={6} xs={12}>
                          <TableText
                            label={"Registered at SRO" }
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
                            options={SROList}
                            getOptionLabel={(option: any) => option.srname}
                            getOptionValue={(option: any) => option.srcd}
                            name="registeredAtSRO"
                            onChange={(e: any) =>
                              encumbranceSearchOnChange(
                                e?.srcd,
                                "registeredAtSRO"
                              )
                            }
                            placeholder={"Registered at SRO"}
                            value={
                              SROList?.filter(
                                (item: any) =>
                                  item.srcd ===
                                  encumbranceSearchFormData?.registeredAtSRO
                              )[0]
                            }
                          />
                        </Col>
                      </Row>
                      <Row style={{ marginTop:"1%" }}>
                        <Col lg={1} md={1} xs={3} style={{ marginTop:"0.8%", paddingRight:"0px"}}>
                          <TableText label="CAPTCHA :" required={false} LeftSpace={false} />
                        </Col>
                        <Col lg={1} md={1} xs={3} style={{textAlign:"center", marginTop:"0.6%", padding:"0px"}}>
                          <span className="captchaText">{captcha}</span>
                        </Col>
                        <Col lg={1} md={1} xs={2} style={{ marginTop:"0.8%", paddingRight:"2px"}}>
                          <Image alt='Refresh Captcha' style={{cursor:"pointer"}} width={25} height={25} src="/PDE/images/reload.png" onClick={getCaptchaCode} />
                        </Col>
                        <Col lg={3} md={3} xs={4}>
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

                      <div style={{ marginTop: "20px", textAlign: "center" }}>
                        <Button variant="primary" type="submit">
                          Submit
                        </Button>
                        <Button variant="link" onClick={handleTipToggle}>
                          <FiInfo /> &nbsp; Useful Tips
                        </Button>
                      </div>
                    </Form>
                  </div>
                </Col>

                <Col lg={12} md={12} xs={12} className="my-4">
                <div className="table-responsive">
                  <Table
                    striped
                    bordered
                    style={{ width: "100%"}}
                    className="tableData"
                  >
                    <thead>
                      <tr>
                        <th>SRO</th>
                        <th>JURISDICTION</th>
                        <th>SCHEDULE NO.</th>
                        <th>VILLAGECODE</th>
                        <th>CITY/VILLAGE</th>
                        <th>W-B</th>
                        <th>COLONY</th>
                        <th>APARTMENT</th>
                        <th>FLAT NO</th>
                        <th>HOUSE NO</th>
                        <th>SY NO</th>
                        <th>PLOT NO</th>
                        <th></th>
                      </tr>
                    </thead>

                    <tbody>
                      {propertyDetails?.propertyList &&
                      propertyDetails?.propertyList?.length > 0 ? (
                        propertyDetails?.propertyList?.map(
                          (propertyData: any, index: number) => {
                            return (
                              <tr key={propertyData?.scheduleno}>
                                <td>{propertyData?.srcode}</td>
                                <td>{propertyData?.jurisdiction}</td>
                                <td>{propertyData?.scheduleno}</td>
                                <td>{propertyData?.villagecode}</td>
                                <td>{propertyData?.village}</td>
                                <td>
                                  {propertyData?.wardno}-{propertyData?.blockno}
                                </td>
                                <td>{propertyData?.colony ?? "--"}</td>
                                <td>{propertyData?.apname ?? "--"}</td>
                                <td>{propertyData?.flatno ?? "--"}</td>
                                <td>
                                  <Row>
                                    <Col lg={12} md={12} xs={12} >
                                      {propertyData?.hno ?? "--"}
                                    </Col>
                                    <Col lg={12} md={12} xs={12} >
                                      <Button variant="link" style={{fontSize:"100%", padding:"0px", fontWeight:650}} onClick={()=>addMoreOnClick('hno', propertyData, index)}>
                                        <span style={{textDecorationLine:"underline"}}>Add More</span>
                                      </Button>
                                    </Col>
                                  </Row>
                                </td>
                                <td>
                                  <Row>
                                    <Col lg={12} md={12} xs={12} >
                                      {propertyData?.sy1 ?? "--"}
                                    </Col>
                                    <Col lg={12} md={12} xs={12} >
                                      <Button variant="link" style={{fontSize:"100%", padding:"0px", fontWeight:650}} onClick={()=>addMoreOnClick('sy1', propertyData, index)}>
                                        <span style={{textDecorationLine:"underline"}}>Add More</span>
                                      </Button>
                                    </Col>
                                  </Row>
                                </td>
                                <td>{propertyData?.pno1 ?? "--"}</td>
                                <td style={{ width: "90px" }}>
                                  <Button
                                    variant="primary"
                                    onClick={() => {
                                      setValidationViewItemDetails(
                                        propertyData
                                      );
                                      setToggleValidationView(true);
                                    }}
                                    type="button"
                                    size="sm"
                                  >
                                    Next
                                  </Button>
                                </td>
                              </tr>
                            );
                          }
                        )
                      ) : (
                        <tr>
                          <td colSpan={13} style={{ textAlign: "center" }}>
                            No records found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                  </div>
                </Col>

                <CustomModal
                  showModal={showTipModal}
                  handleModal={handleTipToggle}
                  modalTitle="Useful Tips"
                >
                  <TipModalContent />
                </CustomModal>
                <CustomModal
                  showModal={showAddMoreModal}
                  handleModal={handleAddMore}
                  modalTitle="Add More"
                >
                  <Row>
                    <Col lg={12} md={12} xs={12} >
                      <TableInputText
                        type="text"
                        placeholder={`Enter the ${
                          addMoreType === "sy1"
                            ? "Survey"
                            : "House"
                        } No with comma separate`}
                        required={true}
                        disabled={false}
                        name={"addMoreValue"}
                        value={addMoreValue}
                        onChange={AddMoreValueOnChange}
                        maxLength={1500}
                      />
                    </Col>
                  </Row>
                  <Row><Col lg={12} md={12} xs={12}>&nbsp;</Col></Row>
                  <Row>
                  <Col lg={12} md={12} xs={12} style={{textAlign:"center"}}>
                    <Button
                      variant="primary"
                      className="mx-3"
                      onClick={() => updateAddMoreDetails()}
                    >
                      Add
                    </Button>
                  </Col>
                </Row>
                </CustomModal>
              </Row>
            </Container>
          ) : (
            <EValidate
              propertyDetails={propertyDetails}
              fieldValues={encumbranceSearchFormData}
              SROList={SROList}
              validationViewItemDetails={validationViewItemDetails}
              setToggleValidationView={setToggleValidationView}         
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EncumbranceDetails;

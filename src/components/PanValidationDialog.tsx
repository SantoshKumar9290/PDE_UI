import React, { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Popstyles from "../../styles/components/PopupAlert.module.scss";
import { ImCross } from "react-icons/im";
import TableText from "./TableText";
import TableInputText from "./TableInputText";
import TableSelectDate from "./TableSelectDate";
import { CallingAxios, ShowMessagePopup } from "../GenericFunctions";
import { getPanValidation } from "../axios";
import { getTodayDate } from "../utils";

interface PanValidationDialogProps {
  PartyDetails?: any;
  setDisablePAN?: any;
  setPartyDetails?: any;
  setShowPanValidationDialog?: any;
}

const PanValidationDialog = ({
  PartyDetails,
  setDisablePAN,
  setPartyDetails,
  setShowPanValidationDialog,
}: PanValidationDialogProps) => {
  const [panDetails, setPanDetails] = useState<any>({});
  const isEmpty = Object.keys(panDetails).length === 0;

  const handleClose = () => {
    let data: any = localStorage.getItem("LoginDetails");
    let result =JSON.parse(data);
   if(result?.loginEmail !== 'APIIC'){
    setPartyDetails({ ...PartyDetails, panNoOrForm60or61: "" });
   }
    setShowPanValidationDialog(false);
  };

  const handleChange = (e) => {
    e.preventDefault();
    let { name, value } = e.target;
    setPanDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const checkPanValidStatus = async () => {
    if (
      !isEmpty &&
      panDetails?.hasOwnProperty("name") &&
      panDetails?.hasOwnProperty("dob")
    ) {
      let data = {
        name: panDetails?.name.toUpperCase(),
        dob: new Date(panDetails?.dob).toLocaleDateString("en-GB"),
        pan: PartyDetails.panNoOrForm60or61,
        fatherName: "",
      };
      let result = await CallingAxios(getPanValidation(data));
      if (result.status) {
        if (result.data.status === "Success") {
          if (result.data.data.name === "Y" && result.data.data.dob === "Y") {
            ShowMessagePopup(true, "PAN Verified Successfully", "");
            setDisablePAN(true);
            setShowPanValidationDialog(false);
          } else {
            ShowMessagePopup(
              false,
              "Either name or date of birth is not matched with given PAN number",
              ""
            );
          }
        } else {
          ShowMessagePopup(false, "Please enter valid PAN number", "");
          setPartyDetails({ ...PartyDetails, panNoOrForm60or61: "" });
          setShowPanValidationDialog(false);
        }
      }
    } else {
      ShowMessagePopup(false, "Please fill mandatory fields first", "");
    }
  };

  return (
    <>
      <Container>
        <div className={Popstyles.reportPopup}>
          <div className={Popstyles.container}>
            <div className={Popstyles.Messagebox}>
              <div className={Popstyles.header}>
                <div className={Popstyles.letHeader}>
                  <p className={Popstyles.text}>PAN Validation</p>
                </div>
                <div>
                  <ImCross
                    onClick={handleClose}
                    className={Popstyles.closeButton}
                  />
                </div>
              </div>
              <div
                style={{
                  paddingLeft: "1rem",
                  paddingTop: "1rem",
                  paddingRight: "1rem",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "100%",
                }}
                className={Popstyles.popupBox}
              >
                <Row className="mb-0">
                  <Col lg={12} md={12} xs={12} className="mb-2">
                    <TableText
                      label={"Full Name[పూర్తి పేరు](as per PAN)"}
                      required={true}
                      LeftSpace={false}
                    />
                    <TableInputText
                      type="text"
                      maxLength={200}
                      placeholder="Enter Full Name"
                      splChar={false}
                      required={true}
                      name="name"
                      capital={true}
                      onChange={handleChange}
                      value={panDetails.name}
                    />
                  </Col>
                  <Col lg={12} md={12} xs={12} className="mb-2">
                    <TableText
                      label={"Date of birth [ తేదీ]"}
                      required={true}
                      LeftSpace={false}
                    />
                    <TableSelectDate
                      name="dob"
                      max={getTodayDate()}
                      value={panDetails.dob}
                      onChange={handleChange}
                      required={true}
                      placeholder="Select Date"
                    />
                  </Col>
                </Row>
                <div className="text-center d-flex">
                  <button
                    className={Popstyles.yesBtn}
                    style={{ marginLeft: "0px" }}
                    onClick={() => checkPanValidStatus()}
                  >
                    Verify PAN
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default PanValidationDialog;

import React from "react";
import { Container } from "react-bootstrap";
import { ImCross } from "react-icons/im";
import Popstyles from "../styles/components/PopupAlert.module.scss";

interface PanDuplicationDialogProp {
  PartyDetails?: any;
  setPartyDetails?: any;
  setShowPanValidationDialog?: any;
  setShowPanDuplicationDialog?: any;
}

const PanDuplicationDialog = ({
  PartyDetails,
  setPartyDetails,
  setShowPanValidationDialog,
  setShowPanDuplicationDialog,
}: PanDuplicationDialogProp) => {
  const onCancel = () => {
    setPartyDetails({ ...PartyDetails, panNoOrForm60or61: "" });
    setShowPanDuplicationDialog(false);
  };

  const onSubmit = () => {
    setShowPanDuplicationDialog(false);
    setShowPanValidationDialog(true);
  };

  return (
    <>
      <Container>
        <div className={Popstyles.reportPopup}>
          <div className={Popstyles.container}>
            <div className={Popstyles.Messagebox}>
              <div className={Popstyles.header}>
                <div className={Popstyles.letHeader}>
                  <p className={Popstyles.text}>Document</p>
                </div>
                <div>
                  <ImCross
                    onClick={onCancel}
                    className={Popstyles.crossButton}
                  />
                </div>
              </div>
              <div
                style={{
                  paddingLeft: "1rem",
                  paddingRight: "1rem",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
                className={Popstyles.popupBox}
              >
                <div className={Popstyles.SuccessImg}>
                  <div className={Popstyles.docText}>
                    Same PAN number already Entered!
                  </div>
                  <div className={Popstyles.docText}>
                    Do you want to Proceed?
                  </div>
                  <div className="text-center d-flex">
                    <button className={Popstyles.yesBtn} onClick={onSubmit}>
                      YES
                    </button>
                    <button className={Popstyles.noBtn} onClick={onCancel}>
                      NO
                    </button>
                  </div>
                </div>
                <p className={Popstyles.message}></p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default PanDuplicationDialog;

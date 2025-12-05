import React from "react";
import { Container } from "react-bootstrap";
import Popstyles from "../../styles/components/PopupAlert.module.scss";

interface ClosingNoteDialogProps {
  setIsTaxView?: any;
  setShowCloseDialog?: any;
}

const ClosingNoteDialog = ({
  setIsTaxView,
  setShowCloseDialog,
}: ClosingNoteDialogProps) => {

  const onSubmit = () => {
    setIsTaxView(false);
    setShowCloseDialog(false);
  };

  return (
    <>
      <Container>
        <div className={Popstyles.container}>
          <div className={Popstyles.Messagebox} style={{ padding: 0 }}>
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
                <div>
                  <p className="UnitrateNote" style={{wordBreak: 'break-word'}}>
                  If you Successfully paid the payment and the payment status is
                  not yet reflected, Please allow some time for the payment
                  status update to appear.
                  </p>
                </div>
                <div className="d-flex justify-content-end align-items-center">
                  <button className={Popstyles.okayBtn} onClick={onSubmit}>
                    OK
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

export default ClosingNoteDialog;

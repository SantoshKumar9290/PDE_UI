import React, { useEffect, useState } from "react";
import { Col, Container, Row, Table } from "react-bootstrap";
import Popstyles from "../../styles/components/PopupAlert.module.scss";
import { ImCross } from "react-icons/im";
import { CallingAxios } from "../GenericFunctions";
import { GetTaxDuesDetails } from "../axios";
import ClosingNoteDialog from "./ClosingNoteDialog";

interface TaxDuesDialogProps {
  taxPayload?: any;
  setIsTaxView?: any;
}

const TaxDuesDialog = ({
  taxPayload,
  setIsTaxView,
}: TaxDuesDialogProps) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [taxTypes, setTaxTypes] = useState<{ [key: string]: number }>({
    UnifiedPayment: 0,
    MutationDues: 0,
  });

  const payCDMATax = (taxType: string) => {
    switch (taxType) {
      case "UnifiedPayment":
        window.open(process.env.URBAN_UNIFIED_PAYMENT_LINK);
        break;
      case "MutationDues":
        window.open(process.env.URBAN_MUTATION_PAYMENT_LINK);
        break;
    }
  };

  useEffect(() => {
    checkTaxesStatus(taxPayload, "");
  }, []);

  const showError = (msg: string) => {
    setErrorMessage(msg);
    setTimeout(() => {
      setErrorMessage(null);
    }, 5000);
  };

  const handleClose = () => {
    setIsTaxView(false);
  };

  const checkTaxesStatus = async (data, from) => {
    let result = await CallingAxios(GetTaxDuesDetails(data));
    if (result.status) {
      setTaxTypes({
        UnifiedPayment: result.data?.mutationPaymentDue < 0 ? 0:result.data?.mutationPaymentDue,
        MutationDues: result.data?.mutationFee < 0 ? 0 : result.data?.mutationFee,
      });

      const mutationPaymentDue =
        (result.data?.mutationPaymentDue || 0) +
        (result.data?.mutationFee || 0);

      if (mutationPaymentDue > 0 && from === "click") {
        showError("Payment dues are still pending");
      }
    }
  };

  return (
    <>
      <Container fluid>
        <div
          className={`${Popstyles.reportPopup} ${Popstyles.taxDialogWrapper}`}
        >
          <div
            className={`${Popstyles.container} ${Popstyles.taxDialogContainer}`}
          >
            <div
              className={`${Popstyles.Messagebox} ${Popstyles.taxDialogBox}`}
            >
              <div className={Popstyles.header}>
                <div className={Popstyles.letHeader}>
                  <p className={Popstyles.text}>CDMA Taxes</p>
                </div>
                <div>
                  <ImCross
                    onClick={handleClose}
                    className={Popstyles.closeButton}
                    title="Close"
                  />
                </div>
              </div>

              <div className={Popstyles.taxPopupBox}>
                <div className="d-flex align-items-center justify-content-center mb-2">
                  <p className="UnitrateNote fw-bold">
                    Assessment Number : {taxPayload.assessmentNo}
                  </p>
                </div>

                <div className="table-responsive w-100">
                  <Table
                    striped
                    bordered
                    hover
                    className={`TableData ${Popstyles.cdmaTable}`}
                  >
                    <thead>
                      <tr>
                        <th className={Popstyles.sno}>S.No</th>
                        <th>Tax Type</th>
                        <th>Amount</th>
                        <th className={Popstyles.action}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(taxTypes).map((key, index) => (
                        <tr key={key}>
                          <td>{index + 1}</td>
                          <td>
                            {key === "UnifiedPayment"
                              ? "Property Tax + Water Tax + Sewerage Tax"
                              : key}
                          </td>
                          <td>{taxTypes[key]}</td>
                          <td>
                            {taxTypes[key] === 0 ? (
                              <span>No Dues</span>
                            ) : (
                              <button
                                className={`${Popstyles.payNowBtn} ${Popstyles.taxPayBtn}`}
                                onClick={() => payCDMATax(key)}
                              >
                                PayNow
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>

                {errorMessage && (
                  <div className={Popstyles.taxErrorBox}>{errorMessage}</div>
                )}

                <div className="text-center d-flex justify-content-center mt-3">
                  <button
                    className={`${Popstyles.yesBtn} ${Popstyles.checkStatusBtn}`}
                    onClick={() => checkTaxesStatus(taxPayload, "click")}
                  >
                    Check Status
                  </button>
                </div>
              </div>

              <Row className="mb-3 mx-3">
                <Col xs={12}>
                  <div className={`${Popstyles.taxNoteBox} alert mt-4`}>
                    <label>
                      <h6>
                        <strong>Note:</strong>
                      </h6>
                      <ul>
                        <li>
                          After completing the payment, please click{" "}
                          <strong>
                            <u>Check Status</u>
                          </strong>{" "}
                          to update the status.
                        </li>
                      </ul>
                    </label>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default TaxDuesDialog;

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "../styles/pages/Mixins.module.scss";
import { Container, Row, Col, Form, Button, Table } from "react-bootstrap";
import { decryptWithAESPassPhrase, getApplicationDetails } from "../src/axios";
import Image from "next/image";
import {
  CallingAxios,
  KeepLoggedIn,
  ShowMessagePopup,
} from "../src/GenericFunctions";
import Head from "next/head";
import TaxDuesDialog from "../src/components/TaxDuesDialog";

const UrbanPropertyDues = () => {
  const router = useRouter();
  const [isTaxesView, setIsTaxView] = useState<boolean>(false);
  const [selectedProperty, setSelectedProperty] = useState<any>({});
  const [appId, setAppId] = useState("");
  const [searchResult, setSearchResult] = useState<any[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [taxPayload, setTaxPayload] = useState({});

  useEffect(() => {
    if (KeepLoggedIn()) {
      localStorage.setItem("GetApplicationDetails", "");
    } else {
      ShowMessagePopup(false, "Invalid Access", "/");
    }
  }, []);

  const { data } = router.query;

  useEffect(() => {
    if (data) {
        const decryptedAppId = decryptWithAESPassPhrase(decodeURIComponent(data as string));
        if (decryptedAppId) {
          setAppId(decryptedAppId);
          handleSearch(decryptedAppId);
        }
    }
  }, [data]);


  const redirectToPage = (location: string) => {
    router.push({
      pathname: location,
    });
  };

  const handleSearch = async (appId) => {
    setSearched(true);
    setLoading(true);
    setSearchResult([]);

    if (!appId.trim()) {
      setLoading(false);
      return;
    }

    const result = await CallingAxios(getApplicationDetails(appId));

    if (result.status && result.data) {
      setSearchResult(result.data.property);
    } else {
      setSearchResult([]);
    }

    setLoading(false);
  };

  const handlePay = (payload: any) => {
    setIsTaxView(true);
    setTaxPayload(payload);
  };

  return (
    <div className="PageSpacing">
      <Head>
        <title>Urban Property Dues - Public Data Entry</title>
      </Head>

      <Container className="ListContainer">
        <div className={styles.ListviewMain}>
          <Row className="ApplicationNum mb-4">
            <Col lg={4} md={6} sm={12}>
              <div
                className="ContainerColumn TitleColmn"
                style={{ cursor: "pointer" }}
                onClick={() => redirectToPage("/ServicesPage")}
              >
                <h4 className="TitleText left-title">
                  Urban Property Dues <span>[నగర ఆస్తి బకాయిలు]</span>
                </h4>
              </div>
            </Col>
          </Row>

          <Row className="mb-3 justify-content-center">
            <Col xs={12} sm={8} md={6} lg={5} xl={4}>
              <div className="d-flex gap-2">
                <Form.Control
                  type="text"
                  placeholder="Enter Application ID"
                  value={appId}
                  onChange={(e) => setAppId(e.target.value)}
                  className="w-100"
                  size="sm"
                />
                <Button variant="primary" onClick={() => handleSearch(appId)} size="sm">
                  Search
                </Button>
              </div>
            </Col>
          </Row>

          {searched && (
            <Row className="justify-content-center">
              <Col xs={12} md={10} lg={9} xl={8}>
                <div className={`${styles.tableWrapper} table-responsive`}>
                  {loading ? (
                    <div className="text-center my-3 text-primary">
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                      />
                      Loading...
                    </div>
                  ) : (() => {
                    const filteredResults = searchResult.filter((prop) => {
                      try {
                        const cdmaString = prop?.cdma_details;
                        if (!cdmaString || cdmaString.trim() === "") return false;
                        const parsedDetails = JSON.parse(cdmaString);
                        const hasApplicationNumber = !!parsedDetails?.applicationNumber;
                        const hasPropertyID = !!parsedDetails?.propertyID;
                        const propertyDues =
                          parseFloat(prop?.mutationPaymentDue || 0) +
                          parseFloat(prop?.mutationFee || 0);
                        return (
                          hasApplicationNumber &&
                          hasPropertyID &&
                          propertyDues !== 0
                        );
                      } catch (e) {
                        console.error("Error parsing cdma_details", e);
                        return false;
                      }
                    });

                    return filteredResults.length > 0 ? (
                      <Table
                        striped
                        bordered
                        hover
                        className="TableData"
                        style={{ fontSize: "0.9rem" }}
                      >
                        <thead className="table-primary text-center">
                          <tr>
                            <th>S.No</th>
                            <th>Document ID</th>
                            <th>Door Number</th>
                            <th>Application Number</th>
                            <th>Assessment Number</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredResults.map((prop, index) => {
                            let parsedDetails = null;
                            let applicationNumber = "";
                            let doorNo = "";
                            let ptinNo = "";
                            const cdmaString = prop?.cdma_details;
                            if (cdmaString && cdmaString.trim() !== "") {
                              try {
                                parsedDetails = JSON.parse(cdmaString);
                                applicationNumber = parsedDetails?.applicationNumber || "";
                                ptinNo = parsedDetails?.propertyID || "";
                                doorNo = parsedDetails?.houseNo || "";
                              } catch (err) {
                                console.error("Invalid JSON in cdma_details", err);
                              }
                            }
                            return (
                              <tr key={index} className="text-center">
                                <td>{index + 1}</td>
                                <td>{prop.applicationId}</td>
                                <td>{doorNo}</td>
                                <td>{applicationNumber}</td>
                                <td>{ptinNo}</td>
                                <td>
                                  <div
                                    className={`${styles.actionTitle} ${styles.actionbtn}`}
                                    onClick={() => handlePay({assessmentNo: ptinNo, applicationId: prop.applicationId, propertyId: prop.propertyId})}
                                  >
                                    <span style={{ cursor: "pointer" }}>
                                      <Image
                                        alt="Image"
                                        height={20}
                                        width={15}
                                        src="/PDE/images/paymentlist.svg"
                                        className={styles.tableactionImg}
                                      />
                                      <span
                                        className={`${styles.tooltiptext} ${styles.slotTooltip}`}
                                      >
                                        Payment
                                      </span>
                                    </span>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </Table>
                    ) : (
                      <div className="text-muted text-center mt-3">
                        No properties found for this Application ID.
                      </div>
                    );
                  })()}
                </div>
              </Col>
            </Row>
          )}
        </div>
      </Container>

      {isTaxesView && (
        <TaxDuesDialog
          taxPayload={taxPayload}
          setIsTaxView={setIsTaxView}
        />
      )}
    </div>
  );
};

export default UrbanPropertyDues;

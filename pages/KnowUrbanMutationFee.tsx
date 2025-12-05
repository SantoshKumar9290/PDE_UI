import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "../styles/pages/Mixins.module.scss";
import { Container, Row, Col, Form, Button, Table } from "react-bootstrap";
import { GetCDMADetails } from "../src/axios";
import { KeepLoggedIn, ShowMessagePopup } from "../src/GenericFunctions";
import Head from "next/head";
import { numberToWords } from "../src/utils";

const UrbanPropertyDues = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    ptin: "",
    marketValue: "",
  });
  const [formattedMarketValue, setFormattedMarketValue] = useState("");
  const [searchResult, setSearchResult] = useState<any>({});
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (KeepLoggedIn()) {
      localStorage.setItem("GetApplicationDetails", "");
    } else {
      ShowMessagePopup(false, "Invalid Access", "/");
    }
  }, []);

  const redirectToPage = (location: string) => {
    router.push({ pathname: location });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "marketValue") {
      let numericValue = value.replace(/,/g, "").replace(/\D/g, "");

      if (numericValue === "") {
        setFormData((prev) => ({ ...prev, marketValue: "" }));
        setFormattedMarketValue("");
        return;
      }

      let num = parseInt(numericValue);

      if (num > 999999999) {
        num = 999999999;
      }

      setFormData((prev) => ({
        ...prev,
        marketValue: num.toLocaleString("en-IN"),
      }));
      setFormattedMarketValue(numberToWords(num));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSearch = async () => {
    if (!formData.ptin.trim() || !formData.marketValue.trim()) {
      ShowMessagePopup(false, "PTIN Number and Market Value are required", "");
      return;
    }

    setSearched(true);
    setLoading(true);
    setSearchResult({});

    const payload = {
      ulbCode: String(formData.ptin).substring(0, 4),
      assessmentNo: formData.ptin,
      registrationValue: formData.marketValue.replace(/,/g, ""),
    };

    const result = await GetCDMADetails(payload);

    if (result.status && result.data) {
      setSearchResult(result.data);
    } else {
      setSearchResult({});
    }

    setLoading(false);
  };

  return (
    <div className="PageSpacing">
      <Head>
        <title>Know Urban Mutation Fee - Public Data Entry</title>
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
                  Know Urban Mutation Fee <span>[నగర బదిలీ రుసుము ]</span>
                </h4>
              </div>
            </Col>
          </Row>

          <Row className="mb-3 justify-content-center">
            <Col xs={12} sm={8} md={6} lg={5} xl={4}>
              <Form>
                <Form.Group className="mb-3" controlId="ptinNumber">
                  <Form.Label>
                    PTIN Number <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="ptin"
                    placeholder="Enter PTIN Number"
                    value={formData.ptin}
                    onChange={handleChange}
                    size="sm"
                    required
                    maxLength={10}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="marketValue">
                  <Form.Label>
                    Market Value <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="marketValue"
                    placeholder="Enter Market Value"
                    value={formData.marketValue}
                    onChange={handleChange}
                    size="sm"
                    required
                  />
                  {formattedMarketValue && (
                    <small className="text-muted">{formattedMarketValue}</small>
                  )}
                </Form.Group>

                <div className="d-grid">
                  <Button variant="primary" onClick={handleSearch} size="sm">
                    Get Fee
                  </Button>
                </div>
              </Form>
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
                  ) : (
                    <Table
                      striped
                      bordered
                      hover
                      className="TableData"
                      style={{ fontSize: "0.9rem" }}
                    >
                      <thead className="table-primary text-center">
                        <tr>
                          <th>PTIN Number</th>
                          <th>Owner Name</th>
                          <th>House Number</th>
                          <th>Mutation Fee</th>
                          <th>Property Due</th>
                          <th>Water Tax Due</th>
                          <th>Sewerage Due</th>
                        </tr>
                      </thead>
                      <tbody>
                        {searchResult ? (
                          <tr className="text-center">
                            <td>{searchResult.propertyID || "N/A"}</td>
                            <td>
                              {searchResult.ownerNames?.[0]?.ownerName || "N/A"}
                            </td>
                            <td>{searchResult.houseNo || "N/A"}</td>
                            <td>{searchResult.mutationFee || 0}</td>
                            <td>{searchResult.propertyDue || 0}</td>
                            <td>{searchResult.waterTaxDue || 0}</td>
                            <td>{searchResult.sewerageDue || 0}</td>
                          </tr>
                        ) : (
                          <tr>
                            <td colSpan={10} className="text-center text-muted">
                              No details found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  )}
                </div>
              </Col>
            </Row>
          )}
        </div>
      </Container>
    </div>
  );
};

export default UrbanPropertyDues;

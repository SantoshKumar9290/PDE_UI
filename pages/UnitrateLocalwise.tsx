import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import styles from '../styles/pages/Mixins.module.scss';
import Table from 'react-bootstrap/Table';
import { useRouter } from 'next/router';
import { CallingAxios } from '../src/GenericFunctions';
import { UseGetMarketClassicValue } from '../src/axios';
import Head from 'next/head';


const UnitrateLocalwise = () => {
    const router = useRouter();
    const [MarketValueList, setMarketValueList] = useState([]);
    const [MarketvalueDetails, setMarketvalueDetails] = useState({ district: "", mandal: "", village: "", landtype: "", villageCode: "", surveyno: "" })


    useEffect(() => {
        let data: any = localStorage.getItem("SearchMarketValue");
        data = JSON.parse(data);
        if (data.villageCode) {
            setMarketvalueDetails(data);
            GetMarketClassicValue(data.surveyno, data.villageCode);
        } else { router.push("/KnowmarketValuePage") }

    }, []);

    const GetMarketClassicValue = async (surveyno, villageCode) => {
        let result = await CallingAxios(UseGetMarketClassicValue(surveyno, villageCode));
        if (result.status) {
            // console.log(result);
            setMarketValueList(result.data);
        }
    }

    const redirectToPage = (location: string) => {
        router.push({
            pathname: location,
        })
    }

    const DateConverter = (inputData) => {
        if (inputData != "") {
            let date = inputData.split("T");
            date = date[0];
            date = date.split("-");
            return date[2] + "/" + date[1] + "/" + date[0];
        }
        else {
            return "";
        }
    }

    return (
        <div>
            <div className='PageSpacing'>
                <Head>
                    <title>Unitrate Localwise - Public Data Entry</title>
                </Head>
                <Container>
                    <Row>
                        <Col lg={12} md={12} xs={12}>
                            <div className={`${styles.ExecutantDetailsInfo} ${styles.marketValueInfo}`}>
                                <div className={styles.DetailsHeaderContainer} style={{ marginTop: '20px' }}>
                                    <Row>
                                        <Col lg={6} md={6} xs={12}>
                                            <div className={styles.ContainerColumn}>
                                                {/* <p className={styles.HeaderText}>Unit Rates Locality Wise</p> */}
                                                <p className={styles.HeaderText}> Survey No Wise Details [సర్వే నెంబర్ల వారీగా వివరాలు]</p>

                                            </div>
                                        </Col>
                                        <Col lg={6} md={6} xs={12}>
                                        </Col>
                                    </Row>
                                </div>
                                <form>
                                    <div className={`${styles.AddExecutantInfo}, ${styles.UnitRateInto}`}>
                                        <Row>
                                            {/* <div className='text-center'>
                                                <h5 className='surveyText'>Survey No Wise Details</h5>
                                            </div> */}
                                            <div className='table-responsive mt-2'>
                                                <Table striped bordered hover className='TableData'>
                                                    <thead>
                                                        <tr>
                                                            <th>District Name<span>[జిల్లా పేరు]</span></th>
                                                            <th className='mandalData'>Mandal Name<span>[మండలం పేరు]</span></th>
                                                            <th>City/Town/Village<span>[నగరం/పట్టణం/గ్రామం]</span></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>{MarketvalueDetails.district}</td>
                                                            <td>{MarketvalueDetails.mandal}</td>
                                                            <td>{MarketvalueDetails.village}</td>
                                                        </tr>
                                                    </tbody>
                                                </Table>
                                            </div>
                                        </Row>

                                        <div className='mt-3'>
                                            <Row>
                                                <div className='table-responsive'>
                                                    <Table striped bordered hover className='TableData'>
                                                        <thead>
                                                            <tr>
                                                                <th>S.No.<span>[క్రమసంఖ్య]</span></th>
                                                                <th>Survay No<span>[సర్వే నెంబరు]</span></th>
                                                                <th>Sub No<span>[ఉప సంఖ్య]</span></th>
                                                                <th>Land Rate Rs. per Acre.<span>[భూమి ధర ఎకరానికి రూ]</span></th>
                                                                <th className='boundaries'>Effective Date (dd/mm/yyyy)<span>[అమలులో ఉన్న తేదీ]</span></th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {MarketValueList.map((singleDetails, index) => {
                                                                return (
                                                                    <tr key={index}>
                                                                        <td>{index + 1}</td>
                                                                        <td>{singleDetails.SURVEY_NO}</td>
                                                                        <td>{singleDetails.SUB_SURVEY_NO}</td>
                                                                        <td>{singleDetails.UNIT_RATE}</td>
                                                                        <td>{DateConverter(singleDetails.EFFECTIVE_DATE)}</td>
                                                                    </tr>
                                                                )
                                                            })}
                                                        </tbody>
                                                    </Table>
                                                </div>
                                            </Row>
                                        </div>
                                        <Row>
                                            <Col lg={12} md={12} xs={12}>
                                                <div className='d-flex justify-content-center'>
                                                    <div className={styles.Proceedbtn} style={{ cursor: 'pointer' }}>
                                                        <p onClick={() => { redirectToPage("/UnitrateValue") }} className='proceedButton BackBtn'>Back</p>
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>

                                    </div>
                                </form>
                            </div>
                        </Col>
                    </Row>
                </Container>
                {/* <pre>{JSON.stringify(PropertyDetails,null,2)}</pre> */}
            </div>
        </div>
    )
}

export default UnitrateLocalwise
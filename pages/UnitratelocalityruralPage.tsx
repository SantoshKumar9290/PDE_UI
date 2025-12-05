import React, { useState, useEffect } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import styles from '../styles/pages/Mixins.module.scss';
import Table from 'react-bootstrap/Table';
import { useRouter } from 'next/router';
import { CallingAxios } from '../src/GenericFunctions';
import { UseGetMarketClassicValue, UseGetMarketValue } from '../src/axios';
import Head from 'next/head';

const UnitratelocalityruralPage = () => {
    const router = useRouter();
    const [UnitrateruralList, setUnitrateruralList] = useState([])
    const [UnitrateruralDetails, setUnitrateruralDetails] = useState({ district: "", mandal: "", village: "", landtype: "", villageCode: "", surveyno: "" })

    useEffect(() => {
        let data: any = localStorage.getItem("SearchMarketValue");
        data = JSON.parse(data);
        if (data.villageCode) {
            setUnitrateruralDetails(data);
            GetMarketValue(data.landtype, data.villageCode);
        } else { router.push("/KnowmarketValuePage") }

    }, []);

    const GetMarketValue = async (landtype, villageCode) => {
        let result = await CallingAxios(UseGetMarketValue(landtype, villageCode));
        if (result.status) {
            setUnitrateruralList(result.data);
        }
    }
    // const GetMarketClassicValue = async (surveyno, villageCode) => {
    //     let result = await CallingAxios(UseGetMarketClassicValue(surveyno, villageCode));
    //     if (result.status) {
    //         console.log(result);
    //         setUnitrateruralList(result.data);
    //     }
    // }

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

    const ShiftTODoorWiseDetails = (doorDetails) => {
        let TempDetails = { ...UnitrateruralDetails, doorDetails }
        // console.log(JSON.stringify(TempDetails, null, 2));
        localStorage.setItem("SearchMarketValue", JSON.stringify(TempDetails));
        redirectToPage("/DoornowiseDetails");
    }


    return (
        <div className='PageSpacing'>
            <Head>
                <title>Unitrate Locality - Public Data Entry</title>
            </Head>
            <Container>
                <Row>
                    <Col lg={12} md={12} xs={12}>
                        <div className={`${styles.ExecutantDetailsInfo} ${styles.marketValueInfo}`}>
                            <div className={styles.DetailsHeaderContainer} style={{ marginTop: '20px' }}>
                                <Row>
                                    <Col lg={6} md={6} xs={12}>
                                        <div className={styles.ContainerColumn}>
                                            <p className={styles.HeaderText}>Unit Rates Locality Wise [ప్రాంతం వారీగా యూనిట్ రేట్లు]</p>
                                        </div>
                                    </Col>
                                    <Col lg={6} md={6} xs={12}>
                                    </Col>
                                </Row>
                            </div>
                            <div>
                                <div className={`${styles.AddExecutantInfo}, ${styles.UnitRateInto}`}>
                                    <Row>
                                        <div className='table-responsive'>
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
                                                        <td>{UnitrateruralDetails.district}</td>
                                                        <td>{UnitrateruralDetails.mandal}</td>
                                                        <td>{UnitrateruralDetails.village}</td>
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
                                                            <th rowSpan={2}>S.No [క్రమసంఖ్య]</th>
                                                            <th rowSpan={2}>Ward-Block [వార్డ్-బ్లాక్]</th>
                                                            <th rowSpan={2}>Locality [స్థానికత]</th>
                                                            <th rowSpan={3}>Land Rate Rs. per Sq Yard [చదరపు గజానికి భూమి ధర రూ]</th>
                                                            <th colSpan={3} style={{ textAlign: "center" }}>Composite Rate Rs. Per Sq.Ft [కాంపోజిట్ ధర చదరపు అడుగులకు రూపాయలు]</th>
                                                            <th rowSpan={3}>Classification [వర్గీకరణ]</th>
                                                            <th rowSpan={2}>Effective Date (dd/mm/yyyy) [అమలులో ఉన్న తేదీ]</th>
                                                            <th rowSpan={3}>Door No. Wise Details Rates [డోర్ నంబర్ వైజ్ వివరాల ధరలు]</th>
                                                        </tr>
                                                        <tr>
                                                            <td>Ground Floor [నేల అంతస్తు]</td>
                                                            <td>First Floor [మొదటి అంతస్తు]</td>
                                                            <td>Other Floors [ఇతర అంతస్తులు]</td>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {UnitrateruralList.map((singleDetails, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td>{index + 1}</td>
                                                                    <td>{singleDetails.WARD_NO}</td>
                                                                    <td>{singleDetails.LOCALITY_STREET}</td>
                                                                    <td>{singleDetails.UNIT_RATE_RES}</td>
                                                                    <td>{singleDetails.UNIT_RATE_COM}</td>
                                                                    <td>{singleDetails.COMP_FLOOR1}</td>
                                                                    <td>{singleDetails.COMP_FLOOR_OTH}</td>
                                                                    <td>{singleDetails.CLASSIFICATION}</td>
                                                                    <td>{DateConverter(singleDetails.EFFECTIVE_DATE)}</td>
                                                                    <td><button className='getBtn' onClick={() => ShiftTODoorWiseDetails(singleDetails)} >Get</button></td>
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
                                                    <p onClick={() => { redirectToPage("/KnowmarketValuePage") }} className='proceedButton BackBtn'>Back</p>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
            {/* <pre>{JSON.stringify(UnitrateruralList,null,2)}</pre> */}
        </div>
    )
}

export default UnitratelocalityruralPage;
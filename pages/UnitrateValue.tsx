import React, { useState, useEffect } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import styles from '../styles/pages/Mixins.module.scss';
import Table from 'react-bootstrap/Table';
import TableDropdown from '../src/components/TableDropdown';
import { useRouter } from 'next/router';
import { useAppSelector, useAppDispatch } from '../src/redux/hooks';
import { CallingAxios } from '../src/GenericFunctions';
import { UseGetSurveynoList, UseGetMarketValue } from '../src/axios';
import Head from 'next/head';


const UnitrateValue = () => {
    const router = useRouter();
    const [SurveynoList, setSurveynoList] = useState([])
    const [MarketValueList, setMarketValueList] = useState([]);
    const [MarketvalueDetails, setMarketvalueDetails] = useState({ district: "", mandal: "", village: "", landtype: "", villageCode: "", surveyno: "" })


    useEffect(() => {
        let data: any = localStorage.getItem("SearchMarketValue");
        data = JSON.parse(data);
        if (data.villageCode) {
            setMarketvalueDetails(data);
            GetMarketValue(data.landtype, data.villageCode);
            GetSurveynoList(data.villageCode)
        } else { router.push("/KnowmarketValuePage") }

    }, []);

    const GetMarketValue = async (landtype, villageCode) => {
        let result = await CallingAxios(UseGetMarketValue(landtype, villageCode));
        if (result.status) {
            setMarketValueList(result.data);
        }
    }
    const GetSurveynoList = async (villageCode) => {
        let result = await CallingAxios(UseGetSurveynoList(villageCode));
        if (result.status) {
            let data = result.data;
            let newData = [];
            data.map(x => newData.push(x.SURVEY_NO))
            setSurveynoList(newData);
        }
    }

    const redirectToPage = (location: string) => {
        router.push({
            pathname: location,
        })
    }

    const onChange = (event: any) => {
        let TempDetails = { ...MarketvalueDetails }
        let addName = event.target.name;
        let addValue = event.target.value;
        if (addName == "surveyno") {
            TempDetails = { ...TempDetails, surveyno: addValue }
            localStorage.setItem("SearchMarketValue", JSON.stringify(TempDetails));
            router.push("/UnitrateLocalwise");
        }
        setMarketvalueDetails({ ...TempDetails, [addName]: addValue })
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
        <div className='PageSpacing'>
            <Container>
                <Row>
                    <Col lg={12} md={12} xs={12}>
                        <div className={`${styles.ExecutantDetailsInfo} ${styles.marketValueInfo}`}>
                            <div className={styles.DetailsHeaderContainer} style={{ marginTop: '20px' }}>
                                <Row>
                                    <Col lg={6} md={6} xs={12}>
                                        <div className={styles.ContainerColumn}>
                                            <p className={styles.HeaderText}>Unit Rates Village Wise [గ్రామాల వారీగా యూనిట్ రేట్లు]</p>
                                        </div>
                                    </Col>
                                    <Col lg={6} md={6} xs={12}>
                                    </Col>
                                </Row>
                            </div>
                            <form>
                                <div className={`${styles.AddExecutantInfo}, ${styles.UnitRateInto}`}>
                                    <Row>
                                        <div className='table-responsive'>
                                            <Table striped bordered hover className='TableData'>
                                                <thead>
                                                    <tr>
                                                        <th>District Name<span>[జిల్లా పేరు]</span></th>
                                                        <th className='mandalData'>Mandal Name<span>[మండలం పేరు]</span></th>
                                                        <th className='mandalData'>City/Town/Village<span>[నగరం/పట్టణం/గ్రామం]</span></th>
                                                        <th>Survey No.<span>[సర్వే నెంబరు]</span></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>{MarketvalueDetails.district}</td>
                                                        <td>{MarketvalueDetails.mandal}</td>
                                                        <td>{MarketvalueDetails.village}</td>
                                                        <td><TableDropdown required={true} options={SurveynoList} name='surveyno' value={MarketvalueDetails.surveyno} onChange={onChange} /></td>
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
                                                            <th>Habitation<span>[నివాసస్థలం]</span></th>
                                                            <th>Nature Of Use<span>[ఉపయోగ స్వభావం]</span></th>
                                                            <th>Land Rate Rs. per Acre.<span>[భూమి ధర ఎకరానికి రూ]</span></th>
                                                            <th className='boundaries'>Effective Date (dd/mm/yyyy)<span>[అమలులో ఉన్న తేదీ]</span></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {MarketValueList.map((singleDetails, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td>{index + 1}</td>
                                                                    <td>{singleDetails.HAB_NAME}</td>
                                                                    <td>{singleDetails.CLASS_DESC}</td>
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
                                                    <p onClick={() => { redirectToPage("/KnowmarketValuePage") }} className='proceedButton BackBtn'>Back</p>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>

                                    <div className='UnitrateNote'>
                                        <Row>
                                            <Col>
                                                <h6>Note :</h6>
                                                <ol>
                                                    <li>This is provisional information as per records maintained by registration department for the purpose of helping the registering public to estimate the stamp duty only,
                                                        subject to change due to revision of market value once in a year OR adhocly due to anomalies.</li>
                                                    <li>For further details contact Sub Registrar office.</li>
                                                </ol>
                                            </Col>
                                        </Row>
                                    </div>

                                </div>
                            </form>
                        </div>
                    </Col>
                </Row>
            </Container>
            {/* <pre>{JSON.stringify(PropertyDetails,null,2)}</pre> */}
        </div>
    )
}

export default UnitrateValue
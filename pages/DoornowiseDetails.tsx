import React,{useState, useEffect} from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import styles from '../styles/pages/Mixins.module.scss';
import Table from 'react-bootstrap/Table';
import { useRouter } from 'next/router';
import { CallingAxios, ShowMessagePopup } from '../src/GenericFunctions';
import { UseGetDoorWiseValue } from '../src/axios';
import Head from 'next/head';

const DoornowiseDetails = () => {
    const router = useRouter();
    const [DoorwiseValueList, setDoorwiseValueList] = useState([]);
    const [DoorwiseDetails, setDoorwiseDetails]=useState({ district:"", mandal:"", village:"", landtype: "", villageCode: "", surveyno: ""})

    useEffect(() => {
        let data: any = localStorage.getItem("SearchMarketValue");
        data = JSON.parse(data);
        if (data.villageCode) {
            setDoorwiseDetails(data);
            // console.log(data);
            GetDoorWiseValue(data.doorDetails.WARD_NO,data.doorDetails.BLOCK_NO,data.doorDetails.HABITATION);
        } else { router.push("/KnowmarketValuePage") }

    }, []);

const GetDoorWiseValue = async (WARD_NO:any,BLOCK_NO:any,habitation:any) => {
        let result = await CallingAxios(UseGetDoorWiseValue(WARD_NO,BLOCK_NO,habitation));
        // console.log(result);
        if (result.status) {
            // console.log(result);
            setDoorwiseValueList(result.data);
        }
        else{
            ShowMessagePopup(false,"Data fetch Failed","");
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
    <div className='PageSpacing'>
        <Head>
        <title>Doornumberwise - Public Data Entry</title>
      </Head>

    <Container>
        <Row>
            <Col lg={12} md={12} xs={12}>
                <div className={`${styles.ExecutantDetailsInfo} ${styles.marketValueInfo}`}>
                    <div className={styles.DetailsHeaderContainer} style={{ marginTop: '20px' }}>
                        <Row>
                            <Col lg={6} md={6} xs={12}>
                                <div className={styles.ContainerColumn}>
                                    <p className={styles.HeaderText}>Door No Wise Details [డోర్ నెంబర్ల వారీగా వివరాలు]</p>
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
                                                <th className='boundaries'>District Name<span>[జిల్లా పేరు]</span></th>
                                                <th>Mandal Name<span>[మండలం పేరు]</span></th>
                                                <th>City/Town/Village<span> [నగరం/పట్టణం/గ్రామం]</span></th>
                                                <th>Locality<span>[స్థానికత]</span></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>{DoorwiseDetails.district}</td>
                                                <td>{DoorwiseDetails.mandal}</td>
                                                <td>{DoorwiseDetails.village}</td>
                                                <td>{DoorwiseDetails.landtype}</td>
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
                                                    <th rowSpan={2}>S.No<span>[క్రమసంఖ్య]</span></th>
                                                    <th rowSpan={2}>Ward-Block<span>[వార్డ్-బ్లాక్]</span></th>
                                                    <th rowSpan={2}>Door No<span>[డోర్ నెంబరు]</span></th>
                                                    <th rowSpan={3}>Land Rate Rs. Sq Yard<span>[చదరపు గజానికి భూమి ధర రూ]</span></th>
                                                    <th colSpan={3} style={{textAlign:"center"}}>Composite Rate Rs. Per Sq.Ft<span>[కాంపోజిట్ ధర చదరపు అడుగులకు రూపాయలు]</span></th>
                                                    <th rowSpan={2}>Effective Date (dd/mm/yyyy)<span>[అమలులో ఉన్న తేదీ]</span></th>
                                                </tr>
                                                <tr>
                                                    <td>Ground Floor<span>[నేల అంతస్తు]</span></td>
                                                    <td>First Floor<span>[మొదటి అంతస్తు]</span></td>
                                                    <td>Other Floors<span>[ఇతర అంతస్తులు]</span></td>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {DoorwiseValueList.map((singleDetails, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>{singleDetails.WARD_NO}</td>
                                                            <td>{singleDetails.DOOR_NO}</td>
                                                            <td>{singleDetails.UNIT_RATE}</td>
                                                            <td>{singleDetails.COMP_FLOOR_OTH}</td>
                                                            <td>{singleDetails.COMP_FLOOR1}</td>
                                                            <td>{singleDetails.REV_COMP_FLOOR_OTH}</td>
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

export default DoornowiseDetails
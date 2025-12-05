import React, {useEffect, useState} from 'react';
import { CallingAxios, ShowMessagePopup } from '../src/GenericFunctions';
import { getExecutionList } from '../src/axios';
import styles from '../styles/pages/Mixins.module.scss';
import { Col, Container, Row, Table } from 'react-bootstrap';
import Head from 'next/head';
import { useAppDispatch, useAppSelector } from '../src/redux/hooks';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { setAppId } from '../src/redux/commonSlice';


const ExecutionList = (props) => {

    const [list, setList] = useState([]);
    let Loader = useAppSelector((state) => state.common.Loading);
    const router = useRouter();
    const dispatch = useAppDispatch();

    useEffect(() => {
        (async () => {
            let result = await CallingAxios(getExecutionList());
            if(result.status){
                setList(result.response);
            } else {
                ShowMessagePopup(false, result.message, '')
            }
        })();

    }, [])

    const redirectToPage = (location: string) => {
        router.push({
            pathname: location,
        })
    }

    return (
        <div className='PageSpacing'>
                <Head>
                    <title>Application List - Public Data Entry</title>
                </Head>
                <Container className='ListContainer'>
                    <Row>
                        <Col lg={12} md={12} xs={12}>
                            <div className={styles.ListviewMain}>
                                <Row className='ApplicationNum'>
                                    <Col lg={4} md={6} xs={12}>
                                        <div className='ContainerColumn TitleColmn' onClick={() => { redirectToPage("/ServicesPage") }}>
                                            <h4 className='TitleText left-title'>Execution List<span>[ జాబితా]</span></h4>
                                        </div>
                                    </Col>
                                    <Col lg={6} md={6} xs={0}></Col>
                                </Row>
                                <Row>
                                    <Col lg={12} md={12} xs={12}>
                                        <div className='tableFixHead'>
                                            <Table striped bordered hover className='TableData ListData table-responsive'>
                                                <thead>
                                                    <tr>
                                                        <th className='SCol'>S.No.<span>[క్రమ సంఖ్య]</span></th>
                                                        <th className='AppidColmn'>Application ID<span>[అప్లికేషన్ ID]</span></th>
                                                        <th className='DocColmn'>Document Type<span>[దస్తావేజు రకం]</span></th>
                                                        <th className='sroColmn'>S.R.O<span>[ఎస్.ఆర్.ఓ]</span></th>
                                                        <th className='SCol'>Action<span>[చర్య]</span></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        list.map((l,index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td>{index + 1}</td>
                                                                    <td>{l.documentId}</td>
                                                                    <td>{l.documentSubType.TRAN_DESC}</td>
                                                                    <td>{l.sroOffice}</td>
                                                                    <td className={styles.actionsCol}>
                                                                    <div className={`${styles.actionTitle} ${styles.actionbtn} ${styles.singleEditIcon}`} onClick={() => {
                                                                        dispatch(setAppId(l.documentId));
                                                                        localStorage.setItem('app-det', JSON.stringify(l));
                                                                        setTimeout(() => {
                                                                            redirectToPage('/PartiesEsign');
                                                                        })
                                                                    }}>
                                                                                    <Image alt="Image" height={20} width={20} src='/PDE/images/AadharEsign.svg' className={styles.tableactionImg} data-toggle="tooltip" data-placement="bottom" />
                                                                                    <span className={styles.tooltiptext}>Esign</span>
                                                                                </div>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })
                                                    }
                                                </tbody>
                                            </Table>
                                            {!list.length && Loader.enable == false ?
                                                <Table striped bordered hover className='text-center noDataMessage table-responsive'>
                                                    <thead className='noDataMessage'>
                                                        <tr className='table-responsive noDataMessage'>
                                                            <th className='noDataMessage'>No Applications found</th>
                                                        </tr>
                                                    </thead>
                                                </Table> : null
                                            }
                                        </div>

                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                </Container>
                {/* <pre>{JSON.stringify(ApplicationList, null, 2)}</pre> */}
        </div>

    )
};

export default ExecutionList;
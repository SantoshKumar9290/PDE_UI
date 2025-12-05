import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import styles from '../styles/pages/Mixins.module.scss';
import Image from 'next/image';
import { useAppSelector, useAppDispatch } from '../src/redux/hooks';
import { useRouter } from 'next/router';

const FinishDocumentSuccessPage = () => {
    const router = useRouter();
    let GetstartedDetails = useAppSelector(state => state.form.GetstartedDetails);
    let LoginDetails = useAppSelector((state) => state.login.loginDetails);

    return (
        <div className='PageSpacing'>
            <Container>
                <Row>
                    <Col lg={12} md={12} xs={12}>
                        <div className={styles.ReportsViewMain}>
                            <Row className='ApplicationNum'>
                                <Col lg={6} md={6} xs={12}>
                                    <div className='ContainerColumn'>
                                        <h4 className='TitleText'><Image alt="Image" height={24} width={14} src='/PDE/images/arrow-img.png' className='tableImg' />Complete Document [పూర్తి పత్రం]</h4>
                                    </div>
                                </Col>
                                <Col lg={6} md={6} xs={12}>
                                    <div className='ContainerColumn'>
                                        <h4 className='TitleText' style={{ textAlign: 'right' }}>Application ID: {GetstartedDetails.applicationId}</h4>
                                    </div>
                                </Col>
                            </Row>
                            <div className={styles.ReportsViewInfo}>
                                <Row>
                                    <Col lg={4} md={4} xs={12}></Col>
                                    <Col lg={4} md={4} xs={12}>
                                        <div className={styles.DocViewContainer}>
                                            <div className={styles.DocImage}>
                                                <Image alt="Image" height={120} width={120} src='/PDE/images/finish-success-img.png' />
                                            </div>
                                            <p className={styles.DocText}>Document has been Finished Successfully <br />[పత్రం విజయవంతంగా పూర్తయింది]</p>
                                        </div>
                                    </Col>
                                    <Col lg={4} md={4} xs={12}></Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <div className={styles.FinishBtnInfo}>
                                            <button
                                                className='proceedButton' onClick={() => router.push("/ServicesPage")}>Back</button>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container >
        </div >
    )
}

export default FinishDocumentSuccessPage
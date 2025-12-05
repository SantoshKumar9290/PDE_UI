import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import styles from '../styles/pages/Mixins.module.scss';
import TableText from '../src/components/TableText';
import TableInputText from '../src/components/TableInputText';
import Image from 'next/image';
import { useAppSelector, useAppDispatch } from '../src/redux/hooks';
import { useRouter } from 'next/router';
import { PopupAction } from '../src/redux/commonSlice';
import { UseChangeStatus } from '../src/axios';
import { stringify } from 'querystring';
import { CallingAxios } from '../src/GenericFunctions';


const FinishDocumentViewPage = () => {
    const router = useRouter();
    const dispatch = useAppDispatch()
    const [NoOfDocuments, setNoOfDocuments] = useState("");
    let GetstartedDetails = useAppSelector(state => state.form.GetstartedDetails);
    let LoginDetails = useAppSelector(state => state.login.loginDetails);

    const OnFinish = async () => {
        let data = {
            "applicationId": GetstartedDetails.applicationId,
            status: "COMPLETED",
            noOfDocuments: NoOfDocuments
        }
        
        let result = await CallingAxios(UseChangeStatus(data));
        if (result.status) {
            router.push("/FinishDocumentSuccessPage");
        }
        else {
            dispatch(PopupAction({ enable: true, type: false, message: result.message.error, redirectOnSuccess: "" }));
        }
    }
    return (
        <div className='PageSpacing'>
            <Container>
                <Row>
                    <Col lg={12} md={12} xs={12}>
                        <div className={styles.ReportsViewMain}>
                            <Row className='ApplicationNum'>
                                <Col lg={6} md={6} xs={12}>
                                    <div className='ContainerColumn' style={{ cursor: 'pointer' }} onClick={() => { router.push("/ApplicationListPage"); }}>
                                        <h4 className='TitleText'><Image alt="Image" height={22} width={12} src='/PDE/images/arrow-img.png' className='tableImg' /> Complete Document [పూర్తి పత్రం]</h4>
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
                                            <p className={styles.DocText}>Please ensure before completing the document [దయచేసి పత్రాన్ని పూర్తి చేసే ముందు నిర్ధారించుకోండి]</p>
                                            <div className={styles.DocImage}>
                                                <Image alt="Image" height={100} width={100} src='/PDE/images/finish-doc-img.png' />
                                            </div>
                                            <div className={styles.InputBox}>
                                                <TableText label={"No of Pages in Document [పత్రంలో పేజీల సంఖ్య]"} required={true} LeftSpace={false} />
                                                <TableInputText type='number' placeholder='Enter No of Pages' required={true} name='NoOfDocuments' value={NoOfDocuments} splChar={false} onChange={(e: any) => setNoOfDocuments(e.target.value)} />
                                            </div>
                                        </div>
                                    </Col>
                                    <Col lg={4} md={4} xs={12}></Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <div className={styles.FinishBtnInfo}>
                                            <button className='proceedButton finishButton' onClick={() => OnFinish()}>Proceed to Complete</button>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}
export default FinishDocumentViewPage
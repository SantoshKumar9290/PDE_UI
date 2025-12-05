import React, { Fragment, useEffect, useLayoutEffect, useState } from 'react'
import { useRouter } from 'next/router';
import { useAppSelector, useAppDispatch } from '../src/redux/hooks';
import styles from '../styles/pages/Mixins.module.scss';
import { Container, Row, Col } from 'react-bootstrap';
import Image from 'next/image';
import Table from 'react-bootstrap/Table';
import { getApplicationDetails, useDeleteParty } from '../src/axios';
import { SaveGetstartedDetails } from '../src/redux/formSlice';
import { GrDocumentLocked } from 'react-icons/gr';
import { CallingAxios, KeepLoggedIn, ShowMessagePopup } from '../src/GenericFunctions';


const FinishDocument = () => {

    const dispatch = useAppDispatch();
    const router = useRouter();
    let GetstartedDetails = useAppSelector(state => state.form.GetstartedDetails);
    let LoginDetails = useAppSelector((state) => state.login.loginDetails);
    let [ApplicationList, setApplicationList] = useState<any>([]);

    useEffect(() => { if (KeepLoggedIn()) { GetApplicationDetails(); localStorage.setItem("GetApplicationDetails", ""); } else { ShowMessagePopup(false, "Invalid Access", "/") } }, []);

    const GetApplicationDetails = async () => {
        let query = { status: ["SUBMITTED", "COMPLETED"] }
        let result = await CallingAxios(getApplicationDetails(query));

        if (result.status) {
            let data = result.data;
            // let data2 = [];
            // data.map(SingleApplication => {
            //     if (SingleApplication.status !== "SUBMITTED") { return; }
            //     else { data2.push(SingleApplication) }
            // })
            setApplicationList(data);
        } else {
            ShowMessagePopup(false,"Get Application Details Failed","");
        }
    }

    const redirectToPage = (location: string) => {
        router.push({
            pathname: location,
        })
    }


    const OnClickOperation = (action: string, applicationId: string) => {
        let data = { ...GetApplicationDetails, applicationId }
        dispatch(SaveGetstartedDetails(data));
        switch (action) {
            case "edit": router.push("/DocumentViewDetailsPage"); break;
            case "finish": router.push("FinishDocumentViewPage"); break;
            default: break;
        }
    }


    return (
        <div className='PageSpacing'>
            <Container>
                <Row>
                    <Col lg={12} md={12} xs={12}>
                        <div className={styles.ListviewMain}>
                            <Row className='ApplicationNum'>
                                <Col lg={6} md={6} xs={12}>
                                    <div className='ContainerColumn' onClick={() => { redirectToPage("/ServicesPage") }}>
                                        <h4 className='TitleText left-title'>Complete Document [పూర్తి పత్రం]</h4>
                                    </div>
                                </Col>
                            </Row>

                            <Row>
                                <Col lg={12} md={12} xs={12}>
                                    <div className='tableFixHead'>
                                        <Table striped bordered hover className='TableData ListData'>
                                            <thead>
                                                <tr> <th>Sl.No</th> <th>Application ID</th> <th>Doc Type</th> <th>S.R.O</th> <th>Date</th> <th>Status</th> <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    ApplicationList.map((SingleApplication, index) => {
                                                        return (
                                                            <tr key={index}>
                                                                <td>{index + 1}</td>
                                                                <td>{SingleApplication.applicationId}</td>
                                                                <td>{SingleApplication.registrationType.TRAN_DESC}</td>
                                                                <td>{SingleApplication.sroOffice}</td>
                                                                <td>Date</td>
                                                                <td>{SingleApplication.status}</td>
                                                                <td>
                                                                    <div className={`${styles.actionTitle} ${styles.actionbtn}`} onClick={() => OnClickOperation("edit", SingleApplication.applicationId)}>
                                                                        <Image alt="Image" height={16} width={16} src='/PDE/images/view-icon.png' className={styles.tableactionImg} />
                                                                        View
                                                                    </div>
                                                                    {SingleApplication.status == "SUBMITTED" && <div className={`${styles.actionTitle} ${styles.actionbtn}`} onClick={() => OnClickOperation("finish", SingleApplication.applicationId)}>
                                                                        {/* <Image alt="Image" height={20} width={20} src='/PDE/images/view-icon.png' className={styles.tableactionImg} /> */}
                                                                        <GrDocumentLocked className={styles.tableactionImg} style={{ marginRight: '5px' }} />
                                                                        Finish
                                                                    </div>}
                                                                </td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                            </tbody>
                                        </Table>
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

}

export default FinishDocument
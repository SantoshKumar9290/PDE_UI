import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import { useAppSelector, useAppDispatch } from '../src/redux/hooks';
import styles from '../styles/pages/Mixins.module.scss';
import { Container, Row, Col } from 'react-bootstrap';
import Image from 'next/image';
import Table from 'react-bootstrap/Table';
import { SaveGetstartedDetails } from '../src/redux/formSlice';
import { getApplicationDetails } from '../src/axios';
import { CallingAxios, KeepLoggedIn, ShowMessagePopup } from '../src/GenericFunctions';
import Head from 'next/head';
import { returnDate } from '../src/utils';


const SlotBooking = () => {
    const dispatch = useAppDispatch()
    const router = useRouter();
    let [ApplicationList, setApplicationList] = useState<any>([]);
    let Loader = useAppSelector((state) => state.common.Loading);        

    const redirectToPage = (location: string) => {
        router.push({
            pathname: location,
        })
    }

    useEffect(() => { if (KeepLoggedIn()) { GetApplicationDetails(); localStorage.setItem("GetApplicationDetails", ""); } else { ShowMessagePopup(false, "Invalid Access", "/") } }, []);

    const GetApplicationDetails = async () => {
        let query = { status: ["SUBMITTED", "SLOT BOOKED","SYNCED"]};
        let result: any = await CallingAxios(getApplicationDetails(query, true));
        if (result.status == true) {
            let x: any = [...result.data];
            // for (let i in result.data) {
            //     x[i].slots = result.data[i]?.slots?.slotDate ? result.data[i].slots.slotDate + ',' + result.data[i].slots.slotTime : null;
            //     console.log(x[i].slots);
            // }
            setApplicationList(x);
        } else {
            alert(result.message)
        }
    }

    const OnClickOperation = (action: string, singleData: any) => {
        if (action == "edit") {
            let data = { ...singleData }
            localStorage.setItem("GetApplicationDetails", JSON.stringify(data));
            dispatch(SaveGetstartedDetails(data));
            setTimeout(()=> {
                router.push("/PaymentsPage");
            }, 0);
        }
        // else if (action == "SLOT BOOKED") {
        //     router.push("/ReportsPage");
        // }
    }

    return (
        <div className='PageSpacing'>
            <Head>
                <title>Payment List - Public Data Entry</title>
            </Head>
            <Container className='ListContainer'>
                <div className={styles.ListviewMain}>
                    <Row className='ApplicationNum'>
                        <Col lg={4} md={6} sm={12}>
                            <div className='ContainerColumn TitleColmn' style={{ cursor: "pointer" }} onClick={() => { redirectToPage("/ServicesPage") }}>
                                <h4 className='TitleText left-title'>Payment List<span>[చెల్లింపు జాబితా]</span></h4>
                            </div>
                        </Col>
                        <Col lg={8} md={8} sm={12}>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={12} md={12} sm={12}>
                            <div className='tableFixHead'>
                                <Table striped bordered hover className='TableData ListData'>
                                    <thead>
                                        <tr>
                                            <th>S.No.<span>[క్రమ సంఖ్య]</span></th>
                                            <th>Application ID<span>[అప్లికేషన్ ID]</span></th>
                                            <th>Document Type<span>[దస్తావేజు రకం]</span></th>
                                            <th>S.R.O<span>[ఎస్.ఆర్.ఓ]</span></th>
                                            <th>Execution Date<span>[ఎగ్జిక్యూషన్ తేదీ]</span></th>
                                            <th>Status<span>[స్థితి]</span></th>
                                            <th>Action<span>[చర్య]</span></th>
                                        </tr>
                                    </thead>
                                    {ApplicationList.length ?
                                        <tbody>
                                            {
                                                ApplicationList.map((SingleApplication: any, index: any) => {
                                                    // if (SingleApplication.status == "COMPLETED") {
                                                    return (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>{SingleApplication.documentId}</td>
                                                            <td>{SingleApplication.documentSubType.TRAN_DESC}</td>
                                                            <td>{SingleApplication.sroOffice}</td>
                                                            <td>{returnDate(SingleApplication.createdAt)}</td>
                                                            <td>{SingleApplication.status}</td>
                                                            {
                                                                !(SingleApplication?.documentSubType?.TRAN_MAJ_CODE == '08' && SingleApplication?.documentSubType?.TRAN_MIN_CODE == '06') 
                                                                && (
                                                                    <td>
                                                                        {/* {SingleApplication.slots != "" && SingleApplication.slots || SingleApplication.slots == null ? */}
                                                                        <div className={`${styles.actionTitle} ${styles.actionbtn}`}
                                                                            onClick={() => OnClickOperation("edit", SingleApplication)}>
                                                                            <span style={{ cursor: "pointer" }}>
                                                                                <Image alt="Image" height={20} width={15} src='/PDE/images/paymentlist.svg' className={styles.tableactionImg} />
                                                                                <span className={`${styles.tooltiptext} ${styles.slotTooltip}`}>Payment</span>
                                                                            </span>
                                                                        </div> 
                                                                        {/* : null} */}

                                                                    </td>
                                                                )
                                                            }
                                                        </tr>
                                                    )
                                                    // }
                                                })
                                            }

                                        </tbody> : null
                                    }
                                </Table>
                                {!ApplicationList.length && Loader.enable == false ?
                                <Table striped bordered hover className='text-center'>
                                    <thead>
                                        <tr>
                                            <th>Not Found Payment List</th>                                        
                                        </tr>
                                    </thead>
                                </Table>: null
                                }
                            </div>
                        </Col>
                    </Row>
                </div>
            </Container>
            {/* {<pre>{JSON.stringify(ApplicationList, null, 2)}</pre>} */}
        </div>
    )
}
export default SlotBooking;

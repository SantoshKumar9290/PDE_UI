import { Fragment, useEffect, useLayoutEffect, useState } from 'react'
import { useRouter } from 'next/router';
import { FaRegEdit } from 'react-icons/fa';
import { useAppSelector, useAppDispatch } from '../src/redux/hooks';
import styles from '../styles/pages/Mixins.module.scss';
import { Container, Row, Col, Modal, Button } from 'react-bootstrap';
import Image from 'next/image';
import Table from 'react-bootstrap/Table';
import { SaveGetstartedDetails } from '../src/redux/formSlice';
import { UseDeleteApplication, getAnywhereDocStatus, getApplicationDetails } from '../src/axios';
import { CallingAxios, KeepLoggedIn, ShowMessagePopup, ShowPreviewPopup } from '../src/GenericFunctions';
import Head from 'next/head';
import { DeletePopupAction } from '../src/redux/commonSlice';

const Reports = () => {

    const [showAnywhereModal, setShowAnywhereModal] = useState(false);
    const [docStatus, setDocstatus] = useState<any>([]);
    const dispatch = useAppDispatch()
    let LoginDetails = useAppSelector((state) => state.login.loginDetails);
    const router = useRouter();
    let Loader = useAppSelector((state) => state.common.Loading);
    let DeleteOption = useAppSelector(state => state.common.DeletePopupMemory);
    let [ApplicationList, setApplicationList] = useState<any>([]);
    let GetstartedDetails = useAppSelector(state => state.form.GetstartedDetails);

    const redirectToPage = (location: string) => {
        router.push({
            pathname: location,
        })
    }

    useEffect(() => { if (KeepLoggedIn()) { GetApplicationDetails(); } else { ShowMessagePopup(false, "Invalid Access", "/") } }, []);

    useEffect(() => {
        if (DeleteOption.response) {
            CallDeleteAction(DeleteOption.deleteId);
            dispatch(DeletePopupAction(
                {
                    enable: false,
                    response: false,
                    message: "",
                    redirectOnSuccess: "",
                    deleteId: "",
                    applicationId: ""
                }))
        }
    }, [DeleteOption]);

    const CallDeleteAction = async (applicationId: string) => {
        let result = await CallingAxios(UseDeleteApplication(applicationId, LoginDetails.token));
        if (result.status) {

            GetApplicationDetails();
            ShowMessagePopup(true, "Application ID: " + applicationId + " has been deleted successfully", "");
        }
        else {
            ShowMessagePopup(false, result.message.message, "");
        }
    }

    let Anywherestat: any = ApplicationList.property?.some(property => property.sroCode !== ApplicationList.sroCode)

    const GetApplicationDetails = async () => {
        // let query = { status: ["COMPLETED", "SLOT BOOKED"] }

        //let query = { status: ["SLOT BOOKED", "COMPLETED"] }
        let query = { status: ["SLOT BOOKED", "DRAFT", "SUBMITTED", "SYNCED"] }
        let result = await CallingAxios(getApplicationDetails(query));
        if (result.status) {
            // let data = result.data;
            // let data2 = [];
            // data.map(SingleApplication => {
            //     if (SingleApplication.status !== "COMPLETED") { return; }
            //     else { data2.push(SingleApplication) }
            // })
            setApplicationList(result.data);

        } else {
            ShowMessagePopup(false, result.message, "")
        }
    }
    const ShowDeletePopup = (message, redirectOnSuccess, deleteId) => {
        dispatch(DeletePopupAction({ enable: true, inProcess: false, message, redirectOnSuccess, deleteId }));
    }

    const OnClickOperation = (action: string, applicationId: string) => {
        if (action == "edit") {
            let data = { ...GetApplicationDetails, applicationId }
            localStorage.setItem("GetApplicationDetails", JSON.stringify(data));
            dispatch(SaveGetstartedDetails(data));
            router.push("/ReportsViewPage");
        }
    }

    const OnClickStatus = async (action, applicationId) => {
        console.log("Clicked:", action, applicationId);

        try {
            const result = await CallingAxios(getAnywhereDocStatus({ APP_ID: applicationId }));
            if (result.status) {
                setDocstatus(result.data);
                const appData = ApplicationList.find(app => app.applicationId === applicationId);

                if (action === "anywhereStatus") {
                    setShowAnywhereModal(true);
                }
            } else {
                ShowMessagePopup(false, result.message, "");
            }
        } catch (error) {
            console.error("Error calling AnywhereDocStatus:", error);
            ShowMessagePopup(false, "Failed to fetch status", "");
        }
    };

    const imageUrl = "/PDE/images/AP-govt-logo-new.png";

    // const printAnywhereDocStatusTable = () => {
    //     const currentDateTime = new Date().toLocaleString('en-GB', {
    //         hour12: true,
    //         hour: 'numeric',
    //         minute: 'numeric',
    //         second: 'numeric',
    //         day: '2-digit',
    //         month: '2-digit',
    //         year: 'numeric'
    //     });

    //     const headerContent = `
    //     <div style="text-align: center; margin: 20px; margin-top: 0;">
    //      <div>
    //         <img src="${imageUrl}" alt="Gov Logo" style="max-width: 75px;" onerror="this.style.display='none'" />
    //       </div>
    //       <div style="font-size: 17px;">GOVERNMENT OF ANDHRA PRADESH</div>
    //       <div style="font-size: 16px;">REGISTRATIONS & STAMPS DEPARTMENT</div>
    //       <div style="margin-top: 15px; text-decoration: underline; font-size: 20px; font-weight: 700;">Anywhere Document Status</div>
    //     </div>
    //   `;
    //     const tableHeader = `
    //       <table border="1" cellspacing="0" cellpadding="5" style="width: 100%; border-collapse: collapse; font-size: 11px;">
    //         <thead style="background-color: #274c77; color: white;">
    //           <tr>
    //             <th>S.No.</th>
    //             <th>Application ID</th>
    //             <th>Schedule No.</th>
    //             <th>S.R.O</th>
    //             <th>Jurisdiction</th>
    //             <th class="pp-comments">PP Check</th>
    //             <th class="mv-comments">MV Check</th>
    //             <th>PP Comments</th>
    //             <th>MV Comments</th>
    //             <th>Other Comments</th>
    //             <th>Status</th>
    //           </tr>
    //         </thead>
    //         <tbody>
    //     `;

    //     const tableBody = docStatus && Array.isArray(docStatus) && docStatus.length > 0
    //         ? docStatus.map((item, index) => `
    //           <tr>
    //             <td>${index + 1}</td>
    //             <td>${item.ID ?? '-'}</td>
    //             <td>${item.SCHEDULE_NO ?? '-'}</td>
    //             <td>${item.SR_NAME ? `${item.SR_NAME} (${item.SR_CODE})` : '-'}</td>
    //             <td>${item.JURISDICTION_NAME ? `${item.JURISDICTION_NAME} (${item.JURISDICTION})` : '-'}</td>
    //             <td class="pp-comments">${item.PP_CHECK === 'Y' ? 'YES' : item.PP_CHECK === 'N' ? 'NO' : '-'}</td>
    //             <td class="mv-comments">${item.MV_CHECK === 'Y' ? 'YES' : item.MV_CHECK === 'N' ? 'NO' : '-'}</td>
    //             <td class="pp-comments">${item.PP_COMMENTS ?? '-'}</td>
    //             <td class="mv-comments">${item.MV_COMMENTS ?? '-'}</td>
    //             <td class="mv-comments">${item.REJECT_REASON ?? '-'}</td>
    //             <td>${item.STATUS ?? '-'}</td>
    //           </tr>
    //         `).join("")
    //         : `
    //           <tr>
    //             <td colspan="11" style="text-align: center; font-weight: bold;">No Data Found</td>
    //           </tr>
    //         `;

    //     const tableFooter = `
    //         </tbody>
    //       </table>
    //     `;

    //     const printStyles = `
    //     <style>
    //       @media print {
    //         /* Remove browser default print headers/footers */
    //         @page {
    //           size: auto;
    //           margin: 10mm;
    //         }
 
    //         body {
    //           font-family: Arial, sans-serif;
    //           -webkit-print-color-adjust: exact;
    //           margin: 0;
    //           padding: 10mm;
    //         }
 
    //         table {
    //           width: 100%;
    //           border-collapse: collapse;
    //         }
 
    //        td, th {
    //          border: 1px solid black;
    //          padding: 6px;
    //          font-size: 11px;
    //          word-wrap: break-word;
    //          word-break: break-word;
    //          white-space: normal;
    //          vertical-align: top;
    //         }

    //           /* Restricting width of PP and MV Comments */
    //           td.pp-comments, th.pp-comments,
    //            td.mv-comments, th.mv-comments {
    //               max-width: 100px; 
    //               width: 100px;
    //               overflow-wrap: break-word;
    //             }                 
    //         thead th {
    //           background-color: #274c77;
    //           color: white;
    //         }
 
    //         /* Footer with "Generated on" at the bottom of every page */
    //         .footer {
    //           position: fixed;
    //           bottom: 0;
    //           left: 0;
    //           right: 0;
    //           width: 100%;
    //           font-size: 12px;
    //           text-align: right;
    //           padding: 5px 20px;
    //           border-top: 1px solid black;
    //           background: white;
    //         }
 
    //         /* Ensure footer appears on every page */
    //         @page {
    //           @bottom-center {
    //          Page " counter(page) " of " counter(pages);
    //           }
    //         }
 
    //         /* Hide default browser-generated headers and footers */
    //         @page:first {
    //           margin-top: 0;
    //         }
    //       }
    //     </style>
    //   `;

    //     const newWindow = window.open('', '', 'width=800,height=600');
    //     newWindow.document.write('<html><head><title>Anywhere Document Status</title>');
    //     newWindow.document.write(printStyles);
    //     newWindow.document.write('</head><body>');
    //     newWindow.document.write(headerContent);
    //     newWindow.document.write(tableHeader + tableBody + tableFooter);
    //     newWindow.document.write(`<div class="footer">Generated on: ${currentDateTime}</div>`);
    //     newWindow.document.write('</body></html>');
    //     newWindow.document.close();

    //     newWindow.onload = function () {
    //         newWindow.focus();
    //         newWindow.print();
    //         newWindow.close();
    //     };
    // };

    return (
        <div className='PageSpacing'>
            <Head>
                <title>Reports - Public Data Entry</title>
            </Head>
            <Container className='ListContainer'>
                <Row>
                    <Col lg={12} md={12} xs={12}>
                        <div className={styles.ListviewMain}>
                            <Row className='ApplicationNum'>
                                <Col lg={3} md={6} xs={12}>
                                    <div className='ContainerColumn TitleColmn' onClick={() => { redirectToPage("/ServicesPage") }}>
                                        <h4 className='TitleText left-title'>Reports <span>[నివేదికలు]</span></h4>
                                    </div>
                                </Col>
                                <Col lg={8} md={8} sm={12}>
                                </Col>
                            </Row>
                            <Row>
                                <Col lg={12} md={12} xs={12}>
                                    <div className='tableFixHead'>
                                        <Table striped bordered hover className='TableData ListData'>
                                            <thead>
                                                <tr>
                                                    <th className='SCol'>S.No.<span>[క్రమ సంఖ్య]</span></th>
                                                    <th className='AppidColmn'>Application ID<span>[అప్లికేషన్ ID]</span></th>
                                                    <th className='DocColmn'>Document Type<span>[దస్తావేజు రకం]</span></th>
                                                    <th className='sroColmn'>S.R.O<span>[ఎస్.ఆర్.ఓ]</span></th>
                                                    <th className='AppidColmn'>Execution Date<span>[ఎగ్జిక్యూషన్ తేదీ]</span></th>
                                                    <th className='SCol'>Status<span>[స్థితి]</span></th>
                                                    <th className='SCol'>Action<span>[చర్య]</span></th>
                                                </tr>
                                            </thead>
                                            {ApplicationList.length ?
                                                <tbody>
                                                    {
                                                        ApplicationList.map((SingleApplication, index) => {
                                                            // if (SingleApplication.status !== "COMPLETED") { return; }
                                                            return (
                                                                <tr key={index}>
                                                                    <td>{index + 1}</td>
                                                                    <td>{SingleApplication.applicationId}</td>
                                                                    {/* <td>{SingleApplication.registrationType.TRAN_DESC}</td> */}
                                                                    <td>{SingleApplication.documentNature.TRAN_DESC}</td>
                                                                    <td>{SingleApplication.sroOffice}</td>
                                                                    <td>{SingleApplication.date}</td>
                                                                    <td>{SingleApplication.status}</td>
                                                                    <td>
                                                                        <div className={`${styles.actionTitle} ${styles.actionbtn}`} onClick={() => OnClickOperation("edit", SingleApplication.applicationId)}>
                                                                            <Image alt="Image" height={18} width={18} src='/PDE/images/report-icon.svg' className={`${styles.tableactionImg} ${styles.reportIcon}`} />
                                                                            <span className={styles.tooltiptext}>Report</span>
                                                                        </div>
                                                                        {SingleApplication.isAnyWhereDoc == true && (
                                                                            <div className={`${styles.actionTitle} ${styles.actionbtn}`} onClick={() => OnClickStatus("anywhereStatus", SingleApplication.applicationId)} >
                                                                                <Image alt="Anywhere Status" height={18} width={18} src='/PDE/images/report-img.svg' className={styles.tableactionImg} />
                                                                                <span className={styles.tooltiptext}>Anywhere Status</span>
                                                                            </div>
                                                                        )}
                                                                        {SingleApplication.status === "DRAFT" && (
                                                                            <div className={`${styles.actionTitle} ${styles.actionbtn}`} onClick={() => ShowDeletePopup("Are you sure you want to permanently remove this item?", "", SingleApplication.applicationId)} >
                                                                                <Image alt="Delete" height={18} width={18} src='/PDE/images/delete-icon.svg' className={styles.tableactionImg} />
                                                                                <span className={styles.tooltiptext}>Delete</span>
                                                                            </div>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })
                                                    }
                                                </tbody> : null
                                            }
                                        </Table>
                                        {!ApplicationList.length && Loader.enable == false ?
                                            <Table striped bordered hover className='text-center'>
                                                <thead>
                                                    <tr>
                                                        <th>Not Found Reports List</th>
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
                <Modal show={showAnywhereModal} onHide={() => setShowAnywhereModal(false)} size="xl" centered>
                    <Modal.Header >
                        <Modal.Title style={{ textDecoration: 'underline',fontWeight: 'bold' }}>Anywhere Document Status</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div style={{ overflowX: 'auto' }}>
                            <Table striped bordered hover responsive className='TableData ListData'>
                                <thead>
                                    <tr style={{ whiteSpace: 'nowrap',fontWeight: 'bold' }}>
                                        <th style={{ border: '2px solid black' }}>S.No.</th>
                                        <th style={{ border: '2px solid black' }}>Application ID</th>
                                        <th style={{ border: '2px solid black' }}>Schedule No.</th>
                                        <th style={{ border: '2px solid black' }}>S.R.O</th>
                                        <th style={{ border: '2px solid black' }}>Juridiction</th>
                                        <th style={{ border: '2px solid black' }}>PP Check<br /></th>
                                        <th style={{ border: '2px solid black' }}>MV Check<br /></th>
                                        <th style={{ border: '2px solid black' }}>PP Comments<br /></th>
                                        <th style={{ border: '2px solid black' }}>MV Comments<br /></th>
                                        <th style={{ border: '2px solid black', }}>Other Comments<br /></th>
                                        <th style={{ border: '2px solid black' }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {docStatus && docStatus.length > 0 ? (
                                        docStatus.map((item, index) => (
                                            <tr key={index}>
                                                <td style={{ border: '2px solid black', fontSize: '11px' }}>{index + 1}</td>
                                                <td style={{ border: '2px solid black', fontSize: '11px',whiteSpace: 'nowrap', }}>{item.ID ?? '-'}</td>
                                                <td style={{ border: '2px solid black', fontSize: '11px' }}>{item.SCHEDULE_NO ?? '-'}</td>
                                                <td style={{ border: '2px solid black', fontSize: '11px',whiteSpace: 'nowrap', }}>{item.SR_NAME ? `${item.SR_NAME} (${item.SR_CODE})` : '-'}</td>
                                                <td style={{ border: '2px solid black', fontSize: '11px',whiteSpace: 'nowrap', }}>
                                                    {item.JURISDICTION_NAME ? `${item.JURISDICTION_NAME} (${item.JURISDICTION})` : '-'}
                                                </td>
                                                <td style={{ border: '2px solid black', fontSize: '11px' }}>{item.PP_CHECK === 'Y' ? 'YES' : item.PP_CHECK === 'N' ? 'NO' : '-'}</td>
                                                <td style={{ border: '2px solid black', fontSize: '11px' }}>{item.MV_CHECK === 'Y' ? 'YES' : item.MV_CHECK === 'N' ? 'NO' : '-'}</td>
                                                <td style={{ border: '2px solid black',  fontSize: '11px',whiteSpace: 'pre-wrap', wordBreak: 'break-word',textAlign:'start' }}>{item.PP_COMMENTS ?? '-'}</td>
                                                <td style={{ border: '2px solid black',  fontSize: '11px',whiteSpace: 'pre-wrap', wordBreak: 'break-word',textAlign:'start' }}>{item.MV_COMMENTS ?? '-'}</td>
                                                <td style={{ border: '2px solid black',  fontSize: '11px',whiteSpace: 'pre-wrap', wordBreak: 'break-word',textAlign:'start' }}>{item.REJECT_REASON ?? '-'}</td>
                                                <td style={{ border: '2px solid black', fontSize: '11px',whiteSpace: 'nowrap', }}>{item.STATUS ?? '-'}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={11} style={{ textAlign: 'center', border: '2px solid black' }}>
                                                No data available
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={() => setShowAnywhereModal(false)}>
                            BACK
                        </Button>
                        {/* <Button variant="primary" onClick={printAnywhereDocStatusTable}>
                            Print PDF
                        </Button> */}

                    </Modal.Footer>
                </Modal>

            </Container>
            {/* <pre>{JSON.stringify(docStatus, null, 2)}</pre> */}
        </div>
    )
}

export default Reports;

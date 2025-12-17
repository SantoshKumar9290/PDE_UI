import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import styles from '../styles/pages/Mixins.module.scss';
import Popstyles from '../styles/components/PopupAlert.module.scss'
// '../../styles/components/PopupAlert.module.scss';
import { useAppSelector, useAppDispatch } from '../src/redux/hooks';
import { getApplicationDetails, UseReportDownload, UseReportTelDownload ,UseChangeStatus, section47ApreviewPDF} from '../src/axios';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Router } from 'next/router';
import Head from 'next/head';
import TableInputRadio from '../src/components/TableInputRadio';
import { CallingAxios, decodeBase64, KeepLoggedIn, ShowMessagePopup } from '../src/GenericFunctions';
import { ImCross } from 'react-icons/im';

const ReportsViewPage = () => {
    const dispatch = useAppDispatch()
    const [FormLink, setFormLink] = useState("");
    const router = useRouter();
    let LoginDetails = useAppSelector((state:any) => state.login.loginDetails);
    const [ApplicationDetails, setApplicationDetails] = useState<any>({ registrationType: { TRAN_MAJ_CODE: "", TRAN_MIN_CODE: "", TRAN_DESC: "", PARTY1: "", PARTY1_CODE: "", PARTY2: "", PARTY2_CODE: "" }, status: "ACTIVE", sroDetails: null, executent: [], claimant: [], property: [], payment: [], documentNature: { TRAN_DESC: "" }, MortagageDetails: [], giftRelation: [], presenter: [], amount: "", executionDate: "", stampPaperValue: "", stampPurchaseDate: "" ,docDownLoadedBy:""});
	const [vCheck, setVCheck] = useState<any>(false);
	const [sFlag,setSFlag]= useState<any>(false);
	const [docLang, setDocLang]=useState<any>("");
	const [docDownload,setDocDownload]=useState<any>("");

    useEffect(() => {
        if (KeepLoggedIn()) {
            GetApplicationDetails();
        } else ShowMessagePopup(false, "Invalid Access", "/")
    }, []);
	useEffect(() => {
        if (KeepLoggedIn()) {
            GetApplicationDetails();
        } else ShowMessagePopup(false, "Invalid Access", "/")
    }, [sFlag]);

    const fetchFile = (url) => {
        fetch(url).then(res => res.blob()).then(file => {
            let tempUrl = URL.createObjectURL(file);
            const aTag = document.createElement("a");
            aTag.href = tempUrl;
            aTag.download = url.replace(/^.*[\\\/]/, '');
            document.body.appendChild(aTag);
            aTag.click();
            URL.revokeObjectURL(tempUrl);
            aTag.remove();

        }).catch(() => {
            ShowMessagePopup(false,"Failed to download file!","");

        });

    }

    const GetApplicationDetails = async () => {
        let data: any = localStorage.getItem("GetApplicationDetails");
        if (data == "" || data == undefined) {
            return ShowMessagePopup(false, "Invalid Access", "/");
        }
        else {
            await CallGetApp(data);
        }
    }

    const CallGetApp = async (myData) => {
        let data = JSON.parse(myData);
        let result = await CallingAxios(getApplicationDetails(data.applicationId));
        if (result.status) {
            let receivedData = result.data
			setDocDownload(receivedData.docDownLoadedBy)
            setApplicationDetails(receivedData);
        } else {
            window.alert(result.message);
        }
    }

    const downloadReport = async (type: any) => {
		let stm = vCheck === false ? "N":"Y";
        let info: any = {
            type: type,
            applicationId: ApplicationDetails.applicationId,
			stamp:stm
        }
        let result: any
        if (type === "telugu") {
            result = await CallingAxios(UseReportTelDownload(info));
        } else {
            result = await CallingAxios(UseReportDownload(info));
        }
        if (result.message) {
            ShowMessagePopup(false, result.message, '')
        }
		if(result?.Success === true){
			let langType :any= type === "telugu"? "T" :"E";
			await UseChangeStatus({docDownLoadedBy:langType,applicationId:ApplicationDetails.applicationId});
				CallGetApp(JSON.stringify(ApplicationDetails));
			OnCancelAction();
			setDocLang("")
		} else {
            ShowMessagePopup(false, result.message, '');
        }
    }
	const SelDocument = async ()=>{
		setSFlag(true);
		await CallGetApp(JSON.stringify(ApplicationDetails));
	}
	const OnCancelAction= async ()=>{
		setSFlag(false);
		setDocDownload(ApplicationDetails.docDownLoadedBy)
	}
	const onChange = async (event)=>{
		let addName = event.target.name;
        let addValue = event.target.value;
		setDocLang(addValue);
		if(addValue ==="English")
			CallingAxios(downloadReport("engDocs"));
		else
			CallingAxios(downloadReport("telugu"));
	}

	const checkboxFun =() => {
		setVCheck(!vCheck)
	}


	const  onClickDocs = (type: String) =>{
		if(type =="Y")
			setDocDownload("");
		else
			OnCancelAction();
	}

    const checkifEsignDone = (arr) => {
        return arr.some(r => r.esignStatus === 'Y' || r.represent.some(f => f.esignStatus === 'Y'))
    }
    const handlePreviewPDF = async () => {
        try {
            let data = ApplicationDetails
            const response = await CallingAxios(section47ApreviewPDF(data));
            if (response) {
                const binaryData = decodeBase64(response);
                const byteArray = new Uint8Array(binaryData.length);
                for (let i = 0; i < binaryData.length; i++) {
                    byteArray[i] = binaryData.charCodeAt(i);
                }
                const blob = new Blob([byteArray], { type: 'application/pdf' });
                const blobUrl = URL.createObjectURL(blob);
                window.open(blobUrl, '_blank')
            }
            else {
                console.error('No valid PDF data found in the response');
            }
        }
        catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    return (
        <div className='PageSpacing'>
            <Head>
                <title>Reports List- Public Data Entry</title>
            </Head>
            <Container>
                <Row>
                    <Col lg={12} md={12} xs={12}>
                        <div className={styles.ReportsViewMain}>
                            <Row className='ApplicationNum'>
                                <Col lg={3} md={6} xs={12}>
                                    <div className='ContainerColumn TitleColmn' onClick={() => { if (LoginDetails.loginType === "USER") { router.push("/ReportsPage") } else { router.push("/SroReportListPage") } }}>
                                        <h4 className='TitleText'><Image alt="Image" height={15} width={10} src='/PDE/images/arrow-img.png' className={styles.tableImg} /> Reports<span>[నివేదికలు]</span></h4>
                                    </div>
                                </Col>
                                <Col lg={5} md={6} xs={12}></Col>
                                <Col lg={4} md={6} xs={12}>
                                    <div className='ContainerColumn'>
									
                                        <h4 className='TitleText' style={{ textAlign: 'right' }}>Application ID: {ApplicationDetails.applicationId} <input type='checkbox'name='chekStamps' value={vCheck} checked={vCheck} onChange={checkboxFun}/></h4>
										
                                    </div>
                                </Col>
                            {/* </Row> */}

                            {/* <Row>
                                <Col lg={12} md={12} sm={12} className='mt-2'>
                                    <div className={styles.DocuementGen}>
                                        <TableInputRadio label={'Select Process'} required={true} options={[{ 'label': "Telugu Documents" }, { 'label': "English Documents" }]} onChange={onChange} name='docProcessType' defaultValue={GetstartedDetails.docProcessType} />
                                    </div>
                                </Col>
                            </Row> */}

                            {/* <div className={styles.ReportMainConatiner}> */}
                                {/* <Row> */}
                                    <Col lg={3} md={6} xs={12} className='pt-3'>
                                        <div className={styles.ReportsViewContainer} onClick={() => downloadReport("checkSlip")}>
                                            <Image alt="Image" height={50} width={50} src="/PDE/images/check-slip-img.svg" />

                                            <div>
                                                <p className={styles.ReportsViewText}>Check Slip</p>
                                                <p className={styles.ReportsViewText}><span>[‌చెక్ స్లిప్]</span></p>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col lg={3} md={6} xs={12} className='pt-3'>
                                        <div className={`${styles.ReportsViewContainer} ${styles.AcknowledgContainer}`} onClick={() => downloadReport("acknowledgement")}>
                                            <Image alt="Image" height={50} width={50} src="/PDE/images/Acknowledgment-img.svg" />
                                            <div>
                                                <p className={styles.ReportsViewText}>Acknowledgment</p>
                                                <p className={styles.ReportsViewText}><span>[అంగీకారము]</span></p>
                                            </div>
                                        </div>
                                    </Col>
                                    {ApplicationDetails.docProcessType == "PDEWD" ?
										    <Col lg={3} md={6} xs={12} className='pt-3'>
                                            <div className={`${styles.ReportsViewContainer} ${styles.SlipContainer}`} onClick={() => SelDocument()}>
                                                <Image alt="Image" height={50} width={50} src="/PDE/images/Book-slip-img.svg" />
                                                <div>
                                                    <p className={styles.ReportsViewText}>Document</p>
                                                    <p className={styles.ReportsViewText}><span>[దస్తావేజు‌]</span></p>
                                                </div>
                                            </div>
                                        </Col> : null}
									
                                        {/* <Col lg={3} md={6} xs={12} className='pt-3'>
                                            <div className={`${styles.ReportsViewContainer} ${styles.SlipContainer}`} onClick={() => downloadReport("engDocs")}>
                                                <Image alt="Image" height={50} width={50} src="/PDE/images/Book-slip-img.svg" />
                                                <div>
                                                    <p className={styles.ReportsViewText}>English Document</p>
                                                    <p className={styles.ReportsViewText}><span>[ఆంగ్ల దస్తావేజు‌]</span></p>
                                                </div>
                                            </div>
                                        </Col> : null} */}
                                    {/* {ApplicationDetails.docProcessType == "PDEWD" ?
                                        <Col lg={3} md={6} xs={12} className='pt-3'>
                                            <div className={`${styles.ReportsViewContainer} ${styles.teluguContainer}`} onClick={() => downloadReport("telugu")}>
                                                <Image alt="Image" height={50} width={50} src="/PDE/images/Book-slip-img.svg" />
                                                <div>
                                                    <p className={styles.ReportsViewText}> (Telugu Document)</p>
                                                    <p className={styles.ReportsViewText}><span>[తెలుగు దస్తావేజు‌]</span></p>
                                                </div>
                                            </div>
                                        </Col> : null} */}
                                    <Col lg={3} md={6} xs={12} className='pt-3'>
                                        <div className={`${styles.ReportsViewContainer} ${styles.FormContainer}`} onClick={() => downloadReport("formSixty")}>
                                            <Image alt="Image" height={50} width={50} src="/PDE/images/form60-img.svg" />
                                            <div>
                                                <p className={styles.ReportsViewText}>Form 60/61</p>
                                                <p className={styles.ReportsViewText}><span>[ఫారమ్ 60/61]</span></p>
                                            </div>
                                        </div>
                                    </Col>
                                    {ApplicationDetails.status != "DRAFT" && LoginDetails.loginMode !== 'VSWS' ?
                                        <Col lg={3} md={6} xs={12} className='pt-3'>
                                            <div className={`${styles.ReportsViewContainer} ${styles.slotContainer}`} onClick={() => downloadReport("slotBookingSlip")}>
                                                <Image alt="Image" height={50} width={50} src="/PDE/images/slot-icon-white.svg" />
                                                <div>
                                                    <p className={styles.ReportsViewText}>Slot Booking Slip</p>
                                                    <p className={styles.ReportsViewText}><span>[స్లాట్ బుకింగ్ స్లిప్‌]</span></p>
                                                </div>
                                            </div>
                                        </Col> : null}
                                        {ApplicationDetails.section47A?.isSection47 ==="Y" ? 
                                        <Col lg={3} md={6} xs={12} className='pt-3'>
                                        <div className={styles.ReportsViewContainer} onClick={() => handlePreviewPDF()}>
                                            <Image alt="Image" height={50} width={50} src="/PDE/images/check-slip-img.svg" />

                                            <div>
                                                <p className={styles.ReportsViewText}>Section 47A</p>
                                                <p className={styles.ReportsViewText}><span>[సెక్షన్ 47ఏ ‌]</span></p>
                                            </div>
                                        </div>
                                         </Col>:null}
                                         {/* {ApplicationDetails.section47A ? 
                                           <Col lg={3} md={6} xs={12} className='pt-3'>
                                           <div className={`${styles.ReportsViewContainer} ${styles.SlipContainer}`} onClick={() => SelDocument()}>
                                               <Image alt="Image" height={50} width={50} src="/PDE/images/Book-slip-img.svg" />
                                               <div>
                                                   <p className={styles.ReportsViewText}>Section47A Form-2</p>
                                                   <p className={styles.ReportsViewText}><span>[సెక్షన్ 47A ఫారమ్-2]</span></p>
                                               </div>
                                           </div>
                                       </Col> 
                                        :null} */}

                                </Row>
                            {/* </div> */}
                        </div>
                    </Col>
                </Row>
            </Container>
			{sFlag &&
			<Container>
			<div className={Popstyles.reportPopup}>
                <div className={Popstyles.container}>
                    <div className={Popstyles.Messagebox}>
                        <div className={Popstyles.header}>
                            <div className={Popstyles.letHeader} >
                                <p className={Popstyles.text}>Document</p>
                            </div>
                            <div>
                                <ImCross onClick={OnCancelAction} className={Popstyles.crossButton} />
                            </div>
                        </div>
                        <div style={{ paddingLeft: '1rem', paddingRight: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }} className={Popstyles.popupBox}>
                            {/* {PopupMemory.type ? */}
                                {docDownload ==="N"  || docDownload === ""?<div className={Popstyles.SuccessImg}>
									<p className={Popstyles.langText}>Please Select The Document Type</p>
                                    {/* <Image alt='' width={60} height={60} className={Popstyles.sImage} src="/PDE/images/success-icon.png" /> */}
									<div className='text-center'>
									<TableInputRadio label={'Select'} required={true} options={[{ 'label': "Telugu" },{ 'label': "English" }]} onChange={onChange} name='docs' defaultValue={docLang} />
									</div>
                                </div>
								:
								<div className={Popstyles.SuccessImg}>
									<div className='d-flex Icondata'>
										<p className={Popstyles.langText}>Downloaded Previously :
											<div className={Popstyles.iconCon}>
												<Image alt='' width={20} height={20} className={Popstyles.sImage} src="/PDE/images/pdfIcon.png" /><span>{ApplicationDetails.docDownLoadedBy == "T" ? "TELUGU":"ENGLISH"}</span>
											</div>
										</p>
									</div>
                                    {/* <Image alt='' width={60} height={60} className={Popstyles.sImage} src="/PDE/images/success-icon.png" /> */}
									{ApplicationDetails.esignExecuted ||  checkifEsignDone([...JSON.parse(JSON.stringify(ApplicationDetails.claimant)), ...JSON.parse(JSON.stringify(ApplicationDetails.executent))]) ? "" :
                                        <>
                                    <div className={Popstyles.docText}>
										Do You Want to Download Document Again?
									</div>
									<div className='text-center d-flex'>
										<button className={Popstyles.yesBtn} onClick={()=>onClickDocs('Y')}>YES</button>
										<button className={Popstyles.noBtn} onClick={()=>onClickDocs('N')}>NO</button>
									</div>
                                    </>
                                    }
                                </div>
								}

                                {/* // <MdOutlineDoneOutline style={{ width: '50px', height: '50px', marginTop: '2rem', color: 'green', marginBottom: '1rem' }} /> */}
                                {/* // <ImCross className={styles.crossIcon} />
                            } */}
                            <p className={Popstyles.message}></p>
                        </div>
                    </div>
                </div>
            
        	</div>
			</Container>}
            {/* <pre>{JSON.stringify(ApplicationDetails, null,2)}</pre> */}
        </div>

    )
}

export default ReportsViewPage
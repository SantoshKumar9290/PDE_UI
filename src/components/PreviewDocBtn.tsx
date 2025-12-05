import React, { useEffect, useState } from 'react';
import { CallingAxios, KeepLoggedIn, ShowMessagePopup } from '../GenericFunctions';
import { UseChangeStatus, UseReportDownload, UseReportTelDownload, getApplicationDetails } from '../axios';
import { Col, Container, Row } from 'react-bootstrap';
import Popstyles from '../../styles/components/PopupAlert.module.scss';
import { ImCross } from 'react-icons/im';
import TableInputRadio from './TableInputRadio';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { PreviewDocAction } from '../redux/commonSlice';

const PreviewDocBtn = () => {
    const dispatch = useAppDispatch()
    const PreviewPopupMemory = useAppSelector((state) => state.common.PreviewPopupMemory);
    const [ApplicationDetails, setApplicationDetails] = useState<any>({ registrationType: { TRAN_MAJ_CODE: "", TRAN_MIN_CODE: "", TRAN_DESC: "", PARTY1: "", PARTY1_CODE: "", PARTY2: "", PARTY2_CODE: "" }, status: "ACTIVE", sroDetails: null, executent: [], claimant: [], property: [], payment: [], documentNature: { TRAN_DESC: "" }, MortagageDetails: [], giftRelation: [], presenter: [], amount: "", executionDate: "", stampPaperValue: "", stampPurchaseDate: "", docDownLoadedBy: "", docProcessType: "", applicationId: "" });
    const [docDownload, setDocDownload] = useState<any>("");
    const [docLang, setDocLang] = useState<any>("");
    const [vCheck, setVCheck] = useState<any>(false);



    useEffect(() => {
        if (KeepLoggedIn()) {
            GetApplicationDetails();
        } 
    }, []);

    const GetApplicationDetails = async () => {
        let data: any = localStorage.getItem("GetApplicationDetails");
        if (data == "" || data == undefined) {
            // return ShowMessagePopup(false, "Invalid Access", "/");
        }
        else {
            data = JSON.parse(data);
            await CallGetApp(data);
        }
    }

    const CallGetApp = async (myData) => {
        if(myData.applicationId){
            let result = await CallingAxios(getApplicationDetails(myData.applicationId));
        if (result.status) {
            let receivedData = result.data
            setDocDownload(receivedData.docDownLoadedBy)
            setApplicationDetails(receivedData);
        } else {
            window.alert(result.message);
        }
        } 
    }

    const OnCancelAction = async () => {
        dispatch(PreviewDocAction({ enable: false, applicationId: "", preDwnDoc: "" }));
        setDocDownload(ApplicationDetails.docDownLoadedBy)
    }

    const downloadReport = async (type: any) => {
        let stm = vCheck === false ? "N" : "Y";
        let info: any = {
            type: type,
            applicationId: ApplicationDetails.applicationId,
            stamp: stm
        }
        let result: any
        if (type === "telugu") {
            result = await CallingAxios(UseReportTelDownload(info));
        } else {
            result = await CallingAxios(UseReportDownload(info));
        }
        if (result.status) {
            setTimeout(() => {
                // fetchFile(result.data);
            }, 1000);
        }
        if (result.Success === true) {
			let langType : any = type === "document" ? "D" : type === "telugu" ? "T" : "E";
            await UseChangeStatus({ docDownLoadedBy: langType, applicationId: ApplicationDetails.applicationId });
            setTimeout(() => {
                CallGetApp(ApplicationDetails);
            }, 1000);
            OnCancelAction();
            setDocLang("")
        }
    }

    const onChange = async (event) => {
        let addName = event.target.name;
        let addValue = event.target.value;
        setDocLang(addValue);
        if (addValue === "English")
            CallingAxios(downloadReport("engDocs"));
        else if (addValue === "Telugu")
            CallingAxios(downloadReport("telugu"));
        else
            CallingAxios(downloadReport("document"));
    }

    const onClickDocs = (type: String) => {
        if (type === "Y")
            setDocDownload("");
        else
            OnCancelAction();
    }

    return (
        <div >
            {PreviewPopupMemory && PreviewPopupMemory.enable &&
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
								<div>
									{ PreviewPopupMemory.docProcessType == "PDEWD" ? 
										<div style={{ paddingLeft: '1rem', paddingRight: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }} className={Popstyles.popupBox}>
										{/* {PopupMemory.type ? */}
										{docDownload === "N" || docDownload === "" ? <div className={Popstyles.SuccessImg}>
											<p className={Popstyles.langText}>Please Select The Document Type</p>
											 
											<div className='text-center'>
												<TableInputRadio label={'Select'} required={true} options={[{ 'label': "Telugu" }, { 'label': "English" }]} onChange={onChange} name='docs' defaultValue={docLang} />
											</div>
										</div>
											:
											<div className={Popstyles.SuccessImg}>
												<div className='d-flex Icondata'>
													<p className={Popstyles.langText}>Downloaded Previously :
														<div className={Popstyles.iconCon}>
															<Image alt='' width={20} height={20} className={Popstyles.sImage} src="/PDE/images/pdfIcon.png" /><span>{ApplicationDetails.docDownLoadedBy === "T" ? "TELUGU" : "ENGLISH"}</span>
														</div>
													</p>
												</div>
												{/* <Image alt='' width={60} height={60} className={Popstyles.sImage} src="/PDE/images/success-icon.png" /> */}
												<div className={Popstyles.docText}>
													Do You Want to Download Document Again?
												</div>
												<div className='text-center d-flex'>
													<button className={Popstyles.yesBtn} onClick={() => onClickDocs('Y')}>YES</button>
													<button className={Popstyles.noBtn} onClick={() => onClickDocs('N')}>NO</button>
												</div>
											</div>
										}
										<p className={Popstyles.message}></p>
										</div> 
										: 
										<div>
											{ApplicationDetails.docDownLoadedBy === "D"
											?
												<div style={{ paddingLeft: '1rem', paddingRight: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }} className={Popstyles.popupBox}>
													<p className={`mt-2 ${Popstyles.docText}`}>Download Document</p>
													<button className="proceedButton mt-3" onClick={onChange}>{"Download"}</button>
												</div>
											: 
												<div style={{ paddingLeft: '1rem', paddingRight: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }} className={Popstyles.popupBox}>
													<div className='mt-4'>
														<Image alt='' width={60} height={60} className={Popstyles.sImage} src="/PDE/images/warning.png" />
													</div>
													<p className={`mt-2 ${Popstyles.docText}`}>Please Upload Atleast One Document</p>
												</div>
											}
										</div>

									}
								</div>
                            </div>
                        </div>
                    </div>
                </Container>}
				    {/* <pre>{JSON.stringify(ApplicationDetails, null,2)}</pre> */}
        </div>
    )
}

export default PreviewDocBtn;








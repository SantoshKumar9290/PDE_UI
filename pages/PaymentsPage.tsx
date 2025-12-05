import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import styles from '../styles/pages/Mixins.module.scss';
import { useRouter } from 'next/router';
import { useAppSelector, useAppDispatch } from '../src/redux/hooks';
import { UseChangeStatus, UseDutyCalculator, getApplicationDetails, UseGetPaymentStatus, getConcessionData, UseGetLeaseDutyFee } from '../src/axios';
import Image from 'next/image';
import Table from 'react-bootstrap/Table';
import { CallingAxios, KeepLoggedIn, ShowMessagePopup, TotalMarketValueCalculator } from '../src/GenericFunctions';
import { getPaymentStatus, resetPaymentStatus, setConcessions, setPaymentOP } from '../src/redux/paymentSlice';

import Head from 'next/head';

const SubmissionSuccessfulPage = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [ApplicationDetails, setApplicationDetails] = useState<any>({ registrationType: { TRAN_MAJ_CODE: "", TRAN_MIN_CODE: "", TRAN_DESC: "", PARTY1: "", PARTY1_CODE: "", PARTY2: "", PARTY2_CODE: "" }, status: "ACTIVE", sroDetails: null, executent: [], claimant: [], property: [], payment: [], documentNature: { TRAN_DESC: "" }, MortagageDetails: [], giftRelation: [], presenter: [], section47A: [] });
    
    const[go134Exmp,setGo134Exmp] = useState<any>();
    
    const [isPaymentDone, setIsPaymentDone] = useState<boolean>(false);

    const payStatusData = useAppSelector(state => state.payment.payStatusData);
    const payStatusMsg = useAppSelector(state => state.payment.payStatusMsg);
    const [CalculatedDutyFee, setCalculatedDutyFee] = useState<any>({ TRAN_MAJ_CODE: "", TRAN_MIN_CODE: "", sroCode: "", amount: "", rf_p: "0", td_p: "0", sd_p: "0", marketValue: "0", finalTaxbleValue: "0", con_value: "0" })
    const LoginDetails = useAppSelector((state) => state.login.loginDetails);
    const [concessionFee, setConcessionFee] = useState({
        rf_p:0,
		sd_p:0,
		td_p:0,
		uc_p: 0,
        'GO' : []    });
    const [conData, setConData] = useState([]);
    let [userCharges,setUserCharges]= useState<any>(500);
    const ConcessionData = useAppSelector(state => state.payment.concessions);

    useEffect(() => {

        return () => {
            dispatch(resetPaymentStatus());
        }
    }, [])

    useEffect(() => {
        if (KeepLoggedIn()) {
            GetApplicationDetails();
            window.onpopstate = () => {
                router.push("/ServicesPage");
            }
        } else { ShowMessagePopup(false, "Invalid Access", "/") }
    }, []);

    const GetApplicationDetails = () => {
        let data: any = localStorage.getItem("GetApplicationDetails");
        if (data == "" || data == undefined) {
            ShowMessagePopup(false, "Invalid Access", "/");
        }
        else {
             CallGetApp(data);
        }
    }

    const calcTotalExemption = (arr, index) => {
        return arr.reduce((acc, current) => {
            let c:any = ConcessionData.filter(cs => cs[0] === current)[0][index];
            acc = acc + parseInt(c ? c : 0);
            if(acc > 100){
                acc = 100; 
            }
            return acc;
        }, 0)
    }
    const getAppdetailsdata = async(data)=>{
   
    }

    const CallGetApp = async (myData) => {
        let data = JSON.parse(myData);
        getAppdetailsdata(data)
        let result = await CallingAxios(getApplicationDetails(data.applicationId ? data.applicationId : data.documentId));
        if (result.status) {
            setGo134Exmp(result.data)
            setApplicationDetails(result.data);
            // localStorage.setItem("GetApplicationDetails", JSON.stringify(result.data));
            let StatusResult = await CallingAxios(UseGetPaymentStatus(result.data.applicationId));
            if (StatusResult.status) {
                setIsPaymentDone(true);
                // window.alert(JSON.stringify(StatusResult.data,null,2));
            }
            else {
                setIsPaymentDone(false);

            }
            let d = result.data.documentNature;
            let cs = JSON.parse(JSON.stringify(ConcessionData));
            if(!cs.length){
                let r2 = await getConcessionData();
                if(r2.status){
                    dispatch(setConcessions(r2.data));
                    cs = JSON.parse(JSON.stringify(r2.data))
                } else {
                    ShowMessagePopup(false, r2.message, "")
                }
            }
            let arr = cs.filter(x => x[1] === d.TRAN_MAJ_CODE && x[2] === d.TRAN_MIN_CODE);
            setConData(arr.length ? [...arr,...(cs.filter(s => s[1].includes('For all')))] : [...(cs.filter(s => s[1].includes('For all')))]);
            if(result.data.ConcessionDutyFeeData){
                setConcessionFee({...result.data.ConcessionDutyFeeData, "GO": result.data.ConcessionDutyFeeData.GO ? result.data.ConcessionDutyFeeData.GO.split(',') : []});
            }
            let currentMarketValue = TotalMarketValueCalculator({property: result.data.property});
			// let fTValue = result.data.registrationType.TRAN_MAJ_CODE =="02" ? result.data.amount : result.data.registrationType.TRAN_MAJ_CODE =="04" || result.data.registrationType.TRAN_MAJ_CODE =="05" ? result.data.tmarketValue : result.data.amount > result.data.tmarketValue ? result.data.amount : result.data.tmarketValue;
            let fTValue:any;
            if(result?.data?.docsExcutedBy =="GovtBody"){
                fTValue = result.data.amount
            }else if (result?.data?.section47A?.sectionType === "Section 47A(6)") {
                fTValue = result.data.amount    
            }else{
                fTValue = result.data.registrationType.TRAN_MAJ_CODE =="02" ? result.data.amount : result.data.registrationType.TRAN_MAJ_CODE =="04" || result.data.registrationType.TRAN_MAJ_CODE =="05" ? result.data.tmarketValue : result.data.amount > result.data.tmarketValue ? result.data.amount : result.data.tmarketValue;
            }

            let data = {
                "tmaj_code": result.data.registrationType.TRAN_MAJ_CODE,
                "tmin_code": result.data.documentNature.TRAN_MIN_CODE,
                "sroNumber": result.data.sroCode,
                "local_body": 3,
                "flat_nonflat": "N",
                "marketValue": currentMarketValue,
                "finalTaxbleValue": fTValue,
                //result.data.amount > currentMarketValue ? result.data.amount : currentMarketValue,
                "con_value": result.data.amount,
                "adv_amount": 0,
                "stampPaperValue": result.data.stampPaperValue
            }
            if(result.data.documentNature.TRAN_MAJ_CODE =="04" && result.data.documentNature.TRAN_MIN_CODE =="03"){
                setUserCharges(0);
            }else if(result.data.documentNature.TRAN_MAJ_CODE =="01" && result.data.documentNature.TRAN_MIN_CODE =="25"){
                setUserCharges(500);
            }
            else if(result.data.documentNature.TRAN_MAJ_CODE == "07"){
                leasecalforDutyfee(result.data)
            }
            else{
                setUserCharges(500);
                DutyFeeCalculator(data);
            }

        } else {
            ShowMessagePopup(false,"Get Application Details Failed","");
        }
    }

    const leasecalforDutyfee = async(document:any)=>{
        let data: any = {
            "tmaj_code": document.documentNature.TRAN_MAJ_CODE,
            "tmin_code": document.documentNature.TRAN_MIN_CODE,
            "tot_rent": TotalMarketValueCalculator(document),
            "avg_ann_rent": TotalMarketValueCalculator(document),
            "rentperiod": document.property[0]?.leaseDetails?.lPeriod,
            "nature": document.property[0].landUseCode
        };
        let dutyCalForLease: any = await CallingAxios(UseGetLeaseDutyFee(data))
        dutyCalForLease = dutyCalForLease.data
        setCalculatedDutyFee({ ...CalculatedDutyFee, 
            TRAN_MAJ_CODE: document.registrationType.TRAN_MAJ_CODE, 
            TRAN_MIN_CODE: document.documentNature.TRAN_MIN_CODE, 
            sroCode: document.sroCode, 
            amount: document.amount, 
            marketValue: dutyCalForLease?.rent || 0,
            sd_p: Math.round(dutyCalForLease?.sd_p) || 0, 
            td_p: Math.round(dutyCalForLease?.td_p) || 0, 
            rf_p: Math.round(dutyCalForLease?.rf_p) || 0
        });
    }

    const DutyFeeCalculator = async (data) => {
        let mallidata: any = localStorage.getItem("GetApplicationDetails");
        let go134 = JSON.parse(mallidata);
        let go134result = await CallingAxios(getApplicationDetails(go134.applicationId ? go134.applicationId : go134.documentId));
        const GoDetails = go134result.data
        if (GoDetails.registrationType.TRAN_MAJ_CODE ==='01' && (GoDetails.documentNature.TRAN_MIN_CODE==='28' || GoDetails.documentNature.TRAN_MIN_CODE==='29')){
            let tempsd =0;
            let temprf =0;
            let temptd =0;
            let tempmark =0;
            
            GoDetails.property.map(function(resulObj){
             tempsd=tempsd + resulObj.Go134.stampDutyFeePayable;
             temprf=temprf + resulObj.Go134.registrationFeePayable;
             temptd=temptd + resulObj.Go134.transferDutyFeePayable;
             tempmark=tempmark + resulObj.Go134.marketValue
            })
          setCalculatedDutyFee({ ...CalculatedDutyFee, TRAN_MAJ_CODE: GoDetails.registrationType.TRAN_MAJ_CODE, TRAN_MIN_CODE: GoDetails.documentNature.TRAN_MIN_CODE, sroCode: GoDetails.sroCode, amount: GoDetails.amount,finalTaxbleValue: data.finalTaxbleValue, sd_p: Math.round(tempsd).toString(), td_p: Math.round(temptd).toString(), rf_p: Math.round(temprf).toString(),marketValue:tempmark});
         }
         else if (go134.documentSubType.TRAN_MAJ_CODE === '04' && go134.documentSubType.TRAN_MIN_CODE === '04') {
            let finalTaxbleValue= GoDetails.amount > GoDetails.tmarketValue ? GoDetails.amount : GoDetails.tmarketValue;
            setCalculatedDutyFee({ ...CalculatedDutyFee, TRAN_MAJ_CODE: GoDetails.registrationType.TRAN_MAJ_CODE, TRAN_MIN_CODE: GoDetails.registrationType.TRAN_MIN_CODE, sroCode: GoDetails.sroCode, amount: GoDetails.amount, finalTaxbleValue: finalTaxbleValue,sd_p: Math.round(GoDetails.dutyFeeData.sd_p).toString(), td_p: Math.round(GoDetails.dutyFeeData.td_p).toString(), rf_p: Math.round(GoDetails.dutyFeeData.rf_p).toString(),marketValue: GoDetails.tmarketValue});
         }
        else {
        let result = await CallingAxios(UseDutyCalculator(data));
       if (result.status) {
            setCalculatedDutyFee({ ...CalculatedDutyFee, TRAN_MAJ_CODE: data.tmaj_code, TRAN_MIN_CODE: data.tmin_code, sroCode: data.sroNumber, amount: data.con_value, sd_p: result.data.sd_p, td_p: result.data.td_p, rf_p: result.data.rf_p, finalTaxbleValue: data.finalTaxbleValue, con_value: data.con_value, marketValue: data.marketValue });
        }

    }
}

    const FlatIdentifier = (data) => {
        data.map(x => {
            if (x.FLAT_NO != "" && x.FLAT_NO != "-99") {
                return "Y";
            }
        })
        return "N"
    }

    const sendConcessionData = () => {
        UseChangeStatus({'applicationId': ApplicationDetails.applicationId, ...concessionFee, "GO": concessionFee.GO.join(',')});
    }

    const buttonClick = () => {
        sendConcessionData();
        let paymentRedirectUrl = process.env.PAYMENT_URL + "/igrsPayment" + "?paymentData=";
        let paymentLink = document.createElement("a");
        const cF = concessionFee.GO.length ? {...concessionFee} : {...CalculatedDutyFee, uc_p: userCharges};
        let PaymentJSON = {
            "source": "PDE",
            "type": "ffrd",
            "deptId": ApplicationDetails.applicationId,
            "rmName": LoginDetails.loginName,
            "sroNumber": ApplicationDetails.sroCode,
            "rf": cF.rf_p ? cF.rf_p : 0,
            "uc": cF.uc_p,
            "sd": (cF.sd_p ? Number(cF.sd_p) : 0) + (cF.td_p ? Number(cF.td_p) : 0)
        }
        let stprs = parseInt(ApplicationDetails.stampPaperValue ? ApplicationDetails.stampPaperValue : 0);
        PaymentJSON.sd = (PaymentJSON.sd - stprs) > 0 ? (PaymentJSON.sd - stprs) : 0;
        let encodedData = Buffer.from(JSON.stringify(PaymentJSON), 'utf8').toString('base64')
        paymentLink.href = paymentRedirectUrl + encodedData;
        paymentLink.target = "_blank";
        document.body.appendChild(paymentLink);
        paymentLink.click();
        document.body.removeChild(paymentLink);
    }

    const openPaymentModal = () => {
        let taxableValue = "";
        if (ApplicationDetails?.property[0].marketValue >= ApplicationDetails?.amount) {
            taxableValue = ApplicationDetails?.property[0].marketValue;
        } else {
            taxableValue = ApplicationDetails?.amount;
        }

        let data = {
            "tmaj_code": ApplicationDetails.registrationType.TRAN_MAJ_CODE,
            "tmin_code": ApplicationDetails.documentNature.TRAN_MIN_CODE,
            "sroNumber": ApplicationDetails.sroCode,
            "local_body": 3,
            "flat_nonflat": FlatIdentifier(ApplicationDetails.property),
            "marketValue": ApplicationDetails.property[0].marketValue,
            "finalTaxbleValue": taxableValue,
            "con_value": ApplicationDetails.amount,//property.reduce((total, num) => {return total + (num.amount ? parseInt(num.amount) : 0)}, 0),
            "adv_amount": 0
        }
        dispatch(setPaymentOP({
            showModal: true, reqBody: data
            , applicationDetails: {
                applicationId: ApplicationDetails.applicationId,
                sroNumber: ApplicationDetails.sroCode,
            }, callBack: () => { setIsPaymentDone(true); dispatch(resetPaymentStatus()) }
        }))
    }

    const TotalCalculator = (flag = false) => {
            let cF = flag ? concessionFee : {...CalculatedDutyFee, uc_p: userCharges};
            let sp = parseInt(ApplicationDetails.stampPaperValue ? ApplicationDetails.stampPaperValue : 0);
            let sdTd = (cF.sd_p ? Number(cF.sd_p) : 0) + (cF.td_p ? Number(cF.td_p) : 0);
            sdTd = ((sdTd - sp) > 0) ? (sdTd - sp) : 0;
            let result = sdTd + (cF.rf_p ? Number(cF.rf_p) : 0) + (cF.uc_p);
            return result != null && result != undefined && result ? result : 0;
    }

    const sdCalculator = (flag = false) => {
        let cF = flag ? concessionFee : CalculatedDutyFee;
        let value: any = 0;
        let sp = parseInt(ApplicationDetails.stampPaperValue ? ApplicationDetails.stampPaperValue : 0);
        value = cF.sd_p ? ((parseInt(cF.sd_p) - sp)>0) ?  (parseInt(cF.sd_p) - sp) : 0 : 0
        value = value > 0 ? value : 0;
        return value;
    }

    return (
        <div className='PageSpacing'>
            <Head>
                <title>Submission Sucessfull - Public Data Entry</title>
            </Head>
            <Container>
                {/* <div className='tabContainerInfo'>
                    <Container>
                        <Row>
                            <Col lg={12} md={12} xs={12}>
                                <div className='tabContainer'>
                                    <div className='activeTabButton'>Get Started<div></div></div>
                                    <div className='activeTabButton'>Parties Details<div></div></div>
                                    <div className='activeTabButton'>Property Details<div></div></div>
                                    <div className='activeTabButton'>Payment Details<div></div></div>
                                    <div className='inactiveTabButton'>Slot Booking<div></div></div>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div> */}
                <div className={`${styles.mainContainer} ${styles.ListviewMain}`}>
                    <Row className='ApplicationNum mb-2'>
                        <Col lg={6} md={6} xs={12}>
                            <div className='ContainerColumn TitleColmn' style={{ cursor: 'pointer' }} onClick={() => { router.push("/PaymentListPage") }}>
                                <h4 className='TitleText left-title' style={{ cursor: 'pointer' }}>Payment Details</h4>
                            </div>
                        </Col>
                        <Col lg={6} md={6} xs={12} className='text-end'>
                            <div className='ContainerColumn TitleColmn'>
                                <h4 className='TitleText' style={{ textAlign: 'right' }}>Application ID: {ApplicationDetails.applicationId}</h4>
                            </div>
                        </Col>
                    </Row>
                </div>

                <div className={styles.DocSubmitPage}>
                    <Row>
                        <Col lg={12} md={12} sm={12}>
                            <div className='text-center mt-1'>
                                <div className={` ${styles.RegistrationInput} ${styles.LoginPageInput}`}>
                                    <div className='tableFixHead2'>
                                        <Table striped bordered hover className='TableData ListData'>
                                            <thead>
                                                <tr>
                                                    <th>Stamp Duty(₹)</th>
                                                    <th>Transfer Duty(₹)</th>
                                                    <th>Registration fee(₹)</th>
                                                    <th>Market Value(₹)</th>
                                                    <th>Considaration Value(₹)</th>
                                                    <th>Final Taxble Value(₹)</th>
                                                    <th>User Charges(₹)</th>
                                                    <th>Total Payble(₹)</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>{sdCalculator()}</td>
                                                    <td>{CalculatedDutyFee.td_p ? CalculatedDutyFee.td_p : 0}</td>
                                                    <td>{CalculatedDutyFee.rf_p ? CalculatedDutyFee.rf_p : 0}</td>
                                                    <th>{CalculatedDutyFee.marketValue ? CalculatedDutyFee.marketValue : 0}</th>
                                                    <th>{CalculatedDutyFee.amount ? CalculatedDutyFee.amount : 0}</th>
                                                    <td>{CalculatedDutyFee.finalTaxbleValue ? CalculatedDutyFee.finalTaxbleValue : 0}</td>
                                                    <th>500</th>
                                                    <td>{TotalCalculator()}</td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    {
                        !!conData.length && 
                        conData.map((c, index) => {
                            return (
                                <div className={styles.MT4} key={index}>
                            <div className={styles.GOBOX}><span>G.O. : </span>{c[3]}</div>
                            <div className={styles.cBox}><input type='checkbox' checked={concessionFee.GO.includes(c[0])} disabled={isPaymentDone} onChange={() => {
                               let ob:any = {...concessionFee};
                               if(concessionFee.GO.includes(c[0])){
                                    ob.GO = concessionFee.GO.filter(d => d !== c[0])
                               } else {
                                ob.GO = [...ob.GO, c[0]];
                               }
                               ob.sd_p = CalculatedDutyFee.sd_p - (CalculatedDutyFee.sd_p * (calcTotalExemption(ob.GO, 7)/100));
                                ob.td_p = CalculatedDutyFee.td_p - (CalculatedDutyFee.td_p * (calcTotalExemption(ob.GO, 7)/100));
                                ob.rf_p = CalculatedDutyFee.rf_p - (CalculatedDutyFee.rf_p * (calcTotalExemption(ob.GO, 8)/100));
                                ob.uc_p = 500 - (500 * (calcTotalExemption(ob.GO, 9)/100));
                                setConcessionFee({...ob});
                            }}/><label>{c[4]}</label></div>
                        </div>
                            )
                        })
                        
                    }
                     {
                                !!concessionFee.GO.length && 
                                <>
                                <h6>After Concession:</h6>
                                <Table striped bordered hover className='TableData ListData greenTableHead'>
                                <thead>
                                    <tr>
                                        <th>Stamp Duty(₹)</th>
                                        <th>Transfer Duty(₹)</th>
                                        <th>Registration fee(₹)</th>
                                        <th>Market Value(₹)</th>
                                        <th>Considaration Value(₹)</th>
                                        <th>Final Taxble Value(₹)</th>
                                        <th>User Charges(₹)</th>
                                        <th>Total Payble(₹)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{sdCalculator(true)}</td>
                                        <td>{concessionFee.td_p ? concessionFee.td_p : 0}</td>
                                        <td>{concessionFee.rf_p ? concessionFee.rf_p : 0}</td>
                                        <th>{CalculatedDutyFee.marketValue ? CalculatedDutyFee.marketValue : 0}</th>
                                        <th>{CalculatedDutyFee.con_value ? CalculatedDutyFee.con_value : 0}</th>
                                        <td>{CalculatedDutyFee.finalTaxbleValue ? CalculatedDutyFee.finalTaxbleValue : 0}</td>
                                        <th>{concessionFee.uc_p ? concessionFee.uc_p : 0}</th>
                                        <td>{TotalCalculator(true)}</td>
                                    </tr>
                                </tbody>
                            </Table>
                            </>
                            }
                    <Row>
                        {isPaymentDone ?
                            <Row>
                                <Col lg={12} md={12} sm={12}>
                                    <div className='text-center mt-1'>
                                        <div className={` ${styles.RegistrationInput} ${styles.LoginPageInput}`}>
                                            <div className="p">
                                                <Image alt='' width={60} height={60} className={styles.image} src={payStatusMsg ? "/PDE/images/error_filled.svg" : "/PDE/images/success-icon.png"} />
                                            </div>
                                            <div className="p">
                                                <span className={styles.errTxt}>{payStatusData.totalAmount} Paid Successfully</span>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            :
                            (
                                (!!concessionFee.GO.length && !TotalCalculator(true)) ? '' : <Col lg={4} md={12} sm={12} className='text-center p-0' style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                                <button className='proceedButton' onClick={buttonClick}>Proceed to Payment</button>
                            </Col>
                            )

                        }
                    </Row>
                </div>
            </Container>
            {/* <pre>{JSON.stringify(ApplicationDetails, null, 2)}</pre> */}
            {/* <pre>{JSON.stringify(CalculatedDutyFee,null,2)}</pre> */}
        </div>
    )
}

export default SubmissionSuccessfulPage;
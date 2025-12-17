import { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import styles from '../styles/pages/Mixins.module.scss';
import stylesotp from '../styles/pages/Forms.module.scss';
import stylesback from '../styles/pages/Services.module.scss';

import TableDrpDown from '../src/components/TableDrpDown';
import TableInputRadio from '../src/components/TableInputRadio3';
import { get } from 'lodash';
import Table from 'react-bootstrap/Table';
import { useRouter } from 'next/router';
import { useAppSelector, useAppDispatch } from '../src/redux/hooks';
import { getsroList, generateDocumentId, getstamptypelist, GetPaymentStatus, getdenominationslist, getstampavailablelist, poststampindentdata, stampindentreport, Stamppaymentupdate, getstampindentdetails, deletestampdetails, GetstampPaymentStatus, freezstamp, UseGetAadharOTP, UseGetAadharDetails, stampindentverification } from '../src/axios';
import { AadharPopupAction, PopupAction } from '../src/redux/commonSlice';
import Image from 'next/image';
import Head from 'next/head';
import { CallingAxios, ShowMessagePopup, AadharencryptData } from '../src/GenericFunctions';
import TableText from '../src/components/TableText';
import TableInput from '../src/components/TableInput';
import TableInputText from '../src/components/TableInputText';
import TableInputLongText from '../src/components/TableInputLongText';
import { loginSlice, userLogin, verifyUser } from '../src/redux/loginSlice';
import { encryptWithAES } from '../src/utils';

const StampIndent = () => {
    const router = useRouter();
    const dispatch = useAppDispatch()
    const [activepage, setActivepage] = useState(false);
    let initialGetstartedDetails = useAppSelector(state => state.form.GetstartedDetails);
    const [balancelist, setbalancelist] = useState([]);
    // let LoginDetails: any = useAppSelector(state => state.login.loginDetails);
    const [DenominationsList, setDenominationsList] = useState<any>([]);
    const [SROOfficeList, setSROOfficeList] = useState([]);
    let initialPropertyDetails = useAppSelector(state => state.form.PropertyDetails);
    const [PropertyDetails, setPropertyDetails] = useState<any>(initialPropertyDetails);
    const [otp, setOTP] = useState('');

    const [payData, setPayData] = useState<any>({})
    const [show, setShow] = useState(false);
    const [showdata, setshowdata] = useState(false)
    const [showInputs, setShowInputs] = useState(false);
    const [selection, setSelection] = useState('');
    const [FormError, setFormError] = useState<any>('');

    const handleSelection = (e) => {
        setLoginDetails({ ...initialLoginDetails, payMode: e.target.value })
        setSelection(e.target.value);
    };

    // let DenominationsList = ["10", "20", "50", '100'];
    let Categorylist = ['NON_JUDICIAL STAMPS', 'JUDICIAL STAMPS']
    const initialLoginDetails:{payMode:string,loginId:string,aadhaar?:string,email?:any,mobile:string,aadhaarHash:string,loginMode:string} = {
        email: '',
        mobile: '',
        aadhaar: '',
        aadhaarHash: '',
        loginMode: 'Email id',
        payMode: 'Yes',
        loginId: ''
    }

    const [publicdetals, setpublicdetails] = useState<any>([]);
    useEffect(() => {
        getSrolist();
        let templogindetails: any = JSON.parse(localStorage.getItem("LoginDetails"));
        setpublicdetails(templogindetails)

        if (selection === 'No') {
            const wantToExit = window.confirm('Do you want to dowload the requested Stamp indent?');
            if (wantToExit) {
                // redirectToPage('/ServiceLandingPage');
                handlePreviewPDF();
            } else {
                setLoginDetails({ ...initialLoginDetails, payMode: 'No' })

                setSelection('No');
            }
        }
    }, [selection]);

    const getSrolist = async () => {
        let result = await CallingAxios(getsroList());
        if (result.status) {
            setSROOfficeList(result.data);
        }
    };
    const ShowAlert = (type, message) => { dispatch(PopupAction({ enable: true, type: type, message: message })); }
    const redirectToPage = (location: string) => {
        router.push({
            pathname: location,
        })
    }
    let [AadharNumberDetails, setAadharNumberDetails] = useState<any>({ type: "", aadharNumber: "", otp: "", wa: "", OTPResponse: { transactionNumber: "" }, KYCResponse: {} }); const [stampNos, setStampNos] = useState(null);
    const [TempMemory, setTempMemory] = useState({ AadharPresent: false })
    const [denominations, setDenominations] = useState(null)
    const [stampstypelist, setstampstypelist] = useState<any>([])
    const [relation, setrelation] = useState('');
    const [address, SetAddress] = useState('');
    const [address2, SetAddress2] = useState('');
    const [purchasefor, setpurchasefor] = useState('');
    const [purchaseforrelation, setpurchaseforrelation] = useState('');
    const [reqID, setReqID] = useState<any>()
    const [srname, setsrname] = useState();
    const [category, setCategory] = useState('');
    const [stamptype, setStamptype] = useState('')
    const [stampdetails, setStampdetails] = useState([]);
    const [srvalue, setSrvalue] = useState('');
    const [stampvalue, setStampvalue] = useState('');
    const [LoginDetails, setLoginDetails] = useState(initialLoginDetails);
    const verifyUserData = useAppSelector(state => state.login.verifyUserData);
    const verifyUserMsg = useAppSelector(state => state.login.verifyUserMsg);
    const [sentOTP, setSentOTP] = useState(false);
    const [aadhaarOTPResponse, setAadhaarOTPResponse] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const [verifystatus, setVerifystatus] = useState(false);
    const onChange = (e, param) => {
        let name = e.target.name;
        let value = e.target.value
        if (name === 'stampsno') {
            if (value.startsWith('0')) {
                setStampNos('')
                return
            }
            else if (value > 5) {
                setStampNos('')
                return ;
            }
            else if (value ==0) {
                setStampNos('')
                return ;
            }
            else if ((parseInt(value) + stampdetails.reduce((total, item) => total + parseFloat(item.NO_STAMPS), 0)) > 5) {
                ShowAlert(false, "You can purchase only 5 stamps per a Day");
            }
            else {
                const result = balancelist.find(Denom => Denom.DENOMINATION === parseInt(denominations));
                if (value <= result.BALANCE) {
                    setStampNos(parseInt(value));
                }
                else {
                    ShowAlert(false, "No of stamps should be less than or equal to available stamps");
                    return
                }
            }
        }
        else if (name === 'denominations') {
            setDenominations(value)
        }
        else if (name === 'relation') {
            setrelation(value)
        }
        else if (name === 'address') {
            SetAddress(value)
        }
        else if (name === 'address2') {
            SetAddress2(value)
        }
        else if (name === 'purchasefor') {
            setpurchasefor(value)
        }
        else if (name === 'purchaseforrelation') {
            setpurchaseforrelation(value)
        }
        else if (name === 'SR_NAME') {
            setsrname(value)
            const result = SROOfficeList.find(sr => sr.SR_CD === parseInt(value));
            setSrvalue(result.SR_NAME)
            getbalancelistfunc(value)
        }
        else if (name === 'category') {
            getstamplistfunc(value);
            setCategory(value);
        }
        else if (name === 'stamptype') {
            const result = stampstypelist.find(sr => sr.CODE === parseInt(value));
            setStampvalue(result.NAME)
            setStamptype(value);
            getdenomlist(value)
        }
    }

    const getstamplistfunc = async (value) => {
        const data = {
            SR_CODE: srname,
            category: value
        }
        let stampresult: any = await CallingAxios(getstamptypelist(data))

        if (stampresult.status) {
            setstampstypelist(stampresult.data)
        }
        else {
            setstampstypelist([])
        }
    }

    const getbalancelistfunc = async (value) => {
        let balanceresult: any = await CallingAxios(getstampavailablelist(value))

        if (balanceresult.status) {
            let ballist = balanceresult.data;
            setbalancelist(ballist)
        }
        else {
            setstampstypelist([])
        }
    }
    const getdenomlist = async (value) => {
        const data = {
            SR_CODE: srname,
            stamp_type: value
        }
        let denomresult: any = await CallingAxios(getdenominationslist(data))

        if (denomresult.status) {
            let denomlist = denomresult.data.map(item => item.DENOMINATION);
            setDenominationsList(denomlist)
        }
        else {
            setDenominationsList([])
        }
    }
    const generateDocumentIdcall = async (srname) => {

        let data1 = {
            SR_CODE: srname,
            STAMP_CATEGORY: category,
            STAMP_TYPE: stamptype,
            DENOMINATION: denominations,
            LoginID: publicdetals.loginId
        }
        let validtransaction=await CallingAxios(stampindentverification(data1))
        if(validtransaction.data.length>=0 ){
            if((5-validtransaction.data.reduce((total, item) => total + parseFloat(item.NO_STAMPS), 0) )<stampNos){
                setTimeout(() => {
                ShowAlert(false, `You've bought ${validtransaction.data.map(validtrans => `${validtrans.NO_STAMPS} stamps for Request ID: ${validtrans.REQUEST_ID}`).join(', ')}. You can purchase ${(5-validtransaction.data.reduce((total, item) => total + parseFloat(item.NO_STAMPS), 0) )} more stamps today.`);
            }, 5000);
                return
            }
        setshowdata(true);
        let response: any;
        if (!reqID) {
            response = await generateDocumentId(srname);
            ShowAlert(true, "Stamp indent has been generated with Req ID:  " + response.data);
            setReqID(response.data);
        }
        let data = {
            SR_CODE: srname,
            STAMP_CATEGORY: category,
            STAMP_TYPE: stamptype,
            DENOMINATION: denominations,
            NO_STAMPS: stampNos,
            AMOUNT: Amount,
            PURCHASER_NAME: AadharNumberDetails.KYCResponse?.name,
            PUR_RELATION: relation,
            PUR_ADDRESS: address,
            RM_NAME: purchasefor,
            RM_RELATION: purchaseforrelation,
            RM_ADDRESS: address2,
            REQUEST_ID: response?.data || reqID,
            PAYMENT_STATUS: 'N',
            AADHAAR: AadharencryptData(LoginDetails.aadhaar),
            LoginID: publicdetals.loginId


        }
        let dataposted = await CallingAxios(poststampindentdata(data));
        const getdata = {
            REQUEST_ID: response?.data || reqID,
            SR_CODE: srname,
            AADHAAR: AadharencryptData(LoginDetails.aadhaar)
        }
        let stampdetail = await CallingAxios(getstampindentdetails(getdata))
        setStampdetails(stampdetail.data)
        setStampNos(null)
    }
    else{
        if((5-validtransaction.data[0].NO_STAMPS )<stampNos){
            ShowAlert(false, `You've bought ${validtransaction.data.map(validtrans=>(validtrans.NO_STAMPS ,'stamps for Request ID:' ,validtrans.REQUEST_ID))} You can purchase ${5-validtransaction.data[0].NO_STAMPS} more stamps today.` )
        return
        }
        ShowAlert(false, `You have already purchased the maximum limit of stamps for today.` )
        return
    }
    }
    const Amount: any = denominations * stampNos;
    const handlePreviewPDF = async () => {
        try {
            let data = {
                SR_CODE: srname,
                REQUEST_ID: reqID,
                srname: srvalue
            }
            const response = await CallingAxios(stampindentreport(data));
            if (response) {
                const binaryData = atob(response.data);
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
    const deletestampdetail = async (item: any) => {
        const deleteData = {
            srCode: item.SR_CODE,
            stampCategory: item.STAMP_CATEGORY,
            stampType: item.STAMP_TYPE,
            denomination: item.DENOMINATION,
            noStamps: item.NO_STAMPS,
            amount: item.AMOUNT,
            purchaserName: item.PURCHASER_NAME,
            purRelation: item.PUR_RELATION,
            purAddress: item.PUR_ADDRESS,
            rmName: item.RM_NAME,
            rmRelation: item.RM_RELATION,
            rmAddress: item.RM_ADDRESS,
            requestId: item.REQUEST_ID,
        };
        const deletestamp: any = await CallingAxios(deletestampdetails(deleteData));
        const getdata = {
            REQUEST_ID: item.REQUEST_ID || reqID,
            SR_CODE: item.SR_CODE,
            AADHAAR:AadharencryptData(LoginDetails.aadhaar)
        }
        let stampdetail = await CallingAxios(getstampindentdetails(getdata));
        setStampdetails(stampdetail.data);
    }
    const onSubmit = async (e: any) => {
        e.preventDefault();
        let obj: any = {};
        if (LoginDetails.loginMode === 'Mobile Number') {
            obj.type = 'mobile';
            obj.loginMobile = LoginDetails.mobile;
        } else {
            obj.type = 'aadhar';
            obj.aadhar = encryptWithAES(`${LoginDetails.aadhaar}`);
            setLoading(true);
            let myAadhar = btoa(LoginDetails.aadhaar)
            let result = await CallingAxios(UseGetAadharOTP(myAadhar));
            if (result && result.status === 'Success') {
                setSentOTP(true);
                setAadhaarOTPResponse(result);
                ShowAlert(true, 'OTP Sent Successfully');

            } else {
                ShowAlert(false, get(result, 'message', "Aadhaar API failed"))
                setAadhaarOTPResponse({});
            }
            setLoading(false);
        }
        setSentOTP(true)


    }

    useEffect(() => {
        if (verifyUserMsg) {
            ShowAlert(false, verifyUserMsg);
        }
    }, [verifyUserMsg])

    const onChangeotp = (e: any) => {
        let addName = e.target.name;
        let addValue = e.target.value;
        let TempDetails = { ...LoginDetails }
        if (e.target.name === 'loginMode') {
            TempDetails = { ...initialLoginDetails, loginMode: e.target.value, email: "", mobile: "", aadhaar: "", aadhaarHash: "" };
        }
        else if (addName === 'aadhaarHash') {
            addValue = addValue.replace(/[^0-9 x]/g, "");
            let value;
            if (TempDetails?.aadhaar?.length > addValue?.length) {
                value = "";
                addValue = "";
            } else if (addValue != "") {
                value = (TempDetails.aadhaar ? TempDetails.aadhaar : '') + addValue[addValue.length - 1];
            }
            addValue = addValue.replace(/\d(?=\d{3})/g, "x");
            TempDetails = { ...TempDetails, aadhaar: value }
        }
        else if (addName === 'mobile') {
            if ((addValue && (isNaN(addValue) || (['.', '-'].some(i => addValue.includes(i))))) || addValue.length > 10) {
                addValue = TempDetails.mobile
            }
        }
        setLoginDetails({ ...TempDetails, [addName]: addValue });
        if (FormError) {
            setFormError('');
        }
    }
    const [otpstat, setOtpstat] = useState(false)
    const onLogin = async (e) => {
        e.preventDefault();
        let result = await CallingAxios(UseGetAadharDetails({
            aadharNumber: btoa(LoginDetails.aadhaar),
            transactionNumber: aadhaarOTPResponse.transactionNumber,
            otp: otp
        }));
        if (result.status && result.status === 'Success') {
            ShowAlert(true, 'Aadhar Verified Successfully');
            setOtpstat(true)
            let details = { ...AadharNumberDetails, KYCResponse: result.userInfo, type: "Public" }
            setAadharNumberDetails(details);
            const tempaddress = `${details.KYCResponse.house ? details.KYCResponse.house + ',' : ''}
${details.KYCResponse.street ? details.KYCResponse.street + ',' : ''}
${details.KYCResponse.loc && details.KYCResponse.loc + ','}
${details.KYCResponse.subdist && details.KYCResponse.subdist + ','}
${details.KYCResponse.dist ? details.KYCResponse.dist + ',' : ''}
${details.KYCResponse.pc ? details.KYCResponse.pc + ',' : ''}
${details.KYCResponse.country ? details.KYCResponse.country + ',' : ''}`;
            SetAddress(tempaddress)
            setrelation(details.KYCResponse?.co)
            setTempMemory({ AadharPresent: false });
            dispatch(AadharPopupAction({ enable: false, status: true, response: true, data: details }));

        }
        else {
            ShowMessagePopup(false, "Please Enter Valid OTP", "");
        }

    }
    const backToLogin = () => {
        setLoginDetails({ ...initialLoginDetails });
        setOTP('');
        setSentOTP(false)
    }
    return (
        <div className='PageSpacing'>
            <Head>
                <title>Stamp Indent</title>
            </Head>
            <div className={stylesback.ServicepageMsain}>
                <Container>
                    <div>
                        {!show && <Row>
                            <Col>
                                <div className={`${stylesback.BacBtnContainer} ${stylesback.actionbtn}`} onClick={() => { redirectToPage("/ServiceLandingPage") }}><Image alt="Image" height={30} width={28} src='/PDE/images/backarrow.svg' /><span>Back</span></div>
                            </Col>
                        </Row>
                        }
                        <form >
                            {!show && <Container>

                                <Row>
                                    <Col lg={7} md={7} xs={12} className='border border-2 '>
                                        <h4 className='d-flex justify-content-center'>Indent Form for Stamps</h4>

                                        <Row>
                                            <Col lg={4} md={4} xs={12}>
                                                <TableText label={'SRO'} required={true} LeftSpace={false} />

                                                <TableDrpDown required={true} disabled={showdata}
                                                    name={"SR_NAME"}
                                                    keyName={"SR_NAME"}
                                                    label={""}
                                                    errorMessage={""}
                                                    keyValue={"SR_CD"}
                                                    value={!showdata ? srname : srvalue}
                                                    onChange={onChange}
                                                    options={SROOfficeList} />
                                            </Col>
                                            <Col lg={4} md={4} xs={12}>
                                                <TableText label={'Category of stamps'} required={true} LeftSpace={false} />
                                                <TableDrpDown disabled={showdata} required={true} options={Categorylist} name={'category'} onChange={onChange} value={category} keyName={''} label={''} errorMessage={''} keyValue={''} />
                                            </Col>

                                            <Col lg={4} md={4} xs={12}>
                                                <TableText label={'Type of Stamps'} required={true} LeftSpace={false} />
                                                <TableDrpDown disabled={showdata} required={true}
                                                    name={"stamptype"}
                                                    keyName={"NAME"}
                                                    label={""}
                                                    errorMessage={""}
                                                    keyValue={"CODE"}
                                                    value={!showdata ? stamptype : stampvalue}
                                                    onChange={onChange}
                                                    options={stampstypelist} />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col lg={4} md={4} xs={12}>
                                                <TableText label={'Denominations'} required={true} LeftSpace={false} />
                                                <TableDrpDown disabled={false} required={true} options={DenominationsList} name={'denominations'} onChange={onChange} value={denominations} keyName={''} label={''} errorMessage={''} keyValue={''} />
                                            </Col>
                                            <Col lg={4} md={4} xs={12}>
                                                <TableText label={'Number of stamps'} required={true} LeftSpace={false} />
                                                <TableInput required={true} disabled={false} name={"stampsno"} value={stampNos} onChange={onChange} label={''} errorMessage={''} type={'number'} />
                                            </Col>

                                            <Col lg={4} md={6} xs={12}>
                                                <TableText label={'Total Amount'} required={true} LeftSpace={false} />
                                                <TableInput required={true} disabled={true} name={"amount"} value={Amount} onChange={""} label={''} errorMessage={''} type={'number'} />
                                            </Col>
                                        </Row>
                                        <Row>
                                            {!sentOTP && !verifystatus && <>
                                                {/* <Row>
                                                    <div className='p'>

                                                        <TableInputRadio required={true} options={[
                                                            { 'label': 'Aadhaar Number' }]} onChange={onChangeotp} name='loginMode' defaultValue={LoginDetails.loginMode} />
                                                    </div>
                                                </Row> */}
                                                <Col lg={4} md={6} xs={12} className='my-2'>
                                                    {/* {LoginDetails.loginMode === "Mobile Number" ?
                                                        <>
                                                            <TableInputText type='text' placeholder='Enter Mobile Number' required={true} name='mobile'
                                                                value={LoginDetails.mobile} onChange={onChangeotp} />
                                                        </>
                                                        : */}
                                                        <>
                                                        <TableText label={'Aadhar'} required={true} LeftSpace={false} />
                                                            <TableInputText type='text' placeholder='Enter Aadhar Number' splChar={false} allowNeg={false} maxLength={12} required={true} name="aadhaarHash" value={LoginDetails.aadhaarHash} onChange={onChangeotp} />
                                                        </>
                                                </Col>
                                                <Col lg={3} md={6} xs={12} className='mt-4'>
                                                    <Button onClick={onSubmit}> Get OTP </Button>
                                                </Col>
                                            </>}
                                        </Row>
                                        <Row>
                                            {sentOTP && !otpstat &&
                                                <>
                                                    <Row>
                                                        <Col>
                                                            <h2 className="p-0"><button className={stylesotp.rightButton} onClick={backToLogin} type='button'><Image src="/PDE/images/leftArrow.svg" height={16} width={16} /></button><span className='fs-5'> Enter OTP</span> </h2>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col lg={6} md={6} xs={6}>
                                                            <TableInputText type='text' placeholder='Enter OTP' maxLength={6} required={true} otpChar={false} splChar={false} name='otp' value={otp} onChange={(e) => {
                                                                setOTP(e.target.value);
                                                            }} />
                                                        </Col>
                                                        <Col lg={6} md={6} xs={6}>
                                                            <Button onClick={onLogin}>Verify</Button>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col lg={12} md={6} xs={6} className={stylesotp.flexColumn}>
                                                            <div className={stylesotp.flexColumn}>
                                                                <span className={`${stylesotp.checkText} ${stylesotp.scheckText}`}>Did not receive OTP?</span>
                                                                <div onClick={onSubmit}
                                                                    className={`${stylesotp.checkText} ${stylesotp.RegText}`}
                                                                >Resend OTP</div>
                                                            </div>
                                                        </Col>
                                                    </Row></>
                                            }
                                            <Col lg={6} md={12} xs={12}>
                                                <TableText label={'Name of the Purchaser'} required={true} LeftSpace={false} />
                                                <TableInput required={true} disabled={true} name={"loginId"} value={AadharNumberDetails.KYCResponse?.name || ''} onChange={onChangeotp} label={''} errorMessage={''} type={'text'} />
                                                <TableText label={'Relation'} required={true} LeftSpace={false} />
                                                <TableInput required={true} disabled={true} name={"relation"} value={relation} onChange={onChange} label={''} errorMessage={''} type={'text'} />
                                                <TableText label={'Address'} required={true} LeftSpace={false} />
                                                <TableInputLongText name='address' disabled={true} onChange={onChange} placeholder='Address' required={true} value={address} />
                                            </Col>
                                            <Col lg={6} md={12} xs={12}>
                                                <TableText label={'Stamp for Whom'} required={true} LeftSpace={false} />
                                                <TableInput required={true} disabled={showdata} name={"purchasefor"} value={purchasefor} onChange={onChange} label={''} errorMessage={''} type={'text'} />
                                                <TableText label={'Relation'} required={true} LeftSpace={false} />
                                                <TableInput required={true} disabled={showdata} name={"purchaseforrelation"} value={purchaseforrelation} onChange={onChange} label={''} errorMessage={''} type={'text'} />

                                                <TableText label={'Address'} required={true} LeftSpace={false} />
                                                <TableInputLongText name='address2' disabled={showdata} onChange={onChange} placeholder='Address' required={true} value={address2} />
                                            </Col>
                                        </Row>

                                    </Col>

                                    <Col lg={5} md={12} xs={12} className='border border-2  p-2'>
                                        <Row className=''>
                                            <Col lg={12} md={12} xs={12}>
                                                <div style={{ maxHeight: '500px', overflowY: 'auto' }} className='Table-responsive'>
                                                    <Table striped bordered hover className='TableData ListData table-responsive'>
                                                        <thead style={{ backgroundColor: '#274c77', position: 'sticky', top: 0 }} className='text-nowrap'>                                        <tr>
                                                            <th colSpan={4} className='fs-5 fw-bold'>Available Stamps</th>
                                                        </tr>
                                                            <tr>
                                                                <th className='fs-6'>{srname && srvalue ? `${srname} - ${srvalue}` : ''}</th>
                                                                <th colSpan={2}></th>
                                                                <th className='fs-6'>{new Date().toLocaleDateString('en-US', {
                                                                    day: 'numeric',
                                                                    month: 'short',
                                                                    year: 'numeric'
                                                                })}</th>

                                                            </tr>
                                                            <tr>
                                                                <th className='fs-6'>S.No</th>
                                                                <th className='fs-6'>Stamp_Name</th>
                                                                <th className='fs-6'>Denomination</th>
                                                                <th className='fs-6'>Balance</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {balancelist.length > 0 ? balancelist.map((item, index) =>
                                                            (
                                                                <tr key={index}>
                                                                    <td>{index + 1}</td>
                                                                    <td>{item.NAME}</td>
                                                                    <td>{item.DENOMINATION}</td>
                                                                    <td>{item.BALANCE != 0 ? item.BALANCE : <span className='text-danger'>Stamps not available</span>}</td>
                                                                </tr>
                                                            )) :
                                                                <tr>
                                                                    {srname ? <td className='text-center text-danger' colSpan={4}>No data Available </td> : <td className='text-center text-danger' colSpan={4}>Please select SRO</td>}
                                                                </tr>
                                                            }
                                                        </tbody>
                                                    </Table>
                                                </div>
                                            </Col>
                                        </Row>
                                        </Col>
                                </Row>
                            </Container>
                            }
                            <Row >
                                <Col lg={12} md={12} xs={12} className='d-flex justify-content-center my-3'>
                                    {!show &&
                                        <>
                                            {stampdetails.reduce((total, item) => total + parseFloat(item.NO_STAMPS), 0) <= 5 ? <Button disabled={!srname || !stampNos || !stamptype || !category || !purchasefor || !address2 || !otpstat} type='button' onClick={() => { generateDocumentIdcall(srname); }} className='mx-5'>ADD </Button> : ''}
                                            {reqID && <Button disabled={false} type='button' onClick={() => { redirectToPage("/Stampindentserivepage"); }}>Save</Button>}
                                        </>
                                    }
                                </Col>
                            </Row>
                            {stampdetails.length > 0 &&

                                <><Row className='d-flex justify-content-center my-3'>
                                    <Col lg={10} md={12} xs={12}>

                                        <div style={{ maxHeight: '500px', overflowY: 'auto' }} className='Table-responsive'>
                                            <Table striped bordered hover className='TableData ListData table-responsive'>
                                                <thead style={{ backgroundColor: '#274c77', position: 'sticky', top: 0 }} className='text-nowrap'>
                                                    <tr>
                                                        <th className='fs-5 fw-bold' colSpan={show ? 7 : 8}>Selected Stamps for Purchase</th>
                                                    </tr>
                                                    <tr>
                                                        <th className='fs-6'>S.No.</th>
                                                        <th className='fs-6'>Request ID</th>
                                                        <th className='fs-6'>Category</th>
                                                        <th className='fs-6'>Stamp Type</th>
                                                        <th className='fs-6'>Denomination</th>
                                                        <th className='fs-6'>No. of Stamps</th>
                                                        <th className='fs-6'>Amount</th>
                                                        {!show && <th className='fs-6'>Action </th>}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {stampdetails.length > 0 && stampdetails?.map((item, index) => (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>{item.REQUEST_ID}</td>
                                                            <td>{item.STAMP_CATEGORY}</td>
                                                            <td>{item.STAMP_TYPE}</td>
                                                            <td>{item.DENOMINATION}</td>
                                                            <td>{item.NO_STAMPS}</td>
                                                            <td>{item.AMOUNT}</td>
                                                            {!show && <td onClick={() => { deletestampdetail(item); }}> <Image alt="Image" height={18} width={17} src='/PDE/images/delete-icon.svg' className={styles.tableactionImg} />
                                                            </td>}
                                                        </tr>
                                                    ))}
                                                    {stampdetails.length > 0 &&
                                                        <tr>
                                                            <td colSpan={7} className='text-end'> Grand Total : {stampdetails.reduce((total, item) => total + parseFloat(item.AMOUNT), 0)}</td>
                                                            {!show && <td></td>}
                                                        </tr>}
                                                </tbody>
                                            </Table>
                                        </div>

                                    </Col>
                                </Row>
                                    {show && <Row>
                                        <Col>
                                            <div className='d-flex justify-content-center'>
                                                <Button href='javascript:void(0)' onClick={() => { redirectToPage("/Stampindentserivepage"); }} rel="noreferrer">COMPLETE</Button>
                                            </div>
                                        </Col>
                                    </Row>
                                    }
                                </>
                            }
                        </form>
                    </div>
                </Container>
            </div>
            {/* <pre>{JSON.stringify(LoginDetails, null, 2)}</pre> */}
            {/* <pre>{JSON.stringify(PropertyDetails, null, 2)}</pre> */}
            {/* <pre>{JSON.stringify(payData, null, 2)}</pre> */}
        </div>
    )
}

export default StampIndent;
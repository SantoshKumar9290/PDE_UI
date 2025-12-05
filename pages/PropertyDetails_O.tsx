
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { CallingAxios, ShowMessagePopup, ShowPreviewPopup, TotalMarketValueCalculator } from '../src/GenericFunctions';
import { useAppDispatch, useAppSelector } from '../src/redux/hooks';
import { SavePropertyDetails } from '../src/redux/formSlice';
import styles from '../styles/pages/Mixins.module.scss';
import {  UseAddProperty, UseUpdateProperty,  UseDutyCalculator, UseOtherProperty } from '../src/axios';
import TableText from '../src/components/TableText';
import TableInputText from '../src/components/TableInputText';
import TableDropdown from '../src/components/TableDropdown';


const PropertyDetails_C =()=>{
    const router = useRouter();
    const dispatch = useAppDispatch()
    let initialPropertyDetails = useAppSelector(state => state.form.PropertyDetails);
    let [PropertyDetails, setPropertyDetails] = useState<any>(initialPropertyDetails);
    const [ApplicationDetails,setApplicationDetails] =useState<any>({ applicationId: "", executent: [], claimant: [] })
    const [CalculatedDutyFee, setCalculatedDutyFee] = useState({ TRAN_MAJ_CODE: "", TRAN_MIN_CODE: "", sroCode: "", amount: "", rf_p: "0", td_p: "0", sd_p: "0", marketValue: "0" })
    const [IsViewMode, setIsViewMode] = useState(false);
    let GetstartedDetails = useAppSelector(state => state.form.GetstartedDetails);    

    const DropdownOptions = {
        OtherProps: ["Machinery", "Bore","Plant & Machinery","Others"]
    }
    useEffect(() => {
        let data: any = localStorage.getItem("GetApplicationDetails");
        if (data == "" || data == undefined) {
            ShowMessagePopup(false, "Invalid Access", "/");
        }
        else {
            data = JSON.parse(data);
            setApplicationDetails(data);
            let data2:any = localStorage.getItem("PropertyDetails");
                if (data2 == "" || data == undefined) {
                    ShowMessagePopup(false, "Invalid Access", "/");
                }
                else {
                    data2 = JSON.parse(data2);
                    if (data2.mode == "view") {
                        setIsViewMode(true);
                    } else {
                        setIsViewMode(false);
                    }
                    dispatch(SavePropertyDetails(PropertyDetails));
                    setPropertyDetails(data2.mode === 'edit' ? { ...data2, localBodyType: data2.localBodyCode } : data2);
                }
        }
    },[]);
    useEffect(() => {
        if (ApplicationDetails.registrationType && ApplicationDetails.documentNature && ApplicationDetails.sroCode && ApplicationDetails.amount) {
            let ftv:any;
            let currentMarketValue = TotalMarketValueCalculator(ApplicationDetails)
            if(ApplicationDetails.docsExcutedBy == "GovtBody"){
                ftv = ApplicationDetails.amount
            }else{
                ftv =ApplicationDetails.amount > currentMarketValue ? ApplicationDetails.amount : currentMarketValue;
            }
            
            let data = {
                "tmaj_code": ApplicationDetails.registrationType.TRAN_MAJ_CODE,
                "tmin_code": ApplicationDetails.documentNature.TRAN_MIN_CODE,
                "sroNumber": ApplicationDetails.sroCode,
                "local_body": 3,
                "flat_nonflat": "N",
                "marketValue": currentMarketValue,
                "finalTaxbleValue": ftv,
                "con_value": ApplicationDetails.amount,
                "adv_amount": 0
            }
            DutyFeeCalculator(data);
        }
    }, [ApplicationDetails])
    const DutyFeeCalculator = async (data) => {
        let result = await UseDutyCalculator(data);
        if (result.status) {
            setCalculatedDutyFee({ ...CalculatedDutyFee, TRAN_MAJ_CODE: ApplicationDetails.registrationType.TRAN_MAJ_CODE, TRAN_MIN_CODE: ApplicationDetails.documentNature.TRAN_MIN_CODE, sroCode: ApplicationDetails.sroCode, amount: ApplicationDetails.amount, sd_p: result.data.sd_p, td_p: result.data.td_p, rf_p: result.data.rf_p });
        }
    }

    const onChange = (event: any) => {
        let TempDetails = { ...PropertyDetails };
        let addName = event.target.name;
        let addValue = event.target.value;
        // if (addName == 'northBoundry' || addName == 'southBoundry' || addName == 'eastBoundry' || addName == 'westBoundry') {
        //     addValue = addValue.replace(/[^\w\s/,-]/gi, "");
        // } 
        setPropertyDetails({ ...TempDetails, [addName]: addValue });
    }
    const onOthersSubmit =(e:any)=>{
        e.preventDefault();
        ApiCall(PropertyDetails);
    }
    const ApiCall = async (data: any) => {
        data.applicationId = ApplicationDetails.applicationId;
        data.typeOfProperty="Others";
        data.isPropProhibited =false;
        data.isLinkedDocDetails=false;
        data.propertyType="";
        data.cdma_details="";

        let result: any;
        if (data.mode === "edit") {
            result = await CallingAxios(UseUpdateProperty(data));
        } else {
            result = await CallingAxios(UseOtherProperty(data));

        }
        if (result.status) {
            localStorage.removeItem("PropertyDetails")
            ShowMessagePopup(true, "Property added successfully with MarketValue", "/PartiesDetailsPage", 5000)
        }
        else {
            ShowMessagePopup(false, result.message, "")
        }
    }
    return (
        <div className='PageSpacing'>
            <Head>
                <title>Propert Details_Others - Public Data Entry</title>
            </Head>
            <Container>
                <Row>
                    <Col lg={12} md={12} xs={12}>
                        <div className='tabContainerInfo'>
                        <Container>
                                <Row>
                                    <Col lg={10} md={12} xs={12} className='navItems'>
                                        <div className='tabContainer'>
                                            <div className='activeTabButton'>Get Started<div></div></div>
                                            <div className='activeTabButton'>Parties Details<div></div></div>
                                            <div className='activeTabButton'>Property Details<div></div></div>
                                            <div className='inactiveTabButton slotButton'>Slot Booking<div></div></div>
                                        </div>
                                    </Col>
                                    <Col lg={2} md={12} xs={12}>
                                        <div className='text-end previewCon'><button className='PreBtn proceedButton' onClick={() => ShowPreviewPopup()} >Preview Document</button></div>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col lg={12} md={12} xs={12} className='p-0 navItems'>
                                        <div className='tabContainer DutyfeeContainer'>
                                            {/* <div className='activeTabButton'>Duty Fees :<div></div></div> */}
                                            <div className='activeTabButton'>Stamp Duty(₹) : {CalculatedDutyFee.sd_p ? CalculatedDutyFee.sd_p : 0}<div></div></div>
                                            <div className='activeTabButton'>Transfer Duty(₹) : {CalculatedDutyFee.td_p ? CalculatedDutyFee.td_p : 0}<div></div></div>
                                            <div className='activeTabButton'>Registration fee(₹) : {CalculatedDutyFee.rf_p ? CalculatedDutyFee.rf_p : 0}<div></div></div>
                                            {GetstartedDetails?.documentNature && GetstartedDetails?.documentNature?.TRAN_MAJ_CODE === "08" && GetstartedDetails?.documentNature?.TRAN_MIN_CODE === "06" ?
                                            <div className='activeTabButton'>User Charges(₹) : {0}<div></div></div>:
                                            <div className='activeTabButton'>User Charges(₹) : 500<div></div></div>
                                            }
                                            {/* <div className='activeTabButton'>User Charges(₹) : 500<div></div></div> */}
                                            <div className='activeTabButton'>Market Value(₹)  : {TotalMarketValueCalculator(ApplicationDetails)}<div></div></div>
                                            <div className='activeTabButton'>Consideration Value(₹) : {ApplicationDetails.amount ? ApplicationDetails.amount : "0"}<div></div></div>
                                            {GetstartedDetails?.documentNature && GetstartedDetails?.documentNature?.TRAN_MAJ_CODE === "08" && GetstartedDetails?.documentNature?.TRAN_MIN_CODE === "06" ?
                                            <div className='activeTabButton'>Total Payable(₹) : {Number(CalculatedDutyFee.sd_p) + Number(CalculatedDutyFee.td_p) + Number(CalculatedDutyFee.rf_p) + 0}</div> :
                                            <div className='activeTabButton'>Total Payable(₹) : {Number(CalculatedDutyFee.sd_p) + Number(CalculatedDutyFee.td_p) + Number(CalculatedDutyFee.rf_p) + 500}</div>
                                            }
                                            {/* <div className='activeTabButton'>Total Payable(₹) : {Number(CalculatedDutyFee.sd_p) + Number(CalculatedDutyFee.td_p) + Number(CalculatedDutyFee.rf_p) + 500}</div> */}
                                        </div>
                                    </Col>
                                </Row>
                            </Container>
                        </div>
                        <div className={`mt-1 ${styles.PropertyDetailsmain} ${styles.PropertyDetailsPage}`}>
                            <Row className='ApplicationNum pt-5'>
                                <Col lg={6} md={6} xs={12}>
                                    <div className='ContainerColumn TitleColmn' onClick={() => { router.push("/PartiesDetailsPage") }}>
                                        <h4 className='TitleText left-title'>{ApplicationDetails.documentNature ? ApplicationDetails.registrationType.TRAN_DESC : null}</h4>
                                    </div>
                                </Col>
                                <Col lg={6} md={6} xs={12}>
                                    <div className='ContainerColumn'>
                                        <h4 className='TitleText' style={{ textAlign: 'right' }}>Application ID: {ApplicationDetails.applicationId}</h4>
                                    </div>
                                </Col>
                            </Row>
                            <div className={styles.ExecutantDetailsInfo}>
                                <div className={styles.DetailsHeaderContainer}>
                                    <Row>
                                        <Col lg={6} md={6} xs={12}>
                                            <div className={styles.ContainerColumn}>
                                                <p className={styles.HeaderText}>4 . Property Details (Others) [ఆస్తి వివరాలు ]</p>
                                            </div>
                                        </Col>
                                        <Col lg={6} md={6} xs={12}>
                                        </Col>
                                    </Row>
                                </div>
                                <form onSubmit={onOthersSubmit} className={styles.AddExecutantInfo}>
                                    <Row className="">
                                        <Col lg={3} md={6} xs={12}>
                                            <TableText label={"Other Properties"} required={true} LeftSpace={false} />
                                            {IsViewMode ? <TableInputText disabled={true} type='text' placeholder='' required={true} name={'otherPropName'} value={PropertyDetails?.otherPropName} onChange={onChange} /> 
                                            :
                                            <TableDropdown required={true} options={DropdownOptions.OtherProps} name={'otherPropName'} onChange={onChange} value={PropertyDetails?.otherPropName}/>
                                            }
                                            
                                        </Col>
                                        <Col lg={3} md={6} xs={12} ></Col>
                                        {/* <p className={` ${styles.getTitle} ${styles.HeadingText}`}>Value</p> */}
                                        <Col lg={3} md={6} xs={12}>
                                            <TableText label={"Property Value"} required={true} LeftSpace={false} />
                                            {/* {IsViewMode ? <TableInputText disabled={true} type='text' placeholder='0' required={false} name={'village'} value={PropertyDetails.village} onChange={onChange} />
                                                : <TableDropdown options={VillageList} required={true} name={'village'} value={PropertyDetails.village} onChange={onChange} />} */}
                                            
                                            {IsViewMode ? <TableInputText disabled={true} type='number' placeholder='cash value' required={true} name={'marketValue'} value={PropertyDetails?.marketValue} onChange={onChange} /> :
                                            <TableInputText  type='number' placeholder='value' required={true} name={'marketValue'} value={PropertyDetails?.marketValue} onChange={onChange} />}
                                        </Col>
                                    </Row>
                                    { !IsViewMode ? <Row className="mb-2">
                                        <Col lg={12} md={12} xs={12}>
                                            <div className={styles.ProceedContainer}>
                                                <button className='proceedButton'>{PropertyDetails?.mode == "edit" ? "Update" : "Proceed"} </button>
                                            </div>
                                        </Col>
                                    </Row> : null}
                                </form>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
            {/* <pre>{JSON.stringify(PropertyDetails, null, 2)}</pre> */}
        </div>
    )
}


export default PropertyDetails_C;

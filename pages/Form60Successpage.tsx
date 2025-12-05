import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import styles from '../styles/pages/Mixins.module.scss';
import Image from 'next/image';
import { ImCross } from 'react-icons/im';
import { encryptWithAES, decryptId, encryptId } from '../src/utils';
import { CallingAxios, KeepLoggedIn, ShowMessagePopup } from '../src/GenericFunctions';
import { verifyFormSixtyEsignStatus } from '../src/axios';



const Form60Successpage = () => {

    const [esignStatus, setEsignStatus] = useState<boolean>(false);

useEffect(() => {
        let data = localStorage.getItem("transId");
        if (data == "" || data == undefined) {
            ShowMessagePopup(false, "Invalid Access", "/");
        }
        else {
            let esignTransId = decryptId(data);
            let partyType = localStorage.getItem("partyType");
            partyType = decryptId(partyType);
            let dataString = localStorage.getItem("esignPartyData");
            let esignPartyData: any = JSON.parse(decryptId(dataString));
            // console.log("esignPartyData :::: ", esignPartyData);
            let verifyData = {
                txnId:esignTransId,
                appId : esignPartyData.applicationId,
                partyId : esignPartyData._id,
                "partyType":partyType
            }
            console.log("verifyData ::::: ", verifyData);
            CallVerifyFormSixtyEsignStatus(verifyData);
        }
    }, []);

    const CallVerifyFormSixtyEsignStatus = async (data: any) => {
        const result = await verifyFormSixtyEsignStatus(data);
        if(result.status == true && result.data == true){
            ShowMessagePopup(true, "eSign completed successfully on form60.", "/PartiesDetailsPage");
        }
        else{
            ShowMessagePopup(false, "Form60 eSign is still not completed.", "/PartiesDetailsPage");
        }
    }

    return (
        <div className='PageSpacing pt-0'>
            <Head>
                <title>Esign Status Page- Public Data Entry</title>
            </Head>
            <Container>
                <div className={`text-center ${styles.AddPartyMain}`}>
                    <Row className='ApplicationNum mt-5'>
                        <Col lg={6} md={6} xs={12}>
                            <div className='ContainerColumn'>
                                <p className='TitleText'> Form60/61 Esign Status Page</p>
                            </div>
                        </Col>
                        <Col lg={6} md={6} xs={12}>
                            <div className='ContainerColumn RightColumnText text-end'>

                            </div>
                        </Col>
                    </Row>
                    <div className={styles.DocSubmitPage}>
                        <Row>
                            <Col lg={12} md={12} sm={12}>
                                <div className='text-center mt-1'>
                                    <div className={` ${styles.RegistrationInput} ${styles.LoginPageInput}`}>
                                        <div className="p" style={{color:"red"}}>
                                            <img src="/PDE/images/please-wait.gif" />
                                            {/* <ImCross className={styles.crossIcon} />
                                             <h4><span style={{color:"red"}}>eSign Status pending</span></h4> */}
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default Form60Successpage
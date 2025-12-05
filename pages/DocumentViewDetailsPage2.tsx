// import React, { useEffect, useState } from 'react';
// import { Col, Container, Row } from 'react-bootstrap';
// import styles from '../styles/pages/DocumentViewDetailsPage.module.scss';
// import { useAppSelector, useAppDispatch } from '../src/redux/hooks';
// import { useRouter } from 'next/router';
// import { getApplicationDetails } from '../src/axios';
// import Image from 'next/image';
// import { CallingAxios } from '../src/GenericFunctions';

const DocumentViewDetailsPage = () => {
    // const dispatch = useAppDispatch()
    // const router = useRouter();
    // let initialGetstartedDetails = useAppSelector(state => state.form.GetstartedDetails);
    // let LoginDetails = useAppSelector(state => state.login.loginDetails);
    // const [GetstartedDetails, setGetstartedDetails] = useState(initialGetstartedDetails);
    // const [ApplicationDetails, setApplicationDetails] = useState({ applicationId: GetstartedDetails.applicationId, registrationType: "",documentNature:"", status: "ACTIVE", sroDetails: null,sroOffice:"", executent: [], executentrepresentative: [], claimant: [], representative: [], presenter: [] });

    // useEffect(() => { if (GetstartedDetails.applicationId) { GetApplicationDetails(); } }, []);

    // const GetApplicationDetails = async () => {
    //     let result = await CallingAxios(getApplicationDetails(GetstartedDetails.applicationId, LoginDetails.token));
    //     if (result.status) {
    //         setApplicationDetails(result.data);
    //     } else {
    //         window.alert(result.message);
    //     }
    // }

    // const DisplayTable = (key: any, value: any) => {
    //     return (
    //         <div style={{ display: 'flex'}}>
    //             <div className={styles.KeyContainer} >
    //                 <text className={styles.keyText}>{key}</text>
    //             </div>
    //             <div className={styles.ValueContainer}>
    //                 <text className={styles.valueText}>: {value}</text>
    //             </div>
    //         </div>
    //     );
    // }
    // const DisplayInfo = (v1,v2,v3,v4) => {
    //     return (
    //         <div style={{ display: 'flex'}}>
    //             <div style ={{width:'25%'}} >
    //                 <text className={styles.valueText}>{v1}</text>
    //             </div>
    //             <div style ={{width:'25%'}} >
    //                 <text className={styles.valueText}>{v2}</text>
    //             </div>
    //             <div style ={{width:'25%'}} >
    //                 <text className={styles.valueText}>{v3}</text>
    //             </div>
    //             <div style ={{width:'25%'}} >
    //                 <text className={styles.valueText}>{v4}</text>
    //             </div>
    //         </div>
    //     );
    // }
    return (
        <div></div>
        // <div className={styles.DocumentDetailxsain}>
        //     <Container>
        //         <Row>
        //             <Col lg={12} md={12} xs={12}>
        //                 <div className={styles.ListComponentContainer}>
        //                     <text className={styles.TitleText}>Application Details</text>
        //                     {DisplayTable("Application ID",ApplicationDetails.applicationId)}
        //                     {DisplayTable("Registration Type",ApplicationDetails.registrationType)}
        //                     {DisplayTable("Nature of Document",ApplicationDetails.documentNature)}
        //                     {DisplayTable("Status",ApplicationDetails.status)}
        //                     {DisplayTable("SRO Office",ApplicationDetails.sroOffice)}
        //                     {DisplayTable("Executant","")}  
        //                     {ApplicationDetails.executent.map((x,index)=>{
        //                         return(<div key={index}>
        //                                 {DisplayInfo(x.name,x.relationType+" "+x.relationName,x.age,x.phone)}
        //                         </div>);
        //                     })}
        //                     {DisplayTable("claimant","")}  
        //                     {ApplicationDetails.claimant.map((x,index)=>{
        //                         return(<div key={index}>
        //                                 {DisplayInfo(x.name,x.relationType+" "+x.relationName,x.age,x.phone)}
        //                         </div>);
        //                     })}      
                                                 
        //                     {/* <pre>{JSON.stringify(ApplicationDetails, null, 2)}</pre> */}
        //                 </div>
        //             </Col>
        //         </Row>
        //     </Container>
        //     <pre>{JSON.stringify(ApplicationDetails, null, 2)}</pre>
        // </div>
    )
}

export default DocumentViewDetailsPage
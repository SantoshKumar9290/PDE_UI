import React, { Fragment, useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import styles from '../styles/pages/Mixins.module.scss';
import { useRouter } from 'next/router';
import { useAppSelector, useAppDispatch } from '../src/redux/hooks';
import { getApplicationDetails, useDeleteParty, useDeleterepresentative, UseSetPresenter, useDeleteProperty } from '../src/axios';
import Image from 'next/image';
import Table from 'react-bootstrap/Table';
import { SaveCurrentPartyDetails } from '../src/redux/formSlice';
import { DeletePopupAction, PopupAction } from '../src/redux/commonSlice';
import TableDropdownPresenter from '../src/components/TableDropdownPresenter';
import { CallingAxios, ShowMessagePopup } from '../src/GenericFunctions';

const DocumentViewDetailsPage = () => {
    const dispatch = useAppDispatch()
    let GetstartedDetails = useAppSelector(state => state.form.GetstartedDetails);
    let LoginDetails = useAppSelector(state => state.login.loginDetails);
    let DeleteOption = useAppSelector(state => state.common.DeletePopupMemory);
    const router = useRouter();

    const [ApplicationDetails, setApplicationDetails] = useState({ applicationId: GetstartedDetails.applicationId, registrationType: "", status: "ACTIVE", sroDetails: null, executent: [], claimant: [], property: [] });
    const [PresenterList, setPresenterList] = useState([]);

    useEffect(() => { if (GetstartedDetails.applicationId && LoginDetails.token) { GetApplicationDetails(); } else { router.push('/'); } }, []);

    const GetApplicationDetails = async () => {
        let result = await CallingAxios(getApplicationDetails(GetstartedDetails.applicationId));
        if (result.status) {
            setApplicationDetails(result.data);
            let Data = result.data;
            let TempList = [];
            Data.executent.map(x => TempList.push({ name: "EXECUTENT - " + x.name, id: x._id }));
            Data.claimant.map(x => TempList.push({ name: "CLAIMANT - " + x.name, id: x._id }));
            setPresenterList(TempList);
        } else {
            // ShowMessagePopup(false, result.message, "")
            ShowMessagePopup(false,"Get Application Details Failed","");
        }
    }

    useEffect(() => {
        if (DeleteOption.response) {
            CallDeleteAction(DeleteOption.deleteId, DeleteOption.applicationId, DeleteOption.type);
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

    const CallDeleteAction = async (DeleteId, applicationId, type) => {
        let Data = {}
        let result: any;
        if (type == "party") {
            Data = {
                id: DeleteId,
                applicationId: applicationId
            }
            await CallDeleteParty(Data);
        }
        else if (type == "representative") {
            Data = {
                partyId: DeleteId,
                parentPartyId: applicationId
            }
            await CallDeleterepresentative(Data);
        }
        else if (type == "property") {
            Data = {
                propertyId: DeleteId,
                applicationId: applicationId
            }
            await CallDeleteProperty(Data);
        }
    }

    const CallDeleteParty = async (Data: any) => {
        let result = await CallingAxios(useDeleteParty(Data));
        if (result.status) {
            dispatch(PopupAction({ enable: true, type: true, message: "Party Deleted Successfully", redirectOnSuccess: "" }));
            GetApplicationDetails()
        } else {
            dispatch(PopupAction({ enable: true, type: false, message: "Party Delete Failed", redirectOnSuccess: "" }));
        }
    }

    const CallDeleteProperty = async (Data: any) => {
        let result = await CallingAxios(useDeleteProperty(Data, LoginDetails.token));
        if (result.status) {
            dispatch(PopupAction({ enable: true, type: true, message: "Property Deleted Successfully", redirectOnSuccess: "" }));
            GetApplicationDetails()
        } else {
            dispatch(PopupAction({ enable: true, type: false, message: "Party Delete Failed", redirectOnSuccess: "" }));
        }
    }

    const CallDeleterepresentative = async (Data: any) => {
        let result = await CallingAxios(useDeleterepresentative(Data, LoginDetails.token));
        if (result.status) {
            dispatch(PopupAction({ enable: true, type: true, message: "Representative Deleted Successfully", redirectOnSuccess: "" }));
            GetApplicationDetails()
        } else {
            dispatch(PopupAction({ enable: true, type: false, message: "Representative Delete Failed", redirectOnSuccess: "" }));
        }
    }


    const redirectToPage = (location: string) => {
        router.push({
            pathname: location,
        })
    }

    const ShowDeletePopup = (message, redirectOnSuccess, deleteId, applicationId, type) => {
        dispatch(DeletePopupAction({ enable: true, inProcess: false, message, redirectOnSuccess, deleteId, applicationId, type }));
    }

    const OpenPartyAction = (operation: string, type: string, data: any) => {
        let query = {
            name: "",
            relationType: "",
            relationName: "",
            age: "",
            panNoOrForm60or61: "",
            tan: "",
            aadhaar: "",
            representType: type,
            email: "",
            phone: "",
            address: "",
            representSubType: "",
            applicationId: "",
            operation: operation,
            partyId: ""
        }
        if (operation == "View" || operation == "Edit") {
            query = data;
            query.representType = type;
            query.operation = operation;
            query.partyId = data._id
        }
        if (operation == "AddRep") {
            query = data;
            query.representType = "representative";
            query.representSubType = type;
            query.operation = operation;
            query.partyId = data._id
        }
        dispatch(SaveCurrentPartyDetails(query));
        redirectToPage("/AddPartyPage");
    }

    const DisplayPartiesComponent = (no: string, title: string, Lists: any) => {
        return (
            <div className={styles.mainTabs}>
                <Row className={styles.tabHeadContainer}>
                    <Col lg={6} md={6} xs={12}>
                        <div className={styles.addCusText}>
                            <p className={styles.tabText}>{no} {title}</p>
                        </div>
                    </Col>
                </Row>
                <div className={styles.InnertabHeadContainer}>
                    <div className={styles.innerTabContainer}>
                        <Table striped bordered hover className='TableData'>
                            <thead>
                                <tr>  <th>Name</th> <th>Relation</th> <th>Age</th> <th>represent</th> <th>Aadhaar</th> <th>Phone</th> <th>PAN</th> <th>TAN</th> <th>Address</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Lists.map((singleUser, index) => {
                                    return (
                                        <tr key={index}>

                                            <td style={{ color: singleUser.isPresenter ? 'red' : 'black' }}>{singleUser.name}</td>
                                            <td>{singleUser.relationType} {singleUser.relationName}</td>
                                            <td>{singleUser.age}</td>
                                            <td>
                                                <div className={`${styles.actionTitle} ${styles.actionbtn}`} >
                                                    {singleUser.represent.length && singleUser.represent[0].name}
                                                </div>
                                            </td>
                                            <td>{singleUser.aadhaar}</td>
                                            <td>{singleUser.phone}</td>
                                            <td>{singleUser.panNoOrForm60or61}</td>
                                            <td>{singleUser.tan}</td>
                                            <td>{singleUser.address}</td>
                                        </tr>
                                    );
                                })}

                            </tbody>
                        </Table>
                    </div>
                </div>
            </div>
        )
    }

    const onSelectPresenter = async (e: any) => {
        let query = {
            partyId: e.target.value,
            applicationId: GetstartedDetails.applicationId
        }
        let result = await CallingAxios(UseSetPresenter(query));
        if (result.status) {
            await GetApplicationDetails();
        }
        else {
            ShowMessagePopup(false, result.message, "");
        }
    }

    return (

        <div className='PageSpacing'>
            <Container>
                <Row>
                    <Col lg={12} md={12} xs={12}>
                        <div className={`${styles.mainContainer} ${styles.DocViewContainer}`}>
                            <Row className='ApplicationNum'>
                                <Col lg={6} md={6} xs={12}>
                                    <div className='ContainerColumn' onClick={() => { redirectToPage("/FinishDocumentPage") }}>
                                        <p className='TitleText left-title'>Document Details Page</p>
                                    </div>
                                </Col>
                                <Col lg={6} md={6} xs={12}>
                                    <div className='ContainerColumn'>
                                        <h4 className='TitleText' style={{ textAlign: 'right' }}>Application ID: {GetstartedDetails.applicationId}</h4>
                                    </div>

                                </Col>
                            </Row>
                            {DisplayPartiesComponent("1.", "Executant", ApplicationDetails.executent)}
                            {DisplayPartiesComponent("2.", "Claimant", ApplicationDetails.claimant)}
                            <div className={styles.mainTabs}>
                                <Row className={styles.tabHeadContainer}>
                                    <Col lg={6} md={6} xs={12}>
                                        <div className={styles.addCusText}>
                                            <p className={styles.tabText}>3. Property Details </p>
                                        </div>
                                    </Col>
                                    <Col lg={6} md={6} xs={12}>
                                        <div className={styles.addCusContainer} onClick={() => { router.push("/PropertyDetailsPage") }}>
                                            <Image alt="Image" height={25} width={25} src='/PDE/images/add-cust-icon.svg' style={{ cursor: 'pointer' }} className={styles.addCusContainerImage} />
                                            <p className={styles.innertabText}>Add Property</p>
                                        </div>
                                    </Col>
                                </Row>
                                <div className={styles.InnertabHeadContainer}>
                                    <div className={styles.innerTabContainer}>
                                        <Table striped bordered hover className='TableData'>
                                            <thead>
                                                <tr> <th>SL. No</th> <th>Type</th> <th>Details</th> <th>Boundried</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {ApplicationDetails.property.map((singleProperty, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>{singleProperty.propertyType}</td>
                                                            <td>
                                                                <div>SRO-{singleProperty.sroOffice},survay-{singleProperty.survayNo}</div>
                                                                <div>Extent-{singleProperty.extent}/{singleProperty.extentUnit}</div>
                                                            </td>
                                                            <td>
                                                                <div>N-{singleProperty.northBoundry}, S-{singleProperty.southBoundry}</div>
                                                                <div>E-{singleProperty.eastBoundry}, W-{singleProperty.westBoundry}</div>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}

                                            </tbody>
                                        </Table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
            {/* <pre>{JSON.stringify(ApplicationDetails, null, 2)}</pre> */}
        </div>
    )
}

export default DocumentViewDetailsPage;
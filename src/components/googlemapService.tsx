///<reference types="@types/google.maps" />

import React, { useEffect, useState } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { Container, Row, Col, Modal } from 'react-bootstrap';
import { ImCross } from 'react-icons/im';
import Popstyles from '../../styles/components/PopupAlert.module.scss';
import { GooglemapAction } from '../redux/commonSlice';
import TableInputLongText from './TableInputLongText';
import Button from './Button';
import { ShowAadharPopup, ShowMessagePopup } from '../GenericFunctions';
import UploadContainer from './UploadContainer';



const GooglemapService = () => {
    const dispatch = useAppDispatch()
    const GooglemapMemory = useAppSelector((state) => state.common.GooglemapMemory);
    const [Location, setLocation] = useState({ lat: 0, lng: 0 });
    const [Reason, setReason] = useState("");
    const [UploadDocument, setUploadDocument] = useState({ docName: "", status: "" });
    const mapContainerStyle = {
        width: '38vw',
        height: '50vh',
    };

    useEffect(() => {
        if (GooglemapMemory.enable) {
            setLocation({ lat: Number(GooglemapMemory.Location.lat), lng: Number(GooglemapMemory.Location.lng) })
            setReason(GooglemapMemory.Reason);
        }
    }, [GooglemapMemory.Location])

    const center = {
        lat: Location.lat, // default latitude
        lng: Location.lng// default longitude
    };

    const OnCancelAction = async () => {
        // dispatch(GooglemapAction({enable: false, result:false, Location:false, Reason:"" }));
        dispatch(GooglemapAction({ enable: false, id: GooglemapMemory.id, Location: { lat: 0, lng: 0 }, result: false, Reason: "" }));
    }

    const { isLoaded, loadError } = useLoadScript({ googleMapsApiKey: process.env.GOOGLE_KEY });
    if (loadError) { return <div>Error loading maps</div>; }
    if (!isLoaded) { return <div>Loading maps</div>; }

    const SaveLatLong = (e) => {
        let lat = e.latLng.lat();
        let lng = e.latLng.lng();
        if (lat && lng) { setLocation({ lat, lng }) }
    }

    const AddReason = () => {
        if (Reason && Reason != "") {
            dispatch(GooglemapAction({ enable: false, result: true, Location, Reason, id: GooglemapMemory.id }))
        }
        else {
            ShowMessagePopup(false, "Attendance Reason is Mendatory", "");
        }
    }
    const onCancelUpload = () => {

    }
    return (
        <div>
            {GooglemapMemory && GooglemapMemory.enable ?
                <Container>
                    <div className={`GooglemapInfo ${Popstyles.reportPopup}`}>
                        <div className={` ${Popstyles.container}`}>
                            <div className={` ${Popstyles.GooglemapCon} ${Popstyles.Messagebox}`}>
                                <div className={Popstyles.header}>
                                    <div className={Popstyles.letHeader} >
                                        <p className={Popstyles.text}>Private Attandance</p>
                                    </div>
                                    <div>
                                        <ImCross onClick={OnCancelAction} className={Popstyles.crossButton} />
                                    </div>
                                </div>
                                <div className='mt-3'>
                                    <GoogleMap
                                        onClick={(e: google.maps.MapMouseEvent) => { SaveLatLong(e); }}
                                        mapContainerStyle={mapContainerStyle}
                                        zoom={10}
                                        center={Location}
                                    >
                                        <Marker position={center} />
                                    </GoogleMap>
                                    <div className='mapInfo'>
                                        <div className='d-flex'><p><span>Lat: </span>{Location.lat}</p> <p><span>Lng: </span>{Location.lng}</p></div>
                                        
                                        <h5>Attendance Reason</h5>
                                        <TableInputLongText placeholder={'Kindly Provide Attendance Reason'} maxLength={300} required={true} value={Reason} onChange={(e) => setReason(e.target.value)} name={'reason'} />
                                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                            <Button btnName="Submit" onClick={() => AddReason()} />
                                        </div>
                                      
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Container> : null}
        </div>
    )
}

export default GooglemapService;
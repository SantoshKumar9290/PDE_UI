import React, {useEffect} from "react";
import { Loading, ShowMessagePopup } from "../src/GenericFunctions";
import { getEsignStatus } from "../src/axios";
import { setAppId } from "../src/redux/commonSlice";
import { useAppDispatch } from "../src/redux/hooks";

const EsignStatus = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        (async () => {
            Loading(true);
            if(localStorage.getItem("statusPayload")){
                let a = JSON.parse(localStorage.getItem("statusPayload"));
                let result = await getEsignStatus(a);
                dispatch(setAppId(a.documentId));
                Loading(false);
                ShowMessagePopup(result.status, result.status ? "Esign Successfull" : result.message, "/PartiesEsign");
            }
        })();
    }, [])

    return (
        <></>
    )
}

export default EsignStatus;
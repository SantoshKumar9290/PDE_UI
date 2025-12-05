import Head from 'next/head'
import React, { useEffect } from 'react'
import { useRouter } from 'next/router';
import {  UseCCDownloadGSWS } from '../src/axios'
import { CallingAxios} from '../src/GenericFunctions';

const CCdownloadPage = () => {
    const router = useRouter();

    useEffect(() => {
        let locationData = window.location.href;
        let parthArray = locationData.split("?");
            let pathParamAndVal = parthArray[1];
            let parmAndValArray = pathParamAndVal.split("data=");
                let encryptedData = parmAndValArray[1];
               getccdoc(encodeURIComponent(encryptedData))
    }, []);
   const getccdoc=async(ccdata)=>{
   let response= await CallingAxios(UseCCDownloadGSWS(ccdata))
    router.replace(router.pathname, undefined, { shallow: true });
   return response
   
    }

    return (
        <div className="PageSpacing">
            <Head>
                <title>CC Request</title>
            </Head>
        </div>
    )
}

export default CCdownloadPage
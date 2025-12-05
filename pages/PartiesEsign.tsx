import React, { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../src/redux/hooks';
import { setAppId } from '../src/redux/commonSlice';
import { executeDoc, getEsignData, getPartyDetailsByAppId } from '../src/axios';
import { CallingAxios, ShowMessagePopup,KeepLoggedIn } from '../src/GenericFunctions';
import { useRouter } from 'next/router';
import styles from '../styles/pages/PartiesEsign.module.scss';
import { ESPs, EXECUTANT_CODES, decryptId,WITNESS_CODES, CLAIMANT_CODES } from '../src/utils';
import TableDropdown from '../src/components/TableDropdown';
import Image from 'next/image';

const PartiesEsign = () => {
    const appId = useAppSelector(state => state.common.appId);
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [users, setUsers] = useState([]);
    const [espSelected, setESPSelected] = useState('NSDL');
    const [activeTab, setActiveTab] = useState(0);
    // const [xmlValue, setXMLValue] = useState("");
    const [docDet, setDocDet] = useState<any>({});
    const [loginDetails, setLoginDetails] = useState<any>({});
    const vswsLogin = loginDetails?.loginMode == "VSWS";

    useEffect(() => {
        const loginDetails = JSON.parse(localStorage.getItem('LoginDetails') || '{}');
        setLoginDetails(loginDetails);
        setActiveTab(loginDetails?.loginMode == "VSWS" ? 1 : 0)
    }, []);


    const tabs = vswsLogin ? ["Claimants","Witness"] : ["Executants", "Claimants","Witness"]

    const redirectToPage = (location: string) => {
        router.push({
            pathname: location,
        })
    }
    const igrsEsign = true;
    const [esignUrl, setEsignUrl] = useState("");
    const [xmlValue, setXMLValue] = useState('');
    const [FieldName, setFieldName] = useState("esignRequest");

    useEffect(() => {
        if (esignUrl && esignUrl.length > 0 && esignUrl != 'undefined' && esignUrl != undefined) {
          // Create a form dynamically
          dynamicformsubmit()
        }
    
      }, [esignUrl])
    
      async function dynamicformsubmit() {
        var form = document.createElement("form");
        form.setAttribute("method", "post");
        form.setAttribute("action", esignUrl);
        if (!igrsEsign) {
          let encType = "multipart/formdata";
          form.setAttribute("encType", encType);
        }
        var FN = document.createElement("input");
        FN.setAttribute("type", "hidden");
        FN.setAttribute("name", FieldName);
        FN.setAttribute("value", xmlValue);
        var s = document.createElement("input");
        s.setAttribute("type", "submit");
        s.setAttribute("value", "Submit");
        s.setAttribute("id", "igrs_input1");
        form.appendChild(FN);
        form.appendChild(s);
        document.body.appendChild(form);
        await sleep(100)
        s.click()
      }
      
      function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)) }
     

    useEffect(() => {
        if(appId){
            fetchParties(appId);
            if(localStorage.getItem('app-det')){
                setDocDet(JSON.parse(localStorage.getItem('app-det')));
            }
        } else {
            redirectToPage('/ExecutionList');
        }

        return () => {
            dispatch(setAppId(''));
        }
    }, [])

    // useEffect(() => {
    //     if(xmlValue){
    //         document.getElementById('igrs_input').click();
    //     }
    // }, [xmlValue]);

    const getSigndata = async (r) => {
        let ob: any = {
            'documentId': appId,
        };
        if(r.representative){
            ob.repId = r._id;
            ob.parentId = r.parentPartyId;
        } else {
            ob.partyId = r._id;
        }
        ob.code = r.partyCode;
        ob.ecNumber = r.seqNumber;
        ob.parytName = r.name;
        let result = await CallingAxios(getEsignData(ob));
        if(result.status){
            ob.txnId = result.data.transid;
            localStorage.setItem("statusPayload", JSON.stringify(ob));
            setXMLValue(result.data.data.eSignRequest)
            setFieldName(result.data.data.fieldName)
            setEsignUrl(result.data.data.esignPostUrl)
        } else {
            ShowMessagePopup(false, result.message, "");
        }
    }

    const fetchParties = async(id) => {
        let result = await CallingAxios(getPartyDetailsByAppId(id));
        if(result.status){
            let list = [];
            result.response.forEach(r => {
                if(r.represents.length){
                    list = [...list, ...(r.represents.map(d => {return {...d, 'partyCode': r.partyCode, "representative": true, "parentName": r.name}}))];
                } else {
                    list = [...list, r];
                }
            });
            setUsers([...list]);
        } else {
            ShowMessagePopup(false, result.message, "");
        }
    } 

    const countUsers = () => {
        return [users.filter(u => EXECUTANT_CODES.includes(u.partyCode)).length, users.filter(u => CLAIMANT_CODES.includes(u.partyCode)).length, users.filter(u => WITNESS_CODES.includes(u.partyCode)).length]
    }

    const counts = useMemo(() => countUsers(), [users]); 

    const executeDocument = async() => {
        let ob = {
            'documentId': appId
        };
        let result = await CallingAxios(executeDoc(ob));
        if(result.status){
            ShowMessagePopup(true, "Document saved sucessfully", "/ExecutionList");
        } else {
            ShowMessagePopup(false, result.message, "");
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.headSection}>
                <div className={styles.leftBlock}>
                    <div className={`${styles.TitleText} ${styles['left-title']}`} onClick={() => redirectToPage('/ExecutionList')}>Execute Document</div>
                </div>
                <div className={styles.rightBlock}>
                    <div className={styles.item}>
                        {/* <div>ESP:</div> */}
                        <TableDropdown options={ESPs} value={espSelected} required={false} onChange={(e) => setESPSelected(e.target.value)} name="esp" multi={true} />
                    </div>
                    <div className={styles.item}>
                        <div>ID:</div>
                        <div>{appId}</div>
                    </div>
                </div>
            </div>
            <div className={styles.tabHeader}>
                {
                    tabs.map((t, index) => {
                        return (
                            <div className={`${styles.tabItem} ${(vswsLogin ? index + 1 : index) === activeTab ? styles.active : ''}`} key = {index} onClick={() => setActiveTab(vswsLogin ? index + 1 : index)}>
                                <div>{t}</div>
                                <div className={styles.count}>{counts[vswsLogin ? index + 1 : index]}</div>
                            </div>
                        )
                    })
                }
            </div>
            <div className={styles.tLabel}>
                <div>Party Name</div>
                <div>Action</div>
            </div>
            <div className={styles.tabBody}>
                {
                    users.filter((u) => {
                        if (activeTab === 0) {
                            if (EXECUTANT_CODES.includes(u.partyCode)) {
                                return true;
                            }
                        } else if (activeTab === 1) {
                            if (CLAIMANT_CODES.includes(u.partyCode)) {
                                return true;
                            }
                        } else if (activeTab === 2) {
                            if (WITNESS_CODES.includes(u.partyCode)) {
                                return true;
                            }
                        }
                    }).map((u, index) => {
                        return (<div className={styles.bodyItem} key={index}>
                            <div>{u.name} {u.representative ? `[R] ${u.parentName}` : ''}</div>
                            {u.esignStatus === 'Y' ? <div className={styles.EKYCDone}><Image alt="Image" src={'/PDE/images/success-icon.png'} height={20} width={20} /><span>eSign Done</span></div> : <button onClick={() => {getSigndata(u)}}>eSign</button> }
                        </div>)
                    })
                }
            </div>
            <div className={styles.footer}>
                {users.some(p => p.esignStatus === 'Y') && (
                <button onClick={() => {
                    window.open(`${process.env.BACKEND_URL}/pdeapi/pdfs/${appId}/${docDet.docDownLoadedBy === 'T' ? 'signed' + docDet.documentType.TRAN_DESC.split(' ')[0] + 'Telugu'  : 'signedEngDocs'}.pdf`);
                }}>Preview</button> )}
                {
                  !!users.length && users.filter(u => u.partyType !== 'Deceased').every(u => u.esignStatus === 'Y') &&  <button onClick={executeDocument}>Save</button>
                }
            </div>
            <form action={`${process.env.OWN_ESIGN_URL}`} method="POST" encType="multipart/form-data" >
                    <input type="hidden" id="esignRequest" name="esignRequest" value={xmlValue}/>
                    <input type="submit" value="Submit" style={{ visibility: 'hidden' }} id='igrs_input'/> 
            </form> 
        </div>
    )

};

export default PartiesEsign;
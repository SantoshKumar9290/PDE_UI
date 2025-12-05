import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { getApplicationDetails, UseSaveCovinant, UseUpdateCovinant, UseDelCovenant, englishToTeluguTransliteration, googleAPI,teleuguAnu } from '../src/axios';
import TableInputLongText from '../src/components/TableInputLongText';
import { CallingAxios, KeepLoggedIn, ShowMessagePopup, ShowPreviewPopup } from '../src/GenericFunctions';
import covenantType from '../src/covenantType';
import styles from '../styles/pages/Mixins.module.scss';
import styles2 from '../styles/components/Table.module.scss';
import Head from 'next/head';
import { get } from 'lodash';
import axios from 'axios';
import TableInputRadio from '../src/components/TableInputRadio';

const languages = [{ label: 'English' }, { label: 'Telugu (CDAC)'}, {label: "Telugu (Google Translation)"},{label: "Telugu (Anu Translation)"}];

const AddCovenantPage = () => {
    const router = useRouter();
    const [ApplicationDetails, setApplicationDetails] = useState<any>({ applicationId: "", executent: [], claimant: [], covanant: {} });
    const [CovenantList, setCovenantList] = useState<any>([]);
    const [CovenantStaticList, setCovenantStaticList] = useState<any>([]);
    const [CovenantDetails, setCovenantDetails] = useState<any>({ value: "", language: 'English' });
    const [EditRistrictTill, setEditRistrictTill] = useState(0);

    // const [val, setVal] = useState('');
    const [modalVal, setModalVal] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [alphaIndex, setAlphaIndex] = useState(0);
    const inputModalElement = useRef();
    const [googleEnglish, setGoogleEnglish] = useState('');

    const onChange2 = (e) => {
        const reg = /[a-zA-Z]/g;
        let addValue = e.target.value;
        if (addValue && reg.test(addValue)) {
            let firstAlphabetIndex = -1;
            for (let i = 0; i < addValue.length; i++) {
                if (/[a-zA-Z]/.test(addValue[i])) {
                    firstAlphabetIndex = i;
                    break;
                }
            }
            setAlphaIndex(firstAlphabetIndex);
        } else {
            setCovenantDetails({
                ...CovenantDetails,
                value: addValue
            })
        }
    }

    const onModalChange = (e) => {
        const reg = /^[A-Za-z]*$/;
        let addValue = e.target.value;
        if (!addValue) {
            setSuggestions([]);
            setModalVal('');
        } else {
            if (reg.test(addValue)) {
                setModalVal(addValue);
            } else {
                onEnter(addValue);
            }
        }
    }

    const onEnter = (addValue = '') => {
        if (!loading) {
            let v: string = CovenantDetails.value;
            addValue = addValue ? addValue : suggestions.length ? suggestions[0] : '';
            v = v.length <= alphaIndex ? (v + addValue) : (v.slice(0, alphaIndex) + addValue + v.slice(alphaIndex));
            setCovenantDetails({
                ...CovenantDetails,
                value: v
            })
            setModalVal('');
            setSuggestions([]);
            setTimeout(() => {
                let reff: any = document.getElementById('teluguBox')
                if (reff) {
                    reff.focus();
                }
            }, 0)
        }
    }

    useEffect(() => {
        let source = axios.CancelToken.source();
        (async () => {
            if (modalVal) {
                setLoading(true);
                const result = await englishToTeluguTransliteration(modalVal, source);
                setLoading(false);
                setSuggestions([...result.suggestions]);
            }
        })();

        return () => {
            if (!modalVal) {
                source.cancel();
            }
        }
    }, [modalVal])

    const redirectToPage = (location: string) => {
        router.push({
            pathname: location,
        })
    }

    const onSubmit = (e) => { e.preventDefault() }

    useEffect(() => {
        if (KeepLoggedIn()) {
            GetApplicationDetails();
        } else { ShowMessagePopup(false, "Invalid Access", "/") }
    }, []);

    const GetApplicationDetails = async () => {
        let data: any = localStorage.getItem("GetApplicationDetails");
        if (data == "" || data == undefined) {
            ShowMessagePopup(false, "Invalid Access", "/");
        }
        else {
            data = JSON.parse(data);
            CallToApplicationDetails(data);
        }
    }

    const CallToApplicationDetails = async (data: any) => {
        let result = await CallingAxios(getApplicationDetails(data.applicationId));
        if (result.status) {
            setApplicationDetails(result.data);
            localStorage.setItem("GetApplicationDetails", JSON.stringify(result.data));
            let data = get(result, "data.covanants.covanants", [])
            let MyList = [];

            let PreList = covenatsTypeFinder(result.data.registrationType);
            PreList.map((x: any, i: number) => {
                MyList.push(PreList[i]);
            })
            setCovenantStaticList(MyList);
            setCovenantList(data);
            switch (result.data.registrationType.TRAN_MAJ_CODE) {
                case "01": setEditRistrictTill(covenantType.saleMessage.length); break;
                case "02": setEditRistrictTill(covenantType.mortgageMessage.length); break;
                case "03": setEditRistrictTill(covenantType.giftMessage.length); break;
                default: setEditRistrictTill(0);
            }

        } else {
            // window.alert(result.message);
            ShowMessagePopup(false, "Get Application Details Failed", "");
        }
    }
    const onChange = (e) => {
        let name = e.target.name;
        let val = e.target.value;
        let cov = { ...CovenantDetails };
        if (name === 'language') {
            cov.value = '';
            setSuggestions([]);
            setModalVal('');
            setGoogleEnglish('');
        }
        setCovenantDetails({ ...cov, [name]: val })
    }

    const onChangeTelugu= async(e:any)=>{
        let val = e.clipboardData.getData('Text');
		if(val !== ""){
			let result:any = await GetAnuTeluguData(val);
            if(result.status){
                let cov = { ...CovenantDetails };
                setCovenantDetails({...cov, value: cov.value + result.data})
            } else {
                ShowMessagePopup(false, result.message, "");
            }
		}
	}
	const GetAnuTeluguData = async (data) => {
		let result = await CallingAxios(teleuguAnu(data))
		return result;
    }

    const covenatsTypeFinder = (key) => {
        switch (key.TRAN_MAJ_CODE) {
            case "01": return covenantType.saleMessage;
            case "02": return covenantType.mortgageMessage;
            case "03": return covenantType.giftMessage;
            default: return [];
        }
    }
    const ActionOnClick = async (type: any) => {
        if (type == "delete") {
            let covData = {
                documentId: ApplicationDetails.applicationId,
                covId: CovenantDetails._id,
                covanants: { value: CovenantDetails.value },
                type: "covanent"
            }
            let result = await CallingAxios(UseDelCovenant(covData));
            if (result.status) {
                ShowMessagePopup(true, "Covenant Deleted Successfully", "");
                setCovenantDetails({ ...CovenantDetails, id: "", value: "", _id: ""});
                GetApplicationDetails();
            }
            else {
                ShowMessagePopup(false, "Invalid", "");
            }
        } else if (type == "NotDelete") {
            if (CovenantDetails._id) {
                if (CovenantDetails.value == "") { return ShowMessagePopup(false, "Covenant can not be Empty", "") }
                let covData = {
                    documentId: ApplicationDetails.applicationId,
                    covId: CovenantDetails._id,
                    covanants: { value: CovenantDetails.value ,type: "covanent"}
                }
                let result = await CallingAxios(UseUpdateCovinant(covData));
                if (result.status) {
                    ShowMessagePopup(true, "Covenant Updated Successfully", "");
                    setCovenantDetails({ ...CovenantDetails, id: "", value: "", _id: ""});
                    GetApplicationDetails();
                }
                else {
                    ShowMessagePopup(false, "Covenant Update Failed", "");
                }
            }
            else {
                if (CovenantDetails.value != "" && CovenantDetails.value.trim()) {
                    let list = [];
                    CovenantList.map(x => {
                        list.push({ value: x.value })
                    })
                    list.push({ value: CovenantDetails.value });

                    let covData = {
                        documentId: ApplicationDetails.applicationId,
                        natureType: ApplicationDetails.registrationType.TRAN_DESC,
                        covanants: list,
                        type: "covanent"
                    }
                    let result = await CallingAxios(UseSaveCovinant(covData));
                    if (result.status) {
                        ShowMessagePopup(true, "Covenant Added Successfully", "");
                        setCovenantDetails({ ...CovenantDetails, id: "", value: "", _id: ""});
                        GetApplicationDetails();
                    }
                    else {
                        ShowMessagePopup(false, "Covenant Add Failed", "");
                    }
                } else {
                    ShowMessagePopup(false, "Please add covenant to save", "")
                }
            }
        }
    }
    useEffect(() => {
        const controller = new AbortController();
        let getData: any;
        if(googleEnglish && googleEnglish.trim()){
             getData = setTimeout(() => {
                (async () => {
                    setLoading(true);
                    let result = await googleAPI(googleEnglish, controller.signal);
                    setCovenantDetails({...CovenantDetails, value: get(result, 'data.translations.0.translatedText', '')})
                    setLoading(false);
                })()
           }, 2000)
        }
        return () => {
            controller.abort();
            clearTimeout(getData)
        }
    }, [googleEnglish])

    return (
        <div className='PageSpacing'>
            <Head>
                <title>Add Covenant - Public Data Entry</title>
            </Head>
            <Container>
                <div className='tabContainerInfo'>
                    <Container>
                        <Row>
                            <Col lg={10} md={12} xs={12}>
                                <div className='tabContainer'>
                                    <div className='activeTabButton'>Get Started<div></div></div>
                                    <div className='activeTabButton'>Parties Details<div></div></div>
                                    <div className='inactiveTabButton'>Property Details<div></div></div>
                                    <div className='inactiveTabButton slotButton'>Slot Booking<div></div></div>
                                </div>
                            </Col>
                            <Col lg={2} md={12} xs={12}>
                                <div className='text-end previewCon'><button className='PreBtn proceedButton' onClick={() => ShowPreviewPopup()} >Preview Document</button></div>
                            </Col>
                        </Row>
                    </Container>
                </div>
                <Row className='ApplicationNum mt-1'>
                    <Col lg={6} md={6} xs={12}>
                        <div className='ContainerColumn TitleColmn' onClick={() => { redirectToPage("/PartiesDetailsPage") }}>
                            <h4 className='TitleText left-title'> Covenants Details</h4>
                        </div>
                    </Col>
                    <Col lg={6} md={6} xs={12} className='text-end'>
                        <div className='ContainerColumn TitleColmn'>
                            <h4 className='TitleText' style={{ textAlign: 'right' }}>Application ID: {ApplicationDetails.applicationId}</h4>
                        </div>
                    </Col>
                </Row>
                <div className={`${styles.mainTabs}`}>
                    <div className={`${styles.innerTabContainer}, ${styles.covenantContainer}`}>
                        {CovenantStaticList.map((x, i) => {
                            return (
                                <div key={i} onClick={() => {
                                    if ((EditRistrictTill < i + 1)) {
                                        let a = /[a-zA-Z]/.test(x.value);
                                        setCovenantDetails({ ...CovenantDetails, ...x, language: a ? 'English' : 'Telugu (CDAC)' })
                                    }
                                }}>
                                    {i + 1}.
                                    <div>
                                        <textarea className={styles2.columnInputBox}
                                            style={{ height: '100px', backgroundColor: '#c7c6c6' }}
                                            placeholder='Add Covenant'
                                            value={x.value}
                                            name='value'
                                            disabled={true}
                                        />
                                    </div>
                                    {/* <TableInputLongText disabled={true} required={true} placeholder='Add Covenant' name='value' value={x.value} onChange="" /> */}
                                </div>
                            )
                        })}
                        {CovenantList.map((x, i) => {
                            return (
                                <div key={i} onClick={() => {
                                    let a = /[a-zA-Z]/.test(x.value);
                                    setCovenantDetails({ ...CovenantDetails, ...x, language: a ? 'English' : 'Telugu (CDAC)' })
                                }}>
                                    {i + CovenantStaticList.length + 1}.
                                    <div >
                                        <textarea className={styles2.columnInputBox}
                                            style={{ height: '100px', backgroundColor: '#ececec', cursor: 'pointer' }}
                                            placeholder='Add Covenant'
                                            value={x.value}
                                            name='value'
                                            disabled={false}
                                        />
                                    </div>
                                    {/* <TableInputLongText disabled={true} required={true} placeholder='Add Covenant' name='value' value={x.value} onChange="" /> */}
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className='mb-3'>
                  <TableInputRadio name="language" defaultValue={CovenantDetails.language} options={CovenantDetails._id ? languages.slice(0, 2) : languages} required={false} onChange={onChange} label="" />
                </div>
                {
                    CovenantDetails.language === 'Telugu (Google Translation)' && !CovenantDetails._id ? <form onSubmit={onSubmit}>
                        <TableInputLongText name='googleEnglish' onChange={(e) => setGoogleEnglish(e.target.value)} placeholder='Type in English' required={true} value={googleEnglish} />
                        <TableInputLongText name='value' onChange={() => {}} disabled={true} placeholder='Telugu Translation' required={false} value={CovenantDetails.value} />
                    </form> : CovenantDetails.language === 'Telugu (Anu Translation)' && !CovenantDetails._id ? <form onSubmit={onSubmit}>
                             <TableInputLongText name='anuTelugu' onPaste={onChangeTelugu} onChange={()=> {}}placeholder='Anu Telugu Conversion' required={true} value={CovenantDetails.value}/>
                    </form>  :
                        <form onSubmit={onSubmit}>
                            <div className={styles.mainTabs}>
                        <div className={`${styles.InnertabHeadContainer} ${styles.CovenantInput}`}>
                            <TableInputLongText required={true} placeholder='Add Covenant' name='value' value={CovenantDetails.value} onChange={CovenantDetails.language === 'Telugu (CDAC)' ? onChange2 : onChange} id='teluguBox'
                                onkeydown={CovenantDetails.language === 'Telugu (CDAC)' ? (e) => {
                                    const reg = /^[A-Za-z]*$/;
                                    if (e.key.length === 1 && reg.test(e.key)) {
                                        setModalVal(e.key);
                                        setTimeout(() => {
                                            let reff: any = inputModalElement.current;
                                            if (reff) {
                                                reff.focus()
                                            }
                                        }, 0)
                                    }
                                } : () => { }}
                            />
                        </div>
                            </div>
                            {
                                CovenantDetails.language === 'Telugu (CDAC)' &&
                                <div id='suggestionBox' className={styles.suggestionbox}>
                            <input type='text' onChange={onModalChange} value={modalVal} ref={inputModalElement} onKeyDown={(e) => {
                                const reg = /^[A-Za-z]*$/;
                                if ((e.key !== 'Backspace' && e.key.length !== 1) || !reg.test(e.key)) {
                                    onEnter();
                                }
                            }} />
                            {
                                suggestions.map(s => {
                                    return (
                                        <div onClick={(e) => {
                                            e.preventDefault()
                                            onEnter(s);
                                        }} key={s}>
                                            {s}
                                        </div>
                                    )
                                })
                            }
                                </div>
                            }
                </form>
                }
                <div className={`d-flex justify-content-center mb-3 ${loading ? styles2.disableDiv : ''}`}>
                    <div onClick={() => {
                        if (CovenantDetails._id) {
                            setCovenantDetails({ ...CovenantDetails, _id: '', value: '' });
                        } else {
                            router.push("/PartiesDetailsPage")
                        }
                    }} style={{ cursor: "pointer" }} className='proceedButton mx-2'>{CovenantDetails._id ? 'Back to Add Covenant' : 'Back'}</div>
                    <button className='proceedButton' onClick={() => ActionOnClick("NotDelete")}>{CovenantDetails._id ? "Update" : "Add"}</button>
                    <button className='proceedButton mx-2' onClick={() => setCovenantDetails({ ...CovenantDetails, id: "", value: "" })} type='button'>Clear</button>
                    {CovenantDetails._id ? <button className='proceedButton' onClick={() => ActionOnClick("delete")}>Delete</button> : null}
                </div>
            </Container>
            {/* <pre>{EditRistrictTill}</pre> */}
            {/* <pre>{JSON.stringify(ApplicationDetails, null, 2)}</pre> */}
            {/* <pre>{JSON.stringify(CovenantDetails, null, 2)}</pre> */}
        </div>
    )
}

export default AddCovenantPage
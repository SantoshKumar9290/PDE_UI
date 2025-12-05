import React, { useState, useEffect } from 'react'
import { Col, Container, Row } from 'react-bootstrap';
import styles from '../styles/pages/Mixins.module.scss';
import TableText from '../src/components/TableText';
import TableInputRadio2 from '../src/components/TableInputRadio2';
import TableDropdownSRO from '../src/components/TableDropdownSRO';
import TableDropdown from '../src/components/TableDropdown';
import { useRouter } from 'next/router';
import { useGetDistrictList, useGetMandalList, useGetVillagelList } from '../src/axios';
import { LoadingAction } from '../src/redux/commonSlice';
import { useAppSelector, useAppDispatch } from '../src/redux/hooks';
import { CallingAxios, ShowMessagePopup } from '../src/GenericFunctions';
import Head from 'next/head';



const RadioList = {
    LandList: [{ label: 'Non-Agriculture Rates [వ్యవసాయేతర రేట్లు]', value: 'urban [పట్టణ]' }, { label: 'Agriculture Rates [వ్యవసాయ రేట్లు]', value: 'rural [గ్రామీణ]' }]
}
const KnowmarketValuePage = () => {
    const [DistrictList, setDistrictList] = useState([]);
    const [MandalList, setMandalList] = useState([]);
    const [VillageList, setVillageList] = useState([]);
	const [distCode,setDistCode]= useState<any>("");
    const dispatch = useAppDispatch()
    const router = useRouter();
    const [MarketvalueDetails, setMarketvalueDetails] = useState({ district: "", mandal: "", village: "", landtype: "Non-Agriculture Rates [వ్యవసాయేతర రేట్లు]", villageCode: "", surveyno: "" })

    useEffect(() => {
        if (DistrictList.length == 0) {
            GetDistrictList()
        }
    }, []);

    const GetDistrictList = async () => {
        let result = await CallingAxios(useGetDistrictList());
        if (result.status) {
            setDistrictList(result.data);
        }
        else {
            ShowMessagePopup(false,"Get districts list Failed","");
        }
    }

    const GetMandalList = async (id: any) => {
        let result = await CallingAxios(useGetMandalList(id));
        if (result.status) {
            setMandalList(result.data);
        }
        else {
            ShowMessagePopup(false,"Mandals list fetch failed", "")
        }
    }
    const GetVillageList = async (id: any,distcode:any) => {
        let result = await CallingAxios(useGetVillagelList(id,distCode));
        if (result.status) {
            setVillageList(result.data);
        }
        else {
            ShowMessagePopup(false,"Villages list fetch failed", "")
        }
    }


    const redirectToPage = (location: string) => {
        router.push({
            pathname: location,
            // query: query,
        })
    }

    const onChange = (event: any) => {
        let TempDetails = { ...MarketvalueDetails };
        let addName = event.target.name;
        let addValue = event.target.value;
        if (addName == "district") {
            setMandalList([]);
            setVillageList([]);
            let selected = DistrictList.find(e => e.name == addValue);
            // console.log(selected);
			setDistCode(selected.id);
            GetMandalList(selected.id);
        }
        else if (addName == "mandal") {
            setVillageList([]);
            let selected = MandalList.find(e => e.name == addValue);
            // console.log(selected);
            GetVillageList(selected.id,distCode);
        }
        else if (addName == "village") {
            let selected = VillageList.find(e => e.name == addValue);
            TempDetails = { ...TempDetails, villageCode: selected.id }
        }
        else if (addName == "landtype") {
            // if (addValue == "Agriculture Rates [వ్యవసాయ రేట్లు]") {
            //     addValue = "rural"
            // }
            // else {
            //     addValue = "urban"
            // }
        }

        setMarketvalueDetails({ ...TempDetails, [addName]: addValue });
    }

    const onSubmit = (e: any) => {
        e.preventDefault();
        if (e) {
            if (MarketvalueDetails.district != "" && MarketvalueDetails.landtype != "" && MarketvalueDetails.mandal != "" && MarketvalueDetails.villageCode != "") {
                let data = MarketvalueDetails;
                if (data.landtype == "Agriculture Rates [వ్యవసాయ రేట్లు]") {
                    data.landtype = "rural"
                }
                else {
                    data.landtype = "urban"
                }
                localStorage.setItem("SearchMarketValue", JSON.stringify(data));
                if (MarketvalueDetails.landtype == "urban") {
                    redirectToPage('/UnitratelocalityruralPage');
                } else {
                    redirectToPage('/UnitrateValue');
                }

            }
            else {
                ShowMessagePopup(false, "Kindly Fill All The Details To Search !", "");
            }
        }

    }
    return (
        <div className='PageSpacing'>
            <Head>
                <title>Know Market Value- Public Data Entry</title>
            </Head>
            <Container>
                <Row>
                    <Col lg={12} md={12} xs={12}>
                        <div className={`${styles.ExecutantDetailsInfo} ${styles.marketValueInfo}`}>
                            <div className={styles.DetailsHeaderContainer} style={{ marginTop: '20px' }}>
                                <Row>
                                    <Col lg={6} md={6} xs={12}>
                                        <div className={styles.ContainerColumn}>
                                            <p className={styles.HeaderText}>Unit Rates [యూనిట్ ధరలు]</p>
                                        </div>
                                    </Col>
                                    <Col lg={6} md={6} xs={12}>
                                    </Col>
                                </Row>
                            </div>
                            <form onSubmit={onSubmit}>
                                <div className={`${styles.AddExecutantInfo}, ${styles.UnitRateInto}`}>
                                    <Row className="mb-4">
                                        <Col>
                                            <div className='CheckboxInfo'>
                                                <TableInputRadio2 required={true} name='landtype' defaultValue={MarketvalueDetails.landtype} onChange={onChange} options={RadioList.LandList} />
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col lg={4} md={6} xs={12}>
                                            <TableText label={"District [జిల్లా]"} required={true} LeftSpace={false} />
                                            <TableDropdownSRO required={true} options={DistrictList} name={"district"} value={MarketvalueDetails.district} onChange={onChange} />
                                        </Col>
                                        <Col lg={4} md={6} xs={12}>
                                            <TableText label={"Mandal [మండలం]"} required={true} LeftSpace={false} />
                                            <TableDropdownSRO required={true} options={MandalList} name={"mandal"} value={MarketvalueDetails.mandal} onChange={onChange} />
                                        </Col>
                                        <Col lg={4} md={6} xs={12}>
                                            <TableText label={"Village [గ్రామం]"} required={true} LeftSpace={false} />
                                            <TableDropdownSRO required={true} options={VillageList} name={"village"} value={MarketvalueDetails.village} onChange={onChange} />
                                        </Col>
                                    </Row>
                                    <div className='mt-4'>
                                        <Row>
                                            <Col lg={12} md={12} xs={12}>
                                                <div className='d-flex justify-content-center'>
                                                    {/* <p onClick={() => { redirectToPage("/PropertyDetailsPage") }} className={styles.backText}>Back</p> */}
                                                    <button className='proceedButton'>Submit</button>
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </Col>
                </Row>
            </Container>
            {/* <pre>{JSON.stringify(MarketvalueDetails, null, 2)}</pre> */}
        </div>
    )
}

export default KnowmarketValuePage;
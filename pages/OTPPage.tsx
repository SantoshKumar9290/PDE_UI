import React, { useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap';
import styles from '../styles/pages/Forms.module.scss';
import Image from 'next/image';
import TableInputText from '../src/components/TableInputText';
import { useRouter } from 'next/router';
import { useAppSelector, useAppDispatch } from '../src/redux/hooks';
import { PopupAction } from '../src/redux/commonSlice';
import { UseSignUp } from '../src/axios';
import { CallingAxios } from '../src/GenericFunctions';


const OTPPage = () => {
    const dispatch = useAppDispatch()
    const router = useRouter();
    let initialLoginDetails = useAppSelector(state => state.login.loginDetails);
    const [LoginDetails, setLoginDetails] = useState(initialLoginDetails);
    const [OTPMemory, setOTPMemory] = useState({ d1: "", d2: "", d3: "", d4: "" });


    const ShowAlert = (type, message, redirectOnSuccess) => { dispatch(PopupAction({ enable: true, type, message, redirectOnSuccess })); }
    const redirectToPage = (location: string) => {
        router.push({
            pathname: location,
        })
    }

    const onChange = (e) => {
        let addName = e.target.name;
        let addValue = e.target.value;
        if (addValue.length > 1) {
            addValue = addValue.substring(0, 1);
        }
        setOTPMemory({ ...OTPMemory, [addName]: addValue });
    }

    const onSubmit = async (e: any) => {
        e.preventDefault();
        let otp = OTPMemory.d1 + OTPMemory.d2 + OTPMemory.d3 + OTPMemory.d4;
        let login = { ...LoginDetails, otp };
        let result: any = await CallingAxios(UseSignUp(login));
        if (result && result.status) {
            router.push("/RegistrationSuccessPage");
        } else {
            ShowAlert(false, result.message, "");
        }
    }

    return (
        <div className=''>
            <div className={styles.RegistrationMain}>
                <Container>
                    <Row className='align-items-center'>
                        <Col lg={6} md={12} xs={12} className='p-0'>
                            <div className={styles.regImageInfo}>
                                <Image alt='' width={922} height={716} className={styles.image} src="/PDE/images/otp-img.png" />
                            </div>
                        </Col>
                        <Col lg={6} md={12} xs={12}>
                            <form onSubmit={onSubmit} className={`${styles.RegistrationInput} ${styles.OTPInput}`}>
                                <h2 className="p-0">Enter OTP</h2>
                                <Row>
                                    <Col lg={2} md={2} xs={3}>
                                        <TableInputText type='number' placeholder='' required={true} name='d1' value={OTPMemory.d1} onChange={onChange} />
                                    </Col>
                                    <Col lg={2} md={2} xs={3}>
                                        <TableInputText type='number' placeholder='' required={true} name='d2' value={OTPMemory.d2} onChange={onChange} />
                                    </Col>
                                    <Col lg={2} md={2} xs={3}>
                                        <TableInputText type='number' placeholder='' required={true} name='d3' value={OTPMemory.d3} onChange={onChange} />
                                    </Col>
                                    <Col lg={2} md={2} xs={3}>
                                        <TableInputText type='number' placeholder='' required={true} name='d4' value={OTPMemory.d4} onChange={onChange} />
                                    </Col>
                                    <p>OTP has been sent on mobile number and email id.</p>
                                </Row>

                                <Row>
                                    <Col lg={4} md={6} xs={6}>
                                        <div className={styles.pdesingleColumn} style={{ color: '#1C595E', cursor: 'pointer' }}>
                                            <button className={styles.btnText}>Verify OTP</button>
                                        </div>
                                    </Col>
                                    <Col lg={8} md={6} xs={6}>
                                        <div className={styles.pderightColumn}>
                                            <p className={styles.checkText}>Didn’t Receive OTP?<div style={{ color: '#1C595E' }}>Resend OTP</div></p>
                                        </div>
                                    </Col>
                                </Row>
                                <Row className="p-1">
                                    <Col lg={7} md={6} xs={6}></Col>
                                    <Col lg={5} md={6} xs={12} style={{ textAlign: "right" }}><div className={styles.BackText} onClick={() => { redirectToPage("/LoginPage") }}>Back to Login</div></Col>
                                </Row>
                            </form>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    )
}

export default OTPPage;
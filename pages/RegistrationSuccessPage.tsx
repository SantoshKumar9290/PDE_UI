import React from 'react'
import { Col, Container, Row } from 'react-bootstrap';
import styles from '../styles/pages/Forms.module.scss';
import Image from 'next/image';
import { useRouter } from 'next/router';

const RegistrationSuccessPage = () => {

    const router = useRouter();

    const redirectToPage = (location: string) => {
        router.push({
            pathname: location,
        })
    }

    return (
        <div className=''>
            <div className={styles.RegistrationMain}>
                <Container>
                    <Row className='align-items-center'>
                        <Col lg={6} md={12} xs={12} className='p-0'>
                            <div className={styles.regImageInfo}>
                                <Image alt='' width={922} height={716} className={styles.image} src="/PDE/images/success-img.png" />
                            </div>
                        </Col>
                        <Col lg={6} md={12} xs={12}>
                            <div className={` ${styles.RegistrationInput} ${styles.LoginPageInput}`}>
                                <h2>Thank You</h2>
                                <div className="p">
                                    <Image alt='' width={60} height={60} className={styles.image} src="/PDE/images/success-icon.png" />
                                </div>
                                <div className="p">
                                    <h4>Congratulations <br /><span>Your account has been successfully created.</span></h4>
                                </div>
                                <Row className="p">
                                    <Col lg={4} md={6} xs={6}>
                                        <div className={styles.pdesingleColumn} onClick={() => { redirectToPage("/LoginPage") }} style={{ cursor: 'pointer' }}>
                                            <button className={styles.btnText}>Login</button>
                                        </div>
                                    </Col>
                                    <Col lg={8} md={6} xs={6}></Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    )
}

export default RegistrationSuccessPage
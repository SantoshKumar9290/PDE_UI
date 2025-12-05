import React from 'react'
import { Container, Row, Col } from 'react-bootstrap';
import styles from '../styles/pages/Mixins.module.scss';
import { useRouter } from 'next/router';

const MianPage = () => {
    const router = useRouter();
    return (
        <div className='PageSpacing'>
            <Container>
                <Row>
                    <Col lg={12} md={12} xs={12}>
                        <div className={styles.MainpageInfo}>
                            <div>
                                <h2 onClick={() => router.push("/PartiesDetailsPage")}>Public Data Entry (PDE) / పబ్లిక్ డేటా నమోదు (PDE)</h2>
                            </div>
                            <div className={`${styles.divider} ${styles.dividerLine}`}></div>
                            <div>
                                <h2 onClick={() => router.push("/PartiesDetailsPage")}>PDE With Document Generation / డాక్యుమెంట్ జనరేషన్‌తో పిడిఇ</h2>
                            </div>

                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default MianPage
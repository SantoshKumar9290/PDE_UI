import React from 'react';
import Image from "next/image";
import styles from '../../styles/components/Footer.module.scss';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer>
      <div className={`${styles.Footermain} ${styles.mainFooterCon}`}>
        <Container fluid>
          <Row className={styles.footerContainer}>
            <Col lg={12} md={12} xs={12}>
              <p className={styles.footerText}>Copyright © All rights reserved with Registration & Stamps Department, Government of Andhra Pradesh.</p>
            </Col>
            {/* <Col lg={4} md={12} xs={12} className='text-end'>
              <p className={styles.footerText}>Email: igrs_support@criticalriver.com</p>
            </Col> */}
          </Row>
        </Container>
      </div>
    </footer>
  )
}

export default Footer
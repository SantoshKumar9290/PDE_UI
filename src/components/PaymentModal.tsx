import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { useEffect } from "react";
import { getPaymentAmount, setPaymentOP } from "../redux/paymentSlice";
import styles from "../../styles/components/Payment.module.scss";
import Image from "next/image";
import ApplicationList from "../../pages/ApplicationListPage";

const PaymentModal = (props: any) => {
    const paymentOp = useAppSelector(state => state.payment.paymentOp);
    const getPaymentData = useAppSelector(state => state.payment.getPaymentData);
    const getPaymentLoading = useAppSelector(state => state.payment.getPaymentLoading);
    const getPaymentMsg = useAppSelector(state => state.payment.getPaymentMsg);
    const LoginDetails = useAppSelector((state) => state.login.loginDetails);

    const dispatch = useAppDispatch();

    useEffect(() => {
        if (paymentOp.showModal) {
            dispatch(getPaymentAmount({ ...paymentOp.reqBody }))
        }
    }, [paymentOp.showModal])

    const onClose = () => {
        dispatch(setPaymentOP({ 'showModal': false, reqBody: {}, applicationDetails: {}, callBack: null }));
    }

    const sdCalculator = () => {
        let value: any = 0;
        value = getPaymentData.sd_p ? parseInt(getPaymentData.sd_p) - (parseInt(paymentOp.applicationDetails.stampPaperValue)) : 0
        // console.log(getPaymentData.sd_p);
        // console.log(paymentOp.applicationDetails.stampPaperValue);
        value = value>0?value:0;
        return value;
    }
    const buttonClick = () => {
        let paymentRedirectUrl = process.env.PAYMENT_URL + "/igrsPayment" + "?paymentData=";
        let paymentLink = document.createElement("a");

        let PaymentJSON = {
            "source": "PDE",
            "type": "ffrd",
            "deptId": paymentOp.applicationDetails.applicationId,
            "rmName": LoginDetails.loginName,
            "sroNumber": paymentOp.applicationDetails.sroNumber,
            "rf": getPaymentData.rf_p ? getPaymentData.rf_p : 0,
            "uc": 500,
            // "sd": (getPaymentData.sd_p ? parseInt(getPaymentData.sd_p) - parseInt(paymentOp.applicationDetails.stampPaperValue) : 0) + (getPaymentData.td_p ? getPaymentData.td_p : 0)
            "sd": (getPaymentData.sd_p ? Number(getPaymentData.sd_p) : 0) + (getPaymentData.td_p ? Number(getPaymentData.td_p) + (getPaymentData.rf_p ? Number(getPaymentData.rf_p) : 0) + 500 - parseInt(paymentOp.applicationDetails.stampPaperValue) : 0)
        }

        let encodedData = Buffer.from(JSON.stringify(PaymentJSON), 'utf8').toString('base64')
        paymentLink.href = paymentRedirectUrl + encodedData;
        paymentLink.target = "_blank";
        document.body.appendChild(paymentLink);
        paymentLink.click();
        document.body.removeChild(paymentLink);
        if (paymentOp.callBack) {
            paymentOp.callBack();
        }
        onClose();
    }

    const TotalCalculator = () => {
        let result = (getPaymentData.sd_p ? Number(getPaymentData.sd_p) : 0) + (getPaymentData.td_p ? Number(getPaymentData.td_p) : 0) + (getPaymentData.rf_p ? Number(getPaymentData.rf_p) : 0) + 500 - parseInt(paymentOp.applicationDetails.stampPaperValue)
        return result != null && result != undefined && result>0 ? result : 0;
    }
    return (
        <>
            {
                paymentOp.showModal && (
                    <div className={styles.container}>
                        <div className={styles.content}>
                            <div className={styles.header}>
                                <div></div>
                                <span>PAYMENT</span>
                                <div className={styles.crossButton} onClick={onClose}>
                                    <Image src="/PDE/images/close.svg" height={20} width={20} />
                                </div>
                            </div>
                            {
                                getPaymentLoading ?
                                    <div className={styles.loader}>
                                        <Image alt='' width={50} height={50} src="/PDE/images/Loader.svg" />
                                    </div>
                                    :
                                    <>
                                        <div className={styles.bodyContent}>
                                            {getPaymentMsg ? <p>{getPaymentMsg}</p>
                                                :
                                                <>
                                                    <div className={styles.flexBox} key={"stamp_duty"}>
                                                        <div className={styles.feeName}>
                                                            Stamp Duty(₹)
                                                        </div>
                                                        <div className={styles.feeValue}>
                                                            : {sdCalculator()}
                                                            {/* {getPaymentData.sd_p ? parseInt(getPaymentData.sd_p) - (parseInt(paymentOp.applicationDetails.stampPaperValue) * parseInt(paymentOp.applicationDetails.noOfStampPapers)) : 0} */}

                                                            {/* : {(getPaymentData.sd_p ? getPaymentData.sd_p : 0) + (getPaymentData.td_p ? getPaymentData.td_p : 0)} */}
                                                        </div>
                                                    </div>
                                                    <div className={styles.flexBox} key={"stamp_duty"}>
                                                        <div className={styles.feeName}>
                                                            Transfer Duty(₹)
                                                        </div>
                                                        <div className={styles.feeValue}>
                                                            : {getPaymentData.td_p ? getPaymentData.td_p : 0}
                                                            {/* : {(getPaymentData.sd_p ? getPaymentData.sd_p : 0) + (getPaymentData.td_p ? getPaymentData.td_p : 0)} */}
                                                        </div>
                                                    </div>
                                                    <div className={styles.flexBox} key={"Registration_Fee"}>
                                                        <div className={styles.feeName}>
                                                            Registration Fee(₹)
                                                        </div>
                                                        <div className={styles.feeValue}>
                                                            : {getPaymentData.rf_p ? getPaymentData.rf_p : 0}
                                                        </div>
                                                    </div>
                                                    <div className={styles.flexBox} key={"marketValue"}>
                                                        <div className={styles.feeName}>
                                                            Market Value(₹)
                                                        </div>
                                                        <div className={styles.feeValue}>
                                                            : {paymentOp.reqBody.marketValue ? paymentOp.reqBody.marketValue : 0}
                                                        </div>
                                                    </div>
                                                    <div className={styles.flexBox} key={"con_value"}>
                                                        <div className={styles.feeName}>
                                                            Consideration  Value(₹)
                                                        </div>
                                                        <div className={styles.feeValue}>
                                                            : {paymentOp.reqBody.con_value}
                                                        </div>
                                                    </div>
                                                    <div className={styles.flexBox} key={"finalTaxbleValue"}>
                                                        <div className={styles.feeName}>
                                                            Final Taxable Value(₹)
                                                        </div>
                                                        <div className={styles.feeValue}>
                                                            : {paymentOp.reqBody.finalTaxbleValue}
                                                        </div>
                                                    </div>
                                                    <div className={styles.flexBox} key={"finalTaxbleValue"}>
                                                        <div className={styles.feeName}>
                                                            User Charges(₹)
                                                        </div>
                                                        <div className={styles.feeValue}>
                                                            : {paymentOp.reqBody.uc ? paymentOp.reqBody.uc : 500}
                                                        </div>
                                                    </div>
                                                    <div className={styles.flexBox} key={"finalTaxbleValue"}>
                                                        <div className={styles.feeName}>
                                                            Total Payable(₹)
                                                        </div>
                                                        <div className={styles.feeValue}>
                                                            {TotalCalculator()}
                                                            {/* {(Number(getPaymentData.sd_p + getPaymentData.td_p + getPaymentData.rf_p - parseInt(paymentOp.applicationDetails.stampPaperValue))} */}
                                                        </div>
                                                    </div>
                                                </>
                                            }
                                        </div>
                                        <div className={styles.footer}>
                                            <button className={styles.button}
                                                //disabled={!!getPaymentMsg || !(getPaymentData.final_taxable_value ? getPaymentData.final_taxable_value : 0)}
                                                onClick={() => buttonClick()}
                                            ><Image src="/PDE/images/arrow-right.svg" height={16} width={16} /> Redirect to Payment Gateway</button>
                                        </div>
                                    </>
                            }
                        </div>
                    </div>
                )
            }
        </>
    )
}

export default PaymentModal
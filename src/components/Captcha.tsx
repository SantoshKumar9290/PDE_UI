import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setCaptcha } from "../redux/commonSlice";
import { ALPHANUMERIC, randomString } from "../utils";
import styles from '../../styles/components/Captcha.module.scss';

const Captcha = () => {
    const captchaStr = useAppSelector(state => state.common.captchaStr);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(setCaptcha(randomString(6, ALPHANUMERIC)));
    }, [])

    return (
        <div className={styles.box}>
            <label className={styles.disableSelect}>{captchaStr}</label>
            <img src="/PDE/images/refresh.png" onClick={() => {
                dispatch(setCaptcha(randomString(6, ALPHANUMERIC)));
            }}/>
        </div>
    )
}

export default Captcha;
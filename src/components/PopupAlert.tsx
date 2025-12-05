import React, { useEffect } from 'react'
import styles from '../../styles/components/PopupAlert.module.scss';
import { ImCross } from 'react-icons/im';
import { MdOutlineDoneOutline } from 'react-icons/md';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { LoadingAction, PopupAction } from '../redux/commonSlice';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { Loading } from '../GenericFunctions';

const PopupAlert = () => {
    const router = useRouter();
    const PopupMemory = useAppSelector((state) => state.common.PopupMemory);
    const dispatch = useAppDispatch();
    const autoHide = PopupMemory.hasOwnProperty('autoHide') ? PopupMemory.autoHide : true;
    const hideCancelButton = PopupMemory.hasOwnProperty('hideCancelButton') ? PopupMemory.hideCancelButton : true;

    const OnCancelAction = () => {
        if (PopupMemory.redirectOnSuccess && PopupMemory.redirectOnSuccess != "") {
            router.push(PopupMemory.redirectOnSuccess);
        }
        // dispatch(LoadingAction({...Loading,enable:false}));
        Loading(false);
        dispatch(PopupAction({ ...PopupMemory, enable: false, redirectOnSuccess: "", message: "" }))
    }

    useEffect(() => {
        if (PopupMemory.enable && autoHide) {
            setTimeout(() => {
                if (PopupMemory.redirectOnSuccess && PopupMemory.redirectOnSuccess != "") {
                    if (PopupMemory.redirectOnSuccess == '/') {
                        localStorage.clear();
                        setTimeout(() => {
                            router.push("/");
                        }, 0)
                    } else {
                        router.push(PopupMemory.redirectOnSuccess);
                    }
                }
                Loading(false);
                dispatch(PopupAction({ ...PopupMemory, enable: false, redirectOnSuccess: "", message: "" }))
            }, PopupMemory.time ? PopupMemory.time : 3000);
        }
    }, [PopupMemory.enable])

    return (
        <div>
            {PopupMemory.enable &&
                <div className={styles.container}>
                    <div className={styles.Messagebox}>
                        <div className={styles.header}>
                            <div className={styles.letHeader} >
                                <p className={styles.text}>Message</p>
                            </div>
                            {!hideCancelButton && (
                                <div>
                                    <ImCross
                                        onClick={OnCancelAction}
                                        className={styles.closeButton}
                                        title="Close"
                                    />
                                </div>    
                            )}
                        </div>
                        <div style={{ paddingLeft: '1rem', paddingRight: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }} className={styles.popupBox}>
                            {PopupMemory.type === true && 
                                <div className={styles.SuccessImg}>
                                    <Image alt='' width={60} height={60} className={styles.sImage} src="/PDE/images/success-icon.png" />
                                </div>
                            }
                            {PopupMemory.type === false &&
                                <ImCross className={styles.crossIcon} />
                            }
                            {PopupMemory.type === "info" && (
                                <div className={styles.SuccessImg}>
                                    <Image
                                    alt=""
                                    width={60}
                                    height={60}
                                    className={styles.sImage}
                                    src="/PDE/images/Info.svg"
                                    />
                                </div>
                            )}
                            <p className={styles.message}>{PopupMemory.message}</p>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default PopupAlert
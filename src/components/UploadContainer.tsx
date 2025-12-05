import React, { useState } from 'react'
import styles from '../../styles/components/UploadDoc.module.scss';
import { MdDownloadDone } from 'react-icons/md';

interface PropsTypes {
    textValue: string;
    required: boolean;
    onChangeText: any;
    onChangeFile: any;
    isUploadDone?: string;
    accept?: string;
    onCancelUpload: any;
    uploadKey: string;
    showOnlyImage?: boolean
    textName: string
}

const UploadContainer = ({ textValue, required, textName, onChangeText, onChangeFile, onCancelUpload, uploadKey, isUploadDone = '', accept = "", showOnlyImage = false }: PropsTypes) => {



    return (
        <div className={styles.container}>

            <div className={styles.leftBox}>
                <input className={styles.columnInputBox}
                    name={textName}
                    type='text'
                    disabled={isUploadDone == "true" ? true : false}
                    placeholder="Document Name"
                    required={required}
                    value={textValue}
                    onChange={onChangeText}
                    maxLength={40}
                />
            </div>
            <div className={styles.rightBox}>
                {
                    isUploadDone == "process" || isUploadDone == "PROCESS" || isUploadDone == "false" || isUploadDone == "FALSE" || isUploadDone == "" ?
                      
                        <div style={{ width: '400px' }}>
                            <input className={styles.uploadInputBox}
                                type='file'
                                disabled ={textValue?false:true}
                                required={required}
                                onChange={onChangeFile}
                                accept={accept ? accept : showOnlyImage ? 'image/png, image/jpeg, image/jpg' : 'image/png, image/jpeg, image/jpg, application/pdf, .doc, .docx,'}
                            />
                            <div className={styles.confirmUpload} style={{ backgroundColor: (isUploadDone == 'false' || isUploadDone == "FALSE") ? 'red' : (isUploadDone == 'process' || isUploadDone == "PROCESS") ? 'yellow' : 'transperent', width: '100%' }}></div>
                        </div>
                        :
                        (isUploadDone == 'true' || isUploadDone == 'TRUE') &&
                        <div style={{ display: 'flex', alignItems: 'center', borderColor: 'black', borderWidth: '1px', borderRadius: '20px', backgroundColor: '#dddddd', width: '350px', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', marginLeft: '1rem' }}>
                                <MdDownloadDone style={{ height: '40px', width: '40px', color: 'green', marginLeft: '2px' }} />
                                <div className={styles.checkBoxText} style={{ fontWeight: 600, fontSize: '14px', marginRight: '5px' }}>Document Uploaded</div>
                            </div>
                            <div onClick={() => onCancelUpload(uploadKey)} style={{ cursor: 'pointer', marginRight: '1rem' }}>X</div>
                        </div>
                }
            </div>
        </div>

    )
}

export default UploadContainer;
import React from 'react';
import styles from '../../styles/components/Table.module.scss';

interface PropsTypes {
    type: string,
    placeholder: string;
    required: boolean;
    value: string;
    onChange: any;
    name: string;
    onBlur?: any;
    top: string;
    right: string;
    onKeyDown?: any;
    toUpperCase?: boolean;
    maxLength?:number;
}



const TableInputPassword = ({ type, placeholder, required = false, value, name, onChange,maxLength=null, onBlur, top = '0px', right = '0px', onKeyDown, toUpperCase= false }: PropsTypes) => {
    return (
        <div className={styles.container}>
            <input className={styles.columnInputBox}
                name={name}
                type={type}
                placeholder={placeholder}
                required={required}
                value={value}
                onChange={onChange}
                onWheel={event => event.currentTarget.blur()}
                onBlur={onBlur ? onBlur : () => { }}
                onKeyDown={onKeyDown ? onKeyDown : () => { }}
                style={{ textTransform: toUpperCase ? 'uppercase' : 'none' }}
                maxLength={maxLength}
            />
            {/* <div className={styles.icon} style={{ top: top, right: right }}>
                {children}
            </div> */}
        </div>
    )
}

export default TableInputPassword
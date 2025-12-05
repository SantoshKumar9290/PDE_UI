import React from 'react';
import styles from '../../styles/components/Table.module.scss';


interface PropsTypes {
  label: string;
  required: boolean;
  options: any;
  name: string;
  onChange: any;
  defaultValue?: any;
  style?:any;
}


const TableInputRadio = ({ label, options = [], defaultValue, name, onChange,style={} }: PropsTypes) => {
 
  return (
    <div className={styles.CheckboxInfo} style={style}>
    {/* <span className={styles.columnText}>{label}</span> */}
    <div>
      {options.map((singleOption: any,index:any) => {
        return (
          <label key={index}>
            <input
              className={styles.TableRadioButton}
              type="radio"
              value={singleOption.label}
              checked = {singleOption.label == defaultValue?true:false}
              name={name}
              onChange={onChange}
              required={true}
            />
            {/* <span>{singleOption.label}</span> */}
            <span className={styles.TableRadioLabel}>{singleOption.label}</span>
          </label>
        )
      })}
    </div>
  </div>
  );
}

export default TableInputRadio
import React from 'react';
import styles from '../../styles/components/Table.module.scss';


interface PropsTypes {
  required: boolean;
  options: any;
  name: string;
  onChange: any;
  defaultValue?: any;
  disabled?:boolean;
}


const TableInputRadio2 = ({ options = [], defaultValue, name, onChange, disabled=false }: PropsTypes) => {

  return (
    <div>
      <div>

        {options.map((singleOption: any, index: any) => {
          return (
            <label key={index}>
              <input
                className={styles.TableRadioButton}
                type="radio"
                value={singleOption.label}
                checked={singleOption.label == defaultValue ? true : false}
                name={name}
                onChange={onChange}
                required={true}
                disabled = {disabled}
              />
              {/* <p>{singleOption.label}</p> */}
              {name == "Presenter" ? null :
                <p className={styles.TableRadioLabel}>{singleOption.label}</p>
              }
            </label>
          )
        })}
      </div>
    </div>
  );
}

export default TableInputRadio2
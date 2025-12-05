import styles from '../../styles/components/Table.module.scss';
import moment from 'moment';
import Image from "next/image";


interface PropsTypes {
  placeholder: string;
  required: boolean;
  value?: string;
  onChange: any;
  name: string;
  max?:any;
  min?:any;
  disabled?:boolean;
  onBlur?: any;
}

const TableSelectDate = ({ placeholder, required = false,name, value, onChange,onBlur, max, min,disabled = false}: PropsTypes) => {

  return (
    <div className={styles.InputDate}>
    <input
      required = {required} 
      id="datePicker"
      type="date" 
      className={styles.columnDateInputBox}  
      pattern="\d{4}-\d{2}-\d{2}"
      data-language='en' 
      placeholder={placeholder}
      name = {name}
      value={value}
      onKeyDown={(e) => e.preventDefault()}
      onChange={onChange}
      onBlur={onBlur} 
      max = {max}
      min = {min}
      disabled= {disabled}
      tabIndex={-1}
      />
      {/* <Image height={14} width={14} src='/PDE/images/calender.svg' /> */}
  </div>
  );
}

export default TableSelectDate;

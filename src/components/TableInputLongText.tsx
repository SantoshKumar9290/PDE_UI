import styles from '../../styles/components/Table.module.scss';

interface PropsTypes {
  placeholder: string;
  required: boolean;
  value: string;
  onChange: any;
  name: string,
  disabled?:boolean;
  maxLength?: number;
  onkeydown?: any,
  id?: string,
  onPaste?:any
}

const TableInputLongText = ({ name, placeholder, required = false, value, onChange, maxLength= null,disabled=false, onkeydown=()=>{}, id='',onPaste=() => {}  }: PropsTypes) => {

  return (
    <div >
      <textarea rows={5} cols={3} className={styles.columnInputBox}
        style={{ height:'100px' }}
        placeholder={placeholder}
        required={required}
        value={value}
        name={name}
        onChange={onChange}
        disabled={disabled}
        maxLength={maxLength}
		onKeyDown={onkeydown}
		id={id}
    onPaste={onPaste}
      />
    </div>
  );
}

export default TableInputLongText;

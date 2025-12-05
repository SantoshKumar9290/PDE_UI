import styles from '../../styles/components/Table.module.scss';
import { useAppSelector, useAppDispatch } from '../../src/redux/hooks';




interface PropsTypes {
  type: string,
  placeholder: string;
  required: boolean;
  value: string;
  onChange?: any;
  name: string;
  disabled?: boolean;
  onMouseOut?: any;
  onBlurCapture?: any;
  min?: any;
  max?: any;
  dot?: boolean;
  capital?: boolean;
  splChar?: boolean;
  otpChar?: boolean;
  emailChar?: boolean;
  tabIndex?: number;
  maxLength?: number;
  allowNeg?: boolean;
  useDot?:boolean,
  onPaste?:any,
}


const TableInputText = ({ type, placeholder, required = false, value, name, onChange=()=>{}, onBlurCapture, disabled = false, onMouseOut,min,max,dot=true,capital=false,allowNeg=false, maxLength=null, splChar=true,otpChar=true,emailChar=true, tabIndex=null, useDot=false, onPaste }: PropsTypes) => {
  let Browser = useAppSelector((state) => state.common.Browser);
  const blockInvalidChar = e => { 
    if(!otpChar){
      ['/', '_', '+', '-', '=', '.', ',',']','[', "'",';','<', '>',':','{', '}','?','"','!','#', '$', '%', '^','&','*', '(',')','@'].includes(e.key) && e.preventDefault();
    }
    if (!emailChar) {
      ['/', '=', ',', ']', '[', "'", ';', ':', '<', '>', '{', '}', '?', '"', '!', '#', '$', '%', '^', '&', '*', '(', ')'].includes(e.key) && e.preventDefault();
    }
    if (!splChar) {
      ['/', '_', '+', '-'].includes(e.key) && e.preventDefault();
    }
    if (type == "number") {
      if (!dot && e.key !== 'Backspace') {
        const regex = /[0-9/-]/;
        if (!regex.test(e.key)) { e.preventDefault() }
      }
      if (!allowNeg) {
        ['-'].includes(e.key) && e.preventDefault();
      }
      (['e', 'E', '+'].filter(h => !useDot || (useDot && h !== '.')).includes(e.key) || e.which === 38 || e.which === 40) && e.preventDefault();
      if (maxLength && String(e.target.value).length >= maxLength && e.key != 'Backspace') { e.preventDefault(); }
      if (dot == false) {
        ['.'].includes(e.key) && e.preventDefault();
      }
    } else if (name === 'transactionNo' || name === 'utrNumber' || name === 'doorNo' || name === 'plotNo' || name === 'survayNo' || name === 'layoutNo' || name === 'flatNo' ) {
      const regex = /[A-Za-z0-9/-]|,/;
      if (!regex.test(e.key)) { e.preventDefault() }
    } else if (name === 'pan' || name === 'tan') {
      const regex = /[A-Za-z0-9]/;
      if (!regex.test(e.key)) { e.preventDefault() }
    } else if (name === 'rateOfInterest' || name === 'interestOfPenalty') {
      const regex = /[A-Za-z0-9]|./;
      if (!regex.test(e.key)) { e.preventDefault() }
    }
  }

  return (
    <div >
      <input className={styles.columnInputBox}
        tabIndex={tabIndex}
        style={{ textTransform: capital ? 'uppercase' : null }}
        name={name}
        type={type}
        disabled={disabled}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={onChange}
        onKeyDown={blockInvalidChar}
        onBlurCapture={onBlurCapture}
        onWheel={event => event.currentTarget.blur()}
        onBlur={onMouseOut ? onMouseOut : () => { }}
        min={min}
        max={max}
        maxLength={maxLength}
        autoComplete={Browser.IsEdge ? "new-password" : "off"}
        onPaste={onPaste}
        // autoComplete="new-password"
        // autoComplete='off'
        // autoComplete='new-off'
      />
    </div>
  );
}

export default TableInputText;

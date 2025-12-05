import { Form } from 'react-bootstrap';
import styles from '../../styles/components/Tabledata.module.scss';
import React, { useEffect, useState } from "react";

interface PropsTypes {
  type: string,
  required?: boolean;
  value: string;
  onChange: any;
  name: string;
  disabled?: boolean;
  label: string;
  errorMessage: string;
  splChar?: boolean;
  dot?: boolean;
  emailSplChar?: boolean;
  maxLength?: number;
  allowNeg?: boolean;
  allowFSlash?: boolean;
  onBlurCapture?: any
  txtNum?: boolean;
  min?:any;
  autoComplete?: boolean,
  removeRoundBoundary?: boolean,
  onPaste?:any,
}
const TableInput = ({ type, txtNum = true, disabled = false, onBlurCapture, required = false, value,min, name, onChange, label, errorMessage, splChar = true, dot = true,
  emailSplChar = false, maxLength, allowNeg = false, allowFSlash = true, removeRoundBoundary=false,autoComplete = true, onPaste }: PropsTypes) => {
  const [AutoErrorHandler, setAutoErrorHandler] = useState("")
  useEffect(() => {if (required == false){setAutoErrorHandler("");}}, [required])
  
  const blockInvalidChar = e => {
    if (type === "text") {
      if (!splChar) { ['/', '=', ',', ']', '[', "'", ';', ':', '<', '>', '{', '}', '?', '"', '!', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+'].includes(e.key) && e.preventDefault(); }
      if (dot == false) { ['.'].includes(e.key) && e.preventDefault(); }
      if (txtNum == false) { ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].includes(e.key) && e.preventDefault(); }
    }
    else if (type === "email") {
      if (!emailSplChar) { ['/', '=', ',', ']', '[', "'", ';', ':', '<', '>', '{', '}', '?', '"', '!', '#', '$', '%', '^', '&', '*', '(', ')'].includes(e.key) && e.preventDefault(); }
    }
    else if (type === "number") {
      if (!splChar) { ['=', ',', ']', '[', "'", 'e','E', ';', ':', '<', '>', '{', '}', '?', '"', '!', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+'].includes(e.key) && e.preventDefault(); }
      // if (e.key !== 'Backspace') {
      //   const regex = /[0-9/-]/;
      //   if (!regex.test(e.key)) { e.preventDefault() }
      // }
      if (allowFSlash==false) {
        ['/'].includes(e.key) && e.preventDefault();
      }
      if (!allowNeg) {
        ['-'].includes(e.key) && e.preventDefault();
      }
      if (maxLength && String(e.target.value).length >= maxLength && e.key != 'Backspace') { e.preventDefault(); }
      if (dot == false) { ['.'].includes(e.key) && e.preventDefault(); }
    }
  }
  const MyOnChange = (e)=>{
    if (required == true && e.target.value == "") {setAutoErrorHandler((label?label:"This Field")+" is Required");}
    else{setAutoErrorHandler("");}
    onChange(e);
  }
  return (
    <div>
      <Form.Floating>
        <Form.Control
          className={`${styles.columnInputBox} ${ removeRoundBoundary ? styles.removeBoundary : '' }`}
          // style={{ textTransform: (type != 'email' && type != 'password') ? 'uppercase' : 'none' }}
          name={name}
          type={type}
          disabled={disabled}
          placeholder={label}
          required={required}
          value={value}
          min={min}
          onChange={MyOnChange}
          onBlurCapture={onBlurCapture}
          onKeyDown={blockInvalidChar}
          onWheel={event => event.currentTarget.blur()}
          maxLength={maxLength}
          autoComplete={autoComplete?'on':'off'}
          onPaste={onPaste}
        />
        {label == ""? null :
        <label htmlFor="floatingInputCustom">
          {label} {required && <span style={{color:'red'}}>*</span>}
        </label>}
      </Form.Floating>
      <Form.Text className="text-danger">{errorMessage != "" ? errorMessage : AutoErrorHandler}</Form.Text>
    </div>
  );
}
export default TableInput;

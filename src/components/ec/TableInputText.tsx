import styles from "../../../styles/components/Table.module.scss";

interface PropsTypes {
  type: string;
  placeholder: string;
  required: boolean;
  value?: string;
  defaultValue?: string;
  onChange: any;
  name: string;
  disabled?: boolean;
  maxLength?: number;
  isNagative?:boolean;
  max?:string;
  min?:string;
}

const TableInputText = ({
  type,
  disabled = false,
  placeholder,
  required = false,
  value,
  defaultValue,
  name,
  onChange,
  maxLength,
  isNagative,
  max,
  min,
}: PropsTypes) => {
  const blockInvalidChar = (e: any) => {
    if (type == "number" && isNagative) {
      ["e", "E", "+", "."].includes(e.key) && e.preventDefault();
    }else if (type == "number") {
      ["e", "E", "+", "-", "."].includes(e.key) && e.preventDefault();
    }
  };

  return (
    <input
      onDrag={(e)=>{
        e.preventDefault()
        return false;
      }}
      onDrop={(e)=>{
        e.preventDefault()
        return false;
      }}
      className={styles.columnInputBox}
      name={name}
      type={type}
      disabled={disabled}
      placeholder={placeholder}
      required={required}
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
      onKeyDown={blockInvalidChar}
      onWheel={(event) => event.currentTarget.blur()}
      maxLength={maxLength}
      max={max}
      min={min}
    />
  );
};

export default TableInputText;

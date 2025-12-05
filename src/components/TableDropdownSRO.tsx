import styles from '../../styles/components/Table.module.scss';

interface PropsTypes {
  required: boolean;
  onChange: any;
  options: any;
  name: string;
  value?: string;
  disabled?:boolean;
}


const TableDropdownSRO = ({ required = false, disabled = false, onChange, options = [], name, value=""}: PropsTypes) => {

  return (
    <div>
      <select className={styles.columnDropDownBox} disabled={disabled} name={name} value={value}  onChange={onChange} required={required} style={{fontFamily:'Montserrat'}}>
      <option style={{width:'300px', fontFamily:'Montserrat'}} key='' value='' >SELECT . . .</option>
       {
        options.map((singleOption: any, index: any) => {
          return (
            <option key={index} value={singleOption.name} >{singleOption.name}</option>
          )
        })
        }
      </select>
    </div>
  );
}

export default TableDropdownSRO;


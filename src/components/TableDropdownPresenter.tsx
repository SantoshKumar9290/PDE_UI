import styles from '../../styles/components/Table.module.scss';

interface PropsTypes {
  required: boolean;
  onChange: any;
  options: any;
  name: string;
  value?: string;
}


const TableDropdownPresenter = ({ required = false, onChange, options = [], name, value=""}: PropsTypes) => {

  return (
    <div>
      <select className={styles.columnDropDownBox} name={name} value={value} onChange={onChange} required={required} style={{fontFamily:'Montserrat'}}>
      <option style={{width:'300px'}} key='' value='' >SELECT . . .</option>
       {
        options.map((singleOption: any, index: any) => {
          return (
            <option key={index} value={singleOption.id} >{singleOption.name}</option>
          )
        })
        }
      </select>
    </div>
  );
}

export default TableDropdownPresenter;


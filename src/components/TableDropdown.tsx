import styles from '../../styles/components/Table.module.scss';

interface PropsTypes {
  required: boolean;
  onChange: any;
  options: any;
  name: string;
  value?: string;
  multi?: boolean;
}

const TableDropdown = ({ required = false, onChange, options = [], name, value="", multi = false }: PropsTypes) => {

  return (
    <div>
      <select className={styles.columnDropDownBox} name={name} value={value} onChange={onChange} required={required} style={{fontFamily:'Montserrat'}}>
      <option disabled selected style={{width:'300px'}} key='' value='' >SELECT . . .</option>
       {
		multi ? 
		options.map((singleOption: any, index: any) => {
			return (
			  <option key={index} value={singleOption.code} >{singleOption.type}</option>
			)
		  })
		:
        options.map((singleOption: any, index: any) => {
          return (
            <option key={index} value={singleOption} >{singleOption}</option>
          )
        })
        }
      </select>
    </div>
  );
}

export default TableDropdown;


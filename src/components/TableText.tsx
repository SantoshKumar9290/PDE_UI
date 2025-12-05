import styles from '../../styles/components/Table.module.scss';

interface PropsTypes {
  label: string;
  required: boolean;
  LeftSpace: boolean;
}

const TableText = ({label,required=false,LeftSpace=false}:PropsTypes) => {
    
    return (
      <div >
        <p className={styles.columnText}>{label}{required && <span style={{color:'red', marginLeft:'5px'}}>*</span>}</p>
      </div>
    );
  }

  export default TableText;

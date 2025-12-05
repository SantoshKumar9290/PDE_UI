import styles from '../../styles/components/CheckBox.module.scss';
interface PropsTypes {
    checked: boolean,
    onChange?: any,
    disabled?:boolean,
    label?: string,
    name: string
}

const CheckBox = ({checked, onChange=()=>{}, disabled=false, label, name}: PropsTypes) => {
    return (
        <div className={styles.checkBox}>
            <input type='checkbox' checked={checked} onChange={onChange} disabled={disabled} name={name}/>
            <label>{label}</label>
        </div>
    )
}

export default CheckBox;
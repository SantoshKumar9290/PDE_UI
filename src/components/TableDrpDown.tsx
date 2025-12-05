import { Form } from 'react-bootstrap';
import styles from '../../styles/components/Tabledata.module.scss';
import TableInput from './TableInput';
interface PropsTypes {
    required: boolean;
    onChange: any;
    options: any;
    name: string;
    value: string;
    keyName: string;
    disabled?: boolean;
    label: string;
    errorMessage: string;
    keyValue: string;
    onBlurCapture?:any;
    removeRoundBoundary?: boolean
}
const TableDrpDown = ({ required = false,onBlurCapture, onChange, options = [], keyName, keyValue, name, value = "", disabled = false, label, errorMessage, removeRoundBoundary=false}: PropsTypes) => {
    let style2 = {backgroundColor:'red'}
    const FindValue = (value: any, keyType: string) => {
        if (options) {
            let data = options?.find(x => x[keyValue] === value);
            if (data) {
                if (keyType == "value") {return data[keyValue]}
                else {
                    return data[keyName]
                }
            } else {
                return value
            }
        }

    }
    return (
        <div>
            <Form.Floating>
                {!disabled ?
                    <Form.Select className={`${styles.columnDropDownBox} ${ removeRoundBoundary ? styles.removeBoundary : '' }`} name={name} value={value} onBlurCapture={onBlurCapture} onChange={onChange} required={required}>
                        <option  selected key='' value=''>SELECT . . .</option>
                        {options.map((singleOption: any, index: any) => {
                            return (
                                keyName==''&&keyValue==''?
                                <option key={index} value={singleOption}>{singleOption}</option>
                                :
                                <option key={index} value={singleOption[keyValue]}>{singleOption[keyName]}</option>
                            );
                        })}
                    </Form.Select>
                    :
                    <TableInput required={false} type='text' disabled={true} name={name} value={FindValue(value, "name")} onChange={undefined} label={label} errorMessage={errorMessage} />
                }
                {label == "" ? null :<Form.Label for="my-dropdown">
                    {label} {required && <span style={{color:'red'}}>*</span>}
                </Form.Label> }
            </Form.Floating>
            <Form.Text className="text-danger">{errorMessage}</Form.Text>
        </div>
    );
}
export default TableDrpDown;
import { UseFormRegister } from 'react-hook-form';
import { Error } from '../error';
import {ErrorType} from "../../types";

type SelectProps = {
    name: string;
    options: Array<any>;
    label: string;
    value: string;
    display: string;
    multiple: boolean;
    register: UseFormRegister<any>;
    width?: string;
    defaultOptionText?: string;
    error?: ErrorType
    required?: boolean
};

export const Select = ({
    name,
    options,
    label,
    value,
    display,
    register,
    multiple,
    width,
    defaultOptionText,
    error,
    required
}: SelectProps) => {
    if (defaultOptionText) {
        const defaultOption = { [value]: '', [display]: defaultOptionText };
        options = [defaultOption, ...options];
    }
    return (
        <div
            className={`flex flex-col font-semibold gap-1 ${
                width ? width : 'w-5/6'
            }`}
        >
            <label className={'text-left text-pink-50'}>{label}</label>
            <select
                className={`py-2.5 px-0 bg-transparent border-0 border-b-2 appearance-none text-gray-400 border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer`}
                {...register(name)}
                multiple={multiple}
                required={required}
            >
                {options.map((option, i) => {
                    return (
                        <option key={i} value={option[value]}>
                            {option[display]}
                        </option>
                    );
                })}
            </select>

            {error && <Error error={error} />}
        </div>
    );
};

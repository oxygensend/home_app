import { UseFormRegister } from 'react-hook-form';

type SelectProps = {
    options: Array<any>;
    label: string;
    value: string;
    display: string;
    register: UseFormRegister<any>;
    defaultOptionText?: string;
};

export const ShopSelect = ({ options, label, value, display, register, defaultOptionText }: SelectProps) => {
    if (defaultOptionText) {
        const defaultOption = { [value]: '', [display]: defaultOptionText };
        options = [defaultOption, ...options];
    }

    return (
        <div className={'w-5/6'}>
            <div className={`flex flex-col font-semibold gap-1`}>
                <label className={'text-left text-pink-50'}>{label}</label>
                <select
                    className={`py-2.5 px-0 bg-transparent border-0 border-b-2 appearance-none text-gray-400 border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer`}
                    {...register('shop')}
                >
                    {options.map((option, i) => {
                        return (
                            <option key={i} value={option[value]}>
                                {option[display]}
                            </option>
                        );
                    })}
                </select>
            </div>
        </div>
    );
};

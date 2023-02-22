import { InputProps } from './input.props';

export const Input = ({
    name,
    type,
    required,
    placeholder,
    register,
    className,
    error,
}: InputProps) => {
    console.log(error);
    return (
        <>
            <input
                {...register(name)}
                name={name}
                type={type}
                required={required}
                className={
                    className ??
                    'border border-gray-300 rounded-xl px-3 py-2 w-full text-gray-900 placeholder-gray-500 focus:z-10 focus:border-pink-500 focus:outline-none focus:ring-pink-500'
                }
                placeholder={placeholder}
            />
            {error ? <p className={"font-medium tracking-wide text-red-500 text-xs"}>{error}</p> : null}
        </>
    );
};

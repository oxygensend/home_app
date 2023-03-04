import { SubmitButtonProps } from './submitButton.props';

export const SubmitButton = ({ className, value }: SubmitButtonProps) => {
    return (
        <button
            type="submit"
            className={
                className ?? 'bg-pink-600 text-gray-50 rounded py-1 w-1/2 lg:h-12 h-10'
            }
        >
            {value}
        </button>
    );
};

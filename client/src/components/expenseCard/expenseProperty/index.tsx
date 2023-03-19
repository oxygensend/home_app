type ExpensePropertyProps = {
    label: string;
    value: string | undefined;
};
export const ExpenseProperty = ({ label, value }: ExpensePropertyProps) => {
    return (
        <div className={'flex flex-row gap-2'}>
            <p className={'text-pink-500 text-xl font-semibold'}>{label + ':'}</p>
            <p className={'text-xl text-pink-50'}>{value}</p>
        </div>
    );
};

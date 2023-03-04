import {ErrorType} from '../../types';

type ErrorProps = {
    error: ErrorType | string;
};
export const Error = ({ error }: ErrorProps) => {
    if (error instanceof String) {
        return (
            <p className={'font-medium tracking-wide text-red-500 text-xs'}>
                {error}
            </p>
        );
    } else {
        return (
            <>
                {Object.values(error).map((err: any, i) => {
                    return (
                        <p
                            className={
                                'font-medium tracking-wide text-red-500 text-xs'
                            }
                            key={i}
                        >
                            {err}
                        </p>
                    );
                })}
            </>
        );
    }
};

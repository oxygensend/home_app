import { useEffect, useState } from 'react';
import eventBus from '../../utils/eventBus';

export const Flash = () => {
    const [visibility, setVisibility] = useState(false);
    const [message, setMessage] = useState('New expense added succsdsa');
    const [type, setType] = useState('');

    useEffect(() => {
        eventBus.addListener('flash', ({ message, type }) => {
            setVisibility(true);
            setMessage(message);
            setType(type);
            setTimeout(() => {
                setVisibility(false);
            }, 4000);
        });
    }, []);

    return visibility ? (
        <div
            className={
                ' border order-12 z-40  px-4 py-3 rounded fixed right-0 top-20 mr-1 ' +
                (type === 'success'
                    ? 'bg-green-100 border-green-400 text-green-700'
                    : 'bg-red-100 border-red-400 text-red-700')
            }
            role="alert"
        >
            <div className={'flex flex-row justify-between'}>
                <span className="block sm:inline">{message}</span>
                <span className="relative bottom-3 px-4 py-3">
                    <svg
                        className={
                            'fill-current h-6 w-6 ' +
                            (type === 'success'
                                ? 'text-green-500 hover:text-green-800'
                                : 'text-red-500 hover:text-red-800')
                        }
                        role="button"
                        xmlns="http://www.w3.org/2000/svg"
                        onClick={() => {
                            setVisibility(false);
                        }}
                        viewBox="0 0 20 20"
                    >
                        <title>Close</title>
                        <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                    </svg>
                </span>
            </div>
        </div>
    ) : null;
};

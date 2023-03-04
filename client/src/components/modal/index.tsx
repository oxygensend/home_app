import React, { useEffect, useRef } from 'react';
import { ReactComponent as XIcon } from '../../assets/images/x-solid.svg';

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: JSX.Element;
};

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => {
            if (
                modalRef.current &&
                !modalRef.current.contains(e.target as Node)
            ) {
                onClose();
            }
        };
        const handleOnKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener('keydown', handleOnKeyDown);
            document.addEventListener('mousedown', handleOutsideClick);
        } else {
            document.removeEventListener('mousedown', handleOutsideClick);
            document.removeEventListener('keydown', handleOnKeyDown);
        }

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
            document.removeEventListener('keydown', handleOnKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center overflow justify-center z-50">
            <div
                className="bg-[#1e2a4a] rounded-lg w-96  lg:w-1/2 shadow-xl"
                ref={modalRef}
            >
                <div className="flex justify-between border-b border-pink-200 p-3 text-center">
                    <h3 className="font-semibold text-xl text-center text-pink-50">
                        {title}
                    </h3>
                    <XIcon
                        fill={'white'}
                        height={15}
                        width={15}
                        className={
                            'cursor-pointer hover:fill-pink-600 mt-2 mr-1'
                        }
                        onClick={onClose}
                    />
                </div>
                <div className={'mt-5'}>{children}</div>
            </div>
        </div>
    );
};

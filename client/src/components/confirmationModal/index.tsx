import { Modal } from '../modal';
import { ModalEnum } from '../../types';

type ConfirmationModalProps = {
    isOpen: boolean;
    onDecline: () => void;
    onAgree: () => void;
    content: string;
};
export const ConfirmationModal = ({ isOpen, onAgree, onDecline, content }: ConfirmationModalProps) => {
    return (
        <Modal title={'Confirm'} isOpen={isOpen} onClose={onDecline} type={ModalEnum.CONFIRMATION} order={'50'}>
            <div>
                <p className={'text-center text-xl text-pink-50 pb-4'}>{content}</p>
                <div className={'flex flex-row justify-between pl-6 pr-6 pb-6'}>
                    <div
                        className={
                            'bg-pink-50 hover:bg-pink-100 text-gray-800 hover:text-gray-500 text-sm rounded p-2 flex justify-center w-14 lg:w-20 cursor-pointer'
                        }
                        onClick={() => onAgree()}
                    >
                        Yes
                    </div>

                    <div
                        className={
                            'bg-red-600 hover:bg-red-700 text-gray-50 text-sm rounded p-2  flex justify-center w-14 lg:w-20 cursor-pointer'
                        }
                        onClick={() => onDecline()}
                    >
                        No
                    </div>
                </div>
            </div>
        </Modal>
    );
};

import { MenuItemProps } from './menuItem.props';

export const MenuItem = ({ name, imageSrc, imageAlt, redirect, onClick }: MenuItemProps) => {
    return (
        <div
            className={
                'w-11/12  content-center hover:bg-pink-800 hover:text-pink-300 flex flex-row gap-3 rounded cursor-pointer'
            }
            onClick={() => (onClick ? onClick() : null)}
        >
            <img src={imageSrc} alt={imageAlt} height={17} width={17} className={'ml-2'} />
            <a className={'pt-2 pb-2 font-semibold text-lg'} href={redirect}>
                {name}
            </a>
        </div>
    );
};

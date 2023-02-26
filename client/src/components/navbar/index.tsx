import menu from '../../assets/images/menu.png';

type NavbarProps = {
    isOpen: boolean;
    width: number;
    toggleSideBar: CallableFunction;
};
export const Navbar = ({ isOpen, toggleSideBar, width }: NavbarProps) => {
    return (
        <div
            className={`w-full bg-pink-600 h-16 flex flex-row items-center  fixed top-0 ${
                width < 1024 && isOpen ? 'block' : 'hidden'
            }`}
        >
            <div className={'ml-1'} onClick={() => toggleSideBar()}>
                <img src={menu} alt={'mobile menu'} height={45} width={45} />
            </div>
        </div>
    );
};

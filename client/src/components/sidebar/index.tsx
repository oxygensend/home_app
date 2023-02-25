import dashboard from '../../assets/images/sidebar/dashboard.svg';
import money from '../../assets/images/sidebar/money.png';
import expenses from '../../assets/images/sidebar/expenses.svg';
import calendar from '../../assets/images/sidebar/calendar.svg';
import singOut from '../../assets/images/sidebar/sing-out.svg';
import { MenuItem } from './menuItem';

type SidebarProps = {
    isOpen: boolean,
    width: number,
    toggleSideBar: CallableFunction
}

export const Sidebar = ({ isOpen, width, toggleSideBar }: SidebarProps) => {
    return (
        <div
            className={`h-screen  lg:w-64 w-full flex flex-row  ${
                width > 1023 || isOpen ? 'block' : 'hidden'
            }`}
        >
            <div className={`w-64 h-full  bg-pink-600 rounded-r`}>
                <div
                    className={
                        'shadow-xl rounded flex items-center justify-center'
                    }
                >
                    <img src={money} alt={'money'} height={20} width={80} />
                </div>

                <div className={' flex flex-col items-center mt-2'}>
                    <MenuItem
                        name={'Dashboard'}
                        imageSrc={dashboard}
                        imageAlt={'dashboard'}
                    />

                    <MenuItem
                        name={'Expenses'}
                        imageSrc={expenses}
                        imageAlt={'expenses'}
                    />
                    <MenuItem
                        name={'Calendar'}
                        imageSrc={calendar}
                        imageAlt={'calendar'}
                    />
                    <MenuItem
                        name={'Sing out'}
                        imageSrc={singOut}
                        imageAlt={'sing out'}
                    />
                </div>
            </div>
            <div
                className={'h-full  grow '}
                onClick={() => {
                    toggleSideBar();
                }}
            ></div>
        </div>
    );
};

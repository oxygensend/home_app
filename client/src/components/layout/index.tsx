import { Sidebar } from '../sidebar';
import { Navbar } from '../navbar';
import { useEffect, useState } from 'react';
import { Flash } from '../flash';

type LayoutProps = {
    children: JSX.Element | null;
};
export const Layout = ({ children }: LayoutProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [width, setWidth] = useState(window.innerWidth);

    useEffect((): any => {
        function handleResize() {
            setWidth(window.innerWidth);
        }

        window.addEventListener('resize', handleResize);

        return (_: any) => {
            window.removeEventListener('resize', handleResize);
        };
    });

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={'lg:grid lg:grid-cols-12 h-full'}>
            <Navbar isOpen={!isOpen} toggleSideBar={toggleSidebar} width={width} />
            <Sidebar isOpen={isOpen} toggleSideBar={toggleSidebar} width={width} />
            <div className={'lg:col-start-3 lg:col-span-10 lg:mt-10 mt-20 h-screen '}>{children}</div>
            <Flash />
        </div>
    );
};

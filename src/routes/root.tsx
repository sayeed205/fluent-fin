import { Outlet } from 'react-router-dom';

import SideBar from '@/components/side-bar';

const Root = () => {
    return (
        <div className='h-20 py-4'>
            <div className='flex flex-row'>
                <SideBar />
                <div className='self-center justify-center w-screen h-screen p-2 rounded-tl-lg bg-background'>
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Root;

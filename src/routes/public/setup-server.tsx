import { SetupServerFrom } from '@/components/forms';

export const SetupServer = () => {
    return (
        <div className='flex'>
            <div className='flex flex-col items-center justify-center w-screen h-screen'>
                <h3 className='text-4xl '>Add Server</h3>
                <SetupServerFrom />
            </div>
        </div>
    );
};

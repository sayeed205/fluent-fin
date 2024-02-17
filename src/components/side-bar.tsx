import { getUserApi } from '@jellyfin/sdk/lib/utils/api/user-api';
import { getUserViewsApi } from '@jellyfin/sdk/lib/utils/api/user-views-api';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

import { Icons } from '@/components';
import { buttonVariants } from '@/components/ui';
import { cn, useApi } from '@/utils';
import {
    removeAllServers,
    removeUser,
    setExpanded,
    useCentralStore,
} from '@/utils/storage';
import { FluentIcon } from '@fluentui/react-icons';
import { useQueryClient } from '@tanstack/react-query';

interface SideBarItemProps {
    Icon: FluentIcon;
    name: string;
    href: string;
    id: string;
}

const extraSideBarItems: SideBarItemProps[] = [
    {
        Icon: Icons.home,
        name: 'Home',
        href: '/auth/home',
        id: 'home',
    },
    {
        Icon: Icons.settings,
        name: 'Settings',
        href: '/settings',
        id: 'settings',
    },
    {
        Icon: Icons.person,
        name: 'User',
        href: '/user',
        id: 'user',
    },
];

export default function SideBar() {
    const api = useApi(state => state.api);
    if (!api) return null;
    const [libraries, setLibraries] = useState<SideBarItemProps[]>([]);

    useEffect(() => {
        const init = async () => {
            const user = await getUserApi(api).getCurrentUser();
            const libraries = await getUserViewsApi(api).getUserViews({
                userId: user?.data?.Id!,
            });
            const libraryData = libraries.data.Items!.map(lib => ({
                name: lib.Name!,
                id: lib.Id!,
                Icon: Icons.folder!,
                href: `/auth/library/${lib.Id!}`,
            }));
            setLibraries(extraSideBarItems.concat(libraryData));
        };
        init();
    }, []);

    // const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const isExpanded = useCentralStore(state => state.isExpanded);
    const location = useLocation();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const handleLogOut = async () => {
        console.log('Logging out user...');
        // await api.logout();
        sessionStorage.removeItem('accessToken');
        queryClient.clear();
        await removeAllServers();
        await removeUser();
        navigate('/setup/server');
    };

    return (
        <nav>
            <ul className='flex flex-col h-full gap-1 bg-transparent'>
                <motion.span
                    onClick={() => setExpanded(!isExpanded)}
                    style={{
                        display: 'flex',
                        gap: '4px',
                        flexDirection: 'row',
                        alignSelf: 'flex-start',
                        margin: '10px',
                    }}
                    whileTap={{
                        scale: '0.9',
                    }}
                    className={cn(
                        buttonVariants({
                            variant: 'ghost',
                            size: 'icon',
                        })
                    )}
                >
                    <Icons.menu />
                </motion.span>
                {libraries.map(page => (
                    // todo)) separate settings an user icon from the rest
                    <li
                        key={page.name}
                        className={cn(
                            'px-1',
                            page.name === 'Settings' && 'absolute bottom-4'
                        )}
                        // if its settings then add onClick
                    >
                        <motion.div
                            className={cn(
                                location.pathname.includes(page.href) &&
                                    'bg-background',
                                'rounded-lg'
                            )}
                            animate={{
                                width: isExpanded ? '285px' : '50px',
                            }}
                        >
                            <NavLink
                                to={page.href}
                                // <div
                                className={cn(
                                    'hover:bg-background hover:text-foreground relative py-[6px] px-1 flex items-center text-center rounded-lg transition-all duration-300 gap-3',
                                    'pl-[14px]',
                                    isExpanded && 'w-[285px]'
                                )}
                            >
                                <page.Icon />
                                <motion.div
                                    animate={{
                                        opacity: isExpanded ? 1 : 0,
                                    }}
                                >
                                    {
                                        // invisible character to keep the layout. Shit hack but works
                                        !isExpanded && '‎'
                                    }
                                    {isExpanded && page.name}
                                </motion.div>
                                {location.pathname.includes(page.href) && (
                                    <motion.div
                                        layoutId='active-pill'
                                        className='absolute inset-0 rounded-md w-[3px] h-4 bg-foreground top-[calc(25%+1px)]'
                                        transition={{
                                            type: 'spring',
                                            duration: 0.5,
                                        }}
                                    />
                                )}
                                {/* </div> */}
                            </NavLink>
                        </motion.div>
                    </li>
                ))}
                <li>
                    <Icons.logOut onClick={handleLogOut} />
                </li>
            </ul>
        </nav>
    );
}

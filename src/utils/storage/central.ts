import { version as appVersion } from '@/../package.json';
import {
    getAllServers,
    getDefaultServer,
    getServer,
    getUser,
} from '@/utils/storage';
import { create } from 'zustand';

export const useCentralStore = create(() => ({
    defaultServerOnDisk: async () => await getDefaultServer(),
    defaultServerInfoOnDisk: async () => {
        const a = await getDefaultServer();
        if (!a) return null;
        return await getServer(a);
    },
    allServersOnDisk: async () => getAllServers(),
    userOnDisk: async () => getUser(),
    /** This is the initial route that app goes to just after app startups */
    initialRoute: '',
    clientVersion: appVersion,
    isExpanded: false,
}));

export const setInitialRoute = (route: string) => {
    useCentralStore.setState(state => ({ ...state, initialRoute: route }));
};

export const setExpanded = (expanded: boolean) => {
    useCentralStore.setState(state => ({ ...state, isExpanded: expanded }));
};

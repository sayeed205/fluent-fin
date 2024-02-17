import { createApi, useApi } from '@/utils';
import {
    getAllServers,
    getDefaultServer,
    getServer,
    getUser,
    removeServer,
    removeUser,
    setDefaultServer,
    setInitialRoute,
} from '@/utils/storage';
import { getUserApi } from '@jellyfin/sdk/lib/utils/api/user-api';

export const handleAuthError = async () => {
    await removeUser();
    setInitialRoute('/login/index');
};

export const initializeApp = async () => {
    if (window.location.pathname !== '/') {
        window.location.href = '/';
        return;
    }

    const defaultServerId = await getDefaultServer();
    if (!defaultServerId) return setInitialRoute('/setup/server');

    const defaultServer = await getServer(defaultServerId);
    if (!defaultServer) {
        await setDefaultServer(null);
        await removeServer(defaultServerId);

        const servers = await getAllServers();

        return setInitialRoute(
            servers.length ? '/servers/list' : '/setup/server'
        );
    }

    const rememberedUser = await getUser();
    createApi(defaultServer.address, '');

    if (!rememberedUser) return setInitialRoute('/login/index');

    try {
        let authAPI = useApi.getState().api;
        if (!authAPI) return handleAuthError();
        createApi(defaultServer.address, rememberedUser.accessToken);
        setInitialRoute('/auth/home');
        authAPI = useApi.getState().api!;
        console.log(authAPI, rememberedUser, defaultServer);
        const user = await getUserApi(authAPI).getCurrentUser();

        if (!user) {
            await removeUser();
            return handleAuthError();
        }
    } catch (error) {
        console.error(error);
        return setInitialRoute('/error');
    }
};

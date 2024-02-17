import { Api, Jellyfin } from '@jellyfin/sdk';
import axios from 'axios';
import axiosTauriApiAdapter from 'axios-tauri-api-adapter';
import { create } from 'zustand';

import { version as appVersion } from '../../package.json';

export const axiosClient = axios.create({
    adapter: axiosTauriApiAdapter,
    headers: {
        'Access-Control-Allow-Origin': '*',
    },
    timeout: 69420,
});

const deviceId = localStorage.getItem('deviceId') || crypto.randomUUID();

if (!localStorage.getItem('deviceId')) {
    localStorage.setItem('deviceId', deviceId);
}

const jellyfin = new Jellyfin({
    clientInfo: {
        name: 'Fluent Fin',
        version: appVersion,
    },
    deviceInfo: {
        name: 'Fluent Fin',
        id: deviceId,
    },
});

export const useApi = create<{
    api: Api | null;
    deviceId: string | null;
    jellyfin: Jellyfin;
}>(() => ({
    api: null,
    deviceId: deviceId,
    jellyfin: jellyfin,
}));

export const createApi = (
    serverAddress: string,
    accessToken: string | undefined
) =>
    useApi.setState(state => ({
        ...state,
        api: jellyfin.createApi(serverAddress, accessToken, axiosClient),
    }));

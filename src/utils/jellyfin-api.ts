import axios from "axios";
import axiosTauriApiAdapter from "axios-tauri-api-adapter";

import { Jellyfin } from "@jellyfin/sdk";
import { version as appVersion } from "../../package.json";

export const axiosClient = axios.create({
	adapter: axiosTauriApiAdapter,
	headers: {
		"Access-Control-Allow-Origin": "*",
	},
	timeout: 69420,
});

const deviceId = localStorage.getItem("deviceId") || crypto.randomUUID();

if (!localStorage.getItem("deviceId")) {
	localStorage.setItem("deviceId", deviceId);
}

const jellyfin = new Jellyfin({
	clientInfo: {
		name: "Fluent Fin",
		version: appVersion,
	},
	deviceInfo: {
		name: "Fluent Fin",
		id: deviceId,
	},
});

// export const createJellyfinInstance = async (serverUrl: string, accessToken) => {
//     jellyfin.
// };

export const getRecommendedServers = async (serverURL: string) => {
	return await jellyfin.discovery.getRecommendedServers([serverURL]);
};

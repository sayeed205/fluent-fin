import { ServerInfo, ServerStore } from "@/lib/types/storage";
import { Store } from "tauri-plugin-store-api";

const store = new Store("servers.store");

export const setServer = async (server: ServerInfo) => {
	const servers = await getAllServers();
	const newServers = servers.filter((s) => s.id !== server.id);
	newServers.push(server);

	await store.set("servers", newServers);
	await store.save();

	return server;
};

export const getAllServers = async () => {
	return (await store.get<ServerStore["servers"]>("servers")) || [];
};

export const getServer = async (serverId: string) =>
	getAllServers().then(
		(servers) => servers.find((s) => s.id === serverId) || null,
	);

export const getDefaultServer = async () =>
	(await store.get<ServerStore["defaultServer"]>("defaultServer")) || null;

export const setDefaultServer = async (serverId: string | null) => {
	await store.set("defaultServer", serverId);
	await store.save();

	return await getDefaultServer();
};

export const removeServer = async (serverId: string) => {
	const servers = await getAllServers();
	const newServers = servers.filter((s) => s.id !== serverId);

	await store.set("servers", newServers);
	await store.save();
};

export const removeAllServers = async () => {
	await store.clear();
	await setDefaultServer(null);
	await store.save();
};

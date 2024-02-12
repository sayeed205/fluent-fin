import { RecommendedServerInfo } from "@jellyfin/sdk";

interface ServerInfo extends RecommendedServerInfo {
	id: string;
}

export interface ServerStore {
	defaultServer: string | null;
	servers: ServerInfo[];
}

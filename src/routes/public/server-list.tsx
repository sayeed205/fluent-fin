import { Icons } from "@/components";
import { ServerInfo } from "@/lib/types/storage";
import { getAllServers } from "@/utils/storage";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const ServerList = () => {
	const [servers, setServers] = useState<ServerInfo[]>([]);
	const navigate = useNavigate();
	useEffect(() => {
		const initialize = async () => {
			const servers = await getAllServers();
			setServers(servers);
		};
		initialize();
	}, []);
	return (
		<div className="flex items-center justify-center h-screen">
			<div className="flex flex-col gap-3">
				<div className="flex justify-between ">
					<h3 className="text-4xl">Servers</h3>
					<Icons.plus
						className="text-xl"
						onClick={() => navigate("/setup/server")}
						cursor="pointer"
					/>
				</div>
				<div className="">
					{servers?.map((server) => {
						return (
							<div key={server.id}>
								<h3>{server.systemInfo?.ServerName}</h3>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};

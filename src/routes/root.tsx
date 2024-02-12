import SideBar from "@/components/side-bar";
import { getAllServers, getDefaultServer, getServer } from "@/utils/storage";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const Root = () => {
	const navigate = useNavigate();

	useEffect(() => {
		const initialize = async () => {
			// check if any server available
			const servers = await getAllServers();
			if (!servers.length) {
				return navigate("/setup/server");
			}

			// check if default server is set
			const defaultServerId = await getDefaultServer();
			if (defaultServerId) {
				// redirect to home page
				const server = await getServer(defaultServerId);
				if (!server) {
					// return navigate("/");
				}

				// redirect to select server page
				return navigate("/setup/list");
			}
		};

		initialize();
	});

	return (
		<div className="h-20 py-4">
			<div className="flex flex-row">
				<SideBar />
				<div className="self-center justify-center w-screen h-screen p-2 rounded-tl-lg bg-background">
					<Outlet />
				</div>
			</div>
		</div>
	);
};

export default Root;

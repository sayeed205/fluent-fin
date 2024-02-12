import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { getDefaultServer, getServer } from "@/utils/storage";

const Setup = () => {
	const navigate = useNavigate();

	useEffect(() => {
		const initialize = async () => {
			// check if any server available

			// check if default server is set
			const defaultServerId = await getDefaultServer();
			if (defaultServerId) {
				// redirect to home page
				const server = await getServer(defaultServerId);
				if (server) {
					//todo)) add user check
					// return navigate("/");
				}

				// redirect to select server page
				// return navigate("/setup/list");
			}
		};

		initialize();
	});

	return (
		<div className="">
			<Outlet />
		</div>
	);
};

export default Setup;

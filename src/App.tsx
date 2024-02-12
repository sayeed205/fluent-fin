import { RouterProvider, createBrowserRouter } from "react-router-dom";

import { Toaster } from "@/components/ui";
import { ServerList, SetupServer, UserLogin } from "@/routes/public";
import Root from "@/routes/root";
import Setup from "@/routes/setup";

function Apps() {
	return (
		<div>
			<h1>React TypeScript App</h1>
			<p>My first React TypeScript app</p>
		</div>
	);
}

const router = createBrowserRouter([
	{
		path: "/setup",
		element: <Setup />,
		children: [
			{
				path: "server",
				element: <SetupServer />,
			},
			{
				path: "list",
				element: <ServerList />,
			},
			{
				path: "login/user",
				element: <UserLogin />,
			},
		],
	},
	{
		path: "/",
		element: <Root />,
		children: [
			{
				path: "/",
				element: <Apps />,
			},
		],
	},
]);

const App = () => (
	<>
		<RouterProvider router={router} />
		<Toaster />
	</>
);

export default App;

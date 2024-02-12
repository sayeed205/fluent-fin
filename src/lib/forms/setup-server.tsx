import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

import { Button, Input, useToast } from "@/components/ui";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { getRecommendedServers } from "@/utils";
import { setDefaultServer, setServer } from "@/utils/storage";

const setupServerFormSchema = z.object({
	serverAddress: z.string().url(),
});

export function SetupServerFrom() {
	const form = useForm<z.infer<typeof setupServerFormSchema>>({
		resolver: zodResolver(setupServerFormSchema),
		defaultValues: {
			serverAddress: "",
		},
	});
	const { toast } = useToast();
	const navigate = useNavigate();

	const onSubmit = async (data: z.infer<typeof setupServerFormSchema>) => {
		console.log(data);
		const { serverAddress } = data;
		// add server to storage
		const servers = await getRecommendedServers(serverAddress);
		if (servers.length === 0) {
			return toast({
				title: "Error",
				description: "No server found",
				color: "destructive",
			});
		}
		const serverId = servers[0].systemInfo?.Id!;
		const serverInfo = { ...servers[0], id: serverId };
		// set server
		await setServer(serverInfo);
		// set default server
		await setDefaultServer(serverId);
		// show success message
		toast({
			title: "Success",
			description: "Server added successfully",
			color: "success",
		});
		// navigate to login page
		navigate("/setup/login/user");
	};
	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex flex-col w-full max-w-md gap-4"
			>
				<FormField
					control={form.control}
					name="serverAddress"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Server Address</FormLabel>
							<FormControl>
								<Input
									placeholder="https://demo.jellyfin.org/stable"
									type="text"
									{...field}
								/>
							</FormControl>
							{/* <FormDescription></FormDescription> */}
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit">Add</Button>
			</form>
		</Form>
	);
}

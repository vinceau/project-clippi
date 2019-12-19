import { Message } from "common/types";
import { ipc } from "./rendererIpc";

export const delay = async (ms: number): Promise<void> => {
	await new Promise(resolve => setTimeout(resolve, ms));
};

export const notify = (title: string, body: string) => {
	ipc.sendMessage(
		Message.Notify,
		{
			title,
			notification: body,
		},
	);
};

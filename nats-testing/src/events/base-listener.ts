import { Message, Stan } from "node-nats-streaming";
import { Subjects } from "./subjects";

interface Event {
	subject: Subjects;
	data: any;
}

export abstract class Listener<T extends Event> {
	//abstract property and method must be defined in the child class
	abstract subject: T["subject"];
	abstract queueGroupName: string;
	abstract onMessage(data: T["data"], msg: Message): void;

	private client: Stan;
	protected ackWait = 5 * 1000;

	//requires pre initialized client
	constructor(client: Stan) {
		this.client = client;
	}

	subscriptionOptions() {
		return this.client
			.subscriptionOptions()
			.setManualAckMode(true)
			.setAckWait(this.ackWait)
			.setDeliverAllAvailable()
			.setDurableName(this.queueGroupName);
	}

	//subscribe to the subject/channel
	listen() {
		const subscription = this.client.subscribe(
			this.subject,
			this.queueGroupName,
			this.subscriptionOptions()
		);
		subscription.on("message", (msg: Message) => {
			console.log(`Message received: ${this.subject} / ${this.queueGroupName}`);
			const parsedData = this.parseMessage(msg);
			this.onMessage(parsedData, msg);
		});
	}
	parseMessage(msg: Message) {
		const data = msg.getData();
		return typeof data === "string"
			? JSON.parse(data)
			: JSON.parse(data.toString("utf8"));
	}
}

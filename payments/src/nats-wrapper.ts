import nats, { Stan } from "node-nats-streaming";
class NatsWrapper {
	// ?  will tell TS that client will be undefined for sometime
	private _client?: Stan;

	get client() {
		if (!this._client) {
			throw new Error("Cannot access NATS client before connecting");
		}

		return this._client;
	}

	connect(clusterId: string, clientId: string, url: string) {
		this._client = nats.connect(clusterId, clientId, { url });

		return new Promise<void>((resolve, reject) => {
			this.client.on("connect", () => {
				console.log("connected to natss server in tickets service");
				resolve();
			});
			this.client.on("error", (err) => {
				reject(err);
			});
		});
	}
}

export const natsWrapper = new NatsWrapper();

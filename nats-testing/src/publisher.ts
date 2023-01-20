// kubectl port-forward nats-depl-b9c7f7cdf-fjxps 4222:4222
//run above command to do port forwarding
import nats from "node-nats-streaming";
console.clear();
const stan = nats.connect("ticketing", "abc", {
	url: "http://localhost:4222",
});

stan.on("connect", () => {
	console.log("Publisher connected to NATS");
	//Nats takes strings as data and not object
	const data = JSON.stringify({
		id: "2352354",
		title: "concert",
		price: 30,
	});

	stan.publish("ticket:created", data, () => {
		console.log("published");
	});
});

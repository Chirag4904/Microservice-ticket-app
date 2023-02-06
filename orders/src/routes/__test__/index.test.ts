import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import mongoose from "mongoose";

const buildTicket = async (title: string, price: number) => {
	const ticket = Ticket.build({
		id: new mongoose.Types.ObjectId().toHexString(),
		title: title,
		price: price,
	});
	await ticket.save();
	return ticket;
};

it("fetch orders for a particular user", async () => {
	//create three tickets
	const ticketOne = await buildTicket("ticketOne", 20);
	const ticketTwo = await buildTicket("ticketTwo", 30);
	const ticketThree = await buildTicket("ticketThree", 40);

	const userOne = global.signin();
	const userTwo = global.signin();
	//create one order as User #1
	await request(app)
		.post("/api/orders")
		.set("Cookie", userOne)
		.send({ ticketId: ticketOne.id })
		.expect(201);

	//create two orders as User #2
	const { body: order1 } = await request(app)
		.post("/api/orders")
		.set("Cookie", userTwo)
		.send({ ticketId: ticketTwo.id })
		.expect(201);
	const { body: order2 } = await request(app)
		.post("/api/orders")
		.set("Cookie", userTwo)
		.send({ ticketId: ticketThree.id })
		.expect(201);

	//make request to get orders for User #2
	const response = await request(app)
		.get("/api/orders")
		.set("Cookie", userTwo)
		.expect(200);
	//make sure we only got the orders for User #2
	// console.log(response.body);
	expect(response.body.length).toEqual(2);
	expect(response.body[0].id).toEqual(order1.id);
	expect(response.body[1].id).toEqual(order2.id);
	expect(response.body[0].ticket.id).toEqual(ticketTwo.id);
	expect(response.body[1].ticket.id).toEqual(ticketThree.id);
});

import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket.model";

it("has a route hanfler listening to /api/tickets for post req", async () => {
	const response = await request(app).post("/api/tickets").send({});
	expect(response.status).not.toEqual(404);
});
it("can only be accessed if user is signed in", async () => {
	await request(app).post("/api/tickets").send({}).expect(401);
});
it("return a status other than 401 if the user is signed in", async () => {
	const response = await request(app)
		.post("/api/tickets")
		.set("Cookie", global.signin())
		.send({});
	expect(response.status).not.toEqual(401);
});
it("return error if invalid title is provided", async () => {
	await request(app)
		.post("/api/tickets")
		.set("Cookie", global.signin())
		.send({
			title: "",
			price: 10,
		})
		.expect(400);
	await request(app)
		.post("/api/tickets")
		.set("Cookie", global.signin())
		.send({
			price: 10,
		})
		.expect(400);
});
it("return error if invalid price is provided", async () => {
	await request(app)
		.post("/api/tickets")
		.set("Cookie", global.signin())
		.send({
			title: "ajenfjkae",
			price: -10,
		})
		.expect(400);
	await request(app)
		.post("/api/tickets")
		.set("Cookie", global.signin())
		.send({
			title: "ajenfjkae",
		})
		.expect(400);
});
it("creates a ticket with valid inputs", async () => {
	//add in a check to make sure a ticket was saved
	let tickets = await Ticket.find({});
	//there should be 0 tickets as all are deleted before tests are run

	expect(tickets.length).toEqual(0);

	await request(app)
		.post("/api/tickets")
		.set("Cookie", global.signin())
		.send({
			title: "ajenfjkae",
			price: 20,
		})
		.expect(201);

	tickets = await Ticket.find({});
	expect(tickets.length).toEqual(1);
	expect(tickets[0].price).toEqual(20);
});

import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

it("return 404 if the provided id does not exist", async () => {
	const id = new mongoose.Types.ObjectId().toHexString();
	await request(app)
		.put(`/api/tickets/${id}`)
		.set("Cookie", global.signin())
		.send({
			title: "asldkfj",
			price: 20,
		})
		.expect(404);
});

it("return 401 if the user is not authenticated", async () => {
	const id = new mongoose.Types.ObjectId().toHexString();
	await request(app)
		.put(`/api/tickets/${id}`)
		.send({
			title: "asldkfj",
			price: 20,
		})
		.expect(401);
});

it("return 401 if the user doesn't own the ticket", async () => {
	const response = await request(app)
		.post("/api/tickets")
		.set("Cookie", global.signin())
		.send({
			title: "asldkfj",
			price: 20,
		});

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set("Cookie", global.signin())
		.send({
			title: "dkehbdbwehfbhwebfwbfjw",
			price: 1000,
		})
		.expect(401);
});

it("return 400 if the user provide invalid title or price", async () => {
	const cookie = global.signin();
	const response = await request(app)
		.post("/api/tickets")
		.set("Cookie", cookie)
		.send({
			title: "asldkfj",
			price: 20,
		});

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set("Cookie", cookie)
		.send({
			title: "",
			price: 20,
		})
		.expect(400);

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set("Cookie", cookie)
		.send({
			title: "asldkfj",
			price: -20,
		})
		.expect(400);
});

it("updates the ticket provided valid inputs", async () => {
	const cookie = global.signin();
	const response = await request(app)
		.post("/api/tickets")
		.set("Cookie", cookie)
		.send({
			title: "asldkfj",
			price: 20,
		});

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set("Cookie", cookie)
		.send({
			title: "title",
			price: 1000,
		})
		.expect(200);

	const ticketResponse = await request(app)
		.get(`/api/tickets/${response.body.id}`)
		.send();
	expect(ticketResponse.body.title).toEqual("title");
	expect(ticketResponse.body.price).toEqual(1000);
});

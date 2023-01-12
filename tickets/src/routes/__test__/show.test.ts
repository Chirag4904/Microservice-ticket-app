import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

it("returns a 404 if the ticket is not found", async () => {
	const id = new mongoose.Types.ObjectId().toHexString();
	await request(app).get(`/api/tickets/${id}`).send().expect(404);
});

it("returns the ticket if the ticket is found", async () => {
	const title = "event";
	const price = 40;
	const response = await request(app)
		.post("/api/tickets")
		.set("Cookie", global.signin())
		.send({
			title,
			price,
		})
		.expect(201);

	await request(app).get(`/api/tickets/${response.body.id}`).send().expect(200);

	expect(response.body.title).toEqual(title);
	expect(response.body.price).toEqual(price);
});

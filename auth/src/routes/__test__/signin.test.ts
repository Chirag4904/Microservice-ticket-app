import request from "supertest";
import { app } from "../../app";

it("Fail when email doesnt exist", async () => {
	await request(app)
		.post("/api/users/signin")
		.send({
			email: "test@test.com",
			password: "password",
		})
		.expect(200);
});

it("Fail when password is wrong", async () => {
	await request(app)
		.post("/api/users/signup")
		.send({
			email: "test@test.com",
			password: "password",
		})
		.expect(201);

	await request(app)
		.post("/api/users/signin")
		.send({
			email: "test@test.com",
			password: "passw",
		})
		.expect(400);
});

it("Response with cookie when valid credentials", async () => {
	await request(app)
		.post("/api/users/signup")
		.send({
			email: "test@test.com",
			password: "password",
		})
		.expect(201);

	const response = await request(app)
		.post("/api/users/signin")
		.send({
			email: "test@test.com",
			password: "password",
		})
		.expect(200);

	expect(response.get("Set-Cookie")).toBeDefined();
});

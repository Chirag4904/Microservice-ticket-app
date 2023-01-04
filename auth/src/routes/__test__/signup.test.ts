import request from "supertest";
import { app } from "../../app";

it("returns a 201 on successful signup", async () => {
	return request(app)
		.post("/api/users/signup")
		.send({
			email: "test@test.com",
			password: "password",
		})
		.expect(201);
});

it("return a 400 with invalid Email", async () => {
	return request(app)
		.post("/api/users/signup")
		.send({
			email: "test@om",
			password: "password",
		})
		.expect(400);
});

it("return a 400 with invalid Password", async () => {
	return request(app)
		.post("/api/users/signup")
		.send({
			email: "test@test.com",
			password: "pa",
		})
		.expect(400);
});

it("return a 400 with missing email and password", async () => {
	await request(app)
		.post("/api/users/signup")
		.send({
			email: "",
			password: "password",
		})
		.expect(400);
	await request(app)
		.post("/api/users/signup")
		.send({
			email: "test@test.com",
			password: "",
		})
		.expect(400);
});

it("Signup with duplicate email not allowed", async () => {
	await request(app)
		.post("/api/users/signup")
		.send({
			email: "test@test.com",
			password: "password",
		})
		.expect(201);

	await request(app)
		.post("/api/users/signup")
		.send({
			email: "test@test.com",
			password: "password",
		})
		.expect(400);
});

it("sets a cookie after successfull signup", async () => {
	const response = await request(app)
		.post("/api/users/signup")
		.send({
			email: "test@test.com",
			password: "password",
		})
		.expect(201);

	expect(response.get("Set-Cookie")).toBeDefined();
});

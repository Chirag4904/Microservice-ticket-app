import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import mongoose from "mongoose";

import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-error";

const app = express();
app.use(json());

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);
// https://expressjs.com/en/guide/error-handling.html (ref)
//synchronous errors will be handled automatically by express and pass it to error handling middleware
// app.all("*", () => {
// 	throw new NotFoundError();
// });

//asynchronous errors need to be handled manually by passing it to the next
// app.all("*", async (req, res, next) => {
// 	next(new NotFoundError());
// });

//or use third party package to handle that for us "express-async-errors"
app.all("*", async (req, res, next) => {
	throw new NotFoundError();
});

app.use(errorHandler);

const startServer = async () => {
	try {
		await mongoose.connect("mongodb://auth-mongo-srv:27017/auth");
		console.log("connected to mongodb");
	} catch (err) {
		console.log(err);
	}

	app.listen(3000, () => {
		console.log("Listening on port 3000");
	});
};

startServer();

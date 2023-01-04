import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";

import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-error";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
	cookieSession({
		signed: false,
		secure: process.env.NODE_ENV !== "test",
	})
);

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

export { app };

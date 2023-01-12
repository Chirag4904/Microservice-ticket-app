import mongoose from "mongoose";
import { app } from "./app";

const startServer = async () => {
	if (!process.env.JWT_KEY) {
		throw new Error("JWT Key must be defined");
	}

	if (!process.env.MONGO_URI) {
		throw new Error("MONGO_URI must be defined");
	}

	try {
		await mongoose.connect(process.env.MONGO_URI);
		console.log("connected to mongodb");
	} catch (err) {
		console.log(err);
	}

	app.listen(3000, () => {
		console.log("Listening on port 3000");
	});
};

startServer();

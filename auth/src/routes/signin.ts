import express, { Request, Response } from "express";
import { body } from "express-validator";

import { Password } from "../services/password";
import { validateRequest, BadRequestError } from "@caticket/common";
import { User } from "../models/user.model";
import jwt from "jsonwebtoken";
const router = express.Router();

router.post(
	"/api/users/signin",
	[
		body("email").isEmail().withMessage("Email must be valid"),
		body("password")
			.trim()
			.notEmpty()
			.withMessage("You must supply a password"),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const { email, password } = req.body;

		const existingUser = await User.findOne({ email });
		if (!existingUser) {
			throw new BadRequestError("Invalid credentials");
		}

		//user exists so now compare the passwords
		const passwordMatch = await Password.compare(
			existingUser.password,
			password
		);

		if (!passwordMatch) {
			throw new BadRequestError("Invalid credentials");
		}

		// generate jwt
		const userJwt = jwt.sign(
			{
				id: existingUser.id,
				email: existingUser.email,
			},
			process.env.JWT_KEY!
		);

		req.session = {
			jwt: userJwt,
		};

		return res.status(200).send({ existingUser });
	}
);

export { router as signinRouter };

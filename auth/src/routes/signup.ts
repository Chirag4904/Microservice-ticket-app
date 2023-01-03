import express, { Request, Response } from "express";
import { body } from "express-validator";
import { validateRequest } from "../middlewares/validate-requests";
import { BadRequestError } from "../errors/bad-request-error";
import { User } from "../models/user.model";

import jwt from "jsonwebtoken";

const router = express.Router();

router.post(
	"/api/users/signup",
	[
		body("email").isEmail().withMessage("Email must be valid"),
		body("password")
			.trim()
			.isLength({ min: 4, max: 20 })
			.withMessage("Password must be between 4 and 20 characters"),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		//create a user as email and pass are validated
		const { email, password } = req.body;

		const existingUser = await User.findOne({ email });

		if (existingUser) {
			throw new BadRequestError("Email already in use");
		}

		const user = User.build({ email, password });
		await user.save();

		//generate jwt and store on session object

		const userJwt = jwt.sign(
			{
				id: user.id,
				email: user.email,
			},
			process.env.JWT_KEY!
		);

		req.session = {
			jwt: userJwt,
		};

		res.status(201).send({ user });
	}
);

export { router as signupRouter };

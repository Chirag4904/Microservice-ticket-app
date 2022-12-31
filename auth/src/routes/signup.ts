import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";

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
	(req: Request, res: Response) => {
		// error handling
		const errors = validationResult(req);
		// if there are errors then return the array of errors
		if (!errors.isEmpty()) {
			throw new Error("invalid email or pass");
		}

		const { email, password } = req.body;

		//create a user as email and pass are validated
		throw new Error("db down");
		res.send({});
	}
);

export { router as signupRouter };

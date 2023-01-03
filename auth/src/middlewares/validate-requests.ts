import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { RequestValidationError } from "../errors/request-validation-error";

export const validateRequest = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	// error handling
	const errors = validationResult(req);
	// if there are errors then return the array of errors
	if (!errors.isEmpty()) {
		throw new RequestValidationError(errors.array());
	}

	next();
};

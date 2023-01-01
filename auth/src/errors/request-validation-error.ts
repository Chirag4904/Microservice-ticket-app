import { ValidationError } from "express-validator";
import { CustomError } from "./custom-error";
export class RequestValidationError extends CustomError {
	statusCode = 400;
	errors: ValidationError[];
	constructor(errors: ValidationError[]) {
		super("Invalid request parameters");
		this.errors = errors;

		// Only because we are extending a built in class
		Object.setPrototypeOf(this, RequestValidationError.prototype);
	}

	serializeErrors() {
		//returns array of errors
		return this.errors.map((error) => {
			return { message: error.msg, field: error.param };
		});
	}
}

// throw new RequestValidationError(errors.array());

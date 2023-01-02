import { CustomError } from "./custom-error";

export class BadRequestError extends CustomError {
	statusCode = 400;
	message: string;
	constructor(msg: string) {
		super(msg);
		this.message = msg;
		Object.setPrototypeOf(this, BadRequestError.prototype);
	}

	serializeErrors() {
		return [{ message: this.message }];
	}
}

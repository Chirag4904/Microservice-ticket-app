// Abstract classes are mainly for inheritance where other classes may derive from them. We cannot create an instance of an abstract class.
export abstract class CustomError extends Error {
	abstract statusCode: number;

	constructor(message: string) {
		super(message);
		// Only because we are extending a built in class
		Object.setPrototypeOf(this, CustomError.prototype);
	}

	abstract serializeErrors(): { message: string; field?: string }[];
}

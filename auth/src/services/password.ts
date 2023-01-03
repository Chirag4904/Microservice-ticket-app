import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

export class Password {
	// A static class method is a method that belongs to the class itself, not the instance of a class. That means we don't need an object to call a static class method. We call them directly from the class itself.
	static async toHash(password: string) {
		const salt = randomBytes(8).toString("hex");
		const buffer = (await scryptAsync(password, salt, 64)) as Buffer;

		return `${buffer.toString("hex")}.${salt}`;
	}

	static async compare(storedPassword: string, suppliedPassword: string) {
		const [hashedPassword, salt] = storedPassword.split(".");
		const buffer = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;

		return buffer.toString("hex") === hashedPassword;
	}
}

import mongoose from "mongoose";
import express, { Request, Response } from "express";
import {
	BadRequestError,
	NotFoundError,
	OrderStatus,
	requireAuth,
	validateRequest,
} from "@caticket/common";
import { body } from "express-validator";
import { Ticket } from "../models/ticket";
import { Order } from "../models/order";

const router = express.Router();

router.post(
	"/api/orders",
	requireAuth,
	[
		body("ticketId")
			.not()
			.isEmpty()
			.custom((input: string) => mongoose.Types.ObjectId.isValid(input))
			.withMessage("TicketId must be provided"),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const { ticketId } = req.body;

		//Find the ticket the user is trying to order in the database
		const ticket = await Ticket.findById(ticketId);
		if (!ticket) {
			throw new NotFoundError();
		}

		//Making sure that the ticket is not already reserved
		//Run query to look at all the orders.Find an order where the ticket is the ticket we just found and the order status is NOT cancelled.
		//If we find an order from that it means that the ticket is reserved.
		const existingOrder = Order.findOne({
			ticket: ticket,
			status: {
				$in: [
					OrderStatus.Created,
					OrderStatus.AwaitingPayment,
					OrderStatus.Complete,
				],
			},
		});

		if (existingOrder) {
			throw new BadRequestError("Ticket is already reserved");
		}

		//Calculate an expiration time for this order

		//build and save to database

		//publish an event saying that an order was created

		res.send({});
	}
);

export { router as newOrderRouter };

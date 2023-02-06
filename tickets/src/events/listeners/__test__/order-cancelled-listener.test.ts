import { OrderCancelledEvent, OrderStatus } from "@caticket/common";
import { Message } from "node-nats-streaming";
import mongoose from "mongoose";
import { Ticket } from "../../../models/ticket.model";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledListener } from "../order-cancelled-listener";
const setup = async () => {
	// Create an instance of the listener
	const listener = new OrderCancelledListener(natsWrapper.client);

	// Create and save a ticket
	const orderId = new mongoose.Types.ObjectId().toHexString();
	const ticket = Ticket.build({
		title: "concert",
		price: 100,
		userId: "xyz",
	});
	ticket.set({ orderId });
	await ticket.save();

	// Create the fake data event
	const data: OrderCancelledEvent["data"] = {
		id: orderId,
		version: 0,
		ticket: {
			id: ticket.id,
		},
	};

	// @ts-ignore
	const msg: Message = {
		ack: jest.fn(),
	};

	// Return all of this stuff
	return { listener, ticket, data, msg, orderId };
};

it("updates the ticket, publishes an event, and acks the message", async () => {
	const { listener, ticket, data, msg, orderId } = await setup();
	await listener.onMessage(data, msg);

	const updatedTicket = await Ticket.findById(ticket.id);

	expect(updatedTicket!.orderId).not.toBeDefined();
	expect(msg.ack).toHaveBeenCalled();
	expect(natsWrapper.client.publish).toHaveBeenCalled();
	const ticketUpdatedData = JSON.parse(
		(natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
	);
	expect(ticketUpdatedData.orderId).not.toBeDefined();
});

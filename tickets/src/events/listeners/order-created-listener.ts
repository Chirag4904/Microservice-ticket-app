import { Listener, OrderCreatedEvent, Subjects } from "@caticket/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket.model";

import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
	readonly subject = Subjects.OrderCreated;
	queueGroupName = queueGroupName;
	async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
		// Find the ticket that the order is being generated for
		const ticket = await Ticket.findById(data.ticket.id);
		// If no ticket, throw error
		if (!ticket) {
			throw new Error("Ticket not found");
		}
		// Mark the ticket as being reserved by setting its orderId property
		ticket.set({ orderId: data.id });
		// Save the ticket
		await ticket.save();

		// Publish a ticket updated event
		await new TicketUpdatedPublisher(this.client).publish({
			id:ticket.id,
			title: ticket.title,
			price: ticket.price,
			userId: ticket.userId,
			version: ticket.version,
			orderId: ticket.orderId
		})

		// Ack the message
		msg.ack();
	}
}

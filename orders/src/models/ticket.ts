import mongoose from "mongoose";
import { Order, OrderStatus } from "./order";

interface TicketAttrs {
	title: string;
	price: number;
}

export interface TicketDoc extends mongoose.Document {
	title: string;
	price: number;
	isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
	build(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
			min: 0,
		},
	},
	{
		toJSON: {
			transform(doc, ret) {
				ret.id = ret._id;
				delete ret._id;
			},
		},
	}
);

ticketSchema.statics.build = (attrs: TicketAttrs) => {
	return new Ticket(attrs);
};

ticketSchema.methods.isReserved = async function () {
	//this === ticket document on which we call isReserved

	//Run query to look at all the orders.Find an order where the ticket is the ticket we just found and the order status is NOT cancelled.
	//If we find an order from that it means that the ticket is reserved.
	const existingOrder = Order.findOne({
		ticket: this,
		status: {
			$in: [
				//@ts-ignore
				OrderStatus.Created,
				//@ts-ignore
				OrderStatus.AwaitingPayment,
				//@ts-ignore
				OrderStatus.Complete,
			],
		},
	});

	// !! to convert it to boolean
	return !!existingOrder;
};

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export { Ticket };

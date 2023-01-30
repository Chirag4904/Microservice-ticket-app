import { Publisher, OrderCancelledEvent, Subjects } from "@caticket/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
	subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}

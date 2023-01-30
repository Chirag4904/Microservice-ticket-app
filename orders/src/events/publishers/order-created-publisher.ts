import { Publisher, OrderCreatedEvent, Subjects } from "@caticket/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
	subject: Subjects.OrderCreated = Subjects.OrderCreated;
}

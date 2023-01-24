import { Publisher, Subjects, TicketUpdatedEvent } from "@caticket/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
	readonly subject = Subjects.TicketUpdated;
}

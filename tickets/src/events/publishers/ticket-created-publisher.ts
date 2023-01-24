import { Publisher, Subjects, TicketCreatedEvent } from "@caticket/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
	readonly subject = Subjects.TicketCreated;
}

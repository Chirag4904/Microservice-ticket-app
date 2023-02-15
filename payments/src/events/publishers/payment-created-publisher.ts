import { Subjects, Publisher, PaymentCreatedEvent } from "@caticket/common";
export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
	readonly subject = Subjects.PaymentCreated;
}

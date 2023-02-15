import { Subjects, Publisher, ExpirationCompleteEvent } from "@caticket/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
	readonly subject = Subjects.ExpirationComplete;
}

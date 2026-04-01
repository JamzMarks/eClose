export type DomainEvent = {
  name: string;
  aggregateId: string;
  occurredAt: Date;
  payload?: Record<string, unknown>;
};

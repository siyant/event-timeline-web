export type EventType = "Deployment" | "MetricAnomoly" | "LogAnomoly";

export interface RawEvent {
  type: EventType;
  short: string;
  description: string;
  time: string;
  user?: string;
  metric?: string;
}

export interface Event {
  id: string;
  type: EventType;
  short: string;
  description: string;
  time: Date;
  user?: string;
  metric?: string;
}

export interface TimelineEvent extends Event {
  notes?: string;
}

import type { EventType } from "@/lib/types";

interface EventTypeTagProps {
  type: EventType;
}

const getEventTypeColor = (type: EventType): string => {
  switch (type) {
    case "Deployment":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "MetricAnomoly":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "LogAnomoly":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export function EventTypeTag({ type }: EventTypeTagProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${getEventTypeColor(type)}`}
    >
      {type}
    </span>
  );
}
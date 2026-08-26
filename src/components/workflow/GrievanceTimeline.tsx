import React from 'react';

interface GrievanceTimelineProps {
  timeline: Array<{
    eventType: string;
    description: string;
    occurredAt: string; // ISO string
    actor?: string;
    metadata?: any;
  }>;
}

export function GrievanceTimeline({ timeline }: GrievanceTimelineProps) {
  if (timeline.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No timeline events yet.
      </div>
    );
  }

  // Sort by occurredAt descending (newest first)
  const sortedTimeline = [...timeline].sort((a, b) => 
    new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime()
  );

  return (
    <div className="space-y-4">
      {sortedTimeline.map((event, index) => (
        <div key={index} className="border-l-2 border-gray-200 pl-4 mb-4 last:mb-0">
          <div className="flex items-start mb-1">
            <div className="flex-shrink-0 h-3 w-3 bg-blue-500 rounded-full mt-0.5" />
            <div className="ml-3 flex-1">
              <h3 className="font-semibold text-gray-900">{event.eventType}</h3>
              <p className="text-sm text-gray-500">
                {new Date(event.occurredAt).toLocaleString()} 
                {event.actor && ` | `}
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-600">{event.description}</p>
          {event.metadata && (
            <div className="mt-2 text-xs text-gray-400 bg-gray-50 p-2 rounded">
              <pre className="whitespace-pre-wrap">{JSON.stringify(event.metadata, null, 2)}</pre>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

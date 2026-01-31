'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Calendar } from 'lucide-react';
import { ActivityCard } from './activity-card';
import { AddActivityForm } from './add-activity-form';
import { formatDate, formatCurrency } from '@/lib/utils';
import { type Day, type Activity, type ActivityCategory } from '@/types';

interface DayColumnProps {
  day: Day;
  dayNumber: number;
  currency: string;
  onAddActivity: (activity: {
    title: string;
    category: ActivityCategory;
    timeStart?: string;
    timeEnd?: string;
    locationText?: string;
    costEstimate?: number;
  }) => void;
  onUpdateActivity: (activityId: string, data: Partial<Activity>) => void;
  onDeleteActivity: (activityId: string) => void;
}

export function DayColumn({
  day,
  dayNumber,
  currency,
  onAddActivity,
  onUpdateActivity,
  onDeleteActivity,
}: DayColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: day.id,
  });

  const dayTotal = day.activities.reduce((sum, a) => sum + (a.costEstimate || 0), 0);

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3 sticky top-[72px] bg-gray-50 py-2 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-sm font-medium">
            {dayNumber}
          </div>
          <div>
            <h3 className="font-[family-name:var(--font-display)] font-semibold text-gray-800">
              Ngày {dayNumber}
            </h3>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(day.date)}
            </p>
          </div>
        </div>
        {dayTotal > 0 && (
          <span className="font-[family-name:var(--font-cost)] text-sm text-muted-foreground">
            {formatCurrency(dayTotal, currency)}
          </span>
        )}
      </div>

      <SortableContext items={day.activities.map(a => a.id)} strategy={verticalListSortingStrategy}>
        <div
          ref={setNodeRef}
          className={`space-y-2 min-h-[60px] rounded-lg transition-colors ${
            isOver ? 'bg-teal-50 border-2 border-dashed border-teal-200' : ''
          }`}
        >
          {day.activities.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              currency={currency}
              onUpdate={(data) => onUpdateActivity(activity.id, data)}
              onDelete={() => onDeleteActivity(activity.id)}
            />
          ))}
          
          {day.activities.length === 0 && !isOver && (
            <div className="text-center py-4 text-muted-foreground text-sm">
              Chưa có hoạt động nào
            </div>
          )}
        </div>
      </SortableContext>

      <div className="mt-3">
        <AddActivityForm onAdd={onAddActivity} />
      </div>
    </div>
  );
}

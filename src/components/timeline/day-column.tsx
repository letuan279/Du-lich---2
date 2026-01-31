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
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4 sticky top-[72px] bg-gradient-to-r from-teal-50 to-cyan-50 py-3 px-4 z-10 rounded-xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-teal-500 text-white flex items-center justify-center text-lg font-bold shadow-md">
            {dayNumber}
          </div>
          <div>
            <h3 className="font-[family-name:var(--font-display)] font-bold text-lg text-gray-800">
              Ngày {dayNumber}
            </h3>
            <p className="text-sm text-gray-500 flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-teal-500" />
              {formatDate(day.date)}
            </p>
          </div>
        </div>
        {dayTotal > 0 && (
          <div className="text-right">
            <span className="font-[family-name:var(--font-cost)] text-lg font-bold text-teal-600">
              {formatCurrency(dayTotal, currency)}
            </span>
          </div>
        )}
      </div>

      <SortableContext items={day.activities.map(a => a.id)} strategy={verticalListSortingStrategy}>
        <div
          ref={setNodeRef}
          className={`space-y-3 min-h-[80px] rounded-xl transition-colors p-2 ${
            isOver ? 'bg-teal-50 border-2 border-dashed border-teal-300' : ''
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
            <div className="text-center py-8 text-gray-400 text-base">
              📝 Chưa có hoạt động nào
            </div>
          )}
        </div>
      </SortableContext>

      <div className="mt-4">
        <AddActivityForm onAdd={onAddActivity} />
      </div>
    </div>
  );
}

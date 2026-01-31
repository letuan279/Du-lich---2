'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useMounted } from '@/hooks/use-mounted';
import { DndContext, DragStartEvent, DragEndEvent, DragOverEvent, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useTripStore } from '@/stores/trip-store';
import { TripHeader } from '@/components/trip/trip-header';
import { DayColumn } from '@/components/timeline/day-column';
import { ActivityCard } from '@/components/timeline/activity-card';
import { CostSummary } from '@/components/cost/cost-summary';
import type { Activity } from '@/types';

export default function TripEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const mounted = useMounted();
  const [activeActivity, setActiveActivity] = useState<Activity | null>(null);
  
  const trips = useTripStore((state) => state.trips);
  const updateTrip = useTripStore((state) => state.updateTrip);
  const addActivity = useTripStore((state) => state.addActivity);
  const updateActivity = useTripStore((state) => state.updateActivity);
  const deleteActivity = useTripStore((state) => state.deleteActivity);
  const reorderActivities = useTripStore((state) => state.reorderActivities);
  const moveActivityToDay = useTripStore((state) => state.moveActivityToDay);
  const getCostBreakdown = useTripStore((state) => state.getCostBreakdown);

  const trip = trips.find((t) => t.id === id);
  const breakdown = trip ? getCostBreakdown(trip.id) : { total: 0, perPerson: 0, byDay: [], byCategory: [] };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    if (mounted && !trip) {
      router.push('/');
    }
  }, [mounted, trip, router]);

  if (!mounted) {
    return (
      <div className="min-h-screen animate-pulse">
        <div className="h-16 bg-white border-b" />
        <div className="max-w-7xl mx-auto p-4 md:p-6">
          <div className="grid lg:grid-cols-[1fr,320px] gap-6">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-40 bg-gray-200 rounded-lg" />
              ))}
            </div>
            <div className="h-80 bg-gray-200 rounded-lg hidden lg:block" />
          </div>
        </div>
      </div>
    );
  }

  if (!trip) {
    return null;
  }

  const handleDragStart = (event: DragStartEvent) => {
    const activeId = String(event.active.id);
    const activity = trip.days
      .flatMap((d) => d.activities)
      .find((a) => a.id === activeId);
    setActiveActivity(activity || null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeDayId = trip.days.find((d) =>
      d.activities.some((a) => a.id === activeId)
    )?.id;
    
    const overDay = trip.days.find((d) => d.id === overId);
    const overActivityDay = trip.days.find((d) =>
      d.activities.some((a) => a.id === overId)
    );
    const overDayId = overDay?.id || overActivityDay?.id;

    if (activeDayId && overDayId && activeDayId !== overDayId) {
      moveActivityToDay(trip.id, activeId, overDayId);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveActivity(null);
    
    if (!over || active.id === over.id) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const dayWithActivity = trip.days.find((d) =>
      d.activities.some((a) => a.id === activeId)
    );

    if (dayWithActivity) {
      const isOverActivity = dayWithActivity.activities.some((a) => a.id === overId);
      if (isOverActivity) {
        reorderActivities(trip.id, dayWithActivity.id, activeId, overId);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TripHeader
        trip={trip}
        onUpdateTitle={(title) => updateTrip(trip.id, { title })}
      />

      <main className="max-w-7xl mx-auto p-4 md:p-6">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="grid lg:grid-cols-[1fr,320px] gap-6">
            <div>
              {trip.days.map((day, index) => (
                <DayColumn
                  key={day.id}
                  day={day}
                  dayNumber={index + 1}
                  currency={trip.currency}
                  onAddActivity={(activity) => addActivity(trip.id, day.id, activity)}
                  onUpdateActivity={(activityId, data) => updateActivity(trip.id, activityId, data)}
                  onDeleteActivity={(activityId) => deleteActivity(trip.id, activityId)}
                />
              ))}
            </div>

            <div className="hidden lg:block">
              <CostSummary
                breakdown={breakdown}
                currency={trip.currency}
                numberOfPeople={trip.numberOfPeople}
              />
            </div>
          </div>

          <DragOverlay>
            {activeActivity && (
              <ActivityCard
                activity={activeActivity}
                currency={trip.currency}
                onUpdate={() => {}}
                onDelete={() => {}}
                isDragging
              />
            )}
          </DragOverlay>
        </DndContext>

        {/* Mobile cost summary */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Tổng chi phí</p>
              <p className="font-[family-name:var(--font-cost)] text-xl font-bold text-teal-700">
                {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: trip.currency,
                  maximumFractionDigits: 0,
                }).format(breakdown.total)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Mỗi người</p>
              <p className="font-[family-name:var(--font-cost)] text-lg">
                {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: trip.currency,
                  maximumFractionDigits: 0,
                }).format(breakdown.perPerson)}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import { addDays, format, differenceInDays } from 'date-fns';
import type { Trip, Day, Activity, ActivityCategory, CostBreakdown } from '@/types';
import { DEFAULT_CURRENCY, DEFAULT_TIMEZONE, DEFAULT_NUMBER_OF_PEOPLE } from '@/lib/constants';
import { createSampleHaLongTrip } from '@/lib/sample-data';

interface TripStore {
  trips: Trip[];
  currentTripId: string | null;
  
  // Trip actions
  createTrip: (data: { title: string; startDate: string; endDate: string; numberOfPeople?: number; currency?: string }) => Trip;
  updateTrip: (tripId: string, data: Partial<Trip>) => void;
  deleteTrip: (tripId: string) => void;
  setCurrentTrip: (tripId: string | null) => void;
  
  // Day actions
  addDay: (tripId: string) => void;
  removeDay: (tripId: string, dayId: string) => void;
  
  // Activity actions
  addActivity: (tripId: string, dayId: string, activity: Omit<Activity, 'id' | 'dayId' | 'orderIndex'>) => void;
  updateActivity: (tripId: string, activityId: string, data: Partial<Activity>) => void;
  deleteActivity: (tripId: string, activityId: string) => void;
  reorderActivities: (tripId: string, dayId: string, activeId: string, overId: string) => void;
  moveActivityToDay: (tripId: string, activityId: string, newDayId: string) => void;
  
  // Computed
  getCurrentTrip: () => Trip | null;
  getCostBreakdown: (tripId: string) => CostBreakdown;
  
  // Initialize with sample data
  initializeSampleData: () => void;
}

function generateDaysForTrip(tripId: string, startDate: string, endDate: string): Day[] {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const dayCount = differenceInDays(end, start) + 1;
  
  return Array.from({ length: dayCount }, (_, index) => ({
    id: nanoid(),
    tripId,
    date: format(addDays(start, index), 'yyyy-MM-dd'),
    orderIndex: index,
    activities: [],
  }));
}

export const useTripStore = create<TripStore>()(
  persist(
    (set, get) => ({
      trips: [],
      currentTripId: null,
      
      createTrip: (data) => {
        const id = nanoid();
        const now = new Date().toISOString();
        const days = generateDaysForTrip(id, data.startDate, data.endDate);
        
        const newTrip: Trip = {
          id,
          title: data.title,
          startDate: data.startDate,
          endDate: data.endDate,
          timezone: DEFAULT_TIMEZONE,
          currency: data.currency || DEFAULT_CURRENCY,
          numberOfPeople: data.numberOfPeople || DEFAULT_NUMBER_OF_PEOPLE,
          days,
          costSettings: { splitMode: 'equal' },
          createdAt: now,
          updatedAt: now,
        };
        
        set((state) => ({
          trips: [...state.trips, newTrip],
          currentTripId: id,
        }));
        
        return newTrip;
      },
      
      updateTrip: (tripId, data) => {
        set((state) => ({
          trips: state.trips.map((trip) =>
            trip.id === tripId
              ? { ...trip, ...data, updatedAt: new Date().toISOString() }
              : trip
          ),
        }));
      },
      
      deleteTrip: (tripId) => {
        set((state) => ({
          trips: state.trips.filter((trip) => trip.id !== tripId),
          currentTripId: state.currentTripId === tripId ? null : state.currentTripId,
        }));
      },
      
      setCurrentTrip: (tripId) => {
        set({ currentTripId: tripId });
      },
      
      addDay: (tripId) => {
        set((state) => ({
          trips: state.trips.map((trip) => {
            if (trip.id !== tripId) return trip;
            const lastDay = trip.days[trip.days.length - 1];
            const newDate = lastDay 
              ? format(addDays(new Date(lastDay.date), 1), 'yyyy-MM-dd')
              : trip.startDate;
            return {
              ...trip,
              days: [
                ...trip.days,
                {
                  id: nanoid(),
                  tripId,
                  date: newDate,
                  orderIndex: trip.days.length,
                  activities: [],
                },
              ],
              endDate: newDate,
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },
      
      removeDay: (tripId, dayId) => {
        set((state) => ({
          trips: state.trips.map((trip) => {
            if (trip.id !== tripId || trip.days.length <= 1) return trip;
            return {
              ...trip,
              days: trip.days.filter((day) => day.id !== dayId),
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },
      
      addActivity: (tripId, dayId, activityData) => {
        set((state) => ({
          trips: state.trips.map((trip) => {
            if (trip.id !== tripId) return trip;
            return {
              ...trip,
              days: trip.days.map((day) => {
                if (day.id !== dayId) return day;
                return {
                  ...day,
                  activities: [
                    ...day.activities,
                    {
                      ...activityData,
                      id: nanoid(),
                      dayId,
                      orderIndex: day.activities.length,
                    },
                  ],
                };
              }),
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },
      
      updateActivity: (tripId, activityId, data) => {
        set((state) => ({
          trips: state.trips.map((trip) => {
            if (trip.id !== tripId) return trip;
            return {
              ...trip,
              days: trip.days.map((day) => ({
                ...day,
                activities: day.activities.map((activity) =>
                  activity.id === activityId ? { ...activity, ...data } : activity
                ),
              })),
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },
      
      deleteActivity: (tripId, activityId) => {
        set((state) => ({
          trips: state.trips.map((trip) => {
            if (trip.id !== tripId) return trip;
            return {
              ...trip,
              days: trip.days.map((day) => ({
                ...day,
                activities: day.activities.filter((a) => a.id !== activityId),
              })),
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },
      
      reorderActivities: (tripId, dayId, activeId, overId) => {
        set((state) => ({
          trips: state.trips.map((trip) => {
            if (trip.id !== tripId) return trip;
            return {
              ...trip,
              days: trip.days.map((day) => {
                if (day.id !== dayId) return day;
                const oldIndex = day.activities.findIndex((a) => a.id === activeId);
                const newIndex = day.activities.findIndex((a) => a.id === overId);
                if (oldIndex === -1 || newIndex === -1) return day;
                
                const newActivities = [...day.activities];
                const [removed] = newActivities.splice(oldIndex, 1);
                newActivities.splice(newIndex, 0, removed);
                
                return {
                  ...day,
                  activities: newActivities.map((a, i) => ({ ...a, orderIndex: i })),
                };
              }),
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },
      
      moveActivityToDay: (tripId, activityId, newDayId) => {
        set((state) => ({
          trips: state.trips.map((trip) => {
            if (trip.id !== tripId) return trip;
            
            let movedActivity: Activity | null = null;
            const daysWithoutActivity = trip.days.map((day) => {
              const activity = day.activities.find((a) => a.id === activityId);
              if (activity) movedActivity = activity;
              return {
                ...day,
                activities: day.activities.filter((a) => a.id !== activityId),
              };
            });
            
            if (!movedActivity) return trip;
            
            return {
              ...trip,
              days: daysWithoutActivity.map((day) => {
                if (day.id !== newDayId) return day;
                return {
                  ...day,
                  activities: [
                    ...day.activities,
                    { ...movedActivity!, dayId: newDayId, orderIndex: day.activities.length },
                  ],
                };
              }),
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },
      
      getCurrentTrip: () => {
        const state = get();
        return state.trips.find((trip) => trip.id === state.currentTripId) || null;
      },
      
      getCostBreakdown: (tripId) => {
        const trip = get().trips.find((t) => t.id === tripId);
        if (!trip) {
          return { total: 0, perPerson: 0, byDay: [], byCategory: [] };
        }
        
        let total = 0;
        const byDay: CostBreakdown['byDay'] = [];
        const categoryTotals: Record<ActivityCategory, number> = {
          transport: 0,
          food: 0,
          stay: 0,
          tickets: 0,
          other: 0,
        };
        
        for (const day of trip.days) {
          let dayTotal = 0;
          for (const activity of day.activities) {
            const cost = activity.costEstimate || 0;
            total += cost;
            dayTotal += cost;
            categoryTotals[activity.category] += cost;
          }
          byDay.push({ dayId: day.id, date: day.date, total: dayTotal });
        }
        
        const byCategory = Object.entries(categoryTotals)
          .map(([category, categoryTotal]) => ({
            category: category as ActivityCategory,
            total: categoryTotal,
          }))
          .filter((c) => c.total > 0);
        
        return {
          total,
          perPerson: trip.numberOfPeople > 0 ? Math.ceil(total / trip.numberOfPeople) : total,
          byDay,
          byCategory,
        };
      },
      
      initializeSampleData: () => {
        const state = get();
        if (state.trips.length === 0) {
          const sampleTrip = createSampleHaLongTrip();
          set({ trips: [sampleTrip], currentTripId: sampleTrip.id });
        }
      },
    }),
    {
      name: 'trip-planner-storage',
      onRehydrateStorage: () => (state) => {
        // Initialize sample data after rehydration if no trips exist
        if (state && state.trips.length === 0) {
          state.initializeSampleData();
        }
      },
    }
  )
);

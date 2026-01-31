export type ActivityCategory = 'transport' | 'food' | 'stay' | 'tickets' | 'other';

export type SplitMode = 'equal' | 'simple_custom';

export interface Activity {
  id: string;
  dayId: string;
  timeStart?: string;
  timeEnd?: string;
  title: string;
  locationText?: string;
  mapLink?: string;
  category: ActivityCategory;
  costEstimate?: number;
  notes?: string;
  orderIndex: number;
}

export interface Day {
  id: string;
  tripId: string;
  date: string;
  orderIndex: number;
  activities: Activity[];
}

export interface CostSettings {
  splitMode: SplitMode;
  simpleCustomExclusions?: {
    activityId: string;
    excludedCount?: number;
    excludedPeopleIndexes?: number[];
  }[];
}

export interface Trip {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  timezone: string;
  currency: string;
  numberOfPeople: number;
  notes?: string;
  days: Day[];
  costSettings: CostSettings;
  createdAt: string;
  updatedAt: string;
}

export interface CostBreakdown {
  total: number;
  perPerson: number;
  byDay: { dayId: string; date: string; total: number }[];
  byCategory: { category: ActivityCategory; total: number }[];
}

export const CATEGORY_COLORS: Record<ActivityCategory, { bg: string; text: string; border: string }> = {
  transport: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
  food: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200' },
  stay: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
  tickets: { bg: 'bg-pink-50', text: 'text-pink-600', border: 'border-pink-200' },
  other: { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200' },
};

export const CATEGORY_LABELS: Record<ActivityCategory, string> = {
  transport: 'Di chuyển',
  food: 'Ăn uống',
  stay: 'Lưu trú',
  tickets: 'Vé tham quan',
  other: 'Khác',
};

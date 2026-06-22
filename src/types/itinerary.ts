export type ActivityType =
  | "transport"
  | "accommodation"
  | "meal"
  | "attraction"
  | "activity"
  | "shopping"
  | "free_time"
  | "note";

export interface ActivityCost {
  amount: number;
  currency: string;
  included: boolean;
}

export interface ActivityLocation {
  name: string;
  address?: string;
  coordinates?: { lat: number; lng: number };
  mapsUrl?: string;
}

export interface Activity {
  id: string;
  time?: string;
  type: ActivityType;
  title: string;
  description?: string;
  duration?: string;
  cost?: ActivityCost;
  location?: ActivityLocation;
  tips?: string[];
  imageUrl?: string | null;
}

export interface DayMeals {
  breakfast?: string | null;
  lunch?: string | null;
  dinner?: string | null;
}

export interface ItineraryDay {
  dayNumber: number;
  title: string;
  date?: string | null;
  theme?: string;
  activities: Activity[];
  meals?: DayMeals;
  notes?: string;
}

export interface BudgetPerDay {
  budget?: number;
  mid?: number;
  luxury?: number;
  currency: string;
}

export interface PracticalInfo {
  currency?: string;
  language?: string;
  timezone?: string;
  transportation?: string;
  budgetPerDay?: BudgetPerDay;
  packingTips?: string[];
  emergencyContacts?: Record<string, string>;
}

export interface ItineraryMeta {
  version: string;
  lastUpdated: string;
  author?: string;
}

export interface ItineraryContent {
  destination: string;
  durationDays: number;
  summary?: string;
  highlights?: string[];
  days: ItineraryDay[];
  practicalInfo?: PracticalInfo;
  meta?: ItineraryMeta;
}

// Time slots configuration
export const TIME_SLOTS = [
  '08:30-09:00',
  '09:00-09:30',
  '09:30-10:00',
  '10:00-10:30',
  '10:30-11:00',
  '11:00-11:30',
  '11:30-12:00',
  '12:00-12:30',
  '12:30-13:00',
  '13:00-13:30',
  '13:30-14:00',
  '14:00-14:30',
  '14:30-15:00',
  '15:00-15:30',
  '15:30-16:00',
  '16:00-16:30'
] as const;

// Days of week
export const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday', 
  'Wednesday',
  'Thursday',
  'Friday'
] as const;

// Calendar period
export const CALENDAR_START_DATE = new Date(2025, 7, 26); // Aug 26, 2025 (Month is 0-indexed)
export const CALENDAR_END_DATE = new Date(2025, 11, 27); // Dec 27, 2025 (Last Friday of December)
export const TOTAL_WEEKS = 18; // Aug 26 to Dec 27, 2025 (18 weeks total)

// Differentiable color palette for interns
export const INTERN_COLORS = [
  '#3b82f6', // Blue
  '#ef4444', // Red
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#8b5cf6', // Violet
  '#06b6d4', // Cyan
  '#f97316', // Orange
  '#84cc16', // Lime
  '#ec4899', // Pink
  '#6366f1', // Indigo
  '#14b8a6', // Teal
  '#eab308', // Yellow
  '#a855f7', // Purple
  '#22c55e', // Green
  '#f43f5e', // Rose
  '#0ea5e9', // Sky
  '#d97706', // Amber-600
  '#7c3aed', // Violet-600
  '#dc2626', // Red-600
  '#059669'  // Emerald-600
] as const;

// Section options
export const SECTIONS = [
  'A', 'B', 'C', 'D', 'E', 'F', 'AI', 'DS', 'GA', 'CY'
] as const;

// Batch options 
export const BATCHES = [
  '2022', '2023', '2024', '2025'
] as const;

export type TimeSlot = typeof TIME_SLOTS[number];
export type DayOfWeek = typeof DAYS_OF_WEEK[number];
export type InternColor = typeof INTERN_COLORS[number];
export type Section = typeof SECTIONS[number];
export type Batch = typeof BATCHES[number];
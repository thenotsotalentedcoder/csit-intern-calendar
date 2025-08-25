import { addWeeks, format, getDay, startOfWeek } from 'date-fns';
import { CALENDAR_START_DATE, DAYS_OF_WEEK, DayOfWeek, TOTAL_WEEKS } from '../constants';

// Get the actual date for a specific week and day
export function getWeekDate(weekNumber: number, dayOfWeek: DayOfWeek): Date {
  const weekStart = addWeeks(CALENDAR_START_DATE, weekNumber);
  const dayIndex = DAYS_OF_WEEK.indexOf(dayOfWeek);
  const actualWeekStart = startOfWeek(weekStart, { weekStartsOn: 1 }); // Start on Monday
  
  const targetDate = new Date(actualWeekStart);
  targetDate.setDate(targetDate.getDate() + dayIndex);
  
  return targetDate;
}

// Get week dates for display
export function getWeekDates(weekNumber: number): { day: DayOfWeek; date: Date; formatted: string }[] {
  return DAYS_OF_WEEK.map(day => {
    const date = getWeekDate(weekNumber, day);
    return {
      day,
      date,
      formatted: format(date, 'MMM dd')
    };
  });
}

// Format time to 12-hour format with AM/PM
export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  return `${hour12}:${minutes.toString().padStart(2, '0')} ${period}`;
}

// Format time slot for display in 12-hour format
export function formatTimeSlot(timeSlot: string): string {
  const [start, end] = timeSlot.split('-');
  return `${formatTime(start)} - ${formatTime(end)}`;
}

// Get next available color for new intern
export function getNextInternColor(usedColors: string[], availableColors: readonly string[]): string {
  const unusedColors = availableColors.filter(color => !usedColors.includes(color));
  return unusedColors.length > 0 ? unusedColors[0] : availableColors[usedColors.length % availableColors.length];
}

// Get current week index based on today's date
export function getCurrentWeekIndex(): number {
  const today = new Date();
  const startDate = new Date(CALENDAR_START_DATE);
  
  // Calculate difference in milliseconds
  const diffTime = today.getTime() - startDate.getTime();
  
  // Convert to days
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  // Calculate week index (0-based)
  const weekIndex = Math.floor(diffDays / 7);
  
  // Ensure we stay within bounds
  return Math.max(0, Math.min(weekIndex, TOTAL_WEEKS - 1));
}

// Check if a week has ended (Friday has passed)
export function hasWeekEnded(weekIndex: number): boolean {
  const today = new Date();
  const weekEndDate = getWeekDate(weekIndex, 'Friday');
  
  return today > weekEndDate;
}
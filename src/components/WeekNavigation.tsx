'use client';

import { Button } from "@/components/ui/button";
import { Calendar, ArrowLeft, ArrowRight, CalendarDays } from "lucide-react";
import { getWeekDates } from "@/lib/utils/calendar";
import { TOTAL_WEEKS } from "@/lib/constants";

interface WeekNavigationProps {
  currentWeek: number;
  onWeekChange: (week: number) => void;
}

export function WeekNavigation({ currentWeek, onWeekChange }: WeekNavigationProps) {
  const weekDates = getWeekDates(currentWeek);
  const startDate = weekDates[0].formatted;
  const endDate = weekDates[4].formatted;

  const canGoPrevious = currentWeek > 0;
  const canGoNext = currentWeek < TOTAL_WEEKS - 1;

  return (
    <div className="glass-card rounded-2xl p-6 shadow-xl animate-fade-in hover-lift">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Previous Week Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onWeekChange(currentWeek - 1)}
          disabled={!canGoPrevious}
          className="flex items-center gap-2 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 order-1 sm:order-1"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Previous Week</span>
          <span className="sm:hidden">Previous</span>
        </Button>

        {/* Current Week Display */}
        <div className="text-center order-2 sm:order-2">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-xl">
              <CalendarDays className="h-5 w-5 text-primary" />
            </div>
            <span className="text-sm font-medium text-muted-foreground font-mono">
              Week {currentWeek + 1} • {TOTAL_WEEKS} Total
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-heading font-semibold text-foreground">
            {startDate} - {endDate}, 2026
          </div>
        </div>

        {/* Next Week Button */}
        <Button
          variant="outline" 
          size="sm"
          onClick={() => onWeekChange(currentWeek + 1)}
          disabled={!canGoNext}
          className="flex items-center gap-2 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 order-3 sm:order-3"
        >
          <span className="hidden sm:inline">Next Week</span>
          <span className="sm:hidden">Next</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
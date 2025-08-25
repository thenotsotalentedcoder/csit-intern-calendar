'use client';

import { ScheduleCell } from "./ScheduleCell";
import { formatTimeSlot, getWeekDates } from "@/lib/utils/calendar";
import { TIME_SLOTS, DayOfWeek } from "@/lib/constants";
import { IIntern } from "@/lib/models/Intern";
import { IMasterTemplate } from "@/lib/models/MasterTemplate";
import { Calendar } from "lucide-react";

interface CalendarGridProps {
  currentWeek: number;
  masterTemplates: IMasterTemplate[];
  interns: IIntern[];
  onCellClick: (dayOfWeek: DayOfWeek, timeSlot: string) => void;
  selectedCell?: { dayOfWeek: DayOfWeek; timeSlot: string } | null;
}

export function CalendarGrid({ 
  currentWeek, 
  masterTemplates,
  interns,
  onCellClick,
  selectedCell 
}: CalendarGridProps) {
  const weekDates = getWeekDates(currentWeek);

  // Get interns for a specific day/time slot
  const getInternsForSlot = (dayOfWeek: DayOfWeek, timeSlot: string): IIntern[] => {
    const template = masterTemplates.find(
      t => t.dayOfWeek === dayOfWeek && t.timeSlot === timeSlot
    );
    
    if (!template || !template.internIds.length) return [];
    
    return template.internIds
      .map(id => interns.find(intern => intern._id === id))
      .filter(Boolean) as IIntern[];
  };

  const isSelected = (dayOfWeek: DayOfWeek, timeSlot: string) => {
    return selectedCell?.dayOfWeek === dayOfWeek && selectedCell?.timeSlot === timeSlot;
  };

  return (
    <div className="w-full calendar-grid animate-fade-in hover-lift">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent px-4 sm:px-6 py-4 sm:py-6 border-b border-border/30">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-xl w-fit">
            <Calendar className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-foreground">
              Intern Availability Schedule
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Click on any time slot to assign interns
            </p>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[800px] lg:min-w-0">
          {/* Day Headers */}
          <div className="grid grid-cols-6 border-b border-border/30 bg-gradient-to-r from-muted/30 to-muted/10">
            <div className="p-3 sm:p-4 text-center font-semibold text-xs sm:text-sm text-muted-foreground border-r border-border/30 font-mono">
              TIME
            </div>
            {weekDates.map(({ day, formatted }) => (
              <div key={day} className="p-3 sm:p-4 text-center border-r border-border/30 last:border-r-0 hover:bg-primary/5 transition-colors">
                <div className="text-sm font-semibold text-foreground font-display">{day}</div>
                <div className="text-xs text-muted-foreground mt-1 font-mono">{formatted}</div>
              </div>
            ))}
          </div>

          {/* Time Slots */}
          <div className="">
            {TIME_SLOTS.map((timeSlot, index) => (
              <div 
                key={timeSlot} 
                className="calendar-row border-b border-border/20 last:border-b-0 hover:bg-primary/[0.02] transition-all duration-300 group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Time Column */}
                <div className="calendar-time-cell p-2 sm:p-3 text-center border-r border-border/30 bg-gradient-to-r from-muted/20 to-transparent group-hover:bg-muted/30 transition-colors">
                  <div className="text-xs sm:text-sm font-medium text-foreground font-mono">
                    {formatTimeSlot(timeSlot)}
                  </div>
                </div>
                
                {/* Day Columns */}
                {weekDates.map(({ day }) => (
                  <div key={`${day}-${timeSlot}`} className="border-r border-border/20 last:border-r-0 flex">
                    <ScheduleCell
                      interns={getInternsForSlot(day, timeSlot)}
                      timeSlot={timeSlot}
                      dayOfWeek={day}
                      onClick={() => onCellClick(day, timeSlot)}
                      isSelected={isSelected(day, timeSlot)}
                      className="border-0 rounded-none flex-1"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
'use client';

import { IIntern } from "@/lib/models/Intern";
import { InternBadge } from "./InternBadge";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

interface ScheduleCellProps {
  interns: IIntern[];
  timeSlot: string;
  dayOfWeek: string;
  onClick?: () => void;
  isSelected?: boolean;
  className?: string;
}

export function ScheduleCell({ 
  interns, 
  timeSlot, 
  dayOfWeek, 
  onClick,
  isSelected = false,
  className 
}: ScheduleCellProps) {
  const hasInterns = interns.length > 0;
  const multipleInterns = interns.length > 1;

  // Dynamic height calculation based on number of interns
  const getCellHeight = () => {
    if (interns.length === 0) return "h-16 sm:h-20 min-h-16 sm:min-h-20";
    if (interns.length === 1) return "h-20 sm:h-24 min-h-20 sm:min-h-24";
    if (interns.length === 2) return "h-28 sm:h-32 min-h-28 sm:min-h-32";
    if (interns.length === 3) return "h-36 sm:h-40 min-h-36 sm:min-h-40";
    return "h-44 sm:h-48 min-h-44 sm:min-h-48"; // 4+ interns
  };

  return (
    <div
      className={cn(
        "group relative p-2 sm:p-3 transition-all duration-300 cursor-pointer",
        "hover:bg-primary/5 hover:shadow-sm",
        "flex flex-col justify-start items-start gap-1.5",
        getCellHeight(), // Dynamic height
        hasInterns ? "bg-primary/[0.02]" : "hover:bg-muted/30",
        isSelected && "ring-2 ring-primary ring-offset-0 bg-primary/10",
        className
      )}
      onClick={onClick}
    >
      {/* Empty state */}
      {!hasInterns && (
        <div className="flex items-center justify-center h-full w-full">
          <div className="flex flex-col items-center gap-1 opacity-0 group-hover:opacity-60 transition-opacity">
            <Plus className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            <div className="text-xs text-muted-foreground font-medium">
              Assign
            </div>
          </div>
        </div>
      )}

      {/* Intern badges */}
      {hasInterns && (
        <div className="flex flex-col gap-1.5 w-full h-full justify-start">
          {interns.slice(0, 4).map((intern, index) => (
            <InternBadge 
              key={`${intern._id}-${index}`}
              intern={intern}
              size="sm"
              showAvatar={interns.length <= 2} // Show avatars only when 2 or fewer
            />
          ))}
          
          {/* Show count if more than 4 interns */}
          {interns.length > 4 && (
            <div className="text-xs text-muted-foreground font-medium bg-muted/50 px-2 py-1 rounded-full text-center mt-auto">
              +{interns.length - 4} more
            </div>
          )}
        </div>
      )}

      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-primary rounded-full shadow-sm" />
      )}
    </div>
  );
}
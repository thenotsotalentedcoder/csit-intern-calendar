'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { InternBadge } from "./InternBadge";
import { formatTimeSlot } from "@/lib/utils/calendar";
import { DayOfWeek } from "@/lib/constants";
import { IIntern } from "@/lib/models/Intern";
import { Users, Clock, Calendar, Check, X } from "lucide-react";

interface InternAssignmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  dayOfWeek: DayOfWeek | null;
  timeSlot: string | null;
  allInterns: IIntern[];
  currentlyAssignedIds: string[];
  onAssignInterns: (internIds: string[]) => Promise<void>;
  weekNumber: number;
}

export function InternAssignmentDialog({
  isOpen,
  onClose,
  dayOfWeek,
  timeSlot,
  allInterns,
  currentlyAssignedIds,
  onAssignInterns,
  weekNumber
}: InternAssignmentDialogProps) {
  const [selectedInternIds, setSelectedInternIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Reset selection when dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      setSelectedInternIds([...currentlyAssignedIds]);
    }
  }, [isOpen, currentlyAssignedIds]);

  const handleInternToggle = (internId: string) => {
    setSelectedInternIds(prev => 
      prev.includes(internId)
        ? prev.filter(id => id !== internId)
        : [...prev, internId]
    );
  };

  const handleSave = async () => {
    if (!dayOfWeek || !timeSlot) return;
    
    setIsLoading(true);
    try {
      await onAssignInterns(selectedInternIds);
      onClose();
    } catch (error) {
      console.error('Error assigning interns:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedInterns = allInterns.filter(intern => 
    selectedInternIds.includes(intern._id)
  );

  if (!dayOfWeek || !timeSlot) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Assign Interns to Time Slot
          </DialogTitle>
        </DialogHeader>

        {/* Time Slot Info */}
        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{dayOfWeek}</span>
            <span className="text-muted-foreground">• Week {weekNumber + 1}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{formatTimeSlot(timeSlot)}</span>
          </div>
        </div>

        {/* Current Selection Summary */}
        {selectedInterns.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              Selected Interns ({selectedInterns.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {selectedInterns.map(intern => (
                <InternBadge key={intern._id} intern={intern} size="sm" />
              ))}
            </div>
          </div>
        )}

        {/* Intern Selection */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">
            Available Interns ({allInterns.length})
          </h4>
          
          {allInterns.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No interns available.</p>
              <p className="text-xs">Add interns first to assign them to time slots.</p>
            </div>
          ) : (
            <div className="grid gap-2 max-h-64 overflow-y-auto">
              {allInterns.map(intern => {
                const isSelected = selectedInternIds.includes(intern._id);
                
                return (
                  <div
                    key={intern._id}
                    className={`
                      flex items-center justify-between p-3 rounded-lg border cursor-pointer
                      transition-all duration-200 hover:bg-muted/50
                      ${isSelected 
                        ? 'border-primary bg-primary/5 shadow-sm' 
                        : 'border-border hover:border-border/80'
                      }
                    `}
                    onClick={() => handleInternToggle(intern._id)}
                  >
                    <div className="flex items-center gap-3">
                      <InternBadge intern={intern} size="sm" />
                      <div className="text-xs text-muted-foreground">
                        Section {intern.section} • Batch {intern.batch}
                      </div>
                    </div>
                    
                    <div className={`
                      w-5 h-5 rounded-full border-2 flex items-center justify-center
                      ${isSelected 
                        ? 'border-primary bg-primary' 
                        : 'border-border'
                      }
                    `}>
                      {isSelected && (
                        <Check className="h-3 w-3 text-primary-foreground" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {selectedInterns.length} intern{selectedInterns.length !== 1 ? 's' : ''} selected
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              <Check className="h-4 w-4 mr-2" />
              {isLoading ? "Saving..." : "Save Assignment"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
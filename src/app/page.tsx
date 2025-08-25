'use client';

import { useState, useEffect } from "react";
import { CalendarGrid } from "@/components/CalendarGrid";
import { WeekNavigation } from "@/components/WeekNavigation";
import { InternAssignmentDialog } from "@/components/InternAssignmentDialog";
import { AddInternForm } from "@/components/AddInternForm";
import { InternManagementCard } from "@/components/InternManagementCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InternBadge } from "@/components/InternBadge";
import { Calendar, Users, Clock, Plus } from "lucide-react";
import { DayOfWeek } from "@/lib/constants";
import { IIntern } from "@/lib/models/Intern";
import { IMasterTemplate } from "@/lib/models/MasterTemplate";
import { sampleInterns, sampleMasterTemplates } from "@/lib/sampleData";
import { getCurrentWeekIndex } from "@/lib/utils/calendar";

interface SelectedCell {
  dayOfWeek: DayOfWeek;
  timeSlot: string;
}

export default function InternCalendarPage() {
  // State management
  // Auto-advance to current week based on today's date
  const [currentWeek, setCurrentWeek] = useState(() => {
    // Only run on client side to avoid hydration mismatch
    if (typeof window !== 'undefined') {
      return getCurrentWeekIndex();
    }
    return 0;
  });
  const [interns, setInterns] = useState<IIntern[]>([]);
  const [masterTemplates, setMasterTemplates] = useState<IMasterTemplate[]>([]);
  const [selectedCell, setSelectedCell] = useState<SelectedCell | null>(null);
  const [isAssignmentDialogOpen, setIsAssignmentDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data on component mount and set current week
  useEffect(() => {
    fetchInitialData();
    
    // Auto-advance to current week on client side
    const currentWeekIndex = getCurrentWeekIndex();
    setCurrentWeek(currentWeekIndex);
  }, []);

  const fetchInitialData = async () => {
    setIsLoading(true);
    setError(null);
    console.log('🔄 Fetching initial data...');
    
    try {
      console.log('📡 Making API calls to /api/interns and /api/master-templates');
      const [internsResponse, templatesResponse] = await Promise.all([
        fetch('/api/interns', {
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store'
        }),
        fetch('/api/master-templates', {
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store'
        })
      ]);

      console.log('📊 API Response Status:', {
        interns: internsResponse.status,
        templates: templatesResponse.status
      });

      if (!internsResponse.ok) {
        const errorText = await internsResponse.text();
        console.error('❌ Interns API Error:', errorText);
        throw new Error(`Failed to fetch interns: ${internsResponse.status} ${errorText}`);
      }

      if (!templatesResponse.ok) {
        const errorText = await templatesResponse.text();
        console.error('❌ Templates API Error:', errorText);
        throw new Error(`Failed to fetch templates: ${templatesResponse.status} ${errorText}`);
      }

      const [internsData, templatesData] = await Promise.all([
        internsResponse.json(),
        templatesResponse.json()
      ]);

      console.log('📋 Fetched Data:', {
        internsCount: internsData?.data?.length || 0,
        templatesCount: templatesData?.data?.length || 0,
        internsSuccess: internsData?.success,
        templatesSuccess: templatesData?.success
      });

      if (internsData.success) {
        setInterns(internsData.data || []);
      } else {
        console.error('❌ Interns data error:', internsData.error);
        throw new Error(internsData.error || 'Failed to fetch interns');
      }

      if (templatesData.success) {
        setMasterTemplates(templatesData.data || []);
      } else {
        console.error('❌ Templates data error:', templatesData.error);
        throw new Error(templatesData.error || 'Failed to fetch templates');
      }
      
      console.log('✅ Initial data loaded successfully');
    } catch (error) {
      console.error('💥 Error fetching initial data:', error);
      console.log('🔄 Falling back to sample data for UI demonstration');
      
      // Use sample data as fallback for UI demonstration
      setInterns(sampleInterns);
      setMasterTemplates(sampleMasterTemplates);
      setError('Using sample data - check console for database connection details');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle cell click
  const handleCellClick = (dayOfWeek: DayOfWeek, timeSlot: string) => {
    setSelectedCell({ dayOfWeek, timeSlot });
    setIsAssignmentDialogOpen(true);
  };

  // Handle intern assignment
  const handleAssignInterns = async (internIds: string[]) => {
    if (!selectedCell) return;

    try {
      const response = await fetch('/api/master-templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dayOfWeek: selectedCell.dayOfWeek,
          timeSlot: selectedCell.timeSlot,
          internIds,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to assign interns');
      }

      const result = await response.json();
      
      if (result.success) {
        // Update local state
        setMasterTemplates(prev => {
          const existingIndex = prev.findIndex(
            t => t.dayOfWeek === selectedCell.dayOfWeek && t.timeSlot === selectedCell.timeSlot
          );

          if (existingIndex >= 0) {
            // Update existing template
            const updated = [...prev];
            updated[existingIndex] = result.data;
            return updated;
          } else {
            // Add new template
            return [...prev, result.data];
          }
        });
      } else {
        throw new Error(result.error || 'Failed to assign interns');
      }
    } catch (error) {
      console.error('Error assigning interns:', error);
      setError(error instanceof Error ? error.message : 'Failed to assign interns');
    }
  };

  // Handle adding new intern
  const handleAddIntern = async (internData: Omit<IIntern, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch('/api/interns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(internData),
      });

      if (!response.ok) {
        throw new Error('Failed to add intern');
      }

      const result = await response.json();
      
      if (result.success) {
        setInterns(prev => [...prev, result.data]);
      } else {
        throw new Error(result.error || 'Failed to add intern');
      }
    } catch (error) {
      console.error('Error adding intern:', error);
      throw error; // Re-throw to be handled by the form
    }
  };

  // Handle deleting intern
  const handleDeleteIntern = async (internId: string) => {
    try {
      const response = await fetch(`/api/interns/${internId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete intern');
      }

      const result = await response.json();
      
      if (result.success) {
        setInterns(prev => prev.filter(intern => intern._id !== internId));
        // Also update master templates to remove the deleted intern
        setMasterTemplates(prev => 
          prev.map(template => ({
            ...template,
            internIds: template.internIds.filter(id => id !== internId)
          }))
        );
      } else {
        throw new Error(result.error || 'Failed to delete intern');
      }
    } catch (error) {
      console.error('Error deleting intern:', error);
      throw error;
    }
  };

  // Get currently assigned intern IDs for selected cell
  const getCurrentlyAssignedIds = (): string[] => {
    if (!selectedCell) return [];
    
    const template = masterTemplates.find(
      t => t.dayOfWeek === selectedCell.dayOfWeek && t.timeSlot === selectedCell.timeSlot
    );
    
    return template?.internIds || [];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10 flex items-center justify-center p-4">
        <div className="text-center space-y-6 glass-card p-8 rounded-3xl max-w-md animate-scale-in">
          <div className="relative mx-auto w-16 h-16 flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/60 rounded-2xl animate-pulse opacity-20"></div>
            <Calendar className="w-8 h-8 text-primary animate-bounce z-10" />
            <div className="absolute inset-0 animate-spin">
              <div className="h-16 w-16 border-2 border-transparent border-t-primary/40 border-r-primary/20 rounded-2xl"></div>
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-xl font-display font-semibold text-foreground">Loading Intern Calendar</p>
            <p className="text-sm text-muted-foreground font-mono">Connecting to database and fetching data...</p>
            <div className="flex justify-center space-x-1 mt-4">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 sm:space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <div className="p-3 sm:p-4 glass rounded-2xl">
              <Calendar className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold bg-gradient-to-r from-foreground via-primary to-foreground/70 bg-clip-text text-transparent tracking-tight">
                Intern Calendar
              </h1>
              <div className="text-sm sm:text-base text-primary/80 font-medium mt-1 font-heading">
                NED University • Computer Science
              </div>
            </div>
          </div>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4">
            Intern availability and scheduling management dashboard
            <br className="hidden sm:block" />
            <span className="text-sm text-muted-foreground/80">• Aug 2025 - Dec 2025</span>
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-destructive">
                <span className="text-sm font-medium">Error:</span>
                <span className="text-sm">{error}</span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={fetchInitialData}
                  className="ml-auto"
                >
                  Retry
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 animate-slide-up">
          <Card className="glass-card border-0 shadow-xl hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Interns</CardTitle>
              <div className="p-2 bg-blue-500/10 rounded-xl">
                <Users className="h-4 w-4 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-heading font-bold text-foreground">{interns.length}</div>
              <p className="text-xs text-muted-foreground mt-1 font-mono">Active in system</p>
            </CardContent>
          </Card>
          
          <Card className="glass-card border-0 shadow-xl hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Scheduled Slots</CardTitle>
              <div className="p-2 bg-green-500/10 rounded-xl">
                <Clock className="h-4 w-4 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-heading font-bold text-foreground">
                {masterTemplates.filter(t => t.internIds.length > 0).length}
              </div>
              <p className="text-xs text-muted-foreground mt-1 font-mono">Time slots filled</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-0 shadow-xl hover-lift sm:col-span-2 lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Quick Actions</CardTitle>
              <div className="p-2 bg-primary/10 rounded-xl">
                <Plus className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <AddInternForm 
                existingInterns={interns}
                onAddIntern={handleAddIntern}
                trigger={
                  <Button className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Intern
                  </Button>
                }
              />
            </CardContent>
          </Card>
        </div>

        {/* Week Navigation */}
        <WeekNavigation 
          currentWeek={currentWeek}
          onWeekChange={setCurrentWeek}
        />

        {/* Calendar Grid - Main Focus */}
        <CalendarGrid
          currentWeek={currentWeek}
          masterTemplates={masterTemplates}
          interns={interns}
          onCellClick={handleCellClick}
          selectedCell={selectedCell}
        />

        {/* Intern Management - Moved to Bottom */}
        <div className="pt-4 border-t border-border/30">
          <InternManagementCard 
            interns={interns}
            onDeleteIntern={handleDeleteIntern}
          />
        </div>

        {/* Assignment Dialog */}
        <InternAssignmentDialog
          isOpen={isAssignmentDialogOpen}
          onClose={() => {
            setIsAssignmentDialogOpen(false);
            setSelectedCell(null);
          }}
          dayOfWeek={selectedCell?.dayOfWeek || null}
          timeSlot={selectedCell?.timeSlot || null}
          allInterns={interns}
          currentlyAssignedIds={getCurrentlyAssignedIds()}
          onAssignInterns={handleAssignInterns}
          weekNumber={currentWeek}
        />
      </div>
    </div>
  );
}
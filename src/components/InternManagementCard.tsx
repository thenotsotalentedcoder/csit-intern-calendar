'use client';

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InternBadge } from "./InternBadge";
import { IIntern } from "@/lib/models/Intern";
import { Users, Trash2, AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface InternManagementCardProps {
  interns: IIntern[];
  onDeleteIntern: (internId: string) => Promise<void>;
}

export function InternManagementCard({ interns, onDeleteIntern }: InternManagementCardProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<IIntern | null>(null);

  const handleDelete = async (intern: IIntern) => {
    setDeletingId(intern._id);
    try {
      await onDeleteIntern(intern._id);
      setConfirmDelete(null);
    } catch (error) {
      console.error('Error deleting intern:', error);
    } finally {
      setDeletingId(null);
    }
  };

  if (interns.length === 0) {
    return (
      <Card className="glass-card hover-lift animate-fade-in">
        <CardHeader>
          <CardTitle className="text-lg font-display flex items-center gap-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            Active Interns
          </CardTitle>
          <CardDescription>
            No interns registered yet. Add some interns to get started.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <>
      <Card className="glass-card hover-lift animate-fade-in">
        <CardHeader>
          <CardTitle className="text-lg font-display flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Active Interns ({interns.length})
          </CardTitle>
          <CardDescription>
            All registered interns available for scheduling
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {interns.map((intern) => (
              <div 
                key={intern._id} 
                className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all duration-300 group"
              >
                <div className="flex items-center gap-3">
                  <InternBadge intern={intern} size="md" />
                  <div className="text-sm text-muted-foreground font-mono">
                    Section {intern.section} • Batch {intern.batch}
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setConfirmDelete(intern)}
                  className="opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive hover:bg-destructive/10 transition-all duration-300"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!confirmDelete} onOpenChange={() => setConfirmDelete(null)}>
        <DialogContent className="glass-card border-0 animate-scale-in">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive font-display">
              <AlertTriangle className="h-5 w-5" />
              Delete Intern
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{confirmDelete?.name}</strong>? 
              This will remove them from all scheduled time slots and cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button 
              variant="outline" 
              onClick={() => setConfirmDelete(null)}
              disabled={deletingId !== null}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => confirmDelete && handleDelete(confirmDelete)}
              disabled={deletingId !== null}
              className="hover:bg-destructive/90"
            >
              {deletingId === confirmDelete?._id ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, UserPlus } from "lucide-react";
import { SECTIONS, BATCHES, INTERN_COLORS } from "@/lib/constants";
import { getNextInternColor } from "@/lib/utils/calendar";
import { IIntern } from "@/lib/models/Intern";

const internSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name cannot exceed 100 characters"),
  section: z.string().min(1, "Section is required"),
  batch: z.string().min(1, "Batch is required"),
});

type InternFormData = z.infer<typeof internSchema>;

interface AddInternFormProps {
  existingInterns: IIntern[];
  onAddIntern: (intern: Omit<IIntern, '_id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  trigger?: React.ReactNode;
}

export function AddInternForm({ existingInterns, onAddIntern, trigger }: AddInternFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<InternFormData>({
    resolver: zodResolver(internSchema),
    defaultValues: {
      name: "",
      section: "",
      batch: "",
    },
  });

  const onSubmit = async (data: InternFormData) => {
    setIsLoading(true);
    try {
      const usedColors = existingInterns.map(intern => intern.color);
      const newColor = getNextInternColor(usedColors, INTERN_COLORS);

      await onAddIntern({
        name: data.name,
        section: data.section,
        batch: data.batch,
        color: newColor,
        avatar: undefined,
      });

      form.reset();
      setIsOpen(false);
    } catch (error) {
      console.error('Error adding intern:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const defaultTrigger = (
    <Button className="flex items-center gap-2">
      <Plus className="h-4 w-4" />
      Add Intern
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] glass-card border-0 animate-scale-in">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Add New Intern
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter intern's full name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="section"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">Section</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="hover:border-primary/50 transition-colors">
                          <SelectValue placeholder="Section" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {SECTIONS.map((section) => (
                          <SelectItem key={section} value={section}>
                            Section {section}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="batch"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">Batch</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="hover:border-primary/50 transition-colors">
                          <SelectValue placeholder="Batch" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {BATCHES.map((batch) => (
                          <SelectItem key={batch} value={batch}>
                            Batch {batch}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Color Preview */}
            <div className="space-y-2">
              <FormLabel>Assigned Color</FormLabel>
              <div className="flex items-center gap-2">
                <div 
                  className="w-6 h-6 rounded-full border-2 border-border"
                  style={{ 
                    backgroundColor: getNextInternColor(
                      existingInterns.map(i => i.color), 
                      INTERN_COLORS
                    ) 
                  }}
                />
                <span className="text-sm text-muted-foreground">
                  Automatically assigned unique color
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Adding..." : "Add Intern"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
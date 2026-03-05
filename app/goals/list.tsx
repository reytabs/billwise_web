"use client";

import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { IconDots } from "@tabler/icons-react";
import { Target } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useGoals } from "@/app/goals/GoalsContext";
import { Goal } from "@/app/goals/GoalsContext";
import { z } from "zod";
import axios from "axios";
import api from "@/lib/api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldGroup } from "@/components/ui/field";
import { Progress } from "@/components/ui/progress";

const goalSchema = z.object({
  name: z
    .string()
    .min(1, "Goal name is required")
    .min(3, "Goal name must be at least 3 characters"),
  target_amount: z
    .string()
    .refine(
      (val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0,
      "Target amount must be a non-negative number",
    ),
  current_amount: z
    .string()
    .refine(
      (val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0,
      "Current amount must be a non-negative number",
    ),
  target_date: z
    .date()
    .refine((date) => date instanceof Date, "Target date is required"),
  category: z.string().min(1, "Category is required"),
});

type GoalFormData = z.infer<typeof goalSchema>;

const CATEGORIES = [
  "Emergency Fund",
  "Vacation",
  "Home",
  "Car",
  "Education",
  "Retirement",
  "Other",
];

function extractNumeric(value: string | number | undefined): string {
  if (value == null) return "";
  if (typeof value === "number") return String(value);
  const cleaned = String(value).replace(/[^0-9.]/g, "");
  return cleaned || "";
}

export default function GoalListPage() {
  const { goals, loading, loadGoals } = useGoals();
  const skeletonCount = Math.max(goals.length, 3);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {loading ? (
        Array.from({ length: skeletonCount }).map((_, i) => (
          <GoalCardSkeleton key={`skeleton-${i}`} />
        ))
      ) : goals.length === 0 ? (
        <div className="col-span-full text-center py-12 text-slate-500">
          No goals yet. Create your first goal to get started.
        </div>
      ) : (
        goals.map((goal) => (
          <GoalCard
            key={goal._id ?? goal.name}
            goal={goal}
            reloadGoals={loadGoals}
          />
        ))
      )}
    </div>
  );
}

function GoalCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 w-full">
          <Skeleton className="w-12 h-12 rounded-xl" />
          <div className="flex-1">
            <Skeleton className="h-5 w-24 mb-2" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
        <Skeleton className="w-8 h-8 rounded" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-2 w-full rounded-full" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  );
}

function GoalCard({
  goal,
  reloadGoals,
}: {
  goal: Goal;
  reloadGoals: () => Promise<void>;
}) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [date, setDate] = useState<Date>();
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [formData, setFormData] = useState<GoalFormData>({
    name: goal.name || "",
    target_amount: extractNumeric(goal.target_amount),
    current_amount: extractNumeric(goal.current_amount),
    target_date: new Date(goal.target_date),
    category: goal.category || "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof GoalFormData, string>>
  >({});

  useEffect(() => {
    if (isEditOpen) {
      const initialDate = new Date(goal.target_date);
      setDate(initialDate);
      setFormData({
        name: goal.name || "",
        target_amount: extractNumeric(goal.target_amount),
        current_amount: extractNumeric(goal.current_amount),
        target_date: initialDate,
        category: goal.category || "",
      });
      setErrors({});
    }
  }, [isEditOpen, goal]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
      setFormData((prev) => ({ ...prev, target_date: newDate }));
    }
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!goal._id) return;

    setLoadingEdit(true);
    setErrors({});

    try {
      const parsed = goalSchema.parse(formData);
      const payload = {
        ...parsed,
        target_amount: parseFloat(parsed.target_amount),
        current_amount: parseFloat(parsed.current_amount),
      };

      await Promise.all([
        api.put(`/goals/${goal._id}`, payload),
        new Promise((r) => setTimeout(r, 1000)),
      ]);

      toast.success("Success", {
        description: "Goal updated successfully",
      });

      await reloadGoals();
      setIsEditOpen(false);
    } catch (err: unknown) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof GoalFormData, string>> = {};
        err.issues.forEach((issue: z.ZodIssue) => {
          const path = issue.path[0] as keyof GoalFormData;
          fieldErrors[path] = issue.message;
        });
        setErrors(fieldErrors);
      } else if (axios.isAxiosError(err)) {
        const errorMsg = err.response?.data?.message || "Failed to update goal";
        toast.error("Error", { description: errorMsg });
      } else {
        toast.error("Error", {
          description: "An unexpected error occurred",
        });
      }
    } finally {
      setLoadingEdit(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!goal._id) return;

    setDeleting(true);
    try {
      await Promise.all([
        api.delete(`/goals/${goal._id}`),
        new Promise((r) => setTimeout(r, 1000)),
      ]);
      toast.success("Success", {
        description: "Goal deleted successfully",
      });
      setIsDeleteOpen(false);
      await reloadGoals();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const errorMsg = err.response?.data?.message || "Failed to delete goal";
        toast.error("Error", { description: errorMsg });
      } else {
        toast.error("Error", {
          description: "An unexpected error occurred",
        });
      }
    } finally {
      setDeleting(false);
    }
  };

  const target = parseFloat(extractNumeric(goal.target_amount)) || 1;
  const current = parseFloat(extractNumeric(goal.current_amount)) || 0;
  const progress = Math.min(100, Math.round((current / target) * 100));

  const targetDateStr = new Date(goal.target_date).toLocaleDateString(
    undefined,
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  );

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-sky-500">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">{goal.name}</h3>
            <p className="text-xs text-slate-400 capitalize">{goal.category}</p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
              size="icon"
            >
              <IconDots />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => setIsDeleteOpen(true)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="space-y-3">
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-bold text-slate-900">
            {goal.current_amount}
          </span>
          <span className="text-sm text-slate-500">of {goal.target_amount}</span>
        </div>
        <Progress value={progress} className="h-2" />
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-slate-600">
            {progress}% complete
          </span>
          <span className="text-slate-400">Target: {targetDateStr}</span>
        </div>
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-lg">
          <form onSubmit={handleEditSubmit}>
            <DialogHeader className="mb-5">
              <DialogTitle>Edit Goal</DialogTitle>
              <DialogDescription>
                Update your goal details. Click save when you&apos;re done.
              </DialogDescription>
            </DialogHeader>
            <div className="no-scrollbar -mx-4 max-h-[50vh] overflow-y-auto px-4">
              <FieldGroup>
                <Field>
                  <Label htmlFor="edit-goal-name">Goal Name</Label>
                  <Input
                    id="edit-goal-name"
                    name="name"
                    placeholder="e.g., Emergency Fund"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600 mt-1">{errors.name}</p>
                  )}
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <Label htmlFor="edit-target-amount">Target Amount</Label>
                    <Input
                      id="edit-target-amount"
                      name="target_amount"
                      placeholder="0.00"
                      value={formData.target_amount}
                      onChange={handleInputChange}
                    />
                    {errors.target_amount && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.target_amount}
                      </p>
                    )}
                  </Field>
                  <Field>
                    <Label htmlFor="edit-current-amount">Current Amount</Label>
                    <Input
                      id="edit-current-amount"
                      name="current_amount"
                      placeholder="0.00"
                      value={formData.current_amount}
                      onChange={handleInputChange}
                    />
                    {errors.current_amount && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.current_amount}
                      </p>
                    )}
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <Label htmlFor="edit-goal-category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(val) =>
                        handleSelectChange("category", val)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {CATEGORIES.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {errors.category && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.category}
                      </p>
                    )}
                  </Field>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Field>
                        <Label htmlFor="edit-target-date">Target Date</Label>
                        <Button
                          type="button"
                          variant="outline"
                          data-empty={!date}
                          className="data-[empty=true]:text-muted-foreground w-full justify-between text-left font-normal"
                        >
                          {date ? (
                            format(date, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </Field>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={handleDateChange}
                        defaultMonth={date}
                      />
                      {errors.target_date && (
                        <p className="text-sm text-red-600 mt-1 p-2">
                          {errors.target_date}
                        </p>
                      )}
                    </PopoverContent>
                  </Popover>
                </div>
              </FieldGroup>
            </div>
            <DialogFooter className="mt-5">
              <DialogClose asChild>
                <Button variant="outline" disabled={loadingEdit}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={loadingEdit}>
                {loadingEdit ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-md" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Delete goal</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{goal.name}&quot;? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-5">
            <DialogClose asChild>
              <Button variant="outline" disabled={deleting}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

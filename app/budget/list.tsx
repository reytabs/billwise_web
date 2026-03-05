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
import { Skeleton } from "@/components/ui/skeleton";
import { useBudget } from "@/app/budget/BudgetContext";
import type { Budget } from "@/app/budget/BudgetContext";
import { useAccounts } from "@/app/accounts/AccountsContext";
import { useGoals } from "@/app/goals/GoalsContext";
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

const budgetSchema = z.object({
  category: z.string().min(1, "Category is required"),
  budget_amount: z
    .string()
    .refine(
      (val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0,
      "Amount must be a non-negative number",
    ),
  month: z.number().min(1).max(12),
  year: z.number().min(2020).max(2100),
  account_id: z.string().optional(),
  goal_id: z.string().optional(),
});

type BudgetFormData = z.infer<typeof budgetSchema>;

const BUDGET_CATEGORIES = [
  "Housing",
  "Utilities",
  "Entertainment",
  "Healthcare",
  "Shopping",
  "Personal",
  "Education",
  "Savings",
  "Food & Dining",
  "Transport",
  "Other",
];

function extractNumeric(value: string | number | undefined): string {
  if (value == null) return "";
  if (typeof value === "number") return String(value);
  const cleaned = String(value).replace(/[^0-9.]/g, "");
  return cleaned || "";
}

function getCategoryEmoji(category: string): string {
  const c = category?.toLowerCase() || "";
  if (c.includes("housing") || c.includes("rent")) return "🏠";
  if (c.includes("utilities")) return "💡";
  if (c.includes("entertainment")) return "🎬";
  if (c.includes("health")) return "🏥";
  if (c.includes("shopping")) return "🛒";
  if (c.includes("personal")) return "👤";
  if (c.includes("education")) return "📚";
  if (c.includes("savings")) return "💰";
  if (c.includes("food") || c.includes("dining")) return "🍔";
  if (c.includes("transport")) return "🚗";
  return "📁";
}

export default function BudgetListPage() {
  const { budgets, loading, loadBudgets } = useBudget();
  const skeletonCount = Math.max(budgets.length, 3);

  return (
    <div className="mt-8 space-y-4">
      {loading ? (
        Array.from({ length: skeletonCount }).map((_, i) => (
          <BudgetCardSkeleton key={`skeleton-${i}`} />
        ))
      ) : budgets.length === 0 ? (
        <div className="text-center py-12 text-slate-500 bg-white rounded-2xl border border-slate-100">
          No budgets for this month. Add a budget to get started.
        </div>
      ) : (
        budgets.map((budget) => (
          <BudgetCard
            key={budget._id ?? `${budget.category}-${budget.month}-${budget.year}`}
            budget={budget}
            reloadBudgets={() => loadBudgets()}
          />
        ))
      )}
    </div>
  );
}

function BudgetCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3 w-full">
          <Skeleton className="w-10 h-10 rounded-xl" />
          <div className="flex-1">
            <Skeleton className="h-5 w-32 mb-1" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <Skeleton className="w-8 h-8 rounded" />
      </div>
      <Skeleton className="h-2 w-full rounded-full" />
    </div>
  );
}

function BudgetCard({
  budget,
  reloadBudgets,
}: {
  budget: Budget;
  reloadBudgets: () => Promise<void>;
}) {
  const { accounts } = useAccounts();
  const { goals } = useGoals();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [periodDate, setPeriodDate] = useState<Date>(() => {
    const d = new Date(budget.year, (budget.month ?? 1) - 1, 1);
    return d;
  });

  const [formData, setFormData] = useState<BudgetFormData>({
    category: budget.category || "",
    budget_amount: extractNumeric(budget.budget_amount),
    month: budget.month ?? new Date().getMonth() + 1,
    year: budget.year ?? new Date().getFullYear(),
    account_id: budget.account_id || "",
    goal_id: budget.goal_id || "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof BudgetFormData, string>>
  >({});

  useEffect(() => {
    if (isEditOpen) {
      const d = new Date(budget.year, (budget.month ?? 1) - 1, 1);
      setPeriodDate(d);
      setFormData({
        category: budget.category || "",
        budget_amount: extractNumeric(budget.budget_amount),
        month: budget.month ?? d.getMonth() + 1,
        year: budget.year ?? d.getFullYear(),
        account_id: budget.account_id || "",
        goal_id: budget.goal_id || "",
      });
      setErrors({});
    }
  }, [isEditOpen, budget]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    if (name === "month" || name === "year") {
      const num = parseInt(value, 10);
      setFormData((prev) => ({ ...prev, [name]: num }));
      const d = new Date(periodDate);
      if (name === "month") d.setMonth(num - 1);
      else d.setFullYear(num);
      setPeriodDate(d);
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePeriodDateChange = (date: Date | undefined) => {
    if (date) {
      setPeriodDate(date);
      setFormData((prev) => ({
        ...prev,
        month: date.getMonth() + 1,
        year: date.getFullYear(),
      }));
    }
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!budget._id) return;

    setLoadingEdit(true);
    setErrors({});

    try {
      const parsed = budgetSchema.parse(formData);
      const payload = {
        category: parsed.category,
        budget_amount: parseFloat(parsed.budget_amount),
        month: parsed.month,
        year: parsed.year,
        account_id: parsed.account_id || undefined,
        goal_id: parsed.goal_id || undefined,
      };

      await Promise.all([
        api.put(`/budgets/${budget._id}`, payload),
        new Promise((r) => setTimeout(r, 1000)),
      ]);

      toast.success("Success", {
        description: "Budget updated successfully",
      });

      await reloadBudgets();
      setIsEditOpen(false);
    } catch (err: unknown) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Partial<
          Record<keyof BudgetFormData, string>
        > = {};
        err.issues.forEach((issue: z.ZodIssue) => {
          const path = issue.path[0] as keyof BudgetFormData;
          fieldErrors[path] = issue.message;
        });
        setErrors(fieldErrors);
      } else if (axios.isAxiosError(err)) {
        const errorMsg =
          err.response?.data?.message || "Failed to update budget";
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
    if (!budget._id) return;

    setDeleting(true);
    try {
      await Promise.all([
        api.delete(`/budgets/${budget._id}`),
        new Promise((r) => setTimeout(r, 1000)),
      ]);
      toast.success("Success", {
        description: "Budget deleted successfully",
      });
      setIsDeleteOpen(false);
      await reloadBudgets();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const errorMsg =
          err.response?.data?.message || "Failed to delete budget";
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

  const amountNum = parseFloat(extractNumeric(budget.budget_amount)) || 1;
  const spentNum = parseFloat(extractNumeric(budget.spent)) || 0;
  const progress = Math.min(100, Math.round((spentNum / amountNum) * 100));

  const linkedAccount = budget.account_id
    ? accounts.find((a) => a._id === budget.account_id)
    : null;
  const linkedGoal = budget.goal_id
    ? goals.find((g) => g._id === budget.goal_id)
    : null;

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg bg-primary/10">
            {getCategoryEmoji(budget.category)}
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">{budget.category}</h3>
            <p className="text-sm text-slate-500">
              {budget.spent ?? "₱0"} of {budget.budget_amount}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold text-slate-900">{progress}%</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 data-[state=open]:bg-muted text-muted-foreground"
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
      </div>
      <Progress value={progress} className="h-2" />
      {(linkedAccount || linkedGoal) && (
        <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
          {linkedAccount && (
            <span>Account: {linkedAccount.account_name}</span>
          )}
          {linkedGoal && <span>Goal: {linkedGoal.name}</span>}
        </div>
      )}

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-lg">
          <form onSubmit={handleEditSubmit}>
            <DialogHeader className="mb-5">
              <DialogTitle>Edit Budget</DialogTitle>
              <DialogDescription>
                Update budget category and amount. Optionally link an account
                or goal.
              </DialogDescription>
            </DialogHeader>
            <div className="no-scrollbar -mx-4 max-h-[50vh] overflow-y-auto px-4">
              <FieldGroup>
                <Field>
                  <Label>Category</Label>
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
                        {BUDGET_CATEGORIES.map((cat) => (
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
                <Field>
                  <Label>Budget Amount</Label>
                  <Input
                    name="budget_amount"
                    placeholder="0.00"
                    value={formData.budget_amount}
                    onChange={handleInputChange}
                  />
                  {errors.budget_amount && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.budget_amount}
                    </p>
                  )}
                </Field>
                <Field>
                  <Label>Budget Period</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full justify-between text-left font-normal"
                      >
                        {format(periodDate, "MMMM yyyy")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={periodDate}
                        onSelect={handlePeriodDateChange}
                        defaultMonth={periodDate}
                      />
                    </PopoverContent>
                  </Popover>
                </Field>
                <Field>
                  <Label>Link to Account (Optional)</Label>
                  <Select
                    value={formData.account_id || "none"}
                    onValueChange={(val) =>
                      handleSelectChange(
                        "account_id",
                        val === "none" ? "" : val,
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="None" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {accounts.map((acc) => (
                        <SelectItem key={acc._id} value={acc._id!}>
                          {acc.account_name} ({acc.bank_name})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <Label>Link to Goal (Optional)</Label>
                  <Select
                    value={formData.goal_id || "none"}
                    onValueChange={(val) =>
                      handleSelectChange("goal_id", val === "none" ? "" : val)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="None" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {goals.map((g) => (
                        <SelectItem key={g._id} value={g._id!}>
                          {g.name} ({g.category})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
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
            <DialogTitle>Delete budget</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the budget for
              &quot;{budget.category}&quot;? This action cannot be undone.
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

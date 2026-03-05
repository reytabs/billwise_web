"use client";

import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";
import { z } from "zod";
import axios from "axios";
import api from "@/lib/api";
import { useBudget } from "@/app/budget/BudgetContext";
import { useAccounts } from "@/app/accounts/AccountsContext";
import { useGoals } from "@/app/goals/GoalsContext";
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
  DialogTrigger,
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
import { useState } from "react";

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

export default function BudgetCreatePage() {
  const { addBudget, loadBudgets, month, year } = useBudget();
  const { accounts } = useAccounts();
  const { goals } = useGoals();
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [periodDate, setPeriodDate] = useState<Date>(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });

  const [formData, setFormData] = useState<BudgetFormData>({
    category: "",
    budget_amount: "0",
    month,
    year,
    account_id: "",
    goal_id: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof BudgetFormData, string>>
  >({});

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
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

      const [response] = await Promise.all([
        api.post("/budgets", payload),
        new Promise((r) => setTimeout(r, 1000)),
      ]);

      toast.success("Success", {
        description: "Budget created successfully",
      });

      try {
        addBudget(response.data);
        loadBudgets(parsed.month, parsed.year);
      } catch {
        // fallback
      }

      setFormData({
        category: "",
        budget_amount: "0",
        month,
        year,
        account_id: "",
        goal_id: "",
      });
      setPeriodDate(() => {
        const d = new Date();
        d.setDate(1);
        return d;
      });
      setIsOpen(false);
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
          err.response?.data?.message || "Failed to create budget";
        toast.error("Error", { description: errorMsg });
      } else {
        toast.error("Error", { description: "An unexpected error occurred" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="lg"
            className="cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 gap-2"
          >
            <IconPlus className="text-white" />
            <span className="hidden lg:inline text-white">Add Budget</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg">
          <form onSubmit={handleSubmit}>
            <DialogHeader className="mb-5">
              <DialogTitle>Add Budget</DialogTitle>
              <DialogDescription>
                Set a budget for a category. Optionally link an account or goal.
              </DialogDescription>
            </DialogHeader>
            <div className="no-scrollbar -mx-4 max-h-[50vh] overflow-y-auto px-4">
              <FieldGroup>
                <Field>
                  <Label htmlFor="budget-category">Category</Label>
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
                  <Label htmlFor="budget-amount">Budget Amount</Label>
                  <Input
                    id="budget-amount"
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
                  <Label>Budget Period (Month / Year)</Label>
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
                        <SelectItem
                          key={acc._id}
                          value={acc._id!}
                        >
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
                      handleSelectChange(
                        "goal_id",
                        val === "none" ? "" : val,
                      )
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
                <Button variant="outline" disabled={loading}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={loading}>
                {loading ? (
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
    </div>
  );
}

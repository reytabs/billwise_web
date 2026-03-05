"use client";

import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";
import { z } from "zod";
import axios from "axios";
import api from "@/lib/api";
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

export default function GoalCreatePage() {
  const { addGoal, loadGoals } = useGoals();
  const [date, setDate] = useState<Date | undefined>(() => new Date());
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [formData, setFormData] = useState<GoalFormData>({
    name: "",
    target_amount: "",
    current_amount: "0",
    target_date: new Date(),
    category: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof GoalFormData, string>>
  >({});

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const parsed = goalSchema.parse(formData);
      const payload = {
        ...parsed,
        target_amount: parseFloat(parsed.target_amount),
        current_amount: parseFloat(parsed.current_amount),
      };

      const [response] = await Promise.all([
        api.post("/goals", payload),
        new Promise((r) => setTimeout(r, 1000)),
      ]);

      toast.success("Success", {
        description: "Goal created successfully",
      });

      try {
        addGoal(response.data);
        loadGoals();
      } catch {
        // fallback refresh
      }

      const now = new Date();
      setFormData({
        name: "",
        target_amount: "",
        current_amount: "0",
        target_date: now,
        category: "",
      });
      setDate(now);
      setIsOpen(false);
    } catch (err: unknown) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof GoalFormData, string>> = {};
        err.issues.forEach((issue: z.ZodIssue) => {
          const path = issue.path[0] as keyof GoalFormData;
          fieldErrors[path] = issue.message;
        });
        setErrors(fieldErrors);
      } else if (axios.isAxiosError(err)) {
        const errorMsg = err.response?.data?.message || "Failed to create goal";
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
            className="cursor-pointer color: inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 gap-2"
          >
            <IconPlus className="text-white" />
            <span className="hidden lg:inline text-white">New Goal</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg">
          <form onSubmit={handleSubmit}>
            <DialogHeader className="mb-5">
              <DialogTitle>Create New Goal</DialogTitle>
              <DialogDescription>
                Add a new financial goal. Click save when you&apos;re done.
              </DialogDescription>
            </DialogHeader>
            <div className="no-scrollbar -mx-4 max-h-[50vh] overflow-y-auto px-4">
              <FieldGroup>
                <Field>
                  <Label htmlFor="goal-name">Goal Name</Label>
                  <Input
                    id="goal-name"
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
                    <Label htmlFor="target-amount">Target Amount</Label>
                    <Input
                      id="target-amount"
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
                    <Label htmlFor="current-amount">Current Amount</Label>
                    <Input
                      id="current-amount"
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
                    <Label htmlFor="goal-category">Category</Label>
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
                        <Label htmlFor="target-date">Target Date</Label>
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

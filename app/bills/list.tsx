"use client";

import { useState, useEffect, useMemo } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { IconDots } from "@tabler/icons-react";
import { CircleCheck, Clock, RefreshCcw, Tag } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useBills } from "@/app/bills/BillsContext";
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
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

interface Bill {
  _id?: string;
  name: string;
  category: string;
  amount: string;
  due_date: string;
  status: string;
  is_recurring?: boolean;
  frequency?: string;
}

type BillFilter = "all" | "upcoming" | "overdue" | "recurring" | "paid";

interface BillListPageProps {
  filter?: BillFilter;
  search?: string;
}

export default function BillListPage({
  filter = "all",
  search = "",
}: BillListPageProps) {
  const { bills, loading, loadBills } = useBills();

  // derive a filtered list based on the active tab value and search query
  const filteredBills = useMemo(() => {
    // base filter by tab
    let base = bills;
    if (filter === "paid") base = bills.filter((b) => b.status === "Paid");
    else if (filter === "recurring")
      base = bills.filter((b) => b.frequency != "");
    else if (filter === "upcoming")
      base = bills.filter((b) => b.status === "Upcoming");
    else if (filter === "overdue")
      base = bills.filter((b) => b.status === "Overdue");

    // apply search if present
    if (!search || !search.trim()) return base;
    const q = search.toLowerCase().trim();
    return base.filter((b) => {
      const name = (b.name || "").toLowerCase();
      const cat = (b.category || "").toLowerCase();
      const amount = String(b.amount || "").toLowerCase();
      return name.includes(q) || cat.includes(q) || amount.includes(q);
    });
  }, [bills, filter, search]);

  // console.log("Bills loaded:", bills);
  // console.log("Filtered bills (", filter, "):", filteredBills);
  // console.log("Loading state:", loading);

  // when loading, show placeholder cards equal to the bills length (or at least 3)
  const skeletonCount = Math.max(bills.length, 3);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {loading ? (
        <>
          {Array.from({ length: skeletonCount }).map((_, i) => (
            <BillCardSkeleton key={`skeleton-${i}`} />
          ))}
        </>
      ) : (
        filteredBills.map((bill) => (
          <BillCard
            key={bill._id ?? bill.name}
            bill={bill}
            reloadBills={loadBills}
          />
        ))
      )}
    </div>
  );
}

function BillCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 w-full">
          <Skeleton className="w-8 h-8 rounded" />
          <div className="flex-1">
            <Skeleton className="h-5 w-32 mb-2" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <Skeleton className="w-8 h-8 rounded" />
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-7 w-20" />
          <Skeleton className="h-6 w-16 rounded" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </div>
  );
}

// ----- Zod Schema and form types for editing ----------
const billSchema = z.object({
  name: z
    .string()
    .min(1, "Bill name is required")
    .min(3, "Bill name must be at least 3 characters"),
  amount: z
    .string()
    .refine(
      (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
      "Amount must be a positive number",
    ),
  due_date: z
    .date()
    .refine((date) => date instanceof Date, "Due date is required"),
  category: z.string().min(1, "Category is required"),
  status: z.string().min(1, "Status is required"),
  is_recurring: z.boolean(),
  frequency: z.string().optional(),
  notes: z.string().optional(),
});

type BillFormData = z.infer<typeof billSchema>;

function extractNumericAmount(formatted: string | number | undefined): string {
  if (formatted == null) return "";
  if (typeof formatted === "number") return String(formatted);
  const cleaned = formatted.replace(/[^0-9.]/g, "");
  return cleaned || "";
}

function BillCard({
  bill,
  reloadBills,
}: {
  bill: Bill;
  reloadBills: () => Promise<void>;
}) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [date, setDate] = useState<Date>();
  const [enabled, setEnabled] = useState<boolean>(!!bill.is_recurring);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [formData, setFormData] = useState<BillFormData>({
    name: bill.name || "",
    amount: extractNumericAmount(bill.amount),
    due_date: new Date(bill.due_date),
    category: bill.category || "",
    status: bill.status || "",
    is_recurring: !!bill.is_recurring,
    frequency: bill.frequency || "",
    notes: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof BillFormData, string>>
  >({});

  useEffect(() => {
    if (isEditOpen) {
      const initialDate = new Date(bill.due_date);
      setDate(initialDate);
      setEnabled(!!bill.is_recurring);
      setFormData({
        name: bill.name || "",
        amount: extractNumericAmount(bill.amount),
        due_date: initialDate,
        category: bill.category || "",
        status: bill.status || "",
        is_recurring: !!bill.is_recurring,
        frequency: bill.frequency || "",
        notes: "",
      });
      setErrors({});
    }
  }, [isEditOpen, bill]);

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
      setFormData((prev) => ({ ...prev, due_date: newDate }));
    }
  };

  const handleRecurringChange = (checked: boolean) => {
    setEnabled(checked);
    setFormData((prev) => ({ ...prev, is_recurring: checked }));
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!bill._id) return;

    setLoadingEdit(true);
    setErrors({});

    try {
      const parsed = billSchema.parse(formData);

      await api.put(`/bills/${bill._id}`, parsed);

      toast.success("Success", {
        description: "Bill updated successfully",
      });

      try {
        await reloadBills();
      } catch {
        // ignore reload errors; UI will eventually refresh
      }

      setIsEditOpen(false);
    } catch (err: unknown) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof BillFormData, string>> = {};
        err.issues.forEach((issue: z.ZodIssue) => {
          const path = issue.path[0] as keyof BillFormData;
          fieldErrors[path] = issue.message;
        });
        setErrors(fieldErrors);
      } else if (axios.isAxiosError(err)) {
        const errorMsg = err.response?.data?.message || "Failed to update bill";
        toast.error("Error", {
          description: errorMsg,
        });
        console.error("API Error:", err.response?.data);
      } else {
        toast.error("Error", {
          description: "An unexpected error occurred",
        });
        console.error("Unexpected error:", err);
      }
    } finally {
      setLoadingEdit(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!bill._id) return;

    setDeleting(true);
    try {
      await api.delete(`/bills/${bill._id}`);
      toast.success("Success", {
        description: "Bill deleted successfully",
      });
      setIsDeleteOpen(false);
      try {
        await reloadBills();
      } catch {
        // ignore reload errors
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const errorMsg = err.response?.data?.message || "Failed to delete bill";
        toast.error("Error", {
          description: errorMsg,
        });
        console.error("API Error:", err.response?.data);
      } else {
        toast.error("Error", {
          description: "An unexpected error occurred",
        });
        console.error("Unexpected error:", err);
      }
    } finally {
      setDeleting(false);
    }
  };
  // helper that returns an icon element + styling based on category
  const renderCategoryIcon = () => {
    const cat = bill.category?.toLowerCase() || "";

    if (cat.includes("utilities")) {
      return <div className="p-2 bg-yellow-100 rounded-lg">⚡</div>;
    } else if (cat.includes("rent")) {
      return <div className="p-2 bg-blue-100 rounded-lg">🏠</div>;
    } else if (cat.includes("insurance")) {
      return <div className="p-2 bg-green-100 rounded-lg">🛡️</div>;
    } else if (cat.includes("subscription")) {
      return <div className="p-2 bg-indigo-100 rounded-lg">🔁</div>;
    } else if (cat.includes("loan")) {
      return <div className="p-2 bg-pink-100 rounded-lg">💰</div>;
    } else if (cat.includes("credit")) {
      return <div className="p-2 bg-gray-100 rounded-lg">💳</div>;
    }

    // default / other
    return (
      <div className="p-2 bg-slate-100 rounded-lg">
        <Tag className="w-5 h-5 text-slate-600" />
      </div>
    );
  };

  const dueDate = new Date(bill.due_date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const statusLabel =
    bill.status === "Paid" ? (
      <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent shadow hover:bg-primary/80 gap-1 bg-emerald-50 text-emerald-600">
        <CircleCheck />
        Paid
      </div>
    ) : bill.status === "Upcoming" ? (
      <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent shadow hover:bg-primary/80 gap-1 bg-amber-50 text-amber-600">
        <Clock />
        Upcoming
      </div>
    ) : bill.status === "Overdue" ? (
      <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent shadow hover:bg-primary/80 gap-1 bg-red-50 text-red-600">
        <Clock />
        Overdue
      </div>
    ) : null;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-2xl">{renderCategoryIcon()}</div>
          <div>
            <h3 className="font-semibold text-slate-900">{bill.name}</h3>
            <p className="text-xs text-slate-400 capitalize">{bill.category}</p>
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
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-slate-700">
            {bill.amount}
          </span>
          {statusLabel}
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Due date</span>
          <span className="font-medium text-slate-700">{dueDate}</span>
        </div>
        {bill.frequency && (
          <div className="flex items-center gap-2 text-xs text-indigo-600 bg-indigo-50 px-3 py-2 rounded-lg">
            <RefreshCcw />
            Recurring - {bill.frequency}
          </div>
        )}
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-lg">
          <form onSubmit={handleEditSubmit}>
            <DialogHeader className="mb-5">
              <DialogTitle>Edit Bill</DialogTitle>
              <DialogDescription>
                Update your bill details here. Click save when you&apos;re done.
              </DialogDescription>
            </DialogHeader>
            <div className="no-scrollbar -mx-4 max-h-[50vh] overflow-y-auto px-4">
              <FieldGroup>
                <Field>
                  <Label htmlFor="edit-name">Bill Name</Label>
                  <Input
                    id="edit-name"
                    name="name"
                    placeholder="e.g., Electric Bill"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600 mt-1">{errors.name}</p>
                  )}
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <Label htmlFor="edit-amount">Amount</Label>
                    <Input
                      id="edit-amount"
                      name="amount"
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={handleInputChange}
                    />
                    {errors.amount && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.amount}
                      </p>
                    )}
                  </Field>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Field>
                        <Label htmlFor="edit-due-date">Due Date</Label>
                        <Button
                          type="button"
                          variant="outline"
                          data-empty={!date}
                          className="data-[empty=true]:text-muted-foreground w-53 justify-between text-left font-normal"
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
                      {errors.due_date && (
                        <p className="text-sm text-red-600 mt-1 p-2">
                          {errors.due_date}
                        </p>
                      )}
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <Label htmlFor="edit-category">Category</Label>
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
                          <SelectItem value="Utilities">Utilities</SelectItem>
                          <SelectItem value="Rent">Rent</SelectItem>
                          <SelectItem value="Insurance">Insurance</SelectItem>
                          <SelectItem value="Subscription">
                            Subscription
                          </SelectItem>
                          <SelectItem value="Loan">Loan</SelectItem>
                          <SelectItem value="Credit Card">
                            Credit Card
                          </SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
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
                    <Label htmlFor="edit-status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(val) => handleSelectChange("status", val)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="Upcoming">Upcoming</SelectItem>
                          <SelectItem value="Paid">Paid</SelectItem>
                          <SelectItem value="Overdue">Overdue</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {errors.status && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.status}
                      </p>
                    )}
                  </Field>
                </div>
                <FieldLabel htmlFor="edit-switch-recurring">
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldTitle>Recurring Bill</FieldTitle>
                      <FieldDescription>
                        This bill repeats automatically.
                      </FieldDescription>
                    </FieldContent>
                    <Switch
                      id="edit-switch-recurring"
                      checked={enabled}
                      onCheckedChange={handleRecurringChange}
                    />
                  </Field>
                </FieldLabel>
                {enabled && (
                  <Field>
                    <Label htmlFor="edit-frequency">Frequency</Label>
                    <Select
                      value={formData.frequency || ""}
                      onValueChange={(val) =>
                        handleSelectChange("frequency", val)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="Weekly">Weekly</SelectItem>
                          <SelectItem value="Monthly">Monthly</SelectItem>
                          <SelectItem value="Quarterly">Quarterly</SelectItem>
                          <SelectItem value="Yearly">Yearly</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                )}
                <Field>
                  <FieldLabel htmlFor="edit-notes">Notes (optional)</FieldLabel>
                  <Textarea
                    id="edit-notes"
                    name="notes"
                    placeholder="Add any additional details or notes about this bill here."
                    value={formData.notes || ""}
                    onChange={handleInputChange}
                  />
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
            <DialogTitle>Delete bill</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{bill.name}&quot;? This action
              cannot be undone.
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

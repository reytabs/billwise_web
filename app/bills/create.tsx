"use client";

import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";
import { z } from "zod";
import axios from "axios";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { useBills } from "@/app/bills/BillsContext";
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
import { useState } from "react";
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

// ----- Zod Schema -----------
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

export default function BillCreatePage() {
  const router = useRouter();
  const { addBill, loadBills } = useBills();

  const [date, setDate] = useState<Date>();
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [formData, setFormData] = useState<BillFormData>({
    name: "",
    amount: "",
    due_date: new Date(),
    category: "",
    status: "",
    is_recurring: false,
    frequency: "",
    notes: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof BillFormData, string>>
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
      // schema expects due_date so update that property
      setFormData((prev) => ({ ...prev, due_date: newDate }));
    }
  };

  const handleRecurringChange = (checked: boolean) => {
    setEnabled(checked);
    setFormData((prev) => ({ ...prev, is_recurring: checked }));
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const parsed = billSchema.parse(formData);
      console.log("Validated bill data:", parsed);

      // Make API call
      const response = await api.post("/bills", parsed);
      console.log("API Response:", response.data);

      setTimeout(() => {
        toast.success("Success", {
          description: "Bill created successfully",
        });
        // update shared bills state so lists update immediately
        try {
          addBill(response.data);
          loadBills(); // refresh the bills list in case there are any formatting changes
        } catch (e) {
          // fallback to a full refresh if provider isn't available
          router.refresh();
        }
      }, 2000);

      // Reset form and close dialog
      setFormData({
        name: "",
        amount: "",
        due_date: new Date(),
        category: "",
        status: "",
        is_recurring: false,
        frequency: "",
        notes: "",
      });
      setDate(undefined);
      setEnabled(false);
      setIsOpen(false);

      // refresh the page so that any bill lists re-fetch
      // Optionally redirect instead of refresh
      // router.push("/bills");
      // or use revalidatePath('/bills');
    } catch (err: unknown) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof BillFormData, string>> = {};
        err.issues.forEach((issue: z.ZodIssue) => {
          const path = issue.path[0] as keyof BillFormData;
          fieldErrors[path] = issue.message;
        });
        setErrors(fieldErrors);
        console.log("Validation errors:", fieldErrors);
      } else if (axios.isAxiosError(err)) {
        const errorMsg = err.response?.data?.message || "Failed to create bill";
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
            className="cursor-pointer color: inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 gap-2"
          >
            <IconPlus className="text-white" />
            <span className="hidden lg:inline text-white">Add Bill</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg">
          <form onSubmit={handleSubmit}>
            <DialogHeader className="mb-5">
              <DialogTitle>Add Bill</DialogTitle>
              <DialogDescription>
                Make changes to your bill here. Click save when you&apos;re
                done.
              </DialogDescription>
            </DialogHeader>
            <div className="no-scrollbar -mx-4 max-h-[50vh] overflow-y-auto px-4">
              <FieldGroup>
                <Field>
                  <Label htmlFor="name-1">Bill Name</Label>
                  <Input
                    id="name-1"
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
                    <Label htmlFor="username-1">Amount</Label>
                    <Input
                      id="username-1"
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
                        <Label htmlFor="username-1">Due Date</Label>
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
                    <Label htmlFor="name-1">Category</Label>
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
                    <Label htmlFor="name-1">Status</Label>
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
                <FieldLabel htmlFor="switch-share">
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldTitle>Recurring Bill</FieldTitle>
                      <FieldDescription>
                        This bill repeats automatically.
                      </FieldDescription>
                    </FieldContent>
                    <Switch
                      id="switch-share"
                      checked={enabled}
                      onCheckedChange={handleRecurringChange}
                    />
                  </Field>
                </FieldLabel>
                {enabled && (
                  <Field>
                    <Label htmlFor="name-1">Frequency</Label>
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
                  <FieldLabel htmlFor="textarea-message">
                    Notes (optional)
                  </FieldLabel>
                  <Textarea
                    id="textarea-message"
                    name="notes"
                    placeholder="Add any additional details or notes about this bill here."
                    value={formData.notes}
                    onChange={handleInputChange}
                  />
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

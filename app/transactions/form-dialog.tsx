"use client";

import { Button } from "@/components/ui/button";
import { z } from "zod";
import axios from "axios";
import { useTransaction } from "./TransactionContext";
import { useAccounts } from "@/app/accounts/AccountsContext";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import api from "@/lib/api";
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
import { Textarea } from "@/components/ui/textarea";
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
import { useState, useEffect } from "react";
import type { Transaction } from "./TransactionContext";

const transactionSchema = z.object({
  transaction_name: z.string().min(1, "Transaction name is required"),
  amount: z
    .string()
    .refine(
      (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
      "Amount must be a positive number",
    ),
  date: z.date(),
  transaction_type: z.enum(["income", "expense"]),
  category: z.string().min(1, "Category is required"),
  bank_account: z.string().optional(),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

const TRANSACTION_CATEGORIES = {
  income: [
    "Salary",
    "Freelance",
    "Business",
    "Investment",
    "Gift",
    "Other Income",
  ],
  expense: [
    "Food & Dining",
    "Transportation",
    "Shopping",
    "Entertainment",
    "Bills & Utilities",
    "Healthcare",
    "Education",
    "Travel",
  ],
};

interface TransactionFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  transaction?: Transaction;
  mode: "create" | "edit";
}

export default function TransactionFormDialog({
  isOpen,
  onOpenChange,
  transaction,
  mode,
}: TransactionFormDialogProps) {
  const { addTransaction, updateTransaction, loadTransactions } = useTransaction();
  const { accounts } = useAccounts();
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState<Date>(new Date());

  const [formData, setFormData] = useState<TransactionFormData>({
    transaction_name: "",
    amount: "",
    date: new Date(),
    transaction_type: "expense",
    category: "",
    bank_account: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof TransactionFormData, string>>
  >({});

  // Initialize form data when editing or opening dialog
  useEffect(() => {
    if (mode === "edit" && transaction) {
      setFormData({
        transaction_name: transaction.transaction_name,
        amount: transaction.amount.toString(),
        date: new Date(transaction.date),
        transaction_type: transaction.transaction_type as "income" | "expense",
        category: transaction.category,
        bank_account: transaction.bank_account?._id || "",
      });
      setDate(new Date(transaction.date));
    } else if (mode === "create") {
      setFormData({
        transaction_name: "",
        amount: "",
        date: new Date(),
        transaction_type: "expense",
        category: "",
        bank_account: "",
      });
      setDate(new Date());
    }
  }, [transaction, mode, isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    if (name === "transaction_type") {
      // Reset category when type changes
      setFormData((prev) => ({ ...prev, transaction_type: value as "income" | "expense", category: "" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleDateChange = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
      setFormData((prev) => ({ ...prev, date: selectedDate }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const validatedData = transactionSchema.parse(formData);

      if (mode === "edit" && transaction) {
        const updateData: any = {
          ...validatedData,
          amount: parseFloat(validatedData.amount),
          date: validatedData.date.toISOString().split('T')[0],
        };
        if (!updateData.bank_account) {
          delete updateData.bank_account;
        }
        await updateTransaction(transaction._id!, updateData);
        toast.success("Transaction updated successfully!");
      } else {
        const createData: any = {
          transaction_name: validatedData.transaction_name,
          amount: parseFloat(validatedData.amount),
          date: validatedData.date.toISOString().split('T')[0],
          transaction_type: validatedData.transaction_type,
          category: validatedData.category,
        };
        if (validatedData.bank_account) {
          createData.bank_account = validatedData.bank_account;
        }
        
        const response = await api.post("/transactions", createData);
        toast.success("Transaction created successfully!");
      }

      // Reset form
      setFormData({
        transaction_name: "",
        amount: "",
        date: new Date(),
        transaction_type: "expense",
        category: "",
        bank_account: "",
      });
      setDate(new Date());
      onOpenChange(false);
      loadTransactions();
    } catch (err: unknown) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Partial<
          Record<keyof TransactionFormData, string>
        > = {};
        err.issues.forEach((issue: z.ZodIssue) => {
          const path = issue.path[0] as keyof TransactionFormData;
          fieldErrors[path] = issue.message;
        });
        setErrors(fieldErrors);
      } else if (axios.isAxiosError(err)) {
        const errorMsg =
          err.response?.data?.message || `Failed to ${mode} transaction`;
        toast.error("Error", { description: errorMsg });
      } else {
        toast.error("Error", { description: "An unexpected error occurred" });
      }
    } finally {
      setLoading(false);
    }
  };

  const availableCategories = TRANSACTION_CATEGORIES[formData.transaction_type as keyof typeof TRANSACTION_CATEGORIES] || [];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="mb-5">
            <DialogTitle>
              {mode === "edit" ? "Edit Transaction" : "Add Transaction"}
            </DialogTitle>
            <DialogDescription>
              {mode === "edit"
                ? "Update the transaction details below."
                : "Record a new income or expense transaction."}
            </DialogDescription>
          </DialogHeader>

          <div className="no-scrollbar -mx-4 max-h-[50vh] overflow-y-auto px-4">
            <FieldGroup>
              <Field>
                <Label htmlFor="transaction_name">Transaction Name</Label>
                <Input
                  id="transaction_name"
                  name="transaction_name"
                  type="text"
                  placeholder="e.g., Grocery shopping"
                  value={formData.transaction_name}
                  onChange={handleInputChange}
                />
                {errors.transaction_name && (
                  <p className="text-sm text-red-600">
                    {errors.transaction_name}
                  </p>
                )}
              </Field>

              <Field>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={handleInputChange}
                />
                {errors.amount && (
                  <p className="text-sm text-red-600">{errors.amount}</p>
                )}
              </Field>

              <Field>
                <Label htmlFor="transaction_type">Type</Label>
                <Select
                  value={formData.transaction_type}
                  onValueChange={(value) =>
                    handleSelectChange("transaction_type", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="income">Income</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors.transaction_type && (
                  <p className="text-sm text-red-600">{errors.transaction_type}</p>
                )}
              </Field>

              <Field>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    handleSelectChange("category", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {availableCategories.map((category) => (
                        <SelectItem key={category} value={category.toLowerCase()}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-red-600">{errors.category}</p>
                )}
              </Field>

              <Field>
                <Label htmlFor="date">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      {date ? (
                        format(date, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={handleDateChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.date && (
                  <p className="text-sm text-red-600">{errors.date}</p>
                )}
              </Field>

              <Field>
                <Label htmlFor="bank_account">Bank Account (Optional)</Label>
                <Select
                  value={formData.bank_account}
                  onValueChange={(value) =>
                    handleSelectChange("bank_account", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {accounts.map((account) => (
                        <SelectItem key={account._id} value={account._id!}>
                          {account.account_name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            </FieldGroup>
          </div>

          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button variant="outline" disabled={loading}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {mode === "edit" ? "Updating..." : "Saving..."}
                </>
              ) : (
                mode === "edit" ? "Update Transaction" : "Save Transaction"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
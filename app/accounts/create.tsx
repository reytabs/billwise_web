"use client";

import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";
import { z } from "zod";
import axios from "axios";
import api from "@/lib/api";
import { useAccounts } from "@/app/accounts/AccountsContext";
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

const accountSchema = z.object({
  account_name: z
    .string()
    .min(1, "Account name is required")
    .min(3, "Account name must be at least 3 characters"),
  bank_name: z
    .string()
    .min(1, "Bank name is required")
    .min(2, "Bank name must be at least 2 characters"),
  account_type: z.string().min(1, "Account type is required"),
  current_balance: z
    .string()
    .refine(
      (val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0,
      "Balance must be a non-negative number",
    ),
  last_four_digits: z.string().optional(),
});

type AccountFormData = z.infer<typeof accountSchema>;

const ACCOUNT_TYPES = ["Checking", "Savings", "Credit Card", "Investment"];

export default function AccountCreatePage() {
  const { addAccount, loadAccounts } = useAccounts();
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [formData, setFormData] = useState<AccountFormData>({
    account_name: "",
    bank_name: "",
    account_type: "",
    current_balance: "0",
    last_four_digits: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof AccountFormData, string>>
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const parsed = accountSchema.parse(formData);
      const payload = {
        ...parsed,
        current_balance: parseFloat(parsed.current_balance),
        last_four_digits: parsed.last_four_digits || undefined,
      };

      const [response] = await Promise.all([
        api.post("/accounts", payload),
        new Promise((r) => setTimeout(r, 1000)),
      ]);

      toast.success("Success", {
        description: "Account created successfully",
      });

      try {
        addAccount(response.data);
        loadAccounts();
      } catch {
        // fallback refresh
      }

      setFormData({
        account_name: "",
        bank_name: "",
        account_type: "",
        current_balance: "0",
        last_four_digits: "",
      });
      setIsOpen(false);
    } catch (err: unknown) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Partial<
          Record<keyof AccountFormData, string>
        > = {};
        err.issues.forEach((issue: z.ZodIssue) => {
          const path = issue.path[0] as keyof AccountFormData;
          fieldErrors[path] = issue.message;
        });
        setErrors(fieldErrors);
      } else if (axios.isAxiosError(err)) {
        const errorMsg =
          err.response?.data?.message || "Failed to create account";
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
            <span className="hidden lg:inline text-white">Add Account</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg">
          <form onSubmit={handleSubmit}>
            <DialogHeader className="mb-5">
              <DialogTitle>Add Account</DialogTitle>
              <DialogDescription>
                Add a new financial account. Click save when you&apos;re done.
              </DialogDescription>
            </DialogHeader>
            <div className="no-scrollbar -mx-4 max-h-[50vh] overflow-y-auto px-4">
              <FieldGroup>
                <Field>
                  <Label htmlFor="account-name">Account Name</Label>
                  <Input
                    id="account-name"
                    name="account_name"
                    placeholder="e.g., Main Account"
                    value={formData.account_name}
                    onChange={handleInputChange}
                  />
                  {errors.account_name && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.account_name}
                    </p>
                  )}
                </Field>
                <Field>
                  <Label htmlFor="bank-name">Bank Name</Label>
                  <Input
                    id="bank-name"
                    name="bank_name"
                    placeholder="e.g., Chinabank"
                    value={formData.bank_name}
                    onChange={handleInputChange}
                  />
                  {errors.bank_name && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.bank_name}
                    </p>
                  )}
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <Label htmlFor="account-type">Account Type</Label>
                    <Select
                      value={formData.account_type}
                      onValueChange={(val) =>
                        handleSelectChange("account_type", val)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Account Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {ACCOUNT_TYPES.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {errors.account_type && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.account_type}
                      </p>
                    )}
                  </Field>
                  <Field>
                    <Label htmlFor="current-balance">Current Balance</Label>
                    <Input
                      id="current-balance"
                      name="current_balance"
                      placeholder="0.00"
                      value={formData.current_balance}
                      onChange={handleInputChange}
                    />
                    {errors.current_balance && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.current_balance}
                      </p>
                    )}
                  </Field>
                </div>
                <Field>
                  <Label htmlFor="last-four">Last 4 Digits (Optional)</Label>
                  <Input
                    id="last-four"
                    name="last_four_digits"
                    placeholder="1234"
                    maxLength={4}
                    value={formData.last_four_digits || ""}
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

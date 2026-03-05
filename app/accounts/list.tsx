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
import { CreditCard, PiggyBank, Wallet, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAccounts } from "@/app/accounts/AccountsContext";
import type { Account } from "@/app/accounts/AccountsContext";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldGroup } from "@/components/ui/field";

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

function extractNumeric(value: string | number | undefined): string {
  if (value == null) return "";
  if (typeof value === "number") return String(value);
  const cleaned = String(value).replace(/[^0-9.]/g, "");
  return cleaned || "";
}

function getAccountIcon(type: string) {
  const t = type?.toLowerCase() || "";
  if (t.includes("credit")) return <CreditCard className="w-6 h-6 text-white" />;
  if (t.includes("investment"))
    return <TrendingUp className="w-6 h-6 text-white" />;
  if (t.includes("checking"))
    return <Wallet className="w-6 h-6 text-white" />;
  return <PiggyBank className="w-6 h-6 text-white" />;
}

function getAccountIconBg(type: string) {
  const t = type?.toLowerCase() || "";
  if (t.includes("credit")) return "bg-rose-500";
  if (t.includes("investment")) return "bg-amber-500";
  if (t.includes("checking")) return "bg-blue-500";
  return "bg-emerald-500";
}

export default function AccountListPage() {
  const { accounts, loading, loadAccounts } = useAccounts();
  const skeletonCount = Math.max(accounts.length, 3);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {loading ? (
        Array.from({ length: skeletonCount }).map((_, i) => (
          <AccountCardSkeleton key={`skeleton-${i}`} />
        ))
      ) : accounts.length === 0 ? (
        <div className="col-span-full text-center py-12 text-slate-500">
          No accounts yet. Add your first account to get started.
        </div>
      ) : (
        accounts.map((account) => (
          <AccountCard
            key={account._id ?? account.account_name}
            account={account}
            reloadAccounts={loadAccounts}
          />
        ))
      )}
    </div>
  );
}

function AccountCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 w-full">
          <Skeleton className="w-12 h-12 rounded-xl" />
          <div className="flex-1">
            <Skeleton className="h-5 w-32 mb-2" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
        <Skeleton className="w-8 h-8 rounded" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-9 w-28" />
        <Skeleton className="h-6 w-24 rounded" />
      </div>
    </div>
  );
}

function AccountCard({
  account,
  reloadAccounts,
}: {
  account: Account;
  reloadAccounts: () => Promise<void>;
}) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [formData, setFormData] = useState<AccountFormData>({
    account_name: account.account_name || "",
    bank_name: account.bank_name || "",
    account_type: account.account_type || "",
    current_balance: extractNumeric(account.current_balance),
    last_four_digits: account.last_four_digits || "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof AccountFormData, string>>
  >({});

  useEffect(() => {
    if (isEditOpen) {
      setFormData({
        account_name: account.account_name || "",
        bank_name: account.bank_name || "",
        account_type: account.account_type || "",
        current_balance: extractNumeric(account.current_balance),
        last_four_digits: account.last_four_digits || "",
      });
      setErrors({});
    }
  }, [isEditOpen, account]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!account._id) return;

    setLoadingEdit(true);
    setErrors({});

    try {
      const parsed = accountSchema.parse(formData);
      const payload = {
        ...parsed,
        current_balance: parseFloat(parsed.current_balance),
        last_four_digits: parsed.last_four_digits || undefined,
      };

      await Promise.all([
        api.put(`/accounts/${account._id}`, payload),
        new Promise((r) => setTimeout(r, 1000)),
      ]);

      toast.success("Success", {
        description: "Account updated successfully",
      });

      await reloadAccounts();
      setIsEditOpen(false);
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
          err.response?.data?.message || "Failed to update account";
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
    if (!account._id) return;

    setDeleting(true);
    try {
      await Promise.all([
        api.delete(`/accounts/${account._id}`),
        new Promise((r) => setTimeout(r, 1000)),
      ]);
      toast.success("Success", {
        description: "Account deleted successfully",
      });
      setIsDeleteOpen(false);
      await reloadAccounts();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const errorMsg =
          err.response?.data?.message || "Failed to delete account";
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

  const lastFour =
    account.last_four_digits && account.last_four_digits.length >= 4
      ? `••••${account.last_four_digits.slice(-4)}`
      : account.last_four_digits
        ? `••••${account.last_four_digits}`
        : null;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${getAccountIconBg(account.account_type)}`}
          >
            {getAccountIcon(account.account_type)}
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">
              {account.account_name}
            </h3>
            <p className="text-xs text-slate-400">{account.bank_name}</p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
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
        <div>
          <span className="text-3xl font-bold text-slate-900">
            {account.current_balance}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold capitalize bg-secondary text-secondary-foreground">
            {account.account_type}
          </span>
          {lastFour && (
            <span className="text-sm text-slate-400">{lastFour}</span>
          )}
        </div>
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-lg">
          <form onSubmit={handleEditSubmit}>
            <DialogHeader className="mb-5">
              <DialogTitle>Edit Account</DialogTitle>
              <DialogDescription>
                Update your account details. Click save when you&apos;re done.
              </DialogDescription>
            </DialogHeader>
            <div className="no-scrollbar -mx-4 max-h-[50vh] overflow-y-auto px-4">
              <FieldGroup>
                <Field>
                  <Label htmlFor="edit-account-name">Account Name</Label>
                  <Input
                    id="edit-account-name"
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
                  <Label htmlFor="edit-bank-name">Bank Name</Label>
                  <Input
                    id="edit-bank-name"
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
                    <Label htmlFor="edit-account-type">Account Type</Label>
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
                    <Label htmlFor="edit-current-balance">
                      Current Balance
                    </Label>
                    <Input
                      id="edit-current-balance"
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
                  <Label htmlFor="edit-last-four">Last 4 Digits (Optional)</Label>
                  <Input
                    id="edit-last-four"
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
            <DialogTitle>Delete account</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete
              &quot;{account.account_name}&quot;? This
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

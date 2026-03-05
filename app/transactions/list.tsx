import { ArrowDownLeft, ArrowUpRight, EllipsisVertical, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTransaction } from "./TransactionContext";
import type { Transaction } from "./TransactionContext";
import { useAccounts } from "@/app/accounts/AccountsContext";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import TransactionFormDialog from "./form-dialog";
import { useState } from "react";

function TransactionCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-100">
      <div className="flex items-center gap-4">
        <Skeleton className="w-12 h-12 rounded-xl" />
        <div className="flex-1 min-w-0">
          <Skeleton className="h-5 w-32 mb-1" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-20 mt-1" />
        </div>
        <Skeleton className="w-16 h-6" />
        <Skeleton className="w-8 h-8 rounded" />
      </div>
    </div>
  );
}

function TransactionCard({
  transaction,
  onEdit,
  onDuplicate,
  onDelete,
}: {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
  onDuplicate: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}) {
  const { accounts } = useAccounts();
  const isIncome = transaction.transaction_type === "income";
  const amount = parseFloat(String(transaction.amount).replace(/[^0-9.-]/g, "")) || 0;

  const linkedAccount = transaction.bank_account
    ? accounts.find((a) => a._id === transaction.bank_account?._id)
    : null;

  return (
    <div className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors">
      <div className={`p-3 rounded-xl ${isIncome ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'}`}>
        {isIncome ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="font-medium text-slate-900 truncate">
            {transaction.transaction_name}
          </h4>
          <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 capitalize text-xs">
            {transaction.category}
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
          <span>{format(new Date(transaction.date), "MMM dd, yyyy")}</span>
          <span>•</span>
          <span>{transaction.transaction_type}</span>
          {linkedAccount && (
            <>
              <span>•</span>
              <span>{linkedAccount.account_name}</span>
            </>
          )}
        </div>
      </div>
      <div className="text-right">
        <span className={`text-lg font-semibold ${isIncome ? 'text-emerald-600' : 'text-rose-600'}`}>
          {isIncome ? '+' : '-'}${Math.abs(amount).toLocaleString()}
        </span>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
            size="icon"
          >
            <EllipsisVertical className="w-4 h-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem onClick={() => onEdit(transaction)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onDuplicate(transaction)}>
            Duplicate
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={() => onDelete(transaction._id!)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default function TransactionListPage() {
  const { transactions, loading, deleteTransaction, addTransaction } = useTransaction();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const handleEdit = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setEditDialogOpen(true);
  };

  const handleDuplicate = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setCreateDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    const transaction = transactions.find(t => t._id === id);
    setSelectedTransaction(transaction || null);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedTransaction?._id) {
      try {
        await deleteTransaction(selectedTransaction._id);
      } catch (err) {
        console.error("Failed to delete transaction", err);
      }
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-100 divide-y divide-slate-100">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <TransactionCardSkeleton key={`skeleton-${i}`} />
          ))
        ) : transactions.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            No transactions found. Add your first transaction to get started.
          </div>
        ) : (
          transactions.map((transaction) => (
            <TransactionCard
              key={transaction._id ?? `${transaction.transaction_name}-${transaction.date}`}
              transaction={transaction}
              onEdit={handleEdit}
              onDuplicate={handleDuplicate}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      {/* Edit Dialog */}
      <TransactionFormDialog
        isOpen={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        transaction={selectedTransaction || undefined}
        mode="edit"
      />

      {/* Create Dialog for Duplication */}
      <TransactionFormDialog
        isOpen={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        transaction={selectedTransaction || undefined}
        mode="create"
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Delete Transaction</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{selectedTransaction?.transaction_name}&quot;? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-5">
            <DialogClose asChild>
              <Button variant="outline" disabled={false}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={false}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

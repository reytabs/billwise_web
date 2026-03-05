"use client";

import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";
import TransactionFormDialog from "./form-dialog";
import { useState } from "react";

export default function TransactionCreatePage() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        size="lg"
        className="cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 gap-2"
      >
        <IconPlus className="text-white" />
        <span className="hidden lg:inline text-white">Add Transaction</span>
      </Button>

      <TransactionFormDialog
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        mode="create"
      />
    </div>
  );
}

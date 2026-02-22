"use client";

import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldGroup } from "@/components/ui/field";

export default function BudgetCreatePage() {
  const [date, setDate] = useState<Date>();
  const [enabled, setEnabled] = useState(false);

  return (
    <div>
      <Dialog>
        <form>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="lg"
              className="cursor-pointer color: inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 gap-2"
            >
              <IconPlus className="text-white" />
              <span className="hidden lg:inline text-white">Add Budget</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Add Budget</DialogTitle>
              <DialogDescription>
                Make changes to your budget here. Click save when you&apos;re
                done.
              </DialogDescription>
            </DialogHeader>
            <div className="no-scrollbar -mx-4 max-h-[50vh] overflow-y-auto px-4">
              <FieldGroup>
                <Field>
                  <Label htmlFor="name-1">Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="01">Housing</SelectItem>
                        <SelectItem value="02">Utilities</SelectItem>
                        <SelectItem value="03">Intertainment</SelectItem>
                        <SelectItem value="04">Healthcare</SelectItem>
                        <SelectItem value="05">Shopping</SelectItem>
                        <SelectItem value="06">Personal</SelectItem>
                        <SelectItem value="07">Education</SelectItem>
                        <SelectItem value="07">Savings</SelectItem>
                        <SelectItem value="07">Other</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <Label htmlFor="username-1">Budget Amount</Label>
                  <Input id="username-1" name="username" placeholder="0.00" />
                </Field>
              </FieldGroup>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </div>
  );
}

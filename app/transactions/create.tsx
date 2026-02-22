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

export default function TransactionCreatePage() {
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
              <span className="hidden lg:inline text-white">
                Add Transaction
              </span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Add Transaction</DialogTitle>
              <DialogDescription>
                Make changes to your transaction here. Click save when
                you&apos;re done.
              </DialogDescription>
            </DialogHeader>
            <div className="no-scrollbar -mx-4 max-h-[50vh] overflow-y-auto px-4">
              <FieldGroup>
                <Field>
                  <Label htmlFor="name-1">Transaction Name</Label>
                  <Input
                    id="name-1"
                    name="name"
                    placeholder="e.g., Grocery Shopping"
                  />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <Label htmlFor="username-1">Amount</Label>
                    <Input id="username-1" name="username" placeholder="0.00" />
                  </Field>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Field>
                        <Label htmlFor="username-1">Date</Label>
                        <Button
                          variant="outline"
                          data-empty={!date}
                          className="data-[empty=true]:text-muted-foreground w-[212px] justify-between text-left font-normal"
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
                        onSelect={setDate}
                        defaultMonth={date}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <Label htmlFor="name-1">Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="01">Income</SelectItem>
                          <SelectItem value="02">Expenses</SelectItem>
                          <SelectItem value="03">Transfer</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <Label htmlFor="name-1">Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="01">Housing</SelectItem>
                          <SelectItem value="02">Food & Dining</SelectItem>
                          <SelectItem value="03">Transportation</SelectItem>
                          <SelectItem value="03">Utilities</SelectItem>
                          <SelectItem value="03">Entertainment</SelectItem>
                          <SelectItem value="03">Healthcare</SelectItem>
                          <SelectItem value="03">Shopping</SelectItem>
                          <SelectItem value="03">Personal</SelectItem>
                          <SelectItem value="03">Education</SelectItem>
                          <SelectItem value="03">Savings</SelectItem>
                          <SelectItem value="03">Income</SelectItem>
                          <SelectItem value="03">Transfer</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                </div>
                <Field>
                  <Label htmlFor="name-1">Bank Account (Optional)</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="01">Chinabank</SelectItem>
                        <SelectItem value="02">
                          Bank of Philippine Island
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel htmlFor="textarea-message">
                    Notes (optional)
                  </FieldLabel>
                  <Textarea
                    id="textarea-message"
                    placeholder="Add any additional details or notes about this transaction here."
                  />
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

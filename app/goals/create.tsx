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

export default function GoalCreatePage() {
  const [date, setDate] = useState<Date>();

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
              <span className="hidden lg:inline text-white">New Goal</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Goal</DialogTitle>
              <DialogDescription>
                Make changes to your bill here. Click save when you&apos;re
                done.
              </DialogDescription>
            </DialogHeader>
            <div className="no-scrollbar -mx-4 max-h-[50vh] overflow-y-auto px-4">
              <FieldGroup>
                <Field>
                  <Label htmlFor="name-1">Goal Name</Label>
                  <Input
                    id="name-1"
                    name="name"
                    placeholder="e.g., Emergency Fund"
                  />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <Label htmlFor="username-1">Target Amount</Label>
                    <Input id="username-1" name="username" placeholder="0.00" />
                  </Field>
                  <Field>
                    <Label htmlFor="username-1">Current Amount</Label>
                    <Input id="username-1" name="username" placeholder="0.00" />
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <Label htmlFor="name-1">Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="01">Emergency Fund</SelectItem>
                          <SelectItem value="02">Vacation</SelectItem>
                          <SelectItem value="03">Home</SelectItem>
                          <SelectItem value="04">Car</SelectItem>
                          <SelectItem value="05">Education</SelectItem>
                          <SelectItem value="06">Retirement</SelectItem>
                          <SelectItem value="07">Other</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Field>
                        <Label htmlFor="username-1">Target Date</Label>
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

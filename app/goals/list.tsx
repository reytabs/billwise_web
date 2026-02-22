import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { IconDots } from "@tabler/icons-react";

export default function GoalListPage() {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-sky-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-target w-6 h-6 text-white"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <circle cx="12" cy="12" r="6"></circle>
                  <circle cx="12" cy="12" r="2"></circle>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Vacation</h3>
                <p className="text-xs text-slate-400">Vacation</p>
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
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem>Make a copy</DropdownMenuItem>
                <DropdownMenuItem>Favorite</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive">
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-slate-900">₱100</span>
              <span className="text-sm text-slate-500">of ₱5,000</span>
            </div>
            <div
              aria-valuemax={100}
              aria-valuemin={0}
              role="progressbar"
              data-state="indeterminate"
              data-max="100"
              className="relative w-full overflow-hidden rounded-full bg-primary/20 h-2"
            >
              <div
                data-state="indeterminate"
                data-max="100"
                className="h-full w-full flex-1 bg-primary transition-all"
                style={{ transform: "translateX(-98%)" }}
              ></div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-slate-600">2% complete</span>
              <span className="text-slate-400">Target: Apr 25, 2026</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-sky-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-target w-6 h-6 text-white"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <circle cx="12" cy="12" r="6"></circle>
                  <circle cx="12" cy="12" r="2"></circle>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Vacation</h3>
                <p className="text-xs text-slate-400">Vacation</p>
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
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem>Make a copy</DropdownMenuItem>
                <DropdownMenuItem>Favorite</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive">
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-slate-900">₱100</span>
              <span className="text-sm text-slate-500">of ₱5,000</span>
            </div>
            <div
              aria-valuemax={100}
              aria-valuemin={0}
              role="progressbar"
              data-state="indeterminate"
              data-max="100"
              className="relative w-full overflow-hidden rounded-full bg-primary/20 h-2"
            >
              <div
                data-state="indeterminate"
                data-max="100"
                className="h-full w-full flex-1 bg-primary transition-all"
                style={{ transform: "translateX(-98%)" }}
              ></div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-slate-600">2% complete</span>
              <span className="text-slate-400">Target: Apr 25, 2026</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-sky-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-target w-6 h-6 text-white"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <circle cx="12" cy="12" r="6"></circle>
                  <circle cx="12" cy="12" r="2"></circle>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Vacation</h3>
                <p className="text-xs text-slate-400">Vacation</p>
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
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem>Make a copy</DropdownMenuItem>
                <DropdownMenuItem>Favorite</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive">
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-slate-900">₱100</span>
              <span className="text-sm text-slate-500">of ₱5,000</span>
            </div>
            <div
              aria-valuemax={100}
              aria-valuemin={0}
              role="progressbar"
              data-state="indeterminate"
              data-max="100"
              className="relative w-full overflow-hidden rounded-full bg-primary/20 h-2"
            >
              <div
                data-state="indeterminate"
                data-max="100"
                className="h-full w-full flex-1 bg-primary transition-all"
                style={{ transform: "translateX(-98%)" }}
              ></div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-slate-600">2% complete</span>
              <span className="text-slate-400">Target: Apr 25, 2026</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

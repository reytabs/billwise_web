import { Ellipsis } from "lucide-react";

export default function BudgetListPage() {
  return (
    <div className="mt-8">
      <div className="space-y-4">
        <div className="bg-white rounded-2xl p-6 border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg bg-opacity-10">
                🍔
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">
                  Food &amp; Dining
                </h3>
                <p className="text-sm text-slate-500">$0 of $1,000</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold text-slate-900">0%</span>
              <button
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-8 w-8"
                type="button"
                id="radix-:r10q:"
                aria-haspopup="menu"
                aria-expanded="false"
                data-state="closed"
              >
                <Ellipsis />
              </button>
            </div>
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
              style={{ transform: "translateX(-100%)" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

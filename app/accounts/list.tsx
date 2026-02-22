import { CreditCard, Ellipsis, PiggyBank } from "lucide-react";

export default function AccountListPage() {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-rose-500">
                <CreditCard />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-slate-900">
                    Chinabank Savings
                  </h3>
                </div>
                <p className="text-xs text-slate-400">Chinabank</p>
              </div>
            </div>
            <button
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-8 w-8"
              type="button"
              id="radix-:rbv:"
              aria-haspopup="menu"
              aria-expanded="false"
              data-state="closed"
            >
              <Ellipsis />
            </button>
          </div>
          <div className="space-y-3">
            <div>
              <span className="text-3xl font-bold text-slate-900">
                $100,000
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 capitalize">
                Credit Card
              </div>
              <span className="text-sm text-slate-400">••••3213</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-emerald-500">
                <PiggyBank />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-slate-900">
                    Metrobank Savings
                  </h3>
                </div>
                <p className="text-xs text-slate-400">Metro Bank</p>
              </div>
            </div>
            <button
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-8 w-8"
              type="button"
              id="radix-:rb6:"
              aria-haspopup="menu"
              aria-expanded="false"
              data-state="closed"
            >
              <Ellipsis />
            </button>
          </div>
          <div className="space-y-3">
            <div>
              <span className="text-3xl font-bold text-slate-900">$90,000</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 capitalize">
                Savings
              </div>
              <span className="text-sm text-slate-400">••••3233</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-emerald-500">
                <PiggyBank />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-slate-900">
                    Saving Account
                  </h3>
                </div>
                <p className="text-xs text-slate-400">
                  Bank of the Philiipine Island
                </p>
              </div>
            </div>
            <button
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-8 w-8"
              type="button"
              id="radix-:rad:"
              aria-haspopup="menu"
              aria-expanded="false"
              data-state="closed"
            >
              <Ellipsis />
            </button>
          </div>
          <div className="space-y-3">
            <div>
              <span className="text-3xl font-bold text-slate-900">$50,000</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 capitalize">
                Savings
              </div>
              <span className="text-sm text-slate-400">••••1234</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

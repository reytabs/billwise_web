import { DollarSign } from "lucide-react";

export default function BillwiseLogo() {
  return (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center gap-2">
        <div className="bg-indigo-600 rounded-lg p-2">
          <DollarSign className="text-white" size={28} />
        </div>
        <span className="text-3xl font-bold text-indigo-600">
          BillWise
        </span>
      </div>
    </div>
  );
}

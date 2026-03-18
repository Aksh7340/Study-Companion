export default function ProgressBar({ progress, label }) {

  const value = Math.max(0, Math.min(100, progress));

  // Colour the fill based on progress
  const fillColor =
    value >= 80 ? "from-emerald-400 to-emerald-500" :
    value >= 50 ? "from-blue-400 to-indigo-500" :
    value >= 25 ? "from-amber-400 to-orange-500" :
                  "from-red-400 to-rose-500";

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            {label}
          </span>
          <span className="text-xs font-bold text-slate-700">
            {value}%
          </span>
        </div>
      )}

      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${fillColor} transition-all duration-500`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
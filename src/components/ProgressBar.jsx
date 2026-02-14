export default function ProgressBar({ current, total }) {
  const safeTotal = total > 0 ? total : 1;
  const percent = Math.min(100, Math.round((current / safeTotal) * 100));

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs text-zinc-400">
        <span>Progress</span>
        <span>{current}/{total}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-700">
        <div
          className="h-full rounded-full bg-indigo-500 transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

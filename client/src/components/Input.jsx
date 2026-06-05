export default function Input({ label, error, className = '', ...props }) {
  return (
    <label className="grid gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-200">
      {label}
      <input
        className={`focus-ring rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 ${className}`}
        {...props}
      />
      {error ? <span className="text-xs text-civic-red">{error}</span> : null}
    </label>
  );
}

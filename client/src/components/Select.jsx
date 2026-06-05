export default function Select({ label, children, className = '', ...props }) {
  return (
    <label className="grid gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-200">
      {label}
      <select
        className={`focus-ring rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 ${className}`}
        {...props}
      >
        {children}
      </select>
    </label>
  );
}

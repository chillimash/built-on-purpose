import { SelectHTMLAttributes, forwardRef } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, id, className = "", children, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={id}
          className="font-utility text-xs uppercase tracking-wider text-ink-soft"
        >
          {label}
        </label>
        <select
          ref={ref}
          id={id}
          className={`bg-cream border border-tan/40 rounded-sm px-4 py-3 text-ink focus:border-stamp outline-none transition-colors ${className}`}
          {...props}
        >
          {children}
        </select>
      </div>
    );
  }
);
Select.displayName = "Select";

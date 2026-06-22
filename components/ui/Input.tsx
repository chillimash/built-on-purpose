import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, id, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={id}
          className="font-utility text-xs uppercase tracking-wider text-ink-soft"
        >
          {label}
        </label>
        <input
          ref={ref}
          id={id}
          className={`bg-cream border border-tan/40 rounded-sm px-4 py-3 text-ink placeholder:text-ink-soft/50 focus:border-stamp outline-none transition-colors ${className}`}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = "Input";

import { TextareaHTMLAttributes, forwardRef } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, id, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={id}
          className="font-utility text-xs uppercase tracking-wider text-ink-soft"
        >
          {label}
        </label>
        <textarea
          ref={ref}
          id={id}
          className={`bg-cream border border-tan/40 rounded-sm px-4 py-3 text-ink placeholder:text-ink-soft/50 focus:border-stamp outline-none transition-colors resize-y ${className}`}
          {...props}
        />
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

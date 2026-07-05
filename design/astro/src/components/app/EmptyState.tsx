import type { ReactNode } from 'react';

export default function EmptyState({
  icon,
  title,
  body,
  className,
}: {
  icon?: ReactNode;
  title: string;
  body: string;
  className?: string;
}) {
  return (
    <div
      className={`flex min-h-full flex-col items-center justify-center gap-3.5 rounded-[var(--radius-box)] border border-dashed border-base-content/30 px-6 py-9 text-center text-base-content/70 ${className ?? ''}`}
    >
      {icon && (
        <span
          className="inline-flex size-[54px] items-center justify-center rounded-2xl border border-dashed border-base-content/30 bg-base-200 text-secondary"
          aria-hidden="true"
        >
          {icon}
        </span>
      )}
      <span className="text-[1.2rem] font-semibold tracking-[-0.02em] text-base-content [font-family:var(--font-display)]">
        {title}
      </span>
      <span className="max-w-[26ch] text-[13px] leading-snug text-base-content/70">{body}</span>
    </div>
  );
}

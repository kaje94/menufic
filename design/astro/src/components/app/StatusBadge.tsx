type Status = 'published' | 'pending' | 'draft';

const MAP = {
  published: { cls: 'border-success/40 bg-success/15 text-success', dot: 'bg-success', label: 'Published' },
  pending:   { cls: 'badge badge-secondary border-0', dot: 'bg-secondary-content/65', label: 'Pending review' },
  draft:     { cls: 'border-base-content/30 bg-base-200 text-base-content/70', dot: 'bg-base-content/40', label: 'Draft' },
} as const;

export default function StatusBadge({ status }: { status: Status }) {
  const { cls, dot, label } = MAP[status];

  // Pending reuses the daisyUI `badge` component (dashboard.html ~165-167).
  if (status === 'pending') {
    return (
      <span className={`${cls} gap-1.5 px-2.5 py-3 text-xs font-semibold`}>
        <span className={`size-2 rounded-full ${dot}`} aria-hidden="true"></span>
        {label}
      </span>
    );
  }

  // Published / draft share the bordered pill structure (dashboard.html ~105-107).
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${cls}`}>
      <span className={`size-2 rounded-full ${dot}`} aria-hidden="true"></span>
      {label}
    </span>
  );
}

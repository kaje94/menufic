import type { ReactNode } from 'react';
export default function SectionBar({ items, current }: { items: { href: string; label: string; icon?: ReactNode }[]; current: string }) {
  return (
    <nav className="mb-[clamp(20px,2.6vw,28px)] flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:thin]">
      {items.map(it => {
        const active = it.href === current;
        return (
          <a href={it.href} aria-current={active ? 'page' : undefined}
             className={`inline-flex min-h-[42px] flex-none items-center gap-2 whitespace-nowrap rounded-full border px-4 text-sm font-semibold transition-colors ${active ? 'border-secondary/45 bg-secondary/15 text-secondary' : 'border-base-content/10 bg-base-200 text-base-content/70 hover:bg-base-300 hover:text-base-content'}`}>
            {it.icon}{it.label}
          </a>
        );
      })}
    </nav>
  );
}

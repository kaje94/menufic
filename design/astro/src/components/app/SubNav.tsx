import type { ReactNode } from 'react';

// Ported from design/landing/app/restaurant.html lines ~265-295 (the `.app-subnav`
// per-restaurant section nav, indented under the active restaurant in the sidebar).
// The deleted `.app-subnav` active rules (source app.css ~lines 175-182) are
// reproduced here as conditional utilities on the active item:
//   active a   -> bg-secondary/13 text-secondary font-semibold
//   active svg -> opacity-100            (default opacity-85)
export default function SubNav({
  items,
  current,
}: {
  items: { href: string; label: string; icon?: ReactNode }[];
  current: string;
}) {
  return (
    <nav
      className="app-subnav ml-[17px] mb-2.5 mt-1 flex flex-col gap-0.5 border-l border-base-content/25 pl-[14px]"
      aria-label="Restaurant sections"
    >
      {items.map((item) => {
        const active = item.href === current;
        return (
          <a
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={`flex min-h-[40px] items-center gap-2.5 rounded-[10px] px-2.5 py-[5px] text-[13.5px] transition-colors duration-200 ${
              active
                ? 'bg-secondary/13 font-semibold text-secondary [&_svg]:opacity-100'
                : 'font-medium text-base-content/70 hover:bg-base-300/40 hover:text-base-content'
            }`}
          >
            {item.icon}
            {item.label}
          </a>
        );
      })}
    </nav>
  );
}

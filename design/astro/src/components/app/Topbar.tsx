import { owner } from '../../data/restaurants';
import AccountMenu from './AccountMenu';

// Ported from design/landing/app/dashboard.html lines ~28-64 (sticky top bar).
// Plain (non-hydrating) React component: the AppShell .astro layout (Task 9)
// mounts this with client:load, which hydrates this markup plus the nested
// AccountMenu island in one go — no client directive is used here since
// Astro's client:* directives only apply at the point a component is mounted
// from an .astro file, not from within another .tsx component.
export default function Topbar({ crumb }: { crumb: string }) {
  return (
    <header className="sticky top-0 z-20 flex items-center gap-4 border-b border-base-content/10 bg-base-100/85 px-[clamp(1rem,3vw,2.5rem)] py-3 backdrop-blur-lg">
      <label
        htmlFor="app-drawer"
        className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl border border-base-content/20 bg-base-200 text-base-content lg:hidden"
        aria-label="Open navigation"
      >
        <svg
          className="size-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M3 6h18M3 12h18M3 18h18" />
        </svg>
      </label>

      <nav className="flex min-w-0 items-center gap-2 text-sm text-base-content/70" aria-label="Breadcrumb">
        <span className="font-medium">Menufic</span>
        <span className="opacity-60" aria-hidden="true">
          /
        </span>
        <span className="truncate font-semibold text-base-content" aria-current="page">
          {crumb}
        </span>
      </nav>

      <span className="flex-1" />

      <AccountMenu owner={owner} />
    </header>
  );
}

import type { ReactNode } from 'react';
import Avatar from './Avatar';
import SubNav from './SubNav';
import type { Restaurant } from '../../data/types';

// Ported from design/landing/app/dashboard.html lines ~193-252 (the <aside> sidebar).
// The deleted `.app-nav` active rules (source app.css ~lines 190-203) are reproduced
// here as conditional utility classes on the active <a> / .nav-dot / .nav-thumb:
//   active a  -> bg-secondary/13 text-secondary font-semibold
//   .nav-dot  -> bg-secondary            (default bg-transparent)
//   .nav-thumb-> border-secondary/55     (default border-base-content/10)

// Two-level sidebar (design/landing/app/restaurant.html lines ~264-297 /
// menu-editor.html lines ~730-763): the active restaurant's <li> nests a
// `.app-subnav` (rendered via SubNav.tsx) listing its 6 sections. Defined
// once here so every App section page (menu-editor/banners/theme/analytics/
// team/qr) shares the same labels/hrefs/icons instead of re-declaring them.
export const APP_SECTIONS: { href: string; label: string; icon: ReactNode }[] = [
  {
    href: '/app/menu-editor',
    label: 'Menus',
    icon: (
      <svg
        className="size-4 flex-none stroke-current opacity-85"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M3 6h18M3 12h18M3 18h12" />
      </svg>
    ),
  },
  {
    href: '/app/banners',
    label: 'Banners',
    icon: (
      <svg
        className="size-4 flex-none stroke-current opacity-85"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <circle cx="8.5" cy="10" r="1.6" />
        <path d="m21 16-5-5-9 9" />
      </svg>
    ),
  },
  {
    href: '/app/theme',
    label: 'Theme',
    icon: (
      <svg
        className="size-4 flex-none stroke-current opacity-85"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="13.5" cy="6.5" r="2.5" />
        <circle cx="17.5" cy="10.5" r="2.5" />
        <circle cx="8.5" cy="7.5" r="2.5" />
        <circle cx="6.5" cy="12.5" r="2.5" />
        <path d="M12 22a10 10 0 1 1 0-20 8 8 0 0 1 8 8c0 4-4 4-4 7a3 3 0 0 1-4 5z" />
      </svg>
    ),
  },
  {
    href: '/app/analytics',
    label: 'Analytics',
    icon: (
      <svg
        className="size-4 flex-none stroke-current opacity-85"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M3 3v18h18" />
        <path d="m7 14 4-4 3 3 5-6" />
      </svg>
    ),
  },
  {
    href: '/app/team',
    label: 'Team',
    icon: (
      <svg
        className="size-4 flex-none stroke-current opacity-85"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    href: '/app/qr',
    label: 'QR code',
    icon: (
      <svg
        className="size-4 flex-none stroke-current opacity-85"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <path d="M14 14h3v3M21 21v.01M17 21v-3M21 14v3" />
      </svg>
    ),
  },
];

export default function Sidebar({
  restaurants,
  owner,
  currentRestaurantId,
  currentSection,
}: {
  restaurants: Restaurant[];
  owner: { name: string; email: string; avatar: string };
  currentRestaurantId?: string;
  // Active section href (e.g. "/app/menu-editor") when on a per-restaurant
  // section sub-page; undefined on the restaurant hub page itself.
  currentSection?: string;
}) {
  return (
    <aside
      className="flex min-h-screen w-[260px] flex-col border-e border-base-content/10 bg-cocoa-deep px-4 pb-4 pt-5"
      aria-label="Restaurants and account"
    >
      <a
        className="mb-4 inline-flex items-center gap-2 px-2 pb-1 pt-1.5 text-2xl font-bold tracking-[-0.04em] text-base-content [font-family:var(--font-display)]"
        href="/"
        aria-label="Menufic home"
      >
        Menufic
        <span className="-mb-0.5 size-2.5 rounded-full bg-primary" aria-hidden="true" />
      </a>

      <nav className="flex min-h-0 flex-1 flex-col" aria-label="Your restaurants">
        <div className="flex items-center justify-between px-2.5 pb-2 pt-1.5 text-xs font-semibold tracking-wide text-base-content/70">
          <span>Restaurants</span>
          <span className="rounded-full border border-base-content/10 bg-base-200 px-2 py-px text-[11px] font-semibold">
            {restaurants.length}
          </span>
        </div>
        <ul className="app-nav menu min-h-0 flex-1 flex-nowrap gap-0.5 overflow-y-auto p-0">
          {restaurants.map((restaurant) => {
            const active = restaurant.id === currentRestaurantId;
            // page = this IS the current page (the hub itself); location =
            // this restaurant is the selected-restaurant ancestor of a
            // per-section sub-page (design/landing/app/menu-editor.html ~l.724).
            const ariaCurrent = active ? (currentSection ? 'location' : 'page') : undefined;
            return (
              <li key={restaurant.id}>
                <a
                  href="/app/restaurant"
                  aria-current={ariaCurrent}
                  className={`gap-2.5 py-1.5 ${active ? 'bg-secondary/13 text-secondary font-semibold' : ''}`}
                >
                  <img
                    className={`nav-thumb size-[34px] shrink-0 rounded-[9px] border object-cover ${active ? 'border-secondary/55' : 'border-base-content/10'}`}
                    src={restaurant.image}
                    alt=""
                  />
                  <span className="min-w-0 flex-1 truncate text-[14.5px]">{restaurant.name}</span>
                  <span
                    className={`nav-dot size-[7px] shrink-0 rounded-full ${active ? 'bg-secondary' : 'bg-transparent'}`}
                    aria-hidden="true"
                  />
                </a>
                {active && <SubNav items={APP_SECTIONS} current={currentSection ?? ''} />}
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-auto border-t border-base-content/10 pt-3.5">
        <ul className="menu gap-0.5 p-0">
          <li>
            <a href="#" className="gap-3 py-1.5 text-[14.5px]">
              <svg
                className="size-[19px] shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.9"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
              Settings
            </a>
          </li>
          <li>
            <a href="/" className="gap-3 py-1.5 text-[14.5px]">
              <svg
                className="size-[19px] shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.9"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Sign out
            </a>
          </li>
        </ul>

        <div className="mt-2.5 flex items-center gap-2.5 rounded-2xl border border-base-content/10 bg-base-200 px-3 py-2.5">
          <Avatar src={owner.avatar} name={owner.name} size={38} className="size-[38px] shrink-0" />
          <span className="min-w-0 flex-1">
            <b className="block truncate text-[13.5px] font-semibold text-base-content">{owner.name}</b>
            <span className="block truncate text-xs text-base-content/70">{owner.email}</span>
          </span>
        </div>
      </div>
    </aside>
  );
}

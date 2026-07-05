import { useEffect, useRef, useState } from 'react';
import Avatar from './Avatar';

// Client island. Ported from design/landing/app/dashboard.html lines ~44-63 (markup)
// and ~273-285 (open/close + outside-click behavior, formerly imperative DOM JS).
export default function AccountMenu({
  owner,
}: {
  owner: { name: string; email: string; avatar: string };
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocumentClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('click', onDocumentClick);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('click', onDocumentClick);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  const firstName = owner.name.split(' ')[0];

  return (
    <div className="relative shrink-0" id="acct" ref={rootRef}>
      <button
        id="acctBtn"
        type="button"
        className="group inline-flex h-11 items-center gap-2 rounded-full border border-base-content/10 bg-base-200 py-1 pe-3 ps-1 text-sm font-semibold transition-colors hover:bg-base-300"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls="acctMenu"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
      >
        <Avatar
          src={owner.avatar}
          name={`${owner.name}, account menu`}
          size={36}
          className="size-9"
        />
        <span className="hidden min-[1100px]:inline">{firstName}</span>
        <svg
          className="size-4 text-base-content/70 transition-transform duration-200 group-aria-[expanded=true]:rotate-180"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      <ul
        id="acctMenu"
        role="menu"
        aria-label="Account"
        className={`menu absolute end-0 top-[calc(100%+0.625rem)] z-30 ${open ? '' : 'hidden'} w-56 gap-0.5 rounded-2xl border border-base-content/10 bg-base-200 p-2 shadow-floating`}
      >
        <li className="menu-title px-3 pb-2.5 pt-2 leading-tight">
          <span className="block text-sm font-semibold text-base-content">{owner.name}</span>
          <span className="mt-0.5 block text-xs font-normal normal-case text-base-content/70">
            {owner.email}
          </span>
        </li>
        <li>
          <a href="#" role="menuitem">
            <svg
              className="size-[17px] text-base-content/70"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Account
          </a>
        </li>
        <li>
          <a href="#" role="menuitem">
            <svg
              className="size-[17px] text-base-content/70"
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
          <a href="/" role="menuitem" className="hover:text-[var(--color-primary)]">
            <svg
              className="size-[17px] text-base-content/70"
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
    </div>
  );
}

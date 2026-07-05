import { useEffect, useState } from 'react';

// Ported from design/landing/index.html lines ~572-591 (condensing sticky nav)
// plus its imperative scroll/hamburger script (~1260-1275), converted to hooks:
//   - `data-condensed` (was set by a `scroll` listener) -> `condensed` state.
//   - `data-open` / `aria-expanded` (was set by the hamburger click handler,
//     and cleared on nav-link click) -> `open` state, with each link's
//     onClick closing the mobile menu (replaces the source's click-delegation
//     `if (e.target.tagName === "A")` check).
// Client island (mounted with client:load from BrandLayout).
const NAV_LINKS = [
  { href: '#how', label: 'How it works' },
  { href: '#studio', label: 'See a menu' },
  { href: '#features', label: 'Features' },
  { href: '#pricing', label: 'Pricing' },
];

export default function BrandNav() {
  const [condensed, setCondensed] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setCondensed(window.scrollY > 24);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      id="nav"
      data-condensed={condensed ? 'true' : 'false'}
      className="fixed inset-x-0 top-0 z-50 border-b border-transparent py-[18px] transition-[background-color,box-shadow,border-color,padding] duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] data-[condensed=true]:border-base-content/10 data-[condensed=true]:bg-base-100/90 data-[condensed=true]:py-2.5 data-[condensed=true]:shadow-nav data-[condensed=true]:backdrop-blur-[14px]"
    >
      <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between gap-5 px-6">
        <a
          className="inline-flex items-center gap-2 font-display text-[25px] font-bold tracking-[-0.04em] text-base-content"
          href="#top"
          aria-label="Menufic home"
        >
          Menufic
          <span className="mb-[-2px] h-[9px] w-[9px] rounded-full bg-primary" aria-hidden="true" />
        </a>
        <nav
          id="navLinks"
          data-open={open ? 'true' : 'false'}
          aria-label="Primary"
          className="max-md:absolute max-md:inset-x-0 max-md:top-full max-md:hidden max-md:flex-col max-md:items-start max-md:gap-1.5 max-md:border-b max-md:border-base-content/10 max-md:bg-base-100/95 max-md:px-6 max-md:pb-6 max-md:pt-4 max-md:backdrop-blur-[14px] max-md:data-[open=true]:flex md:flex md:items-center md:gap-[30px]"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              className="font-medium text-info transition-colors hover:text-base-content max-md:w-full max-md:py-3 max-md:text-[17px]"
              href={link.href}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3.5">
          <button
            id="hamburger"
            type="button"
            className="btn btn-ghost btn-square md:hidden"
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="navLinks"
            onClick={() => setOpen((o) => !o)}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
          <a className="btn btn-primary" href="/app/signin">
            <svg className="h-[18px] w-[18px] shrink-0" viewBox="0 0 48 48" aria-hidden="true">
              <path
                fill="#fff"
                d="M44.5 20H24v8.5h11.8C34.7 33.9 30 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 6 1.1 8.2 3l6.3-6.3C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"
              />
            </svg>
            <span className="max-md:hidden">Get started</span>
          </a>
        </div>
      </div>
    </header>
  );
}

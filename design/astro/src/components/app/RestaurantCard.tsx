import StatusBadge from './StatusBadge';
import type { Restaurant } from '../../data/types';

// Ported verbatim from design/landing/app/dashboard.html lines 83-110 (Card 1,
// "Saffron & Smoke"). The inline status badge markup is replaced with
// <StatusBadge> (Task 5). `stagger`/`data-delay` (entrance animation) are
// list-position concerns owned by the page that maps over restaurants, not by
// this fixed `({ r }) => ...` signature — omitted here, see task-6-report.md.
export default function RestaurantCard({ r }: { r: Restaurant }) {
  return (
    <article className="card group overflow-hidden border border-base-content/10 bg-base-200 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-base-content/20 hover:shadow-floating focus-within:-translate-y-1 focus-within:shadow-floating">
      <figure className="relative aspect-[16/10] overflow-hidden bg-base-300">
        <a className="absolute inset-0 z-[1]" href="/app/restaurant" aria-label={`Open ${r.name}`}></a>
        <img
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105 group-focus-within:scale-105"
          src={r.image}
          alt={r.name}
          loading="lazy"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-cocoa-deep/35 to-transparent"></div>
        <div className="absolute right-2.5 top-2.5 z-[2] flex gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100">
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-xl border border-base-content/30 bg-cocoa-deep/70 text-base-content transition-colors hover:border-secondary hover:text-secondary focus-visible:opacity-100"
            aria-label={`Edit ${r.name}`}
          >
            <svg
              className="size-[18px]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z" />
            </svg>
          </button>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-xl border border-base-content/30 bg-cocoa-deep/70 text-base-content transition-colors hover:border-error hover:text-error focus-visible:opacity-100"
            aria-label={`Delete ${r.name}`}
          >
            <svg
              className="size-[18px]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </div>
      </figure>
      <div className="card-body flex flex-1 flex-col gap-2 p-5">
        <h2 className="text-[1.32rem] font-semibold leading-tight tracking-[-0.02em] text-base-content">{r.name}</h2>
        <p className="flex items-center gap-2 text-sm text-base-content/70">
          <svg
            className="size-3.5 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {r.cuisine} · {r.location}
        </p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <span className="text-xs text-base-content/70">{r.dishCount} dishes</span>
          <StatusBadge status={r.status} />
        </div>
      </div>
    </article>
  );
}

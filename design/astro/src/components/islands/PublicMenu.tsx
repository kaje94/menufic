import { useEffect, useMemo, useRef, useState } from 'react';

/* ============================================================
   PublicMenu — the diner-facing menu body (Task 22)
   ------------------------------------------------------------
   Ported from design/landing/public/index.html: the sticky
   search+tabs controls, the category sections of diner DISH CARDS
   (the display cards — NOT the menu-editor DishRow), and the
   dish-detail modal (source's native <dialog>).

   INTERACTIVITY (all genuinely interactive → one React island):
     - search box filters the active panel's cards (name+desc)
     - menu tabs (Breakfast/Lunch/Dinner) switch panels; ArrowLeft/
       Right roves focus, as in the source keydown handler
     - tapping a dish card opens the detail modal
     - modal keeps the source's native <dialog> (showModal gives free
       Escape + focus-trap + focus-restore); backdrop <form method=
       "dialog"> closes on outdoor click; body scroll locked while open

   Astro server-renders this island to HTML (client:load hydrates it),
   so the dish content is in the initial DOM — matching the source's
   static initial render and keeping the menu crawlable.

   DISH DATA: ported inline (not src/data/dishes.ts) — the public page
   carries a different shape (£ prices, per-dish tags, long + short
   descriptions, image alt, category grouping, sold-out flag) that the
   menu-editor-derived dishes.ts ($ prices, no tags/alt/long-desc) does
   not model. See task-22-report.md.
   ============================================================ */

interface Dish {
  name: string;
  price: string;
  img: string;
  alt: string;
  short: string;
  desc: string;
  tags: string[];
  sold?: boolean;
}
interface Section {
  title: string;
  dishes: Dish[];
}

const dinner: Section[] = [
  {
    title: 'Mains',
    dishes: [
      {
        name: 'Smoked short rib',
        price: '£28',
        img: '/img/photo-1432139555190-58524dae6a55.jpg',
        alt: 'A pile of glossy smoked short rib glazed in burnt honey',
        short: '36-hour cook over oak embers, burnt-honey glaze, smoked sea salt.',
        desc: 'Thirty-six hours over oak embers, lacquered in a sticky burnt-honey glaze and finished with smoked sea salt. Falls apart at the touch of a fork.',
        tags: ["Chef's Special", 'Popular'],
      },
      {
        name: 'Wood-fired margherita',
        price: '£19',
        img: '/img/photo-1565299624946-b28f40a0ae38.jpg',
        alt: 'A bubbling wood-fired margherita pizza topped with fresh basil',
        short: 'San Marzano, fior di latte, basil oil, blistered in the wood oven.',
        desc: 'San Marzano tomatoes, fior di latte and a slick of cold-pressed basil oil, blistered in ninety seconds in the wood oven. Simple, the way it should be.',
        tags: ['Popular'],
      },
      {
        name: 'Saffron prawns',
        price: '£22',
        img: '/img/photo-1424847651672-bf20a4b0982b.jpg',
        alt: 'Plump prawns in a golden saffron chilli butter with charred lemon',
        short: 'Saffron chilli butter, seared hard, with a charred lemon half.',
        desc: 'Wild tiger prawns bathed in saffron chilli butter, seared hard and served with a charred lemon half. Pull-apart messy in the best way.',
        tags: ['Spicy', "Chef's Special"],
        sold: true,
      },
    ],
  },
  {
    title: 'Small plates',
    dishes: [
      {
        name: 'Red shrimp broth',
        price: '£16',
        img: '/img/photo-1455619452474-d2be8b1e70cd.jpg',
        alt: 'A deep red shrimp broth in a rustic bowl with fresh herbs',
        short: 'Slow shellfish bisque, chilli oil, a spoon of crème fraîche.',
        desc: 'A slow-built shellfish bisque the colour of embers, finished with chilli oil and a spoon of crème fraîche. Bread for dunking is not optional.',
        tags: ['New', 'Spicy'],
      },
      {
        name: 'Charred sharing board',
        price: '£24',
        img: '/img/photo-1414235077428-338989a2e8c0.jpg',
        alt: 'A generous sharing board of charred meats, breads and dips',
        short: 'Charred flatbreads, smoked dips, pickles, grill-of-the-night.',
        desc: 'A board for the table — charred flatbreads, smoked dips, pickles and whatever the grill is loving that night. Built for two to four hands.',
        tags: ['Popular', 'New'],
      },
    ],
  },
  {
    title: 'Sides',
    dishes: [
      {
        name: 'Burnt-honey carrots',
        price: '£9',
        img: '/img/photo-1484723091739-30a097e8f929.jpg',
        alt: 'Roasted heritage carrots glazed in burnt honey on a plate',
        short: 'Heritage carrots, burnt honey, toasted seeds and dukkah.',
        desc: 'Heritage carrots roasted whole, glazed in burnt honey and scattered with toasted seeds and dukkah. Sweet, smoky, a little bit dangerous.',
        tags: ['Popular'],
      },
      {
        name: 'Sourdough & cultured butter',
        price: '£6',
        img: '/img/photo-1424847651672-bf20a4b0982b.jpg',
        alt: 'Warm sourdough bread with a quenelle of cultured butter',
        short: 'Slow-proved sourdough, warm, with cultured butter and smoked salt.',
        desc: 'Our own slow-proved sourdough, served warm with a generous quenelle of cultured butter and a pinch of smoked salt. The dangerous opener.',
        tags: ['New'],
      },
    ],
  },
];

const badgeClass =
  'badge border border-primary/25 bg-primary/10 text-[11px] font-semibold text-primary';

type MenuKey = 'breakfast' | 'lunch' | 'dinner';
const tabs: { key: MenuKey; label: string; time: string }[] = [
  { key: 'breakfast', label: 'Breakfast', time: '7–11am' },
  { key: 'lunch', label: 'Lunch', time: '12–4pm' },
  { key: 'dinner', label: 'Dinner', time: '5–11pm' },
];

export default function PublicMenu() {
  const [menu, setMenu] = useState<MenuKey>('dinner');
  const [query, setQuery] = useState('');
  const [active, setActive] = useState<Dish | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const searchRef = useRef<HTMLInputElement>(null);

  const q = query.trim().toLowerCase();

  // Filtered dinner sections (only the Dinner panel has cards to filter).
  const filtered = useMemo(
    () =>
      dinner
        .map((sec) => ({
          ...sec,
          dishes: sec.dishes.filter(
            (d) => q === '' || `${d.name} ${d.desc}`.toLowerCase().includes(q),
          ),
        }))
        .filter((sec) => sec.dishes.length > 0),
    [q],
  );

  const noResults = menu === 'dinner' && filtered.length === 0;

  function openModal(dish: Dish) {
    setActive(dish);
  }
  function closeModal() {
    dialogRef.current?.close();
  }

  // Drive the native <dialog> from React state: showModal() when a dish is
  // active (free Escape close + focus trap + focus restore on close).
  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    if (active && !dlg.open) {
      dlg.showModal();
      document.body.style.overflow = 'hidden';
    }
  }, [active]);

  function onDialogClose() {
    document.body.style.overflow = '';
    setActive(null);
  }

  function onTabKeyDown(e: React.KeyboardEvent, i: number) {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      tabRefs.current[(i + 1) % tabs.length]?.focus();
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      tabRefs.current[(i - 1 + tabs.length) % tabs.length]?.focus();
    }
  }

  return (
    <>
      {/* ===== Controls (search + tabs) ===== */}
      <div className="sticky top-0 z-[60] border-b border-base-content/10 bg-base-100/92 backdrop-blur-md">
        <div className="mx-auto w-full max-w-[1180px] px-5 pt-3.5">
          <div className="relative mb-3">
            <svg
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-base-content/45"
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
            <input
              type="search"
              ref={searchRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="input w-full rounded-full bg-base-100 pl-[46px] pr-11 shadow-sm"
              placeholder="Search the menu…"
              aria-label="Search the menu by name or description"
              autoComplete="off"
            />
            {q.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  searchRef.current?.focus();
                }}
                className="absolute right-2 top-1/2 flex size-[34px] -translate-y-1/2 items-center justify-center rounded-full text-base-content/60 transition-colors hover:bg-base-200"
                aria-label="Clear search"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <div
            className="tabs tabs-border flex-nowrap gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            role="tablist"
            aria-label="Menus"
          >
            {tabs.map((t, i) => (
              <button
                key={t.key}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                className="tab h-auto flex-col gap-0.5 whitespace-nowrap px-4.5 py-2.5 font-semibold aria-[selected=true]:text-primary aria-[selected=true]:[&>small]:text-primary/75"
                role="tab"
                aria-selected={menu === t.key}
                aria-controls={`panel-${t.key}`}
                id={`tab-${t.key}`}
                onClick={() => setMenu(t.key)}
                onKeyDown={(e) => onTabKeyDown(e, i)}
              >
                {t.label}
                <small className="text-[11px] font-medium text-base-content/55">{t.time}</small>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ===== Menu body ===== */}
      <main className="mx-auto w-full max-w-[1180px] px-5 pt-[30px]">
        {/* Dinner */}
        <div className="menu-panel" id="panel-dinner" role="tabpanel" aria-labelledby="tab-dinner" hidden={menu !== 'dinner'}>
          {filtered.map((sec) => (
            <section className="mb-11" key={sec.title}>
              <div className="mb-[18px] flex items-baseline gap-3.5">
                <h2 className="text-[clamp(1.5rem,4vw,2rem)] font-semibold tracking-[-0.01em]">{sec.title}</h2>
                <span className="h-px flex-1 bg-base-content/10" aria-hidden="true" />
              </div>
              <div className="grid grid-cols-1 gap-[18px] min-[560px]:grid-cols-2 min-[920px]:grid-cols-3">
                {sec.dishes.map((d) => (
                  <button
                    key={d.name}
                    type="button"
                    onClick={() => openModal(d)}
                    className="card group relative flex flex-col overflow-hidden border border-base-content/10 bg-base-100 text-left shadow-sm transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-base-content/20 hover:shadow-floating focus-visible:-translate-y-1"
                  >
                    <figure className="relative aspect-[4/3] overflow-hidden bg-base-300">
                      {d.sold && (
                        <span className="absolute left-3 top-3 z-[2] rounded-full bg-cocoa-deep/85 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-base-100 backdrop-blur-sm">
                          Sold out
                        </span>
                      )}
                      <img
                        className={`size-full object-cover transition-transform duration-500 group-hover:scale-105${
                          d.sold ? ' grayscale-[50%] brightness-[0.82]' : ''
                        }`}
                        src={d.img}
                        alt={d.alt}
                        loading="lazy"
                      />
                    </figure>
                    <div className="card-body flex flex-1 flex-col gap-1.5 p-4">
                      <div className="flex items-baseline justify-between gap-3">
                        <h3 className="text-[1.18rem] font-semibold leading-tight">{d.name}</h3>
                        <span className="whitespace-nowrap text-[1.1rem] font-semibold text-primary price-display">{d.price}</span>
                      </div>
                      <p className="line-clamp-2 text-sm leading-relaxed text-base-content/70">{d.short}</p>
                      <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
                        {d.tags.map((tag) => (
                          <span className={badgeClass} key={tag}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          ))}

          {noResults && (
            <div className="py-[50px] text-center text-base-content/70" role="status">
              <h3 className="mb-1.5 text-[1.5rem] font-semibold text-base-content">Nothing on the menu matches that</h3>
              <p>Try a different word — maybe "smoked", "honey" or "charred".</p>
            </div>
          )}
        </div>

        {/* Breakfast (placeholder) */}
        <div className="menu-panel" id="panel-breakfast" role="tabpanel" aria-labelledby="tab-breakfast" hidden={menu !== 'breakfast'}>
          <section className="mb-11">
            <div className="mb-[18px] flex items-baseline gap-3.5">
              <h2 className="text-[clamp(1.5rem,4vw,2rem)] font-semibold tracking-[-0.01em]">Breakfast</h2>
              <span className="h-px flex-1 bg-base-content/10" aria-hidden="true" />
            </div>
            <p className="max-w-[46ch] text-base-content/70">
              Served 7–11am. Smoked-salmon flatbreads, saffron shakshuka and the house granola — the full breakfast menu is being plated. Switch to{' '}
              <strong className="font-semibold text-base-content">Dinner</strong> to browse tonight's service.
            </p>
          </section>
        </div>

        {/* Lunch (placeholder) */}
        <div className="menu-panel" id="panel-lunch" role="tabpanel" aria-labelledby="tab-lunch" hidden={menu !== 'lunch'}>
          <section className="mb-11">
            <div className="mb-[18px] flex items-baseline gap-3.5">
              <h2 className="text-[clamp(1.5rem,4vw,2rem)] font-semibold tracking-[-0.01em]">Lunch</h2>
              <span className="h-px flex-1 bg-base-content/10" aria-hidden="true" />
            </div>
            <p className="max-w-[46ch] text-base-content/70">
              Served 12–4pm. Grilled flatbread plates, a daily broth and the short-rib roll. Switch to{' '}
              <strong className="font-semibold text-base-content">Dinner</strong> to browse tonight's service.
            </p>
          </section>
        </div>
      </main>

      {/* ===== Item detail modal (daisyUI modal — native <dialog>) ===== */}
      <dialog className="modal" ref={dialogRef} onClose={onDialogClose} aria-labelledby="modalName">
        <div className="modal-box w-full max-w-[560px] overflow-hidden p-0">
          <button
            type="button"
            onClick={closeModal}
            className="absolute right-3 top-3 z-[3] inline-flex size-11 items-center justify-center rounded-full border border-base-content/15 bg-base-100/90 text-base-content shadow-sm transition-[background-color,transform] duration-200 hover:rotate-90 hover:bg-base-100"
            aria-label="Close dish details"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
          <figure className="relative aspect-[16/10] overflow-hidden bg-base-300">
            <img
              id="modalImg"
              className="size-full object-cover"
              src={active?.img ?? 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='}
              alt={active?.alt ?? ''}
            />
          </figure>
          <div className="p-6">
            <div className="mb-1 flex items-start justify-between gap-4">
              <h3 id="modalName" className="text-[1.85rem] font-semibold leading-[1.1]">
                {active?.name}
              </h3>
              <span className="whitespace-nowrap text-[1.5rem] font-semibold text-primary price-display">{active?.price}</span>
            </div>
            <div className="my-3.5 flex flex-wrap gap-2">
              {active?.tags.map((tag) => (
                <span className={badgeClass} key={tag}>
                  {tag}
                </span>
              ))}
            </div>
            <p className="text-[15.5px] leading-relaxed text-base-content/70">{active?.desc}</p>
            {active?.sold && (
              <span className="mt-4 inline-block rounded-full bg-base-content px-4 py-2 text-[13px] font-semibold text-base-100">
                Currently sold out
              </span>
            )}
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}

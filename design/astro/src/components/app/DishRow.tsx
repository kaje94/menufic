import type { Dish } from '../../data/types';

/* ============================================================
   SIGNATURE ISLAND: DishRow — menu-editor dish item row
   ------------------------------------------------------------
   Co-located, page-only component (used ONLY on /app/menu-editor).
   Ported from design/landing/app/menu-editor.html:
     - the `.item` row markup (source ~lines 518–535)
     - its bespoke CSS: `.grip`, `.rbtn`, `.item`, `.thumb`,
       `.it-text`/`.it-name`/`.it-desc`, `.price`, `.it-actions`,
       `.seg` + `.sdot` availability radiogroup, and the responsive
       reflow (source <style> ~lines 30–66, 134–201, 327–347)

   The co-located CSS lives in `dishRowStyles` (exported below). Because
   DishRow renders once per dish (×7), the page injects `dishRowStyles`
   ONCE via a single `<style is:global>` rather than each row hoisting its
   own copy (static Astro SSR does not dedupe per-island hoisted styles).
   That style is GLOBAL to the document, so the `.grip`/`.rbtn`/`.seg`
   primitives it declares also style the page's category-header grips/
   actions and the edit-panel form segment — shared affordances with a
   single source of truth here. `.editor`/`.menu-*`/`.ghost-add`/edit-panel
   layout lives in the page's own bespoke <style> block (menu-editor.astro).

   TOKEN HYGIENE (DESIGN.md): every colour/radius reads a design-system
   token — var(--color-*), var(--radius-field). Two documented carve-outs
   inherited verbatim from the source:
     - pure-black shadow stops  oklch(0 0 0 / …)      (DESIGN.md §4)
     - tomato-bright sold-out   oklch(0.66 0.19 32)   — brand shade with
       no token slot (DESIGN.md §7.7), used only on the sold-out chip
   `--ease` is a convenience easing alias defined once on :root by the
   page style block; consumed here for transition timing.
   ============================================================ */

export const dishRowStyles = `
/* ---- Drag grip (rows + category headers + menu list) ---- */
.grip {
  display: inline-flex; align-items: center; justify-content: center; flex: none;
  width: 26px; height: 44px;
  border: none; background: transparent; border-radius: 8px;
  color: color-mix(in oklch, var(--color-base-content) 45%, transparent);
  cursor: grab;
  transition: color .2s var(--ease), background .2s var(--ease);
}
.grip:hover {
  color: var(--color-secondary);
  background: color-mix(in oklch, var(--color-secondary) 10%, transparent);
}
.grip:active { cursor: grabbing; }
.grip svg { width: 16px; height: 16px; fill: currentColor; pointer-events: none; }

/* ---- Row / category action buttons (edit / delete) ---- */
.rbtn {
  width: 40px; height: 40px; border-radius: var(--radius-field); flex: none;
  display: inline-flex; align-items: center; justify-content: center;
  background: var(--color-base-200);
  border: 1px solid color-mix(in oklch, var(--color-base-content) 28%, transparent);
  color: color-mix(in oklch, var(--color-base-content) 60%, transparent);
  transition: background .2s var(--ease), color .2s var(--ease),
              border-color .2s var(--ease), transform .25s var(--ease);
}
.rbtn svg { width: 17px; height: 17px; stroke: currentColor; fill: none; }
.rbtn:hover {
  background: var(--color-base-300);
  border-color: var(--color-secondary);
  color: var(--color-secondary);
  transform: translateY(-1px);
}
/* Delete: hovers to error red — destructive action (DESIGN.md §7.7) */
.rbtn.del:hover {
  border-color: var(--color-error);
  color: var(--color-error);
}

/* ---- Dish item rows ---- */
.items { display: flex; flex-direction: column; }
.item {
  display: flex; align-items: center; gap: clamp(10px,1.2vw,14px);
  padding: 12px 6px;
  border-top: 1px solid color-mix(in oklch, var(--color-base-content) 28%, transparent);
  min-width: 0; border-radius: 12px;
  transition: background .2s var(--ease), transform .25s var(--ease), box-shadow .25s var(--ease);
}
.item:first-child { border-top: none; }
.item:hover {
  background: var(--color-base-300);
  transform: translateY(-1px);
  box-shadow: 0 12px 26px -20px oklch(0 0 0 / 0.85);
}
.item .thumb {
  width: 44px; height: 44px; border-radius: 12px; object-fit: cover; flex: none;
  border: 1px solid color-mix(in oklch, var(--color-base-content) 28%, transparent);
  background: var(--color-base-100);
}
.it-text { flex: 1; min-width: 0; }
.it-name {
  font-family: var(--font-display); font-weight: 600; font-size: 1.06rem; letter-spacing: -0.01em;
  color: var(--color-base-content); line-height: 1.2;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.it-desc {
  font-size: 12.8px; color: color-mix(in oklch, var(--color-base-content) 70%, transparent);
  line-height: 1.35; margin-top: 2px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 40ch;
}
.price {
  font-family: var(--font-body); font-weight: 600; font-size: 15px;
  color: var(--color-secondary); font-variant-numeric: tabular-nums;
  flex: none; min-width: 46px; text-align: right;
}
.it-actions { display: flex; align-items: center; gap: 7px; flex: none; }

/* ---- 3-way segmented status toggle (rows + edit-panel form) ---- */
.seg {
  display: inline-flex; align-items: center; gap: 2px; flex: none;
  background: var(--color-base-100);
  border: 1px solid color-mix(in oklch, var(--color-base-content) 28%, transparent);
  border-radius: 999px; padding: 3px;
}
.seg button {
  display: inline-flex; align-items: center; gap: 6px;
  min-height: 38px; padding: 0 11px;
  border: none; background: transparent; border-radius: 999px;
  color: color-mix(in oklch, var(--color-base-content) 60%, transparent);
  font-family: var(--font-body); font-weight: 600; font-size: 12.5px; white-space: nowrap;
  transition: background .2s var(--ease), color .2s var(--ease);
}
.seg button .sdot { width: 7px; height: 7px; border-radius: 50%; background: currentColor; opacity: .55; flex: none; }
.seg button:hover { color: var(--color-base-content); }
.seg button[aria-checked="true"] .sdot { opacity: 1; }
.seg button[aria-checked="true"][data-val="available"] {
  background: color-mix(in oklch, var(--color-success) 20%, transparent);
  color: color-mix(in oklch, var(--color-success) 90%, white);
}
.seg button[aria-checked="true"][data-val="soldout"] {
  background: color-mix(in oklch, var(--color-primary) 22%, transparent);
  color: oklch(0.66 0.19 32); /* tomato-bright brand shade — no token slot */
}
.seg button[aria-checked="true"][data-val="unavailable"] {
  background: var(--color-base-300);
  color: var(--color-base-content);
}

/* ---- Responsive reflow ---- */
@media (max-width: 1040px) { .it-desc { display: none; } }
@media (max-width: 960px)  { .it-desc { display: block; } }
@media (max-width: 680px) {
  .item { flex-wrap: wrap; row-gap: 10px; }
  .it-text { flex: 1 1 60%; }
  .price { order: 3; }
  .seg { order: 4; flex: 1 1 100%; justify-content: space-between; }
  .seg button { flex: 1; justify-content: center; }
  .it-actions { order: 5; margin-left: auto; }
  .it-desc { display: block !important; white-space: normal; max-width: none; }
}
@media (prefers-reduced-motion: reduce) {
  .grip, .rbtn, .item, .seg button { transition-duration: .01ms !important; }
}
`;

// Grip icon shared by every draggable affordance in the editor.
const GripIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="9" cy="6" r="1.4" /><circle cx="15" cy="6" r="1.4" />
    <circle cx="9" cy="12" r="1.4" /><circle cx="15" cy="12" r="1.4" />
    <circle cx="9" cy="18" r="1.4" /><circle cx="15" cy="18" r="1.4" />
  </svg>
);

const STATUSES: { val: Dish['availability']; label: string }[] = [
  { val: 'available', label: 'Available' },
  { val: 'soldout', label: 'Sold out' },
  { val: 'unavailable', label: 'Unavailable' },
];

export default function DishRow({ d }: { d: Dish }) {
  return (
    <article className="item" data-status={d.availability}>
        <button className="grip" type="button" aria-label={`Drag to reorder ${d.name}`}>
          <GripIcon />
        </button>
        <img className="thumb" src={d.image} alt={d.name} loading="lazy" />
        <div className="it-text">
          <div className="it-name">{d.name}</div>
          <div className="it-desc">{d.description}</div>
        </div>
        <div className="price">{d.price}</div>
        {/* Availability renders statically from d.availability (prototype
            fidelity — live toggling is not required). Roles/aria kept. */}
        <div className="seg" role="radiogroup" aria-label={`Availability of ${d.name}`}>
          {STATUSES.map((s) => (
            <button
              key={s.val}
              type="button"
              role="radio"
              data-val={s.val}
              aria-checked={d.availability === s.val}
            >
              <span className="sdot" aria-hidden="true"></span>
              {s.label}
            </button>
          ))}
        </div>
        <div className="it-actions">
          <button className="rbtn" type="button" aria-label={`Edit ${d.name}`}>
            <svg viewBox="0 0 24 24" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z" /></svg>
          </button>
          <button className="rbtn del" type="button" aria-label={`Delete ${d.name}`}>
            <svg viewBox="0 0 24 24" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
          </button>
        </div>
    </article>
  );
}

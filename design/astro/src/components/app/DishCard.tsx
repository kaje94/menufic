import type { Dish } from '../../data/types';

// Ported verbatim (as a class set) from design/landing/app/menu-editor.html
// `.item` dish rows, e.g. lines 518-535 ("Smoked short rib": data-name /
// data-desc / .price). Kept: `.item`/`.thumb`/`.it-text`/`.it-name`/
// `.it-desc`/`.price` — the DISPLAY row, not the `.edit-panel` slide-in form.
// Dropped vs. the full source row: `.grip` (drag handle), `.seg` availability
// toggle, and the edit/delete `.rbtn` actions — none are backed by the `Dish`
// interface (no reorder/availability/edit-target data), so there is nothing
// to wire them to here. NOTE: `.item`/`.thumb`/`.it-*`/`.price` are bespoke
// CSS defined in menu-editor.html's page-local <style> block, not yet ported
// into design/astro/src/styles/app.css — this component renders unstyled
// until that CSS lands (see task-6-report.md).
export default function DishCard({ d }: { d: Dish }) {
  return (
    <article className="item">
      <img className="thumb" src={d.image} alt={d.name} loading="lazy" />
      <div className="it-text">
        <div className="it-name">{d.name}</div>
        <div className="it-desc">{d.description}</div>
      </div>
      <div className="price">{d.price}</div>
      {d.tags && d.tags.length > 0 && (
        // menu-editor.html's own `.item` row has no display-tag markup (its
        // `.tag` chips only exist as a generic, unassigned picker in the edit
        // panel). Borrowed from the dish-tag badges on the public menu page
        // instead (design/landing/public/index.html lines ~152-154), which
        // are plain Tailwind/daisyUI `badge` utilities — no bespoke CSS.
        <div className="flex flex-wrap gap-1.5 pt-1">
          {d.tags.map((tag) => (
            <span key={tag} className="badge border border-primary/25 bg-primary/10 text-[11px] font-semibold text-primary">
              {tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}

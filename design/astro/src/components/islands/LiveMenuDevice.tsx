import type { CSSProperties } from 'react';

/* ============================================================
   SIGNATURE ISLAND: LiveMenuDevice — phone-frame "live menu"
   ------------------------------------------------------------
   Ported from design/landing/index.html:
     - bespoke CSS  (lines ~45–100: the shared `.phone` / `.menu-ui`
       live-menu component + the "Overdrive" interactive transitions)
     - markup       (lines ~649–687: the hero `.phone` composition)
   TOKENIZATION (island HARD RULE): every colour/radius reads a daisyUI /
   Tailwind theme token via the alias block on `.lmd-phone`
   (--bg → --color-base-100, --saffron → --color-secondary, …). The only
   raw oklch literals are device-chrome + hairline slots daisyUI has no
   token for (--line-soft, the frame/notch metals, shadow stacks) — kept
   as clearly-named locals / documented carve-outs, exactly as the source.
   ============================================================ */

const css = `
.lmd-phone{
  /* derivable aliases → theme tokens */
  --bg: var(--color-base-100);
  --surface: var(--color-base-200);
  --cream: var(--color-base-content);
  --cream-soft: var(--color-info);
  --saffron: var(--color-secondary);
  /* non-derivable device-chrome + hairlines (no daisyUI token exists) */
  --line-soft: oklch(0.42 0.03 58 / 0.28);
  --ease: cubic-bezier(0.16,1,0.3,1);

  position:relative;z-index:3;
  border-radius:42px;background:oklch(0.22 0.02 60);
  border:1px solid oklch(0.5 0.03 70 / 0.45);padding:11px;
  box-shadow:
    0 0 0 1px oklch(0.85 0.13 78 / 0.12),
    0 2px 3px oklch(0.85 0.13 78 / 0.28),
    0 50px 100px -28px oklch(0 0 0 / 0.92),
    0 18px 40px -14px oklch(0 0 0 / 0.85);
}
.lmd-phone .phone-screen{position:relative;border-radius:32px;overflow:hidden;background:var(--bg);aspect-ratio:9/19.2}
.lmd-phone .phone-notch{position:absolute;top:9px;left:50%;transform:translateX(-50%);z-index:6;width:78px;height:20px;border-radius:0 0 14px 14px;background:oklch(0.16 0.02 55)}
.lmd-phone .menu-ui{display:flex;flex-direction:column;height:100%;background:var(--bg)}
.lmd-phone .menu-cover{position:relative;height:128px;flex:none;background-size:cover;background-position:center}
.lmd-phone .menu-cover::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,oklch(0 0 0 /0.1),oklch(0.185 0.028 55 /0.9))}
.lmd-phone .menu-head{position:absolute;z-index:2;left:14px;right:14px;bottom:10px}
.lmd-phone .menu-head .badge{display:inline-block;font-size:9px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:var(--bg);background:var(--accent,var(--saffron));border-radius:999px;padding:3px 9px;margin-bottom:7px}
.lmd-phone .menu-head h4{font-family:var(--font-display);font-weight:700;font-size:21px;letter-spacing:-0.02em;color:var(--cream);line-height:1}
.lmd-phone .menu-head .loc{font-size:11px;color:var(--cream-soft);margin-top:4px;display:flex;align-items:center;gap:5px}
.lmd-phone .menu-tabs{display:flex;gap:7px;padding:11px 14px 4px;flex:none;overflow:hidden}
.lmd-phone .menu-tabs .mt{font-size:11px;font-weight:600;color:var(--cream-soft);padding:5px 11px;border-radius:999px;background:transparent;white-space:nowrap}
.lmd-phone .menu-tabs .mt.act{color:var(--bg);background:var(--accent,var(--saffron))}
.lmd-phone .menu-list{flex:1 1 auto;padding:4px 14px 16px;display:flex;flex-direction:column;gap:9px;min-height:0;overflow:hidden}
.lmd-phone .mrow{display:flex;gap:11px;align-items:center;padding:7px;border-radius:calc(var(--accent-r,14px));background:var(--surface);border:1px solid var(--line-soft)}
.lmd-phone .mrow img{width:46px;height:46px;border-radius:calc(var(--accent-r,10px) - 3px);object-fit:cover;flex:none}
.lmd-phone .mrow .mmeta{flex:1;min-width:0}
.lmd-phone .mrow .mname{font-size:12.5px;font-weight:600;color:var(--cream);line-height:1.15;display:flex;align-items:center;gap:6px;flex-wrap:wrap}
.lmd-phone .mrow .mtag{font-size:8px;font-weight:700;letter-spacing:.03em;text-transform:uppercase;color:var(--accent,var(--saffron));border:1px solid var(--accent,var(--saffron));border-radius:5px;padding:1px 5px}
.lmd-phone .mrow .mdesc{font-size:10px;color:var(--cream-soft);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.lmd-phone .mrow .mprice{font-family:var(--font-display);font-weight:600;font-size:14px;color:var(--cream);flex:none}

/* ---- Overdrive: interactive live-menu transitions (source lines ~77–100) ---- */
.lmd-phone .menu-tabs .mt{border:0;cursor:pointer;font-family:inherit;-webkit-appearance:none;appearance:none;transition:background-color .4s var(--ease),color .4s var(--ease)}
.lmd-phone .menu-tabs .mt:focus-visible{outline:2px solid var(--saffron);outline-offset:2px}
.lmd-phone .menu-head .badge,.lmd-phone .mrow .mtag{transition:background-color .4s var(--ease),color .4s var(--ease),border-color .4s var(--ease)}
.lmd-phone .mrow,.lmd-phone .mrow img{transition:border-radius .4s var(--ease)}
@media (prefers-reduced-motion: reduce){
  .lmd-phone .menu-tabs .mt,.lmd-phone .menu-head .badge,.lmd-phone .mrow,.lmd-phone .mrow img,.lmd-phone .mrow .mtag{transition:none}
}
`;

export interface MenuDish {
  img: string;
  name: string;
  tag?: string;
  desc: string;
  price: string;
}

export interface LiveMenuDeviceProps {
  /** Two-Accent variant: 'saffron' (landing hero) or 'tomato' (editor).
      Maps to a theme token — never a raw colour. */
  accent?: 'saffron' | 'tomato';
  /** Corner radius (px) applied to the dish rows via `--accent-r`. */
  accentRadius?: number;
  cover?: string;
  badge?: string;
  name?: string;
  loc?: string;
  tabs?: string[];
  activeTab?: number;
  dishes?: MenuDish[];
}

/* Default content mirrors the hero's "Saffron & Smoke" mains menu. */
const DEFAULT_DISHES: MenuDish[] = [
  { img: '/img/photo-1432139555190-58524dae6a55.jpg', name: 'Smoked short rib', tag: "Chef's pick", desc: '36-hour cook, burnt-honey glaze', price: '$28' },
  { img: '/img/photo-1484723091739-30a097e8f929.jpg', name: 'Saffron prawns', tag: 'Popular', desc: 'Chilli butter, charred lemon', price: '$22' },
  { img: '/img/photo-1455619452474-d2be8b1e70cd.jpg', name: 'Red shrimp broth', desc: 'Smoked tomato, fennel', price: '$16' },
  { img: '/img/photo-1565299624946-b28f40a0ae38.jpg', name: 'Wood-fired margherita', desc: 'San Marzano, basil oil', price: '$19' },
];

export default function LiveMenuDevice({
  accent = 'saffron',
  accentRadius = 14,
  cover = '/img/photo-1432139555190-58524dae6a55.jpg',
  badge = 'Now serving',
  name = 'Saffron & Smoke',
  loc = '📍 Modern grill · Open till 11',
  tabs = ['Mains', 'Small plates', 'Sides'],
  activeTab = 0,
  dishes = DEFAULT_DISHES,
}: LiveMenuDeviceProps) {
  // Accent resolves to a theme token, never a raw colour literal.
  const accentToken = accent === 'tomato' ? 'var(--color-primary)' : 'var(--color-secondary)';
  const menuStyle = {
    '--accent': accentToken,
    '--accent-r': `${accentRadius}px`,
  } as CSSProperties;

  return (
    <>
      <style href="menufic-live-menu-device" precedence="high">{css}</style>
      <div className="lmd-phone">
        <div className="phone-notch" aria-hidden="true" />
        <div className="phone-screen">
          <div className="menu-ui" style={menuStyle}>
            <div className="menu-cover" style={{ backgroundImage: `url('${cover}')` }}>
              <div className="menu-head">
                <span className="badge">{badge}</span>
                <h4>{name}</h4>
                <span className="loc">{loc}</span>
              </div>
            </div>
            <div className="menu-tabs" role="tablist" aria-label="Menu categories">
              {tabs.map((t, i) => (
                <button
                  key={t}
                  className={`mt${i === activeTab ? ' act' : ''}`}
                  type="button"
                  role="tab"
                  aria-selected={i === activeTab}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="menu-list" role="tabpanel" aria-live="polite">
              {dishes.map((d) => (
                <div className="mrow" key={d.name}>
                  <img src={d.img} alt={d.name} loading="lazy" />
                  <div className="mmeta">
                    <div className="mname">
                      {d.name}
                      {d.tag ? <span className="mtag">{d.tag}</span> : null}
                    </div>
                    <div className="mdesc">{d.desc}</div>
                  </div>
                  <div className="mprice">{d.price}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

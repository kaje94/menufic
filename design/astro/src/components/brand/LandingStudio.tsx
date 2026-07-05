import { useEffect, useState, type CSSProperties } from 'react';

/* ============================================================
   LANDING ISLAND: LandingStudio — the landing's live theme sandbox
   ------------------------------------------------------------
   Ported from design/landing/index.html (the landing's OWN `#studio`,
   NOT theme.html's preset-grid design):
     - bespoke CSS  (lines ~436–537: `.studio-grid`, `.preview-frame`,
       `.demo-menu`/`.drow`, swatches, native picker, radius slider,
       font select, tone/size segments, footer)
     - markup       (lines ~828–940)
     - controls JS  (lines ~1482–1540) → React hooks below.

   The plan's island list (§8) omitted this landing-specific island;
   it carries bespoke CSS + live-restyle JS with no home elsewhere, so
   it becomes a co-located client island (Task 12). It is intentionally
   distinct from ThemeBuilderPreview (theme.html's studio) — reusing
   that would be a visible design divergence.

   RUNTIME RESTYLE: the `.demo-menu` is a bespoke component driven by
   local vars (--acc / --rad / --fontd) + a `.light` tone class, written
   INLINE via a React style object (same inline-var mechanism as the
   real builder). Size segment toggles a `.desktop` class on the frame.

   TOKENIZATION: derivable colours read theme tokens via the alias
   block. Swatch/preset colours are USER data (arbitrary owner-picked
   accents) → kept as inline literals. The `.demo-menu.light` palette,
   photo-cover overlay, white QR chips and black shadow stops are
   documented carve-outs with no daisyUI token, exactly as the source.

   FONT NOTE (Phase-0 deferred, Tasks 18/22): Gambetta / Sentient /
   General Sans are not yet loaded in design/astro, so those font
   options fall back through their serif/sans stacks until the Fontshare
   links land. Boska (default) renders correctly. Options kept faithful.
   ============================================================ */

const css = `
.lst{
  /* derivable aliases → theme tokens */
  --bg: var(--color-base-100);
  --surface: var(--color-base-200);
  --surface-2: var(--color-base-300);
  --saffron: var(--color-secondary);
  --saffron-deep: var(--color-accent);
  --cream: var(--color-base-content);
  --cream-soft: var(--color-info);
  /* non-derivable hairlines (no daisyUI token exists) */
  --line: oklch(0.42 0.03 48 / 0.5);
  --line-soft: oklch(0.42 0.03 58 / 0.28);
  --ease: cubic-bezier(0.16,1,0.3,1);
  background:var(--surface);
}
.lst .studio-grid{display:grid;grid-template-columns:1.15fr 0.85fr;gap:clamp(28px,4vw,56px);align-items:center}
.lst .studio-stage{display:flex;justify-content:center;min-width:0}
.lst .preview-frame{
  position:relative;background:oklch(0.22 0.02 60);
  border:1px solid oklch(0.5 0.03 70 /0.4);
  box-shadow:0 50px 90px -40px oklch(0 0 0 /0.85);
  transition:border-radius .5s var(--ease);
  width:min(320px,84vw);border-radius:42px;padding:12px;
}
.lst .preview-frame.desktop{width:min(560px,90vw);border-radius:20px;padding:12px 12px 16px}
.lst .preview-frame.desktop .preview-screen{border-radius:11px;aspect-ratio:16/11}
.lst .preview-frame.desktop .topbar{display:flex}
.lst .preview-screen{position:relative;border-radius:32px;overflow:hidden;background:var(--demo-bg,var(--bg));aspect-ratio:9/18;transition:background .35s var(--ease)}
.lst .preview-frame .topbar{display:none;align-items:center;gap:6px;padding:0 4px 10px}
.lst .preview-frame .topbar i{width:10px;height:10px;border-radius:50%;background:oklch(0.45 0.02 60);display:block}
/* the restyled live menu — driven by CSS vars on .demo-menu */
.lst .demo-menu{
  --acc:var(--saffron);--rad:18px;--fontd:var(--font-display);
  --demo-bg:var(--bg);--demo-surface:var(--surface);--demo-line:var(--line-soft);
  --demo-cream:var(--cream);--demo-cream-soft:var(--cream-soft);
  display:flex;flex-direction:column;height:100%;background:var(--demo-bg);transition:background .35s var(--ease);
}
.lst .demo-menu.light{
  --demo-bg:oklch(0.985 0.006 95);--demo-surface:oklch(0.96 0.012 92);--demo-line:oklch(0.55 0.02 90 /0.3);
  --demo-cream:oklch(0.2 0.02 80);--demo-cream-soft:oklch(0.42 0.02 85);
}
.lst .demo-cover{position:relative;height:34%;min-height:120px;flex:none;background-size:cover;background-position:center}
.lst .demo-cover::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,oklch(0 0 0 /0.08),oklch(0.185 0.028 55 /0.92));transition:background .35s var(--ease)}
.lst .demo-menu.light .demo-cover::after{background:linear-gradient(180deg,oklch(0 0 0 /0.04),oklch(0.18 0.02 80 /0.55))}
.lst .demo-head{position:absolute;z-index:2;left:16px;right:16px;bottom:12px}
.lst .demo-head .badge{display:inline-block;font-size:10px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:oklch(1 0 0);background:var(--acc);border-radius:999px;padding:3px 10px;margin-bottom:8px;transition:background .35s var(--ease)}
.lst .demo-head h4{font-family:var(--fontd);font-weight:700;font-size:clamp(20px,4vw,26px);letter-spacing:-0.02em;color:var(--cream);line-height:1}
.lst .demo-head .loc{font-size:11.5px;color:var(--cream-soft);margin-top:5px}
.lst .demo-tabs{display:flex;gap:8px;padding:12px 16px 4px;flex:none;overflow:hidden}
.lst .demo-tabs .dt{font-size:11.5px;font-weight:600;color:var(--demo-cream-soft);padding:6px 12px;border-radius:calc(var(--rad) * 0.7);background:transparent;white-space:nowrap;transition:border-radius .35s var(--ease),color .35s var(--ease)}
.lst .demo-tabs .dt.act{color:oklch(1 0 0);background:var(--acc);transition:background .35s var(--ease),border-radius .35s var(--ease)}
.lst .demo-list{flex:1 1 auto;padding:6px 16px 18px;display:flex;flex-direction:column;gap:11px;min-height:0;overflow:hidden}
.lst .drow{display:flex;gap:12px;align-items:center;padding:9px;border-radius:var(--rad);background:var(--demo-surface);border:1px solid var(--demo-line);transition:border-radius .35s var(--ease),background .35s var(--ease),border-color .35s var(--ease)}
.lst .drow img{width:52px;height:52px;border-radius:calc(var(--rad) * 0.66);object-fit:cover;flex:none;transition:border-radius .35s var(--ease)}
.lst .drow .dm{flex:1;min-width:0}
.lst .drow .dn{font-family:var(--fontd);font-size:14px;font-weight:600;color:var(--demo-cream);line-height:1.15;display:flex;align-items:center;gap:7px;flex-wrap:wrap}
.lst .drow .dtag{font-size:8.5px;font-weight:700;letter-spacing:.03em;text-transform:uppercase;color:var(--acc);border:1px solid var(--acc);border-radius:5px;padding:1px 6px;transition:color .35s var(--ease),border-color .35s var(--ease)}
.lst .drow .dd{font-size:11px;color:var(--demo-cream-soft);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.lst .drow .dp{font-family:var(--fontd);font-weight:600;font-size:15px;color:var(--demo-cream);flex:none}

/* controls */
.lst .studio-controls{min-width:0}
.lst .studio-controls h3{font-size:clamp(1.4rem,2.6vw,2rem);color:var(--cream)}
.lst .studio-controls .ctrl-lede{margin-top:12px;color:var(--cream-soft);font-size:16px;line-height:1.55;max-width:42ch}
.lst .ctrl{margin-top:26px}
.lst .ctrl > .lbl{display:block;font-size:13px;font-weight:600;color:var(--cream-soft);margin-bottom:11px}
.lst .swatches{display:flex;gap:11px;flex-wrap:wrap;align-items:center}
.lst .sw{width:46px;height:46px;border-radius:13px;border:3px solid transparent;transition:transform .2s var(--ease),border-color .2s var(--ease)}
.lst .sw:hover{transform:scale(1.07)}
.lst .sw[aria-pressed="true"]{border-color:var(--cream)}
/* native color picker, dressed as a swatch */
.lst .color-pick{position:relative;display:inline-flex;align-items:center}
.lst .color-pick input[type="color"]{
  -webkit-appearance:none;appearance:none;width:46px;height:46px;min-width:44px;min-height:44px;
  border:3px dashed var(--line);border-radius:13px;background:transparent;cursor:pointer;padding:0;
}
.lst .color-pick input[type="color"]::-webkit-color-swatch-wrapper{padding:3px}
.lst .color-pick input[type="color"]::-webkit-color-swatch{border:none;border-radius:9px}
.lst .color-pick input[type="color"]::-moz-color-swatch{border:none;border-radius:9px}
.lst .color-pick .cp-lbl{font-size:12.5px;color:var(--cream-soft);margin-left:11px;font-weight:600}
/* range slider */
.lst .range-row{display:flex;align-items:center;gap:14px}
.lst .range-row input[type="range"]{
  -webkit-appearance:none;appearance:none;flex:1;min-width:0;height:40px;background:transparent;cursor:pointer;outline-offset:4px;
}
.lst .range-row input[type="range"]::-webkit-slider-runnable-track{height:6px;border-radius:999px;background:linear-gradient(90deg,var(--saffron),var(--saffron-deep))}
.lst .range-row input[type="range"]::-moz-range-track{height:6px;border-radius:999px;background:linear-gradient(90deg,var(--saffron),var(--saffron-deep))}
.lst .range-row input[type="range"]::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;margin-top:-10px;width:26px;height:26px;border-radius:50%;background:var(--cream);border:3px solid var(--saffron-deep);cursor:pointer;box-shadow:0 4px 12px -3px oklch(0 0 0 /0.6)}
.lst .range-row input[type="range"]::-moz-range-thumb{width:26px;height:26px;border-radius:50%;background:var(--cream);border:3px solid var(--saffron-deep);cursor:pointer}
.lst .range-row .rad-read{font-variant-numeric:tabular-nums;font-weight:600;font-size:14px;color:var(--cream);min-width:48px;text-align:right}
/* select / segmented */
.lst .studio-select{
  width:100%;min-height:48px;background:var(--bg);color:var(--cream);
  border:1px solid var(--line);border-radius:12px;padding:0 44px 0 16px;
  font-family:var(--font-body);font-size:15px;font-weight:500;cursor:pointer;
  appearance:none;-webkit-appearance:none;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23d9cdbb' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat:no-repeat;background-position:right 16px center;
}
.lst .segset{display:inline-flex;background:var(--bg);border:1px solid var(--line);border-radius:12px;padding:4px;gap:4px;flex-wrap:wrap}
.lst .segset button{min-height:44px;padding:0 16px;border:none;background:transparent;color:var(--cream-soft);font-size:14px;font-weight:600;border-radius:9px;transition:background .25s var(--ease),color .25s var(--ease)}
.lst .segset button[aria-pressed="true"]{background:var(--surface-2);color:var(--cream)}
.lst .studio-foot{margin-top:30px;padding-top:26px;border-top:1px solid var(--line-soft);display:flex;align-items:center;gap:18px;flex-wrap:wrap}
.lst .studio-foot .sqr{background:oklch(1 0 0);border-radius:12px;padding:9px;line-height:0;flex:none}
.lst .studio-foot .sqr img{width:84px;height:84px}
.lst .studio-foot .sview b{display:block;font-family:var(--font-display);font-weight:600;font-size:1.05rem;color:var(--cream)}
.lst .studio-foot .sview .vl{display:inline-flex;align-items:center;gap:7px;color:var(--cream);font-weight:600;font-size:15px;margin-top:7px}
.lst .studio-foot .sview .vl .arr{transition:transform .3s var(--ease)}
.lst .studio-foot .sview .vl:hover .arr{transform:translateX(4px)}
.lst .studio-foot .sview .surl{display:block;font-size:12.5px;color:var(--cream-soft);font-weight:400;margin-top:3px}
@media (max-width:880px){
  .lst .studio-grid{grid-template-columns:1fr;gap:40px}
  .lst .studio-stage{order:2}
  .lst .preview-frame.desktop{width:min(560px,92vw)}
}

/* Self-managed reveal (React-owned) — a stateful island can't share
   PageMotion's global .reveal class: a control re-render would strip the
   observer-added .in and hide the columns. So the island owns its entrance. */
.js .lst .lst-reveal{opacity:0;transform:translateY(30px)}
.js .lst .lst-reveal.in{opacity:1;transform:none;transition:opacity 700ms var(--ease),transform 700ms var(--ease)}
@media (prefers-reduced-motion:reduce){
  .js .lst .lst-reveal{opacity:1 !important;transform:none !important}
}
`;

/* Accent presets — data-acc values are USER-picked colours (data, not tokens). */
const SWATCHES = [
  { acc: '#e0a94a', label: 'Saffron accent', bg: 'oklch(0.80 0.135 78)' },
  { acc: '#d2492f', label: 'Tomato accent', bg: 'oklch(0.66 0.19 32)' },
  { acc: '#4caa6e', label: 'Fresh green accent', bg: 'oklch(0.74 0.15 150)' },
  { acc: '#6f8fd6', label: 'Ocean blue accent', bg: 'oklch(0.70 0.13 250)' },
];

const FONT_OPTIONS = [
  { value: '"Boska",Georgia,serif', label: 'Boska (elegant serif)' },
  { value: '"Gambetta",Georgia,serif', label: 'Gambetta (editorial serif)' },
  { value: '"Sentient",Georgia,serif', label: 'Sentient (refined serif)' },
  { value: '"General Sans","Supreme",sans-serif', label: 'General Sans (clean sans)' },
];

export default function LandingStudio() {
  const [shown, setShown] = useState(false);
  const [acc, setAcc] = useState('#e0a94a');
  const [pressedSwatch, setPressedSwatch] = useState<string | null>('#e0a94a');
  const [radius, setRadius] = useState(18);
  const [font, setFont] = useState(FONT_OPTIONS[0].value);
  const [tone, setTone] = useState<'dark' | 'light'>('dark');
  const [size, setSize] = useState<'phone' | 'desktop'>('phone');

  // Entrance fade fires on hydration (client:visible ⇒ we're in view).
  useEffect(() => setShown(true), []);

  // Live restyle: local vars written inline on the .demo-menu root.
  const demoStyle = {
    '--acc': acc,
    '--rad': `${radius}px`,
    '--fontd': font,
  } as CSSProperties;

  return (
    <section id="studio" className="lst relative py-[clamp(72px,10vw,128px)]" aria-labelledby="studio-h">
      <style href="menufic-landing-studio" precedence="high">{css}</style>
      <div className="mx-auto w-full max-w-[1200px] px-6">
        <div className="studio-grid">
          <div className={`studio-stage lst-reveal${shown ? ' in' : ''}`}>
            <div className={`preview-frame${size === 'desktop' ? ' desktop' : ''}`}>
              <div className="topbar" aria-hidden="true"><i /><i /><i /></div>
              <div className="preview-screen">
                <div className={`demo-menu${tone === 'light' ? ' light' : ''}`} style={demoStyle}>
                  <div className="demo-cover" style={{ backgroundImage: "url('/img/photo-1432139555190-58524dae6a55.jpg')" }}>
                    <div className="demo-head">
                      <span className="badge">Now serving</span>
                      <h4>Saffron &amp; Smoke</h4>
                      <span className="loc">📍 Modern grill · Open till 11</span>
                    </div>
                  </div>
                  <div className="demo-tabs"><span className="dt act">Mains</span><span className="dt">Small plates</span><span className="dt">Sides</span></div>
                  <div className="demo-list">
                    <div className="drow">
                      <img src="/img/photo-1432139555190-58524dae6a55.jpg" alt="Charred short rib on a dark plate" loading="lazy" />
                      <div className="dm"><div className="dn">Smoked short rib <span className="dtag">Chef's pick</span></div><div className="dd">36-hour cook, burnt-honey glaze</div></div>
                      <div className="dp">$28</div>
                    </div>
                    <div className="drow">
                      <img src="/img/photo-1484723091739-30a097e8f929.jpg" alt="Seared prawns" loading="lazy" />
                      <div className="dm"><div className="dn">Saffron prawns <span className="dtag">Popular</span></div><div className="dd">Chilli butter, charred lemon</div></div>
                      <div className="dp">$22</div>
                    </div>
                    <div className="drow">
                      <img src="/img/photo-1455619452474-d2be8b1e70cd.jpg" alt="Red shrimp broth" loading="lazy" />
                      <div className="dm"><div className="dn">Red shrimp broth</div><div className="dd">Smoked tomato, fennel</div></div>
                      <div className="dp">$16</div>
                    </div>
                    <div className="drow">
                      <img src="/img/photo-1565299624946-b28f40a0ae38.jpg" alt="Wood-fired pizza" loading="lazy" />
                      <div className="dm"><div className="dn">Wood-fired margherita</div><div className="dd">San Marzano, basil oil</div></div>
                      <div className="dp">$19</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={`studio-controls lst-reveal${shown ? ' in' : ''}`}>
            <h3 id="studio-h">Make it yours in seconds.</h3>
            <p className="ctrl-lede">This is a real, hands-on sandbox. Pick any colour, drag the corners, swap the font, and the menu on the left restyles instantly. It's the same studio you'll use on your own restaurant.</p>

            {/* Accent colour: presets + native custom picker */}
            <div className="ctrl">
              <span className="lbl" id="acc-lbl">Accent colour</span>
              <div className="swatches" role="group" aria-labelledby="acc-lbl">
                {SWATCHES.map((sw) => (
                  <button
                    key={sw.acc}
                    className="sw"
                    type="button"
                    data-acc={sw.acc}
                    aria-pressed={pressedSwatch === sw.acc}
                    aria-label={sw.label}
                    style={{ background: sw.bg }}
                    onClick={() => {
                      setAcc(sw.acc);
                      setPressedSwatch(sw.acc);
                    }}
                  />
                ))}
                <span className="color-pick">
                  <input
                    type="color"
                    id="customColour"
                    value={acc}
                    aria-label="Custom colour (pick any accent)"
                    onInput={(e) => {
                      setAcc((e.target as HTMLInputElement).value);
                      setPressedSwatch(null);
                    }}
                  />
                  <label className="cp-lbl" htmlFor="customColour">Custom colour</label>
                </span>
              </div>
            </div>

            {/* Corner radius: real range slider with live readout */}
            <div className="ctrl">
              <label className="lbl" htmlFor="radiusRange">Corner radius</label>
              <div className="range-row">
                <input
                  type="range"
                  id="radiusRange"
                  min={0}
                  max={24}
                  step={1}
                  value={radius}
                  aria-describedby="radiusVal"
                  onInput={(e) => setRadius(Number((e.target as HTMLInputElement).value))}
                />
                <span className="rad-read" id="radiusVal">{radius}px</span>
              </div>
            </div>

            {/* Font: select from menu-appropriate Fontshare faces */}
            <div className="ctrl">
              <label className="lbl" htmlFor="fontSelect">Menu font</label>
              <select
                className="studio-select"
                id="fontSelect"
                value={font}
                onChange={(e) => setFont(e.target.value)}
              >
                {FONT_OPTIONS.map((f) => (
                  <option key={f.value} value={f.value}>{f.label}</option>
                ))}
              </select>
            </div>

            {/* Background tone toggle */}
            <div className="ctrl">
              <span className="lbl" id="tone-lbl">Menu tone</span>
              <div className="segset" role="group" aria-labelledby="tone-lbl">
                <button type="button" data-tone="dark" aria-pressed={tone === 'dark'} onClick={() => setTone('dark')}>Dark</button>
                <button type="button" data-tone="light" aria-pressed={tone === 'light'} onClick={() => setTone('light')}>Light</button>
              </div>
            </div>

            {/* Size toggle */}
            <div className="ctrl">
              <span className="lbl" id="size-lbl">Preview</span>
              <div className="segset" role="group" aria-labelledby="size-lbl">
                <button type="button" data-size="phone" aria-pressed={size === 'phone'} onClick={() => setSize('phone')}>Phone</button>
                <button type="button" data-size="desktop" aria-pressed={size === 'desktop'} onClick={() => setSize('desktop')}>Desktop</button>
              </div>
            </div>

            <div className="studio-foot">
              <span className="sqr"><img src="https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=https://menufic.com/r/saffron-smoke" alt="QR code for the live Saffron and Smoke menu" width={84} height={84} /></span>
              <div className="sview">
                <b>This is a real menu.</b>
                <a className="vl" href="/public">View live menu <span className="arr" aria-hidden="true">→</span></a>
                <span className="surl">menufic.com/r/saffron-smoke</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

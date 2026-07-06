import { useState, type CSSProperties } from 'react';

/* ============================================================
   SIGNATURE ISLAND: ThemeBuilderPreview — theme studio
   ------------------------------------------------------------
   Ported from design/landing/app/theme.html:
     - bespoke CSS  (lines ~28–452: studio grid, preset thumbnails,
       colour swatches, native picker, radius slider, size segment,
       dotted preview stage, and the `.device` owner-menu preview)
     - controls + applyTheme() logic (inline <script> lines ~889–1040)

   RUNTIME THEMING (DESIGN.md §7.6): the preview `.device` carries
   data-theme="menufic-public" (the owner's warm LIGHT theme) and is
   customised by OVERRIDING daisyUI's OWN vars INLINE on the device
   root — the identical mechanism the real public menu uses. Here that
   inline write is expressed declaratively as a React style object
   (`deviceStyle`) instead of imperative el.style.setProperty(...):

     control          → inline var(s) on #device
     ----------------   ----------------------------------------
     preset (×8)      → --color-base-100/200/content, --menu-muted,
                        --menu-line, --color-primary, --radius-box,
                        --radius-field, --menu-font   (applyTheme)
     swatch / picker  → --color-primary                (applyPrimary)
     radius slider    → --radius-box + --radius-field  (applyRadius)
     font select      → --menu-font                    (applyFont)
     size segment     → .device .tablet/.desktop class (no var)

   Initial state = presets[0], so the "applyTheme(current)" init call
   (which stops the device drifting to the theme's own terracotta
   default) happens automatically on first render.

   TOKENIZATION: the CSS already reads daisyUI/Tailwind tokens
   throughout (var(--color-*), var(--radius-box), var(--font-body)).
   --menu-muted / --menu-line / --menu-font are page-scoped extras for
   slots daisyUI has no token for; preset/swatch hexes are USER data
   (arbitrary owner-picked colours), not theme values; pure-black
   shadow stops + the photo-cover overlay rgba are documented carve-outs.
   ============================================================ */

const css = `
.tbp-studio {
  display: grid;
  grid-template-columns: minmax(0, 420px) minmax(0, 1fr);
  gap: clamp(18px, 2.4vw, 28px);
  align-items: start;
}
@media (max-width: 960px) {
  .tbp-studio { grid-template-columns: 1fr; }
  .tbp-studio .preset-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
}
@media (max-width: 600px) {
  .tbp-studio .preset-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

/* ---- Preset thumbnails ---- */
.tbp-studio .preset-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
.tbp-studio .preset {
  position: relative; display: flex; flex-direction: column; gap: 7px; padding: 8px;
  background: var(--color-base-300);
  border: 1px solid color-mix(in oklch, var(--color-base-content) 28%, transparent);
  border-radius: 14px; text-align: left;
  transition: border-color .2s cubic-bezier(0.16,1,0.3,1), transform .25s cubic-bezier(0.16,1,0.3,1);
  min-width: 0; cursor: pointer;
}
.tbp-studio .preset:hover { transform: translateY(-2px); border-color: color-mix(in oklch, var(--color-base-content) 50%, transparent); }
.tbp-studio .preset[aria-pressed="true"] { border-color: var(--color-secondary); box-shadow: 0 0 0 2px color-mix(in oklch, var(--color-secondary) 50%, transparent); }
.tbp-studio .preset .mini {
  border-radius: 9px; overflow: hidden; aspect-ratio: 16/10; display: flex; flex-direction: column;
  justify-content: flex-end; gap: 4px; padding: 9px; border: 1px solid oklch(0 0 0 / .12);
}
.tbp-studio .preset .mini .bar { height: 7px; border-radius: 99px; width: 62%; }
.tbp-studio .preset .mini .ln  { height: 4px; border-radius: 99px; background: currentColor; opacity: .32; }
.tbp-studio .preset .mini .ln.short { width: 42%; }
.tbp-studio .preset .pname { font-family: var(--font-body); font-weight: 600; font-size: 0.78rem; color: var(--color-base-content); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.tbp-studio .preset .check {
  position: absolute; top: 6px; right: 6px; width: 20px; height: 20px; border-radius: 50%;
  background: var(--color-secondary); color: var(--color-cocoa-deep);
  display: none; align-items: center; justify-content: center;
}
.tbp-studio .preset .check svg { width: 13px; height: 13px; stroke: currentColor; stroke-width: 3; }
.tbp-studio .preset[aria-pressed="true"] .check { display: inline-flex; }

/* ---- Colour swatches ---- */
.tbp-studio .swatches { display: flex; flex-wrap: wrap; gap: 9px; }
.tbp-studio .swatch {
  width: 40px; height: 40px; border-radius: 10px; flex: none;
  border: 1px solid color-mix(in oklch, var(--color-base-content) 50%, transparent);
  position: relative; transition: transform .2s cubic-bezier(0.16,1,0.3,1); cursor: pointer;
}
.tbp-studio .swatch:hover { transform: translateY(-2px); }
.tbp-studio .swatch[aria-pressed="true"] { box-shadow: 0 0 0 2px var(--color-base-200), 0 0 0 4px var(--color-secondary); }

/* ---- Native colour picker ---- */
.tbp-studio .color-row { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.tbp-studio .color-input-wrap {
  position: relative; width: 48px; height: 48px; border-radius: 12px; overflow: hidden;
  border: 1px solid color-mix(in oklch, var(--color-base-content) 50%, transparent);
  flex: none; background: var(--color-base-300);
}
.tbp-studio .color-input-wrap input[type="color"] {
  position: absolute; inset: -6px; width: calc(100% + 12px); height: calc(100% + 12px);
  border: none; padding: 0; background: transparent; cursor: pointer;
}
.tbp-studio .hex-read {
  font-family: var(--font-body); font-weight: 600; font-size: 0.92rem; color: var(--color-base-content);
  background: var(--color-base-300); border: 1px solid color-mix(in oklch, var(--color-base-content) 28%, transparent);
  border-radius: 10px; padding: 9px 13px; letter-spacing: .02em; text-transform: uppercase; min-width: 96px; text-align: center;
}

/* ---- Corner radius slider ---- */
.tbp-studio .range-row  { display: flex; align-items: center; gap: 14px; }
.tbp-studio .range-wrap { flex: 1; min-width: 0; display: flex; align-items: center; min-height: 44px; }
.tbp-studio input[type="range"] {
  -webkit-appearance: none; appearance: none; width: 100%; height: 44px; background: transparent; cursor: pointer; margin: 0;
}
.tbp-studio input[type="range"]::-webkit-slider-runnable-track {
  height: 4px; border-radius: 99px;
  background: linear-gradient(90deg, var(--color-secondary) var(--fill, 40%), var(--color-base-300) var(--fill, 40%));
}
.tbp-studio input[type="range"]::-moz-range-track { height: 4px; border-radius: 99px; background: var(--color-base-300); }
.tbp-studio input[type="range"]::-moz-range-progress { height: 4px; border-radius: 99px; background: var(--color-secondary); }
.tbp-studio input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none; appearance: none; width: 22px; height: 22px; border-radius: 50%; margin-top: -9px;
  background: var(--color-base-content); border: 2px solid var(--color-accent); box-shadow: 0 2px 8px -2px oklch(0 0 0 / 0.6);
}
.tbp-studio input[type="range"]::-moz-range-thumb {
  width: 22px; height: 22px; border-radius: 50%; border: 2px solid var(--color-accent);
  background: var(--color-base-content); box-shadow: 0 2px 8px -2px oklch(0 0 0 / 0.6);
}
.tbp-studio .radius-read {
  font-family: var(--font-body); font-weight: 600; font-size: 0.92rem; color: var(--color-base-content);
  background: var(--color-base-300); border: 1px solid color-mix(in oklch, var(--color-base-content) 28%, transparent);
  border-radius: 10px; padding: 7px 0; width: 62px; text-align: center; flex: none;
}

/* ---- Phone / Tablet / Desktop segment ---- */
.tbp-studio .seg {
  display: inline-flex; background: var(--color-base-300);
  border: 1px solid color-mix(in oklch, var(--color-base-content) 28%, transparent);
  border-radius: 999px; padding: 4px; gap: 2px;
}
.tbp-studio .seg button {
  min-height: 38px; padding: 0 14px; border: none; background: transparent; border-radius: 999px;
  color: color-mix(in oklch, var(--color-base-content) 70%, transparent);
  font-family: var(--font-body); font-size: 13.5px; font-weight: 600;
  display: inline-flex; align-items: center; gap: 7px; cursor: pointer;
  transition: background .2s cubic-bezier(0.16,1,0.3,1), color .2s cubic-bezier(0.16,1,0.3,1);
}
.tbp-studio .seg button svg { width: 16px; height: 16px; stroke: currentColor; flex: none; }
.tbp-studio .seg button[aria-pressed="true"] { background: var(--color-secondary); color: var(--color-cocoa-deep); }

/* ---- Preview stage: dotted dark backdrop ---- */
.tbp-studio .preview-stage {
  display: flex; justify-content: center; background: var(--color-cocoa-deep);
  background-image: radial-gradient(color-mix(in oklch, var(--color-base-content) 18%, transparent) 1px, transparent 1px);
  background-size: 20px 20px;
  border: 1px solid color-mix(in oklch, var(--color-base-content) 28%, transparent);
  border-radius: var(--radius-box); padding: clamp(14px, 2.4vw, 30px); overflow-x: auto;
}

/* ============================================================
   OWNER THEME PREVIEW ISLAND — #device
   data-theme="menufic-public" (warm LIGHT theme); live customisation
   overrides its daisyUI vars inline (see deviceStyle). --menu-muted /
   --menu-line / --menu-font are page-scoped extras (muted text,
   hairlines, the preview-only display-font swap).
   ============================================================ */
.tbp-studio .device {
  --menu-muted: #8a7461;              /* non-derivable owner-preview extras */
  --menu-line:  #e3d6c2;
  --menu-font:  "Gambetta", Georgia, serif;
  width: 100%; max-width: 390px;
  background: var(--color-base-100); color: var(--color-base-content);
  border-radius: 26px; overflow: hidden; border: 1px solid var(--menu-line);
  box-shadow: 0 18px 50px -22px oklch(0 0 0 / 0.7);
  font-family: "General Sans", system-ui, sans-serif;
  transition: max-width .4s cubic-bezier(0.16,1,0.3,1);
}
.tbp-studio .device.tablet  { max-width: 680px; }
.tbp-studio .device.desktop { max-width: 100%; }

.tbp-studio .dv-cover { position: relative; aspect-ratio: 16/9; overflow: hidden; background: #d9c9b2; }
.tbp-studio .device.tablet .dv-cover, .tbp-studio .device.desktop .dv-cover { aspect-ratio: 21/9; }
.tbp-studio .dv-cover img { width: 100%; height: 100%; object-fit: cover; }
.tbp-studio .dv-cover::after { content: ""; position: absolute; inset: 0; background: linear-gradient(180deg, oklch(0.22 0.05 55 / 0) 30%, oklch(0.22 0.05 55 / .55)); }
.tbp-studio .dv-cover .badge {
  position: absolute; top: 12px; left: 12px; z-index: 2; background: var(--color-primary); color: oklch(1 0 0);
  font-size: 11px; font-weight: 600; letter-spacing: .02em; padding: 5px 11px; border-radius: 999px;
}
.tbp-studio .dv-head { position: absolute; left: 0; right: 0; bottom: 0; z-index: 2; padding: 16px 18px; }
.tbp-studio .dv-head h2 {
  font-family: var(--menu-font); font-weight: 600; color: oklch(1 0 0); font-size: clamp(1.5rem, 5vw, 2rem);
  line-height: 1.05; letter-spacing: -0.01em; text-shadow: 0 2px 14px oklch(0 0 0 / .4); margin: 0;
}
.tbp-studio .dv-head .loc { display: flex; align-items: center; gap: 6px; color: #f4e7d6; font-size: 12.5px; margin-top: 5px; }
.tbp-studio .dv-head .loc svg { width: 13px; height: 13px; flex: none; }

.tbp-studio .dv-body { padding: 18px; }
.tbp-studio .device.desktop .dv-body { padding: 26px clamp(26px, 4vw, 48px); max-width: 880px; margin: 0 auto; }
.tbp-studio .dv-tabs { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px; }
.tbp-studio .dv-tab {
  font-family: "General Sans", sans-serif; font-size: 13px; font-weight: 600; padding: 7px 14px; border-radius: 999px;
  border: 1px solid var(--menu-line); background: var(--color-base-200); color: var(--menu-muted);
}
.tbp-studio .dv-tab.active { background: var(--color-primary); color: oklch(1 0 0); border-color: var(--color-primary); }

.tbp-studio .dv-cat {
  font-family: var(--menu-font); font-weight: 600; color: var(--color-base-content); font-size: 1.18rem;
  letter-spacing: -0.01em; display: flex; align-items: center; gap: 12px; margin: 22px 0 12px;
}
.tbp-studio .dv-cat:first-of-type { margin-top: 0; }
.tbp-studio .dv-cat::after { content: ""; flex: 1; height: 1px; background: var(--menu-line); }

.tbp-studio .dv-item {
  display: flex; gap: 13px; align-items: flex-start; background: var(--color-base-200);
  border: 1px solid var(--menu-line); border-radius: var(--radius-box); padding: 11px; margin-bottom: 10px;
}
.tbp-studio .dv-item img { width: 62px; height: 62px; border-radius: calc(var(--radius-box) - 4px); object-fit: cover; flex: none; border: 1px solid var(--menu-line); }
.tbp-studio .dv-item .it { flex: 1; min-width: 0; }
.tbp-studio .dv-item .it-top { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; }
.tbp-studio .dv-item .it-name { font-family: var(--menu-font); font-weight: 600; font-size: 1.02rem; color: var(--color-base-content); line-height: 1.2; }
.tbp-studio .dv-item .it-price { font-family: "General Sans", sans-serif; font-weight: 600; font-size: 0.96rem; color: var(--color-primary); flex: none; font-variant-numeric: tabular-nums; }
.tbp-studio .dv-item .it-desc { font-family: "General Sans", sans-serif; font-size: 12.5px; color: var(--menu-muted); margin-top: 4px; line-height: 1.45; }
.tbp-studio .dv-item .it-tag {
  display: inline-block; margin-top: 7px; font-size: 10.5px; font-weight: 600; color: var(--color-primary);
  background: color-mix(in srgb, var(--color-primary) 12%, transparent); padding: 3px 9px; border-radius: 999px;
}
.tbp-studio .device.desktop .dv-items { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
.tbp-studio .device.desktop .dv-item  { margin-bottom: 0; }

.tbp-studio .dv-foot { font-family: "General Sans", sans-serif; text-align: center; font-size: 11.5px; color: var(--menu-muted); padding: 18px; border-top: 1px solid var(--menu-line); }
.tbp-studio .dv-foot b { color: var(--color-base-content); }
`;

interface Preset {
  id: string;
  name: string;
  bg: string;
  surface: string;
  primary: string;
  text: string;
  muted: string;
  line: string;
  font: string;
  radius: number;
}

/* Preset definitions — verbatim from theme.html (~lines 905–914). The hex
   values are USER-facing owner theme choices (arbitrary picked colours),
   not Menufic design-system tokens. */
const PRESETS: Preset[] = [
  { id: 'bistro', name: 'Classic Bistro', bg: '#f6efe2', surface: '#fffdf8', primary: '#c45a36', text: '#3a2a1d', muted: '#8a7461', line: '#e3d6c2', font: '"Gambetta",Georgia,serif', radius: 14 },
  { id: 'minimal', name: 'Modern Minimal', bg: '#ffffff', surface: '#fafafa', primary: '#141414', text: '#161616', muted: '#8a8a8a', line: '#e6e6e6', font: '"General Sans",sans-serif', radius: 4 },
  { id: 'rustic', name: 'Rustic Cafe', bg: '#efe3d2', surface: '#fbf4e8', primary: '#8a5a2b', text: '#3d2c1a', muted: '#917a5e', line: '#e0d2ba', font: '"Sentient",Georgia,serif', radius: 10 },
  { id: 'dark', name: 'Dark Elegant', bg: '#16140f', surface: '#221d16', primary: '#d4af5a', text: '#f2ead8', muted: '#b0a48a', line: '#3a3225', font: '"Gambetta",Georgia,serif', radius: 6 },
  { id: 'tropical', name: 'Tropical', bg: '#effaf8', surface: '#ffffff', primary: '#0f9d8f', text: '#123b39', muted: '#5e8f8a', line: '#cfeae6', font: '"General Sans",sans-serif', radius: 16 },
  { id: 'nordic', name: 'Nordic Clean', bg: '#eef1f3', surface: '#ffffff', primary: '#52616e', text: '#2b3640', muted: '#7e8a93', line: '#dde3e7', font: '"General Sans",sans-serif', radius: 8 },
  { id: 'vineyard', name: 'Vineyard', bg: '#f3eaf0', surface: '#ffffff', primary: '#6d2748', text: '#2e1a26', muted: '#8d6c7d', line: '#e6d6e0', font: '"Sentient",Georgia,serif', radius: 12 },
  { id: 'street', name: 'Street Food', bg: '#fff6e6', surface: '#ffffff', primary: '#e8442a', text: '#2a1c12', muted: '#9a8064', line: '#f1e2c8', font: '"Clash Display",sans-serif', radius: 16 },
];

const SWATCH_COLORS = ['#c45a36', '#8a5a2b', '#6d2748', '#0f9d8f', '#52616e', '#e8442a', '#d4af5a', '#141414'];

const FONT_OPTIONS = [
  { value: '"Gambetta",Georgia,serif', label: 'Gambetta · warm serif' },
  { value: '"Sentient",Georgia,serif', label: 'Sentient · editorial serif' },
  { value: '"General Sans",sans-serif', label: 'General Sans · clean sans' },
  { value: '"Clash Display",sans-serif', label: 'Clash Display · bold display' },
];

type Size = 'phone' | 'tablet' | 'desktop';

export default function ThemeBuilderPreview() {
  // `current` = the active preset (used by Reset). Individual controls override
  // primary/radius/font without changing which preset is "current".
  const [current, setCurrent] = useState<Preset>(PRESETS[0]);
  // Preset-derived base surfaces (only preset select / reset changes these).
  const [base, setBase] = useState({
    bg: PRESETS[0].bg,
    surface: PRESETS[0].surface,
    text: PRESETS[0].text,
    muted: PRESETS[0].muted,
    line: PRESETS[0].line,
  });
  const [primary, setPrimary] = useState(PRESETS[0].primary);
  const [radiusPx, setRadiusPx] = useState(PRESETS[0].radius);
  const [font, setFont] = useState(PRESETS[0].font);
  const [size, setSize] = useState<Size>('phone');
  const [saved, setSaved] = useState(false);

  // applyTheme(p): set every preset-derived value at once (matches source).
  function applyTheme(p: Preset) {
    setCurrent(p);
    setBase({ bg: p.bg, surface: p.surface, text: p.text, muted: p.muted, line: p.line });
    setPrimary(p.primary);
    setRadiusPx(p.radius);
    setFont(p.font);
  }

  // Inline daisyUI-var overrides written onto #device (the §7.6 contract).
  const deviceStyle = {
    '--color-base-100': base.bg,
    '--color-base-200': base.surface,
    '--color-base-content': base.text,
    '--menu-muted': base.muted,
    '--menu-line': base.line,
    '--color-primary': primary,
    '--radius-box': `${radiusPx}px`,
    '--radius-field': `${radiusPx}px`,
    '--menu-font': font,
  } as CSSProperties;

  const fillStyle = { '--fill': `${(radiusPx / 16) * 100}%` } as CSSProperties;
  const primaryLc = primary.toLowerCase();

  function onSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 1400);
  }

  const deviceClass = `device${size === 'tablet' ? ' tablet' : size === 'desktop' ? ' desktop' : ''}`;

  return (
    <>
      <style href="menufic-theme-builder-preview" precedence="high">{css}</style>
      <div className="tbp-studio">

        {/* ======= LEFT: CONTROLS PANEL (dark app chrome) ======= */}
        <section
          className="bg-base-200 rounded-[var(--radius-box)] border border-base-content/[.28] p-[clamp(18px,2vw,24px)] flex flex-col gap-[26px] min-w-0 max-[960px]:order-1"
          aria-label="Theme controls"
        >
          {/* Presets */}
          <div className="flex flex-col gap-[13px] min-w-0">
            <span className="flex items-center justify-between gap-[10px] text-[0.86rem] font-semibold text-base-content" id="tbp-preset-lbl">
              Preset theme
              <span className="text-[0.78rem] font-medium text-base-content/70">8 styles</span>
            </span>
            <div className="preset-grid" role="group" aria-labelledby="tbp-preset-lbl">
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className="preset"
                  aria-pressed={current.id === p.id}
                  aria-label={`${p.name} preset theme`}
                  onClick={() => applyTheme(p)}
                >
                  <span className="check" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  </span>
                  <span className="mini" style={{ background: p.bg, color: p.text }}>
                    <span className="bar" style={{ background: p.primary }} />
                    <span className="ln" />
                    <span className="ln short" />
                  </span>
                  <span className="pname" style={{ fontFamily: p.font }}>{p.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Font picker */}
          <div className="flex flex-col gap-[13px] min-w-0">
            <label className="text-[0.86rem] font-semibold text-base-content" htmlFor="tbp-fontSelect">Menu font</label>
            <select
              id="tbp-fontSelect"
              className="select w-full"
              aria-describedby="tbp-fontSample"
              value={font}
              onChange={(e) => setFont(e.target.value)}
            >
              {FONT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value} style={{ fontFamily: o.value }}>{o.label}</option>
              ))}
            </select>
            <p className="min-h-[1.3em] text-[0.82rem] text-base-content/70" id="tbp-fontSample">Headings &amp; dish names use this font.</p>
          </div>

          {/* Primary colour */}
          <div className="flex flex-col gap-[13px] min-w-0">
            <span className="text-[0.86rem] font-semibold text-base-content" id="tbp-color-lbl">Primary colour</span>
            <div className="swatches" role="group" aria-labelledby="tbp-color-lbl">
              {SWATCH_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className="swatch"
                  style={{ background: c }}
                  aria-pressed={c.toLowerCase() === primaryLc}
                  aria-label={`Use colour ${c.toUpperCase()}`}
                  onClick={() => setPrimary(c)}
                />
              ))}
            </div>
            <div className="color-row">
              <span className="color-input-wrap">
                <input
                  type="color"
                  id="tbp-colorPicker"
                  value={primary}
                  aria-label="Pick a custom primary colour"
                  onChange={(e) => setPrimary(e.target.value)}
                />
              </span>
              <output className="hex-read" htmlFor="tbp-colorPicker">{primary.toUpperCase()}</output>
            </div>
          </div>

          {/* Corner radius */}
          <div className="flex flex-col gap-[13px] min-w-0">
            <label className="text-[0.86rem] font-semibold text-base-content" htmlFor="tbp-radius">Corner radius</label>
            <div className="range-row">
              <span className="range-wrap">
                <input
                  type="range"
                  id="tbp-radius"
                  min={0}
                  max={16}
                  step={1}
                  value={radiusPx}
                  aria-describedby="tbp-radiusRead"
                  style={fillStyle}
                  onChange={(e) => setRadiusPx(parseInt(e.target.value, 10))}
                />
              </span>
              <output className="radius-read" htmlFor="tbp-radius">{radiusPx}px</output>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 border-t border-base-content/[.28] pt-[22px]">
            <button className="btn btn-primary flex-1 min-w-[140px] max-[600px]:flex-[1_1_100%]" type="button" disabled={saved} onClick={onSave}>
              <svg className="size-[18px] flex-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
              {saved ? ' Saved' : 'Save theme'}
            </button>
            <button className="btn btn-ghost flex-1 min-w-[140px] max-[600px]:flex-[1_1_100%]" type="button" onClick={() => applyTheme(current)}>
              <svg className="size-[18px] flex-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /></svg>
              Reset to preset
            </button>
          </div>
        </section>

        {/* ======= RIGHT: PREVIEW PANEL (owner warm light theme) ======= */}
        <section className="flex flex-col gap-4 min-w-0 max-[960px]:order-2" aria-label="Live menu preview">
          {/* Preview bar: size toggle + live link */}
          <div className="flex flex-wrap items-center justify-between gap-[14px] rounded-[18px] border border-base-content/[.28] bg-base-200 px-3 py-2.5">
            <div className="seg" role="group" aria-label="Preview size">
              <button type="button" aria-pressed={size === 'phone'} onClick={() => setSize('phone')}>
                <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="7" y="2" width="10" height="20" rx="2" /><path d="M11 18h2" /></svg>
                Phone
              </button>
              <button type="button" aria-pressed={size === 'tablet'} onClick={() => setSize('tablet')}>
                <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M11 18h2" /></svg>
                Tablet
              </button>
              <button type="button" aria-pressed={size === 'desktop'} onClick={() => setSize('desktop')}>
                <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="13" rx="2" /><path d="M8 21h8M12 17v4" /></svg>
                Desktop
              </button>
            </div>
            <a href="/public" className="inline-flex min-h-[40px] items-center gap-2 rounded-full px-3 text-[14px] font-semibold text-secondary transition-colors hover:bg-secondary/[.12]">
              View live menu
              <svg className="size-4 flex-none stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></svg>
            </a>
          </div>

          <p className="flex items-start gap-2 text-[12.5px] leading-[1.4] text-base-content/70">
            <svg className="mt-[2px] size-[15px] flex-none text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
            This is your customers' menu. Its warm, light look is set by your theme here, not by the Menufic studio chrome around it.
          </p>

          {/* Dotted stage — preview device lives here */}
          <div className="preview-stage">
            <article
              className={deviceClass}
              data-theme="menufic-public"
              style={deviceStyle}
              aria-label="Public menu preview for Saffron and Smoke"
            >
              <div className="dv-cover">
                <span className="badge">Open · 5–11pm</span>
                <img src="/img/photo-1432139555190-58524dae6a55.jpg" alt="Charred short rib glistening under warm light at Saffron and Smoke" loading="lazy" />
                <div className="dv-head">
                  <h2>Saffron &amp; Smoke</h2>
                  <p className="loc">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                    Modern grill · Downtown
                  </p>
                </div>
              </div>

              <div className="dv-body">
                <nav className="dv-tabs" aria-label="Menu categories">
                  <span className="dv-tab active">Small Plates</span>
                  <span className="dv-tab">From the Grill</span>
                  <span className="dv-tab">To Share</span>
                </nav>

                <h3 className="dv-cat">Small Plates</h3>
                <div className="dv-items">
                  <div className="dv-item">
                    <img src="/img/photo-1484723091739-30a097e8f929.jpg" alt="Chargrilled tiger prawns with chilli butter" loading="lazy" />
                    <div className="it">
                      <div className="it-top">
                        <span className="it-name">Chilli Tiger Prawns</span>
                        <span className="it-price">£12</span>
                      </div>
                      <p className="it-desc">Chargrilled, smoked chilli butter, charred lime.</p>
                      <span className="it-tag">Chef's pick</span>
                    </div>
                  </div>
                  <div className="dv-item">
                    <img src="/img/photo-1455619452474-d2be8b1e70cd.jpg" alt="Roasted heirloom tomato soup with herb oil" loading="lazy" />
                    <div className="it">
                      <div className="it-top">
                        <span className="it-name">Smoked Tomato Soup</span>
                        <span className="it-price">£8</span>
                      </div>
                      <p className="it-desc">Slow-roasted heirloom tomatoes, basil oil, sourdough.</p>
                    </div>
                  </div>
                </div>

                <h3 className="dv-cat">From the Grill</h3>
                <div className="dv-items">
                  <div className="dv-item">
                    <img src="/img/photo-1432139555190-58524dae6a55.jpg" alt="Charred short rib with bone marrow gravy" loading="lazy" />
                    <div className="it">
                      <div className="it-top">
                        <span className="it-name">Charred Short Rib</span>
                        <span className="it-price">£26</span>
                      </div>
                      <p className="it-desc">36-hour braise, bone-marrow gravy, burnt onion.</p>
                      <span className="it-tag">Popular</span>
                    </div>
                  </div>
                  <div className="dv-item">
                    <img src="/img/photo-1424847651672-bf20a4b0982b.jpg" alt="A loaded sharing board of grilled meats and flatbread" loading="lazy" />
                    <div className="it">
                      <div className="it-top">
                        <span className="it-name">Smoke House Board</span>
                        <span className="it-price">£32</span>
                      </div>
                      <p className="it-desc">Mixed grill to share, flatbread, three house dips.</p>
                    </div>
                  </div>
                </div>
              </div>

              <p className="dv-foot"><b>Saffron &amp; Smoke</b> · Powered by Menufic</p>
            </article>
          </div>
        </section>
      </div>
    </>
  );
}

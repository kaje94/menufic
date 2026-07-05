import { useEffect, useRef, useState } from 'react';

/* ============================================================
   LANDING ISLAND: HowItWorks — scroll-scrubbed 3-step assembly
   ------------------------------------------------------------
   Ported from design/landing/index.html:
     - bespoke CSS  (lines ~275–434 the `.how*` mechanism, plus the
       shared `.menu-ui`/`.mrow` live-menu rows used by the BUILD
       state — source lines ~58–75, and the reduced-motion off-switch
       ~558–560)
     - markup       (lines ~698–826: the `<section id="how">`)
     - scroll-scrub JS (lines ~1359–1480) → React hooks below.

   The plan's island list (§8) omitted this landing-specific island;
   it carries bespoke CSS + a signature scroll mechanism with no home
   elsewhere, so it becomes a co-located client island (Task 12).

   TOKENIZATION (island HARD RULE): colours read theme tokens via the
   alias block on `.hiw`. Remaining oklch literals are tonal panel
   backgrounds / gradients / green live-pill accents with no daisyUI
   token — kept as documented carve-outs exactly as the source.

   REDUCED MOTION: the phone locks to the published (SHARE) state and
   every step shows at full opacity — a valid static state, never blank.
   ============================================================ */

const css = `
.hiw{
  /* derivable aliases → theme tokens */
  --bg: var(--color-base-100);
  --surface: var(--color-base-200);
  --surface-2: var(--color-base-300);
  --saffron: var(--color-secondary);
  --tomato: var(--color-primary);
  --cream: var(--color-base-content);
  --cream-soft: var(--color-info);
  /* non-derivable hairlines (no daisyUI token exists) */
  --line: oklch(0.42 0.03 48 / 0.5);
  --line-soft: oklch(0.42 0.03 58 / 0.28);
  --ease: cubic-bezier(0.16,1,0.3,1);
  /* tonal section wash — no single token maps the mid stop */
  background:linear-gradient(180deg,var(--bg),oklch(0.205 0.03 56),var(--bg));
}
.hiw .how-grid{display:grid;grid-template-columns:0.92fr 1.08fr;gap:64px;align-items:start}

/* sticky phone column */
.hiw .how-sticky{position:sticky;top:0;height:100svh;display:flex;align-items:center;justify-content:center;min-width:0}
.hiw .how-phone{
  position:relative;width:min(310px,80%);
  border-radius:40px;background:oklch(0.22 0.02 60);
  border:1px solid oklch(0.5 0.03 70 / 0.4);padding:10px;
  box-shadow:0 40px 80px -34px oklch(0 0 0 /0.85);
  will-change:transform;
}
.hiw .how-phone .phone-screen{border-radius:30px;overflow:hidden;position:relative;aspect-ratio:9/17}

/* Phone state transitions */
.hiw .how-states{position:relative;height:100%;width:100%}
.hiw .how-state{
  position:absolute;inset:0;
  opacity:0;transform:translateY(16px) scale(.985);filter:blur(3px);
  transition:opacity .5s var(--ease),transform .65s var(--ease),filter .5s var(--ease);
  pointer-events:none;
  display:flex;flex-direction:column;
}
.hiw .how-state.active{opacity:1;transform:none;filter:none;pointer-events:auto}
@media (prefers-reduced-motion:reduce){
  .hiw .how-state{transition:opacity .2s linear;transform:none;filter:none}
}

/* shared live-menu component (BUILD state rows) */
.hiw .menu-ui{display:flex;flex-direction:column;height:100%;background:var(--bg)}
.hiw .menu-cover{position:relative;height:128px;flex:none;background-size:cover;background-position:center}
.hiw .menu-cover::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,oklch(0 0 0 /0.1),oklch(0.185 0.028 55 /0.9))}
.hiw .menu-head{position:absolute;z-index:2;left:14px;right:14px;bottom:10px}
.hiw .menu-head .badge{display:inline-block;font-size:9px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:var(--bg);background:var(--accent,var(--saffron));border-radius:999px;padding:3px 9px;margin-bottom:7px}
.hiw .menu-head h4{font-family:var(--font-display);font-weight:700;font-size:21px;letter-spacing:-0.02em;color:var(--cream);line-height:1}
.hiw .menu-head .loc{font-size:11px;color:var(--cream-soft);margin-top:4px;display:flex;align-items:center;gap:5px}
.hiw .menu-tabs{display:flex;gap:7px;padding:11px 14px 4px;flex:none;overflow:hidden}
.hiw .menu-tabs .mt{font-size:11px;font-weight:600;color:var(--cream-soft);padding:5px 11px;border-radius:999px;background:transparent;white-space:nowrap}
.hiw .menu-tabs .mt.act{color:var(--bg);background:var(--accent,var(--saffron))}
.hiw .menu-list{flex:1 1 auto;padding:4px 14px 16px;display:flex;flex-direction:column;gap:9px;min-height:0;overflow:hidden}
.hiw .mrow{display:flex;gap:11px;align-items:center;padding:7px;border-radius:calc(var(--accent-r,14px));background:var(--surface);border:1px solid var(--line-soft)}
.hiw .mrow img{width:46px;height:46px;border-radius:calc(var(--accent-r,10px) - 3px);object-fit:cover;flex:none}
.hiw .mrow .mmeta{flex:1;min-width:0}
.hiw .mrow .mname{font-size:12.5px;font-weight:600;color:var(--cream);line-height:1.15;display:flex;align-items:center;gap:6px;flex-wrap:wrap}
.hiw .mrow .mtag{font-size:8px;font-weight:700;letter-spacing:.03em;text-transform:uppercase;color:var(--accent,var(--saffron));border:1px solid var(--accent,var(--saffron));border-radius:5px;padding:1px 5px}
.hiw .mrow .mdesc{font-size:10px;color:var(--cream-soft);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.hiw .mrow .mprice{font-family:var(--font-display);font-weight:600;font-size:14px;color:var(--cream);flex:none}

/* Create state */
.hiw .s-create{background:var(--bg);padding:0}
.hiw .builder-top{flex:none;padding:38px 16px 12px;text-align:center;border-bottom:1px solid var(--line-soft)}
.hiw .builder-top .ico{width:54px;height:54px;border-radius:16px;margin:0 auto 12px;background:oklch(0.30 0.04 60);display:flex;align-items:center;justify-content:center;color:var(--saffron);border:1px dashed var(--line)}
.hiw .builder-top h5{font-family:var(--font-display);font-size:17px;color:var(--cream);font-weight:700}
.hiw .builder-top p{font-size:11px;color:var(--cream-soft);margin-top:5px}
.hiw .builder-form{flex:1 1 auto;padding:16px;display:flex;flex-direction:column;gap:11px;min-height:0}
.hiw .fld label{font-size:10px;color:var(--cream-soft);font-weight:500;display:block;margin-bottom:5px}
.hiw .fld .inp{background:var(--surface);border:1px solid var(--line);border-radius:11px;padding:10px 12px;font-size:12px;color:var(--cream)}
.hiw .fld .inp.filled{color:var(--cream);border-color:var(--saffron)}
.hiw .fld .inp.ghost{color:var(--cream-soft);opacity:.6}
.hiw .fld .slugline{font-size:10px;color:var(--cream-soft);margin-top:5px}
.hiw .fld .slugline b{color:var(--saffron);font-weight:600}
.hiw .builder-cta{
  margin-top:auto;border-radius:11px;text-align:center;padding:11px;
  font-size:12.5px;font-weight:600;color:var(--cream);
  transition:background .45s var(--ease),box-shadow .45s var(--ease);
}
.hiw .builder-cta.dim{background:var(--surface-2);color:var(--cream-soft)}
.hiw .builder-cta.lit{background:var(--tomato);box-shadow:0 8px 24px -8px oklch(0.56 0.19 32 /0.55)}

/* Share state */
.hiw .s-share{background:linear-gradient(180deg,oklch(0.245 0.034 58),var(--bg));align-items:center;justify-content:center;text-align:center;padding:24px 20px;flex:1 1 auto;position:relative;overflow:hidden}
.hiw .s-share .live-pill{display:inline-flex;align-items:center;gap:7px;font-size:11px;font-weight:600;color:oklch(0.78 0.16 145);background:oklch(0.7 0.16 145 /0.12);border:1px solid oklch(0.7 0.16 145 /0.35);border-radius:999px;padding:5px 12px;margin-bottom:18px}
.hiw .s-share .live-pill .pulse{width:8px;height:8px;border-radius:50%;background:oklch(0.7 0.16 145)}
.hiw .s-share h5{font-family:var(--font-display);font-size:19px;color:var(--cream);font-weight:700;line-height:1.05}
.hiw .s-share p{font-size:11.5px;color:var(--cream-soft);margin-top:7px;line-height:1.4}
.hiw .s-share .qrbox{
  background:oklch(1 0 0);border-radius:18px;padding:14px;margin:20px auto 14px;line-height:0;
  box-shadow:0 20px 40px -20px oklch(0 0 0 /0.7);
  will-change:clip-path,opacity;
}
.hiw .s-share .qrbox img{width:150px;height:150px}
.hiw .s-share .url{font-size:11px;color:var(--saffron);font-weight:600;word-break:break-all}

/* Publish sweep — animated by JS */
.hiw .how-sweep{
  position:absolute;inset:0;z-index:6;pointer-events:none;
  background:linear-gradient(180deg,oklch(0.96 0.015 78 /0.22) 0%,oklch(0.785 0.14 68 /0.08) 50%,transparent 100%);
  transform:translateY(-105%);
  will-change:transform,opacity;
}

/* Add-dish pulsing */
@keyframes hiw-dish-pulse{0%,100%{opacity:0.55}50%{opacity:0.82}}
.hiw .mrow.asm-add{animation:hiw-dish-pulse 2.2s ease-in-out infinite}
@media(prefers-reduced-motion:reduce){.hiw .mrow.asm-add{animation:none;opacity:0.65}}

/* Live pill pulse */
@keyframes hiw-live-pulse{
  0%,100%{box-shadow:0 0 0 0 oklch(0.7 0.16 145 /0.5)}
  55%{box-shadow:0 0 0 5px oklch(0.7 0.16 145 /0)}
}
.hiw .s-share .live-pill .pulse{animation:hiw-live-pulse 2s ease-out infinite}
@media(prefers-reduced-motion:reduce){.hiw .s-share .live-pill .pulse{animation:none}}

/* Step column + progress rail */
.hiw .how-steps-wrap{display:flex;gap:20px;min-width:0;align-items:stretch}
.hiw .how-rail{
  flex:none;width:2px;position:relative;
  background:var(--line-soft);border-radius:2px;
  margin-top:60px;margin-bottom:32px;
}
.hiw .how-rail-fill{
  position:absolute;top:0;left:0;right:0;height:100%;
  background:linear-gradient(180deg,var(--saffron),oklch(0.785 0.14 68 /0.6));
  border-radius:2px;will-change:transform;
  transform:scaleY(0);transform-origin:top center;
}
.hiw .how-rail-node{
  position:absolute;left:50%;transform:translate(-50%,-50%);
  width:8px;height:8px;border-radius:50%;
  background:oklch(0.30 0.03 55);border:2px solid var(--line-soft);
  transition:background .4s var(--ease),border-color .4s var(--ease),box-shadow .4s var(--ease);
}
.hiw .how-rail-node.lit{background:var(--saffron);border-color:var(--saffron);box-shadow:0 0 10px 2px oklch(0.785 0.14 68 /0.45)}
.hiw .how-rail-node[data-node="0"]{top:0}
.hiw .how-rail-node[data-node="1"]{top:33.33%}
.hiw .how-rail-node[data-node="2"]{top:66.66%}

.hiw .how-steps{display:flex;flex-direction:column;flex:1;min-width:0}
.hiw .step{min-height:78vh;display:flex;flex-direction:column;justify-content:center;padding:32px 0}
.hiw .step:first-child{padding-top:8px}
.hiw .step .num{
  font-family:var(--font-display);font-size:15px;font-weight:600;color:var(--saffron);
  display:inline-flex;align-items:center;gap:12px;margin-bottom:18px;
}
.hiw .step .num::before{content:"";width:34px;height:1px;background:var(--saffron);opacity:.6}
.hiw .step h3{font-size:clamp(1.7rem,3.6vw,2.7rem);color:var(--cream)}
.hiw .step p{margin-top:18px;font-size:clamp(1.02rem,1.5vw,1.15rem);color:var(--cream-soft);max-width:46ch;line-height:1.6}
.hiw .step .mini{display:none}

/* Desktop: active step bright, inactive recede */
@media (min-width:901px){
  .js .hiw .how-steps .step{opacity:.32;transform:translateX(-10px);transition:opacity .55s var(--ease),transform .55s var(--ease)}
  .js .hiw .how-steps .step.is-active{opacity:1;transform:none}
  .js .hiw .how-steps .step .num::before{transform-origin:left center;transition:transform .55s var(--ease),opacity .55s var(--ease)}
  .js .hiw .how-steps .step:not(.is-active) .num::before{transform:scaleX(0.53);opacity:.28}
  .js .hiw .how-steps .step.is-active .num::before{transform:scaleX(1.41);opacity:.9}
}

/* Mobile: phone sticky, steps scroll beneath */
@media (max-width:900px){
  .hiw .how-grid{grid-template-columns:1fr;gap:0}
  .hiw .how-sticky{
    height:auto;top:68px;z-index:10;padding:14px 0 28px;
    background:linear-gradient(180deg,var(--surface) 90%,oklch(0.235 0.034 46 /0));
    border-bottom:1px solid var(--line-soft);
  }
  .hiw .how-phone{width:auto;padding:8px;border-radius:34px}
  .hiw .how-phone .phone-screen{height:min(56svh,540px);width:auto;max-width:84vw;aspect-ratio:var(--mock-ar,9/19.5);border-radius:28px}
  .hiw .how-rail{display:none}
  .hiw .step{min-height:58vh;padding:26px 0 22px;border-bottom:1px solid var(--line-soft)}
  .hiw .step:first-child{padding-top:30px}
  .hiw .step:last-child{border-bottom:none}
  .hiw .step .mini{display:none}
  .hiw .step h3{font-size:clamp(1.55rem,6.4vw,2rem)}
  .hiw .step p{font-size:clamp(0.98rem,3.7vw,1.08rem);max-width:38ch}
  .js .hiw .how-steps .step{opacity:.62;transition:opacity .45s var(--ease)}
  .js .hiw .how-steps .step.is-active{opacity:1}
}

/* reduced-motion off-switch for the steps */
@media (prefers-reduced-motion:reduce){
  .js .hiw .step{opacity:1 !important;transform:none !important}
}

/* Self-managed reveal (React-owned, so PageMotion's global .reveal observer
   never fights the island — mirrors how VideoHero owns its own entrance). */
.js .hiw .hiw-reveal{opacity:0;transform:translateY(30px)}
.js .hiw .hiw-reveal.in{opacity:1;transform:none;transition:opacity 700ms var(--ease),transform 700ms var(--ease)}
@media (prefers-reduced-motion:reduce){
  .js .hiw .hiw-reveal{opacity:1 !important;transform:none !important}
}
`;

export default function HowItWorks() {
  const rootRef = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  // Entrance fade fires on hydration (client:visible ⇒ we're in view).
  useEffect(() => setShown(true), []);

  useEffect(() => {
    const how = rootRef.current;
    if (!how) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Match the mockup's aspect ratio to the viewer's own device (mobile only).
    function setMockAR() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (!w || !h || !how) return;
      const ar = Math.max(0.42, Math.min(0.56, w / h)); // clamp to portrait-phone-like
      how.style.setProperty('--mock-ar', ar.toFixed(4));
    }
    setMockAR();
    window.addEventListener('resize', setMockAR, { passive: true });
    window.addEventListener('orientationchange', setMockAR);

    const hwStates = Array.from(how.querySelectorAll<HTMLElement>('.how-state'));
    const hwSteps = Array.from(how.querySelectorAll<HTMLElement>('.step[data-step]'));
    const flds = Array.from(how.querySelectorAll<HTMLElement>('.fld.asm-field'));
    const cta = how.querySelector<HTMLElement>('[data-cta]');
    const dishes = Array.from(how.querySelectorAll<HTMLElement>('.mrow.asm-dish'));
    const addRow = how.querySelector<HTMLElement>('.mrow.asm-add');
    const qrBox = how.querySelector<HTMLElement>('[data-qr]');
    const railFill = how.querySelector<HTMLElement>('[data-rail-fill]');
    const railNodes = Array.from(how.querySelectorAll<HTMLElement>('.how-rail-node'));
    const sweep = how.querySelector<HTMLElement>('.how-sweep');

    // Reduced motion: phone locked to published state, all steps visible.
    if (reduce) {
      hwStates.forEach((s) => s.classList.toggle('active', Number(s.dataset.state) === 2));
      hwSteps.forEach((s) => s.classList.add('is-active'));
      if (qrBox) {
        qrBox.style.clipPath = 'none';
        qrBox.style.opacity = '1';
      }
      return () => {
        window.removeEventListener('resize', setMockAR);
        window.removeEventListener('orientationchange', setMockAR);
      };
    }

    let raf: number | null = null;
    let lastP = -1;
    const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
    const rng = (p: number, s: number, e: number) => clamp01((p - s) / (e - s));

    function applyProgress(p: number) {
      if (Math.abs(p - lastP) < 0.0004) return;
      lastP = p;

      const phase = p < 0.33 ? 0 : p < 0.66 ? 1 : 2;

      hwStates.forEach((s) => s.classList.toggle('active', Number(s.dataset.state) === phase));
      hwSteps.forEach((s) => s.classList.toggle('is-active', Number(s.dataset.step) === phase));

      if (railFill) railFill.style.transform = `scaleY(${p.toFixed(4)})`;
      railNodes.forEach((n, i) => n.classList.toggle('lit', p >= i / 3));

      // CREATE (p 0 → 0.33): form fields rise in sequentially.
      const fieldStarts = [-0.09, 0.09, 0.18];
      flds.forEach((f, i) => {
        const frac = rng(p, fieldStarts[i], fieldStarts[i] + 0.09);
        f.style.opacity = String(frac);
        f.style.transform = frac < 0.999 ? `translateY(${(10 * (1 - frac)).toFixed(2)}px)` : '';
      });
      if (cta) {
        const ctaFrac = rng(p, 0.26, 0.33);
        if (ctaFrac > 0.5) {
          cta.classList.add('lit');
          cta.classList.remove('dim');
        } else {
          cta.classList.remove('lit');
          cta.classList.add('dim');
        }
        cta.style.opacity = (0.3 + ctaFrac * 0.7).toFixed(3);
      }

      // BUILD (p 0.33 → 0.66): dishes drop in staggered.
      dishes.forEach((r, i) => {
        const s = 0.33 + i * 0.1;
        const e = s + 0.09;
        const frac = rng(p, s, e);
        r.style.opacity = frac.toFixed(4);
        r.style.transform =
          frac < 0.999
            ? `translateY(${(18 * (1 - frac)).toFixed(2)}px) scale(${(0.96 + 0.04 * frac).toFixed(4)})`
            : '';
      });
      if (addRow) addRow.style.opacity = phase === 1 ? '0.65' : '0.7';

      // SHARE (p 0.66 → 1.0): sweep then QR circle-reveal.
      const sp = rng(p, 0.66, 1.0);
      if (sweep) {
        const sweepY = rng(sp, 0, 0.5) * 110; // % travel
        const sweepOp = sp < 0.05 ? sp * 20 : clamp01(1 - (sp - 0.05) / 0.35);
        sweep.style.transform = `translateY(${sweepY.toFixed(2)}%)`;
        sweep.style.opacity = (sweepOp * 0.9).toFixed(3);
      }
      if (qrBox) {
        const qrFrac = rng(sp, 0.35, 1.0);
        const radius = Math.round(qrFrac * 75); // 0→75% radius — fills the box
        qrBox.style.clipPath = `circle(${radius}% at 50% 50%)`;
        qrBox.style.opacity = (qrFrac * 0.15 + 0.85).toFixed(3);
      }
    }

    function tick() {
      raf = null;
      if (!how) return;
      const rect = how.getBoundingClientRect();
      const range = how.offsetHeight - window.innerHeight;
      if (range <= 0) {
        applyProgress(0.01);
        return;
      }
      applyProgress(clamp01(-rect.top / range));
    }

    function onScroll() {
      if (!raf) raf = requestAnimationFrame(tick);
    }
    window.addEventListener('scroll', onScroll, { passive: true });

    // Synchronous init — avoids one-frame flash.
    const r0 = how.getBoundingClientRect();
    const rng0 = how.offsetHeight - window.innerHeight;
    applyProgress(rng0 > 0 ? clamp01(-r0.top / rng0) : 0);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', setMockAR);
      window.removeEventListener('orientationchange', setMockAR);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      ref={rootRef}
      id="how"
      className="hiw relative py-[clamp(72px,10vw,128px)]"
      aria-labelledby="how-h"
    >
      <style href="menufic-how-it-works" precedence="high">{css}</style>
      <div className="mx-auto w-full max-w-[1200px] px-6">
        <div className={`hiw-reveal mb-12 max-w-[680px]${shown ? ' in' : ''}`}>
          <h2
            id="how-h"
            className="text-[clamp(2rem,4.6vw,3.4rem)] font-bold tracking-[-0.03em] text-base-content"
          >
            From your dishes to a shareable menu in three steps.
          </h2>
          <p className="mt-[18px] max-w-[66ch] text-[clamp(1.05rem,1.6vw,1.2rem)] leading-[1.55] text-info text-pretty">
            You won't sit through setup calls or learn design tools. Create your restaurant, add your
            dishes, and share the link or QR code, and that's the whole thing.
          </p>
        </div>

        <div className="how-grid">
          {/* sticky phone — decorative demo, assembles in sync with scroll */}
          <div className="how-sticky">
            <div className="how-phone" aria-hidden="true">
              <div className="phone-screen">
                <div className="how-states">

                  {/* STATE 1: CREATE — form fields assemble on scroll */}
                  <div className="how-state active s-create" data-state="0">
                    <div className="builder-top">
                      <div className="ico">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
                      </div>
                      <h5>New restaurant</h5>
                      <p>Tell us the basics. It takes a minute.</p>
                    </div>
                    <div className="builder-form">
                      <div className="fld asm-field" data-asm="0">
                        <label>Restaurant name</label>
                        <div className="inp filled">Bella Trattoria</div>
                      </div>
                      <div className="fld asm-field" data-asm="1">
                        <label>Your menu address</label>
                        <div className="inp">bella-trattoria</div>
                        <div className="slugline">Live at <b>menufic.com/r/bella-trattoria</b></div>
                      </div>
                      <div className="fld asm-field" data-asm="2">
                        <label>Cuisine</label>
                        <div className="inp ghost">Italian · Trattoria</div>
                      </div>
                      <div className="builder-cta dim" data-cta>Create restaurant</div>
                    </div>
                  </div>

                  {/* STATE 2: BUILD — dish rows drop in one by one */}
                  <div className="how-state s-build" data-state="1">
                    <div className="menu-ui" style={{ '--accent': 'var(--tomato)', '--accent-r': '16px', height: '100%' } as React.CSSProperties}>
                      <div className="menu-cover" style={{ backgroundImage: "url('/img/photo-1424847651672-bf20a4b0982b.jpg')" }}>
                        <div className="menu-head">
                          <span className="badge">Editing menu</span>
                          <h4>Bella Trattoria</h4>
                          <span className="loc">🍝 Adding your dishes…</span>
                        </div>
                      </div>
                      <div className="menu-tabs">
                        <span className="mt act">Pasta</span><span className="mt">Pizza</span><span className="mt">+ Add</span>
                      </div>
                      <div className="menu-list">
                        <div className="mrow asm-dish" data-dish="0">
                          <img src="/img/photo-1565299624946-b28f40a0ae38.jpg" alt="Margherita pizza" loading="lazy" />
                          <div className="mmeta"><div className="mname">Pizza Margherita <span className="mtag">New</span></div><div className="mdesc">San Marzano, fior di latte</div></div>
                          <div className="mprice">$17</div>
                        </div>
                        <div className="mrow asm-dish" data-dish="1">
                          <img src="/img/photo-1424847651672-bf20a4b0982b.jpg" alt="Sharing plates of Italian food" loading="lazy" />
                          <div className="mmeta"><div className="mname">Antipasti board</div><div className="mdesc">Cured meats, olives, focaccia</div></div>
                          <div className="mprice">$21</div>
                        </div>
                        <div className="mrow asm-dish" data-dish="2">
                          <img src="/img/photo-1455619452474-d2be8b1e70cd.jpg" alt="Seafood linguine" loading="lazy" />
                          <div className="mmeta"><div className="mname">Linguine alle vongole</div><div className="mdesc">Clams, white wine, chilli</div></div>
                          <div className="mprice">$24</div>
                        </div>
                        <div className="mrow asm-add" style={{ borderStyle: 'dashed' }}>
                          <div style={{ width: '46px', height: '46px', borderRadius: '11px', background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--tomato)', flex: 'none' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
                          </div>
                          <div className="mmeta"><div className="mname" style={{ color: 'var(--cream-soft)' }}>Add a dish</div><div className="mdesc">Name, price, photo</div></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* STATE 3: SHARE — publish sweep, QR reveals */}
                  <div className="how-state s-share" data-state="2">
                    <div className="how-sweep" aria-hidden="true" />
                    <span className="live-pill"><span className="pulse" aria-hidden="true" /> Published &amp; live</span>
                    <h5>Your menu is online.</h5>
                    <p>Share the link, or print this QR for tables, windows and flyers.</p>
                    <div className="qrbox" data-qr>
                      <img src="https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=https://menufic.com/r/bella-trattoria" alt="Scannable QR code for the published Bella Trattoria menu" width={150} height={150} />
                    </div>
                    <div className="url">menufic.com/r/bella-trattoria</div>
                  </div>

                </div>
              </div>
            </div>
          </div>

          {/* scrolling steps + saffron progress rail */}
          <div className="how-steps-wrap">
            <div className="how-rail" aria-hidden="true">
              <div className="how-rail-fill" data-rail-fill />
              <div className="how-rail-node" data-node="0" />
              <div className="how-rail-node" data-node="1" />
              <div className="how-rail-node" data-node="2" />
            </div>
            <div className="how-steps">
              <article className="step is-active" data-step="0">
                <span className="num">01 · Create</span>
                <h3>Create your restaurant.</h3>
                <p>Add your name and pick your web address. Menufic instantly reserves your page at menufic.com/r/your-name. No website, no hosting to figure out.</p>
              </article>

              <article className="step" data-step="1">
                <span className="num">02 · Build</span>
                <h3>Build your menu.</h3>
                <p>Add dishes with a name, price and photo. Group them into courses, mark your favourites, and watch your menu come together beautifully as you type.</p>
              </article>

              <article className="step" data-step="2">
                <span className="num">03 · Share</span>
                <h3>Share with a QR code.</h3>
                <p>Hit publish and your menu is live. Print the QR for tables and windows, drop the link in your bio, and update prices any time, and changes show instantly.</p>
              </article>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

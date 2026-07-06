import { useEffect, useRef, useState } from 'react';
import LiveMenuDevice from '../islands/LiveMenuDevice';

/* ============================================================
   SIGNATURE ISLAND: VideoHero — landing hero (video background)
   ------------------------------------------------------------
   Ported from design/landing/index.html:
     - bespoke CSS  (lines ~102–273: hero, video/poster/scrim/grain,
       copy, QR chip, floating composition + feature bubbles)
     - markup       (lines ~595–696: the `<section class="hero">`)
   The phone in the composition is delegated to the LiveMenuDevice
   island (single source of the `.phone` CSS).

   REDUCED MOTION: the source runs a two-layer video cross-fade; the
   brief specifies the simpler autoplay+muted+loop+playsInline video,
   and — when `prefers-reduced-motion: reduce` — NO video: pause it,
   hide it, and show the still poster (mirrors index.html JS ~1280).

   TOKENIZATION (island HARD RULE): colours read theme tokens via the
   alias block on `.vh-hero` (--saffron → --color-secondary, --tomato →
   --color-primary, --green → --color-success, …). Remaining oklch
   literals are alpha scrims / grain / floating-panel glass / shadow
   stacks with no daisyUI token — clearly-named locals or documented
   carve-outs, exactly as the source.
   ============================================================ */

const css = `
.vh-hero{
  /* derivable aliases → theme tokens */
  --bg: var(--color-base-100);
  --surface: var(--color-base-200);
  --cream: var(--color-base-content);
  --cream-soft: var(--color-info);
  --saffron: var(--color-secondary);
  --tomato: var(--color-primary);
  --green: var(--color-success);
  /* non-derivable (no daisyUI token exists) */
  --tomato-bright: oklch(0.66 0.19 32);
  --line: oklch(0.42 0.03 48 / 0.5);
  --ease: cubic-bezier(0.16,1,0.3,1);

  position:relative;min-height:100svh;
  display:flex;align-items:center;
  padding:120px 0 60px;overflow:hidden;
  background:var(--bg);
}
.vh-hero .hero-video{
  position:absolute;inset:0;z-index:0;
  width:100%;height:100%;object-fit:cover;object-position:center 40%;
  pointer-events:none;
}
.vh-hero .hero-poster{
  position:absolute;inset:0;z-index:0;display:none;pointer-events:none;
  background-image:url("/video/hero-meatball-poster.jpg");
  background-size:cover;background-position:center 40%;
}
.vh-hero[data-reduced="true"] .hero-video{display:none}
.vh-hero[data-reduced="true"] .hero-poster{display:block}
.vh-hero .hero-scrim{
  position:absolute;inset:0;z-index:1;pointer-events:none;
  background:
    linear-gradient(95deg,
      oklch(0.155 0.026 52 / 0.97) 0%,
      oklch(0.16 0.027 53 / 0.93) 32%,
      oklch(0.175 0.028 54 / 0.78) 58%,
      oklch(0.185 0.03 55 / 0.62) 100%),
    radial-gradient(circle at 80% 28%, oklch(0.80 0.135 78 / 0.15), transparent 55%),
    linear-gradient(0deg, oklch(0.155 0.026 52 / 0.88), oklch(0.155 0.026 52 / 0.25) 45%, transparent 72%);
}
.vh-hero .hero-grain{
  position:absolute;inset:0;z-index:2;pointer-events:none;opacity:.5;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E");
  mix-blend-mode:overlay;
}
.vh-hero .hero-inner{
  position:relative;z-index:3;width:100%;
  display:grid;grid-template-columns:minmax(0,1.05fr) minmax(0,0.95fr);gap:48px;align-items:center;
}
.vh-hero .hero-copy{max-width:600px;min-width:0}
.vh-hero h1{
  font-size:clamp(2.6rem,6.2vw,6rem);
  letter-spacing:-0.035em;line-height:0.98;color:var(--cream);
  text-shadow:0 2px 24px oklch(0.13 0.02 50 / 0.6);
  text-wrap:balance;
}
.vh-hero h1 .em{color:var(--saffron)}
.vh-hero h1 .hl-line{display:block;overflow:hidden;padding-bottom:.1em;margin-bottom:-.1em}
.vh-hero h1 .hl-in{display:block}
.vh-hero .hero-sub{
  margin-top:26px;font-size:clamp(1.05rem,2vw,1.3rem);
  color:var(--cream-soft);max-width:52ch;line-height:1.55;
  text-shadow:0 1px 12px oklch(0.13 0.02 50 / 0.55);
}
.vh-hero .hero-actions{margin-top:34px;display:flex;flex-wrap:wrap;align-items:center;gap:16px}
.vh-hero .see-live{display:inline-flex;align-items:center;gap:8px;color:var(--cream);font-weight:500;font-size:16px;min-height:48px;padding:0 6px}
.vh-hero .see-live-label{text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:5px;text-decoration-color:oklch(0.83 0.022 78 / 0.45);transition:text-decoration-color .3s var(--ease)}
.vh-hero .see-live:hover .see-live-label,.vh-hero .see-live:focus-visible .see-live-label{text-decoration-color:var(--saffron)}
.vh-hero .see-live .arr{transition:transform .3s var(--ease)}
.vh-hero .see-live:hover .arr{transform:translateX(4px)}
.vh-hero .hero-qr{
  margin-top:36px;display:inline-flex;align-items:center;gap:16px;
  padding:12px 18px 12px 12px;border-radius:16px;
  background:oklch(0.20 0.028 54 / 0.82);border:1px solid var(--line);
  -webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);
  box-shadow:var(--shadow-floating);
}
.vh-hero .hero-qr .chip{background:oklch(1 0 0);border-radius:9px;padding:7px;line-height:0;flex:none}
.vh-hero .hero-qr .chip img{width:62px;height:62px}
.vh-hero .hero-qr .qr-text{font-size:14.5px;line-height:1.4}
.vh-hero .hero-qr .qr-text b{display:block;color:var(--cream);font-weight:600;font-size:15px}
.vh-hero .hero-qr .qr-text span{color:var(--cream-soft)}

/* hero composition */
.vh-hero .hero-stage{position:relative;perspective:1400px;min-width:0}
.vh-hero .hero-composition{
  position:relative;width:min(356px,80%);margin:0 auto;
  transform-style:preserve-3d;
  transition:transform .35s var(--ease);
}
.vh-hero .hero-composition.float{animation:vh-idleFloat 7s ease-in-out infinite}
@keyframes vh-idleFloat{0%,100%{translate:0 0}50%{translate:0 -14px}}
.vh-hero .lmd-phone::before{
  content:"";position:absolute;top:50%;left:-1px;width:3px;height:60px;
  border-radius:3px;background:oklch(0.45 0.03 70 / 0.5);transform:translateY(-90px);
}
.vh-hero .hero-dish{
  position:absolute;z-index:4;width:172px;height:172px;border-radius:24px;
  left:-58px;bottom:-26px;object-fit:cover;
  border:5px solid var(--surface);
  box-shadow:0 30px 60px -24px oklch(0 0 0 /0.85), 0 2px 0 oklch(0.85 0.13 78 /0.2);
  transform:translateZ(60px);
}
.vh-hero .hero-chip{
  position:absolute;z-index:5;right:-30px;top:-30px;
  display:flex;align-items:center;gap:9px;
  background:oklch(0.30 0.04 60 / 0.92);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);
  border:1px solid var(--line);border-radius:12px;padding:10px 14px;
  box-shadow:0 20px 40px -20px oklch(0 0 0 /0.8);
  transform:translateZ(90px);
}
.vh-hero .hero-chip .pulse{width:10px;height:10px;border-radius:50%;background:var(--green);box-shadow:0 0 0 0 color-mix(in oklch, var(--green) 50%, transparent)}
.vh-hero .hero-chip.live .pulse{animation:vh-livePulse 2.2s ease-out infinite}
@keyframes vh-livePulse{0%{box-shadow:0 0 0 0 color-mix(in oklch, var(--green) 50%, transparent)}100%{box-shadow:0 0 0 12px transparent}}
.vh-hero .hero-chip b{font-size:13px;font-weight:600;color:var(--cream)}
.vh-hero .hero-chip span{font-size:11px;color:var(--cream-soft);display:block}

/* floating feature bubbles */
.vh-hero .bubble{
  position:absolute;z-index:6;display:inline-flex;align-items:center;gap:9px;
  background:oklch(0.245 0.034 58 / 0.94);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);
  border-radius:999px;padding:11px 16px;
  box-shadow:0 18px 38px -20px oklch(0 0 0 /0.8);
  font-weight:600;font-size:0.86rem;white-space:nowrap;color:var(--cream);
  border:1px solid var(--line);
}
.vh-hero .bubble .ic{width:30px;height:30px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;background:oklch(0.30 0.04 60)}
.vh-hero .bubble .ic svg{width:17px;height:17px}
.vh-hero .bubble.scan .ic{color:var(--saffron)}
.vh-hero .bubble.theme .ic{color:var(--tomato-bright)}
.vh-hero .bubble.track .ic{color:var(--green)}
.vh-hero .bubble.qr .ic{color:var(--saffron)}
.vh-hero .bubble.scan{top:-30px;left:-30px}
.vh-hero .bubble.theme{top:84px;right:-46px;font-size:0.92rem}
.vh-hero .bubble.track{bottom:142px;left:-58px}
.vh-hero .bubble.qr{bottom:30px;right:-22px}
/* bubble entrance + drift (JS adds .pop once mounted) */
.vh-hero .bubble{opacity:0;transform:scale(0.7)}
.vh-hero .bubble.pop{opacity:1;animation:vh-popIn .5s var(--ease) forwards}
@keyframes vh-popIn{from{opacity:0;transform:scale(0.7)}to{opacity:1;transform:scale(1)}}
.vh-hero .bubble.pop.drift1{animation:vh-popIn .5s var(--ease) forwards, vh-drift1 7s ease-in-out 0.6s infinite}
.vh-hero .bubble.pop.drift2{animation:vh-popIn .5s var(--ease) forwards, vh-drift2 9s ease-in-out 0.6s infinite}
.vh-hero .bubble.pop.drift3{animation:vh-popIn .5s var(--ease) forwards, vh-drift3 6s ease-in-out 0.6s infinite}
.vh-hero .bubble.pop.drift4{animation:vh-popIn .5s var(--ease) forwards, vh-drift4 8s ease-in-out 0.6s infinite}
@keyframes vh-drift1{0%,100%{transform:translate(0,0)}50%{transform:translate(7px,-12px)}}
@keyframes vh-drift2{0%,100%{transform:translate(0,0)}50%{transform:translate(-9px,10px)}}
@keyframes vh-drift3{0%,100%{transform:translate(0,0)}50%{transform:translate(10px,8px)}}
@keyframes vh-drift4{0%,100%{transform:translate(0,0)}50%{transform:translate(-6px,-11px)}}

@media (prefers-reduced-motion: reduce){
  .vh-hero .hero-composition.float{animation:none}
  .vh-hero .bubble{opacity:1;transform:none}
  .vh-hero .bubble.pop{animation:none}
}

@media (max-width:980px){
  .vh-hero .hero-inner{grid-template-columns:minmax(0,1fr);gap:44px;text-align:left}
  .vh-hero .hero-stage{order:2;margin-top:34px}
  .vh-hero .hero-composition{width:min(330px,76%)}
  .vh-hero .hero-dish{width:140px;height:140px;left:-26px}
  .vh-hero .hero-chip{right:-14px}
  .vh-hero .bubble{font-size:0.68rem;padding:6px 9px;gap:6px}
  .vh-hero .bubble .ic{width:22px;height:22px}
  .vh-hero .bubble .ic svg{width:13px;height:13px}
  .vh-hero .bubble.scan{top:42px;left:-4px}
  .vh-hero .bubble.theme{top:42px;left:auto;right:-4px;font-size:0.68rem}
  .vh-hero .bubble.track{bottom:172px;left:-18px}
  .vh-hero .bubble.qr{bottom:14px;right:-6px}
}
@media (max-width:520px){
  .vh-hero{padding:108px 0 50px}
  .vh-hero .hero-dish{width:118px;height:118px;left:-12px;bottom:-18px}
  .vh-hero .hero-chip{right:0;top:-26px;padding:8px 11px}
  .vh-hero .hero-qr{width:100%}
  .vh-hero .bubble{font-size:0.58rem;padding:5px 7px;gap:4px}
  .vh-hero .bubble .ic{width:18px;height:18px}
  .vh-hero .bubble .ic svg{width:11px;height:11px}
}
`;

const BUBBLE_DRIFT = ['drift1', 'drift2', 'drift3', 'drift4'];

export default function VideoHero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [reduced, setReduced] = useState(false);
  const [popped, setPopped] = useState(false);

  useEffect(() => {
    const mq = matchMedia('(prefers-reduced-motion: reduce)');
    const isReduced = mq.matches;
    setReduced(isReduced);

    const v = videoRef.current;
    if (isReduced) {
      // reduced motion: no video — pause it and show the still poster
      if (v) {
        try { v.pause(); } catch { /* noop */ }
      }
      setPopped(true); // bubbles appear immediately, no animation
    } else if (v) {
      const p = v.play();
      if (p && typeof p.catch === 'function') p.catch(() => { /* autoplay blocked */ });
      // staggered bubble pop-in shortly after mount
      const t = setTimeout(() => setPopped(true), 220);
      return () => clearTimeout(t);
    }
  }, []);

  return (
    <>
      <style href="menufic-video-hero" precedence="high">{css}</style>
      <section className="vh-hero" data-reduced={reduced} aria-labelledby="vh-hero-h">
        {/* autoplay + muted + loop + playsInline; paused & hidden under reduced motion */}
        <video
          ref={videoRef}
          className="hero-video"
          autoPlay={!reduced}
          muted
          loop
          playsInline
          preload="auto"
          poster="/video/hero-meatball-poster.jpg"
          aria-hidden="true"
        >
          <source src="/video/hero-meatball.mp4" type="video/mp4" />
        </video>
        <div className="hero-poster" aria-hidden="true" />
        <div className="hero-scrim" aria-hidden="true" />
        <div className="hero-grain" aria-hidden="true" />

        <div className="hero-inner mx-auto w-full max-w-[1200px] px-6">
          <div className="hero-copy">
            <h1 id="vh-hero-h">
              <span className="hl-line"><span className="hl-in">A digital menu</span></span>
              <span className="hl-line"><span className="hl-in em">for your restaurant.</span></span>
            </h1>
            <p className="hero-sub">
              Add your dishes, choose a theme, and hit publish. Menufic gives you a menu to share by
              link or QR. No design skills, and free forever.
            </p>

            <div className="hero-actions">
              <a className="btn btn-primary" href="/app/signin">
                <svg className="h-[18px] w-[18px] shrink-0" viewBox="0 0 48 48" aria-hidden="true">
                  <path fill="currentColor" d="M44.5 20H24v8.5h11.8C34.7 33.9 30 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 6 1.1 8.2 3l6.3-6.3C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z" />
                </svg>
                Get started, it's free
              </a>
              <a className="see-live" href="#studio">
                <span className="see-live-label">See a live menu</span>{' '}
                <span className="arr" aria-hidden="true">→</span>
              </a>
            </div>

            <div className="hero-qr">
              <span className="chip">
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=https://menufic.com/r/saffron-smoke"
                  alt="QR code linking to the live Saffron and Smoke sample menu"
                  width={62}
                  height={62}
                />
              </span>
              <span className="qr-text">
                <b>Scan to see a real menu</b>
                <span>Point your camera at the code. That's a live Menufic page.</span>
              </span>
            </div>
          </div>

          <div className="hero-stage">
            <div className={`hero-composition${reduced ? '' : ' float'}`}>
              <div className={`bubble scan${popped ? ` pop ${BUBBLE_DRIFT[0]}` : ''}`}>
                <span className="ic" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2" /><line x1="3" y1="12" x2="21" y2="12" /></svg>
                </span>
                Scan to preview
              </div>
              <button
                className={`bubble theme${popped ? ` pop ${BUBBLE_DRIFT[1]}` : ''}`}
                type="button"
                aria-label="Tap to preview a theme colour on the menu"
              >
                <span className="ic" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="13.5" cy="6.5" r="2.5" /><circle cx="17.5" cy="10.5" r="2.5" /><circle cx="8.5" cy="7.5" r="2.5" /><circle cx="6.5" cy="12.5" r="2.5" /><path d="M12 2a10 10 0 1 0 0 20 2 2 0 0 0 2-2 2 2 0 0 1 2-2h2a4 4 0 0 0 4-4 10 10 0 0 0-10-10z" /></svg>
                </span>
                Customise themes
              </button>
              <div className={`bubble track${popped ? ` pop ${BUBBLE_DRIFT[2]}` : ''}`}>
                <span className="ic" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
                </span>
                Track analytics
              </div>
              <div className={`bubble qr${popped ? ` pop ${BUBBLE_DRIFT[3]}` : ''}`}>
                <span className="ic" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><line x1="14" y1="14" x2="14" y2="21" /><line x1="18" y1="14" x2="21" y2="14" /><line x1="21" y1="18" x2="21" y2="21" /></svg>
                </span>
                Share via QR
              </div>

              <LiveMenuDevice accent="saffron" accentRadius={14} />

              <img
                className="hero-dish"
                src="/img/photo-1565299624946-b28f40a0ae38.jpg"
                alt="A bubbling wood-fired pizza, fresh from the oven"
                loading="lazy"
              />
              <div className="hero-chip live">
                <span className="pulse" aria-hidden="true" />
                <span>
                  <b>Published &amp; live</b>
                  <span>menufic.com/r/saffron-smoke</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

import { useEffect, useState } from 'react';

/* ============================================================
   LANDING ISLAND: Marquee — seamless testimonial loop
   ------------------------------------------------------------
   Ported from design/landing/index.html:
     - bespoke CSS  (lines ~539–555: the `.marquee` mask + `.marquee-track`
       keyframe loop + the `.static` reduced-motion fallback)
     - markup       (lines ~1092–1194: the two testimonial card sets)
     - reduced-motion JS (lines ~1542–1553) → hook below.

   Only the marquee MECHANISM is bespoke; the cards themselves are pure
   Tailwind/daisyUI utilities, kept verbatim. Landing-scoped, so it lives
   in a small island rather than a shared app.css utility.

   REDUCED MOTION: the animated loop is replaced by a manually
   scrollable region — the duplicate (aria-hidden) set is dropped so a
   screen-reader / manual scroller isn't doubled, matching the source.
   ============================================================ */

const css = `
.mq{position:relative;margin-top:14px;overflow:hidden;
  -webkit-mask:linear-gradient(90deg,transparent,oklch(0 0 0) 6%,oklch(0 0 0) 94%,transparent);
  mask:linear-gradient(90deg,transparent,oklch(0 0 0) 6%,oklch(0 0 0) 94%,transparent);
}
.mq-track{
  display:flex;gap:clamp(18px,2.4vw,28px);width:max-content;
  animation:mq-scroll 56s linear infinite;
}
.mq:hover .mq-track,
.mq:focus-within .mq-track{animation-play-state:paused}
@keyframes mq-scroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}
/* reduced-motion / no-JS fallback: manual horizontal scroll, no animation */
.mq.static{overflow-x:auto;-webkit-overflow-scrolling:touch;
  -webkit-mask:none;mask:none;padding-bottom:8px;
}
.mq.static .mq-track{animation:none;width:max-content}
`;

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  /** photo avatar */
  img?: string;
  imgAlt?: string;
  /** OR monogram avatar */
  initials?: string;
  /** daisyUI tonal classes for the monogram chip */
  initialsClass?: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      '"I scribbled our specials on a chalkboard for years. Now there\'s a QR on every table and our dishes finally look as good as they taste."',
    name: 'Maria Conti',
    role: 'Owner, Bella Trattoria',
    img: '/img/photo-1438761681033-6461ffad8d80.jpg',
    imgAlt: 'Maria Conti, owner of Bella Trattoria, smiling warmly',
  },
  {
    quote:
      '"We change the grill menu nightly. I update prices from my phone between services and it\'s live before the doors open. Didn\'t believe it was free."',
    name: 'Daniel Okafor',
    role: 'Owner, Saffron & Smoke',
    img: '/img/photo-1507003211169-0a1dd7228f2d.jpg',
    imgAlt: 'Daniel Okafor, owner of Saffron and Smoke, in his kitchen',
  },
  {
    quote:
      '"No printing costs, no designer, no website headache. I built our whole menu in an afternoon and the green theme suits our little cafe perfectly."',
    name: 'Priya Nair',
    role: 'Owner, Verde Kitchen',
    img: '/img/photo-1494790108377-be9c29b29330.jpg',
    imgAlt: 'Priya Nair, owner of Verde Kitchen, in her bright cafe',
  },
  {
    quote:
      '"Our food truck moves every day. The QR sticker on the window means regulars always find tonight\'s menu, wherever we park."',
    name: 'Tom Gallagher',
    role: 'Owner, Smoke & Barrel Truck',
    initials: 'TG',
    initialsClass: 'bg-primary text-primary-content',
  },
  {
    quote:
      '"I\'m not techy at all. I had our tapas menu online before my coffee went cold, and editing a price is genuinely two taps."',
    name: 'Elena Marín',
    role: 'Owner, Calle Ocho Tapas',
    initials: 'EM',
    initialsClass: 'bg-secondary text-secondary-content',
  },
  {
    quote:
      '"The analytics surprised me. I could see which ramen people kept opening, so I made it the house special. Sales followed."',
    name: 'Kenji Tanaka',
    role: 'Owner, Hana Ramen Bar',
    initials: 'KT',
    initialsClass: 'bg-success text-success-content',
  },
];

function Card({ t, aria }: { t: Testimonial; aria: boolean }) {
  return (
    <figure
      className="tcard flex w-[min(340px,82vw)] flex-none flex-col rounded-[22px] border border-base-content/[0.08] bg-base-100 p-[30px]"
      {...(aria ? { 'aria-hidden': true } : {})}
    >
      <div className="mb-4 text-[15px] tracking-[2px] text-secondary" {...(aria ? {} : { 'aria-label': '5 out of 5 stars' })}>★★★★★</div>
      <blockquote className="m-0 font-display text-[1.12rem] font-medium leading-[1.36] tracking-[-0.01em] text-base-content">
        {t.quote}
      </blockquote>
      <figcaption className="mt-auto flex items-center gap-[13px] pt-6">
        {t.img ? (
          <img
            className="h-[46px] w-[46px] flex-none rounded-full object-cover"
            src={t.img}
            alt={aria ? '' : t.imgAlt}
            loading="lazy"
          />
        ) : (
          <span
            className={`flex h-[46px] w-[46px] flex-none items-center justify-center rounded-full font-display text-[18px] font-bold ${t.initialsClass}`}
            aria-hidden="true"
          >
            {t.initials}
          </span>
        )}
        <div className="min-w-0">
          <b className="block text-[15px] font-semibold text-base-content">{t.name}</b>
          <span className="text-[13.5px] text-info">{t.role}</span>
        </div>
      </figcaption>
    </figure>
  );
}

export default function Marquee() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  // Reduced motion: manual-scroll region, single (non-duplicated) set.
  const staticProps = reduced
    ? {
        tabIndex: 0,
        role: 'region',
        'aria-label': 'Testimonials from restaurant owners, scroll horizontally',
      }
    : {};

  return (
    <div className={`mq${reduced ? ' static' : ''}`} {...staticProps}>
      <style href="menufic-marquee" precedence="high">{css}</style>
      <div className="mq-track" aria-label="Testimonials from restaurant owners">
        {/* SET A (the original 6) */}
        {TESTIMONIALS.map((t) => (
          <Card key={t.name} t={t} aria={false} />
        ))}
        {/* SET B (duplicate for a seamless loop) — hidden from AT; dropped under reduced motion */}
        {!reduced && TESTIMONIALS.map((t) => (
          <Card key={`dup-${t.name}`} t={t} aria />
        ))}
      </div>
    </div>
  );
}

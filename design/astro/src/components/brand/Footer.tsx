// Ported from design/landing/index.html lines ~1219-1252 (site footer).
// Presentational only (no client directive needed when mounted from BrandLayout).
// Dead `#` links (About, Contact, Privacy Policy, Terms & Conditions, Cookie
// Policy) are intentional source stubs and are kept as `#`.
const PRODUCT_LINKS = [
  { href: '#how', label: 'How it works' },
  { href: '#studio', label: 'See a menu' },
  { href: '#features', label: 'Features' },
  { href: '#pricing', label: 'Pricing' },
];

const COMPANY_LINKS = [
  { href: '#features', label: 'Features' },
  { href: '/app/signin', label: 'Get started' },
  { href: '#', label: 'About' },
  { href: '#', label: 'Contact' },
];

const LEGAL_LINKS = [
  { href: '#', label: 'Privacy Policy' },
  { href: '#', label: 'Terms & Conditions' },
  { href: '#', label: 'Cookie Policy' },
];

export default function Footer() {
  return (
    <footer className="border-t border-base-content/10 bg-cocoa-deep pb-9 pt-16">
      <div className="mx-auto w-full max-w-[1200px] px-6">
        <div className="grid grid-cols-1 gap-x-8 gap-y-9 min-[440px]:grid-cols-2 md:grid-cols-[1.4fr_repeat(3,0.9fr)]">
          <div className="max-[760px]:col-span-full">
            <a
              className="inline-flex items-center gap-2 font-display text-[25px] font-bold tracking-[-0.04em] text-base-content"
              href="#top"
              aria-label="Menufic home"
            >
              Menufic
              <span className="mb-[-2px] h-[9px] w-[9px] rounded-full bg-primary" aria-hidden="true" />
            </a>
            <p className="mt-3.5 max-w-[32ch] text-[15px] leading-[1.55] text-info">
              The genuinely free digital menu maker for restaurants of every size.
            </p>
          </div>
          <div>
            <h6 className="mb-4 text-[13px] font-semibold uppercase tracking-[0.04em] text-info">Product</h6>
            {PRODUCT_LINKS.map((link) => (
              <a
                key={link.label}
                className="mb-[11px] block text-[15px] text-base-content transition-colors hover:text-secondary"
                href={link.href}
              >
                {link.label}
              </a>
            ))}
          </div>
          <div>
            <h6 className="mb-4 text-[13px] font-semibold uppercase tracking-[0.04em] text-info">Company</h6>
            {COMPANY_LINKS.map((link) => (
              <a
                key={link.label}
                className="mb-[11px] block text-[15px] text-base-content transition-colors hover:text-secondary"
                href={link.href}
              >
                {link.label}
              </a>
            ))}
          </div>
          <div>
            <h6 className="mb-4 text-[13px] font-semibold uppercase tracking-[0.04em] text-info">Legal</h6>
            {LEGAL_LINKS.map((link) => (
              <a
                key={link.label}
                className="mb-[11px] block text-[15px] text-base-content transition-colors hover:text-secondary"
                href={link.href}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
        <div className="mt-[52px] flex flex-wrap justify-between gap-4 border-t border-base-content/10 pt-6 text-[13.5px] text-info">
          <span>© 2026 Menufic. All rights reserved.</span>
          <span className="text-secondary">Powered by Menufic</span>
        </div>
      </div>
    </footer>
  );
}

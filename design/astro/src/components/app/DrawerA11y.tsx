import { useEffect } from 'react';

// Ported from design/landing/app/dashboard.html lines ~262-271 & ~288-293 (formerly
// the imperative sidebar-drawer script). The daisyUI checkbox (#app-drawer) still
// drives the slide/overlay natively; this island only adds the two behaviours that
// can't be expressed declaratively:
//   - Escape closes the drawer when it's open.
//   - Clicking a sidebar nav link on mobile (max-width:1023px) closes the drawer.
// The `aria-expanded` burger-sync branch from the source is intentionally omitted:
// in the Astro shell the trigger is a native <label htmlFor="app-drawer"> (Topbar),
// not a button carrying aria-expanded, so there is nothing to sync.
export default function DrawerA11y({ drawerId }: { drawerId: string }): null {
  useEffect(() => {
    const drawer = document.getElementById(drawerId) as HTMLInputElement | null;
    if (!drawer) return;
    const drawerSide = document.querySelector<HTMLElement>('.drawer-side');
    const mqMobile = window.matchMedia('(max-width:1023px)');

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && drawer!.checked) drawer!.checked = false;
    }
    function onSideClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (target.closest('a') && mqMobile.matches) drawer!.checked = false;
    }

    document.addEventListener('keydown', onKeyDown);
    drawerSide?.addEventListener('click', onSideClick);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      drawerSide?.removeEventListener('click', onSideClick);
    };
  }, [drawerId]);

  return null;
}

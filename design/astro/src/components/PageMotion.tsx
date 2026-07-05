import { useEffect } from 'react';
export default function PageMotion() {
  useEffect(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.documentElement.classList.add('js');
    const stag = [...document.querySelectorAll<HTMLElement>('.stagger')];
    if (reduce) stag.forEach(el => el.classList.add('in'));
    else stag.sort((a,b)=>(+(a.dataset.delay||0))-(+(b.dataset.delay||0)))
      .forEach(el => setTimeout(()=>el.classList.add('in'), (+(el.dataset.delay||0))*80+90));
    const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && e.target.classList.add('in')), { threshold: 0.15 });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}

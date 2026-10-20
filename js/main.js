(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // revelação suave por seção
  const rv = [...document.querySelectorAll('.rv')];
  if (reduce || !('IntersectionObserver' in window)) {
    rv.forEach(e => e.classList.add('in'));
  } else {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }), { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    rv.forEach(e => io.observe(e));
  }

  // três terços: o passo ativo acende a faixa do rosto
  const steps = [...document.querySelectorAll('.step')];
  const bands = [...document.querySelectorAll('.band')];
  const nums = [...document.querySelectorAll('.rn')];
  const gls = [...document.querySelectorAll('.gl')];
  const setActive = i => {
    gls.forEach(g => g.classList.toggle('on', g.dataset.b.split(',').includes(String(i))));
    steps.forEach((s, k) => s.classList.toggle('on', k === i));
    bands.forEach((b, k) => b.classList.toggle('on', k === i));
    nums.forEach((n, k) => n.classList.toggle('on', k === i));
  };
  setActive(0);
  if ('IntersectionObserver' in window) {
    const so = new IntersectionObserver(es => {
      es.forEach(e => { if (e.isIntersecting) setActive(steps.indexOf(e.target)); });
    }, { rootMargin: matchMedia('(max-width: 900px)').matches ? '-50% 0px -38% 0px' : '-38% 0px -46% 0px', threshold: 0 });
    steps.forEach(s => so.observe(s));
  }
  if (matchMedia('(hover: hover)').matches) steps.forEach((s, i) => s.addEventListener('mouseenter', () => setActive(i)));

  // CTA fixo no celular depois da primeira dobra
  const float = document.querySelector('[data-float]');
  const hero = document.querySelector('.hero');
  const contact = document.querySelector('#contato');
  if (float && hero && 'IntersectionObserver' in window) {
    let pastHero = false, atContact = false, atThirds = false;
    const upd = () => float.classList.toggle('show', pastHero && !atContact && !atThirds);
    new IntersectionObserver(([e]) => { atThirds = e.isIntersecting; upd(); }, { threshold: 0.05 }).observe(document.querySelector('#tercos'));
    new IntersectionObserver(([e]) => { pastHero = !e.isIntersecting; upd(); }, { threshold: 0 }).observe(hero);
    new IntersectionObserver(([e]) => { atContact = e.isIntersecting; upd(); }, { threshold: 0.2 }).observe(contact);
  }
})();

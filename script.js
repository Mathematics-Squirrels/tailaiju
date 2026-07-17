document.documentElement.classList.add('js');

const revealItems = document.querySelectorAll('.reveal');
const header = document.querySelector('[data-header]');
const progressBar = document.querySelector('.reading-progress span');
const hero = document.querySelector('.hero');
const heroArtwork = document.querySelector('.hero__visual svg');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if ('IntersectionObserver' in window && !reduceMotion) {
  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        currentObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -8% 0px',
    },
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

window.requestAnimationFrame(() => {
  window.requestAnimationFrame(() => hero?.classList.add('is-animated'));
});

let frameRequested = false;

function updateScrollEffects() {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? Math.min(scrollTop / scrollable, 1) : 0;

  if (progressBar) {
    progressBar.style.transform = `scaleX(${progress})`;
  }

  header?.classList.toggle('is-scrolled', scrollTop > 24);

  if (heroArtwork && !reduceMotion) {
    const heroHeight = hero?.offsetHeight || window.innerHeight;
    const localProgress = Math.min(scrollTop / heroHeight, 1);
    heroArtwork.style.transform = `translate3d(0, ${localProgress * 18}px, 0)`;
  }

  frameRequested = false;
}

function onScroll() {
  if (frameRequested) return;
  frameRequested = true;
  window.requestAnimationFrame(updateScrollEffects);
}

window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', onScroll, { passive: true });
updateScrollEffects();

const DURATION_MS = 450;

function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4);
}

export function smoothScrollToId(id: string) {
  const target = document.getElementById(id);
  if (!target) return;

  const startY = window.scrollY;
  const targetY = startY + target.getBoundingClientRect().top;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.scrollTo(0, targetY);
    return;
  }

  const distance = targetY - startY;
  const startTime = performance.now();

  function step(now: number) {
    const progress = Math.min((now - startTime) / DURATION_MS, 1);
    window.scrollTo(0, startY + distance * easeOutQuart(progress));
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

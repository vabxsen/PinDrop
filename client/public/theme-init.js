(function () {
  try {
    var stored = localStorage.getItem('pindrop-theme');
    var theme =
      stored === 'dark' || stored === 'light'
        ? stored
        : window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';
    if (theme === 'dark') document.documentElement.classList.add('dark');
  } catch {
    /* localStorage unavailable (e.g. blocked); fall back to light theme. */
  }
})();

export function chartTokens(isDark: boolean) {
  return {
    sequential: isDark ? '#8172ff' : '#5330f0',
    good: '#0ca30c',
    critical: '#d03b3b',
    grid: isDark ? '#334155' : '#e2e8f0',
    axis: isDark ? '#475569' : '#cbd5e1',
    text: isDark ? '#94a3b8' : '#64748b',
    surface: isDark ? '#0f172a' : '#ffffff',
  };
}

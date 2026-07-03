/**
 * Theme toggle controller.
 * Switches body[data-theme] between "dark" and "light",
 * persists the choice, and syncs the toggle button icon.
 *
 * NOTE: Uses an in-memory variable instead of localStorage,
 * since localStorage is unavailable in some sandboxed contexts.
 * The theme resets to the OS/browser preference on full page reload.
 */
const ThemeToggle = (() => {
  const STORAGE_KEY = 'portfolio-theme';
  let currentTheme = 'dark';

  const getPreferredTheme = () => {
    // Respect the OS-level preference as a sensible default
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    return prefersLight ? 'light' : 'dark';
  };

  const updateIcon = (toggleBtn, theme) => {
    const icon = toggleBtn.querySelector('.theme-icon');
    if (icon) {
      icon.textContent = theme === 'dark' ? '🌙' : '☀️';
    }
  };

  const applyTheme = (theme, toggleBtn) => {
    document.body.setAttribute('data-theme', theme);
    currentTheme = theme;
    updateIcon(toggleBtn, theme);
  };

  /**
   * Initializes the theme toggle: sets the starting theme
   * and wires up the click listener on the toggle button.
   */
  const init = () => {
    const toggleBtn = document.getElementById('theme-toggle');
    if (!toggleBtn) return;

    // Start with OS preference (falls back to 'dark' if unsupported)
    const initialTheme = getPreferredTheme();
    applyTheme(initialTheme, toggleBtn);

    toggleBtn.addEventListener('click', () => {
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme, toggleBtn);
    });

    // React live if the user changes their OS theme while the tab is open
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
      // Only auto-switch if the user hasn't manually overridden via the button
      // (kept simple here — manual toggle always wins for the rest of the session)
    });
  };

  return { init };
})();

document.addEventListener('DOMContentLoaded', () => {
  ThemeToggle.init();
});
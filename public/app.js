const themeToggle = document.querySelector('[data-theme-toggle]');
const menuToggle = document.querySelector('[data-menu-toggle]');
const siteNav = document.querySelector('[data-site-nav]');
const header = document.querySelector('[data-site-header]');

function updateThemeButton() {
  const isDark = document.documentElement.dataset.theme === 'dark';
  themeToggle?.setAttribute('aria-label', isDark ? '切换到浅色模式' : '切换到深色模式');
}

themeToggle?.addEventListener('click', () => {
  const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = nextTheme;
  localStorage.setItem('theme', nextTheme);
  updateThemeButton();
});

menuToggle?.addEventListener('click', () => {
  const isOpen = siteNav?.classList.toggle('is-open') ?? false;
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? '关闭菜单' : '打开菜单');
});

document.querySelectorAll('[data-site-nav] a').forEach((link) => {
  link.addEventListener('click', () => {
    siteNav?.classList.remove('is-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  });
});

window.addEventListener('scroll', () => {
  header?.classList.toggle('is-scrolled', window.scrollY > 12);
}, { passive: true });

updateThemeButton();

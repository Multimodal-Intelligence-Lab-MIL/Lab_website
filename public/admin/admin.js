(function () {
  const ADMIN_USERNAME = 'MIL';
  const ADMIN_PASSWORD = 'MIL';
  const SESSION_KEY = 'mil-admin-session';
  const folders = {
    news: 'src/content/news',
    publications: 'src/content/publications',
    people: 'src/content/people',
    research: 'src/content/research'
  };

  const loginView = document.querySelector('[data-login-view]');
  const adminView = document.querySelector('[data-admin-view]');
  const loginForm = document.querySelector('[data-login-form]');
  const loginError = document.querySelector('[data-login-error]');
  const repositoryUrl = document.body.dataset.repositoryUrl;

  function showAdmin() {
    loginView.hidden = true;
    adminView.hidden = false;
  }

  function showLogin() {
    adminView.hidden = true;
    loginView.hidden = false;
  }

  if (sessionStorage.getItem(SESSION_KEY) === 'active') showAdmin();
  else showLogin();

  loginForm?.addEventListener('submit', function (event) {
    event.preventDefault();
    const data = new FormData(loginForm);
    const username = String(data.get('username') || '');
    const password = String(data.get('password') || '');
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, 'active');
      loginError.hidden = true;
      loginForm.reset();
      showAdmin();
      return;
    }
    loginError.hidden = false;
  });

  document.querySelector('[data-logout]')?.addEventListener('click', function () {
    sessionStorage.removeItem(SESSION_KEY);
    showLogin();
  });

  const tabs = Array.from(document.querySelectorAll('[data-tab]'));
  const panels = Array.from(document.querySelectorAll('[data-panel]'));
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      const key = tab.dataset.tab;
      tabs.forEach((item) => item.setAttribute('aria-selected', String(item === tab)));
      panels.forEach((panel) => { panel.hidden = panel.dataset.panel !== key; });
    });
  });

  function cleanSlug(value) {
    return value
      .trim()
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  async function copyTemplate(text) {
    if (!navigator.clipboard) return false;
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  }

  document.querySelector('[data-create-form]')?.addEventListener('submit', async function (event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const contentType = String(data.get('contentType') || 'news');
    const slug = cleanSlug(String(data.get('slug') || ''));
    const status = document.querySelector('[data-create-status]');
    const template = document.querySelector(`[data-content-template="${contentType}"]`)?.value || '';

    if (!slug) {
      status.textContent = 'Please enter a short English file name.';
      return;
    }

    const url = `${repositoryUrl}/new/main/${folders[contentType]}?filename=${encodeURIComponent(`${slug}.md`)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    const copied = await copyTemplate(template);
    status.textContent = copied
      ? 'Template copied. Paste it into the GitHub editor, complete the fields, then commit.'
      : 'GitHub opened, but automatic copy was blocked. Copy the template from the prompt.';
    if (!copied) window.prompt('Copy this template into the GitHub editor:', template);
  });
})();

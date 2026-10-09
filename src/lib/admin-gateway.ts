/** Keep the entry screen independent of the editor and repository data. */
export function mountAdminGateway() {
  const sessionKey = 'mil-admin-session';
  const login = document.querySelector<HTMLElement>('[data-login-view]')!;
  const dashboard = document.querySelector<HTMLElement>('[data-admin-view]')!;
  const form = document.querySelector<HTMLFormElement>('[data-login-form]')!;
  const error = document.querySelector<HTMLElement>('[data-login-error]')!;
  const status = document.querySelector<HTMLElement>('[data-gateway-status]')!;
  const button = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
  const config = JSON.parse(document.querySelector('#admin-gateway-config')!.textContent!);
  let editorReady = false;
  let pending = false;
  let warming: Promise<[typeof import('./admin-editor.js'), unknown]> | undefined;

  // Start downloading the editor and its data while the visitor is still signing in,
  // so pressing "Enter admin" only has to render. A failed attempt is retried on submit.
  function warm() {
    warming ??= Promise.all([
      import('./admin-editor.js'),
      fetch(config.dataUrl).then(response => {
        if (!response.ok) throw new Error('Editor data could not be loaded.');
        return response.json();
      })
    ]);
    warming.catch(() => { warming = undefined; });
    return warming;
  }

  async function enter() {
    if (pending) return;
    pending = true;
    button.disabled = true;
    status.hidden = false;
    status.textContent = 'Opening the editor…';
    error.hidden = true;
    try {
      if (!editorReady) {
        const [editor, data] = await warm();
        editor.initAdmin(data);
        editorReady = true;
      }
      sessionStorage.setItem(sessionKey, 'active');
      login.hidden = true;
      dashboard.hidden = false;
      form.reset();
    } catch {
      status.textContent = 'Could not load the editor. Please try again.';
    } finally {
      pending = false;
      button.disabled = false;
      if (editorReady) status.hidden = true;
    }
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(form);
    if (data.get('username') === 'MIL' && data.get('password') === 'MIL') void enter();
    else { error.hidden = false; status.hidden = true; }
  });
  document.querySelector('[data-logout]')?.addEventListener('click', () => {
    sessionStorage.removeItem(sessionKey);
    dashboard.hidden = true;
    login.hidden = false;
    form.querySelector<HTMLInputElement>('input')?.focus();
  });
  if (sessionStorage.getItem(sessionKey) === 'active') void enter();
  else {
    form.addEventListener('focusin', () => void warm().catch(() => {}), { once: true });
    if ('requestIdleCallback' in window) window.requestIdleCallback(() => void warm().catch(() => {}), { timeout: 2000 });
    else setTimeout(() => void warm().catch(() => {}), 600);
  }
}

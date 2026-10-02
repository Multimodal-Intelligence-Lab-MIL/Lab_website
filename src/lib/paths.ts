const base = import.meta.env.BASE_URL.endsWith('/')
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

export function sitePath(path = '') {
  const cleanPath = path.replace(/^\/+/, '');
  return `${base}${cleanPath}`.replace(/\/+/g, '/');
}

export function externalUrl(value?: string) {
  if (!value) return undefined;
  return /^https?:\/\//i.test(value) || value.startsWith('mailto:')
    ? value
    : sitePath(value);
}

import { defineConfig } from 'astro/config';

const [owner = '', repository = ''] = (process.env.GITHUB_REPOSITORY ?? '').split('/');
const isProjectSite = Boolean(owner && repository && repository !== `${owner}.github.io`);

export default defineConfig({
  site: process.env.SITE_URL || (owner ? `https://${owner}.github.io` : 'http://localhost:4321'),
  base: process.env.BASE_PATH || (isProjectSite ? `/${repository}` : '/'),
  output: 'static',
  trailingSlash: 'always',
  build: {
    format: 'directory'
  }
});

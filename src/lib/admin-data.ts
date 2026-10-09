import { getCollection } from 'astro:content';
import { sitePath } from './paths';
import { getImage } from 'astro:assets';
import { localImage } from './media';

export async function getAdminData() {
  const repositoryUrl = 'https://github.com/Multimodal-Intelligence-Lab-MIL/Lab_website';
  const repositorySlug = 'Multimodal-Intelligence-Lab-MIL/Lab_website';
  const branch = 'main';
  const contentFile = (id: string) => id.endsWith('.md') ? id : `${id}.md`;
  const editUrl = (folder: string, id: string) => `${repositoryUrl}/edit/${branch}/${folder}/${contentFile(id)}`;
  const serialiseData = (data: Record<string, unknown>) => Object.fromEntries(
    Object.entries(data).map(([key, value]) => [
      key,
      value instanceof Date ? value.toISOString().slice(0, 10) : value
    ])
  );
  const markdownExcerpt = (value: string) => value
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_`>#]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 96);

  const newsEntries = (await getCollection('news'))
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
    .map((item) => ({
      id: item.id,
      title: markdownExcerpt(item.body || '') || `News · ${item.data.date.toLocaleDateString('en-GB')}`,
      meta: `${item.data.date.toLocaleDateString('en-GB')} · ${item.data.category}`,
      path: `src/content/news/${contentFile(item.id)}`,
      url: editUrl('src/content/news', item.id),
      data: serialiseData(item.data),
      body: item.body || ''
    }));

  const publicationEntries = (await getCollection('publications'))
    .sort((a, b) => b.data.year - a.data.year || a.data.title.localeCompare(b.data.title))
    .map((item) => ({
      id: item.id,
      title: item.data.title,
      meta: `${item.data.year} · ${item.data.category}`,
      path: `src/content/publications/${contentFile(item.id)}`,
      url: editUrl('src/content/publications', item.id),
      data: serialiseData(item.data),
      body: item.body || ''
    }));

  const peopleEntries = (await getCollection('people'))
    .sort((a, b) => a.data.order - b.data.order || a.data.name.localeCompare(b.data.name))
    .map((item) => ({
      id: item.id,
      title: item.data.name,
      meta: item.data.category,
      path: `src/content/people/${contentFile(item.id)}`,
      url: editUrl('src/content/people', item.id),
      data: serialiseData(item.data),
      body: item.body || ''
    }));

  const researchEntries = (await getCollection('research'))
    .sort((a, b) => a.data.order - b.data.order)
    .map((item) => ({
      id: item.id,
      title: item.data.title,
      meta: item.data.shortTitle,
      path: `src/content/research/${contentFile(item.id)}`,
      url: editUrl('src/content/research', item.id),
      data: serialiseData(item.data),
      body: item.body || ''
    }));

  const currentPublicationImages = publicationEntries
    .map((entry) => String(entry.data.image || ''))
    .filter(Boolean);
  const currentPeopleImages = peopleEntries
    .map((entry) => String(entry.data.image || ''))
    .filter(Boolean);
  const initialMedia = {
    publications: [...new Set(currentPublicationImages)].sort(),
    people: [...new Set(currentPeopleImages)].sort()
  };
  const mediaPreviews = Object.fromEntries(await Promise.all(
    [...new Set([...initialMedia.publications, ...initialMedia.people])].map(async path => {
      const source = await localImage(path);
      const preview = source ? await getImage({ src: source, width: Math.min(160, source.width), format: 'webp', quality: 76 }) : null;
      return [path, preview?.src || `${sitePath('')}${path}`];
    })
  ));

  return {
    repositoryUrl,
    repositorySlug,
    branch,
    content: {
      news: newsEntries,
      publications: publicationEntries,
      people: peopleEntries,
      research: researchEntries
    },
    initialMedia,
    mediaPreviews,
    siteBase: sitePath('')
  };

}

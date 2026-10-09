import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import { sitePath } from './paths';

/** Research areas in display order, each with its published papers (newest first). */
export async function getResearchAreas() {
  const areas = (await getCollection('research'))
    .filter((entry) => !entry.data.draft)
    .sort((a, b) => a.data.order - b.data.order);
  const papers = (await getCollection('publications'))
    .filter((entry) => !entry.data.draft)
    .sort((a, b) => b.data.year - a.data.year || a.data.title.localeCompare(b.data.title));
  return areas.map((area) => ({ area, papers: papers.filter((paper) => paper.data.research.id === area.id) }));
}

/** The research area a publication is tagged with. */
export async function getPublicationArea(publication: CollectionEntry<'publications'>) {
  return getEntry(publication.data.research);
}

export const researchAreaPath = (id: string) => sitePath(`research/#${id}`);

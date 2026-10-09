/** Research area colours. Used only for small marks (tag dots, card markers), never for
    backgrounds, so they stay legible on the pale blue-white scene. A preset list rather
    than free choice keeps every area distinct and in keeping with the palette; the
    admin shows these as swatches. */
export const accents = {
  ocean: { label: 'Ocean', color: '#2f6fb3' },
  sky: { label: 'Sky', color: '#3a9fd2' },
  aqua: { label: 'Aqua', color: '#22a6bd' },
  teal: { label: 'Teal', color: '#1c968c' },
  mint: { label: 'Mint', color: '#2fae86' },
  slate: { label: 'Slate', color: '#5a7894' },
  amber: { label: 'Amber', color: '#c48a22' },
  coral: { label: 'Coral', color: '#cf6f56' }
} as const;

export type Accent = keyof typeof accents;
export const accentNames = Object.keys(accents) as [Accent, ...Accent[]];
export const accentColor = (name: string) => accents[name as Accent]?.color ?? accents.sky.color;

/** Research area colours. Used only for small marks (tag dots, card markers), never for
    backgrounds, so they stay legible on the pale blue-white scene. A preset list rather
    than free choice keeps every area distinct and in keeping with the palette; the
    admin shows these as swatches. Every pair differs by at least 24 (CIEDE2000), so even
    6 px dots stay distinguishable; eight blue-green shades were tried and several pairs
    read as one colour. Areas beyond six share colours (the admin shows which are used). */
export const accents = {
  ocean: { label: 'Ocean', color: '#2c5fb4' },
  sky: { label: 'Sky', color: '#45b0e6' },
  teal: { label: 'Teal', color: '#0f9488' },
  green: { label: 'Green', color: '#55ad3c' },
  amber: { label: 'Amber', color: '#d4991a' },
  coral: { label: 'Coral', color: '#df644a' }
} as const;

export type Accent = keyof typeof accents;
export const accentNames = Object.keys(accents) as [Accent, ...Accent[]];
export const accentColor = (name: string) => accents[name as Accent]?.color ?? accents.sky.color;

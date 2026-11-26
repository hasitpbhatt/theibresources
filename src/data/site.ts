export const SITE = {
  name: 'Fieldnotes Science',
  shortName: 'Fieldnotes',
  url: 'https://fieldnotesscience.pages.dev',
  tagline: 'Field-ready notes for environmental systems, ecology and biology.',
  description:
    'Original study notes, diagrams and classroom tools for environmental systems, ecology and biology — written from scratch, free to read, no account needed.',
} as const;

/**
 * Tier A vocabulary rule (see plan.md): the awarding body's name and marks must
 * never appear in a title, slug, filename, meta description or brand string.
 * Body copy may reference the programme referentially, which is why this
 * constant is only used for the legal notice.
 */
export const DISCLAIMER =
  'This work has been developed independently from and is not endorsed by the International Baccalaureate Organization. International Baccalaureate, Baccalauréat International, Bachillerato Internacional and IB are registered trademarks owned by the International Baccalaureate Organization.';

export const NAV = [
  { href: '/ess', label: 'Environmental systems' },
  { href: '/biology', label: 'Biology' },
  { href: '/assessment', label: 'Assessment hub' },
  { href: '/tools', label: 'Teacher tools' },
] as const;

export const SUBJECTS = {
  ess: {
    label: 'Environmental systems',
    code: 'ESS',
    href: '/ess',
    blurb:
      'Systems thinking, ecology, biodiversity, water, soil, atmosphere and the human dimensions of environmental decisions.',
  },
  biology: {
    label: 'Biology',
    code: 'BIO',
    href: '/biology',
    blurb:
      'Molecules, cells, organisms, ecosystems — from the chemistry of life to the dynamics of whole populations.',
  },
} as const;

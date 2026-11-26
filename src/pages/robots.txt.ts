import type { APIRoute } from 'astro';

// Derived from `site` in astro.config.mjs so the sitemap pointer can never drift
// from the canonical URLs.
export const GET: APIRoute = ({ site }) => {
  const body = `User-agent: *
Allow: /

Sitemap: ${new URL('/sitemap-index.xml', site).href}
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};

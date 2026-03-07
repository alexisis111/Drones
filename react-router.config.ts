import type { Config } from "@react-router/dev/config";

export default {
  // Config options...
  // Server-side render by default, to enable SPA mode set this to `false`
  ssr: true,
  future: {
    v3_singleFetch: true
  },
  // Prerender key pages for faster initial load
  prerender: [
    '/',
    '/drone-defense',
    '/services',
    '/contacts',
    '/company',
    '/portfolio'
  ]
} satisfies Config;

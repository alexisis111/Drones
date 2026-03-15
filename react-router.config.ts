import type { Config } from "@react-router/dev/config";

// Генерируем URL для пререндера всех страниц услуг
const serviceUrls = [
  "/service/razborka-zdaniy-i-sooruzheniy",
  "/service/sborka-lesov",
  "/service/podgotovka-stroitelnogo-uchastka",
  "/service/blagoustroystvo-territoriy",
  "/service/izgotovlenie-metallokonstruktsiy",
  "/service/montazh-tekhnologicheskikh-truboprovodov",
  "/service/montazh-tekhnologicheskikh-ploshchadok",
  "/service/antikorroziynaya-zashchita",
  "/service/ustroystvo-kamennykh-konstruktsiy",
  "/service/ustroystvo-fundamentov",
  "/service/montazh-sbornogo-zhelezobetona",
  "/service/teploizolyatsiya-oborudovaniya",
  "/service/teploizolyatsiya-truboprovodov",
  "/service/zemlyanye-raboty",
  "/service/stroitelstvo-angarov",
  "/service/gruzoperevozki",
  "/service/ognezashchita-konstruktsiy"
];

export default {
  // Server-side render by default, to enable SPA mode set this to `false`
  ssr: true,
  future: {
    v3_singleFetch: true
  },
  // Prerender ALL pages including all service pages for better SEO
  prerender: [
    '/',
    '/drone-defense',
    '/services',
    '/contacts',
    '/company',
    '/portfolio',
    '/vacancies',
    '/privacy',
    '/terms',
    // All service pages for SEO
    ...serviceUrls
  ]
} satisfies Config;

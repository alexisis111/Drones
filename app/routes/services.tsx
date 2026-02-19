import type { Route } from "./+types/services";
import ServicesCatalog from "../components/ServicesCatalog";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Услуги | ООО ЛЕГИОН — Антидроновая защита и строительство." },
    { name: "description", content: "Услуги строительной компании ООО «ЛЕГИОН»: антидроновая защита, монтаж металлоконструкций, строительство под ключ. Полный комплекс строительных работ в Санкт-Петербурге и Ленинградской области." },
    { name: "keywords", content: "услуги строительная компания, антидроновая защита услуги, монтаж металлоконструкций, строительство под ключ, строительные работы СПб, промышленное строительство, ООО ЛЕГИОН услуги" },
    { name: "author", content: "Строительная компания ЛЕГИОН" },
    { name: "email", content: "l-legion@bk.ru" },
    { name: "copyright", content: "ООО «ЛЕГИОН», 2012-2026" },
    { rel: "canonical", href: "https://xn--78-glchqprh.xn--p1ai/services" },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://xn--78-glchqprh.xn--p1ai/services" },
    { property: "og:title", content: "Услуги | ООО ЛЕГИОН — Антидроновая защита и строительство." },
    { property: "og:description", content: "Услуги строительной компании ООО «ЛЕГИОН»: антидроновая защита, монтаж металлоконструкций, строительство под ключ." },
    { property: "og:image", content: "/Logo-1.png" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Услуги | ООО ЛЕГИОН — Антидроновая защита и строительство." },
    { name: "twitter:description", content: "Услуги строительной компании ООО «ЛЕГИОН»: антидроновая защита, монтаж металлоконструкций, строительство под ключ." },
    { name: "twitter:image", content: "/Logo-1.png" },
  ];
}

export default function ServicesPage() {
  return <ServicesCatalog />;
}
import type { Route } from "./+types/service-detail";
import ServiceDetailPage from "../components/ServiceDetailPage";

export function meta({ matches }: Route.MetaArgs) {
  const serviceMatch = matches.find(m => m.id === 'routes/service-detail');
  const serviceTitle = serviceMatch?.data?.title || 'Услуга';

  return [
    { title: `${serviceTitle} - ООО «ЛЕГИОН» - Строительные и монтажные работы в Санкт-Петербурге и Ленинградской области` },
    { name: "description", content: `Информация об услуге ${serviceTitle} от строительной компании ООО «ЛЕГИОН» в Санкт-Петербурге и Ленинградской области. Подробное описание, стоимость и этапы выполнения. Гарантия качества и соблюдение сроков.` },
    { name: "keywords", content: "строительные услуги, монтажные работы, услуга, описание услуги, стоимость работ, строительство СПб, монтажные работы Ленинградская область, услуги строительной компании, спецификация работ" },
    { name: "author", content: "ООО «ЛЕГИОН»" },
    { name: "email", content: "l-legion@bk.ru" },
    { rel: "canonical", href: `https://xn--78-glchqprh.xn--p1ai/service/:id` }, // https://легион.рф/service/:id
    { property: "og:type", content: "website" },
    { property: "og:url", content: `https://xn--78-glchqprh.xn--p1ai/service/:id` }, // https://легион.рф/service/:id
    { property: "og:title", content: `${serviceTitle} - ООО «ЛЕГИОН» - Строительные и монтажные работы в Санкт-Петербурге и Ленинградской области` },
    { property: "og:description", content: `Информация об услуге ${serviceTitle} от строительной компании ООО «ЛЕГИОН» в Санкт-Петербурге и Ленинградской области. Подробное описание, стоимость и этапы выполнения.` },
    { property: "og:image", content: "/Logo-1.png" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: `${serviceTitle} - ООО «ЛЕГИОН» - Строительные и монтажные работы в Санкт-Петербурге и Ленинградской области` },
    { name: "twitter:description", content: `Информация об услуге ${serviceTitle} от строительной компании ООО «ЛЕГИОН» в Санкт-Петербурге и Ленинградской области. Подробное описание, стоимость и этапы выполнения.` },
    { name: "twitter:image", content: "/Logo-1.png" },
  ];
}

export default function ServiceDetailRoute() {
  return <ServiceDetailPage />;
}
import type { Route } from "./+types/service-detail";
import ServiceDetailPage from "../components/ServiceDetailPage";
import { services } from "../data/services";

export function loader({ params }: Route.LoaderArgs) {
  const slug = params.slug || '';
  const service = services.find(s => s.slug === slug);
  return {
    title: service?.title || 'Услуга',
    slug: params.slug,
    service: service || null
  };
}

export function meta({ data }: Route.MetaArgs) {
  const serviceTitle = data?.title || 'Услуга';
  const service = data?.service;

  return [
    { title: `${serviceTitle} | Строительная компания ЛЕГИОН — Антидроновая защита и строительство.` },
    { name: "description", content: `${serviceTitle} от строительной компании ООО «ЛЕГИОН». Профессиональное выполнение строительных и монтажных работ. Консультация специалиста.` },
    { name: "keywords", content: `${serviceTitle}, строительная компания СПб, ООО ЛЕГИОН, строительные услуги, монтажные работы, строительство под ключ, Ленинградская область` },
    { name: "author", content: "Строительная компания ЛЕГИОН" },
    { name: "email", content: "l-legion@bk.ru" },
    { rel: "canonical", href: `https://xn--78-glchqprh.xn--p1ai/service/${data?.slug}` },
    { property: "og:type", content: "website" },
    { property: "og:url", content: `https://xn--78-glchqprh.xn--p1ai/service/${data?.slug}` },
    { property: "og:title", content: `${serviceTitle} | Строительная компания ЛЕГИОН` },
    { property: "og:description", content: `${serviceTitle} от строительной компании ООО «ЛЕГИОН». Профессиональное выполнение строительных и монтажных работ в СПб.` },
    { property: "og:image", content: service?.imageUrl || "/Logo-1.png" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: `${serviceTitle} | Строительная компания ЛЕГИОН` },
    { name: "twitter:description", content: `${serviceTitle} от строительной компании ООО «ЛЕГИОН». Профессиональное выполнение строительных и монтажных работ.` },
    { name: "twitter:image", content: service?.imageUrl || "/Logo-1.png" },
  ];
}

export default function ServiceDetailRoute() {
  return <ServiceDetailPage />;
}

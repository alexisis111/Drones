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
    { title: `${serviceTitle} | Работа по РФ | Цена, сроки | ЛЕГИОН` },
    { name: "description", content: `${serviceTitle} от ООО «ЛЕГИОН». Офис в г. Светогорск (Ленинградская область), работаем по всей России. Профессиональный монтаж и строительство. Расчет сметы, гарантия качества. Закажите бесплатную консультацию!` },
    { name: "keywords", content: `${serviceTitle}, строительная компания, ООО ЛЕГИОН, строительные услуги, монтажные работы, строительство под ключ, Ленинградская область, работа по России, цена, расчет сметы, гарантия` },
    { name: "author", content: "Строительная компания ЛЕГИОН" },
    { name: "email", content: "l-legion@bk.ru" },
    { rel: "canonical", href: `https://xn--78-glchqprh.xn--p1ai/service/${data?.slug}` },
    { property: "og:type", content: "website" },
    { property: "og:url", content: `https://xn--78-glchqprh.xn--p1ai/service/${data?.slug}` },
    { property: "og:title", content: `${serviceTitle} | Работа по РФ | Цена, сроки | ЛЕГИОН` },
    { property: "og:description", content: `${serviceTitle} от ООО «ЛЕГИОН». Офис в г. Светогорск (ЛО), работаем по всей России. Расчет сметы, гарантия качества!` },
    { property: "og:image", content: service?.imageUrl || "/Logo-1.png" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: `${serviceTitle} | Работа по РФ | Цена, сроки | ЛЕГИОН` },
    { name: "twitter:description", content: `${serviceTitle} от ООО «ЛЕГИОН». Офис в г. Светогорск (Ленинградская область), работа по России. Расчет сметы, гарантия!` },
    { name: "twitter:image", content: service?.imageUrl || "/Logo-1.png" },
  ];
}

export default function ServiceDetailRoute() {
  return <ServiceDetailPage />;
}

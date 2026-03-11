import type { Route } from "./+types/service-detail";
import ServiceDetailPage from "../components/ServiceDetailPage";
import { services } from "../data/services";
import type { BreadcrumbItem } from "../components/BreadcrumbSchema";

export function loader({ params }: Route.LoaderArgs) {
  const slug = params.slug || '';
  const service = services.find(s => s.slug === slug);
  
  // Создаем breadcrumb для текущей услуги
  const breadcrumbs: BreadcrumbItem[] = [
    { position: 1, name: "Главная", item: "https://xn--78-glchqprh.xn--p1ai/" },
    { position: 2, name: "Услуги", item: "https://xn--78-glchqprh.xn--p1ai/services" },
    { position: 3, name: service?.title || 'Услуга', item: `https://xn--78-glchqprh.xn--p1ai/service/${slug}` }
  ];
  
  return {
    title: service?.title || 'Услуга',
    slug: params.slug,
    service: service || null,
    breadcrumbs
  };
}

export function meta({ data }: Route.MetaArgs) {
  const serviceTitle = data?.title || 'Услуга';
  const service = data?.service;

  // Используем уникальные SEO-теги из услуги, если они есть
  const title = service?.seoTitle || `${serviceTitle} | Работа по РФ | Цена, сроки | ЛЕГИОН`;
  const description = service?.seoDescription || `${serviceTitle} от ООО «ЛЕГИОН». Офис в г. Светогорск (Ленинградская область), работаем по всей России. Профессиональный монтаж и строительство. Расчет сметы, гарантия качества. Закажите бесплатную консультацию!`;

  return [
    { title },
    { name: "description", content: description },
    { name: "keywords", content: `${serviceTitle}, строительная компания, ООО ЛЕГИОН, строительные услуги, монтажные работы, строительство под ключ, Ленинградская область, работа по России, цена, расчет сметы, гарантия` },
    { name: "author", content: "Строительная компания ЛЕГИОН" },
    { name: "email", content: "l-legion@bk.ru" },
    { rel: "canonical", href: `https://xn--78-glchqprh.xn--p1ai/service/${data?.slug}` },
    { property: "og:type", content: "website" },
    { property: "og:url", content: `https://xn--78-glchqprh.xn--p1ai/service/${data?.slug}` },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: service?.imageUrl || "/Logo-1.png" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: service?.imageUrl || "/Logo-1.png" },
  ];
}

export default function ServiceDetailRoute({ loaderData }: { loaderData: any }) {
  return <ServiceDetailPage breadcrumbs={loaderData.breadcrumbs} service={loaderData.service} />;
}

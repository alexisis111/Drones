import type { Route } from "./+types/service-detail";
import ServiceDetailPage from "../components/ServiceDetailPage";

export function meta({ matches }: Route.MetaArgs) {
  const serviceMatch = matches.find(m => m.id === 'routes/service-detail');
  const serviceTitle = serviceMatch?.data?.title || 'Услуга';
  const serviceId = serviceMatch?.params?.id || ':id';

  return [
    { title: `${serviceTitle} - Строительная компания ЛЕГИОН` },
    { name: "description", content: `Информация об услуге ${serviceTitle} от строительной компании ООО «ЛЕГИОН»` },
    { name: "keywords", content: "антидроновая защита, защита от БПЛА, строительная компания, строительство СПб, монтажные работы, строительство Ленинградская область, строительно-монтажные работы, строительство под ключ, промышленное строительство, гражданское строительство" },
    { name: "author", content: "Строительная компания ЛЕГИОН" },
    { name: "email", content: "l-legion@bk.ru" },
    { rel: "canonical", href: `https://xn--78-glchqprh.xn--p1ai/service/${serviceId}` }, // https://легион.рф/service/:id
    { property: "og:type", content: "website" },
    { property: "og:url", content: `https://xn--78-glchqprh.xn--p1ai/service/${serviceId}` }, // https://легион.рф/service/:id
    { property: "og:title", content: `${serviceTitle} - ООО «ЛЕГИОН» - Строительные и монтажные работы` },
    { property: "og:description", content: `Информация об услуге ${serviceTitle} от строительной компании ООО «ЛЕГИОН»` },
    { property: "og:image", content: "/Logo-1.png" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: `${serviceTitle} - ООО «ЛЕГИОН» - Мы предлагаем современные и надёжные решения для обеспечения безопасности и выполнения строительных задач на объектах любого типа. Наши услуги охватывают: - Антидроновую защиту — системы, предотвращающие проникновение беспилотных летательных аппаратов (БПЛА) на стратегически важные объекты. - Строительство и монтаж металлоконструкций — от проектирования до реализации, с учётом всех норм и требований. - Комплексные строительные услуги — под ключ, с гарантией качества и соблюдением сроков. Работаем по всей России. Индивидуальный подход, современные технологии, надёжность и безопасность` },
    { name: "twitter:description", content: `Информация об услуге ${serviceTitle} от строительной компании ООО «ЛЕГИОН»` },
    { name: "twitter:image", content: "/Logo-1.png" },
  ];
}

export default function ServiceDetailRoute() {
  return <ServiceDetailPage />;
}
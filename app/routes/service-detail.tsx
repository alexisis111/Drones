import type { Route } from "./+types/service-detail";
import ServiceDetailPage from "../components/ServiceDetailPage";

// Список услуг для SEO (дублируем из компонента для meta-тегов)
const SERVICES_DATA = [
  { id: 1, title: "Разборка зданий и сооружений" },
  { id: 2, title: "Сборка лесов" },
  { id: 3, title: "Подготовка строительного участка" },
  { id: 4, title: "Благоустройство территорий" },
  { id: 5, title: "Изготовление металлоконструкций" },
  { id: 6, title: "Монтаж технологических трубопроводов" },
  { id: 7, title: "Монтаж технологических площадок" },
  { id: 8, title: "Антикоррозийная защита" },
  { id: 9, title: "Устройство каменных конструкций" },
  { id: 10, title: "Устройство фундаментов" },
  { id: 11, title: "Монтаж сборного железобетона" },
  { id: 12, title: "Теплоизоляция оборудования" },
  { id: 13, title: "Теплоизоляция трубопроводов" },
  { id: 14, title: "Земляные работы" },
  { id: 15, title: "Строительство ангаров" },
  { id: 16, title: "Грузоперевозки" },
  { id: 17, title: "Огнезащита конструкций" },
];

export function loader({ params }: Route.LoaderArgs) {
  const serviceId = parseInt(params.id || '0');
  const service = SERVICES_DATA.find(s => s.id === serviceId);
  return {
    title: service?.title || 'Услуга',
    id: params.id
  };
}

export function meta({ data, params }: Route.MetaArgs) {
  const serviceTitle = data?.title || 'Услуга';
  const serviceId = params?.id || data?.id || ':id';

  return [
    { title: `${serviceTitle} | ООО ЛЕГИОН — Строительная компания.` },
    { name: "description", content: `${serviceTitle} от строительной компании ООО «ЛЕГИОН». Профессиональное выполнение строительных и монтажных работ. Консультация специалиста.` },
    { name: "keywords", content: `${serviceTitle}, строительная компания СПб, ООО ЛЕГИОН, строительные услуги, монтажные работы, строительство под ключ, Ленинградская область` },
    { name: "author", content: "Строительная компания ЛЕГИОН" },
    { name: "email", content: "l-legion@bk.ru" },
    { rel: "canonical", href: `https://xn--78-glchqprh.xn--p1ai/service/${serviceId}` },
    { property: "og:type", content: "website" },
    { property: "og:url", content: `https://xn--78-glchqprh.xn--p1ai/service/${serviceId}` },
    { property: "og:title", content: `${serviceTitle} | ООО ЛЕГИОН — Строительная компания.` },
    { property: "og:description", content: `${serviceTitle} от строительной компании ООО «ЛЕГИОН». Профессиональное выполнение строительных и монтажных работ в СПб.` },
    { property: "og:image", content: "/Logo-1.png" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: `${serviceTitle} | ООО ЛЕГИОН — Строительная компания.` },
    { name: "twitter:description", content: `${serviceTitle} от строительной компании ООО «ЛЕГИОН». Профессиональное выполнение строительных и монтажных работ.` },
    { name: "twitter:image", content: "/Logo-1.png" },
  ];
}

export default function ServiceDetailRoute() {
  return <ServiceDetailPage />;
}

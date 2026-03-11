import type { Route } from "./+types/services";
import ServicesCatalog from "../components/ServicesCatalog";
import type { BreadcrumbItem } from "../components/BreadcrumbSchema";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Услуги строительной компании | Широкий спектр строительно-монтажных работ в СПб и ЛО | Работа по РФ | ЛЕГИОН" },
    { name: "description", content: "Все услуги ООО «ЛЕГИОН» в Санкт-Петербурге и Ленинградской области: монтаж металлоконструкций, строительство зданий под ключ, теплоизоляция, подготовительные работы. Работаем по всей России. Бесплатный замер и расчет сметы! ☎ +7 931 247-08-88" },
    { name: "keywords", content: "услуги строительная компания, монтаж металлоконструкций, строительство под ключ, Ленинградская область, СПб, промышленное строительство, ООО ЛЕГИОН услуги, работа по России, бесплатный замер" },
    { name: "author", content: "Строительная компания ЛЕГИОН" },
    { name: "email", content: "l-legion@bk.ru" },
    { name: "copyright", content: "Строительная компания ЛЕГИОН, 2012-2026" },
    { rel: "canonical", href: "https://xn--78-glchqprh.xn--p1ai/services" },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://xn--78-glchqprh.xn--p1ai/services" },
    { property: "og:title", content: "Услуги строительной компании | Широкий спектр строительно-монтажных работ в СПб и ЛО | Работа по РФ | ЛЕГИОН" },
    { property: "og:description", content: "Все услуги ООО «ЛЕГИОН» в СПб и ЛО: монтаж металлоконструкций, строительство зданий, теплоизоляция. Работаем по всей России!" },
    { property: "og:image", content: "/Logo-1.png" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Услуги строительной компании | Монтаж металлоконструкций в СПб и ЛО | Работа по РФ | ЛЕГИОН" },
    { name: "twitter:description", content: "Все услуги ООО «ЛЕГИОН» в СПб и ЛО: монтаж металлоконструкций, строительство под ключ, теплоизоляция. Работа по России!" },
    { name: "twitter:image", content: "/Logo-1.png" },
  ];
}

const breadcrumbs: BreadcrumbItem[] = [
  { position: 1, name: "Главная", item: "https://xn--78-glchqprh.xn--p1ai/" },
  { position: 2, name: "Услуги", item: "https://xn--78-glchqprh.xn--p1ai/services" }
];

export default function ServicesPage() {
  return <ServicesCatalog breadcrumbs={breadcrumbs} />;
}
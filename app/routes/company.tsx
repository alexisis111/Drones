import type { Route } from "./+types/company";
import CompanyShowcase from "../components/CompanyShowcase";
import type { BreadcrumbItem } from "../components/BreadcrumbSchema";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "О компании ЛЕГИОН | Строительство по РФ" },
    { name: "description", content: "ООО «ЛЕГИОН» — надежная строительная компания с 2012 года. Офис в г. Светогорск (Ленинградская область), ул. Максима Горького, 7. Работаем по всей России. Специализация: монтаж металлоконструкций, промышленное строительство, теплоизоляция. Гарантия качества! ☎ +7 931 247-08-88" },
    { name: "keywords", content: "о компании, строительная компания Светогорск, ООО ЛЕГИОН, строительная фирма с 2012 года, монтаж металлоконструкций, промышленное строительство, Ленинградская область, СПб, работа по России, надежный застройщик" },
    { name: "author", content: "Строительная компания ЛЕГИОН" },
    { name: "email", content: "l-legion@bk.ru" },
    { name: "copyright", content: "Строительная компания ЛЕГИОН, 2012-2026" },
    { rel: "canonical", href: "https://xn--78-glchqprh.xn--p1ai/company" },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://xn--78-glchqprh.xn--p1ai/company" },
    { property: "og:title", content: "О компании ЛЕГИОН | Строительство по РФ" },
    { property: "og:description", content: "ООО «ЛЕГИОН» — надежная строительная компания с 2012 года в г. Светогорск. Работаем по всей России!" },
    { property: "og:image", content: "/Logo-1.png" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "О компании ЛЕГИОН | Строительство по РФ" },
    { name: "twitter:description", content: "ООО «ЛЕГИОН» — надежная строительная компания с 2012 года в г. Светогорск (ЛО). Работаем по всей России!" },
    { name: "twitter:image", content: "/Logo-1.png" },
  ];
}

const breadcrumbs: BreadcrumbItem[] = [
  { position: 1, name: "Главная", item: "https://xn--78-glchqprh.xn--p1ai/" },
  { position: 2, name: "О компании", item: "https://xn--78-glchqprh.xn--p1ai/company" }
];

export default function Company() {
  return <CompanyShowcase breadcrumbs={breadcrumbs} />;
}
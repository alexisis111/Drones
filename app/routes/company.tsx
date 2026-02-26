import type { Route } from "./+types/company";
import CompanyShowcase from "../components/CompanyShowcase";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "О компании ЛЕГИОН | Строительная фирма из Светогорска | Работа по РФ" },
    { name: "description", content: "ООО «ЛЕГИОН» — надежная строительная компания с 2012 года. Офис в г. Светогорск (Ленинградская область), работаем по всей России. Специализация: защита от БПЛА, монтаж металлоконструкций, промышленное строительство. Гарантия качества!" },
    { name: "keywords", content: "о компании, строительная компания Светогорск, ООО ЛЕГИОН, строительная фирма с 2012 года, защита от БПЛА, монтаж металлоконструкций, промышленное строительство, Ленинградская область, работа по России, надежный застройщик" },
    { name: "author", content: "Строительная компания ЛЕГИОН" },
    { name: "email", content: "l-legion@bk.ru" },
    { name: "copyright", content: "Строительная компания ЛЕГИОН, 2012-2026" },
    { rel: "canonical", href: "https://xn--78-glchqprh.xn--p1ai/company" },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://xn--78-glchqprh.xn--p1ai/company" },
    { property: "og:title", content: "О компании ЛЕГИОН | Строительная фирма из Светогорска | Работа по РФ" },
    { property: "og:description", content: "ООО «ЛЕГИОН» — надежная строительная компания с 2012 года. Офис в г. Светогорск (ЛО), работаем по всей России!" },
    { property: "og:image", content: "/Logo-1.png" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "О компании ЛЕГИОН | Строительная фирма из Светогорска | Работа по РФ" },
    { name: "twitter:description", content: "ООО «ЛЕГИОН» — надежная строительная компания с 2012 года. Офис в г. Светогорск (Ленинградская область), работаем по всей России!" },
    { name: "twitter:image", content: "/Logo-1.png" },
  ];
}

export default function Company() {
  return <CompanyShowcase />;
}
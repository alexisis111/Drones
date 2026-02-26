import type { Route } from "./+types/contacts";
import ContactsPage from "../components/ContactsPage";
import type { BreadcrumbItem } from "../components/BreadcrumbSchema";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Контакты ЛЕГИОН | Офис в Светогорске | Защита от БПЛА по России" },
    { name: "description", content: "Свяжитесь с ООО «ЛЕГИОН»: телефон, email, адрес офиса в г. Светогорск (Ленинградская область). Работаем по всей Ленинградской области и России. Бесплатная консультация по защите от БПЛА и расчет стоимости проекта!" },
    { name: "keywords", content: "контакты строительная компания, ООО ЛЕГИОН контакты, телефон строительная компания, адрес строительная компания Светогорск, Ленинградская область, консультация защита от БПЛА, бесплатный расчет стоимости, работа по России" },
    { name: "author", content: "Строительная компания ЛЕГИОН" },
    { name: "email", content: "l-legion@bk.ru" },
    { name: "copyright", content: "ООО «ЛЕГИОН», 2012-2026" },
    { rel: "canonical", href: "https://xn--78-glchqprh.xn--p1ai/contacts" },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://xn--78-glchqprh.xn--p1ai/contacts" },
    { property: "og:title", content: "Контакты ЛЕГИОН | Офис в Светогорске | Защита от БПЛА по России" },
    { property: "og:description", content: "Свяжитесь с ООО «ЛЕГИОН»: телефон, email, офис в г. Светогорск (Ленинградская область). Работаем по Ленинградской области и всей России!" },
    { property: "og:image", content: "/Logo-1.png" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Контакты ЛЕГИОН | Офис в Светогорске | Защита от БПЛА по России" },
    { name: "twitter:description", content: "Свяжитесь с ООО «ЛЕГИОН». Офис в г. Светогорск, работаем по Ленинградской области и всей России. Бесплатная консультация по защите от БПЛА!" },
    { name: "twitter:image", content: "/Logo-1.png" },
  ];
}

const breadcrumbs: BreadcrumbItem[] = [
  { position: 1, name: "Главная", item: "https://xn--78-glchqprh.xn--p1ai/" },
  { position: 2, name: "Контакты", item: "https://xn--78-glchqprh.xn--p1ai/contacts" }
];

export default function ContactsRoute() {
  return <ContactsPage breadcrumbs={breadcrumbs} />;
}
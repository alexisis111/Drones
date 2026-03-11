import type { Route } from "./+types/contacts";
import ContactsPage from "../components/ContactsPage";
import type { BreadcrumbItem } from "../components/BreadcrumbSchema";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Контакты строительной компании ЛЕГИОН | Строительство по РФ" },
    { name: "description", content: "Свяжитесь с нами: телефон +7(931)247-08-88, email: l-legion@bk.ru, адрес офиса в г. Светогорск (Ленинградская область), ул. Максима Горького, 7. Работаем по всей России. Бесплатная консультация и расчет стоимости проекта! ☎ +7 931 247-08-88" },
    { name: "keywords", content: "контакты строительная компания, ООО ЛЕГИОН контакты, телефон строительная компания, адрес Светогорск Максима Горького 7, Ленинградская область, СПб, бесплатный расчет стоимости, работа по России" },
    { name: "author", content: "Строительная компания ЛЕГИОН" },
    { name: "email", content: "l-legion@bk.ru" },
    { name: "copyright", content: "ООО «ЛЕГИОН», 2012-2026" },
    { rel: "canonical", href: "https://xn--78-glchqprh.xn--p1ai/contacts" },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://xn--78-glchqprh.xn--p1ai/contacts" },
    { property: "og:title", content: "Контакты строительной компании ЛЕГИОН | Строительство по РФ" },
    { property: "og:description", content: "Свяжитесь с ООО «ЛЕГИОН»: телефон +7(931)247-08-88, email: l-legion@bk.ru, офис в г. Светогорск (ЛО). Работаем по всей России!" },
    { property: "og:image", content: "/Logo-1.png" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Контакты строительной компании ЛЕГИОН | Строительство по РФ" },
    { name: "twitter:description", content: "Свяжитесь с ООО «ЛЕГИОН». Офис в г. Светогорск, работаем по Ленинградской области и всей России. Бесплатная консультация!" },
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
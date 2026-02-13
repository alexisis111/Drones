import type { Route } from "./+types/contacts";
import ContactsPage from "../components/ContactsPage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Контакты - ООО «ЛЕГИОН» - Строительная компания в Санкт-Петербурге и Ленинградской области" },
    { name: "description", content: "Контактная информация строительной компании ООО «ЛЕГИОН» в Санкт-Петербурге. Телефоны, адрес, email и форма обратной связи. Быстро свяжитесь с нами для обсуждения вашего строительного проекта." },
    { name: "keywords", content: "контакты, строительная компания СПб, ООО ЛЕГИОН контакты, телефон строительной компании, заказать строительные работы СПб, строительство Ленинградская область, контактная информация, строительная компания адрес" },
    { name: "author", content: "ООО «ЛЕГИОН»" },
    { name: "email", content: "l-legion@bk.ru" },
    { rel: "canonical", href: "https://xn--78-glchqprh.xn--p1ai/contacts" }, // https://легион.рф/contacts
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://xn--78-glchqprh.xn--p1ai/contacts" }, // https://легион.рф/contacts
    { property: "og:title", content: "Контакты - ООО «ЛЕГИОН» - Строительная компания в Санкт-Петербурге и Ленинградской области" },
    { property: "og:description", content: "Контактная информация строительной компании ООО «ЛЕГИОН» в Санкт-Петербурге. Телефоны, адрес, email и форма обратной связи." },
    { property: "og:image", content: "/Logo-1.png" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Контакты - ООО «ЛЕГИОН» - Строительная компания в Санкт-Петербурге и Ленинградской области" },
    { name: "twitter:description", content: "Контактная информация строительной компании ООО «ЛЕГИОН» в Санкт-Петербурге. Телефоны, адрес, email и форма обратной связи." },
    { name: "twitter:image", content: "/Logo-1.png" },
  ];
}

export default function ContactsRoute() {
  return <ContactsPage />;
}
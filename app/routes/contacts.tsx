import type { Route } from "./+types/contacts";
import ContactsPage from "../components/ContactsPage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Контакты | Строительная компания ЛЕГИОН" },
    { name: "description", content: "Контакты строительной компании ООО «ЛЕГИОН». Телефон, email, адрес. Свяжитесь с нами для консультации по антидроновой защите и строительству." },
    { name: "keywords", content: "контакты строительная компания, ООО ЛЕГИОН контакты, телефон строительная компания СПб, адрес строительная компания, связь антидроновая защита" },
    { name: "author", content: "Строительная компания ЛЕГИОН" },
    { name: "email", content: "l-legion@bk.ru" },
    { name: "copyright", content: "ООО «ЛЕГИОН», 2012-2026" },
    { rel: "canonical", href: "https://xn--78-glchqprh.xn--p1ai/contacts" },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://xn--78-glchqprh.xn--p1ai/contacts" },
    { property: "og:title", content: "Контакты | Строительная компания ЛЕГИОН" },
    { property: "og:description", content: "Контакты строительной компании ООО «ЛЕГИОН». Телефон, email, адрес для связи." },
    { property: "og:image", content: "/Logo-1.png" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Контакты | Строительная компания ЛЕГИОН" },
    { name: "twitter:description", content: "Контакты строительной компании ООО «ЛЕГИОН». Свяжитесь с нами для консультации." },
    { name: "twitter:image", content: "/Logo-1.png" },
  ];
}

export default function ContactsRoute() {
  return <ContactsPage />;
}
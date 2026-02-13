import type { Route } from "./+types/company";
import CompanyShowcase from "../components/CompanyShowcase";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "О компании - ООО «ЛЕГИОН» - Строительная компания в Санкт-Петербурге и Ленинградской области" },
    { name: "description", content: "Информация о строительной компании ООО «ЛЕГИОН» в Санкт-Петербурге. История, миссия, услуги и клиенты. Профессиональные строительно-монтажные работы с 2012 года." },
    { name: "keywords", content: "о компании, строительная компания СПб, ООО ЛЕГИОН, строительство СПб, монтажные работы, строительство Ленинградская область, застройщик СПб, строительная история, строительные услуги" },
    { name: "author", content: "ООО «ЛЕГИОН»" },
    { name: "email", content: "l-legion@bk.ru" },
    { rel: "canonical", href: "https://xn--78-glchqprh.xn--p1ai/company" }, // https://легион.рф/company
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://xn--78-glchqprh.xn--p1ai/company" }, // https://легион.рф/company
    { property: "og:title", content: "О компании - ООО «ЛЕГИОН» - Строительная компания в Санкт-Петербурге и Ленинградской области" },
    { property: "og:description", content: "Информация о строительной компании ООО «ЛЕГИОН» в Санкт-Петербурге. История, миссия, услуги и клиенты. Профессиональные строительно-монтажные работы с 2012 года." },
    { property: "og:image", content: "/Logo-1.png" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "О компании - ООО «ЛЕГИОН» - Строительная компания в Санкт-Петербурге и Ленинградской области" },
    { name: "twitter:description", content: "Информация о строительной компании ООО «ЛЕГИОН» в Санкт-Петербурге. История, миссия, услуги и клиенты. Профессиональные строительно-монтажные работы с 2012 года." },
    { name: "twitter:image", content: "/Logo-1.png" },
  ];
}

export default function Company() {
  return <CompanyShowcase />;
}
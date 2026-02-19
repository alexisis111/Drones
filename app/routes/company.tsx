import type { Route } from "./+types/company";
import CompanyShowcase from "../components/CompanyShowcase";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "О компании | ООО ЛЕГИОН — Строительная компания." },
    { name: "description", content: "О строительной компании ООО «ЛЕГИОН». Информация о компании, опыт работы, преимущества. Антидроновая защита и строительство промышленных объектов." },
    { name: "keywords", content: "о компании, строительная компания СПб, ООО ЛЕГИОН, информация о компании, строительные работы Ленинградская область, антидроновая защита, промышленное строительство" },
    { name: "author", content: "Строительная компания ЛЕГИОН" },
    { name: "email", content: "l-legion@bk.ru" },
    { name: "copyright", content: "ООО «ЛЕГИОН», 2012-2026" },
    { rel: "canonical", href: "https://xn--78-glchqprh.xn--p1ai/company" },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://xn--78-glchqprh.xn--p1ai/company" },
    { property: "og:title", content: "О компании | ООО ЛЕГИОН — Строительная компания." },
    { property: "og:description", content: "О строительной компании ООО «ЛЕГИОН». Информация о компании, опыт работы, преимущества." },
    { property: "og:image", content: "/Logo-1.png" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "О компании | ООО ЛЕГИОН — Строительная компания." },
    { name: "twitter:description", content: "О строительной компании ООО «ЛЕГИОН». Информация о компании, опыт работы, преимущества." },
    { name: "twitter:image", content: "/Logo-1.png" },
  ];
}

export default function Company() {
  return <CompanyShowcase />;
}
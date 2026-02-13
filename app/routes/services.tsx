import type { Route } from "./+types/services";
import ServicesCatalog from "../components/ServicesCatalog";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Услуги - ООО «ЛЕГИОН» - Строительные и монтажные работы в Санкт-Петербурге и Ленинградской области" },
    { name: "description", content: "Полный спектр строительных и монтажных услуг от ООО «ЛЕГИОН» в Санкт-Петербурге и Ленинградской области. Подготовительные работы, монтаж металлоконструкций, отделочные работы и многое другое. Гарантия качества и соблюдение сроков." },
    { name: "keywords", content: "строительные услуги, монтажные работы, подготовительные работы, монтаж металлоконструкций, отделочные работы, строительство СПб, монтажные работы Ленинградская область, услуги строительной компании, услуги монтажной бригады" },
    { name: "author", content: "ООО «ЛЕГИОН»" },
    { name: "email", content: "l-legion@bk.ru" },
    { rel: "canonical", href: "https://xn--78-glchqprh.xn--p1ai/services" }, // https://легион.рф/services
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://xn--78-glchqprh.xn--p1ai/services" }, // https://легион.рф/services
    { property: "og:title", content: "Услуги - ООО «ЛЕГИОН» - Строительные и монтажные работы в Санкт-Петербурге и Ленинградской области" },
    { property: "og:description", content: "Полный спектр строительных и монтажных услуг от ООО «ЛЕГИОН» в Санкт-Петербурге и Ленинградской области. Подготовительные работы, монтаж металлоконструкций, отделочные работы и многое другое." },
    { property: "og:image", content: "/Logo-1.png" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Услуги - ООО «ЛЕГИОН» - Строительные и монтажные работы в Санкт-Петербурге и Ленинградской области" },
    { name: "twitter:description", content: "Полный спектр строительных и монтажных услуг от ООО «ЛЕГИОН» в Санкт-Петербурге и Ленинградской области. Подготовительные работы, монтаж металлоконструкций, отделочные работы и многое другое." },
    { name: "twitter:image", content: "/Logo-1.png" },
  ];
}

export default function ServicesPage() {
  return <ServicesCatalog />;
}
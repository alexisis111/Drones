import type { Route } from "./+types/portfolio";
import PortfolioGallery from "../components/PortfolioGallery";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Портфолио - ООО «ЛЕГИОН» - Реализованные строительные проекты в Санкт-Петербурге и Ленинградской области" },
    { name: "description", content: "Проекты и реализованные работы строительной компании ООО «ЛЕГИОН» в Санкт-Петербурге и Ленинградской области. Примеры наших строительно-монтажных работ, качество и надежность исполнения." },
    { name: "keywords", content: "портфолио, реализованные проекты, строительные работы, примеры работ, строительство СПб, монтажные работы, выполненные объекты, строительная компания СПб, строительство Ленинградская область" },
    { name: "author", content: "ООО «ЛЕГИОН»" },
    { name: "email", content: "l-legion@bk.ru" },
    { rel: "canonical", href: "https://xn--78-glchqprh.xn--p1ai/portfolio" }, // https://легион.рф/portfolio
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://xn--78-glchqprh.xn--p1ai/portfolio" }, // https://легион.рф/portfolio
    { property: "og:title", content: "Портфолио - ООО «ЛЕГИОН» - Реализованные строительные проекты в Санкт-Петербурге и Ленинградской области" },
    { property: "og:description", content: "Проекты и реализованные работы строительной компании ООО «ЛЕГИОН» в Санкт-Петербурге и Ленинградской области. Примеры наших строительно-монтажных работ." },
    { property: "og:image", content: "/Logo-1.png" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Портфолио - ООО «ЛЕГИОН» - Реализованные строительные проекты в Санкт-Петербурге и Ленинградской области" },
    { name: "twitter:description", content: "Проекты и реализованные работы строительной компании ООО «ЛЕГИОН» в Санкт-Петербурге и Ленинградской области. Примеры наших строительно-монтажных работ." },
    { name: "twitter:image", content: "/Logo-1.png" },
  ];
}

export default function PortfolioPage() {
  return <PortfolioGallery />;
}
import type { Route } from "./+types/portfolio";
import PortfolioGallery from "../components/PortfolioGallery";
import type { BreadcrumbItem } from "../components/BreadcrumbSchema";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Наши проекты | Портфолио строительных работ в СПб и ЛО | Работа по РФ | ЛЕГИОН" },
    { name: "description", content: "Портфолио реализованных проектов ООО «ЛЕГИОН» в Санкт-Петербурге и Ленинградской области: монтаж металлоконструкций, строительство зданий, теплоизоляция. Проекты по всей России. Фото и описания работ! ☎ +7 931 247-08-88" },
    { name: "keywords", content: "портфолио строительная компания, проекты ООО ЛЕГИОН, выполненные проекты, строительство металлоконструкций, Ленинградская область, СПб, промышленное строительство, работа по России, фото работ" },
    { name: "author", content: "Строительная компания ЛЕГИОН" },
    { name: "email", content: "l-legion@bk.ru" },
    { name: "copyright", content: "Строительная компания ЛЕГИОН, 2012-2026" },
    { rel: "canonical", href: "https://xn--78-glchqprh.xn--p1ai/portfolio" },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://xn--78-glchqprh.xn--p1ai/portfolio" },
    { property: "og:title", content: "Наши проекты | Портфолио строительных работ в СПб и ЛО | Работа по РФ | ЛЕГИОН" },
    { property: "og:description", content: "Портфолио реализованных проектов ООО «ЛЕГИОН» в СПб и ЛО: монтаж металлоконструкций, строительство зданий. Проекты по всей России!" },
    { property: "og:image", content: "/Logo-1.png" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Наши проекты | Портфолио строительных работ в СПб и ЛО | Работа по РФ | ЛЕГИОН" },
    { name: "twitter:description", content: "Портфолио реализованных проектов ООО «ЛЕГИОН» в СПб и ЛО. Строительство промышленных объектов. Работа по России!" },
    { name: "twitter:image", content: "/Logo-1.png" },
  ];
}

const breadcrumbs: BreadcrumbItem[] = [
  { position: 1, name: "Главная", item: "https://xn--78-glchqprh.xn--p1ai/" },
  { position: 2, name: "Портфолио", item: "https://xn--78-glchqprh.xn--p1ai/portfolio" }
];

export default function PortfolioPage() {
  return <PortfolioGallery breadcrumbs={breadcrumbs} />;
}
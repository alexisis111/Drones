import type { Route } from "./+types/portfolio";
import PortfolioGallery from "../components/PortfolioGallery";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Наши проекты | Портфолио защиты от БПЛА и строительства | ЛЕГИОН" },
    { name: "description", content: "Портфолио реализованных проектов ООО «ЛЕГИОН»: защита от БПЛА промышленных объектов, монтаж антидрон сетки, строительство металлоконструкций. Офис в г. Светогорск (Ленинградская область), проекты по всей России. Фото и описания работ!" },
    { name: "keywords", content: "портфолио строительная компания, проекты ООО ЛЕГИОН, выполненные проекты, защита от БПЛА проекты, антидрон сетка монтаж, строительство металлоконструкций, Ленинградская область, промышленное строительство, работа по России, фото работ" },
    { name: "author", content: "Строительная компания ЛЕГИОН" },
    { name: "email", content: "l-legion@bk.ru" },
    { name: "copyright", content: "Строительная компания ЛЕГИОН, 2012-2026" },
    { rel: "canonical", href: "https://xn--78-glchqprh.xn--p1ai/portfolio" },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://xn--78-glchqprh.xn--p1ai/portfolio" },
    { property: "og:title", content: "Наши проекты | Портфолио защиты от БПЛА и строительства | ЛЕГИОН" },
    { property: "og:description", content: "Портфолио реализованных проектов ООО «ЛЕГИОН»: защита от БПЛА, монтаж антидрон сетки, строительство металлоконструкций. Офис в г. Светогорск (ЛО), проекты по России!" },
    { property: "og:image", content: "/Logo-1.png" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Наши проекты | Портфолио защиты от БПЛА и строительства | ЛЕГИОН" },
    { name: "twitter:description", content: "Портфолио реализованных проектов ООО «ЛЕГИОН». Защита от БПЛА и строительство промышленных объектов. Офис в г. Светогорск (Ленинградская область), работа по России!" },
    { name: "twitter:image", content: "/Logo-1.png" },
  ];
}

export default function PortfolioPage() {
  return <PortfolioGallery />;
}
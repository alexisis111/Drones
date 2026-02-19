import type { Route } from "./+types/portfolio";
import PortfolioGallery from "../components/PortfolioGallery";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Портфолио | Строительная компания ЛЕГИОН — Выполненные проекты." },
    { name: "description", content: "Портфолио выполненных проектов строительной компании ООО «ЛЕГИОН». Антидроновая защита, строительство металлоконструкций, промышленные и гражданские объекты." },
    { name: "keywords", content: "портфолио строительная компания, проекты ООО ЛЕГИОН, выполненные проекты, антидроновая защита проекты, строительство СПб, промышленное строительство, гражданское строительство" },
    { name: "author", content: "Строительная компания ЛЕГИОН" },
    { name: "email", content: "l-legion@bk.ru" },
    { name: "copyright", content: "Строительная компания ЛЕГИОН, 2012-2026" },
    { rel: "canonical", href: "https://xn--78-glchqprh.xn--p1ai/portfolio" },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://xn--78-glchqprh.xn--p1ai/portfolio" },
    { property: "og:title", content: "Портфолио | Строительная компания ЛЕГИОН — Выполненные проекты." },
    { property: "og:description", content: "Портфолио выполненных проектов строительной компании ООО «ЛЕГИОН». Антидроновая защита и строительство промышленных объектов." },
    { property: "og:image", content: "/Logo-1.png" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Портфолио | Строительная компания ЛЕГИОН — Выполненные проекты." },
    { name: "twitter:description", content: "Портфолио выполненных проектов строительной компании ООО «ЛЕГИОН»." },
    { name: "twitter:image", content: "/Logo-1.png" },
  ];
}

export default function PortfolioPage() {
  return <PortfolioGallery />;
}
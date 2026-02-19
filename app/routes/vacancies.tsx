import type { Route } from "./+types/vacancies";
import VacanciesGallery from "../components/VacanciesGallery";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Вакансии | Строительная компания ЛЕГИОН — Работа в строительной компании." },
    { name: "description", content: "Вакансии строительной компании ООО «ЛЕГИОН». Актуальные предложения работы в строительстве. Присоединяйтесь к нашей команде профессионалов." },
    { name: "keywords", content: "вакансии строительная компания, работа в строительстве СПб, ООО ЛЕГИОН вакансии, строительные вакансии, работа Ленинградская область, карьера в строительстве" },
    { name: "author", content: "Строительная компания ЛЕГИОН" },
    { name: "email", content: "l-legion@bk.ru" },
    { name: "copyright", content: "Строительная компания ЛЕГИОН, 2012-2026" },
    { rel: "canonical", href: "https://xn--78-glchqprh.xn--p1ai/vacancies" },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://xn--78-glchqprh.xn--p1ai/vacancies" },
    { property: "og:title", content: "Вакансии | Строительная компания ЛЕГИОН — Работа в строительной компании." },
    { property: "og:description", content: "Вакансии строительной компании ООО «ЛЕГИОН» в Санкт-Петербурге. Актуальные предложения работы в строительстве." },
    { property: "og:image", content: "/Logo-1.png" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Вакансии | Строительная компания ЛЕГИОН — Работа в строительной компании." },
    { name: "twitter:description", content: "Вакансии строительной компании ООО «ЛЕГИОН». Присоединяйтесь к нашей команде." },
    { name: "twitter:image", content: "/Logo-1.png" },
  ];
}

export default function VacanciesRoute() {
  return <VacanciesGallery />;
}
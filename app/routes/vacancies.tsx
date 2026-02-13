import type { Route } from "./+types/vacancies";
import VacanciesGallery from "../components/VacanciesGallery";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Вакансии - ООО «ЛЕГИОН» - Работа в строительной компании в Санкт-Петербурге и Ленинградской области" },
    { name: "description", content: "Открытые вакансии в строительной компании ООО «ЛЕГИОН» в Санкт-Петербурге и Ленинградской области. Условия работы, требования и контакты для связи. Присоединяйтесь к нашей команде профессионалов." },
    { name: "keywords", content: "вакансии, работа СПб, строительная компания работа, вакансии в строительстве, работа в Ленинградской области, строительные специальности, монтажные работы вакансии, строительство СПб работа" },
    { name: "author", content: "ООО «ЛЕГИОН»" },
    { name: "email", content: "l-legion@bk.ru" },
    { rel: "canonical", href: "https://xn--78-glchqprh.xn--p1ai/vacancies" }, // https://легион.рф/vacancies
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://xn--78-glchqprh.xn--p1ai/vacancies" }, // https://легион.рф/vacancies
    { property: "og:title", content: "Вакансии - ООО «ЛЕГИОН» - Работа в строительной компании в Санкт-Петербурге и Ленинградской области" },
    { property: "og:description", content: "Открытые вакансии в строительной компании ООО «ЛЕГИОН» в Санкт-Петербурге и Ленинградской области. Условия работы, требования и контакты для связи." },
    { property: "og:image", content: "/Logo-1.png" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Вакансии - ООО «ЛЕГИОН» - Работа в строительной компании в Санкт-Петербурге и Ленинградской области" },
    { name: "twitter:description", content: "Открытые вакансии в строительной компании ООО «ЛЕГИОН» в Санкт-Петербурге и Ленинградской области. Условия работы, требования и контакты для связи." },
    { name: "twitter:image", content: "/Logo-1.png" },
  ];
}

export default function VacanciesRoute() {
  return <VacanciesGallery />;
}
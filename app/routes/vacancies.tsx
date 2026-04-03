import type { Route } from "./+types/vacancies";
import VacanciesGallery from "../components/VacanciesGallery";
import type { BreadcrumbItem } from "../components/BreadcrumbSchema";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Работа в Светогорске | Вакансии строительной компании ЛЕГИОН | Работа по РФ" },
    { name: "description", content: "Вакансии ООО «ЛЕГИОН» в Светогорске (Ленинградская область). Работа в строительстве с достойной зарплатой. Официальное трудоустройство, соцпакет, пятидневка. Откликнитесь онлайн!" },
    { name: "keywords", content: "работа Светогорск, вакансии Светогорск, работа в строительстве, строительная компания вакансии, ООО ЛЕГИОН вакансии, работа Ленинградская область, работа Выборгский район, строительные вакансии, трудоустройство Светогорск, карьера в строительстве, работа по России, зарплата в строительстве, работа в Светогорске официально" },
    { name: "author", content: "Строительная компания ЛЕГИОН" },
    { name: "email", content: "l-legion@bk.ru" },
    { name: "copyright", content: "Строительная компания ЛЕГИОН, 2012-2026" },
    { rel: "canonical", href: "https://xn--78-glchqprh.xn--p1ai/vacancies" },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://xn--78-glchqprh.xn--p1ai/vacancies" },
    { property: "og:title", content: "Работа в Светогорске | Вакансии строительной компании ЛЕГИОН" },
    { property: "og:description", content: "Вакансии ООО «ЛЕГИОН» в Светогорске. Работа в строительстве с достойной зарплатой. Официальное трудоустройство, соцпакет!" },
    { property: "og:image", content: "/Logo-1.png" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Работа в Светогорске | Вакансии строительной компании ЛЕГИОН" },
    { name: "twitter:description", content: "Вакансии ООО «ЛЕГИОН» в Светогорске (ЛО). Работа в строительстве с достойной зарплатой и соцпакетом!" },
    { name: "twitter:image", content: "/Logo-1.png" },
  ];
}

const breadcrumbs: BreadcrumbItem[] = [
  { position: 1, name: "Главная", item: "https://xn--78-glchqprh.xn--p1ai/" },
  { position: 2, name: "Вакансии", item: "https://xn--78-glchqprh.xn--p1ai/vacancies" }
];

export default function VacanciesRoute() {
  return <VacanciesGallery breadcrumbs={breadcrumbs} />;
}
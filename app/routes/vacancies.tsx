import type { Route } from "./+types/vacancies";
import VacanciesGallery from "../components/VacanciesGallery";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Работа в ЛЕГИОН | Вакансии в строительстве | Работа по РФ" },
    { name: "description", content: "Актуальные вакансии ООО «ЛЕГИОН». Офис в г. Светогорск (Ленинградская область), проекты по всей России. Работа в строительстве с достойной зарплатой, официальное трудоустройство, соцпакет. Откликнитесь онлайн!" },
    { name: "keywords", content: "вакансии строительная компания, работа в строительстве, ООО ЛЕГИОН вакансии, строительные вакансии, работа Ленинградская область, зарплата в строительстве, трудоустройство, карьера в строительстве, работа по России" },
    { name: "author", content: "Строительная компания ЛЕГИОН" },
    { name: "email", content: "l-legion@bk.ru" },
    { name: "copyright", content: "Строительная компания ЛЕГИОН, 2012-2026" },
    { rel: "canonical", href: "https://xn--78-glchqprh.xn--p1ai/vacancies" },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://xn--78-glchqprh.xn--p1ai/vacancies" },
    { property: "og:title", content: "Работа в ЛЕГИОН | Вакансии в строительстве | Работа по РФ" },
    { property: "og:description", content: "Актуальные вакансии ООО «ЛЕГИОН». Офис в г. Светогорск (ЛО), проекты по всей России. Достойная зарплата, официальное трудоустройство!" },
    { property: "og:image", content: "/Logo-1.png" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Работа в ЛЕГИОН | Вакансии в строительстве | Работа по РФ" },
    { name: "twitter:description", content: "Актуальные вакансии ООО «ЛЕГИОН». Офис в г. Светогорск (Ленинградская область), проекты по России. Достойная зарплата и соцпакет!" },
    { name: "twitter:image", content: "/Logo-1.png" },
  ];
}

export default function VacanciesRoute() {
  return <VacanciesGallery />;
}
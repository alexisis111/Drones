import type { Route } from "./+types/drone-defense";
import DroneDefensePage from "../components/DroneDefensePage";
import type { BreadcrumbItem } from "../components/BreadcrumbSchema";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Защита от БПЛА и дронов | Антидрон сетка | Монтаж по СП 542 | ЛЕГИОН" },
    { name: "description", content: "Антидроновая защита промышленных объектов от БПЛА под ключ. Монтаж сеток от дронов согласно СП 542.1325800.2024. Защита ТЭЦ, нефтебаз, аэропортов. Расчет стоимости!" },
    { name: "keywords", content: "защита от БПЛА, защита от дронов, антидрон сетка, защита периметра, СП 542.1325800.2024, антидроновая защита, защита промышленных объектов, БПЛА защита, беспилотники защита, монтаж антидрон сетки, защита ТЭЦ, защита нефтебазы, ООО ЛЕГИОН" },
    { name: "author", content: "Строительная компания ЛЕГИОН" },
    { name: "email", content: "l-legion@bk.ru" },
    { name: "copyright", content: "ООО «ЛЕГИОН», 2012-2026" },
    { rel: "canonical", href: "https://xn--78-glchqprh.xn--p1ai/drone-defense" },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://xn--78-glchqprh.xn--p1ai/drone-defense" },
    { property: "og:title", content: "Защита от БПЛА и дронов | Антидрон сетка | Монтаж по СП 542 | ЛЕГИОН" },
    { property: "og:description", content: "Антидроновая защита промышленных объектов от БПЛА под ключ. Монтаж сеток от дронов согласно СП 542.1325800.2024. Защита ТЭЦ, нефтебаз, аэропортов." },
    { property: "og:image", content: "/Logo-1.png" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Защита от БПЛА и дронов | Антидрон сетка | Монтаж по СП 542 | ЛЕГИОН" },
    { name: "twitter:description", content: "Антидроновая защита промышленных объектов от БПЛА под ключ. Монтаж по СП 542. Защита ТЭЦ, нефтебаз, аэропортов." },
    { name: "twitter:image", content: "/Logo-1.png" },
  ];
}

const breadcrumbs: BreadcrumbItem[] = [
  { position: 1, name: "Главная", item: "https://xn--78-glchqprh.xn--p1ai/" },
  { position: 2, name: "Защита от БПЛА", item: "https://xn--78-glchqprh.xn--p1ai/drone-defense" }
];

export default function DroneDefenseRoute() {
  return <DroneDefensePage breadcrumbs={breadcrumbs} />;
}
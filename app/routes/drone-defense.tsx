import type { Route } from "./+types/drone-defense";
import DroneDefensePage from "../components/DroneDefensePage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Антидроновая защита от БПЛА | ООО ЛЕГИОН — Защита периметра по СП 542.1325800.2024" },
    { name: "description", content: "Антидроновая защита промышленных объектов от БПЛА. Системы защиты периметра согласно СП 542.1325800.2024. Проектирование и монтаж антидроновых конструкций для ТЭЦ, нефтебаз, аэропортов. Работаем по всей России." },
    { name: "keywords", content: "антидроновая защита, защита от БПЛА, защита периметра, СП 542.1325800.2024, антидроновые сетки, защита промышленных объектов, БПЛА защита, беспилотники защита, строительная компания СПб, ООО ЛЕГИОН" },
    { name: "author", content: "Строительная компания ЛЕГИОН" },
    { name: "email", content: "l-legion@bk.ru" },
    { name: "copyright", content: "ООО «ЛЕГИОН», 2012-2026" },
    { rel: "canonical", href: "https://xn--78-glchqprh.xn--p1ai/drone-defense" },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://xn--78-glchqprh.xn--p1ai/drone-defense" },
    { property: "og:title", content: "Антидроновая защита от БПЛА | ООО ЛЕГИОН — Защита периметра по СП 542.1325800.2024" },
    { property: "og:description", content: "Антидроновая защита промышленных объектов от БПЛА. Системы защиты периметра согласно СП 542.1325800.2024. Проектирование и монтаж для ТЭЦ, нефтебаз, аэропортов." },
    { property: "og:image", content: "/Logo-1.png" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Антидроновая защита от БПЛА | ООО ЛЕГИОН — Защита периметра по СП 542.1325800.2024" },
    { name: "twitter:description", content: "Антидроновая защита промышленных объектов от БПЛА. Системы защиты периметра согласно СП 542.1325800.2024." },
    { name: "twitter:image", content: "/Logo-1.png" },
  ];
}

export default function DroneDefenseRoute() {
  return <DroneDefensePage />;
}
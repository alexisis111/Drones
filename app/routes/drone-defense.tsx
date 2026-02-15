import type { Route } from "./+types/drone-defense";
import DroneDefensePage from "../components/DroneDefensePage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Защита от БПЛА - ООО «ЛЕГИОН» - Система защиты от БПЛА" },
    { name: "description", content: "Проектируем и монтируем антидроновые защитные сетки и ограждения от БПЛА и дронов-камикадзе. Защита ТЭЦ, резервуаров, зданий по всей России. Надёжно, быстро, эффективно." },
    { name: "keywords", content: "защита от дронов, система защиты от БПЛА, безопасность промышленных объектов, защита от беспилотников, охрана ТЭЦ, защита резервуаров, безопасность зданий, системы безопасности СПб, безопасность Ленинградская область, защита персонала, охрана объектов, современные технологии безопасности, антидроновые системы, защитные сетки от дронов, монтаж систем безопасности, безопасность по всей России" },
    { name: "author", content: "ООО «ЛЕГИОН»" },
    { name: "email", content: "l-legion@bk.ru" },
    { rel: "canonical", href: "https://xn--78-glchqprh.xn--p1ai/drone-defense" }, // https://легион.рф/drone-defense
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://xn--78-glchqprh.xn--p1ai/drone-defense" }, // https://легион.рф/drone-defense
    { property: "og:title", content: "Защита от БПЛА - ООО «ЛЕГИОН» - Система защиты от беспилотников в Санкт-Петербурге и Ленинградской области" },
    { property: "og:description", content: "Система защиты от беспилотных летательных аппаратов от ООО «ЛЕГИОН» в Санкт-Петербурге и Ленинградской области. Современные технологии для обеспечения безопасности персонала и объектов." },
    { property: "og:image", content: "/Logo-1.png" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Защита от БПЛА - ООО «ЛЕГИОН» - Система защиты от беспилотников в Санкт-Петербурге и Ленинградской области" },
    { name: "twitter:description", content: "Система защиты от беспилотных летательных аппаратов от ООО «ЛЕГИОН» в Санкт-Петербурге и Ленинградской области. Современные технологии для обеспечения безопасности персонала и объектов." },
    { name: "twitter:image", content: "/Logo-1.png" },
  ];
}

export default function DroneDefenseRoute() {
  return <DroneDefensePage />;
}
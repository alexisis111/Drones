import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Строительная компания Легион | Защита от БПЛА, дронов, ЗОК | Строительство по всей России" },
    { name: "description", content: "Комплексная система защиты от беспилотников, БПЛА, дронов под ключ. +7 931 247 08 88 звоните" },
    { name: "keywords", content: "защита от дронов, защита от БПЛА, антидрон сетка, ЗОК, строительство ЗОК, защита периметра под ключ" },
    { name: "author", content: "Строительная компания ЛЕГИОН" },
    { name: "email", content: "l-legion@bk.ru" },
    { name: "copyright", content: "ООО «ЛЕГИОН», 2012-2026" },
    { rel: "canonical", href: "https://xn--78-glchqprh.xn--p1ai/" },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://xn--78-glchqprh.xn--p1ai/" },
    { property: "og:title", content: "Строительная компания Легион | Защита от БПЛА, дронов, ЗОК | Строительство по всей России" },
    { property: "og:description", content: "Комплексная система защиты от беспилотников, БПЛА, дронов под ключ. +7 931 247 08 88 звоните" },
    { property: "og:image", content: "/Logo-1.png" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Строительная компания Легион | Защита от БПЛА, дронов, ЗОК | Строительство по всей России" },
    { name: "twitter:description", content: "Комплексная система защиты от беспилотников, БПЛА, дронов под ключ. +7 931 247 08 88 звоните" },
    { name: "twitter:image", content: "/Logo-1.png" },
  ];
}

export default function Home() {
  return <Welcome />;
}

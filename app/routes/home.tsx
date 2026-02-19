import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Главная | Строительная компания ЛЕГИОН — Антидроновая защита и строительство. Работаем на всей территории РФ.Ы" },
    { name: "description", content: "ООО «ЛЕГИОН» — современная строительная компания в Санкт-Петербурге. Антидроновая защита, защита от БПЛА, строительство металлоконструкций и монтажные работы под ключ. Работаем по всей России." },
    { name: "keywords", content: "антидроновая защита, защита от БПЛА, строительная компания СПб, строительство металлоконструкций, монтажные работы, строительство Ленинградская область, строительство под ключ, промышленное строительство, гражданское строительство, ООО ЛЕГИОН" },
    { name: "author", content: "Строительная компания ЛЕГИОН" },
    { name: "email", content: "l-legion@bk.ru" },
    { name: "copyright", content: "ООО «ЛЕГИОН», 2012-2026" },
    { rel: "canonical", href: "https://xn--78-glchqprh.xn--p1ai/" },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://xn--78-glchqprh.xn--p1ai/" },
    { property: "og:title", content: "Главная | Строительная компания ЛЕГИОН — Антидроновая защита и строительство" },
    { property: "og:description", content: "ООО «ЛЕГИОН» — современная строительная компания в Санкт-Петербурге. Антидроновая защита, строительство металлоконструкций и монтажные работы под ключ." },
    { property: "og:image", content: "/Logo-1.png" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Главная | Строительная компания ЛЕГИОН — Антидроновая защита и строительство" },
    { name: "twitter:description", content: "ООО «ЛЕГИОН» — современная строительная компания в Санкт-Петербурге. Антидроновая защита, строительство металлоконструкций и монтажные работы под ключ." },
    { name: "twitter:image", content: "/Logo-1.png" },
  ];
}

export default function Home() {
  return <Welcome />;
}

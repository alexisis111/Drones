import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Защита от БПЛА и дронов | Строительство СПб | ЛЕГИОН" },
    { name: "description", content: "ООО ЛЕГИОН — защита от БПЛА промышленных объектов, монтаж антидрон сетки по СП 542. Строительство под ключ в Санкт-Петербурге. Работаем по всей России с 2012 года!" },
    { name: "keywords", content: "защита от дронов, защита от БПЛА, антидрон сетка, строительная компания СПб, монтаж металлоконструкций, строительство под ключ, Ленинградская область, ООО ЛЕГИОН, защита периметра, промышленное строительство" },
    { name: "author", content: "Строительная компания ЛЕГИОН" },
    { name: "email", content: "l-legion@bk.ru" },
    { name: "copyright", content: "ООО «ЛЕГИОН», 2012-2026" },
    { rel: "canonical", href: "https://xn--78-glchqprh.xn--p1ai/" },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://xn--78-glchqprh.xn--p1ai/" },
    { property: "og:title", content: "Защита от БПЛА и дронов | Строительство СПб | ЛЕГИОН" },
    { property: "og:description", content: "Защита от БПЛА и дронов, строительство под ключ в Санкт-Петербурге. Монтаж антидрон сетки по СП 542. Работаем по всей России!" },
    { property: "og:image", content: "/Logo-1.png" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Защита от БПЛА и дронов | Строительство СПб | ЛЕГИОН" },
    { name: "twitter:description", content: "Защита от БПЛА и дронов, строительство под ключ в Санкт-Петербурге. Монтаж антидрон сетки по СП 542." },
    { name: "twitter:image", content: "/Logo-1.png" },
  ];
}

export default function Home() {
  return <Welcome />;
}

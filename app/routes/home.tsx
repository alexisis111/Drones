import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Защита от БПЛА и дронов | Строительство по России | ЛЕГИОН" },
    { name: "description", content: "ООО ЛЕГИОН — защита от БПЛА промышленных объектов, монтаж антидрон сетки по СП 542. Офис в г. Светогорск (Ленинградская область). Строительство под ключ по всей России с 2012 года!" },
    { name: "keywords", content: "защита от дронов, защита от БПЛА, антидрон сетка, строительная компания, монтаж металлоконструкций, строительство под ключ, Ленинградская область, работа по России, ООО ЛЕГИОН, защита периметра, промышленное строительство" },
    { name: "author", content: "Строительная компания ЛЕГИОН" },
    { name: "email", content: "l-legion@bk.ru" },
    { name: "copyright", content: "ООО «ЛЕГИОН», 2012-2026" },
    { rel: "canonical", href: "https://xn--78-glchqprh.xn--p1ai/" },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://xn--78-glchqprh.xn--p1ai/" },
    { property: "og:title", content: "Защита от БПЛА и дронов | Строительство по России | ЛЕГИОН" },
    { property: "og:description", content: "Защита от БПЛА и дронов, строительство под ключ по России. Офис в г. Светогорск (Ленинградская область). Монтаж антидрон сетки по СП 542!" },
    { property: "og:image", content: "/Logo-1.png" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Защита от БПЛА и дронов | Строительство по России | ЛЕГИОН" },
    { name: "twitter:description", content: "Защита от БПЛА и дронов, строительство под ключ по России. Офис в г. Светогорск (ЛО). Монтаж антидрон сетки по СП 542!" },
    { name: "twitter:image", content: "/Logo-1.png" },
  ];
}

export default function Home() {
  return <Welcome />;
}

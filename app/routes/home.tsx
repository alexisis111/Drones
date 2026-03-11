import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Строительная компания ЛЕГИОН | Строительство в СПб, ЛО и по всей России" },
    { name: "description", content: "Строительная компания «Легион» — надёжный подрядчик с 2012 года. Офис в г. Светогорск (Ленинградская область), ул. Максима Горького, 7. Выполняем полный цикл строительных работ: от проектирования до сдачи под ключ. Работаем по всей России. Гарантия качества. ☎ +7 931 247-08-88" },
    { name: "keywords", content: "строительная компания, строительство зданий, строительство под ключ, монтаж металлоконструкций, промышленное строительство, гражданское строительство, Светогорск, Ленинградская область, СПб, работа по России, ООО Легион" },
    { name: "author", content: "Строительная компания ЛЕГИОН" },
    { name: "email", content: "l-legion@bk.ru" },
    { name: "copyright", content: "ООО «ЛЕГИОН», 2012-2026" },
    { rel: "canonical", href: "https://xn--78-glchqprh.xn--p1ai/" },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://xn--78-glchqprh.xn--p1ai/" },
    { property: "og:title", content: "Строительная компания ЛЕГИОН | Строительство в СПб, ЛО и по всей России" },
    { property: "og:description", content: "Надёжный подрядчик с 2012 года в г. Светогорск. Полный цикл строительных работ: от проектирования до сдачи под ключ. Промышленные и гражданские объекты по всей России." },
    { property: "og:image", content: "/Logo-1.png" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Строительная компания ЛЕГИОН | Строительство в СПб, ЛО и по всей России" },
    { name: "twitter:description", content: "Надёжный подрядчик с 2012 года в г. Светогорск. Полный цикл строительных работ: от проектирования до сдачи под ключ. Промышленные и гражданские объекты по всей России." },
    { name: "twitter:image", content: "/Logo-1.png" },
  ];
}

export default function Home() {
  return <Welcome />;
}


import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ЛЕГИОН - Строительная компания в Санкт-Петербурге и Ленинградской области" },
    { name: "description", content: "ООО «ЛЕГИОН» - профессиональные строительно-монтажные работы с 2012 года. Комплексные решения для строительства и монтажа в СПб и ЛО. Гарантия качества и соблюдение сроков." },
    { name: "keywords", content: "строительная компания, строительство СПб, монтажные работы, строительство Ленинградская область, строительно-монтажные работы, застройщик СПб, строительство под ключ, промышленное строительство, гражданское строительство" },
    { name: "author", content: "ООО «ЛЕГИОН»" },
    { name: "email", content: "l-legion@bk.ru" },
    { name: "copyright", content: "ООО «ЛЕГИОН», 2012-2026" },
    { rel: "canonical", href: "https://xn--78-glchqprh.xn--p1ai/" }, // https://легион.рф/
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://xn--78-glchqprh.xn--p1ai/" }, // https://легион.рф/
    { property: "og:title", content: "ЛЕГИОН - Строительная компания в Санкт-Петербурге и Ленинградской области" },
    { property: "og:description", content: "ООО «ЛЕГИОН» - профессиональные строительно-монтажные работы с 2012 года. Комплексные решения для строительства и монтажа в СПб и ЛО." },
    { property: "og:image", content: "/Logo-1.png" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "ЛЕГИОН - Строительная компания в Санкт-Петербурге и Ленинградской области" },
    { name: "twitter:description", content: "ООО «ЛЕГИОН» - профессиональные строительно-монтажные работы с 2012 года. Комплексные решения для строительства и монтажа в СПб и ЛО." },
    { name: "twitter:image", content: "/Logo-1.png" },
  ];
}

export default function Home() {
  return <Welcome />;
}

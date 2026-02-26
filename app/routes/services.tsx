import type { Route } from "./+types/services";
import ServicesCatalog from "../components/ServicesCatalog";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Услуги строительной компании | Монтаж антидрон сетки по РФ | ЛЕГИОН" },
    { name: "description", content: "Все услуги ООО «ЛЕГИОН»: защита от БПЛА, монтаж антидрон сетки по СП 542, строительство металлоконструкций под ключ. Офис в г. Светогорск (Ленинградская область), работаем по всей России. Бесплатный замер и расчет сметы!" },
    { name: "keywords", content: "услуги строительная компания, антидроновая защита услуги, монтаж антидрон сетки, монтаж металлоконструкций, строительство под ключ, Ленинградская область, защита от БПЛА, промышленное строительство, ООО ЛЕГИОН услуги, работа по России, бесплатный замер" },
    { name: "author", content: "Строительная компания ЛЕГИОН" },
    { name: "email", content: "l-legion@bk.ru" },
    { name: "copyright", content: "Строительная компания ЛЕГИОН, 2012-2026" },
    { rel: "canonical", href: "https://xn--78-glchqprh.xn--p1ai/services" },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://xn--78-glchqprh.xn--p1ai/services" },
    { property: "og:title", content: "Услуги строительной компании | Монтаж антидрон сетки по РФ | ЛЕГИОН" },
    { property: "og:description", content: "Все услуги ООО «ЛЕГИОН»: защита от БПЛА, монтаж антидрон сетки по СП 542, строительство металлоконструкций. Офис в г. Светогорск (ЛО), работа по всей России!" },
    { property: "og:image", content: "/Logo-1.png" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Услуги строительной компании | Монтаж антидрон сетки по РФ | ЛЕГИОН" },
    { name: "twitter:description", content: "Все услуги ООО «ЛЕГИОН»: защита от БПЛА, монтаж антидрон сетки, строительство под ключ. Офис в г. Светогорск (Ленинградская область), работа по России!" },
    { name: "twitter:image", content: "/Logo-1.png" },
  ];
}

export default function ServicesPage() {
  return <ServicesCatalog />;
}
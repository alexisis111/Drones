import type { Route } from "./+types/proposal";
import ProposalPage from "../components/ProposalPage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Специальное предложение - ООО «ЛЕГИОН» - Строительные услуги в Санкт-Петербурге и Ленинградской области" },
    { name: "description", content: "Получите скидку 25% на выбранные строительные и монтажные услуги в Санкт-Петербурге и Ленинградской области в течение 24 часов. Специальное предложение от строительной компании ООО «ЛЕГИОН»." },
    { name: "keywords", content: "специальное предложение, скидка на строительные услуги, акция строительной компании, скидка 25%, строительство СПб, монтажные работы СПб, строительство Ленинградская область, выгодное предложение, строительные услуги с дисконтом" },
    { name: "author", content: "ООО «ЛЕГИОН»" },
    { name: "email", content: "l-legion@bk.ru" },
    { rel: "canonical", href: "https://xn--78-glchqprh.xn--p1ai/proposal" }, // https://легион.рф/proposal
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://xn--78-glchqprh.xn--p1ai/proposal" }, // https://легион.рф/proposal
    { property: "og:title", content: "Специальное предложение - ООО «ЛЕГИОН» - Строительные услуги в Санкт-Петербурге и Ленинградской области" },
    { property: "og:description", content: "Получите скидку 25% на выбранные строительные и монтажные услуги в Санкт-Петербурге и Ленинградской области в течение 24 часов. Специальное предложение от строительной компании ООО «ЛЕГИОН»." },
    { property: "og:image", content: "/Logo-1.png" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Специальное предложение - ООО «ЛЕГИОН» - Строительные услуги в Санкт-Петербурге и Ленинградской области" },
    { name: "twitter:description", content: "Получите скидку 25% на выбранные строительные и монтажные услуги в Санкт-Петербурге и Ленинградской области в течение 24 часов. Специальное предложение от строительной компании ООО «ЛЕГИОН»." },
    { name: "twitter:image", content: "/Logo-1.png" },
  ];
}

export default function ProposalRoute() {
  return <ProposalPage />;
}
import type { Route } from "./+types/proposal";
import ProposalPage from "../components/ProposalPage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Специальное предложение - ООО «ЛЕГИОН»" },
    { name: "description", content: "Получите скидку 25% на выбранные услуги в течение 24 часов. Специальное предложение от строительной компании ООО «ЛЕГИОН»." },
  ];
}

export default function ProposalRoute() {
  return <ProposalPage />;
}
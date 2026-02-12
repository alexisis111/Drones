import type { Route } from "./+types/portfolio";
import PortfolioGallery from "../components/PortfolioGallery";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Портфолио - ООО «ЛЕГИОН»" },
    { name: "description", content: "Проекты и реализованные работы строительной компании ООО «ЛЕГИОН»" },
  ];
}

export default function PortfolioPage() {
  return <PortfolioGallery />;
}
import type { Route } from "./+types/service-detail";
import ServiceDetailPage from "../components/ServiceDetailPage";

export function meta({ matches }: Route.MetaArgs) {
  const serviceMatch = matches.find(m => m.id === 'routes/service-detail');
  const serviceTitle = serviceMatch?.data?.title || 'Услуга';

  return [
    { title: `${serviceTitle} - ООО «ЛЕГИОН»` },
    { name: "description", content: `Информация об услуге ${serviceTitle} от строительной компании ООО «ЛЕГИОН». Подробное описание, стоимость и этапы выполнения.` },
  ];
}

export default function ServiceDetailRoute() {
  return <ServiceDetailPage />;
}
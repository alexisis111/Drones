import type { Route } from "./+types/drone-defense";
import DroneDefensePage from "../components/DroneDefensePage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Защита от БПЛА - ООО «ЛЕГИОН»" },
    { name: "description", content: "Система защиты от беспилотных летательных аппаратов от ООО «ЛЕГИОН»" },
  ];
}

export default function DroneDefenseRoute() {
  return <DroneDefensePage />;
}
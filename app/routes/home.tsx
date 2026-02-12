import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ЛЕГИОН, строительная компания" },
    { name: "description", content: "ООО «ЛЕГИОН» - профессиональные строительно-монтажные работы с 2012 года" },
  ];
}

export default function Home() {
  return <Welcome />;
}

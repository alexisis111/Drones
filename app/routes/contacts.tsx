import type { Route } from "./+types/contacts";
import ContactsPage from "../components/ContactsPage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Контакты - ООО «ЛЕГИОН»" },
    { name: "description", content: "Контактная информация строительной компании ООО «ЛЕГИОН». Телефоны, адрес, email и форма обратной связи." },
  ];
}

export default function ContactsRoute() {
  return <ContactsPage />;
}
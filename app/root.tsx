import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import AppWrapper from "./AppWrapper";
import { OrganizationSchema } from "./components/SchemaOrg";

import type { Route } from "./+types/root";
import "./app.css";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Строительная компания ЛЕГИОН</title>
        <link rel="icon" href="/Logo-1.png" sizes="any" />
        <Meta />
        <Links />
        <OrganizationSchema
          name="ООО «ЛЕГИОН»"
          description="ООО «ЛЕГИОН» - профессиональные строительно-монтажные работы. Комплексные решения для строительства и монтажа в СПб и ЛО. Гарантия качества и соблюдение сроков."
          url="https://xn--78-glchqprh.xn--p1ai/" // https://легион.рф/
          logo="/Logo-1.png"
          address="Ленинградская область"
          telephone="+79312470888"
          email="l-legion@bk.ru"
          openingHours={["Mo-Fr 09:00-18:00"]}
          sameAs={[
            "https://vk.com/legion__78",
            "https://max.ru/join/VSfgaLaU34O8mOpcRQMbEUcHlhFA62rS5LSpmhy0K5M",
            'https://t.me/+XaGL8WXjVwQwYjVi'
          ]}
        />
        {/* Yandex.Metrika counter */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(m,e,t,r,i,k,a){
                m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                m[i].l=1*new Date();
                for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
                k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
              })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=106789634', 'ym');

              ym(106789634, 'init', {defer: true, ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", referrer: document.referrer, url: location.href, accurateTrackBounce:true, trackLinks:true});

              // Логирование инициализации для отладки
              if (typeof console !== 'undefined') {
                console.log('Yandex Metrika initialized with ID: 106789634');
              }
            `
          }}
        />
      </head>
      <body>
        <div className="min-h-screen flex flex-col">
          <main className="flex-grow">
            {children}
          </main>
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <AppWrapper />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}

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
import PageNotFound from "./components/PageNotFound";
import ErrorPage from "./components/ErrorPage";

import type { Route } from "./+types/root";
import "./app.css";

export const links: Route.LinksFunction = () => [
  // Preconnect to external domains
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  // Preload critical font
  {
    rel: "preload",
    as: "style",
    href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
  },
  // Main stylesheet
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  // Preload critical images
  {
    rel: "preload",
    as: "image",
    href: "/Logo-1.png",
    imagesrcset: "/Logo-1.png 2x",
    imagesizes: "128px",
  },
  // Preload hero image for LCP
  {
    rel: "preload",
    as: "image",
    href: "/img/homesImg/home.jpeg",
    imagesrcset: "/img/homesImg/home.jpeg 1x, /img/homesImg/home.jpeg 2x",
    imagesizes: "100vw",
    fetchPriority: "high",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
    <head>
      <meta charSet="utf-8"/>
      <meta name="viewport" content="width=device-width, initial-scale=1"/>
      <meta name="zen-verification" content="DqHQfN8uIAWDflvVe1nrseBbTEEDN94hVguAkw0IB4qnfok5Z5p2m0p7eUlBbyyY"/>
      <title>Строительная компания ЛЕГИОН | Строительство по всей России</title>
      <link rel="icon" href="/Logo-1.png" sizes="any"/>
      <Meta/>
      <Links/>
      <OrganizationSchema
          name="ООО «ЛЕГИОН»"
          description="ООО «ЛЕГИОН» - надёжная строительная компания с 2012 года. Выполняем полный цикл строительных работ: от проектирования до сдачи объекта под ключ. Специализируемся на возведении зданий, монтаже металлоконструкций, теплоизоляции и комплексных решениях для промышленных и гражданских объектов. Работаем по всей России. Гарантия качества, соблюдение сроков, индивидуальный подход."
          url="https://xn--78-glchqprh.xn--p1ai/"
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
  return (
    <AppWrapper>
      <Outlet />
    </AppWrapper>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  if (isRouteErrorResponse(error) && error.status === 404) {
    // Render the custom 404 page with proper status
    return <PageNotFound />;
  }

  // Render the custom error page for all other errors
  return <ErrorPage />;
}

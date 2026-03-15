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
import "./fonts/inter/inter.css";

export const links: Route.LinksFunction = () => [
  // Preload critical images
  {
    rel: "preload",
    as: "image",
    href: "/Logo-1.png",
    imageSrcSet: "/Logo-1.png 2x",
    imageSizes: "128px",
  },
  // Preload hero image for LCP with fetchpriority
  {
    rel: "preload",
    as: "image",
    href: "/img/homesImg/home.jpeg",
    imageSrcSet: "/img/homesImg/home.webp 1x, /img/homesImg/home.webp 2x",
    imageSizes: "100vw",
    fetchPriority: "high",
  },
  // Preload hero image WebP version
  {
    rel: "preload",
    as: "image",
    href: "/img/homesImg/home.webp",
    fetchPriority: "high",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
    <head>
      <meta charSet="utf-8"/>
      <meta name="viewport" content="width=device-width, initial-scale=1"/>
      <meta name="yandex-verification" content="916757bc47a6f80e" />
      <meta name="google-site-verification" content="YOMSPufmaRHbpdasRrQBskC0PXPHfACqJIn2MBEE80o" />
      <title>Строительная компания ЛЕГИОН | Строительство по всей России</title>
      <link rel="icon" href="/Logo-1.png" sizes="any"/>
      
      {/* Critical CSS inline for faster FCP */}
      <style dangerouslySetInnerHTML={{__html: `
        /* Critical above-the-fold styles */
        .min-h-screen{min-height:100vh}
        .flex{display:flex}
        .flex-col{flex-direction:column}
        .flex-grow{flex-grow:1}
        .relative{position:relative}
        .absolute{position:absolute}
        .inset-0{top:0;right:0;bottom:0;left:0}
        .w-full{width:100%}
        .h-full{height:100%}
        .object-cover{object-fit:cover}
        .bg-gradient-to-br{background-image:linear-gradient(to bottom right,var(--tw-gradient-stops))}
        .from-gray-950{--tw-gradient-from:#030712 var(--tw-gradient-from-position);--tw-gradient-to:rgb(3 7 18/0) var(--tw-gradient-to-position);--tw-gradient-stops:var(--tw-gradient-from),var(--tw-gradient-to)}
        .via-gray-900{--tw-gradient-to:rgb(17 24 39/0) var(--tw-gradient-to-position);--tw-gradient-stops:var(--tw-gradient-from),#111827 var(--tw-gradient-via-position),var(--tw-gradient-to)}
        .to-black{--tw-gradient-to:#000 var(--tw-gradient-to-position)}
        /* Prevent CLS */
        img{max-width:100%;height:auto;display:block}
      `}} />
      
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

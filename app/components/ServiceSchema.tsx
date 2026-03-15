import React from 'react';
import type { Service } from '../data/services';
import { services } from '../data/services';

interface ServiceSchemaProps {
  service: Service;
  organizationName: string;
  organizationDescription: string;
  organizationUrl: string;
  organizationLogo: string;
  organizationAddress: string;
  organizationTelephone: string;
  organizationEmail: string;
  areaServed?: string[];
}

const ServiceSchema: React.FC<ServiceSchemaProps> = ({
  service,
  organizationName = "ООО «ЛЕГИОН»",
  organizationDescription = "Строительная компания с 2012 года",
  organizationUrl = "https://xn--78-glchqprh.xn--p1ai/",
  organizationLogo = "/Logo-1.png",
  organizationAddress = "Ленинградская область, г. Светогорск, ул. Максима Горького, 7",
  organizationTelephone = "+79312470888",
  organizationEmail = "l-legion@bk.ru",
  areaServed = ["Санкт-Петербург", "Ленинградская область", "Россия"]
}) => {
  // Формируем предложение с ценой, если она указана
  const priceSpecification = service.price ? {
    "@type": "PriceSpecification",
    "price": service.price.replace(/[^0-9.,]/g, ''),
    "priceCurrency": "RUB",
    "unitText": service.price.includes('/м³') ? 'CubicMeter' : 
                 service.price.includes('/м²') ? 'SquareMeter' :
                 service.price.includes('/п.м.') ? 'LinearMeter' :
                 service.price.includes('/т') ? 'Tonne' :
                 service.price.includes('/час') ? 'Hour' : 'Unit'
  } : undefined;

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service.title,
    "description": service.seoDescription || service.description,
    "serviceType": service.category,
    "provider": {
      "@type": "ConstructionBusiness",
      "name": organizationName,
      "description": organizationDescription,
      "url": organizationUrl,
      "logo": organizationUrl.replace(/\/$/, '') + organizationLogo,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "ул. Максима Горького, 7",
        "addressLocality": "Светогорск",
        "addressRegion": "Ленинградская область",
        "postalCode": "188680",
        "addressCountry": "RU"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": organizationTelephone,
        "contactType": "customer service",
        "email": organizationEmail,
        "availableLanguage": "Russian"
      },
      "openingHours": "Mo-Fr 09:00-18:00",
      "priceRange": "$$$"
    },
    "areaServed": areaServed.map(area => ({
      "@type": "Place",
      "name": area
    })),
    "offers": {
      "@type": "Offer",
      "availability": "https://schema.org/InStock",
      "url": `${organizationUrl.replace(/\/$/, '')}/service/${service.slug}`,
      "priceCurrency": "RUB",
      ...(priceSpecification && { "priceSpecification": priceSpecification }),
      "seller": {
        "@type": "Organization",
        "name": organizationName
      }
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Строительные услуги ООО ЛЕГИОН",
      "itemListElement": services.map(s => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": s.title,
          "url": `${organizationUrl.replace(/\/$/, '')}/service/${s.slug}`
        }
      }))
    },
    ...(service.benefits && service.benefits.length > 0 && {
      "featureList": service.benefits.join(', ')
    }),
    ...(service.stages && service.stages.length > 0 && {
      "serviceOutput": {
        "@type": "Thing",
        "description": "Этапы выполнения: " + service.stages.join(' → ')
      }
    })
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData, null, 2) }}
    />
  );
};

// Экспортируем упрощённую версию для использования в каталоге услуг
interface ServiceBriefSchemaProps {
  services: Service[];
  organizationName?: string;
  organizationUrl?: string;
}

export const ServiceBriefSchema: React.FC<ServiceBriefSchemaProps> = ({
  services,
  organizationName = "ООО «ЛЕГИОН»",
  organizationUrl = "https://xn--78-glchqprh.xn--p1ai/"
}) => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    "name": "Все услуги строительной компании ЛЕГИОН",
    "description": "Полный перечень строительных и монтажных услуг от ООО ЛЕГИОН",
    "url": `${organizationUrl}services`,
    "itemListElement": services.map((service, index) => ({
      "@type": "Offer",
      "position": index + 1,
      "itemOffered": {
        "@type": "Service",
        "name": service.title,
        "description": service.description,
        "serviceType": service.category,
        "url": `${organizationUrl}service/${service.slug}`,
        "image": service.imageUrl ? `${organizationUrl.replace(/\/$/, '')}${service.imageUrl}` : undefined,
        "offers": {
          "@type": "Offer",
          "availability": "https://schema.org/InStock",
          "priceCurrency": "RUB",
          ...(service.price && {
            "priceSpecification": {
              "@type": "PriceSpecification",
              "price": service.price.replace(/[^0-9.,]/g, ''),
              "priceCurrency": "RUB"
            }
          })
        }
      }
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData, null, 2) }}
    />
  );
};

export default ServiceSchema;

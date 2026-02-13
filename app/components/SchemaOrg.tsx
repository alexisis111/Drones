import React from 'react';

interface OrganizationSchemaProps {
  name: string;
  description: string;
  url: string;
  logo?: string;
  address: string;
  telephone: string;
  email?: string;
  openingHours?: string[];
  sameAs?: string[];
}

const OrganizationSchema: React.FC<OrganizationSchemaProps> = ({
  name,
  description,
  url,
  logo,
  address,
  telephone,
  email,
  openingHours,
  sameAs
}) => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": name,
    "description": description,
    "url": url,
    "logo": logo,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": address,
      "addressLocality": "Санкт-Петербург",
      "addressRegion": "ЛО",
      "postalCode": "197101", // Актуальный почтовый индекс для Санкт-Петербурга
      "addressCountry": "RU"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": telephone,
      "contactType": "customer service",
      ...(email && { "email": email })
    },
    ...(openingHours && {
      "openingHours": openingHours
    }),
    ...(sameAs && {
      "sameAs": sameAs
    })
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
};

interface LocalBusinessSchemaProps extends OrganizationSchemaProps {
  priceRange?: string;
}

const LocalBusinessSchema: React.FC<LocalBusinessSchemaProps> = ({
  name,
  description,
  url,
  logo,
  address,
  telephone,
  email,
  openingHours,
  sameAs,
  priceRange
}) => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": name,
    "description": description,
    "url": url,
    "logo": logo,
    "image": logo,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": address,
      "addressLocality": "Санкт-Петербург",
      "addressRegion": "ЛО",
      "postalCode": "197101", // Актуальный почтовый индекс для Санкт-Петербурга
      "addressCountry": "RU"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": telephone,
      "contactType": "customer service",
      ...(email && { "email": email })
    },
    "openingHours": openingHours,
    "priceRange": priceRange || "$$$",
    ...(sameAs && {
      "sameAs": sameAs
    })
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
};

interface ServiceSchemaProps {
  name: string;
  description: string;
  provider: OrganizationSchemaProps;
  areaServed?: string[];
  serviceType?: string;
}

const ServiceSchema: React.FC<ServiceSchemaProps> = ({
  name,
  description,
  provider,
  areaServed = ["Санкт-Петербург", "Ленинградская область"],
  serviceType = "Строительные и монтажные работы"
}) => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": serviceType,
    "provider": {
      "@type": "Organization",
      "name": provider.name,
      "description": provider.description,
      "url": provider.url.replace("https://xn--80affa3aj.xn--p1ai/", "https://xn--80afglc.xn--p1ai/"),
      "logo": provider.logo,
      "areaServed": areaServed,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": provider.address,
        "addressLocality": "Санкт-Петербург",
        "addressRegion": "ЛО",
        "postalCode": "190000", // Placeholder, should be updated with actual postal code
        "addressCountry": "RU"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": provider.telephone,
        "contactType": "customer service",
        ...(provider.email && { "email": provider.email })
      }
    },
    "areaServed": areaServed,
    "description": description,
    "name": name
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
};

export { OrganizationSchema, LocalBusinessSchema, ServiceSchema };
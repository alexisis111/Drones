import React from 'react';

export interface BreadcrumbItem {
  position: number;
  name: string;
  item: string; // URL
}

interface BreadcrumbListSchemaProps {
  breadcrumbs: BreadcrumbItem[];
}

const BreadcrumbListSchema: React.FC<BreadcrumbListSchemaProps> = ({ breadcrumbs }) => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((breadcrumb) => ({
      "@type": "ListItem",
      "position": breadcrumb.position,
      "item": breadcrumb.item,
      "name": breadcrumb.name
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
};

export default BreadcrumbListSchema;

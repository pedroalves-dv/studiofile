import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  // Always add Home at the beginning
  const breadcrumbItems = [{ label: "Home", href: "/" }, ...items];

  // Generate JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: item.href
        ? `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}${item.href}`
        : undefined,
    })),
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb Navigation */}
      <nav
        className="mt-8 border border-stroke px-4 py-2 w-fit rounded-full text-base font-medium tracking-[-0.03em] text-ink/20"
        aria-label="Breadcrumb"
      >
        <ol className="flex items-center gap-3 flex-wrap">
          {breadcrumbItems.map((item, index) => (
            <li key={index} className="flex items-center gap-3">
              {index > 0 && (
                <span aria-hidden="true" className="text-ink/20">
                  ›
                </span>
              )}
              {item.href && index !== breadcrumbItems.length - 1 ? (
                <Link
                  href={item.href}
                  className="text-ink/20 hover:text-ink/90 transition-colors link-underline"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={
                    index === breadcrumbItems.length - 1 ? "page" : undefined
                  }
                  className={
                    index === breadcrumbItems.length - 1
                      ? "text-ink/90"
                      : "text-ink/20"
                  }
                >
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}

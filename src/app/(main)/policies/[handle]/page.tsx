import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPolicyByHandle } from '@/lib/shopify/policies';
import { Breadcrumb } from '@/components/layout/Breadcrumb';

const VALID_HANDLES = [
  'privacy-policy',
  'refund-policy',
  'terms-of-service',
  'shipping-policy',
] as const;

type PolicyHandle = (typeof VALID_HANDLES)[number];

function isPolicyHandle(handle: string): handle is PolicyHandle {
  return VALID_HANDLES.includes(handle as PolicyHandle);
}

export async function generateStaticParams() {
  return VALID_HANDLES.map((handle) => ({ handle }));
}

interface PolicyPageProps {
  params: Promise<{ handle: string }>;
}

export async function generateMetadata({ params }: PolicyPageProps): Promise<Metadata> {
  const { handle } = await params;
  if (!isPolicyHandle(handle)) return { title: 'Policy not found' };

  const policy = await getPolicyByHandle(handle);
  if (!policy) return { title: 'Policy not found' };

  return {
    title: policy.title,
    description: `Studiofile ${policy.title} — read our full policy.`,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/policies/${handle}`,
    },
  };
}

export default async function PolicyPage({ params }: PolicyPageProps) {
  const { handle } = await params;

  if (!isPolicyHandle(handle)) notFound();

  const policy = await getPolicyByHandle(handle);
  if (!policy) notFound();

  return (
    <main id="main-content" className="section-padding">
      <div className="container-narrow">
        <div className="mb-10">
          <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: policy.title }]} />
        </div>

        <header className="mb-12 pb-8 border-b border-border">
          <h1 className="font-display text-4xl md:text-5xl leading-tight tracking-tight">
            {policy.title}
          </h1>
        </header>

        {policy.body ? (
          <div
            className="text-sm text-ink/80 leading-relaxed [&_p]:mb-5 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:mt-10 [&_h2]:mb-4 [&_h3]:text-xs [&_h3]:uppercase [&_h3]:tracking-widest [&_h3]:mt-8 [&_h3]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_li]:mb-1 [&_a]:underline [&_a]:hover:text-accent [&_a]:transition-colors"
            dangerouslySetInnerHTML={{ __html: policy.body }}
          />
        ) : (
          <p className="text-muted text-sm">Policy content is not available at this time.</p>
        )}
      </div>
    </main>
  );
}

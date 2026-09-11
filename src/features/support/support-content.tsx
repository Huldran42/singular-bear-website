import { contactEmail, paypalUrl } from '@/lib/site';

const faqs = [
  {
    q: 'Where do I buy the packs?',
    a: 'Purchases are completed on the Unity Asset Store. This site is the studio vitrine, documentation and demo hub.',
  },
  {
    q: 'Which render pipelines are supported?',
    a: 'Each product page lists Built-in, URP and HDRP compatibility. Pro Glass Shader targets URP.',
  },
  {
    q: 'How do I report an import issue?',
    a: `Email ${contactEmail} with the Unity version, active render pipeline and a short description of the result.`,
  },
];

export function SupportContent() {
  return (
    <div className="mx-auto max-w-[1400px] px-5 pb-24 pt-32 sm:px-8 lg:px-12">
      <p className="font-mono text-sm text-studio-accent">Support</p>
      <h1 className="font-heading mt-4 text-4xl font-semibold tracking-[-0.03em] sm:text-6xl">
        We stay close to the work.
      </h1>
      <p className="mt-5 max-w-2xl text-base leading-relaxed text-studio-muted">
        Import questions, pipeline mismatches and documentation gaps can be sent
        directly to the studio.
      </p>

      <div className="mt-10 flex flex-wrap gap-3">
        <a
          href={`mailto:${contactEmail}`}
          className="inline-flex h-11 items-center rounded-full bg-studio-accent px-5 text-sm font-semibold text-studio-accent-foreground"
        >
          Email the studio
        </a>
        {paypalUrl ? (
          <a
            href={paypalUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 items-center rounded-full border border-studio-line px-5 text-sm font-semibold text-studio-text"
          >
            Support via PayPal
          </a>
        ) : null}
      </div>

      <dl className="mt-14 grid gap-5 md:grid-cols-3">
        {faqs.map((item) => (
          <div
            key={item.q}
            className="rounded-[16px] border border-studio-line bg-studio-surface p-6"
          >
            <dt className="font-semibold text-studio-text">{item.q}</dt>
            <dd className="mt-3 text-sm leading-relaxed text-studio-muted">
              {item.a}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

import { InsightsLoginForm } from '@/features/insights/login-form';
import { insightsConfigured } from '@/lib/insights/auth';

export const metadata = {
  title: 'Insights',
  robots: { index: false, follow: false },
};

export default function InsightsLoginPage() {
  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-studio-bg px-5 text-studio-text">
      <div className="w-full max-w-sm">
        <p className="font-mono text-sm text-studio-accent">Private</p>
        <h1 className="font-heading mt-3 text-3xl font-semibold tracking-[-0.03em]">
          Insights
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-studio-muted">
          Studio-only. Not linked from the public site.
        </p>
        {insightsConfigured() ? (
          <InsightsLoginForm />
        ) : (
          <p className="mt-8 rounded-[16px] border border-studio-line bg-studio-surface p-4 text-sm text-studio-muted">
            Set <code className="text-studio-text">INSIGHTS_PASSWORD</code> in
            `.env.local`, then restart the server.
          </p>
        )}
      </div>
    </main>
  );
}

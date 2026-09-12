'use client';

import { useState, type FormEvent } from 'react';

export function InsightsLoginForm() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError(false);
    const response = await fetch('/api/insights/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    setPending(false);
    if (!response.ok) {
      setError(true);
      return;
    }
    window.location.assign('/insights');
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 grid gap-3">
      <label className="text-sm font-medium">
        Password
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-2 h-12 w-full rounded-full border border-studio-line bg-studio-surface px-4 text-studio-text outline-none focus-visible:ring-2 focus-visible:ring-studio-accent/70"
        />
      </label>
      {error ? (
        <p className="text-sm text-red-400">That password does not match.</p>
      ) : null}
      <button type="submit" className="sb-btn sb-btn-primary" disabled={pending}>
        {pending ? 'Checking…' : 'Enter'}
      </button>
    </form>
  );
}

'use client';

export function InsightsLogoutButton() {
  async function onClick() {
    await fetch('/api/insights/logout', { method: 'POST' });
    window.location.assign('/insights/login');
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="text-sm font-medium text-studio-muted hover:text-studio-text"
    >
      Log out
    </button>
  );
}

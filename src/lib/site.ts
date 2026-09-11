export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  'https://singular-bear-studio.g-pivaut.chatgpt.site'
).replace(/\/$/, '');

// TODO: replace with the real PayPal.me link or hosted donate button URL.
export const paypalUrl = 'https://paypal.me/REPLACE_ME';

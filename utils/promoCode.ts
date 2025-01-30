export function generatePromoCode(email: string): string {
  // Generate a unique promo code based on timestamp and email
  const timestamp = new Date().getTime().toString(36);
  const emailHash = email
    .split('')
    .reduce((acc, char) => ((acc << 5) - acc) + char.charCodeAt(0), 0)
    .toString(36);
  return `PROMO10-${timestamp.slice(-4)}${emailHash.slice(-4)}`.toUpperCase();
}

// Username rules. The landing page and the runner page both use these,
// so the rules live in exactly one place.

export const MIN_LEN = 3;
export const MAX_LEN = 20;

// Names that would clash with our own pages or subdomains.
// ("test" is intentionally NOT here while the sample shirt's QR points at /test.)
const RESERVED = new Set([
  "shop", "store", "edit", "admin", "www", "api", "cart", "checkout",
  "privacy", "terms", "about", "help", "support", "login", "logout",
  "account", "delete", "contact", "mail", "email", "static", "assets",
  "robots", "sitemap", "favicon",
]);

export function normalize(input: string): string {
  return input.trim().replace(/^[@/]+/, "").toLowerCase();
}

export function isValid(name: string): boolean {
  return new RegExp(`^[a-z0-9_]{${MIN_LEN},${MAX_LEN}}$`).test(name);
}

export function isReserved(name: string): boolean {
  return RESERVED.has(name);
}

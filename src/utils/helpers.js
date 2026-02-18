// ─── Utilities ────────────────────────────────────────────────────────────────

/**
 * Derives a display name from an email address.
 * e.g. "alex.morgan@example.com" → "Alex Morgan"
 */
export const nameFromEmail = (email) =>
    email
        .split("@")[0]
        .replace(/[._\-+]/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())
        .trim() || email;

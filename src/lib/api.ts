/**
 * Core API barrel export.
 *
 * Preserves 100% backward compatibility for all imports from "@/lib/api".
 *
 * Recommended imports for new features:
 * - Transport / Client / Tokens: `@/lib/api-client`
 * - Domain Services: `@/services` or `@/services/{module}` (e.g. `@/services/auth`)
 */

export * from "./api-client";
export * from "@/services/auth";
export * from "@/services/tenants";
export * from "@/services/password-recovery";

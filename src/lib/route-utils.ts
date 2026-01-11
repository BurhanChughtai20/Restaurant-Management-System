import { notFound } from "next/navigation";

// --- Route Validation Utilities ---

/**
 * Validates and sanitizes route parameters
 */
export function validateSlug(slug: string | string[] | undefined): string | null {
  if (!slug) return null;
  const slugString = Array.isArray(slug) ? slug[0] : slug;
  
  // Validate slug format (alphanumeric, hyphens, underscores)
  if (!/^[a-z0-9-_]+$/i.test(slugString)) {
    return null;
  }
  
  // Limit slug length
  if (slugString.length > 100) {
    return null;
  }
  
  return slugString;
}

/**
 * Safe route parameter extraction with validation
 */
export function getValidatedParam(
  params: Promise<Record<string, string | string[] | undefined>>,
  key: string
): Promise<string> {
  return params.then((p) => {
    const value = validateSlug(p[key]);
    if (!value) {
      notFound();
    }
    return value;
  });
}

/**
 * Route caching configuration
 */
export const routeConfig = {
  revalidate: 3600, // Revalidate every hour
  dynamic: "force-static" as const,
};

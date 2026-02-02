import { notFound } from "next/navigation";

export function validateSlug(slug: string | string[] | undefined): string | null {
  if (!slug) return null;
  const slugString = Array.isArray(slug) ? slug[0] : slug;
  
  if (!/^[a-z0-9-_]+$/i.test(slugString)) {
    return null;
  }
  
  if (slugString.length > 100) {
    return null;
  }
  
  return slugString;
}

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
export const routeConfig = {
  revalidate: 3600,
  dynamic: "force-static" as const,
};

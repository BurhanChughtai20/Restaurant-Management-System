import prisma from "../../libs/prisma.ts";
import {
  generateCacheKey,
  getCachedData,
  setCachedData,
} from "../../libs/redisCache.ts";

export async function searchArticle(keyword: string) {
  if (!keyword) return [];

  // Generate cache key for article search
  const cacheKey = generateCacheKey("search:articles", { keyword });

  // Check if data exists in Redis cache
  const cachedResult = await getCachedData(cacheKey);
  if (cachedResult) {
    return cachedResult;
  }

  const articles = await prisma.article.findMany({
    where: {
      OR: [
        { title: { contains: keyword, mode: "insensitive" } },
        { description: { contains: keyword, mode: "insensitive" } },
        { restaurantName: { contains: keyword, mode: "insensitive" } },
      ],
    },
    orderBy: { createdAt: "desc" },
    take: 10,
    include: {
      publisher: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  // Cache the result for 3 minutes
  await setCachedData(cacheKey, articles);

  return articles;
}

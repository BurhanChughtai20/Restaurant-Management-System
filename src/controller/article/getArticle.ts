import prisma from "../../libs/prisma.ts";

export async function getArticle(page: number = 1, limit: number = 10) {
  const skip = (page - 1) * limit;

  const [articles, totalArticles] = await Promise.all([
    prisma.article.findMany({
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        publisher: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    }),
    prisma.article.count(),
  ]);

  const totalPages = Math.ceil(totalArticles / limit);

  return {
    articles,
    pagination: {
      totalArticles,
      totalPages,
      currentPage: page,
      perPage: limit,
    },
  };
}

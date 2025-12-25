import prisma from "../../libs/prisma.ts";

export async function searchArticle(keyword: string) {
  if (!keyword) return [];

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

  return articles;
}

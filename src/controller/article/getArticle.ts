import prisma from "../../libs/prisma.ts";

export async function getArticle() {
  const articles = await prisma.article.findMany({
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
  });

  return articles;
}

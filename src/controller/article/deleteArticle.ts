import prisma from "../../libs/prisma.ts";

export async function deleteArticle(id: number) {
  if (!id) throw new Error("Article ID is required");

  const deletedArticle = await prisma.article.delete({
    where: { id },
  });

  return deletedArticle;
};
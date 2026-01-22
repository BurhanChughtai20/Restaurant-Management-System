import type { FastifyRequest } from "fastify";
import prisma from "../../libs/prisma.ts";
import { uploadImage } from "../../utils/imageUploader.ts";
import { Prisma } from "@prisma/client";
import { UpdateArticleBody } from "../../shared/index.ts";

export async function updateArticle(
  req: FastifyRequest<{ Params: { id: string }; Body: UpdateArticleBody }>,
) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    throw new Error("Invalid article ID");
  }

  const {
    title,
    description,
    metaTitle,
    metaDescription,
    openingHours,
    socialLinks,
    isPublished,
    image,
  } = req.body;

  const data: Prisma.ArticleUpdateInput = {
    ...(title !== undefined && { title: title.trim() }),
    ...(description !== undefined && { description: description.trim() }),
    ...(metaTitle !== undefined && {
      metaTitle: metaTitle?.trim() ?? null,
    }),
    ...(metaDescription !== undefined && {
      metaDescription: metaDescription?.trim() ?? null,
    }),
    ...(openingHours !== undefined && {
      openingHours: openingHours ?? null,
    }),
    ...(socialLinks !== undefined && {
      socialLinks: socialLinks ? JSON.stringify(socialLinks) : null,
    }),
    ...(isPublished !== undefined && { isPublished }),
  };

  if (image !== undefined) {
    data.image =
      typeof image === "string"
        ? image
        : await uploadImage(image, { folder: "articles" });
  }

  return prisma.article.update({
    where: { id },
    data,
  });
}

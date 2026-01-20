import type { FastifyRequest } from "fastify";
import prisma from "../../libs/prisma.ts";
import { uploadImage } from "../../utils/imageUploader.ts";
import type { CreateArticleBody } from "../../types/article.types.ts";

export async function createArticle(
  req: FastifyRequest<{ Body: CreateArticleBody }>
) {
  const user = req.user as { id: number };

  const {
    title,
    description,
    image,
    restaurantId,
    metaTitle,
    metaDescription,
    openingHours,
    socialLinks,
    isPublished = false,
  } = req.body;

  if (!title?.trim()) throw new Error("Title is required");
  if (!description?.trim()) throw new Error("Description is required");

  const imageUrl = image
    ? await uploadImage(image, { folder: "articles" })
    : null;

  return prisma.article.create({
    data: {
      title: title.trim(),
      description: description.trim(),
      metaTitle: metaTitle?.trim() ?? title.trim(),
      metaDescription:
        metaDescription?.trim() ?? description.slice(0, 150),

      openingHours: openingHours ?? null,
      socialLinks: socialLinks ? JSON.stringify(socialLinks) : null,
      image: imageUrl,

      isPublished,
      publisherId: user.id,
      restaurantId,
    },
  });
}

import type { FastifyRequest } from "fastify";
import prisma from "../../libs/prisma.ts";
import { uploadImage } from "../../utils/imageUploader.ts";
import { generateArticleAI } from "../ai/generateArticle.ts";
import { AutoArticleBody } from "../../shared/index.ts";

export async function autoCreateArticle(
  req: FastifyRequest<{ Body: AutoArticleBody }>,
) {
  const user = req.user as { id: number };

  const {
    title,
    restaurantId,
    keywords,
    address,
    mapLink,
    phoneNumber,
    image,
    isPublished,
  } = req.body;

  // Generate AI content
  const aiArticle = await generateArticleAI({
    title,
    restaurantName: "dummy", // optional, for AI prompt
    ...(keywords && { keywords }),
    ...(address && { address }),
    ...(phoneNumber && { phoneNumber }),
    ...(mapLink && { mapLink }),
  });

  // Upload image if provided
  const imageUrl: string | null = image
    ? await uploadImage(image, { folder: "articles" })
    : null;

  // Prisma-safe creation
  const article = await prisma.article.create({
    data: {
      title: aiArticle.title,
      description: aiArticle.description,
      metaTitle: aiArticle.metaTitle ?? aiArticle.title,
      metaDescription:
        aiArticle.metaDescription ?? aiArticle.description.slice(0, 150),
      openingHours: aiArticle.openingHours ?? null,
      socialLinks: aiArticle.socialLinks
        ? JSON.stringify(aiArticle.socialLinks)
        : null,
      image: imageUrl,
      isPublished: isPublished ?? false,
      publisherId: user.id,
      restaurantId, // Use directly
    },
  });

  return article;
}

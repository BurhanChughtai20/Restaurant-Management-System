import { FastifyRequest } from "fastify";
import prisma from "../../libs/prisma.ts";
import { uploadImage } from "../../utils/imageUploader.ts";
import { generateArticleAI } from "../../ai/generateArticle.ts";

interface AutoArticleBody {
  title: string;
  restaurantName: string;
  keywords?: string;
  address?: string;
  mapLink?: string;
  phoneNumber?: string;
  image?: string | Buffer;
  isPublished?: boolean;
}

export async function autoCreateArticle(
  req: FastifyRequest<{ Body: AutoArticleBody }>
) {
  const user = req.user as { id: number };

const aiArticle = await generateArticleAI({
  title: req.body.title,
  restaurantName: req.body.restaurantName,
  ...(req.body.keywords && { keywords: req.body.keywords }),
  ...(req.body.address && { address: req.body.address }),
  ...(req.body.phoneNumber && { phoneNumber: req.body.phoneNumber }),
  ...(req.body.mapLink && { mapLink: req.body.mapLink }),
});


  let imageUrl: string | null = null;
  if (req.body.image) {
    imageUrl = await uploadImage(req.body.image, {
      folder: "articles",
    });
  }

  const article = await prisma.article.create({
    data: {
      title: aiArticle.title,
      description: aiArticle.description,
      metaTitle: aiArticle.metaTitle,
      metaDescription: aiArticle.metaDescription,
      keywords: aiArticle.keywords,
      openingHours: aiArticle.openingHours ?? null,
      socialLinks: aiArticle.socialLinks ?? null,

      restaurantName: req.body.restaurantName,
      address: req.body.address ?? null,
      mapLink: req.body.mapLink ?? null,
      phoneNumber: req.body.phoneNumber ?? null,

      image: imageUrl,
      isPublished: req.body.isPublished ?? false,
      publisherId: user.id,
    },
  });

  return article;
}

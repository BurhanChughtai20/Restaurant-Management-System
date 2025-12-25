import { FastifyRequest } from "fastify";
import prisma from "../../libs/prisma.ts";
import { uploadImage } from "../../utils/imageUploader.ts";

interface CreateArticleBody {
  title: string;
  description: string;
  image?: string | Buffer;
  restaurantName: string;
  restaurantWebsite?: string;

  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  address?: string;
  mapLink?: string;
  phoneNumber?: string;
  openingHours?: string;
  socialLinks?: Record<string, string>;

  isPublished?: boolean;
}

export async function createArticle(req: FastifyRequest<{ Body: CreateArticleBody }>) {
  const {
    title,
    description,
    image,
    restaurantName,
    restaurantWebsite,
    metaTitle,
    metaDescription,
    keywords,
    address,
    mapLink,
    phoneNumber,
    openingHours,
    socialLinks,
    isPublished = false,
  } = req.body;

  if (!title || !description || !restaurantName) {
    throw new Error("Title, description, and restaurant name are required");
  }

  const user = req.user as { id: number };

  let imageUrl: string | null = null;
  if (image) {
    try {
      imageUrl = await uploadImage(image, { folder: "articles" });
    } catch (err: any) {
      throw new Error("Failed to upload image: " + err.message);
    }
  }

  const seoTitle = metaTitle || title;
  const seoDescription = metaDescription || description.slice(0, 150);

  const article = await prisma.article.create({
    data: {
      title,
      description,
      image: imageUrl,
      restaurantName,
      restaurantWebsite: restaurantWebsite ?? null,
      metaTitle: seoTitle,
      metaDescription: seoDescription,
      keywords: keywords ?? null,
      address: address ?? null,
      mapLink: mapLink ?? null,
      phoneNumber: phoneNumber ?? null,
      openingHours: openingHours ?? null,
      socialLinks: socialLinks ?? null,
      isPublished,
      publisherId: user.id,
    },
  });

  return article;
}

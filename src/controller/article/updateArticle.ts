import { FastifyRequest } from "fastify";
import prisma from "../../libs/prisma.ts";
import { uploadImage } from "../../utils/imageUploader.ts";

interface UpdateArticleBody {
  title?: string;
  description?: string;
  image?: string | Buffer;
  restaurantName?: string;
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

export async function updateArticle(
  req: FastifyRequest<{ Params: { id: string }; Body: UpdateArticleBody }>
) {
  const { id } = req.params;
  const body = req.body;

  if (!id) throw new Error("Article ID is required");

  if (body.image) {
    try {
      const imageUrl = await uploadImage(body.image, { folder: "articles" });
      body.image = imageUrl;
    } catch (err: any) {
      throw new Error("Failed to upload image: " + err.message);
    }
  }

  const data: Record<string, any> = {};
  Object.entries(body).forEach(([key, value]) => {
    if (value !== undefined) data[key] = value;
  });

  const updatedArticle = await prisma.article.update({
    where: { id: Number(id) },
    data,
  });

  return updatedArticle;
}


export interface Article {
  id: number;
  title: string;
  description: string;
}

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  website?: string;
}

export interface CreateArticleBody {
  restaurantId: number;
  title: string;
  description: string;

  metaTitle?: string;
  metaDescription?: string;
  openingHours?: string;

  socialLinks?: SocialLinks;
  image?: string | Buffer;

  isPublished?: boolean;
}

export interface UpdateArticleBody {
  title?: string;
  description?: string;

  metaTitle?: string;
  metaDescription?: string;
  openingHours?: string;

  socialLinks?: SocialLinks;
  image?: string | Buffer;

  isPublished?: boolean;
}

export interface AutoArticleBody {
  restaurantId: number;
  title: string;

  keywords?: string;
  address?: string;
  mapLink?: string;
  phoneNumber?: string;

  image?: string | Buffer;
  isPublished?: boolean;
}

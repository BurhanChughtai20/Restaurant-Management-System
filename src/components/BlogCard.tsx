"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";

export interface Article {
  id: string;
  restaurantId: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  isPublished: boolean;
  createdAt: string;
}

interface BlogCardProps {
  blog: Article;
}


export default function BlogCard({ blog }: BlogCardProps) {
  // Truncate description to 300 characters
  const truncatedDescription = blog.description.length > 300 
    ? blog.description.substring(0, 300) + "..." 
    : blog.description;

  return (
    <Link href={`/blog/${blog.slug}`} className="block w-full">
      <CardContainer className="inter-var w-full">
        <CardBody className="bg-gray-50 relative group/card dark:bg-black dark:border-white/20 border-black/10 w-full sm:w-[350px] md:w-[380px] lg:w-96 h-full min-h-[500px] rounded-xl p-5 border flex flex-col justify-between">
          <div>
            <CardItem translateZ="50" className="text-lg font-semibold text-neutral-600 dark:text-white line-clamp-2">
              {blog.title}
            </CardItem>

            <CardItem translateZ="100" className="w-full mt-4">
              <Image
                src={blog.image}
                height={600}
                width={600}
                className="h-48 sm:h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
                alt={blog.title}
              />
            </CardItem>

            <CardItem as="p" translateZ="60" className="text-neutral-500 text-sm mt-4 dark:text-neutral-300 line-clamp-4">
              {truncatedDescription}
            </CardItem>
          </div>

          <div className="flex justify-between items-center mt-6">
            <CardItem translateZ={20} as="span" className="px-2 py-2 text-xs font-normal dark:text-white">
              Read more →
            </CardItem>
            <CardItem translateZ={20} as="button" className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold">
              View Blog
            </CardItem>
          </div>
        </CardBody>
      </CardContainer>
    </Link>
  );
}
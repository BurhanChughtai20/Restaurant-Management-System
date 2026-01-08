import React from "react";
import Image from "next/image";
import BlogImg from "../../public/blogImg.svg";

export function BlogHeroImage() {
  return (
    <div className="relative w-full h-full overflow-hidden rounded-xl">
      <Image
        src={BlogImg}
        alt="Blog Hero Image"
        fill
        className="object-cover"
      />
    </div>
  );
}

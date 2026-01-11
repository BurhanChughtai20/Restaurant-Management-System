import React from "react";
import Image from "next/image";
import BlogImg from "../../public/blogImg.svg";

// --- Dynamic Tailwind Classes ---
const classes = {
  container: "relative w-full h-full overflow-hidden rounded-xl",
  image: "object-cover",
};

export function BlogHeroImage() {
  return (
    <div className={classes.container}>
      <Image
        src={BlogImg}
        alt="Blog Hero Image"
        fill
        className={classes.image}
      />
    </div>
  );
}

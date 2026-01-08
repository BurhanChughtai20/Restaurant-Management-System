import { IconBrand4chan, IconBrandFacebook, IconBrandInstagram } from "@tabler/icons-react";
import Link from "next/link";
import ButtonCom from "./Button";
import { ArrowRight } from "lucide-react";

export const NewsletterInput = () => (
  <div className="mt-4 flex flex-col space-y-2">
    <p className="text-sm text-neutral-400 mb-2">Be the first to read our articles.</p>
    <div className="flex flex-col md:flex-row items-center gap-3 md:gap-2">
  <input 
    type="email" 
    placeholder="Enter your email" 
    className="w-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg py-2 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-700 dark:text-white"
  /> 
  
  {/* The button container */}
  <div className="w-full md:w-auto flex justify-center">
    <ButtonCom
      icon={<ArrowRight size={16} />}
      iconPosition="right"
      text="Get Started"
      type="default"
      className="my-primary-btn w-full md:w-max" // w-full for mobile, natural width for desktop
      onClick={() => alert("Started")}
    />
  </div>
</div>
  </div>
);

export const SocialLinks = () => (
  <div className="mt-4 flex flex-col space-y-2">
    <p className="text-sm text-neutral-400 mb-2">Follow us and don&apos;t miss a thing.</p>
    {[
      { name: "Twitter", icon: <IconBrand4chan size={18} />, link: "#" },
      { name: "Instagram", icon: <IconBrandInstagram size={18} />, link: "#" },
       { name: "Facebook", icon: <IconBrandFacebook size={18} />, link: "#" },
    ].map((social) => (
      <Link
        key={social.name}
        href={social.link}
        className="flex items-center justify-between w-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-3 rounded-xl hover:bg-neutral-200 dark:hover:bg-neutral-800 transition group/link"
      >
        <div className="flex items-center gap-3">
          <span className="dark:text-white">{social.icon}</span>
          <span className="text-sm font-medium dark:text-neutral-200">{social.name}</span>
        </div>
        <ArrowRight size={16} className="text-neutral-500 group-hover/link:translate-x-1 transition-transform" />
      </Link>
    ))}
  </div>
);
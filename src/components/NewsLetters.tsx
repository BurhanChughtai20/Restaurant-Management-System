import { IconBrand4chan, IconBrandFacebook, IconBrandInstagram } from "@tabler/icons-react";
import Link from "next/link";
import ButtonCom from "./Button";
import { ArrowRight } from "lucide-react";

// --- Dynamic Tailwind Classes ---
const classes = {
  newsletterContainer: "mt-4 flex flex-col space-y-2",
  newsletterText: "text-sm text-neutral-400 mb-2",
  newsletterForm: "flex flex-col md:flex-row items-center gap-3 md:gap-2",
  newsletterInput: "w-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg py-2 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-700 dark:text-white",
  buttonWrapper: "w-full md:w-auto flex justify-center",
  socialContainer: "mt-4 flex flex-col space-y-2",
  socialText: "text-sm text-neutral-400 mb-2",
  socialLink: "flex items-center justify-between w-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-3 rounded-xl hover:bg-neutral-200 dark:hover:bg-neutral-800 transition group/link",
  socialLinkContent: "flex items-center gap-3",
  socialIcon: "dark:text-white",
  socialName: "text-sm font-medium dark:text-neutral-200",
  socialArrow: "text-neutral-500 group-hover/link:translate-x-1 transition-transform",
};

export const NewsletterInput = () => (
  <div className={classes.newsletterContainer}>
    <p className={classes.newsletterText}>Be the first to read our articles.</p>
    <div className={classes.newsletterForm}>
  <input 
    type="email" 
    placeholder="Enter your email" 
    className={classes.newsletterInput}
  /> 
  
  {/* The button container */}
  <div className={classes.buttonWrapper}>
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
  <div className={classes.socialContainer}>
    <p className={classes.socialText}>Follow us and don&apos;t miss a thing.</p>
    {[
      { name: "Twitter", icon: <IconBrand4chan size={18} />, link: "#" },
      { name: "Instagram", icon: <IconBrandInstagram size={18} />, link: "#" },
       { name: "Facebook", icon: <IconBrandFacebook size={18} />, link: "#" },
    ].map((social) => (
      <Link
        key={social.name}
        href={social.link}
        className={classes.socialLink}
      >
        <div className={classes.socialLinkContent}>
          <span className={classes.socialIcon}>{social.icon}</span>
          <span className={classes.socialName}>{social.name}</span>
        </div>
        <ArrowRight size={16} className={classes.socialArrow} />
      </Link>
    ))}
  </div>
);

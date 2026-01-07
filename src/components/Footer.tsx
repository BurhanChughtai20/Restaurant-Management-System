"use client";
import Link from "next/link";
import React from "react";
import { UtensilsCrossed, Send, Mail } from "lucide-react";
import DynamicContent from "./Title";
import ButtonCom from "./Button";
 
// 1. Centralized Data for easy management
const FOOTER_DATA = {
  brand: {
    name: "RestaurantHub",
    description: "Empowering restaurant owners with cutting-edge management tools and expert industry insights to scale your business.",
  },
  sections: [
    {
      title: "Company",
      links: [
        { label: "About us", href: "/about" },
        { label: "Blogs", href: "/blog", badge: "Blogs" },
        { label: "Contact us", href: "/contact" },
       ],
    },
  ],
  newsletter: {
    title: "Subscribe to our newsletter",
    description: "The latest news and operational resources, sent to your inbox weekly.",
    placeholder: "Enter your email",
    buttonText: "Subscribe",
  },
  copyright: "All Rights Reserved.",
};

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="px-6 md:px-20 lg:px-24 w-full text-sm text-slate-500 bg-white pt-16 border-t border-slate-100">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-14 pb-10">
        
        {/* Brand & Description */}
        <div className="sm:col-span-2 lg:col-span-1">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-200 transition-colors">
              <UtensilsCrossed className="w-6 h-6 text-black" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">
              {FOOTER_DATA.brand.name}
            </span>
          </Link>
          
          <DynamicContent as="p" className="text-sm/7 mt-6 max-w-sm text-slate-500">
            {FOOTER_DATA.brand.description}
          </DynamicContent>
        </div>

        {FOOTER_DATA.sections.map((section, idx) => (
          <div key={idx} className="flex flex-col lg:items-center lg:justify-start">
            <div className="flex flex-col text-sm space-y-3">
              <h2 className="font-semibold mb-2 text-gray-900 uppercase tracking-wider text-xs">
                {section.title}
              </h2>
              {section.links.map((link, linkIdx) => (
                <Link 
                  key={linkIdx} 
                  href={link.href} 
                  className="hover:text-indigo-600 transition-colors flex items-center"
                >
                  {link.label}
                  {link.badge && (
                    <span className="text-[10px] font-bold text-white bg-orange-600 rounded-full ml-2 px-2 py-0.5">
                      {link.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        ))}

        {/* Newsletter */}
        <div>
          <h2 className="font-semibold text-gray-900 mb-4 uppercase tracking-wider text-xs">
            {FOOTER_DATA.newsletter.title}
          </h2>
          <div className="text-sm space-y-4 max-w-sm">
            <DynamicContent as="p" className="text-slate-500">
              {FOOTER_DATA.newsletter.description}
            </DynamicContent>
            
            <form 
              onSubmit={(e) => e.preventDefault()} 
              className="flex flex-col sm:flex-row gap-2"
            >
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  className="w-full bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none py-2.5 pl-10 pr-3 rounded-lg transition-all" 
                  type="email" 
                  placeholder={FOOTER_DATA.newsletter.placeholder} 
                  required
                />
              </div>
              <ButtonCom 
  text="Subscribe" 
  type="default" 
  className=""
  color=""
  icon={<Send size={16} />} 
  iconPosition="right" 
  onClick={() => alert('Subscribed!')}
/>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="py-8 text-center border-t border-slate-100 mt-6">
        <p className="text-slate-400">
          Copyright {currentYear} ©{" "}
          <span className="text-gray-900 font-medium">{FOOTER_DATA.brand.name}</span>{" "}
          {FOOTER_DATA.copyright}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
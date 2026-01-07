"use client";

import { Accordion, AccordionItem } from "@heroui/react";
import faqs from "@/data/faqs.json";
import DynamicContent from "./Title";
 
export default function AccordionCom() {
    const faqTitle = ["Frequently Asked Questions"]
  return (
    <div className="relative mx-auto my-16 sm:px-10 flex max-w-7xl flex-col items-center justify-center  ">
      {/* Optional Header for the FAQ Section */}
      <div className="mb-5 text-center">
        <DynamicContent as="h2" className="text-xl md:text-4xl font-semibold mb-4">
          {faqTitle}
        </DynamicContent>
      </div>

      <Accordion 
        variant="splitted" 
        className="w-full text-center md:text-start"
        selectionMode="multiple"
      >
        {faqs.map((faq) => (
          <AccordionItem
            key={faq.id}
            aria-label={faq.question}
            // Title wrapped in DynamicContent as h6
            title={
              <DynamicContent as="h6" className="text-lg md:text-xl font-semibold text-gray-900 cursor-pointer">
                {faq.question}
              </DynamicContent>
            }
          >
            {/* Content wrapped in DynamicContent as p */}
            <DynamicContent as="p" className="text-base md:text-lg text-gray-600 pb-4 leading-relaxed border-b border-gray-400">
              {faq.answer}
            </DynamicContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
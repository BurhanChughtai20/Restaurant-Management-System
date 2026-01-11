"use client";

import { Accordion, AccordionItem } from "@heroui/react";
import faqs from "@/data/faqs.json";
import DynamicContent from "./Title";

// --- Dynamic Tailwind Classes ---
const classes = {
  container: "relative mx-auto my-16 sm:px-10 flex max-w-7xl flex-col items-center justify-center",
  header: "mb-5 text-center",
  title: "text-xl md:text-4xl font-semibold mb-4",
  accordion: "w-full text-start",
  questionTitle: "text-lg md:text-xl font-semibold text-gray-900 cursor-pointer",
  answerText: "text-base md:text-lg text-gray-600 pb-4 leading-relaxed border-b border-gray-400",
};
 
export default function AccordionCom() {
    const faqTitle = ["Frequently Asked Questions"]
  return (
    <div className={classes.container}>
      {/* Optional Header for the FAQ Section */}
      <div className={classes.header}>
        <DynamicContent as="h2" className={classes.title}>
          {faqTitle}
        </DynamicContent>
      </div>

      <Accordion 
        variant="splitted" 
        className={classes.accordion}
        selectionMode="multiple"
      >
        {faqs.map((faq) => (
          <AccordionItem
            key={faq.id}
            aria-label={faq.question}
            title={
              <DynamicContent as="h6" className={classes.questionTitle}>
                {faq.question}
              </DynamicContent>
            }
          >
            {/* Content wrapped in DynamicContent as p */}
            <DynamicContent as="p" className={classes.answerText}>
              {faq.answer}
            </DynamicContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

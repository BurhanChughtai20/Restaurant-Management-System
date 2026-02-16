"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import faqs from "@/data/faqs.json";
import DynamicContent from "./Title";
import { cn } from "@/lib/utils";

const classes = {
  container:
    "relative mx-auto my-16 sm:px-10 flex max-w-7xl flex-col items-center justify-center",
  header: "mb-5 text-center",
  title: "text-xl md:text-4xl font-semibold mb-4",
  accordion: "w-full text-start flex flex-col gap-2",
  item: "rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden",
  trigger:
    "w-full flex items-center justify-between gap-4 px-4 py-4 text-left hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors",
  questionTitle:
    "text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100 cursor-pointer flex-1",
  chevron: "shrink-0 transition-transform duration-200 text-neutral-500",
  content: "border-t border-neutral-200 dark:border-neutral-800",
  answerText:
    "text-base md:text-lg text-gray-600 dark:text-gray-400 px-4 py-4 leading-relaxed",
};

export default function AccordionCom() {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const faqTitle = "Frequently Asked Questions";

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <DynamicContent as="h2" className={classes.title}>
          {faqTitle}
        </DynamicContent>
      </div>

      <div className={classes.accordion} role="region" aria-label="FAQ">
        {faqs.map((faq: { id: string; question: string; answer: string }) => (
          <div key={faq.id} className={classes.item}>
            <button
              type="button"
              onClick={() => toggle(faq.id)}
              className={classes.trigger}
              aria-expanded={openIds.has(faq.id)}
              aria-controls={`faq-${faq.id}`}
              id={`faq-trigger-${faq.id}`}
              aria-label={faq.question}
            >
              <DynamicContent as="h6" className={classes.questionTitle}>
                {faq.question}
              </DynamicContent>
              <ChevronDown
                size={20}
                className={cn(classes.chevron, openIds.has(faq.id) && "rotate-180")}
              />
            </button>
            <div
              id={`faq-${faq.id}`}
              role="region"
              aria-labelledby={`faq-trigger-${faq.id}`}
              hidden={!openIds.has(faq.id)}
              className={classes.content}
            >
              <DynamicContent as="p" className={classes.answerText}>
                {faq.answer}
              </DynamicContent>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

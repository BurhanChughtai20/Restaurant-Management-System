import { cn } from "@/lib/utils";

// --- Dynamic Tailwind Classes ---
const classes = {
  bentoGrid: "mx-auto grid max-w-7xl grid-cols-1 gap-4 md:auto-rows-[18rem] md:grid-cols-3",
  bentoItem: "group/bento shadow-input row-span-1 flex flex-col justify-between space-y-4 rounded-xl border border-neutral-200 bg-white p-4 transition duration-200 hover:shadow-xl dark:border-white/[0.2] dark:bg-black dark:shadow-none",
  bentoContent: "transition duration-200 group-hover/bento:translate-x-2",
  bentoTitle: "mt-2 mb-2 font-sans font-bold text-neutral-600 dark:text-neutral-200",
  bentoDescription: "font-sans text-xs font-normal text-neutral-600 dark:text-neutral-300",
};

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        classes.bentoGrid,
        className,
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        classes.bentoItem,
        className,
      )}
    >
      {header}
      <div className={classes.bentoContent}>
        {icon}
        <div className={classes.bentoTitle}>
          {title}
        </div>
        <div className={classes.bentoDescription}>
          {description}
        </div>
      </div>
    </div>
  );
};

import { Metadata } from "next";
import dynamic from "next/dynamic";
import { generatePageMetadata } from "@/lib/metadata";

const TrustedBy = dynamic(() => import("@/components/TrustedBy"), {
  loading: () => <div className="min-h-[400px]" />,
  ssr: true,
});

const classes = {
  container: "pt-20 md:pt-24",
};

export const metadata: Metadata = generatePageMetadata({
  title: "Trusted By",
  description:
    "Trusted by thousands of teams. See why restaurants choose us for their management needs.",
  path: "/trusted-by",
});

export const revalidate = 3600;

const TrustedByPage = () => {
  return (
    <div className={classes.container}>
      <TrustedBy />
    </div>
  );
};

export default TrustedByPage;

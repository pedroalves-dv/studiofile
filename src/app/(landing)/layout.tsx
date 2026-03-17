import { ReactNode } from "react";
import { SmoothScroll } from "@/components/common/SmoothScroll";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SmoothScroll>{children}</SmoothScroll>;
}

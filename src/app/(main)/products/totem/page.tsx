import type { Metadata } from "next";
import { TotemConfigurator } from "@/components/product/TotemConfigurator";

export const metadata: Metadata = {
  title: "Totem — Build Your Lamp | Studiofile",
  description:
    "Design your custom modular lamp. Choose shapes, colors, cable, and fixation. Made to order in Paris.",
  openGraph: {
    title: "Totem — Build Your Lamp",
    description:
      "Design your custom modular lamp. Choose shapes, colors, cable, and fixation. Made to order in Paris.",
    url: "/products/totem",
  },
};

export default function TotemPage() {
  return (
    <div className="container-wide section-centered pt-12 sm:pt-[var(--header-height)] pb-20 sm:pb-0">
      <TotemConfigurator />
    </div>
  );
}

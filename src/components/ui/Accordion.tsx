"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { Plus, MoveDown, ArrowDown, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const AccordionRoot = Accordion.Root;
const AccordionItem = Accordion.Item;

const AccordionTrigger = ({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof Accordion.Trigger>) => (
  <Accordion.Header asChild>
  <div>
    <Accordion.Trigger
      className={cn("group flex w-full items-center", className)}
      {...props}
    >
      {children}
      <Plus className="h-6 w-6 ml-auto self-start transition-transform duration-100 group-data-[state=open]:rotate-45" />
    </Accordion.Trigger>
  </div>
</Accordion.Header>
);

const AccordionContent = ({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof Accordion.Content>) => (
  <Accordion.Content
    className={cn(
      "grid will-change-[grid-template-rows] data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp",
      className
    )}
    {...props}
  >
    <div className="overflow-hidden">
      {children}
    </div>
  </Accordion.Content>
);

export { AccordionRoot, AccordionItem, AccordionTrigger, AccordionContent };
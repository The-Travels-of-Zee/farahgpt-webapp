"use client";

import * as React from "react";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import { cn } from "@/lib/utils";


// Add state for manual control
function HoverCard({ openDelay = 50, closeDelay = 1000, children, ...props }) {
  const [open, setOpen] = React.useState(false);

  // Optional: detect if device is touch-enabled
  const isTouchDevice = typeof window !== "undefined" && "ontouchstart" in window;

  return (
    <HoverCardPrimitive.Root
      openDelay={openDelay}
      closeDelay={closeDelay}
      open={isTouchDevice ? open : undefined}
      onOpenChange={isTouchDevice ? setOpen : undefined}
      {...props}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === HoverCardTrigger) {
          return React.cloneElement(child, {
            onClick: isTouchDevice ? () => setOpen((prev) => !prev) : undefined,
          });
        }
        return child;
      })}
    </HoverCardPrimitive.Root>
  );
}

function HoverCardTrigger(props) {
  return <HoverCardPrimitive.Trigger {...props} />;
}

function HoverCardContent({ className, align = "center", sideOffset = 4, ...props }) {
  return (
    <HoverCardPrimitive.Portal>
      <HoverCardPrimitive.Content
        align={align}
        sideOffset={sideOffset}
        className={cn("bg-white backdrop-blur-lg p-4 rounded-lg shadow-lg z-50 w-64", className)}
        {...props}
      />
    </HoverCardPrimitive.Portal>
  );
}

export { HoverCard, HoverCardTrigger, HoverCardContent };

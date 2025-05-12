import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  iconClass: string;
  variant?: "default" | "ghost" | "outline" | "secondary";
  size?: "sm" | "icon" | "default";
}

export function IconButton({
  iconClass,
  variant = "ghost",
  size = "icon",
  className,
  ...props
}: IconButtonProps) {
  return (
    <Button
      variant={variant}
      size={size}
      className={cn("rounded-full", className)}
      {...props}
    >
      <i className={iconClass}></i>
    </Button>
  );
}

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageSectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  size?: "sm" | "md" | "lg" | "xl";
  background?: "default" | "muted" | "accent" | "primary";
  bordered?: boolean;
}

export default function PageSection({ 
  children, 
  className,
  id,
  size = "md",
  background = "default",
  bordered = false
}: PageSectionProps) {
  const sizeClasses = {
    sm: "py-8",
    md: "py-12",
    lg: "py-16",
    xl: "py-20",
  };

  const backgroundClasses = {
    default: "",
    muted: "bg-muted/30",
    accent: "bg-accent/10",
    primary: "bg-primary/5",
  };

  const sectionClasses = cn(
    sizeClasses[size],
    backgroundClasses[background],
    bordered && "border-b",
    className
  );

  return (
    <section id={id} className={sectionClasses}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
}
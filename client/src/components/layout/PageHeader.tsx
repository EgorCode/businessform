import { ReactNode } from "react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "wouter";
import { Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  children?: ReactNode;
}

export default function PageHeader({ 
  title, 
  description, 
  breadcrumbs = [], 
  children 
}: PageHeaderProps) {
  const defaultBreadcrumbs: BreadcrumbItem[] = [
    { label: "Главная", href: "/" },
    ...breadcrumbs,
  ];

  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        {defaultBreadcrumbs.length > 1 && (
          <Breadcrumb className="mb-4">
            <BreadcrumbList>
              {defaultBreadcrumbs.map((item, index) => (
                <div key={index} className="flex items-center">
                  <BreadcrumbItem>
                    {item.href ? (
                      <BreadcrumbLink asChild>
                        <Link href={item.href} className="flex items-center">
                          {index === 0 && <Home className="mr-2 h-4 w-4" />}
                          {item.label}
                        </Link>
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage>{item.label}</BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                  {index < defaultBreadcrumbs.length - 1 && (
                    <BreadcrumbSeparator />
                  )}
                </div>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        )}

        {/* Header content */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
              {title}
            </h1>
            {description && (
              <p className="text-lg text-muted-foreground max-w-3xl">
                {description}
              </p>
            )}
          </div>
          {children && (
            <div className="flex-shrink-0">
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
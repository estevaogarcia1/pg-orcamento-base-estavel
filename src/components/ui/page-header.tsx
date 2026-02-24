import { ReactNode, forwardRef } from "react";

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  children?: ReactNode;
}

export const PageHeader = forwardRef<HTMLDivElement, PageHeaderProps>(
  ({ title, description, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        {...props}
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground">{title}</h1>
          {description && (
            <p className="mt-1 text-muted-foreground">{description}</p>
          )}
        </div>
        {children && <div className="flex items-center gap-3">{children}</div>}
      </div>
    );
  }
);

PageHeader.displayName = "PageHeader";

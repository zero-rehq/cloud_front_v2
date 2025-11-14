import * as React from 'react';
import { useMatches, Link } from '@tanstack/react-router';
import { AppSidebar } from './AppSidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/animate-ui/components/radix/sidebar';

interface AppLayoutProps {
  children: React.ReactNode;
}

function formatRouteName(path: string): string {
  if (path === '/') return 'Home';

  // Remove leading slash and split by slashes
  const segments = path.slice(1).split('/');

  // Take the last segment and format it
  const lastSegment = segments[segments.length - 1];

  // Convert kebab-case or snake_case to Title Case
  return lastSegment
    .replace(/[-_]/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function AppLayout({ children }: AppLayoutProps) {
  const matches = useMatches();

  // Generate breadcrumbs from route matches
  const breadcrumbs = React.useMemo(() => {
    return matches
      .filter((match) => match.pathname !== '/' && !match.pathname.startsWith('/__'))
      .map((match, index, array) => ({
        title: formatRouteName(match.pathname),
        path: match.pathname,
        isLast: index === array.length - 1,
      }));
  }, [matches]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b bg-sidebar">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            {breadcrumbs.length > 0 && (
              <Breadcrumb>
                <BreadcrumbList>
                  {breadcrumbs.map((crumb, index) => (
                    <React.Fragment key={crumb.path}>
                      <BreadcrumbItem className={index === 0 ? 'hidden md:block' : undefined}>
                        {crumb.isLast ? (
                          <BreadcrumbPage>{crumb.title}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink asChild>
                            <Link to={crumb.path}>{crumb.title}</Link>
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                      {!crumb.isLast && (
                        <BreadcrumbSeparator className="hidden md:block" />
                      )}
                    </React.Fragment>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            )}
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-2 overflow-auto">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

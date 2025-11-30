import { ROUTES } from '@/shared/constants/routes'
import type { MenuItem } from '@/server/types/common/menu-item'

type RouteNode = MenuItem & { children?: Record<string, RouteNode> }

function matchPath(routePath: string, actualPath: string): boolean {
  if (routePath === actualPath) return true;
  if (!routePath.includes(':')) return false;
  
  const routeParts = routePath.split('/');
  const actualParts = actualPath.split('/');
  
  if (routeParts.length !== actualParts.length) return false;
  
  return routeParts.every((part, i) => {
    return part.startsWith(':') || part === actualParts[i];
  });
}

function findRoutePath(
  routes: Record<string, RouteNode>,
  targetPath: string,
  parents: MenuItem[] = []
): MenuItem[] | null {
  for (const key in routes) {
    const route = routes[key];

    if (route.path && matchPath(route.path, targetPath)) {
      const validParents = parents.filter(p => p.path);
      return [...validParents, { ...route, path: targetPath }];
    }

    if (route.children) {
      const result = findRoutePath(route.children, targetPath, [...parents, route]);
      if (result) return result;
    }
  }
  return null;
}

export function getBreadcrumbs(path: string, customLabel?: string): MenuItem[] {
  const found =
    findRoutePath(ROUTES.PUBLIC, path) ||
    findRoutePath(ROUTES.ADMIN, path) ||
    [];

  const valid = found.filter(item => item.path);

  if (customLabel && valid.length > 0) {
    valid[valid.length - 1] = {
      ...valid[valid.length - 1],
      label: customLabel
    };
  }

  return [
    { label: 'Trang chủ', path: '/' },
    ...valid,
  ];
}
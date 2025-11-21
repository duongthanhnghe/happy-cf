import { ROUTES } from '@/shared/constants/routes'
import type { MenuItem } from '@/server/types/common/menu-item'

type RouteNode = MenuItem & { children?: Record<string, RouteNode> }

// function findRoutePath(
//   routes: Record<string, RouteNode>,
//   path: string,
//   parents: MenuItem[] = []
// ): MenuItem[] | null {
//   for (const key in routes) {
//     const route = routes[key]
//     // Trùng path thì return luôn
//     if (route.path === path) {
//       return [...parents, route]
//     }
//     // Nếu có children thì duyệt tiếp
//     if (route.children) {
//       const result = findRoutePath(route.children, path, [...parents, route])
//       if (result) return result
//     }
//   }
//   return null
// }

function findRoutePath(
  routes: Record<string, RouteNode>,
  targetPath: string,
  parents: MenuItem[] = []
): MenuItem[] | null {
  for (const key in routes) {
    const route = routes[key];

    // Nếu trùng path → trả về parents + route (nếu route có path)
    if (route.path === targetPath) {
      const validParents = parents.filter(p => p.path); // lọc cha KHÔNG có path
      return [...validParents, route];
    }

    // Nếu có children → duyệt sâu
    if (route.children) {
      const result = findRoutePath(route.children, targetPath, [...parents, route]);
      if (result) return result;
    }
  }
  return null;
}

// export function getBreadcrumbs(path: string): MenuItem[] {
//   const found =
//     findRoutePath(ROUTES.PUBLIC, path) ||
//     findRoutePath(ROUTES.ADMIN, path) ||
//     []

//   return [
//     { label: 'Trang chủ', path: '/' },
//     ...found,
//   ]
// }

export function getBreadcrumbs(path: string): MenuItem[] {
  const found =
    findRoutePath(ROUTES.PUBLIC, path) ||
    findRoutePath(ROUTES.ADMIN, path) ||
    [];

  // Lọc ra node KHÔNG có path (như PRODUCT, NEWS ...)
  const valid = found.filter(item => item.path);

  return [
    { label: 'Trang chủ', path: '/' },
    ...valid,
  ];
}

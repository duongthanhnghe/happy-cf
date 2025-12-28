export function findItemInTree<T extends { id: string; children?: T[] }>(items: T[],targetId: string): T | null {
  for (const item of items) {
    if (item.id === targetId) return item;
    if (item.children && item.children.length > 0) {
      const found = findItemInTree(item.children, targetId);
      if (found) return found;
    }
  }
  return null;
}

export function markAllSelectable<T extends { id: string; children?: T[] }>(items: T[],disabledId?: string): T[] {
  return items.map(item => ({
    ...item,
    disabled: disabledId ? item.id === disabledId : false,
    children: Array.isArray(item.children) && item.children.length > 0
      ? markAllSelectable(item.children, disabledId)
      : undefined
  })) as T[]
}


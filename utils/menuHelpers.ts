export const getMenuDepth = (items: any[], currentLevel = 1): number => {
  if (!items || items.length === 0) return currentLevel

  let maxLevel = currentLevel

  for (const item of items) {
    if (item.children && item.children.length > 0) {
      const childLevel = getMenuDepth(item.children, currentLevel + 1)
      maxLevel = Math.max(maxLevel, childLevel)
    }
  }

  return maxLevel
}
export const useUserHelpers = () => {

  const colorType = (color: string) => {
    if (!color) return
    switch (color) {
      case 'Gold':
        return 'yellow';
      case 'Silver':
        return 'grey';
      case 'Bronze':
        return 'brown';
      default:
        return 'primary';
    }
  }

  return { colorType }
}

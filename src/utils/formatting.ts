type RouteParts = {
  module: string
  routine: string
  resource: string
}

export function formatRoute(route: string): RouteParts | null {
  const parts = route.replace(/^\//, '').split('/')

  if (parts.length !== 4) {
    return null
  }

  const toPascalCase = (input: string): string => {
    const normalized = input.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    return normalized
      .toLowerCase()
      .split(/[\s-]+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join('')
  }

  return {
    module: toPascalCase(parts[1]),
    routine: toPascalCase(parts[2]),
    resource: toPascalCase(parts[3]),
  }
}

const files = import.meta.glob('../../assets/icons/*.svg', { query: '?raw', import: 'default', eager: true }) as Record<string, string>

const toCurrentColor = (svg: string) => {
  const painted = /(fill|stroke)="(?!none)([^"]+)"/g
  const colors = new Set([...svg.matchAll(painted)].map((m) => m[2].toLowerCase()))
  // Two-tone icons keep their white detail; only the main colour follows the text colour.
  const keepWhite = colors.size > 1 && colors.has('white')
  return svg.replace(painted, (all, attr, color) => (keepWhite && color.toLowerCase() === 'white' ? all : `${attr}="currentColor"`))
}

const icons = Object.fromEntries(
  Object.entries(files).map(([path, svg]) => [path.split('/').pop()!.replace('.svg', ''), toCurrentColor(svg)]),
)

export const iconNames = Object.keys(icons)

type IconProps = { name: string; size?: number; className?: string; label?: string }

export function Icon({ name, size = 16, className = '', label }: IconProps) {
  return (
    <span
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={`inline-block shrink-0 [&>svg]:block [&>svg]:size-full ${className}`}
      style={{ width: size, height: size }}
      dangerouslySetInnerHTML={{ __html: icons[name] ?? '' }}
    />
  )
}

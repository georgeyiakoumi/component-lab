/**
 * Generates TSX source code for a Base UI component with applied classes.
 *
 * Takes the component metadata from the registry, the current classMap,
 * and the preview renderer's JSX structure to produce copyable code.
 */

import type { BaseUIComponent } from "@/lib/base-ui-registry"

type ClassMap = Record<string, string>

/**
 * Generate an import statement for a Base UI component.
 */
function generateImport(component: BaseUIComponent): string {
  const lines = [`import { ${component.name} } from "${component.importPath}"`]
  if (component.additionalImports) {
    for (const imp of component.additionalImports) {
      // Extract the component name from the import path
      const name = imp
        .split("/")
        .pop()!
        .split("-")
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join("")
      lines.push(`import { ${name} } from "${imp}"`)
    }
  }
  return lines.join("\n")
}

/**
 * Generate a className prop string from a class string.
 * Returns empty string if no classes.
 */
function classNameProp(classes: string): string {
  if (!classes.trim()) return ""
  return ` className="${classes.trim()}"`
}

/**
 * Generate the full TSX code for a Base UI component with its current classMap.
 * This is a simplified code representation — not the full preview renderer output,
 * but a clean, copyable starting point.
 */
export function generateBaseUICode(
  component: BaseUIComponent,
  classMap: ClassMap,
): string {
  const importLine = generateImport(component)
  const parts = component.parts

  // Build a simple JSX tree from the component's parts
  const jsxLines: string[] = []

  // For single-part components (Button, Input, Toggle, etc.)
  if (parts.length === 1) {
    const part = parts[0]
    const partKey = part.name
    const classes = classMap[partKey] ?? ""
    const tag = `${component.name}`
    jsxLines.push(`<${tag}${classNameProp(classes)}>`)
    jsxLines.push(`  {/* content */}`)
    jsxLines.push(`</${tag}>`)
  } else {
    // Multi-part compound components
    for (const part of parts) {
      const partKey = part.name
      const classes = classMap[partKey] ?? ""
      const tag = `${component.name}.${partKey}`
      jsxLines.push(`<${tag}${classNameProp(classes)}>`)
    }
    // Close tags in reverse
    jsxLines.push(`  {/* content */}`)
    for (let i = parts.length - 1; i >= 0; i--) {
      jsxLines.push(`</${component.name}.${parts[i].name}>`)
    }
  }

  // Format with proper indentation
  const indent = "  "
  let depth = 0
  const formatted: string[] = []
  for (const line of jsxLines) {
    const trimmed = line.trim()
    if (trimmed.startsWith("</")) depth--
    formatted.push(indent.repeat(Math.max(0, depth)) + trimmed)
    if (
      trimmed.startsWith("<") &&
      !trimmed.startsWith("</") &&
      !trimmed.endsWith("/>") &&
      !trimmed.includes("{/*")
    ) {
      depth++
    }
  }

  return `${importLine}\n\nexport function My${component.name}() {\n  return (\n${formatted.map((l) => "    " + l).join("\n")}\n  )\n}`
}

// Tailwind Class Descriptions — plain-English descriptions for common utilities
// Used by the TwPanel to show tooltips on class chips.

/* ── Static map ────────────────────────────────────────────────── */

export const twDescriptions: Record<string, string> = {
  // Spacing — padding
  "p-0": "No padding",
  "p-0.5": "2px padding on all sides",
  "p-1": "4px padding on all sides",
  "p-1.5": "6px padding on all sides",
  "p-2": "8px padding on all sides",
  "p-2.5": "10px padding on all sides",
  "p-3": "12px padding on all sides",
  "p-3.5": "14px padding on all sides",
  "p-4": "16px padding on all sides",
  "p-5": "20px padding on all sides",
  "p-6": "24px padding on all sides",
  "p-8": "32px padding on all sides",
  "p-10": "40px padding on all sides",
  "p-12": "48px padding on all sides",
  "px-0": "No horizontal padding",
  "px-1": "4px horizontal padding",
  "px-2": "8px horizontal padding",
  "px-2.5": "10px horizontal padding",
  "px-3": "12px horizontal padding",
  "px-4": "16px horizontal padding",
  "px-5": "20px horizontal padding",
  "px-6": "24px horizontal padding",
  "px-8": "32px horizontal padding",
  "py-0": "No vertical padding",
  "py-0.5": "2px vertical padding",
  "py-1": "4px vertical padding",
  "py-1.5": "6px vertical padding",
  "py-2": "8px vertical padding",
  "py-2.5": "10px vertical padding",
  "py-3": "12px vertical padding",
  "py-4": "16px vertical padding",
  "pt-0": "No top padding",
  "pt-2": "8px top padding",
  "pt-4": "16px top padding",
  "pb-0": "No bottom padding",
  "pb-2": "8px bottom padding",
  "pb-4": "16px bottom padding",
  "pl-3": "12px left padding",

  // Spacing — margin
  "m-0": "No margin",
  "m-1": "4px margin on all sides",
  "m-2": "8px margin on all sides",
  "m-4": "16px margin on all sides",
  "mx-auto": "Center horizontally with auto margins",
  "mx-2": "8px horizontal margin",
  "my-2": "8px vertical margin",
  "mt-2": "8px top margin",
  "mt-4": "16px top margin",
  "mt-6": "24px top margin",
  "mb-2": "8px bottom margin",
  "ml-1": "4px left margin",
  "ml-2": "8px left margin",
  "ml-3": "12px left margin",
  "ml-auto": "Push element to the right with auto left margin",
  "mr-2": "8px right margin",

  // Spacing — gap
  "gap-0": "No gap between flex/grid children",
  "gap-0.5": "2px gap between flex/grid children",
  "gap-1": "4px gap between flex/grid children",
  "gap-1.5": "6px gap between flex/grid children",
  "gap-2": "8px gap between flex/grid children",
  "gap-3": "12px gap between flex/grid children",
  "gap-4": "16px gap between flex/grid children",
  "space-x-1": "4px horizontal space between children",
  "space-x-2": "8px horizontal space between children",
  "space-y-1": "4px vertical space between children",
  "space-y-2": "8px vertical space between children",
  "space-y-4": "16px vertical space between children",

  // Typography
  "text-xs": "12px font size",
  "text-sm": "14px font size",
  "text-base": "16px font size",
  "text-lg": "18px font size",
  "text-xl": "20px font size",
  "text-2xl": "24px font size",
  "text-3xl": "30px font size",
  "font-normal": "400 font weight",
  "font-medium": "500 font weight",
  "font-semibold": "600 font weight",
  "font-bold": "700 font weight",
  "leading-none": "Line height of 1",
  "leading-tight": "Line height of 1.25",
  "leading-normal": "Line height of 1.5",
  "tracking-tight": "Tight letter spacing (-0.025em)",
  "tracking-wide": "Wide letter spacing (0.025em)",
  "truncate": "Truncate text with ellipsis",
  "whitespace-nowrap": "Prevent text wrapping",
  "underline-offset-4": "4px underline offset",
  "line-clamp-1": "Clamp text to 1 line",
  "line-clamp-2": "Clamp text to 2 lines",

  // Layout
  "flex": "Display as flex container",
  "inline-flex": "Display as inline flex container",
  "grid": "Display as grid container",
  "block": "Display as block element",
  "inline": "Display as inline element",
  "inline-block": "Display as inline-block element",
  "hidden": "Hide element (display: none)",
  "items-center": "Align items to center of cross axis",
  "items-start": "Align items to start of cross axis",
  "items-end": "Align items to end of cross axis",
  "justify-center": "Justify content to center of main axis",
  "justify-between": "Distribute items with space between",
  "justify-start": "Justify content to start of main axis",
  "justify-end": "Justify content to end of main axis",
  "flex-1": "Flex grow and shrink with basis 0%",
  "flex-col": "Flex direction column",
  "flex-row": "Flex direction row",
  "flex-wrap": "Allow flex items to wrap",
  "shrink-0": "Prevent flex shrinking",
  "grow": "Allow flex growing",
  "w-full": "100% width",
  "w-auto": "Auto width",
  "w-10": "40px width",
  "w-2.5": "10px width",
  "h-full": "100% height",
  "h-auto": "Auto height",
  "h-4": "16px height",
  "h-9": "36px height",
  "h-10": "40px height",
  "h-11": "44px height",
  "h-2.5": "10px height",
  "min-w-0": "Minimum width 0",
  "min-w-9": "Minimum width 36px",
  "min-w-10": "Minimum width 40px",
  "min-w-11": "Minimum width 44px",
  "max-w-full": "Maximum width 100%",
  "overflow-hidden": "Hide overflow content",
  "overflow-auto": "Auto scrollbar on overflow",
  "relative": "Position relative",
  "absolute": "Position absolute",
  "fixed": "Position fixed",
  "sticky": "Position sticky",
  "inset-0": "Position 0 on all sides",
  "top-0": "Position at top edge",
  "right-0": "Position at right edge",
  "bottom-0": "Position at bottom edge",
  "left-0": "Position at left edge",
  "z-50": "Z-index 50",
  "size-4": "16px width and height",
  "size-3.5": "14px width and height",

  // Borders
  "border": "1px solid border",
  "border-0": "No border",
  "border-2": "2px solid border",
  "border-l": "1px left border",
  "border-t": "1px top border",
  "border-r": "1px right border",
  "border-b": "1px bottom border",
  "rounded-sm": "2px border radius",
  "rounded-md": "6px border radius",
  "rounded-lg": "8px border radius",
  "rounded-xl": "12px border radius",
  "rounded-full": "Fully rounded (pill shape)",
  "outline-none": "Remove outline",
  "divide-y": "Horizontal dividers between children",
  "divide-x": "Vertical dividers between children",

  // Effects
  "shadow-sm": "Small box shadow",
  "shadow-md": "Medium box shadow",
  "shadow-lg": "Large box shadow",
  "opacity-50": "50% opacity",
  "opacity-0": "Fully transparent",
  "opacity-100": "Fully opaque",
  "transition-colors": "Animate colour changes",
  "transition-all": "Animate all properties",
  "transition-opacity": "Animate opacity changes",
  "transition-transform": "Animate transform changes",
  "duration-200": "200ms transition duration",
  "duration-300": "300ms transition duration",
  "animate-in": "Entry animation",
  "animate-out": "Exit animation",
  "transform": "Enable CSS transforms",
  "scale-100": "Scale to 100%",
  "translate-x-0": "No horizontal translation",

  // Interactivity
  "cursor-pointer": "Show pointer cursor",
  "cursor-default": "Show default cursor",
  "cursor-not-allowed": "Show not-allowed cursor",
  "pointer-events-none": "Disable pointer events",
  "select-none": "Prevent text selection",
  "select-all": "Select all on click",
  "sr-only": "Screen reader only (visually hidden)",
  "touch-none": "Disable touch actions",

  // Colours (common tokens)
  "bg-primary": "Primary background colour",
  "bg-secondary": "Secondary background colour",
  "bg-destructive": "Destructive/error background colour",
  "bg-muted": "Muted background colour",
  "bg-accent": "Accent background colour",
  "bg-background": "Page background colour",
  "bg-popover": "Popover background colour",
  "bg-card": "Card background colour",
  "bg-transparent": "Transparent background",
  "text-foreground": "Primary text colour",
  "text-primary-foreground": "Text on primary background",
  "text-secondary-foreground": "Text on secondary background",
  "text-destructive-foreground": "Text on destructive background",
  "text-muted-foreground": "Muted/secondary text colour",
  "text-accent-foreground": "Text on accent background",
  "text-popover-foreground": "Text on popover background",
  "text-card-foreground": "Text on card background",
  "text-primary": "Primary-coloured text",
  "text-destructive": "Destructive/error-coloured text",
  "text-current": "Inherit current text colour",
  "border-input": "Input border colour",
  "border-border": "Default border colour",
  "border-destructive": "Destructive border colour",
  "border-primary": "Primary border colour",
  "border-transparent": "Transparent border",
  "border-l-transparent": "Transparent left border",
  "border-t-transparent": "Transparent top border",
  "ring-ring": "Focus ring colour",
  "ring-offset-background": "Ring offset background colour",
  "ring-offset-2": "2px ring offset",
  "ring-2": "2px focus ring",
  "bg-border": "Border-coloured background",
  "accent-primary": "Primary accent colour",

  // Misc
  "peer": "Mark element as a peer for sibling selectors",
  "group": "Mark element as a group for child selectors",
  "place-content-center": "Center content in grid",
}

/* ── Dynamic description generator ─────────────────────────────── */

/** Spacing scale: Tailwind number → pixel value */
function spacingToPx(value: string): string | null {
  if (value === "auto") return "auto"
  if (value === "px") return "1px"
  if (value === "full") return "100%"

  const num = parseFloat(value)
  if (Number.isNaN(num)) return null
  return `${num * 4}px`
}

const SPACING_DIRECTIONS: Record<string, string> = {
  p: "padding on all sides",
  px: "horizontal padding",
  py: "vertical padding",
  pt: "top padding",
  pr: "right padding",
  pb: "bottom padding",
  pl: "left padding",
  m: "margin on all sides",
  mx: "horizontal margin",
  my: "vertical margin",
  mt: "top margin",
  mr: "right margin",
  mb: "bottom margin",
  ml: "left margin",
  gap: "gap between flex/grid children",
}

/**
 * Returns a plain-English description for a Tailwind utility class.
 * Strips any prefix (hover:, sm:, etc.) and looks up the base class.
 */
export function describeTwClass(className: string): string {
  // Strip prefixes (e.g. "hover:bg-accent" → "bg-accent")
  const base = className.includes(":")
    ? className.slice(className.lastIndexOf(":") + 1)
    : className

  // Direct lookup
  if (twDescriptions[base]) return twDescriptions[base]

  // Try dynamic patterns

  // Spacing: p-{n}, px-{n}, m-{n}, gap-{n}, etc.
  const spacingMatch = base.match(/^(p|px|py|pt|pr|pb|pl|m|mx|my|mt|mr|mb|ml|gap)-(.+)$/)
  if (spacingMatch) {
    const dir = SPACING_DIRECTIONS[spacingMatch[1]]
    const px = spacingToPx(spacingMatch[2])
    if (dir && px) return `${px} ${dir}`
  }

  // space-x/y-{n}
  const spaceMatch = base.match(/^space-(x|y)-(.+)$/)
  if (spaceMatch) {
    const axis = spaceMatch[1] === "x" ? "horizontal" : "vertical"
    const px = spacingToPx(spaceMatch[2])
    if (px) return `${px} ${axis} space between children`
  }

  // w-{n}, h-{n}
  const sizeMatch = base.match(/^(w|h|size)-(.+)$/)
  if (sizeMatch) {
    const dim = sizeMatch[1] === "w" ? "width" : sizeMatch[1] === "h" ? "height" : "width and height"
    const px = spacingToPx(sizeMatch[2])
    if (px) return `${px} ${dim}`
  }

  // min-w-{n}, min-h-{n}, max-w-{n}, max-h-{n}
  const minMaxMatch = base.match(/^(min|max)-(w|h)-(.+)$/)
  if (minMaxMatch) {
    const bound = minMaxMatch[1] === "min" ? "Minimum" : "Maximum"
    const dim = minMaxMatch[2] === "w" ? "width" : "height"
    const px = spacingToPx(minMaxMatch[3])
    if (px) return `${bound} ${dim} ${px}`
  }

  // rounded-{size}
  const roundedMatch = base.match(/^rounded-(.+)$/)
  if (roundedMatch) {
    return `Border radius: ${roundedMatch[1]}`
  }

  // text-{size} (typography sizes)
  const textSizeMatch = base.match(/^text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl)$/)
  if (textSizeMatch) {
    return `Font size: ${textSizeMatch[1]}`
  }

  // font-{weight}
  const fontMatch = base.match(/^font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)$/)
  if (fontMatch) {
    return `Font weight: ${fontMatch[1]}`
  }

  // opacity-{n}
  const opacityMatch = base.match(/^opacity-(\d+)$/)
  if (opacityMatch) {
    return `${opacityMatch[1]}% opacity`
  }

  // z-{n}
  const zMatch = base.match(/^z-(\d+)$/)
  if (zMatch) {
    return `Z-index ${zMatch[1]}`
  }

  // bg-{token}/{opacity}
  const bgOpacityMatch = base.match(/^bg-(.+)\/(\d+)$/)
  if (bgOpacityMatch) {
    return `${bgOpacityMatch[1]} background at ${bgOpacityMatch[2]}% opacity`
  }

  // Fallback: return the class name as-is
  return base
}

/**
 * Base UI component registry — curated metadata for all Base UI components.
 *
 * Each entry describes a component's compound parts, data attributes for
 * state-based styling, and sidebar categorisation. This registry drives
 * the preview renderer, code generator, and style editor.
 *
 * Source: https://base-ui.com/llms.txt + individual component docs.
 * Package: @base-ui/react@1.7.0
 */

/* ── Types ──────────────────────────────────────────────────────── */

export type ComponentCategory =
  | "Inputs"
  | "Forms"
  | "Overlays"
  | "Navigation"
  | "Layout"
  | "Feedback"
  | "Data Display"

export interface BaseUIComponentPart {
  /** Part name, e.g. "Root", "Trigger", "Thumb" */
  name: string
  /** Data attributes exposed by this part for state-based styling */
  dataAttributes: string[]
  /** Nesting depth for outline display (0 = root, 1 = child, 2 = grandchild) */
  depth?: number
}

export interface BaseUIComponent {
  /** PascalCase display name, e.g. "AlertDialog" */
  name: string
  /** kebab-case slug for URLs and lookups, e.g. "alert-dialog" */
  slug: string
  /** Import path, e.g. "@base-ui/react/alert-dialog" */
  importPath: string
  /** Additional import paths needed (e.g. Radio needs radio-group too) */
  additionalImports?: string[]
  /** Compound component parts with their data attributes */
  parts: BaseUIComponentPart[]
  /** Sidebar grouping */
  category: ComponentCategory
  /** Brief description for tooltips / search */
  description: string
}

/* ── Shared data-attribute sets ─────────────────────────────────── */

/** Common form-field attributes (active when wrapped in Field.Root) */
const FIELD_ATTRS = [
  "data-disabled",
  "data-valid",
  "data-invalid",
  "data-dirty",
  "data-touched",
  "data-filled",
  "data-focused",
]

/** Common checked-toggle attributes */
const CHECKED_ATTRS = [
  "data-checked",
  "data-unchecked",
  "data-disabled",
  "data-readonly",
  "data-required",
  ...FIELD_ATTRS.filter((a) => a !== "data-disabled"),
]

/** Common overlay entry/exit animation attributes */
const ANIMATION_ATTRS = ["data-starting-style", "data-ending-style"]

/* ── Registry ───────────────────────────────────────────────────── */

export const BASE_UI_REGISTRY: BaseUIComponent[] = [
  /* ── Inputs ────────────────────────────────────────────────────── */

  {
    name: "Button",
    slug: "button",
    importPath: "@base-ui/react/button",
    parts: [
      { name: "Button", dataAttributes: ["data-disabled"] },
    ],
    category: "Inputs",
    description: "A button that can be rendered as another tag or focusable when disabled.",
  },
  {
    name: "Toggle",
    slug: "toggle",
    importPath: "@base-ui/react/toggle",
    parts: [
      { name: "Toggle", dataAttributes: ["data-pressed", "data-disabled"] },
    ],
    category: "Inputs",
    description: "A two-state button that can be on or off.",
  },
  {
    name: "ToggleGroup",
    slug: "toggle-group",
    importPath: "@base-ui/react/toggle-group",
    additionalImports: ["@base-ui/react/toggle"],
    parts: [
      { name: "Root", dataAttributes: ["data-orientation", "data-disabled", "data-multiple"] },
      { name: "Toggle", dataAttributes: ["data-pressed", "data-disabled"], depth: 1 },
    ],
    category: "Inputs",
    description: "Shared state for a series of toggle buttons.",
  },

  /* ── Forms ─────────────────────────────────────────────────────── */

  {
    name: "Checkbox",
    slug: "checkbox",
    importPath: "@base-ui/react/checkbox",
    parts: [
      { name: "Root", dataAttributes: [...CHECKED_ATTRS, "data-indeterminate"] },
      { name: "Indicator", dataAttributes: [...CHECKED_ATTRS, "data-indeterminate", ...ANIMATION_ATTRS], depth: 1 },
    ],
    category: "Forms",
    description: "A checkbox that is easy to customize.",
  },
  {
    name: "CheckboxGroup",
    slug: "checkbox-group",
    importPath: "@base-ui/react/checkbox-group",
    additionalImports: ["@base-ui/react/checkbox"],
    parts: [
      { name: "Root", dataAttributes: ["data-disabled"] },
    ],
    category: "Forms",
    description: "Shared state for a series of checkboxes.",
  },
  {
    name: "Field",
    slug: "field",
    importPath: "@base-ui/react/field",
    parts: [
      { name: "Root", dataAttributes: [...FIELD_ATTRS] },
      { name: "Label", dataAttributes: [...FIELD_ATTRS], depth: 1 },
      { name: "Control", dataAttributes: [...FIELD_ATTRS], depth: 1 },
      { name: "Description", dataAttributes: [...FIELD_ATTRS], depth: 1 },
      { name: "Error", dataAttributes: [...FIELD_ATTRS, ...ANIMATION_ATTRS], depth: 1 },
      { name: "Item", dataAttributes: [...FIELD_ATTRS], depth: 1 },
    ],
    category: "Forms",
    description: "Labeling and validation for form controls.",
  },
  {
    name: "Fieldset",
    slug: "fieldset",
    importPath: "@base-ui/react/fieldset",
    parts: [
      { name: "Root", dataAttributes: ["data-disabled"] },
      { name: "Legend", dataAttributes: ["data-disabled"], depth: 1 },
    ],
    category: "Forms",
    description: "A fieldset with an easily stylable legend.",
  },
  {
    name: "Form",
    slug: "form",
    importPath: "@base-ui/react/form",
    parts: [
      { name: "Root", dataAttributes: [] },
    ],
    category: "Forms",
    description: "A form with consolidated error handling.",
  },
  {
    name: "Input",
    slug: "input",
    importPath: "@base-ui/react/input",
    parts: [
      { name: "Input", dataAttributes: [...FIELD_ATTRS] },
    ],
    category: "Forms",
    description: "An unstyled input element.",
  },
  {
    name: "NumberField",
    slug: "number-field",
    importPath: "@base-ui/react/number-field",
    parts: [
      { name: "Root", dataAttributes: [...FIELD_ATTRS, "data-readonly", "data-required", "data-scrubbing"] },
      { name: "Group", dataAttributes: [...FIELD_ATTRS, "data-readonly", "data-required", "data-scrubbing"], depth: 1 },
      { name: "Input", dataAttributes: [...FIELD_ATTRS, "data-readonly", "data-required", "data-scrubbing"], depth: 2 },
      { name: "ScrubArea", dataAttributes: [...FIELD_ATTRS, "data-readonly", "data-required", "data-scrubbing"], depth: 1 },
      { name: "ScrubAreaCursor", dataAttributes: [...FIELD_ATTRS, "data-readonly", "data-required", "data-scrubbing"], depth: 2 },
      { name: "Increment", dataAttributes: [...FIELD_ATTRS, "data-readonly", "data-required", "data-scrubbing"], depth: 2 },
      { name: "Decrement", dataAttributes: [...FIELD_ATTRS, "data-readonly", "data-required", "data-scrubbing"], depth: 2 },
    ],
    category: "Forms",
    description: "A number field with increment/decrement buttons and scrub area.",
  },
  {
    name: "OtpField",
    slug: "otp-field",
    importPath: "@base-ui/react/otp-field",
    parts: [
      { name: "Root", dataAttributes: [...FIELD_ATTRS, "data-readonly", "data-required", "data-complete"] },
      { name: "Input", dataAttributes: [...FIELD_ATTRS, "data-readonly", "data-required", "data-complete"], depth: 1 },
      { name: "Separator", dataAttributes: [], depth: 1 },
    ],
    category: "Forms",
    description: "One-time password and verification code entry.",
  },
  {
    name: "Radio",
    slug: "radio",
    importPath: "@base-ui/react/radio",
    additionalImports: ["@base-ui/react/radio-group"],
    parts: [
      { name: "Group", dataAttributes: ["data-disabled"] },
      { name: "Root", dataAttributes: [...CHECKED_ATTRS], depth: 1 },
      { name: "Indicator", dataAttributes: [...CHECKED_ATTRS, ...ANIMATION_ATTRS], depth: 2 },
    ],
    category: "Forms",
    description: "A radio button that is easy to style.",
  },
  {
    name: "Select",
    slug: "select",
    importPath: "@base-ui/react/select",
    parts: [
      { name: "Root", dataAttributes: [] },
      { name: "Label", dataAttributes: [], depth: 1 },
      { name: "Trigger", dataAttributes: ["data-popup-open", "data-popup-side", "data-pressed", "data-disabled", "data-readonly", "data-required", "data-placeholder", ...FIELD_ATTRS.filter((a) => a !== "data-disabled")], depth: 1 },
      { name: "Value", dataAttributes: ["data-placeholder"], depth: 2 },
      { name: "Icon", dataAttributes: ["data-popup-open"], depth: 2 },
      { name: "Portal", dataAttributes: [], depth: 1 },
      { name: "Backdrop", dataAttributes: ["data-open", "data-closed", ...ANIMATION_ATTRS], depth: 2 },
      { name: "Positioner", dataAttributes: ["data-side", ...ANIMATION_ATTRS], depth: 2 },
      { name: "Popup", dataAttributes: ["data-side", ...ANIMATION_ATTRS], depth: 3 },
      { name: "List", dataAttributes: [], depth: 4 },
      { name: "ScrollUpArrow", dataAttributes: ["data-direction", "data-side"], depth: 4 },
      { name: "ScrollDownArrow", dataAttributes: ["data-direction", "data-side"], depth: 4 },
      { name: "Item", dataAttributes: ["data-highlighted"], depth: 4 },
      { name: "ItemIndicator", dataAttributes: [], depth: 5 },
      { name: "ItemText", dataAttributes: [], depth: 5 },
      { name: "Group", dataAttributes: [], depth: 4 },
      { name: "GroupLabel", dataAttributes: [], depth: 5 },
      { name: "Separator", dataAttributes: [], depth: 4 },
      { name: "Arrow", dataAttributes: [], depth: 3 },
    ],
    category: "Forms",
    description: "Choose a predefined value in a dropdown menu.",
  },
  {
    name: "Slider",
    slug: "slider",
    importPath: "@base-ui/react/slider",
    parts: [
      { name: "Root", dataAttributes: ["data-dragging", "data-orientation", ...FIELD_ATTRS] },
      { name: "Label", dataAttributes: ["data-dragging", "data-orientation", ...FIELD_ATTRS], depth: 1 },
      { name: "Value", dataAttributes: ["data-dragging", "data-orientation", ...FIELD_ATTRS], depth: 1 },
      { name: "Control", dataAttributes: ["data-dragging", "data-orientation", ...FIELD_ATTRS], depth: 1 },
      { name: "Track", dataAttributes: ["data-dragging", "data-orientation", ...FIELD_ATTRS], depth: 2 },
      { name: "Indicator", dataAttributes: ["data-dragging", "data-orientation", ...FIELD_ATTRS], depth: 3 },
      { name: "Thumb", dataAttributes: ["data-dragging", "data-orientation", ...FIELD_ATTRS, "data-index"], depth: 2 },
    ],
    category: "Forms",
    description: "A slider that works like a range input.",
  },
  {
    name: "Switch",
    slug: "switch",
    importPath: "@base-ui/react/switch",
    parts: [
      { name: "Root", dataAttributes: [...CHECKED_ATTRS] },
      { name: "Thumb", dataAttributes: [...CHECKED_ATTRS], depth: 1 },
    ],
    category: "Forms",
    description: "Indicates whether a setting is on or off.",
  },

  /* ── Overlays ──────────────────────────────────────────────────── */

  {
    name: "AlertDialog",
    slug: "alert-dialog",
    importPath: "@base-ui/react/alert-dialog",
    parts: [
      { name: "Root", dataAttributes: [] },
      { name: "Trigger", dataAttributes: ["data-popup-open", "data-disabled"], depth: 1 },
      { name: "Portal", dataAttributes: [], depth: 1 },
      { name: "Backdrop", dataAttributes: ["data-open", "data-closed", ...ANIMATION_ATTRS], depth: 2 },
      { name: "Viewport", dataAttributes: ["data-open", "data-closed", ...ANIMATION_ATTRS], depth: 2 },
      { name: "Popup", dataAttributes: ["data-open", "data-closed", "data-nested-dialog-open", ...ANIMATION_ATTRS], depth: 3 },
      { name: "Title", dataAttributes: [], depth: 4 },
      { name: "Description", dataAttributes: [], depth: 4 },
      { name: "Close", dataAttributes: ["data-disabled"], depth: 4 },
    ],
    category: "Overlays",
    description: "Requires a user response to proceed.",
  },
  {
    name: "ContextMenu",
    slug: "context-menu",
    importPath: "@base-ui/react/context-menu",
    parts: [
      { name: "Root", dataAttributes: [] },
      { name: "Trigger", dataAttributes: ["data-popup-open", "data-pressed"], depth: 1 },
      { name: "Portal", dataAttributes: [], depth: 1 },
      { name: "Backdrop", dataAttributes: ["data-open", "data-closed", ...ANIMATION_ATTRS], depth: 2 },
      { name: "Positioner", dataAttributes: ["data-open", "data-closed", "data-side", ...ANIMATION_ATTRS], depth: 2 },
      { name: "Popup", dataAttributes: ["data-open", "data-closed", "data-side", "data-instant", ...ANIMATION_ATTRS], depth: 3 },
      { name: "Arrow", dataAttributes: ["data-side"], depth: 3 },
      { name: "Item", dataAttributes: ["data-highlighted", "data-disabled"], depth: 4 },
      { name: "LinkItem", dataAttributes: ["data-highlighted", "data-disabled"], depth: 4 },
      { name: "Separator", dataAttributes: [], depth: 4 },
      { name: "Group", dataAttributes: [], depth: 4 },
      { name: "GroupLabel", dataAttributes: [], depth: 5 },
      { name: "SubmenuRoot", dataAttributes: [], depth: 4 },
      { name: "SubmenuTrigger", dataAttributes: ["data-highlighted", "data-disabled", "data-popup-open"], depth: 5 },
      { name: "RadioGroup", dataAttributes: [], depth: 4 },
      { name: "RadioItem", dataAttributes: ["data-highlighted", "data-disabled", "data-checked", "data-unchecked"], depth: 5 },
      { name: "RadioItemIndicator", dataAttributes: ["data-checked", "data-unchecked", ...ANIMATION_ATTRS], depth: 6 },
      { name: "CheckboxItem", dataAttributes: ["data-highlighted", "data-disabled", "data-checked", "data-unchecked"], depth: 5 },
      { name: "CheckboxItemIndicator", dataAttributes: ["data-checked", "data-unchecked", ...ANIMATION_ATTRS], depth: 6 },
    ],
    category: "Overlays",
    description: "Appears at the pointer on right click or long press.",
  },
  {
    name: "Dialog",
    slug: "dialog",
    importPath: "@base-ui/react/dialog",
    parts: [
      { name: "Root", dataAttributes: [] },
      { name: "Trigger", dataAttributes: ["data-disabled"], depth: 1 },
      { name: "Portal", dataAttributes: [], depth: 1 },
      { name: "Backdrop", dataAttributes: [...ANIMATION_ATTRS], depth: 2 },
      { name: "Viewport", dataAttributes: ["data-ending-style"], depth: 2 },
      { name: "Popup", dataAttributes: ["data-nested-dialog-open", ...ANIMATION_ATTRS], depth: 3 },
      { name: "Title", dataAttributes: [], depth: 4 },
      { name: "Description", dataAttributes: [], depth: 4 },
      { name: "Close", dataAttributes: ["data-disabled"], depth: 4 },
    ],
    category: "Overlays",
    description: "Opens on top of the entire page.",
  },
  {
    name: "Drawer",
    slug: "drawer",
    importPath: "@base-ui/react/drawer",
    parts: [
      { name: "Root", dataAttributes: [] },
      { name: "Trigger", dataAttributes: [], depth: 1 },
      { name: "Portal", dataAttributes: [], depth: 1 },
      { name: "Backdrop", dataAttributes: ["data-swiping", ...ANIMATION_ATTRS], depth: 2 },
      { name: "Popup", dataAttributes: ["data-swiping", "data-nested-drawer-open", "data-nested-drawer-swiping", ...ANIMATION_ATTRS], depth: 2 },
      { name: "Title", dataAttributes: [], depth: 3 },
      { name: "Description", dataAttributes: [], depth: 3 },
      { name: "Close", dataAttributes: [], depth: 3 },
    ],
    category: "Overlays",
    description: "A drawer with swipe-to-dismiss gestures.",
  },
  {
    name: "Menu",
    slug: "menu",
    importPath: "@base-ui/react/menu",
    parts: [
      { name: "Root", dataAttributes: [] },
      { name: "Trigger", dataAttributes: ["data-pressed", "data-disabled"], depth: 1 },
      { name: "Portal", dataAttributes: [], depth: 1 },
      { name: "Backdrop", dataAttributes: [], depth: 2 },
      { name: "Positioner", dataAttributes: [], depth: 2 },
      { name: "Popup", dataAttributes: [...ANIMATION_ATTRS], depth: 3 },
      { name: "Arrow", dataAttributes: ["data-side"], depth: 3 },
      { name: "Item", dataAttributes: ["data-highlighted", "data-disabled"], depth: 4 },
      { name: "LinkItem", dataAttributes: ["data-highlighted", "data-disabled"], depth: 4 },
      { name: "Separator", dataAttributes: [], depth: 4 },
      { name: "Group", dataAttributes: [], depth: 4 },
      { name: "GroupLabel", dataAttributes: [], depth: 5 },
      { name: "SubmenuRoot", dataAttributes: [], depth: 4 },
      { name: "SubmenuTrigger", dataAttributes: ["data-highlighted", "data-disabled", "data-popup-open"], depth: 5 },
      { name: "RadioGroup", dataAttributes: [], depth: 4 },
      { name: "RadioItem", dataAttributes: ["data-highlighted", "data-disabled"], depth: 5 },
      { name: "RadioItemIndicator", dataAttributes: [], depth: 6 },
      { name: "CheckboxItem", dataAttributes: ["data-highlighted", "data-disabled"], depth: 5 },
      { name: "CheckboxItemIndicator", dataAttributes: [], depth: 6 },
      { name: "Viewport", dataAttributes: [], depth: 2 },
    ],
    category: "Overlays",
    description: "A dropdown menu with keyboard navigation.",
  },
  {
    name: "Popover",
    slug: "popover",
    importPath: "@base-ui/react/popover",
    parts: [
      { name: "Root", dataAttributes: [] },
      { name: "Trigger", dataAttributes: ["data-popup-open", "data-pressed"], depth: 1 },
      { name: "Portal", dataAttributes: [], depth: 1 },
      { name: "Backdrop", dataAttributes: ["data-open", "data-closed", ...ANIMATION_ATTRS], depth: 2 },
      { name: "Positioner", dataAttributes: ["data-instant", "data-side"], depth: 2 },
      { name: "Popup", dataAttributes: ["data-instant", "data-side", ...ANIMATION_ATTRS], depth: 3 },
      { name: "Arrow", dataAttributes: ["data-side"], depth: 3 },
      { name: "Title", dataAttributes: [], depth: 4 },
      { name: "Description", dataAttributes: [], depth: 4 },
      { name: "Close", dataAttributes: [], depth: 4 },
    ],
    category: "Overlays",
    description: "An accessible popup anchored to a button.",
  },
  {
    name: "PreviewCard",
    slug: "preview-card",
    importPath: "@base-ui/react/preview-card",
    parts: [
      { name: "Root", dataAttributes: [] },
      { name: "Trigger", dataAttributes: ["data-popup-open"], depth: 1 },
      { name: "Portal", dataAttributes: [], depth: 1 },
      { name: "Backdrop", dataAttributes: ["data-open", "data-closed", ...ANIMATION_ATTRS], depth: 2 },
      { name: "Positioner", dataAttributes: ["data-open", "data-closed", "data-anchor-hidden", "data-align", "data-side"], depth: 2 },
      { name: "Popup", dataAttributes: [...ANIMATION_ATTRS], depth: 3 },
      { name: "Arrow", dataAttributes: [], depth: 3 },
    ],
    category: "Overlays",
    description: "Preview that appears when a link is hovered.",
  },
  {
    name: "Tooltip",
    slug: "tooltip",
    importPath: "@base-ui/react/tooltip",
    parts: [
      { name: "Provider", dataAttributes: [] },
      { name: "Root", dataAttributes: [] },
      { name: "Trigger", dataAttributes: ["data-popup-open", "data-trigger-disabled"], depth: 1 },
      { name: "Portal", dataAttributes: [], depth: 1 },
      { name: "Positioner", dataAttributes: ["data-instant"], depth: 2 },
      { name: "Popup", dataAttributes: ["data-instant", ...ANIMATION_ATTRS], depth: 3 },
      { name: "Arrow", dataAttributes: ["data-side"], depth: 3 },
    ],
    category: "Overlays",
    description: "A hint that appears when an element is hovered or focused.",
  },

  /* ── Navigation ────────────────────────────────────────────────── */

  {
    name: "Menubar",
    slug: "menubar",
    importPath: "@base-ui/react/menubar",
    additionalImports: ["@base-ui/react/menu"],
    parts: [
      { name: "Root", dataAttributes: ["data-orientation", "data-has-submenu-open", "data-modal"] },
    ],
    category: "Navigation",
    description: "A menu bar providing commands and options.",
  },
  {
    name: "NavigationMenu",
    slug: "navigation-menu",
    importPath: "@base-ui/react/navigation-menu",
    parts: [
      { name: "Root", dataAttributes: [] },
      { name: "List", dataAttributes: [], depth: 1 },
      { name: "Item", dataAttributes: [], depth: 2 },
      { name: "Trigger", dataAttributes: ["data-popup-open", "data-pressed"], depth: 3 },
      { name: "Icon", dataAttributes: ["data-popup-open"], depth: 3 },
      { name: "Content", dataAttributes: ["data-activation-direction", ...ANIMATION_ATTRS], depth: 3 },
      { name: "Link", dataAttributes: [], depth: 3 },
      { name: "Portal", dataAttributes: [], depth: 2 },
      { name: "Positioner", dataAttributes: ["data-instant", "data-side"], depth: 3 },
      { name: "Popup", dataAttributes: ["data-side", ...ANIMATION_ATTRS], depth: 4 },
      { name: "Arrow", dataAttributes: ["data-side"], depth: 4 },
      { name: "Viewport", dataAttributes: [], depth: 1 },
      { name: "Backdrop", dataAttributes: [], depth: 1 },
    ],
    category: "Navigation",
    description: "A collection of links and menus for website navigation.",
  },
  {
    name: "Tabs",
    slug: "tabs",
    importPath: "@base-ui/react/tabs",
    parts: [
      { name: "Root", dataAttributes: ["data-orientation", "data-activation-direction"] },
      { name: "List", dataAttributes: ["data-orientation", "data-activation-direction"], depth: 1 },
      { name: "Tab", dataAttributes: ["data-orientation", "data-activation-direction", "data-active", "data-disabled"], depth: 2 },
      { name: "Panel", dataAttributes: ["data-orientation", "data-activation-direction", "data-hidden", "data-index", ...ANIMATION_ATTRS], depth: 1 },
      { name: "Indicator", dataAttributes: ["data-orientation", "data-activation-direction"], depth: 2 },
    ],
    category: "Navigation",
    description: "Toggle between related panels on the same page.",
  },

  /* ── Layout ────────────────────────────────────────────────────── */

  {
    name: "Accordion",
    slug: "accordion",
    importPath: "@base-ui/react/accordion",
    parts: [
      { name: "Root", dataAttributes: ["data-orientation", "data-disabled"] },
      { name: "Item", dataAttributes: ["data-open", "data-disabled", "data-index"], depth: 1 },
      { name: "Header", dataAttributes: ["data-open", "data-disabled", "data-index"], depth: 2 },
      { name: "Trigger", dataAttributes: ["data-panel-open", "data-disabled"], depth: 3 },
      { name: "Panel", dataAttributes: ["data-open", "data-orientation", "data-disabled", "data-index", ...ANIMATION_ATTRS], depth: 2 },
    ],
    category: "Layout",
    description: "A set of collapsible panels with headings.",
  },
  {
    name: "Collapsible",
    slug: "collapsible",
    importPath: "@base-ui/react/collapsible",
    parts: [
      { name: "Root", dataAttributes: ["data-open", "data-closed", ...ANIMATION_ATTRS] },
      { name: "Trigger", dataAttributes: ["data-panel-open"], depth: 1 },
      { name: "Panel", dataAttributes: ["data-open", "data-closed", ...ANIMATION_ATTRS], depth: 1 },
    ],
    category: "Layout",
    description: "A panel controlled by a button.",
  },
  {
    name: "ScrollArea",
    slug: "scroll-area",
    importPath: "@base-ui/react/scroll-area",
    parts: [
      { name: "Root", dataAttributes: ["data-has-overflow-x", "data-has-overflow-y", "data-scrolling"] },
      { name: "Viewport", dataAttributes: ["data-has-overflow-x", "data-has-overflow-y", "data-scrolling"], depth: 1 },
      { name: "Content", dataAttributes: ["data-has-overflow-x", "data-has-overflow-y", "data-scrolling"], depth: 2 },
      { name: "Scrollbar", dataAttributes: ["data-orientation", "data-hovering", "data-scrolling"], depth: 1 },
      { name: "Thumb", dataAttributes: ["data-orientation", "data-scrolling"], depth: 2 },
      { name: "Corner", dataAttributes: [], depth: 1 },
    ],
    category: "Layout",
    description: "A native scroll container with custom scrollbars.",
  },
  {
    name: "Separator",
    slug: "separator",
    importPath: "@base-ui/react/separator",
    parts: [
      { name: "Separator", dataAttributes: ["data-orientation"] },
    ],
    category: "Layout",
    description: "Accessible to screen readers.",
  },
  {
    name: "Toolbar",
    slug: "toolbar",
    importPath: "@base-ui/react/toolbar",
    parts: [
      { name: "Root", dataAttributes: ["data-orientation", "data-disabled"] },
      { name: "Button", dataAttributes: ["data-orientation", "data-disabled", "data-focusable"], depth: 1 },
      { name: "Link", dataAttributes: ["data-orientation"], depth: 1 },
      { name: "Separator", dataAttributes: ["data-orientation"], depth: 1 },
      { name: "Group", dataAttributes: ["data-orientation", "data-disabled"], depth: 1 },
      { name: "Input", dataAttributes: ["data-orientation", "data-disabled", "data-focusable"], depth: 1 },
    ],
    category: "Layout",
    description: "Groups a set of buttons and controls.",
  },

  /* ── Feedback ──────────────────────────────────────────────────── */

  {
    name: "Meter",
    slug: "meter",
    importPath: "@base-ui/react/meter",
    parts: [
      { name: "Root", dataAttributes: [] },
      { name: "Label", dataAttributes: [], depth: 1 },
      { name: "Track", dataAttributes: [], depth: 1 },
      { name: "Indicator", dataAttributes: [], depth: 2 },
      { name: "Value", dataAttributes: [], depth: 1 },
    ],
    category: "Feedback",
    description: "A graphical display of a numeric value.",
  },
  {
    name: "Progress",
    slug: "progress",
    importPath: "@base-ui/react/progress",
    parts: [
      { name: "Root", dataAttributes: ["data-complete", "data-indeterminate", "data-progressing"] },
      { name: "Track", dataAttributes: ["data-complete", "data-indeterminate", "data-progressing"], depth: 1 },
      { name: "Indicator", dataAttributes: ["data-complete", "data-indeterminate", "data-progressing"], depth: 2 },
      { name: "Value", dataAttributes: ["data-complete", "data-indeterminate", "data-progressing"], depth: 1 },
      { name: "Label", dataAttributes: ["data-complete", "data-indeterminate", "data-progressing"], depth: 1 },
    ],
    category: "Feedback",
    description: "Displays the status of a task that takes a long time.",
  },
  {
    name: "Toast",
    slug: "toast",
    importPath: "@base-ui/react/toast",
    parts: [
      { name: "Provider", dataAttributes: [] },
      { name: "Viewport", dataAttributes: [], depth: 1 },
      { name: "Portal", dataAttributes: [], depth: 1 },
      { name: "Root", dataAttributes: ["data-expanded", "data-limited", "data-type", "data-swipe-direction", ...ANIMATION_ATTRS], depth: 1 },
      { name: "Positioner", dataAttributes: [], depth: 2 },
      { name: "Content", dataAttributes: ["data-behind", "data-expanded"], depth: 3 },
      { name: "Title", dataAttributes: [], depth: 4 },
      { name: "Description", dataAttributes: [], depth: 4 },
      { name: "Close", dataAttributes: ["data-disabled"], depth: 4 },
      { name: "Action", dataAttributes: ["data-disabled"], depth: 4 },
      { name: "Arrow", dataAttributes: [], depth: 3 },
    ],
    category: "Feedback",
    description: "Notifications that appear temporarily.",
  },

  /* ── Data Display ──────────────────────────────────────────────── */

  {
    name: "Avatar",
    slug: "avatar",
    importPath: "@base-ui/react/avatar",
    parts: [
      { name: "Root", dataAttributes: [] },
      { name: "Image", dataAttributes: [...ANIMATION_ATTRS], depth: 1 },
      { name: "Fallback", dataAttributes: [], depth: 1 },
    ],
    category: "Data Display",
    description: "An avatar that is easy to customize.",
  },

  /* ── Complex forms (multi-import) ──────────────────────────────── */

  {
    name: "Autocomplete",
    slug: "autocomplete",
    importPath: "@base-ui/react/autocomplete",
    parts: [
      { name: "Root", dataAttributes: [] },
      { name: "InputGroup", dataAttributes: [], depth: 1 },
      { name: "Input", dataAttributes: ["data-placeholder"], depth: 2 },
      { name: "Trigger", dataAttributes: [], depth: 2 },
      { name: "Icon", dataAttributes: [], depth: 2 },
      { name: "Clear", dataAttributes: [], depth: 2 },
      { name: "Value", dataAttributes: [], depth: 2 },
      { name: "Portal", dataAttributes: [], depth: 1 },
      { name: "Backdrop", dataAttributes: [], depth: 2 },
      { name: "Positioner", dataAttributes: ["data-side", "data-align", "data-open", "data-closed", "data-anchor-hidden", ...ANIMATION_ATTRS], depth: 2 },
      { name: "Popup", dataAttributes: ["data-open", "data-closed", "data-empty", ...ANIMATION_ATTRS], depth: 3 },
      { name: "Arrow", dataAttributes: ["data-side", "data-align", "data-uncentered", "data-open", "data-closed"], depth: 3 },
      { name: "List", dataAttributes: ["data-empty"], depth: 4 },
      { name: "Item", dataAttributes: ["data-highlighted", "data-disabled", "data-selected"], depth: 4 },
      { name: "Group", dataAttributes: ["data-highlighted"], depth: 4 },
      { name: "GroupLabel", dataAttributes: [], depth: 5 },
      { name: "Empty", dataAttributes: [], depth: 4 },
      { name: "Status", dataAttributes: [], depth: 4 },
      { name: "Separator", dataAttributes: [], depth: 4 },
    ],
    category: "Forms",
    description: "An input with a list of filtered options.",
  },
  {
    name: "Combobox",
    slug: "combobox",
    importPath: "@base-ui/react/combobox",
    parts: [
      { name: "Root", dataAttributes: [] },
      { name: "Label", dataAttributes: [], depth: 1 },
      { name: "InputGroup", dataAttributes: [], depth: 1 },
      { name: "Input", dataAttributes: ["data-placeholder"], depth: 2 },
      { name: "Trigger", dataAttributes: ["data-pressed", "data-open", "data-closed"], depth: 2 },
      { name: "Icon", dataAttributes: [], depth: 2 },
      { name: "Clear", dataAttributes: [], depth: 2 },
      { name: "Value", dataAttributes: [], depth: 2 },
      { name: "Portal", dataAttributes: [], depth: 1 },
      { name: "Backdrop", dataAttributes: ["data-open", "data-closed", ...ANIMATION_ATTRS], depth: 2 },
      { name: "Positioner", dataAttributes: ["data-side", "data-align", "data-anchor-hidden", "data-open", "data-closed", ...ANIMATION_ATTRS], depth: 2 },
      { name: "Popup", dataAttributes: ["data-open", "data-closed", "data-empty", "data-instant", ...ANIMATION_ATTRS], depth: 3 },
      { name: "Arrow", dataAttributes: ["data-side", "data-align", "data-uncentered", "data-open", "data-closed"], depth: 3 },
      { name: "List", dataAttributes: ["data-empty"], depth: 4 },
      { name: "Item", dataAttributes: ["data-highlighted", "data-selected", "data-disabled"], depth: 4 },
      { name: "ItemIndicator", dataAttributes: [], depth: 5 },
      { name: "Separator", dataAttributes: [], depth: 4 },
      { name: "Group", dataAttributes: [], depth: 4 },
      { name: "GroupLabel", dataAttributes: [], depth: 5 },
      { name: "Empty", dataAttributes: [], depth: 4 },
      { name: "Status", dataAttributes: [], depth: 4 },
    ],
    category: "Forms",
    description: "An input combined with a list of predefined items to select.",
  },
]

/* ── Lookup helpers ─────────────────────────────────────────────── */

const REGISTRY_BY_SLUG = new Map(BASE_UI_REGISTRY.map((c) => [c.slug, c]))

/** Get a component by slug. */
export function getBaseUIComponent(slug: string): BaseUIComponent | undefined {
  return REGISTRY_BY_SLUG.get(slug)
}

/** Get all components in a category. */
export function getBaseUIComponentsByCategory(category: ComponentCategory): BaseUIComponent[] {
  return BASE_UI_REGISTRY.filter((c) => c.category === category)
}

/** All unique categories in display order. */
export const BASE_UI_CATEGORIES: ComponentCategory[] = [
  "Inputs",
  "Forms",
  "Overlays",
  "Navigation",
  "Layout",
  "Feedback",
  "Data Display",
]

/** Total number of registered components. */
export const BASE_UI_COMPONENT_COUNT = BASE_UI_REGISTRY.length

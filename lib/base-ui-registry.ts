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
      { name: "Toggle", dataAttributes: ["data-pressed", "data-disabled"] },
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
      { name: "Indicator", dataAttributes: [...CHECKED_ATTRS, "data-indeterminate", ...ANIMATION_ATTRS] },
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
      { name: "Label", dataAttributes: [...FIELD_ATTRS] },
      { name: "Control", dataAttributes: [...FIELD_ATTRS] },
      { name: "Description", dataAttributes: [...FIELD_ATTRS] },
      { name: "Error", dataAttributes: [...FIELD_ATTRS, ...ANIMATION_ATTRS] },
      { name: "Item", dataAttributes: [...FIELD_ATTRS] },
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
      { name: "Legend", dataAttributes: ["data-disabled"] },
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
      { name: "Group", dataAttributes: [...FIELD_ATTRS, "data-readonly", "data-required", "data-scrubbing"] },
      { name: "Input", dataAttributes: [...FIELD_ATTRS, "data-readonly", "data-required", "data-scrubbing"] },
      { name: "ScrubArea", dataAttributes: [...FIELD_ATTRS, "data-readonly", "data-required", "data-scrubbing"] },
      { name: "ScrubAreaCursor", dataAttributes: [...FIELD_ATTRS, "data-readonly", "data-required", "data-scrubbing"] },
      { name: "Increment", dataAttributes: [...FIELD_ATTRS, "data-readonly", "data-required", "data-scrubbing"] },
      { name: "Decrement", dataAttributes: [...FIELD_ATTRS, "data-readonly", "data-required", "data-scrubbing"] },
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
      { name: "Input", dataAttributes: [...FIELD_ATTRS, "data-readonly", "data-required", "data-complete"] },
      { name: "Separator", dataAttributes: [] },
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
      { name: "Root", dataAttributes: [...CHECKED_ATTRS] },
      { name: "Indicator", dataAttributes: [...CHECKED_ATTRS, ...ANIMATION_ATTRS] },
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
      { name: "Label", dataAttributes: [] },
      { name: "Trigger", dataAttributes: ["data-popup-open", "data-popup-side", "data-pressed", "data-disabled", "data-readonly", "data-required", "data-placeholder", ...FIELD_ATTRS.filter((a) => a !== "data-disabled")] },
      { name: "Value", dataAttributes: ["data-placeholder"] },
      { name: "Icon", dataAttributes: ["data-popup-open"] },
      { name: "Portal", dataAttributes: [] },
      { name: "Backdrop", dataAttributes: ["data-open", "data-closed", ...ANIMATION_ATTRS] },
      { name: "Positioner", dataAttributes: ["data-side", ...ANIMATION_ATTRS] },
      { name: "Popup", dataAttributes: ["data-side", ...ANIMATION_ATTRS] },
      { name: "List", dataAttributes: [] },
      { name: "ScrollUpArrow", dataAttributes: ["data-direction", "data-side"] },
      { name: "ScrollDownArrow", dataAttributes: ["data-direction", "data-side"] },
      { name: "Item", dataAttributes: ["data-highlighted"] },
      { name: "ItemIndicator", dataAttributes: [] },
      { name: "ItemText", dataAttributes: [] },
      { name: "Group", dataAttributes: [] },
      { name: "GroupLabel", dataAttributes: [] },
      { name: "Separator", dataAttributes: [] },
      { name: "Arrow", dataAttributes: [] },
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
      { name: "Label", dataAttributes: ["data-dragging", "data-orientation", ...FIELD_ATTRS] },
      { name: "Value", dataAttributes: ["data-dragging", "data-orientation", ...FIELD_ATTRS] },
      { name: "Control", dataAttributes: ["data-dragging", "data-orientation", ...FIELD_ATTRS] },
      { name: "Track", dataAttributes: ["data-dragging", "data-orientation", ...FIELD_ATTRS] },
      { name: "Indicator", dataAttributes: ["data-dragging", "data-orientation", ...FIELD_ATTRS] },
      { name: "Thumb", dataAttributes: ["data-dragging", "data-orientation", ...FIELD_ATTRS, "data-index"] },
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
      { name: "Thumb", dataAttributes: [...CHECKED_ATTRS] },
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
      { name: "Trigger", dataAttributes: ["data-popup-open", "data-disabled"] },
      { name: "Portal", dataAttributes: [] },
      { name: "Backdrop", dataAttributes: ["data-open", "data-closed", ...ANIMATION_ATTRS] },
      { name: "Viewport", dataAttributes: ["data-open", "data-closed", ...ANIMATION_ATTRS] },
      { name: "Popup", dataAttributes: ["data-open", "data-closed", "data-nested-dialog-open", ...ANIMATION_ATTRS] },
      { name: "Title", dataAttributes: [] },
      { name: "Description", dataAttributes: [] },
      { name: "Close", dataAttributes: ["data-disabled"] },
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
      { name: "Trigger", dataAttributes: ["data-popup-open", "data-pressed"] },
      { name: "Portal", dataAttributes: [] },
      { name: "Backdrop", dataAttributes: ["data-open", "data-closed", ...ANIMATION_ATTRS] },
      { name: "Positioner", dataAttributes: ["data-open", "data-closed", "data-side", ...ANIMATION_ATTRS] },
      { name: "Popup", dataAttributes: ["data-open", "data-closed", "data-side", "data-instant", ...ANIMATION_ATTRS] },
      { name: "Arrow", dataAttributes: ["data-side"] },
      { name: "Item", dataAttributes: ["data-highlighted", "data-disabled"] },
      { name: "LinkItem", dataAttributes: ["data-highlighted", "data-disabled"] },
      { name: "Separator", dataAttributes: [] },
      { name: "Group", dataAttributes: [] },
      { name: "GroupLabel", dataAttributes: [] },
      { name: "SubmenuRoot", dataAttributes: [] },
      { name: "SubmenuTrigger", dataAttributes: ["data-highlighted", "data-disabled", "data-popup-open"] },
      { name: "RadioGroup", dataAttributes: [] },
      { name: "RadioItem", dataAttributes: ["data-highlighted", "data-disabled", "data-checked", "data-unchecked"] },
      { name: "RadioItemIndicator", dataAttributes: ["data-checked", "data-unchecked", ...ANIMATION_ATTRS] },
      { name: "CheckboxItem", dataAttributes: ["data-highlighted", "data-disabled", "data-checked", "data-unchecked"] },
      { name: "CheckboxItemIndicator", dataAttributes: ["data-checked", "data-unchecked", ...ANIMATION_ATTRS] },
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
      { name: "Trigger", dataAttributes: ["data-disabled"] },
      { name: "Portal", dataAttributes: [] },
      { name: "Backdrop", dataAttributes: [...ANIMATION_ATTRS] },
      { name: "Viewport", dataAttributes: ["data-ending-style"] },
      { name: "Popup", dataAttributes: ["data-nested-dialog-open", ...ANIMATION_ATTRS] },
      { name: "Title", dataAttributes: [] },
      { name: "Description", dataAttributes: [] },
      { name: "Close", dataAttributes: ["data-disabled"] },
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
      { name: "Trigger", dataAttributes: [] },
      { name: "Portal", dataAttributes: [] },
      { name: "Backdrop", dataAttributes: ["data-swiping", ...ANIMATION_ATTRS] },
      { name: "Popup", dataAttributes: ["data-swiping", "data-nested-drawer-open", "data-nested-drawer-swiping", ...ANIMATION_ATTRS] },
      { name: "Title", dataAttributes: [] },
      { name: "Description", dataAttributes: [] },
      { name: "Close", dataAttributes: [] },
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
      { name: "Trigger", dataAttributes: ["data-pressed", "data-disabled"] },
      { name: "Portal", dataAttributes: [] },
      { name: "Backdrop", dataAttributes: [] },
      { name: "Positioner", dataAttributes: [] },
      { name: "Popup", dataAttributes: [...ANIMATION_ATTRS] },
      { name: "Arrow", dataAttributes: ["data-side"] },
      { name: "Item", dataAttributes: ["data-highlighted", "data-disabled"] },
      { name: "LinkItem", dataAttributes: ["data-highlighted", "data-disabled"] },
      { name: "Separator", dataAttributes: [] },
      { name: "Group", dataAttributes: [] },
      { name: "GroupLabel", dataAttributes: [] },
      { name: "SubmenuRoot", dataAttributes: [] },
      { name: "SubmenuTrigger", dataAttributes: ["data-highlighted", "data-disabled", "data-popup-open"] },
      { name: "RadioGroup", dataAttributes: [] },
      { name: "RadioItem", dataAttributes: ["data-highlighted", "data-disabled"] },
      { name: "RadioItemIndicator", dataAttributes: [] },
      { name: "CheckboxItem", dataAttributes: ["data-highlighted", "data-disabled"] },
      { name: "CheckboxItemIndicator", dataAttributes: [] },
      { name: "Viewport", dataAttributes: [] },
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
      { name: "Trigger", dataAttributes: ["data-popup-open", "data-pressed"] },
      { name: "Portal", dataAttributes: [] },
      { name: "Backdrop", dataAttributes: ["data-open", "data-closed", ...ANIMATION_ATTRS] },
      { name: "Positioner", dataAttributes: ["data-instant", "data-side"] },
      { name: "Popup", dataAttributes: ["data-instant", "data-side", ...ANIMATION_ATTRS] },
      { name: "Arrow", dataAttributes: ["data-side"] },
      { name: "Title", dataAttributes: [] },
      { name: "Description", dataAttributes: [] },
      { name: "Close", dataAttributes: [] },
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
      { name: "Trigger", dataAttributes: ["data-popup-open"] },
      { name: "Portal", dataAttributes: [] },
      { name: "Backdrop", dataAttributes: ["data-open", "data-closed", ...ANIMATION_ATTRS] },
      { name: "Positioner", dataAttributes: ["data-open", "data-closed", "data-anchor-hidden", "data-align", "data-side"] },
      { name: "Popup", dataAttributes: [...ANIMATION_ATTRS] },
      { name: "Arrow", dataAttributes: [] },
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
      { name: "Trigger", dataAttributes: ["data-popup-open", "data-trigger-disabled"] },
      { name: "Portal", dataAttributes: [] },
      { name: "Positioner", dataAttributes: ["data-instant"] },
      { name: "Popup", dataAttributes: ["data-instant", ...ANIMATION_ATTRS] },
      { name: "Arrow", dataAttributes: ["data-side"] },
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
      { name: "List", dataAttributes: [] },
      { name: "Item", dataAttributes: [] },
      { name: "Trigger", dataAttributes: ["data-popup-open", "data-pressed"] },
      { name: "Icon", dataAttributes: ["data-popup-open"] },
      { name: "Content", dataAttributes: ["data-activation-direction", ...ANIMATION_ATTRS] },
      { name: "Link", dataAttributes: [] },
      { name: "Portal", dataAttributes: [] },
      { name: "Positioner", dataAttributes: ["data-instant", "data-side"] },
      { name: "Popup", dataAttributes: ["data-side", ...ANIMATION_ATTRS] },
      { name: "Arrow", dataAttributes: ["data-side"] },
      { name: "Viewport", dataAttributes: [] },
      { name: "Backdrop", dataAttributes: [] },
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
      { name: "List", dataAttributes: ["data-orientation", "data-activation-direction"] },
      { name: "Tab", dataAttributes: ["data-orientation", "data-activation-direction", "data-active", "data-disabled"] },
      { name: "Panel", dataAttributes: ["data-orientation", "data-activation-direction", "data-hidden", "data-index", ...ANIMATION_ATTRS] },
      { name: "Indicator", dataAttributes: ["data-orientation", "data-activation-direction"] },
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
      { name: "Item", dataAttributes: ["data-open", "data-disabled", "data-index"] },
      { name: "Header", dataAttributes: ["data-open", "data-disabled", "data-index"] },
      { name: "Trigger", dataAttributes: ["data-panel-open", "data-disabled"] },
      { name: "Panel", dataAttributes: ["data-open", "data-orientation", "data-disabled", "data-index", ...ANIMATION_ATTRS] },
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
      { name: "Trigger", dataAttributes: ["data-panel-open"] },
      { name: "Panel", dataAttributes: ["data-open", "data-closed", ...ANIMATION_ATTRS] },
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
      { name: "Viewport", dataAttributes: ["data-has-overflow-x", "data-has-overflow-y", "data-scrolling"] },
      { name: "Content", dataAttributes: ["data-has-overflow-x", "data-has-overflow-y", "data-scrolling"] },
      { name: "Scrollbar", dataAttributes: ["data-orientation", "data-hovering", "data-scrolling"] },
      { name: "Thumb", dataAttributes: ["data-orientation", "data-scrolling"] },
      { name: "Corner", dataAttributes: [] },
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
      { name: "Button", dataAttributes: ["data-orientation", "data-disabled", "data-focusable"] },
      { name: "Link", dataAttributes: ["data-orientation"] },
      { name: "Separator", dataAttributes: ["data-orientation"] },
      { name: "Group", dataAttributes: ["data-orientation", "data-disabled"] },
      { name: "Input", dataAttributes: ["data-orientation", "data-disabled", "data-focusable"] },
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
      { name: "Label", dataAttributes: [] },
      { name: "Track", dataAttributes: [] },
      { name: "Indicator", dataAttributes: [] },
      { name: "Value", dataAttributes: [] },
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
      { name: "Track", dataAttributes: ["data-complete", "data-indeterminate", "data-progressing"] },
      { name: "Indicator", dataAttributes: ["data-complete", "data-indeterminate", "data-progressing"] },
      { name: "Value", dataAttributes: ["data-complete", "data-indeterminate", "data-progressing"] },
      { name: "Label", dataAttributes: ["data-complete", "data-indeterminate", "data-progressing"] },
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
      { name: "Viewport", dataAttributes: [] },
      { name: "Portal", dataAttributes: [] },
      { name: "Root", dataAttributes: ["data-expanded", "data-limited", "data-type", "data-swipe-direction", ...ANIMATION_ATTRS] },
      { name: "Positioner", dataAttributes: [] },
      { name: "Content", dataAttributes: ["data-behind", "data-expanded"] },
      { name: "Title", dataAttributes: [] },
      { name: "Description", dataAttributes: [] },
      { name: "Close", dataAttributes: ["data-disabled"] },
      { name: "Action", dataAttributes: ["data-disabled"] },
      { name: "Arrow", dataAttributes: [] },
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
      { name: "Image", dataAttributes: [...ANIMATION_ATTRS] },
      { name: "Fallback", dataAttributes: [] },
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
      { name: "InputGroup", dataAttributes: [] },
      { name: "Input", dataAttributes: ["data-placeholder"] },
      { name: "Trigger", dataAttributes: [] },
      { name: "Icon", dataAttributes: [] },
      { name: "Clear", dataAttributes: [] },
      { name: "Value", dataAttributes: [] },
      { name: "Portal", dataAttributes: [] },
      { name: "Backdrop", dataAttributes: [] },
      { name: "Positioner", dataAttributes: ["data-side", "data-align", "data-open", "data-closed", "data-anchor-hidden", ...ANIMATION_ATTRS] },
      { name: "Popup", dataAttributes: ["data-open", "data-closed", "data-empty", ...ANIMATION_ATTRS] },
      { name: "Arrow", dataAttributes: ["data-side", "data-align", "data-uncentered", "data-open", "data-closed"] },
      { name: "List", dataAttributes: ["data-empty"] },
      { name: "Item", dataAttributes: ["data-highlighted", "data-disabled", "data-selected"] },
      { name: "Group", dataAttributes: ["data-highlighted"] },
      { name: "GroupLabel", dataAttributes: [] },
      { name: "Empty", dataAttributes: [] },
      { name: "Status", dataAttributes: [] },
      { name: "Separator", dataAttributes: [] },
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
      { name: "Label", dataAttributes: [] },
      { name: "InputGroup", dataAttributes: [] },
      { name: "Input", dataAttributes: ["data-placeholder"] },
      { name: "Trigger", dataAttributes: ["data-pressed", "data-open", "data-closed"] },
      { name: "Icon", dataAttributes: [] },
      { name: "Clear", dataAttributes: [] },
      { name: "Value", dataAttributes: [] },
      { name: "Portal", dataAttributes: [] },
      { name: "Backdrop", dataAttributes: ["data-open", "data-closed", ...ANIMATION_ATTRS] },
      { name: "Positioner", dataAttributes: ["data-side", "data-align", "data-anchor-hidden", "data-open", "data-closed", ...ANIMATION_ATTRS] },
      { name: "Popup", dataAttributes: ["data-open", "data-closed", "data-empty", "data-instant", ...ANIMATION_ATTRS] },
      { name: "Arrow", dataAttributes: ["data-side", "data-align", "data-uncentered", "data-open", "data-closed"] },
      { name: "List", dataAttributes: ["data-empty"] },
      { name: "Item", dataAttributes: ["data-highlighted", "data-selected", "data-disabled"] },
      { name: "ItemIndicator", dataAttributes: [] },
      { name: "Separator", dataAttributes: [] },
      { name: "Group", dataAttributes: [] },
      { name: "GroupLabel", dataAttributes: [] },
      { name: "Empty", dataAttributes: [] },
      { name: "Status", dataAttributes: [] },
    ],
    category: "Forms",
    description: "An input combined with a list of predefined items to select.",
  },
]

/* ── Lookup helpers ─────────────────────────────────────────────── */

/** Get a component by slug. */
export function getBaseUIComponent(slug: string): BaseUIComponent | undefined {
  return BASE_UI_REGISTRY.find((c) => c.slug === slug)
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

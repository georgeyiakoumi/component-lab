/**
 * Base UI code generator — produces copy-paste-ready TSX for each component.
 *
 * Each component has a hand-written template that mirrors the preview
 * renderer's JSX structure. This ensures the generated code matches
 * what the user sees in the canvas.
 *
 * GEO-848
 */

import type { BaseUIComponent } from "@/lib/base-ui-registry"

type ClassMap = Record<string, string>

/** Emit className="..." if the part has classes, otherwise empty string */
function cp(cm: ClassMap, part: string): string {
  const c = cm[part]?.trim()
  return c ? ` className="${c}"` : ""
}

/** Generate import statements for a component */
function imports(component: BaseUIComponent): string {
  const lines = [`import { ${component.name} } from "${component.importPath}"`]
  if (component.additionalImports) {
    for (const imp of component.additionalImports) {
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

/** Wrap JSX body in a named export function */
function wrap(
  component: BaseUIComponent,
  body: string,
  extraImports?: string,
): string {
  const imp = imports(component)
  const allImports = extraImports ? `${imp}\n${extraImports}` : imp
  return `${allImports}\n\nexport function My${component.name}() {\n  return (\n${body}\n  )\n}`
}

/* ── Per-component code templates ──────────────────────────────── */

type CodeTemplate = (cm: ClassMap, component: BaseUIComponent) => string

const templates: Record<string, CodeTemplate> = {
  /* ── Inputs ──────────────────────────────────────────────────── */

  button: (cm, c) =>
    wrap(c, `    <${c.name}${cp(cm, "Button")}>Click me</${c.name}>`),

  toggle: (cm, c) =>
    wrap(c, `    <Toggle${cp(cm, "Toggle")} aria-label="Bold">Bold</Toggle>`),

  "toggle-group": (cm, c) =>
    wrap(
      c,
      `    <ToggleGroup${cp(cm, "Root")} aria-label="Text formatting">
      <Toggle${cp(cm, "Toggle")} value="bold" aria-label="Bold">B</Toggle>
      <Toggle${cp(cm, "Toggle")} value="italic" aria-label="Italic">I</Toggle>
      <Toggle${cp(cm, "Toggle")} value="underline" aria-label="Underline">U</Toggle>
    </ToggleGroup>`,
    ),

  /* ── Forms ───────────────────────────────────────────────────── */

  checkbox: (cm, c) =>
    wrap(
      c,
      `    <label className="flex items-center gap-2">
      <Checkbox.Root${cp(cm, "Root")}>
        <Checkbox.Indicator${cp(cm, "Indicator")}>
          <CheckIcon />
        </Checkbox.Indicator>
      </Checkbox.Root>
      <span className="text-sm">Accept terms</span>
    </label>`,
    ),

  "checkbox-group": (cm, c) =>
    wrap(
      c,
      `    <CheckboxGroup${cp(cm, "GroupRoot")} defaultValue={["option-a"]}>
      <label className="flex items-center gap-2">
        <Checkbox.Root${cp(cm, "Root")} value="option-a">
          <Checkbox.Indicator${cp(cm, "Indicator")}><CheckIcon /></Checkbox.Indicator>
        </Checkbox.Root>
        <span className="text-sm">Option A</span>
      </label>
      <label className="flex items-center gap-2">
        <Checkbox.Root${cp(cm, "Root")} value="option-b">
          <Checkbox.Indicator${cp(cm, "Indicator")}><CheckIcon /></Checkbox.Indicator>
        </Checkbox.Root>
        <span className="text-sm">Option B</span>
      </label>
    </CheckboxGroup>`,
    ),

  field: (cm, c) =>
    wrap(
      c,
      `    <Field.Root${cp(cm, "Root")}>
      <Field.Label${cp(cm, "Label")}>Email</Field.Label>
      <Field.Control${cp(cm, "Control")} placeholder="you@example.com" />
      <Field.Description${cp(cm, "Description")}>
        We'll never share your email.
      </Field.Description>
    </Field.Root>`,
    ),

  fieldset: (cm, c) =>
    wrap(
      c,
      `    <Fieldset.Root${cp(cm, "Root")}>
      <Fieldset.Legend${cp(cm, "Legend")}>Contact info</Fieldset.Legend>
      <div className="mt-3 space-y-3">
        <Field.Root className="flex flex-col gap-1">
          <Field.Label className="text-sm font-medium">Name</Field.Label>
          <Field.Control placeholder="Jane Doe" />
        </Field.Root>
      </div>
    </Fieldset.Root>`,
      `import { Field } from "@base-ui/react/field"`,
    ),

  form: (cm, c) =>
    wrap(
      c,
      `    <Form${cp(cm, "Root")} errors={{}}>
      <div className="space-y-3">
        <Field.Root name="username" className="flex flex-col gap-1">
          <Field.Label className="text-sm font-medium">Username</Field.Label>
          <Field.Control placeholder="johndoe" />
        </Field.Root>
        <button type="submit">Submit</button>
      </div>
    </Form>`,
      `import { Field } from "@base-ui/react/field"`,
    ),

  input: (cm, c) =>
    wrap(c, `    <Input${cp(cm, "Input")} placeholder="Type something..." />`),

  "number-field": (cm, c) =>
    wrap(
      c,
      `    <NumberField.Root${cp(cm, "Root")} defaultValue={25}>
      <NumberField.Group${cp(cm, "Group")}>
        <NumberField.Decrement${cp(cm, "Decrement")}>&minus;</NumberField.Decrement>
        <NumberField.Input${cp(cm, "Input")} />
        <NumberField.Increment${cp(cm, "Increment")}>+</NumberField.Increment>
      </NumberField.Group>
    </NumberField.Root>`,
    ),

  "otp-field": (cm, c) =>
    wrap(
      c,
      `    <OTPField.Root${cp(cm, "Root")} length={6}>
      <OTPField.Input${cp(cm, "Input")} />
      <OTPField.Input${cp(cm, "Input")} />
      <OTPField.Input${cp(cm, "Input")} />
      <OTPField.Separator${cp(cm, "Separator")}>-</OTPField.Separator>
      <OTPField.Input${cp(cm, "Input")} />
      <OTPField.Input${cp(cm, "Input")} />
      <OTPField.Input${cp(cm, "Input")} />
    </OTPField.Root>`,
    ),

  radio: (cm, c) =>
    wrap(
      c,
      `    <RadioGroup${cp(cm, "Group")} defaultValue="option-1">
      <label className="flex items-center gap-2">
        <Radio.Root${cp(cm, "Root")} value="option-1">
          <Radio.Indicator${cp(cm, "Indicator")} />
        </Radio.Root>
        <span className="text-sm">Option 1</span>
      </label>
      <label className="flex items-center gap-2">
        <Radio.Root${cp(cm, "Root")} value="option-2">
          <Radio.Indicator${cp(cm, "Indicator")} />
        </Radio.Root>
        <span className="text-sm">Option 2</span>
      </label>
    </RadioGroup>`,
    ),

  select: (cm, c) =>
    wrap(
      c,
      `    <Select.Root defaultValue="apple">
      <Select.Trigger${cp(cm, "Trigger")}>
        <Select.Value${cp(cm, "Value")} />
        <Select.Icon${cp(cm, "Icon")}>&#9660;</Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner${cp(cm, "Positioner")}>
          <Select.Popup${cp(cm, "Popup")}>
            <Select.List>
              <Select.Item${cp(cm, "Item")} value="apple">
                <Select.ItemText>Apple</Select.ItemText>
              </Select.Item>
              <Select.Item${cp(cm, "Item")} value="banana">
                <Select.ItemText>Banana</Select.ItemText>
              </Select.Item>
            </Select.List>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>`,
    ),

  slider: (cm, c) =>
    wrap(
      c,
      `    <Slider.Root${cp(cm, "Root")} defaultValue={50}>
      <Slider.Control${cp(cm, "Control")}>
        <Slider.Track${cp(cm, "Track")}>
          <Slider.Indicator${cp(cm, "Indicator")} />
          <Slider.Thumb${cp(cm, "Thumb")} aria-label="Value" />
        </Slider.Track>
      </Slider.Control>
    </Slider.Root>`,
    ),

  switch: (cm, c) =>
    wrap(
      c,
      `    <Switch.Root${cp(cm, "Root")}>
      <Switch.Thumb${cp(cm, "Thumb")} />
    </Switch.Root>`,
    ),

  autocomplete: (cm, c) =>
    wrap(
      c,
      `    <Autocomplete.Root items={items}>
      <Autocomplete.Input${cp(cm, "Input")} placeholder="Search..." />
      <Autocomplete.Portal>
        <Autocomplete.Positioner${cp(cm, "Positioner")}>
          <Autocomplete.Popup${cp(cm, "Popup")}>
            <Autocomplete.List>
              {items.map((item) => (
                <Autocomplete.Item${cp(cm, "Item")} key={item} value={item}>
                  {item}
                </Autocomplete.Item>
              ))}
            </Autocomplete.List>
          </Autocomplete.Popup>
        </Autocomplete.Positioner>
      </Autocomplete.Portal>
    </Autocomplete.Root>`,
    ),

  combobox: (cm, c) =>
    wrap(
      c,
      `    <Combobox.Root items={items} defaultValue="">
      <Combobox.InputGroup${cp(cm, "InputGroup")}>
        <Combobox.Input${cp(cm, "Input")} placeholder="Select..." />
        <Combobox.Trigger${cp(cm, "Trigger")}>&#9660;</Combobox.Trigger>
      </Combobox.InputGroup>
      <Combobox.Portal>
        <Combobox.Positioner${cp(cm, "Positioner")}>
          <Combobox.Popup${cp(cm, "Popup")}>
            <Combobox.List>
              {items.map((item) => (
                <Combobox.Item${cp(cm, "Item")} key={item} value={item}>
                  {item}
                  <Combobox.ItemIndicator${cp(cm, "ItemIndicator")}>&#10003;</Combobox.ItemIndicator>
                </Combobox.Item>
              ))}
            </Combobox.List>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>`,
    ),

  /* ── Overlays ────────────────────────────────────────────────── */

  "alert-dialog": (cm, c) =>
    wrap(
      c,
      `    <AlertDialog.Root>
      <AlertDialog.Trigger${cp(cm, "Trigger")}>Delete item</AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Backdrop${cp(cm, "Backdrop")} />
        <AlertDialog.Popup${cp(cm, "Popup")}>
          <AlertDialog.Title${cp(cm, "Title")}>Are you sure?</AlertDialog.Title>
          <AlertDialog.Description${cp(cm, "Description")}>
            This action cannot be undone.
          </AlertDialog.Description>
          <div className="mt-4 flex gap-2">
            <AlertDialog.Close${cp(cm, "Close")}>Cancel</AlertDialog.Close>
            <AlertDialog.Close${cp(cm, "Close")}>Confirm</AlertDialog.Close>
          </div>
        </AlertDialog.Popup>
      </AlertDialog.Portal>
    </AlertDialog.Root>`,
    ),

  "context-menu": (cm, c) =>
    wrap(
      c,
      `    <ContextMenu.Root>
      <ContextMenu.Trigger${cp(cm, "Trigger")}>Right-click here</ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Positioner${cp(cm, "Positioner")}>
          <ContextMenu.Popup${cp(cm, "Popup")}>
            <ContextMenu.Item${cp(cm, "Item")}>Cut</ContextMenu.Item>
            <ContextMenu.Item${cp(cm, "Item")}>Copy</ContextMenu.Item>
            <ContextMenu.Item${cp(cm, "Item")}>Paste</ContextMenu.Item>
          </ContextMenu.Popup>
        </ContextMenu.Positioner>
      </ContextMenu.Portal>
    </ContextMenu.Root>`,
    ),

  dialog: (cm, c) =>
    wrap(
      c,
      `    <Dialog.Root>
      <Dialog.Trigger${cp(cm, "Trigger")}>Open dialog</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop${cp(cm, "Backdrop")} />
        <Dialog.Popup${cp(cm, "Popup")}>
          <Dialog.Title${cp(cm, "Title")}>Dialog title</Dialog.Title>
          <Dialog.Description${cp(cm, "Description")}>
            This is a dialog description.
          </Dialog.Description>
          <Dialog.Close${cp(cm, "Close")}>Close</Dialog.Close>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>`,
    ),

  drawer: (cm, c) =>
    wrap(
      c,
      `    <Drawer.Root>
      <Drawer.Trigger${cp(cm, "Trigger")}>Open drawer</Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Backdrop${cp(cm, "Backdrop")} />
        <Drawer.Viewport className="fixed inset-0 flex items-end justify-center">
          <Drawer.Popup${cp(cm, "Popup")}>
            <Drawer.Content>
              <Drawer.Title${cp(cm, "Title")}>Drawer title</Drawer.Title>
              <Drawer.Description${cp(cm, "Description")}>
                Swipe down to dismiss.
              </Drawer.Description>
              <Drawer.Close${cp(cm, "Close")}>Close</Drawer.Close>
            </Drawer.Content>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>`,
    ),

  menu: (cm, c) =>
    wrap(
      c,
      `    <Menu.Root>
      <Menu.Trigger${cp(cm, "Trigger")}>Open menu</Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner${cp(cm, "Positioner")}>
          <Menu.Popup${cp(cm, "Popup")}>
            <Menu.Item${cp(cm, "Item")}>Edit</Menu.Item>
            <Menu.Item${cp(cm, "Item")}>Duplicate</Menu.Item>
            <Menu.Separator${cp(cm, "Separator")} />
            <Menu.Item${cp(cm, "Item")}>Delete</Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>`,
    ),

  popover: (cm, c) =>
    wrap(
      c,
      `    <Popover.Root>
      <Popover.Trigger${cp(cm, "Trigger")}>Open popover</Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner${cp(cm, "Positioner")}>
          <Popover.Popup${cp(cm, "Popup")}>
            <Popover.Arrow${cp(cm, "Arrow")} />
            <Popover.Title${cp(cm, "Title")}>Popover</Popover.Title>
            <Popover.Description${cp(cm, "Description")}>
              This is a popover.
            </Popover.Description>
            <Popover.Close${cp(cm, "Close")}>Close</Popover.Close>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>`,
    ),

  "preview-card": (cm, c) =>
    wrap(
      c,
      `    <PreviewCard.Root>
      <PreviewCard.Trigger${cp(cm, "Trigger")} href="#">
        Hover this link
      </PreviewCard.Trigger>
      <PreviewCard.Portal>
        <PreviewCard.Positioner${cp(cm, "Positioner")}>
          <PreviewCard.Popup${cp(cm, "Popup")}>
            <p className="text-sm font-semibold">Preview Card</p>
            <p className="text-xs text-muted-foreground">Hover content</p>
          </PreviewCard.Popup>
        </PreviewCard.Positioner>
      </PreviewCard.Portal>
    </PreviewCard.Root>`,
    ),

  tooltip: (cm, c) =>
    wrap(
      c,
      `    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger${cp(cm, "Trigger")}>Hover me</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Positioner${cp(cm, "Positioner")}>
            <Tooltip.Popup${cp(cm, "Popup")}>
              <Tooltip.Arrow${cp(cm, "Arrow")} />
              Tooltip content
            </Tooltip.Popup>
          </Tooltip.Positioner>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>`,
    ),

  /* ── Navigation ──────────────────────────────────────────────── */

  menubar: (cm, c) =>
    wrap(
      c,
      `    <div${cp(cm, "Root")} role="menubar">
      <Menu.Root>
        <Menu.Trigger${cp(cm, "Trigger")}>File</Menu.Trigger>
        <Menu.Portal>
          <Menu.Positioner${cp(cm, "Positioner")} sideOffset={4}>
            <Menu.Popup${cp(cm, "Popup")}>
              <Menu.Item${cp(cm, "Item")}>New File</Menu.Item>
              <Menu.Item${cp(cm, "Item")}>Open</Menu.Item>
              <Menu.Item${cp(cm, "Item")}>Save</Menu.Item>
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>
      <Menu.Root>
        <Menu.Trigger${cp(cm, "Trigger")}>Edit</Menu.Trigger>
        <Menu.Portal>
          <Menu.Positioner${cp(cm, "Positioner")} sideOffset={4}>
            <Menu.Popup${cp(cm, "Popup")}>
              <Menu.Item${cp(cm, "Item")}>Undo</Menu.Item>
              <Menu.Item${cp(cm, "Item")}>Redo</Menu.Item>
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>
    </div>`,
      `import { Menu } from "@base-ui/react/menu"`,
    ),

  "navigation-menu": (cm, c) =>
    wrap(
      c,
      `    <NavigationMenu.Root${cp(cm, "Root")}>
      <NavigationMenu.List${cp(cm, "List")}>
        <NavigationMenu.Item>
          <NavigationMenu.Link${cp(cm, "Link")} href="#">Home</NavigationMenu.Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Trigger${cp(cm, "Trigger")}>
            Products
            <NavigationMenu.Icon${cp(cm, "Icon")}>&#9660;</NavigationMenu.Icon>
          </NavigationMenu.Trigger>
          <NavigationMenu.Content${cp(cm, "Content")}>
            <NavigationMenu.Link${cp(cm, "Link")} href="#">Product A</NavigationMenu.Link>
            <NavigationMenu.Link${cp(cm, "Link")} href="#">Product B</NavigationMenu.Link>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
      </NavigationMenu.List>
      <NavigationMenu.Portal>
        <NavigationMenu.Positioner${cp(cm, "Positioner")}>
          <NavigationMenu.Popup${cp(cm, "Popup")}>
            <NavigationMenu.Viewport${cp(cm, "Viewport")} />
          </NavigationMenu.Popup>
        </NavigationMenu.Positioner>
      </NavigationMenu.Portal>
    </NavigationMenu.Root>`,
    ),

  tabs: (cm, c) =>
    wrap(
      c,
      `    <Tabs.Root${cp(cm, "Root")} defaultValue="tab-1">
      <Tabs.List${cp(cm, "List")}>
        <Tabs.Tab${cp(cm, "Tab")} value="tab-1">Account</Tabs.Tab>
        <Tabs.Tab${cp(cm, "Tab")} value="tab-2">Settings</Tabs.Tab>
        <Tabs.Tab${cp(cm, "Tab")} value="tab-3">Billing</Tabs.Tab>
        <Tabs.Indicator${cp(cm, "Indicator")} />
      </Tabs.List>
      <Tabs.Panel${cp(cm, "Panel")} value="tab-1">Account settings content.</Tabs.Panel>
      <Tabs.Panel${cp(cm, "Panel")} value="tab-2">App settings content.</Tabs.Panel>
      <Tabs.Panel${cp(cm, "Panel")} value="tab-3">Billing details content.</Tabs.Panel>
    </Tabs.Root>`,
    ),

  /* ── Layout ──────────────────────────────────────────────────── */

  accordion: (cm, c) =>
    wrap(
      c,
      `    <Accordion.Root${cp(cm, "Root")}>
      <Accordion.Item${cp(cm, "Item")} value="1">
        <Accordion.Header>
          <Accordion.Trigger${cp(cm, "Trigger")}>Section 1</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Panel${cp(cm, "Panel")}>
          <div${cp(cm, "PanelContent")}>Content for section 1.</div>
        </Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item${cp(cm, "Item")} value="2">
        <Accordion.Header>
          <Accordion.Trigger${cp(cm, "Trigger")}>Section 2</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Panel${cp(cm, "Panel")}>
          <div${cp(cm, "PanelContent")}>Content for section 2.</div>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion.Root>`,
    ),

  collapsible: (cm, c) =>
    wrap(
      c,
      `    <Collapsible.Root${cp(cm, "Root")}>
      <Collapsible.Trigger${cp(cm, "Trigger")}>Toggle content</Collapsible.Trigger>
      <Collapsible.Panel${cp(cm, "Panel")}>
        <div${cp(cm, "PanelContent")}>This content can be expanded or collapsed.</div>
      </Collapsible.Panel>
    </Collapsible.Root>`,
    ),

  "scroll-area": (cm, c) =>
    wrap(
      c,
      `    <ScrollArea.Root${cp(cm, "Root")}>
      <ScrollArea.Viewport${cp(cm, "Viewport")}>
        <ScrollArea.Content${cp(cm, "Content")}>
          {/* Your scrollable content */}
        </ScrollArea.Content>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar${cp(cm, "Scrollbar")} orientation="vertical">
        <ScrollArea.Thumb${cp(cm, "Thumb")} />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>`,
    ),

  separator: (cm, c) =>
    wrap(c, `    <Separator${cp(cm, "Separator")} />`),

  toolbar: (cm, c) =>
    wrap(
      c,
      `    <Toolbar.Root${cp(cm, "Root")}>
      <Toolbar.Group${cp(cm, "Group")}>
        <Toolbar.Button${cp(cm, "Button")}>Cut</Toolbar.Button>
        <Toolbar.Button${cp(cm, "Button")}>Copy</Toolbar.Button>
        <Toolbar.Button${cp(cm, "Button")}>Paste</Toolbar.Button>
      </Toolbar.Group>
      <Toolbar.Separator${cp(cm, "Separator")} />
      <Toolbar.Link${cp(cm, "Link")} href="#">Help</Toolbar.Link>
    </Toolbar.Root>`,
    ),

  /* ── Feedback ────────────────────────────────────────────────── */

  meter: (cm, c) =>
    wrap(
      c,
      `    <Meter.Root${cp(cm, "Root")} value={65}>
      <Meter.Label${cp(cm, "Label")}>Storage used</Meter.Label>
      <Meter.Value${cp(cm, "Value")} />
      <Meter.Track${cp(cm, "Track")}>
        <Meter.Indicator${cp(cm, "Indicator")} />
      </Meter.Track>
    </Meter.Root>`,
    ),

  progress: (cm, c) =>
    wrap(
      c,
      `    <Progress.Root${cp(cm, "Root")} value={60}>
      <Progress.Label${cp(cm, "Label")}>Loading...</Progress.Label>
      <Progress.Value${cp(cm, "Value")} />
      <Progress.Track${cp(cm, "Track")}>
        <Progress.Indicator${cp(cm, "Indicator")} />
      </Progress.Track>
    </Progress.Root>`,
    ),

  toast: (cm, c) =>
    wrap(
      c,
      `    <Toast.Provider>
      <ToastTrigger />
      <Toast.Portal>
        <Toast.Viewport${cp(cm, "Viewport")}>
          <ToastList />
        </Toast.Viewport>
      </Toast.Portal>
    </Toast.Provider>`,
    ),

  /* ── Data Display ────────────────────────────────────────────── */

  avatar: (cm, c) =>
    wrap(
      c,
      `    <Avatar.Root${cp(cm, "Root")}>
      <Avatar.Image${cp(cm, "Image")} src="/avatar.jpg" alt="User" />
      <Avatar.Fallback${cp(cm, "Fallback")}>AB</Avatar.Fallback>
    </Avatar.Root>`,
    ),
}

/* ── Public API ─────────────────────────────────────────────────── */

/**
 * Generate copy-paste-ready TSX for a Base UI component with the
 * user's current classMap applied.
 */
export function generateBaseUICode(
  component: BaseUIComponent,
  classMap: ClassMap,
): string {
  const template = templates[component.slug]
  if (!template) {
    // Fallback: simple single-element output
    const c = classMap[component.parts[0]?.name ?? ""]?.trim()
    const cn = c ? ` className="${c}"` : ""
    return `${imports(component)}\n\nexport function My${component.name}() {\n  return <${component.name}${cn}>Content</${component.name}>\n}`
  }
  return template(classMap, component)
}

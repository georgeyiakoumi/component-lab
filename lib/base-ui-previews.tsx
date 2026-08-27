"use client"

/**
 * Base UI preview renderers — one render function per component.
 *
 * Each renderer accepts a `classMap` (part name → Tailwind classes) and
 * returns interactive JSX. Validated against official Base UI docs
 * for correct component hierarchy, required props, and part nesting.
 *
 * GEO-845
 */

import * as React from "react"

import { Accordion } from "@base-ui/react/accordion"
import { AlertDialog } from "@base-ui/react/alert-dialog"
import { Autocomplete } from "@base-ui/react/autocomplete"
import { Avatar } from "@base-ui/react/avatar"
import { Button } from "@base-ui/react/button"
import { Checkbox } from "@base-ui/react/checkbox"
import { CheckboxGroup } from "@base-ui/react/checkbox-group"
import { Collapsible } from "@base-ui/react/collapsible"
import { Combobox } from "@base-ui/react/combobox"
import { ContextMenu } from "@base-ui/react/context-menu"
import { Dialog } from "@base-ui/react/dialog"
import { Drawer } from "@base-ui/react/drawer"
import { Field } from "@base-ui/react/field"
import { Fieldset } from "@base-ui/react/fieldset"
import { Form } from "@base-ui/react/form"
import { Input } from "@base-ui/react/input"
import { Menu } from "@base-ui/react/menu"
import { Menubar } from "@base-ui/react/menubar"
import { Meter } from "@base-ui/react/meter"
import { NavigationMenu } from "@base-ui/react/navigation-menu"
import { NumberField } from "@base-ui/react/number-field"
import { OTPField } from "@base-ui/react/otp-field"
import { Popover } from "@base-ui/react/popover"
import { PreviewCard } from "@base-ui/react/preview-card"
import { Progress } from "@base-ui/react/progress"
import { Radio } from "@base-ui/react/radio"
import { RadioGroup } from "@base-ui/react/radio-group"
import { ScrollArea } from "@base-ui/react/scroll-area"
import { Select } from "@base-ui/react/select"
import { Separator } from "@base-ui/react/separator"
import { Slider } from "@base-ui/react/slider"
import { Switch } from "@base-ui/react/switch"
import { Tabs } from "@base-ui/react/tabs"
import { Toast } from "@base-ui/react/toast"
import { Toggle } from "@base-ui/react/toggle"
import { ToggleGroup } from "@base-ui/react/toggle-group"
import { Toolbar } from "@base-ui/react/toolbar"
import { Tooltip } from "@base-ui/react/tooltip"

/* ── Types ──────────────────────────────────────────────────────── */

/** Map of part name → Tailwind class string */
export type ClassMap = Record<string, string>

/** Optional ref to a DOM element that portals should mount into */
export type PortalContainer = React.RefObject<HTMLElement | null> | undefined

/** A preview renderer function */
export type PreviewRenderer = (classMap: ClassMap, portalContainer?: PortalContainer) => React.ReactNode

/** Get classes for a part, falling back to empty string */
function cls(classMap: ClassMap, part: string): string {
  return classMap[part] ?? ""
}

/* ── Toast sub-components (need hooks, must be separate components) */

function ToastTrigger() {
  const manager = Toast.useToastManager()
  return (
    <button
      className="inline-flex h-9 items-center justify-center rounded-md border border-border px-4 text-sm hover:bg-accent"
      onClick={() => manager.add({ title: "Saved", description: "Your changes have been saved." })}
    >
      Show toast
    </button>
  )
}

function ToastList({ cm }: { cm: ClassMap }) {
  const manager = Toast.useToastManager()
  return (
    <>
      {manager.toasts.map((toast) => (
        <Toast.Root key={toast.id} toast={toast} className={cls(cm, "Root")}>
          <Toast.Content className={cls(cm, "Content")}>
            <div className="flex-1">
              <Toast.Title className={cls(cm, "Title")} />
              <Toast.Description className={cls(cm, "Description")} />
            </div>
            <Toast.Close className={cls(cm, "Close")}>&times;</Toast.Close>
          </Toast.Content>
        </Toast.Root>
      ))}
    </>
  )
}

/* ── Preview renderers ──────────────────────────────────────────── */

const previews: Record<string, PreviewRenderer> = {
  /* ── Inputs ──────────────────────────────────────────────────── */

  button: (cm) => (
    <div className="flex gap-2">
      <Button className={cls(cm, "Button")}>Default</Button>
      <Button className={cls(cm, "Button")} disabled>Disabled</Button>
    </div>
  ),

  toggle: (cm) => (
    <Toggle className={cls(cm, "Toggle")} aria-label="Bold">Bold</Toggle>
  ),

  "toggle-group": (cm) => (
    <ToggleGroup className={cls(cm, "Root")} aria-label="Text formatting">
      <Toggle className={cls(cm, "Toggle")} value="bold" aria-label="Bold">B</Toggle>
      <Toggle className={cls(cm, "Toggle")} value="italic" aria-label="Italic">I</Toggle>
      <Toggle className={cls(cm, "Toggle")} value="underline" aria-label="Underline">U</Toggle>
    </ToggleGroup>
  ),

  /* ── Forms ───────────────────────────────────────────────────── */

  checkbox: (cm) => (
    <label className="flex items-center gap-2">
      <Checkbox.Root className={cls(cm, "Root")} defaultChecked>
        <Checkbox.Indicator className={cls(cm, "Indicator")}><svg className="h-3 w-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 6l3 3 5-5" /></svg></Checkbox.Indicator>
      </Checkbox.Root>
      <span className="text-sm">Accept terms</span>
    </label>
  ),

  "checkbox-group": (cm) => (
    <CheckboxGroup className={cls(cm, "GroupRoot")} defaultValue={["option-a"]}>
      {["Option A", "Option B", "Option C"].map((label) => {
        const value = `option-${label.toLowerCase().replace(" ", "-")}`
        return (
          <label key={value} className="flex items-center gap-2">
            <Checkbox.Root
              className={cls(cm, "Root")}
              value={value}
            >
              <Checkbox.Indicator className={cls(cm, "Indicator")}><svg className="h-3 w-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 6l3 3 5-5" /></svg></Checkbox.Indicator>
            </Checkbox.Root>
            <span className="text-sm">{label}</span>
          </label>
        )
      })}
    </CheckboxGroup>
  ),

  field: (cm) => (
    <Field.Root className={cls(cm, "Root")}>
      <Field.Label className={cls(cm, "Label")}>Email</Field.Label>
      <Field.Control className={cls(cm, "Control")} placeholder="you@example.com" />
      <Field.Description className={cls(cm, "Description")}>
        We&apos;ll never share your email.
      </Field.Description>
    </Field.Root>
  ),

  fieldset: (cm) => (
    <Fieldset.Root className={cls(cm, "Root")}>
      <Fieldset.Legend className={cls(cm, "Legend")}>Contact info</Fieldset.Legend>
      <div className="mt-3 space-y-3">
        <Field.Root className="flex flex-col gap-1">
          <Field.Label className="text-sm font-medium">Name</Field.Label>
          <Field.Control className="h-9 rounded-md border border-border bg-background px-3 text-sm" placeholder="Jane Doe" />
        </Field.Root>
        <Field.Root className="flex flex-col gap-1">
          <Field.Label className="text-sm font-medium">Email</Field.Label>
          <Field.Control className="h-9 rounded-md border border-border bg-background px-3 text-sm" placeholder="jane@example.com" />
        </Field.Root>
      </div>
    </Fieldset.Root>
  ),

  form: (cm) => (
    <Form className={cls(cm, "Root")} errors={{}}>
      <div className="space-y-3">
        <Field.Root name="username" className="flex flex-col gap-1">
          <Field.Label className="text-sm font-medium">Username</Field.Label>
          <Field.Control className="h-9 rounded-md border border-border bg-background px-3 text-sm" placeholder="johndoe" />
        </Field.Root>
        <Button className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground" type="submit">Submit</Button>
      </div>
    </Form>
  ),

  input: (cm) => (
    <Input className={cls(cm, "Input")} placeholder="Type something..." />
  ),

  "number-field": (cm) => (
    <NumberField.Root className={cls(cm, "Root")} defaultValue={25}>
      <NumberField.Group className={cls(cm, "Group")}>
        <NumberField.Decrement className={cls(cm, "Decrement")}>&minus;</NumberField.Decrement>
        <NumberField.Input className={cls(cm, "Input")} />
        <NumberField.Increment className={cls(cm, "Increment")}>+</NumberField.Increment>
      </NumberField.Group>
    </NumberField.Root>
  ),

  "otp-field": (cm) => (
    <OTPField.Root className={cls(cm, "Root")} length={6}>
      {Array.from({ length: 6 }, (_, i) => (
        <React.Fragment key={i}>
          {i === 3 && <OTPField.Separator className={cls(cm, "Separator")}>-</OTPField.Separator>}
          <OTPField.Input
            className={cls(cm, "Input")}
            aria-label={i === 0 ? undefined : `Character ${i + 1} of 6`}
          />
        </React.Fragment>
      ))}
    </OTPField.Root>
  ),

  radio: (cm) => (
    <RadioGroup className={cls(cm, "Group")} defaultValue="option-1">
      {["Option 1", "Option 2", "Option 3"].map((label, i) => (
        <label key={i} className="flex items-center gap-2">
          <Radio.Root className={cls(cm, "Root")} value={`option-${i + 1}`}>
            <Radio.Indicator className={cls(cm, "Indicator")} />
          </Radio.Root>
          <span className="text-sm">{label}</span>
        </label>
      ))}
    </RadioGroup>
  ),

  select: (cm, pc) => (
    <Select.Root defaultValue="apple">
      <Select.Trigger className={cls(cm, "Trigger")}>
        <Select.Value className={cls(cm, "Value")} />
        <Select.Icon className={cls(cm, "Icon")}>&#9660;</Select.Icon>
      </Select.Trigger>
      <Select.Portal container={pc}>
        <Select.Positioner className={cls(cm, "Positioner")}>
          <Select.Popup className={cls(cm, "Popup")}>
            <Select.List>
              {["Apple", "Banana", "Cherry"].map((fruit) => (
                <Select.Item key={fruit} className={cls(cm, "Item")} value={fruit.toLowerCase()}>
                  <Select.ItemText>{fruit}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.List>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  ),

  slider: (cm) => (
    <Slider.Root className={cls(cm, "Root")} defaultValue={50}>
      <Slider.Control className={cls(cm, "Control")}>
        <Slider.Track className={cls(cm, "Track")}>
          <Slider.Indicator className={cls(cm, "Indicator")} />
          <Slider.Thumb className={cls(cm, "Thumb")} aria-label="Value" />
        </Slider.Track>
      </Slider.Control>
    </Slider.Root>
  ),

  switch: (cm) => (
    <Switch.Root className={cls(cm, "Root")}>
      <Switch.Thumb className={cls(cm, "Thumb")} />
    </Switch.Root>
  ),

  autocomplete: (cm, pc) => {
    const fruits = ["Apple", "Banana", "Cherry", "Date", "Elderberry"]
    return (
      <Autocomplete.Root items={fruits}>
        <Autocomplete.Input className={cls(cm, "Input")} placeholder="Search fruits..." />
        <Autocomplete.Portal container={pc}>
          <Autocomplete.Positioner className={cls(cm, "Positioner")}>
            <Autocomplete.Popup className={cls(cm, "Popup")}>
              <Autocomplete.List>
                {fruits.map((fruit) => (
                  <Autocomplete.Item key={fruit} className={cls(cm, "Item")} value={fruit}>
                    {fruit}
                  </Autocomplete.Item>
                ))}
              </Autocomplete.List>
            </Autocomplete.Popup>
          </Autocomplete.Positioner>
        </Autocomplete.Portal>
      </Autocomplete.Root>
    )
  },

  combobox: (cm, pc) => {
    const fruits = ["Apple", "Banana", "Cherry"]
    return (
      <Combobox.Root items={fruits} defaultValue="">
        <Combobox.InputGroup className={cls(cm, "InputGroup")}>
          <Combobox.Input className={cls(cm, "Input")} placeholder="Select a fruit..." />
          <Combobox.Trigger className={cls(cm, "Trigger")}>&#9660;</Combobox.Trigger>
        </Combobox.InputGroup>
        <Combobox.Portal container={pc}>
          <Combobox.Positioner className={cls(cm, "Positioner")}>
            <Combobox.Popup className={cls(cm, "Popup")}>
              <Combobox.List>
                {fruits.map((fruit) => (
                  <Combobox.Item key={fruit} className={cls(cm, "Item")} value={fruit}>
                    {fruit}
                    <Combobox.ItemIndicator className={cls(cm, "ItemIndicator")}>&#10003;</Combobox.ItemIndicator>
                  </Combobox.Item>
                ))}
              </Combobox.List>
            </Combobox.Popup>
          </Combobox.Positioner>
        </Combobox.Portal>
      </Combobox.Root>
    )
  },

  /* ── Overlays ────────────────────────────────────────────────── */

  "alert-dialog": (cm, pc) => (
    <AlertDialog.Root>
      <AlertDialog.Trigger className={cls(cm, "Trigger")}>Delete item</AlertDialog.Trigger>
      <AlertDialog.Portal container={pc}>
        <AlertDialog.Backdrop className={cls(cm, "Backdrop")} />
        <AlertDialog.Popup className={cls(cm, "Popup")}>
          <AlertDialog.Title className={cls(cm, "Title")}>Are you sure?</AlertDialog.Title>
          <AlertDialog.Description className={cls(cm, "Description")}>
            This action cannot be undone.
          </AlertDialog.Description>
          <div className="flex gap-2 mt-4">
            <AlertDialog.Close className={cls(cm, "Close")}>Cancel</AlertDialog.Close>
            <AlertDialog.Close className={cls(cm, "Close")}>Confirm</AlertDialog.Close>
          </div>
        </AlertDialog.Popup>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  ),

  "context-menu": (cm, pc) => (
    <ContextMenu.Root>
      <ContextMenu.Trigger className={cls(cm, "Trigger")}>
        Right-click here
      </ContextMenu.Trigger>
      <ContextMenu.Portal container={pc}>
        <ContextMenu.Positioner className={cls(cm, "Positioner")}>
          <ContextMenu.Popup className={cls(cm, "Popup")}>
            <ContextMenu.Item className={cls(cm, "Item")}>Cut</ContextMenu.Item>
            <ContextMenu.Item className={cls(cm, "Item")}>Copy</ContextMenu.Item>
            <ContextMenu.Item className={cls(cm, "Item")}>Paste</ContextMenu.Item>
            <ContextMenu.Separator className={cls(cm, "Separator")} />
            <ContextMenu.Item className={cls(cm, "Item")}>Delete</ContextMenu.Item>
          </ContextMenu.Popup>
        </ContextMenu.Positioner>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  ),

  dialog: (cm, pc) => (
    <Dialog.Root>
      <Dialog.Trigger className={cls(cm, "Trigger")}>Open dialog</Dialog.Trigger>
      <Dialog.Portal container={pc}>
        <Dialog.Backdrop className={cls(cm, "Backdrop")} />
        <Dialog.Popup className={cls(cm, "Popup")}>
          <Dialog.Title className={cls(cm, "Title")}>Dialog title</Dialog.Title>
          <Dialog.Description className={cls(cm, "Description")}>
            This is a dialog description.
          </Dialog.Description>
          <Dialog.Close className={cls(cm, "Close")}>Close</Dialog.Close>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  ),

  drawer: (cm, pc) => (
    <Drawer.Root>
      <Drawer.Trigger className={cls(cm, "Trigger")}>Open drawer</Drawer.Trigger>
      <Drawer.Portal container={pc}>
        <Drawer.Backdrop className={cls(cm, "Backdrop")} />
        <Drawer.Viewport className="fixed inset-0 z-50 flex items-end justify-center">
          <Drawer.Popup className={cls(cm, "Popup")}>
            <Drawer.Content>
              <Drawer.Title className={cls(cm, "Title")}>Drawer title</Drawer.Title>
              <Drawer.Description className={cls(cm, "Description")}>
                Swipe down to dismiss.
              </Drawer.Description>
              <Drawer.Close className={cls(cm, "Close")}>Close</Drawer.Close>
            </Drawer.Content>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  ),

  menu: (cm, pc) => (
    <Menu.Root>
      <Menu.Trigger className={cls(cm, "Trigger")}>Open menu</Menu.Trigger>
      <Menu.Portal container={pc}>
        <Menu.Positioner className={cls(cm, "Positioner")}>
          <Menu.Popup className={cls(cm, "Popup")}>
            <Menu.Item className={cls(cm, "Item")}>Edit</Menu.Item>
            <Menu.Item className={cls(cm, "Item")}>Duplicate</Menu.Item>
            <Menu.Separator className={cls(cm, "Separator")} />
            <Menu.Item className={cls(cm, "Item")}>Delete</Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  ),

  popover: (cm, pc) => (
    <Popover.Root>
      <Popover.Trigger className={cls(cm, "Trigger")}>Open popover</Popover.Trigger>
      <Popover.Portal container={pc}>
        <Popover.Positioner className={cls(cm, "Positioner")}>
          <Popover.Popup className={cls(cm, "Popup")}>
            <Popover.Arrow className={cls(cm, "Arrow")} />
            <Popover.Title className={cls(cm, "Title")}>Popover</Popover.Title>
            <Popover.Description className={cls(cm, "Description")}>
              This is a popover.
            </Popover.Description>
            <Popover.Close className={cls(cm, "Close")}>Close</Popover.Close>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  ),

  "preview-card": (cm, pc) => (
    <PreviewCard.Root>
      <PreviewCard.Trigger className={cls(cm, "Trigger")} href="https://base-ui.com">
        Hover this link
      </PreviewCard.Trigger>
      <PreviewCard.Portal container={pc}>
        <PreviewCard.Positioner className={cls(cm, "Positioner")}>
          <PreviewCard.Popup className={cls(cm, "Popup")}>
            <p className="text-sm font-semibold">Base UI</p>
            <p className="text-xs text-muted-foreground">Unstyled React components</p>
          </PreviewCard.Popup>
        </PreviewCard.Positioner>
      </PreviewCard.Portal>
    </PreviewCard.Root>
  ),

  tooltip: (cm, pc) => (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger className={cls(cm, "Trigger")} aria-label="Show tooltip">
          Hover me
        </Tooltip.Trigger>
        <Tooltip.Portal container={pc}>
          <Tooltip.Positioner className={cls(cm, "Positioner")}>
            <Tooltip.Popup className={cls(cm, "Popup")}>
              <Tooltip.Arrow className={cls(cm, "Arrow")} />
              Tooltip content
            </Tooltip.Popup>
          </Tooltip.Positioner>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  ),

  /* ── Navigation ──────────────────────────────────────────────── */

  menubar: (cm, pc) => (
    <Menubar className={cls(cm, "Root")}>
      <Menu.Root>
        <Menu.Trigger className={cls(cm, "Trigger")}>File</Menu.Trigger>
        <Menu.Portal container={pc}>
          <Menu.Positioner className={cls(cm, "Positioner")} sideOffset={4}>
            <Menu.Popup className={cls(cm, "Popup")}>
              <Menu.Item className={cls(cm, "Item")}>New File</Menu.Item>
              <Menu.Item className={cls(cm, "Item")}>Open</Menu.Item>
              <Menu.Item className={cls(cm, "Item")}>Save</Menu.Item>
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>
      <Menu.Root>
        <Menu.Trigger className={cls(cm, "Trigger")}>Edit</Menu.Trigger>
        <Menu.Portal container={pc}>
          <Menu.Positioner className={cls(cm, "Positioner")} sideOffset={4}>
            <Menu.Popup className={cls(cm, "Popup")}>
              <Menu.Item className={cls(cm, "Item")}>Undo</Menu.Item>
              <Menu.Item className={cls(cm, "Item")}>Redo</Menu.Item>
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>
    </Menubar>
  ),

  "navigation-menu": (cm, pc) => (
    <NavigationMenu.Root className={cls(cm, "Root")}>
      <NavigationMenu.List className={cls(cm, "List")}>
        <NavigationMenu.Item>
          <NavigationMenu.Link className={cls(cm, "Link")} href="#">Home</NavigationMenu.Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Trigger className={cls(cm, "Trigger")}>
            Products
            <NavigationMenu.Icon className={cls(cm, "Icon")}>&#9660;</NavigationMenu.Icon>
          </NavigationMenu.Trigger>
          <NavigationMenu.Content className={cls(cm, "Content")}>
            <NavigationMenu.Link className={cls(cm, "Link")} href="#">Product A</NavigationMenu.Link>
            <NavigationMenu.Link className={cls(cm, "Link")} href="#">Product B</NavigationMenu.Link>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Link className={cls(cm, "Link")} href="#">About</NavigationMenu.Link>
        </NavigationMenu.Item>
      </NavigationMenu.List>
      <NavigationMenu.Portal container={pc}>
        <NavigationMenu.Positioner className={cls(cm, "Positioner")}>
          <NavigationMenu.Popup className={cls(cm, "Popup")}>
            <NavigationMenu.Viewport className={cls(cm, "Viewport")} />
          </NavigationMenu.Popup>
        </NavigationMenu.Positioner>
      </NavigationMenu.Portal>
    </NavigationMenu.Root>
  ),

  tabs: (cm) => (
    <Tabs.Root className={cls(cm, "Root")} defaultValue="tab-1">
      <Tabs.List className={cls(cm, "List")}>
        <Tabs.Tab className={cls(cm, "Tab")} value="tab-1">Account</Tabs.Tab>
        <Tabs.Tab className={cls(cm, "Tab")} value="tab-2">Settings</Tabs.Tab>
        <Tabs.Tab className={cls(cm, "Tab")} value="tab-3">Billing</Tabs.Tab>
        <Tabs.Indicator className={cls(cm, "Indicator")} />
      </Tabs.List>
      <Tabs.Panel className={cls(cm, "Panel")} value="tab-1">Account settings content.</Tabs.Panel>
      <Tabs.Panel className={cls(cm, "Panel")} value="tab-2">App settings content.</Tabs.Panel>
      <Tabs.Panel className={cls(cm, "Panel")} value="tab-3">Billing details content.</Tabs.Panel>
    </Tabs.Root>
  ),

  /* ── Layout ──────────────────────────────────────────────────── */

  accordion: (cm) => (
    <Accordion.Root className={cls(cm, "Root")}>
      {["What is Base UI?", "How does styling work?", "Can I use Tailwind?"].map((q, i) => (
        <Accordion.Item key={i} className={cls(cm, "Item")} value={String(i)}>
          <Accordion.Header>
            <Accordion.Trigger className={cls(cm, "Trigger")}>{q}</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel className={cls(cm, "Panel")}>
            <div className={cls(cm, "PanelContent")}>Answer to &quot;{q}&quot; goes here.</div>
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  ),

  collapsible: (cm) => (
    <Collapsible.Root className={cls(cm, "Root")}>
      <Collapsible.Trigger className={cls(cm, "Trigger")}>Toggle content</Collapsible.Trigger>
      <Collapsible.Panel className={cls(cm, "Panel")}>
        <div className={cls(cm, "PanelContent")}>This content can be expanded or collapsed.</div>
      </Collapsible.Panel>
    </Collapsible.Root>
  ),

  "scroll-area": (cm) => (
    <ScrollArea.Root className={cls(cm, "Root")}>
      <ScrollArea.Viewport className={cls(cm, "Viewport")}>
        <ScrollArea.Content className={cls(cm, "Content")}>
          {Array.from({ length: 20 }, (_, i) => (
            <div key={i} className="py-1 text-sm">Item {i + 1}</div>
          ))}
        </ScrollArea.Content>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar className={cls(cm, "Scrollbar")} orientation="vertical">
        <ScrollArea.Thumb className={cls(cm, "Thumb")} />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  ),

  separator: (cm) => (
    <div className="flex flex-col gap-2">
      <span className="text-sm">Above</span>
      <Separator className={cls(cm, "Separator")} />
      <span className="text-sm">Below</span>
    </div>
  ),

  toolbar: (cm) => (
    <Toolbar.Root className={cls(cm, "Root")}>
      <Toolbar.Group className={cls(cm, "Group")}>
        <Toolbar.Button className={cls(cm, "Button")}>Cut</Toolbar.Button>
        <Toolbar.Button className={cls(cm, "Button")}>Copy</Toolbar.Button>
        <Toolbar.Button className={cls(cm, "Button")}>Paste</Toolbar.Button>
      </Toolbar.Group>
      <Toolbar.Separator className={cls(cm, "Separator")} />
      <Toolbar.Link className={cls(cm, "Link")} href="#">Help</Toolbar.Link>
    </Toolbar.Root>
  ),

  /* ── Feedback ────────────────────────────────────────────────── */

  meter: (cm) => (
    <Meter.Root className={cls(cm, "Root")} value={65}>
      <Meter.Label className={cls(cm, "Label")}>Storage used</Meter.Label>
      <Meter.Value className={cls(cm, "Value")} />
      <Meter.Track className={cls(cm, "Track")}>
        <Meter.Indicator className={cls(cm, "Indicator")} />
      </Meter.Track>
    </Meter.Root>
  ),

  progress: (cm) => (
    <Progress.Root className={cls(cm, "Root")} value={60}>
      <Progress.Label className={cls(cm, "Label")}>Loading...</Progress.Label>
      <Progress.Value className={cls(cm, "Value")} />
      <Progress.Track className={cls(cm, "Track")}>
        <Progress.Indicator className={cls(cm, "Indicator")} />
      </Progress.Track>
    </Progress.Root>
  ),

  toast: (cm, pc) => (
    <Toast.Provider>
      <ToastTrigger />
      <Toast.Portal container={pc}>
        <Toast.Viewport className={cls(cm, "Viewport")}>
          <ToastList cm={cm} />
        </Toast.Viewport>
      </Toast.Portal>
    </Toast.Provider>
  ),

  /* ── Data Display ────────────────────────────────────────────── */

  avatar: (cm) => (
    <Avatar.Root className={cls(cm, "Root")}>
      <Avatar.Image className={cls(cm, "Image")} src="https://i.pravatar.cc/80" alt="User" />
      <Avatar.Fallback className={cls(cm, "Fallback")}>GY</Avatar.Fallback>
    </Avatar.Root>
  ),
}

/* ── Public API ─────────────────────────────────────────────────── */

/**
 * Get the preview renderer for a component slug.
 * Returns undefined if no renderer exists for that slug.
 */
export function getPreviewRenderer(slug: string): PreviewRenderer | undefined {
  return previews[slug]
}

/**
 * Render a Base UI component preview with the given class map.
 * Falls back to a "no preview" message if the renderer doesn't exist.
 *
 * @param portalContainer - Optional ref to a DOM element that portals
 *   should mount into (instead of document.body). Used by the dashboard
 *   to constrain overlay components to the canvas area.
 */
export function renderBaseUIPreview(
  slug: string,
  classMap: ClassMap = {},
  portalContainer?: PortalContainer,
): React.ReactNode {
  const renderer = previews[slug]
  if (!renderer) {
    return <p className="text-sm text-muted-foreground">No preview available for &quot;{slug}&quot;.</p>
  }
  return renderer(classMap, portalContainer)
}

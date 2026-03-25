"use client"

import React from "react"

// ── Inputs ──────────────────────────────────────────────────────────────────
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Toggle } from "@/components/ui/toggle"

// ── Layout ──────────────────────────────────────────────────────────────────
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// ── Feedback ────────────────────────────────────────────────────────────────
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// ── Data Display ────────────────────────────────────────────────────────────
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

// ── Navigation ──────────────────────────────────────────────────────────────
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// ── Icons ───────────────────────────────────────────────────────────────────
import {
  AlertCircle,
  Bold,
  ChevronDown,
  Info,
  Italic,
  Mail,
  MoreHorizontal,
  Settings,
  Terminal,
  Trash2,
  User,
  LogOut,
  CreditCard,
} from "lucide-react"

// ─────────────────────────────────────────────────────────────────────────────
// Preview wrapper — adds consistent padding and max-width to every preview
// ─────────────────────────────────────────────────────────────────────────────

function PreviewContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-2xl mx-auto p-6 space-y-4">{children}</div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Fallback for components without a dedicated preview
// ─────────────────────────────────────────────────────────────────────────────

function FallbackPreview({ name }: { name: string }) {
  return (
    <PreviewContainer>
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
        <p className="text-lg font-medium text-muted-foreground">{name}</p>
        <p className="text-sm text-muted-foreground mt-1">
          Preview not yet available
        </p>
      </div>
    </PreviewContainer>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. Button
// ─────────────────────────────────────────────────────────────────────────────

function ButtonPreview() {
  return (
    <PreviewContainer>
      <div className="grid grid-cols-3 gap-3">
        <Button variant="default">Default</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>
      <div className="flex items-center gap-3 pt-2">
        <Button size="sm">Small</Button>
        <Button size="default">Default</Button>
        <Button size="lg">Large</Button>
        <Button size="icon">
          <Mail />
        </Button>
      </div>
    </PreviewContainer>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. Input
// ─────────────────────────────────────────────────────────────────────────────

function InputPreview() {
  return (
    <PreviewContainer>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input id="email" type="email" placeholder="you@example.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="disabled">Disabled input</Label>
          <Input
            id="disabled"
            placeholder="You cannot edit this"
            disabled
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="file">Upload a file</Label>
          <Input id="file" type="file" />
        </div>
      </div>
    </PreviewContainer>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. Card
// ─────────────────────────────────────────────────────────────────────────────

function CardPreview() {
  return (
    <PreviewContainer>
      <Card>
        <CardHeader>
          <CardTitle>Create a new project</CardTitle>
          <CardDescription>
            Set up your project details to get started with your team.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="project-name">Project name</Label>
              <Input id="project-name" placeholder="My awesome project" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="project-desc">Description</Label>
              <Textarea
                id="project-desc"
                placeholder="Briefly describe what this project is about"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <Button>Create project</Button>
        </CardFooter>
      </Card>
    </PreviewContainer>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. Dialog
// ─────────────────────────────────────────────────────────────────────────────

function DialogPreview() {
  return (
    <PreviewContainer>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Edit profile</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you are done.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="dialog-name">Display name</Label>
              <Input id="dialog-name" defaultValue="George" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dialog-username">Username</Label>
              <Input id="dialog-username" defaultValue="@george" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PreviewContainer>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. Alert
// ─────────────────────────────────────────────────────────────────────────────

function AlertPreview() {
  return (
    <PreviewContainer>
      <Alert>
        <Terminal className="h-4 w-4" />
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          You can add components to your project using the CLI.
        </AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Your session has expired. Please log in again to continue.
        </AlertDescription>
      </Alert>
    </PreviewContainer>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. Badge
// ─────────────────────────────────────────────────────────────────────────────

function BadgePreview() {
  return (
    <PreviewContainer>
      <div className="flex flex-wrap gap-2">
        <Badge variant="default">Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="destructive">Destructive</Badge>
        <Badge variant="outline">Outline</Badge>
      </div>
      <div className="flex flex-wrap gap-2 pt-2">
        <Badge>New feature</Badge>
        <Badge variant="secondary">In progress</Badge>
        <Badge variant="destructive">Breaking</Badge>
        <Badge variant="outline">v2.0.0</Badge>
      </div>
    </PreviewContainer>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. Checkbox
// ─────────────────────────────────────────────────────────────────────────────

function CheckboxPreview() {
  return (
    <PreviewContainer>
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox id="terms" defaultChecked />
          <Label htmlFor="terms">Accept terms and conditions</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="notifications" />
          <Label htmlFor="notifications">Send me email notifications</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="disabled" disabled />
          <Label htmlFor="disabled">This option is disabled</Label>
        </div>
      </div>
    </PreviewContainer>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. Select
// ─────────────────────────────────────────────────────────────────────────────

function SelectPreview() {
  return (
    <PreviewContainer>
      <div className="space-y-2">
        <Label>Favourite framework</Label>
        <Select>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a framework" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="next">Next.js</SelectItem>
            <SelectItem value="remix">Remix</SelectItem>
            <SelectItem value="astro">Astro</SelectItem>
            <SelectItem value="nuxt">Nuxt</SelectItem>
            <SelectItem value="svelte">SvelteKit</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </PreviewContainer>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. Tabs
// ─────────────────────────────────────────────────────────────────────────────

function TabsPreview() {
  return (
    <PreviewContainer>
      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="account" className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="tabs-name">Name</Label>
            <Input id="tabs-name" defaultValue="George" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tabs-email">Email</Label>
            <Input id="tabs-email" defaultValue="george@example.com" />
          </div>
        </TabsContent>
        <TabsContent value="password" className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="current-pw">Current password</Label>
            <Input id="current-pw" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-pw">New password</Label>
            <Input id="new-pw" type="password" />
          </div>
        </TabsContent>
        <TabsContent value="settings" className="pt-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="marketing-switch">Marketing emails</Label>
            <Switch id="marketing-switch" />
          </div>
        </TabsContent>
      </Tabs>
    </PreviewContainer>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 10. Accordion
// ─────────────────────────────────────────────────────────────────────────────

function AccordionPreview() {
  return (
    <PreviewContainer>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>Is it accessible?</AccordionTrigger>
          <AccordionContent>
            Yes. It adheres to the WAI-ARIA design pattern for accordions,
            including keyboard navigation and focus management.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Is it styled?</AccordionTrigger>
          <AccordionContent>
            Yes. It ships with default styles that match your theme and can be
            customised using Tailwind utility classes.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Can I animate it?</AccordionTrigger>
          <AccordionContent>
            Yes. The open and close transitions are built in using CSS
            animations, so content expands and collapses smoothly.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </PreviewContainer>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 11. Switch
// ─────────────────────────────────────────────────────────────────────────────

function SwitchPreview() {
  return (
    <PreviewContainer>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="airplane-mode">Airplane mode</Label>
          <Switch id="airplane-mode" />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="dark-mode">Dark mode</Label>
          <Switch id="dark-mode" defaultChecked />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="disabled-switch">Disabled</Label>
          <Switch id="disabled-switch" disabled />
        </div>
      </div>
    </PreviewContainer>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 12. Slider
// ─────────────────────────────────────────────────────────────────────────────

function SliderPreview() {
  return (
    <PreviewContainer>
      <div className="space-y-6">
        <div className="space-y-3">
          <Label>Volume</Label>
          <Slider defaultValue={[50]} max={100} step={1} />
        </div>
        <div className="space-y-3">
          <Label>Price range</Label>
          <Slider defaultValue={[25, 75]} max={100} step={5} />
        </div>
      </div>
    </PreviewContainer>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 13. Textarea
// ─────────────────────────────────────────────────────────────────────────────

function TextareaPreview() {
  return (
    <PreviewContainer>
      <div className="space-y-2">
        <Label htmlFor="message">Your message</Label>
        <Textarea
          id="message"
          placeholder="Type your message here. We'll get back to you within 24 hours."
        />
        <p className="text-sm text-muted-foreground">
          Your message will be sent to our support team.
        </p>
      </div>
    </PreviewContainer>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 14. Toggle
// ─────────────────────────────────────────────────────────────────────────────

function TogglePreview() {
  return (
    <PreviewContainer>
      <div className="flex items-center gap-2">
        <Toggle aria-label="Toggle bold">
          <Bold className="h-4 w-4" />
        </Toggle>
        <Toggle aria-label="Toggle italic">
          <Italic className="h-4 w-4" />
        </Toggle>
        <Toggle variant="outline" aria-label="Toggle info">
          <Info className="h-4 w-4" />
          Info
        </Toggle>
        <Toggle disabled aria-label="Disabled toggle">
          <Settings className="h-4 w-4" />
        </Toggle>
      </div>
    </PreviewContainer>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 15. Avatar
// ─────────────────────────────────────────────────────────────────────────────

function AvatarPreview() {
  return (
    <PreviewContainer>
      <div className="flex items-center gap-4">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>GD</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      </div>
      <p className="text-sm text-muted-foreground pt-1">
        Avatars display an image with a fallback when the image fails to load.
      </p>
    </PreviewContainer>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 16. Separator
// ─────────────────────────────────────────────────────────────────────────────

function SeparatorPreview() {
  return (
    <PreviewContainer>
      <div>
        <div className="space-y-1">
          <h4 className="text-sm font-medium leading-none">Radix Primitives</h4>
          <p className="text-sm text-muted-foreground">
            An open-source UI component library.
          </p>
        </div>
        <Separator className="my-4" />
        <div className="flex h-5 items-center space-x-4 text-sm">
          <div>Blog</div>
          <Separator orientation="vertical" />
          <div>Docs</div>
          <Separator orientation="vertical" />
          <div>Source</div>
        </div>
      </div>
    </PreviewContainer>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 17. Tooltip
// ─────────────────────────────────────────────────────────────────────────────

function TooltipPreview() {
  return (
    <PreviewContainer>
      <TooltipProvider>
        <div className="flex items-center gap-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline">Hover me</Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>This is a helpful tooltip</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon">
                <Info className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>More information</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </PreviewContainer>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 18. Table
// ─────────────────────────────────────────────────────────────────────────────

function TablePreview() {
  return (
    <PreviewContainer>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Invoice</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Method</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">INV-001</TableCell>
            <TableCell>
              <Badge variant="secondary">Paid</Badge>
            </TableCell>
            <TableCell>Credit Card</TableCell>
            <TableCell className="text-right">$250.00</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">INV-002</TableCell>
            <TableCell>
              <Badge variant="outline">Pending</Badge>
            </TableCell>
            <TableCell>PayPal</TableCell>
            <TableCell className="text-right">$150.00</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">INV-003</TableCell>
            <TableCell>
              <Badge variant="destructive">Overdue</Badge>
            </TableCell>
            <TableCell>Bank Transfer</TableCell>
            <TableCell className="text-right">$350.00</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </PreviewContainer>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 19. AlertDialog
// ─────────────────────────────────────────────────────────────────────────────

function AlertDialogPreview() {
  return (
    <PreviewContainer>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete account
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Yes, delete account</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PreviewContainer>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 20. DropdownMenu
// ─────────────────────────────────────────────────────────────────────────────

function DropdownMenuPreview() {
  return (
    <PreviewContainer>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <MoreHorizontal className="mr-2 h-4 w-4" />
            Options
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard className="mr-2 h-4 w-4" />
            Billing
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </PreviewContainer>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Preview map — the main export
// ─────────────────────────────────────────────────────────────────────────────

export const componentPreviews: Record<string, React.ComponentType> = {
  button: ButtonPreview,
  input: InputPreview,
  card: CardPreview,
  dialog: DialogPreview,
  alert: AlertPreview,
  badge: BadgePreview,
  checkbox: CheckboxPreview,
  select: SelectPreview,
  tabs: TabsPreview,
  accordion: AccordionPreview,
  switch: SwitchPreview,
  slider: SliderPreview,
  textarea: TextareaPreview,
  toggle: TogglePreview,
  avatar: AvatarPreview,
  separator: SeparatorPreview,
  tooltip: TooltipPreview,
  table: TablePreview,
  "alert-dialog": AlertDialogPreview,
  "dropdown-menu": DropdownMenuPreview,
}

// ─────────────────────────────────────────────────────────────────────────────
// Helper to get a preview component by slug, with fallback
// ─────────────────────────────────────────────────────────────────────────────

export function getComponentPreview(slug: string): React.ComponentType {
  const Preview = componentPreviews[slug]
  if (Preview) return Preview

  // Return a fallback component for unknown slugs
  const name = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("")

  function ComponentFallback() {
    return <FallbackPreview name={name} />
  }
  ComponentFallback.displayName = `${name}Fallback`

  return ComponentFallback
}

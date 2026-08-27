"use client"

import * as React from "react"
import { Download, Clipboard, Check, X } from "lucide-react"
import { Dialog } from "@base-ui/react/dialog"

import { cn } from "@/lib/utils"
import { estimateFileSize, exportAsTsx } from "@/lib/export-utils"

function toPascalCase(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9\s_-]/g, "")
    // Split on spaces/underscores/dashes AND camelCase boundaries
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("")
}

interface ExportDialogProps {
  slug: string
  source: string
  defaultName: string
  children: React.ReactElement
}

export function ExportDialog({
  slug,
  source,
  defaultName,
  children,
}: ExportDialogProps) {
  const [componentName, setComponentName] = React.useState(defaultName)
  const [copied, setCopied] = React.useState(false)
  const [downloaded, setDownloaded] = React.useState(false)

  // Reset state when dialog opens
  const handleOpenChange = React.useCallback(
    (open: boolean) => {
      if (open) {
        setComponentName(defaultName)
        setCopied(false)
        setDownloaded(false)
      }
    },
    [defaultName],
  )

  // Always derive a valid PascalCase name for code output
  const pascalName = React.useMemo(
    () => toPascalCase(componentName) || defaultName,
    [componentName, defaultName],
  )

  // Update the component name in the generated code
  const exportCode = React.useMemo(() => {
    if (pascalName === defaultName) return source
    return source.replace(
      new RegExp(`function ${defaultName}`),
      `function ${pascalName}`,
    )
  }, [source, pascalName, defaultName])

  const kebabName = React.useMemo(() => {
    return pascalName
      .replace(/([a-z])([A-Z])/g, "$1-$2")
      .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
      .toLowerCase()
  }, [componentName])

  const fileSize = React.useMemo(() => estimateFileSize(exportCode), [exportCode])

  const handleCopy = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(exportCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API unavailable
    }
  }, [exportCode])

  const handleDownload = React.useCallback(() => {
    exportAsTsx(`${kebabName}.tsx`, exportCode)
    setDownloaded(true)
    setTimeout(() => setDownloaded(false), 2000)
  }, [exportCode, kebabName])

  return (
    <Dialog.Root onOpenChange={handleOpenChange}>
      <Dialog.Trigger render={children} />
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/50 transition-opacity duration-150 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border bg-background p-5 shadow-lg transition-[opacity,transform] duration-150 data-[starting-style]:scale-95 data-[starting-style]:opacity-0 data-[ending-style]:scale-95 data-[ending-style]:opacity-0">
          <Dialog.Title className="text-sm font-semibold">
            Export component
          </Dialog.Title>
          <Dialog.Description className="mt-1 text-xs text-muted-foreground">
            Download or copy as a .tsx file ready for your project.
          </Dialog.Description>

          {/* Component name */}
          <div className="mt-4 space-y-1">
            <div className="flex items-center justify-between">
              <label htmlFor="export-name" className="text-xs font-medium text-muted-foreground">
                Component name
              </label>
              <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-medium">
                {pascalName}
              </code>
            </div>
            <input
              id="export-name"
              type="text"
              value={componentName}
              onChange={(e) => setComponentName(e.target.value)}
              className="h-8 w-full rounded-md border bg-transparent px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
            />
            <p className="text-xs text-muted-foreground">
              {kebabName}.tsx · {fileSize}
            </p>
          </div>

          {/* Code preview */}
          <div className="mt-3 max-h-56 overflow-auto rounded-md bg-[#0d1117] p-3">
            <pre className="text-xs leading-relaxed text-[#e1e4e8]">
              <code>{exportCode}</code>
            </pre>
          </div>

          {/* Actions */}
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-md border px-3 py-2 text-xs font-medium transition-colors hover:bg-muted/50",
                copied && "border-green-500/30 text-green-500",
              )}
            >
              {copied ? (
                <><Check className="size-3.5" /> Copied</>
              ) : (
                <><Clipboard className="size-3.5" /> Copy</>
              )}
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-xs font-medium text-primary-foreground transition-colors",
                downloaded
                  ? "bg-green-600 hover:bg-green-600"
                  : "bg-primary hover:bg-primary/90",
              )}
            >
              {downloaded ? (
                <><Check className="size-3.5" /> Downloaded</>
              ) : (
                <><Download className="size-3.5" /> Download .tsx</>
              )}
            </button>
          </div>

          <Dialog.Close className="absolute top-4 right-4 rounded-sm text-muted-foreground hover:text-foreground">
            <X className="size-4" />
            <span className="sr-only">Close</span>
          </Dialog.Close>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

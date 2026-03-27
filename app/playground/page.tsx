import { Layers } from "lucide-react"

import { PlaygroundToolbar } from "@/components/playground/toolbar"

export default function PlaygroundPage() {
  return (
    <>
      <PlaygroundToolbar />

      {/* ── Empty state ──────────────────────────────────────── */}
      <div className="flex flex-1 items-center justify-center bg-muted/30">
        <div className="flex flex-col items-center gap-3 text-center">
          <Layers className="size-12 text-muted-foreground/50" />
          <div className="space-y-1">
            <p className="text-lg font-medium">
              Select a component to begin
            </p>
            <p className="text-sm text-muted-foreground">
              Pick a component from the sidebar or use the search to find one.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

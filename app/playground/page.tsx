import { Layers } from "lucide-react"

import { PlaygroundToolbar } from "@/components/playground/toolbar"

export default function PlaygroundPage() {
  return (
    <>
      <PlaygroundToolbar />

      {/* ── Empty state ──────────────────────────────────────── */}
      <div className="flex flex-1 items-center justify-center bg-muted/30">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Layers className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">
              Select a component to begin
            </p>
            <p className="text-xs text-muted-foreground">
              Pick a component from the sidebar or use the search to find one.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

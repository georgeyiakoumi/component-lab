import type { ControlState } from "@/lib/style-state"

export interface SectionProps {
  state: ControlState
  update: <K extends keyof ControlState>(key: K, value: ControlState[K]) => void
}

export interface SectionCallbacks {
  sectionHasValues: (section: string) => boolean
  clearSection: (section: string) => void
}

"use client"

import * as React from "react"
import { ChevronRight } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@radix-ui/react-collapsible"

import { Badge } from "@/components/ui/badge"
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  BASE_UI_CATEGORIES,
  getBaseUIComponentsByCategory,
} from "@/lib/base-ui-registry"

/* ── Types ──────────────────────────────────────────────────────── */

interface SidebarProps {
  onSelectBaseComponent?: (slug: string) => void
  selectedSlug?: string
}

/* ── Component ──────────────────────────────────────────────────── */

export function PlaygroundSidebar({
  onSelectBaseComponent,
  selectedSlug,
}: SidebarProps) {
  return (
    <>
      {/* ── Header ──────────────────────────────────────────── */}
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold tracking-tight">
            Component Lab
          </span>
          <div className="flex-1" />
          <SidebarTrigger />
        </div>
      </SidebarHeader>

      {/* ── Content ─────────────────────────────────────────── */}
      <SidebarContent>
        {/* ── Base UI components ─────────────────────────── */}
        <SidebarGroup>
          <SidebarGroupLabel>
            Base UI
            <Badge variant="secondary" className="ml-2 text-xs">
              37
            </Badge>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {BASE_UI_CATEGORIES.map((category) => {
                const components = getBaseUIComponentsByCategory(category)
                if (components.length === 0) return null

                return (
                  <Collapsible key={category} asChild>
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton>
                          <ChevronRight className="transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          <span>{category}</span>
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {components.map((comp) => (
                            <SidebarMenuSubItem key={comp.slug}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={selectedSlug === `base/${comp.slug}`}
                              >
                                <button
                                  type="button"
                                  onClick={() => onSelectBaseComponent?.(comp.slug)}
                                >
                                  <span>{comp.name}</span>
                                </button>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </>
  )
}

/**
 * Pagination composition rule.
 *
 * Source: https://ui.shadcn.com/docs/components/pagination
 * Fetched: 2026-04-09
 *
 * Docs canonical example:
 *
 *     <Pagination>
 *       <PaginationContent>
 *         <PaginationItem>
 *           <PaginationPrevious href="#" />
 *         </PaginationItem>
 *         <PaginationItem>
 *           <PaginationLink href="#">1</PaginationLink>
 *         </PaginationItem>
 *         <PaginationItem>
 *           <PaginationLink href="#" isActive>2</PaginationLink>
 *         </PaginationItem>
 *         <PaginationItem>
 *           <PaginationLink href="#">3</PaginationLink>
 *         </PaginationItem>
 *         <PaginationItem>
 *           <PaginationEllipsis />
 *         </PaginationItem>
 *         <PaginationItem>
 *           <PaginationNext href="#" />
 *         </PaginationItem>
 *       </PaginationContent>
 *     </Pagination>
 *
 * ## Implementation notes
 *
 * Pagination has 7 sub-components total. PaginationLink uses
 * `buttonVariants` cva from the Button component, applied via cn()
 * inside the source. PaginationPrevious / PaginationNext are wrappers
 * around PaginationLink with hardcoded chevron icons + text labels.
 *
 * The rule renders the docs example verbatim with 3 page numbers
 * (1, 2-active, 3), an ellipsis, and previous/next controls. Sub-
 * components used multiple times only carry a `data-node-id` on
 * their first instance — same pattern as Breadcrumb and the menu
 * rules.
 *
 * The chevrons inside Previous / Next render as real Lucide icons
 * (ChevronLeft / ChevronRight) directly, and the ellipsis renders
 * a real MoreHorizontal so the size-9 + center alignment classes
 * have something to wrap.
 */

"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

import {
  classesFor,
  pathFor,
  withSelectionRing,
  type CompositionRule,
  type SnippetContext,
} from "../index"

function PaginationRender(ctx: SnippetContext): React.ReactNode {
  const paginationCls = classesFor(ctx, "Pagination")
  const contentCls = classesFor(ctx, "PaginationContent")
  const itemCls = classesFor(ctx, "PaginationItem")
  const linkCls = classesFor(ctx, "PaginationLink")
  const previousCls = classesFor(ctx, "PaginationPrevious")
  const nextCls = classesFor(ctx, "PaginationNext")
  const ellipsisCls = classesFor(ctx, "PaginationEllipsis")

  const paginationPath = pathFor(ctx, "Pagination")
  const contentPath = pathFor(ctx, "PaginationContent")
  const itemPath = pathFor(ctx, "PaginationItem")
  const linkPath = pathFor(ctx, "PaginationLink")
  const previousPath = pathFor(ctx, "PaginationPrevious")
  const nextPath = pathFor(ctx, "PaginationNext")
  const ellipsisPath = pathFor(ctx, "PaginationEllipsis")

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <nav
        role="navigation"
        aria-label="pagination"
        data-node-id={paginationPath}
        className={withSelectionRing(
          paginationCls,
          ctx.selectedPath === paginationPath,
        )}
      >
        <ul
          data-node-id={contentPath}
          className={withSelectionRing(
            contentCls,
            ctx.selectedPath === contentPath,
          )}
        >
          <li
            data-node-id={itemPath}
            className={withSelectionRing(
              itemCls,
              ctx.selectedPath === itemPath,
            )}
          >
            <a
              href="#"
              aria-label="Go to previous page"
              data-node-id={previousPath}
              className={withSelectionRing(
                previousCls,
                ctx.selectedPath === previousPath,
              )}
            >
              <ChevronLeft />
              <span className="hidden sm:block">Previous</span>
            </a>
          </li>
          <li className={itemCls}>
            <a
              href="#"
              data-node-id={linkPath}
              className={withSelectionRing(
                linkCls,
                ctx.selectedPath === linkPath,
              )}
            >
              1
            </a>
          </li>
          <li className={itemCls}>
            <a
              href="#"
              aria-current="page"
              data-active="true"
              className={linkCls}
            >
              2
            </a>
          </li>
          <li className={itemCls}>
            <a href="#" className={linkCls}>
              3
            </a>
          </li>
          <li className={itemCls}>
            <span
              aria-hidden
              data-node-id={ellipsisPath}
              className={withSelectionRing(
                ellipsisCls,
                ctx.selectedPath === ellipsisPath,
              )}
            >
              <MoreHorizontal className="size-4" />
              <span className="sr-only">More pages</span>
            </span>
          </li>
          <li className={itemCls}>
            <a
              href="#"
              aria-label="Go to next page"
              data-node-id={nextPath}
              className={withSelectionRing(
                nextCls,
                ctx.selectedPath === nextPath,
              )}
            >
              <span className="hidden sm:block">Next</span>
              <ChevronRight />
            </a>
          </li>
        </ul>
      </nav>
    </div>
  )
}

export const paginationRule: CompositionRule = {
  slug: "pagination",
  source:
    "https://ui.shadcn.com/docs/components/pagination (fetched 2026-04-09)",
  composition: {
    name: "Pagination",
    children: [
      {
        name: "PaginationContent",
        children: [
          {
            name: "PaginationItem",
            children: [
              { name: "PaginationLink" },
              { name: "PaginationPrevious" },
              { name: "PaginationNext" },
              { name: "PaginationEllipsis" },
            ],
          },
        ],
      },
    ],
  },
  render: PaginationRender,
}

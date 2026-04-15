"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, BookOpen, Monitor } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"

/* ── Feature data ──────────────────────────────────────────────── */

const features = [
  {
    id: "browse",
    label: "Browse",
    heading: "See how every shadcn component actually works.",
    image: "/screenshots/browse.jpg",
  },
  {
    id: "build",
    label: "Build",
    heading: "Pick a base element, add props and variants.",
    image: "/screenshots/build.jpg",
  },
] as const

/* ── Shared components ─────────────────────────────────────────── */

function Hero() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-medium tracking-tight sm:text-4xl lg:text-4xl">
        Component Lab
      </h1>
      <p className="max-w-md text-base text-muted-foreground sm:text-lg lg:text-xl">
        The visual workspace for shadcn/ui. Explore components, build
        new ones, and export production-ready code.
      </p>
      <Link href="/playground" className="group/btn hidden lg:inline-flex">
        <Button size="lg" className="cursor-pointer overflow-hidden">
          <span className="relative inline-flex overflow-hidden">
            <span className="flex items-center transition-transform duration-300 group-hover/btn:-translate-y-full">
              Launch
            </span>
            <span className="absolute inset-0 flex items-center transition-transform duration-300 translate-y-full group-hover/btn:translate-y-0">
              Launch
            </span>
          </span>
          <ArrowRight className="ml-2 size-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
        </Button>
      </Link>

      {/* Mobile button group */}
      <div className="mx-auto flex w-full max-w-xs flex-col gap-2 lg:hidden">
        <Button size="sm" disabled className="w-full justify-center">
          <Monitor className="size-4" />
          Desktop only
        </Button>
        <Button variant="outline" size="sm" className="w-full justify-center" asChild>
          <a href="https://github.com/georgeyiakoumi/component-lab" target="_blank" rel="noopener noreferrer">
            <svg role="img" viewBox="0 0 24 24" className="size-4 fill-current" xmlns="http://www.w3.org/2000/svg"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
            GitHub Repo
          </a>
        </Button>
        <Button variant="ghost" size="sm" className="w-full justify-center" asChild>
          <a href="https://georgeyiakoumi.com/project/component-lab" target="_blank" rel="noopener noreferrer">
            <BookOpen className="size-4" />
            Case study
          </a>
        </Button>
      </div>
    </div>
  )
}

function Screenshot({
  features: feats,
  featureIndex,
}: {
  features: typeof features
  featureIndex: number
}) {
  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-sm border border-border shadow-2xl">
      {feats.map((feature, i) => (
        <Image
          key={feature.id}
          src={feature.image}
          alt={`${feature.label} screenshot`}
          fill
          className={cn(
            "pointer-events-none object-cover object-left-top transition-opacity duration-500",
            i === featureIndex ? "opacity-100" : "opacity-0",
          )}
          draggable={false}
          priority={i === 0}
        />
      ))}
    </div>
  )
}

function FeatureTabs({
  features: feats,
  featureIndex,
  onSelect,
  heading,
  className,
}: {
  features: typeof features
  featureIndex: number
  onSelect: (i: number) => void
  heading: string
  className?: string
}) {
  return (
    <div className={cn("flex flex-col", className)}>
      <div className="flex items-center gap-4">
        {feats.map((feature, i) => (
          <button
            key={feature.id}
            type="button"
            onClick={() => onSelect(i)}
            className={cn(
              "cursor-pointer font-medium transition-colors",
              i === featureIndex
                ? "text-foreground"
                : "text-muted-foreground/40 hover:text-muted-foreground",
            )}
          >
            {feature.label}
          </button>
        ))}
      </div>
      <h2 className="mt-2 text-muted-foreground">
        {heading}
      </h2>
    </div>
  )
}

function Footer({ className }: { className?: string }) {
  return (
    <footer className={cn("text-xs text-muted-foreground", className)}>
      Built with{" "}
      <a href="https://ui.shadcn.com" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-foreground">shadcn/ui</a>
      {" · "}
      <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-foreground">Next.js</a>
      {" · "}
      <a href="https://tailwindcss.com" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-foreground">Tailwind CSS</a>
      {" · "}
      <a href="https://www.radix-ui.com" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-foreground">Radix</a>
      {" · "}
      <a href="https://lucide.dev" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-foreground">Lucide</a>
      {" · "}
      <a href="https://shiki.style" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-foreground">Shiki</a>
    </footer>
  )
}

/* ── Page ──────────────────────────────────────────────────────── */

export default function Home() {
  const [featureIndex, setFeatureIndex] = React.useState(0)
  const [carouselApi, setCarouselApi] = React.useState<CarouselApi>()
  const current = features[featureIndex]

  // Sync tabs when carousel is swiped
  React.useEffect(() => {
    if (!carouselApi) return
    const onSelect = () => setFeatureIndex(carouselApi.selectedScrollSnap())
    carouselApi.on("select", onSelect)
    return () => { carouselApi.off("select", onSelect) }
  }, [carouselApi])

  return (
    <>
      {/* ── Mobile / Tablet layout ────────────────────────────── */}
      <main className="flex min-h-screen flex-col items-center lg:hidden">
        {/* Footer bar at top */}
        <div className="w-full bg-muted px-8 py-3 sm:px-10">
          <Footer className="text-center" />
        </div>

        {/* Hero — center aligned */}
        <div className="flex h-[80svh] w-full flex-col items-center justify-center px-8 text-center sm:px-10">
          <Hero />
        </div>

        {/* Tabs + description above carousel */}
        <FeatureTabs
          features={features}
          featureIndex={featureIndex}
          onSelect={(i) => {
            setFeatureIndex(i)
            carouselApi?.scrollTo(i)
          }}
          heading={current.heading}
          className="w-full items-center px-8 text-center sm:px-10"
        />

        {/* Screenshot carousel */}
        <div className="w-full pt-8">
          <Carousel setApi={setCarouselApi} opts={{ align: "center" }}>
            <CarouselContent>
              {features.map((feature) => (
                <CarouselItem key={feature.id}>
                  <div className="relative aspect-[16/9] w-full overflow-hidden">
                    <Image
                      src={feature.image}
                      alt={`${feature.label} screenshot`}
                      fill
                      className="object-cover object-left-top"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </main>

      {/* ── Desktop layout ────────────────────────────────────── */}
      <main className="relative hidden h-screen w-screen overflow-hidden lg:flex">

        {/* Background layer */}
        <div className="absolute inset-0 flex">
          <div className="h-full w-[50%] bg-gradient-to-l from-muted to-muted/0" />
        </div>

        {/* Top-right buttons */}
        <div className="absolute right-6 top-6 z-20 flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <a href="https://github.com/georgeyiakoumi/component-lab" target="_blank" rel="noopener noreferrer">
              <svg role="img" viewBox="0 0 24 24" className="size-4 fill-current" xmlns="http://www.w3.org/2000/svg"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
             GitHub Repo
            </a>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <a href="https://georgeyiakoumi.com/project/component-lab" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5">
              <BookOpen className="size-4" />
              Case study
            </a>
          </Button>
        </div>

        {/* Content layer */}
        <div className="relative flex w-full flex-1">
          {/* Left column */}
          <div className="relative z-10 flex w-[50%] flex-col items-center justify-center p-14 text-center">
            <Hero />
            <Footer className="mt-8" />
          </div>

          {/* Right column — screenshot */}
          <div className="absolute inset-0 z-0 grid grid-cols-9 items-center px-14">
            <div className="col-span-5 col-start-5">
              <Screenshot features={features} featureIndex={featureIndex} />
            </div>
          </div>

          {/* Feature tabs — bottom right */}
          <div className="relative z-10 ml-auto flex w-[50%] flex-col justify-end p-14">
            <FeatureTabs
              features={features}
              featureIndex={featureIndex}
              onSelect={setFeatureIndex}
              heading={current.heading}
              className="items-end text-right"
            />
          </div>
        </div>
        
      </main>
    </>
  )
}

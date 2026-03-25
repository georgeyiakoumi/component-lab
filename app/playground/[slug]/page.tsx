import { registry } from "@/lib/registry"
import { notFound } from "next/navigation"
import { PlaygroundToolbar } from "@/components/playground/toolbar"

interface ComponentPageProps {
  params: Promise<{ slug: string }>
}

export default async function ComponentPage({ params }: ComponentPageProps) {
  const { slug } = await params
  const component = registry.find((c) => c.slug === slug)

  if (!component) {
    notFound()
  }

  return (
    <>
      <PlaygroundToolbar componentName={component.name} />
      <div className="flex flex-1 items-center justify-center bg-muted/30 p-8">
        <div className="space-y-2 text-center">
          <h2 className="text-lg font-medium">{component.name}</h2>
          <p className="text-sm text-muted-foreground">
            Component preview coming soon
          </p>
        </div>
      </div>
    </>
  )
}

export function generateStaticParams() {
  return registry.map((component) => ({
    slug: component.slug,
  }))
}

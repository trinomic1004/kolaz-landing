import type { FoodBrandShowcaseTile } from "@/lib/landing/food-brand-showcase"

type BrandTilesMarqueeSectionProps = {
  brands: FoodBrandShowcaseTile[]
}

function formatFormulaCount(count: number): string {
  return `${count} fórmula${count === 1 ? "" : "s"}`
}

export function BrandTilesMarqueeSection({ brands }: BrandTilesMarqueeSectionProps) {
  if (!brands.length) {
    return null
  }

  const rowOneTiles = [...brands, ...brands]
  const reversedBrands = [...brands].reverse()
  const rowTwoTiles = [...reversedBrands, ...reversedBrands]

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background via-muted/20 to-background py-24 md:py-28">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center scroll-animate">
          <p className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            Marcas Disponibles
          </p>
          <h2 className="mt-5 text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Marcas premium en nuestra red
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
            Catálogo activo conectado a la red local de Kolaz para entregas automáticas.
          </p>
        </div>
      </div>

      <div className="mt-12 space-y-5 md:mt-14 md:space-y-6">
        <div className="brand-marquee-mask">
          <div className="brand-marquee-track px-3">
            {rowOneTiles.map((item, index) => (
              <article
                key={`row-1-${item.brand}-${index}`}
                className="flex w-64 shrink-0 items-center gap-3 rounded-2xl border border-border/60 bg-card/90 p-3 shadow-premium backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-premium-lg md:w-72 md:gap-4"
              >
                <img
                  src={item.imageUrl}
                  alt={`Bolsa de alimento ${item.brand}`}
                  className="h-14 w-14 shrink-0 object-contain md:h-16 md:w-16"
                  loading="lazy"
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-extrabold tracking-[0.02em] text-foreground md:text-base">
                    {item.brand}
                  </p>
                  <p className="text-xs text-muted-foreground md:text-sm">
                    {formatFormulaCount(item.formulasCount)} en catálogo
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="brand-marquee-mask">
          <div className="brand-marquee-track brand-marquee-track-reverse px-3">
            {rowTwoTiles.map((item, index) => (
              <article
                key={`row-2-${item.brand}-${index}`}
                className="flex w-64 shrink-0 items-center gap-3 rounded-2xl border border-border/60 bg-card/90 p-3 shadow-premium backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-premium-lg md:w-72 md:gap-4"
              >
                <img
                  src={item.imageUrl}
                  alt={`Bolsa de alimento ${item.brand}`}
                  className="h-14 w-14 shrink-0 object-contain md:h-16 md:w-16"
                  loading="lazy"
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-extrabold tracking-[0.02em] text-foreground md:text-base">
                    {item.brand}
                  </p>
                  <p className="text-xs text-muted-foreground md:text-sm">
                    {formatFormulaCount(item.formulasCount)} en catálogo
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

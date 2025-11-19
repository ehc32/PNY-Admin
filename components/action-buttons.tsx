import Link from "next/link"
import { ArrowRight, Database, Search, Sparkles } from "lucide-react"

export default function ActionButtons() {
  const cards = [
    {
      title: "Consulta de bienes registrados",
      description: "Accede al catálogo público de activos disponibles y revisa su estado.",
      icon: <Database className="w-10 h-10" strokeWidth={1.5} />,
      href: "/bienes-publicos",
    },
    {
      title: "Consulta el estado de tu solicitud",
      description: "Ingresa el número de seguimiento y mira el avance de tu mantenimiento.",
      icon: <Search className="w-10 h-10" strokeWidth={1.5} />,
      href: "/consultar-solicitud",
    },
  ]

  return (
    <section className="bg-gradient-to-b from-white to-emerald-50 py-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-6 text-emerald-800">
          <Sparkles className="h-5 w-5" />
          <p className="text-sm font-semibold uppercase tracking-wide">Accesos rápidos</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {cards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="group block rounded-2xl border border-emerald-100 bg-white p-8 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3 text-emerald-800">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100">
                    {card.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{card.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{card.description}</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-emerald-700 transition-transform group-hover:translate-x-1" />
              </div>
              <div className="h-1 w-full rounded-full bg-emerald-100 overflow-hidden">
                <div className="h-full w-1/2 bg-gradient-to-r from-emerald-500 to-emerald-400 group-hover:w-full transition-all duration-700" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

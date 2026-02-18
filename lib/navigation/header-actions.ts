import type { HeaderAction } from "@/components/layout/site-header"

const DEFAULT_ACTION_CLASS_NAME =
  "rounded-full bg-white text-[#FF0000] hover:bg-white/95 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-semibold"
const PRIVACY_ACTION_CLASS_NAME = "rounded-full bg-white text-[#FF0000] hover:bg-white/90"

export const LANDING_HEADER_ACTIONS: HeaderAction[] = [
  {
    label: "Demo",
    href: "/demo",
    className: DEFAULT_ACTION_CLASS_NAME,
  },
  {
    label: "Food Recommender",
    href: "/food-recommender",
    className: DEFAULT_ACTION_CLASS_NAME,
  },
  {
    label: "Contáctanos",
    href: "#contacto",
    className: DEFAULT_ACTION_CLASS_NAME,
  },
]

export const DEMO_HEADER_ACTIONS: HeaderAction[] = [
  {
    label: "Food Recommender",
    href: "/food-recommender",
    className: DEFAULT_ACTION_CLASS_NAME,
  },
  {
    label: "Volver al Inicio",
    href: "/",
    className: DEFAULT_ACTION_CLASS_NAME,
  },
]

export const FOOD_RECOMMENDER_HEADER_ACTIONS: HeaderAction[] = [
  {
    label: "Inicio",
    href: "/",
    className: DEFAULT_ACTION_CLASS_NAME,
  },
  {
    label: "Demo",
    href: "/demo",
    className: DEFAULT_ACTION_CLASS_NAME,
  },
]

export const PRIVACY_HEADER_ACTIONS: HeaderAction[] = [
  {
    label: "Volver al inicio",
    href: "/",
    className: PRIVACY_ACTION_CLASS_NAME,
  },
]

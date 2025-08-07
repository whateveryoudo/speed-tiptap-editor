
export type OptionMenuItem = {
    title: string
    name: string
    iconType: string
    hasArrow: boolean
    options: OptionMenuItem[]
    action: () => void
}
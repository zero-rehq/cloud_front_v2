import * as React from "react"
import { cn } from "@/lib/utils"

interface HighlightContextValue {
  hoveredItem: string | null
  setHoveredItem: (id: string | null) => void
}

const HighlightContext = React.createContext<HighlightContextValue | null>(null)

function useHighlight() {
  const context = React.useContext(HighlightContext)
  if (!context) {
    throw new Error("useHighlight must be used within a Highlight component")
  }
  return context
}

interface HighlightProps {
  children: React.ReactNode
  enabled?: boolean
  hover?: boolean
  controlledItems?: boolean
  mode?: "parent" | "child"
  containerClassName?: string
  forceUpdateBounds?: boolean
  transition?: any
}

function Highlight({
  children,
  enabled = true,
  containerClassName,
  ...props
}: HighlightProps) {
  const [hoveredItem, setHoveredItem] = React.useState<string | null>(null)

  if (!enabled) {
    return <div className={containerClassName}>{children}</div>
  }

  return (
    <HighlightContext.Provider value={{ hoveredItem, setHoveredItem }}>
      <div className={containerClassName}>{children}</div>
    </HighlightContext.Provider>
  )
}

interface HighlightItemProps {
  children: React.ReactNode
  activeClassName?: string
  id?: string
}

function HighlightItem({ children, activeClassName, id }: HighlightItemProps) {
  const itemId = React.useId()
  const finalId = id || itemId
  const context = React.useContext(HighlightContext)

  const [isHovered, setIsHovered] = React.useState(false)

  const handleMouseEnter = () => {
    setIsHovered(true)
    context?.setHoveredItem(finalId)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    context?.setHoveredItem(null)
  }

  return (
    <div
      data-highlight={isHovered ? "true" : undefined}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(isHovered && activeClassName)}
    >
      {children}
    </div>
  )
}

export { Highlight, HighlightItem, useHighlight }

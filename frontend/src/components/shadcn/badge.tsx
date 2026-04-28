import * as React from "react"
import { type VariantProps } from "class-variance-authority"
import * as Slot from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"
import { badgeVariants } from "../ui/badge-variants"

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  asChild?: boolean
}

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: BadgeProps) {
  const Comp = asChild ? Slot.Slot : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props} 
    />
  )
}

export { Badge }
import { Slot } from "@radix-ui/react-slot"

import { cn } from "@/lib/utils"
import { badgeVariants } from "./Badge.variants"
import type { BadgeProps } from "./Badge.types"

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: BadgeProps) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export default Badge
export { Badge, badgeVariants }

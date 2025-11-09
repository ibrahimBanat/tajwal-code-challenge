import {ComponentProps} from "react";
import { type VariantProps } from "class-variance-authority"
import { badgeVariants } from "./Badge.variants"

export interface BadgeProps
  extends ComponentProps<"span">,
    VariantProps<typeof badgeVariants> {
  asChild?: boolean
}
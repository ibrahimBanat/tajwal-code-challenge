import { type VariantProps } from "class-variance-authority"
import { buttonVariants } from "./Button.variants"
import {ComponentProps} from "react";

export interface ButtonProps
  extends ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}
import {ComponentProps} from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar"

export interface AvatarProps
  extends ComponentProps<typeof AvatarPrimitive.Root> {}

export interface AvatarImageProps
  extends ComponentProps<typeof AvatarPrimitive.Image> {}

export interface AvatarFallbackProps
  extends ComponentProps<typeof AvatarPrimitive.Fallback> {}
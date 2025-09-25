import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        destructive:
          "text-destructive bg-card [&>svg]:text-current *:data-[slot=alert-description]:text-destructive/90",
        note: "border-blue-500/50 bg-blue-500/15 text-blue-300 [&>svg]:text-blue-400",
        tip: "border-emerald-500/50 bg-emerald-500/15 text-emerald-300 [&>svg]:text-emerald-400",
        important: "border-purple-500/50 bg-purple-500/15 text-purple-300 [&>svg]:text-purple-400",
        warning: "border-yellow-500/50 bg-yellow-500/15 text-yellow-300 [&>svg]:text-yellow-400",
        caution: "border-orange-500/50 bg-orange-500/15 text-orange-300 [&>svg]:text-orange-400",
        danger: "border-red-500/50 bg-red-500/15 text-red-300 [&>svg]:text-red-400",
        info: "border-cyan-500/50 bg-cyan-500/15 text-cyan-300 [&>svg]:text-cyan-400",
        success: "border-green-500/50 bg-green-500/15 text-green-300 [&>svg]:text-green-400",
        error: "border-red-600/50 bg-red-600/15 text-red-300 [&>svg]:text-red-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight",
        className
      )}
      {...props}
    />
  )
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed",
        className
      )}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription }

import * as React from "react"

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "destructive";
  children?: React.ReactNode;
}

interface AlertDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export function Alert({ variant = "default", className = "", children, ...props }: AlertProps) {
  const baseClasses = "relative w-full rounded-lg border p-4"
  const variantClasses = variant === "destructive" 
    ? "border-red-500/50 text-red-700 bg-red-50" 
    : "border-gray-200 text-gray-900"
  
  return (
    <div
      role="alert"
      className={`${baseClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export function AlertDescription({
  className = "",
  ...props
}: AlertDescriptionProps) {
  return (
    <div
      className={`text-sm [&_p]:leading-relaxed ${className}`}
      {...props}
    />
  )
}
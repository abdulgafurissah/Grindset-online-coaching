import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'outline' | 'brand' | 'ghost' | 'secondary' | 'destructive';
    size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const buttonVariants = ({ variant = "default", size = "default", className = "" }: { variant?: keyof typeof variants, size?: keyof typeof sizes, className?: string } = {}) => {
    return cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-bold uppercase tracking-widest transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
    );
};

const variants = {
    default: "bg-white text-black-rich hover:bg-white/90",
    outline: "border border-white/10 bg-transparent hover:bg-white/5",
    brand: "bg-brand text-black-rich hover:bg-brand/90",
    ghost: "bg-transparent hover:bg-white/5",
    secondary: "bg-white/10 text-white hover:bg-white/20",
    destructive: "bg-red-500 text-white hover:bg-red-600",
};

const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 px-3",
    lg: "h-11 px-8",
    icon: "h-10 w-10",
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'default', size = 'default', ...props }, ref) => {
        return (
            <button
                className={buttonVariants({ variant, size, className })}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button }

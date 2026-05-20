import { cn } from '@/lib/utils'
import { InputHTMLAttributes, forwardRef } from 'react'

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(({ className, style, ...props }, ref) => (
  <input ref={ref} style={{
    width:'100%',padding:'8px 12px',borderRadius:'var(--radius-md)',
    border:'1px solid var(--color-border)',background:'var(--color-surface)',
    color:'var(--color-text)',fontSize:'var(--text-sm)',outline:'none',
    transition:'border-color var(--transition-interactive)',
    ...style
  }} className={cn(className)} {...props} />
))
Input.displayName = 'Input'

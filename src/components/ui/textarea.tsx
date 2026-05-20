import { cn } from '@/lib/utils'
import { TextareaHTMLAttributes, forwardRef } from 'react'

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(({ className, style, ...props }, ref) => (
  <textarea ref={ref} style={{
    width:'100%',padding:'8px 12px',borderRadius:'var(--radius-md)',
    border:'1px solid var(--color-border)',background:'var(--color-surface)',
    color:'var(--color-text)',fontSize:'var(--text-sm)',outline:'none',resize:'vertical',
    transition:'border-color var(--transition-interactive)',fontFamily:'inherit',
    ...style
  }} className={cn(className)} {...props} />
))
textarea.displayName = 'Textarea'

import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes, forwardRef } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary'|'secondary'|'ghost'|'danger'
  size?: 'sm'|'md'|'lg'
}

export const Button = forwardRef<HTMLButtonElement, Props>(({ className, variant='secondary', size='md', style, ...props }, ref) => {
  const base: React.CSSProperties = {
    display:'inline-flex',alignItems:'center',justifyContent:'center',gap:'6px',
    borderRadius:'var(--radius-md)',fontWeight:500,transition:'all var(--transition-interactive)',
    cursor:'pointer',border:'none',flexShrink:0,
  }
  const sizes: Record<string,React.CSSProperties> = {
    sm:{padding:'4px 10px',fontSize:'var(--text-xs)'},
    md:{padding:'7px 14px',fontSize:'var(--text-sm)'},
    lg:{padding:'10px 20px',fontSize:'var(--text-base)'},
  }
  const variants: Record<string,React.CSSProperties> = {
    primary:{background:'var(--color-primary)',color:'#fff'},
    secondary:{background:'var(--color-surface-2)',color:'var(--color-text)',border:'1px solid var(--color-border)'},
    ghost:{background:'transparent',color:'var(--color-text-muted)'},
    danger:{background:'rgba(161,44,123,0.15)',color:'var(--color-error)',border:'1px solid rgba(161,44,123,0.3)'},
  }
  return <button ref={ref} style={{...base,...sizes[size],...variants[variant],...style}} className={cn(className)} {...props} />
})
Button.displayName = 'Button'

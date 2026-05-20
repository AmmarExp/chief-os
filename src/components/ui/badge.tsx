import { cn } from '@/lib/utils'

type Variant = 'default'|'primary'|'success'|'warning'|'danger'|'muted'
interface Props { label: string; variant?: Variant; className?: string }

const styles: Record<Variant, React.CSSProperties> = {
  default:  {background:'var(--color-surface-2)',color:'var(--color-text-muted)',border:'1px solid var(--color-border)'},
  primary:  {background:'rgba(1,105,111,0.15)',color:'var(--color-primary)'},
  success:  {background:'rgba(67,122,34,0.15)',color:'var(--color-success)'},
  warning:  {background:'rgba(150,66,25,0.15)',color:'var(--color-warning)'},
  danger:   {background:'rgba(161,44,123,0.15)',color:'var(--color-error)'},
  muted:    {background:'transparent',color:'var(--color-text-faint)'},
}

export function Badge({ label, variant='default', className }: Props) {
  return (
    <span style={{
      display:'inline-flex',alignItems:'center',padding:'2px 8px',
      borderRadius:'var(--radius-full)',fontSize:'var(--text-xs)',fontWeight:500,
      ...styles[variant]
    }} className={cn(className)}>{label}</span>
  )
}

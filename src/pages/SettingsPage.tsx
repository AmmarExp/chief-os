import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'

export function SettingsPage() {
  const { user, signOut } = useAuth()
  return (
    <div style={{padding:'32px',maxWidth:'600px'}}>
      <h1 style={{fontSize:'var(--text-xl)',fontWeight:700,color:'var(--color-text)',marginBottom:'24px'}}>Settings</h1>
      <div style={{background:'var(--color-surface)',border:'1px solid var(--color-border)',borderRadius:'var(--radius-xl)',padding:'20px',display:'flex',flexDirection:'column',gap:'16px'}}>
        <div>
          <div style={{fontSize:'var(--text-xs)',color:'var(--color-text-muted)',marginBottom:'4px'}}>Email</div>
          <div style={{fontSize:'var(--text-sm)',color:'var(--color-text)'}}>{user?.email}</div>
        </div>
        <div style={{borderTop:'1px solid var(--color-border)',paddingTop:'16px'}}>
          <Button variant="danger" onClick={signOut}>Sign Out</Button>
        </div>
      </div>
    </div>
  )
}

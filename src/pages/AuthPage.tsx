import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function AuthPage() {
  const [mode, setMode] = useState<'login'|'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handle = async () => {
    setLoading(true); setError(''); setSuccess('')
    if (mode === 'login') {
      const { error: e } = await supabase.auth.signInWithPassword({ email, password })
      if (e) setError(e.message)
    } else {
      const { error: e } = await supabase.auth.signUp({ email, password })
      if (e) setError(e.message)
      else setSuccess('Check your email to confirm your account.')
    }
    setLoading(false)
  }

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'var(--color-bg)',padding:'24px'}}>
      <div style={{width:'100%',maxWidth:'380px'}}>
        <div style={{textAlign:'center',marginBottom:'32px'}}>
          <div style={{fontSize:'40px',marginBottom:'12px'}}>👑</div>
          <h1 style={{fontSize:'var(--text-xl)',fontWeight:700,color:'var(--color-text)',marginBottom:'4px'}}>Chief OS</h1>
          <p style={{color:'var(--color-text-muted)',fontSize:'var(--text-sm)'}}>Your personal AI command center</p>
        </div>
        <div style={{background:'var(--color-surface)',border:'1px solid var(--color-border)',borderRadius:'var(--radius-xl)',padding:'28px',display:'flex',flexDirection:'column',gap:'16px'}}>
          <div style={{display:'flex',gap:'8px',padding:'4px',background:'var(--color-bg)',borderRadius:'var(--radius-md)'}}>
            {(['login','signup'] as const).map(m => (
              <button key={m} onClick={() => setMode(m)} style={{flex:1,padding:'6px',borderRadius:'var(--radius-sm)',fontSize:'var(--text-sm)',fontWeight:500,border:'none',cursor:'pointer',transition:'all 0.18s',background:mode===m?'var(--color-surface)':'transparent',color:mode===m?'var(--color-text)':'var(--color-text-muted)',boxShadow:mode===m?'var(--shadow-sm)':'none'}}>
                {m === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>
          <Input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <Input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handle()} />
          {error && <p style={{color:'var(--color-error)',fontSize:'var(--text-xs)'}}>{error}</p>}
          {success && <p style={{color:'var(--color-success)',fontSize:'var(--text-xs)'}}>{success}</p>}
          <Button variant="primary" size="lg" onClick={handle} disabled={loading} style={{width:'100%'}}>
            {loading ? 'Loading...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </Button>
        </div>
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import type { Agent } from '@/lib/supabase'
import { Badge } from '@/components/ui/badge'

export function AgentsPage() {
  const { user } = useAuth()
  const [agents, setAgents] = useState<Agent[]>([])

  useEffect(() => {
    if (!user) return
    supabase.from('agents').select('*').eq('user_id', user.id).order('created_at').then(({ data }) => setAgents(data ?? []))
  }, [user])

  return (
    <div style={{padding:'32px',maxWidth:'800px'}}>
      <div style={{marginBottom:'24px'}}>
        <h1 style={{fontSize:'var(--text-xl)',fontWeight:700,color:'var(--color-text)'}}>Agents</h1>
        <p style={{color:'var(--color-text-muted)',fontSize:'var(--text-sm)',marginTop:'4px'}}>Your AI team</p>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:'16px'}}>
        {agents.length === 0 ? (
          <div style={{textAlign:'center',padding:'60px 0',color:'var(--color-text-muted)',gridColumn:'1/-1'}}>
            <div style={{fontSize:'32px',marginBottom:'8px'}}>🤖</div>
            <p style={{fontSize:'var(--text-sm)'}}>No agents. Run the SQL migration first.</p>
          </div>
        ) : agents.map(a => (
          <div key={a.id} style={{background:'var(--color-surface)',border:'1px solid var(--color-border)',borderRadius:'var(--radius-xl)',padding:'20px'}}>
            <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'12px'}}>
              <div style={{fontSize:'32px'}}>{a.avatar_emoji}</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:600,color:'var(--color-text)',display:'flex',alignItems:'center',gap:'6px'}}>
                  {a.name} {a.is_chief && <Badge label="Chief" variant="primary" />}
                </div>
                <div style={{fontSize:'var(--text-xs)',color:'var(--color-text-muted)',marginTop:'2px'}}>{a.role}</div>
              </div>
              <Badge label={a.status} variant={a.status==='running'?'success':a.status==='paused'?'warning':'muted'} />
            </div>
            <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
              <span style={{fontSize:'var(--text-xs)',color:'var(--color-text-muted)'}}>Autonomy</span>
              <div style={{flex:1,height:'4px',borderRadius:'2px',background:'var(--color-surface-2)',overflow:'hidden'}}>
                <div style={{height:'100%',width:`${a.autonomy}%`,background:'var(--color-primary)',borderRadius:'2px',transition:'width 0.3s'}} />
              </div>
              <span style={{fontSize:'var(--text-xs)',color:'var(--color-text-muted)'}}>{a.autonomy}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

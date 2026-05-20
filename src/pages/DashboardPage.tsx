import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import type { Agent, Task } from '@/lib/supabase'
import type { PageId } from '@/App'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Bot, CheckSquare, FileText, Calendar, ArrowRight } from 'lucide-react'

interface Props { onNavigate: (p: PageId) => void }

export function DashboardPage({ onNavigate }: Props) {
  const { user } = useAuth()
  const [agents, setAgents] = useState<Agent[]>([])
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    if (!user) return
    supabase.from('agents').select('*').eq('user_id', user.id).then(({ data }) => setAgents(data ?? []))
    supabase.from('tasks').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5).then(({ data }) => setTasks(data ?? []))
  }, [user])

  const cards = [
    { icon: Bot, label: 'Agents', value: agents.length, page: 'agents' as PageId, color: 'var(--color-primary)' },
    { icon: CheckSquare, label: 'Active Tasks', value: tasks.filter(t => t.status !== 'done').length, page: 'tasks' as PageId, color: 'var(--color-warning)' },
    { icon: FileText, label: 'Notes', value: '—', page: 'notes' as PageId, color: 'var(--color-success)' },
    { icon: Calendar, label: 'Events', value: '—', page: 'calendar' as PageId, color: '#7a39bb' },
  ]

  return (
    <div style={{padding:'32px',maxWidth:'900px'}}>
      <div style={{marginBottom:'28px'}}>
        <h1 style={{fontSize:'var(--text-xl)',fontWeight:700,color:'var(--color-text)',marginBottom:'4px'}}>Welcome back 👋</h1>
        <p style={{color:'var(--color-text-muted)',fontSize:'var(--text-sm)'}}>{user?.email}</p>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:'16px',marginBottom:'32px'}}>
        {cards.map(({ icon: Icon, label, value, page, color }) => (
          <button key={page} onClick={() => onNavigate(page)} style={{
            background:'var(--color-surface)',border:'1px solid var(--color-border)',
            borderRadius:'var(--radius-xl)',padding:'20px',textAlign:'left',cursor:'pointer',
            transition:'all 0.18s',display:'flex',flexDirection:'column',gap:'12px'
          }}>
            <div style={{width:'36px',height:'36px',borderRadius:'var(--radius-md)',display:'flex',alignItems:'center',justifyContent:'center',background:`${color}20`}}>
              <Icon size={18} style={{color}} />
            </div>
            <div>
              <div style={{fontSize:'var(--text-xl)',fontWeight:700,color:'var(--color-text)',lineHeight:1}}>{value}</div>
              <div style={{fontSize:'var(--text-xs)',color:'var(--color-text-muted)',marginTop:'4px'}}>{label}</div>
            </div>
          </button>
        ))}
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'20px'}}>
        <div style={{background:'var(--color-surface)',border:'1px solid var(--color-border)',borderRadius:'var(--radius-xl)',padding:'20px'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'16px'}}>
            <span style={{fontWeight:600,color:'var(--color-text)',fontSize:'var(--text-sm)'}}>Agents</span>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('agents')}><ArrowRight size={14}/></Button>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
            {agents.length === 0 ? <p style={{color:'var(--color-text-faint)',fontSize:'var(--text-xs)'}}>No agents yet</p> :
              agents.map(a => (
                <div key={a.id} style={{display:'flex',alignItems:'center',gap:'10px'}}>
                  <span style={{fontSize:'20px'}}>{a.avatar_emoji}</span>
                  <div>
                    <div style={{fontSize:'var(--text-sm)',color:'var(--color-text)',fontWeight:500}}>{a.name}</div>
                    <div style={{fontSize:'var(--text-xs)',color:'var(--color-text-muted)'}}>{a.role}</div>
                  </div>
                  <Badge label={a.status} variant={a.status==='running'?'success':a.status==='paused'?'warning':'muted'} />
                </div>
              ))
            }
          </div>
        </div>

        <div style={{background:'var(--color-surface)',border:'1px solid var(--color-border)',borderRadius:'var(--radius-xl)',padding:'20px'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'16px'}}>
            <span style={{fontWeight:600,color:'var(--color-text)',fontSize:'var(--text-sm)'}}>Recent Tasks</span>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('tasks')}><ArrowRight size={14}/></Button>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
            {tasks.length === 0 ? <p style={{color:'var(--color-text-faint)',fontSize:'var(--text-xs)'}}>No tasks yet</p> :
              tasks.map(t => (
                <div key={t.id} style={{display:'flex',alignItems:'center',gap:'10px',justifyContent:'space-between'}}>
                  <span style={{fontSize:'var(--text-sm)',color:'var(--color-text)',flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{t.title}</span>
                  <Badge label={t.status} variant={t.status==='done'?'success':t.status==='failed'?'danger':t.status==='running'?'primary':'muted'} />
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  )
}

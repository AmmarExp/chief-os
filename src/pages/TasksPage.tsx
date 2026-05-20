import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import type { Task, Agent } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Plus, X } from 'lucide-react'

export function TasksPage() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [agents, setAgents] = useState<Agent[]>([])
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<'low'|'medium'|'high'>('medium')
  const [agentId, setAgentId] = useState('')

  const load = async () => {
    if (!user) return
    const { data } = await supabase.from('tasks').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
    setTasks(data ?? [])
  }

  useEffect(() => {
    if (!user) return
    load()
    supabase.from('agents').select('*').eq('user_id', user.id).then(({ data }) => setAgents(data ?? []))
  }, [user])

  const addTask = async () => {
    if (!title.trim() || !user) return
    await supabase.from('tasks').insert({ user_id: user.id, title, description: description || null, priority, agent_id: agentId || null, status: 'queued' })
    setTitle(''); setDescription(''); setPriority('medium'); setAgentId(''); setShowForm(false)
    load()
  }

  const deleteTask = async (id: string) => {
    await supabase.from('tasks').delete().eq('id', id)
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  const statusVariant = (s: string) => s==='done'?'success':s==='failed'?'danger':s==='running'?'primary':'muted'
  const priorityVariant = (p: string) => p==='high'?'danger':p==='medium'?'warning':'default'

  return (
    <div style={{padding:'32px',maxWidth:'800px'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'24px'}}>
        <h1 style={{fontSize:'var(--text-xl)',fontWeight:700,color:'var(--color-text)'}}>Tasks</h1>
        <Button variant="primary" size="sm" onClick={() => setShowForm(!showForm)}><Plus size={16}/>New Task</Button>
      </div>

      {showForm && (
        <div style={{background:'var(--color-surface)',border:'1px solid var(--color-border)',borderRadius:'var(--radius-xl)',padding:'20px',marginBottom:'20px',display:'flex',flexDirection:'column',gap:'12px'}}>
          <Input placeholder="Task title" value={title} onChange={e => setTitle(e.target.value)} />
          <Input placeholder="Description (optional)" value={description} onChange={e => setDescription(e.target.value)} />
          <div style={{display:'flex',gap:'10px'}}>
            <select value={priority} onChange={e => setPriority(e.target.value as any)} style={{flex:1,padding:'8px 12px',borderRadius:'var(--radius-md)',border:'1px solid var(--color-border)',background:'var(--color-surface)',color:'var(--color-text)',fontSize:'var(--text-sm)'}}>
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            <select value={agentId} onChange={e => setAgentId(e.target.value)} style={{flex:1,padding:'8px 12px',borderRadius:'var(--radius-md)',border:'1px solid var(--color-border)',background:'var(--color-surface)',color:'var(--color-text)',fontSize:'var(--text-sm)'}}>
              <option value="">No Agent</option>
              {agents.map(a => <option key={a.id} value={a.id}>{a.avatar_emoji} {a.name}</option>)}
            </select>
          </div>
          <div style={{display:'flex',gap:'8px'}}>
            <Button variant="primary" onClick={addTask}>Add Task</Button>
            <Button variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </div>
      )}

      <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
        {tasks.length === 0 ? (
          <div style={{textAlign:'center',padding:'60px 0',color:'var(--color-text-muted)'}}>
            <div style={{fontSize:'32px',marginBottom:'8px'}}>✅</div>
            <p style={{fontSize:'var(--text-sm)'}}>No tasks yet. Create one!</p>
          </div>
        ) : tasks.map(t => (
          <div key={t.id} style={{background:'var(--color-surface)',border:'1px solid var(--color-border)',borderRadius:'var(--radius-lg)',padding:'14px 16px',display:'flex',alignItems:'center',gap:'12px'}}>
            <div style={{flex:1}}>
              <div style={{fontWeight:500,color:'var(--color-text)',fontSize:'var(--text-sm)',marginBottom:'4px'}}>{t.title}</div>
              {t.description && <div style={{fontSize:'var(--text-xs)',color:'var(--color-text-muted)'}}>{t.description}</div>}
            </div>
            <Badge label={t.priority} variant={priorityVariant(t.priority)} />
            <Badge label={t.status} variant={statusVariant(t.status)} />
            <button onClick={() => deleteTask(t.id)} style={{color:'var(--color-text-faint)',cursor:'pointer',border:'none',background:'none',padding:'4px'}}><X size={14}/></button>
          </div>
        ))}
      </div>
    </div>
  )
}

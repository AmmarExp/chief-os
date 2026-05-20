import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import type { CalendarEvent } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, X } from 'lucide-react'

export function CalendarPage() {
  const { user } = useAuth()
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [startsAt, setStartsAt] = useState('')
  const [allDay, setAllDay] = useState(false)

  const load = async () => {
    if (!user) return
    const { data } = await supabase.from('calendar_events').select('*').eq('user_id', user.id).order('starts_at')
    setEvents(data ?? [])
  }

  useEffect(() => { load() }, [user])

  const add = async () => {
    if (!title.trim() || !startsAt || !user) return
    await supabase.from('calendar_events').insert({ user_id: user.id, title, description: description || null, starts_at: new Date(startsAt).toISOString(), all_day: allDay })
    setTitle(''); setDescription(''); setStartsAt(''); setAllDay(false); setShowForm(false); load()
  }

  const del = async (id: string) => {
    await supabase.from('calendar_events').delete().eq('id', id)
    setEvents(prev => prev.filter(e => e.id !== id))
  }

  const upcoming = events.filter(e => new Date(e.starts_at) >= new Date(Date.now() - 86400000))
  const past = events.filter(e => new Date(e.starts_at) < new Date(Date.now() - 86400000))

  const EventRow = ({ e }: { e: CalendarEvent }) => (
    <div style={{background:'var(--color-surface)',border:'1px solid var(--color-border)',borderRadius:'var(--radius-lg)',padding:'14px 16px',display:'flex',alignItems:'center',gap:'14px'}}>
      <div style={{width:'4px',alignSelf:'stretch',borderRadius:'2px',background:e.color||'var(--color-primary)',flexShrink:0}} />
      <div style={{flex:1}}>
        <div style={{fontWeight:500,color:'var(--color-text)',fontSize:'var(--text-sm)'}}>{e.title}</div>
        <div style={{fontSize:'var(--text-xs)',color:'var(--color-text-muted)',marginTop:'2px'}}>
          {e.all_day ? 'All day — ' : ''}{new Date(e.starts_at).toLocaleString()}
        </div>
        {e.description && <div style={{fontSize:'var(--text-xs)',color:'var(--color-text-muted)',marginTop:'2px'}}>{e.description}</div>}
      </div>
      <button onClick={() => del(e.id)} style={{color:'var(--color-text-faint)',cursor:'pointer',border:'none',background:'none',padding:'4px'}}><X size={14}/></button>
    </div>
  )

  return (
    <div style={{padding:'32px',maxWidth:'700px'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'24px'}}>
        <h1 style={{fontSize:'var(--text-xl)',fontWeight:700,color:'var(--color-text)'}}>Calendar</h1>
        <Button variant="primary" size="sm" onClick={() => setShowForm(!showForm)}><Plus size={16}/>New Event</Button>
      </div>

      {showForm && (
        <div style={{background:'var(--color-surface)',border:'1px solid var(--color-border)',borderRadius:'var(--radius-xl)',padding:'20px',marginBottom:'20px',display:'flex',flexDirection:'column',gap:'12px'}}>
          <Input placeholder="Event title" value={title} onChange={e => setTitle(e.target.value)} />
          <Input placeholder="Description (optional)" value={description} onChange={e => setDescription(e.target.value)} />
          <Input type="datetime-local" value={startsAt} onChange={e => setStartsAt(e.target.value)} />
          <label style={{display:'flex',alignItems:'center',gap:'8px',fontSize:'var(--text-sm)',color:'var(--color-text-muted)',cursor:'pointer'}}>
            <input type="checkbox" checked={allDay} onChange={e => setAllDay(e.target.checked)} />All day
          </label>
          <div style={{display:'flex',gap:'8px'}}>
            <Button variant="primary" onClick={add}>Add Event</Button>
            <Button variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </div>
      )}

      {upcoming.length > 0 && (
        <div style={{marginBottom:'24px'}}>
          <div style={{fontSize:'var(--text-xs)',fontWeight:600,color:'var(--color-text-faint)',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:'10px'}}>Upcoming</div>
          <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>{upcoming.map(e => <EventRow key={e.id} e={e} />)}</div>
        </div>
      )}

      {past.length > 0 && (
        <div>
          <div style={{fontSize:'var(--text-xs)',fontWeight:600,color:'var(--color-text-faint)',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:'10px'}}>Past</div>
          <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>{past.map(e => <EventRow key={e.id} e={e} />)}</div>
        </div>
      )}

      {events.length === 0 && (
        <div style={{textAlign:'center',padding:'60px 0',color:'var(--color-text-muted)'}}>
          <div style={{fontSize:'32px',marginBottom:'8px'}}>📅</div>
          <p style={{fontSize:'var(--text-sm)'}}>No events yet. Create one!</p>
        </div>
      )}
    </div>
  )
}

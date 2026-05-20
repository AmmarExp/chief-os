import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import type { Note } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Plus, X, Edit2, Check } from 'lucide-react'

export function NotesPage() {
  const { user } = useAuth()
  const [notes, setNotes] = useState<Note[]>([])
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [editId, setEditId] = useState<string|null>(null)

  const load = async () => {
    if (!user) return
    const { data } = await supabase.from('notes').select('*').eq('user_id', user.id).order('updated_at', { ascending: false })
    setNotes(data ?? [])
  }

  useEffect(() => { load() }, [user])

  const save = async () => {
    if (!title.trim() || !user) return
    if (editId) {
      await supabase.from('notes').update({ title, content, updated_at: new Date().toISOString() }).eq('id', editId)
    } else {
      await supabase.from('notes').insert({ user_id: user.id, title, content })
    }
    setTitle(''); setContent(''); setEditId(null); setShowForm(false); load()
  }

  const del = async (id: string) => {
    await supabase.from('notes').delete().eq('id', id)
    setNotes(prev => prev.filter(n => n.id !== id))
  }

  const startEdit = (n: Note) => { setEditId(n.id); setTitle(n.title); setContent(n.content); setShowForm(true) }

  return (
    <div style={{padding:'32px',maxWidth:'900px'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'24px'}}>
        <h1 style={{fontSize:'var(--text-xl)',fontWeight:700,color:'var(--color-text)'}}>Notes</h1>
        <Button variant="primary" size="sm" onClick={() => { setEditId(null); setTitle(''); setContent(''); setShowForm(!showForm) }}><Plus size={16}/>New Note</Button>
      </div>

      {showForm && (
        <div style={{background:'var(--color-surface)',border:'1px solid var(--color-border)',borderRadius:'var(--radius-xl)',padding:'20px',marginBottom:'20px',display:'flex',flexDirection:'column',gap:'12px'}}>
          <Input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
          <Textarea placeholder="Content..." value={content} onChange={e => setContent(e.target.value)} rows={4} />
          <div style={{display:'flex',gap:'8px'}}>
            <Button variant="primary" onClick={save}><Check size={14}/>{editId ? 'Update' : 'Save'}</Button>
            <Button variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </div>
      )}

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:'16px'}}>
        {notes.length === 0 ? (
          <div style={{textAlign:'center',padding:'60px 0',color:'var(--color-text-muted)',gridColumn:'1/-1'}}>
            <div style={{fontSize:'32px',marginBottom:'8px'}}>📝</div>
            <p style={{fontSize:'var(--text-sm)'}}>No notes yet. Create one!</p>
          </div>
        ) : notes.map(n => (
          <div key={n.id} style={{background:'var(--color-surface)',border:'1px solid var(--color-border)',borderRadius:'var(--radius-xl)',padding:'16px',display:'flex',flexDirection:'column',gap:'8px'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:'8px'}}>
              <span style={{fontWeight:600,color:'var(--color-text)',fontSize:'var(--text-sm)',flex:1}}>{n.title}</span>
              <div style={{display:'flex',gap:'4px'}}>
                <button onClick={() => startEdit(n)} style={{color:'var(--color-text-muted)',cursor:'pointer',border:'none',background:'none',padding:'4px'}}><Edit2 size={13}/></button>
                <button onClick={() => del(n.id)} style={{color:'var(--color-text-muted)',cursor:'pointer',border:'none',background:'none',padding:'4px'}}><X size={13}/></button>
              </div>
            </div>
            <p style={{fontSize:'var(--text-xs)',color:'var(--color-text-muted)',flex:1,lineHeight:1.6,overflow:'hidden',display:'-webkit-box',WebkitLineClamp:4,WebkitBoxOrient:'vertical'}}>{n.content}</p>
            <span style={{fontSize:'var(--text-xs)',color:'var(--color-text-faint)'}}>{new Date(n.updated_at).toLocaleDateString()}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

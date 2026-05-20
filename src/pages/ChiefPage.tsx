import { useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import type { ChiefMessage } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Send } from 'lucide-react'

export function ChiefPage() {
  const { user } = useAuth()
  const [messages, setMessages] = useState<ChiefMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!user) return
    supabase.from('chief_messages').select('*').eq('user_id', user.id).order('created_at').then(({ data }) => setMessages(data ?? []))
    const channel = supabase.channel('chief-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chief_messages', filter: `user_id=eq.${user.id}` },
        (payload) => setMessages(prev => [...prev, payload.new as ChiefMessage]))
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [user])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const send = async () => {
    if (!input.trim() || !user) return
    const text = input.trim(); setInput(''); setLoading(true)
    await supabase.from('chief_messages').insert({ user_id: user.id, direction: 'in', text })
    // Echo reply (replace with Edge Function later)
    setTimeout(async () => {
      await supabase.from('chief_messages').insert({ user_id: user.id, direction: 'out', text: `Got it: "${text}" — I'll work on that.` })
      setLoading(false)
    }, 800)
  }

  return (
    <div style={{height:'100%',display:'flex',flexDirection:'column'}}>
      <div style={{padding:'20px 24px',borderBottom:'1px solid var(--color-border)',display:'flex',alignItems:'center',gap:'12px'}}>
        <div style={{fontSize:'24px'}}>👑</div>
        <div>
          <div style={{fontWeight:600,color:'var(--color-text)'}}>Chief</div>
          <div style={{fontSize:'var(--text-xs)',color:'var(--color-text-muted)'}}>Personal AI Assistant</div>
        </div>
      </div>

      <div style={{flex:1,overflowY:'auto',padding:'24px',display:'flex',flexDirection:'column',gap:'12px'}}>
        {messages.length === 0 && (
          <div style={{textAlign:'center',padding:'60px 0'}}>
            <div style={{fontSize:'40px',marginBottom:'12px'}}>👑</div>
            <p style={{color:'var(--color-text-muted)',fontSize:'var(--text-sm)'}}>Send a message to Chief</p>
          </div>
        )}
        {messages.map(m => (
          <div key={m.id} style={{display:'flex',justifyContent:m.direction==='in'?'flex-end':'flex-start'}}>
            <div style={{
              maxWidth:'70%',padding:'10px 14px',borderRadius:'var(--radius-lg)',fontSize:'var(--text-sm)',lineHeight:1.6,
              background:m.direction==='in'?'var(--color-primary)':'var(--color-surface)',
              color:m.direction==='in'?'#fff':'var(--color-text)',
              border:m.direction==='out'?'1px solid var(--color-border)':'none',
            }}>{m.text}</div>
          </div>
        ))}
        {loading && (
          <div style={{display:'flex',gap:'6px',alignItems:'center',paddingLeft:'4px'}}>
            {[0,1,2].map(i => <div key={i} style={{width:'6px',height:'6px',borderRadius:'50%',background:'var(--color-text-faint)',animation:`pulse 1.2s ${i*0.2}s infinite`}} />)}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={{padding:'16px 24px',borderTop:'1px solid var(--color-border)',display:'flex',gap:'10px'}}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key==='Enter' && !e.shiftKey && send()}
          placeholder="Message Chief..." style={{
            flex:1,padding:'10px 14px',borderRadius:'var(--radius-lg)',border:'1px solid var(--color-border)',
            background:'var(--color-surface)',color:'var(--color-text)',fontSize:'var(--text-sm)',outline:'none'
          }} />
        <Button variant="primary" onClick={send} disabled={loading || !input.trim()}><Send size={16}/></Button>
      </div>
    </div>
  )
}

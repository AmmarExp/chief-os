import { MessageSquare, CheckSquare, FileText, Calendar, FolderOpen, Bot, Brain, Sparkles, Wrench, ScrollText, LayoutDashboard, Settings } from 'lucide-react'
import type { PageId } from '@/App'

const NAV = [
  { section: 'Overview' },
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { section: 'My Space' },
  { id: 'chief', label: 'Chief', icon: MessageSquare },
  { id: 'notes', label: 'Notes', icon: FileText },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { section: 'Agent Space' },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare },
  { id: 'agents', label: 'Agents', icon: Bot },
  { id: 'outputs', label: 'Outputs', icon: FolderOpen },
  { section: 'Intelligence' },
  { id: 'memory', label: 'Memory', icon: Brain },
  { id: 'soul', label: 'Soul', icon: Sparkles },
  { id: 'skills', label: 'Skills', icon: Wrench },
  { id: 'logs', label: 'Logs', icon: ScrollText },
  { section: '' },
  { id: 'settings', label: 'Settings', icon: Settings },
] as const

interface Props { currentPage: PageId; onNavigate: (p: PageId) => void }

export function Sidebar({ currentPage, onNavigate }: Props) {
  return (
    <div className="w-56 h-full flex flex-col overflow-y-auto" style={{background:'var(--color-surface)',borderRight:'1px solid var(--color-border)'}}>
      <div className="flex items-center gap-2.5 px-4 py-4" style={{borderBottom:'1px solid var(--color-border)'}}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg" style={{background:'rgba(1,105,111,0.2)'}}>👑</div>
        <span className="font-bold tracking-tight" style={{color:'var(--color-text)'}}>Chief OS</span>
      </div>
      <nav className="flex-1 px-2 py-2" style={{display:'flex',flexDirection:'column',gap:'2px'}}>
        {NAV.map((item, i) => {
          if ('section' in item && !('id' in item)) {
            return item.section
              ? <div key={i} className="px-2 pt-3 pb-1 text-xs font-semibold uppercase tracking-wider" style={{color:'var(--color-text-faint)'}}>{item.section}</div>
              : <div key={i} className="py-1" />
          }
          const { id, label, icon: Icon } = item as any
          const active = currentPage === id
          return (
            <button key={id} onClick={() => onNavigate(id as PageId)}
              style={{
                display:'flex',alignItems:'center',gap:'10px',padding:'8px 12px',
                borderRadius:'var(--radius-lg)',fontSize:'var(--text-sm)',
                textAlign:'left',width:'100%',transition:'all 0.18s',
                background: active ? 'rgba(1,105,111,0.15)' : 'transparent',
                color: active ? 'var(--color-primary)' : 'var(--color-text-muted)',
                fontWeight: active ? 500 : 400,
              }}>
              <Icon size={16} style={{flexShrink:0}} />{label}
            </button>
          )
        })}
      </nav>
    </div>
  )
}

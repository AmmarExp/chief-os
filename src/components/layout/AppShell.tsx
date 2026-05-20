import { ReactNode, useState } from 'react'
import { Menu } from 'lucide-react'
import { Sidebar } from './Sidebar'
import type { PageId } from '@/App'

interface Props { children: ReactNode; currentPage: PageId; onNavigate: (p: PageId) => void }

export function AppShell({ children, currentPage, onNavigate }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false)
  return (
    <div className="flex h-screen overflow-hidden" style={{background:'var(--color-bg)'}}>
      {mobileOpen && <div className="fixed inset-0 z-20 bg-black/60 lg:hidden" onClick={() => setMobileOpen(false)} />}
      <div className={`fixed inset-y-0 left-0 z-30 transition-transform duration-200 lg:static lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar currentPage={currentPage} onNavigate={(p) => { onNavigate(p); setMobileOpen(false) }} />
      </div>
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="lg:hidden flex items-center gap-3 px-4 py-3" style={{borderBottom:'1px solid var(--color-border)'}}>
          <button onClick={() => setMobileOpen(true)} className="p-2" style={{color:'var(--color-text-muted)'}}><Menu size={20}/></button>
          <span className="text-sm font-semibold" style={{color:'var(--color-text)'}}>Chief OS</span>
        </header>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}

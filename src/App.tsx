import { useState, useEffect } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { DashboardPage } from '@/pages/DashboardPage'
import { ChiefPage } from '@/pages/ChiefPage'
import { TasksPage } from '@/pages/TasksPage'
import { NotesPage } from '@/pages/NotesPage'
import { CalendarPage } from '@/pages/CalendarPage'
import { AgentsPage } from '@/pages/AgentsPage'
import { OutputsPage } from '@/pages/OutputsPage'
import { MemoryPage } from '@/pages/MemoryPage'
import { SoulPage } from '@/pages/SoulPage'
import { SkillsPage } from '@/pages/SkillsPage'
import { LogsPage } from '@/pages/LogsPage'
import { SettingsPage } from '@/pages/SettingsPage'

export type PageId = 'dashboard'|'chief'|'tasks'|'notes'|'calendar'|'agents'|'outputs'|'memory'|'soul'|'skills'|'logs'|'settings'

function App() {
  const [page, setPage] = useState<PageId>('dashboard')

  useEffect(() => {
    const hash = window.location.hash.replace('#','') as PageId
    if (hash) setPage(hash)
  }, [])

  useEffect(() => { window.location.hash = page }, [page])

  const pages: Record<PageId, React.ReactNode> = {
    dashboard: <DashboardPage onNavigate={setPage} />,
    chief: <ChiefPage />,
    tasks: <TasksPage />,
    notes: <NotesPage />,
    calendar: <CalendarPage />,
    agents: <AgentsPage />,
    outputs: <OutputsPage />,
    memory: <MemoryPage />,
    soul: <SoulPage />,
    skills: <SkillsPage />,
    logs: <LogsPage />,
    settings: <SettingsPage />,
  }

  return (
    <AppShell currentPage={page} onNavigate={setPage}>
      {pages[page]}
    </AppShell>
  )
}

export default App

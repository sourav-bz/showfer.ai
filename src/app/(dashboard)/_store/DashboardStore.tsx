import { create } from 'zustand'

type ViewType = 'mobile' | 'desktop'

interface DashboardStore {
    view: ViewType
    setView: (view: ViewType) => void
}

export const useDashboardStore = create<DashboardStore>((set) => ({
    view: 'desktop',
    setView: (view) => set({ view }),
}))
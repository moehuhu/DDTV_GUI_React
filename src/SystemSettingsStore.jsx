import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useSystemSettingsStore = create(
    persist((set, get) => {
        const getSetter = (keyName) => (value) => set(() => ({ [keyName]: value }))
        const defaultGlobalConfig = {
            isDarkMode: false,
            language: navigator?.language || 'zh',
        }
        const defaultOverviewConfig = {
            isAutoRefresh: true,
            autoRefreshIntervalSeconds: 15,
            pageSize: 20,
            recDanmu: false,
            autoRec: false,
            remind: false,
            isNoPhoto: false,
        }
        return {
            ...defaultGlobalConfig,
            ...defaultOverviewConfig,
            resetConfig: () => set({ ...defaultOverviewConfig }),
            toggleDarkMode: () => set(() => ({ isDarkMode: !get().isDarkMode })),
            setLanguage: getSetter('language'),
            setAutoRefresh: getSetter('isAutoRefresh'),
            setAutoRefreshIntervalSeconds: getSetter('autoRefreshIntervalSeconds'),
            setPageSize: getSetter('pageSize'),
            setRecDanmu: getSetter('recDanmu'),
            setAutoRec: getSetter('autoRec'),
            setRemind: getSetter('remind'),
            setNoPhoto: getSetter('isNoPhoto'),
        }
    }, { name: 'settingsStorage' })
)
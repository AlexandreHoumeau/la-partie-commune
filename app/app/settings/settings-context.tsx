'use client'

import { Profile } from '@/lib/validators/profile'
import { SettingsData } from '@/lib/validators/settings'
import { createContext, useContext } from 'react'


const SettingsContext = createContext<SettingsData | null>(null)

export function SettingsProvider({
    children,
    data
}: {
    children: React.ReactNode
    data: SettingsData
}) {
    return (
        <SettingsContext.Provider value={data}>
            {children}
        </SettingsContext.Provider>
    )
}

export function useSettings() {
    const context = useContext(SettingsContext)
    if (!context) {
        throw new Error('useSettings must be used within SettingsProvider')
    }
    return context
}
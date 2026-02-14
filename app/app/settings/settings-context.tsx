'use client'

import { createContext, useContext } from 'react'

type SettingsData = {
    profile: {
        firstName: string
        lastName: string
        position: string
        email: string
        phone: string
    }
    agency: {
        name: string
        website: string
        phone: string
        email: string
        address: string
        description: string
        logo: string | null
        primaryColor: string
        team: Array<{
            name: string
            email: string
            role: string
        }>
    }
    ai: {
        context: string
        keyPoints: string
        tone: string
        additionalInstructions: string
    }
    tracking: {
        enabled: boolean
        trackOpens: boolean
        trackClicks: boolean
        utmSource: string
        utmMedium: string
        utmCampaign: string
    }
    billing: {
        plan: string
        amount: number
        nextPayment: string
        paymentMethod: {
            last4: string
            expiry: string
        }
        invoices: Array<{
            date: string
            amount: number
            status: string
        }>
    }
}

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
import { Profile } from "./profile"

export type SettingsData = {
    profile: Profile
    agency: {
        name: string
        website: string
        phone: string
        email: string
        address: string
        // description: string
        // logo: string | null
        // primaryColor: string
    }
    team: Array<{
        name: string
        email: string
        role: string
    }>
    ai: {
        context: string
        keyPoints: string
        tone: string
        additionalInstructions: string
    } | null
    tracking: {
        enabled: boolean
        trackOpens: boolean
        trackClicks: boolean
        utmSource: string
        utmMedium: string
        utmCampaign: string
    } | null
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
    } | null
}

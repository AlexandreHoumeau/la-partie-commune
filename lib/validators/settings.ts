import { Agency, InviteAgencyMemberInput } from "./agency"
import { Profile } from "./profile"

export type SettingsData = {
    profile: Profile
    invites?: InviteAgencyMemberInput[]
    agency: Agency,
    team: Array<{
        id: string
        first_name: string
        last_name: string
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

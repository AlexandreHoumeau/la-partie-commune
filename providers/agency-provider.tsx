"use client"

import { createContext, useContext } from "react"
import { AuthUserContext } from "@/lib/validators/definitions"

const AgencyContext = createContext<AuthUserContext | null>(null)

export function AgencyProvider({ 
    children, 
    initialData 
}: { 
    children: React.ReactNode, 
    initialData: AuthUserContext 
}) {
    return (
        <AgencyContext.Provider value={initialData}>
            {children}
        </AgencyContext.Provider>
    )
}

export const useAgency = () => {
    const context = useContext(AgencyContext)
    if (!context) throw new Error("useAgency must be used within AgencyProvider")
    return context
}
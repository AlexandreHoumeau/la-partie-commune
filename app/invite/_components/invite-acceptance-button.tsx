'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, ArrowRight } from "lucide-react"
import { acceptInvitation } from "@/actions/invite.server"
import { useRouter } from "next/navigation"
import { toast } from "sonner" // Ou votre système de toast

export default function InviteAcceptanceButton({ token }: { token: string }) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleAccept = async () => {
    setIsLoading(true)
    try {
      const result = await acceptInvitation(token)
      
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success("Bienvenue dans l'équipe !")
        router.push('/app') // Redirection vers le dashboard
      }
    } catch (err) {
      toast.error("Une erreur s'est produite.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button 
      onClick={handleAccept} 
      className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-md font-semibold group shadow-lg shadow-blue-200"
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <>
          Accepter et rejoindre
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </>
      )}
    </Button>
  )
}
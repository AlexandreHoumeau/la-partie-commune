"use client"
import { Button } from "@/components/ui/button";
import { OpportunityWithCompany } from "@/lib/validators/oppotunities"
import { ArrowLeftIcon } from 'lucide-react';

export default function OpportunityHeader({ opportunity }: { opportunity: OpportunityWithCompany }) {
  return (
    <div className="flex items-center justify-start bg-white p-6">
      <Button variant="ghost" className="p-0 mr-2" onClick={() => window.history.back()}>
        <ArrowLeftIcon className=" text-gray-500 cursor-pointer" />
      </Button>
      <div>
        <h1 className="text-xl font-semibold">{opportunity.company?.name}</h1>
        <p className="text-sm text-gray-500">{opportunity.company?.business_sector}</p>
      </div>
    </div>
  )
}

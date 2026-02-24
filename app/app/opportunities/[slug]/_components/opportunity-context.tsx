"use client";

import { createContext, useContext } from "react";
import { OpportunityWithCompany } from "@/lib/validators/oppotunities";

const OpportunityContext = createContext<OpportunityWithCompany | null>(null);

export function OpportunityProvider({
  opportunity,
  children,
}: {
  opportunity: OpportunityWithCompany;
  children: React.ReactNode;
}) {
  return (
    <OpportunityContext.Provider value={opportunity}>
      {children}
    </OpportunityContext.Provider>
  );
}

export function useOpportunity(): OpportunityWithCompany {
  const ctx = useContext(OpportunityContext);
  if (!ctx) throw new Error("useOpportunity must be used within OpportunityProvider");
  return ctx;
}

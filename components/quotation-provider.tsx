"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import QuotationForm from "./quotation-form"

interface QuotationContextType {
  openQuotationForm: () => void
  closeQuotationForm: () => void
  isQuotationFormOpen: boolean
}

const QuotationContext = createContext<QuotationContextType | undefined>(undefined)

export function useQuotation() {
  const context = useContext(QuotationContext)
  if (!context) {
    throw new Error("useQuotation must be used within a QuotationProvider")
  }
  return context
} 

interface QuotationProviderProps {
  children: ReactNode
}

export function QuotationProvider({ children }: QuotationProviderProps) {
  const [isQuotationFormOpen, setIsQuotationFormOpen] = useState(false)

  const openQuotationForm = () => {
    setIsQuotationFormOpen(true)
    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden"
  }

  const closeQuotationForm = () => {
    setIsQuotationFormOpen(false)
    // Restore body scroll when modal is closed
    document.body.style.overflow = "unset"
  }

  return (
    <QuotationContext.Provider value={{ openQuotationForm, closeQuotationForm, isQuotationFormOpen }}>
      {children}
      <QuotationForm isOpen={isQuotationFormOpen} onClose={closeQuotationForm} />
    </QuotationContext.Provider>
  )
}

'use client'

import { useState } from 'react'
import { Button } from "@/app/ui/button"
import { Menu, X } from 'lucide-react'

interface HeaderProps {
  toggleSidebar: () => void
  selectedLLM: string
  setSelectedLLM: (llm: string) => void
}

export function Header({ toggleSidebar, selectedLLM, setSelectedLLM }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false)

  const llmOptions = [
    { value: 'openai', label: 'OpenAI' },
    { value: 'ollama', label: 'Ollama' },
    { value: 'bert', label: 'BERT' },
  ]

  return (
    <div>
      <header className="flex items-center justify-between p-4 border-b">
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
        <h1 className="text-xl font-bold">Delve</h1>
        <div></div>
      </header>
    </div>
    
    
  )
}

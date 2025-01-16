'use client'

import { useEffect, useState } from 'react'
import { Sidebar } from '@/app/ui/sidebar'
import { ChatArea } from '@/app/ui/chat-area'
import { Header } from '@/app/ui/header'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from "@/app/ui/button"
import { Alert, AlertDescription, AlertTitle } from '@/app/ui/alert'
import { CheckCircle2 } from 'lucide-react'

export default function Home() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [selectedLLM, setSelectedLLM] = useState('openai')
  const [isLoading, setIsLoading] = useState(true)
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

  const [user, setUser] = useState(null)
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setUser(session.user)
      } else {
        router.push('/auth')
      }
    }

    checkUser()

    if (searchParams.get('signup') === 'success') {
      setShowSuccessAlert(true)
      // Remove the query parameter
      window.history.replaceState({}, document.title, "/dashboard")
    }
    // Set a timeout to change isLoading after 5 seconds
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 3000)
      return () => clearTimeout(timer)
  }, [router, searchParams, supabase.auth])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth')
  }
  

  if (!user) return null

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        {showSuccessAlert && (
          <Alert className="mb-4 max-w-md">
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Success!</AlertTitle>
            <AlertDescription>
              Your email has been confirmed and your account is now active.
            </AlertDescription>
          </Alert>
        )}
        <h1 className="text-4xl font-bold mb-4">Welcome to your Dashboard</h1>
        <p className="mb-4">You are logged in as: {user.email}</p>
        <Button onClick={handleSignOut} variant="destructive">
          Sign out
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <Header 
        toggleSidebar={toggleSidebar}
        selectedLLM={selectedLLM}
        setSelectedLLM={setSelectedLLM}
      />
      <div className="flex flex-1 overflow-hidden">
        {isSidebarOpen && (
          <Sidebar 
            selectedConversation={selectedConversation}
            onSelectConversation={setSelectedConversation}
          />
        )}
        <ChatArea 
          selectedConversation={selectedConversation}
          selectedLLM={selectedLLM}
        />
      </div>
    </div>
  )
}

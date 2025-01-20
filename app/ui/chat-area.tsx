'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from "@/app/ui/button"
import { Input } from "@/app/ui/input"
import { ScrollArea } from "@/app/ui/scroll-area"
import { Send, Upload, Link } from 'lucide-react'

interface Message {
  id: number
  content: string
  sender: 'user' | 'bot'
}

interface ChatAreaProps {
  selectedConversation: string | null
  selectedLLM: string
  id: string
}


const backend = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api`
  : "http://localhost:8000/api";

const token = process.env.NEXT_PUBLIC_SUPABASE_ACCESS_TOKEN

export function ChatArea({ selectedConversation, selectedLLM, id }: ChatAreaProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async () => {

    if (inputValue.trim()) {
      const userMessage: Message = {
        id: Date.now(),
        content: inputValue,
        sender: 'user'
      }
      setMessages(prevMessages => [...prevMessages, userMessage])
      setInputValue('')
      setIsLoading(true)
      
      try {
        
        const response = await fetch(`${backend}/chat`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content: userMessage.content, user: id}),
        })

        if (!response.ok) {
          throw new Error('Failed to get response from server')
        }

        const data = await response.json()
        const botMessage: Message = {
          id: Date.now(),
          content: data.response,
          sender: 'bot'
        }
        setMessages(prevMessages => [...prevMessages, botMessage])
      } catch (error) {
        console.error('Error:', error)
        const errorMessage: Message = {
          id: Date.now(),
          content: 'Sorry, there was an error processing your request.',
          sender: 'bot'
        }
        setMessages(prevMessages => [...prevMessages, errorMessage])
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`p-2 rounded-lg max-w-[80%] ${
                  message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="p-2 rounded-lg bg-secondary">
                Thinking...
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={`Type perform checks to find whether MFA/RLS/PITR is enabled for you`}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            disabled={isLoading}
            className="flex-grow"
          />
          <Button onClick={handleSendMessage} disabled={isLoading}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

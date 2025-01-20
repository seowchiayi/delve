'use client';

import { useEffect, useState, Suspense } from 'react';
import { Sidebar } from '@/app/ui/sidebar';
import { ChatArea } from '@/app/ui/chat-area';
import { Header } from '@/app/ui/header';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from "@/app/ui/button";
import { Alert, AlertDescription, AlertTitle } from '@/app/ui/alert';
import { CheckCircle2 } from 'lucide-react';
import { User } from '@supabase/supabase-js';

function SearchParamsHandler() {
  const searchParams = useSearchParams();
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  useEffect(() => {
    if (searchParams.get('signup') === 'success') {
      setShowSuccessAlert(true);

      // Remove the query parameter
      window.history.replaceState({}, document.title, '/dashboard');
    }
  }, [searchParams]);

  if (showSuccessAlert) {
    return (
      <Alert className="mb-4 max-w-md">
        <CheckCircle2 className="h-4 w-4" />
        <AlertTitle>Success!</AlertTitle>
        <AlertDescription>
          Your email has been confirmed, and your account is now active.
        </AlertDescription>
      </Alert>
    );
  }

  return null;
}

export default function Home() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedLLM, setSelectedLLM] = useState('openai');
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const supabase = createClientComponentClient();
  const router = useRouter();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
      } else {
        router.push('/auth');
      }
    };

    checkUser();

    // Set loading state timeout
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [router, supabase.auth]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/auth');
  };

  if (!user) return null;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <Suspense fallback={<div>Loading...</div>}>
          <SearchParamsHandler />
        </Suspense>
        <h1 className="text-4xl font-bold mb-4">Welcome to your Dashboard</h1>
        <p className="mb-4">You are logged in as: {user.email}</p>
        <Button onClick={handleSignOut} variant="destructive">
          Sign out
        </Button>
      </div>
    );
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
          id={user?.id}
        />
      </div>
      <Suspense fallback={<div>Loading search parameters...</div>}>
        <SearchParamsHandler />
      </Suspense>
    </div>
  );
}
'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Chat, Message, PortfolioContent } from '../data/portfolio';

export type ThemeType = 'light' | 'dark' | 'system';

interface AppContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  resolvedTheme: 'light' | 'dark';
  sidebarExpanded: boolean;
  setSidebarExpanded: (expanded: boolean) => void;
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: (open: boolean) => void;
  rightSidebarExpanded: boolean;
  setRightSidebarExpanded: (expanded: boolean) => void;
  mobileRightSidebarOpen: boolean;
  setMobileRightSidebarOpen: (open: boolean) => void;
  settingsOpen: boolean;
  setSettingsOpen: (open: boolean) => void;

  portfolio: PortfolioContent;

  chats: Chat[];
  activeChatId: string | null;
  setActiveChatId: (id: string | null) => void;
  isGenerating: boolean;

  createNewChat: (initialMessage?: string) => Promise<void>;
  sendMessage: (chatId: string, content: string) => Promise<void>;
  editMessage: (chatId: string, messageId: string, newContent: string) => Promise<void>;
  deleteChat: (chatId: string) => Promise<void>;
  renameChat: (chatId: string, newTitle: string) => Promise<void>;
  clearChatHistory: () => Promise<void>;

  submitContact: (name: string, email: string, message: string) => Promise<boolean>;
  submitFeedback: (rating: number, thumbs: 'up' | 'down' | null, comment: string) => Promise<boolean>;

  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const EMPTY_PORTFOLIO: PortfolioContent = {
  profile: null,
  experience: [],
  projects: [],
  skills: [],
  education: [],
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();

  const visitorIdRef = useRef<string>('');


  const [theme, setThemeState] = useState<ThemeType>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  const [sidebarExpanded, setSidebarExpanded] = useState<boolean>(true);
  const [mobileSidebarOpen, setMobileSidebarOpenState] = useState<boolean>(false);
  const [rightSidebarExpanded, setRightSidebarExpanded] = useState<boolean>(true);
  const [mobileRightSidebarOpen, setMobileRightSidebarOpenState] = useState<boolean>(false);
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);

  // On mobile, opening one drawer closes the other so they never overlap
  const setMobileSidebarOpen = (open: boolean) => {
    setMobileSidebarOpenState(open);
    if (open) setMobileRightSidebarOpenState(false);
  };

  const setMobileRightSidebarOpen = (open: boolean) => {
    setMobileRightSidebarOpenState(open);
    if (open) setMobileSidebarOpenState(false);
  };

  const [portfolio, setPortfolio] = useState<PortfolioContent>(EMPTY_PORTFOLIO);

  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
  };

  const hideToast = () => {
    setToast(null);
  };

  useEffect(() => {
    let visitorId = localStorage.getItem('visitorId');
    if (!visitorId) {
      visitorId = crypto.randomUUID();
      localStorage.setItem('visitorId', visitorId);
    }
    visitorIdRef.current = visitorId;

    fetch('/api/portfolio')
      .then((res) => res.json())
      .then((json) => {
        if (json.error) throw new Error(json.error);
        setPortfolio(json);
      })
      .catch((err) => {
        console.error(err);
        showToast('Failed to load portfolio data.', 'error');
      });

    fetch(`/api/chats?visitorId=${visitorId}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.error) throw new Error(json.error);
        const fetchedChats: Chat[] = json.data ?? [];
        setChats(fetchedChats);
        setActiveChatId(fetchedChats.length > 0 ? fetchedChats[0].id : null);
      })
      .catch((err) => {
        console.error(err);
        showToast('Failed to load chat history.', 'error');
      });
  }, []);


  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Theme is a device preference, not portfolio data — still lives in localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as ThemeType | null;
    if (savedTheme) setThemeState(savedTheme);
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const updateTheme = () => {
      let result: 'light' | 'dark' = 'light';
      if (theme === 'dark') {
        result = 'dark';
      } else if (theme === 'light') {
        result = 'light';
      } else {
        result = mediaQuery.matches ? 'dark' : 'light';
      }

      setResolvedTheme(result);
      if (result === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    updateTheme();

    if (theme === 'system') {
      mediaQuery.addEventListener('change', updateTheme);
      return () => mediaQuery.removeEventListener('change', updateTheme);
    }
  }, [theme]);

  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
  };

  const createNewChat = async (initialMessage?: string) => {
    const title = initialMessage
      ? (initialMessage.length > 25 ? initialMessage.substring(0, 25) + '...' : initialMessage)
      : undefined;

    try {
      const res = await fetch('/api/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, visitorId: visitorIdRef.current }),
      });
      const json = await res.json();
      if (json.error) throw new Error(json.error);

      const newChat: Chat = { ...json.data, messages: [] };
      setChats((prev) => [newChat, ...prev]);
      setActiveChatId(newChat.id);
      router.push('/');

      if (initialMessage) {
        await sendMessage(newChat.id, initialMessage);
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to create a new chat.', 'error');
    }
  };

  const sendMessage = async (chatId: string, content: string) => {
    if (!content.trim()) return;

    const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const optimisticUserMsg: Message = {
      id: tempId,
      chat_id: chatId,
      role: 'user',
      content,
      created_at: new Date().toISOString(),
    };

    let renamedTitle: string | null = null;
    setChats((prevChats) =>
      prevChats.map((c) => {
        if (c.id === chatId) {
          const updatedTitle = c.title === 'New Conversation'
            ? (content.length > 25 ? content.substring(0, 25) + '...' : content)
            : c.title;
          if (updatedTitle !== c.title) renamedTitle = updatedTitle;
          return { ...c, title: updatedTitle, messages: [...c.messages, optimisticUserMsg] };
        }
        return c;
      })
    );

    if (renamedTitle) {
      fetch(`/api/chats/${chatId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: renamedTitle, visitorId: visitorIdRef.current }),
      }).catch((err) => console.error(err));
    }

    setIsGenerating(true);

    try {
      const userRes = await fetch(`/api/chats/${chatId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'user', content }),
      });
      const userJson = await userRes.json();
      if (userJson.error) throw new Error(userJson.error);
      const savedUserMsg: Message = userJson.data;

      setChats((prevChats) =>
        prevChats.map((c) =>
          c.id === chatId
            ? { ...c, messages: c.messages.map((m) => (m.id === tempId ? savedUserMsg : m)) }
            : c
        )
      );

      const assistantRes = await fetch(`/api/chats/${chatId}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userMessage: content }),
      });
      const assistantJson = await assistantRes.json();
      if (assistantJson.error) throw new Error(assistantJson.error);
      const assistantMsg: Message = assistantJson.data;

      setChats((prevChats) =>
        prevChats.map((c) =>
          c.id === chatId ? { ...c, messages: [...c.messages, assistantMsg] } : c
        )
      );
    } catch (err) {
      console.error(err);
      showToast('Failed to send message. Please try again.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const editMessage = async (chatId: string, messageId: string, newContent: string) => {
    if (!newContent.trim()) return;

    try {
      const res = await fetch(`/api/chats/${chatId}/messages/${messageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newContent }),
      });
      const json = await res.json();
      if (json.error) throw new Error(json.error);

      // Locally: keep everything up to (and including) the edited message, with its new content
      setChats((prevChats) =>
        prevChats.map((c) => {
          if (c.id !== chatId) return c;
          const editedIndex = c.messages.findIndex((m) => m.id === messageId);
          if (editedIndex === -1) return c;
          const trimmedMessages = c.messages.slice(0, editedIndex + 1).map((m) =>
            m.id === messageId ? { ...m, content: newContent } : m
          );
          return { ...c, messages: trimmedMessages };
        })
      );

      setIsGenerating(true);

      const assistantRes = await fetch(`/api/chats/${chatId}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userMessage: newContent }),
      });
      const assistantJson = await assistantRes.json();
      if (assistantJson.error) throw new Error(assistantJson.error);
      const assistantMsg: Message = assistantJson.data;

      setChats((prevChats) =>
        prevChats.map((c) =>
          c.id === chatId ? { ...c, messages: [...c.messages, assistantMsg] } : c
        )
      );
    } catch (err) {
      console.error(err);
      showToast('Failed to edit message. Please try again.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };


  const deleteChat = async (chatId: string) => {
    try {
      const res = await fetch(`/api/chats/${chatId}?visitorId=${visitorIdRef.current}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.error) throw new Error(json.error);

      setChats((prev) => {
        const filtered = prev.filter((c) => c.id !== chatId);
        if (activeChatId === chatId) {
          setActiveChatId(filtered.length > 0 ? filtered[0].id : null);
        }
        return filtered;
      });
      showToast('Conversation deleted', 'info');
    } catch (err) {
      console.error(err);
      showToast('Failed to delete conversation.', 'error');
    }
  };

  const renameChat = async (chatId: string, newTitle: string) => {
    if (!newTitle.trim()) return;

    try {
      const res = await fetch(`/api/chats/${chatId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle, visitorId: visitorIdRef.current }),
      });
      const json = await res.json();
      if (json.error) throw new Error(json.error);

      setChats((prev) => prev.map((c) => (c.id === chatId ? { ...c, title: newTitle } : c)));
      showToast('Conversation renamed', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to rename conversation.', 'error');
    }
  };

  const clearChatHistory = async () => {
    try {
      const res = await fetch(`/api/chats?visitorId=${visitorIdRef.current}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.error) throw new Error(json.error);

      setChats([]);
      setActiveChatId(null);
      showToast('All conversations cleared', 'info');
    } catch (err) {
      console.error(err);
      showToast('Failed to clear conversations.', 'error');
    }
  };

  const submitContact = async (name: string, email: string, message: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });
      const json = await res.json();
      if (json.error) throw new Error(json.error);

      showToast('Message sent! Vinay will get back to you soon.', 'success');
      return true;
    } catch (err) {
      console.error(err);
      showToast('Failed to send your message. Please try again.', 'error');
      return false;
    }
  };

  const submitFeedback = async (rating: number, thumbs: 'up' | 'down' | null, comment: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, thumbs, comment }),
      });
      const json = await res.json();
      if (json.error) throw new Error(json.error);

      showToast('Thank you for your valuable feedback!', 'success');
      return true;
    } catch (err) {
      console.error(err);
      showToast('Failed to submit feedback. Please try again.', 'error');
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        resolvedTheme,
        sidebarExpanded,
        setSidebarExpanded,
        mobileSidebarOpen,
        setMobileSidebarOpen,
        rightSidebarExpanded,
        setRightSidebarExpanded,
        mobileRightSidebarOpen,
        setMobileRightSidebarOpen,
        settingsOpen,
        setSettingsOpen,
        portfolio,
        chats,
        activeChatId,
        setActiveChatId,
        isGenerating,
        createNewChat,
        sendMessage,
        editMessage,
        deleteChat,
        renameChat,
        clearChatHistory,
        submitContact,
        submitFeedback,
        toast,
        showToast,
        hideToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

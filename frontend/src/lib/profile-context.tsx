'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { api } from './api';
import { useAuth } from './auth-context';

interface ProfileContextValue {
  telegramChatId: string | null;
  telegramConnected: boolean;
  loading: boolean;
  refresh: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [telegramChatId, setTelegramChatId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) {
      setTelegramChatId(null);
      setLoading(false);
      return;
    }
    try {
      const p = await api.getUserProfile();
      setTelegramChatId(p.telegram_chat_id ?? null);
    } catch {
      // silencioso — não bloqueia a UI
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <ProfileContext.Provider
      value={{ telegramChatId, telegramConnected: !!telegramChatId, loading, refresh }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used within ProfileProvider');
  return ctx;
}

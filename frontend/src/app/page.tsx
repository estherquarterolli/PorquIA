'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const chatId = localStorage.getItem('chat_id');

    if (chatId) {
      api.setChatId(chatId);
    } else {
      const promptChatId = prompt('Digite seu ID do Telegram (chat_id):');
      if (promptChatId) {
        api.setChatId(promptChatId);
      }
    }

    router.push('/dashboard');
  }, [router]);

  return (
    <div className="flex-1 flex items-center justify-center">
      <p className="text-zinc-500">Redirecionando...</p>
    </div>
  );
}

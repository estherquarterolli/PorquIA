'use client';

import { Search, Bell } from 'lucide-react';

export function Header() {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between py-6 px-4 lg:px-10 gap-4">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Hi, Esther</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">Here is your financial summary</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 lg:gap-6">
        {/* Search */}
        <div className="relative flex-1 sm:flex-none">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full sm:w-48 lg:w-64 pl-10 pr-4 py-2.5 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-md border border-white/50 dark:border-white/10 rounded-full text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.2)] transition-all"
          />
        </div>

        {/* Notifications */}
        <button className="relative w-11 h-11 rounded-full bg-white/70 dark:bg-zinc-900/60 backdrop-blur-md border border-white/50 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-colors shrink-0">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-pink-500 rounded-full ring-2 ring-white dark:ring-zinc-900"></span>
        </button>

        {/* Avatar */}
        <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-white dark:border-zinc-800 shadow-[0_4px_12px_rgba(0,0,0,0.1)] cursor-pointer shrink-0">
          <img
            src="https://api.dicebear.com/7.x/notionists/svg?seed=Esther&backgroundColor=bfdbfe"
            alt="User Avatar"
            className="w-full h-full object-cover bg-blue-100"
          />
        </div>
      </div>
    </header>
  );
}

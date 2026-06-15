'use client';

import { Search, Bell } from 'lucide-react';

export function Header() {
  return (
    <header className="flex items-center justify-between py-6 px-10">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Hi, Esther</h1>
        <p className="text-sm text-gray-500 font-medium mt-1">Here is your financial summary</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 bg-white border border-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm w-48 lg:w-64 transition-all"
          />
        </div>

        {/* Notifications */}
        <button className="relative w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-500 hover:text-blue-600 shadow-sm transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
        </button>

        {/* Avatar */}
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm cursor-pointer">
          <img
            src="https://api.dicebear.com/7.x/notionists/svg?seed=Esther&backgroundColor=bfdbfe"
            alt="User Avatar"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );
}

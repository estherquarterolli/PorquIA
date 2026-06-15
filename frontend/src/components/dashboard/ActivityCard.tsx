'use client';

export function ActivityCard() {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-50 flex flex-col justify-between h-full group hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-900 font-bold text-lg">Activity</h3>
        <button className="text-gray-400 hover:text-gray-600">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
          </svg>
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center relative min-h-[120px]">
        {/* Large Blue Circle */}
        <div className="absolute w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center border-4 border-white shadow-sm z-10 -ml-12">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-inner">
            55%
          </div>
        </div>
        
        {/* Medium Pink Circle */}
        <div className="absolute w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center border-4 border-white shadow-sm z-20 top-2 right-4">
          <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-inner">
            30%
          </div>
        </div>

        {/* Small Yellow Circle */}
        <div className="absolute w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center border-4 border-white shadow-sm z-30 bottom-0 right-12">
          <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-white font-bold text-[10px] shadow-inner">
            15%
          </div>
        </div>
      </div>
      
      <div className="flex justify-center gap-4 mt-6">
         <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            <span className="text-xs text-gray-500 font-medium">Daily</span>
         </div>
         <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-pink-500"></span>
            <span className="text-xs text-gray-500 font-medium">Weekly</span>
         </div>
         <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
            <span className="text-xs text-gray-500 font-medium">Monthly</span>
         </div>
      </div>
    </div>
  );
}

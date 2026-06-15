'use client';

export function GoalsCard() {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-50 flex flex-col justify-between h-full group hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-gray-900 font-bold text-lg">Goals</h3>
        <button className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-blue-600 hover:bg-blue-50 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      <div className="space-y-6">
        {/* Goal 1 */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Business Funding</span>
            <span className="text-sm font-bold text-gray-900">$20,000</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3">
            <div className="bg-blue-600 h-3 rounded-full" style={{ width: '80%' }}></div>
          </div>
          <div className="flex justify-between mt-1">
             <span className="text-xs text-gray-400">Achieved 80%</span>
             <span className="text-xs text-gray-400">Target $25,000</span>
          </div>
        </div>

        {/* Goal 2 */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Top Up Balance</span>
            <span className="text-sm font-bold text-gray-900">$7,000</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3">
            <div className="bg-pink-500 h-3 rounded-full" style={{ width: '70%' }}></div>
          </div>
          <div className="flex justify-between mt-1">
             <span className="text-xs text-gray-400">Achieved 70%</span>
             <span className="text-xs text-gray-400">Target $10,000</span>
          </div>
        </div>
      </div>
    </div>
  );
}

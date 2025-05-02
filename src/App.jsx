// App.jsx
import { useState } from 'react';
import MapView from './components/MapView';
import useBalloons from './useBalloons';

export default function App() {
  const { balloons, isLoading, error } = useBalloons();
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  // Calculate statistics for sidebar (if we had actual data)
  const stats = balloons ? {
    count: Object.keys(balloons).length,
    avgAltitude: "2,543 m",
    maxAltitude: "4,127 m",
    minAltitude: "1,205 m",
    predictionAccuracy: "92.4%"
  } : null;

  return (
    <div className="h-screen flex flex-col">
      <header className=" shadow-sm border-b border-gray-200">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
          <div className="w-full flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <h1 className="font-bold text-xl text-gray-800">WindBorne Reality Check</h1>
            </div>

            <div className="text-sm text-gray-500">
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin h-4 w-4 mr-2 text-sky-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Syncing data...
                </div>
              ) : (
                <span>Last updated: {new Date().toLocaleTimeString()}</span>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex justify-center items-center w-full h-full overflow-hidden">
        <div className="w-full h-full flex gap-6 px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex-1 min-w-0 h-full w-3/4" >
            {isLoading && (
              <div className="flex items-center justify-center h-full bg-white/60 backdrop-blur rounded-xl border border-gray-200">
                <div className="flex flex-col items-center p-8 text-gray-600">
                  <svg className="animate-spin h-10 w-10 mb-4 text-sky-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-lg font-medium">Loading balloons...</span>
                  <p className="text-sm text-gray-500 mt-2">Gathering real-time tracking data</p>
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-center justify-center h-full bg-white/60 backdrop-blur rounded-xl border border-red-200">
                <div className="flex flex-col items-center p-8 text-red-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-lg font-medium">Error loading balloons</span>
                  <p className="text-sm mt-2">Please check your connection and try again.</p>
                  <button className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-medium">
                    Retry
                  </button>
                </div>
              </div>
            )}

            {balloons && <MapView balloons={balloons} />}
          </div>

          {/* Collapsible sidebar */}
          <aside
            className={`${sidebarExpanded ? 'w-80' : 'w-12'} bg-white rounded-xl shadow-lg border border-gray-200 transition-all duration-300 ease-in-out flex flex-col`}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h2 className={`font-bold text-gray-800 ${sidebarExpanded ? 'block' : 'hidden'}`}>
                24h Summary
              </h2>
              <button
                onClick={() => setSidebarExpanded(!sidebarExpanded)}
                className="p-1 rounded-md hover:bg-gray-100 text-gray-500"
              >
                {sidebarExpanded ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            </div>

            {sidebarExpanded && stats && (
              <div className="p-4 flex-1 overflow-auto">
                <div className="space-y-6">
                  {/* Statistics cards */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-xs font-medium text-blue-600 mb-1">Active Balloons</p>
                      <p className="text-2xl font-bold text-blue-800">{stats.count}</p>
                    </div>
                    <div className="bg-emerald-50 rounded-lg p-3">
                      <p className="text-xs font-medium text-emerald-600 mb-1">Prediction Accuracy</p>
                      <p className="text-2xl font-bold text-emerald-800">{stats.predictionAccuracy}</p>
                    </div>
                  </div>

                  {/* Altitude stats */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Altitude Statistics</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">Average</span>
                        <span className="text-sm font-medium">{stats.avgAltitude}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">Maximum</span>
                        <span className="text-sm font-medium">{stats.maxAltitude}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">Minimum</span>
                        <span className="text-sm font-medium">{stats.minAltitude}</span>
                      </div>
                    </div>
                  </div>

                  {/* Forecast comparison */}
                  <div className="bg-sky-50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-sky-700 mb-3">Forecast vs. Reality</h3>
                    <div className="h-32 bg-white rounded border border-gray-200 flex items-center justify-center text-gray-400 text-sm">
                      Chart placeholder
                    </div>
                  </div>
                </div>
              </div>
            )}

            {sidebarExpanded && (
              <div className="p-4 border-t border-gray-100">
                <div className="px-3 py-2 bg-sky-100 rounded text-xs text-sky-800">
                  <p className="font-medium">Next update in <span className="font-bold">4:32</span></p>
                </div>
              </div>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}
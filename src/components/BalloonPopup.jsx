// BalloonPopup.jsx
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

export default function BalloonPopup({ id, fixes }) {
  const now = fixes.at(-1);
  
  // Calculate altitude change trend
  const altitudeTrend = fixes.length >= 2 
    ? (now.alt - fixes.at(-2).alt) > 0 ? 'rising' : 'falling'
    : 'stable';
  
  // Get trend color
  const trendColor = {
    rising: 'text-emerald-500',
    falling: 'text-rose-500',
    stable: 'text-gray-500'
  }[altitudeTrend];
  
  // Format altitude with units
  const formatAltitude = (alt) => `${alt.toFixed(0)} m`;
  
  return (
    <div className="bg-white/90 backdrop-blur shadow-lg p-4 rounded-lg w-72 border border-sky-100">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-sky-800">Balloon {id}</h3>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${trendColor === 'text-emerald-500' ? 'bg-emerald-100' : trendColor === 'text-rose-500' ? 'bg-rose-100' : 'bg-gray-100'}`}>
          <span className={trendColor}>{altitudeTrend.charAt(0).toUpperCase() + altitudeTrend.slice(1)}</span>
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-1 text-xs text-gray-600 mb-3">
        <div>
          <span className="font-medium">Location:</span><br/>
          {now.lat.toFixed(3)}°, {now.lon.toFixed(3)}°
        </div>
        <div>
          <span className="font-medium">Altitude:</span><br/>
          {formatAltitude(now.alt)}
        </div>
        <div className="col-span-2">
          <span className="font-medium">Timestamp:</span><br/>
          {new Date(now.t).toLocaleString()}
        </div>
      </div>
      
      <div className="mt-2 mb-1 text-xs font-medium text-gray-700">Altitude History</div>
      <ResponsiveContainer width="100%" height={60}>
        <LineChart data={fixes.map(f => ({ t: f.t, alt: f.alt }))}>
          <Line 
            type="monotone" 
            dataKey="alt" 
            stroke="#0ea5e9" 
            strokeWidth={2} 
            dot={false} 
            activeDot={{ r: 4, fill: "#0369a1" }}
          />
          <Tooltip 
            formatter={(value) => [formatAltitude(value), 'Altitude']}
            labelFormatter={(label) => new Date(label).toLocaleTimeString()}
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: '1px solid #e2e8f0',
              borderRadius: '4px'
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
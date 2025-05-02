// MapView.jsx
import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import BalloonPopup from './BalloonPopup';
import ReactDOMServer from 'react-dom/server';

export default function MapView({ balloons }) {
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const [activeBalloonsCount, setActiveBalloonsCount] = useState(0);

  // Initialize map
  useEffect(() => {
    if (mapRef.current) return; // Already initialized

    mapRef.current = new maplibregl.Map({
      container: 'map',
      style: 'https://demotiles.maplibre.org/style.json',
      center: [0, 0],
      zoom: 2,
      pitchWithRotate: true,
      attributionControl: false
    });

    // Add navigation controls with custom position
    mapRef.current.addControl(
      new maplibregl.NavigationControl({ showCompass: true, visualizePitch: true }),
      'bottom-right'
    );
    
    // Add attribution control
    mapRef.current.addControl(
      new maplibregl.AttributionControl({ compact: true }),
      'bottom-left'
    );
    
    // Add fullscreen control
    mapRef.current.addControl(
      new maplibregl.FullscreenControl(),
      'top-right'
    );

    // Add scale control
    mapRef.current.addControl(
      new maplibregl.ScaleControl({ maxWidth: 150, unit: 'metric' }),
      'bottom-left'
    );

    // Clean up function
    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  // Redraw markers whenever balloon data changes
  useEffect(() => {
    if (!mapRef.current || !balloons) return;

    // Remove previous markers
    mapRef.current._markers?.forEach(m => m.remove());
    mapRef.current._markers = [];

    let bounds = new maplibregl.LngLatBounds();
    let markersCount = 0;

    Object.entries(balloons).forEach(([id, fixes]) => {
      const latest = fixes.at(-1);
      if (!latest) return;

      markersCount++;
      bounds.extend([latest.lon, latest.lat]);

      // Create custom marker element
      const el = document.createElement('div');
      el.className = 'flex flex-col items-center';
      
      // Outer balloon shape
      const balloon = document.createElement('div');
      balloon.className = 'relative w-5 h-5 bg-sky-500 rounded-full shadow-md';
      
      // Inner pulsing effect
      const pulse = document.createElement('div');
      pulse.className = 'absolute inset-0 w-5 h-5 bg-sky-300 rounded-full animate-ping opacity-70';
      balloon.appendChild(pulse);
      
      // String from balloon
      const string = document.createElement('div');
      string.className = 'h-3 w-0.5 bg-gray-400';
      
      el.appendChild(balloon);
      el.appendChild(string);

      // Create popup content using BalloonPopup component
      const popupContent = document.createElement('div');
      popupContent.innerHTML = ReactDOMServer.renderToString(
        <BalloonPopup id={id} fixes={fixes} />
      );

      const marker = new maplibregl.Marker(el)
        .setLngLat([latest.lon, latest.lat])
        .setPopup(
          new maplibregl.Popup({ 
            offset: 25,
            closeButton: true,
            closeOnClick: false,
            maxWidth: '320px',
            className: 'balloon-popup'
          })
          .setDOMContent(popupContent)
        )
        .addTo(mapRef.current);

      mapRef.current._markers.push(marker);
    });

    // Set the count of active balloons
    setActiveBalloonsCount(markersCount);

    // Fit map to bounds if we have markers
    if (markersCount > 0) {
      mapRef.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 10,
        duration: 1000
      });
    }
  }, [balloons]);

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden shadow-lg border border-gray-200">
      <div id="map" className="w-full h-full" />
      
      {/* Balloon count indicator */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-2 rounded-lg shadow-md border border-gray-100 z-10">
        <span className="text-sm font-medium text-sky-800">
          Active Balloons: {activeBalloonsCount}
        </span>
      </div>
    </div>
  );
}

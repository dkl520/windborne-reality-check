import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import BalloonPopup from './BalloonPopup';

export default function MapView({ balloons }) {
  const mapRef = useRef(null);

  // 初始化地图
  useEffect(() => {
    mapRef.current = new maplibregl.Map({
      container: 'map',
      style: 'https://tiles.basemaps.cartocdn.com/gl/positron-gl-style/style.json',
      center: [0, 20],
      zoom: 2,
    });
  }, []);

  // 每次数据更新 → 重新绘制标记
  useEffect(() => {
    if (!mapRef.current || !balloons) return;

    // 清旧标记
    mapRef.current._markers?.forEach(m => m.remove());
    mapRef.current._markers = [];

    balloons.forEach((p, idx) => {
      const el = document.createElement('div');
      el.className = 'w-3 h-3 rounded-full bg-emerald-400 animate-ping';

      const marker = new maplibregl.Marker(el)
        .setLngLat([p.lon, p.lat])
        .setPopup(new maplibregl.Popup({ offset: 12 }).setDOMContent(
          BalloonPopup(idx, p)
        ))
        .addTo(mapRef.current);

      mapRef.current._markers.push(marker);
    });
  }, [balloons]);

  return <div id="map" className="h-full w-full rounded-2xl shadow-lg" />;
}

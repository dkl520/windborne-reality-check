import ReactDOMServer from 'react-dom/server';

export default function BalloonPopup(idx, p) {
  const body = (
    <div className="bg-white/80 backdrop-blur p-2 rounded-md w-60">
      <h3 className="font-semibold mb-1">Balloon #{idx}</h3>
      <p className="text-xs text-gray-600">
        Lat {p.lat.toFixed(2)}<br/>
        Lon {p.lon.toFixed(2)}<br/>
        Alt {p.alt.toFixed(1)} km
      </p>
    </div>
  );
  const div = document.createElement('div');
  div.innerHTML = ReactDOMServer.renderToString(body);
  return div;
}

export default async function getForecast(lat, lon, timestamp) {
    const iso = new Date(timestamp).toISOString();
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,pressure_msl,relativehumidity_2m,windspeed_10m&start_date=${iso.slice(0,10)}&end_date=${iso.slice(0,10)}`;
    const { hourly } = await fetch(url).then(r => r.json());
    const idx = hourly.time.indexOf(iso.slice(0,13)+':00');
    return {
      t: hourly.temperature_2m[idx],
      p: hourly.pressure_msl[idx],
      rh: hourly.relativehumidity_2m[idx],
      wind: hourly.windspeed_10m[idx],
    };
  }
  
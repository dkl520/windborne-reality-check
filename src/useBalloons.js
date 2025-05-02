import useSWR from 'swr';

const fetcher = url => fetch(url).then(r => r.text());

function cleanJson(raw) {
  const safe = raw
    .replace(/,[\s\r\n]*([}\]])/g, '$1') // 尾逗号
    .replace(/[^\x20-\x7E]+/g, '');      // 控制字符
  try { return JSON.parse(safe); } catch { return []; }
}

// 返回形如 [{lat, lon, alt}, …]
export default function useBalloons() {
  const { data, error } = useSWR(
    '/api/proxy?hours=00',          // 只拉最新 00.json
    url => fetch(url).then(r => r.json()),
    { refreshInterval: 120_000 }
  );

  if (error) return { balloons: null, isLoading: false, error };
  if (!data) return { balloons: null, isLoading: true, error: null };

  const list = cleanJson(data['00']).map(arr => ({
    lat: arr[0],
    lon: arr[1],
    alt: arr[2]      // km
  }));

  return { balloons: list, isLoading: false, error: null };
}

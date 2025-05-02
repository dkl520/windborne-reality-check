import useSWR from 'swr';

const fetcher = url => fetch(url).then(r => r.text());

function cleanJson(raw) {
  const safe = raw
    .replace(/,[\s\r\n]*([}\]])/g, '$1')   // remove trailing commas
    .replace(/[^\x20-\x7E]+/g, '');        // strip control chars
  try { return JSON.parse(safe); } catch { return []; }
}

export default function useBalloons() {
  const { data, error } = useSWR(
    () => {
      const h = [...Array(24).keys()]
        .map(n => String(n).padStart(2, '0'))
        .join(',');
      return `/api/proxy?hours=${h}`;      // see proxy idea below
    },
    fetcher,
    { refreshInterval: 120_000 }
  );

  if (error) return { balloons: null, isLoading: false, error };
  if (!data)  return { balloons: null, isLoading: true,  error: null };

  // data = { "00": rawText, "01": rawText, ... }
  const fixes = Object.values(data)
    .flatMap(cleanJson)
    .reduce((acc, f) => {
      (acc[f.id] ||= []).push(f);
      return acc;
    }, {});

  return { balloons: fixes, isLoading: false, error: null };
}

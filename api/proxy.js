export default async function handler(req, res) {
    try {
      const hours = (req.query.hours || '00').split(',');
      const out = {};
      
      await Promise.all(
        hours.map(async h => {
          try {
            const url = `https://a.windbornesystems.com/treasure/${h}.json`;
            const response = await fetch(url);
            
            if (!response.ok) {
              console.error(`Failed to fetch ${h}.json: ${response.status}`);
              out[h] = null;
              return;
            }
            
            const txt = await response.text();
            out[h] = txt;
          } catch (error) {
            console.error(`Error fetching ${h}.json:`, error);
            out[h] = null;
          }
        })
      );
  
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120');
      res.status(200).json(out);
    //   res.setHeader('Access-Control-Allow-Origin', '*');
    //   res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120');
    } catch (error) {
      console.error('Proxy handler error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
//  ❗文件路径：api/proxy.js
export default async function handler(req, res) {
    const hours = (req.query.hours || '00').split(',');
    const out = {};
    debugger
    await Promise.all(
      hours.map(async h => {
        const url = `https://a.windbornesystems.com/treasure/${h}.json`;
        const txt = await fetch(url).then(r => r.text());
        debugger
        out[h] = txt;
      })
    );
  
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(out);
  }
  
export default async function handler(req, res) {
  const { slug = [] } = req.query;
  const queryString = req.url.split('?')[1] ? '?' + req.url.split('?')[1] : '';
  const coingeckoPath = '/' + slug.join('/') + queryString;
  const apiUrl = `https://api.coingecko.com${coingeckoPath}`;

  try {
    const response = await fetch(apiUrl, {
      method: req.method,
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'application/json',
      },
    });
    const contentType = response.headers.get('content-type');
    res.statusCode = response.status;
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(data));
    } else {
      const text = await response.text();
      res.setHeader('Content-Type', contentType || 'text/plain');
      res.end(text);
    }
  } catch (error) {
    console.error('CoinGecko Proxy Error:', error);
    res.statusCode = 500;
    res.end(JSON.stringify({ error: 'Proxy error', detail: error.message }));
  }
} 
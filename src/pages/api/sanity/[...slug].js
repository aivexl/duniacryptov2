export default async function handler(req, res) {
  const { slug = [] } = req.query;
  
  // Get environment variables
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'qaofdbqx';
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
  const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-07-22';
  
  // Set cache headers for better performance
  res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300'); // 5 minutes cache
  
  // Handle different types of requests
  if (slug[0] === 'query') {
    // Handle GROQ queries
    const { query, params } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }
    
    // Build query string
    const queryParams = new URLSearchParams();
    queryParams.append('query', query);
    
    if (params) {
      try {
        const parsedParams = JSON.parse(params);
        queryParams.append('params', JSON.stringify(parsedParams));
      } catch (error) {
        console.error('Error parsing params:', error);
        return res.status(400).json({ error: 'Invalid params format' });
      }
    }
    
    const apiUrl = `https://${projectId}.apicdn.sanity.io/v${apiVersion}/data/query/${dataset}?${queryParams.toString()}`;
    
    console.log('Sanity API URL:', apiUrl);
    
    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=300',
        },
        // Add timeout to prevent hanging requests
        signal: AbortSignal.timeout(10000), // 10 seconds timeout
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Sanity API Error Response:', errorText);
        throw new Error(`Sanity API responded with status: ${response.status}`);
      }

      const data = await response.json();
      
      // Add ETag for better caching
      const etag = Buffer.from(JSON.stringify(data)).toString('base64');
      res.setHeader('ETag', etag);
      
      res.status(200).json(data);
    } catch (error) {
      console.error('Sanity API Error:', error);
      
      // If it's a timeout error, return a more specific message
      if (error.name === 'AbortError') {
        return res.status(408).json({ 
          error: 'Request timeout - Sanity API took too long to respond',
          details: error.message 
        });
      }
      
      res.status(500).json({ 
        error: 'Failed to fetch data from Sanity',
        details: error.message 
      });
    }
  } else {
    // Handle other Sanity API endpoints
    const queryString = req.url.split('?')[1] ? '?' + req.url.split('?')[1] : '';
    const sanityPath = '/' + slug.join('/') + queryString;
    const apiUrl = `https://${projectId}.apicdn.sanity.io/v${apiVersion}${sanityPath}`;
    
    try {
      const response = await fetch(apiUrl, {
        method: req.method,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=300',
          ...(req.headers.authorization && { 'Authorization': req.headers.authorization }),
        },
        ...(req.method !== 'GET' && { body: JSON.stringify(req.body) }),
        // Add timeout
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) {
        throw new Error(`Sanity API responded with status: ${response.status}`);
      }

      const data = await response.json();
      
      // Add ETag for better caching
      const etag = Buffer.from(JSON.stringify(data)).toString('base64');
      res.setHeader('ETag', etag);
      
      res.status(200).json(data);
    } catch (error) {
      console.error('Sanity API Error:', error);
      
      if (error.name === 'AbortError') {
        return res.status(408).json({ 
          error: 'Request timeout - Sanity API took too long to respond',
          details: error.message 
        });
      }
      
      res.status(500).json({ 
        error: 'Failed to fetch data from Sanity',
        details: error.message 
      });
    }
  }
} 
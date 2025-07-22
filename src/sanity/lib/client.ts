// Create a custom client that uses our API route
interface SanityClient {
  fetch: (query: string, params?: Record<string, unknown>) => Promise<unknown>;
}

const customClient: SanityClient = {
  fetch: async (query: string, params?: Record<string, unknown>) => {
    const queryParams = new URLSearchParams();
    queryParams.append('query', query);
    
    if (params) {
      queryParams.append('params', JSON.stringify(params));
    }
    
    const response = await fetch(`/api/sanity/query?${queryParams.toString()}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }
};

export const client = customClient;

import { createClient } from 'next-sanity';

// Server-side client (direct to Sanity API)
const serverClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'qaofdbqx',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-07-22',
  useCdn: true,
});

// Client-side client (uses our API route)
const clientClient = {
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

// Use server client for server-side rendering
export const client = typeof window === 'undefined' ? serverClient : clientClient as typeof serverClient;

import { urlFor } from '../sanity/lib/image'

export interface SanityArticle {
  _id: string
  title: string
  slug: string
  excerpt?: string
  content: string
  image?: {
    asset: {
      _ref: string
    }
    alt?: string
  }
  category: 'newsroom' | 'academy'
  source: string
  publishedAt: string
  featured: boolean
}

export interface SanityArticleWithImage extends SanityArticle {
  imageUrl?: string
}

// Fetch all articles
export async function getAllArticles() {
  try {
    const query = `
      *[_type == "article"] | order(publishedAt desc) {
        _id,
        title,
        slug,
        excerpt,
        content,
        image,
        category,
        source,
        publishedAt,
        featured
      }
    `;
    
    const result = await client.fetch(query);
    return result || [];
  } catch (error) {
    console.error('Error fetching all articles:', error);
    return [];
  }
}

// Fetch articles by category
export async function getArticlesByCategory(category: string) {
  try {
    const query = `
      *[_type == "article" && category == $category] | order(publishedAt desc) {
        _id,
        title,
        slug,
        excerpt,
        content,
        image,
        category,
        source,
        publishedAt,
        featured
      }
    `;
    
    const result = await client.fetch(query, { category });
    return result || [];
  } catch (error) {
    console.error(`Error fetching ${category} articles:`, error);
    return [];
  }
}

// Fetch featured articles for home page
export async function getFeaturedArticles(): Promise<SanityArticle[]> {
  return await client.fetch(`
    *[_type == "article" && featured == true] | order(publishedAt desc) {
      _id,
      title,
      slug,
      excerpt,
      content,
      image,
      category,
      source,
      publishedAt,
      featured
    }
  `)
}

// Fetch single article by slug
export async function getArticleBySlug(slug: string) {
  try {
    const query = `
      *[_type == "article" && slug.current == $slug][0] {
        _id,
        title,
        slug,
        excerpt,
        content,
        image,
        category,
        source,
        publishedAt,
        featured
      }
    `;
    
    const result = await client.fetch(query, { slug });
    return result;
  } catch (error) {
    console.error('Error fetching article by slug:', error);
    return null;
  }
}

// Add image URLs to articles
export function addImageUrls(articles: SanityArticle[]): SanityArticleWithImage[] {
  return articles.map(article => ({
    ...article,
    imageUrl: article.image ? urlFor(article.image).url() : '/Asset/duniacrypto.png'
  }))
}

// Get latest articles for each category
export async function getLatestArticles(limit: number = 5): Promise<{
  newsroom: SanityArticle[]
  academy: SanityArticle[]
}> {
  const [newsroom, academy] = await Promise.all([
    getArticlesByCategory('newsroom'),
    getArticlesByCategory('academy')
  ])

  return {
    newsroom: newsroom.slice(0, limit),
    academy: academy.slice(0, limit)
  }
} 
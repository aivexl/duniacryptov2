import { getArticleBySlug, addImageUrls, getAllArticles } from '../../../utils/sanity';
import { notFound } from 'next/navigation';
import ArticleDetailClient from '../../../components/ArticleDetailClient';

export default async function AcademyDetailPage({ params }: { params: { slug: string } }) {
  const article = await getArticleBySlug(params.slug);
  if (!article) return notFound();
  
  const [articleWithImage] = addImageUrls([article]);
  
  // Get related articles (same category, excluding current article)
  const allArticles = await getAllArticles();
  const relatedArticles = allArticles
    .filter(a => a._id !== article._id && a.category === 'academy')
    .slice(0, 6);
  
  const relatedArticlesWithImages = addImageUrls(relatedArticles);
  
  return <ArticleDetailClient article={articleWithImage} relatedArticles={relatedArticlesWithImages} />;
} 
import { Article } from "@/types/news";
import NewsCard from "./NewsCard";

interface CategorySectionProps {
  title: string;
  articles: Article[];
  viewMoreLink?: string;
}

const CategorySection = ({ title, articles, viewMoreLink = "#" }: CategorySectionProps) => {

  console.log(viewMoreLink,":",articles.length)
  return (
    <section className="py-8 border-t border-border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="section-title">{title}</h2>
        <a href={viewMoreLink} className="text-sm text-accent hover:underline font-medium">
          View More →
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {articles.slice(0, 4).map((article) => (
          <NewsCard key={article.id} article={article} size="medium" />
        ))}
      </div>
    </section>
  );
};

export default CategorySection;

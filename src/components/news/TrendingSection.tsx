import { TrendingUp } from "lucide-react";
import NewsCard, { NewsArticle } from "./NewsCard";

const trendingArticles: NewsArticle[] = [
  {
    id: "t1",
    title: "Breaking: Major Traffic Update for Chandigarh-Delhi Highway",
    image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&h=300&fit=crop",
    category: "Traffic",
    timeAgo: "30 min ago",
  },
  {
    id: "t2",
    title: "Punjab Kings Announce New Captain for IPL 2026 Season",
    image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400&h=300&fit=crop",
    category: "Sports",
    timeAgo: "1 hour ago",
  },
  {
    id: "t3",
    title: "Gold Prices Hit Record High: What Experts Predict Next",
    image: "https://images.unsplash.com/photo-1610375461246-83df859d849d?w=400&h=300&fit=crop",
    category: "Business",
    timeAgo: "1 hour ago",
  },
  {
    id: "t4",
    title: "New Metro Line Connecting Airport to City Center Approved",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=300&fit=crop",
    category: "Development",
    timeAgo: "2 hours ago",
  },
];

const TrendingSection = () => {
  return (
    <section className="py-8 border-t border-border">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <TrendingUp className="h-6 w-6 text-accent" />
          <h2 className="section-title border-l-0 pl-0">Trending Now</h2>
        </div>
        <a href="/trending" className="text-sm text-accent hover:underline font-medium">
          View All →
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {trendingArticles.map((article) => (
          <NewsCard key={article.id} article={article} size="medium" />
        ))}
      </div>
    </section>
  );
};

export default TrendingSection;

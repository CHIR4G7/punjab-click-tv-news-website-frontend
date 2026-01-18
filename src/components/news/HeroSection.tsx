import NewsCard, { NewsArticle } from "./NewsCard";

const heroArticle: NewsArticle = {
  id: "1",
  title: "Punjab Government Announces Major Infrastructure Development Project Worth ₹5,000 Crore",
  summary: "The state government has unveiled an ambitious plan to transform Punjab's infrastructure with new highways, smart cities, and industrial corridors that will create thousands of jobs.",
  image: "https://images.unsplash.com/photo-1590650516494-0c8e4a4dd67e?w=800&h=600&fit=crop",
  category: "Politics",
  timeAgo: "2 hours ago",
};

const sideArticles: NewsArticle[] = [
  {
    id: "2",
    title: "Chandigarh University Ranks Among Top 50 in Asia",
    summary: "Historic achievement for Punjab's premier institution",
    image: "https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=300&fit=crop",
    category: "Education",
    timeAgo: "3 hours ago",
  },
  {
    id: "3",
    title: "Farmers Celebrate Record Wheat Harvest This Season",
    summary: "Punjab farmers report highest yield in decade",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop",
    category: "Agriculture",
    timeAgo: "4 hours ago",
  },
  {
    id: "4",
    title: "IT Hub in Mohali Attracts Global Tech Giants",
    summary: "Major companies announce expansion plans",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop",
    category: "Technology",
    timeAgo: "5 hours ago",
  },
];

const HeroSection = () => {
  return (
    <section className="py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Hero Article */}
        <div className="lg:col-span-2">
          <NewsCard article={heroArticle} size="large" />
        </div>

        {/* Side Articles */}
        <div className="flex flex-col gap-4">
          {sideArticles.map((article) => (
            <NewsCard key={article.id} article={article} size="horizontal" />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import NewsCard from "./NewsCard";
import { Article, createFeedKey } from "@/types/news";


const HeroSection = ({articles}:{articles:Article[]}) => {
  

  return (
    <section className="py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Hero Article */}
        <div className="lg:col-span-2">
          <NewsCard article={articles[0]} size="large" />
        </div>

        {/* Side Articles */}
        <div className="flex flex-col gap-4">
          {articles.slice(1,4).map((article) => (
            <NewsCard key={article.id} article={article} size="horizontal" />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

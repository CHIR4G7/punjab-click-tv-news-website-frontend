import { TrendingUp } from "lucide-react";
import NewsCard, {  } from "./NewsCard";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchNews } from "@/store/news/reducers";
import { createFeedKey } from "@/types/news";


const TrendingSection = () => {
  const dispatch = useAppDispatch()
    const key = createFeedKey({
      mode: "public",
      category: "",
      region: "",
    });
  const feed = useAppSelector((state) => state.news.feeds[key]);
  const articlesById = useAppSelector((state)=>state.news.articlesByID)
  const trendingArticles = feed?.articleIDs?.map(id => articlesById[id])?.filter(Boolean) || [];

  useEffect(()=>{
    dispatch(fetchNews({
      mode:"public",
      category:"",
      region:""
    }))
  },[])

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

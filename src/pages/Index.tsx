import TopUtilityBar from "@/components/news/TopUtilityBar";
import MainNavigation from "@/components/news/MainNavigation";
import HeroSection from "@/components/news/HeroSection";
import TrendingSection from "@/components/news/TrendingSection";
import CategorySection from "@/components/news/CategorySection";
import Sidebar from "@/components/news/Sidebar";
import Footer from "@/components/news/Footer";
import {
  chandigarhNews,
  punjabNews,
  indiaNews,
  sportsNews,
} from "@/data/newsData";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createFeedKey } from "@/types/news";
import { useEffect } from "react";
import { fetchNews } from "@/store/news/reducers";

const Index = () => {
  const dispatch = useAppDispatch();
  const trendingKey = createFeedKey({
    mode: "public",
    category: "",
    region: "",
  });
  const chandigarhKey = createFeedKey({
    mode: "public",
    category: "",
    region: "Chandigarh",
  });
  const punjabKey = createFeedKey({
    mode: "public",
    category: "",
    region: "Chandigarh",
  });

  const sportsKey = createFeedKey({
    mode: "public",
    category: "Sports",
    region: "",
  });

  useEffect(() => {
    //Trending News
    dispatch(
      fetchNews({
        mode: "public",
        category: "",
        region: "",
      }),
    );

    //Chandigarh News
    dispatch(
      fetchNews({
        mode: "public",
        category: "",
        region: "Chandigarh",
      }),
    );

    //Punjab News
    dispatch(
      fetchNews({
        mode: "public",
        category: "",
        region: "Punjab",
      }),
    );

    //Sports News
    dispatch(
      fetchNews({
        mode: "public",
        category: "Sports",
        region: "",
      }),
    );
  }, []);
  const trendingFeed = useAppSelector((state) => state.news.feeds[trendingKey]);
  const chandigarhFeed = useAppSelector(
    (state) => state.news.feeds[chandigarhKey],
  );
  const punjabFeed = useAppSelector((state) => state.news.feeds[punjabKey]);
  const sportsFeed = useAppSelector((state)=>state.news.feeds[sportsKey])

  const articlesById = useAppSelector((state) => state.news.articlesByID);
  const articles =
    trendingFeed?.articleIDs?.map((id) => articlesById[id])?.filter(Boolean) ||
    [];

  const heroArticles = articles.slice(0, 4);
  const chandigarhNews =
    chandigarhFeed?.articleIDs.map((id) => articlesById[id])?.filter(Boolean) ||
    [];
  const punjabNews =
    punjabFeed?.articleIDs.map((id) => articlesById[id])?.filter(Boolean) || [];

  const sportsNews = sportsFeed?.articleIDs?.map((id)=>articlesById[id])?.filter(Boolean) || []

      const key = createFeedKey({
      mode: "public",
      category: "",
      region: "",
    });
  const feed = useAppSelector((state) => state.news.feeds[key]);
  const trendingArticles = feed?.articleIDs?.map(id => articlesById[id])?.filter(Boolean) || [];

  useEffect(()=>{
    dispatch(fetchNews({
      mode:"public",
      category:"",
      region:""
    }))
  },[])

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <TopUtilityBar />
      <MainNavigation />

      {/* Main Content */}
      <main className="flex-1">
        <div className="container py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-3">
              <HeroSection articles={heroArticles} />
              {/* <TrendingSection /> */}
              <CategorySection
              title="Trending News"
              articles={trendingArticles}
              viewMoreLink="/trending"
              />
              <CategorySection
                title="Chandigarh News"
                articles={chandigarhNews}
                viewMoreLink="/chandigarh"
              />
              <CategorySection
                title="Punjab News"
                articles={punjabNews}
                viewMoreLink="/punjab"
              />
              <CategorySection
                title="Sports"
                articles={sportsNews}
                viewMoreLink="/sports"
              />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-20">
                <Sidebar />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;

import TopUtilityBar from "@/components/news/TopUtilityBar";
import MainNavigation from "@/components/news/MainNavigation";
import HeroSection from "@/components/news/HeroSection";
import TrendingSection from "@/components/news/TrendingSection";
import CategorySection from "@/components/news/CategorySection";
import Sidebar from "@/components/news/Sidebar";
import Footer from "@/components/news/Footer";
import { chandigarhNews, punjabNews, indiaNews, sportsNews } from "@/data/newsData";

const Index = () => {
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
              <HeroSection />
              <TrendingSection />
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
                title="India News" 
                articles={indiaNews} 
                viewMoreLink="/india" 
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

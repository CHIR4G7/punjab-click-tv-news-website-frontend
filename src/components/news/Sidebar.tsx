import { TrendingUp, Eye, Newspaper } from "lucide-react";
import NewsCard from "./NewsCard";
import Ads from "../Advertisement/Ads";


const Sidebar = () => {
  return (
    <aside className="space-y-8">
      {/* Trending Headlines */}
      {/* <div className="surface-elevated rounded-sm p-5">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
          <TrendingUp className="h-5 w-5 text-accent" />
          <h3 className="font-headline font-semibold text-lg">Trending Headlines</h3>
        </div>
        <div>
          {trendingHeadlines.map((article, index) => (
            <div key={article.id} className="flex items-start gap-3 py-3 border-b border-border/50 last:border-0">
              <span className="text-2xl font-headline font-bold text-accent/30">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="flex-1">
                <NewsCard article={article} size="small" />
              </div>
            </div>
          ))}
        </div>
      </div> */}

      {/* Most Read */}
      {/* <div className="surface-elevated rounded-sm p-5">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
          <Eye className="h-5 w-5 text-accent" />
          <h3 className="font-headline font-semibold text-lg">Most Read</h3>
        </div>
        <div>
          {mostRead.map((article) => (
            <NewsCard key={article.id} article={article} size="small" />
          ))}
        </div>
      </div> */}

      {/* Ad Placeholder */}
      {/* <div className="border-2 border-dashed border-border rounded-sm p-8 flex flex-col items-center justify-center text-center min-h-[250px]">
        <Newspaper className="h-10 w-10 text-muted-foreground/30 mb-3" />
        <p className="text-sm text-muted-foreground">Advertisement Space</p>
        <p className="text-xs text-muted-foreground/60 mt-1">300 x 250</p>
      </div> */}
      <Ads/>
      <Ads/>

      {/* Second Ad Placeholder */}
      {/* <div className="border-2 border-dashed border-border rounded-sm p-8 flex flex-col items-center justify-center text-center min-h-[200px]">
        <Newspaper className="h-10 w-10 text-muted-foreground/30 mb-3" />
        <p className="text-sm text-muted-foreground">Advertisement Space</p>
        <p className="text-xs text-muted-foreground/60 mt-1">300 x 200</p>
      </div> */}
    </aside>
  );
};

export default Sidebar;

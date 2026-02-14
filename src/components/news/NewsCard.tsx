import { getTimeAgo } from "@/lib/utils";
import { Article } from "@/types/news";
import { Clock } from "lucide-react";



type CardSize = "large" | "medium" | "small" | "horizontal";

interface NewsCardProps {
  article: Article;
  size?: CardSize;
}

const getCategoryClass = (category: string) => {
  const categoryMap: Record<string, string> = {
    Politics: "category-politics",
    Sports: "category-sports",
    Business: "category-business",
    Crime: "category-crime",
    Technology: "category-tech",
  };
  return categoryMap[category] || "category-default";
};

const NewsCard = ({ article, size = "medium" }: NewsCardProps) => {
  if(!article){
    return
  }
  const { id,title, summary, coverPageImg, category,publishedAt} = article;

  if (size === "large") {
    return (
      <article className="news-card group cursor-pointer">
        <a href={`/news/${id}`} className="block">
          <div className="relative overflow-hidden">
            <img
              src={coverPageImg}
              alt={title}
              className="news-card-image h-64 md:h-80 transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/80 to-transparent p-6">
              <span className={`category-badge ${getCategoryClass(category)} mb-3`}>
                {category}
              </span>
              <h2 className="headline-xl text-primary-foreground mb-2">{title}</h2>
              {summary && (
                <p className="text-primary-foreground/80 text-sm line-clamp-2">{summary}</p>
              )}
              <div className="flex items-center gap-1.5 mt-3 text-primary-foreground/60 text-xs">
                <Clock className="h-3 w-3" />
                {/* <span>{timeAgo}</span> */}
              </div>
            </div>
          </div>
        </a>
      </article>
    );
  }

  if (size === "horizontal") {
    return (
      <article className="news-card group cursor-pointer">
        <a href={`/news/${id}`} className="flex gap-4">
          <div className="relative overflow-hidden flex-shrink-0 w-24 h-24 md:w-32 md:h-24 rounded-sm">
            <img
              src={coverPageImg}
              alt={title}
              className="news-card-image h-full transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="flex flex-col justify-center flex-1 min-w-0">
            <span className={`category-badge ${getCategoryClass(category)} mb-1.5 self-start text-[10px]`}>
              {category}
            </span>
            <h3 className="headline-sm line-clamp-2 group-hover:text-accent transition-colors">{title}</h3>
            <div className="flex items-center gap-1.5 mt-2 text-muted-foreground text-xs">
              <Clock className="h-3 w-3" />
              {getTimeAgo(publishedAt)}
            </div>
          </div>
        </a>
      </article>
    );
  }

  if (size === "small") {
    return (
      <article className="news-card group cursor-pointer py-3 border-b border-border last:border-0">
        <a href={`/news/${id}`} className="block">
          <span className={`category-badge ${getCategoryClass(category)} mb-1.5 text-[10px]`}>
            {category}
          </span>
          <h3 className="headline-sm line-clamp-2 group-hover:text-accent transition-colors">{title}</h3>
          <div className="flex items-center gap-1.5 mt-2 text-muted-foreground text-xs">
            <Clock className="h-3 w-3" />
            <span>3</span>
            {getTimeAgo(publishedAt)}
            {/* <span>{timeAgo}</span> */}
          </div>
        </a>
      </article>
    );
  }

  // Medium (default)
  return (
    <article className="news-card group cursor-pointer">
      <a href={`/news/${id}`} className="block">
        <div className="relative overflow-hidden rounded-sm">
          <img
            src={coverPageImg}
            alt={title}
            className="news-card-image h-40 md:h-48 transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="pt-3">
          <span className={`category-badge ${getCategoryClass(category)} mb-2`}>
            {category}
          </span>
          <h3 className="headline-md line-clamp-2 group-hover:text-accent transition-colors mt-1.5">
            {title}
          </h3>
          {summary && (
            <p className="body-text line-clamp-2 mt-2">{summary}</p>
          )}
          <div className="flex items-center gap-1.5 mt-2 text-muted-foreground text-xs">
            <Clock className="h-3 w-3" />
            {getTimeAgo(publishedAt)}
          </div>
        </div>
      </a>
    </article>
  );
};

export default NewsCard;

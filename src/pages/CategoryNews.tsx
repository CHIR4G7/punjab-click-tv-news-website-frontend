import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  Calendar,
  User,
  MapPin,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { makeApiRequest } from "@/lib/apis";
import { formatDate } from "@/lib/utils";
import TopUtilityBar from "@/components/news/TopUtilityBar";
import MainNavigation from "@/components/news/MainNavigation";
import { createFeedKey } from "@/types/news";
import { keyfinder } from "@/data/constants";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchNews } from "@/store/news/reducers";

interface NewsArticle {
  _id: string;
  title: string;
  summary: string;
  author: string;
  publishDate: string;
  category: string;
  region: string;
  coverImageUrl: string;
  views?: number;
  status: string;
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalArticles: number;
  hasNext: boolean;
  hasPrev: boolean;
}

const CategoryNews: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();

  // Valid pages/categories
  const validCategories = [
    "trending",
    "chandigarh",
    "punjab",
    "india",
    "world",
    "business",
    "sports",
    "technology",
    "health",
    "entertainment",
  ];

  // Redirect if invalid category
  if (!slug || !validCategories.includes(slug.toLowerCase())) {
    navigate("/404");
    return null;
  }

  const key = createFeedKey(keyfinder[slug]);
  useEffect(()=>{
     dispatch(fetchNews(keyfinder[slug]));
  },[key])
 

  const feed = useAppSelector((state) => state.news.feeds[key]);
  const articlesById = useAppSelector((state) => state.news.articlesByID);
    const articles =
    feed?.articleIDs?.map((id) => articlesById[id])?.filter(Boolean) ||
    [];

  // State management
  // const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [regionFilter, setRegionFilter] = useState("all");
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalArticles: 0,
    hasNext: false,
    hasPrev: false,
  });

  // Featured articles for hero section
  const [featuredArticles, setFeaturedArticles] = useState<NewsArticle[]>([]);
  const [currentFeatured, setCurrentFeatured] = useState(0);

  // Fetch articles
  // const fetchArticles = async (page = 1) => {
  //   try {
  //     setLoading(true);
  //     const queryParams = new URLSearchParams({
  //       category: slug,
  //       page: page.toString(),
  //       limit: "12",
  //       search: searchTerm,
  //       sortBy,
  //       region: regionFilter === "all" ? "" : regionFilter,
  //     });

  //     const response = await makeApiRequest<{
  //       articles: NewsArticle[];
  //       pagination: PaginationData;
  //     }>(`/api/v1/news/category?${queryParams}`);

  //     setArticles(response.data.articles);
  //     setPagination(response.data.pagination);

  //     // Get featured articles for this category
  //     if (page === 1) {
  //       const featuredResponse = await makeApiRequest<NewsArticle[]>(
  //         `/api/v1/news/featured?category=${slug}&limit=5`,
  //       );
  //       setFeaturedArticles(featuredResponse.data);
  //     }
  //   } catch (error: any) {
  //     toast({
  //       title: "Error",
  //       description: error.message || "Failed to fetch articles",
  //       variant: "destructive",
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchArticles();
  // }, [slug, searchTerm, sortBy, regionFilter]);

  // Auto-rotate featured articles
  useEffect(() => {
    if (featuredArticles.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentFeatured((prev) =>
        prev === featuredArticles.length - 1 ? 0 : prev + 1,
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [featuredArticles.length]);

  // Handle pagination
  const handlePageChange = (page: number) => {
    // fetchArticles(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Format category name for display
  const formatCategoryName = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  // Regions for filter
  const regions = [
    "all",
    "amritsar",
    "ludhiana",
    "jalandhar",
    "patiala",
    "bathinda",
    "mohali",
    "chandigarh",
    "gurdaspur",
    "hoshiarpur",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      {/* <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-xl font-bold text-blue-600">
              Punjab Click TV
            </Link>
            <nav className="hidden md:flex space-x-6">
              {validCategories.slice(0, 6).map((category) => (
                <Link
                  key={category}
                  to={`/${category}`}
                  className={`text-sm font-medium transition-colors ${
                    category === slug 
                      ? 'text-blue-600 border-b-2 border-blue-600' 
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  {formatCategoryName(category)}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header> */}
      <TopUtilityBar />
      <MainNavigation />

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Top Advertisement */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="bg-gray-100 h-24 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
              <div className="text-center text-gray-500">
                <p className="font-medium">Advertisement</p>
                <p className="text-sm">728 x 90 - Leaderboard</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Featured Section */}
        {featuredArticles.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Featured in {formatCategoryName(slug)}
            </h2>
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative h-64 md:h-80">
                  <img
                    src={featuredArticles[currentFeatured].coverImageUrl}
                    alt={featuredArticles[currentFeatured].title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-blue-600">
                        {featuredArticles[currentFeatured].category}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-white border-white"
                      >
                        <MapPin className="h-3 w-3 mr-1" />
                        {featuredArticles[currentFeatured].region}
                      </Badge>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold mb-2 line-clamp-2">
                      {featuredArticles[currentFeatured].title}
                    </h3>
                    <p className="text-gray-300 mb-3 line-clamp-2">
                      {featuredArticles[currentFeatured].summary}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-300">
                      <span>By {featuredArticles[currentFeatured].author}</span>
                      <span>
                        {formatDate(
                          featuredArticles[currentFeatured].publishDate,
                        )}
                      </span>
                      {featuredArticles[currentFeatured].views && (
                        <span>
                          {featuredArticles[currentFeatured].views} views
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Featured Navigation */}
                  {featuredArticles.length > 1 && (
                    <>
                      <Button
                        onClick={() =>
                          setCurrentFeatured((prev) =>
                            prev === 0 ? featuredArticles.length - 1 : prev - 1,
                          )
                        }
                        variant="secondary"
                        size="sm"
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 opacity-70 hover:opacity-100"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() =>
                          setCurrentFeatured((prev) =>
                            prev === featuredArticles.length - 1 ? 0 : prev + 1,
                          )
                        }
                        variant="secondary"
                        size="sm"
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-70 hover:opacity-100"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>

                      {/* Dots indicator */}
                      <div className="absolute bottom-20 right-6 flex space-x-2">
                        {featuredArticles.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentFeatured(index)}
                            className={`w-2 h-2 rounded-full transition-all ${
                              index === currentFeatured
                                ? "bg-white scale-110"
                                : "bg-white bg-opacity-50 hover:bg-opacity-75"
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-8">
            {/* Page Title and Filters */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {formatCategoryName(slug)} News
              </h1>

              {/* Filters */}

              {/* Results info */}
              {/* <div className="text-sm text-gray-600">
                {pagination.totalArticles > 0 && (
                  <p>
                    Showing {((pagination.currentPage - 1) * 12) + 1} - {Math.min(pagination.currentPage * 12, pagination.totalArticles)} of {pagination.totalArticles} articles
                  </p>
                )}
              </div> */}
            </div>

            {/* Articles Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-0">
                      <div className="h-48 bg-gray-200"></div>
                      <div className="p-4 space-y-3">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : articles.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No articles found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search or filter criteria.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article) => (
                  <Link key={article.id} to={`/news/${article.id}`}>
                    <Card className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                      <CardContent className="p-0">
                        <div className="relative overflow-hidden">
                          <img
                            src={article.coverPageImg}
                            alt={article.title}
                            className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                          />
                          <div className="absolute top-3 left-3 flex gap-2">
                            <Badge className="bg-blue-600 text-white">
                              {article.category}
                            </Badge>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                            {article.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {article.summary}
                          </p>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              <span>{article.source}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDate(article.publishedAt)}</span>
                            </div>
                          </div>
                          {/* {(article.views || article.region) && (
                            <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                              {article.region && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  <span>{article.region}</span>
                                </div>
                              )}
                              {article.views && (
                                <div className="flex items-center gap-1">
                                  <Eye className="h-3 w-3" />
                                  <span>{article.views}</span>
                                </div>
                              )}
                            </div>
                          )} */}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center mt-8 space-x-2">
                <Button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrev}
                  variant="outline"
                  size="sm"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                  const pageNum = Math.max(1, pagination.currentPage - 2) + i;
                  if (pageNum > pagination.totalPages) return null;

                  return (
                    <Button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      variant={
                        pageNum === pagination.currentPage
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                    >
                      {pageNum}
                    </Button>
                  );
                })}

                <Button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNext}
                  variant="outline"
                  size="sm"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Advertisement Block 1 */}
            <Card>
              <CardContent className="p-4">
                <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                  <div className="text-center text-gray-500">
                    <p className="font-medium">Advertisement</p>
                    <p className="text-sm">300 x 250 - Rectangle</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trending Topics */}
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Trending Topics
                </h3>
                <div className="space-y-2">
                  {[
                    "Politics",
                    "Sports",
                    "Technology",
                    "Health",
                    "Entertainment",
                  ].map((topic) => (
                    <Link
                      key={topic}
                      to={`/${topic.toLowerCase()}`}
                      className="block p-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-sm font-medium text-gray-700 hover:text-blue-600">
                        #{topic}
                      </span>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Advertisement Block 2 */}
            <Card>
              <CardContent className="p-4">
                <div className="bg-gray-100 h-48 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                  <div className="text-center text-gray-500">
                    <p className="font-medium">Advertisement</p>
                    <p className="text-sm">300 x 200 - Medium Rectangle</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Popular Articles */}
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Popular This Week
                </h3>
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((item) => (
                    <div
                      key={item}
                      className="flex gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                    >
                      <div className="w-16 h-12 bg-gray-200 rounded flex-shrink-0"></div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                          Popular news headline goes here
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          2 hours ago
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Advertisement Block 3 */}
            <Card>
              <CardContent className="p-4">
                <div className="bg-gray-100 h-32 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                  <div className="text-center text-gray-500">
                    <p className="font-medium">Advertisement</p>
                    <p className="text-sm">300 x 100 - Banner</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryNews;

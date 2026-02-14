import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Calendar,
  User,
  MapPin,
  Share2,
  Facebook,
  Twitter,
  MessageCircle,
  Eye,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  X,
  ZoomIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast, useToast } from "@/hooks/use-toast";
import { makeApiRequest } from "@/lib/apis";
import TopUtilityBar from "@/components/news/TopUtilityBar";
import MainNavigation from "@/components/news/MainNavigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getArticle } from "@/store/news/reducers";

interface NewsArticle {
  _id: string;
  title: string;
  content: string;
  author: string;
  publishDate: string;
  status: string;
  category: string;
  coverImageUrl: string;
  imageUrls: string[];
  summary: string;
  region: string;
  views?: number;
}

interface RelatedNews {
  _id: string;
  title: string;
  summary: string;
  coverImageUrl: string;
  publishDate: string;
  category: string;
}

const NewsDisplay: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const articlesById = useAppSelector((state) => state.news.articlesByID);
  const displayArticle = useAppSelector((state) => state.news.selectedArticle);
  const loading = useAppSelector((state) => state.news.editor.saving);

  // ✅ Move ALL useState hooks to the top, before any conditional logic
  const [relatedNews, setRelatedNews] = useState<RelatedNews[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [fullscreenIndex, setFullscreenIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // ✅ All useEffect hooks must also be before conditional returns
  useEffect(() => {
    if (id && !articlesById[id]) {
      dispatch(getArticle({ id }));
    }
  }, [id, articlesById, dispatch]);

  // ✅ Get the article from either source with proper fallback
  const article = displayArticle || (id ? articlesById[id] : null);

  // Auto-play slider effect
  useEffect(() => {
    if (!isPlaying || !article?.imageUrls?.length) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === article.imageUrls.length - 1 ? 0 : prev + 1,
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [isPlaying, article?.imageUrls?.length]);

  // ✅ All functions should be defined before conditional returns
  const shareArticle = (platform: string) => {
    const url = window.location.href;
    const title = article?.title || "";

    let shareUrl = "";
    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
        break;
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`;
        break;
      default:
        navigator.clipboard.writeText(url);
        toast({
          title: "Success",
          description: "Link copied to clipboard",
        });
        return;
    }

    window.open(shareUrl, "_blank", "width=600,height=400");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isVideoUrl = (url: string): boolean => {
    return (
      url.includes("/video/") ||
      url.match(/\.(mp4|webm|ogg|mov|avi)$/i) !== null
    );
  };

  const nextSlide = () => {
    if (!article?.imageUrls?.length) return;
    setCurrentSlide((prev) =>
      prev === article.imageUrls.length - 1 ? 0 : prev + 1,
    );
  };

  const prevSlide = () => {
    if (!article?.imageUrls?.length) return;
    setCurrentSlide((prev) =>
      prev === 0 ? article.imageUrls.length - 1 : prev - 1,
    );
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const openFullscreen = (index: number) => {
    setFullscreenIndex(index);
    setShowFullscreen(true);
  };

  const closeFullscreen = () => {
    setShowFullscreen(false);
  };

  const nextFullscreen = () => {
    if (!article?.imageUrls?.length) return;
    setFullscreenIndex((prev) =>
      prev === article.imageUrls.length - 1 ? 0 : prev + 1,
    );
  };

  const prevFullscreen = () => {
    if (!article?.imageUrls?.length) return;
    setFullscreenIndex((prev) =>
      prev === 0 ? article.imageUrls.length - 1 : prev - 1,
    );
  };

  // Media Slider Component
  const MediaSlider = ({ imageUrls }: { imageUrls: string[] }) => {
    if (!imageUrls || imageUrls.length === 0) return null;

    return (
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Media Gallery</h3>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setIsPlaying(!isPlaying)}
              variant="outline"
              size="sm"
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              {isPlaying ? "Pause" : "Play"}
            </Button>
            <span className="text-sm text-gray-600">
              {currentSlide + 1} / {imageUrls.length}
            </span>
          </div>
        </div>

        {/* Main Slider */}
        <div className="relative bg-black rounded-lg overflow-hidden">
          <div className="relative h-96 md:h-[500px]">
            {/* Current Media */}
            <div className="absolute inset-0">
              {isVideoUrl(imageUrls[currentSlide]) ? (
                <video
                  src={imageUrls[currentSlide]}
                  controls
                  className="w-full h-full object-contain"
                  key={currentSlide}
                />
              ) : (
                <div className="relative w-full h-full group">
                  <img
                    src={imageUrls[currentSlide]}
                    alt={`Media ${currentSlide + 1}`}
                    className="w-full h-full object-contain cursor-pointer"
                    onClick={() => openFullscreen(currentSlide)}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                    <Button
                      onClick={() => openFullscreen(currentSlide)}
                      variant="secondary"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ZoomIn className="h-4 w-4 mr-2" />
                      View Full Size
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Arrows */}
            {imageUrls.length > 1 && (
              <>
                <Button
                  onClick={prevSlide}
                  variant="secondary"
                  size="sm"
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 opacity-70 hover:opacity-100"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  onClick={nextSlide}
                  variant="secondary"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 opacity-70 hover:opacity-100"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>

          {/* Dots Indicator */}
          {imageUrls.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {imageUrls.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentSlide
                      ? "bg-white scale-110"
                      : "bg-white bg-opacity-50 hover:bg-opacity-75"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Thumbnail Strip */}
        {imageUrls.length > 1 && (
          <div className="mt-4">
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {imageUrls.map((url, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    index === currentSlide
                      ? "border-blue-500 scale-105"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {isVideoUrl(url) ? (
                    <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                      <Play className="h-4 w-4 text-white" />
                    </div>
                  ) : (
                    <img
                      src={url}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Fullscreen Modal
  const FullscreenModal = () => {
    if (!showFullscreen || !article?.imageUrls?.length) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Close Button */}
          <Button
            onClick={closeFullscreen}
            variant="secondary"
            size="sm"
            className="absolute top-4 right-4 z-10"
          >
            <X className="h-4 w-4" />
          </Button>

          {/* Navigation */}
          {article.imageUrls.length > 1 && (
            <>
              <Button
                onClick={prevFullscreen}
                variant="secondary"
                size="sm"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                onClick={nextFullscreen}
                variant="secondary"
                size="sm"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}

          {/* Media Content */}
          <div className="max-w-full max-h-full p-8">
            {isVideoUrl(article.imageUrls[fullscreenIndex]) ? (
              <video
                src={article.imageUrls[fullscreenIndex]}
                controls
                className="max-w-full max-h-full"
                autoPlay
              />
            ) : (
              <img
                src={article.imageUrls[fullscreenIndex]}
                alt={`Fullscreen ${fullscreenIndex + 1}`}
                className="max-w-full max-h-full object-contain"
              />
            )}
          </div>

          {/* Counter */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded">
            {fullscreenIndex + 1} / {article.imageUrls.length}
          </div>
        </div>
      </div>
    );
  };

  // ✅ NOW handle conditional returns AFTER all hooks are declared
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-300 rounded w-3/4"></div>
            <div className="h-64 bg-gray-300 rounded"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!id || (!displayArticle && !articlesById[id])) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Article Not Found
          </h1>
          <p className="text-gray-600 mb-4">
            The article you're looking for doesn't exist.
          </p>
          <Link to="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Loading Article...
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header/Navigation */}
      <TopUtilityBar />
      <MainNavigation />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8">
            {/* Article Header */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              {/* Category & Region */}
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="default" className="bg-blue-600">
                  {article.category}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {article.region}
                </Badge>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {article.title}
              </h1>

              {/* Summary */}
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                {article.summary}
              </p>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>By {article.source}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(article.publishedAt || article.createdAt)}</span>
                </div>
              </div>

              <MediaSlider imageUrls={article.imageUrls || []} />

              {/* Share Buttons */}
              <div className="flex items-center gap-2 mb-6 pb-6 border-b">
                <span className="text-sm font-medium text-gray-600">
                  Share:
                </span>
                <Button
                  onClick={() => shareArticle("facebook")}
                  variant="outline"
                  size="sm"
                  className="text-blue-600"
                >
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => shareArticle("twitter")}
                  variant="outline"
                  size="sm"
                  className="text-blue-400"
                >
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => shareArticle("whatsapp")}
                  variant="outline"
                  size="sm"
                  className="text-green-600"
                >
                  <MessageCircle className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => shareArticle("copy")}
                  variant="outline"
                  size="sm"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Article Content */}
              <div
                className="prose prose-lg text-gray-800 leading-relaxed mb-8" 
                dangerouslySetInnerHTML={{ __html: article.content }}
                style={{ maxWidth: '800px' }}
              />
            </div>

            {/* Advertisement Block */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="bg-gray-100 h-32 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                  <div className="text-center text-gray-500">
                    <p className="font-medium">Advertisement</p>
                    <p className="text-sm">728 x 90</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Advertisement Block 1 */}
            <Card>
              <CardContent className="p-4">
                <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                  <div className="text-center text-gray-500">
                    <p className="font-medium">Advertisement</p>
                    <p className="text-sm">300 x 250</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Latest News Widget */}
            {/* <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Latest News
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
                          Sample news headline for latest news widget
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          2 hours ago
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card> */}

            {/* Advertisement Block 2 */}
            <Card>
              <CardContent className="p-4">
                <div className="bg-gray-100 h-48 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                  <div className="text-center text-gray-500">
                    <p className="font-medium">Advertisement</p>
                    <p className="text-sm">300 x 200</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Fullscreen Modal */}
      <FullscreenModal />
    </div>
  );
};

export default NewsDisplay;
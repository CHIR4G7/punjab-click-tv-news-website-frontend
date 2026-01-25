import React, { useState, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { makeApiRequest } from "@/lib/apis";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import DOMPurify from "dompurify";
import {
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { formatDate, uploadWithLimit, urlToFile } from "@/lib/utils";
import { NewsFormData, NewsArticle } from "@/types/admin";
import { createNewNewsDraft, fetchNews } from "@/store/news/reducers";
import { Article, createFeedKey } from "@/types/news";
import SideNewsBlock from "@/components/Card/SideNewsBlock";
import CreateNews from "@/components/Admin/CreateNews";
import EditNews from "@/components/Admin/EditNews";
import { clearSelectedArticle, setSelectedArticle } from "@/store/news/newsSlice";

const Admin: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const { toast } = useToast();
  const key = createFeedKey({
    mode: "public",
    category: "",
    region: "",
  });
  const feed = useAppSelector((state) => state.news.feeds[key]);
  const { editor } = useAppSelector((state) => state.news);
  console.log(editor.error)
  const articles = feed?.articles || [];
  const loading = feed?.loading || false;
  const error = feed?.error;
  const [cursor, setCursor] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  // const [selectedNews, setSelectedNews] = useState<NewsArticle | null>(null);
  const selectedNews = useAppSelector((state)=>state.news.selectedArticle)
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [articleContent, setArticleContent] = useState<string>("");

  const coverPageImgRef = useRef<HTMLInputElement>(null);
  const uploadMediaRef = useRef<HTMLInputElement>(null);

  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState<NewsFormData>({
    title: "",
    content: "",
    category: "",
    imageUrls: [],
    summary: "",
    region: "",
    coverPageImg: null,
  });

  useEffect(() => {
    dispatch(
      fetchNews({
        mode: "public",
        category: "",
        region: "",
        reset: true,
      }),
    );
  }, [cursor]);

  const handleCoverImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Error",
        description: "Please select an image file for cover image",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Cover image must be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    setFormData((prev) => ({ ...prev, coverPageImg: file }));
  };

  const handleMediaFilesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate files
    const validTypes = ["image/", "video/"];
    for (const file of files) {
      if (!validTypes.some((type) => file.type.startsWith(type))) {
        toast({
          title: "Error",
          description: "Please select only image or video files",
          variant: "destructive",
        });
        return;
      }
    }

    // Validate file sizes (max 10MB per file)
    for (const file of files) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "Error",
          description: `File ${file.name} is too large. Maximum size is 10MB`,
          variant: "destructive",
        });
        return;
      }
    }

    setFormData((prev) => ({
      ...prev,
      imageUrls: [...prev.imageUrls, ...files],
    }));
  };
  const removeCoverImage = () => {
    setFormData((prev) => ({ ...prev, coverPageImg: null }));
    if (coverPageImgRef.current) {
      coverPageImgRef.current.value = "";
    }
  };

  const removeMediaItem = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, index) => index !== indexToRemove),
    }));
  };

  const isVideoFile = (file: File): boolean => {
    return file.type.startsWith("video/");
  };


  useEffect(() => {
    const cleanDom = DOMPurify.sanitize(articleContent);
    setFormData((prev) => ({ ...prev, content: cleanDom }));
  }, [articleContent]);

  useEffect(() => {
    if (!formData.coverPageImg) return;

    const objectUrl = URL.createObjectURL(formData.coverPageImg);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [formData.coverPageImg]);

  // Handle logout
  const handleLogout = () => {
    dispatch(logout());
    navigate("/admin/login");
  };

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle form submission
  const handleSubmit = async (
    e: React.FormEvent,
    status: "published" | "draft" = "published",
  ) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: "Error",
        description: "Title and content are required",
        variant: "destructive",
      });
      return;
    }

    if (!formData.coverPageImg) {
      toast({
        title: "Error",
        description: "Cover Image is mandatory!",
        variant: "destructive",
      });
      return;
    }

    if (status === "draft") {
      try {
        setSubmitting(true);
        const [coverImgData, imageData] = await Promise.all([
          uploadWithLimit([formData.coverPageImg]),
          uploadWithLimit(formData.imageUrls),
        ]);

        const urls = imageData.map((img) => img.url);

        const payload = {
          title: formData.title,
          content: formData.content,
          summary: formData.summary,
          category: formData.category,
          region: formData.region,
          coverPageImg: coverImgData[0].url,
          imageUrls: urls,
        };
        console.log(payload);

        const res = await dispatch(createNewNewsDraft(payload));
        console.log(res);
        setSubmitting(false);
      } catch (error) {
        setSubmitting(false);
        toast({
          title: "Error",
          description: error.message || "Failed to upload images",
          variant: "destructive",
        });
        return;
      }
    }
  };

  // Handle news deletion
  const handleDelete = async (newsId: string) => {
    if (!confirm("Are you sure you want to delete this news article?")) return;

    try {
      await makeApiRequest(`/api/v1/news/${newsId}`, "DELETE");
      toast({
        title: "Success",
        description: "News deleted successfully",
      });
      // fetchNews();
      if (selectedNews?._id === newsId) {
        dispatch(clearSelectedArticle())
        setFormData({
          title: "",
          content: "",
          category: "",
          imageUrls: [],
          summary: "",
          region: "",
          coverPageImg: null,
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete news",
        variant: "destructive",
      });
    }
  };

  // Handle news selection for editing
  const handleEdit = async (newsItem: Article) =>{
    dispatch(setSelectedArticle(newsItem))
    console.log(newsItem)
    const convFile = await urlToFile(newsItem.coverPageImg)
    setFormData({
      title: newsItem.title,
      content: newsItem.content,
      category: newsItem.category || "",
      imageUrls: [],
      summary: newsItem.summary || "",
      region: newsItem.region || "",
      coverPageImg: convFile,
    });
    setArticleContent(newsItem.content || "")
    setSidebarOpen(false); // Close sidebar on mobile
  };

  // Handle new news creation
  const handleNewNews = () => {
    // setSelectedNews(null);
    dispatch(clearSelectedArticle())
    setFormData({
      title: "",
      content: "",
      category: "",
      imageUrls: [],
      summary: "",
      region: "",
      coverPageImg: null,
    });
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed md:static inset-y-0 left-0 z-50 w-80 bg-white shadow-lg transition-transform duration-300 ease-in-out h-screen flex flex-col`}
      >
        {/* Header - Fixed */}
        <div className="p-4 border-b bg-white flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              News Articles
            </h2>
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => setSidebarOpen(false)}
                variant="ghost"
                size="sm"
                className="md:hidden"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* News List - Scrollable */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-4">
              {loading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="p-3 border border-gray-200 rounded-lg animate-pulse"
                    >
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  ))}
                </div>
              ) : articles.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No news articles found.</p>
                  <p className="text-sm mt-1">Create your first article!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {articles.map((article, index) => {
                    return (
                      <SideNewsBlock
                        data={article}
                        key={index}
                        onEdit={handleEdit}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-0">
        {/* Top Navigation */}
        <div className="bg-white shadow-sm border-b">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-4">
                <Button
                  onClick={() => setSidebarOpen(true)}
                  variant="ghost"
                  size="sm"
                  className="md:hidden"
                >
                  <Menu className="h-5 w-5" />
                </Button>
                <h1 className="text-2xl font-bold text-gray-900">
                  Punjab Click TV Admin
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700 hidden sm:block">
                  Welcome, {user?.username || "Admin"}
                </span>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* News Form */}
        <div className="flex-1 overflow-y-auto">
          {selectedNews ?           <EditNews
          formData={formData}
          handleInputChange={handleInputChange}
          handleSelectChange={handleSelectChange}
          previewUrl={previewUrl}
          removeCoverImage={removeCoverImage}
          coverPageImgRef={coverPageImgRef}
          uploadingCover={uploadingCover}
          handleCoverImageSelect={handleCoverImageSelect}
          uploadMediaRef={uploadMediaRef}
          uploadingMedia={uploadingMedia}
          isVideoFile={isVideoFile}
          removeMediaItem={removeMediaItem}
          handleMediaFilesSelect={handleCoverImageSelect}
          submitting={submitting}
          articleContent={articleContent}
          setArticleContent={setArticleContent}
          handleSubmit={handleSubmit}
          handleNewNews={handleNewNews}
          coverImgData={selectedNews.coverPageImg}
          imageUrls={selectedNews.imageUrls}
          /> :           <CreateNews
          formData={formData}
          handleInputChange={handleInputChange}
          handleSelectChange={handleSelectChange}
          previewUrl={previewUrl}
          removeCoverImage={removeCoverImage}
          coverPageImgRef={coverPageImgRef}
          uploadingCover={uploadingCover}
          handleCoverImageSelect={handleCoverImageSelect}
          uploadMediaRef={uploadMediaRef}
          uploadingMedia={uploadingMedia}
          isVideoFile={isVideoFile}
          removeMediaItem={removeMediaItem}
          handleMediaFilesSelect={handleCoverImageSelect}
          submitting={submitting}
          articleContent={articleContent}
          setArticleContent={setArticleContent}
          handleSubmit={handleSubmit}
          />
          }
        </div>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Admin;

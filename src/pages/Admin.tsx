import React, { useState, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { makeApiRequest } from "@/lib/apis";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import DOMPurify from "dompurify";
import { LogOut, Menu, X } from "lucide-react";
import { uploadWithLimit, urlToFile } from "@/lib/utils";
import { NewsFormData } from "@/types/admin";
import { createNewNewsDraft, fetchNews, getNewsForAdmin } from "@/store/news/reducers";
import { Article, createFeedKey } from "@/types/news";
import SideNewsBlock from "@/components/Card/SideNewsBlock";
import CreateNews from "@/components/Admin/CreateNews";
import EditNews from "@/components/Admin/EditNews";
import {
  clearSelectedArticle,
  setSelectedArticle,
} from "@/store/news/newsSlice";
import { ColorRing } from "react-loader-spinner";

const Admin: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const { toast } = useToast();

  const keyDrafted = createFeedKey({
    mode: "drafted",
    category: "",
    region: "",
  });

  const keyPublished = createFeedKey({
    mode: "published",
    category: "",
    region: "",
  });

  // ✅ Add proper null checks and default values
  const feedDrafted = useAppSelector((state) => state.news.feeds[keyDrafted]) || {
    articleIDs: [],
    cursor: null,
    hasMore: true,
    loading: false,
    error: null,
  };

  const feedPublished = useAppSelector((state) => state.news.feeds[keyPublished]) || {
    articleIDs: [],
    cursor: null,
    hasMore: true,
    loading: false,
    error: null,
  };

  const articlesById = useAppSelector((state) => state.news.articlesByID);
  const { editor } = useAppSelector((state) => state.news);

  // ✅ Add proper null checks for articleIDs and filter out undefined articles
  const draftedArticles = feedDrafted?.articleIDs?.map((id) => articlesById[id])?.filter(Boolean) || [];
  const publishedArticles = feedPublished?.articleIDs?.map((id) => articlesById[id])?.filter(Boolean) || [];

  const loadingDrafted = feedDrafted?.loading || false;
  const errorDrafted = feedDrafted?.error;

  const loadingPublished = feedPublished?.loading || false;
  const errorPublished = feedPublished?.error;

  const [cursor, setCursor] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const selectedNews = useAppSelector((state) => state.news.selectedArticle);
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
      getNewsForAdmin({
        mode: "drafted",
        category: "",
        region: "",
        reset: false,
      }),
    );

    dispatch(
      getNewsForAdmin({
        mode: "published",
        category: "",
        region: "",
        reset: false,
      }),
    );
  }, [dispatch]); // ✅ Remove cursor from dependencies and add dispatch

  useEffect(() => {
    if (!editor.error) {
      return;
    }
    toast({
      title: "Error",
      description: editor.error,
      variant: "destructive",
    });
  }, [editor.error, toast]);

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
        
        // ✅ Reset form data after successful creation
        if (createNewNewsDraft.fulfilled.match(res)) {
          setFormData({
            title: "",
            content: "",
            category: "",
            imageUrls: [],
            summary: "",
            region: "",
            coverPageImg: null,
          });
          setArticleContent("");
          setPreviewUrl(null);
          
          toast({
            title: "Success",
            description: "News draft created successfully!",
          });
        } else {
          toast({
            title: "Error",
            description: res.payload as string || "Failed to create draft",
            variant: "destructive",
          });
        }
        
        setSubmitting(false);
      } catch (error: any) {
        setSubmitting(false);
        toast({
          title: "Error",
          description: error.message || "Failed to upload images",
          variant: "destructive",
        });
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
      
      if (selectedNews?.id === newsId) {
        dispatch(clearSelectedArticle());
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
  const handleEdit = async (newsItem: Article) => {
    dispatch(setSelectedArticle(newsItem));
    console.log(newsItem);
    
    try {
      const convFile = await urlToFile(newsItem.coverPageImg);
      setFormData({
        title: newsItem.title,
        content: newsItem.content,
        category: newsItem.category || "",
        imageUrls: [],
        summary: newsItem.summary || "",
        region: newsItem.region || "",
        coverPageImg: convFile,
      });
      setArticleContent(newsItem.content || "");
    } catch (error) {
      console.error("Error converting URL to file:", error);
      // Fallback without cover image file
      setFormData({
        title: newsItem.title,
        content: newsItem.content,
        category: newsItem.category || "",
        imageUrls: [],
        summary: newsItem.summary || "",
        region: newsItem.region || "",
        coverPageImg: null,
      });
      setArticleContent(newsItem.content || "");
    }
    
    setSidebarOpen(false); // Close sidebar on mobile
  };

  // Handle new news creation
  const handleNewNews = () => {
    dispatch(clearSelectedArticle());
    setFormData({
      title: "",
      content: "",
      category: "",
      imageUrls: [],
      summary: "",
      region: "",
      coverPageImg: null,
    });
    setArticleContent("");
    setPreviewUrl(null);
    setSidebarOpen(false);
  };

  // ✅ Show loading state while feeds are initializing
  const isInitialLoading = !feedDrafted && !feedPublished;

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
              {/* ✅ Show proper loading state */}
              {isInitialLoading || loadingDrafted || loadingPublished ? (
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
              ) : draftedArticles.length === 0 && publishedArticles.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No news articles found.</p>
                  <p className="text-sm mt-1">Create your first article!</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Drafts Section */}
                  <div className="flex flex-col">
                    <span className="flex justify-center items-center font-bold text-gray-800 pb-2 border-b">
                      Drafts ({draftedArticles.length})
                    </span>
                    
                    {draftedArticles.length < 1 ? (
                      <span className="text-sm flex justify-center items-center py-4 text-gray-500">
                        No Drafts
                      </span>
                    ) : (
                      <div className="mt-2 space-y-2">
                        {draftedArticles.map((article, index) => (
                          <SideNewsBlock
                            data={article}
                            key={article?.id || index}
                            onEdit={handleEdit}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Published Section */}
                  <div className="flex flex-col">
                    <span className="flex justify-center items-center font-bold text-gray-800 pb-2 border-b">
                      Published ({publishedArticles.length})
                    </span>
                    
                    {publishedArticles.length < 1 ? (
                      <span className="text-sm flex justify-center items-center py-4 text-gray-500">
                        No Published Articles
                      </span>
                    ) : (
                      <div className="mt-2 space-y-2">
                        {publishedArticles.map((article, index) => (
                          <SideNewsBlock
                            data={article}
                            key={article?.id || index}
                            onEdit={handleEdit}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ✅ Show error states */}
              {errorDrafted && (
                <div className="text-red-600 text-sm p-2 bg-red-50 rounded">
                  Error loading drafts: {errorDrafted}
                </div>
              )}
              {errorPublished && (
                <div className="text-red-600 text-sm p-2 bg-red-50 rounded">
                  Error loading published articles: {errorPublished}
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
          {editor.saving && (
            <div className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 z-50">
              <ColorRing
                visible={true}
                height="80"
                width="80"
                ariaLabel="color-ring-loading"
                wrapperStyle={{}}
                wrapperClass="color-ring-wrapper"
                colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
              />
            </div>
          )}

          {selectedNews ? (
            <EditNews
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
              handleMediaFilesSelect={handleMediaFilesSelect}
              submitting={submitting}
              articleContent={articleContent}
              setArticleContent={setArticleContent}
              handleSubmit={handleSubmit}
              handleNewNews={handleNewNews}
              coverImgData={selectedNews.coverPageImg}
              imageUrls={selectedNews.imageUrls}
            />
          ) : (
            <CreateNews
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
              handleMediaFilesSelect={handleMediaFilesSelect}
              submitting={submitting}
              articleContent={articleContent}
              setArticleContent={setArticleContent}
              handleSubmit={handleSubmit}
            />
          )}
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
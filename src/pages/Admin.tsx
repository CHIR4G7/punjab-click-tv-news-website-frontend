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
  Plus,
  LogOut,
  Edit,
  Trash2,
  Eye,
  Calendar,
  User,
  Menu,
  X,
  ImageIcon,
  Loader2,
  Upload,
  Video,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { regions } from "@/data/constants";
import ArticleEditor from "@/components/ArticleEditor/ArticleEditor";
import { formatDate, uploadWithLimit } from "@/lib/utils";
import { NewsFormData, NewsArticle } from "@/types/admin";
import { createNewNewsDraft } from "@/store/news/reducers";

const Admin: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const { toast } = useToast();

  // State management
  const [news, setNews] = useState<NewsArticle[]>([
    {
      title: "PayloadAction&lt;Article[]&gt;",
      summary: "PayloadAction&lt;Article[]&gt;PayloadAction&lt;Article[]&gt;",
      content: '<p><span style="color: rgb(78, 201, 176);">PayloadAction</span>&lt;<span style="color: rgb(78, 201, 176);">Article</span>[]&gt;<span style="color: rgb(78, 201, 176);">PayloadAction</span>&lt;<span style="color: rgb(78, 201, 176);">Article</span>[]&gt;<span style="color: rgb(78, 201, 176);">PayloadAction</span>&lt;<span style="color: rgb(78, 201, 176);">Article</span>[]&gt;<span style="color: rgb(78, 201, 176);">PayloadAction</span>&lt;<span style="color: rgb(78, 201, 176);">Article</span>[]&gt;<span style="color: rgb(78, 201, 176);">PayloadAction</span>&lt;<span style="color: rgb(78, 201, 176);">Article</span>[]&gt;<span style="color: rgb(78, 201, 176);">PayloadAction</span>&lt;<span style="color: rgb(78, 201, 176);">Article</span>[]&gt;<span style="color: rgb(78, 201, 176);">PayloadAction</span>&lt;<span style="color: rgb(78, 201, 176);">Article</span>[]&gt;<span style="color: rgb(78, 201, 176);">PayloadAction</span>&lt;<span style="color: rgb(78, 201, 176);">Article</span>[]&gt;<span style="color: rgb(78, 201, 176);">PayloadAction</span>&lt;<span style="color: rgb(78, 201, 176);">Article</span>[]&gt;<span style="color: rgb(78, 201, 176);">PayloadAction</span>&lt;<span style="color: rgb(78, 201, 176);">Article</span>[]&gt;</p>',
      category: "Politics",
      region: "Delhi",
      coverPageImg: "https://ik.imagekit.io/tfgcb4xks/Screenshot_2025-12-08_at_11.45.48_PM_ykE4C6sXp.png",
      imageUrls: [],
      language: "pa",
      source: "internal",
      isPublished: false,
      isDrafted: true,
      createdAt: "2026-01-18T18:55:05.936Z",
      _id: "",
      publishedAt: ""
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedNews, setSelectedNews] = useState<NewsArticle | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [articleContent, setArticleContent] = useState<string>("");

  const coverPageImgRef = useRef<HTMLInputElement>(null);
  const uploadMediaRef = useRef<HTMLInputElement>(null);

  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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
    const cleanDom = DOMPurify.sanitize(articleContent);
    setFormData((prev) => ({ ...prev, content: cleanDom }));
  }, [articleContent]);

  useEffect(() => {
    if (!formData.coverPageImg) return;

    const objectUrl = URL.createObjectURL(formData.coverPageImg);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [formData.coverPageImg]);

  // Fetch news articles
  // const fetchNews = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await makeApiRequest<NewsArticle[]>("/api/v1/news");
  //     setNews(response.data);
  //   } catch (error: any) {
  //     toast({
  //       title: "Error",
  //       description: error.message || "Failed to fetch news",
  //       variant: "destructive",
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchNews();
  // }, []);

  // Handle logout
  const handleLogout = () => {
    dispatch(logout());
    navigate("/admin/login");
  };

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
    status: "published" | "draft" = "published"
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
        const endpoint = "/api/v1/create-draft";
        const method = "POST";

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
        setSelectedNews(null);
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
  const handleEdit = (newsItem: NewsArticle) => {
    setSelectedNews(newsItem);
    // setFormData({
    //   title: newsItem.title,
    //   content: articleContent,
    //   category: newsItem.category || "",
    //   imageUrls: newsItem.imageUrls || [],
    //   summary: newsItem.summary || "",
    //   region: newsItem.region || "",
    //   coverPageImg: newsItem.coverPageImg || null,
    // });
    setSidebarOpen(false); // Close sidebar on mobile
  };

  // Handle new news creation
  const handleNewNews = () => {
    setSelectedNews(null);
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
        } md:translate-x-0 fixed md:static inset-y-0 left-0 z-50 w-80 bg-white shadow-lg transition-transform duration-300 ease-in-out`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                News Articles
              </h2>
              <div className="flex items-center space-x-2">
                {/* <Button
                  onClick={handleNewNews}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4" />
                </Button> */}
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

          {/* News List */}
          <ScrollArea className="flex-1 p-4">
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
            ) : news.length == 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No news articles found.</p>
                <p className="text-sm mt-1">Create your first article!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {news.map((newsItem) => (
                  <Card
                    key={newsItem._id}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                      selectedNews?._id === newsItem._id
                        ? "ring-2 ring-blue-500 bg-blue-50"
                        : ""
                    }`}
                    onClick={() => handleEdit(newsItem)}
                  >
                    <CardContent className="p-3">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-sm line-clamp-2 flex-1 pr-2">
                          {newsItem.title}
                        </h3>
                        {/* <Badge variant={newsItem.isPublished === 'published' ? 'default' : 'secondary'} className="text-xs">
                          {newsItem.isPublished}
                        </Badge> */}
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <User className="h-3 w-3" />
                          <span>Author</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>publishDate</span>
                        </div>
                      </div>

                      {newsItem.category && (
                        <div className="mt-2">
                          <Badge variant="outline" className="text-xs">
                            {newsItem.category}
                          </Badge>
                        </div>
                      )}

                      <div className="flex justify-end space-x-1 mt-3">
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(newsItem);
                          }}
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(newsItem._id);
                          }}
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
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
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>
                  {selectedNews
                    ? "Edit News Article"
                    : "Create New News Article"}
                </span>
                {selectedNews && (
                  <Button onClick={handleNewNews} variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    New Article
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => handleSubmit(e)} className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="title"
                      className="text-sm font-medium text-gray-700"
                    >
                      Title *
                    </label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter news title..."
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="summary"
                      className="text-sm font-medium text-gray-700"
                    >
                      Summary *
                    </label>
                    <Textarea
                      id="summary"
                      name="summary"
                      value={formData.summary}
                      onChange={handleInputChange}
                      placeholder="Enter news summary..."
                      rows={3}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="category"
                      className="text-sm font-medium text-gray-700"
                    >
                      Category *
                    </label>
                    <Input
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      placeholder="e.g., Politics, Sports, Technology..."
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="region"
                      className="text-sm font-medium text-gray-700"
                    >
                      Region *
                    </label>
                    <Select
                      value={formData.region}
                      onValueChange={(value) =>
                        handleSelectChange("region", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a region..." />
                      </SelectTrigger>
                      <SelectContent>
                        {regions.map((region, index) => {
                          return (
                            <SelectItem value={region.name} key={index}>
                              {region.name}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="imageUrl"
                    className="text-sm font-medium text-gray-700"
                  >
                    Cover Page Image *
                  </label>
                  {formData.coverPageImg ? (
                    <div className="relative">
                      <img
                        src={previewUrl}
                        alt="Cover Preview"
                        className="w-full h-60 object-cover rounded-lg"
                      />
                      <div className="absolute top-2 right-2 space-x-2">
                        <Button
                          type="button"
                          onClick={removeCoverImage}
                          variant="destructive"
                          size="sm"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        <p className="font-medium">
                          {formData.coverPageImg.name}
                        </p>
                        <p>
                          {(formData.coverPageImg.size / (1024 * 1024)).toFixed(
                            2
                          )}{" "}
                          MB
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => coverPageImgRef.current?.click()}
                          disabled={uploadingCover}
                        >
                          {uploadingCover ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="mr-2 h-4 w-4" />
                              Upload Cover Image
                            </>
                          )}
                        </Button>
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        PNG, JPG, GIF up to 5MB
                      </p>
                    </div>
                  )}
                  <input
                    ref={coverPageImgRef}
                    type="file"
                    accept="image/*"
                    onChange={handleCoverImageSelect}
                    className="hidden"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Additional Photos & Videos
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <div className="text-center mb-4">
                      <Video className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => uploadMediaRef.current?.click()}
                          disabled={uploadingMedia}
                        >
                          {uploadingMedia ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="mr-2 h-4 w-4" />
                              Add Media Files
                            </>
                          )}
                        </Button>
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        Images and videos up to 10MB each. You can select
                        multiple files.
                      </p>
                    </div>

                    {formData.imageUrls.length > 0 && (
                      <div className="space-y-4">
                        <Separator />
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {formData.imageUrls.map((file, index) => (
                            <div key={index} className="relative group">
                              <div className="relative overflow-hidden rounded-lg">
                                {isVideoFile(file) ? (
                                  <div className="relative">
                                    <video
                                      src={URL.createObjectURL(file)}
                                      className="w-full h-24 object-cover"
                                      controls={false}
                                      muted
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                                      <Video className="h-6 w-6 text-white" />
                                    </div>
                                  </div>
                                ) : (
                                  <img
                                    src={URL.createObjectURL(file)}
                                    alt={`Media ${index + 1}`}
                                    className="w-full h-24 object-cover"
                                  />
                                )}
                              </div>

                              {/* File Info */}
                              <div className="mt-1 text-xs text-gray-600">
                                <p
                                  className="truncate font-medium"
                                  title={file.name}
                                >
                                  {file.name}
                                </p>
                                <p className="text-gray-500">
                                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                                </p>
                              </div>

                              {/* Remove Button */}
                              <Button
                                type="button"
                                onClick={() => removeMediaItem(index)}
                                variant="destructive"
                                size="sm"
                                className="absolute -top-2 -right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>

                        {/* Summary */}
                        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                          <p className="font-medium">
                            {formData.imageUrls.length} file(s) selected
                          </p>
                          <p>
                            Total size:{" "}
                            {(
                              formData.imageUrls.reduce(
                                (total, file) => total + file.size,
                                0
                              ) /
                              (1024 * 1024)
                            ).toFixed(2)}{" "}
                            MB
                          </p>
                        </div>
                      </div>
                    )}

                    <input
                      ref={uploadMediaRef}
                      type="file"
                      accept="image/*,video/*"
                      multiple
                      onChange={handleMediaFilesSelect}
                      className="hidden"
                    />
                  </div>
                </div>

                <ArticleEditor
                  articleContent={articleContent}
                  setArticleContent={setArticleContent}
                />

                <Separator />

                <div className="flex flex-col sm:flex-row gap-3 justify-end">
                  <Button
                    type="button"
                    onClick={(e) => handleSubmit(e, "draft")}
                    variant="outline"
                    disabled={
                      submitting ||
                      !formData.title.trim() ||
                      !formData.content.trim() ||
                      !formData.summary.trim() ||
                      !formData.category.trim() ||
                      !formData.region.trim()
                    }
                  >
                    {submitting ? (
                      <span>Saving Draft</span>
                    ) : (
                      <span>Save Draft</span>
                    )}
                  </Button>
                  {/* <Button
                    type="submit"
                    disabled={
                      submitting ||
                      !formData.title.trim() ||
                      !formData.content.trim() ||
                      !formData.summary.trim() ||
                      !formData.category.trim() ||
                      !formData.region.trim()
                    }
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin -ml-1 mr-3 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                        {selectedNews ? "Updating..." : "Publishing..."}
                      </>
                    ) : selectedNews ? (
                      "Update Article"
                    ) : (
                      "Publish Article"
                    )}
                  </Button> */}
                </div>
              </form>
            </CardContent>
          </Card>
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

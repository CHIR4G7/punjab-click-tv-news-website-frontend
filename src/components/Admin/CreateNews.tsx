import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import { ImageIcon, Loader2, Upload, Video, X } from "lucide-react";
import { Separator } from "../ui/separator";
import { regions } from "@/data/constants";
import ArticleEditor from "../ArticleEditor/ArticleEditor";

const CreateNews = ({
  handleSubmit,
  formData,
  handleInputChange,
  handleSelectChange,
  previewUrl,
  removeCoverImage,
  coverPageImgRef,
  uploadingCover,
  handleCoverImageSelect,
  uploadMediaRef,
  uploadingMedia,
  isVideoFile,
  removeMediaItem,
  handleMediaFilesSelect,
  submitting,
  articleContent,
  setArticleContent
}) => {

  // Debug function to check which button is clicked
  const handleCoverButtonClick = () => {
    console.log("Cover image button clicked");
    coverPageImgRef.current?.click();
  };

  const handleMediaButtonClick = () => {
    console.log("Media files button clicked");
    uploadMediaRef.current?.click();
  };

  return (
    <div className="h-screen overflow-y-auto bg-gray-50">
      <div className="p-4 sm:p-6 lg:p-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Create New News Article
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => handleSubmit(e)} className="space-y-6">
              {/* Title and Summary */}
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium text-gray-700">
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
                  <label htmlFor="summary" className="text-sm font-medium text-gray-700">
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

              {/* Category and Region */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="category" className="text-sm font-medium text-gray-700">
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
                  <label htmlFor="region" className="text-sm font-medium text-gray-700">
                    Region *
                  </label>
                  <Select
                    value={formData.region}
                    onValueChange={(value) => handleSelectChange("region", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a region..." />
                    </SelectTrigger>
                    <SelectContent>
                      {regions.map((region, index) => (
                        <SelectItem value={region.name} key={index}>
                          {region.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Cover Page Image Section */}
              <div className="space-y-4">
                <label className="text-sm font-medium text-gray-700">
                  Cover Page Image *
                </label>
                
                {formData.coverPageImg ? (
                  <div className="relative">
                    <img
                      src={previewUrl}
                      alt="Cover Preview"
                      className="w-full h-60 object-cover rounded-lg border"
                    />
                    <Button
                      type="button"
                      onClick={removeCoverImage}
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      <p className="font-medium">{formData.coverPageImg.name}</p>
                      <p>Size: {(formData.coverPageImg.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCoverButtonClick}
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
                
                {/* Hidden input for cover image */}
                <input
                  ref={coverPageImgRef}
                  type="file"
                  accept="image/*"
                  onChange={handleCoverImageSelect}
                  className="hidden"
                  id="cover-image-input"
                />
              </div>

              {/* Additional Media Section */}
              <div className="space-y-4">
                <label className="text-sm font-medium text-gray-700">
                  Additional Photos & Videos
                </label>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  {/* Upload Button */}
                  <div className="text-center mb-4">
                    <Video className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleMediaButtonClick}
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
                      Images and videos up to 10MB each. You can select multiple files.
                    </p>
                  </div>

                  {/* Media Preview Grid */}
                  {formData.imageUrls && formData.imageUrls.length > 0 && (
                    <div className="space-y-4">
                      <Separator />
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {formData.imageUrls.map((file, index) => (
                          <div key={index} className="relative group">
                            <div className="relative overflow-hidden rounded-lg border">
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

                            {/* File Info */}
                            <div className="mt-1 text-xs text-gray-600">
                              <p className="truncate font-medium" title={file.name}>
                                {file.name}
                              </p>
                              <p className="text-gray-500">
                                {(file.size / (1024 * 1024)).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Media Summary */}
                      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                        <p className="font-medium">
                          {formData.imageUrls.length} file(s) selected
                        </p>
                        <p>
                          Total size: {" "}
                          {(
                            formData.imageUrls.reduce((total, file) => total + file.size, 0) /
                            (1024 * 1024)
                          ).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Hidden input for additional media */}
                  <input
                    ref={uploadMediaRef}
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    onChange={handleMediaFilesSelect}
                    className="hidden"
                    id="media-files-input"
                  />
                </div>
              </div>

              {/* Article Content Editor */}
              <div className="space-y-4">
                <ArticleEditor
                  articleContent={articleContent}
                  setArticleContent={setArticleContent}
                />
              </div>

              <Separator />

              {/* Submit Button */}
              <div className="flex justify-end">
                <Button
                  type="button"
                  onClick={(e) => handleSubmit(e, "draft")}
                  variant="default"
                  disabled={
                    submitting ||
                    !formData.title?.trim() ||
                    !formData.summary?.trim() ||
                    !formData.category?.trim() ||
                    !formData.region?.trim() ||
                    !formData.coverPageImg
                  }
                  className="px-8"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving Draft...
                    </>
                  ) : (
                    "Save Draft"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateNews;
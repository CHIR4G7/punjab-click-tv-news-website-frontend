import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { ImageIcon, Loader2, Plus, Upload, Video, X } from "lucide-react";
import { Separator } from "../ui/separator";
import { regions } from "@/data/constants";
import ArticleEditor from "../ArticleEditor/ArticleEditor";

const EditNews = ({
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
  setArticleContent,
  handleNewNews,
  coverImgData,
  imageUrls,
}) => {

  const handleNewsChange = (e:React.MouseEvent)=>{
    console.log(formData)
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Edit News Article
            <Button onClick={handleNewNews} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Article
            </Button>
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
                  onValueChange={(value) => handleSelectChange("region", value)}
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
                    <p className="font-medium">{formData.coverPageImg.name}</p>
                    <p>
                      {(formData.coverPageImg.size / (1024 * 1024)).toFixed(2)}{" "}
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
                <div className="flex flex-row gap-3">
                  
                  {imageUrls.map((url, index) => {
                    return (
                      <img
                        src={url}
                        alt="Additional Images"
                        style={{
                          height: "100px",
                          width: "100px",
                        }}
                        key={index}
                      />
                    );
                  })}
                </div>
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
                onClick={(e) => handleNewsChange(e)}
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
                  <span>Updating</span>
                ) : (
                  <span>Update Changes</span>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditNews;

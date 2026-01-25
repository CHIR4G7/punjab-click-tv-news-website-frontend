import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Edit, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BookCheck } from 'lucide-react';
interface SideNewsBlockProps {
  data: {
    _id: string;
    title: string;
    summary: string;
    content: string;
    category: string;
    region: string;
    coverPageImg: string;
    imageUrls: string[];
    language: string;
    source: string;
    isPublished: boolean;
    isDrafted: boolean;
    publishedAt: string | null;
    createdAt: string;
    updatedAt: string;
  };
  onEdit: (article: any) => void; // Add this prop
}

const SideNewsBlock: React.FC<SideNewsBlockProps> = ({ data, onEdit }) => {
  const {
    title,
    summary,
    category,
    region,
    coverPageImg,
    isPublished,
    isDrafted,
    createdAt
  } = data;

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Strip HTML and truncate
  const cleanText = (html: string, maxLength: number) => {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    const text = temp.textContent || temp.innerText || '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent any parent click handlers
    onEdit(data);
  };

  const handlePublish = (e:React.MouseEvent)=>{

  }

  return (
    <div className="flex gap-3 p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors">
      {/* Thumbnail */}
      {/* <div className="flex-shrink-0">
        <img
          src={coverPageImg}
          alt={title}
          className="w-16 h-16 object-cover rounded-md"
          onError={(e) => {
            e.currentTarget.src = '/placeholder-image.jpg';
          }}
        />
      </div> */}

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-1">
        {/* Status & Category */}
        <div className="flex items-center gap-2">
          <Badge 
            variant={isPublished ? "default" : isDrafted ? "secondary" : "outline"}
            className="text-xs px-1.5 py-0.5"
          >
            {isPublished ? "Live" : isDrafted ? "Draft" : "Pending"}
          </Badge>
          <Badge variant="outline" className="text-xs px-1.5 py-0.5">
            {category}
          </Badge>
        </div>

        {/* Title */}
        <h4 className="font-medium text-sm line-clamp-2 leading-tight">
          {cleanText(title, 60)}
        </h4>

        {/* Meta */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{region}</span>
          <span>{formatDate(createdAt)}</span>
        </div>

        {/* Action Button */}
        <div className="pt-1 flex flex-flex-row gap-2">
          <Button
            onClick={handleEditClick}
            variant="destructive"
            size="sm"
            className="w-full text-xs h-6"
          >
            <Edit className="h-3 w-3 mr-1" />
            Edit
          </Button>
          {!isPublished &&            <Button
            onClick={handlePublish}
            variant="default"
            size="sm"
            className="w-full text-xs h-6"
          >
            <BookCheck className="h-3 w-3 mr-1" />
            Publish
          </Button>}

        </div>
      </div>
    </div>
  );
};

export default SideNewsBlock;
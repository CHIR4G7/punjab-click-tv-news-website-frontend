import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const ArticleEditor = ({articleContent,setArticleContent}) => {
  const [content, setContent] = useState("");

  const handleChange = (e)=>{
    setArticleContent(e)
  }

  return (
    <div>
      <label className="font-medium">Content</label>

      <ReactQuill
        theme="snow"
        value={articleContent}
        onChange={handleChange}
        placeholder="Write article content..."
        style={{
            height:'500px'
        }}
      />
    </div>
  );
};

export default ArticleEditor;

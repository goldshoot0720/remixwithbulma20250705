import { useEffect, useRef, useState } from "react";

export default function Tab6Page() {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<any>(null);
  const [content, setContent] = useState("");

  useEffect(() => {
    if (editorRef.current && !quillRef.current && window.Quill) {
      const toolbarOptions = [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ script: "sub" }, { script: "super" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ direction: "rtl" }],
        [{ size: ["small", false, "large", "huge"] }],
        [{ color: [] }, { background: [] }],
        [{ font: [] }],
        [{ align: [] }],
        ["link", "image", "video", "code-block"],
        ["clean"],
      ];

      const quill = new window.Quill(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: toolbarOptions,
        },
      });

      quillRef.current = quill;

      // 綁定變更事件，抓取 HTML
      quill.on("text-change", () => {
        setContent(quill.root.innerHTML);
      });

      // 設定初始內容（可選）
      quill.root.innerHTML = `<h2>初始內容</h2><p>這是 <strong>完整功能</strong> 的 Quill 編輯器。</p>`;
    }
  }, []);

  return (
    <div className="section">
      <h1 className="title">Quill Page</h1>
      <div
        ref={editorRef}
        style={{ height: "400px", backgroundColor: "white" }}
      />
      <div className="box mt-4">
        <strong>內容預覽：</strong>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </div>
  );
}

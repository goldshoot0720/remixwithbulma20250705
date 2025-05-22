import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { useState } from "react";

export async function loader() {
  const columnInit = [
    {
      id: 1,
      title:
        "TVアニメ「群れなせ！シートン学園」OP主題歌「学園壮観Zoo」ノンテロップ映像",
      video:
        "https://storage.googleapis.com/tsaopaofenghsiung2025-default-rtdb-backups/2020/op/TV%E3%82%A2%E3%83%8B%E3%83%A1%E3%80%8C%E7%BE%A4%E3%82%8C%E3%81%AA%E3%81%9B%EF%BC%81%E3%82%B7%E3%83%BC%E3%83%88%E3%83%B3%E5%AD%A6%E5%9C%92%E3%80%8DOP%E4%B8%BB%E9%A1%8C%E6%AD%8C%E3%80%8C%E5%AD%A6%E5%9C%92%E5%A3%AE%E8%A6%B3Zoo%E3%80%8D%E3%83%8E%E3%83%B3%E3%83%86%E3%83%AD%E3%83%83%E3%83%97%E6%98%A0%E5%83%8F.mp4",
      image:
        "https://storage.googleapis.com/tsaopaofenghsiung2025-default-rtdb-backups/2020/op%20img/TV%E3%82%A2%E3%83%8B%E3%83%A1%E3%80%8C%E7%BE%A4%E3%82%8C%E3%81%AA%E3%81%9B%EF%BC%81%E3%82%B7%E3%83%BC%E3%83%88%E3%83%B3%E5%AD%A6%E5%9C%92%E3%80%8DOP%E4%B8%BB%E9%A1%8C%E6%AD%8C%E3%80%8C%E5%AD%A6%E5%9C%92%E5%A3%AE%E8%A6%B3Zoo%E3%80%8D%E3%83%8E%E3%83%B3%E3%83%86%E3%83%AD%E3%83%83%E3%83%97%E6%98%A0%E5%83%8F.webp",
    },
    {
      id: 2,
      title:
        "TVアニメ「群れなせ！シートン学園」ED主題歌「オオカミブルース」ノンテロップ映像",
      video:
        "https://storage.googleapis.com/tsaopaofenghsiung2025-default-rtdb-backups/2020/ed/TV%E3%82%A2%E3%83%8B%E3%83%A1%E3%80%8C%E7%BE%A4%E3%82%8C%E3%81%AA%E3%81%9B%EF%BC%81%E3%82%B7%E3%83%BC%E3%83%88%E3%83%B3%E5%AD%A6%E5%9C%92%E3%80%8DED%E4%B8%BB%E9%A1%8C%E6%AD%8C%E3%80%8C%E3%82%AA%E3%82%AA%E3%82%AB%E3%83%9F%E3%83%96%E3%83%AB%E3%83%BC%E3%82%B9%E3%80%8D%E3%83%8E%E3%83%B3%E3%83%86%E3%83%AD%E3%83%83%E3%83%97%E6%98%A0%E5%83%8F.mp4",
      image:
        "https://storage.googleapis.com/tsaopaofenghsiung2025-default-rtdb-backups/2020/ed%20img/TV%E3%82%A2%E3%83%8B%E3%83%A1%E3%80%8C%E7%BE%A4%E3%82%8C%E3%81%AA%E3%81%9B%EF%BC%81%E3%82%B7%E3%83%BC%E3%83%88%E3%83%B3%E5%AD%A6%E5%9C%92%E3%80%8DED%E4%B8%BB%E9%A1%8C%E6%AD%8C%E3%80%8C%E3%82%AA%E3%82%AA%E3%82%AB%E3%83%9F%E3%83%96%E3%83%AB%E3%83%BC%E3%82%B9%E3%80%8D%E3%83%8E%E3%83%B3%E3%83%86%E3%83%AD%E3%83%83%E3%83%97%E6%98%A0%E5%83%8F.webp",
    },
  ];
  return json(columnInit);
}

export default function Tab4Page() {
  const columns = useLoaderData();
  const [visibleVideos, setVisibleVideos] = useState({});

  const toggleVideo = (id) => {
    setVisibleVideos((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div>
      <h1>Video Page</h1>
      <div>
        {columns.map((column) => (
          <div key={column.id}>
            <button onClick={() => toggleVideo(column.id)}>
              <img
                src={column.image}
                width={"333px"}
                title={column.title}
                alt={column.title}
              />
            </button>
            {visibleVideos[column.id] && column.video && (
              <video width="333" controls>
                <source src={column.video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

import { json, useLoaderData, useFetcher } from "@remix-run/react";
import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { getUdemy } from "../db/getUdemy";
import { updateUdemy } from "../db/updateUdemy"; // ← ✅ 改為使用 updateUdemy
import { useRef, useEffect, useState } from "react";

// Loader：取得所有 Udemy 課程資料
export const loader: LoaderFunction = async () => {
  const udemys = await getUdemy();
  return json(udemys);
};

// Action：更新單筆課程 schedule
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const id = formData.get("id")?.toString();
  const schedule = formData.get("schedule")?.toString();

  if (!id || schedule === undefined) {
    return json({ success: false, message: "缺少資料" }, { status: 400 });
  }

  try {
    await updateUdemy(id, { schedule }); // ← ✅ 改為使用 updateUdemy(id, { schedule })
    return json({ success: true });
  } catch (error) {
    console.error("更新錯誤:", error);
    return json({ success: false, message: "更新失敗" }, { status: 500 });
  }
};

// 頁面元件
export default function Tab2Page() {
  const initialData = useLoaderData<typeof loader>();
  const [udemys, setUdemys] = useState(() => [...initialData]);

  const debounceTimers = useRef<Record<string, NodeJS.Timeout>>({});
  const fetcher = useFetcher();

  useEffect(() => {
    if (fetcher.type === "done" && fetcher.data?.success) {
      fetcher.load("/tab2"); // 重新載入資料
    }
  }, [fetcher.data, fetcher.type]);

  const handleScheduleChange = (id: string, value: string) => {
    setUdemys((prev) =>
      prev.map((u) => (u.id === id ? { ...u, schedule: value } : u))
    );

    if (debounceTimers.current[id]) {
      clearTimeout(debounceTimers.current[id]);
    }

    debounceTimers.current[id] = setTimeout(() => {
      const formData = new FormData();
      formData.append("id", id);
      formData.append("schedule", value);
      fetcher.submit(formData, { method: "post" });
    }, 1000);
  };

  return (
    <div>
      <h1>Udemy 課程清單</h1>
      {udemys.map((udemy) => (
        <div key={udemy.id} className="rows" style={{ marginBottom: 16 }}>
          <div className="row" style={{ marginBottom: 4 }}>
            <strong>{udemy.course}</strong>
          </div>
          <div className="row" style={{ marginBottom: 4 }}>
            {udemy.teacher}
          </div>
          <div className="row">
            <input
              type="text"
              value={udemy.schedule}
              onChange={(e) => handleScheduleChange(udemy.id, e.target.value)}
              style={{ width: "60%", marginRight: 8 }}
            />
            {fetcher.state === "submitting" ? (
              <span>儲存中...</span>
            ) : (
              <span style={{ color: "gray" }}>已同步</span>
            )}
          </div>
        </div>
      ))}

      {fetcher.data?.success === false && (
        <div style={{ color: "red" }}>
          更新失敗: {fetcher.data.message || "未知錯誤"}
        </div>
      )}
    </div>
  );
}

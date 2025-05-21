import { json, useLoaderData, useFetcher } from "@remix-run/react";
import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { getUdemy } from "../db/getUdemy";
import { updateUdemy } from "../db/updateUdemy";
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

  const idNum = parseInt(id, 10);
  if (isNaN(idNum)) {
    return json({ success: false, message: "id 非法" }, { status: 400 });
  }

  try {
    const success = await updateUdemy(idNum, schedule);
    if (!success) {
      return json({ success: false, message: "更新失敗" }, { status: 500 });
    }
    return json({ success: true });
  } catch (error) {
    console.error("更新錯誤:", error);
    return json({ success: false, message: "更新失敗" }, { status: 500 });
  }
};

// 頁面元件
export default function Tab2Page() {
  const initialData = useLoaderData<typeof loader>();
  const [udemys, setUdemys] = useState(initialData);
  const debounceTimers = useRef<Record<number, NodeJS.Timeout>>({});
  const fetcher = useFetcher();

  // 當更新成功後重新讀取資料，保持同步
  useEffect(() => {
    if (fetcher.type === "done" && fetcher.data?.success) {
      fetcher.load("/tab2");
    }
  }, [fetcher.data, fetcher.type]);

  const handleScheduleChange = (id: number, value: string) => {
    setUdemys((prev) =>
      prev.map((u) => (u.id === id ? { ...u, schedule: value } : u))
    );

    if (debounceTimers.current[id]) {
      clearTimeout(debounceTimers.current[id]);
    }

    debounceTimers.current[id] = setTimeout(() => {
      const formData = new FormData();
      formData.append("id", id.toString());
      formData.append("schedule", value);
      fetcher.submit(formData, { method: "post" });
    }, 1000);
  };

  return (
    <div>
      <div className="container">
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
              <div className="row" style={{ marginBottom: 4 }}>
                {(
                  (udemy.schedule.split("/")[0] /
                    udemy.schedule.split("/")[1]) *
                  100
                ).toFixed(2)}
                %
              </div>
              <div className="row" style={{ marginBottom: 4 }}>
                {udemy.schedule.split("/")[0] - udemy.schedule.split("/")[1]}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

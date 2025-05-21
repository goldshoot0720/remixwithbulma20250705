import { json, useLoaderData, useFetcher } from "@remix-run/react";
import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { getUdemy } from "../db/getUdemy";
import { updateUdemy } from "../db/updateUdemy";
import { useRef, useEffect, useState } from "react";

function parseScheduleRatio(schedule: string): number {
  if (!schedule) return 0;
  const parts = schedule.split("/");
  if (parts.length !== 2) return 0;
  const numerator = parseFloat(parts[0]);
  const denominator = parseFloat(parts[1]);
  if (isNaN(numerator) || isNaN(denominator) || denominator === 0) return 0;
  return numerator / denominator;
}

export const loader: LoaderFunction = async () => {
  const udemys = await getUdemy();
  return json(udemys);
};

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

export default function Tab2Page() {
  const initialData = useLoaderData<typeof loader>();
  const [udemys, setUdemys] = useState(() =>
    [...initialData].sort(
      (a, b) => parseScheduleRatio(b.schedule) - parseScheduleRatio(a.schedule)
    )
  );

  const debounceTimers = useRef<Record<number, NodeJS.Timeout>>({});
  const fetcher = useFetcher();

  // 更新成功後重新讀取資料保持同步
  useEffect(() => {
    if (fetcher.type === "done" && fetcher.data?.success) {
      fetcher.load("/tab2");
    }
  }, [fetcher.data, fetcher.type]);

  // 及時更新輸入並排序
  const handleScheduleChange = (id: number, value: string) => {
    setUdemys((prev) => {
      // 先更新該筆 schedule
      const newData = prev.map((u) =>
        u.id === id ? { ...u, schedule: value } : u
      );
      // 排序並回傳新陣列
      return [...newData].sort(
        (a, b) =>
          parseScheduleRatio(b.schedule) - parseScheduleRatio(a.schedule)
      );
    });

    // debounce 送出更新
    if (debounceTimers.current[id]) clearTimeout(debounceTimers.current[id]);
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
        <h1>Udemy Page</h1>
        {udemys.map((udemy) => (
          <div key={udemy.id} className="rows" style={{ marginBottom: 16 }}>
            <div className="row" style={{ marginBottom: 4 }}>
              <strong>{udemy.course}</strong>
            </div>
            <div className="row" style={{ marginBottom: 4 }}>
              {udemy.teacher}
            </div>
            <div
              className="row"
              style={{ display: "flex", alignItems: "center" }}
            >
              <input
                type="text"
                value={udemy.schedule}
                onChange={(e) => handleScheduleChange(udemy.id, e.target.value)}
                style={{ width: "60%", marginRight: 8 }}
              />
              <div className="row" style={{ marginRight: 12 }}>
                {(parseScheduleRatio(udemy.schedule) * 100).toFixed(2)}%
              </div>
              <div className="row">
                {(() => {
                  const parts = udemy.schedule.split("/");
                  if (parts.length !== 2) return "-";
                  const num1 = parseInt(parts[0], 10);
                  const num2 = parseInt(parts[1], 10);
                  if (isNaN(num1) || isNaN(num2)) return "-";
                  return num1 - num2;
                })()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

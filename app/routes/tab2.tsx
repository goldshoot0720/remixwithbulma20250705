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

  // 暫存輸入狀態
  const [pendingSchedules, setPendingSchedules] = useState<
    Record<number, string>
  >({});

  const debounceTimers = useRef<Record<number, NodeJS.Timeout>>({});
  const fetcher = useFetcher();

  useEffect(() => {
    if (fetcher.type === "done" && fetcher.data?.success) {
      fetcher.load("/tab2");
    }
  }, [fetcher.data, fetcher.type]);

  const handleScheduleChange = (id: number, value: string) => {
    // 暫存輸入文字，不馬上更新 udemys
    setPendingSchedules((prev) => ({ ...prev, [id]: value }));

    // 清除舊計時器
    if (debounceTimers.current[id]) clearTimeout(debounceTimers.current[id]);
    debounceTimers.current[id] = setTimeout(() => {
      // 1秒後把該 id 的暫存文字更新到 udemys
      setUdemys((prev) => {
        const newData = prev.map((u) =>
          u.id === id ? { ...u, schedule: pendingSchedules[id] ?? value } : u
        );
        return [...newData].sort(
          (a, b) =>
            parseScheduleRatio(b.schedule) - parseScheduleRatio(a.schedule)
        );
      });

      // 送出更新
      const formData = new FormData();
      formData.append("id", id.toString());
      formData.append("schedule", pendingSchedules[id] ?? value);
      fetcher.submit(formData, { method: "post" });

      // 清除該筆暫存
      setPendingSchedules((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    }, 1000);
  };

  return (
    <div>
      <div className="container">
        <h1>Udemy Page</h1>
        {udemys.map((udemy) => {
          // 如果該 id 有暫存文字，用暫存的顯示，否則用原本 schedule
          const displaySchedule = pendingSchedules[udemy.id] ?? udemy.schedule;

          return (
            <div key={udemy.id} className="rows">
              <div className="row">
                <strong>{udemy.course}</strong>
              </div>
              <div className="row">{udemy.teacher}</div>
              <div className="row">
                <input
                  type="text"
                  value={displaySchedule}
                  onChange={(e) =>
                    handleScheduleChange(udemy.id, e.target.value)
                  }
                  style={{ width: "60%", marginRight: 8 }}
                />
                <div className="row">
                  {(parseScheduleRatio(displaySchedule) * 100).toFixed(2)}%
                </div>
                <div className="row">
                  {(() => {
                    const parts = displaySchedule.split("/");
                    if (parts.length !== 2) return "-";
                    const num1 = parseInt(parts[0], 10);
                    const num2 = parseInt(parts[1], 10);
                    if (isNaN(num1) || isNaN(num2)) return "-";
                    return num1 - num2;
                  })()}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

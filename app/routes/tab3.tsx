import { json, useLoaderData, useFetcher } from "@remix-run/react";
import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { useState, useEffect, useRef } from "react";
import { getSubscribe } from "../db/getSubscribe";
import { updateSubscribe } from "../db/updateSubscribe";

export const loader: LoaderFunction = async () => {
  const subscribes = await getSubscribe();
  return json(subscribes);
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const id = formData.get("id");
  const fee = formData.get("fee");
  const card = formData.get("card");
  const next = formData.get("next");

  if (
    !id ||
    isNaN(Number(id)) ||
    !fee ||
    isNaN(Number(fee)) ||
    !card ||
    typeof card !== "string" ||
    !next ||
    typeof next !== "string" ||
    isNaN(Date.parse(next))
  ) {
    return json({ success: false, message: "Invalid input" }, { status: 400 });
  }

  const nextDate = new Date(next);

  const success = await updateSubscribe(
    Number(id),
    Number(fee),
    card,
    nextDate
  );

  if (success) {
    return json({ success: true });
  } else {
    return json(
      { success: false, message: "DB update failed" },
      { status: 500 }
    );
  }
};

type Subscribe = {
  id: number;
  name: string;
  fee: number;
  card: string;
  next: string; // ISO date string
};

export default function Tab3Page() {
  const initialData = useLoaderData<Subscribe[]>();
  const fetcher = useFetcher();

  const [subscribes, setSubscribes] = useState(() =>
    [...initialData].sort((a, b) => b.fee - a.fee)
  );

  // 防抖計時器記錄
  const debounceTimers = useRef<Record<number, NodeJS.Timeout>>({});

  // 更新成功後重新載入資料
  useEffect(() => {
    if (fetcher.type === "done" && fetcher.data?.success) {
      fetcher.load("/tab3");
    }
  }, [fetcher.data, fetcher.type]);

  function handleFeeChange(id: number, value: string) {
    const trimmed = value.trim();
    let num = 0;
    if (trimmed === "") {
      num = 0;
    } else {
      const parsed = Number(trimmed);
      if (isNaN(parsed)) return;
      num = parsed < 0 ? 0 : parsed;
    }

    setSubscribes((prev) =>
      [...prev.map((s) => (s.id === id ? { ...s, fee: num } : s))].sort(
        (a, b) => b.fee - a.fee
      )
    );

    if (debounceTimers.current[id]) {
      clearTimeout(debounceTimers.current[id]);
    }

    debounceTimers.current[id] = setTimeout(() => {
      const formData = new FormData();
      formData.append("id", id.toString());
      formData.append("fee", num.toString());
      formData.append("card", subscribes.find((s) => s.id === id)?.card || "");
      formData.append(
        "next",
        subscribes.find((s) => s.id === id)?.next || new Date().toISOString()
      );
      fetcher.submit(formData, { method: "post" });
    }, 1000);
  }

  function handleCardChange(id: number, value: string) {
    setSubscribes((prev) =>
      prev.map((s) => (s.id === id ? { ...s, card: value } : s))
    );

    if (debounceTimers.current[id]) {
      clearTimeout(debounceTimers.current[id]);
    }

    debounceTimers.current[id] = setTimeout(() => {
      const s = subscribes.find((s) => s.id === id);
      if (!s) return;
      const formData = new FormData();
      formData.append("id", id.toString());
      formData.append("fee", s.fee.toString());
      formData.append("card", value);
      formData.append("next", s.next);
      fetcher.submit(formData, { method: "post" });
    }, 1000);
  }

  function handleNextChange(id: number, value: string) {
    // 簡單驗證日期格式
    if (isNaN(Date.parse(value))) return;

    setSubscribes((prev) =>
      prev.map((s) => (s.id === id ? { ...s, next: value } : s))
    );

    if (debounceTimers.current[id]) {
      clearTimeout(debounceTimers.current[id]);
    }

    debounceTimers.current[id] = setTimeout(() => {
      const s = subscribes.find((s) => s.id === id);
      if (!s) return;
      const formData = new FormData();
      formData.append("id", id.toString());
      formData.append("fee", s.fee.toString());
      formData.append("card", s.card);
      formData.append("next", value);
      fetcher.submit(formData, { method: "post" });
    }, 1000);
  }

  return (
    <div className="container">
      <h2>Subscribe Page</h2>

      {subscribes.map((sub) => (
        <div className="rows" key={sub.id}>
          <div className="row">
            <a href={sub.link} target="_blank" rel="noopener noreferrer">
              <strong>{sub.item}</strong>
            </a>
          </div>
          <div className="row">
            <label>
              Fee:{" "}
              <input
                type="number"
                min={0}
                value={sub.fee}
                onChange={(e) => handleFeeChange(sub.id, e.target.value)}
              />
            </label>
          </div>
          <div className="row">
            <label>
              Card:{" "}
              <input
                type="text"
                value={sub.card}
                onChange={(e) => handleCardChange(sub.id, e.target.value)}
              />
            </label>
          </div>
          <div className="row">
            <label>
              Next:{" "}
              <input
                type="date"
                value={sub.next.slice(0, 10)} // YYYY-MM-DD
                onChange={(e) => handleNextChange(sub.id, e.target.value)}
              />
            </label>
          </div>
        </div>
      ))}

      {/* 更新錯誤訊息 */}
      {fetcher.data && fetcher.data.success === false && (
        <div style={{ color: "red" }}>
          更新失敗: {fetcher.data.message || "未知錯誤"}
        </div>
      )}

      {/* 更新中提示 */}
      {/* {fetcher.state === "submitting" && <div>更新中...</div>} */}
    </div>
  );
}

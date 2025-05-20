import { json, useLoaderData, useFetcher } from "@remix-run/react";
import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { useState, useEffect, useRef } from "react";
import { getBank } from "../db/getBank";
import { updateBank } from "../db/updateBank";

export const loader: LoaderFunction = async () => {
  const banks = await getBank();
  return json(banks);
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const id = formData.get("id");
  const saving = formData.get("saving");

  if (!id || isNaN(Number(saving))) {
    return json({ success: false, message: "Invalid input" }, { status: 400 });
  }

  const success = await updateBank(Number(id), Number(saving));

  if (success) {
    return json({ success: true });
  } else {
    return json(
      { success: false, message: "DB update failed" },
      { status: 500 }
    );
  }
};

export default function Tab1Page() {
  const initialData = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const [banks, setBanks] = useState(initialData);

  // 用 ref 紀錄每個輸入欄的防抖計時器
  const debounceTimers = useRef<Record<number, NodeJS.Timeout>>({});

  // 更新成功後，重新載入資料，確保前後端同步
  useEffect(() => {
    if (fetcher.type === "done" && fetcher.data?.success) {
      fetcher.load("/tab1");
    }
  }, [fetcher.data, fetcher.type]);

  function handleSavingChange(id: number, value: string) {
    const trimmed = value.trim();
    let num = 0;
    if (trimmed === "") {
      num = 0;
    } else {
      const parsed = Number(trimmed);
      if (isNaN(parsed)) return;
      num = parsed < 0 ? 0 : parsed;
    }

    // 更新本地 state
    setBanks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, saving: num } : b))
    );

    // 清除之前的防抖計時器
    if (debounceTimers.current[id]) {
      clearTimeout(debounceTimers.current[id]);
    }

    // 1秒後送出更新請求
    debounceTimers.current[id] = setTimeout(() => {
      const formData = new FormData();
      formData.append("id", id.toString());
      formData.append("saving", num.toString());
      fetcher.submit(formData, { method: "post" });
    }, 1000);
  }

  return (
    <div className="container">
      <h2>Tab1 Page</h2>

      {banks.map((bank) => (
        <div key={bank.id} className="rows" style={{ marginBottom: 12 }}>
          <div className="row" style={{ marginBottom: 4 }}>
            {bank.name}:
          </div>
          <input
            type="number"
            min={0}
            value={bank.saving}
            onChange={(e) => handleSavingChange(bank.id, e.target.value)}
          />
        </div>
      ))}

      {/* 更新錯誤訊息 */}
      {fetcher.data && fetcher.data.success === false && (
        <div style={{ color: "red" }}>
          更新失敗: {fetcher.data.message || "未知錯誤"}
        </div>
      )}

      {/* 更新中提示 */}
      {fetcher.state === "submitting" && <div>更新中...</div>}
    </div>
  );
}

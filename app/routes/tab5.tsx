import { useEffect, useState } from "react";

export default function Tab5Page() {
  const targets = [
    { label: "紅鸞星動", date: new Date("2025-06-15T00:00:00") },
    { label: "考試通知書", date: new Date("2025-06-19T00:00:00") },
    { label: "考試延期", date: new Date("2025-07-05T04:18:00") },
  ];

  const [timesLeft, setTimesLeft] = useState(getAllTimesLeft());

  function getTimeLeft(targetDate: Date) {
    const now = new Date();
    const diff = targetDate.getTime() - now.getTime();

    const seconds = Math.max(Math.floor((diff / 1000) % 60), 0);
    const minutes = Math.max(Math.floor((diff / 1000 / 60) % 60), 0);
    const hours = Math.max(Math.floor((diff / (1000 * 60 * 60)) % 24), 0);
    const days = Math.max(Math.floor(diff / (1000 * 60 * 60 * 24)), 0);

    return { days, hours, minutes, seconds };
  }

  function getAllTimesLeft() {
    return targets.map((t) => ({
      label: t.label,
      time: getTimeLeft(t.date),
    }));
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimesLeft(getAllTimesLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      <h1>Countdown Page</h1>
      {timesLeft.map((t, index) => (
        <div key={index}>
          <h2>{t.label}</h2>
          <p>
            {t.time.days} days {t.time.hours} hours {t.time.minutes} minutes{" "}
            {t.time.seconds} seconds
          </p>
        </div>
      ))}
    </div>
  );
}

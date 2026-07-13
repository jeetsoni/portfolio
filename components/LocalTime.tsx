"use client";

import { useEffect, useState } from "react";

/** Live Ahmedabad clock for the footer. */
export default function LocalTime() {
  const [time, setTime] = useState("--:--:--");

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const update = () => setTime(fmt.format(new Date()));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <p className="mono-label">
      Ahmedabad · <span className="text-bone">{time}</span> IST · 23.02°N 72.57°E
    </p>
  );
}

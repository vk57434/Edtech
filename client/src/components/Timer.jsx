import { useEffect, useState } from "react";

export default function Timer({ onTimeout }) {
  const [time, setTime] = useState(30);

  useEffect(() => {
    if (time <= 0) {
      onTimeout();
      return undefined;
    }

    const t = setInterval(() => setTime((prev) => prev - 1), 1000);
    return () => clearInterval(t);
  }, [time, onTimeout]);

  return <p>⏱ {time}s</p>;
}

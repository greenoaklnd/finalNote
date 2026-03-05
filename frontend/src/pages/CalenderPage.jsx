import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CalendarPage() {
  const navigate = useNavigate();
  const [blocks, setBlocks] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        const res = await fetch("http://localhost:5000/blocks");
        const data = await res.json();
        console.log("Calendar blocks:", data);
        setBlocks(data);
      } catch (err) {
        console.error("Failed to load blocks:", err);
      }
    };

    fetchBlocks();
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  const startDay = firstDayOfMonth.getDay();
  const totalDays = lastDayOfMonth.getDate();

  const changeMonth = (offset) => {
    setCurrentDate(new Date(year, month + offset, 1));
  };

  const getBlocksForDay = (day) => {
    return blocks.filter((block) => {
      if (!block.createdAt) return false;

      const blockDate = new Date(block.createdAt);

      return (
        blockDate.getFullYear() === year &&
        blockDate.getMonth() === month &&
        blockDate.getDate() === day
      );
    });
  };

  const days = [];

  for (let i = 0; i < startDay; i++) {
    days.push(<div key={`empty-${i}`} />);
  }

  for (let day = 1; day <= totalDays; day++) {
    const dayBlocks = getBlocksForDay(day);

    days.push(
      <div
        key={day}
        style={{
          border: "1px solid #ddd",
          minHeight: 120,
          padding: 6,
          fontSize: 12,
        }}
      >
        <div style={{ fontWeight: "bold", marginBottom: 6 }}>
          {day}
        </div>

        {dayBlocks.map((block) => (
          <div
            key={block._id}
            onClick={() =>
              navigate(`/category/${encodeURIComponent(block.category)}`)
            }
            style={{
              background: "#f3f3f3",
              padding: "3px 6px",
              marginBottom: 4,
              borderRadius: 4,
              cursor: "pointer",
              fontSize: 11,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {block.title}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Calendar</h1>

      <div style={{ marginBottom: 20 }}>
        <button onClick={() => changeMonth(-1)}>◀</button>
        <span style={{ margin: "0 15px", fontWeight: "bold" }}>
          {currentDate.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </span>
        <button onClick={() => changeMonth(1)}>▶</button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 5,
        }}
      >
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div
            key={d}
            style={{
              fontWeight: "bold",
              textAlign: "center",
              paddingBottom: 5,
            }}
          >
            {d}
          </div>
        ))}

        {days}
      </div>
    </div>
  );
}

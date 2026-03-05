import React from "react";
import { useNavigate } from "react-router-dom";

export default function TopicsPage({ topics }) {
  const navigate = useNavigate();

  // Safely flatten all subcategories
  const allSubCategories = Object.values(topics)
    .flat()
    .filter(Boolean); // removes undefined/null entries

  return (
    <div style={{ padding: 20 }}>
      <h1>Topics</h1>

      {/* Top Navigation */}
      <div style={{ marginBottom: 30 }}>
        <button
          onClick={() => navigate("/topics/manage")}
          style={{ marginRight: 10, padding: "8px 15px", background: "#eee" }}
        >
          Manage Topics
        </button>

        <button
          onClick={() => navigate("/calendar")}
          style={{ marginRight: 10 }}
        >
          Calendar View
        </button>

        <button
          onClick={() => navigate("/morning")}
          style={{ marginRight: 10 }}
        >
          Morning Page
        </button>

        <button
          onClick={() => navigate("/afternoon")}
          style={{ marginRight: 10 }}
        >
          Afternoon Page
        </button>

        <button
          onClick={() => navigate("/work")}
          style={{ marginRight: 10 }}
        >
          Work Page
        </button>

        <button
          onClick={() => navigate("/evening")}
          style={{ marginRight: 10 }}
        >
          evening Page
        </button>


        <button
          onClick={() =>
            navigate(
              `/paperview?categories=${allSubCategories.join(",")}`
            )
          }
          style={{ marginRight: 10, padding: "8px 15px" }}
        >
          Paper View (All Topics)
        </button>

        <button onClick={() => navigate("/paperview/filter")}>
          Filtered Paper View
        </button>
      </div>

      {/* Topic Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 20,
        }}
      >
        {Object.keys(topics).map((topic) => {
          const subCategories = topics[topic].filter(Boolean);

          return (
            <div
              key={topic}
              style={{
                border: "1px solid #ccc",
                borderRadius: 10,
                padding: 20,
                textAlign: "center",
                minHeight: 120,
              }}
            >
              {/* Navigate to Topic Page */}
              <h3
                style={{ cursor: "pointer" }}
                onClick={() =>
                  navigate(`/topic/${encodeURIComponent(topic)}`)
                }
              >
                {topic}
              </h3>

              {/* Per-topic Paper View */}
              <button
                onClick={() =>
                  navigate(
                    `/paperview?categories=${subCategories.join(",")}`
                  )
                }
                style={{
                  marginTop: 10,
                  padding: "5px 10px",
                  fontSize: 12,
                }}
              >
                Paper View
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
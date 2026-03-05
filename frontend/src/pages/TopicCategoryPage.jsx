import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function TopicCategoryPage({ topics }) {
  const { topicName } = useParams();
  const navigate = useNavigate();

  // 🔹 Set browser tab title to current topic
  useEffect(() => {
    if (topicName) {
      document.title = `${topicName} – MyApp`;
      // Or just: document.title = topicName;
    }

    // Optional: reset title when leaving page
    return () => {
      document.title = "MyApp";
    };
  }, [topicName]);

  const categories = topics[topicName] || [];

  return (
    <div style={{ padding: 20 }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: 20 }}>
        ← Back
      </button>

      <h1>{topicName}</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 20,
        }}
      >
        {categories.map((category) => (
          <div
            key={category}
            onClick={() =>
              navigate(`/category/${encodeURIComponent(category)}`)
            }
            style={{
              border: "1px solid #ccc",
              borderRadius: 10,
              padding: 20,
              textAlign: "center",
              cursor: "pointer",
            }}
          >
            <h3>{category}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

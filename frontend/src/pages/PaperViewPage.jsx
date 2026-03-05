// pages/PaperViewPage.jsx
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function PaperViewPage() {
  const [blocks, setBlocks] = useState([]);
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const categoriesParam = searchParams.get("categories");
  const categories = categoriesParam ? categoriesParam.split(",") : [];

  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        let url = `http://localhost:5000/items?`;
        if (categories.length > 0) {
          url += `categories=${categories.map(encodeURIComponent).join(",")}&`;
        }

        const res = await fetch(url);
        const data = await res.json();
        setBlocks(data);
      } catch (err) {
        console.error("Failed to fetch blocks:", err);
      }
    };

    fetchBlocks();
  }, [categories]);

  return (
    <div
      style={{
        maxWidth: 850,
        margin: "0 auto",
        padding: "30px 20px",
        fontFamily: "Georgia, serif",
        fontSize: 14,
        lineHeight: 1.6,
      }}
    >
      <h1 style={{ textAlign: "center", fontSize: 22, marginBottom: 40 }}>
        Paper View
      </h1>

      {blocks.length === 0 && <p>No entries found.</p>}

      {/* Centered paper blocks */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        {blocks.map((block) => (
          <div
            key={block._id}
            style={{
              width: "78%",
              marginBottom: 28,
              padding: "14px 18px",
              background: "#fafafa",
              borderRadius: 6,
            }}
          >
            {/* Topic */}
            <div
              style={{
                fontSize: 11,
                color: "#777",
                letterSpacing: 1,
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              {block.topic}
            </div>

            {/* Subtopic */}
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "#2c3e50",
                marginBottom: 8,
              }}
            >
              {block.category}
            </div>

            {/* Block title */}
            <div
              style={{
                fontSize: 15,
                fontWeight: "bold",
                marginBottom: 10,
              }}
            >
              {block.title || "Untitled Block"}
            </div>

            {/* Items */}
            <ul style={{ paddingLeft: 22, margin: 0 }}>
              {block.items.map((item) => (
                <li
                  key={item._id}
                  style={{
                    marginBottom: 6,
                    fontSize: 13,
                  }}
                >
                  {item.text}
                  <span style={{ marginLeft: 6, fontSize: 11, color: "#999" }}>
                    {new Date(item.date).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

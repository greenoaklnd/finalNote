import React, { useEffect, useState } from "react";

export default function WorkPage() {
  const workStructure = [
    { topic: "Self", category: "Self|calls", label: "Calls" },
    { topic: "Self", category: "Self|notes", label: "Notes" },
    { topic: "Work", category: "Work|env", label: "Environment" },
  ];

  const [blocks, setBlocks] = useState({});
  const [newText, setNewText] = useState({});

  useEffect(() => {
    const fetchBlocks = async () => {
      const results = await Promise.all(
        workStructure.map(async (item) => {
          const res = await fetch(
            `http://localhost:5000/blocks/by-category/${encodeURIComponent(
              item.category
            )}`
          );
          const data = await res.json();
          return [item.category, data];
        })
      );
      setBlocks(Object.fromEntries(results));
    };

    fetchBlocks();
  }, []);

  const handleAddItem = async (category) => {
    const block = blocks[category];
    if (!block || !newText[category]) return;

    const res = await fetch(
      `http://localhost:5000/blocks/${block._id}/items`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newText[category] }),
      }
    );

    const updated = await res.json();
    setBlocks((prev) => ({ ...prev, [updated.category]: updated }));
    setNewText((prev) => ({ ...prev, [category]: "" }));
  };

  return (
    <div
      style={{
        padding: 30,
        display: "flex",
        gap: 30,
        flexWrap: "wrap",
      }}
    >
      {workStructure.map((item) => {
        const block = blocks[item.category];

        return (
          <div
            key={item.category}
            style={{
              flex: "0 0 320px",
              padding: 24,
              borderRadius: 18,
              background: "#ffffff",
              boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            {/* Big Label */}
            <h2
              style={{
                fontSize: 28,
                fontWeight: 700,
                margin: 0,
              }}
            >
              {item.label}
            </h2>

            {/* Existing notes */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {block?.items?.map((note) => (
                <div
                  key={note._id}
                  style={{
                    fontSize: 15,
                    padding: "6px 0",
                  }}
                >
                  {note.text}
                </div>
              ))}
            </div>

            {/* Input */}
            <input
              type="text"
              placeholder="Add note..."
              value={newText[item.category] || ""}
              onChange={(e) =>
                setNewText((prev) => ({
                  ...prev,
                  [item.category]: e.target.value,
                }))
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddItem(item.category);
              }}
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "1px solid #ddd",
                fontSize: 14,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
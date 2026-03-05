import React, { useEffect, useState } from "react";

export default function MorningPage() {
  const morningStructure = [
    { topic: "Self", category: "Current/schedule", label: "daily overview" },
    { topic: "Self", category: "PTT", label: "working" },
    { topic: "Self", category: "interruptions/transitions/ideas/tasks", label: "Interruptions" },
    { topic: "God", category: "prayer", label: "prayer & thanks" },
    { topic: "study", category: "audio", label: " podcasts/Audio" },
    { topic: "Self", category: "food", label: "meals" },
    { topic: "Self", category: "P&P", label: "house" },
    { topic: "Self", category: "interruptions/transitions/ideas/tasks", label: "Transitions" },
    { topic: "Family", category: "Baby", label: "M & Joshua" },
    { topic: "Self", category: "blue", label: "blue" },
    { topic: "Family", category: "dad", label: "pops" },
    { topic: "Self", category: "Work Enviornment", label: " work enviorment" },
    { topic: "Money", category: "Purchases", label: "expenses" },
    { topic: "God", category: "study", label: "God notes & questions" },
  ];

  const [blocks, setBlocks] = useState({});
  const [newText, setNewText] = useState({}); // store input per block

  // Fetch or create block for each category
  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        const results = await Promise.all(
          morningStructure.map(async (item) => {
            const res = await fetch(
              `http://localhost:5000/blocks/by-category/${encodeURIComponent(
                item.category
              )}`
            );
            const text = await res.text();
            let data;
            try {
              data = JSON.parse(text);
            } catch (err) {
              console.error("Failed to parse JSON:", err);
              data = null;
            }
            return [item.category, data];
          })
        );
        setBlocks(Object.fromEntries(results));
      } catch (err) {
        console.error("Error fetching blocks:", err);
      }
    };

    fetchBlocks();
  }, []);

  // Add a new item
  const handleAddItem = async (category) => {
    const block = blocks[category];
    if (!block || !newText[category]) return;

    try {
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
      setNewText((prev) => ({ ...prev, [category]: "" })); // clear input
    } catch (err) {
      console.error("Failed to add item:", err);
    }
  };

  return (
    <div
      style={{
        padding: 20,
        display: "flex",
        gap: 20,
        flexWrap: "wrap",
        justifyContent: "flex-start",
      }}
    >
      {morningStructure.map((item) => {
        const block = blocks[item.category];

        return (
          <div
            key={item.category}
            style={{
              flex: "0 0 300px",
              padding: 24,
              borderRadius: 16,
              background: "#fefefe",
              boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {/* Only the label */}
            <h2
              style={{
                fontSize: 32,
                fontWeight: "700",
                marginBottom: 0,
                textAlign: "center",
                color: "#222",
              }}
            >
              {item.label}
            </h2>

            {/* Input box for new entry */}
            <input
              type="text"
              placeholder="Add an entry..."
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
                padding: "12px 16px",
                borderRadius: 12,
                border: "1px solid #ccc",
                fontSize: 16,
              }}
            />

            {/* Optional add button */}
            <button
              onClick={() => handleAddItem(item.category)}
              style={{
                padding: "10px",
                borderRadius: 12,
                border: "none",
                background: "#007bff",
                color: "#fff",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Add
            </button>
          </div>
        );
      })}
    </div>
  );
}
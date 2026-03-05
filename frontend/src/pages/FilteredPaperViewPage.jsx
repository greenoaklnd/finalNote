import React, { useState } from "react";

export default function FilteredPaperViewPage({ topics }) {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [blocks, setBlocks] = useState([]);

  const toggleCategory = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const fetchData = async () => {
    const params = new URLSearchParams();

    if (selectedCategories.length) {
      params.append("categories", selectedCategories.join(","));
    }
    if (from) params.append("from", from);
    if (to) params.append("to", to);

    const res = await fetch(`http://localhost:5000/items?${params}`);
    const data = await res.json();
    setBlocks(data);
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 20 }}>
      <h1>Filtered Paper View</h1>

      {/* Topic → Subtopic selection */}
      <div style={{ marginBottom: 30 }}>
        {Object.entries(topics).map(([topic, categories]) => (
          <div key={topic} style={{ marginBottom: 15 }}>
            <div style={{ fontWeight: "bold", fontSize: 14, marginBottom: 6 }}>
              {topic}
            </div>

            <div style={{ marginLeft: 15, display: "flex", flexWrap: "wrap", gap: 12 }}>
              {categories.map((cat) => (
                <label key={cat} style={{ fontSize: 13 }}>
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat)}
                    onChange={() => toggleCategory(cat)}
                  />{" "}
                  {cat}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Date filters */}
      <div style={{ marginBottom: 20 }}>
        <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        {"  "}
        <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
      </div>

      <button onClick={fetchData}>View Paper</button>

      {/* Paper output */}
      <div style={{ marginTop: 40, fontSize: 13 }}>
        {blocks.map((block) => (
          <div key={block._id} style={{ marginBottom: 25 }}>
            <div style={{ fontWeight: "bold", marginBottom: 4 }}>
              {block.category}
            </div>

            <div style={{ marginLeft: 15, fontStyle: "italic", marginBottom: 4 }}>
              {block.title}
            </div>

            <ul style={{ marginLeft: 35 }}>
              {block.items.map((item) => (
                <li key={item._id}>{item.text}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

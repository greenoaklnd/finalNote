import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Block from "../components/Block";

export default function CategoryPage() {
  const { category } = useParams();
  const navigate = useNavigate();
  const [blocks, setBlocks] = useState([]);
  const [newBlockTitle, setNewBlockTitle] = useState("");

  // ✅ Set browser tab title to category ONLY
  useEffect(() => {
    if (category) {
      document.title = category;
    }
  }, [category]);

  // 🔹 Fetch blocks
  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/blocks?category=${encodeURIComponent(category)}`
        );
        const data = await res.json();
        setBlocks(data);
      } catch (err) {
        console.error("Failed to load blocks:", err);
      }
    };

    fetchBlocks();
  }, [category]);

  // --- Block operations ---
  const addBlock = async () => {
    if (!newBlockTitle.trim()) return;

    const res = await fetch("http://localhost:5000/blocks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category, title: newBlockTitle, items: [] }),
    });

    const savedBlock = await res.json();
    setBlocks((prev) => [savedBlock, ...prev]);
    setNewBlockTitle("");
  };

  const updateBlock = async (blockId, title) => {
    const res = await fetch(`http://localhost:5000/blocks/${blockId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });

    const updatedBlock = await res.json();
    setBlocks((prev) =>
      prev.map((b) => (b._id === blockId ? updatedBlock : b))
    );
  };

  const deleteBlock = async (blockId) => {
    await fetch(`http://localhost:5000/blocks/${blockId}`, {
      method: "DELETE",
    });

    setBlocks((prev) => prev.filter((b) => b._id !== blockId));
  };

  const addItem = async (blockId, text) => {
    if (!text.trim()) return;

    const res = await fetch(
      `http://localhost:5000/blocks/${blockId}/items`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      }
    );

    const updatedBlock = await res.json();
    setBlocks((prev) =>
      prev.map((b) => (b._id === blockId ? updatedBlock : b))
    );
  };

  const editItem = async (blockId, itemId, text) => {
    const res = await fetch(
      `http://localhost:5000/blocks/${blockId}/items/${itemId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      }
    );

    const updatedBlock = await res.json();
    setBlocks((prev) =>
      prev.map((b) => (b._id === blockId ? updatedBlock : b))
    );
  };

  const deleteItem = async (blockId, itemId) => {
    const res = await fetch(
      `http://localhost:5000/blocks/${blockId}/items/${itemId}`,
      { method: "DELETE" }
    );

    const updatedBlock = await res.json();
    setBlocks((prev) =>
      prev.map((b) => (b._id === blockId ? updatedBlock : b))
    );
  };

  return (
    <div style={{ padding: 20 }}>
      <button
        onClick={() => navigate(-1)}
        style={{ marginBottom: 20 }}
      >
        ← Back
      </button>

      <h1>{category}</h1>

      {/* New Block Input */}
      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="New block title"
          value={newBlockTitle}
          onChange={(e) => setNewBlockTitle(e.target.value)}
          style={{ width: "70%", padding: 5, marginRight: 10 }}
        />
        <button onClick={addBlock}>Add Block</button>
      </div>

      {/* Render Blocks */}
      {blocks.length === 0 && (
        <p style={{ fontStyle: "italic" }}>No blocks yet.</p>
      )}

      {blocks.map((block) => (
        <Block
          key={block._id}
          block={block}
          onUpdateBlock={updateBlock}
          onDeleteBlock={deleteBlock}
          onAddItem={addItem}
          onEditItem={editItem}
          onDeleteItem={deleteItem}
        />
      ))}
    </div>
  );
}

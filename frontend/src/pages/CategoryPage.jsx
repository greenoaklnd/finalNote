import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Block from "../components/Block";
import { API_URL } from "../api";

export default function CategoryPage() {
  const { category } = useParams();
  const navigate = useNavigate();
  const [blocks, setBlocks] = useState([]);
  const [newBlockTitle, setNewBlockTitle] = useState("");

  // --- Fetch blocks from backend ---
  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        const res = await fetch(
          `${API_URL}/blocks?category=${encodeURIComponent(category)}`
        );
        const data = await res.json();
        setBlocks(data);
      } catch (err) {
        console.error("Failed to fetch blocks:", err);
        setBlocks([]);
      }
    };

    fetchBlocks();
  }, [category]);

  // --- Add Block ---
  const addBlock = async () => {
    if (!newBlockTitle.trim()) return;

    const block = {
      title: newBlockTitle,
      category,
      items: [],
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await fetch(`${API_URL}/blocks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(block),
      });

      const savedBlock = await res.json();
      setBlocks((prev) => [savedBlock, ...prev]);
      setNewBlockTitle("");
    } catch (err) {
      console.error("Failed to add block:", err);
    }
  };

  // --- Update Block ---
  const updateBlock = async (blockId, title) => {
    try {
      const res = await fetch(`${API_URL}/blocks/${blockId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });

      const updatedBlock = await res.json();
      setBlocks((prev) =>
        prev.map((b) => (b._id === blockId ? updatedBlock : b))
      );
    } catch (err) {
      console.error("Failed to update block:", err);
    }
  };

  // --- Delete Block ---
  const deleteBlock = async (blockId) => {
    try {
      await fetch(`${API_URL}/blocks/${blockId}`, { method: "DELETE" });
      setBlocks((prev) => prev.filter((b) => b._id !== blockId));
    } catch (err) {
      console.error("Failed to delete block:", err);
    }
  };

  // --- Add Item ---
  const addItem = async (blockId, text) => {
    if (!text.trim()) return;

    try {
      const res = await fetch(`${API_URL}/blocks/${blockId}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const updatedBlock = await res.json();
      setBlocks((prev) =>
        prev.map((b) => (b._id === blockId ? updatedBlock : b))
      );
    } catch (err) {
      console.error("Failed to add item:", err);
    }
  };

  // --- Edit Item ---
  const editItem = async (blockId, itemId, text) => {
    try {
      const res = await fetch(
        `${API_URL}/blocks/${blockId}/items/${itemId}`,
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
    } catch (err) {
      console.error("Failed to edit item:", err);
    }
  };

  // --- Delete Item ---
  const deleteItem = async (blockId, itemId) => {
    try {
      const res = await fetch(
        `${API_URL}/blocks/${blockId}/items/${itemId}`,
        { method: "DELETE" }
      );

      const updatedBlock = await res.json();
      setBlocks((prev) =>
        prev.map((b) => (b._id === blockId ? updatedBlock : b))
      );
    } catch (err) {
      console.error("Failed to delete item:", err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <button onClick={() => navigate(-1)}>← Back</button>

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

      {/* Blocks List */}
      {blocks.length === 0 && <p style={{ fontStyle: "italic" }}>No blocks yet.</p>}

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
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Block from "../components/Block";
import { API_URL } from "../api";
import { db } from "../db"; // Dexie local DB

export default function CategoryPage() {
  const { category } = useParams();
  const navigate = useNavigate();
  const [blocks, setBlocks] = useState([]);
  const [newBlockTitle, setNewBlockTitle] = useState("");
  const [deferredPrompt, setDeferredPrompt] = useState(null); // PWA install prompt

  // ✅ Set browser tab title to category
  useEffect(() => {
    if (category) document.title = category;
  }, [category]);

  // 🔹 Fetch blocks from backend, fallback to local DB if offline
  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        const res = await fetch(
          `${API_URL}/blocks?category=${encodeURIComponent(category)}`
        );
        const data = await res.json();
        setBlocks(data);
      } catch (err) {
        console.error("Offline or failed to fetch blocks:", err);
        // Fallback: load blocks and items from local DB
        const localBlocks = await db.blocks
          .where("category")
          .equals(category)
          .toArray();
        for (const block of localBlocks) {
          block.items = await db.items
            .where("blockId")
            .equals(block._id)
            .toArray();
        }
        setBlocks(localBlocks);
      }
    };

    fetchBlocks();
  }, [category]);

  // --- Block operations ---
  const addBlock = async () => {
    if (!newBlockTitle.trim()) return;

    const block = {
      _id: crypto.randomUUID(),
      category,
      title: newBlockTitle,
      items: [],
    };

    // Save locally
    await db.blocks.add(block);

    // Update UI immediately
    setBlocks((prev) => [block, ...prev]);
    setNewBlockTitle("");

    // Try syncing to backend
    try {
      const res = await fetch(`${API_URL}/blocks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, title: newBlockTitle, items: [] }),
      });
      const savedBlock = await res.json();
      // Update local DB with real _id from backend
      await db.blocks.update(block._id, { _id: savedBlock._id });
      setBlocks((prev) =>
        prev.map((b) => (b._id === block._id ? savedBlock : b))
      );
    } catch (err) {
      console.log("Offline, will sync new block later:", err);
    }
  };

  const updateBlock = async (blockId, title) => {
    setBlocks((prev) =>
      prev.map((b) => (b._id === blockId ? { ...b, title } : b))
    );
    await db.blocks.update(blockId, { title });

    try {
      await fetch(`${API_URL}/blocks/${blockId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
    } catch (err) {
      console.log("Offline, block title will sync later:", err);
    }
  };

  const deleteBlock = async (blockId) => {
    setBlocks((prev) => prev.filter((b) => b._id !== blockId));
    await db.blocks.delete(blockId);
    await db.items.where("blockId").equals(blockId).delete();

    try {
      await fetch(`${API_URL}/blocks/${blockId}`, { method: "DELETE" });
    } catch (err) {
      console.log("Offline, block deletion will sync later:", err);
    }
  };

  // --- Item operations ---
  const addItem = async (blockId, text) => {
    if (!text.trim()) return;

    const item = {
      _id: crypto.randomUUID(),
      blockId,
      text,
      date: new Date().toISOString(),
      synced: false,
    };

    // Save locally
    await db.items.add(item);

    // Update UI
    setBlocks((prev) =>
      prev.map((b) =>
        b._id === blockId ? { ...b, items: [...b.items, item] } : b
      )
    );

    // Try syncing
    syncItem(item);
  };

  const editItem = async (blockId, itemId, text) => {
    setBlocks((prev) =>
      prev.map((b) => ({
        ...b,
        items: b._id === blockId
          ? b.items.map((i) => (i._id === itemId ? { ...i, text } : i))
          : b.items,
      }))
    );
    await db.items.update(itemId, { text, synced: false });
    const item = await db.items.get(itemId);
    syncItem(item);
  };

  const deleteItem = async (blockId, itemId) => {
    setBlocks((prev) =>
      prev.map((b) => ({
        ...b,
        items: b._id === blockId ? b.items.filter((i) => i._id !== itemId) : b.items,
      }))
    );
    await db.items.delete(itemId);

    try {
      await fetch(`${API_URL}/blocks/${blockId}/items/${itemId}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.log("Offline, item deletion will sync later:", err);
    }
  };

  // --- Sync function ---
  const syncItem = async (item) => {
    try {
      const res = await fetch(`${API_URL}/blocks/${item.blockId}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: item.text }),
      });
      const updatedBlock = await res.json();
      await db.items.update(item._id, { synced: true });

      setBlocks((prev) =>
        prev.map((b) => (b._id === item.blockId ? updatedBlock : b))
      );
    } catch (err) {
      console.log("Offline, will sync later:", err);
    }
  };

  // --- Sync pending items when online ---
  useEffect(() => {
    const syncPending = async () => {
      const pending = await db.items.where("synced").equals(false).toArray();
      for (const item of pending) {
        await syncItem(item);
      }
    };

    syncPending();
    window.addEventListener("online", syncPending);
    return () => window.removeEventListener("online", syncPending);
  }, []);

  // --- PWA Install prompt ---
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () =>
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    console.log("PWA install choice:", choice.outcome);
    setDeferredPrompt(null);
  };

  return (
    <div style={{ padding: 20 }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: 20 }}>
        ← Back
      </button>

      {/* PWA Install Button */}
      {deferredPrompt && (
        <button
          onClick={handleInstallClick}
          style={{ marginBottom: 20, padding: "8px 15px", background: "#ffd700" }}
        >
          Install App
        </button>
      )}

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
import React, { useState, useRef } from "react";

// small helper – keeps dates subtle and consistent
const formatDate = (d) =>
  new Date(d).toLocaleDateString(undefined, {
    weekday: "short",
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
  });

export default function Block({
  block,
  onUpdateBlock,
  onDeleteBlock,
  onAddItem,
  onEditItem,
  onDeleteItem,
}) {
  const [newItemText, setNewItemText] = useState("");
  const saveTimeouts = useRef({});

  // 🔥 debounce save
  const handleInput = (blockId, itemId, html) => {
    clearTimeout(saveTimeouts.current[itemId]);

    saveTimeouts.current[itemId] = setTimeout(() => {
      onEditItem(blockId, itemId, html);
    }, 500);
  };

  // 🔥 keyboard shortcuts
  const handleKeyDown = (e) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === "b") {
        e.preventDefault();
        document.execCommand("bold");
      }
      if (e.key === "u") {
        e.preventDefault();
        document.execCommand("underline");
      }
      if (e.key === "i") {
        e.preventDefault();
        document.execCommand("italic");
      }
    }
  };

  // 🔥 format old notes safely
  const formatContent = (text) => {
    if (!text) return "";
    if (text.includes("<")) return text; // already HTML
    return text.replace(/\n/g, "<br>");
  };

  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: 10,
        padding: 14,
        marginBottom: 18,
      }}
    >
      {/* Block title */}
      <input
        type="text"
        value={block.title}
        onChange={(e) => onUpdateBlock(block._id, e.target.value)}
        style={{
          fontWeight: "bold",
          fontSize: 16,
          width: "100%",
          border: "none",
          outline: "none",
          marginBottom: 4,
        }}
      />

      {/* Block date */}
      {block.createdAt && (
        <div style={{ fontSize: 11, color: "#aaa", marginBottom: 10 }}>
          {formatDate(block.createdAt)}
        </div>
      )}

      {/* 🔥 Items */}
      <ul style={{ paddingLeft: 20 }}>
        {block.items.map((item) => (
          <li key={item._id} style={{ marginBottom: 16 }}>
            <div
              contentEditable
              suppressContentEditableWarning
              onInput={(e) =>
                handleInput(
                  block._id,
                  item._id,
                  e.currentTarget.innerHTML
                )
              }
              onKeyDown={handleKeyDown}
              ref={(el) => {
                if (el && el.innerHTML !== formatContent(item.text)) {
                  el.innerHTML = formatContent(item.text);
                }
              }}
              style={{
                width: "100%",
                minHeight: 140,
                padding: 12,
                fontSize: 14,
                lineHeight: 1.6,
                border: "1px solid #ddd",
                borderRadius: 6,
                overflowY: "auto",
              }}
            />

            {/* Item date */}
            {item.date && (
              <div
                style={{
                  fontSize: 10,
                  color: "#bbb",
                  textAlign: "right",
                  marginTop: 2,
                }}
              >
                {formatDate(item.date)}
              </div>
            )}

            <div style={{ marginTop: 4 }}>
              <button onClick={() => onDeleteItem(block._id, item._id)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Add item */}
      <div style={{ marginTop: 12 }}>
        <textarea
          placeholder="Write a new entry…"
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          style={{
            width: "100%",
            minHeight: 100,
            padding: 8,
            resize: "vertical",
            fontSize: 14,
          }}
        />
        <button
          onClick={() => {
            onAddItem(block._id, newItemText);
            setNewItemText("");
          }}
          style={{ marginTop: 6 }}
        >
          Add Item
        </button>
      </div>

      {/* Delete block */}
      <div style={{ textAlign: "right", marginTop: 10 }}>
        <button
          onClick={() => onDeleteBlock(block._id)}
          style={{ fontSize: 11, color: "#888" }}
        >
          Delete Block
        </button>
      </div>
    </div>
  );
}
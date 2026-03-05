import React, { useState } from "react";

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
  const [editingItemId, setEditingItemId] = useState(null);
  const [editingText, setEditingText] = useState("");

  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: 10,
        padding: 12,
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
          fontSize: 15,
          width: "100%",
          border: "none",
          outline: "none",
          marginBottom: 2,
        }}
      />

      {/* Block date (very subtle) */}
      {block.createdAt && (
        <div style={{ fontSize: 10, color: "#aaa", marginBottom: 10 }}>
          {formatDate(block.createdAt)}
        </div>
      )}

      {/* Items */}
      <ul style={{ paddingLeft: 20 }}>
        {block.items.map((item) => (
          <li key={item._id} style={{ marginBottom: 14 }}>
            {editingItemId === item._id ? (
              <>
                <textarea
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  rows={3}
                  style={{
                    width: "100%",
                    padding: 6,
                    resize: "vertical",
                  }}
                />
                <button
                  onClick={() => {
                    onEditItem(block._id, item._id, editingText);
                    setEditingItemId(null);
                  }}
                  style={{ marginTop: 4 }}
                >
                  Save
                </button>
              </>
            ) : (
              <>
                <div style={{ whiteSpace: "pre-wrap", fontSize: 14 }}>
                  {item.text}
                </div>

                {/* Item date – almost invisible unless you look */}
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
                  <button
                    onClick={() => {
                      setEditingItemId(item._id);
                      setEditingText(item.text);
                    }}
                    style={{ marginRight: 6 }}
                  >
                    Edit
                  </button>
                  <button onClick={() => onDeleteItem(block._id, item._id)}>
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>

      {/* Add item – large writing area */}
      <div style={{ marginTop: 12 }}>
        <textarea
          placeholder="Write a new entry…"
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          rows={4}
          style={{
            width: "100%",
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

      {/* Delete block (kept low-key) */}
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

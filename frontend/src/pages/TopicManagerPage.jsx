import React, { useState } from "react";

export default function TopicManagerPage({ topics, setTopics }) {
  const [newTopic, setNewTopic] = useState("");
  const [newCategory, setNewCategory] = useState({});
  const [editingTopic, setEditingTopic] = useState(null);
  const [editingCategory, setEditingCategory] = useState({ topic: null, category: null });

  const handleAddTopic = () => {
    if (!newTopic.trim()) return;
    setTopics({ ...topics, [newTopic]: [] });
    setNewTopic("");
  };

  const handleRenameTopic = (oldName, newName) => {
    if (!newName.trim() || topics[newName]) return; // avoid empty or duplicate
    const updated = { ...topics };
    updated[newName] = updated[oldName];
    delete updated[oldName];
    setTopics(updated);
    setEditingTopic(null);
  };

  const handleDeleteTopic = (topic) => {
    const updated = { ...topics };
    delete updated[topic];
    setTopics(updated);
  };

  const handleAddCategory = (topic) => {
    const catName = newCategory[topic]?.trim();
    if (!catName) return;
    if (topics[topic].includes(catName)) return;
    setTopics({ ...topics, [topic]: [...topics[topic], catName] });
    setNewCategory({ ...newCategory, [topic]: "" });
  };

  const handleRenameCategory = (topic, oldName, newName) => {
    if (!newName.trim() || topics[topic].includes(newName)) return;
    const updated = { ...topics };
    updated[topic] = updated[topic].map((cat) => (cat === oldName ? newName : cat));
    setTopics(updated);
    setEditingCategory({ topic: null, category: null });
  };

  const handleDeleteCategory = (topic, category) => {
    const updated = { ...topics };
    updated[topic] = updated[topic].filter((cat) => cat !== category);
    setTopics(updated);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Manage Topics & Categories</h1>

      {/* Add new topic */}
      <div style={{ marginBottom: 20 }}>
        <input
          placeholder="New Topic"
          value={newTopic}
          onChange={(e) => setNewTopic(e.target.value)}
          style={{ marginRight: 10 }}
        />
        <button onClick={handleAddTopic}>Add Topic</button>
      </div>

      {/* List topics */}
      {Object.keys(topics).map((topic) => (
        <div key={topic} style={{ marginBottom: 20, border: "1px solid #ccc", borderRadius: 10, padding: 10 }}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
            {editingTopic === topic ? (
              <>
                <input
                  value={editingTopic.newName || topic}
                  onChange={(e) => setEditingTopic({ ...editingTopic, newName: e.target.value })}
                  style={{ marginRight: 6 }}
                />
                <button onClick={() => handleRenameTopic(topic, editingTopic.newName)}>Save</button>
                <button onClick={() => setEditingTopic(null)} style={{ marginLeft: 5 }}>Cancel</button>
              </>
            ) : (
              <>
                <strong>{topic}</strong>
                <button onClick={() => setEditingTopic({ oldName: topic, newName: topic })} style={{ marginLeft: 10 }}>Rename</button>
                <button onClick={() => handleDeleteTopic(topic)} style={{ marginLeft: 5 }}>Delete</button>
              </>
            )}
          </div>

          {/* Categories */}
          <div style={{ marginLeft: 20 }}>
            {topics[topic].map((cat) => (
              <div key={cat} style={{ marginBottom: 4 }}>
                {editingCategory.topic === topic && editingCategory.category === cat ? (
                  <>
                    <input
                      value={editingCategory.newName || cat}
                      onChange={(e) => setEditingCategory({ ...editingCategory, newName: e.target.value })}
                      style={{ marginRight: 6 }}
                    />
                    <button onClick={() => handleRenameCategory(topic, cat, editingCategory.newName)}>Save</button>
                    <button onClick={() => setEditingCategory({ topic: null, category: null })}>Cancel</button>
                  </>
                ) : (
                  <>
                    {cat}
                    <button onClick={() => setEditingCategory({ topic, category: cat, newName: cat })} style={{ marginLeft: 10 }}>Rename</button>
                    <button onClick={() => handleDeleteCategory(topic, cat)} style={{ marginLeft: 5 }}>Delete</button>
                  </>
                )}
              </div>
            ))}

            {/* Add new category */}
            <div style={{ marginTop: 6 }}>
              <input
                placeholder="New Category"
                value={newCategory[topic] || ""}
                onChange={(e) => setNewCategory({ ...newCategory, [topic]: e.target.value })}
                style={{ marginRight: 6 }}
              />
              <button onClick={() => handleAddCategory(topic)}>Add</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

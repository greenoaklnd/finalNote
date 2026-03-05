import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// --- Connect to MongoDB ---
mongoose.connect("mongodb://127.0.0.1:27017/finalNote", {
  // no need for useNewUrlParser or useUnifiedTopology in latest mongoose
})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// --- Schemas ---
const itemSchema = new mongoose.Schema({
  text: { type: String, required: true },
  date: { type: Date, default: Date.now }, // timestamp for each item
});

const blockSchema = new mongoose.Schema({
  category: { type: String, required: true },
  title: { type: String, required: true },
  items: [itemSchema],
  createdAt: { type: Date, default: Date.now }, // timestamp for the block itself
});

const Block = mongoose.model("Block", blockSchema);

// --- Helpers ---
const startOfToday = () => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
};

const endOfToday = () => {
  const now = new Date();
  now.setHours(23, 59, 59, 999);
  return now;
};

// --- Routes ---

// Get all blocks by category query
app.get("/blocks", async (req, res) => {
  const { category } = req.query;
  try {
    const blocks = await Block.find({ category }).sort({ createdAt: -1 });
    res.json(blocks);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch blocks" });
  }
});

// Get or create today's block by category (ensures MorningPage always has a block)
app.get("/blocks/by-category/:category", async (req, res) => {
  const { category } = req.params;

  try {
    let block = await Block.findOne({
      category,
      createdAt: { $gte: startOfToday(), $lt: endOfToday() },
    });

    if (!block) {
      block = await Block.create({
        title: category,
        category,
        items: [],
        createdAt: new Date(),
      });
    }

    res.json(block);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch or create block" });
  }
});

// Get block by ID
app.get("/blocks/:id", async (req, res) => {
  try {
    const block = await Block.findById(req.params.id);
    if (!block) return res.status(404).json({ error: "Block not found" });
    res.json(block);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch block" });
  }
});

//get block by..
app.get("/blocks/by-category-topic/:category/:topic", async (req, res) => {
  const { category, topic } = req.params;

  try {
    let block = await Block.findOne({
      category,
      topic,
      createdAt: { $gte: startOfToday(), $lt: endOfToday() },
    });

    if (!block) {
      block = await Block.create({
        title: topic,
        category,
        topic,
        items: [],
        createdAt: new Date(),
      });
    }

    res.json(block);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch block" });
  }
});

// Create a new block
app.post("/blocks", async (req, res) => {
  try {
    const block = new Block(req.body);
    await block.save();
    res.json(block);
  } catch (err) {
    res.status(500).json({ error: "Failed to create block" });
  }
});

// Add an item to a block
app.post("/blocks/:id/items", async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  try {
    const block = await Block.findById(id);
    if (!block) return res.status(404).json({ error: "Block not found" });
    block.items.push({ text });
    await block.save();
    res.json(block);
  } catch (err) {
    res.status(500).json({ error: "Failed to add item" });
  }
});

// Update block title
app.put("/blocks/:id", async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  try {
    const block = await Block.findByIdAndUpdate(
      id,
      { title },
      { new: true } // return updated block
    );
    if (!block) return res.status(404).json({ error: "Block not found" });
    res.json(block);
  } catch (err) {
    res.status(500).json({ error: "Failed to update block" });
  }
});

// Update an item
app.put("/blocks/:blockId/items/:itemId", async (req, res) => {
  const { blockId, itemId } = req.params;
  const { text } = req.body;
  try {
    const block = await Block.findById(blockId);
    if (!block) return res.status(404).json({ error: "Block not found" });

    const item = block.items.id(itemId);
    if (!item) return res.status(404).json({ error: "Item not found" });

    item.text = text;
    await block.save();
    res.json(block);
  } catch (err) {
    res.status(500).json({ error: "Failed to update item" });
  }
});

// Delete a block
app.delete("/blocks/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await Block.findByIdAndDelete(id);
    res.json({ message: "Block deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete block" });
  }
});

// Delete an item from a block
app.delete("/blocks/:blockId/items/:itemId", async (req, res) => {
  const { blockId, itemId } = req.params;
  try {
    const block = await Block.findById(blockId);
    if (!block) return res.status(404).json({ error: "Block not found" });

    const item = block.items.id(itemId);
    if (!item) return res.status(404).json({ error: "Item not found" });

    item.remove();
    await block.save();
    res.json(block);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete item" });
  }
});

// paperview (date or topic)
app.get("/items", async (req, res) => {
  const { categories, from, to } = req.query;

  try {
    let filter = {};
    if (categories) {
      filter.category = { $in: categories.split(",") };
    }

    const blocks = await Block.find(filter).sort({ createdAt: -1 });

    const fromDate = from ? new Date(from) : null;
    const toDate = to ? new Date(to) : null;

    const filteredBlocks = blocks
      .map((block) => {
        const items = block.items.filter((item) => {
          const d = new Date(item.date);
          if (fromDate && d < fromDate) return false;
          if (toDate && d > toDate) return false;
          return true;
        });

        if (items.length === 0) return null;
        return { ...block.toObject(), items };
      })
      .filter(Boolean);

    res.json(filteredBlocks);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch items" });
  }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
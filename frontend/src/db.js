import Dexie from "dexie";

export const db = new Dexie("finalNote");

db.version(2).stores({
  blocks: "&_id, category, title, createdAt",
  items: "&_id, blockId, text, date, synced",
});
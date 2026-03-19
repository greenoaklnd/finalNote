import Dexie from "dexie";

export const db = new Dexie("FinalNoteDB");

// Define tables and include `synced` flags
db.version(2).stores({
  blocks: "_id, category, title, synced",        // blocks stored locally with synced flag
  items: "_id, blockId, text, date, synced"     // items stored locally with synced flag
});
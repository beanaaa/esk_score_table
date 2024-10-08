import { openDB } from 'idb'

const dbName = 'ESKScoreDB'
const storeName = 'scores'

const initDB = async () => {
  const db = await openDB(dbName, 1, {
    upgrade(db) {
      const store = db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
      store.createIndex('uploadId', 'uploadId');
    },
  })
  return db
}

export const addScore = async (score: any) => {
  const db = await initDB()
  await db.add(storeName, score)
}

export const getScores = async () => {
  const db = await initDB()
  return db.getAll(storeName)
}

export const removeScoresBatch = async (uploadId: string) => {
  const db = await initDB()
  const tx = db.transaction(storeName, 'readwrite')
  const store = tx.objectStore(storeName)
  const index = store.index('uploadId')

  let cursor = await index.openCursor(uploadId)

  while (cursor) {
    await cursor.delete()
    cursor = await cursor.continue()
  }

  await tx.done
}
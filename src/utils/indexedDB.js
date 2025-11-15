const DB_NAME = 'playnite-games-db'
const DB_VERSION = 1
const STORE_NAME = 'games'

/**
 * Open or create the IndexedDB database
 */
function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)

    request.onupgradeneeded = (event) => {
      const db = event.target.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'Id' })
      }
    }
  })
}

/**
 * Save games array to IndexedDB
 */
export async function saveGamesToIndexedDB(games) {
  try {
    const db = await openDatabase()
    const transaction = db.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)

    // Clear existing games
    await new Promise((resolve, reject) => {
      const clearRequest = store.clear()
      clearRequest.onsuccess = () => resolve()
      clearRequest.onerror = () => reject(clearRequest.error)
    })

    // Add all games
    const addPromises = games.map(game => {
      return new Promise((resolve, reject) => {
        const addRequest = store.add(game)
        addRequest.onsuccess = () => resolve()
        addRequest.onerror = () => reject(addRequest.error)
      })
    })

    await Promise.all(addPromises)
    await new Promise((resolve) => {
      transaction.oncomplete = () => resolve()
    })

    return true
  } catch (error) {
    console.error('Error saving games to IndexedDB:', error)
    throw error
  }
}

/**
 * Load all games from IndexedDB
 */
export async function loadGamesFromIndexedDB() {
  try {
    const db = await openDatabase()
    const transaction = db.transaction([STORE_NAME], 'readonly')
    const store = transaction.objectStore(STORE_NAME)

    return new Promise((resolve, reject) => {
      const request = store.getAll()
      request.onsuccess = () => resolve(request.result || [])
      request.onerror = () => reject(request.error)
    })
  } catch (error) {
    // If database doesn't exist or is empty, return empty array
    if (error.name === 'NotFoundError' || error.name === 'InvalidStateError') {
      return []
    }
    console.error('Error loading games from IndexedDB:', error)
    throw error
  }
}

/**
 * Clear all games from IndexedDB
 */
export async function clearGamesFromIndexedDB() {
  try {
    const db = await openDatabase()
    const transaction = db.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)

    return new Promise((resolve, reject) => {
      const clearRequest = store.clear()
      clearRequest.onsuccess = () => resolve()
      clearRequest.onerror = () => reject(clearRequest.error)
    })
  } catch (error) {
    console.error('Error clearing games from IndexedDB:', error)
    throw error
  }
}

/**
 * Check if IndexedDB is available in the browser
 */
export function isIndexedDBAvailable() {
  return typeof indexedDB !== 'undefined'
}


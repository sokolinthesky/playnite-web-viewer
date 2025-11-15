import { useState, useMemo, useEffect } from 'react'
import FileUpload from './components/FileUpload'
import SearchBar from './components/SearchBar'
import GameList from './components/GameList'
import { loadGamesFromJSON } from './utils/gameUtils'
import { loadGamesFromIndexedDB, saveGamesToIndexedDB, clearGamesFromIndexedDB, isIndexedDBAvailable } from './utils/indexedDB'

function App() {
  const [games, setGames] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingFromDB, setIsLoadingFromDB] = useState(true)

  // Load games from IndexedDB on mount
  useEffect(() => {
    const loadStoredGames = async () => {
      if (!isIndexedDBAvailable()) {
        setIsLoadingFromDB(false)
        return
      }

      try {
        const storedGames = await loadGamesFromIndexedDB()
        if (storedGames.length > 0) {
          setGames(storedGames)
        }
      } catch (error) {
        console.error('Error loading games from IndexedDB:', error)
      } finally {
        setIsLoadingFromDB(false)
      }
    }

    loadStoredGames()
  }, [])

  const handleFileLoad = async (file) => {
    setIsLoading(true)
    try {
      const loadedGames = await loadGamesFromJSON(file)
      setGames(loadedGames)
      setSearchQuery('') // Reset search when loading new file
      
      // Save to IndexedDB
      if (isIndexedDBAvailable()) {
        try {
          await saveGamesToIndexedDB(loadedGames)
        } catch (error) {
          console.error('Error saving games to IndexedDB:', error)
          // Don't block the UI if saving fails
        }
      }
    } catch (error) {
      console.error('Error loading games:', error)
      alert('Error loading games file. Please check the file format.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearGames = async () => {
    if (!confirm('Are you sure you want to clear all stored games?')) {
      return
    }

    try {
      if (isIndexedDBAvailable()) {
        await clearGamesFromIndexedDB()
      }
      setGames([])
      setSearchQuery('')
    } catch (error) {
      console.error('Error clearing games:', error)
      alert('Error clearing games from storage.')
    }
  }

  const filteredGames = useMemo(() => {
    if (!searchQuery.trim()) {
      return games
    }
    
    const query = searchQuery.toLowerCase()
    return games.filter(game => 
      game.Name?.toLowerCase().includes(query)
    )
  }, [games, searchQuery])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-10 bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Playnite Game Viewer
          </h1>
          <FileUpload onFileLoad={handleFileLoad} isLoading={isLoading} />
          {games.length > 0 && (
            <SearchBar 
              value={searchQuery}
              onChange={setSearchQuery}
              resultCount={filteredGames.length}
              totalCount={games.length}
            />
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-4">
        {isLoadingFromDB && (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading stored games...</p>
          </div>
        )}

        {!isLoadingFromDB && games.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Upload a Playnite games JSON file to get started
            </p>
          </div>
        )}
        
        {isLoading && (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading games...</p>
          </div>
        )}

        {games.length > 0 && (
          <>
            <div className="mb-4 flex justify-end">
              <button
                onClick={handleClearGames}
                className="px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                Clear All Games
              </button>
            </div>
            <GameList games={filteredGames} />
          </>
        )}
      </div>
    </div>
  )
}

export default App



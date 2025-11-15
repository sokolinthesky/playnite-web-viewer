import { useVirtualizer } from '@tanstack/react-virtual'
import { useRef, useMemo, useState, useEffect } from 'react'
import { formatPlaytime, getPlatformNames } from '../utils/gameUtils'

function GameList({ games }) {
  const parentRef = useRef(null)
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024)

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Calculate estimated size based on screen width
  // Mobile (< 640px): more vertical space needed for stacked layout
  // Desktop (>= 640px): less vertical space needed for horizontal layout
  const estimatedSize = useMemo(() => {
    const isMobile = windowWidth < 640
    // Base size: title (24px) + padding (24px) + platforms (32px) + margins (16px)
    // Mobile needs more space due to playtime badge on same line
    return isMobile ? 110 : 95
  }, [windowWidth])

  const minHeight = useMemo(() => {
    const isMobile = windowWidth < 640
    return isMobile ? '110px' : '95px'
  }, [windowWidth])

  const virtualizer = useVirtualizer({
    count: games.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimatedSize,
    overscan: 5,
  })

  if (games.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No games found</p>
      </div>
    )
  }

  return (
    <div
      ref={parentRef}
      className="h-[calc(100vh-200px)] overflow-auto"
      style={{ contain: 'strict' }}
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const game = games[virtualItem.index]
          return (
            <div
              key={virtualItem.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
                minHeight: minHeight,
              }}
            >
              <div className="px-4 py-3 border-b border-gray-200 hover:bg-gray-50 transition-colors h-full flex flex-col justify-center">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 flex-wrap mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 break-words leading-tight">
                        {game.Name || 'Unknown Game'}
                      </h3>
                      <div className="flex-shrink-0 sm:hidden">
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                          {formatPlaytime(game.Playtime)}
                        </span>
                      </div>
                    </div>
                    {getPlatformNames(game.Platforms) && (
                      <div className="flex flex-wrap gap-2 mt-1">
                        {getPlatformNames(game.Platforms).map((platformName, index) => (
                          <span 
                            key={index}
                            className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                          >
                            {platformName}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex-shrink-0 hidden sm:block">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {formatPlaytime(game.Playtime)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default GameList



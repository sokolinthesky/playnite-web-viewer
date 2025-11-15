export async function loadGamesFromJSON(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target.result)
        if (Array.isArray(json)) {
          resolve(json)
        } else {
          reject(new Error('JSON file must contain an array of games'))
        }
      } catch (error) {
        reject(error)
      }
    }
    
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file)
  })
}

export function formatPlaytime(seconds) {
  if (!seconds || seconds === 0) {
    return '0h'
  }
  
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  
  if (hours > 0 && minutes > 0) {
    return `${hours}h ${minutes}m`
  } else if (hours > 0) {
    return `${hours}h`
  } else {
    return `${minutes}m`
  }
}

export function getPlatformNames(platforms) {
  if (!platforms) {
    return null
  }
  
  // Handle array of platform objects
  if (Array.isArray(platforms)) {
    const names = platforms
      .map(platform => {
        if (typeof platform === 'string') {
          return platform
        }
        if (typeof platform === 'object' && platform.Name) {
          return platform.Name
        }
        return null
      })
      .filter(name => name !== null)
    
    return names.length > 0 ? names : null
  }
  
  // Handle single platform object or string (for backwards compatibility)
  if (typeof platforms === 'string') {
    return [platforms]
  }
  
  if (typeof platforms === 'object' && platforms.Name) {
    return [platforms.Name]
  }
  
  return null
}



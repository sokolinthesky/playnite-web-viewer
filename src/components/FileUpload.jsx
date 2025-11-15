import { useRef } from 'react'

function FileUpload({ onFileLoad, isLoading }) {
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file && file.type === 'application/json') {
      onFileLoad(file)
    } else {
      alert('Please select a valid JSON file')
    }
  }

  return (
    <div className="mb-4">
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        disabled={isLoading}
        className="hidden"
        id="file-upload"
      />
      <label
        htmlFor="file-upload"
        className={`
          inline-block px-4 py-2 rounded-lg cursor-pointer transition-colors
          ${isLoading 
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
            : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
          }
        `}
      >
        {isLoading ? 'Loading...' : 'Upload Games JSON'}
      </label>
    </div>
  )
}

export default FileUpload



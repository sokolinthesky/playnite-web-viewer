# Playnite Web Viewer

A mobile-optimized web application for viewing and searching your Playnite game library.

## Features

- 📁 Import games from Playnite JSON database files
- 🔍 Search games by name
- ⏱️ Display game playtime
- 📱 Mobile-optimized responsive design
- ⚡ Virtual scrolling for handling large game libraries efficiently

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **@tanstack/react-virtual** - Virtual scrolling for performance
- **Fuse.js** - Advanced search capabilities (ready for future enhancements)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5173`)

4. Upload your Playnite games JSON file using the "Upload Games JSON" button

## Usage

1. Click "Upload Games JSON" and select your Playnite database JSON file
2. Once loaded, use the search bar to filter games by name
3. Scroll through the list to view all games with their playtime

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
playnite-web-viewer/
├── src/
│   ├── components/
│   │   ├── FileUpload.jsx    # File upload component
│   │   ├── SearchBar.jsx     # Search input component
│   │   └── GameList.jsx      # Virtual scrolling game list
│   ├── utils/
│   │   └── gameUtils.js      # Game data utilities
│   ├── App.jsx               # Main app component
│   ├── main.jsx              # Entry point
│   └── index.css             # Global styles
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

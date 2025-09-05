# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# Impressto Podcast Player

A React podcast player to list some of the latest poscasts I've generated with NotebookLM.

## Features

- 🎵 **Multi-format Support**: Play MP3, M4A, WAV, and other common audio formats
- 📁 **File Upload**: Drag and drop or browse to upload multiple audio files
- 🎛️ **Full Controls**: Play, pause, stop, volume control, and seeking
- 📋 **Playlist Management**: Organized track list with current song highlighting
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🎨 **Modern UI**: Clean, intuitive interface with smooth animations

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository or navigate to the project directory
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app in your browser.

### Building for Production

Create an optimized production build:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Usage

1. **Upload Audio Files**: Click "Add Audio Files" button to upload one or more audio files
2. **Select Track**: Click on any track in the playlist to load it
3. **Control Playback**: Use the play/pause/stop buttons to control audio playback
4. **Adjust Volume**: Use the volume slider to control audio level
5. **Seek**: Click on the progress bar to jump to any position in the track

## Supported Audio Formats

- MP3 (audio/mpeg)
- M4A (audio/mp4)
- WAV (audio/wav)
- OGG (audio/ogg)
- AAC (audio/aac)

## Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety and better development experience
- **Vite** - Fast build tool and development server
- **HTML5 Audio API** - Native audio playback
- **CSS3** - Modern styling with animations

## Project Structure

```
src/
├── components/         # React components
│   ├── AudioPlayer.tsx # Main audio player controls
│   └── Playlist.tsx    # Track list and file upload
├── hooks/             # Custom React hooks
│   └── useAudioPlayer.ts # Audio player logic
├── types/             # TypeScript type definitions
│   └── audio.ts       # Audio-related types
├── App.tsx            # Main application component
├── App.css            # Application styles
└── index.css          # Global styles
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

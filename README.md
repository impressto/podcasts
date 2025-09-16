# Impressto Podcast Player

A React podcast player to list some of the latest podcasts I've generated with NotebookLM.

![player](https://github.com/user-attachments/assets/ef9fce87-5360-445e-81e0-27bd4793b574)

## Features

- 🎵 **Multi-format Support**: Play MP3, M4A, WAV, and other common audio formats
- 📁 **JSON Configuration**: Easy track management via external tracks.json file
- 🎛️ **Full Controls**: Play, pause, stop, volume control, and seeking
- ⌨️ **Keyboard Shortcuts**: Control playback using keyboard shortcuts
- 📋 **Playlist Management**: Organized track list with current song highlighting
- 🔄 **Loading Indicators**: Visual feedback for buffering and loading states
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🎨 **Modern UI**: Clean, intuitive interface with smooth animations
- 🌐 **Environment Configuration**: Easily configurable via environment variables
- 🔗 **Direct Track Links**: Share links to specific tracks using URL hash
- 🚫 **Error Handling**: Graceful handling of playback errors and browser restrictions

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

Open [http://localhost:5173/homelab/](http://localhost:5173/homelab/) to view the app in your browser.

### Environment Configuration

Create a `.env` file in the root directory to configure the application:

```
# URL for the tracks.json file
VITE_APP_IMPRESSTO_TRACKS_URL=https://impressto.ca/podcasts/public/tracks.json
```

For development, you can use a local URL:
```
VITE_APP_IMPRESSTO_TRACKS_URL=/homelab/tracks.json
```

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

1. **Track Configuration**: Edit the `public/tracks.json` file to add or modify tracks
2. **Select Track**: Click on any track in the playlist to load it
3. **Control Playback**: Use the play/pause/stop buttons to control audio playback
4. **Adjust Volume**: Use the volume slider to control audio level
5. **Seek**: Click on the progress bar to jump to any position in the track
6. **Keyboard Controls**: 
   - Space: Play/Pause
   - Left/Right Arrow: Previous/Next track
   - Up/Down Arrow: Volume control

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
/
├── public/
│   ├── tracks.json      # Track configuration file
│   └── vite.svg         # Vite logo
├── src/
│   ├── components/      # React components
│   │   ├── AudioPlayer.tsx # Main audio player controls
│   │   └── Playlist.tsx    # Track list component
│   ├── hooks/           # Custom React hooks
│   │   └── useAudioPlayer.ts # Audio player logic
│   ├── types/           # TypeScript type definitions
│   │   └── audio.ts     # Audio-related types
│   ├── App.tsx          # Main application component
│   ├── App.css          # Application styles
│   └── index.css        # Global styles
└── .env                 # Environment configuration
```

## JSON Configuration Format

The `tracks.json` file follows this format:

```json
[
  {
    "id": "preloaded-1",
    "title": "Track Title",
    "artist": "Artist Name",
    "src": "https://example.com/audio/track.m4a"
  },
  ...
]
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

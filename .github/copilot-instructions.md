# Copilot Instructions for Audio Player React App

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is a React TypeScript audio player application that allows users to browse and play audio files from a playlist. The app supports various audio formats including M4A files.

## Technology Stack
- React 18 with TypeScript
- Vite for build tooling
- HTML5 Audio API for audio playback
- Modern CSS for styling

## Key Features
- Audio file playlist management
- Play/pause/stop controls
- Volume control
- Progress bar with seeking
- Support for M4A, MP3, WAV, and other common audio formats
- Responsive design

## Code Style Guidelines
- Use functional components with hooks
- Prefer TypeScript interfaces for type definitions
- Use CSS modules or styled-components for styling
- Follow React best practices for state management
- Implement proper error handling for audio loading/playback
- Use semantic HTML elements for accessibility

## Audio Implementation Notes
- Use the HTML5 Audio API through useRef for audio control
- Handle audio events (loadstart, canplay, timeupdate, ended, error)
- Implement proper cleanup in useEffect hooks
- Support for various audio MIME types (audio/mp4, audio/mpeg, audio/wav)

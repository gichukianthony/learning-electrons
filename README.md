# 📝 Electron Notes App

A cross-platform desktop Notes application built with Electron, React, TypeScript, and Vite.

## Features

- Cross-platform (Windows, macOS, Linux)
- Modern React UI with TypeScript
- Light/Dark theme toggle
- Local file storage
- Search functionality
- Desktop notifications
- Responsive design

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Start development mode:
```bash
npm run electron-dev
```

3. Build for distribution:
```bash
npm run dist
```

## Scripts

- `npm run electron-dev` - Start development mode
- `npm run build` - Build the app
- `npm run dist` - Create distributable packages
- `npm run dist-win` - Windows installer
- `npm run dist-mac` - macOS package
- `npm run dist-linux` - Linux package

## Project Structure

- `electron/` - Electron main process
- `src/` - React renderer process
- `src/components/` - React components
- `src/types/` - TypeScript types

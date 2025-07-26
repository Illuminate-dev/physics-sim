# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `npm run dev` - starts Vite development server
- **Build**: `npm run build` - builds for production using Vite
- **Preview**: `npm run preview` - preview production build locally

### Using tmux for Background Development

Always use tmux for running the development server

```bash
# Start a new tmux session for development
tmux new-session -d -s physics-sim

# Attach to the session
tmux attach-session -t physics-sim

# Inside tmux, start the development server
npm run dev

# Detach from session (Ctrl+b, then d) to keep server running in background
# Reattach anytime with: tmux attach-session -t physics-sim
# List sessions: tmux list-sessions
# Kill session: tmux kill-session -t physics-sim
```

## Architecture Overview

This is a 3D physics circuit simulator built with Three.js and Vite. The application visualizes electrical circuits in 3D space with interactive components.

### Core Structure

In **src/**:

- **main.js**: Application entry point, sets up Three.js scene, camera, renderer, and controls. Creates the test circuit and handles UI interactions.
- **Circuit.js**: Contains all circuit-related classes:
  - `Circuit`: Main circuit container that manages nodes and rendering
  - `Node`: Represents connection points in the circuit
  - `Component` (base class): Abstract component with label rendering and animation
  - `Resistor`, `Capacitor`, `Battery`: Specific electrical components with unique visual representations
- **util.js**: Utility functions, primarily `newLine()` for creating Three.js line objects
- **style.css**: Modern dark theme with professional UI styling

### Key Technical Details

- Uses Three.js Line2, LineGeometry, and LineMaterial for enhanced line rendering
- CSS2DRenderer for component labels that scale with camera distance
- MapControls for intuitive 3D navigation
- Components are positioned along connection lines with calculated spacing
- Visual representations: resistors as zigzag lines, capacitors as parallel plates, batteries as multiple vertical lines

### Circuit System

- Circuits are built by creating nodes and connecting them with components
- Each node can have multiple forward connections to other nodes
- Components are drawn between nodes with automatic spacing and positioning
- Labels show component values (resistance in Ω, capacitance in C, voltage in V)

### UI Features

- Sidebar with Start/Stop/Reset Camera buttons (Start/Stop currently commented out)
- Responsive design that adjusts canvas size based on window dimensions
- Grid background for spatial reference
- Component labels that scale based on camera zoom level

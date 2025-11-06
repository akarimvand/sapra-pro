# Sapra Pro AI Agent Instructions

## Project Overview
Sapra Pro is a professional AI prompt generator for image creation, built with vanilla JavaScript and a glass-morphic UI. The application helps users generate detailed AI image prompts through a structured, multi-step process.

## Architecture Overview

### Core Components
- `app.js` - Main application logic and state management
- `index.html` - Single page application structure with responsive design
- `data/*.json` - Configuration files for various prompt options

### Data Flow
1. All configuration data is loaded from JSON files in the `data/` directory on startup
2. User selections are stored in the `selections` object
3. Prompt generation happens progressively across 7 distinct pages/sections

### Key Design Patterns
- **Page-based Navigation**: Uses `currentPage` state to manage wizard-like interface
- **Dynamic Form Generation**: Forms are generated from the `pages` array configuration
- **Smart Filtering**: Context-aware options based on previous selections
- **Theme Management**: Dark/Light mode with CSS variables and class-based styling

## Development Workflows

### Local Development
1. Place project in XAMPP's `htdocs` directory
2. Access via `http://localhost/sapra-pro/`
3. No build process required - direct browser refresh for changes

### Adding New Prompt Options
1. Create/modify corresponding JSON file in `data/` directory
2. Add field configuration in `pages` array in `app.js`
3. Update UI filtering logic if needed

### Data File Structure
JSON files in `data/` follow this pattern:
```json
[
  {
    "id": "unique_id",
    "label": "Display Label",
    "value": "prompt_text"
  }
]
```

## Project Conventions

### Code Style
- Use camelCase for variable and function names
- JSON files use snake_case for filenames
- CSS uses Tailwind utility classes with custom material design extensions

### State Management
- Global state is managed through top-level variables in `app.js`
- Each page's state is stored in the `selections` object
- Use `isPresetMode`/`isEditMode` flags for special UI states

### Localization
- UI is primarily in Persian (RTL)
- Prompts are generated in English
- Translation support via `isTranslated` flag

## Integration Points
- Vanta.js for 3D backgrounds
- Three.js for advanced animations
- Font Awesome for iconography
- Google Fonts for typography (Vazirmatn font family)

## Common Tasks
- To add a new prompt category: Add JSON file to `data/` and update `pages` array
- To modify styling: Update Tailwind classes in `index.html`
- To change animations: Modify Vanta.js configuration in loading screen
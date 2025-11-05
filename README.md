 Dynamic Data Table Manager

A comprehensive data table management application built with Next.js, Redux Toolkit, and Material UI.

 Features

 Core Features 
-Table View: Display data with Name, Email, Age, Role columns
 Sorting: Click column headers to sort (ASC/DESC toggle)
- Global Search: Search across all fields
- Pagination: Client-side pagination (10 rows per page)
- Dynamic Columns: Add new fields and show/hide columns
- Persistence: Column visibility saved in localStorage via Redux Persist
- *Import CSV: Upload and parse CSV files with error handling
- Export CSV: Export current table view to CSV (visible columns only)

      Bonus Features 
- Inline Editing: Double-click cells to edit, with validation
- Row Actions: Edit and Delete buttons with confirmation
- Theme Toggle: Light/Dark mode with MUI theming
- Responsive Design: Fully responsive layout
- Save/Cancel All: Batch operations for editing

      Tech Stack

- React 18 / Next.js 14 (App Router)
- Redux Toolkit for state management
- Material UI v5 for components
- TypeScript for type safety
- PapaParse for CSV parsing
- FileSaver.js for CSV export
- Redux Persist for data persistence

Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

Usage

    Basic Operations
- Search: Use the search bar to filter data across all columns
- Sort: Click column headers to sort data
- Navigate: Use pagination controls at the bottom

         Column Management
- Click "Manage Columns" to open the column manager
- Toggle column visibility with checkboxes
- Add new columns by typing a name and clicking "Add"

 Import/Export
- Import: Click "Import CSV" to upload a CSV file
- Export: Click "Export CSV" to download current data

Inline Editing
- Edit Single: Double-click any cell to edit inline
- Edit Multiple: Click edit button for row-level editing
- Batch Operations: Use "Save All" or "Cancel All" for multiple edits
- Delete: Click delete button with confirmation dialog

Theme
- Toggle between light and dark themes using the theme button in the header

Project Structure

```
src/
├── app/                 # Next.js app router
├── components/          # React components
├── store/              # Redux store and slices
├── types/              # TypeScript interfaces
└── utils/              # Utility functions
```

Data Validation

- Age fields are automatically converted to numbers
- CSV import includes error handling for malformed data
- Form validation for inline editing
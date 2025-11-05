export interface TableRow {
  id: string;
  name: string;
  email: string;
  age: number;
  role: string;
  [key: string]: any;
}

export interface Column {
  id: string;
  label: string;
  visible: boolean;
  sortable: boolean;
}

export interface TableState {
  data: TableRow[];
  columns: Column[];
  searchTerm: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  page: number;
  rowsPerPage: number;
  editingRows: string[];
}

export interface AppState {
  table: TableState;
  theme: 'light' | 'dark';
}
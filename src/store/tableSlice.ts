import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TableState, TableRow, Column } from '@/types';

const defaultColumns: Column[] = [
  { id: 'name', label: 'Name', visible: true, sortable: true },
  { id: 'email', label: 'Email', visible: true, sortable: true },
  { id: 'age', label: 'Age', visible: true, sortable: true },
  { id: 'role', label: 'Role', visible: true, sortable: true },
];

const initialData: TableRow[] = [
  { id: '1', name: 'bonsan fuad ', email: 'bonsan@example.com', age: 30, role: 'Developer' },
  { id: '2', name: 'Borifan Dabasa', email: 'borifan@example.com', age: 25, role: 'Designer' },
  { id: '3', name: 'boka korjo', email: 'bokaexample.com', age: 35, role: 'Manager' },
];

const initialState: TableState = {
  data: initialData,
  columns: defaultColumns,
  searchTerm: '',
  sortBy: '',
  sortOrder: 'asc',
  page: 0,
  rowsPerPage: 10,
  editingRows: [],
};

const tableSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<TableRow[]>) => {
      state.data = action.payload;
    },
    addRow: (state, action: PayloadAction<TableRow>) => {
      state.data.push(action.payload);
    },
    updateRow: (state, action: PayloadAction<{ id: string; data: Partial<TableRow> }>) => {
      const index = state.data.findIndex(row => row.id === action.payload.id);
      if (index !== -1) {
        state.data[index] = { ...state.data[index], ...action.payload.data };
      }
    },
    deleteRow: (state, action: PayloadAction<string>) => {
      state.data = state.data.filter(row => row.id !== action.payload);
    },
    setColumns: (state, action: PayloadAction<Column[]>) => {
      state.columns = action.payload;
    },
    toggleColumnVisibility: (state, action: PayloadAction<string>) => {
      const column = state.columns.find(col => col.id === action.payload);
      if (column) {
        column.visible = !column.visible;
      }
    },
    addColumn: (state, action: PayloadAction<Column>) => {
      state.columns.push(action.payload);
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
      state.page = 0;
    },
    setSorting: (state, action: PayloadAction<{ sortBy: string; sortOrder: 'asc' | 'desc' }>) => {
      state.sortBy = action.payload.sortBy;
      state.sortOrder = action.payload.sortOrder;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    toggleEditRow: (state, action: PayloadAction<string>) => {
      const index = state.editingRows.indexOf(action.payload);
      if (index > -1) {
        state.editingRows.splice(index, 1);
      } else {
        state.editingRows.push(action.payload);
      }
    },
    clearEditingRows: (state) => {
      state.editingRows = [];
    },
  },
});

export const {
  setData,
  addRow,
  updateRow,
  deleteRow,
  setColumns,
  toggleColumnVisibility,
  addColumn,
  setSearchTerm,
  setSorting,
  setPage,
  toggleEditRow,
  clearEditingRows,
} = tableSlice.actions;

export default tableSlice.reducer;
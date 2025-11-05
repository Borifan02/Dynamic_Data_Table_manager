'use client';

import React, { useMemo, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  IconButton,
  TextField,
  Tooltip,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  ArrowUpward,
  ArrowDownward,
  Edit,
  Delete,
  Save,
  Cancel,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import {
  setSorting,
  setPage,
  updateRow,
  deleteRow,
  toggleEditRow,
  clearEditingRows,
} from '@/store/tableSlice';
import { TableRow as TableRowType } from '@/types';

const DataTable: React.FC = () => {
  const dispatch = useDispatch();
  const { data, columns, searchTerm, sortBy, sortOrder, page, rowsPerPage, editingRows } = useSelector(
    (state: RootState) => state.table
  );
  
  // Safety check for editingRows - handle legacy data from localStorage
  const editingRowsArray = Array.isArray(editingRows) ? editingRows : [];
  
  const [editValues, setEditValues] = useState<Record<string, Partial<TableRowType>>>({});
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; rowId: string | null }>({
    open: false,
    rowId: null,
  });
  const [validationError, setValidationError] = useState<string | null>(null);

  const visibleColumns = columns.filter(col => col.visible);

  // Memoized filtering and sorting to avoid unnecessary re-renders
  const filteredAndSortedData = useMemo(() => {
    // Filter data based on search term
    let filtered = data.filter(row =>
      Object.values(row).some(value =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    if (sortBy) {
      filtered.sort((a, b) => {
        const aVal = a[sortBy];
        const bVal = b[sortBy];
        
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
        }
        
        const aStr = aVal?.toString() || '';
        const bStr = bVal?.toString() || '';
        return sortOrder === 'asc' 
          ? aStr.localeCompare(bStr)
          : bStr.localeCompare(aStr);
      });
    }

    return filtered;
  }, [data, searchTerm, sortBy, sortOrder]);

  const paginatedData = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredAndSortedData.slice(start, start + rowsPerPage);
  }, [filteredAndSortedData, page, rowsPerPage]);

  const handleSort = (columnId: string) => {
    const newOrder = sortBy === columnId && sortOrder === 'asc' ? 'desc' : 'asc';
    dispatch(setSorting({ sortBy: columnId, sortOrder: newOrder }));
  };

  const handleEdit = (rowId: string) => {
    dispatch(toggleEditRow(rowId));
    const row = data.find(r => r.id === rowId);
    if (row) {
      setEditValues(prev => ({ ...prev, [rowId]: { ...row } }));
    }
  };

  const handleSave = (rowId: string) => {
    const values = editValues[rowId];
    if (values) {
      dispatch(updateRow({ id: rowId, data: values }));
    }
    dispatch(toggleEditRow(rowId));
  };

  const handleCancel = (rowId: string) => {
    dispatch(toggleEditRow(rowId));
    setEditValues(prev => {
      const newValues = { ...prev };
      delete newValues[rowId];
      return newValues;
    });
  };

  const handleDelete = (rowId: string) => {
    setDeleteDialog({ open: true, rowId });
  };

  const confirmDelete = () => {
    if (deleteDialog.rowId) {
      dispatch(deleteRow(deleteDialog.rowId));
    }
    setDeleteDialog({ open: false, rowId: null });
  };

  const handleCellChange = (rowId: string, field: string, value: any) => {
    // Validate age field - must be numeric
    if (field === 'age') {
      if (value && isNaN(Number(value))) {
        setValidationError('Age must be a number');
        return;
      }
    }
    setEditValues(prev => ({
      ...prev,
      [rowId]: {
        ...prev[rowId],
        [field]: field === 'age' ? parseInt(value) || 0 : value,
      },
    }));
  };

  const handleSaveAll = () => {
    Object.entries(editValues).forEach(([rowId, values]) => {
      dispatch(updateRow({ id: rowId, data: values }));
    });
    dispatch(clearEditingRows());
    setEditValues({});
  };

  const handleCancelAll = () => {
    dispatch(clearEditingRows());
    setEditValues({});
  };

  return (
    <>
      <TableContainer component={Paper} sx={{ overflowX: 'auto', borderRadius: 2 }}>
        {editingRowsArray.length > 0 && (
          <div style={{ padding: '16px', borderBottom: '1px solid #e0e0e0', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <Button onClick={handleSaveAll} variant="contained" size="small">
              Save All
            </Button>
            <Button onClick={handleCancelAll} variant="outlined" size="small">
              Cancel All
            </Button>
          </div>
        )}
        
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              {visibleColumns.map((column) => (
                <TableCell key={column.id} sx={{ fontWeight: 600, backgroundColor: 'action.hover' }}>
                  <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', whiteSpace: 'nowrap', userSelect: 'none' }}
                       onClick={() => column.sortable && handleSort(column.id)}>
                    {column.label}
                    {column.sortable && sortBy === column.id && (
                      sortOrder === 'asc' ? <ArrowUpward fontSize="small" sx={{ ml: 0.5 }} /> : <ArrowDownward fontSize="small" sx={{ ml: 0.5 }} />
                    )}
                  </div>
                </TableCell>
              ))}
              <TableCell sx={{ fontWeight: 600, backgroundColor: 'action.hover' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row) => {
              const isEditing = editingRowsArray.includes(row.id);
              return (
                <TableRow key={row.id} sx={{ '&:hover': { backgroundColor: 'action.hover' }, transition: 'background-color 0.2s' }}>
                  {visibleColumns.map((column) => (
                    <TableCell key={column.id}>
                      {isEditing ? (
                        <TextField
                          size="small"
                          type={column.id === 'age' ? 'number' : 'text'}
                          value={editValues[row.id]?.[column.id] || ''}
                          onChange={(e) => handleCellChange(row.id, column.id, e.target.value)}
                        />
                      ) : (
                        <span onDoubleClick={() => handleEdit(row.id)}>
                          {row[column.id]}
                        </span>
                      )}
                    </TableCell>
                  ))}
                  <TableCell>
                    {isEditing ? (
                      <>
                        <Tooltip title="Save">
                          <IconButton onClick={() => handleSave(row.id)} size="small">
                            <Save />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Cancel">
                          <IconButton onClick={() => handleCancel(row.id)} size="small">
                            <Cancel />
                          </IconButton>
                        </Tooltip>
                      </>
                    ) : (
                      <>
                        <Tooltip title="Edit">
                          <IconButton onClick={() => handleEdit(row.id)} size="small">
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton onClick={() => handleDelete(row.id)} size="small">
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        
        <TablePagination
          component="div"
          count={filteredAndSortedData.length}
          page={page}
          onPageChange={(_, newPage) => dispatch(setPage(newPage))}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[10]}
        />
      </TableContainer>

      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, rowId: null })}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this row?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, rowId: null })}>Cancel</Button>
          <Button onClick={confirmDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!validationError}
        autoHideDuration={3000}
        onClose={() => setValidationError(null)}
      >
        <Alert severity="error" onClose={() => setValidationError(null)}>
          {validationError}
        </Alert>
      </Snackbar>
    </>
  );
};

export default DataTable;
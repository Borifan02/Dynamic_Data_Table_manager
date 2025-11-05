'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControlLabel,
  Checkbox,
  TextField,
  Box,
  Typography,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { toggleColumnVisibility, addColumn } from '@/store/tableSlice';
import { Column } from '@/types';

interface ColumnManagerProps {
  open: boolean;
  onClose: () => void;
}

const ColumnManager: React.FC<ColumnManagerProps> = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const columns = useSelector((state: RootState) => state.table.columns);
  const [newColumnName, setNewColumnName] = useState('');

  const handleToggleColumn = (columnId: string) => {
    dispatch(toggleColumnVisibility(columnId));
  };

  const handleAddColumn = () => {
    if (newColumnName.trim()) {
      const newColumn: Column = {
        id: newColumnName.toLowerCase().replace(/\s+/g, '_'),
        label: newColumnName,
        visible: true,
        sortable: true,
      };
      dispatch(addColumn(newColumn));
      setNewColumnName('');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
      <DialogTitle sx={{ fontWeight: 600 }}>⚙️ Manage Columns</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
            👁️ Column Visibility
          </Typography>
          {columns.map((column) => (
            <FormControlLabel
              key={column.id}
              control={
                <Checkbox
                  checked={column.visible}
                  onChange={() => handleToggleColumn(column.id)}
                />
              }
              label={column.label}
            />
          ))}
        </Box>
        
        <Box>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
            ➕ Add New Column
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <TextField
              size="small"
              placeholder="Column name (e.g., Department, Location)"
              value={newColumnName}
              onChange={(e) => setNewColumnName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddColumn()}
              sx={{ flexGrow: 1 }}
            />
            <Button variant="contained" onClick={handleAddColumn} disabled={!newColumnName.trim()}>
              Add
            </Button>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ColumnManager;
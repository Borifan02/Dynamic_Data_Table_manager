'use client';

import React, { useRef, useState } from 'react';
import {
  Button,
  Box,
  Alert,
  Snackbar,
} from '@mui/material';
import { Upload, Download } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { setData } from '@/store/tableSlice';
import { parseCSV, exportToCSV } from '@/utils/csvUtils';

const ImportExport: React.FC = () => {
  const dispatch = useDispatch();
  const { data, columns } = useSelector((state: RootState) => state.table);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const importedData = await parseCSV(file);
      dispatch(setData(importedData));
      setSuccess(`Successfully imported ${importedData.length} rows`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import CSV');
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleExport = () => {
    try {
      exportToCSV(data, columns);
      setSuccess('Data exported successfully');
    } catch (err) {
      setError('Failed to export data');
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
      <input
        type="file"
        accept=".csv"
        onChange={handleImport}
        ref={fileInputRef}
        style={{ display: 'none' }}
      />
      
      <Button
        variant="outlined"
        startIcon={<Upload />}
        onClick={() => fileInputRef.current?.click()}
        size="small"
        sx={{ 
          borderRadius: 2,
          '&:hover': { transform: 'translateY(-2px)', boxShadow: 2 },
          transition: 'all 0.2s'
        }}
      >
        📄 Import CSV
      </Button>
      
      <Button
        variant="outlined"
        startIcon={<Download />}
        onClick={handleExport}
        size="small"
        sx={{ 
          borderRadius: 2,
          '&:hover': { transform: 'translateY(-2px)', boxShadow: 2 },
          transition: 'all 0.2s'
        }}
      >
        💾 Export CSV
      </Button>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={3000}
        onClose={() => setSuccess(null)}
      >
        <Alert severity="success" onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ImportExport;
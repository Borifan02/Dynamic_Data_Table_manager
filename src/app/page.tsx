'use client';

import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  AppBar,
  Toolbar,
  Button,
} from '@mui/material';
import { Settings } from '@mui/icons-material';
import DataTable from '@/components/DataTable';
import SearchBar from '@/components/SearchBar';
import ColumnManager from '@/components/ColumnManager';
import ImportExport from '@/components/ImportExport';
import ThemeToggle from '@/components/ThemeToggle';

export default function Home() {
  const [columnManagerOpen, setColumnManagerOpen] = useState(false);

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Dynamic Data Table Manager
          </Typography>
          <ThemeToggle />
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4, px: { xs: 2, sm: 3 } }}>
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
            <Typography variant="h4" component="h1" sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' } }}>
              Data Table
            </Typography>
            <Button
              variant="contained"
              startIcon={<Settings />}
              onClick={() => setColumnManagerOpen(true)}
            >
              Manage Columns
            </Button>
          </Box>
          
          <SearchBar />
          <ImportExport />
        </Box>
        
        <DataTable />
        
        <ColumnManager
          open={columnManagerOpen}
          onClose={() => setColumnManagerOpen(false)}
        />
      </Container>
    </>
  );
}
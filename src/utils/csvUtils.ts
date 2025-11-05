import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import { TableRow, Column } from '@/types';

export const parseCSV = (file: File): Promise<TableRow[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          reject(new Error(`CSV parsing error: ${results.errors[0].message}`));
          return;
        }
        
        const data = results.data.map((row: any, index: number) => ({
          id: `imported-${Date.now()}-${index}`,
          ...row,
          age: row.age ? parseInt(row.age) || 0 : 0,
        })) as TableRow[];
        
        resolve(data);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
};

export const exportToCSV = (data: TableRow[], columns: Column[], filename: string = 'table-data.csv') => {
  const visibleColumns = columns.filter(col => col.visible);
  const headers = visibleColumns.map(col => col.label);
  
  const csvData = data.map(row => 
    visibleColumns.reduce((acc, col) => {
      acc[col.label] = row[col.id] || '';
      return acc;
    }, {} as Record<string, any>)
  );
  
  const csv = Papa.unparse({
    fields: headers,
    data: csvData,
  });
  
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, filename);
};
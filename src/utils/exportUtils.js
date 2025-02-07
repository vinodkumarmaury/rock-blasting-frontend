import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

export const exportToExcel = (data, fileName = 'export.xlsx') => {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const dataBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(dataBlob, fileName);
};

export const exportToCSV = (data, fileName = 'export.csv') => {
  const replacer = (key, value) => value === null ? '' : value;
  const header = Object.keys(data[0]);
  let csv = data.map(row => header.map(fieldName => 
    JSON.stringify(row[fieldName], replacer)).join(','));
  csv.unshift(header.join(','));
  csv = csv.join('\r\n');
  
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, fileName);
};

export const exportToPDF = async (data, fileName = 'export.pdf') => {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(16);
  doc.text('Blasting Prediction Report', 20, 20);
  
  // Add data
  doc.setFontSize(12);
  let yPos = 40;
  
  Object.entries(data).forEach(([key, value]) => {
    if (yPos > 280) {
      doc.addPage();
      yPos = 20;
    }
    doc.text(`${key}: ${value}`, 20, yPos);
    yPos += 10;
  });
  
  doc.save(fileName);
};

export const formatDataForExport = (predictions) => {
  return {
    timestamp: new Date().toISOString(),
    ...predictions.input_data,
    ...Object.entries(predictions.predictions).reduce((acc, [key, value]) => {
      acc[key.replace(/ /g, '_')] = value;
      return acc;
    }, {})
  };
};
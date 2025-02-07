import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../theme/colors';
import Button from '../common/Button';
import { exportToExcel, exportToCSV, exportToPDF } from '../../utils/exportUtils';
import { useNotification } from '../../context/NotificationContext';
import LoadingSpinner from '../common/LoadingSpinner';

const ExportContainer = styled.div`
  background: ${theme.background.paper};
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const ExportOptions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const OptionCard = styled.div`
  border: 2px solid ${props => props.selected ? theme.primary.main : theme.text.disabled};
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${theme.primary.main};
    transform: translateY(-2px);
  }
`;

const FilterSection = styled.div`
  margin-bottom: 2rem;
`;

const DateRange = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid ${theme.text.disabled};
  border-radius: 8px;
  
  &:focus {
    outline: none;
    border-color: ${theme.primary.main};
  }
`;

const Progress = styled.div`
  width: 100%;
  height: 4px;
  background: ${theme.background.default};
  border-radius: 2px;
  margin-top: 1rem;
`;

const ProgressBar = styled.div`
  width: ${props => props.progress}%;
  height: 100%;
  background: ${theme.primary.main};
  border-radius: 2px;
  transition: width 0.3s ease;
`;

const ExportManager = ({ data }) => {
  const [exportType, setExportType] = useState('csv');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { showNotification } = useNotification();

  const handleExport = async () => {
    setLoading(true);
    setProgress(0);

    try {
      // Filter data based on date range
      const filteredData = filterDataByDate(data, dateRange);
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      switch (exportType) {
        case 'excel':
          await exportToExcel(filteredData, 'blasting_data.xlsx');
          break;
        case 'csv':
          await exportToCSV(filteredData, 'blasting_data.csv');
          break;
        case 'pdf':
          await exportToPDF(filteredData, 'blasting_data.pdf');
          break;
      }

      clearInterval(progressInterval);
      setProgress(100);
      showNotification('Export completed successfully', 'success');
    } catch (error) {
      showNotification('Export failed: ' + error.message, 'error');
    } finally {
      setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 1000);
    }
  };

  const filterDataByDate = (data, { start, end }) => {
    if (!start || !end) return data;
    
    return data.filter(item => {
      const itemDate = new Date(item.timestamp);
      return itemDate >= new Date(start) && itemDate <= new Date(end);
    });
  };

  return (
    <ExportContainer>
      <h2>Export Data</h2>
      
      <FilterSection>
        <h3>Date Range</h3>
        <DateRange>
          <Input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
          />
          <Input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
          />
        </DateRange>
      </FilterSection>

      <ExportOptions>
        <OptionCard
          selected={exportType === 'csv'}
          onClick={() => setExportType('csv')}
        >
          <h3>CSV</h3>
          <p>Export as comma-separated values</p>
        </OptionCard>
        
        <OptionCard
          selected={exportType === 'excel'}
          onClick={() => setExportType('excel')}
        >
          <h3>Excel</h3>
          <p>Export as Excel spreadsheet</p>
        </OptionCard>
        
        <OptionCard
          selected={exportType === 'pdf'}
          onClick={() => setExportType('pdf')}
        >
          <h3>PDF</h3>
          <p>Export as PDF document</p>
        </OptionCard>
      </ExportOptions>

      {loading ? (
        <>
          <LoadingSpinner />
          <Progress>
            <ProgressBar progress={progress} />
          </Progress>
        </>
      ) : (
        <Button onClick={handleExport}>
          Export Data
        </Button>
      )}
    </ExportContainer>
  );
};

export default ExportManager;
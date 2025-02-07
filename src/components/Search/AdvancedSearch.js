import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '../../theme/colors';
import { useDebounce } from '../../hooks/useDebounce';
import Button from '../common/Button';

const SearchContainer = styled.div`
  background: ${theme.background.paper};
  padding: 1.5rem;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const SearchBar = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 0.75rem;
  border: 2px solid ${theme.text.disabled};
  border-radius: 8px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: ${theme.primary.main};
  }
`;

const FiltersContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid ${theme.text.disabled};
  border-radius: 8px;
  background: white;

  &:focus {
    outline: none;
    border-color: ${theme.primary.main};
  }
`;

const RangeInputs = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const ChipContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const Chip = styled.div`
  background: ${theme.background.default};
  padding: 0.5rem 1rem;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;

  button {
    background: none;
    border: none;
    cursor: pointer;
    color: ${theme.text.secondary};
    padding: 0;
    font-size: 1.2rem;
    line-height: 1;
  }
`;

const AdvancedSearch = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    rockType: '',
    dateRange: { start: '', end: '' },
    accuracyRange: { min: '', max: '' },
    status: ''
  });
  const [activeFilters, setActiveFilters] = useState([]);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    handleSearch();
  }, [debouncedSearchTerm, filters]);

  const handleSearch = () => {
    const searchParams = {
      term: debouncedSearchTerm,
      ...filters
    };
    onSearch(searchParams);
    updateActiveFilters();
  };

  const updateActiveFilters = () => {
    const newActiveFilters = [];
    
    if (filters.rockType) {
      newActiveFilters.push({
        key: 'rockType',
        label: `Rock Type: ${filters.rockType}`,
      });
    }
    
    if (filters.dateRange.start && filters.dateRange.end) {
      newActiveFilters.push({
        key: 'dateRange',
        label: `Date: ${filters.dateRange.start} to ${filters.dateRange.end}`,
      });
    }
    
    if (filters.accuracyRange.min && filters.accuracyRange.max) {
      newActiveFilters.push({
        key: 'accuracyRange',
        label: `Accuracy: ${filters.accuracyRange.min}% - ${filters.accuracyRange.max}%`,
      });
    }
    
    if (filters.status) {
      newActiveFilters.push({
        key: 'status',
        label: `Status: ${filters.status}`,
      });
    }

    setActiveFilters(newActiveFilters);
  };

  const removeFilter = (key) => {
    if (key === 'dateRange') {
      setFilters(prev => ({
        ...prev,
        dateRange: { start: '', end: '' }
      }));
    } else if (key === 'accuracyRange') {
      setFilters(prev => ({
        ...prev,
        accuracyRange: { min: '', max: '' }
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        [key]: ''
      }));
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setFilters({
      rockType: '',
      dateRange: { start: '', end: '' },
      accuracyRange: { min: '', max: '' },
      status: ''
    });
  };

  return (
    <SearchContainer>
      <SearchBar>
        <SearchInput
          placeholder="Search predictions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button variant="outline" onClick={resetFilters}>
          Reset
        </Button>
      </SearchBar>

      <FiltersContainer>
        <FilterGroup>
          <label>Rock Type</label>
          <Select
            value={filters.rockType}
            onChange={(e) => setFilters(prev => ({ ...prev, rockType: e.target.value }))}
          >
            <option value="">All Types</option>
            <option value="granite">Granite</option>
            <option value="limestone">Limestone</option>
            <option value="basalt">Basalt</option>
          </Select>
        </FilterGroup>

        <FilterGroup>
          <label>Date Range</label>
          <RangeInputs>
            <input
              type="date"
              value={filters.dateRange.start}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                dateRange: { ...prev.dateRange, start: e.target.value }
              }))}
            />
            <span>to</span>
            <input
              type="date"
              value={filters.dateRange.end}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                dateRange: { ...prev.dateRange, end: e.target.value }
              }))}
            />
          </RangeInputs>
        </FilterGroup>

        <FilterGroup>
          <label>Accuracy Range (%)</label>
          <RangeInputs>
            <input
              type="number"
              placeholder="Min"
              value={filters.accuracyRange.min}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                accuracyRange: { ...prev.accuracyRange, min: e.target.value }
              }))}
            />
            <span>-</span>
            <input
              type="number"
              placeholder="Max"
              value={filters.accuracyRange.max}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                accuracyRange: { ...prev.accuracyRange, max: e.target.value }
              }))}
            />
          </RangeInputs>
        </FilterGroup>

        <FilterGroup>
          <label>Status</label>
          <Select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
          >
            <option value="">All Status</option>
            <option value="success">Success</option>
            <option value="failed">Failed</option>
            <option value="pending">Pending</option>
          </Select>
        </FilterGroup>
      </FiltersContainer>

      <ChipContainer>
        {activeFilters.map((filter) => (
          <Chip key={filter.key}>
            {filter.label}
            <button onClick={() => removeFilter(filter.key)}>×</button>
          </Chip>
        ))}
      </ChipContainer>
    </SearchContainer>
  );
};

export default AdvancedSearch;
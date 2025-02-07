import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../theme/colors';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell
} from 'recharts';

const AnalyticsContainer = styled.div`
  padding: 2rem;
  background: ${theme.background.paper};
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const ChartGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const ChartCard = styled.div`
  background: ${theme.background.default};
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  height: 400px;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid ${theme.text.disabled};
  border-radius: 8px;
  background: white;
  color: ${theme.text.primary};
`;

const COLORS = [
  theme.primary.main,
  theme.secondary.main,
  theme.accent.main,
  theme.success.main
];

const BlastingAnalytics = ({ data }) => {
  const [timeRange, setTimeRange] = useState('month');
  const [rockType, setRockType] = useState('all');

  // Sample data - replace with actual data from your backend
  const fragmentationTrend = [
    { date: '2024-01', value: 25 },
    { date: '2024-02', value: 22 },
    { date: '2024-03', value: 28 },
    // Add more data points
  ];

  const rockTypeDistribution = [
    { name: 'Granite', value: 35 },
    { name: 'Limestone', value: 25 },
    { name: 'Basalt', value: 20 },
    { name: 'Sandstone', value: 20 },
  ];

  const vibrationAnalysis = [
    { range: '0-20', count: 15 },
    { range: '21-40', count: 25 },
    { range: '41-60', count: 20 },
    { range: '61-80', count: 10 },
    { range: '81-100', count: 5 },
  ];

  return (
    <AnalyticsContainer>
      <h2>Blasting Analytics</h2>
      
      <FilterContainer>
        <Select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
          <option value="week">Last Week</option>
          <option value="month">Last Month</option>
          <option value="year">Last Year</option>
        </Select>
        
        <Select value={rockType} onChange={(e) => setRockType(e.target.value)}>
          <option value="all">All Rock Types</option>
          <option value="granite">Granite</option>
          <option value="limestone">Limestone</option>
          <option value="basalt">Basalt</option>
        </Select>
      </FilterContainer>

      <ChartGrid>
        <ChartCard>
          <h3>Fragmentation Size Trend</h3>
          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={fragmentationTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={theme.primary.main} 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard>
          <h3>Rock Type Distribution</h3>
          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Pie
                data={rockTypeDistribution}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {rockTypeDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard>
          <h3>Vibration Level Distribution</h3>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={vibrationAnalysis}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill={theme.secondary.main} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </ChartGrid>
    </AnalyticsContainer>
  );
};

export default BlastingAnalytics;
import React from 'react';
import styled from 'styled-components';
import { theme } from '../../theme/colors';
import {
  LineChart, Line, BarChart, Bar, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ComposedChart, Area
} from 'recharts';

const ChartContainer = styled.div`
  background: ${theme.background.paper};
  padding: 1.5rem;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ChartTitle = styled.h3`
  color: ${theme.text.primary};
  margin: 0;
`;

const ChartControls = styled.div`
  display: flex;
  gap: 1rem;
`;

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid ${theme.text.disabled};
  border-radius: 6px;
  background: white;
`;

const CustomTooltip = styled.div`
  background: ${theme.background.paper};
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border: 1px solid ${theme.text.disabled};
`;

const TooltipLabel = styled.div`
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: ${theme.text.primary};
`;

const TooltipValue = styled.div`
  color: ${theme.text.secondary};
`;

export const BlastingTrendsChart = ({ data, timeRange = 'month' }) => {
  return (
    <ChartContainer>
      <ChartHeader>
        <ChartTitle>Blasting Performance Trends</ChartTitle>
        <ChartControls>
          <Select defaultValue={timeRange}>
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="year">Last Year</option>
          </Select>
        </ChartControls>
      </ChartHeader>
      
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip content={<CustomChartTooltip />} />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="fragmentation"
            stroke={theme.primary.main}
            strokeWidth={2}
          />
          <Bar
            yAxisId="right"
            dataKey="vibration"
            fill={theme.secondary.main}
            opacity={0.8}
          />
          <Area
            yAxisId="right"
            dataKey="noise"
            fill={theme.accent.light}
            stroke={theme.accent.main}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export const RockAnalysisChart = ({ data }) => {
  return (
    <ChartContainer>
      <ChartHeader>
        <ChartTitle>Rock Properties Analysis</ChartTitle>
      </ChartHeader>
      
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="density" name="Rock Density" unit="g/cm³" />
          <YAxis dataKey="strength" name="Compressive Strength" unit="MPa" />
          <Tooltip content={<CustomChartTooltip />} />
          <Legend />
          <Scatter
            name="Rock Samples"
            data={data}
            fill={theme.primary.main}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

const CustomChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload) return null;

  return (
    <CustomTooltip>
      <TooltipLabel>{label}</TooltipLabel>
      {payload.map((entry, index) => (
        <TooltipValue key={index}>
          {entry.name}: {entry.value} {entry.unit || ''}
        </TooltipValue>
      ))}
    </CustomTooltip>
  );
};
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../theme/colors';
import { Line } from 'react-chartjs-2';
import { useRealTimeData } from '../../hooks/useRealTimeData';
import LoadingSpinner from '../common/LoadingSpinner';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell
} from 'recharts';

const MonitorContainer = styled.div`
  background: ${theme.background.paper};
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin: 2rem 0;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StatusDot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${props => {
    switch (props.status) {
      case 'connected': return theme.success.main;
      case 'disconnected': return theme.error.main;
      case 'connecting': return theme.warning.main;
      default: return theme.text.disabled;
    }
  }};
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const MetricCard = styled.div`
  background: ${theme.background.default};
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
`;

const MetricValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: ${theme.primary.main};
  margin: 0.5rem 0;
`;

const DashboardContainer = styled.div`
  padding: 2rem;
  background: ${theme.background.default};
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`;

const ChartCard = styled.div`
  background: ${theme.background.paper};
  padding: 1.5rem;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  height: ${props => props.height || '400px'};
`;

const FilterBar = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const Select = styled.select`
  padding: 0.5rem 1rem;
  border: 1px solid ${theme.text.disabled};
  border-radius: 8px;
  background: white;
`;

const COLORS = [
  theme.primary.main,
  theme.secondary.main,
  theme.accent.main,
  theme.success.main
];

const RealTimeMonitor = () => {
  const { data, status, error } = useRealTimeData('blasting_metrics');
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });

  useEffect(() => {
    if (data) {
      updateChartData(data);
    }
  }, [data]);

  const updateChartData = (newData) => {
    const timestamp = new Date().toLocaleTimeString();
    
    setChartData(prev => ({
      labels: [...prev.labels, timestamp].slice(-20),
      datasets: [
        {
          label: 'Vibration Level',
          data: [...(prev.datasets[0]?.data || []), newData.vibration].slice(-20),
          borderColor: theme.primary.main,
          tension: 0.4
        },
        {
          label: 'Noise Level',
          data: [...(prev.datasets[1]?.data || []), newData.noise].slice(-20),
          borderColor: theme.secondary.main,
          tension: 0.4
        }
      ]
    }));
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Real-time Blasting Metrics'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    },
    animation: {
      duration: 0
    }
  };

  if (error) {
    return (
      <MonitorContainer>
        <div>Error: {error}</div>
      </MonitorContainer>
    );
  }

  return (
    <MonitorContainer>
      <Header>
        <h2>Real-time Monitoring</h2>
        <StatusIndicator>
          <StatusDot status={status} />
          <span>{status}</span>
        </StatusIndicator>
      </Header>

      {status === 'connecting' ? (
        <LoadingSpinner text="Connecting to monitoring system..." />
      ) : (
        <>
          <MetricsGrid>
            <MetricCard>
              <h3>Current Vibration</h3>
              <MetricValue>{data?.vibration || '0'} dB</MetricValue>
            </MetricCard>
            <MetricCard>
              <h3>Current Noise</h3>
              <MetricValue>{data?.noise || '0'} dB</MetricValue>
            </MetricCard>
            <MetricCard>
              <h3>Status</h3>
              <MetricValue>{data?.status || 'Normal'}</MetricValue>
            </MetricCard>
          </MetricsGrid>

          <div style={{ height: '400px' }}>
            <Line data={chartData} options={chartOptions} />
          </div>
        </>
      )}
    </MonitorContainer>
  );
};

export default RealTimeMonitor;
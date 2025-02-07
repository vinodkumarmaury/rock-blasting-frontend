import React from 'react';
import styled from 'styled-components';
import { theme } from '../../theme/colors';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';

const DashboardContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const WelcomeCard = styled.div`
  background: ${theme.background.gradient};
  padding: 2rem;
  border-radius: 20px;
  color: ${theme.primary.contrast};
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const StatCard = styled.div`
  background: ${theme.background.paper};
  padding: 1.5rem;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const QuickActions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const RecentActivity = styled.div`
  background: ${theme.background.paper};
  padding: 1.5rem;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
`;

const ActivityList = styled.ul`
  list-style: none;
  padding: 0;
`;

const ActivityItem = styled.li`
  padding: 1rem;
  border-bottom: 1px solid ${theme.text.disabled}30;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:last-child {
    border-bottom: none;
  }
`;

const Dashboard = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || 'User';

  const stats = [
    { label: 'Total Predictions', value: '150' },
    { label: 'Successful Blasts', value: '142' },
    { label: 'Average Accuracy', value: '95%' },
    { label: 'Rock Types Analyzed', value: '8' }
  ];

  const recentActivity = [
    { id: 1, action: 'Prediction made for Granite', time: '2 hours ago' },
    { id: 2, action: 'Updated rock data', time: '5 hours ago' },
    { id: 3, action: 'Analyzed blast results', time: '1 day ago' }
  ];

  return (
    <DashboardContainer>
      <WelcomeCard>
        <div>
          <h1>Welcome back, {username}!</h1>
          <p>Here's your blasting prediction overview</p>
        </div>
        <Button onClick={() => navigate('/predict')}>
          New Prediction
        </Button>
      </WelcomeCard>

      <StatsGrid>
        {stats.map((stat, index) => (
          <StatCard key={index}>
            <h3>{stat.label}</h3>
            <h2>{stat.value}</h2>
          </StatCard>
        ))}
      </StatsGrid>

      <QuickActions>
        <Button onClick={() => navigate('/predict')}>Make Prediction</Button>
        <Button variant="secondary" onClick={() => navigate('/rock-data')}>
          View Rock Data
        </Button>
        <Button variant="outline" onClick={() => navigate('/analysis')}>
          View Analysis
        </Button>
      </QuickActions>

      <RecentActivity>
        <h2>Recent Activity</h2>
        <ActivityList>
          {recentActivity.map((activity) => (
            <ActivityItem key={activity.id}>
              <span>{activity.action}</span>
              <span>{activity.time}</span>
            </ActivityItem>
          ))}
        </ActivityList>
      </RecentActivity>
    </DashboardContainer>
  );
};

export default Dashboard;
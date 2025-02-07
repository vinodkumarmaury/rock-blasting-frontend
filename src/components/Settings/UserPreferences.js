import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '../../theme/colors';
import { useNotification } from '../../context/NotificationContext';
import Button from '../common/Button';
import { useApi } from '../../utils/apiUtils';

const PreferencesContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background: ${theme.background.paper};
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const Section = styled.div`
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid ${theme.text.disabled}30;

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  color: ${theme.text.primary};
  margin-bottom: 1rem;
`;

const PreferenceGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: ${theme.text.secondary};
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${theme.text.disabled};
  border-radius: 8px;
  background: white;
  margin-bottom: 0.5rem;

  &:focus {
    outline: none;
    border-color: ${theme.primary.main};
  }
`;

const Toggle = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
`;

const ToggleSwitch = styled.div`
  width: 50px;
  height: 26px;
  background: ${props => props.checked ? theme.primary.main : theme.text.disabled};
  border-radius: 13px;
  padding: 3px;
  margin-right: 10px;
  transition: all 0.3s ease;
  position: relative;

  &::after {
    content: '';
    width: 20px;
    height: 20px;
    background: white;
    border-radius: 50%;
    position: absolute;
    left: 3px;
    transform: translateX(${props => props.checked ? '24px' : '0'});
    transition: transform 0.3s ease;
  }
`;

const Description = styled.p`
  color: ${theme.text.secondary};
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

const UserPreferences = () => {
  const api = useApi();
  const { showNotification } = useNotification();
  const [preferences, setPreferences] = useState({
    theme: 'light',
    language: 'en',
    notifications: {
      email: true,
      push: false,
      desktop: true
    },
    charts: {
      defaultTimeRange: 'month',
      colorScheme: 'default',
      showGrid: true
    },
    exports: {
      defaultFormat: 'csv',
      includeMetadata: true
    },
    accessibility: {
      highContrast: false,
      largeText: false
    }
  });

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const response = await api.get('/api/preferences');
      setPreferences(response.data);
    } catch (error) {
      showNotification('Failed to load preferences', 'error');
    }
  };

  const handleChange = (section, key, value) => {
    setPreferences(prev => ({
      ...prev,
      [section]: typeof key === 'object'
        ? { ...prev[section], ...key }
        : { ...prev[section], [key]: value }
    }));
  };

  const handleSave = async () => {
    try {
      await api.put('/api/preferences', preferences);
      showNotification('Preferences saved successfully', 'success');
    } catch (error) {
      showNotification('Failed to save preferences', 'error');
    }
  };

  return (
    <PreferencesContainer>
      <h2>User Preferences</h2>

      <Section>
        <SectionTitle>Appearance</SectionTitle>
        <PreferenceGroup>
          <Label>Theme</Label>
          <Select
            value={preferences.theme}
            onChange={(e) => handleChange('theme', e.target.value)}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System Default</option>
          </Select>
        </PreferenceGroup>

        <PreferenceGroup>
          <Label>Language</Label>
          <Select
            value={preferences.language}
            onChange={(e) => handleChange('language', e.target.value)}
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
          </Select>
        </PreferenceGroup>
      </Section>

      <Section>
        <SectionTitle>Notifications</SectionTitle>
        <PreferenceGroup>
          <Toggle>
            <input
              type="checkbox"
              checked={preferences.notifications.email}
              onChange={(e) => handleChange('notifications', 'email', e.target.checked)}
              style={{ display: 'none' }}
            />
            <ToggleSwitch checked={preferences.notifications.email} />
            Email Notifications
          </Toggle>
          <Description>Receive important updates via email</Description>
        </PreferenceGroup>

        <PreferenceGroup>
          <Toggle>
            <input
              type="checkbox"
              checked={preferences.notifications.push}
              onChange={(e) => handleChange('notifications', 'push', e.target.checked)}
              style={{ display: 'none' }}
            />
            <ToggleSwitch checked={preferences.notifications.push} />
            Push Notifications
          </Toggle>
          <Description>Receive real-time updates on your device</Description>
        </PreferenceGroup>
      </Section>

      <Section>
        <SectionTitle>Data Visualization</SectionTitle>
        <PreferenceGroup>
          <Label>Default Time Range</Label>
          <Select
            value={preferences.charts.defaultTimeRange}
            onChange={(e) => handleChange('charts', 'defaultTimeRange', e.target.value)}
          >
            <option value="day">Last 24 Hours</option>
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="year">Last Year</option>
          </Select>
        </PreferenceGroup>

        <PreferenceGroup>
          <Label>Chart Color Scheme</Label>
          <Select
            value={preferences.charts.colorScheme}
            onChange={(e) => handleChange('charts', 'colorScheme', e.target.value)}
          >
            <option value="default">Default</option>
            <option value="monochrome">Monochrome</option>
            <option value="colorblind">Colorblind Friendly</option>
          </Select>
        </PreferenceGroup>
      </Section>

      <Button onClick={handleSave}>Save Preferences</Button>
    </PreferencesContainer>
  );
};

export default UserPreferences;
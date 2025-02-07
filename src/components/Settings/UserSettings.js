import React from 'react';
import styled from 'styled-components';
import { theme } from '../../theme/colors';
import { useForm } from '../../hooks/useForm';
import { useNotification } from '../../context/NotificationContext';
import Button from '../common/Button';
import { useApi } from '../../utils/apiUtils';

const SettingsContainer = styled.div`
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

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: ${theme.text.primary};
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid ${props => props.error ? theme.error.main : theme.text.disabled};
  border-radius: 8px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${theme.primary.main};
    box-shadow: 0 0 0 3px ${theme.primary.light}30;
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

const ErrorText = styled.span`
  color: ${theme.error.main};
  font-size: 0.85rem;
  margin-top: 0.5rem;
  display: block;
`;

const UserSettings = () => {
  const api = useApi();
  const { showNotification } = useNotification();
  
  const { values, errors, handleChange, handleSubmit } = useForm({
    emailNotifications: true,
    pushNotifications: false,
    language: 'en',
    theme: 'light',
    dataExportFormat: 'csv'
  });

  const handleSaveSettings = async (formData) => {
    try {
      await api.post('/api/settings', formData);
      showNotification('Settings saved successfully', 'success');
    } catch (error) {
      showNotification('Failed to save settings', 'error');
    }
  };

  return (
    <SettingsContainer>
      <h2>User Settings</h2>

      <Section>
        <h3>Notifications</h3>
        <FormGroup>
          <Toggle>
            <input
              type="checkbox"
              name="emailNotifications"
              checked={values.emailNotifications}
              onChange={handleChange}
              style={{ display: 'none' }}
            />
            <ToggleSwitch checked={values.emailNotifications} />
            Email Notifications
          </Toggle>
        </FormGroup>

        <FormGroup>
          <Toggle>
            <input
              type="checkbox"
              name="pushNotifications"
              checked={values.pushNotifications}
              onChange={handleChange}
              style={{ display: 'none' }}
            />
            <ToggleSwitch checked={values.pushNotifications} />
            Push Notifications
          </Toggle>
        </FormGroup>
      </Section>

      <Section>
        <h3>Preferences</h3>
        <FormGroup>
          <Label>Language</Label>
          <select
            name="language"
            value={values.language}
            onChange={handleChange}
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
          </select>
        </FormGroup>

        <FormGroup>
          <Label>Theme</Label>
          <select
            name="theme"
            value={values.theme}
            onChange={handleChange}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
          </select>
        </FormGroup>

        <FormGroup>
          <Label>Data Export Format</Label>
          <select
            name="dataExportFormat"
            value={values.dataExportFormat}
            onChange={handleChange}
          >
            <option value="csv">CSV</option>
            <option value="excel">Excel</option>
            <option value="pdf">PDF</option>
          </select>
        </FormGroup>
      </Section>

      <Button onClick={() => handleSubmit(handleSaveSettings)}>
        Save Settings
      </Button>
    </SettingsContainer>
  );
};

export default UserSettings;
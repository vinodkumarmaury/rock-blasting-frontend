import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../theme/colors';
import Button from './common/Button';
import { useNotification } from '../context/NotificationContext';
import LoadingSpinner from './common/LoadingSpinner';

const FormContainer = styled.div`
  background: ${theme.background.paper};
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 2rem auto;
`;

const FormGrid = styled.form`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: ${theme.text.primary};
  font-weight: 500;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 2px solid ${props => props.error ? theme.error.main : theme.text.disabled};
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${theme.primary.main};
    box-shadow: 0 0 0 3px ${theme.primary.light}30;
  }
`;

const ErrorText = styled.span`
  color: ${theme.error.main};
  font-size: 0.85rem;
`;

const ButtonContainer = styled.div`
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
`;

const PredictionForm = () => {
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    rock_type: '',
    ucs: '',
    penetration_rate: '',
    hole_diameter: '',
    hole_depth: '',
    burden: '',
    spacing: '',
    stemming: '',
    explosive_weight: ''
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (!value) {
        newErrors[key] = 'This field is required';
      } else if (key !== 'rock_type' && isNaN(value)) {
        newErrors[key] = 'Must be a number';
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      showNotification('Please fix the errors in the form', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Prediction failed');

      const data = await response.json();
      showNotification('Prediction successful!', 'success');
      // Handle the prediction results (you can pass them to a parent component or use context)
    } catch (error) {
      showNotification(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const formFields = [
    { name: 'rock_type', label: 'Rock Type', type: 'text' },
    { name: 'ucs', label: 'UCS (MPa)', type: 'number' },
    { name: 'penetration_rate', label: 'Penetration Rate (m/min)', type: 'number' },
    { name: 'hole_diameter', label: 'Hole Diameter (mm)', type: 'number' },
    { name: 'hole_depth', label: 'Hole Depth (m)', type: 'number' },
    { name: 'burden', label: 'Burden (m)', type: 'number' },
    { name: 'spacing', label: 'Spacing (m)', type: 'number' },
    { name: 'stemming', label: 'Stemming (m)', type: 'number' },
    { name: 'explosive_weight', label: 'Explosive Weight (kg)', type: 'number' }
  ];

  if (loading) return <LoadingSpinner text="Processing prediction..." />;

  return (
    <FormContainer>
      <FormGrid onSubmit={handleSubmit}>
        {formFields.map(field => (
          <FormGroup key={field.name}>
            <Label>{field.label}</Label>
            <Input
              type={field.type}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              error={errors[field.name]}
              step="any"
            />
            {errors[field.name] && <ErrorText>{errors[field.name]}</ErrorText>}
          </FormGroup>
        ))}
        <ButtonContainer>
          <Button type="button" variant="outline" onClick={() => setFormData({})}>
            Reset
          </Button>
          <Button type="submit">
            Predict
          </Button>
        </ButtonContainer>
      </FormGrid>
    </FormContainer>
  );
};

export default PredictionForm;
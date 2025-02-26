import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { theme } from '../theme/colors';
import Button from './common/Button';
import { useNotification } from '../context/NotificationContext';
import LoadingSpinner from './common/LoadingSpinner';
import { buildApiUrl } from '../utils/apiUtils';

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

// Add prop for onPredictionComplete
const PredictionForm = ({ onPredictionComplete }) => {
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    'UCS (MPa)': 80, // Exact column name match
    'Penetration_Rate (m/min)': 0.5,
    'Hole_Diameter (mm)': 110,
    'Burden (m)': 3,
    'Spacing (m)': 3.5,
    'Stemming_Length (m)': 2.4,
    'Rock_Elastic_Modulus (GPa)': 60,
    'Fracture_Frequency (/m)': 1.2,
    'Groundwater_Level (m)': 1.8,
    'Explosive_Weight (kg)': 80
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    let valid = true;
    
    // Validate each field
    Object.entries(formData).forEach(([key, value]) => {
      if (value === '' || value === null || isNaN(value)) {
        newErrors[key] = 'Field is required and must be a number';
        valid = false;
      }
    });
    
    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
        showNotification('Please fix the errors in the form', 'error');
        return;
    }

    setLoading(true);
    try {
        const token = localStorage.getItem('token');
        
        if (!token) {
            throw new Error('No token found');
        }

        // Log data before sending for debugging
        console.log("Sending prediction data:", formData);
        
        const requestURL = buildApiUrl('predict');
        
        const response = await axios.post(
            requestURL, 
            formData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        
        console.log('Prediction successful:', response.data);
        showNotification('Prediction completed successfully', 'success');
        
        if (onPredictionComplete && typeof onPredictionComplete === 'function') {
            onPredictionComplete(response.data);
        }
        
    } catch (error) {
        console.error('Error fetching prediction:', error);
        console.error('Error response:', error.response?.data);
        
        if (error.response && error.response.status === 401) {
            showNotification('Session expired. Please login again.', 'error');
        } else {
            showNotification(
                error.response?.data?.detail || 'Error fetching prediction', 
                'error'
            );
        }
    } finally {
        setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value) || value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  if (loading) return <LoadingSpinner text="Processing prediction..." />;

  return (
    <FormContainer>
      <h2>Rock Blasting Parameters</h2>
      <FormGrid onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="ucs">UCS (MPa)</Label>
          <Input
            type="number"
            id="ucs"
            name="UCS (MPa)"
            value={formData['UCS (MPa)']}
            onChange={handleChange}
            error={!!errors['UCS (MPa)']}
          />
          {errors['UCS (MPa)'] && <ErrorText>{errors['UCS (MPa)']}</ErrorText>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="penetrationRate">Penetration Rate (m/min)</Label>
          <Input
            type="number"
            id="penetrationRate"
            name="Penetration_Rate (m/min)"
            value={formData['Penetration_Rate (m/min)']}
            onChange={handleChange}
            error={!!errors['Penetration_Rate (m/min)']}
          />
          {errors['Penetration_Rate (m/min)'] && <ErrorText>{errors['Penetration_Rate (m/min)']}</ErrorText>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="holeDiameter">Hole Diameter (mm)</Label>
          <Input
            type="number"
            id="holeDiameter"
            name="Hole_Diameter (mm)"
            value={formData['Hole_Diameter (mm)']}
            onChange={handleChange}
            error={!!errors['Hole_Diameter (mm)']}
          />
          {errors['Hole_Diameter (mm)'] && <ErrorText>{errors['Hole_Diameter (mm)']}</ErrorText>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="burden">Burden (m)</Label>
          <Input
            type="number"
            id="burden"
            name="Burden (m)"
            value={formData['Burden (m)']}
            onChange={handleChange}
            error={!!errors['Burden (m)']}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="spacing">Spacing (m)</Label>
          <Input
            type="number"
            id="spacing"
            name="Spacing (m)"
            value={formData['Spacing (m)']}
            onChange={handleChange}
            error={!!errors['Spacing (m)']}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="stemmingLength">Stemming Length (m)</Label>
          <Input
            type="number"
            id="stemmingLength" 
            name="Stemming_Length (m)"
            value={formData['Stemming_Length (m)']}
            onChange={handleChange}
            error={!!errors['Stemming_Length (m)']}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="elasticModulus">Rock Elastic Modulus (GPa)</Label>
          <Input
            type="number"
            id="elasticModulus"
            name="Rock_Elastic_Modulus (GPa)"
            value={formData['Rock_Elastic_Modulus (GPa)']}
            onChange={handleChange}
            error={!!errors['Rock_Elastic_Modulus (GPa)']}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="fractureFrequency">Fracture Frequency (/m)</Label>
          <Input
            type="number"
            id="fractureFrequency"
            name="Fracture_Frequency (/m)"
            value={formData['Fracture_Frequency (/m)']}
            onChange={handleChange}
            error={!!errors['Fracture_Frequency (/m)']}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="groundwaterLevel">Groundwater Level (m)</Label>
          <Input
            type="number"
            id="groundwaterLevel"
            name="Groundwater_Level (m)"
            value={formData['Groundwater_Level (m)']}
            onChange={handleChange}
            error={!!errors['Groundwater_Level (m)']}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="explosiveWeight">Explosive Weight (kg)</Label>
          <Input
            type="number"
            id="explosiveWeight"
            name="Explosive_Weight (kg)"
            value={formData['Explosive_Weight (kg)']}
            onChange={handleChange}
            error={!!errors['Explosive_Weight (kg)']}
          />
        </FormGroup>

        <ButtonContainer>
          <Button type="button" variant="outline" onClick={() => setFormData({})}>
            Reset
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? <LoadingSpinner /> : 'Submit Prediction'}
          </Button>
        </ButtonContainer>
      </FormGrid>
    </FormContainer>
  );
};

export default PredictionForm;
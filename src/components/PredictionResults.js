import React from 'react';
import styled from 'styled-components';
import { theme } from '../theme/colors';
import ModelChart from './ModelChart';

const ResultsContainer = styled.div`
  background: ${theme.background.paper};
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin: 2rem auto;
  max-width: 1200px;
`;

const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const ResultCard = styled.div`
  background: ${theme.background.default};
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const ResultTitle = styled.h3`
  color: ${theme.primary.main};
  margin-bottom: 1rem;
  font-size: 1.2rem;
`;

const ModelResult = styled.div`
  margin-bottom: 1rem;
`;

const ModelName = styled.h4`
  color: ${theme.text.secondary};
  margin-bottom: 0.5rem;
  font-size: 1rem;
`;

const Value = styled.p`
  color: ${theme.text.primary};
  font-size: 1.5rem;
  font-weight: 600;
`;

const PredictionResults = ({ results }) => {
  const models = ['SVR', 'XGBoost', 'Random Forest'];
  const parameters = [
    { key: 'Fragmentation_Size', label: 'Fragmentation Size', unit: 'cm' },
    { key: 'Vibration_Level', label: 'Vibration Level', unit: 'dB' },
    { key: 'Noise_Level', label: 'Noise Level', unit: 'dB' },
    { key: 'Powder_Factor', label: 'Powder Factor', unit: '' },
  ];

  return (
    <ResultsContainer>
      <h2>Prediction Results</h2>
      <ResultsGrid>
        {parameters.map(param => (
          <ResultCard key={param.key}>
            <ResultTitle>{param.label}</ResultTitle>
            {models.map(model => (
              <ModelResult key={`${param.key}-${model}`}>
                <ModelName>{model}</ModelName>
                <Value>
                  {results.predictions[`${param.key} (${param.unit}`.trim()][model].toFixed(2)}
                  {param.unit && ` ${param.unit}`}
                </Value>
              </ModelResult>
            ))}
            <ModelChart
              title={param.label}
              actualData={[]}
              predictedData={models.map(
                model => results.predictions[`${param.key} (${param.unit}`.trim()][model]
              )}
            />
          </ResultCard>
        ))}
      </ResultsGrid>
    </ResultsContainer>
  );
};

export default PredictionResults;
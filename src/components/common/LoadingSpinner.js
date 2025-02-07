import React from 'react';
import styled, { keyframes } from 'styled-components';
import { theme } from '../../theme/colors';

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const SpinnerWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: ${props => props.fullScreen ? '100vh' : '100%'};
  background: ${props => props.fullScreen ? theme.background.gradient : 'transparent'};
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 3px solid ${theme.primary.light};
  border-top-color: ${theme.primary.main};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const LoadingText = styled.p`
  color: ${theme.text.primary};
  margin-top: 1rem;
  font-size: 1.1rem;
`;

const LoadingSpinner = ({ fullScreen, text }) => {
  return (
    <SpinnerWrapper fullScreen={fullScreen}>
      <div>
        <Spinner />
        {text && <LoadingText>{text}</LoadingText>}
      </div>
    </SpinnerWrapper>
  );
};

export default LoadingSpinner;
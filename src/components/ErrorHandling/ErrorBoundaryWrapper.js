import React from 'react';
import styled from 'styled-components';
import { theme } from '../../theme/colors';
import Button from '../common/Button';
import { useNavigate } from 'react-router-dom';

const ErrorContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: ${theme.background.default};
`;

const ErrorCard = styled.div`
  background: ${theme.background.paper};
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  width: 100%;
  text-align: center;
`;

const ErrorIcon = styled.div`
  font-size: 4rem;
  color: ${theme.error.main};
  margin-bottom: 1rem;
`;

const ErrorTitle = styled.h1`
  color: ${theme.text.primary};
  margin-bottom: 1rem;
`;

const ErrorMessage = styled.p`
  color: ${theme.text.secondary};
  margin-bottom: 2rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
`;

const ErrorDetails = styled.pre`
  background: ${theme.background.default};
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
  text-align: left;
  margin: 1rem 0;
  font-size: 0.9rem;
`;

class ErrorBoundaryWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorType: 'unknown'
    };
  }

  static getDerivedStateFromError(error) {
    // Categorize the error
    let errorType = 'unknown';
    if (error.name === 'NetworkError') errorType = 'network';
    if (error.name === 'AuthenticationError') errorType = 'auth';
    if (error.name === 'ValidationError') errorType = 'validation';

    return { hasError: true, errorType };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Log error to your error tracking service
    this.logError(error, errorInfo);
  }

  logError = (error, errorInfo) => {
    // Implement your error logging logic here
    console.error('Error:', error);
    console.error('Error Info:', errorInfo);
  };

  render() {
    if (this.state.hasError) {
      return <ErrorView {...this.state} resetError={() => this.setState({ hasError: false })} />;
    }

    return this.props.children;
  }
}

const ErrorView = ({ errorType, error, errorInfo, resetError }) => {
  const navigate = useNavigate();

  const errorContent = {
    network: {
      icon: '🌐',
      title: 'Network Error',
      message: 'Unable to connect to the server. Please check your internet connection.'
    },
    auth: {
      icon: '🔒',
      title: 'Authentication Error',
      message: 'Your session has expired. Please log in again.'
    },
    validation: {
      icon: '⚠️',
      title: 'Validation Error',
      message: 'Invalid data provided. Please check your input and try again.'
    },
    unknown: {
      icon: '❌',
      title: 'Unexpected Error',
      message: 'Something went wrong. Please try again later.'
    }
  }[errorType];

  return (
    <ErrorContainer>
      <ErrorCard>
        <ErrorIcon>{errorContent.icon}</ErrorIcon>
        <ErrorTitle>{errorContent.title}</ErrorTitle>
        <ErrorMessage>{errorContent.message}</ErrorMessage>
        
        {process.env.NODE_ENV === 'development' && error && (
          <ErrorDetails>
            {error.toString()}
            {errorInfo && errorInfo.componentStack}
          </ErrorDetails>
        )}

        <ButtonGroup>
          <Button onClick={() => navigate('/')}>
            Go Home
          </Button>
          <Button variant="secondary" onClick={resetError}>
            Try Again
          </Button>
          {errorType === 'auth' && (
            <Button variant="outline" onClick={() => navigate('/auth')}>
              Log In
            </Button>
          )}
        </ButtonGroup>
      </ErrorCard>
    </ErrorContainer>
  );
};

export default ErrorBoundaryWrapper;
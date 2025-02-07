import React from 'react';
import styled from 'styled-components';
import { theme } from '../../theme/colors';
import Button from '../common/Button';

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  background: ${theme.background.default};
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
  max-width: 600px;
`;

const ErrorDetails = styled.pre`
  background: ${theme.background.paper};
  padding: 1rem;
  border-radius: 8px;
  max-width: 800px;
  overflow-x: auto;
  margin-bottom: 2rem;
`;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    // You can also log the error to an error reporting service here
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <ErrorIcon>⚠️</ErrorIcon>
          <ErrorTitle>Oops! Something went wrong</ErrorTitle>
          <ErrorMessage>
            We apologize for the inconvenience. Please try refreshing the page or contact support if the problem persists.
          </ErrorMessage>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <ErrorDetails>
              {this.state.error.toString()}
              <br />
              {this.state.errorInfo.componentStack}
            </ErrorDetails>
          )}
          <Button onClick={this.handleReset}>
            Refresh Page
          </Button>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

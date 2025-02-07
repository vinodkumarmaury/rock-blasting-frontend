import React from 'react';
import styled, { keyframes } from 'styled-components';
import { theme } from '../../theme/colors';

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const NotificationWrapper = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 1rem;
  border-radius: 8px;
  background: ${props => {
    if (props.type === 'success') return theme.success.main;
    if (props.type === 'error') return theme.error.main;
    return theme.warning.main;
  }};
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: ${slideIn} 0.3s ease-out;
  z-index: 1000;
`;

const Notification = ({ message, type }) => {
  return (
    <NotificationWrapper type={type}>
      {message}
    </NotificationWrapper>
  );
};

export default Notification;
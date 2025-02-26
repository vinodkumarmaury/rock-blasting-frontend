import React from 'react';
import styled, { keyframes, css } from 'styled-components';
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

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const NotificationContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 400px;
  width: 100%;
`;

const NotificationItem = styled.div`
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: ${props => {
    switch (props.type) {
      case 'success': return theme.success.light;
      case 'error': return theme.error.light;
      case 'warning': return theme.warning.light;
      default: return theme.primary.light;
    }
  }};
  animation: ${props => props.isExiting
    ? css`${slideOut} 0.3s ease forwards`
    : css`${slideIn} 0.3s ease`};
`;

const Icon = styled.div`
  font-size: 1.2rem;
`;

const Content = styled.div`
  flex: 1;
`;

const Title = styled.div`
  font-weight: 500;
  color: ${props => {
    switch (props.type) {
      case 'success': return theme.success.dark;
      case 'error': return theme.error.dark;
      case 'warning': return theme.warning.dark;
      default: return theme.primary.dark;
    }
  }};
  margin-bottom: 4px;
`;

const Message = styled.div`
  color: ${theme.text.primary};
  font-size: 0.9rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${theme.text.secondary};
  cursor: pointer;
  padding: 4px;
  font-size: 1.2rem;
  line-height: 1;
  transition: color 0.2s ease;

  &:hover {
    color: ${theme.text.primary};
  }
`;

const ProgressBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: ${props => {
    switch (props.type) {
      case 'success': return theme.success.main;
      case 'error': return theme.error.main;
      case 'warning': return theme.warning.main;
      default: return theme.primary.main;
    }
  }};
  width: ${props => (props.progress * 100)}%;
  transition: width linear;
`;

const getIcon = (type) => {
  switch (type) {
    case 'success': return '✓';
    case 'error': return '✕';
    case 'warning': return '⚠';
    default: return 'ℹ';
  }
};

const NotificationSystem = ({ notifications, removeNotification }) => {
  return (
    <NotificationContainer>
      {notifications.map(({ id, type, title, message, progress, isExiting }) => (
        <NotificationItem key={id} type={type} isExiting={isExiting}>
          <Icon>{getIcon(type)}</Icon>
          <Content>
            <Title type={type}>{title}</Title>
            <Message>{message}</Message>
          </Content>
          <CloseButton onClick={() => removeNotification(id)}>×</CloseButton>
          <ProgressBar type={type} progress={progress} />
        </NotificationItem>
      ))}
    </NotificationContainer>
  );
};

export default NotificationSystem;
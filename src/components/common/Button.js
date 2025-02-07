import styled from 'styled-components';
import { theme } from '../../theme/colors';

const Button = styled.button`
  padding: ${props => props.small ? '0.5rem 1rem' : '0.75rem 1.5rem'};
  border-radius: 8px;
  border: none;
  font-size: ${props => props.small ? '0.9rem' : '1rem'};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => {
    if (props.variant === 'secondary') return theme.secondary.main;
    if (props.variant === 'outline') return 'transparent';
    return theme.primary.main;
  }};
  color: ${props => props.variant === 'outline' ? theme.primary.main : theme.primary.contrast};
  border: ${props => props.variant === 'outline' ? `2px solid ${theme.primary.main}` : 'none'};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    background: ${props => {
      if (props.variant === 'secondary') return theme.secondary.dark;
      if (props.variant === 'outline') return theme.primary.light;
      return theme.primary.dark;
    }};
    color: ${theme.primary.contrast};
  }

  &:disabled {
    background: ${theme.text.disabled};
    cursor: not-allowed;
    transform: none;
  }
`;

export default Button;

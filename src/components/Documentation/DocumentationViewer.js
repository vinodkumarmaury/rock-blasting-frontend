import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../theme/colors';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

const DocContainer = styled.div`
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 2rem;
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.div`
  background: ${theme.background.paper};
  padding: 1.5rem;
  border-radius: 12px;
  height: fit-content;
  position: sticky;
  top: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const MainContent = styled.div`
  background: ${theme.background.paper};
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const NavItem = styled.div`
  padding: 0.5rem;
  cursor: pointer;
  border-radius: 6px;
  margin-bottom: 0.5rem;
  transition: all 0.2s ease;
  
  ${props => props.active && `
    background: ${theme.primary.light};
    color: ${theme.primary.main};
  `}

  &:hover {
    background: ${theme.background.default};
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${theme.text.disabled};
  border-radius: 8px;
  margin-bottom: 1rem;

  &:focus {
    outline: none;
    border-color: ${theme.primary.main};
  }
`;

const MarkdownContent = styled.div`
  h1, h2, h3, h4, h5, h6 {
    color: ${theme.text.primary};
    margin-top: 2rem;
    margin-bottom: 1rem;
  }

  p {
    color: ${theme.text.secondary};
    line-height: 1.6;
    margin-bottom: 1rem;
  }

  code {
    background: ${theme.background.default};
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
    font-size: 0.9em;
  }

  pre {
    margin: 1rem 0;
    border-radius: 8px;
    overflow: auto;
  }

  ul, ol {
    margin: 1rem 0;
    padding-left: 2rem;
  }

  blockquote {
    border-left: 4px solid ${theme.primary.main};
    padding-left: 1rem;
    margin: 1rem 0;
    color: ${theme.text.secondary};
  }
`;

const sections = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    content: `
# Getting Started

Welcome to the Rock Blasting Prediction System documentation. This guide will help you understand how to use the system effectively.

## Installation

\`\`\`bash
git clone https://github.com/your-repo/rock-blasting
cd rock-blasting
npm install
\`\`\`

## Configuration

Create a \`.env\` file with the following variables:

\`\`\`env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_WS_URL=ws://localhost:8000/ws
\`\`\`
    `
  },
  {
    id: 'predictions',
    title: 'Making Predictions',
    content: `
# Making Predictions

Learn how to use the prediction system effectively.

## Input Parameters

- Rock Type
- Hole Diameter
- Spacing
- Burden
- Bench Height
- Charge Length

## Understanding Results

The system provides predictions for:
- Fragmentation Size
- Vibration Level
- Noise Level
- Powder Factor

\`\`\`javascript
// Example API call
const response = await api.post('/predict', {
  rockType: 'granite',
  holeDiameter: 100,
  spacing: 2.5,
  burden: 2.0,
  benchHeight: 10,
  chargeLength: 8
});
\`\`\`
    `
  }
  // Add more sections as needed
];

const DocumentationViewer = () => {
  const [activeSection, setActiveSection] = useState(sections[0].id);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSections = sections.filter(section =>
    section.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentSection = sections.find(section => section.id === activeSection);

  return (
    <DocContainer>
      <Sidebar>
        <SearchInput
          type="text"
          placeholder="Search documentation..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {filteredSections.map(section => (
          <NavItem
            key={section.id}
            active={activeSection === section.id}
            onClick={() => setActiveSection(section.id)}
          >
            {section.title}
          </NavItem>
        ))}
      </Sidebar>
      
      <MainContent>
        <MarkdownContent>
          <ReactMarkdown
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={tomorrow}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              }
            }}
          >
            {currentSection.content}
          </ReactMarkdown>
        </MarkdownContent>
      </MainContent>
    </DocContainer>
  );
};

export default DocumentationViewer;
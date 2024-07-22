import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const SidebarContainer = styled.div`
  position: fixed;
  left: ${props => props.isVisible ? '0' : '-250px'};
  width: 250px;
  height: 100vh;
  background-color: ${props => props.theme.colors.background};
  box-shadow: ${props => props.theme.shadows.md};
  transition: left 0.3s ease-in-out;
  z-index: ${props => props.theme.zIndex.sidebar};
  overflow-y: auto;
`;

const SidebarTrigger = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 20px;
  height: 100vh;
  background-color: transparent;
  z-index: ${props => props.theme.zIndex.sidebarTrigger};
`;

const Sidebar = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    let timer;
    if (isHovering) {
      setIsVisible(true);
    } else {
      timer = setTimeout(() => setIsVisible(false), 300);
    }
    return () => clearTimeout(timer);
  }, [isHovering]);

  return (
    <>
      <SidebarTrigger
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      />
      <SidebarContainer
        isVisible={isVisible}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {children}
      </SidebarContainer>
    </>
  );
};

export default Sidebar;
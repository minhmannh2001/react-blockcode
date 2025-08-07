import React, { useState } from 'react';
import { Paper, Typography, Box, alpha } from '@mui/material';
import { styled } from '@mui/material/styles';
import BLOCKS from '../blocks';
import Block from './Block';

const MenuContainer = styled(Paper)(({ theme, isDragOver }) => ({
  height: '100%',
  backgroundColor: isDragOver ? alpha(theme.palette.primary.main, 0.1) : '#fff3e0',
  border: `2px solid ${theme.palette.primary.main}`,
  borderRadius: theme.shape.borderRadius,
  transition: 'background-color 0.2s ease',
}));

const MenuContent = styled(Box)(({ theme }) => ({
  height: 'calc(100% - 60px)',
  overflowY: 'auto',
  padding: theme.spacing(1),
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: '#f1f1f1',
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: theme.palette.primary.main,
    borderRadius: '4px',
  },
}));

const Menu = ({ onDragStart, onDragEnter, onDragLeave, onDragOver, onDrop, onDragEnd }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragEnter = (e) => {
    setIsDragOver(true);
    onDragEnter(e);
  };

  const handleDragLeave = (e) => {
    setIsDragOver(false);
    onDragLeave(e);
  };

  const handleDrop = (e) => {
    setIsDragOver(false);
    onDrop(e, 'menu', null);
  };

  return (
    <MenuContainer
      elevation={3}
      isDragOver={isDragOver}
      onDragOver={onDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onDragEnd={onDragEnd}
    >
      <Typography 
        variant="h6" 
        component="h2" 
        sx={{ 
          textAlign: 'center', 
          py: 2, 
          borderBottom: 1, 
          borderColor: 'divider',
          fontWeight: 600,
          color: 'primary.main'
        }}
      >
        Menu
      </Typography>
      <MenuContent>
        {BLOCKS.map((block) => (
          <Block
            key={block.name}
            block={block}
            onDragStart={(e) => onDragStart(e, block, 'menu')}
            onDragEnter={onDragEnter}
            onDrop={onDrop}
            variant="menu"
          />
        ))}
      </MenuContent>
    </MenuContainer>
  );
};

export default Menu;

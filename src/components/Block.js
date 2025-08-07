import React, { useState } from 'react';
import { Paper, Typography, TextField, Box, alpha } from '@mui/material';
import { styled } from '@mui/material/styles';
import { DragIndicator } from '@mui/icons-material';

const BlockContainer = styled(Paper)(({ theme, variant, isDragging, isRunning, isNext }) => {
  let backgroundColor = '#ff7043'; // Default orange
  let borderColor = theme.palette.primary.main;
  
  if (variant === 'menu') {
    backgroundColor = '#ff7043'; // Orange for menu blocks
  } else if (variant === 'script') {
    backgroundColor = '#42a5f5'; // Blue for script blocks
    borderColor = theme.palette.secondary.main;
  }

  return {
    padding: theme.spacing(1),
    margin: theme.spacing(0.5),
    cursor: 'move',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    backgroundColor: isDragging ? alpha(backgroundColor, 0.4) : backgroundColor,
    border: `2px solid ${isRunning ? '#f44336' : isNext ? '#4caf50' : borderColor}`,
    borderRadius: theme.shape.borderRadius,
    transition: 'all 0.2s ease',
    minHeight: '40px',
    '&:hover': {
      transform: 'translateY(-1px)',
      boxShadow: theme.shadows[4],
    },
  };
});

const ContainerBox = styled(Box)(({ theme, variant }) => ({
  marginLeft: theme.spacing(2),
  marginTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  borderRight: 0,
  backgroundColor: variant === 'menu' ? alpha('#fff3e0', 0.5) : alpha('#e3f2fd', 0.5),
  borderRadius: '7px 0 0 7px',
}));

const Block = ({ block, onDragStart, onDragEnter, onDragOver, onDrop, variant = 'default' }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e) => {
    setIsDragging(true);
    onDragStart(e);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.stopPropagation();
    onDrop(e, 'block', block);
  };

  const isRunning = block.className && block.className.includes('running');
  const isNext = block.className && block.className.includes('next');

  return (
    <BlockContainer
      elevation={2}
      variant={variant}
      isDragging={isDragging}
      isRunning={isRunning}
      isNext={isNext}
      draggable="true"
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragEnter={onDragEnter}
      onDragOver={onDragOver}
      onDrop={handleDrop}
    >
      <DragIndicator fontSize="small" sx={{ color: 'rgba(255,255,255,0.7)' }} />
      <Typography 
        variant="body2" 
        sx={{ 
          color: 'white', 
          fontWeight: 500,
          flexGrow: 1
        }}
      >
        {block.name}
        {typeof block.contents === 'string' && ` ${block.contents}`}
      </Typography>
      
      {block.value !== undefined && (
        <TextField
          type="number"
          defaultValue={block.value}
          size="small"
          variant="outlined"
          sx={{
            width: '80px',
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'white',
              height: '32px',
              '& input': {
                padding: '4px 8px',
                fontSize: '0.875rem',
              },
            },
          }}
          onClick={(e) => e.stopPropagation()}
        />
      )}
      
      {Array.isArray(block.contents) && (
        <ContainerBox variant={variant}>
          {block.contents.map((childBlock) => (
            <Block
              key={childBlock.id}
              block={childBlock}
              onDragStart={(e) => {
                onDragStart(e, childBlock);
              }}
              onDragEnter={onDragEnter}
              onDragOver={onDragOver}
              onDrop={onDrop}
              variant={variant}
            />
          ))}
        </ContainerBox>
      )}
    </BlockContainer>
  );
};

export default Block;

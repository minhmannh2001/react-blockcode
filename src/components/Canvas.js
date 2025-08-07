import React, { useRef, useEffect, useCallback, useState } from 'react';
import { Paper, Typography, Box, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { styled } from '@mui/material/styles';
import { PlayArrow } from '@mui/icons-material';
import Turtle from '../turtle';

const CanvasContainer = styled(Paper)(({ theme }) => ({
  height: '100%',
  backgroundColor: '#ffffff',
  border: `2px solid ${theme.palette.success.main}`,
  borderRadius: theme.shape.borderRadius,
  display: 'flex',
  flexDirection: 'column',
}));

const CanvasHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  gap: theme.spacing(2),
}));

const CanvasPlaceholder = styled(Box)({
  flexGrow: 1,
  position: 'relative',
  overflow: 'hidden',
});

const StyledCanvas = styled('canvas')({
  position: 'absolute',
  top: 0,
  left: 0,
});

const Canvas = ({ blocks, setBlocks }) => {
  const canvasRef = useRef(null);
  const turtleRef = useRef(null);
  const canvasPlaceholderRef = useRef(null);
  const [selectedExample, setSelectedExample] = useState('');

  const runBlocks = useCallback((blocksToRun) => {
    const turtle = turtleRef.current;

    const execute = (blocks) => {
      blocks.forEach(block => {
        switch (block.name) {
          case 'forward':
            turtle.forward(block.value);
            break;
          case 'back':
            turtle.back(block.value);
            break;
          case 'left':
            turtle.left(block.value);
            break;
          case 'right':
            turtle.right(block.value);
            break;
          case 'repeat':
            for (let i = 0; i < block.value; i++) {
              execute(block.contents);
            }
            break;
          case 'pen up':
            turtle.penUp();
            break;
          case 'pen down':
            turtle.penDown();
            break;
          case 'hide turtle':
            turtle.hideTurtle();
            break;
          case 'show turtle':
            turtle.showTurtle();
            break;
          case 'back to center':
            turtle.recenter()
            break;
          default:
            break;
        }
      });
    }

    execute(blocksToRun);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const canvasPlaceholder = canvasPlaceholderRef.current;
    const turtle = new Turtle(canvas);
    turtleRef.current = turtle;

    const onResize = () => {
      const PIXEL_RATIO = window.devicePixelRatio || 1;
      const rect = canvasPlaceholder.getBoundingClientRect();
      canvas.width = rect.width * PIXEL_RATIO;
      canvas.height = rect.height * PIXEL_RATIO;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      turtle.clear();
      runBlocks(blocks);
      turtle.drawTurtle()
    };

    window.addEventListener('resize', onResize);
    onResize();

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [blocks, runBlocks]);

  const handleRun = () => {
    const turtle = turtleRef.current;
    turtle.clear();
    runBlocks(blocks);
    turtle.drawTurtle()
  };

  const handleExampleChange = (event) => {
    setSelectedExample(event.target.value);
    if (event.target.value !== '') {
      let exampleBlocks = [];
      switch (event.target.value) {
        case 'spiral':
          exampleBlocks = [
            { name: 'repeat', value: 10, contents: [
              { name: 'left', value: 5 },
              { name: 'repeat', value: 10, contents: [
                { name: 'forward', value: 10 },
                { name: 'left', value: 14 }
              ]},
              { name: 'repeat', value: 10, contents: [
                { name: 'right', value: 5 },
                { name: 'repeat', value: 17, contents: [
                  { name: 'forward', value: 13 },
                  { name: 'left', value: 3 }
                ]},
                { name: 'back to center' },
                { name: 'right', value: 3 },
                { name: 'repeat', value: 11, contents: [
                  { name: 'pen up' },
                  { name: 'forward', value: 29 },
                  { name: 'pen down' },
                  { name: 'right', value: 4 },
                  { name: 'forward', value: -24 }
                ]}
              ]}
            ]}
          ];
          break;
        case 'tiny_circle':
          exampleBlocks = [
            { name: 'repeat', value: 10, contents: [
              { name: 'right', value: 36 },
              { name: 'forward', value: 10 }
            ]}
          ];
          break;
        case 'triangle':
          exampleBlocks = [
            { name: 'repeat', value: 3, contents: [
              { name: 'left', value: 120 },
              { name: 'forward', value: 75 }
            ]}
          ];
          break;
        default:
          break;
      }
      setBlocks(exampleBlocks);
    }
  };

  return (
    <CanvasContainer elevation={3}>
      <CanvasHeader>
        <Typography 
          variant="h6" 
          component="h2" 
          sx={{ 
            fontWeight: 600,
            color: 'success.main'
          }}
        >
          Canvas
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button 
            variant="contained" 
            color="success"
            startIcon={<PlayArrow />}
            onClick={handleRun}
          >
            Run
          </Button>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Examples</InputLabel>
            <Select
              value={selectedExample}
              label="Examples"
              onChange={handleExampleChange}
            >
              <MenuItem value="">
                <em>Choose Example</em>
              </MenuItem>
              <MenuItem value="triangle">Triangle</MenuItem>
              <MenuItem value="tiny_circle">Tiny Circle</MenuItem>
              <MenuItem value="spiral">Spiral</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </CanvasHeader>
      <CanvasPlaceholder ref={canvasPlaceholderRef}>
        <StyledCanvas ref={canvasRef} />
      </CanvasPlaceholder>
    </CanvasContainer>
  );
};

export default Canvas;

import React, { useRef, useEffect, useCallback, useState } from 'react';
import Turtle from '../turtle';

const Canvas = ({ blocks, setBlocks }) => {
  const canvasRef = useRef(null);
  const turtleRef = useRef(null);
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
    const canvasPlaceholder = document.querySelector('.canvas-placeholder');
    const turtle = new Turtle(canvas);
    turtleRef.current = turtle;

    const onResize = () => {
      const PIXEL_RATIO = window.devicePixelRatio || 1;
      const rect = canvasPlaceholder.getBoundingClientRect();
      canvas.width = rect.width * PIXEL_RATIO;
      canvas.height = rect.height * PIXEL_RATIO;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      canvas.style.top = `${rect.top}px`;
      canvas.style.left = `${rect.left}px`;
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
    <div className="canvas-column">
      <h2>
        <button onClick={handleRun}>Run</button>
        Examples:
        <select className="choose-example" value={selectedExample} onChange={handleExampleChange}>
          <option value="">Choose Example</option>
          <option value="triangle">Triangle</option>
          <option value="tiny_circle">Tiny Circle</option>
          <option value="spiral">Spiral</option>
        </select>
      </h2>
      <div className="canvas-placeholder"></div>
      <canvas ref={canvasRef} className="canvas"></canvas>
    </div>
  );
};

export default Canvas;

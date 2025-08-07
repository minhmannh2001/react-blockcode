import React, { useRef, useEffect } from 'react';
import Turtle from '../turtle';

const Canvas = ({ blocks }) => {
  const canvasRef = useRef(null);
  const turtleRef = useRef(null);

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
    };

    window.addEventListener('resize', onResize);
    onResize();

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const handleRun = () => {
    const turtle = turtleRef.current;
    turtle.clear();
    runBlocks(blocks);
  };

  const runBlocks = (blocksToRun) => {
    const turtle = turtleRef.current;
    blocksToRun.forEach(block => {
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
            runBlocks(block.contents);
          }
          break;
        case 'penUp':
          turtle.penUp();
          break;
        case 'penDown':
          turtle.penDown();
          break;
        case 'hideTurtle':
          turtle.hideTurtle();
          break;
        case 'showTurtle':
          turtle.showTurtle();
          break;
        default:
          break;
      }
    });
  }

  return (
    <div className="canvas-column">
      <h2>
        <button onClick={handleRun}>Run</button>
        Examples:
        <select className="choose-example">
          <option value="">Choose Example</option>
          <option value="triangle">Triangle</option>
          <option value="circle">Tiny Circle</option>
          <option value="spiral">Spiral</option>
        </select>
      </h2>
      <div className="canvas-placeholder"></div>
      <canvas ref={canvasRef} className="canvas"></canvas>
    </div>
  );
};

export default Canvas;

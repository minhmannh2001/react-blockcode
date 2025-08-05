import React, { useRef, useEffect } from 'react';
import Turtle from '../turtle';

const Canvas = ({ blocks }) => {
  const canvasRef = useRef(null);
  const turtleRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const turtle = new Turtle(canvas);
    turtleRef.current = turtle;
    turtle.clear();
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
        case 'turn':
          turtle.turn(block.value);
          break;
        case 'repeat':
          for (let i = 0; i < block.value; i++) {
            runBlocks(block.contents);
          }
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

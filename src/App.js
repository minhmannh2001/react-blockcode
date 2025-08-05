import React from 'react';
import './App.css';
import Menu from './components/Menu';
import Script from './components/Script';
import Canvas from './components/Canvas';
import useDragAndDrop from './hooks/useDragAndDrop';

function App() {
  const {
    scriptBlocks,
    handleDragStart,
    handleDragOver,
    handleDrop,
  } = useDragAndDrop();

  return (
    <div className="App">
      <h1>Block Code</h1>
      <Menu onDragStart={handleDragStart} />
      <Script
        blocks={scriptBlocks}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      />
      <Canvas blocks={scriptBlocks} />
    </div>
  );
}

export default App;

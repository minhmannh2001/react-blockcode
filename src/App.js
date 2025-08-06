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
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    handleDragEnd,
  } = useDragAndDrop();

  return (
    <div className="App">
      <h1>Block Code</h1>
      <Menu
        onDragStart={handleDragStart}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onDragEnd={handleDragEnd}
      />
      <Script
        blocks={scriptBlocks}
        onDragStart={handleDragStart}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onDragEnd={handleDragEnd}
      />
      <Canvas blocks={scriptBlocks} />
    </div>
  );
}

export default App;

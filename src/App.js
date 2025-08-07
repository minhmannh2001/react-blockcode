import React from 'react';
import './App.css';
import Menu from './components/Menu';
import Script from './components/Script';
import Canvas from './components/Canvas';
import useDragAndDrop from './hooks/useDragAndDrop';

function App() {
  const {
    scriptBlocks,
    setScriptBlocks,
    handleDragStart,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    clearScript,
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
        setBlocks={setScriptBlocks}
        onDragStart={handleDragStart}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onDragEnd={handleDragEnd}
        onClear={clearScript}
      />
      <Canvas blocks={scriptBlocks} setBlocks={setScriptBlocks} />
    </div>
  );
}

export default App;

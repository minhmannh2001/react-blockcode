import React from 'react';
import Block from './Block';
import { scriptToJson, jsonToScript } from '../utils/file';

const Script = ({ blocks, setBlocks, onDragStart, onDragEnter, onDragLeave, onDragOver, onDrop, onDragEnd, onClear }) => {

  const handleSave = (blocks) => {
    const json = scriptToJson(blocks);
    if (json) {
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'blockcode.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleLoad = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            jsonToScript(e.target.result, setBlocks);
          } catch (error) {
            console.error("Error loading file:", error);
            alert("Failed to load file.");
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <div
      className="script-column"
      onDragOver={onDragOver}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, 'script', null)}
      onDragEnd={onDragEnd}
    >
      <h2>
        Script:
        <button className="clear-action" onClick={onClear}>Clear</button>
        <button className="save-action" onClick={() => handleSave(blocks)}>Save</button>
        <button className="load-action" onClick={handleLoad}>Load</button>
      </h2>
      <div className="script">
        {blocks.map((block) => (
          <Block
            key={block.id}
            block={block}
            onDragStart={(e, dragTarget) => onDragStart(e, dragTarget ? dragTarget : block, 'script')}
            onDragEnter={onDragEnter}
            onDragOver={onDragOver}
            onDrop={onDrop}
          />
        ))}
      </div>
    </div>
  );
};

export default Script;

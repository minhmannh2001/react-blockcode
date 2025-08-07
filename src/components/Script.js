import React from 'react';
import Block from './Block';
import { scriptToJson, jsonToScript } from '../utils/file';

const Script = ({ blocks, setBlocks, onDragStart, onDragEnter, onDragLeave, onDragOver, onDrop, onDragEnd, onClear }) => {

  const handleSave = (blocks) => {
    try {
      const fileName = prompt("Enter file name:", "blockcode.json");
      if (fileName) {
        const json = scriptToJson(blocks);
        if (json) {
          const blob = new Blob([json], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
      }
    } catch (error) {
      console.error("Error saving file:", error);
      alert("Failed to save file.");
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
            alert(`Failed to load file: ${error.message}`);
          }
        };
        reader.readAsText(file);
      }
      document.body.removeChild(input);
    };
    document.body.appendChild(input);
    input.click();

    input.addEventListener('cancel', () => {
      document.body.removeChild(input);
    });
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
        <button className="save-action" onClick={() => handleSave(blocks)} disabled={!blocks || blocks.length === 0}>Save</button>
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
